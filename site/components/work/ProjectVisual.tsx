type Props = {
  type: "web" | "chart" | "ai" | "code" | "ml";
};

export function ProjectVisual({ type }: Props) {
  return (
    <div
      className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
      style={{
        aspectRatio: "4 / 3",
        backgroundColor: "var(--color-surface-soft)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {type === "web" && <WebMock />}
      {type === "chart" && <ChartMock />}
      {type === "ai" && <AIMock />}
      {type === "code" && <CodeMock />}
      {type === "ml" && <MLMock />}
    </div>
  );
}

function WebMock() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <rect width="400" height="300" fill="var(--color-canvas)" />
      <rect x="20" y="20" width="120" height="14" fill="var(--color-ink-soft)" opacity="0.7" />
      <rect x="20" y="44" width="80" height="6" fill="var(--color-ink-muted)" opacity="0.5" />
      <line x1="20" y1="80" x2="380" y2="80" stroke="var(--color-hairline)" />
      <g transform="translate(20, 100)">
        <rect width="170" height="100" rx="4" fill="var(--color-surface-card)" stroke="var(--color-hairline)" />
        <rect x="10" y="10" width="150" height="50" fill="var(--color-ink-faint)" opacity="0.3" />
        <rect x="10" y="68" width="80" height="6" fill="var(--color-ink-soft)" />
        <rect x="10" y="80" width="60" height="5" fill="var(--color-ink-muted)" />
      </g>
      <g transform="translate(210, 100)">
        <rect width="170" height="100" rx="4" fill="var(--color-surface-card)" stroke="var(--color-hairline)" />
        <rect x="10" y="10" width="150" height="50" fill="var(--color-ink-faint)" opacity="0.3" />
        <rect x="10" y="68" width="100" height="6" fill="var(--color-ink-soft)" />
        <rect x="10" y="80" width="70" height="5" fill="var(--color-ink-muted)" />
      </g>
      <g transform="translate(20, 220)">
        <circle cx="8" cy="6" r="3" fill="var(--color-ink)" />
        <rect x="20" y="3" width="60" height="6" fill="var(--color-ink-soft)" />
      </g>
    </svg>
  );
}

function ChartMock() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <rect width="400" height="300" fill="var(--color-canvas)" />
      <line x1="40" y1="40" x2="40" y2="260" stroke="var(--color-hairline)" />
      <line x1="40" y1="260" x2="360" y2="260" stroke="var(--color-hairline)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="40"
          y1={70 + i * 47}
          x2="360"
          y2={70 + i * 47}
          stroke="var(--color-hairline-soft)"
          strokeDasharray="2 3"
        />
      ))}
      <g>
        <circle cx="60" cy="220" r="3" fill="var(--color-ink)" />
        <circle cx="100" cy="190" r="3" fill="var(--color-ink)" />
        <circle cx="140" cy="200" r="3" fill="var(--color-ink)" />
        <circle cx="180" cy="160" r="3" fill="var(--color-ink)" />
        <circle cx="220" cy="170" r="3" fill="var(--color-ink)" />
        <circle cx="260" cy="130" r="3" fill="var(--color-ink)" />
        <circle cx="300" cy="140" r="3" fill="var(--color-ink)" />
        <circle cx="340" cy="90" r="3" fill="var(--color-ink)" />
        <line
          x1="60"
          y1="220"
          x2="340"
          y2="90"
          stroke="var(--color-ink)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <polyline
          points="60,220 100,190 140,200 180,160 220,170 260,130 300,140 340,90"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
        />
      </g>
      <text
        x="200"
        y="285"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="10"
        fill="var(--color-ink-muted)"
      >
        linear regression · sklearn
      </text>
    </svg>
  );
}

function AIMock() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <rect width="400" height="300" fill="var(--color-canvas)" />
      <rect x="20" y="20" width="360" height="40" rx="4" fill="var(--color-surface-card)" stroke="var(--color-hairline)" />
      <rect x="32" y="32" width="240" height="8" rx="2" fill="var(--color-ink-faint)" opacity="0.4" />
      <rect x="32" y="46" width="100" height="6" rx="2" fill="var(--color-ink-faint)" opacity="0.3" />
      <g transform="translate(20, 80)">
        <rect width="360" height="80" rx="4" fill="var(--color-surface-soft)" stroke="var(--color-hairline)" />
        <text x="16" y="22" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-ink-muted)">
          TRANSCRIPT
        </text>
        <rect x="16" y="32" width="328" height="4" fill="var(--color-ink-faint)" opacity="0.4" />
        <rect x="16" y="42" width="328" height="4" fill="var(--color-ink-faint)" opacity="0.4" />
        <rect x="16" y="52" width="280" height="4" fill="var(--color-ink-faint)" opacity="0.4" />
        <rect x="16" y="62" width="220" height="4" fill="var(--color-ink-faint)" opacity="0.4" />
      </g>
      <g transform="translate(20, 180)">
        <rect width="360" height="100" rx="4" fill="var(--color-ink)" />
        <text x="16" y="22" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-on-dark-soft)">
          SUMMARY · GEMINI
        </text>
        <rect x="16" y="32" width="328" height="4" fill="var(--color-on-dark)" opacity="0.7" />
        <rect x="16" y="42" width="328" height="4" fill="var(--color-on-dark)" opacity="0.5" />
        <rect x="16" y="52" width="328" height="4" fill="var(--color-on-dark)" opacity="0.5" />
        <rect x="16" y="62" width="280" height="4" fill="var(--color-on-dark)" opacity="0.5" />
        <rect x="16" y="72" width="220" height="4" fill="var(--color-on-dark)" opacity="0.4" />
      </g>
    </svg>
  );
}

