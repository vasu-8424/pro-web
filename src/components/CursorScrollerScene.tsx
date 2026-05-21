import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Eye, RotateCcw, Activity, ShieldCheck, Compass, MonitorCheck } from "lucide-react";

interface ConstructionSceneItem {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  status: string;
  details: string;
}

const CINEMATIC_ITEMS: ConstructionSceneItem[] = [
  {
    id: "clip-1",
    title: "SKYLINE STRUCTURAL TRUSS ERECTION",
    location: "Tower A Core - Sector 8",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=700&auto=format&fit=crop",
    status: "CRITICAL REBAR MESH COMPLETED",
    details: "High-grade structural steel lattice alignment."
  },
  {
    id: "clip-2",
    title: "SUPER-CRITICAL TOWER ASSEMBLY",
    location: "Shoring Segment B-2",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=700&auto=format&fit=crop",
    status: "LOGISTICAL HOIST SYSTEM RUNNING",
    details: "Super-torque crawler crane load cell validation."
  },
  {
    id: "clip-3",
    title: "FOUNDATION FLIGHT GLASS GLAZING",
    location: "South Atrium - Level 12",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=700&auto=format&fit=crop",
    status: "CURTAIN WALL ACCORD SEALED",
    details: "Seismic expansion joint perimeter validation."
  },
  {
    id: "clip-4",
    title: "MONOLITHIC CONCRETE PLATE POUR",
    location: "Subfloor Excavation Zone 4",
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=700&auto=format&fit=crop",
    status: "HYDRATION TELEMETRY GREEN",
    details: "M40 Grade structural mass concrete curing validation."
  }
];

