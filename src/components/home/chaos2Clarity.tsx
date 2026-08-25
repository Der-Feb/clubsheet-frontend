import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

import { CoachCard, NotificationCard, TrainingCard } from './chaos2Charity/training&coach';
import { DocumentsCard, FinancialCard, PermissionCard } from './chaos2Charity/admin&docs';
import { ActionTasksCard, KitEquipmentCard, MedicalRecordCard } from './chaos2Charity/operations&tasks';
import Calendar, { GroupChat, PlayerCard, SpreadSheet } from './chaos2Charity/core&training';

gsap.registerPlugin(Draggable);

const cards = [
  { id: 'spreadsheet', component: <SpreadSheet height="100%" />, style: 'top-[18%] left-[6%] -rotate-6 z-10' },
  { id: 'calendar', component: <Calendar height="100%" />, style: 'top-[14%] right-[10%] rotate-3 z-20' },
  { id: 'groupChat', component: <GroupChat height="100%" />, style: 'top-[32%] left-[2%] rotate-12 z-15' },
  { id: 'playerCard', component: <PlayerCard height="100%" />, style: 'top-[28%] right-[5%] -rotate-12 z-30' },
  { id: 'trainingCard', component: <TrainingCard height="100%" />, style: 'top-[42%] left-[18%] rotate-6 z-25' },
  { id: 'coachCard', component: <CoachCard height="100%" />, style: 'top-[48%] right-[22%] -rotate-3 z-10' },
  { id: 'notification', component: <NotificationCard height="100%" />, style: 'top-[58%] left-[8%] -rotate-6 z-40' },
  { id: 'documents', component: <DocumentsCard height="100%" />, style: 'top-[62%] right-[12%] rotate-12 z-20' },
  { id: 'permission', component: <PermissionCard height="100%" />, style: 'top-[68%] left-[30%] -rotate-2 z-15' },
  { id: 'financial', component: <FinancialCard height="100%" />, style: 'top-[75%] right-[28%] rotate-6 z-35' },
  { id: 'medical', component: <MedicalRecordCard height="100%" />, style: 'top-[78%] left-[12%] rotate-3 z-10' },
  { id: 'kitEquipment', component: <KitEquipmentCard height="100%" />, style: 'top-[82%] right-[8%] -rotate-6 z-25' },
  { id: 'actionTasks', component: <ActionTasksCard height="100%" />, style: 'top-[84%] left-[42%] rotate-1 z-30' },
];

function Chaos2Clarity() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cardElements = gsap.utils.toArray<HTMLElement>('.draggable-card');

      cardElements.forEach((el) => {
        let isHovered = false;
        let isDragging = false;
        let floatAnim: gsap.core.Tween;

        // Helper function to create/restart the float animation from CURRENT position
        const startFloating = () => {
          if (floatAnim) floatAnim.kill(); // Kill previous float tween so it doesn't snap back
          floatAnim = gsap.to(el, {
            x: `+=${gsap.utils.random(-25, 25)}`,
            y: `+=${gsap.utils.random(-20, 20)}`,
            rotation: `+=${gsap.utils.random(-5, 5)}`,
            duration: gsap.utils.random(2.5, 4.2),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        };

        startFloating();

        Draggable.create(el, {
          bounds: containerRef.current,
          edgeResistance: 0.85,
          type: 'x,y',
          onPress() {
            isDragging = true;
            if (floatAnim) floatAnim.pause();
            gsap.to(el, {
              scale: 1.3,
              rotation: 0,
              zIndex: 1000,
              duration: 0.2,
              ease: 'power2.out',
            });
          },
          onRelease() {
            isDragging = false;
            if (isHovered) {
              gsap.to(el, {
                scale: 1.25,
                zIndex: 500,
                duration: 0.2,
              });
            } else {
              gsap.to(el, {
                scale: 1,
                zIndex: 50,
                duration: 0.2,
              });
              // Restart float animation from the NEW dropped position instead of snapping back
              startFloating();
            }
          },
        });

        el.addEventListener('mouseenter', () => {
          isHovered = true;
          if (isDragging) return;
          if (floatAnim) floatAnim.pause();
          gsap.to(el, {
            scale: 1.25,
            rotation: 0,
            zIndex: 500,
            duration: 0.2,
            ease: 'power2.out',
          });
        });

        el.addEventListener('mouseleave', () => {
          isHovered = false;
          if (isDragging) return;
          gsap.to(el, {
            scale: 1,
            zIndex: 50,
            duration: 0.2,
            ease: 'power2.out',
          });
          if (floatAnim) floatAnim.resume();
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden select-none bg-quaternary">
      {/* 1. Header & Text Content */}
      <div className="mt-50 relative z-50 flex flex-col items-center text-center pt-12 px-4 pointer-events-none">
        <h1 className="font-bold text-4xl text-zinc-900 tracking-tight">Your Club is busy enough.</h1>
        <h2 className="font-bold text-4xl text-zinc-900 tracking-tight mt-1">Your Tools shouldn't make it harder.</h2>
        <p className="text-zinc-600 text-base max-w-xl mt-4">
          Spreadsheets, group chats, and disconnected schedules make running a club harder than it needs to be.
        </p>
      </div>

      {/* 2. Scattered Cards Field */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`
              draggable-card absolute h-34 w-auto
              cursor-grab active:cursor-grabbing
              shadow-md hover:shadow-2xl rounded-lg
              ${card.style}
            `}
          >
            {card.component}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chaos2Clarity;