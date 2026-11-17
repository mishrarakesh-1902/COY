# Coy SDE Intern Assignment: Discover Tab & Product Architecture

A mobile-first, privacy-engineered **"Discover"** swipe experience built for **Coy** alongside its existing secret crush matching ecosystem.

---

## 📋 Table of Contents
1. [Part A: Product Exploration & Core Feature Proposals](#part-a-product-exploration--core-feature-proposals)
2. [Part B: Architecture & Tech Stack](#part-b-architecture--tech-stack)
3. [Key Requirements Delivered](#key-requirements-delivered)
4. [Strict Privacy Guarantee](#strict-privacy-guarantee)
5. [Backend API Documentation](#backend-api-documentation)
6. [Getting Started & Local Setup](#getting-started--local-setup)
7. [Testing the Flow](#testing-the-flow)

---

## 💡 Part A: Product Exploration & Core Feature Proposals

### Coy App Analysis:
Coy is a high-intent, confidential mutual connection platform where embarrassment is eliminated by guaranteeing double-blind matching. In exploring the core loops (Phone OTP login, Adding a crush, Email verification, Invite links, and Extra slots), two fundamental friction points emerge:
1. **The Anxiety of Ambiguity:** When an invited crush receives a notification (*"Someone added you as their crush on Coy"*), they often hesitate or suspect spam unless they have high confidence the sender is someone in their social sphere.
2. **The Dormancy Dilemma:** Unrequited or dormant crushes sit indefinitely in slots, reducing active platform engagement.

### Feature Proposal 1: "Campus Orbit & Social Proximity Hints" (Zero-Knowledge Badges)
* **What it is:** When a recipient receives an invite or crush notification, Coy shows a privacy-preserving clue—e.g., *"Someone from your college batch (IIT Delhi '25)"* or *"Someone in your mutual social circle"*, without revealing any identifiable data.
* **Why it is required:**
  - **Dramatically boosts invite conversion:** Cold invites often feel suspicious or spammy. A verified proximity signal assures the recipient that a genuine peer added them.
  - **Preserves Coy's core promise:** The sender's identity remains 100% confidential, but the social validation turns cold skepticism into warm curiosity.

### Feature Proposal 2: "Timed Crush Windows & Dynamic Urgency Drops"
* **What it is:** Crushes added to slots have an active window (e.g., 14 days). If unreciprocated, the slot unlocks automatically for reuse, and users receive periodic *"Sync Reminders"* when someone in their area recently joined.
* **Why it is required:**
  - **Increases App Re-engagement:** Traditional dating apps suffer from profile exhaustion. A timed window creates healthy FOMO and prompts recipients to install and check Coy before time runs out.
  - **Monetization & Slot Economy:** Gives users a natural rhythm to rotate crushes or purchase extra persistent slots without feeling penalised.

---

## 🛠️ Part B: Architecture & Tech Stack

Built strictly according to the assignment's technical guidelines:
- **Frontend:** Next.js 14 (App Router) + TypeScript, tailored for a mobile-first viewport (`max-w-md` app frame with touch gestures).
- **Styling & UI:** Tailwind CSS + Lucide Icons + Glassmorphism accents.
- **Gestures & Animations:** Framer Motion (touch drag gestures, rotational physics, dynamic LIKE/PASS stamp overlays, spring exits) + Canvas Confetti.
- **Backend:** Next.js API Routes with URL rewrites supporting both `/api/...` and clean endpoints (`/feed`, `/swipe`, `/matches`).
- **Data Persistence:** File-backed persistent JSON engine (`data/coy_storage.json`) that preserves swipes, matches, and profile states across browser reloads.

---

## 🚀 Key Requirements Delivered

| Requirement | Implementation Details | Status |
|---|---|:---:|
| **Tab Navigation** | Fixed bottom navigation with blank placeholder **Home**, **Discover** (swiping engine), and **Matches** (with live badge counter) | ✅ |
| **Profile Data** | 32 pre-seeded mock profiles with high-resolution portraits, ages, bios, college/city badges, and interest tags | ✅ |
| **Demo Match Seeding** | 12 seeded profiles have secret incoming likes pre-configured to guarantee real-time matches during demos | ✅ |
| **Swipe Gestures** | One card at a time with touch drag gestures on mobile, desktop action buttons, and keyboard shortcuts ($\leftarrow$ Pass, $\rightarrow$ Like) | ✅ |
| **Card Animations** | Dynamic rotation based on drag offset, opacity fade on stamps, and smooth card exit transitions | ✅ |
| **Single-View Guarantee**| Profiles swiped on (either like or pass) are stored persistently and never shown again in the feed | ✅ |
| **Empty State** | Friendly "You're all caught up" screen with a one-click "Reset Demo Profiles" option for continuous evaluation | ✅ |
| **Match Moment** | Animated celebration modal with festive confetti explosion, matched avatars, and direct transition to chat | ✅ |
| **Matches View** | Dedicated screen listing all mutual connections with horizontal story carousels, timestamps, and conversation prompts | ✅ |
| **Strict Privacy** | Zero leak of `hasPreLikedMe` flag in feed APIs; mutual match calculated strictly server-side | ✅ |

---

## 🔒 Strict Privacy Guarantee (The Core Promise of Coy)

In standard dating apps, client payloads often leak `hasLiked` or `isMatch` metadata before the user acts, enabling network sniffing.

In this implementation:
1. **Server-Side Sanitization:** The `getFeed()` function explicitly strips out `hasPreLikedMe` before serialization:
   ```typescript
   export function sanitizeProfile(profile: Profile): PublicProfile {
     const { hasPreLikedMe, ...publicProfile } = profile;
     return publicProfile;
   }
   ```
2. **Client Blindness:** Opening Chrome DevTools Network Tab and inspecting `GET /feed` reveals zero traces of who has liked the logged-in user.
3. **Double-Blind Computation:** The server only announces a match if and when the client submits a `POST /swipe` with `action: 'like'` on a user who previously reciprocated.

---

## 📡 Backend API Documentation

### 1. `GET /feed` (or `/api/feed`)
Returns list of profiles the user has not yet swiped on.
```json
{
  "success": true,
  "profiles": [
    {
      "id": "coy_user_01",
      "name": "Aanya Sharma",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture major obsessed with brutalist design...",
      "cityOrCollege": "IIT Roorkee",
      "interests": ["Architecture", "Analog Photography", "Coffee", "Indie Pop"]
    }
  ],
  "total": 32
}
```

### 2. `POST /swipe` (or `/api/swipe`)
Records a swipe and checks for mutual match.
- **Request Body:**
  ```json
  {
    "profileId": "coy_user_01",
    "action": "like"
  }
  ```
- **Response (When Matched):**
  ```json
  {
    "success": true,
    "match": true,
    "matchedProfile": {
      "id": "coy_user_01",
      "name": "Aanya Sharma",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "cityOrCollege": "IIT Roorkee"
    },
    "remainingCount": 31
  }
  ```

### 3. `GET /matches` (or `/api/matches`)
Returns all mutual matches for the user.
```json
{
  "success": true,
  "matches": [
    {
      "id": "match_174000000_abc",
      "userId": "coy_user_me",
      "profileId": "coy_user_01",
      "timestamp": 1740000000000,
      "profile": { ... }
    }
  ],
  "total": 1
}
```

### 4. `POST /reset` (or `/api/reset`)
Resets all swipes and restores the 32 initial demo profiles for testing.

---

## 💻 Getting Started & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/mishrarakesh-1902/COY.git
cd COY
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (preferably in mobile view or responsive mode).

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 🧪 Testing the Flow

1. Open the app on `http://localhost:3000`.
2. Notice the initial card **Aanya Sharma (IIT Roorkee)**.
3. Swipe right or click the 💚 Heart button.
4. 🎉 **"It's a Match!" celebration modal** immediately triggers because Aanya is pre-seeded with a mutual like.
5. Tap **"Say Hello in Matches"** or click the **Matches** tab to see your mutual connection.
6. Return to **Discover** and swipe left (Pass) on **Rohan Verma**. Notice he smoothly exits and will never appear again.
7. Click the **Home** tab: Notice the clean placeholder as specified in the assignment prompt.
8. Swipe through cards or click the **Reset** button at the top right anytime to restore all 32 profiles.
