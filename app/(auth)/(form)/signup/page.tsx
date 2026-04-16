import { SignUpForm } from "@/components/Auth/SignUpForm";

export const metadata = {
  title: `Create Account | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `Join ${process.env.NEXT_PUBLIC_APP_NAME} and start managing your business smarter.`,
};

export default function SignUpPage() {
  return <SignUpForm />;
}
