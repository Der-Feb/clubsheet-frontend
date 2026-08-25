import React from 'react';
import { CoachCard, NotificationCard, TrainingCard } from './chaos2Charity/training&coach';
import { DocumentsCard, FinancialCard, PermissionCard } from './chaos2Charity/admin&docs';
import { ActionTasksCard, KitEquipmentCard, MedicalRecordCard } from './chaos2Charity/operations&tasks';
import Calendar, { GroupChat, PlayerCard, SpreadSheet } from './chaos2Charity/core&training';

function Chaos2Clarity() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Scattered items configuration (coordinates, base rotations, and initial z-indexes)
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

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-50 select-none">
      {/* 1. Header & Text Content */}
      <div className="relative z-50 flex flex-col items-center text-center pt-12 px-4 pointer-events-none">
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
              absolute h-34 w-auto
              transition-all duration-300 ease-out transform cursor-pointer
              shadow-md hover:shadow-2xl rounded-lg
              hover:h-40 hover:scale-125 hover:rotate-0 hover:z-50
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