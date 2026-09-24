"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordRequirements, passwordMeetsRequirements } from "@/components/auth/password-requirements";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasFailedPasswordValidation, setHasFailedPasswordValidation] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordMeetsRequirements(password)) {
      setHasFailedPasswordValidation(true);
      setError("Please meet the password requirements below.");
      return;
    }
    setHasFailedPasswordValidation(false);
    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    setError(null);
    // Submission handler with form values
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form space-y-2 text-[0.7rem] sm:space-y-2.5 sm:text-xs [&_[data-slot=field-label]]:text-xs">
      {error && <FieldError className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-red-600">{error}</FieldError>}
      <FieldGroup className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="first-name">First Name</FieldLabel>
          <Input id="first-name" name="firstName" placeholder="John" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
          <Input id="last-name" name="lastName" placeholder="Doe" required />
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel htmlFor="email">Email Address</FieldLabel>
        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setHasFailedPasswordValidation(false);
              setError(null);
            }}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 inline-flex min-h-10 min-w-10 -translate-y-1/2 items-center justify-center cursor-pointer text-gray-400 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <PasswordRequirements
          password={password}
          isVisible={isPasswordFocused || hasFailedPasswordValidation}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
        <div className="relative">
          <Input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setError(null);
            }}
            aria-invalid={confirmPassword.length > 0 && confirmPassword !== password}
            className="pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 inline-flex min-h-10 min-w-10 -translate-y-1/2 items-center justify-center cursor-pointer text-gray-400 hover:text-gray-700"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {confirmPassword.length > 0 && confirmPassword !== password && (
          <p className="mt-1 text-[0.7rem] text-red-600 sm:text-xs">Passwords do not match.</p>
        )}
      </Field>

      <FieldGroup className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
          <div className="relative">
            <Input id="dob" name="dob" type="date" placeholder="yyyy-mm-dd" required />
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
          <select
            id="nationality"
            name="nationality"
            defaultValue=""
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-[0.7rem] text-gray-800 shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 sm:text-xs"
          >
            <option value="" disabled>Select country</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="BR">Brazil</option>
            <option value="AR">Argentina</option>
          </select>
        </Field>
      </FieldGroup>

      <Field>
        <FieldLabel>Gender</FieldLabel>
        <div className="grid grid-cols-2 gap-2 bg-gray-200/50 p-1 rounded-lg" role="group" aria-label="Select Gender">
          <button
            type="button"
            onClick={() => setGender("Male")}
            className={`py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
              gender === "Male"
                ? "bg-emerald-800 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-pressed={gender === "Male"}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setGender("Female")}
            className={`py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
              gender === "Female"
                ? "bg-emerald-800 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-pressed={gender === "Female"}
          >
            Female
          </button>
        </div>
        <input type="hidden" name="gender" value={gender} />
      </Field>

      <button
        type="submit"
        className="w-full bg-emerald-800 text-white font-medium py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs mt-1 cursor-pointer"
      >
        Create Account
      </button>

      <div className="relative flex py-1 items-center">
        <div className="grow border-t border-gray-200" />
        <span className="shrink mx-4 text-gray-400 text-[10px] sm:text-xs tracking-wider uppercase">
          Or continue with
        </span>
        <div className="grow border-t border-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 px-2 py-1.5 text-[0.7rem] font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:py-2 sm:text-xs cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-black px-2 py-1.5 text-[0.7rem] font-medium text-white transition-colors hover:bg-gray-800 sm:py-2 sm:text-xs cursor-pointer"
        >
          {/* Inline Apple brand mark; lucide-react does not include brand logos. */}
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.96 2.76 1.01.08 2.07-.51 2.69-1.26z" />
          </svg>
          Apple
        </button>
      </div>

      <p className="pt-1 text-center text-[0.7rem] text-gray-500 sm:text-xs">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-800 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
