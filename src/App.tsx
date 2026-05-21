import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Zap,
  MapPin,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Plus,
  Compass,
  DollarSign,
  Upload,
  Clock,
  ShieldCheck,
  Users,
  Activity as ActivityIcon,
  MessageSquare,
  HelpCircle,
  Eye,
  Check,
  Building,
  Sliders,
  ChevronRight,
  MonitorCheck,
  RefreshCw
} from "lucide-react";
import CityScene from "./components/CityScene";
import RoleWheel from "./components/RoleWheel";
import ChatVisualization from "./components/ChatVisualization";
import CursorScrollerScene from "./components/CursorScrollerScene";
import AnimatedBackground from "./components/AnimatedBackground";
import CinematicStorytelling from "./components/CinematicStorytelling";
import { ConstructionMedia, Activity, ProjectLogInput, LabourMetric, FinanceSummary } from "./types";

// Static premium mock presets to keep the interface highly structured and real from startup
const INITIAL_ACTIVITIES: Activity[] = [
  { id: "act-1", taskName: "Excavation & Shoring Phase B", zone: "Zone 5 (Underpass)", completion: 100, status: "Completed", assignee: "V. Sharma (Lead Eng.)" },
  { id: "act-2", taskName: "Concrete Pour: Core Column C3", zone: "Level 14 Floorplate", completion: 65, status: "Active", assignee: "K. Reddy (Super)" },
  { id: "act-3", taskName: "Post-Tension Reinforcement Tensioning", zone: "Level 12 South Deck", completion: 40, status: "Active", assignee: "A. Chaurasia" },
  { id: "act-4", taskName: "Tower Crane 1 Grouting Validation", zone: "Crane Assembly Deck", completion: 0, status: "Planning", assignee: "S. Murthy" },
  { id: "act-5", taskName: "Facade Glazing Structural Load Validation", zone: "Level 4-9 South Facing", completion: 12, status: "Active", assignee: "R. Sengupta" },
  { id: "act-6", taskName: "Site Sewage Core Plumbing Conduit Integration", zone: "Basement Level 2", completion: 0, status: "On Hold", assignee: "P. Deshmukh" }
];

const INITIAL_MEDIA_LOGS: ConstructionMedia[] = [
  {
    id: "media-1",
    timestamp: "May 21, 2026 - 08:30 AM",
    latitude: 12.9716,
    longitude: 77.5946,
    locationName: "Core Tower Plate, Bengaluru Center",
    tag: "STRUCTURAL",
    mediaUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop",
    user: "E. Fernandez (Civil Inspector)",
    description: "Rebar mesh compliance assessment conducted prior to pour. Full conformity verified.",
    safetyRating: "Passed"
  },
  {
    id: "media-2",
    timestamp: "May 21, 2026 - 11:15 AM",
    latitude: 12.9723,
    longitude: 77.5952,
    locationName: "Basement Ramp, Segment 3",
    tag: "LOGISTICS",
    mediaUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
    user: "M. Das (Site Supervisor)",
    description: "Temporary scaffolding scaffolding structure cleared safety audit checks for heavy trucks entry.",
    safetyRating: "Passed"
  }
];

const PRESET_DPR_TEMPLATES = [
  {
    name: "High-Rise Wind Stall",
    weather: "High Gusty Winds, 38km/h, scattered drizzle",
    progress: "Tower Crane 1 operations suspended at 14:00. Poured 140 cubic meters of M40 Grade Concrete on Sector 4 columns.",
    delays: "Craning operation stopped due to safety limits (sustained gust thresholds exceeded). Glazing team redeployed to interior ducting.",
    workers: "185 Skilled, 12 Supervisors, 2 Civil Consultants active.",
    material: "Expended 12 MT Structural TMT Rebar Steel, 420 Bags Portland slag cement.",
    incidents: "High elevation wind alert flagged by Core Crane Anemometer at 13:42. Crane boomed down securely. Zero injuries logged."
  },
  {
    name: "Standard Concrete Pour Flight",
    weather: "Clear Skies, 29°C, stable barometric telemetry",
    progress: "Completed Level 14 perimeter beam reinforcement. Post tension wires running at optimal load vectors.",
    delays: "None. Logistics timing synchronized smoothly.",
    workers: "240 Heavy Labour, 15 Inspectors, 4 QC specialists.",
    material: "Pre-mix concrete dispatch logs validated - 52 Heavy Mixer trucks unloaded successfully.",
    incidents: "Sustained site safety drills conducted between 08:00 - 08:45. Zero standard omissions."
  }
];

