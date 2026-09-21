import { Check, Circle } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
  isVisible?: boolean;
}

const requirements = [
  { label: "8 or more characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
];

export function passwordMeetsRequirements(password: string) {
  return requirements.every(({ test }) => test(password));
}

export function PasswordRequirements({ password, isVisible = true }: PasswordRequirementsProps) {
  if (!isVisible || password.length === 0) return null;

  return (
    <div className="mt-2 grid gap-1 text-[0.6rem] text-gray-500" aria-live="polite">
      {requirements.map(({ label, test }) => {
        const passed = test(password);
        return (
          <p key={label} className={passed ? "flex items-center gap-1.5 text-emerald-800" : "flex items-center gap-1.5"}>
            {passed ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <Circle className="h-3 w-3 shrink-0" aria-hidden="true" />}
            <span className="text-xs">{label}</span>
          </p>
        );
      })}
    </div>
  );
}
