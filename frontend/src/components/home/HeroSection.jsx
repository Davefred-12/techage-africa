// src/components/home/HeroSection.jsx - JOBLADDA REDESIGN
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight, Star, Target } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden"
      style={{
        background: "#1e2d42",
      }}
    >
      {/* ── BACKGROUND: Plus (+) grid pattern + glows ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

        {/* Plus grid — larger spacing, thinner, lower opacity */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <pattern id="plus-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              {/* Horizontal bar */}
              <rect x="21" y="23" width="6" height="1.2" fill="rgba(255,255,255,0.07)" />
              {/* Vertical bar */}
              <rect x="23" y="21" width="1.2" height="6" fill="rgba(255,255,255,0.07)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plus-grid)" />
        </svg>

        {/* Glow 1 — bottom right corner, large warm orange */}
        <div
          className="absolute"
          style={{
            bottom: "-10%",
            right: "-5%",
            width: "55%",
            height: "80%",
            background: "radial-gradient(ellipse at center, rgba(210,120,20,0.55) 0%, rgba(180,90,10,0.25) 45%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Glow 2 — middle right, smaller, pulsing amber glow */}
        <div
          className="absolute"
          style={{
            top: "20%",
            right: "8%",
            width: "30%",
            height: "50%",
            background: "radial-gradient(ellipse at center, rgba(230,140,30,0.35) 0%, rgba(200,100,10,0.1) 55%, transparent 75%)",
            filter: "blur(35px)",
            animation: "glowPulse 4s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-7">

          {/* Headline — exactly 2 lines */}
          <h1 className="text-5xl sm:text-6xl md:text-[4.2rem] font-black text-white leading-[1.2] tracking-tight whitespace-nowrap">
            Stop Applying Randomly.{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #F88212 0%, #fb923c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Start
            </span>
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #F88212 0%, #fb923c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Getting Hired.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed font-normal">
            JobLadda helps you discover why you're not getting hired and gives
            you a clear path to fix it in 14 days.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-1">
            {/* Primary CTA — orange with target/radar icon */}
            <Button
              size="lg"
              className="bg-[#F88212] hover:bg-[#EA7210] text-white font-bold px-8 h-[52px] rounded-xl text-[15px] shadow-lg shadow-orange-500/30 group transition-all active:scale-95 gap-2"
              onClick={() => navigate("/register")}
            >
              {/* Target/crosshair icon — matches the circular radar icon in the design */}
              <Target className="h-4 w-4 text-white" />
              Take Free Job Readiness Test
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>

            {/* Secondary CTA — dark muted */}
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 bg-[#2a3547] hover:bg-[#323f56] text-gray-200 hover:text-white font-semibold px-8 h-[52px] rounded-xl text-[15px] transition-all active:scale-95 gap-2"
              onClick={() => navigate("/about")}
            >
              <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-bold text-gray-300 flex-shrink-0">
                ?
              </div>
              Learn How It Works
            </Button>
          </div>

          {/* ── STATS — no horizontal line, no vertical dividers ── */}
          <div className="pt-12 mt-4 flex flex-wrap justify-center items-center gap-x-16 gap-y-6">

            <div className="text-center">
              <p className="text-[2rem] font-black text-white leading-none tracking-tight">10K+</p>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1.5">CVs Fixed</p>
            </div>

            <div className="text-center">
              <p className="text-[2rem] font-black text-white leading-none tracking-tight">5K+</p>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1.5">Job Seekers</p>
            </div>

            <div className="text-center">
              <p className="text-[2rem] font-black text-white leading-none tracking-tight">89%</p>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1.5">Interview Rate</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-[2rem] font-black text-white leading-none tracking-tight">4.9</p>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mb-0.5" />
              </div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1.5">User Rating</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;