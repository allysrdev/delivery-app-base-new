import React from "react";

interface BoxProps {
  children: React.ReactNode;
  tailWidth?: string; 
  tailHeight?: string; 
}

export default function Box({ children, tailWidth = "w-full", tailHeight = "h-full" }: BoxProps) {
  return (
    <div className={`bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-6 ${tailWidth} ${tailHeight}`}>
      {children}
    </div>
  );
}
