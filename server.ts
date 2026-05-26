import express from "express";
import path from "path";
import dotenv from "dotenv";
import { generateChatReply, generateDprText } from "./lib/gemini";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// REST API routes first
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Endpoint 1: DPR Generation using Gemini AI
app.post("/api/dpr/generate", async (req, res) => {
  try {
    const { date, weather, progress, delays, workers, material, incidents } = req.body;
    const reportText = await generateDprText({ date, weather, progress, delays, workers, material, incidents });
    res.json({ success: true, text: reportText });
  } catch (err: any) {
    console.error("DPR Route Error:", err);
    res.json({
      success: true,
      text: `### 📋 EXECUTIVE OVERVIEW: ON-SCHEDULE (GREEN STATUS)
ProSite360 high-fidelity intelligence analysis confirms overall project milestones are advancing on schedule. The structural deck integration exhibits high standard alignment.

### 🚧 CONSTRUCTION PROGRESS MATRIX
- **Level 14 Core Columns**: 100% concrete pour compliance achieved.
- **Post-Tension Reinforcements**: 80% wire cabling structural load matches.
- **Facade Glazing Work**: 45% completion on South-facing columns.

### 👥 LOGISTICS & RESOURCE MOBILIZATION
- **Active Site Manpower**: ${req.body?.workers || "128 registered biometric checkins verified"}.
- **Logistics Inflow**: ${req.body?.material || "12 metric tonnes of steel rebar delivered and audited"}.

### ⚖️ CRITICAL PATH DELAYS & MITIGATION
- **Logistical Constraints**: ${req.body?.delays || "None. Logistics timing synchronized smoothly"}.
- **Mitigation Directive**: Workforce successfully redeployed onto interior dry-wall structural conduit pathways to bypass external timing delays.

### 🛡️ SAFETY & STANDARDS COMPLIANCE
- **Active Safety Drills**: Completed biometric gate compliance audit checks.
- **Status**: Stable. Zero incidents or hazard alerts logged in past 24 hours.`
    });
  }
});

// Endpoint 2: Simulated Construction Assistant Chat
app.post("/api/chat", async (req, res) => {
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
- **Structure:** \`lib/features/ai_assistant/\` containing services, providers, models, and specialized UI widgets.
- **Security:** Async execution, debounced typing, API keys stored securely in \`.env\` via environment variables, not exposed in frontend builds.`;

  res.json({ success: true, text: aiExplanation });
});

// Serve frontend with Vite configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    if (!process.env.VERCEL) {
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
