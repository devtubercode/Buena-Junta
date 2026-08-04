import { useState, useEffect } from "react";
import { ChefHat, Utensils, Coffee, Soup, Pizza } from "lucide-react";

const PHRASES = [
  "Analizando el menú...",
  "Buscando las mejores combinaciones...",
  "Calculando precios y porciones...",
  "¡Casi listo! Armando tu pedido...",
] as const;

const PHRASE_INTERVAL = 3500;
const TOTAL_DOTS = 7;

export default function GeneratingSuggestion() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, PHRASE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="El chef está generando una sugerencia de pedido"
      className="flex flex-col items-center justify-center py-8 text-center"
    >
      <style>{`
        @keyframes chef-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes float-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes sparkle-pop {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes dot-wave {
          0%, 70% { opacity: 0.25; transform: scale(0.8); background-color: var(--primary-soft); }
          82% { opacity: 1; transform: scale(1.35); background-color: var(--primary); }
          92%, 100% { opacity: 0.5; transform: scale(1); background-color: var(--primary); }
        }
        @keyframes shimmer-bar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes text-fade-in {
          0%   { opacity: 0; transform: translateY(8px) scale(0.98); }
          18%  { opacity: 1; transform: translateY(0) scale(1); }
          82%  { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-4px) scale(0.98); }
        }
        @keyframes ring-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .g-chef-pulse { animation: chef-pulse 3s ease-in-out infinite; }
        .g-float-0    { animation: float-icon 2.6s ease-in-out infinite; }
        .g-float-1    { animation: float-icon 2.6s ease-in-out 0.4s infinite; }
        .g-float-2    { animation: float-icon 2.6s ease-in-out 0.8s infinite; }
        .g-float-3    { animation: float-icon 2.6s ease-in-out 1.2s infinite; }
        .g-sparkle-0  { animation: sparkle-pop 2s ease-in-out infinite; }
        .g-sparkle-1  { animation: sparkle-pop 2s ease-in-out 0.4s infinite; }
        .g-sparkle-2  { animation: sparkle-pop 2s ease-in-out 0.8s infinite; }
        .g-sparkle-3  { animation: sparkle-pop 2s ease-in-out 1.2s infinite; }
        .g-text-fade  { animation: text-fade-in 3.5s ease-in-out infinite; }
        .g-shimmer {
          background-size: 200% 100%;
          animation: shimmer-bar 2.5s linear infinite;
        }
        .g-ring {
          animation: ring-spin 14s linear infinite;
          transform-origin: center center;
        }
      `}</style>

      {/* ═══ Chef hat zone ═══ */}
      <div className="relative mb-8">
        {/* Decorative dashed ring */}
        <div
          className="g-ring pointer-events-none absolute inset-[-28px] rounded-full border-2 border-dashed border-primary/15"
          aria-hidden="true"
        />

        {/* Top — Utensils */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "-28px" }}
          aria-hidden="true"
        >
          <div className="g-float-0 rounded-full bg-primary-soft p-2 shadow-sm">
            <Utensils className="size-4 text-primary sm:size-5" />
          </div>
        </div>

        {/* Bottom — Empanada/Pizza */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: "-28px" }}
          aria-hidden="true"
        >
          <div className="g-float-2 rounded-full bg-primary-soft p-2 shadow-sm">
            <Pizza className="size-4 text-primary sm:size-5" />
          </div>
        </div>

        {/* Left — Tinto */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: "-28px" }}
          aria-hidden="true"
        >
          <div className="g-float-1 rounded-full bg-primary-soft p-2 shadow-sm">
            <Coffee className="size-4 text-primary sm:size-5" />
          </div>
        </div>

        {/* Right — Sancocho */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ right: "-28px" }}
          aria-hidden="true"
        >
          <div className="g-float-3 rounded-full bg-primary-soft p-2 shadow-sm">
            <Soup className="size-4 text-primary sm:size-5" />
          </div>
        </div>

        {/* Central chef hat */}
        <div className="g-chef-pulse relative inline-flex rounded-full bg-primary-soft p-5"
          style={{ boxShadow: "0 0 48px -8px var(--primary-soft)" }}>
          <ChefHat
            className="size-10 text-primary sm:size-12"
            aria-hidden="true"
          />

          {/* Sparkle dots */}
          <div
            className="g-sparkle-0 pointer-events-none absolute top-0 right-0 size-2 -translate-y-1/3 translate-x-1/3 rounded-full bg-primary"
            aria-hidden="true"
          />
          <div
            className="g-sparkle-1 pointer-events-none absolute bottom-0 left-0 size-1.5 translate-y-1/2 -translate-x-1/2 rounded-full bg-primary"
            aria-hidden="true"
          />
          <div
            className="g-sparkle-2 pointer-events-none absolute left-0 top-1/3 size-1 -translate-x-1/2 rounded-full bg-primary"
            aria-hidden="true"
          />
          <div
            className="g-sparkle-3 pointer-events-none absolute bottom-1/3 right-0 size-1.5 translate-x-1/2 rounded-full bg-primary"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* ═══ Rotating phrase ═══ */}
      <div className="relative h-14 sm:h-12">
        <p
          key={phraseIndex}
          className="g-text-fade font-heading text-lg font-black text-foreground sm:text-xl"
        >
          {PHRASES[phraseIndex]}
        </p>
      </div>

      {/* Static subtitle with animated ellipsis */}
      <p className="mt-1 flex items-center gap-0.5 text-sm text-muted-foreground">
        El chef está preparando algo especial
        <span className="inline-flex">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
            .
          </span>
          <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
            .
          </span>
        </span>
      </p>

      {/* ═══ Progress dots (wave sweep) ═══ */}
      <div className="mt-6 flex gap-2" aria-hidden="true">
        {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
          <div
            key={i}
            className="size-2 rounded-full"
            style={{
              backgroundColor: "var(--primary-soft)",
              animation: "dot-wave 4.9s ease-in-out infinite",
              animationDelay: `${-(i * 0.7)}s`,
            }}
          />
        ))}
      </div>

      {/* ═══ Progress shimmer bar ═══ */}
      <div className="mt-5 w-full max-w-52 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="g-shimmer h-1 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--primary-soft), var(--primary) 40%, var(--primary-soft))",
          }}
        />
      </div>
    </div>
  );
}
