import ForgetPassword from "@/components/Auth/ForgetPassword";

export const metadata = {
  title: `Forgot Password | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `Forgot password for ${process.env.NEXT_PUBLIC_APP_NAME} users.`,
};

export default function ForgetPasswordPage() {
  return (
    <div>
      <ForgetPassword />
    </div>
  );
}
