export default async function handler(req: any, res: any) {
  try {
    const aiExplanation = `**ProSite360 AI Assistant Architecture & Workflow**

Integrating a SIMPLE but powerful AI Assistant system into the existing ProSite360 Flutter + Supabase application WITHOUT disturbing any current functionality, UI, architecture, database structure, providers, navigation, or existing business logic.

This is a lightweight AI productivity layer similar to Copilot suggestions, providing smart autofill, AI-generated summaries, and context-aware suggestions while preserving the current app workflow.

### 1. AI DPR ASSISTANT
Inside the DPR creation screen, when an engineer types work completed, labour updates, or material usage, the AI generates professional DPR summaries, sentence completion suggestions, and formatted engineering language. You can accept or reject suggestion chips instantly.

### 2. AI SMART TYPING SUGGESTIONS
Lightweight Copilot-style suggestions appear while typing notes, engineer updates, remarks, or comments. It suggests sentence completion, professional wording, and site terminology via non-intrusive UI chips without auto-overwriting user input.

### 3. AI SITE UPDATE GENERATOR
When an engineer uploads photos, videos, or progress updates, the AI automatically generates professional update captions, progress descriptions, and milestone summaries.

### 4. AI EXPENSE INSIGHTS
Analyzes expenses and generates lightweight insights (e.g., unusual material spending, labour cost spikes, budget warnings) displayed via AI Insight Cards on the financial dashboards.

### 5. AI CLIENT Q&A ASSISTANT
A simple AI chatbot inside the client dashboard. Clients can ask questions like "What is current project progress?" or "Any delays?" The AI answers accurately using existing Supabase project data, DPR reports, and milestone statuses as context.

### 6. AI RISK ALERTS
Lightweight AI-based project alerts that detect delayed milestones, low workforce, budget overruns, or inactivity, displayed as warning banners and dashboard AI insights.

### 7. AI MEETING SUMMARY GENERATOR
Takes meeting notes or voice transcript text input and automatically generates concise summaries, action items, and pending tasks.

---
**Tech Stack & Architecture:**
- **Frontend:** Flutter, Riverpod
- **Backend:** Supabase, OpenAI Chat Completions API
- **Structure:** \`lib/features/ai_assistant/\` containing services, providers, models, and specialized UI widgets (suggestion chips, chat widget, insight cards).
- **Security:** Async execution, debounced typing, API keys stored securely in \`.env\` via environment variables, not exposed in frontend builds.`;

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, text: aiExplanation }));
  } catch (error: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Server Error" }));
  }
}