export default function CursorScrollerScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  
  // Interactive coordinates & scroll trackers
  const [mouse, setMouse] = useState({ x: 0, y: 0, smoothX: 0, smoothY: 0 });
  const [hoveredItem, setHoveredItem] = useState<ConstructionSceneItem | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInside, setIsInside] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, lerpX: 0, lerpY: 0 });
  const angleRef = useRef(0);
  const smoothXRef = useRef(0);
  const smoothYRef = useRef(0);
  const scrollProgressRef = useRef(0);

  // Monitor cursor coordinate tracking inside section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      
      const xNorm = (px / rect.width) * 2 - 1;
      const yNorm = (py / rect.height) * 2 - 1;

      setMouse((prev) => ({
        ...prev,
        x: xNorm,
        y: yNorm
      }));

      setCursorPos((prev) => ({
        ...prev,
        x: px,
        y: py
      }));
    };

    const handleWindowScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far through the viewport the container is
      const start = rect.top - viewportHeight;
      const totalRange = rect.height + viewportHeight;
      const progress = Math.min(Math.max(-start / totalRange, 0), 1);
      setScrollProgress(progress);
      scrollProgressRef.current = progress;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("scroll", handleWindowScroll);
      // Trigger initial scroll calculation
      handleWindowScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  // Frame interpolation loop for smooth spring physics on floating HUD & wireframe rot
  useEffect(() => {
    let animId: number;
    const updateInterpolation = () => {
      setMouse((prev) => {
        const dx = prev.x - prev.smoothX;
        const dy = prev.y - prev.smoothY;
        const nextSmoothX = prev.smoothX + dx * 0.08;
        const nextSmoothY = prev.smoothY + dy * 0.08;
        smoothXRef.current = nextSmoothX;
        smoothYRef.current = nextSmoothY;
        return {
          ...prev,
          smoothX: nextSmoothX,
          smoothY: nextSmoothY
        };
      });

      setCursorPos((prev) => {
        const dx = prev.x - prev.lerpX;
        const dy = prev.y - prev.lerpY;
        return {
          ...prev,
          lerpX: prev.lerpX + dx * 0.1,
          lerpY: prev.lerpY + dy * 0.1
        };
      });

      animId = requestAnimationFrame(updateInterpolation);
    };
    animId = requestAnimationFrame(updateInterpolation);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Canvas wireframe architect scanner animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = (rect?.width || 350) * window.devicePixelRatio;
      canvas.height = (rect?.height || 350) * window.devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // 3D Point projection helper
    interface Point { x: number; y: number; z: number }

    const project = (pt: Point, rotY: number, rotX: number, w: number, h: number) => {
      // Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = pt.x * cosY - pt.z * sinY;
      const z1 = pt.x * sinY + pt.z * cosY;

      // Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = pt.y * cosX - z1 * sinX;
      const z2 = pt.y * sinX + z1 * cosX;

      const fov = 300;
      const dist = 350;
      const scale = fov / (dist + z2);

      return {
        x: w / 2 + x1 * scale,
        y: h / 2 - y2 * scale,
        depth: z2
      };
    };

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      // Spin continuously + mouse coordinate multiplier + page scroll
      angleRef.current += 0.003;
      const rotY = angleRef.current + smoothXRef.current * 1.2 + scrollProgressRef.current * Math.PI * 1.5;
      const rotX = 0.35 + smoothYRef.current * 0.4;

      // Draw structured Holographic Blueprint Skyscraper Grid
      const floors = 12;
      const floorHeight = 12;
      const sizeOnBase = 40;

      // Generate nodes for nested concentric towers
      ctx.lineWidth = 1;

      for (let f = 0; f <= floors; f++) {
        // Higher floors twist with dynamic architectural torsion!
        const floorTorsion = f * 0.05 * (1 + smoothXRef.current);
        const currentRotY = rotY + floorTorsion;
        const py = -60 + f * floorHeight;
        
        // Scale skyscraper inward as it reaches maximum height
        const currentSize = sizeOnBase * (1.1 - (f / floors) * 0.45);

        // Define square path of each floor deck
        const corners: Point[] = [
          { x: -currentSize, y: py, z: -currentSize },
          { x: currentSize, y: py, z: -currentSize },
          { x: currentSize, y: py, z: currentSize },
          { x: -currentSize, y: py, z: currentSize }
        ];

        const projectedCorners = corners.map(c => project(c, currentRotY, rotX, w, h));

        // Draw deck rim
        ctx.beginPath();
        ctx.moveTo(projectedCorners[0].x, projectedCorners[0].y);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(projectedCorners[i].x, projectedCorners[i].y);
        }
        ctx.closePath();
        
        // Floor level gradient based on proximity
        const opacity = Math.max(0.1, 1 - f / floors);
        ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.45})`;
        ctx.stroke();

        // Cross bracing trusses for specific technical levels (visual complexity)
        if (f % 3 === 0 && f > 0) {
          ctx.beginPath();
          ctx.moveTo(projectedCorners[0].x, projectedCorners[0].y);
          ctx.lineTo(projectedCorners[2].x, projectedCorners[2].y);
          ctx.moveTo(projectedCorners[1].x, projectedCorners[1].y);
          ctx.lineTo(projectedCorners[3].x, projectedCorners[3].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.25})`;
          ctx.stroke();
        }

        // Draw corner support columns to the previous floor
        if (f > 0) {
          const prevPy = -60 + (f - 1) * floorHeight;
          const prevTorsion = (f - 1) * 0.05 * (1 + smoothXRef.current);
          const prevRotY = rotY + prevTorsion;
          const prevSize = sizeOnBase * (1.1 - ((f - 1) / floors) * 0.45);

          const prevCorners: Point[] = [
            { x: -prevSize, y: prevPy, z: -prevSize },
            { x: prevSize, y: prevPy, z: -prevSize },
            { x: prevSize, y: prevPy, z: prevSize },
            { x: -prevSize, y: prevPy, z: prevSize }
          ];

          const projectedPrev = prevCorners.map(c => project(c, prevRotY, rotX, w, h));

          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.moveTo(projectedCorners[i].x, projectedCorners[i].y);
            ctx.lineTo(projectedPrev[i].x, projectedPrev[i].y);
          }
          ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.2})`;
          ctx.stroke();
        }
      }

      // Draw central elevator core matrix
      const coreSize = 10;
      for (let f = 0; f <= floors; f++) {
        const py = -60 + f * floorHeight;
        const corners: Point[] = [
          { x: -coreSize, y: py, z: -coreSize },
          { x: coreSize, y: py, z: -coreSize },
          { x: coreSize, y: py, z: coreSize },
          { x: -coreSize, y: py, z: coreSize }
        ];
        const projected = corners.map(c => project(c, rotY, rotX, w, h));
        
        ctx.beginPath();
        ctx.moveTo(projected[0].x, projected[0].y);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(projected[i].x, projected[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(124, 58, 237, 0.4)";
        ctx.stroke();
      }

      // Animated scanner grid sweeps vertically
      ctx.beginPath();
      const sweepY = -60 + ((Date.now() / 45) % (floors * floorHeight));
      const scanCorners: Point[] = [
        { x: -sizeOnBase * 1.5, y: sweepY, z: -sizeOnBase * 1.5 },
        { x: sizeOnBase * 1.5, y: sweepY, z: -sizeOnBase * 1.5 },
        { x: sizeOnBase * 1.5, y: sweepY, z: sizeOnBase * 1.5 },
        { x: -sizeOnBase * 1.5, y: sweepY, z: sizeOnBase * 1.5 }
      ];
      const projectedScan = scanCorners.map(c => project(c, rotY, rotX, w, h));
      ctx.moveTo(projectedScan[0].x, projectedScan[0].y);
      for (let i = 1; i < 4; i++) {
        ctx.lineTo(projectedScan[i].x, projectedScan[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(0, 229, 255, 0.75)";
      ctx.stroke();

      // Label Overlay metadata near high levels
      const pinnacle: Point = { x: 0, y: -60 + floors * floorHeight + 10, z: 0 };
      const projPinnacle = project(pinnacle, rotY, rotX, w, h);
      ctx.fillStyle = "rgba(0, 229, 255, 0.9)";
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillText("BIM LEVEL_12 PINNACLE", projPinnacle.x + 12, projPinnacle.y - 2);

      ctx.beginPath();
      ctx.arc(projPinnacle.x, projPinnacle.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#00E5FF";
      ctx.fill();

      // Connecting lead telemetry line
      ctx.beginPath();
      ctx.moveTo(projPinnacle.x, projPinnacle.y);
      ctx.lineTo(projPinnacle.x + 10, projPinnacle.y - 5);
      ctx.lineTo(projPinnacle.x + 50, projPinnacle.y - 5);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Horizontal reel coordinate scrolling calculations based on raw cursor offset
  const horizontalReelOffset = mouse.smoothX * 28; // moves back and forth with mouse transition

  return (
    <div
      id="cinematic-interactive-scroller-viewport"
      ref={containerRef}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => {
        setIsInside(false);
        setHoveredItem(null);
      }}
      className="glass-panel-heavy p-6 md:p-8 rounded-2xl relative overflow-hidden"
    >
      {/* Decorative scanline aesthetics */}
      <div className="absolute inset-0 bg-radial-grid opacity-15 pointer-events-none" />
      
      {/* Visual Header indicators */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="font-mono text-xs md:text-sm text-[#00E5FF] flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-ping" />
            LIVE EXPERIMENT // INTERACTIVE blueprints PORTAL
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Compass className="w-6 h-6 text-indigo-400" />
            Holographic Construction Scanner
          </h3>
        </div>
        
        <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-300 bg-zinc-900 border border-white/10 py-1.5 px-4 rounded-xl">
          <span>CURSOR SCRIBE VELOCITY:</span>
          <span className="text-[#00E5FF] font-black font-mono">
            {Math.abs(mouse.x * 100).toFixed(0)} MHz
          </span>
        </div>
      </div>

      <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-6 max-w-3xl relative z-10">
        Move your cursor horizontally across this interactive grid to **warp and rotate the isometric building wireframe blueprint**. Hover over site frames below to overlay the real-time telemetry camera.
      </p>

      {/* Grid Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* LEFT COMPARTMENT: The Live Canvas Rotating Structure */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/60 border border-white/5 rounded-2xl h-[330px] p-4 relative overflow-hidden group">
          <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-xs text-zinc-400 bg-black/70 px-2.5 py-1 rounded border border-white/10">
            <MonitorCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>3D DIRECTIVE VIEWPORT // PORT:3000</span>
          </div>

          <div className="absolute bottom-3 right-3 flex flex-col text-right font-mono text-xs text-zinc-400 leading-normal space-y-1">
            <span>ROT_Y: {(mouse.smoothX * Math.PI).toFixed(2)} rad</span>
            <span>ZOOM: {(1 + Math.abs(mouse.smoothY) * 0.2).toFixed(2)}x</span>
          </div>

          {/* Interactive compass ring marker */}
          <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center opacity-10">
            <div className="w-[280px] h-[280px] rounded-full border border-dashed border-[#00E5FF] animate-spin" style={{ animationDuration: '45s' }}></div>
            <div className="absolute w-[220px] h-[220px] rounded-full border border-dotted border-purple-500 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
          </div>

          {/* Core Interactive Drawing Surface */}
          <div className="w-[290px] h-[290px] relative">
            <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing" />
          </div>
        </div>

        {/* RIGHT COMPARTMENT: The Horizontal "Video / Photo Scrolling" Frame Slider Strip */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 uppercase font-bold px-1">
            <span>Hover frames to sync CCTV overlay feed</span>
            <span>Slide Offset: {horizontalReelOffset.toFixed(1)}%</span>
          </div>

          {/* Interactive photo strip container */}
          <div 
            ref={stripRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 relative"
          >
            {CINEMATIC_ITEMS.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  transform: `perspective(800px) rotateY(${mouse.smoothX * 12}deg) rotateX(${mouse.smoothY * -6}deg) translateY(${mouse.smoothX * (item.id === "clip-1" || item.id === "clip-3" ? 5 : -5)}px)`,
                  transition: "transform 0.1s ease-out"
                }}
                className={`bg-zinc-950/60 p-3.5 rounded-xl border transition-all duration-300 relative group overflow-hidden cursor-pointer ${
                  hoveredItem?.id === item.id ? "border-[#00E5FF]/40 bg-zinc-900 shadow-xl shadow-cyan-950/20" : "border-white/5"
                }`}
              >
                {/* Background image strip matching building scene videos */}
                <div className="h-32 rounded-lg bg-black overflow-hidden relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />
                  
                  {/* Visual telemetry static filters */}
                  <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none z-10" />
                  
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-[2s] ease-out ${
                      hoveredItem?.id === item.id ? "scale-115 rotate-1 opacity-90" : "scale-100 opacity-60"
                    }`}
                  />

                  {/* Corner bounds design */}
                  <div className="absolute top-2.5 left-2.5 z-20 bg-black/80 px-2.5 py-1 rounded text-xs font-mono text-cyan-400 border border-[#00E5FF]/30">
                    CAM_ST_{item.id.split("-")[1]}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 z-20 bg-zinc-950/90 px-3 py-1 rounded text-xs font-mono text-[rgba(0,229,255,0.9)] tracking-wider">
                    SYNCING FEED
                  </div>
                </div>

                {/* Text descriptions */}
                <div className="space-y-1.5">
                  <span className="text-xs text-zinc-400 font-mono flex items-center gap-2 uppercase font-bold">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    {item.location}
                  </span>
                  <h4 className="font-bold text-sm md:text-base text-slate-100 group-hover:text-[#00E5FF] transition-colors truncate uppercase tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                {/* Animated progress overlay indicating simulated continuous playback */}
                <div className="mt-3.5 w-full h-[2.5px] bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-[#00E5FF] rounded-full"
                    style={{ 
                      width: hoveredItem?.id === item.id ? '100%' : '35%',
                      transition: hoveredItem?.id === item.id ? 'width 4s linear' : 'width 1s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FLOATING CURSOR HOLOGRAM TELEMETRY CARD WINDOW */}
      {isInside && (
        <div
          style={{
            position: "absolute",
            left: `${cursorPos.lerpX + 22}px`,
            top: `${cursorPos.lerpY - 25}px`,
            pointerEvents: "none",
            zIndex: 100
          }}
          className="w-56 bg-zinc-950/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-3.5 shadow-2xl opacity-100 transition-opacity duration-300 pointer-events-none max-w-xs overflow-hidden"
        >
          {/* Cyan decorative top bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-cyan-400 animate-pulse" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-cyan-400 tracking-wider flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              HUD_TELEMETRY ANALYZER
            </span>
            <span className="text-[10px] font-mono text-zinc-400">LIVE COORDS</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-zinc-200 font-mono leading-relaxed bg-zinc-900/60 p-2.5 rounded border border-white/5">
              <div className="flex justify-between">
                <span className="text-zinc-500">CUR_X:</span>
                <span className="font-bold text-white">{mouse.x.toFixed(3)}</span>
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-zinc-500">CUR_Y:</span>
                <span className="font-bold text-white">{mouse.y.toFixed(3)}</span>
              </div>
            </div>

            {hoveredItem ? (
              <div className="animate-fade-in space-y-1.5">
                <div className="h-[2px] bg-zinc-800 my-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#00E5FF] font-black block">FOCUSED NODE STREAM</span>
                <p className="text-xs text-white font-semibold truncate uppercase font-display leading-normal">{hoveredItem.title}</p>
                <div className="px-2 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded text-xs font-mono text-cyan-400 truncate">
                  {hoveredItem.status}
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-zinc-400 italic mt-2 text-center">
                *Hover side frame clips to sync CCTV stream logs
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
