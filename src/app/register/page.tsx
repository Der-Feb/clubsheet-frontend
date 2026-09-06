import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const RegisterPage = () => {
  return (
    <div className='max-h-screen flex  w-full p-10'>
      {/* branding panel */}
      <div className='register-branding-panel w-1/2 flex flex-col justify-between'>
        <div className="flex gap-2 items-center">
          <Image
            src="/images/logo-light-clip.jpeg"
            alt="Logo - Light Clip"
            width={30}
            height={30}
            className="scale-70"
          />
          <h3 className="text-2xl font-semibold">ClubSheet</h3>
        </div>

        <div>
          <h2 className="text-3xl font-semibold">Join the Elite</h2>
          <p className="">The world&apos;s top clubs use ClubSheet to manage their rosters, staff, and finances with surgical precision. Start building your legacy today.</p>
        </div>
      </div>

      {/* form */}
      <form className='p-10 px-24 bg-quaternary w-1/2'>
        <h1 className='text-3xl font-semibold mb-2'>Create Account</h1>
        <p className="text-gray-600">Enter your details to get started.</p>

        <FieldGroup>
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel htmlFor="first-name">First Name</FieldLabel>
              <Input id='first-name' placeholder="First Name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
              <Input id='last-name' placeholder="Last Name" />
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id='email' placeholder="Email" />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id='password' placeholder="Password" />
          </Field>
          <FieldGroup className="grid grid-cols-2">
            <Field>
              
            </Field>
            <Field></Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </div>
  )
}

export default RegisterPage;