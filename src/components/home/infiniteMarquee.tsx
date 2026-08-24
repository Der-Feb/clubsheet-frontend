"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LucideIcon } from 'lucide-react';

export type FeatureItem = {
  label: string;
  icon: LucideIcon;
};

type TInfiniteMarqueeProps = {
  items: FeatureItem[];
};

export default function InfiniteMarquee({ items }: TInfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 35,
        ease: 'none',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    /* Outer clip wrapper: [clip-path:inset(0)] prevents ANYTHING inside from overflowing the page boundary */
    <div className="relative w-full overflow-hidden [clip-path:inset(0)] border-y border-emerald-950/10 py-4 bg-quaternary select-none">
      {/* Track wrapper forced to exact 100% parent width */}
      <div className="w-full overflow-hidden">
        <div 
          ref={containerRef} 
          className="flex w-max shrink-0 items-center gap-8"
        >
          {[...items, ...items].map((item, ndx) => {
            const IconComponent = item.icon;

            return (
              <div
                key={ndx}
                className="flex shrink-0 items-center gap-2.5 rounded-xl border border-gray-200/80 bg-white/90 px-4 py-2 text-xs font-bold tracking-wider text-gray-700 shadow-xs"
              >
                <IconComponent className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}