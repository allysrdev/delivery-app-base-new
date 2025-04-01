import Image from 'next/image';
import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function Avatar({ src = "/default-avatar.png", alt = "", width = 100, height = 100 }: AvatarProps) {
  return (
    <div className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-full p-2 min-w-[5rem] h-[5rem] flex items-center justify-center text-white/70">
      <Image
        className="w-full h-full object-cover rounded-full"
        width={width}
        height={height}
        src={src}
        alt={alt}
      />
    </div>
  );
}
