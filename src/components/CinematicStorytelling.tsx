import React, { useEffect, useRef, useState } from "react";
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  Network, 
  ShieldCheck, 
  Database, 
  Compass,
  ArrowDownCircle,
  Eye,
  Sliders,
  ChevronRight,
  ArrowRight
} from "lucide-react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  zDepth: number;
}

export default function CinematicStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interactive core states
  const [targetProgress, setTargetProgress] = useState(0.0); // 0.0 to 1.0 (controlled by buttons/slider)
  const [activeLevel, setActiveLevel] = useState(0); // 0 to 5
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Update targetProgress and activeLevel
  const selectLevel = (level: number) => {
    setActiveLevel(level);
    if (level === 0) {
      setTargetProgress(0.0); // Assembled
    } else {
      setTargetProgress(0.85); // Dismantle enough to see all layers exploded
    }
  };

  // Monitor mouse over container for tilt parallax
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMouseParallax(prev => ({
        ...prev,
        targetX: x,
        targetY: y
      }));
    };

    const handleMouseLeave = () => {
      setMouseParallax(prev => ({
        ...prev,
        targetX: 0,
        targetY: 0
      }));
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Sync activeLevel dynamically when slider is dragged manually
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTargetProgress(val);
    
    // Determine closest active level depending on dismantle depth
    if (val < 0.1) {
      setActiveLevel(0); // Assembled
    } else if (val < 0.3) {
      setActiveLevel(1);
    } else if (val < 0.5) {
      setActiveLevel(2);
    } else if (val < 0.7) {
      setActiveLevel(3);
    } else if (val < 0.9) {
      setActiveLevel(4);
    } else {
      setActiveLevel(5);
    }
  };

  // Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationFrameId: number;
    let smoothScroll = 0; // local lerp scroll
    let cameraAngle = 0.5; // slow rot
    let px = 0;
    let py = 0;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width || 600;
      const h = rect?.height || 500;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Coordinate projections helper
    const project = (
      pt: Point3D, 
      centerX: number, 
      centerY: number, 
      yaw: number, 
      pitch: number, 
      fov: number, 
      zoom: number
    ): ProjectedPoint => {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      let x1 = pt.x * cosY - pt.z * sinY;
      let z1 = pt.x * sinY + pt.z * cosY;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      let y2 = pt.y * cosP - z1 * sinP;
      let z2 = pt.y * sinP + z1 * cosP;

      const distance = 800 * zoom;
      const scale = fov / (fov + z2 + distance);
      
      return {
        x: centerX + x1 * scale * 3.1,
        y: centerY + y2 * scale * 3.1,
        scale: scale,
        zDepth: z2
      };
    };

    // Helper: Draw projected 3D cuboid
    const drawCuboid = (
      origin: Point3D, 
      size: { w: number; h: number; d: number }, 
      offsetY: number, 
      offsetX: number,
      rotateYOffset: number,
      centerX: number, 
      centerY: number, 
      yaw: number, 
      pitch: number, 
      fov: number, 
      zoom: number,
      edgeColor: string,
      fillColor: string,
      highlightType: "ring" | "grids" | "columns" | "ledgers" | "circuits" | "none",
      pulseFactor: number,
      isHighlighted: boolean
    ) => {
      const w = size.w;
      const h = size.h;
      const d = size.d;

      const localYaw = yaw + rotateYOffset;

      const baseVertices: Point3D[] = [
        { x: origin.x - w/2 + offsetX, y: origin.y - h/2 + offsetY, z: origin.z - d/2 },
        { x: origin.x + w/2 + offsetX, y: origin.y - h/2 + offsetY, z: origin.z - d/2 },
        { x: origin.x + w/2 + offsetX, y: origin.y + h/2 + offsetY, z: origin.z - d/2 },
        { x: origin.x - w/2 + offsetX, y: origin.y + h/2 + offsetY, z: origin.z - d/2 },
        { x: origin.x - w/2 + offsetX, y: origin.y - h/2 + offsetY, z: origin.z + d/2 },
        { x: origin.x + w/2 + offsetX, y: origin.y - h/2 + offsetY, z: origin.z + d/2 },
        { x: origin.x + w/2 + offsetX, y: origin.y + h/2 + offsetY, z: origin.z + d/2 },
        { x: origin.x - w/2 + offsetX, y: origin.y + h/2 + offsetY, z: origin.z + d/2 },
      ];

      const projected = baseVertices.map(v => project(v, centerX, centerY, localYaw, pitch, fov, zoom));

      const faces = [
        { indices: [0, 1, 2, 3] },
        { indices: [4, 5, 6, 7] },
        { indices: [0, 1, 5, 4] },
        { indices: [2, 3, 7, 6] },
        { indices: [0, 3, 7, 4] },
        { indices: [1, 2, 6, 5] }
      ];

      const sortedFaces = faces.map(face => {
        const sumZ = face.indices.reduce((sum, idx) => sum + projected[idx].zDepth, 0);
        return { ...face, avgZ: sumZ / 4 };
      }).sort((a, b) => b.avgZ - a.avgZ);

      // Render outer structure
      sortedFaces.forEach(face => {
        ctx.beginPath();
        ctx.moveTo(projected[face.indices[0]].x, projected[face.indices[0]].y);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(projected[face.indices[i]].x, projected[face.indices[i]].y);
        }
        ctx.closePath();
        
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.strokeStyle = isHighlighted ? "rgba(0, 229, 255, 0.9)" : edgeColor;
        ctx.lineWidth = isHighlighted ? 1.6 : 0.8;
        ctx.stroke();
      });

      // Render internal cyber elements if highlighted/active
      if (highlightType === "ring" && (isHighlighted || pulseFactor > 0)) {
        const centerPt = project({ x: origin.x + offsetX, y: origin.y + offsetY, z: origin.z }, centerX, centerY, localYaw, pitch, fov, zoom);
        const rad = 24 * centerPt.scale;
        
        const circleGrad = ctx.createRadialGradient(centerPt.x, centerPt.y, 1, centerPt.x, centerPt.y, rad * 3);
        circleGrad.addColorStop(0, `rgba(124, 58, 237, ${0.35 * pulseFactor})`);
        circleGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = circleGrad;
        ctx.beginPath();
        ctx.arc(centerPt.x, centerPt.y, rad * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(0, 229, 255, ${0.6 + Math.sin(Date.now() / 200) * 0.25})`;
        ctx.beginPath();
        ctx.arc(centerPt.x, centerPt.y, rad * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(0, 229, 255, ${0.5 * pulseFactor})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.ellipse(centerPt.x, centerPt.y, rad * 1.5, rad * 0.4, Math.PI / 6 + Date.now() / 1500, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (highlightType === "grids" && (isHighlighted || pulseFactor > 0)) {
        const t1 = project({ x: origin.x - w/3 + offsetX, y: origin.y + offsetY, z: origin.z - d/3 }, centerX, centerY, localYaw, pitch, fov, zoom);
        
        ctx.strokeStyle = "rgba(0, 229, 255, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const laserYOffset = Math.sin(Date.now() / 400) * h/2.1;
        const lineStart = project({ x: origin.x - w/2 + offsetX, y: origin.y + laserYOffset + offsetY, z: origin.z - d/2 }, centerX, centerY, localYaw, pitch, fov, zoom);
        const lineEnd = project({ x: origin.x + w/2 + offsetX, y: origin.y + laserYOffset + offsetY, z: origin.z + d/2 }, centerX, centerY, localYaw, pitch, fov, zoom);
        ctx.moveTo(lineStart.x, lineStart.y);
        ctx.lineTo(lineEnd.x, lineEnd.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(0, 229, 255, ${0.08 * pulseFactor})`;
        ctx.fillRect(t1.x - 30, t1.y - 20, 60, 20);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.3 * pulseFactor})`;
        ctx.strokeRect(t1.x - 30, t1.y - 20, 60, 20);
        
        ctx.fillStyle = `#00E5FF`;
        ctx.font = "8px monospace";
        ctx.fillText("TASKS", t1.x - 22, t1.y - 8);
      }

      if (highlightType === "columns" && (isHighlighted || pulseFactor > 0)) {
        const pillarCoords = [
          { x: -w/3, z: -d/3 },
          { x: w/3, z: -d/3 },
          { x: -w/3, z: d/3 },
          { x: w/3, z: d/3 }
        ];

        pillarCoords.forEach(c => {
          const pBot = project({ x: origin.x + c.x + offsetX, y: origin.y + h/2 + offsetY, z: origin.z + c.z }, centerX, centerY, localYaw, pitch, fov, zoom);
          const pTop = project({ x: origin.x + c.x + offsetX, y: origin.y - h/2 + offsetY, z: origin.z + c.z }, centerX, centerY, localYaw, pitch, fov, zoom);
          
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.3 * pulseFactor})`;
          ctx.lineWidth = 2 * pBot.scale;
          ctx.beginPath();
          ctx.moveTo(pBot.x, pBot.y);
          ctx.lineTo(pTop.x, pTop.y);
          ctx.stroke();
        });
      }

      if (highlightType === "ledgers" && (isHighlighted || pulseFactor > 0)) {
        const pCore = project({ x: origin.x + offsetX, y: origin.y + offsetY, z: origin.z }, centerX, centerY, localYaw, pitch, fov, zoom);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.6 * pulseFactor})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const escRad = 32 * pCore.scale;
        ctx.ellipse(pCore.x, pCore.y, escRad, escRad * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#10B981";
        ctx.font = "bold 8px monospace";
        ctx.fillText("ESCROW ₹", pCore.x - 22, pCore.y + 3);
      }

      if (highlightType === "circuits" && (isHighlighted || pulseFactor > 0)) {
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 * pulseFactor})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          const pA = project({ x: origin.x - w/2 + i * (w/4) + offsetX, y: origin.y - h/2 + offsetY, z: origin.z - d/2 }, centerX, centerY, localYaw, pitch, fov, zoom);
          const pB = project({ x: origin.x - w/2 + i * (w/4) + offsetX, y: origin.y + h/2 + offsetY, z: origin.z + d/2 }, centerX, centerY, localYaw, pitch, fov, zoom);
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();
        }
      }
    };

    // Ambient particles
    const ambientMotes: Array<{ x: number; y: number; s: number; alpha: number; speed: number }> = [];
    for (let i = 0; i < 15; i++) {
      ambientMotes.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        s: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.3 + 0.1
      });
    }

    const render = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      if (w <= 0 || h <= 0) return;

      ctx.clearRect(0, 0, w, h);

      // Smooth inertia logic (interpolates smoothly towards targetProgress)
      smoothScroll += (targetProgress - smoothScroll) * 0.08;
      cameraAngle += 0.0025; // slow rot

      px += (mouseParallax.targetX - px) * 0.05;
      py += (mouseParallax.targetY - py) * 0.05;

      const activeYaw = cameraAngle + (px * 0.15);
      const activePitch = 0.45 + (py * 0.1); 
      
      const fov = 650;
      const zoom = 0.95 - (smoothScroll * 0.18); 
      const centerX = w * 0.5; // perfectly centered inside parent container
      const centerY = h * 0.52;

      // Telemetry matrix grids
      ctx.strokeStyle = "rgba(0, 229, 255, 0.018)";
      ctx.lineWidth = 0.5;
      const gridCount = 6;
      for (let i = -gridCount; i <= gridCount; i++) {
        const ptA = project({ x: i * 110, y: 150, z: -gridCount * 110 }, centerX, centerY, activeYaw, activePitch, fov, zoom);
        const ptB = project({ x: i * 110, y: 150, z: gridCount * 110 }, centerX, centerY, activeYaw, activePitch, fov, zoom);
        ctx.beginPath();
        ctx.moveTo(ptA.x, ptA.y);
        ctx.lineTo(ptB.x, ptB.y);
        ctx.stroke();

        const ptC = project({ x: -gridCount * 110, y: 150, z: i * 110 }, centerX, centerY, activeYaw, activePitch, fov, zoom);
        const ptD = project({ x: gridCount * 110, y: 150, z: i * 110 }, centerX, centerY, activeYaw, activePitch, fov, zoom);
        ctx.beginPath();
        ctx.moveTo(ptC.x, ptC.y);
        ctx.lineTo(ptD.x, ptD.y);
        ctx.stroke();
      }

      // Atmospheric spotlight backglow
      const gradFog = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 220);
      gradFog.addColorStop(0, "rgba(20, 10, 45, 0.08)");
      gradFog.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradFog;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 300, 0, Math.PI * 2);
      ctx.fill();

      // Ambient motes particles updates
      ambientMotes.forEach(mote => {
        mote.y -= mote.speed;
        if (mote.y < 0) mote.y = h;
        ctx.fillStyle = `rgba(0, 229, 255, ${mote.alpha * (0.8 + Math.sin(Date.now() / 400 + mote.x) * 0.2)})`;
        ctx.beginPath();
        ctx.arc(mote.x % w, mote.y % h, mote.s, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3D BUILDING LAYERS
      const buildingSlabWidth = 125;
      const buildingSlabLength = 125;
      const baseHeight = -25;

      const levelsConfig = [
        {
          id: 1, // BASE: Systems Router
          origin: { x: 0, y: baseHeight + 90, z: 0 },
          size: { w: buildingSlabWidth, h: 20, d: buildingSlabLength },
          offsetY: smoothScroll * 120, // slides down
          offsetX: 0,
          rotateY: -smoothScroll * 0.12,
          edgeColor: "rgba(37, 99, 235, 0.45)", 
          fillColor: "rgba(10, 20, 50, 0.28)",
          highlight: "circuits" as const
        },
        {
          id: 2, // LEVEL 2: Escrow Finance Core
          origin: { x: 0, y: baseHeight + 40, z: 0 },
          size: { w: buildingSlabWidth, h: 20, d: buildingSlabLength },
          offsetY: smoothScroll * 60, 
          offsetX: -smoothScroll * 50, // flies left
          rotateY: smoothScroll * 0.25, 
          edgeColor: "rgba(16, 185, 129, 0.55)", 
          fillColor: "rgba(10, 45, 25, 0.28)",
          highlight: "ledgers" as const
        },
        {
          id: 3, // LEVEL 3: Labour Biometrics
          origin: { x: 0, y: baseHeight - 10, z: 0 },
          size: { w: buildingSlabWidth, h: 22, d: buildingSlabLength },
          offsetY: 0, 
          offsetX: smoothScroll * 50, // flies right
          rotateY: -smoothScroll * 0.2,
          edgeColor: "rgba(168, 85, 247, 0.55)", 
          fillColor: "rgba(35, 15, 45, 0.28)",
          highlight: "columns" as const
        },
        {
          id: 4, // LEVEL 4: Project Management Grid
          origin: { x: 0, y: baseHeight - 60, z: 0 },
          size: { w: buildingSlabWidth, h: 20, d: buildingSlabLength },
          offsetY: -smoothScroll * 60, 
          offsetX: -smoothScroll * 35, // flies left
          rotateY: smoothScroll * 0.12,
          edgeColor: "rgba(6, 182, 212, 0.55)", 
          fillColor: "rgba(10, 35, 45, 0.28)",
          highlight: "grids" as const
        },
        {
          id: 5, // LEVEL 5: Gemini AI DPR Automation
          origin: { x: 0, y: baseHeight - 110, z: 0 },
          size: { w: buildingSlabWidth, h: 22, d: buildingSlabLength },
          offsetY: -smoothScroll * 120, // lifts high
          offsetX: smoothScroll * 35, // flies right
          rotateY: -smoothScroll * 0.35,
          edgeColor: "rgba(124, 58, 237, 0.65)", 
          fillColor: "rgba(25, 10, 45, 0.32)",
          highlight: "ring" as const
        },
        {
          id: 6, // ROOF / RADAR CONE
          origin: { x: 0, y: baseHeight - 150, z: 0 },
          size: { w: buildingSlabWidth * 0.8, h: 10, d: buildingSlabLength * 0.8 },
          offsetY: -smoothScroll * 180, // stratospheric launch
          offsetX: 0,
          rotateY: smoothScroll * 0.5,
          edgeColor: "rgba(0, 229, 255, 0.75)", 
          fillColor: "rgba(10, 45, 50, 0.35)",
          highlight: "none" as const
        }
      ];

      // Draw vertical alignment laser beams when mostly assembled
      if (smoothScroll < 0.5) {
        const lineAlpha = (1 - smoothScroll / 0.5) * 0.2;
        ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        const centerBot = project({ x: 0, y: baseHeight + 95, z: 0 }, centerX, centerY, activeYaw, activePitch, fov, zoom);
        const centerTop = project({ x: 0, y: baseHeight - 155, z: 0 }, centerX, centerY, activeYaw, activePitch, fov, zoom);
        ctx.beginPath();
        ctx.moveTo(centerBot.x, centerBot.y);
        ctx.lineTo(centerTop.x, centerTop.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw levels sequentially
      const pulseVal = 0.8 + Math.sin(Date.now() / 250) * 0.2;
      
      levelsConfig.forEach(lvl => {
        // Highlight layer if it is selected, OR highlight all layers if fully exploded (smoothScroll > 0.8 && activeLevel === 0)
        const isLvlHighlighted = (lvl.id === activeLevel) || (activeLevel === 0 && smoothScroll > 0.8 && lvl.id < 6);
        
        drawCuboid(
          lvl.origin,
          lvl.size,
          lvl.offsetY,
          lvl.offsetX,
          lvl.rotateY,
          centerX,
          centerY,
          activeYaw,
          activePitch,
          fov,
          zoom,
          lvl.edgeColor,
          lvl.fillColor,
          lvl.highlight,
          pulseVal,
          isLvlHighlighted
        );
      });

      // Draw alignment indicators for active level
      levelsConfig.forEach((lvl, i) => {
        if (i === 0 || i === 5) return;
        const isLvlHighlighted = (lvl.id === activeLevel);
        if (!isLvlHighlighted && smoothScroll < 0.6) return;

        const pLoc = project({ 
          x: lvl.origin.x + lvl.offsetX, 
          y: lvl.origin.y + lvl.offsetY, 
          z: lvl.origin.z 
        }, centerX, centerY, activeYaw + lvl.rotateY, activePitch, fov, zoom);
        
        const lineOpacity = isLvlHighlighted ? 0.65 : Math.max(0.04, (smoothScroll - 0.5) * 0.5);
        ctx.strokeStyle = `rgba(0, 229, 255, ${lineOpacity})`;
        ctx.lineWidth = 0.6;
        
        const isLeft = (i % 2 === 0);
        const textTargetX = pLoc.x + (isLeft ? 80 : -80);
        const textTargetY = pLoc.y - 10;

        ctx.beginPath();
        ctx.moveTo(pLoc.x, pLoc.y);
        ctx.lineTo(textTargetX, textTargetY);
        ctx.lineTo(textTargetX + (isLeft ? 20 : -20), textTargetY);
        ctx.stroke();

        ctx.fillStyle = `rgba(0, 229, 255, ${lineOpacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(pLoc.x, pLoc.y, 2, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = isLvlHighlighted ? "#00E5FF" : `rgba(248, 250, 252, ${lineOpacity * 1.2})`;
        ctx.font = isLvlHighlighted ? "bold 8.5px monospace" : "7.5px monospace";
        ctx.fillText(
          `LVL_0${lvl.id}`, 
          textTargetX + (isLeft ? 5 : -35), 
          textTargetY + 3
        );
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [targetProgress, activeLevel, mouseParallax]);

  // Smooth scroll helper to navigate on-click
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="glass-panel-heavy p-6 rounded-2xl relative overflow-hidden w-full min-h-[520px] mb-8 border border-white/5 shadow-2xl transition-all"
    >
      {/* Decorative scanner line running back and forth */}
      <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF]/45 to-transparent animate-pulse pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* LEFT COLUMN: Highly Styled Cybernetic Controls & Telemetry Data */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Modular Title Badge */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-ping" />
              <span className="font-mono text-[10px] text-[#00E5FF] font-bold uppercase tracking-widest bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2.5 py-0.5 rounded">
                Interactive Citadel Blueprint OS
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold font-display tracking-tight leading-none uppercase text-slate-100">
                Citadel 3D Core <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E5FF] to-purple-500">
                  Dismantle Station
                </span>
              </h2>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Explore your complete project architecture inside an immersive 3D telemetry display. Select layers or slide the controller to audit isolated logistical nodes in real-time.
            </p>
          </div>

          {/* ACTIVE CONTENT VIEWPORT CARD */}
          <div className="bg-zinc-950/80 p-4.5 rounded-xl border border-white/5 relative overflow-hidden min-h-[170px] flex flex-col justify-between scanlines">
            <div className="absolute top-3 right-3 bg-purple-950/60 border border-purple-800/40 text-purple-400 text-[8px] font-mono px-2 py-0.5 rounded tracking-widest uppercase">
              Holographic Data Buffer
            </div>

            {/* Level 0: Assembled */}
            {activeLevel === 0 && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                  CITADEL // ASSEMBLED TOWER PLATE
                </div>
                <h4 className="font-display font-black text-md text-slate-100 uppercase tracking-tight">
                  Unified Smart Citadel
                </h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed">
                  All 5 operating levels are stacked and synchronized. Slide the manual explosion controller below to separate structural slabs and inspect ground-truth telemetry logs.
                </p>
              </div>
            )}

            {/* Level 5: AI Reports */}
            {activeLevel === 5 && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="text-[10px] font-mono text-purple-400 flex items-center gap-1.5 font-bold uppercase">
                  <Cpu className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                  LEVEL 05 // AI DPR CONE AUTOMATION
                </div>
                <h4 className="font-display font-black text-md text-slate-100 uppercase tracking-tight">
                  Gemini Intelligence Sector
                </h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed">
                  Active processing unit tracks site diaries, concrete batches, and logistics. Compiles markdown summaries instantly using localized semantic intelligence.
                </p>
                <button
                  onClick={() => scrollToSection("ai-dpr-section")}
                  className="inline-flex items-center gap-1 font-mono text-[9px] text-[#00E5FF] hover:underline hover:gap-1.5 transition-all text-left uppercase font-bold pt-1 cursor-pointer"
                >
                  Jump to AI Reports Section <ArrowRight className="w-3 h-3 text-[#00E5FF]" />
                </button>
              </div>
            )}

            {/* Level 4: Project Control */}
            {activeLevel === 4 && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 font-bold uppercase">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  LEVEL 04 // PROJECT CONTROL MATRIX
                </div>
                <h4 className="font-display font-black text-md text-slate-100 uppercase tracking-tight">
                  Realtime Milestone Grids
                </h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed">
                  Active structural checkpoint boards. Tracks real-time completion status and cycles assignments on the ground with full telemetry verification.
                </p>
                <button
                  onClick={() => scrollToSection("pulse-section")}
                  className="inline-flex items-center gap-1 font-mono text-[9px] text-[#00E5FF] hover:underline hover:gap-1.5 transition-all text-left uppercase font-bold pt-1 cursor-pointer"
                >
                  Jump to Milestone Checklist <ArrowRight className="w-3 h-3 text-[#00E5FF]" />
                </button>
              </div>
            )}

            {/* Level 3: Workforce Biometrics */}
            {activeLevel === 3 && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="text-[10px] font-mono text-purple-300 flex items-center gap-1.5 font-bold uppercase">
                  <Network className="w-3.5 h-3.5 text-purple-300" />
                  LEVEL 03 // SECURE BIOMETRICS LABOUR
                </div>
                <h4 className="font-display font-black text-md text-slate-100 uppercase tracking-tight">
                  Biometric Workforce Analytics
                </h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed">
                  Calculates live presence on-site. Automatically synchronizes crew registry checks via digital smart gate scanner simulations.
                </p>
                <button
                  onClick={() => scrollToSection("labour-section")}
                  className="inline-flex items-center gap-1 font-mono text-[9px] text-[#00E5FF] hover:underline hover:gap-1.5 transition-all text-left uppercase font-bold pt-1 cursor-pointer"
                >
                  Jump to Biometric Simulator <ArrowRight className="w-3 h-3 text-[#00E5FF]" />
                </button>
              </div>
            )}

            {/* Level 2: Finance Escrow */}
            {activeLevel === 2 && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  LEVEL 02 // ESCROW FINANCE CORE
                </div>
                <h4 className="font-display font-black text-md text-slate-100 uppercase tracking-tight">
                  Razorpay Escrow Ledger
                </h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed">
                  Tracks invoice outflows and committed liabilities. Simulates instant material payments via a secured Razorpay checkout link sandbox.
                </p>
                <button
                  onClick={() => scrollToSection("financial-section")}
                  className="inline-flex items-center gap-1 font-mono text-[9px] text-[#00E5FF] hover:underline hover:gap-1.5 transition-all text-left uppercase font-bold pt-1 cursor-pointer"
                >
                  Jump to Razorpay Ledger <ArrowRight className="w-3 h-3 text-[#00E5FF]" />
                </button>
              </div>
            )}

            {/* Level 1: Foundation Network */}
            {activeLevel === 1 && (
              <div className="space-y-2.5 animate-fade-in">
                <div className="text-[10px] font-mono text-blue-400 flex items-center gap-1.5 font-bold uppercase">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  LEVEL 01 // CITADEL ROUTING LOOP
                </div>
                <h4 className="font-display font-black text-md text-slate-100 uppercase tracking-tight">
                  Fiber Network Foundation
                </h4>
                <p className="text-zinc-400 text-[10.5px] leading-relaxed">
                  Base platform coordinates site metadata and GPS records. Gathers live geotagged photo reels with exact location stamps.
                </p>
                <button
                  onClick={() => scrollToSection("geotag-section")}
                  className="inline-flex items-center gap-1 font-mono text-[9px] text-[#00E5FF] hover:underline hover:gap-1.5 transition-all text-left uppercase font-bold pt-1 cursor-pointer"
                >
                  Jump to Geotagged Media <ArrowRight className="w-3 h-3 text-[#00E5FF]" />
                </button>
              </div>
            )}
          </div>

          {/* SLIDER & CONTROLLER INTERFACE */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase font-bold">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-[#00E5FF]" />
                MANUAL EXPLOSION CONTROL
              </span>
              <span className="text-[#00E5FF] font-black">{Math.round(targetProgress * 100)}%</span>
            </div>

            <div className="relative flex items-center">
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value={targetProgress}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#00E5FF] border border-white/5"
              />
            </div>
            
            <p className="text-[9px] font-mono text-zinc-500 italic">
              *Drag slider to manually explode layers, or click tabs below to snap and inspect.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: The Interactive 3D Skyscraper Canvas Element */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-black/60 border border-white/5 rounded-2xl p-4 min-h-[380px] lg:min-h-[480px] relative overflow-hidden group">
          
          {/* Top HUD Telemetry header */}
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none select-none z-10">
            <Compass className="w-4 h-4 text-[#00E5FF] animate-spin" style={{ animationDuration: '8s' }} />
            <div className="font-mono text-[9px] text-zinc-500 leading-none">
              <div className="text-zinc-300 font-bold uppercase tracking-wider mb-0.5">3D BLUEPRINT VIEWER</div>
              <div>ROT_Y: {(0.5 + mouseParallax.targetX * 0.15).toFixed(2)} rad // PITCH: {(0.45 + mouseParallax.targetY * 0.1).toFixed(2)} rad</div>
            </div>
          </div>

          {/* Right status badge */}
          <div className="absolute top-4 right-4 bg-zinc-950 border border-white/5 px-2.5 py-1 rounded text-[8.5px] font-mono text-[rgba(0,229,255,0.85)] uppercase tracking-wider pointer-events-none select-none z-10">
            {activeLevel === 0 ? "STATE: ASSEMBLED" : `FOCUS: LEVEL 0${activeLevel}`}
          </div>

          {/* Compass layout background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center opacity-5">
            <div className="w-[320px] h-[320px] rounded-full border border-dashed border-[#00E5FF] animate-spin" style={{ animationDuration: '60s' }}></div>
            <div className="absolute w-[240px] h-[240px] rounded-full border border-dotted border-purple-500 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
          </div>

          {/* Main Drawing Canvas */}
          <div className="w-full h-full min-h-[300px] flex-1 relative flex items-center justify-center">
            <canvas ref={canvasRef} className="cursor-grab active:cursor-grabbing w-full h-full block" />
          </div>

          {/* LEVEL BUTTON SELECTOR TABS (Bottom HUD Bar) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-4 border-t border-white/5 relative z-10 font-mono text-[9px]">
            <button
              onClick={() => selectLevel(0)}
              className={`py-2 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                activeLevel === 0 
                  ? "glass-btn-cyan text-cyan-400 border-cyan-500/20 shadow-md" 
                  : "glass-btn text-zinc-500 border-white/5 hover:text-slate-200"
              }`}
            >
              ASSEMBLED
            </button>
            <button
              onClick={() => selectLevel(5)}
              className={`py-2 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                activeLevel === 5 
                  ? "glass-btn-cyan text-cyan-400 border-cyan-500/20 shadow-md" 
                  : "glass-btn text-zinc-500 border-white/5 hover:text-slate-200"
              }`}
            >
              LVL 5
            </button>
            <button
              onClick={() => selectLevel(4)}
              className={`py-2 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                activeLevel === 4 
                  ? "glass-btn-cyan text-cyan-400 border-cyan-500/20 shadow-md" 
                  : "glass-btn text-zinc-500 border-white/5 hover:text-slate-200"
              }`}
            >
              LVL 4
            </button>
            <button
              onClick={() => selectLevel(3)}
              className={`py-2 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                activeLevel === 3 
                  ? "glass-btn-cyan text-cyan-400 border-cyan-500/20 shadow-md" 
                  : "glass-btn text-zinc-500 border-white/5 hover:text-slate-200"
              }`}
            >
              LVL 3
            </button>
            <button
              onClick={() => selectLevel(2)}
              className={`py-2 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                activeLevel === 2 
                  ? "glass-btn-cyan text-cyan-400 border-cyan-500/20 shadow-md" 
                  : "glass-btn text-zinc-500 border-white/5 hover:text-slate-200"
              }`}
            >
              LVL 2
            </button>
            <button
              onClick={() => selectLevel(1)}
              className={`py-2 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                activeLevel === 1 
                  ? "glass-btn-cyan text-cyan-400 border-cyan-500/20 shadow-md" 
                  : "glass-btn text-zinc-500 border-white/5 hover:text-slate-200"
              }`}
            >
              LVL 1
            </button>
          </div>

        </div>

      </div>
      
    </div>
  );
}
