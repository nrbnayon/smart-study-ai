import VerifyOtp from "@/components/Auth/VerifyOtp";
import { Suspense } from "react";

export const metadata = {
  title: `Verify OTP | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `Verify OTP for ${process.env.NEXT_PUBLIC_APP_NAME} users.`,
};

export default function VerifyOtpPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtp />
      </Suspense>
    </div>
  );
}
