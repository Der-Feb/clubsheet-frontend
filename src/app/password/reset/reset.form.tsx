"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 5) {
      setError("Password must be at least 5 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call and redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
      {error && (
        <FieldError className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200">
          {error}
        </FieldError>
      )}

      <Field>
        <FieldLabel htmlFor="new-password">New Password</FieldLabel>
        <div className="relative">
          <Input
            id="new-password"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
        <div className="relative">
          <Input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-800 text-white font-medium py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
      >
        {isSubmitting ? "Updating Password..." : "Reset Password & Continue"}
      </button>

      <p className="text-center text-xs sm:text-sm text-gray-500 pt-1">
        Already remember your password?{" "}
        <Link href="/login" className="text-emerald-800 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
