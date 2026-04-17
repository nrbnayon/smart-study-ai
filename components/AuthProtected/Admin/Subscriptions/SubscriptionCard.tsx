import { BookOpen, Check, Edit3, X, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeature {
  id: string;
  name: string;
  included: boolean;
}

interface SubscriptionCardProps {
  planType: "Basic" | "Premium";
  subscribersCount: number;
  features: PlanFeature[];
  onEditFeatures: (planType: "Basic" | "Premium") => void;
  price?: string;
  className?: string;
}

export function SubscriptionCard({
  planType,
  subscribersCount,
  features,
  onEditFeatures,
  price,
  className,
}: SubscriptionCardProps) {
  const isPremium = planType === "Premium";

  return (
    <div
      className={cn(
        "bg-white rounded-[20px] shadow-[0px_4px_24px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col relative",
        isPremium ? "border border-[#818CF8]" : "border border-gray-100",
        className,
      )}
    >
      {/* Premium Price Banner */}
      {isPremium && price && (
        <div className="absolute top-0 right-0 p-8 text-right z-10">
          <p className="text-sm text-secondary font-medium tracking-wide">
            Price
          </p>
          <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
            <span className="text-2xl font-bold text-foreground">
              {price} /{" "}
            </span>
            <span className="text-sm text-secondary font-medium">
              per month
            </span>
          </div>
        </div>
      )}

      {/* Premium Top Border Indicator */}
      {isPremium && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      )}

      <div className="p-8 pb-4">
        {/* Header Section */}
        <div className="flex flex-col gap-1 mb-5">
          <div className="flex items-center gap-2">
            {isPremium ? (
              <Crown size={22} className="text-primary" />
            ) : (
              <BookOpen size={22} className="text-secondary" />
            )}
            <h3
              className={cn(
                "text-xl font-bold",
                isPremium ? "text-primary" : "text-foreground",
              )}
            >
              {planType}
            </h3>
          </div>
          <div className="mt-2">
            <p className="text-sm text-secondary font-medium uppercase tracking-wide">
              Total Subscribers
            </p>
            <span className="text-2xl leading-none font-bold text-foreground block mt-1">
              {subscribersCount}
            </span>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-5">
          {features.map((f) => (
            <div key={f.id} className="flex items-center gap-3">
              {f.included ? (
                <div className="w-5 h-5 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                  <Check size={12} className="text-[#10B981]" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                  <X size={12} className="text-red-500" strokeWidth={3} />
                </div>
              )}
              <span
                className={cn(
                  "text-md font-medium transition-colors",
                  f.included ? "text-foreground" : "text-[#9CA3AF]",
                )}
              >
                {f.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button Footer */}
      <div className="mt-auto p-6 pt-0">
        <button
          onClick={() => onEditFeatures(planType)}
          className={cn(
            "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer",
            isPremium
              ? "bg-white border border-primary/30 text-primary hover:bg-primary/5"
              : "bg-white border border-gray-100 text-secondary hover:bg-gray-50",
          )}
        >
          <Edit3 size={16} /> Edit Features
        </button>
      </div>
    </div>
  );
}
