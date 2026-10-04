'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FRAME_COUNT  = 300;
const FRAME_PATH   = (n: number) =>
  `/images/chaos-clarity/ezgif-frame-${String(n).padStart(3, '0')}.png`;

// How many viewport-heights the scroll pin lasts.
// 600vh gives ~5× the viewport to scrub through — same feel as before.
const SCROLL_HEIGHT = '600vh';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LoadState = 'loading' | 'ready' | 'error';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Chaos2ClaritySection() {
  const scrollWrapRef = useRef<HTMLDivElement>(null);
  const stickyRef     = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const frameRef      = useRef<{ value: number }>({ value: 0 });
  const imagesRef     = useRef<HTMLImageElement[]>([]);
  const headline1Ref  = useRef<HTMLHeadingElement>(null);
  const headline2Ref  = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const subtitle2Ref  = useRef<HTMLParagraphElement>(null);
  const progressRef   = useRef<HTMLDivElement>(null);

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [loadedCount, setLoadedCount] = useState(0);

  // ── Draw the current frame to canvas ─────────────────────────────────────
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img    = imagesRef.current[index];
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cover: fill canvas, crop equally on the longer axis
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth  || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih);
    const sw    = iw * scale;
    const sh    = ih * scale;
    const sx    = (cw - sw) / 2;
    const sy    = (ch - sh) / 2;

    ctx.drawImage(img, sx, sy, sw, sh);
  };

  // ── Preload all frames ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled  = false;
    let loaded     = 0;
    let errored    = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    const finish = () => {
      if (cancelled) return;
      imagesRef.current = images;
      if (errored === FRAME_COUNT) {
        setLoadState('error');
      } else {
        setLoadState('ready');
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src   = FRAME_PATH(i + 1);

      img.onload = () => {
        if (cancelled) return;
        loaded++;
        images[i] = img;
        setLoadedCount(loaded);

        // Draw the very first frame as soon as it's available
        if (i === 0) drawFrame(0);

        if (loaded + errored === FRAME_COUNT) finish();
      };

      img.onerror = () => {
        if (cancelled) return;
        errored++;
        // Use a blank placeholder so index stays stable
        images[i] = new Image();
        if (loaded + errored === FRAME_COUNT) finish();
      };

      images[i] = img; // assign immediately so we can draw index 0 right away
    }

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Resize canvas to match viewport ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(frameRef.current.value);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GSAP scroll animation — runs once frames are ready ───────────────────
  useEffect(() => {
    if (loadState !== 'ready') return;

    const scrollWrap = scrollWrapRef.current;
    const sticky     = stickyRef.current;
    if (!scrollWrap || !sticky) return;

    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      // Draw frame 0 immediately so there's no blank flash
      drawFrame(0);

      // Headline initial state
      gsap.set(headline2Ref.current, { opacity: 0, y: '0.75rem' });
      gsap.set(subtitle2Ref.current, { opacity: 0, y: '0.5rem'  });

      // The proxy object GSAP animates — we read it on every tick
      const proxy = { frame: 0 };

      const tl = gsap.timeline({ paused: true });

      // Frame sequence: 0 → FRAME_COUNT−1 over the whole scroll
      tl.to(proxy, {
        frame: FRAME_COUNT - 1,
        snap: { frame: 1 },
        ease: 'none',
        duration: 1,
        onUpdate() {
          const idx = Math.round(proxy.frame);
          frameRef.current.value = idx;
          drawFrame(idx);
        },
      });

      // Headline crossfade: chaos headline out at ~70%, clarity in at ~80%
      tl.to(
        headline1Ref.current,
        { opacity: 0, y: '-0.75rem', ease: 'power2.in', duration: 0.08 },
        0.70,
      );
      tl.to(
        subtitleRef.current,
        { opacity: 0, ease: 'power2.in', duration: 0.06 },
        0.70,
      );
      tl.fromTo(
        headline2Ref.current,
        { opacity: 0, y: '0.75rem' },
        { opacity: 1, y: '0', ease: 'power2.out', duration: 0.10 },
        0.80,
      );
      tl.fromTo(
        subtitle2Ref.current,
        { opacity: 0, y: '0.5rem' },
        { opacity: 1, y: '0', ease: 'power2.out', duration: 0.10 },
        0.84,
      );

      const st = ScrollTrigger.create({
        trigger:    scrollWrap,
        start:      'top top',
        end:        'bottom bottom',
        pin:        sticky,
        pinSpacing: false,
        scrub:      1.2,
        onUpdate(self) {
          tl.progress(self.progress);
        },
        onLeaveBack() {
          tl.progress(0);
          proxy.frame = 0;
          frameRef.current.value = 0;
          drawFrame(0);
          gsap.set(headline1Ref.current, { opacity: 1, y: '0' });
          gsap.set(subtitleRef.current,  { opacity: 1, y: '0' });
          gsap.set(headline2Ref.current, { opacity: 0, y: '0.75rem' });
          gsap.set(subtitle2Ref.current, { opacity: 0, y: '0.5rem'  });
        },
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);

      return () => {
        st.kill();
        tl.kill();
        window.removeEventListener('resize', onResize);
      };
    });

    return () => media.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadState]);

  // ── Progress percentage for the loading bar ───────────────────────────────
  const progress = Math.round((loadedCount / FRAME_COUNT) * 100);

  return (
    <div
      ref={scrollWrapRef}
      className="chaos2-clarity-wrap relative w-full"
      style={{ height: SCROLL_HEIGHT }}
    >
      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="chaos2-clarity-sticky sticky top-0 h-dvh w-full overflow-hidden select-none bg-zinc-100"
      >

        {/* Canvas — fills the entire sticky viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Loading overlay — visible until all frames are ready */}
        {loadState === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-100 z-20">
            <div className="w-48 sm:w-64">
              <div ref={progressRef} className="h-0.5 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-center text-[0.625rem] font-mono text-zinc-400">
                {progress}%
              </p>
            </div>
          </div>
        )}

        {/* Error fallback */}
        {loadState === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-zinc-100">
            <p className="text-xs text-zinc-400 font-mono">Could not load animation frames.</p>
          </div>
        )}

        {/* Headline overlay — sits above canvas */}
        <div
          className="absolute inset-x-0 top-0 z-10 flex h-24 flex-col items-center justify-center gap-1.5 px-4 text-center pointer-events-none"
          style={{ paddingTop: '4rem' /* clear sticky navbar */ }}
        >
          <div className="relative flex justify-center w-full">
            <h2
              ref={headline1Ref}
              className="chaos2-clarity-headline-initial font-bold text-2xl text-zinc-900 tracking-tight leading-tight drop-shadow-sm"
            >
              Running a club shouldn&apos;t feel this scattered.
            </h2>
            <h2
              ref={headline2Ref}
              className="chaos2-clarity-headline-final absolute inset-0 flex items-center justify-center font-bold text-2xl text-zinc-900 tracking-tight leading-tight drop-shadow-sm"
              style={{ opacity: 0 }}
            >
              Everything your club needs. Together.
            </h2>
          </div>

          <div className="relative h-5 w-full flex justify-center">
            <p
              ref={subtitleRef}
              className="chaos2-clarity-subtitle-initial absolute text-zinc-600 text-xs max-w-md font-sans drop-shadow-sm"
            >
              Spreadsheets, group chats, and disconnected schedules — all in one place.
            </p>
            <p
              ref={subtitle2Ref}
              className="chaos2-clarity-subtitle-final absolute text-zinc-600 text-xs max-w-md font-sans drop-shadow-sm"
              style={{ opacity: 0 }}
            >
              One workspace. Every part of your club, organised.
            </p>
          </div>
        </div>

        {/* Scroll hint — fades out once user starts scrolling (CSS only) */}
        {loadState === 'ready' && (
          <div className="chaos2-clarity-scroll-hint absolute bottom-6 inset-x-0 flex-center flex-col gap-1.5 z-10 pointer-events-none">
            <span className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-500">Scroll</span>
            <svg className="w-4 h-4 text-zinc-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* ── Mobile / reduced-motion fallback ──────────────────────────
            On small screens and for reduced-motion users the canvas
            animation is replaced with a static first-frame image and
            a simple pill list — matching the previous section's mobile
            experience, consistent with the rest of the marketing page. */}
        <div className="chaos-mobile-text absolute inset-0 hidden flex-col items-center justify-center px-6 text-center z-10">
          {/* Static first frame as a background hint */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FRAME_PATH(1)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold leading-tight text-zinc-900">
              Everything your club needs. Together.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-600">
              Turn scattered tools into one clear workspace.
            </p>
            <div className="flex w-full max-w-sm flex-wrap justify-center gap-2 pt-2">
              {['Spreadsheets', 'Group chats', 'Schedules', 'Athletes', 'Staff', 'Permissions'].map((label, i) => (
                <span
                  key={label}
                  className="rounded-full border border-secondary bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chaos2ClaritySection;
