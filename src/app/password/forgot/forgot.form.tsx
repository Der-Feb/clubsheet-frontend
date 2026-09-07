"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
            We sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>.
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          <Link
            href={`/password/reset?email=${encodeURIComponent(email)}`}
            className="block w-full bg-emerald-800 text-white font-medium py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs text-xs sm:text-sm"
          >
            Continue to Reset Password
          </Link>

          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="w-full text-xs text-gray-500 hover:text-gray-800 transition-colors py-1 cursor-pointer"
          >
            Didn&apos;t get the email? Try another address
          </button>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
      <Field>
        <FieldLabel htmlFor="email">Email Address</FieldLabel>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Mail className="w-4 h-4" />
          </span>
        </div>
      </Field>

      <button
        type="submit"
        className="w-full bg-emerald-800 text-white font-medium py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
      >
        Send Reset Link
      </button>

      <p className="text-center text-xs sm:text-sm text-gray-500 pt-1">
        Remember your password?{" "}
        <Link href="/login" className="text-emerald-800 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
