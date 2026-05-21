import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-x-0 top-0 h-full min-h-screen z-0 overflow-hidden pointer-events-none select-none">
      {/* Heavy colorful static radial backdrops in CSS for high-end glassmorphic glow */}
      <div className="absolute top-[-20%] left-[-15%] w-[800px] h-[800px] bg-[#7C3AED] opacity-[0.11] blur-[150px] rounded-full" />
      <div className="absolute bottom-[20%] right-[-10%] w-[700px] h-[700px] bg-[#00E5FF] opacity-[0.07] blur-[150px] rounded-full" />
      <div className="absolute top-[35%] left-[25%] w-[500px] h-[500px] bg-[#2563EB] opacity-[0.04] blur-[130px] rounded-full" />
    </div>
  );
}
