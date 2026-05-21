import { useState } from "react";
import { Shield, Hammer, HardHat, FileText, Landmark, CheckCircle2, ChevronRight, UserCheck } from "lucide-react";
import { RoleType, RoleConfig } from "../types";

const ROLE_SETTINGS: RoleConfig[] = [
  {
    id: "Admin",
    title: "Super Admin",
    description: "Global enterprise access across multiple projects. Governs platform integrations, API usage, high-level auditing, and organizational billing keys.",
    permissions: [
      "Access full security ledger logs",
      "Assign and remove corporate project licenses",
      "Control Razorpay billing nodes",
      "Override site safety lockdowns"
    ],
    metricLabel: "ORGANIZATIONAL REACH",
    metricValue: "18 Global Sites Active",
    actionFocus: "Global telemetry tracking & developer secrets key administration."
  },
  {
    id: "Contractor",
    title: "Contractor",
    description: "Maintains active site operations. Coordinates workforce rotations, validates material delivery, issues subcontracts, and authorizes daily progress reports.",
    permissions: [
      "Publish daily DPR to executive tier",
      "Authorize payroll and material invoicing",
      "Schedule heavy machinery logistics",
      "Coordinate high-density workforce registries"
    ],
    metricLabel: "DPR WORKFLOW HEALTH",
    metricValue: "98.4% On-Time DPR Submission",
    actionFocus: "Verifying daily milestone accomplishments and resolving logistic constraints."
  },
  {
    id: "Engineer",
    title: "Site Engineer",
    description: "The eyes and ears of the project on the ground. Takes field measurements, uploads geo-stamped photo evidence, registers safety incidents, and monitors real-time telemetry.",
    permissions: [
      "Upload geotagged field media with GPS coordinates",
      "Log biometric attendance checkpoints",
      "Raise active high-risk safety warnings",
      "Review spatial architectural overlays"
    ],
    metricLabel: "GEO-FIELD UPLOADS",
    metricValue: "+342 Photos Logged (24h)",
    actionFocus: "Performing actual physical reviews and registering biometric check-ins."
  },
  {
    id: "Client",
    title: "Client",
    description: "Premium investment stakeholder overview. Observes construction milestones from a distance with executive status matrices, downloaded reports, and financial transparent health charts.",
    permissions: [
      "Download AI-generated executive summaries",
      "Audit physical milestone progress charts",
      "Review Razorpay cleared payments accounts",
      "Direct secure feed communication with managers"
    ],
    metricLabel: "MILESTONE TRACKING",
    metricValue: "Phase 3 Handover on Track",
    actionFocus: "Reviewing spatial timeline graphs and clearance checklists effortlessly."
  },
  {
    id: "Accountant",
    title: "Accountant",
    description: "Manages capital efficiency, payroll variables, material procurement ledgers, tax compliance schedules, and audits external financial clearances.",
    permissions: [
      "Review invoice queues and balances",
      "Integrate Razorpay payment clearances",
      "Generate fiscal capital expenditure matrices",
      "Verify worker compensation standards"
    ],
    metricLabel: "CAPITAL CLEARANCES",
    metricValue: "₹4.82 Cr Processed This Quarter",
    actionFocus: "Mitigating excessive project cost variations and auditing vendor agreements."
  }
];

