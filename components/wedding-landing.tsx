'use client'

// Each blossom: center, radius, bloom delay, float phase offset
const blossoms = [
  // Center-top cluster
  { cx: 225, cy: 22,  r: 8,   delay: '2.05s', float: '0.0s' },
  { cx: 242, cy: 18,  r: 6.5, delay: '2.10s', float: '0.5s' },
  { cx: 210, cy: 28,  r: 6,   delay: '2.12s', float: '1.0s' },
  // Center-left secondaries
  { cx: 188, cy: 48,  r: 6,   delay: '2.18s', float: '0.3s' },
  { cx: 200, cy: 42,  r: 5,   delay: '2.20s', float: '0.8s' },
  { cx: 172, cy: 58,  r: 5,   delay: '2.25s', float: '1.3s' },
  // Center-right secondaries
  { cx: 260, cy: 42,  r: 5,   delay: '2.18s', float: '0.6s' },
  { cx: 272, cy: 52,  r: 5.5, delay: '2.22s', float: '1.1s' },
  { cx: 285, cy: 62,  r: 4.5, delay: '2.28s', float: '0.4s' },
  // Left branch tips
  { cx: 138, cy: 80,  r: 6,   delay: '2.32s', float: '0.2s' },
  { cx: 120, cy: 90,  r: 5,   delay: '2.38s', float: '0.9s' },
  { cx: 108, cy: 72,  r: 5,   delay: '2.35s', float: '1.6s' },
  { cx: 152, cy: 68,  r: 4.5, delay: '2.30s', float: '0.7s' },
  // Right branch tips
  { cx: 320, cy: 80,  r: 6,   delay: '2.32s', float: '0.4s' },
  { cx: 338, cy: 90,  r: 5,   delay: '2.38s', float: '1.1s' },
  { cx: 350, cy: 72,  r: 5,   delay: '2.35s', float: '0.2s' },
  { cx: 306, cy: 68,  r: 4.5, delay: '2.30s', float: '1.4s' },
  // Far-left sweep
  { cx: 72,  cy: 105, r: 5.5, delay: '2.45s', float: '0.5s' },
  { cx: 52,  cy: 118, r: 5,   delay: '2.50s', float: '1.2s' },
  { cx: 62,  cy: 92,  r: 4.5, delay: '2.48s', float: '0.0s' },
  { cx: 38,  cy: 130, r: 4.5, delay: '2.58s', float: '0.7s' },
  { cx: 22,  cy: 118, r: 4,   delay: '2.62s', float: '1.8s' },
  { cx: 18,  cy: 142, r: 4,   delay: '2.65s', float: '0.3s' },
  // Far-right sweep
  { cx: 386, cy: 105, r: 5.5, delay: '2.45s', float: '0.8s' },
  { cx: 406, cy: 118, r: 5,   delay: '2.50s', float: '0.1s' },
  { cx: 396, cy: 92,  r: 4.5, delay: '2.48s', float: '1.5s' },
  { cx: 420, cy: 130, r: 4.5, delay: '2.58s', float: '0.6s' },
  { cx: 436, cy: 118, r: 4,   delay: '2.62s', float: '1.0s' },
  { cx: 440, cy: 142, r: 4,   delay: '2.65s', float: '1.9s' },
  // Extra inner fill blossoms
  { cx: 165, cy: 105, r: 4,   delay: '2.40s', float: '0.4s' },
  { cx: 295, cy: 105, r: 4,   delay: '2.40s', float: '1.3s' },
  { cx: 228, cy: 65,  r: 4,   delay: '2.15s', float: '0.6s' },
  { cx: 88,  cy: 138, r: 3.5, delay: '2.55s', float: '0.9s' },
  { cx: 370, cy: 138, r: 3.5, delay: '2.55s', float: '0.2s' },
]

