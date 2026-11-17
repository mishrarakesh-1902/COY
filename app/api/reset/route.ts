import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    db.reset();
    const freshFeed = db.getFeed();
    return NextResponse.json({
      success: true,
      message: 'Demo database reset to initial state with all 32 profiles restored.',
      total: freshFeed.length,
    });
  } catch (error) {
    console.error('Error resetting feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset feed' },
      { status: 500 }
    );
  }
}
