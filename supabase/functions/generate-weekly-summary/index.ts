import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const requestSchema = z.object({
  weekStart: z.string().optional(),
  weekEnd: z.string().optional()
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation error:", validation.error.errors);
      return new Response(
        JSON.stringify({ error: validation.error.errors[0].message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let { weekStart, weekEnd } = validation.data;
    
    if (!weekStart || !weekEnd) {
      return new Response(
        JSON.stringify({ error: "weekStart and weekEnd are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader! } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating weekly summary for ${user.id} from ${weekStart} to ${weekEnd}`);

    // Fetch entries for the specified week
    const { data: entries, error: entriesError } = await supabase
      .from('journal_entries')
      .select('content, created_at')
      .gte('created_at', weekStart)
      .lte('created_at', weekEnd)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (entriesError) {
      console.error("Error fetching entries:", entriesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch entries" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no entries found for the requested week, try current week for new users
    if (!entries || entries.length === 0) {
      console.log("No entries found for last week, checking current week...");
      
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);
      
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
      currentWeekEnd.setHours(23, 59, 59, 999);

      const { data: currentEntries, error: currentError } = await supabase
        .from('journal_entries')
        .select('content, created_at')
        .gte('created_at', currentWeekStart.toISOString())
        .lte('created_at', currentWeekEnd.toISOString())
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (currentError) {
        console.error("Error fetching current week entries:", currentError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch entries" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!currentEntries || currentEntries.length === 0) {
        return new Response(
          JSON.stringify({ error: "No entries found. Create at least one journal entry to generate a summary." }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Use current week's entries and dates
      entries.push(...currentEntries);
      weekStart = currentWeekStart.toISOString();
      weekEnd = currentWeekEnd.toISOString();
      
      console.log(`Using current week instead: ${weekStart} to ${weekEnd} with ${entries.length} entries`);
    }

    // Fetch emotional analysis for the week
    const { data: emotions, error: emotionsError } = await supabase
      .from('emotional_analysis')
      .select('dominant_emotion, sentiment_score, created_at')
      .gte('created_at', weekStart)
      .lte('created_at', weekEnd)
      .eq('user_id', user.id);

    // Fetch biases for the week
    const { data: biases, error: biasesError } = await supabase
      .from('cognitive_biases')
      .select('bias_type, excerpt')
      .gte('created_at', weekStart)
      .lte('created_at', weekEnd)
      .eq('user_id', user.id);

    const summaryPrompt = `Create a personalized weekly summary called "You in 7 Days" based on these journal entries and emotional data.

Journal Entries (${entries.length} total):
${entries.map((e, i) => `Entry ${i + 1} (${new Date(e.created_at).toLocaleDateString()}): ${e.content}`).join('\n\n')}

Emotional Data:
${emotions && emotions.length > 0 ? emotions.map(e => `- ${e.dominant_emotion} (sentiment: ${e.sentiment_score})`).join('\n') : 'No emotional data available'}

Cognitive Biases Detected:
${biases && biases.length > 0 ? biases.map(b => `- ${b.bias_type}: "${b.excerpt}"`).join('\n') : 'No significant biases detected'}

Create a conversational, empathetic summary that:
1. Highlights the dominant emotions and recurring themes from the week
2. Identifies behavioral patterns
3. Notes any cognitive biases with specific examples
4. Offers insights into emotional progression
5. Ends with encouragement for continued self-awareness

Return ONLY a JSON object with this structure:
{
  "summary": "The full narrative summary (3-4 paragraphs)",
  "dominant_emotions": ["emotion1", "emotion2", "emotion3"],
  "recurring_themes": ["theme1", "theme2", "theme3"],
  "behavioral_patterns": ["pattern1", "pattern2"]
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a compassionate therapist creating personalized weekly summaries. Be warm, insightful, and encouraging. Always return valid JSON." },
          { role: "user", content: summaryPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate summary" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const summaryText = aiData.choices[0].message.content;

    let summary;
    try {
      const jsonMatch = summaryText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       summaryText.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : summaryText;
      summary = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("Failed to parse summary:", summaryText);
      summary = {
        summary: summaryText,
        dominant_emotions: [],
        recurring_themes: [],
        behavioral_patterns: []
      };
    }

    // Store weekly summary
    const { error: insertError } = await supabase
      .from('weekly_summaries')
      .insert({
        user_id: user.id,
        week_start: weekStart,
        week_end: weekEnd,
        summary: summary.summary,
        dominant_emotions: summary.dominant_emotions,
        recurring_themes: summary.recurring_themes,
        behavioral_patterns: summary.behavioral_patterns,
      });

    if (insertError) {
      console.error("Error storing summary:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store summary" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Weekly summary generated successfully for user ${user.id}`);

    return new Response(
      JSON.stringify({ success: true, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in generate-weekly-summary:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