export default function WeddingLanding() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[var(--color-cream)] parchment-texture flex flex-col items-center justify-center relative overflow-hidden"
    >
      <style>{`
        @keyframes drawBranch {
          to { stroke-dashoffset: 0; }
        }
        @keyframes bloomIn {
          0%   { opacity: 0; transform: scale(0.05); }
          60%  { opacity: 1; transform: scale(1.18); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes petalFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-3px) scale(1.05); }
        }
        .branch {
          fill: none;
          stroke: var(--color-forest);
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: drawBranch 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .blossom-group {
          opacity: 0;
          transform-origin: center;
          transform-box: fill-box;
          animation: bloomIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .petal-float {
          animation: petalFloat 4s ease-in-out infinite;
        }
      `}</style>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none opacity-[0.055]" aria-hidden>
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M10 190 C30 150,55 165,75 125 C95 85,75 65,105 30" stroke="var(--color-forest)" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="65" cy="138" rx="18" ry="9" fill="var(--color-forest)" opacity="0.35" transform="rotate(-20 65 138)"/>
          <ellipse cx="90" cy="88" rx="13" ry="7" fill="var(--color-forest)" opacity="0.25" transform="rotate(12 90 88)"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-[0.055] rotate-180" aria-hidden>
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M10 190 C30 150,55 165,75 125 C95 85,75 65,105 30" stroke="var(--color-forest)" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="65" cy="138" rx="18" ry="9" fill="var(--color-forest)" opacity="0.35" transform="rotate(-20 65 138)"/>
        </svg>
      </div>

      <div className="flex flex-col items-center gap-6 relative z-10 px-4">

        {/* ── Blooming Tree ── */}
        <div className="animate-fade-in w-full max-w-[480px]">
          <svg
            viewBox="0 0 460 310"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            aria-hidden
          >
            {/* ── TRUNK ── */}
            <path className="branch" d="M229 308 C227 288,231 266,229 244 C227 224,229 212,229 196"
              strokeWidth="5.5" strokeDasharray="114" strokeDashoffset="114"
              style={{ animationDelay: '0.15s', opacity: 0.72 }}/>

            {/* ── LEVEL 1 — main sweeping branches ── */}
            {/* Far-left arc */}
            <path className="branch" d="M229 258 C200 246,168 232,138 218 C110 205,82 192,52 178"
              strokeWidth="3.4" strokeDasharray="192" strokeDashoffset="192"
              style={{ animationDelay: '0.82s', opacity: 0.65 }}/>
            {/* Left */}
            <path className="branch" d="M229 252 C208 240,188 226,170 210 C154 196,142 184,128 168"
              strokeWidth="2.8" strokeDasharray="128" strokeDashoffset="128"
              style={{ animationDelay: '0.88s', opacity: 0.62 }}/>
            {/* Center-left */}
            <path className="branch" d="M229 240 C218 225,208 210,200 192 C193 177,188 164,184 148"
              strokeWidth="2.3" strokeDasharray="100" strokeDashoffset="100"
              style={{ animationDelay: '0.78s', opacity: 0.60 }}/>
            {/* Center-up */}
            <path className="branch" d="M229 234 C228 215,230 196,229 176 C228 158,229 146,229 128"
              strokeWidth="2.6" strokeDasharray="108" strokeDashoffset="108"
              style={{ animationDelay: '0.70s', opacity: 0.65 }}/>
            {/* Center-right */}
            <path className="branch" d="M229 240 C240 225,250 210,258 192 C265 177,270 164,274 148"
              strokeWidth="2.3" strokeDasharray="100" strokeDashoffset="100"
              style={{ animationDelay: '0.80s', opacity: 0.60 }}/>
            {/* Right */}
            <path className="branch" d="M229 252 C250 240,270 226,288 210 C304 196,316 184,330 168"
              strokeWidth="2.8" strokeDasharray="128" strokeDashoffset="128"
              style={{ animationDelay: '0.88s', opacity: 0.62 }}/>
            {/* Far-right arc */}
            <path className="branch" d="M229 258 C258 246,290 232,320 218 C348 205,376 192,406 178"
              strokeWidth="3.4" strokeDasharray="192" strokeDashoffset="192"
              style={{ animationDelay: '0.82s', opacity: 0.65 }}/>

            {/* ── LEVEL 2 — secondary branches ── */}
            {/* From far-left (52,178) */}
            <path className="branch" d="M52 178 C38 164,26 150,16 134"
              strokeWidth="1.9" strokeDasharray="60" strokeDashoffset="60"
              style={{ animationDelay: '1.28s', opacity: 0.55 }}/>
            <path className="branch" d="M52 178 C48 162,50 146,56 132"
              strokeWidth="1.6" strokeDasharray="50" strokeDashoffset="50"
              style={{ animationDelay: '1.33s', opacity: 0.50 }}/>
            <path className="branch" d="M52 178 C40 172,25 168,10 162"
              strokeWidth="1.5" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.38s', opacity: 0.48 }}/>

            {/* From left (128,168) */}
            <path className="branch" d="M128 168 C116 154,106 140,100 124"
              strokeWidth="1.7" strokeDasharray="56" strokeDashoffset="56"
              style={{ animationDelay: '1.30s', opacity: 0.52 }}/>
            <path className="branch" d="M128 168 C124 153,126 138,130 124"
              strokeWidth="1.5" strokeDasharray="48" strokeDashoffset="48"
              style={{ animationDelay: '1.35s', opacity: 0.48 }}/>
            <path className="branch" d="M128 168 C118 158,105 152,90 148"
              strokeWidth="1.4" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.40s', opacity: 0.46 }}/>

            {/* From center-left (184,148) */}
            <path className="branch" d="M184 148 C175 134,168 120,164 104"
              strokeWidth="1.5" strokeDasharray="50" strokeDashoffset="50"
              style={{ animationDelay: '1.22s', opacity: 0.50 }}/>
            <path className="branch" d="M184 148 C180 133,182 118,186 104"
              strokeWidth="1.4" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.26s', opacity: 0.48 }}/>

            {/* From center-up (229,128) */}
            <path className="branch" d="M229 128 C220 114,213 100,210 84"
              strokeWidth="1.6" strokeDasharray="52" strokeDashoffset="52"
              style={{ animationDelay: '1.16s', opacity: 0.52 }}/>
            <path className="branch" d="M229 128 C228 112,229 96,229 80"
              strokeWidth="1.5" strokeDasharray="48" strokeDashoffset="48"
              style={{ animationDelay: '1.12s', opacity: 0.50 }}/>
            <path className="branch" d="M229 128 C238 114,245 100,248 84"
              strokeWidth="1.6" strokeDasharray="52" strokeDashoffset="52"
              style={{ animationDelay: '1.16s', opacity: 0.52 }}/>

            {/* From center-right (274,148) */}
            <path className="branch" d="M274 148 C283 134,290 120,294 104"
              strokeWidth="1.5" strokeDasharray="50" strokeDashoffset="50"
              style={{ animationDelay: '1.22s', opacity: 0.50 }}/>
            <path className="branch" d="M274 148 C278 133,276 118,272 104"
              strokeWidth="1.4" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.26s', opacity: 0.48 }}/>

            {/* From right (330,168) */}
            <path className="branch" d="M330 168 C342 154,352 140,358 124"
              strokeWidth="1.7" strokeDasharray="56" strokeDashoffset="56"
              style={{ animationDelay: '1.30s', opacity: 0.52 }}/>
            <path className="branch" d="M330 168 C334 153,332 138,328 124"
              strokeWidth="1.5" strokeDasharray="48" strokeDashoffset="48"
              style={{ animationDelay: '1.35s', opacity: 0.48 }}/>
            <path className="branch" d="M330 168 C340 158,353 152,368 148"
              strokeWidth="1.4" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.40s', opacity: 0.46 }}/>

            {/* From far-right (406,178) */}
            <path className="branch" d="M406 178 C420 164,432 150,442 134"
              strokeWidth="1.9" strokeDasharray="60" strokeDashoffset="60"
              style={{ animationDelay: '1.28s', opacity: 0.55 }}/>
            <path className="branch" d="M406 178 C410 162,408 146,402 132"
              strokeWidth="1.6" strokeDasharray="50" strokeDashoffset="50"
              style={{ animationDelay: '1.33s', opacity: 0.50 }}/>
            <path className="branch" d="M406 178 C418 172,433 168,448 162"
              strokeWidth="1.5" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.38s', opacity: 0.48 }}/>

            {/* ── LEVEL 3 — tertiary twigs ── */}
            {/* From (16,134) */}
            <path className="branch" d="M16 134 C8 120, 4 108, 2 94"
              strokeWidth="1.0" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.58s', opacity: 0.40 }}/>
            <path className="branch" d="M16 134 C18 120,22 108,22 96"
              strokeWidth="0.9" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.63s', opacity: 0.38 }}/>
            {/* From (56,132) */}
            <path className="branch" d="M56 132 C50 118,48 105,48 92"
              strokeWidth="1.0" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.60s', opacity: 0.40 }}/>
            <path className="branch" d="M56 132 C58 118,62 106,62 93"
              strokeWidth="0.9" strokeDasharray="40" strokeDashoffset="40"
              style={{ animationDelay: '1.65s', opacity: 0.38 }}/>
            {/* From (10,162) */}
            <path className="branch" d="M10 162 C0 150,-4 136,-4 122"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.65s', opacity: 0.36 }}/>
            {/* From (100,124) */}
            <path className="branch" d="M100 124 C92 110,88 97,86 83"
              strokeWidth="1.0" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.56s', opacity: 0.40 }}/>
            <path className="branch" d="M100 124 C100 110,104 97,106 83"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.60s', opacity: 0.38 }}/>
            {/* From (130,124) */}
            <path className="branch" d="M130 124 C126 110,124 97,124 84"
              strokeWidth="0.9" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.60s', opacity: 0.38 }}/>
            <path className="branch" d="M130 124 C134 110,136 97,134 84"
              strokeWidth="0.9" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.64s', opacity: 0.36 }}/>
            {/* From (90,148) */}
            <path className="branch" d="M90 148 C80 135,74 122,72 108"
              strokeWidth="0.9" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.66s', opacity: 0.38 }}/>
            {/* From (164,104) */}
            <path className="branch" d="M164 104 C158 90,155 78,154 64"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.50s', opacity: 0.40 }}/>
            <path className="branch" d="M164 104 C166 90,170 78,170 64"
              strokeWidth="0.8" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.54s', opacity: 0.37 }}/>
            {/* From (186,104) */}
            <path className="branch" d="M186 104 C182 90,180 78,180 64"
              strokeWidth="0.9" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.52s', opacity: 0.40 }}/>
            <path className="branch" d="M186 104 C188 90,192 78,192 64"
              strokeWidth="0.8" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.56s', opacity: 0.37 }}/>
            {/* From (210,84) */}
            <path className="branch" d="M210 84 C204 70,200 58,198 44"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.44s', opacity: 0.40 }}/>
            <path className="branch" d="M210 84 C210 70,212 58,212 44"
              strokeWidth="0.8" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.48s', opacity: 0.37 }}/>
            {/* From (229,80) */}
            <path className="branch" d="M229 80 C222 66,218 52,216 38"
              strokeWidth="0.9" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.40s', opacity: 0.40 }}/>
            <path className="branch" d="M229 80 C230 66,232 52,232 38"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.44s', opacity: 0.40 }}/>
            <path className="branch" d="M229 80 C236 66,240 52,242 38"
              strokeWidth="0.8" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.46s', opacity: 0.37 }}/>
            {/* From (248,84) */}
            <path className="branch" d="M248 84 C248 70,248 58,246 44"
              strokeWidth="0.8" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.48s', opacity: 0.37 }}/>
            <path className="branch" d="M248 84 C254 70,258 58,260 44"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.44s', opacity: 0.40 }}/>
            {/* From (294,104) */}
            <path className="branch" d="M294 104 C298 90,300 78,298 64"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.50s', opacity: 0.40 }}/>
            <path className="branch" d="M294 104 C290 90,288 78,288 64"
              strokeWidth="0.8" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.54s', opacity: 0.37 }}/>
            {/* From (272,104) */}
            <path className="branch" d="M272 104 C272 90,274 78,274 64"
              strokeWidth="0.9" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.52s', opacity: 0.40 }}/>
            <path className="branch" d="M272 104 C268 90,266 78,268 64"
              strokeWidth="0.8" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.56s', opacity: 0.37 }}/>
            {/* From (358,124) */}
            <path className="branch" d="M358 124 C366 110,370 97,372 83"
              strokeWidth="1.0" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.56s', opacity: 0.40 }}/>
            <path className="branch" d="M358 124 C356 110,354 97,354 84"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.60s', opacity: 0.38 }}/>
            {/* From (328,124) */}
            <path className="branch" d="M328 124 C324 110,322 97,324 84"
              strokeWidth="0.9" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.60s', opacity: 0.38 }}/>
            <path className="branch" d="M328 124 C330 110,334 97,334 84"
              strokeWidth="0.9" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.64s', opacity: 0.36 }}/>
            {/* From (368,148) */}
            <path className="branch" d="M368 148 C378 135,384 122,386 108"
              strokeWidth="0.9" strokeDasharray="46" strokeDashoffset="46"
              style={{ animationDelay: '1.66s', opacity: 0.38 }}/>
            {/* From (442,134) */}
            <path className="branch" d="M442 134 C450 120,454 108,456 94"
              strokeWidth="1.0" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.58s', opacity: 0.40 }}/>
            <path className="branch" d="M442 134 C440 120,436 108,436 96"
              strokeWidth="0.9" strokeDasharray="42" strokeDashoffset="42"
              style={{ animationDelay: '1.63s', opacity: 0.38 }}/>
            {/* From (402,132) */}
            <path className="branch" d="M402 132 C408 118,410 105,410 92"
              strokeWidth="1.0" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.60s', opacity: 0.40 }}/>
            <path className="branch" d="M402 132 C398 118,396 106,396 93"
              strokeWidth="0.9" strokeDasharray="40" strokeDashoffset="40"
              style={{ animationDelay: '1.65s', opacity: 0.38 }}/>
            {/* From (448,162) */}
            <path className="branch" d="M448 162 C458 150,462 136,462 122"
              strokeWidth="0.9" strokeDasharray="44" strokeDashoffset="44"
              style={{ animationDelay: '1.65s', opacity: 0.36 }}/>

            {/* ── BLOSSOMS ── */}
            {blossoms.map(({ cx, cy, r, delay, float: floatDelay }, i) => (
              <g key={i} className="blossom-group" style={{ animationDelay: delay }}>
                <g className="petal-float" style={{ animationDelay: floatDelay }}>
                  {[0, 72, 144, 216, 288].map((angle) => {
                    const rad = (angle * Math.PI) / 180
                    const px = cx + Math.cos(rad) * r * 0.65
                    const py = cy + Math.sin(rad) * r * 0.65
                    return (
                      <ellipse
                        key={angle}
                        cx={px} cy={py}
                        rx={r * 0.54} ry={r * 0.36}
                        fill="var(--color-forest)"
                        opacity="0.20"
                        transform={`rotate(${angle + 90}, ${px}, ${py})`}
                      />
                    )
                  })}
                  <circle cx={cx} cy={cy} r={r * 0.25} fill="var(--color-forest)" opacity="0.38" />
                </g>
              </g>
            ))}
          </svg>
        </div>

        {/* Names */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="animate-fade-up delay-100 font-handwriting text-[5.5rem] leading-none text-[var(--color-ink)] tracking-wide">
            מאיה   אמיר
          </h1>
          <div className="animate-line-grow delay-300 h-px bg-[var(--color-forest)] w-16 opacity-50" />
        </div>

      </div>
    </main>
  )
}
