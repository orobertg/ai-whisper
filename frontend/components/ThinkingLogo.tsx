"use client";

type ThinkingLogoProps = {
  size?: number;
  className?: string;
};

/**
 * AI Whisper Thinking Indicator - Minimalist Three Bouncing Dots
 */
export default function ThinkingLogo({ 
  size = 24, 
  className = "" 
}: ThinkingLogoProps) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`} style={{ width: size * 2, height: size }}>
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        
        .dot {
          width: ${size / 4}px;
          height: ${size / 4}px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          animation: bounce 1.4s ease-in-out infinite;
        }
        
        .dot-1 {
          animation-delay: 0s;
        }
        
        .dot-2 {
          animation-delay: 0.2s;
        }
        
        .dot-3 {
          animation-delay: 0.4s;
        }
      `}</style>
      
      <div className="dot dot-1" />
      <div className="dot dot-2" />
      <div className="dot dot-3" />
    </div>
  );
}

