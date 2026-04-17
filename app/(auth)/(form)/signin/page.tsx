import { SignInForm } from "@/components/Auth/SignInForm";

export const metadata = {
  title: `Signin | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `Secure signin for ${process.env.NEXT_PUBLIC_APP_NAME} users.`,
};

export default function SignInPage() {
  return (
    <div className="flex-1 flex min-h-screen w-full items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
