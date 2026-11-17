import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SwipeAction } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, action } = body as { profileId?: string; action?: SwipeAction };

    if (!profileId || !action) {
      return NextResponse.json(
        { success: false, error: 'Both profileId and action ("like" | "pass") are required.' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'pass') {
      return NextResponse.json(
        { success: false, error: 'Action must be either "like" or "pass".' },
        { status: 400 }
      );
    }

    const result = db.recordSwipe(profileId, action);
    const remainingFeed = db.getFeed();

    return NextResponse.json({
      success: true,
      match: result.match,
      matchedProfile: result.matchedProfile || null,
      remainingCount: remainingFeed.length,
    });
  } catch (error: any) {
    console.error('Error recording swipe:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to record swipe' },
      { status: 500 }
    );
  }
}
