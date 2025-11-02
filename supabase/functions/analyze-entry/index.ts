import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { entryId, content } = await req.json();
    
    if (!entryId || !content) {
      return new Response(
        JSON.stringify({ error: "entryId and content are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user ID from auth
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

    console.log(`Analyzing entry ${entryId} for user ${user.id}`);

    // Call Lovable AI for sentiment analysis and bias detection
    const analysisPrompt = `Analyze the following journal entry for:
1. Sentiment score (-1.00 to 1.00, where -1 is very negative, 0 is neutral, 1 is very positive)
2. Emotional valence (positive, negative, neutral, or mixed)
3. Dominant emotion (joy, sadness, anger, fear, anxiety, contentment, frustration, hope, etc.)
4. Confidence score (0.00 to 1.00)
5. Cognitive biases present (catastrophizing, black_white_thinking, emotional_reasoning, fortune_telling, overgeneralization)

For each bias detected, provide:
- The exact excerpt showing the bias
- A brief explanation
- Confidence score (0.00 to 1.00)

Journal entry:
"${content}"

Return ONLY a valid JSON object with this structure:
{
  "sentiment_score": number,
  "emotional_valence": string,
  "dominant_emotion": string,
  "confidence_score": number,
  "biases": [
    {
      "bias_type": string,
      "excerpt": string,
      "explanation": string,
      "confidence_score": number
    }
  ]
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
          { role: "system", content: "You are an expert psychologist specializing in sentiment analysis and cognitive bias detection. Always return valid JSON." },
          { role: "user", content: analysisPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const analysisText = aiData.choices[0].message.content;
    
    // Parse AI response
    let analysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       analysisText.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : analysisText;
      analysis = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", analysisText);
      // Fallback analysis
      analysis = {
        sentiment_score: 0,
        emotional_valence: "neutral",
        dominant_emotion: "unknown",
        confidence_score: 0.5,
        biases: []
      };
    }

    // Store emotional analysis
    const { error: emotionalError } = await supabase
      .from('emotional_analysis')
      .insert({
        entry_id: entryId,
        user_id: user.id,
        sentiment_score: analysis.sentiment_score,
        emotional_valence: analysis.emotional_valence,
        dominant_emotion: analysis.dominant_emotion,
        confidence_score: analysis.confidence_score,
      });

    if (emotionalError) {
      console.error("Error storing emotional analysis:", emotionalError);
    }

    // Store cognitive biases
    if (analysis.biases && analysis.biases.length > 0) {
      const biasRecords = analysis.biases.map((bias: any) => ({
        entry_id: entryId,
        user_id: user.id,
        bias_type: bias.bias_type,
        excerpt: bias.excerpt,
        explanation: bias.explanation,
        confidence_score: bias.confidence_score,
      }));

      const { error: biasError } = await supabase
        .from('cognitive_biases')
        .insert(biasRecords);

      if (biasError) {
        console.error("Error storing cognitive biases:", biasError);
      }
    }

    console.log(`Analysis complete for entry ${entryId}`);

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in analyze-entry:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
