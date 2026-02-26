import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, labels, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const done = step < currentStep;
          const active = step === currentStep;

          return (
            <div key={i} className="flex-1 flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                    done
                      ? "bg-primary border-primary text-white"
                      : active
                      ? "bg-white border-primary text-primary shadow-md shadow-primary/25"
                      : "bg-white border-gray-200 text-gray-400"
                  )}
                >
                  {done ? (
                    <Icon name="check" size={13} className="text-white" />
                  ) : (
                    step
                  )}
                </div>
                {labels && labels[i] && (
                  <span
                    className={cn(
                      "text-[10px] mt-1.5 text-center hidden sm:block font-medium",
                      active ? "text-primary" : done ? "text-gray-400" : "text-gray-300"
                    )}
                  >
                    {labels[i]}
                  </span>
                )}
              </div>

              {/* Connector */}
              {i < totalSteps - 1 && (
                <div className="flex-1 mx-2">
                  <div className={cn(
                    "h-0.5 rounded-full transition-all duration-300",
                    done ? "bg-primary" : "bg-gray-200"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
