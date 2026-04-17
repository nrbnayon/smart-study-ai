// components/Shared/StatsCard.tsx
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  isUp?: boolean;
  subtitle?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  isUp,
  subtitle,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)]",
        className,
      )}
    >
      {/* Top Row: Icon and Trend/Subtitle */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center rounded-xl w-12 h-12"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={24} style={{ color: iconColor }} strokeWidth={2} />
        </div>

        {subtitle && (
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
              isUp === true
                ? "bg-[#ECFDF5] text-[#10B981]"
                : isUp === false
                  ? "bg-[#FEF2F2] text-[#EF4444]"
                  : "text-secondary font-medium px-0", // Neutral style when isUp is undefined
            )}
          >
            {isUp === true && <TrendingUp className="w-3.5 h-3.5" />}
            {isUp === false && <TrendingDown className="w-3.5 h-3.5" />}
            {subtitle}
          </div>
        )}
      </div>

      {/* Bottom Content: Title and Value */}
      <div className="flex flex-col gap-1">
        <h3 className="text-secondary text-sm font-medium">{title}</h3>
        <div className="text-3xl font-bold text-foreground leading-tight">
          {value}
        </div>
      </div>
    </div>
  );
}
