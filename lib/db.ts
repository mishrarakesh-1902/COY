import fs from 'fs';
import path from 'path';
import { Profile, PublicProfile, SwipeRecord, MatchRecord, SwipeAction } from '../types';
import { SEED_PROFILES } from '../data/profiles';

interface DatabaseSchema {
  profiles: Profile[];
  swipes: SwipeRecord[];
  matches: MatchRecord[];
}

// On Vercel / AWS Lambda, the root deployment directory is strictly read-only.
// Writable storage is located exclusively in `/tmp`.
const isVercel = Boolean(process.env.VERCEL) || process.env.NODE_ENV === 'production';
const DB_DIR = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'coy_storage.json');

// Source seed path to copy from on cold start if needed
const SEED_SOURCE_FILE = path.join(process.cwd(), 'data', 'coy_storage.json');

export const CURRENT_USER_ID = "coy_user_me";

// In-memory cache across serverless warm requests
declare global {
  // eslint-disable-next-line no-var
  var __coy_cache: DatabaseSchema | undefined;
}

/**
 * Initialize or read database state from persistent JSON store / tmp / memory
 */
function readDb(): DatabaseSchema {
  // If in-memory cache is present, return it directly
  if (globalThis.__coy_cache) {
    return globalThis.__coy_cache;
  }

  try {
    if (!fs.existsSync(DB_DIR)) {
      try {
        fs.mkdirSync(DB_DIR, { recursive: true });
      } catch (e) {
        console.warn("Could not create DB_DIR, using memory:", e);
      }
    }

    // If DB_FILE does not exist in writable directory
    if (!fs.existsSync(DB_FILE)) {
      // Check if we can seed from existing data file
      let initialProfiles = SEED_PROFILES;
      if (fs.existsSync(SEED_SOURCE_FILE)) {
        try {
          const raw = fs.readFileSync(SEED_SOURCE_FILE, 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed.profiles && parsed.profiles.length > 0) {
            initialProfiles = parsed.profiles;
          }
        } catch {
          // fallback to SEED_PROFILES
        }
      }

      const initialDb: DatabaseSchema = {
        profiles: initialProfiles,
        swipes: [],
        matches: [],
      };

      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      } catch (writeErr) {
        console.warn("Could not write to DB_FILE on initialization:", writeErr);
      }

      globalThis.__coy_cache = initialDb;
      return initialDb;
    }

    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data) as DatabaseSchema;
    if (!parsed.profiles || parsed.profiles.length === 0) {
      parsed.profiles = SEED_PROFILES;
      writeDb(parsed);
    }
    globalThis.__coy_cache = parsed;
    return parsed;
  } catch (err) {
    console.error("Error reading database file, using in-memory seed:", err);
    const initialDb: DatabaseSchema = {
      profiles: SEED_PROFILES,
      swipes: [],
      matches: [],
    };
    globalThis.__coy_cache = initialDb;
    return initialDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  // Always update in-memory cache
  globalThis.__coy_cache = data;

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn("Notice: Persistent file write skipped (using memory cache):", err);
  }
}

/**
 * Sanitize profile to strictly exclude internal secret like flags.
 * NEVER reveal who has liked the user until it is mutual.
 */
export function sanitizeProfile(profile: Profile): PublicProfile {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hasPreLikedMe, ...publicProfile } = profile;
  return publicProfile;
}

export const db = {
  /**
   * Returns profiles the user has not yet swiped on.
   * STRICT PRIVACY GUARANTEE: Never reveal who has liked the user.
   */
  getFeed(userId: string = CURRENT_USER_ID): PublicProfile[] {
    const data = readDb();
    const swipedProfileIds = new Set(
      data.swipes.filter((s) => s.userId === userId).map((s) => s.profileId)
    );

    return data.profiles
      .filter((p) => !swipedProfileIds.has(p.id))
      .map(sanitizeProfile);
  },

  /**
   * Records a swipe (like or pass).
   * If both users like each other, creates a match.
   */
  recordSwipe(
    profileId: string,
    action: SwipeAction,
    userId: string = CURRENT_USER_ID
  ): { match: boolean; matchedProfile?: PublicProfile } {
    const data = readDb();
    const profile = data.profiles.find((p) => p.id === profileId);

    if (!profile) {
      throw new Error(`Profile with ID ${profileId} not found`);
    }

    // Check if already swiped to prevent duplicate entries
    const existingSwipeIndex = data.swipes.findIndex(
      (s) => s.userId === userId && s.profileId === profileId
    );

    const swipeRecord: SwipeRecord = {
      id: `swipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      profileId,
      action,
      timestamp: Date.now(),
    };

    if (existingSwipeIndex >= 0) {
      data.swipes[existingSwipeIndex] = swipeRecord;
    } else {
      data.swipes.push(swipeRecord);
    }

    let isMatch = false;
    let matchedProfile: PublicProfile | undefined;

    // Match condition: user likes, AND the target profile secretly already pre-liked the user
    if (action === 'like' && profile.hasPreLikedMe) {
      isMatch = true;
      matchedProfile = sanitizeProfile(profile);

      const alreadyMatched = data.matches.some(
        (m) => m.userId === userId && m.profileId === profileId
      );

      if (!alreadyMatched) {
        data.matches.push({
          id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId,
          profileId,
          timestamp: Date.now(),
          profile: matchedProfile,
        });
      }
    }

    writeDb(data);

    return {
      match: isMatch,
      matchedProfile,
    };
  },

  /**
   * Returns all mutual matches for the user.
   */
  getMatches(userId: string = CURRENT_USER_ID): MatchRecord[] {
    const data = readDb();
    return data.matches
      .filter((m) => m.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  /**
   * Reset database back to original seed profiles with zero swipes and zero matches.
   * Useful for demo evaluation!
   */
  reset(userId: string = CURRENT_USER_ID): void {
    const data = readDb();
    data.swipes = data.swipes.filter((s) => s.userId !== userId);
    data.matches = data.matches.filter((m) => m.userId !== userId);
    writeDb(data);
  },
};
