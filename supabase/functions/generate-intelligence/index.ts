const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { location, city, lat, lng, radius } = await req.json();

    if (!location || !lat || !lng) {
      return new Response(
        JSON.stringify({ error: "location, lat, lng are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const locationDesc = city ? `${location} in ${city}` : location;
    const prompt = `You are a real estate intelligence analyst for India. Generate a comprehensive real estate intelligence report for the location: "${locationDesc}" (coordinates: ${lat}, ${lng}, radius: ${radius}km).

IMPORTANT RULES:
- All data must be realistic and location-specific
- Pricing must be in Indian Rupees (₹) per sft
- All metrics should reflect current Q1 2026 market conditions
- Infrastructure projects must be real and verifiable
- Developer names must be real companies active in that region
- Do NOT invent fake data - use reasonable estimates based on known market dynamics

Generate a JSON response with this EXACT structure:
{
  "executiveBrief": {
    "summary": "200-word market pulse summary specific to this location",
    "themes": [{"theme": "Theme title", "summary": "Description"}],
    "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3", "Takeaway 4"]
  },
  "residential": {
    "metrics": [{"metric": "Metric name", "value": "Current value", "change": "+X% YOY", "signal": "STRONG|RISING|HEALTHY|STEADY|WATCH"}],
    "segments": [{"segment": "Price bracket", "units": 500, "share": "20%", "yoyChange": "+10%"}],
    "insight": "Analyst commentary paragraph"
  },
  "commercial": {
    "markets": [{"subMarket": "Area name", "avgRent": "₹XX", "vacancy": "X.X%", "absorption": "+XX%", "signal": "STRONG|RISING|STEADY|BREAKOUT|WATCH"}],
    "insight": "Commercial market commentary"
  },
  "infrastructure": {
    "projects": [{"project": "Project name", "status": "Current status", "impact": "Impact description", "priceLift": "+XX-XX%", "timeline": "XX months", "confidence": "HIGH|MEDIUM|LOW"}],
    "correlations": [{"project": "Name", "corridors": "Impacted areas", "lift": "+XX%", "timeline": "XXm", "confidence": "High|Medium|Low"}]
  },
  "developers": {
    "trackers": [{"developer": "Company name", "latestMove": "Recent activity", "score": 85, "signal": "BULLISH|STRONG|MONITOR|WATCH|STEADY|INTEL"}],
    "insight": "Developer activity commentary"
  },
  "investors": {
    "deals": [{"title": "Deal title", "details": "Deal description", "icon": "💰"}],
    "insight": "Investment outlook paragraph"
  },
  "regulatory": {
    "signals": [{"signal": "Signal name", "currentValue": "Value", "whatToWatch": "Explanation"}],
    "insight": "Regulatory intelligence paragraph"
  },
  "emerging": {
    "signals": [{"title": "Signal title", "description": "Description", "patternMatch": "Historical pattern", "implication": "What it means", "nextAction": "Recommended action", "confidence": "LOW|MEDIUM"}]
  },
  "deepDive": {
    "title": "Deep dive article title about this location",
    "subtitle": "Subtitle",
    "content": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"],
    "scores": [{"category": "Infrastructure", "score": 8.5}, {"category": "Developer Conviction", "score": 8.0}, {"category": "Demand Fundamentals", "score": 7.5}, {"category": "Risk-Reward", "score": 7.8}],
    "verdict": "Final verdict paragraph"
  },
  "landIntel": {
    "deals": [{"developer": "Company", "location": "Area", "sizeAcres": "XX", "estValueCr": "XX", "verified": "Source", "status": "CONFIRMED|INFERRED|MONITORING|INTEL"}],
    "trends": [{"corridor": "Area name", "rate": "₹XXX-XXX/sft", "vsLastYear": "+XX%", "vs2YearsAgo": "+XX%"}]
  },
  "pricing": {
    "markets": [{"name": "Micro-market name", "avgPsf": 7500, "yoyChange": 15, "cmi": 8.2}]
  }
}

Provide 3-5 items for each array. Make all data specific to the ${radius}km radius around ${locationDesc}. Use real area names, real developer names active in that region, and realistic pricing.`;

    const response = await fetch("https://ai-gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a real estate intelligence analyst. Always respond with valid JSON only, no markdown formatting." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: `AI Gateway error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from the response (may be wrapped in ```json blocks)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", content.slice(0, 500));
      return new Response(
        JSON.stringify({ error: "Failed to parse intelligence data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add metadata
    parsed.generatedAt = new Date().toISOString();
    parsed.location = locationDesc;

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
