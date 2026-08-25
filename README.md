╔══════════════════════════════════════╗
║              HERO                    ║
║                                      ║
║     Run your club with clarity.      ║
║          [3D CLUBSHEET UI]           ║
╚══════════════════════════════════════╝

        ← INFINITE MARQUEE →

 PLAYERS · TEAMS · TRAINING · MATCHES
 ACADEMY · KITS · FINANCE · MEDICAL


┌──────────────────────────────────────┐
│          CHAOS → CLARITY             │
│                                      │
│  Spreadsheets → ClubSheet            │
└──────────────────────────────────────┘


        EVERYTHING YOU NEED
             FROM DAY ONE

       ✓ Players     ✓ Teams
       ✓ Coaches     ✓ Training
       ✓ People      ✓ Memberships
       ✓ Roles       ✓ Activity


        BUILD YOUR CLUB

   + Academy       + Matches
   + Kit           + Finance
   + Medical       + Events
   + Development   + ...


          CLUBSHEET MODULES
                 
       [interactive visual]


       ONLY PAY FOR WHAT
          YOU NEED

       CORE + MODULES
       [Explore Plans]


          WHY CLUBS USE IT

     Less admin
     Better visibility
     One source of truth
     Clearer access
     Built to grow
     Better experience


        ONE CLUB.
      MANY PERSPECTIVES.

    ADMIN | COACH | PLAYER | STAFF


        A BETTER CLUB DAY

   08:00 → 12:00 → 15:00 → 18:00


          BUILT FOR

   Clubs | Academies | Youth
   Competitive | Multi-team


       MOBILE EXPERIENCE

       [Phone] [Phone] [Phone]


      QUESTIONS CLUBS ASK

        [Creative FAQ]


      ┌───────────────────────┐
      │                       │
      │   YOUR CLUB IS MORE   │
      │   THAN SPREADSHEETS.  │
      │                       │
      │     [GET STARTED]     │
      │                       │
      └───────────────────────┘


              FOOTER

----


Yeah. For the **Chaos → Clarity** animation, I’d make it feel like the club’s messy information is literally being **pulled together into ClubSheet**.

The important part is: don't scatter 50 random things. Use a controlled set of recognizable objects, each representing a real problem.

## The scattered pieces

I’d use around **12–16 objects**.

### 1. Spreadsheet

A small floating window:

> `players_2026.xlsx`

Inside:

```text
Player       Team       Status
Alex         U18        Active
Daniel       U18        Active
Michael      U16        ?
```

This represents scattered player information.

**Movement:** starts upper-left, slightly rotated, drifts diagonally toward the center.

---

### 2. Another spreadsheet

> `membership_list.xlsx`

This should be visually different from the player spreadsheet.

**Movement:** starts bottom-left and slides upward toward the center.

---

### 3. WhatsApp/message bubbles

Don't use actual WhatsApp branding. Make generic chat bubbles.

```text
Coach:
"Is training still at 18:00?"

Admin:
"Yes, same field."

Coach:
"👍"
```

**Movement:** starts far right and floats toward the center.

---

### 4. Calendar

A small calendar card:

```text
TUE 24

18:00
U18 Training

20:00
Senior Training
```

**Movement:** starts upper-right, rotates slightly as it moves inward.

---

### 5. Player profile card

```text
┌─────────────────┐
│   👤            │
│ Alex Johnson    │
│ Forward         │
│ U18             │
└─────────────────┘
```

**Movement:** starts lower-right.

This one should eventually become part of the final ClubSheet UI.

---

### 6. Team card

```text
U18
24 Players
Coach: David
```

**Movement:** starts left-middle.

---

### 7. Training card

```text
TRAINING

U18
Today · 18:00
Pitch 2
```

**Movement:** starts bottom-right.

---

### 8. Coach card

```text
COACH

David Smith
U18
```

**Movement:** starts top-middle, slightly behind other objects.

---

### 9. Notification

A tiny notification:

> 🔔 New player added

**Movement:** starts somewhere near the edge and rapidly moves inward.

---

### 10. Document

A generic document:

```text
PLAYER REGISTRATION

Name: Alex Johnson
Team: U18
Status: Active
```

**Movement:** starts bottom-left with a slight rotation.

---

### 11. Access/permission card

```text
ACCESS

Coach
✓ Teams
✓ Players
✓ Training
```

**Movement:** starts far right.

This subtly introduces your permissions functionality.

---

### 12. Match fixture

```text
MATCH

U18

ClubSheet FC
     VS
Rivals FC

Saturday · 15:00
```

**Movement:** starts top-right.

---

### 13. Finance document

Since you're going to have Finance as a module:

```text
EXPENSE

Equipment
$240
```

**Movement:** starts far bottom-right.

Don't make this prominent in the first version; it's just another piece of club admin chaos.

---

### 14. Medical record

Something subtle:

```text
PLAYER RECORD

Medical
Updated
```

**Movement:** starts far left.

Again, don't expose sensitive-looking details. It's just a visual representation.

---

### 15. Kit/equipment card

```text
KIT

Home Jersey
Size M
Assigned
```

**Movement:** starts upper-left.

---

### 16. Random sticky notes

A couple of tiny notes:

> “Call parents”

> “Update roster”

> “Confirm pitch”

These are mostly **atmospheric**.

They make the chaos feel human rather than like a collection of polished UI cards.

---

# But here's the important part

**Don't have everything move directly into the center at the same speed.**

That will look like a bunch of cards flying into a black hole 😂.

Give them **different movement phases**.

