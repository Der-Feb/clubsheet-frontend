import type { Message } from '@/features/communication/types/communication.types';

// ─── Timestamp helpers ───────────────────────────────────────────────────────
const todayAt = (h: number, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const yesterdayAt = (h: number, m = 0) => {
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const daysAgoAt = (days: number, h: number, m = 0) => {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

// ─── Today's training event date (17:00) ────────────────────────────────────
const todayTrainingStart = (() => {
  const d = new Date();
  d.setHours(17, 0, 0, 0);
  return d.toISOString();
})();

// ─── Messages ────────────────────────────────────────────────────────────────

export const MOCK_COMMUNICATION_MESSAGES: Record<string, Message[]> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // grp-u17
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-u17': [
    // Pinned system message (also serves as msg-pin-1)
    {
      id: 'msg-pin-1',
      conversationId: 'grp-u17',
      senderId: 'system',
      content: 'Saturday vs APR FC U17 — 14:00 at Amahoro Stadium. Departure from club at 12:30.',
      messageType: 'SYSTEM',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(5, 9, 0),
      updatedAt: daysAgoAt(5, 9, 0),
    },
    // Auto-sync system message
    {
      id: 'msg-u17-1',
      conversationId: 'grp-u17',
      senderId: 'system',
      content: 'Members of this group are automatically synced with the U17 Team Roster.',
      messageType: 'SYSTEM',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(3, 8, 0),
      updatedAt: daysAgoAt(3, 8, 0),
    },
    // Coach text message with mention
    {
      id: 'msg-u17-2',
      conversationId: 'grp-u17',
      senderId: 'member-1',
      content:
        'Good morning team! Please review today\'s tactical session. @john.doe will lead the midfield pressing.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '👍', count: 3, memberIds: ['member-3', 'member-9', 'member-5'] },
        { emoji: '⚽', count: 2, memberIds: ['member-3', 'member-9'] },
      ],
      attachments: [],
      mentions: ['member-12'],
      isDeleted: false,
      createdAt: todayAt(8, 30),
      updatedAt: todayAt(8, 30),
    },
    // Event message
    {
      id: 'msg-u17-3',
      conversationId: 'grp-u17',
      senderId: 'member-1',
      content: 'U17 Tactical Training Session',
      messageType: 'EVENT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(8, 35),
      updatedAt: todayAt(8, 35),
      eventData: {
        title: 'U17 Tactical Training Session',
        date: todayTrainingStart,
        location: 'Pitch 2, Kigali Center',
        responses: {
          'member-9': 'GOING',
          'member-3': 'GOING',
          'member-5': 'MAYBE',
        },
      },
    },
    // Poll message
    {
      id: 'msg-u17-4',
      conversationId: 'grp-u17',
      senderId: 'member-5',
      content: 'Post-match Recovery Meal Preference',
      messageType: 'POLL',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(9, 0),
      updatedAt: todayAt(9, 0),
      pollData: {
        question: 'Post-match Recovery Meal Preference',
        options: [
          {
            id: 'opt-1',
            label: 'High Protein Chicken Bowl',
            voterIds: [
              'member-2',
              'member-3',
              'member-6',
              'member-7',
              'member-9',
              'member-11',
            ],
          },
          {
            id: 'opt-2',
            label: 'Pasta & Lean Beef Bolognese',
            voterIds: ['member-1', 'member-5'],
          },
        ],
        allowMultiple: false,
      },
    },
    // Jean-Pierre reply
    {
      id: 'msg-u17-5',
      conversationId: 'grp-u17',
      senderId: 'member-3',
      content: 'Looking forward to the session Coach! 💪',
      messageType: 'TEXT',
      reactions: [{ emoji: '❤️', count: 1, memberIds: ['member-1'] }],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(9, 15),
      updatedAt: todayAt(9, 15),
    },
    // John Doe (current user) reply to coach's message
    {
      id: 'msg-u17-6',
      conversationId: 'grp-u17',
      senderId: 'member-12',
      content:
        'Confirmed Coach! I have reviewed the GPS metrics from yesterday\'s recovery session.',
      messageType: 'TEXT',
      replyTo: 'msg-u17-2',
      reactions: [{ emoji: '✅', count: 1, memberIds: ['member-1'] }],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(9, 45),
      updatedAt: todayAt(9, 45),
    },
    // Alain message
    {
      id: 'msg-u17-7',
      conversationId: 'grp-u17',
      senderId: 'member-9',
      content: 'Coach, what time should we arrive for warm-up?',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(10, 5),
      updatedAt: todayAt(10, 5),
    },
    // Coach reply to Alain
    {
      id: 'msg-u17-8',
      conversationId: 'grp-u17',
      senderId: 'member-1',
      content: 'Arrive by 16:30 for a proper warm-up. No excuses for being late!',
      messageType: 'TEXT',
      replyTo: 'msg-u17-7',
      reactions: [
        { emoji: '👍', count: 2, memberIds: ['member-9', 'member-3'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(10, 10),
      updatedAt: todayAt(10, 10),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // grp-announcements
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-announcements': [
    {
      id: 'msg-ann-1',
      conversationId: 'grp-announcements',
      senderId: 'member-4',
      content:
        'Welcome to the official Kigali FC announcements channel. Only admins can post here.',
      messageType: 'SYSTEM',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(14, 9, 0),
      updatedAt: daysAgoAt(14, 9, 0),
    },
    {
      id: 'msg-ann-2',
      conversationId: 'grp-announcements',
      senderId: 'member-1',
      content:
        'New season training programme is now live. All players please review your individual plans on the ClubSheet app.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '👍', count: 5, memberIds: ['member-2', 'member-3', 'member-6', 'member-7', 'member-9'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(7, 10, 0),
      updatedAt: daysAgoAt(7, 10, 0),
    },
    {
      id: 'msg-ann-3',
      conversationId: 'grp-announcements',
      senderId: 'member-4',
      content:
        'Training facility maintenance scheduled for Monday 6-8 AM. All sessions moved to Pitch 3.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '✅', count: 4, memberIds: ['member-1', 'member-2', 'member-5', 'member-11'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(14, 0),
      updatedAt: yesterdayAt(14, 0),
    },
    {
      id: 'msg-ann-4',
      conversationId: 'grp-announcements',
      senderId: 'member-12',
      content:
        'Reminder: Annual membership renewals are due by end of this month. Please contact Marie for any payment queries.',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: ['member-4'],
      isDeleted: false,
      createdAt: todayAt(8, 0),
      updatedAt: todayAt(8, 0),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // grp-general
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-general': [
    {
      id: 'msg-gen-1',
      conversationId: 'grp-general',
      senderId: 'member-4',
      content: 'Good morning everyone! Happy new week. 🌟',
      messageType: 'TEXT',
      reactions: [
        { emoji: '❤️', count: 3, memberIds: ['member-1', 'member-8', 'member-12'] },
        { emoji: '😂', count: 1, memberIds: ['member-2'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(2, 7, 30),
      updatedAt: daysAgoAt(2, 7, 30),
    },
    {
      id: 'msg-gen-2',
      conversationId: 'grp-general',
      senderId: 'member-2',
      content: 'Big win on Saturday! The boys played exceptionally well. Proud of the squad.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '⚽', count: 6, memberIds: ['member-1', 'member-3', 'member-5', 'member-7', 'member-9', 'member-11'] },
        { emoji: '👍', count: 4, memberIds: ['member-4', 'member-8', 'member-10', 'member-12'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(2, 19, 0),
      updatedAt: daysAgoAt(2, 19, 0),
    },
    // Deleted message example
    {
      id: 'msg-gen-3',
      conversationId: 'grp-general',
      senderId: 'member-7',
      content: 'This message was deleted',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: true,
      createdAt: daysAgoAt(1, 11, 0),
      updatedAt: daysAgoAt(1, 11, 5),
    },
    {
      id: 'msg-gen-4',
      conversationId: 'grp-general',
      senderId: 'member-8',
      content:
        'Just a reminder — if any players have physical discomfort, please report before training, not after! Early intervention is key.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '✅', count: 3, memberIds: ['member-1', 'member-5', 'member-12'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(16, 30),
      updatedAt: yesterdayAt(16, 30),
    },
    {
      id: 'msg-gen-5',
      conversationId: 'grp-general',
      senderId: 'member-12',
      content: 'Training schedule for next week is posted. Check the Training section on the app.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '👍', count: 2, memberIds: ['member-3', 'member-9'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(7, 45),
      updatedAt: todayAt(7, 45),
    },
    {
      id: 'msg-gen-6',
      conversationId: 'grp-general',
      senderId: 'member-10',
      content: 'Thank you for keeping parents informed. Really appreciate the communication!',
      messageType: 'TEXT',
      reactions: [
        { emoji: '❤️', count: 2, memberIds: ['member-4', 'member-12'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(8, 10),
      updatedAt: todayAt(8, 10),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // dm-1  (John Doe ↔ Coach Daniel)
  // ═══════════════════════════════════════════════════════════════════════════
  'dm-1': [
    {
      id: 'msg-dm1-1',
      conversationId: 'dm-1',
      senderId: 'member-1',
      content: 'Hi John, do you have a moment? I need your sign-off on some equipment.',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(1, 14, 0),
      updatedAt: daysAgoAt(1, 14, 0),
    },
    {
      id: 'msg-dm1-2',
      conversationId: 'dm-1',
      senderId: 'member-12',
      content: 'Of course, what do you need?',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(1, 14, 5),
      updatedAt: daysAgoAt(1, 14, 5),
    },
    {
      id: 'msg-dm1-3',
      conversationId: 'dm-1',
      senderId: 'member-1',
      content: 'Can you approve the GPS vests purchase?',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(1, 14, 7),
      updatedAt: daysAgoAt(1, 14, 7),
    },
    {
      id: 'msg-dm1-4',
      conversationId: 'dm-1',
      senderId: 'member-12',
      content: "Yes, approved. I'll send the PO today.",
      messageType: 'TEXT',
      reactions: [{ emoji: '✅', count: 1, memberIds: ['member-1'] }],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(1, 14, 15),
      updatedAt: daysAgoAt(1, 14, 15),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // dm-2  (John Doe ↔ Sarah Smith)
  // ═══════════════════════════════════════════════════════════════════════════
  'dm-2': [
    {
      id: 'msg-dm2-1',
      conversationId: 'dm-2',
      senderId: 'member-8',
      content: "Eric's ankle MRI is completely clear — he's good to return to full training.",
      messageType: 'TEXT',
      reactions: [{ emoji: '👍', count: 1, memberIds: ['member-12'] }],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(9, 0),
      updatedAt: todayAt(9, 0),
    },
    {
      id: 'msg-dm2-2',
      conversationId: 'dm-2',
      senderId: 'member-12',
      content: "That's great news! I'll let Coach Daniel know immediately.",
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: ['member-1'],
      isDeleted: false,
      createdAt: todayAt(9, 3),
      updatedAt: todayAt(9, 3),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // dm-3  (John Doe + Jean-Pierre + Alain)
  // ═══════════════════════════════════════════════════════════════════════════
  'dm-3': [
    {
      id: 'msg-dm3-1',
      conversationId: 'dm-3',
      senderId: 'member-3',
      content: 'John, Alain and I wanted to ask — can we come in early for extra finishing drills?',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: ['member-12'],
      isDeleted: false,
      createdAt: yesterdayAt(17, 0),
      updatedAt: yesterdayAt(17, 0),
    },
    {
      id: 'msg-dm3-2',
      conversationId: 'dm-3',
      senderId: 'member-9',
      content: 'Yes please! We want to work on our first touch.',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(17, 2),
      updatedAt: yesterdayAt(17, 2),
    },
    {
      id: 'msg-dm3-3',
      conversationId: 'dm-3',
      senderId: 'member-12',
      content: "Sure, I'll arrange access to Pitch 1 from 15:30. See you at training.",
      messageType: 'TEXT',
      reactions: [
        { emoji: '👍', count: 2, memberIds: ['member-3', 'member-9'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(17, 10),
      updatedAt: yesterdayAt(17, 10),
    },
    {
      id: 'msg-dm3-4',
      conversationId: 'dm-3',
      senderId: 'member-3',
      content: 'See you at training',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(17, 12),
      updatedAt: yesterdayAt(17, 12),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // grp-senior
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-senior': [
    {
      id: 'msg-senior-1',
      conversationId: 'grp-senior',
      senderId: 'system',
      content: 'This group is automatically synced with the Senior First Team roster.',
      messageType: 'SYSTEM',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(30, 9, 0),
      updatedAt: daysAgoAt(30, 9, 0),
    },
    {
      id: 'msg-senior-2',
      conversationId: 'grp-senior',
      senderId: 'member-1',
      content: "Tomorrow's match vs Rayon Sports — tactical briefing at 13:00 in the meeting room.",
      messageType: 'TEXT',
      reactions: [
        { emoji: '👍', count: 3, memberIds: ['member-2', 'member-7', 'member-11'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(18, 0),
      updatedAt: yesterdayAt(18, 0),
    },
    {
      id: 'msg-senior-3',
      conversationId: 'grp-senior',
      senderId: 'member-11',
      content: 'GK warm-up starts at 12:45. Robert and I will run it.',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: ['member-2'],
      isDeleted: false,
      createdAt: yesterdayAt(18, 10),
      updatedAt: yesterdayAt(18, 10),
    },
    {
      id: 'msg-senior-4',
      conversationId: 'grp-senior',
      senderId: 'member-1',
      content: 'Bus departs Amahoro at 13:30 sharp. Anyone late misses the bus.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '😂', count: 2, memberIds: ['member-2', 'member-7'] },
        { emoji: '✅', count: 3, memberIds: ['member-2', 'member-7', 'member-11'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: todayAt(7, 0),
      updatedAt: todayAt(7, 0),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // grp-coaches
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-coaches': [
    {
      id: 'msg-coaches-1',
      conversationId: 'grp-coaches',
      senderId: 'member-1',
      content:
        'Team, I have uploaded the quarterly fitness drill documents to the files section. Please review before Monday.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '✅', count: 2, memberIds: ['member-5', 'member-11'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(10, 0),
      updatedAt: yesterdayAt(10, 0),
    },
    {
      id: 'msg-coaches-2',
      conversationId: 'grp-coaches',
      senderId: 'member-5',
      content: 'Added quarterly fitness drill documents — U17 specific version is in the folder.',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(11, 30),
      updatedAt: yesterdayAt(11, 30),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // grp-parents
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-parents': [
    {
      id: 'msg-parents-1',
      conversationId: 'grp-parents',
      senderId: 'member-4',
      content:
        'Good afternoon parents. This Sunday the U17s play at Amahoro. Match kicks off at 14:00.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '👍', count: 1, memberIds: ['member-10'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(2, 15, 0),
      updatedAt: daysAgoAt(2, 15, 0),
    },
    {
      id: 'msg-parents-2',
      conversationId: 'grp-parents',
      senderId: 'member-10',
      content: 'What time is the pickup on Sunday?',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: yesterdayAt(20, 0),
      updatedAt: yesterdayAt(20, 0),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // grp-tournament
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-tournament': [
    {
      id: 'msg-tourn-1',
      conversationId: 'grp-tournament',
      senderId: 'member-4',
      content:
        'East Africa Cup travel squad — welcome! All logistics for the tournament will be coordinated here.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '⚽', count: 5, memberIds: ['member-2', 'member-3', 'member-6', 'member-7', 'member-9'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(5, 10, 0),
      updatedAt: daysAgoAt(5, 10, 0),
    },
    {
      id: 'msg-tourn-2',
      conversationId: 'grp-tournament',
      senderId: 'member-1',
      content: 'Passports collected for 18 players. Remaining 2 — please submit to admin office by Thursday.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '✅', count: 3, memberIds: ['member-2', 'member-9', 'member-4'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(1, 16, 0),
      updatedAt: daysAgoAt(1, 16, 0),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // grp-travel
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-travel': [
    {
      id: 'msg-travel-1',
      conversationId: 'grp-travel',
      senderId: 'member-4',
      content: 'Flight booked: Kigali → Nairobi, depart Friday 07:15. Return Sunday 21:45.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '✅', count: 2, memberIds: ['member-1', 'member-8'] },
      ],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(3, 14, 0),
      updatedAt: daysAgoAt(3, 14, 0),
    },
    {
      id: 'msg-travel-2',
      conversationId: 'grp-travel',
      senderId: 'member-8',
      content: 'I have packed the full medical kit. Will need 30 min to set up at the venue.',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(2, 9, 0),
      updatedAt: daysAgoAt(2, 9, 0),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // grp-u15
  // ═══════════════════════════════════════════════════════════════════════════
  'grp-u15': [
    {
      id: 'msg-u15-1',
      conversationId: 'grp-u15',
      senderId: 'system',
      content: 'This group is automatically synced with the U15 Academy roster.',
      messageType: 'SYSTEM',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(10, 9, 0),
      updatedAt: daysAgoAt(10, 9, 0),
    },
    {
      id: 'msg-u15-2',
      conversationId: 'grp-u15',
      senderId: 'member-1',
      content: 'Well done on the clean sheet last week Claudette! Keep it up.',
      messageType: 'TEXT',
      reactions: [
        { emoji: '❤️', count: 1, memberIds: ['member-6'] },
      ],
      attachments: [],
      mentions: ['member-6'],
      isDeleted: false,
      createdAt: daysAgoAt(3, 11, 0),
      updatedAt: daysAgoAt(3, 11, 0),
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // dm-4  (John Doe ↔ Marie)
  // ═══════════════════════════════════════════════════════════════════════════
  'dm-4': [
    {
      id: 'msg-dm4-1',
      conversationId: 'dm-4',
      senderId: 'member-4',
      content: 'John, I have sent over the Q2 budget summary for your review.',
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(2, 11, 0),
      updatedAt: daysAgoAt(2, 11, 0),
    },
    {
      id: 'msg-dm4-2',
      conversationId: 'dm-4',
      senderId: 'member-12',
      content: "Thanks Marie. I'll review and get back to you by end of day.",
      messageType: 'TEXT',
      reactions: [],
      attachments: [],
      mentions: [],
      isDeleted: false,
      createdAt: daysAgoAt(2, 11, 10),
      updatedAt: daysAgoAt(2, 11, 10),
    },
  ],
};