function CodeMock() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <rect width="400" height="300" fill="var(--color-ink-canvas)" />
      <rect x="20" y="20" width="360" height="22" fill="var(--color-ink-surface-soft)" />
      <g fill="var(--color-on-dark-faint)">
        <circle cx="34" cy="31" r="3" />
        <circle cx="46" cy="31" r="3" />
        <circle cx="58" cy="31" r="3" />
      </g>
      <text x="200" y="35" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-on-dark-soft)">
        tic_tac_toe.cpp
      </text>
      <g fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-on-dark)">
        <text x="36" y="68" opacity="0.4">1</text>
        <text x="56" y="68" fill="#a8a6a0">class</text>
        <text x="100" y="68" fill="#f0efec">Board</text>
        <text x="142" y="68" fill="var(--color-on-dark)">&#123;</text>

        <text x="36" y="88" opacity="0.4">2</text>
        <text x="64" y="88" fill="var(--color-on-dark)">  char grid[3][3];</text>

        <text x="36" y="108" opacity="0.4">3</text>
        <text x="64" y="108" fill="#a8a6a0">  void</text>
        <text x="100" y="108" fill="#f0efec">makeMove</text>
        <text x="170" y="108" fill="var(--color-on-dark)">(int r, int c,</text>

        <text x="36" y="128" opacity="0.4">4</text>
        <text x="80" y="128" fill="var(--color-on-dark)">              char player) &#123;</text>

        <text x="36" y="148" opacity="0.4">5</text>
        <text x="80" y="148" fill="var(--color-on-dark)">    grid[r][c] = player;</text>

        <text x="36" y="168" opacity="0.4">6</text>
        <text x="80" y="168" fill="var(--color-on-dark)">  &#125;</text>

        <text x="36" y="188" opacity="0.4">7</text>
        <text x="56" y="188" fill="var(--color-on-dark)">&#125;;</text>

        <text x="36" y="218" opacity="0.4">8</text>
        <text x="56" y="218" fill="var(--color-on-dark)">// minimax with alpha-beta</text>

        <text x="36" y="238" opacity="0.4">9</text>
        <text x="56" y="238" fill="#a8a6a0">int</text>
        <text x="80" y="238" fill="#f0efec">minimax</text>
        <text x="140" y="238" fill="var(--color-on-dark)">(Board&amp; b,</text>

        <text x="36" y="258" opacity="0.4">10</text>
        <text x="80" y="258" fill="var(--color-on-dark)">            int depth, bool max)&#123;</text>
      </g>
    </svg>
  );
}

function MLMock() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <rect width="400" height="300" fill="var(--color-canvas)" />
      <line x1="40" y1="40" x2="40" y2="260" stroke="var(--color-hairline)" />
      <line x1="40" y1="260" x2="360" y2="260" stroke="var(--color-hairline)" />
      {/* scatter */}
      <g fill="var(--color-ink)">
        <circle cx="70" cy="220" r="3" />
        <circle cx="90" cy="200" r="3" />
        <circle cx="110" cy="180" r="3" />
        <circle cx="135" cy="195" r="3" />
        <circle cx="155" cy="160" r="3" />
        <circle cx="180" cy="150" r="3" />
        <circle cx="205" cy="135" r="3" />
        <circle cx="230" cy="110" r="3" />
        <circle cx="260" cy="120" r="3" />
        <circle cx="285" cy="95" r="3" />
        <circle cx="310" cy="80" r="3" />
        <circle cx="340" cy="60" r="3" />
      </g>
      {/* Area fill under S-curve (probability mass) */}
      <path
        d="M 40 240 Q 150 235 200 200 T 360 50 L 360 260 L 40 260 Z"
        fill="var(--color-ink)"
        opacity="0.06"
      />
      {/* S-curve logistic */}
      <path
        d="M 40 240 Q 150 235 200 200 T 360 50"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
      />
      {/* Decision threshold line at midpoint */}
      <line
        x1="40"
        y1="150"
        x2="360"
        y2="150"
        stroke="var(--color-ink-faint)"
        strokeWidth="0.5"
        strokeDasharray="2 3"
        opacity="0.6"
      />
      <text
        x="200"
        y="285"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="10"
        fill="var(--color-ink-muted)"
      >
        logistic regression · p(placed)
      </text>
    </svg>
  );
}
