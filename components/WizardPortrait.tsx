import { PLAYER, RIVAL } from "@/lib/duel/wizards";

type WizardPortraitProps = {
  who: "a" | "b";
  size?: "sm" | "md" | "lg";
};

export function WizardPortrait({ who, size = "md" }: WizardPortraitProps) {
  const label = who === "a" ? PLAYER.name : RIVAL.name;
  return (
    <span
      className={`portrait portrait-${who} size-${size}`}
      role="img"
      aria-label={label}
    >
      {who === "a" ? <NovaMark /> : <SynergyMark />}
    </span>
  );
}

function NovaMark() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden>
      <defs>
        <radialGradient id="nova-sky" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#6d5bff" />
          <stop offset="100%" stopColor="#1b1244" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#nova-sky)" />
      <path
        d="M18 62 C22 40, 28 28, 40 26 C52 28, 58 40, 62 62 Z"
        fill="#3a2a8a"
      />
      <path
        d="M26 58 C30 44, 34 36, 40 34 C46 36, 50 44, 54 58 Z"
        fill="#5b4ad6"
      />
      <circle cx="40" cy="28" r="8" fill="#f3e8ff" />
      <path d="M32 26 C34 18, 46 18, 48 26" fill="#24155c" />
      <g transform="translate(54 18) rotate(28)">
        <rect x="0" y="8" width="4" height="28" rx="2" fill="#c9b8e8" />
        <path d="M2 0 L8 12 L2 9 L-4 12 Z" fill="#f5d76e" />
        <circle cx="2" cy="2" r="2.2" fill="#fff6d8" />
      </g>
      <path
        d="M12 18 C18 14, 22 20, 18 24"
        fill="none"
        stroke="#9be7c4"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SynergyMark() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden>
      <circle cx="40" cy="40" r="38" fill="#3a1a12" />
      <circle cx="40" cy="40" r="34" fill="#ff7a3a" />
      <ellipse cx="40" cy="48" rx="18" ry="14" fill="#ff9a5c" />
      <ellipse cx="28" cy="40" rx="8" ry="7" fill="#ffb08a" />
      <circle cx="25" cy="38" r="2.2" fill="#2a120c" />
      <circle cx="26.2" cy="37.2" r="0.7" fill="#fff" />
      <path
        d="M18 42 C8 38, 8 54, 20 52"
        fill="none"
        stroke="#c94a1a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M54 50 C66 46, 70 58, 56 60"
        fill="none"
        stroke="#c94a1a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g transform="translate(52 10)">
        <rect x="8" y="6" width="3" height="40" rx="1.4" fill="#f5d76e" />
        <rect
          x="0"
          y="0"
          width="20"
          height="16"
          rx="1.5"
          fill="#fff6d8"
          stroke="#e8c96a"
        />
        <path
          d="M3 5 H16 M3 8.5 H14 M3 12 H12"
          stroke="#c94a1a"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