export default function RoleWheel() {
  const [activeRole, setActiveRole] = useState<RoleType>("Admin");

  const currentRole = ROLE_SETTINGS.find((r) => r.id === activeRole) || ROLE_SETTINGS[0];

  const getRoleIcon = (roleId: RoleType) => {
    switch (roleId) {
      case "Admin": return <Shield className="w-5 h-5 text-indigo-400" />;
      case "Contractor": return <Hammer className="w-5 h-5 text-blue-400" />;
      case "Engineer": return <HardHat className="w-5 h-5 text-cyan-400" />;
      case "Client": return <FileText className="w-5 h-5 text-purple-400" />;
      case "Accountant": return <Landmark className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-w-0">
      {/* Interactive Selector Wheel/Deck (Left Side) */}
      <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-start gap-6 min-w-0">
        <div>
          <div className="font-mono text-xs text-indigo-400 flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
            SECTION // 08
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-100 tracking-tight leading-none mb-3">
            Multi-Role State Engine
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            ProSite360 dynamically adapts its entire interface, telemetry charts, and priority action lists based on who is logged in. Click any system role below to rotate the OS state.
          </p>
        </div>

        {/* Orbit Deck List */}
        <div className="flex flex-col gap-2 relative shrink-0">
          {/* Vertical glowing connector line behind items */}
          <div className="absolute top-4 bottom-4 left-[21px] w-0.5 bg-gradient-to-b from-indigo-500/20 via-cyan-500/10 to-transparent" />

          {ROLE_SETTINGS.map((role) => {
            const isActive = role.id === activeRole;
            return (
              <button
                key={role.id}
                id={`role-btn-${role.id}`}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-start gap-4 p-3.5 rounded-xl text-left transition-all duration-300 relative group shrink-0 w-full ${
                  isActive
                    ? "glass-btn-primary border-l-2 border-l-indigo-500 shadow-lg shadow-[#7C3AED]/15"
                    : "glass-btn border-transparent hover:translate-x-1 hover:border-white/10"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                    isActive
                      ? "bg-indigo-950/80 border border-indigo-500/40 shadow-inner"
                      : "bg-zinc-900 border border-zinc-800"
                  }`}
                >
                  {getRoleIcon(role.id)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-sm transition-all truncate ${isActive ? "text-slate-100 font-bold" : "text-zinc-400"}`}>
                      {role.title}
                    </span>
                    {isActive && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-900/50 px-1.5 py-0.5 rounded shrink-0">
                        ACTIVE OS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Adaptive Dashboard Preview (Right Side) */}
      <div className="lg:col-span-12 xl:col-span-7 glass-panel rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-w-0">
        {/* Holographic matrix grid styling */}
        <div className="absolute inset-0 bg-radial-grid opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-dot-matrix opacity-10 pointer-events-none" />

        {/* Dynamic Panel Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-mono text-xs tracking-wider text-zinc-300">
              SYS_OPERATING_VIEW // {currentRole.id.toUpperCase()}_WORKSPACE
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </div>
        </div>

        {/* Main Workspace Body Content */}
        <div className="p-6 relative z-10 flex-1 flex flex-col justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] text-zinc-500 mb-1 uppercase tracking-widest">{currentRole.metricLabel}</div>
            <div className="text-2xl md:text-3xl font-display font-semibold text-slate-100 flex items-center gap-2">
              <span className="text-purple-400">{currentRole.metricValue.split(" ")[0]}</span>
              <span className="text-zinc-400 text-lg md:text-xl font-normal">
                {currentRole.metricValue.substring(currentRole.metricValue.indexOf(" ") + 1)}
              </span>
            </div>

            <h4 className="font-bold text-sm text-zinc-200 mt-6 mb-2">Role Overview & Responsibilities:</h4>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xl">
              {currentRole.description}
            </p>
          </div>

          {/* Permissions Audit */}
          <div>
            <h4 className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase mb-3">AUTHORIZED ACCESS DELEGATIONS</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-2.5">
              {currentRole.permissions.map((perm, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-zinc-900/60 p-2.5 rounded-lg border border-white/5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-zinc-300 truncate">{perm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Focus Callout */}
          <div className="bg-indigo-950/30 border border-indigo-900/30 p-3 rounded-xl flex items-center gap-3 mt-2">
            <UserCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="text-[11px] leading-snug">
              <span className="text-indigo-300 font-bold uppercase tracking-wider block font-mono">PRIORITY PROCESS</span>
              <span className="text-zinc-400">{currentRole.actionFocus}</span>
            </div>
          </div>
        </div>

        {/* Workspace Footer telemetry */}
        <div className="bg-zinc-950/70 p-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between text-[10px] font-mono text-zinc-500 relative z-10">
          <div className="flex items-center gap-2">
            <span>AUDIT STANDARDS: SECURE JWT</span>
            <span className="text-zinc-700">|</span>
            <span className="text-emerald-500 font-bold">STATE SYNC SECURE</span>
          </div>
          <div className="flex items-center gap-1 cursor-not-allowed text-zinc-400 hover:text-white transition-colors">
            <span>DEPLOY OS MODULES</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
