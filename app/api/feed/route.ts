import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profiles = db.getFeed();
    return NextResponse.json({
      success: true,
      profiles,
      total: profiles.length,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles feed' },
      { status: 500 }
    );
  }
}
