"use client";

interface Props {
  password: string;
}

function getStrength(p: string): { score: number; label: string; color: string } {
  if (!p) return { score: 0, label: "", color: "" };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;

  if (score <= 2) return { score, label: "Fraca", color: "bg-red-500" };
  if (score === 3) return { score, label: "Razoável", color: "bg-yellow-500" };
  if (score === 4) return { score, label: "Boa", color: "bg-blue-500" };
  return { score, label: "Forte", color: "bg-emerald-500" };
}

export default function PasswordStrengthBar({ password }: Props) {
  const { score, label, color } = getStrength(password);
  if (!password) return null;

  return (
    <div className="flex items-center gap-2" aria-label={`Força da senha: ${label}`}>
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? color : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${
        score <= 2 ? "text-red-400" : score === 3 ? "text-yellow-400" : score === 4 ? "text-blue-400" : "text-emerald-400"
      }`}>
        {label}
      </span>
    </div>
  );
}
