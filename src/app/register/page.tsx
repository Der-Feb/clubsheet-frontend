import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-linear-to-br from-amber-50 via-teal-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-[#111111] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="relative w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-white z-10 overflow-hidden">
          <Image
            src="/images/hero-football-player.jpeg"
            alt="Soccer player background"
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
            <h3 className="text-xl sm:text-2xl font-semibold">ClubSheet</h3>
          </Link>

          <div className="relative z-20 space-y-2 sm:space-y-3 mt-auto">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Join the Elite.</h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-md">
              The world&apos;s top clubs use ClubSheet to manage their rosters, staff, and finances with surgical precision. Start building your legacy today.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-[#f8fbf6] rounded-t-3xl lg:rounded-none p-6 sm:p-8 flex flex-col justify-center relative z-20 overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto space-y-2.5 sm:space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-500 text-xs sm:text-sm">Enter your details to get started.</p>
            </div>

            <form className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <FieldGroup className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                  <Input id="first-name" placeholder="John" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                  <Input id="last-name" placeholder="Doe" />
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input id="email" placeholder="john.doe@example.com" />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input id="password" type="password" placeholder="********" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-800">
                    <Eye size={16} />
                  </button>
                </div>
              </Field>

              <FieldGroup className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                  <div className="relative">
                    <Input id="dob" placeholder="mm/dd/yyyy" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                  <select id="nationality" className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm text-muted-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option>Select country</option>
                  </select>
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel>Gender</FieldLabel>
                <div className="grid grid-cols-2 gap-2 bg-gray-200/50 p-1 rounded-lg">
                  <button type="button" className="py-1.5 text-xs sm:text-sm font-medium rounded-md bg-emerald-800 text-white shadow-xs">
                    Male
                  </button>
                  <button type="button" className="py-1.5 text-xs sm:text-sm font-medium rounded-md text-gray-600 hover:text-gray-900">
                    Female
                  </button>
                </div>
              </Field>

              <button type="submit" className="w-full bg-emerald-800 text-white font-medium py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs mt-1">
                Create Account
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-gray-200"></div>
                <span className="shrink mx-4 text-gray-400 text-[10px] sm:text-xs tracking-wider uppercase">Or continue with</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-700 transition-colors">
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 bg-black text-white py-1.5 sm:py-2 rounded-lg hover:bg-gray-800 text-xs sm:text-sm font-medium transition-colors">
                  Apple
                </button>
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-500 pt-1">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-800 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;