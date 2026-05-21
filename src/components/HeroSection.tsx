import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Play, Pause, Volume2, VolumeX, ShieldAlert, Cpu } from "lucide-react";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Try to play on initial mount to guarantee autoplay workability
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay blocked or video missing", err);
        // Fallback or warning states if browser blocks autoplay
      });
    }
  }, []);

  return (
    <div 
      id="hero-cinematic-viewport"
      className="relative overflow-hidden rounded-2xl border border-white/10 p-6 md:p-8 bg-zinc-950/70 shadow-2xl shadow-[#7C3AED]/5 min-h-[320px] flex flex-col justify-between group transition-all"
    >
      {/* Background cinematic video looping */}
      {!videoError && (
        <video
          ref={videoRef}
          src="/videos/hero-construction.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-[0.22] group-hover:opacity-[0.28] transition-opacity duration-700 select-none pointer-events-none scale-105"
        />
      )}

      {/* Cybernetic overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-950/80 to-purple-950/20 mix-blend-multiply z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-grid opacity-20 pointer-events-none z-0" />
      
      {/* Dynamic scanlines for futuristic monitors */}
      <div className="absolute inset-0 bg-scanlines opacity-[0.12] pointer-events-none z-0" />

      {/* Glowing neon top-left accent line */}
      <div className="absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r from-[#00E5FF] to-purple-500" />
      <div className="absolute top-0 left-0 w-[2px] h-24 bg-gradient-to-b from-[#00E5FF] to-transparent" />

      {/* Hero content info aligned on top of the overlays */}
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/12 text-[#00E5FF] text-[9.5px] font-bold uppercase tracking-[0.2em] shadow-sm select-none">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
          THE FUTURE OPERATING SYSTEM FOR CONSTRUCTION
        </div>

        <h1 className="text-3xl sm:text-4xl xl:text-5xl font-display font-black tracking-tight leading-[1.02] text-slate-100 uppercase">
          The AI Operating System <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#7C3AED]">
            For Infrastructure
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md font-sans">
          ProSite360 delivers Awwwards-grade real-time project intelligence, biometric workforce analytics, automated Daily Progress Reports via Gemini, and instantaneous escrow clearances.
        </p>
      </div>

      {/* Interactive Video Controllers Toolbar for high detail/modularity */}
      <div className="relative z-10 pt-6 mt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
        {/* Playback live state details */}
        <div className="flex items-center gap-2.5">
          <div className="flex gap-0.5 items-end h-3">
            <span className={`w-[2px] bg-[#00E5FF] rounded-full origin-bottom ${isPlaying ? "animate-audio-bar-1 h-3" : "h-1"}`} />
            <span className={`w-[2px] bg-[#00E5FF] rounded-full origin-bottom ${isPlaying ? "animate-audio-bar-2 h-2.5" : "h-1"}`} style={{ animationDelay: '0.15s' }} />
            <span className={`w-[2px] bg-[#00E5FF] rounded-full origin-bottom ${isPlaying ? "animate-audio-bar-3 h-3" : "h-1"}`} style={{ animationDelay: '0.35s' }} />
          </div>
          
          <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-purple-400" />
            <span>VIDEO_LOOP_FEED:</span>
            {videoError ? (
              <span className="text-amber-500 font-bold">MISSING_MEDIA / LOCAL_FALLBACK</span>
            ) : isPlaying ? (
              <span className="text-emerald-400 font-bold animate-pulse">STREAMING COMPLETED_SET_8</span>
            ) : (
              <span className="text-pink-500 font-bold">PAUSED_STREAM</span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!videoError && (
            <>
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                title={isPlaying ? "Pause Feed" : "Play Feed"}
                className="glass-btn w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white cursor-pointer select-none"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#00E5FF]" />}
              </button>

              {/* Mute / Unmute */}
              <button
                onClick={toggleMute}
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
                className="glass-btn w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white cursor-pointer select-none"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-purple-400" />}
              </button>
            </>
          )}

          {/* Quick status report */}
          <div className="text-[8.5px] font-mono bg-zinc-900/60 border border-white/5 text-zinc-400 px-2 py-1 rounded">
            SYS_REF: L_METER_26
          </div>
        </div>
      </div>
    </div>
  );
}
