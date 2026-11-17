export type SwipeAction = 'like' | 'pass';

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  photos?: string[];
  bio: string;
  cityOrCollege: string;
  interests: string[];
  /** Server-side only: indicates this user secretly already liked the logged-in user */
  hasPreLikedMe?: boolean;
}

export type PublicProfile = Omit<Profile, 'hasPreLikedMe'>;

export interface SwipeRecord {
  id: string;
  userId: string;
  profileId: string;
  action: SwipeAction;
  timestamp: number;
}

export interface MatchRecord {
  id: string;
  userId: string;
  profileId: string;
  timestamp: number;
  profile: PublicProfile;
}

export interface SwipeResponse {
  success: boolean;
  match: boolean;
  matchedProfile?: PublicProfile;
  remainingCount?: number;
}
