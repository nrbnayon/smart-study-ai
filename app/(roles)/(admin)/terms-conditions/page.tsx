import DashboardHeader from "@/components/Shared/DashboardHeader";
import TermsAndConditionsClient from "@/components/AuthProtected/Admin/TermsAndConditions/TermsAndConditions";

export default function TermsAndConditionsPage() {
  return (
    <main>
      <DashboardHeader title="Terms & Conditions" />
      <div className="p-4 md:p-8">
        <TermsAndConditionsClient />
      </div>
    </main>
  );
}