export default function App() {
  // Application State
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [mediaLogs, setMediaLogs] = useState<ConstructionMedia[]>(INITIAL_MEDIA_LOGS);
  
  // Scanned personnel simulation
  const [personnelCount, setPersonnelCount] = useState(1208);
  const [recentScan, setRecentScan] = useState<string | null>(null);

  // Field media upload form
  const [dragActive, setDragActive] = useState(false);
  const [photoDescription, setPhotoDescription] = useState("");
  const [photoTag, setPhotoTag] = useState("STRUCTURAL");
  const [safetyRating, setSafetyRating] = useState<"Passed" | "Cautioned">("Passed");
  const [customPhotoFile, setCustomPhotoFile] = useState<string | null>(null);

  // DPR formulation variables
  const [dprInput, setDprInput] = useState<ProjectLogInput>({
    date: new Date().toISOString().split("T")[0],
    weather: "Overcast skies, 28°C, humidity 64%",
    progress: "Core column structural concrete poured for level 14 zone. Level 11 cabling verified.",
    delays: "Concrete mixer truck delayed by traffic on Outer Ring Road (approx 45 minutes deviation).",
    workers: "128 skilled operatives, 14 supervisors, 3 safety auditors.",
    material: "M40 pre-mix cement flow bounds matched. Reinforcement steel bolts checked.",
    incidents: "Zero physical incidents. Minor voltage load surge recorded on generator deck 4."
  });
  const [builtDprReport, setBuiltDprReport] = useState<string | null>(null);
  const [generatingDpr, setGeneratingDpr] = useState(false);

  // Razorpay payment simulation
  const [finance, setFinance] = useState<FinanceSummary>({
    budgetAllocated: 154000000, // INR
    amountExpended: 64120900,
    committedLiabilities: 12400000,
    razorpayLinked: true,
    transactions: [
      { id: "TXN-902", description: "Ultratech Cement ReadyMix supply block 4", amount: 480000, type: "debit", timestamp: "Today - 09:12 AM", category: "Materials" },
      { id: "TXN-901", description: "Weekly Labour compensation (Roll A)", amount: 1450000, type: "debit", timestamp: "Yesterday", category: "Labour Payroll" },
      { id: "TXN-900", description: "Escrow fund release milestone clearing", amount: 15000000, type: "credit", timestamp: "3 days ago", category: "Milestone Milestone Clear" }
    ]
  });
  const [payingTxnId, setPayingTxnId] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<"idle" | "gateway" | "processing" | "success">("idle");
  const [paymentSuccessTx, setPaymentSuccessTx] = useState("");

  // Demo user feedback
  const [demoEnroll, setDemoEnroll] = useState(false);
  const [demoInput, setDemoInput] = useState({ name: "", email: "", scale: "Medium Enterprise" });

  // Custom alert dispatch console
  const [alertFeed, setAlertFeed] = useState<string[]>([
    "CRITICAL CAP: Tower Crane 1 wind warning threshold set at 40 km/h.",
    "FINANCIAL CAP: ESCROW transaction validation secure.",
    "SYSTEM: Core telemetry sync established."
  ]);
  const [newAlertText, setNewAlertText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scrolling logs without scrolling the parent viewport
  const alertsScrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (alertsScrollContainerRef.current) {
      alertsScrollContainerRef.current.scrollTo({
        top: alertsScrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [alertFeed]);

  // Smooth scroll helper to navigate on-click
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Biometric ID card scanning generator simulation
  const triggerBiometricScan = () => {
    const names = [
      "Amritpal Singh (Steel Fixer)",
      "V. Raghavan (Concrete Inspector)",
      "P. Subramanian (Safety Auditor)",
      "Jennifer L. (Facade Specialist)",
      "Daniel Craig (Heavy Operator)",
      "Manpreet Kaur (Junior Civil)"
    ];
    const picked = names[Math.floor(Math.random() * names.length)];
    const scannerDeviceName = `BIO_GATE_0${Math.floor(Math.random() * 4) + 1}`;
    setPersonnelCount((prev) => prev + 1);
    setRecentScan(`${picked} checked into ${scannerDeviceName}`);
    
    // Add transaction to alert logs
    setAlertFeed((prev) => [
      ...prev,
      `SECURE CHECK-IN: ${picked} registered at ${scannerDeviceName} (Biometric confirmed)`
    ]);

    setTimeout(() => {
      setRecentScan(null);
    }, 4500);
  };

  // Pre-load DPR preset values
  const loadPresetDpr = (presetIdx: number) => {
    const p = PRESET_DPR_TEMPLATES[presetIdx];
    setDprInput((prev) => ({
      ...prev,
      weather: p.weather,
      progress: p.progress,
      delays: p.delays,
      workers: p.workers,
      material: p.material,
      incidents: p.incidents
    }));
    
    setAlertFeed((prev) => [
      ...prev,
      `DPR STATE PRESET: Loaded template data for '${p.name}' into raw compiler buffer.`
    ]);
  };

  // Requesting Gemini to generate Daily Progress Report
  const triggerDprAICompile = async () => {
    setGeneratingDpr(true);
    setBuiltDprReport(null);
    try {
      const res = await fetch("/api/dpr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dprInput)
      });
      if (!res.ok) throw new Error("HTTP connection threshold breakdown");
      const data = await res.json();
      if (data.success && data.text) {
        setBuiltDprReport(data.text);
        setAlertFeed((prev) => [
          ...prev,
          "AI LOGISTICS COMPILE: Daily Progress Report compiled securely via Gemini AI."
        ]);
      } else {
        throw new Error(data.error || "Generation mismatch from Gemini API");
      }
    } catch (e: any) {
      console.error(e);
      // Fallback elegant client side summary if API key is not mapped
      const mockResultText = `### 📋 EXECUTIVE OVERVIEW (STAGED DEMO FEEDBACK)
The reporting system is operating in high-fidelity demonstration compliance because a production API Secret was not registered. Overall project state remains on schedule **(GREEN STATUS)**.

### 🚧 CONSTRUCTION PROGRESS MATRIX
- **Steel Truss Integration**: 94% complete on main Level 14 core block.
- **Biometric Enrolments**: ${personnelCount} registered workers present on site today.
- **Concrete Flow Assessment**: 42 mixers checked in and verified successfully.

### 👥 LOGISTICS & RESOURCE MOBILIZATION
- **Workforce efficiency rating**: Pushing solid at high 92% output.
- **Raw Field Logs**: ${dprInput.progress}
- **Logistics delays recorded**: ${dprInput.delays}

### ⚖️ CRITICAL PATH DELAYS & MITIGATION
*Recommended AI Operational Directive*: Deploy structural installers onto indoor conduits to bypass outdoor logistical restrictions.

*Disclaimer: Ground credentials not discovered on server environment. Configure 'GEMINI_API_KEY' in your settings to unlock deep semantic models.*`;
      setBuiltDprReport(mockResultText);
      setAlertFeed((prev) => [
        ...prev,
        "AI CAPABILITY COMPILE: Fallback high-fidelity operational DPR synthesized locally."
      ]);
    } finally {
      setGeneratingDpr(false);
    }
  };

  // Drag and drop photo loader state helpers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPhotoFile(reader.result as string);
        setAlertFeed((prev) => [
          ...prev,
          `FILE UPLOAD: Received image '${file.name}' (${Math.round(file.size / 1024)} KB) via viewport drag & drop.`
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Standard input file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPhotoFile(reader.result as string);
        setAlertFeed((prev) => [
          ...prev,
          `FILE UPLOAD: Uploaded file '${file.name}' via local file selector.`
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Push new photo into the feed
  const commitFieldMedia = () => {
    const latOffset = (Math.random() - 0.5) * 0.002;
    const lngOffset = (Math.random() - 0.5) * 0.002;
    const newMedia: ConstructionMedia = {
      id: `media-${Date.now()}`,
      timestamp: `Today - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      latitude: Number((12.9716 + latOffset).toFixed(4)),
      longitude: Number((77.5946 + lngOffset).toFixed(4)),
      locationName: `Site Sector Plate ST-${Math.floor(Math.random() * 8) + 1}`,
      tag: photoTag,
      mediaUrl: customPhotoFile || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop",
      user: "Vasu Nakka (HQ Administrator)",
      description: photoDescription || "Manual field media entry. Verified scaffolding alignment and structural columns stability under load.",
      safetyRating: safetyRating
    };

    setMediaLogs((prev) => [newMedia, ...prev]);
    // reset form
    setPhotoDescription("");
    setCustomPhotoFile(null);
    setAlertFeed((prev) => [
      ...prev,
      `GEO-TAG CONSTRAINTS: Generated live GPS coordinates at ${newMedia.latitude}°N, ${newMedia.longitude}°E.`
    ]);
  };

  // Activity Status cycle: Completed -> On Hold -> Planning -> Active -> Completed
  const cycleActivityStatus = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        let nextStatus: "Completed" | "Active" | "On Hold" | "Planning" = "Active";
        let nextComp = a.completion;

        if (a.status === "Active") {
          nextStatus = "Completed";
          nextComp = 100;
        } else if (a.status === "Completed") {
          nextStatus = "On Hold";
          nextComp = a.completion === 100 ? 50 : a.completion;
        } else if (a.status === "On Hold") {
          nextStatus = "Planning";
          nextComp = 0;
        } else {
          nextStatus = "Active";
          nextComp = 25;
        }

        setAlertFeed((v) => [
          ...v,
          `STATE TRANSITION: '${a.taskName}' shifted status to [${nextStatus.toUpperCase()}]`
        ]);

        return { ...a, status: nextStatus, completion: nextComp };
      })
    );
  };

  // Helper to convert report markdown to beautifully formatted print HTML
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return "";
    
    // Replace headers
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3 style="color:#7C3AED; font-family:\'Outfit\', sans-serif; font-size:16px; margin-top:20px; border-bottom:1px solid #e2e8f0; padding-bottom:6px; font-weight:bold;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="color:#00E5FF; font-family:\'Outfit\', sans-serif; font-size:20px; margin-top:24px; font-weight:bold;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="color:#111827; font-family:\'Outfit\', sans-serif; font-size:24px; margin-bottom:16px; font-weight:black;">$1</h1>');
      
    // Replace bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace lists
    html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li style="margin-bottom:6px; list-style-type:square; margin-left:20px; font-size:13px; color:#374151;">$1</li>');
    
    // Replace line breaks and wrap plain paragraphs
    html = html.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<div style="height:8px;"></div>';
      if (!trimmed.startsWith('<h') && !trimmed.startsWith('<li') && !trimmed.startsWith('<div') && !trimmed.startsWith('<strong')) {
        return `<p style="margin: 4px 0; font-size:13px; color:#374151; font-family:\'Inter\', sans-serif;">${trimmed}</p>`;
      }
      return line;
    }).join('\n');
    
    return html;
  };

  // Triggers client-side styled print dialog generating a flawless premium PDF
  const downloadDprPdf = () => {
    if (!builtDprReport) return;
    
    const reportHtml = convertMarkdownToHtml(builtDprReport);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>PROSITE360 - Daily Progress Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@500&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1f2937;
              line-height: 1.6;
              margin: 0;
              padding: 40px;
              background-color: #ffffff;
            }
            .header-container {
              border-bottom: 2px solid #7C3AED;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .logo-area {
              font-family: 'Outfit', sans-serif;
              font-size: 26px;
              font-weight: 800;
              color: #111827;
              letter-spacing: -0.5px;
            }
            .logo-highlight {
              color: #7C3AED;
            }
            .doc-type {
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              color: #6b7280;
              text-align: right;
              letter-spacing: 1px;
            }
            .meta-grid {
              display: grid;
              grid-template-cols: repeat(2, 1fr);
              gap: 12px;
              background: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              margin-bottom: 30px;
              font-size: 12px;
            }
            .meta-item {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              border-bottom: 1px dashed #e5e7eb;
            }
            .meta-item:last-child, .meta-item:nth-last-child(2) {
              border-bottom: none;
            }
            .meta-label {
              font-family: 'JetBrains Mono', monospace;
              color: #6b7280;
              font-weight: bold;
            }
            .meta-value {
              font-weight: 600;
              color: #111827;
            }
            .content-area {
              font-size: 13px;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
              text-align: center;
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              color: #9ca3af;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="logo-area">
              PROSITE<span class="logo-highlight">360</span>
              <div style="font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #7C3AED; font-weight: normal; margin-top: 4px; letter-spacing: 2px;">
                AI CONSTRUCTION INTELLIGENCE
              </div>
            </div>
            <div class="doc-type">
              DOCUMENT: DAILY_PROGRESS_REPORT<br>
              SECURE LEDGER V3.0
            </div>
          </div>
          
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">REPORTING DATE</span>
              <span class="meta-value">${dprInput.date}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">WEATHER TELEMETRY</span>
              <span class="meta-value">${dprInput.weather}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">WORKFORCE ACTIVE</span>
              <span class="meta-value">${dprInput.workers ? dprInput.workers.split(',')[0] : 'None'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">ESCROW ACCOUNT</span>
              <span class="meta-value">₹15.40 CR ALLOCATED</span>
            </div>
          </div>
          
          <div class="content-area">
            ${reportHtml}
          </div>
          
          <div class="footer">
            PROSITE360 INTEL CORE SECURED • SECURE JWT INTEGRITY CERTIFIED • GENERATED ON ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `;

    // 1. Try modern hidden iframe printing first (highly sandbox-compatible, bypasses popup blocker)
    try {
      const existingFrame = document.getElementById("dpr-print-iframe");
      if (existingFrame) {
        existingFrame.remove();
      }

      const iframe = document.createElement("iframe");
      iframe.id = "dpr-print-iframe";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        const iframeDoc = iframeWindow.document || iframeWindow.contentDocument;
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Let styles load, then focus and print
        setTimeout(() => {
          iframeWindow.focus();
          iframeWindow.print();
        }, 300);
        return;
      }
    } catch (iframeErr) {
      console.warn("Iframe print blocked/failed. Trying window.open fallback.", iframeErr);
    }

    // 2. Fallback to standard window.open method
    try {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent + `
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        `);
        printWindow.document.close();
        return;
      }
    } catch (windowErr) {
      console.warn("window.open print failed. Falling back to direct HTML download.", windowErr);
    }

    // 3. Ultimate Fallback: Download file directly
    downloadDprHtmlFile();
  };

  // Helper to download raw report as standalone HTML file (excellent for sandboxes)
  const downloadDprHtmlFile = () => {
    if (!builtDprReport) return;
    
    const reportHtml = convertMarkdownToHtml(builtDprReport);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>PROSITE360 - Daily Progress Report - ${dprInput.date}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@500&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1f2937;
              line-height: 1.6;
              margin: 0;
              padding: 40px;
              background-color: #ffffff;
            }
            .header-container {
              border-bottom: 2px solid #7C3AED;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .logo-area {
              font-family: 'Outfit', sans-serif;
              font-size: 26px;
              font-weight: 800;
              color: #111827;
              letter-spacing: -0.5px;
            }
            .logo-highlight {
              color: #7C3AED;
            }
            .doc-type {
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              color: #6b7280;
              text-align: right;
              letter-spacing: 1px;
            }
            .meta-grid {
              display: grid;
              grid-template-cols: repeat(2, 1fr);
              gap: 12px;
              background: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              margin-bottom: 30px;
              font-size: 12px;
            }
            .meta-item {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              border-bottom: 1px dashed #e5e7eb;
            }
            .meta-item:last-child, .meta-item:nth-last-child(2) {
              border-bottom: none;
            }
            .meta-label {
              font-family: 'JetBrains Mono', monospace;
              color: #6b7280;
              font-weight: bold;
            }
            .meta-value {
              font-weight: 600;
              color: #111827;
            }
            .content-area {
              font-size: 13px;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
              text-align: center;
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              color: #9ca3af;
            }
            .print-btn {
              position: fixed;
              bottom: 20px;
              right: 20px;
              background-color: #7C3AED;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 8px;
              font-family: 'Outfit', sans-serif;
              font-weight: bold;
              font-size: 14px;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(124, 90, 237, 0.4);
              transition: all 0.2s;
            }
            .print-btn:hover {
              background-color: #6D28D9;
              transform: translateY(-2px);
            }
            @media print {
              body { padding: 20px; }
              .print-btn { display: none; }
            }
          </style>
        </head>
        <body>
          <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
          
          <div class="header-container">
            <div class="logo-area">
              PROSITE<span class="logo-highlight">360</span>
              <div style="font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #7C3AED; font-weight: normal; margin-top: 4px; letter-spacing: 2px;">
                AI CONSTRUCTION INTELLIGENCE
              </div>
            </div>
            <div class="doc-type">
              DOCUMENT: DAILY_PROGRESS_REPORT<br>
              SECURE LEDGER V3.0
            </div>
          </div>
          
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">REPORTING DATE</span>
              <span class="meta-value">${dprInput.date}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">WEATHER TELEMETRY</span>
              <span class="meta-value">${dprInput.weather}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">WORKFORCE ACTIVE</span>
              <span class="meta-value">${dprInput.workers ? dprInput.workers.split(',')[0] : 'None'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">ESCROW ACCOUNT</span>
              <span class="meta-value">₹15.40 CR ALLOCATED</span>
            </div>
          </div>
          
          <div class="content-area">
            ${reportHtml}
          </div>
          
          <div class="footer">
            PROSITE360 INTEL CORE SECURED • SECURE JWT INTEGRITY CERTIFIED • GENERATED ON ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Daily_Progress_Report_${dprInput.date}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setAlertFeed((prev) => [
      ...prev,
      `OFFLINE LEDGER EXPORT: Saved high-fidelity print report Daily_Progress_Report_${dprInput.date}.html to device downloads.`
    ]);
  };



  // Launch Razorpay Simulator Overlay
  const startRazorSim = (txnAmount: number, description: string) => {
    setPaymentSuccessTx(description);
    setPaymentStep("gateway");
  };

  const confirmRazorPayFlow = () => {
    setPaymentStep("processing");
    setTimeout(() => {
      setPaymentStep("success");
      // Add transaction to expenditures
      setFinance((prev) => {
        const debitSum = prev.amountExpended + 480000;
        return {
          ...prev,
          amountExpended: debitSum,
          transactions: [
            {
              id: `TXN-${Math.floor(Math.random() * 800) + 100}`,
              description: `RAZORPAY CLEARED: ${paymentSuccessTx}`,
              amount: 480000,
              type: "debit",
              timestamp: "Secured instant complete",
              category: "Logistics Razorpay"
            },
            ...prev.transactions
          ]
        };
      });

      setAlertFeed((prev) => [
        ...prev,
        `RAZORPAY LINK: Payment gateway confirmed success clearance of ₹4,80,000 for ${paymentSuccessTx}.`
      ]);
    }, 2000);
  };

  // Calculate project statistics for visual HUD
  const totalTasks = activities.length;
  const completedTasks = activities.filter((a) => a.status === "Completed").length;
  const avgCompletionOfActive = Math.round(
    activities.reduce((sum, a) => sum + a.completion, 0) / totalTasks
  );

  return (
    <div id="prosite360-app" className={`min-h-screen bg-[#050505] text-[#F8FAFC] font-sans relative overflow-x-hidden selection:bg-purple-900 selection:text-white transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      
      {/* Premium Animated Structural Scaffold Background */}
      <AnimatedBackground />

      {/* RAZORPAY GATEWAY MODAL OVERLAY */}
      {paymentStep !== "idle" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400" />
            
            {paymentStep === "gateway" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                    <span className="font-mono text-xs text-indigo-400 font-bold uppercase tracking-widest">Razorpay Node Integration</span>
                  </div>
                  <button onClick={() => setPaymentStep("idle")} className="glass-btn px-2.5 py-1 cursor-pointer rounded-lg text-zinc-400 hover:text-slate-100 font-mono text-[10px]">✕ ESC</button>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 mb-6">
                  <div className="text-[10px] text-zinc-500 font-mono">MERCHANT CITADEL</div>
                  <div className="text-lg font-bold text-slate-100 mb-2">PROSITE360 MULTI-SITE escrow</div>
                  <div className="h-px bg-zinc-800/50 my-2" />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-medium text-zinc-400">Secured clearing invoice</span>
                    <span className="text-xl font-mono text-white font-black">₹4,80,000.00</span>
                  </div>
                  <p className="text-[10px] text-purple-400 font-mono mt-2 truncate">For: {paymentSuccessTx}</p>
                </div>

                <div className="space-y-4">
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Razorpay Live Link Sandbox Authorized</span>
                  </div>

                  <button
                    onClick={confirmRazorPayFlow}
                    className="glass-btn-primary w-full py-3 text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-purple-900/10"
                  >
                    AUTHORIZE DISPATCH WITH RAZORPAY
                  </button>
                </div>
              </div>
            )}

            {paymentStep === "processing" && (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                  <CreditCard className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-slate-100">Synchronizing Escrow Nodes</h4>
                  <p className="text-xs text-zinc-500 font-mono mt-1">CONTACTING RAZORPAY GATEWAY... VERIFYING COGNITO STATE Keys</p>
                </div>
              </div>
            )}

            {paymentStep === "success" && (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Check className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-slate-100">Escrow Cleared Successfully</h4>
                  <p className="text-xs text-zinc-400 mt-2">
                    Transaction settled in real-time. Ledger state metrics updated below automatically.
                  </p>
                </div>
                <div className="bg-zinc-900 px-4 py-2.5 rounded-lg border border-white/5 w-full font-mono text-[10px] text-zinc-500 text-left space-y-1">
                  <div>TX_REF: RAZORPAY_8892_PRO360</div>
                  <div>DEBIT: ₹4,80,000.00</div>
                  <div>ESCROW CODE: UNIFIED_COMP_2026</div>
                </div>
                <button
                  onClick={() => setPaymentStep("idle")}
                  className="glass-btn w-full mt-2 py-2.5 text-white text-xs uppercase tracking-wider rounded-xl transition-colors font-semibold"
                >
                  DISMISS VIEWPORT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEMO DIALOG MODAL */}
      {demoEnroll && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-1 bg-[#00E5FF]" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                <span className="font-display font-bold text-slate-100 uppercase tracking-tight text-sm">Enterprise Proposal System</span>
              </div>
              <button onClick={() => setDemoEnroll(false)} className="glass-btn px-2.5 py-1 cursor-pointer rounded-lg text-zinc-400 hover:text-slate-100 font-mono text-[10px]">✕ CLOSE</button>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Connect your active corporate projects to our live BIM blueprints, real-time Razorpay accounting matrix, and automated Gemini reporting core.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setAlertFeed((prev) => [
                ...prev,
                `DEMO REQUESTED: Prospect verified. Email registered: ${demoInput.email || "guest@enterprise.com"}`
              ]);
              setDemoEnroll(false);
              alert("Your simulation credentials have been logged! Our enterprise infrastructure specialists will reach out via email immediately.");
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1.5 font-bold">Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="Vasu Nakka"
                  value={demoInput.name}
                  onChange={(e) => setDemoInput({ ...demoInput, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-slate-100 rounded-lg focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1.5 font-bold">Incorporate Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="vasuunakka@gmail.com"
                  value={demoInput.email}
                  onChange={(e) => setDemoInput({ ...demoInput, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-slate-100 rounded-lg focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1.5 font-bold">Operational Scope</label>
                <select
                  value={demoInput.scale}
                  onChange={(e) => setDemoInput({ ...demoInput, scale: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-slate-400 rounded-lg focus:outline-none focus:border-[#7C3AED]"
                >
                  <option>Medium Enterprise (3-8 Active Sites)</option>
                  <option>Mega Infrastructure Group (10+ High rise sites)</option>
                  <option>Governmental Public Body & Smart City</option>
                </select>
              </div>

              <button
                type="submit"
                className="glass-btn-primary w-full py-3 font-bold tracking-widest text-[#F8FAFC] uppercase rounded-xl cursor-pointer"
              >
                REQUEST SECURITY CAD AUDIT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="relative z-20 border-b border-white/5 bg-[#050505]/40 backdrop-blur-xl shrink-0 sticky top-0 transition-all">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:py-5">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group transition-all duration-300">
              <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#020202] p-1.5 transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                <img 
                  src="/logo.png" 
                  alt="ProSite360 Logo" 
                  className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]" 
                />
              </div>
              <div className="hidden lg:flex flex-col text-left font-mono text-[9px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                <span className="text-purple-400 font-bold uppercase tracking-widest text-[7.5px]">OS.V1</span>
                <span>SECURED CLOUD ENGINE</span>
              </div>
            </a>
          </div>

          {/* Nav items */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
            <a 
              href="#citadel-dismantle-section" 
              onClick={(e) => { e.preventDefault(); scrollToSection("citadel-dismantle-section"); }}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-ping" />
              Intelligence
            </a>
            <a 
              href="#labour-section" 
              onClick={(e) => { e.preventDefault(); scrollToSection("labour-section"); }}
              className="hover:text-white transition-colors"
            >
              Workforce
            </a>
            <a 
              href="#ai-dpr-section" 
              onClick={(e) => { e.preventDefault(); scrollToSection("ai-dpr-section"); }}
              className="hover:text-white transition-colors"
            >
              AI Reports
            </a>
            <a 
              href="#geotag-section" 
              onClick={(e) => { e.preventDefault(); scrollToSection("geotag-section"); }}
              className="hover:text-white transition-colors"
            >
              GPS Geotags
            </a>
            <a 
              href="#financial-section" 
              onClick={(e) => { e.preventDefault(); scrollToSection("financial-section"); }}
              className="hover:text-white transition-colors"
            >
              Razorpay Ledger
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDemoEnroll(true)}
              className="glass-btn-cyan px-4 py-2 text-[#00E5FF] text-xs font-bold uppercase tracking-widest rounded-lg cursor-pointer font-mono"
            >
              Request Demo
            </button>
            <div className="hidden sm:flex flex-col text-right font-mono text-[9px] text-zinc-500">
              <span>GPS SYNCED</span>
              <span className="text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* Interactive Citadel 3D Layer Showcase Centerpiece */}
      <div id="citadel-dismantle-section" className="max-w-7xl mx-auto px-6 pt-6 md:pt-10 relative z-10">
        <CinematicStorytelling />
      </div>

      {/* STORY FLOW CANVAS - SPLIT DESIGN GRID */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPARTMENT: STORYTELLING & PRODUCT POSITIONING */}
        <section className="lg:col-span-5 space-y-8 lg:sticky lg:top-[90px]">
          
          {/* Interactive Dynamic Interactive Badge Scanner (Live in column) */}
          <div id="labour-section" className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/5 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-xs text-zinc-300 font-bold uppercase tracking-widest">Biometric Check-In simulator</span>
              </div>
              <span className="font-mono text-[9px] text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20 uppercase">
                ACTIVE LABOUR METER
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-display font-black text-slate-100 tracking-tight">
                  {personnelCount}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">ACTIVE WORKERS LOGGED ON SITE</div>
              </div>
              
              <button
                onClick={triggerBiometricScan}
                className="glass-btn-primary px-3.5 py-2 active:scale-95 text-xs text-slate-100 font-mono font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-[#7C3AED]/10"
              >
                <span>SCAN ID BADGE</span>
                <UserCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
              </button>
            </div>

            {/* Simulated Live Scan Banner */}
            {recentScan ? (
              <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-xl flex items-center gap-2.5 animate-bounce">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <div className="text-[10.5px] text-slate-200 font-mono leading-tight">
                  <span className="text-emerald-400 font-bold lowercase tracking-wider block">ACCESS GRANTED</span>
                  {recentScan}
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-500 italic max-w-sm">
                *Clicking 'Scan ID Badge' simulates physical worker entry, immediately incrementing active counts in our database.
              </p>
            )}
          </div>

          {/* TELEMETRY ACTIVE CONSOLE STREAM log of activities */}
          <div className="bg-black/80 border border-white/5 rounded-2xl p-5 font-mono text-[11px] h-[190px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[9px] text-purple-400/70 select-none">
              CTRL LOGS
            </div>
            
            <div className="text-zinc-500 font-bold uppercase tracking-wider pb-1.5 border-b border-white/5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
              SYSTEM TELEMETRY CORE STREAM (LIVE)
            </div>

            <div ref={alertsScrollContainerRef} className="flex-1 overflow-y-auto space-y-1.5 pr-2 py-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {alertFeed.map((alert, idx) => (
                <div key={idx} className="text-zinc-400 leading-[1.3] truncate">
                  <span className="text-zinc-600 font-mono font-semibold">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>{" "}
                  {alert}
                </div>
              ))}
            </div>

            {/* Submit quick alert console trigger */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAlertText.trim()) return;
                setAlertFeed((prev) => [...prev, `OPERATOR DIRECTIVE: ${newAlertText}`]);
                setNewAlertText("");
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Pipeline directive..."
                value={newAlertText}
                onChange={(e) => setNewAlertText(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 text-[10px] text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="glass-btn text-[10px] text-[#00E5FF] px-2.5 rounded-lg active:scale-95 font-bold cursor-pointer"
              >
                PUSH
              </button>
            </form>
          </div>

          {/* Vector schematic city rotating block overlay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
              <span>VECTOR MODELVIEW CHOREOGRAPHY</span>
              <span>FOV: 45°</span>
            </div>
            <CityScene />
          </div>

          {/* Footer of the copy area: Trust logos */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold shrink-0">TRUSTED BY MEGASCALE DEVS</span>
            <div className="h-px bg-zinc-800 w-full" />
            <span className="font-display font-light text-sm italic text-zinc-400 shrink-0">Citadel India</span>
            <span className="font-display font-bold text-sm text-zinc-500 tracking-wider shrink-0">AstraGlobal</span>
          </div>

        </section>

        {/* RIGHT COMPARTMENT: OPERATIONAL CONTROL CENTERS OR SUB-MODULES */}
        <section className="lg:col-span-7 space-y-8">
          
          {/* SECTION 2 — REAL-TIME PROJECT INTELLIGENCE MATRIX */}
          <div id="pulse-section" className="glass-panel-heavy p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 blur-2xl pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="font-mono text-xs text-[#00E5FF] flex items-center gap-1.5 mb-1.5">
                  <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-pulse" />
                  CAPABILITY // 02
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                  Real-time Site Milestones & Tasks
                </h2>
              </div>
              
              <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 p-1 rounded-xl">
                <span className="font-mono text-[10px] text-zinc-400 px-2.5">
                  TASKS OUTCOME: <span className="text-emerald-400 font-bold">{completedTasks} of {totalTasks} Complete</span>
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              A dynamic visual ledger containing active structural milestones, assignments, and safety check statuses on the ground level. **Click any check tile** to cycle progress statuses and observe real-time recalculations.
            </p>

            {/* Milestone lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activities.map((act) => (
                <div
                  key={act.id}
                  id={`activity-card-${act.id}`}
                  onClick={() => cycleActivityStatus(act.id)}
                  className="bg-zinc-900/40 hover:bg-zinc-900/90 border border-white/5 p-4 rounded-xl transition-all duration-300 relative group cursor-pointer"
                >
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      act.status === "Completed" ? "bg-emerald-500" :
                      act.status === "Active" ? "bg-cyan-400 animate-pulse" :
                      act.status === "On Hold" ? "bg-amber-400" : "bg-zinc-500"
                    }`} />
                    <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase">
                      {act.status}
                    </span>
                  </div>

                  <div className="space-y-1 pr-14">
                    <h4 className="font-semibold text-xs text-slate-100 group-hover:text-purple-400 transition-colors truncate">
                      {act.taskName}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      ZONE: {act.zone}
                    </p>
                  </div>

                  {/* Progress Indicator Bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-zinc-500">ASSIGNEE: {act.assignee}</span>
                      <span className="text-zinc-300 font-bold">{act.completion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          act.status === "Completed" ? "bg-emerald-500" :
                          act.status === "Active" ? "bg-gradient-to-r from-[#7C3AED] to-[#00E5FF]" :
                          act.status === "On Hold" ? "bg-amber-500" : "bg-zinc-800"
                        }`}
                        style={{ width: `${act.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-zinc-500 text-[10px] mt-4 font-mono">
              *Interactive system. Status cycle path: Planning ➜ Active (25%) ➜ Completed (100%) ➜ On Hold (50%)
            </p>
          </div>

          {/* SECTION 8 — MULTI-ROLE ADAPTIVE WORKSPACE WHEEL */}
          <div className="glass-panel-heavy p-6 rounded-2xl relative overflow-hidden">
            <RoleWheel />
          </div>

        </section>
      </main>

      {/* SECTION 9 — INTERACTIVE CINEMATIC BLUEPRINTS & CURSOR FEED SCROLLER (FULL-WIDTH CENTERPIECE) */}
      <div id="scanner-section" className="relative z-10 max-w-7xl mx-auto px-6 py-6 md:py-12 w-full">
        <CursorScrollerScene />
      </div>

      {/* SUBSEQUENT SECTIONS (DECOMPRESSED SPACIOUS FULL-WIDTH FLOW) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 md:py-12 space-y-16 w-full animate-fade-in">
        
        {/* SECTION 4 — AI DPR INTEL ENGINE */}
        <div id="ai-dpr-section" className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#00E5FF]/5 blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-mono text-xs text-purple-400 flex items-center gap-1.5 mb-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                AUTOMATION SERVICE
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                AI-Powered DPR Automation Core
              </h2>
            </div>
            
            <span className="font-mono text-[9px] text-[#00E5FF] bg-zinc-900 border border-white/5 py-1 px-3 rounded-lg">
              SERVICE: GEMINI AI
            </span>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed mb-6">
            Gemini AI processes raw site progress, weather indices, and logistics delays, then converts them automatically into structured, client-ready executive PDF-style Daily Progress Reports.
          </p>

          {/* Quick Presets */}
          <div className="space-y-2.5 mb-6">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold">LOAD SIMULATION PRESET SCENARIO</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_DPR_TEMPLATES.map((tpl, i) => (
                <button
                  key={tpl.name}
                  onClick={() => loadPresetDpr(i)}
                  className="glass-btn font-mono text-[10.5px] px-3 py-1.5 text-zinc-300 rounded-lg hover:text-white cursor-pointer"
                >
                  ⚡ Install Scenario: {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Input logs parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1 font-bold">Reporting Date</label>
              <input
                type="date"
                value={dprInput.date}
                onChange={(e) => setDprInput({ ...dprInput, date: e.target.value })}
                className="w-full bg-zinc-900/80 border border-white/5 p-2 rounded-lg text-slate-200 focus:outline-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1 font-bold">Site Weather Metric</label>
              <input
                type="text"
                value={dprInput.weather}
                onChange={(e) => setDprInput({ ...dprInput, weather: e.target.value })}
                className="w-full bg-zinc-900/80 border border-white/5 p-2 rounded-lg text-slate-200 focus:outline-[#7C3AED]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1 font-bold">Meticulous Completed Progress</label>
              <textarea
                rows={2}
                value={dprInput.progress}
                onChange={(e) => setDprInput({ ...dprInput, progress: e.target.value })}
                className="w-full bg-zinc-900/80 border border-white/5 p-2 rounded-lg text-slate-200 focus:outline-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1 font-bold">Registered Logistics Delays</label>
              <input
                type="text"
                value={dprInput.delays}
                onChange={(e) => setDprInput({ ...dprInput, delays: e.target.value })}
                className="w-full bg-zinc-900/80 border border-white/5 p-2 rounded-lg text-slate-200 focus:outline-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1 font-bold">Material logistics usage today</label>
              <input
                type="text"
                value={dprInput.material}
                onChange={(e) => setDprInput({ ...dprInput, material: e.target.value })}
                className="w-full bg-zinc-900/80 border border-white/5 p-2 rounded-lg text-slate-200 focus:outline-[#7C3AED]"
              />
            </div>
          </div>

          {/* Run Generation CTA button */}
          <button
            onClick={triggerDprAICompile}
            disabled={generatingDpr}
            className="glass-btn-primary w-full py-3.5 disabled:opacity-40 text-slate-100 font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#7C3AED]/10"
          >
            {generatingDpr ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>COMPILING SECURE REPORT VECTORS VIA GEMINI AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>COMPILE STRUCTURED DPR VIA GEMINI AI</span>
              </>
            )}
          </button>

          {/* Render Output Report if exists */}
          {builtDprReport && (
            <div className="mt-6 bg-[#08080a] p-5 rounded-2xl border border-purple-900/40 relative scanlines">
              <div className="absolute top-4 right-4 bg-purple-950 text-purple-400 border border-purple-800/40 text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-widest">
                CLIENT READY MARKDOWN SUMMARY
              </div>

              <div className="text-xs font-mono text-zinc-300 leading-relaxed space-y-4 whitespace-pre-wrap">
                {builtDprReport}
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>REPORT PROTOCOL: SECURE MD-V3</span>
                <div className="flex gap-2">
                  <button
                    onClick={downloadDprPdf}
                    title="Triggers browser print window to print or save as a beautifully formatted PDF document"
                    className="glass-btn px-2.5 py-1 text-purple-400 hover:text-[#00E5FF] transition-all uppercase font-bold text-[10px] rounded flex items-center gap-1 cursor-pointer"
                  >
                    <span>🖨️ PRINT / SAVE PDF</span>
                  </button>
                  <button
                    onClick={downloadDprHtmlFile}
                    title="Downloads a high-fidelity standalone interactive HTML document directly to your device"
                    className="glass-btn px-2.5 py-1 text-[#00E5FF] hover:text-purple-400 transition-all uppercase font-bold text-[10px] rounded flex items-center gap-1 cursor-pointer"
                  >
                    <span>💾 DOWNLOAD HTML REPORT</span>
                  </button>
                  <button
                    onClick={() => setBuiltDprReport(null)}
                    className="glass-btn px-2.5 py-1 text-zinc-400 hover:text-white transition-all text-[10px] rounded cursor-pointer"
                  >
                    CLEAR REPORT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5 — GEOTAGGED FIELD MEDIA MODULE */}
        <div id="geotag-section" className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 blur-2xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="font-mono text-xs text-cyan-400 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                GEOLOCATIONAL OVERLAY NETWORK
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                Geotagged Field Media Node Logs
              </h2>
            </div>

            <span className="font-mono text-[9px] text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded">
              GPS COORDINATES: 12.9716° N / 77.5946° E
            </span>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed mb-6">
            Contractors can upload on-site pictures directly from mobile units. Every upload automatically binds exact GPS high precision coordinates and a safety rating level to prevent hazard oversights.
          </p>

          {/* Drag & Drop Uplod Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
            
            <div className="md:col-span-5 flex flex-col justify-between gap-4">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors relative cursor-pointer min-h-[140px] ${
                  dragActive ? "border-[#00E5FF] bg-[#00E5FF]/10" : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/45"
                }`}
              >
                <input
                  type="file"
                  id="field-file-input"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label htmlFor="field-file-input" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-7 h-7 text-zinc-500 mb-2" />
                  <span className="text-[11px] font-mono font-medium text-zinc-300 block">
                    {customPhotoFile ? "✓ FILE LOADED" : "DRAG PHOTO HERE"}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1 block">Or tap to browse local directories</span>
                </label>

                {customPhotoFile && (
                  <div className="mt-2 text-center text-[10px] text-green-400 font-mono truncate max-w-[120px]">
                    Ready to transmit
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold">SELECT CONTEXT TAG</label>
                <div className="grid grid-cols-3 gap-1 grid-row-1 text-[10px] font-mono">
                  {["STRUCTURAL", "LOGISTICS", "CIVIL", "SAFETY", "HAZARD", "FINANCE"].slice(0,3).map((tg) => (
                    <button
                      key={tg}
                      onClick={() => setPhotoTag(tg)}
                      className={`py-1.5 rounded-lg text-center cursor-pointer font-mono text-[9px] transition-all duration-250 ${
                        photoTag === tg ? "glass-btn-cyan text-cyan-400 border border-cyan-500/20 shadow-md" : "glass-btn text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {tg}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] mt-2">
                  <span className="text-zinc-500 font-mono text-[9px] tracking-wider">SAFETY GRADE ASSIGNMENT:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSafetyRating("Passed")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-all ${
                        safetyRating === "Passed" ? "bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 font-bold shadow-md" : "glass-btn text-zinc-400 hover:text-zinc-250"
                      }`}
                    >
                      PASSED
                    </button>
                    <button
                      onClick={() => setSafetyRating("Cautioned")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-all ${
                        safetyRating === "Cautioned" ? "bg-amber-500/15 border border-amber-500/35 text-amber-400 font-bold shadow-md" : "glass-btn text-zinc-400 hover:text-zinc-250"
                      }`}
                    >
                      CAUTIONED
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1 font-bold">Write Photo Description Log</label>
                <textarea
                  rows={3}
                  placeholder="E.g. Scaffolding structures validated for safety compliance levels. Tension cables locked."
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-white/5 p-2 rounded-lg text-xs text-slate-200 focus:outline-[#00E5FF] tracking-wide"
                />
              </div>

              <button
                onClick={commitFieldMedia}
                className="glass-btn-cyan w-full py-2.5 text-[#00E5FF] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/10"
              >
                <Plus className="w-4 h-4" />
                <span>TRANSMIT GEO-PHOTO LOG</span>
              </button>
            </div>

          </div>

          {/* Live horizontal image reel */}
          <div className="space-y-2.5 mt-6">
            <span className="block text-[10px] font-mono text-zinc-500 uppercase font-bold">LIVE GEOTAG EVIDENCE REEL FEED (REALTIME)</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaLogs.map((log) => (
                <div key={log.id} className="bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden flex flex-col relative group">
                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-zinc-400 tracking-wider flex items-center gap-1">
                    <span className="w-1 h-1 bg-[#00E5FF] rounded-full" />
                    <span>{log.tag}</span>
                  </div>

                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded text-[8.5px] font-mono flex items-center gap-1 font-bold">
                    <span className={`w-1 h-1 rounded-full ${log.safetyRating === "Passed" ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
                    <span className={log.safetyRating === "Passed" ? "text-emerald-400" : "text-amber-400"}>{log.safetyRating.toUpperCase()}</span>
                  </div>

                  <div className="h-32 overflow-hidden bg-black flex items-center justify-center object-cover">
                    <img src={log.mediaUrl} alt={log.description} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <p className="text-[11px] text-zinc-300 leading-relaxed italic shrink-0">
                      "{log.description}"
                    </p>

                    <div className="space-y-1 mt-2 pt-2 border-t border-white/5">
                      <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 justify-between">
                        <span className="truncate max-w-[120px] text-zinc-400 font-bold">{log.user}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400 bg-cyan-950/20 px-1.5 py-0.5 rounded">
                        <span>LAT: {log.latitude}° N</span>
                        <span>LNG: {log.longitude}° E</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 6 — REAL-TIME CORE COMMUNICATION CHAT VISUALIZATION */}
        <div id="chat-section" className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400 px-1">
            <span>PROSITE360 COMPREHENSIVE CONSOLE ADVISOR SYSTEM</span>
            <span className="text-purple-400 font-bold">SYNC: ACTIVE V1</span>
          </div>
          <ChatVisualization />
        </div>

        {/* SECTION 7 — FINANCIAL CONTROL & RAZORPAY INTEGRATION */}
        <div id="financial-section" className="glass-panel-heavy p-6 md:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 blur-2xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                FINANCIAL LEDGER CONSOLE
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                Razorpay Escrow & Financial Control
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-850/40 px-3 py-1 rounded">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-extrabold">RAZORPAY LINKED</span>
            </div>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed mb-6">
            Track capital expenditure variables, material procurements, and invoice releases instantly. Trigger instant Razorpay-secured payouts to vendors directly below to keep logistics supply lines moving.
          </p>

          {/* Budget visual bars */}
          <div className="bg-zinc-900 border border-white/5 p-4 rounded-xl space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-[9px] text-zinc-500 font-mono uppercase">ALLOCATED BUDGET</div>
                <div className="text-md sm:text-lg font-mono font-bold text-slate-100">₹15.40 cr</div>
              </div>
              <div>
                <div className="text-[9px] text-zinc-500 font-mono uppercase">EXPENDED FUNDS</div>
                <div className="text-md sm:text-lg font-mono font-bold text-cyan-400">
                  ₹{(finance.amountExpended / 10000000).toFixed(2)} cr
                </div>
              </div>
              <div>
                <div className="text-[9px] text-zinc-500 font-mono uppercase">COMMITTED LIABILITIES</div>
                <div className="text-md sm:text-lg font-mono font-bold text-purple-400">₹1.24 cr</div>
              </div>
            </div>

            {/* Progress visual bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                <span>OUTFLOW EXHAUSTION PERCENTAGE</span>
                <span>{Math.round((finance.amountExpended / finance.budgetAllocated) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((finance.amountExpended / finance.budgetAllocated) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Invoice Dispatch Area */}
          <div className="space-y-3.5">
            <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold">UNPAID VENDOR INVOICES QUEUED FOR DISPATCH</label>
            
            <div className="space-y-2">
              <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Aditya Birla Steel Logistics - Block B</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">INVOICE: #ABB-9021 // DUE IN: 3 Days</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-white">₹4,80,000.00</span>
                  <button
                    onClick={() => startRazorSim(480000, "Aditya Birla Steel Logistics Row B")}
                    className="glass-btn-primary px-3.5 py-1.5 text-purple-300 hover:text-white text-[10.5px] font-mono font-bold rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    PAY WITH RAZORPAY
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Dynamic Fuel Dispensation Node 1</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">INVOICE: #DFD-11100 // DUE IN: Immediate</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-white">₹4,80,000.00</span>
                  <button
                    onClick={() => startRazorSim(480000, "Dynamic Fuel Logistics (Tower 2 heavy machinery)")}
                    className="glass-btn-primary px-3.5 py-1.5 text-purple-300 hover:text-white text-[10.5px] font-mono font-bold rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    PAY WITH RAZORPAY
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Financial transaction logs list */}
          <div className="space-y-2.5 mt-6 pt-5 border-t border-white/5">
            <span className="block text-[10px] font-mono text-zinc-500 uppercase font-bold">SEGREGATED ACCOUNT TRANSACTION LEDGERS</span>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {finance.transactions.map((txn) => (
                <div key={txn.id} className="flex justify-between items-center text-[11px] font-mono py-1 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${txn.type === "credit" ? "bg-emerald-400" : "bg-purple-400"}`} />
                    <span className="text-zinc-300 truncate max-w-[280px]">{txn.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500">{txn.timestamp}</span>
                    <span className={txn.type === "credit" ? "text-emerald-400 font-bold" : "text-purple-400 font-bold"}>
                      {txn.type === "credit" ? "+" : "-"} ₹{txn.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 9 — FINAL CTA */}
        <div className="bg-gradient-to-tr from-[#7C3AED]/12 to-[#00E5FF]/5 p-6 md:p-8 rounded-2xl border border-purple-900/35 relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none" />
          
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-black text-slate-100 tracking-tight leading-none">
              Built For The Next Generation Of Infrastructure Intelligence
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connect your active high-stakes project directories immediately. Setup automated auditing, biometric check stations, and localized billing accounts within minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setDemoEnroll(true)}
              className="glass-btn-cyan px-6 py-3.5 text-[#00E5FF] text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer"
            >
              Request Enterprise Demo
            </button>
            
            <a
              href="#pulse-section"
              onClick={(e) => { e.preventDefault(); scrollToSection("pulse-section"); }}
              className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition-colors border border-white/5"
            >
              <span>EXPLORE DIGITAL CORE OS</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </a>
          </div>
        </div>

      </div>

      {/* FOOTER METRIC STATUS OS PANEL */}
      <footer className="relative z-20 border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-zinc-900">
          
          <div className="p-6 border-r border-zinc-900 flex flex-col justify-between h-[100px] border-b sm:border-b-0">
            <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-ping" />
              Project Pulse Status
            </div>
            <div className="flex items-center justify-between">
              <span className="text-md font-bold tracking-tight text-white uppercase font-display">
                ON-SCHEDULE
              </span>
              <span className="text-[#00E5FF] text-sm font-mono font-bold">
                +{avgCompletionOfActive}%
              </span>
            </div>
          </div>

          <div className="p-6 border-r border-zinc-900 flex flex-col justify-between h-[100px] border-b sm:border-b-0">
            <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <ActivityIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
              Resource Load Metric
            </div>
            <div className="flex items-center justify-between">
              <span className="text-md font-bold tracking-tight text-[#7C3AED] uppercase font-display">
                LOAD RATIO HIGH
              </span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-5 bg-[#7C3AED]" />
                <div className="w-1.5 h-5 bg-[#7C3AED]" />
                <div className="w-1.5 h-5 bg-[#7C3AED]" />
                <div className="w-1.5 h-5 bg-[#7C3AED]/40" />
              </div>
            </div>
          </div>

          <div className="p-6 border-r border-zinc-900 flex flex-col justify-between h-[100px] border-b lg:border-b-0">
            <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Safety Compliance Ledger
            </div>
            <div className="flex items-center justify-between">
              <span className="text-md font-bold tracking-tight text-white uppercase font-display">
                99.8% STANDARD
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-800/20">
                STABLE SECURE
              </span>
            </div>
          </div>

          <div className="p-6 bg-[#7C3AED]/5 flex flex-col justify-between h-[100px]">
            <div className="text-[#00E5FF] text-[10px] font-mono uppercase tracking-widest mb-2 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#00E5FF]" />
              Latest AI Summary Context
            </div>
            <p className="text-[11px] italic text-zinc-300 truncate font-sans max-w-xs">
              {builtDprReport ? `"${builtDprReport.substring(builtDprReport.indexOf("OVERVIEW") + 10, builtDprReport.indexOf("OVERVIEW") + 95).trim()}..."` : '"Active workspace scanned. Biometric checkins cleared at gate counters successfully..."'}
            </p>
          </div>

        </div>

        {/* Brand trademark details */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row gap-4 items-center justify-between font-mono text-[10px] text-zinc-500">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <div>
              © 2026 ProSite360 Inc. All core blueprints sandbox secured in server container memory.
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-zinc-500 text-xs mt-2">
              <span>Made with</span>
              <a 
                href="https://www.rubyai.co.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-purple-950/30 hover:bg-purple-950/60 border border-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] rounded-full text-slate-200 hover:text-white transition-all duration-300 font-bold group"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-[#00E5FF] bg-clip-text text-transparent group-hover:from-purple-350 group-hover:to-pink-350">rubyAI</span>
                <span className="text-purple-400 text-xs sm:text-[13px] animate-pulse group-hover:scale-125 transition-transform">💎</span>
                <span className="h-3 w-px bg-purple-500/20" />
                <span className="underline decoration-purple-500/25 text-[10px] sm:text-xs font-semibold text-purple-300 group-hover:text-[#00E5FF]">www.rubyai.co.in</span>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-emerald-500 font-bold">PORT 3000 CONSOLE</span>
            </div>
            <span>|</span>
            <div>SECURED JWT STANDARDS</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
