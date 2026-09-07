import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login.form";

export default function LoginPage() {
  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-linear-to-br from-amber-50 via-teal-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-[#111111] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        {/* Left Hero Brand Panel - Server Rendered */}
        <div className="relative w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-white z-10 overflow-hidden">
          <Image
            src="/images/hero-football-player.jpeg"
            alt="Soccer player background"
            fill
            className="object-cover absolute inset-0 z-0"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20 z-10" />

          <Link
            href="/"
            className="relative z-20 flex gap-2 items-center w-fit hover:opacity-90 transition-opacity"
          >
            <Image
              src="/images/logo-light-clip.jpeg"
              alt="Logo - Light Clip"
              width={30}
              height={30}
              className="rounded-md"
            />
            <h3 className="text-xl sm:text-2xl font-semibold">ClubSheet</h3>
          </Link>

          <div className="relative z-20 space-y-2 sm:space-y-3 mt-auto">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Run with Clarity.</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-md">
              The modern management platform for football clubs and academies. Sign in to manage your players, coaches, and schedules with surgical precision.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-1/2 bg-[#f8fbf6] rounded-t-3xl lg:rounded-none p-6 sm:p-8 flex flex-col justify-center relative z-20 overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto space-y-4 sm:space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Enter your credentials to access your club account.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}