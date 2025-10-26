"use client";
import { AiNetworkIcon } from "@hugeicons/react";

type ThinkingLogoProps = {
  size?: number;
  className?: string;
};

/**
 * Reusable spinning logo component for AI thinking indicator
 * Can be swapped out with different logos by changing the icon import
 */
export default function ThinkingLogo({ 
  size = 14, 
  className = "text-white" 
}: ThinkingLogoProps) {
  return (
    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 animate-ai-thinking bg-zinc-800">
      <AiNetworkIcon size={size} className={className} strokeWidth={2} />
    </div>
  );
}

