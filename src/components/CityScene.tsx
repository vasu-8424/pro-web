import { useEffect, useRef, useState } from "react";

export default function CityScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.6 });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Tracks rotation angle over time
  const angleRef = useRef(0);
  // Tracks crane specific rotation angle over time
  const craneAngleRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMouse({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = (rect?.width || 600) * window.devicePixelRatio;
      canvas.height = (rect?.height || 500) * window.devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 3D Point Projection Helper
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    const project = (pt: Point3D, angleY: number, angleX: number, width: number, height: number) => {
      // Rotate around Y axis
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      let x1 = pt.x * cosY - pt.z * sinY;
      let z1 = pt.x * sinY + pt.z * cosY;

      // Rotate around X axis
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      let y2 = pt.y * cosX - z1 * sinX;
      let z2 = pt.y * sinX + z1 * cosX;

      // Simple perspective projection
      const fov = 350;
      const distance = 400;
      const scale = fov / (distance + z2);

      const px = width / 2 + x1 * scale;
      const py = height / 2 - y2 * scale;

      return { x: px, y: py, depth: z2, scale };
    };

    // Define vertices of our futuristic digital construction site
    const gridLines: Point3D[][] = [];
    const gridSize = 160;
    const gridDivs = 8;
    for (let i = 0; i <= gridDivs; i++) {
      const cursor = -gridSize / 2 + (gridSize * i) / gridDivs;
      // Lines along Z
      gridLines.push([
        { x: cursor, y: -50, z: -gridSize / 2 },
        { x: cursor, y: -50, z: gridSize / 2 },
      ]);
      // Lines along X
      gridLines.push([
        { x: -gridSize / 2, y: -50, z: cursor },
        { x: gridSize / 2, y: -50, z: cursor },
      ]);
    }

    // Modern towers
    const towers = [
      { x: -50, z: -30, w: 25, h: 140, layers: 7 },
      { x: 30, z: -40, w: 30, h: 180, layers: 9 },
      { x: 10, z: 40, w: 20, h: 100, layers: 5 },
      { x: -40, z: 40, w: 22, h: 120, layers: 6 },
    ];

    // Crane elements
    const craneBase: Point3D = { x: 45, y: -50, z: 10 };
    const craneHeight = 130;

    // Floating site particles
    const particles: (Point3D & { vy: number; rawY: number })[] = Array.from({ length: 40 }, () => {
      const y = -50 + Math.random() * 150;
      return {
        x: -80 + Math.random() * 160,
        rawY: y,
        y: y,
        z: -80 + Math.random() * 160,
        vy: 0.15 + Math.random() * 0.25,
      };
    });

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Deep space clearing
      ctx.clearRect(0, 0, w, h);

      // Slow idle rotation + mouse parallax interpolation
      angleRef.current += 0.0035;
      const currentAngleY = angleRef.current + mouse.x * 0.25;
      const currentAngleX = 0.45 + mouse.y * 0.15;

      // Draw Grid Matrix
      ctx.lineWidth = 1;
      gridLines.forEach((line) => {
        const p1 = project(line[0], currentAngleY, currentAngleX, w, h);
        const p2 = project(line[1], currentAngleY, currentAngleX, w, h);

        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, "rgba(37, 99, 235, 0.0)");
        grad.addColorStop(0.5, "rgba(124, 58, 237, 0.22)");
        grad.addColorStop(1, "rgba(37, 99, 235, 0.0)");

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw Digital Towers (layer-by-layer wireframes)
      towers.forEach((tower, tIdx) => {
        const topH = -50 + tower.h;
        // Draw vertical columns
        const basePts: Point3D[] = [
          { x: tower.x - tower.w / 2, y: -50, z: tower.z - tower.w / 2 },
          { x: tower.x + tower.w / 2, y: -50, z: tower.z - tower.w / 2 },
          { x: tower.x + tower.w / 2, y: -50, z: tower.z + tower.w / 2 },
          { x: tower.x - tower.w / 2, y: -50, z: tower.z + tower.w / 2 },
        ];

        // Core central beam
        const coreBottom = project({ x: tower.x, y: -50, z: tower.z }, currentAngleY, currentAngleX, w, h);
        const coreTop = project({ x: tower.x, y: topH, z: tower.z }, currentAngleY, currentAngleX, w, h);
        ctx.strokeStyle = "rgba(0, 229, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(coreBottom.x, coreBottom.y);
        ctx.lineTo(coreTop.x, coreTop.y);
        ctx.stroke();

        // Layer loops
        for (let l = 0; l <= tower.layers; l++) {
          const ratio = l / tower.layers;
          const currentY = -50 + tower.h * ratio;

          const ringPts = basePts.map((pt) => ({ ...pt, y: currentY }));
          const projectedRing = ringPts.map((pt) => project(pt, currentAngleY, currentAngleX, w, h));

          // Draw ring
          ctx.beginPath();
          projectedRing.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.closePath();

          // Coloring based on heights
          // Top structural ring glows in neon violet, base in deep indigo
          const alphaIdx = 0.1 + (ratio * 0.45);
          ctx.strokeStyle = tIdx === 1 ? `rgba(124, 58, 237, ${alphaIdx})` : `rgba(37, 99, 235, ${alphaIdx})`;
          ctx.lineWidth = l === tower.layers ? 1.5 : 1;
          ctx.stroke();

          // Intersecting diagonals for structural look
          if (l < tower.layers) {
            const nextY = -50 + tower.h * ((l + 1) / tower.layers);
            const nextRingPts = basePts.map((pt) => ({ ...pt, y: nextY }));
            const projectedNextRing = nextRingPts.map((pt) => project(pt, currentAngleY, currentAngleX, w, h));

            ctx.beginPath();
            ctx.moveTo(projectedRing[0].x, projectedRing[0].y);
            ctx.lineTo(projectedNextRing[2].x, projectedNextRing[2].y);
            ctx.moveTo(projectedRing[1].x, projectedRing[1].y);
            ctx.lineTo(projectedNextRing[3].x, projectedNextRing[3].y);
            ctx.strokeStyle = "rgba(124, 58, 237, 0.05)";
            ctx.stroke();
          }
        }

        // Verticals columns
        for (let c = 0; c < 4; c++) {
          const pBottom = project(basePts[c], currentAngleY, currentAngleX, w, h);
          const pTop = project({ ...basePts[c], y: topH }, currentAngleY, currentAngleX, w, h);

          ctx.beginPath();
          ctx.moveTo(pBottom.x, pBottom.y);
          ctx.lineTo(pTop.x, pTop.y);
          ctx.strokeStyle = `rgba(124, 58, 237, 0.25)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw Rotating Crane (Futuristic Construction Crane)
      const craneY = -50 + craneHeight;
      const craneTopCenter = { x: craneBase.x, y: craneY, z: craneBase.z };
      
      const topCenterProj = project(craneTopCenter, currentAngleY, currentAngleX, w, h);

      // Distance-based crane rotation speed tracking (mouse distance to crane top center)
      let speedScale = 1.0;
      if (isHovered) {
        const mouseX = w / 2 + mouse.x * (w / 2);
        const mouseY = h / 2 + mouse.y * (h / 2);
        const dx = mouseX - topCenterProj.x;
        const dy = mouseY - topCenterProj.y;
        const screenDist = Math.sqrt(dx * dx + dy * dy);

        // Within 180px radius, speed increases significantly
        const activeRadius = 180;
        if (screenDist < activeRadius) {
          const proximity = 1.0 - (screenDist / activeRadius);
          // Scale multiplier smoothly up to 7.0x depending on closeness
          speedScale = 1.0 + proximity * 6.0;
        }
      }

      // Continuously rotate crane on its own axis by scaling its base speed
      const craneBaseSpeed = 0.012;
      craneAngleRef.current += craneBaseSpeed * speedScale;

      // Draw Mast (Vertical Truss Setup)
      const segments = 5;
      ctx.lineWidth = 1;
      let prevProj = project(craneBase, currentAngleY, currentAngleX, w, h);
      for (let s = 1; s <= segments; s++) {
        const progressY = -50 + (craneHeight * s) / segments;
        const currentMastPt = { x: craneBase.x, y: progressY, z: craneBase.z };
        const nextProj = project(currentMastPt, currentAngleY, currentAngleX, w, h);

        // Main line
        ctx.beginPath();
        ctx.moveTo(prevProj.x, prevProj.y);
        ctx.lineTo(nextProj.x, nextProj.y);
        ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
        ctx.stroke();

        // Draw structural triangular extensions
        const leftP = project({ x: craneBase.x - 6, y: progressY - 12, z: craneBase.z }, currentAngleY, currentAngleX, w, h);
        ctx.beginPath();
        ctx.moveTo(prevProj.x, prevProj.y);
        ctx.lineTo(leftP.x, leftP.y);
        ctx.lineTo(nextProj.x, nextProj.y);
        ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
        ctx.stroke();

        prevProj = nextProj;
      }

      // Crane Jib (rotates continuously on its own axis, influenced by hover proximity)
      const jibAngle = craneAngleRef.current;
      const jibLength = 55;
      const jibCounterWeight = 18;
      
      const jibEnd = {
        x: craneBase.x + Math.sin(jibAngle) * jibLength,
        y: craneY,
        z: craneBase.z + Math.cos(jibAngle) * jibLength,
      };
      const jibCounter = {
        x: craneBase.x - Math.sin(jibAngle) * jibCounterWeight,
        y: craneY,
        z: craneBase.z - Math.cos(jibAngle) * jibCounterWeight,
      };

      const jibEndProj = project(jibEnd, currentAngleY, currentAngleX, w, h);
      const jibCounterProj = project(jibCounter, currentAngleY, currentAngleX, w, h);

      // Draw Main Horizontal Jib Outline
      ctx.beginPath();
      ctx.moveTo(jibCounterProj.x, jibCounterProj.y);
      ctx.lineTo(jibEndProj.x, jibEndProj.y);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.7)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Top pivot mast
      const apex = { x: craneBase.x, y: craneY + 18, z: craneBase.z };
      const apexProj = project(apex, currentAngleY, currentAngleX, w, h);

      ctx.beginPath();
      ctx.moveTo(topCenterProj.x, topCenterProj.y);
      ctx.lineTo(apexProj.x, apexProj.y);
      ctx.lineTo(jibEndProj.x, jibEndProj.y);
      ctx.moveTo(apexProj.x, apexProj.y);
      ctx.lineTo(jibCounterProj.x, jibCounterProj.y);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw telemetry overlay line and text near crane top center
      ctx.beginPath();
      ctx.moveTo(topCenterProj.x, topCenterProj.y);
      ctx.lineTo(topCenterProj.x + 30, topCenterProj.y - 20);
      ctx.lineTo(topCenterProj.x + 90, topCenterProj.y - 20);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "rgba(0, 229, 255, 0.95)";
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`ROT_SPD: ${speedScale.toFixed(1)}x`, topCenterProj.x + 33, topCenterProj.y - 24);

      // Hanging hook cable (oscillates gracefully)
      const hookX = craneBase.x + Math.sin(jibAngle) * (jibLength * 0.7);
      const hookZ = craneBase.z + Math.cos(jibAngle) * (jibLength * 0.7);
      const cableTop = { x: hookX, y: craneY, z: hookZ };
      
      const swingRatio = Math.sin(angleRef.current * 2) * 3;
      const cableBottom = { x: hookX + swingRatio, y: craneY - 45, z: hookZ };

      const cableTopProj = project(cableTop, currentAngleY, currentAngleX, w, h);
      const cableBottomProj = project(cableBottom, currentAngleY, currentAngleX, w, h);

      ctx.beginPath();
      ctx.moveTo(cableTopProj.x, cableTopProj.y);
      ctx.lineTo(cableBottomProj.x, cableBottomProj.y);
      ctx.strokeStyle = "rgba(248, 250, 252, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glowing load weight payload
      ctx.fillStyle = "rgba(124, 58, 237, 0.85)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#7c3aed";
      ctx.beginPath();
      ctx.arc(cableBottomProj.x, cableBottomProj.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Draw floating site particles (Digital Data Dust)
      particles.forEach((part) => {
        // Move upward
        part.rawY += part.vy;
        if (part.rawY > 150) {
          part.rawY = -50;
        }
        part.y = part.rawY;

        const projPart = project(part, currentAngleY, currentAngleX, w, h);

        // Alpha based on depth and vertical life cycle
        const fadeValue = (1 - (part.rawY + 50) / 200) * 0.5;
        ctx.fillStyle = `rgba(0, 229, 255, ${fadeValue})`;
        ctx.beginPath();
        // Calculate particle diameter based on perspective size
        const size = Math.max(1, 1.5 * projPart.scale);
        ctx.fillRect(projPart.x - size / 2, projPart.y - size / 2, size, size);
      });

      // HUD Ring interface overlay on floor
      ctx.strokeStyle = "rgba(124, 58, 237, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      towers.forEach(() => {
        const floorCenter = project({ x: 0, y: -50, z: 0 }, currentAngleY, currentAngleX, w, h);
        ctx.arc(floorCenter.x, floorCenter.y, 110, 0, Math.PI * 2);
      });
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mouse, isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMouse({ x: 0, y: 0 });
      }}
      className="relative w-full h-[360px] md:h-[500px] flex items-center justify-center p-2 rounded-2xl glass-panel relative overflow-hidden group cursor-crosshair border border-white/5"
    >
      {/* Dynamic Telemetry Info Overlay */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-500 flex flex-col gap-1 pointer-events-none select-none z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-300 font-bold uppercase tracking-widest">3D SITE SCANNER</span>
        </div>
        <div>VECTOR PARALLAX: {mouse.x.toFixed(2)}, {mouse.y.toFixed(2)}</div>
        <div>SCAN ELEVATION: 115.42M</div>
      </div>

      <div className="absolute top-4 right-4 font-mono text-[10px] text-purple-400 font-medium bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30 tracking-wider pointer-events-none select-none z-10">
        ACTIVE CAD CORE
      </div>

      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-zinc-600 max-w-[200px] pointer-events-none select-none z-10">
        Isometric engineering schematic projection. Swipe / hover viewport to trigger relative orbital shifts.
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