---

# Phase 1 — Chaos

At the beginning:

```text
                    MATCH
                       ↘

      SPREADSHEET
          ↘
                         CALENDAR

  DOCUMENT
                   [ EMPTY CENTER ]
                             ↗
                 TRAINING

      MESSAGE
                           ↗

                 PLAYER
```

Everything is slightly:

* rotated
* offset
* different sizes
* different depths
* moving at slightly different speeds

The center should remain relatively empty.

And the headline could be:

# Running a club shouldn't feel this scattered.

---

# Phase 2 — The pull

As the user scrolls:

**everything begins moving toward the center.**

But not all at once.

For example:

### 0–20% scroll

Only the farthest objects begin moving.

```text
Spreadsheet ───────→
                     \
                      \
                       CENTER
```

### 20–40%

More objects start converging.

```text
Message ───────────→
Calendar ────────→
Player ───────→

          [CENTER]
```

### 40–60%

Objects accelerate.

The rotations gradually return to:

```text
rotate: 12deg → 0deg
```

Cards straighten themselves.

This is an important visual metaphor:

> **Chaos is becoming organized.**

---

# Phase 3 — Compression

Around 60–75%:

The individual cards shouldn't simply disappear.

Instead, they **snap into a system**.

For example:

```text
PLAYER CARD
      ↓
TEAM CARD
      ↓
TRAINING
      ↓
MATCH
      ↓
PEOPLE
      ↓

     CLUBSHEET
```

The objects move closer together and begin becoming components of the dashboard.

You can literally have:

**Player card → becomes a player row**

**Training card → becomes dashboard widget**

**Team card → becomes team widget**

**Notification → becomes activity feed**

That's much cooler than simply fading everything away.

---

# Phase 4 — ClubSheet appears

Then the scattered pieces become one beautiful dashboard.

Something like:

```text
┌──────────────────────────────────────────────┐
│ CLUBSHEET                                    │
│                                              │
│  Overview                                    │
│                                              │
│  ┌───────────┐  ┌───────────┐               │
│  │ 24        │  │ 4         │               │
│  │ Players   │  │ Teams     │               │
│  └───────────┘  └───────────┘               │
│                                              │
│  Upcoming Training                           │
│  ───────────────────────────────             │
│  U18 · Today · 18:00                         │
│                                              │
│  Recent Activity                             │
│  ───────────────────────────────             │
│  Alex Johnson added to U18                   │
│                                              │
└──────────────────────────────────────────────┘
```

Then your headline changes:

# From scattered to organized.

Or:

# Everything your club needs. Together.

---

# Phase 5 — The dashboard takes over

This is important.

Once the dashboard appears, **stop the chaotic animation**.

Don't continue throwing stuff around.

The dashboard becomes stable.

Then you can have a subtle:

**scale 0.95 → 1**

and:

**opacity 0 → 1**

Then the page continues scrolling naturally.

---

# The actual scroll timeline

I'd structure the ScrollTrigger timeline roughly like this:

```text
SCROLL PROGRESS

0% ───────────────────────────────────────── 100%

│
├── 0–15%
│   Objects barely move
│   Establish the chaos
│
├── 15–35%
│   Objects begin converging
│
├── 35–55%
│   Objects accelerate toward center
│
├── 55–70%
│   Cards straighten
│   Objects compress
│
├── 70–85%
│   ClubSheet dashboard forms
│
├── 85–100%
│   Dashboard stabilizes
│   Headline changes
│
└── RELEASE
    Normal page scrolling resumes
```

And the section itself should be **pinned** during this sequence.

---

# Add depth too

Don't put every object on the same plane.

Have three depth layers.

### Background

* spreadsheet
* documents
* subtle calendar
* abstract lines

Very slow movement.

### Middle

* team
* coach
* training
* match
* membership

Normal movement.

### Foreground

* player card
* notification
* chat bubble
* key UI elements

Faster movement.

This creates a really nice **3D/parallax feeling even though most of it is just DOM/CSS**.

---

# One more thing I'd add: connection lines

This could make the transformation **really special**.

As the objects start moving toward ClubSheet, thin lines appear between them:

```text
PLAYER ───────── TEAM
   │                │
   │                │
TRAINING ─────── COACH
   │                │
   └────── CLUB ────┘
```

At first the lines are messy.

As everything converges, the lines reorganize into a clean network.

Then:

**everything collapses into ClubSheet.**

That's a beautiful visual metaphor for what the product actually does:

> **It connects the different parts of the club.**

---

# And don't make every scattered object equally important

I'd establish a hierarchy:

### Hero objects

These are the things users immediately recognize:

**Players · Teams · Training · Coaches · Messages · Spreadsheets**

### Secondary objects

These enrich the scene:

**Matches · Memberships · Calendar · Documents**

### Easter eggs

These hint at your larger platform:

**Academy · Kits · Finance · Medical**

That way you're already teasing the **modular ClubSheet ecosystem** without having to explain every module in the Chaos section.

---

## The final visual story

I'd literally make the visitor experience:

**SCATTERED**

> spreadsheets
> messages
> calendars
> player cards
> documents
> schedules

↓

**PULL**

> everything starts moving toward one place

↓

**CONNECT**

> relationships begin forming

↓

**ORGANIZE**

> cards straighten and become structured

↓

**CLUBSHEET**

> one beautiful club workspace

↓

**CLARITY**

> **Everything your club needs. Together.**

That is the animation I'd build. It isn't just a cool scroll effect — **the animation itself explains the product.**
