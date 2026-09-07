import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import BackButton from "../components/buttons/back.button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-quaternary flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      {/* Subtle Background Ambience */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, #DFE3DA 0%, #F7FBF3 65%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <Image
            src="/images/logo-light-clip.jpeg"
            alt="ClubSheet Logo"
            width={32}
            height={32}
            className="rounded-lg shadow-xs"
          />
          <span className="text-lg font-bold text-primary tracking-tight">ClubSheet</span>
        </Link>

        <Link
          href="/login"
          className="text-xs font-semibold text-zinc-600 hover:text-primary transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto my-auto py-12 px-4">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-secondary/80 border border-secondary px-3.5 py-1.5 rounded-full mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700">
            404 Error · Out of Play
          </span>
        </div>

        {/* Big 404 Display */}
        <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tighter text-primary/15 select-none leading-none -mb-4 sm:-mb-6">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-3">
          You&apos;ve wandered off the pitch.
        </h2>

        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md mb-8">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or is temporarily out of bounds. Let&apos;s get you back in the match.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <BackButton />
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-tertiary hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="relative z-10 text-center text-zinc-400 text-xs py-2">
        <p>&copy; {new Date().getFullYear()} ClubSheet. Run your club with clarity.</p>
      </footer>
    </div>
  );
}
