import Image from "next/image";
import Link from "next/link";
import RegisterForm from "./register.form";

export default function RegisterPage() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-linear-to-br from-amber-50 via-teal-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-5xl min-h-0 rounded-3xl bg-[#111111] shadow-2xl flex flex-col overflow-hidden lg:h-[90dvh] lg:max-h-[90dvh] lg:flex-row">
        {/* Left Hero Branding Column - Server Rendered */}
        <div className="relative w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-white z-10 overflow-hidden">
          <Image
            src="/images/hero-football-athlete.jpeg"
            alt="Soccer athlete background"
            fill
            className="object-cover absolute inset-0 z-0"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20 z-10" />

          <Link href="/" className="relative z-20 flex gap-2 items-center w-fit hover:opacity-90 transition-opacity">
            <Image
              src="/images/logo-light-clip.jpeg"
              alt="Logo - Light Clip"
              width={30}
              height={30}
              className="rounded-md"
            />
            <h3 className="text-sm font-semibold sm:text-base">ClubSheet</h3>
          </Link>

          <div className="relative z-20 space-y-2 sm:space-y-3 mt-auto">
            <h2 className="text-base font-bold tracking-tight sm:text-xl">Join the Elite.</h2>
            <p className="max-w-md text-[0.65rem] leading-relaxed text-gray-300 sm:text-[0.7rem]">
              The world&apos;s top clubs use ClubSheet to manage their rosters, staff, and finances with surgical precision. Start building your legacy today.
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="relative z-20 flex w-full shrink-0 flex-col justify-start overflow-visible rounded-t-3xl bg-[#f8fbf6] p-6 lg:min-h-0 lg:w-1/2 lg:flex-1 lg:rounded-none sm:p-8">
          <div className="mx-auto w-full max-w-md py-3 space-y-2 sm:py-5 sm:space-y-2.5 lg:py-6">
            <div>
              <h1 className="text-base font-bold text-gray-900 sm:text-lg">Create Account</h1>
              <p className="text-[0.65rem] text-gray-500 sm:text-[0.7rem]">Enter your details to get started.</p>
            </div>

            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
