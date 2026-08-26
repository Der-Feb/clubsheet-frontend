'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { chaosCards } from './chaos2Clarity/chaos.state';
import { ClarityState } from './chaos2Clarity/clarity.state';

gsap.registerPlugin(Draggable, ScrollTrigger);

const Z = { base: 10, hover: 500, drag: 1000 } as const;

// ---------------------------------------------------------------------------
// Visual story
//
//  0%  – 15%   Chaos:      cards float, drag enabled
//  15% – 40%   Converge:   cards fly toward their slot positions, un-rotate.
//                          The window chrome fades in gently around them —
//                          the frame appears AROUND the moving cards.
//  40% – 70%   Land:       each card arrives at its slot and resizes to fill
//                          it exactly (width/height morph). The card content
//                          crossfades into the dashboard panel version.
//  70% – 100%  Clarity:    headline swaps. Dashboard is fully assembled.
//
// No pre-existing empty grid. No hard swap. Cards ARE the panels.
// ---------------------------------------------------------------------------

export function Chaos2ClaritySection() {
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const stickyRef     = useRef<HTMLDivElement>(null);
  const cardFieldRef  = useRef<HTMLDivElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);  // outer centering layer
  const chromeRef     = useRef<HTMLDivElement>(null);  // window frame + nav
  const headline1Ref  = useRef<HTMLHeadingElement>(null);
  const headline2Ref  = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const subtitle2Ref  = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const scrollWrap = scrollWrapRef.current;
    const sticky     = stickyRef.current;
    const cardField  = cardFieldRef.current;
    if (!scrollWrap || !sticky || !cardField) return;

    const cardEls = gsap.utils.toArray<HTMLElement>('[data-chaos-card]');
    const floatTweens: (gsap.core.Tween | undefined)[] = [];
    const draggableInstances: Draggable[] = [];

    // Set all initial states immediately so nothing is visible until scroll
    gsap.set(containerRef.current, { opacity: 0 });
    gsap.set(chromeRef.current,    { opacity: 0 });
    gsap.set(headline2Ref.current, { opacity: 0, y: '0.875rem' });
    gsap.set(subtitle2Ref.current, { opacity: 0, y: '0.5rem' });
    // All slot panels start invisible
    const getPanels = () =>
      containerRef.current
        ? Array.from(containerRef.current.querySelectorAll<HTMLElement>('[data-slot-panel]'))
        : [];
    gsap.set(getPanels(), { opacity: 0 });

    const ctx = gsap.context(() => {

      // ── 1. Float animations ────────────────────────────────────────────
      cardEls.forEach((el) => {
        floatTweens.push(gsap.to(el, {
          x: `+=${gsap.utils.random(-28, 28)}`,
          y: `+=${gsap.utils.random(-22, 22)}`,
          rotation: `+=${gsap.utils.random(-6, 6)}`,
          duration: gsap.utils.random(2.5, 4.2),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 2),
        }));
      });

      // ── 2. Draggable + hover ───────────────────────────────────────────
      cardEls.forEach((el, i) => {
        let isHovered  = false;
        let isDragging = false;

        const restartFloat = () => {
          floatTweens[i]?.kill();
          floatTweens[i] = gsap.to(el, {
            x: `+=${gsap.utils.random(-28, 28)}`,
            y: `+=${gsap.utils.random(-22, 22)}`,
            rotation: `+=${gsap.utils.random(-6, 6)}`,
            duration: gsap.utils.random(2.5, 4.2),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        };

        const [instance] = Draggable.create(el, {
          bounds: cardField,
          edgeResistance: 0.85,
          type: 'x,y',
          onPress() {
            isDragging = true;
            floatTweens[i]?.pause();
            gsap.to(el, { scale: 1.3, rotation: 0, zIndex: Z.drag, duration: 0.2, ease: 'power2.out' });
          },
          onRelease() {
            isDragging = false;
            if (isHovered) {
              gsap.to(el, { scale: 1.25, zIndex: Z.hover, duration: 0.2 });
            } else {
              gsap.to(el, { scale: 1, zIndex: Z.base, duration: 0.2 });
              restartFloat();
            }
          },
        });
        draggableInstances.push(instance);

        el.addEventListener('mouseenter', () => {
          isHovered = true;
          if (isDragging) return;
          floatTweens[i]?.pause();
          gsap.to(el, { scale: 1.25, rotation: 0, zIndex: Z.hover, duration: 0.2, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
          isHovered  = false;
          if (isDragging) return;
          gsap.to(el, { scale: 1, zIndex: Z.base, duration: 0.2, ease: 'power2.out' });
          floatTweens[i]?.resume();
        });
      });

      // ── 3. Master scroll timeline ──────────────────────────────────────
      let masterTl: gsap.core.Timeline | null = null;

      const buildTimeline = () => {
        if (masterTl) { masterTl.kill(); masterTl = null; }
        floatTweens.forEach((t)  => t?.pause());
        draggableInstances.forEach((d) => d.disable());

        // Re-hide panels in case of rebuild
        gsap.set(getPanels(), { opacity: 0 });

        masterTl = gsap.timeline({ paused: true });

        // Make the outer container visible (it's just a centering wrapper)
        // so that the slot elements have correct DOMRect values.
        // The chrome itself stays opacity:0 — we animate it separately.
        gsap.set(containerRef.current, { opacity: 1 });

        // Layer stagger: bg cards start first, fg last
        const layerStart: Record<string, number> = { bg: 0.15, mid: 0.19, fg: 0.23 };

        // ── Phase: window chrome fades in while cards are converging ──────
        // This makes the frame appear AROUND the cards as they arrive,
        // not before them. Starts at 20%, fully visible by 45%.
        masterTl.fromTo(
          chromeRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'power1.inOut', duration: 0.25 },
          0.20,
        );

        cardEls.forEach((el, i) => {
          const card   = chaosCards[i];
          if (!card) return;

          const slotEl = document.getElementById(`slot-${card.id}`);
          if (!slotEl) return;

          // Capture live GSAP transform so targets are absolute (not cumulative)
          const currentX = gsap.getProperty(el, 'x') as number;
          const currentY = gsap.getProperty(el, 'y') as number;

          const cardRect = el.getBoundingClientRect();
          const slotRect = slotEl.getBoundingClientRect();

          const deltaX  = slotRect.left + slotRect.width  / 2 - cardRect.left - cardRect.width  / 2;
          const deltaY  = slotRect.top  + slotRect.height / 2 - cardRect.top  - cardRect.height / 2;
          const targetX = currentX + deltaX;
          const targetY = currentY + deltaY;

          const start = layerStart[card.layer] ?? 0.15;

          // ── Phase 1 (15%–55%): card flies to slot center, rotation → 0 ─
          masterTl!.to(el, {
            x: targetX,
            y: targetY,
            rotation: 0,
            ease: 'power2.inOut',
            duration: 0.40,
          }, start);

          // ── Phase 2 (55%–75%): card resizes to fill its slot exactly ────
          // The card morphs: it scales from card dimensions to slot dimensions.
          // We compute the ratio between the slot size and the card size.
          const scaleX = slotRect.width  / cardRect.width;
          const scaleY = slotRect.height / cardRect.height;
          // Use the larger of the two to fill without letter-boxing,
          // then clip with overflow:hidden on the card wrapper.
          const fillScale = Math.max(scaleX, scaleY);

          masterTl!.to(el, {
            scale: fillScale,
            ease: 'power2.inOut',
            duration: 0.18,
            zIndex: Z.base,
          }, 0.55);

          // ── Phase 3 (72%–82%): card content fades out, slot panel fades in
          // The card wrapper is still at slot position+size. We fade the
          // chaos card's inner content out, and the slot panel (which is
          // rendered in the same position by the grid) fades in.
          masterTl!.to(el, {
            opacity: 0,
            ease: 'power2.in',
            duration: 0.10,
          }, 0.72);

          const slotPanel = slotEl.querySelector<HTMLElement>('[data-slot-panel]');
          if (slotPanel) {
            masterTl!.to(slotPanel, {
              opacity: 1,
              ease: 'power2.out',
              duration: 0.12,
            }, 0.74);
          }
        });

        // ── Phase 4: headline crossfade (70%–84%) ──────────────────────────
        masterTl.to(headline1Ref.current,
          { opacity: 0, y: '-0.875rem', ease: 'power2.in', duration: 0.08 },
          0.70,
        );
        masterTl.to(subtitleRef.current,
          { opacity: 0, ease: 'power2.in', duration: 0.06 },
          0.70,
        );
        masterTl.fromTo(headline2Ref.current,
          { opacity: 0, y: '0.875rem' },
          { opacity: 1, y: '0rem', ease: 'power2.out', duration: 0.10 },
          0.76,
        );
        masterTl.fromTo(subtitle2Ref.current,
          { opacity: 0, y: '0.5rem' },
          { opacity: 1, y: '0rem', ease: 'power2.out', duration: 0.10 },
          0.80,
        );

        return masterTl;
      };

      // ── Pin + scrub ────────────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: scrollWrap,
        start: 'top top',
        end: 'bottom bottom',
        pin: sticky,
        pinSpacing: false,
        scrub: 1.8,

        onEnter() {
          draggableInstances.forEach((d) => d.disable());
          floatTweens.forEach((t) => t?.pause());
          buildTimeline();
        },

        onLeaveBack() {
          masterTl?.kill();
          masterTl = null;

          // Reset cards
          cardEls.forEach((el) => {
            gsap.to(el, {
              x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
              duration: 0.5, ease: 'power2.out', overwrite: true,
            });
          });

          // Reset chrome and container
          gsap.set(containerRef.current, { opacity: 0 });
          gsap.set(chromeRef.current,    { opacity: 0 });
          gsap.set(getPanels(),          { opacity: 0 });

          // Reset headlines
          gsap.set(headline1Ref.current, { opacity: 1, y: '0rem' });
          gsap.set(headline2Ref.current, { opacity: 0, y: '0.875rem' });
          gsap.set(subtitleRef.current,  { opacity: 1 });
          gsap.set(subtitle2Ref.current, { opacity: 0, y: '0.5rem' });

          // Re-enable chaos
          draggableInstances.forEach((d) => d.enable());
          cardEls.forEach((el, i) => {
            floatTweens[i]?.kill();
            floatTweens[i] = gsap.to(el, {
              x: `+=${gsap.utils.random(-28, 28)}`,
              y: `+=${gsap.utils.random(-22, 22)}`,
              rotation: `+=${gsap.utils.random(-6, 6)}`,
              duration: gsap.utils.random(2.5, 4.2),
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          });
        },

        onUpdate(self) {
          masterTl?.progress(self.progress);
        },
      });

    }, scrollWrap);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);
    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={scrollWrapRef} className="relative h-[600vh] w-full">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden select-none bg-quaternary"
      >
        {/* Headline strip */}
        <div className="absolute inset-x-0 top-0 h-36 z-50 pointer-events-none flex flex-col items-center justify-center text-center px-4 gap-2">
          <div className="relative flex justify-center w-full">
            <h2 ref={headline1Ref} className="font-bold text-4xl text-zinc-900 tracking-tight leading-tight">
              Running a club shouldn&apos;t feel this scattered.
            </h2>
            <h2 ref={headline2Ref} className="absolute inset-0 flex items-center justify-center font-bold text-4xl text-zinc-900 tracking-tight leading-tight opacity-0">
              Everything your club needs. Together.
            </h2>
          </div>
          <div className="relative h-5 w-full flex justify-center">
            <p ref={subtitleRef} className="absolute text-zinc-500 text-sm max-w-md font-sans">
              Spreadsheets, group chats, and disconnected schedules — all in one place.
            </p>
            <p ref={subtitle2Ref} className="absolute text-zinc-500 text-sm max-w-md font-sans opacity-0">
              One workspace. Every part of your club, organised.
            </p>
          </div>
        </div>

        {/* Chaos cards — fill space below headline */}
        <div ref={cardFieldRef} className="absolute inset-x-0 bottom-0 top-36 pointer-events-auto">
          {chaosCards.map((card) => (
            <div
              key={card.id}
              data-chaos-card={card.id}
              data-layer={card.layer}
              className={`absolute h-34 w-auto cursor-grab active:cursor-grabbing shadow-md rounded-lg overflow-hidden ${card.positionClass}`}
              style={{ zIndex: Z.base }}
            >
              {card.component}
            </div>
          ))}
        </div>

        {/* Dashboard — same region, z below cards during chaos, above during clarity */}
        <div className="absolute inset-x-0 bottom-0 top-36 z-20 pointer-events-none">
          <ClarityState containerRef={containerRef} chromeRef={chromeRef} />
        </div>
      </div>
    </div>
  );
}

export default Chaos2ClaritySection;
