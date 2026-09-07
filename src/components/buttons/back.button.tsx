"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center justify-center gap-2 border border-secondary bg-white px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all shadow-xs cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      Go Back
    </button>
  );
}
