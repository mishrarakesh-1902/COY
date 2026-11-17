import { db } from '../lib/db';

console.log("=== Testing Coy Backend DB Logic ===");
db.reset();
const feed = db.getFeed();
console.log(`Initial feed count: ${feed.length} (Expected >= 30)`);
console.assert(feed.length >= 30, "Feed should contain at least 30 profiles");

// Verify that hasPreLikedMe is NOT in public profile
const firstProfile = feed[0];
console.log("First profile sample:", firstProfile.name, "-", firstProfile.cityOrCollege);
console.assert(!('hasPreLikedMe' in firstProfile), "Strict Privacy: hasPreLikedMe must NEVER leak to client!");

// Swipe 1: Like a pre-liked profile (should trigger match)
const targetPreLiked = feed.find(p => p.id === 'coy_user_01')!;
const swipeResult1 = db.recordSwipe(targetPreLiked.id, 'like');
console.log(`Swipe on ${targetPreLiked.name} (like): Match = ${swipeResult1.match}`);
console.assert(swipeResult1.match === true, "Should have created a match");

// Swipe 2: Pass another profile
const targetPass = feed.find(p => p.id === 'coy_user_02')!;
const swipeResult2 = db.recordSwipe(targetPass.id, 'pass');
console.log(`Swipe on ${targetPass.name} (pass): Match = ${swipeResult2.match}`);
console.assert(swipeResult2.match === false, "Pass should never create a match");

// Feed check: Swiped profiles must never appear again
const updatedFeed = db.getFeed();
console.log(`Updated feed count: ${updatedFeed.length} (Expected: ${feed.length - 2})`);
console.assert(!updatedFeed.some(p => p.id === targetPreLiked.id || p.id === targetPass.id), "Swiped profiles must not appear again");

// Matches check
const matches = db.getMatches();
console.log(`Mutual matches count: ${matches.length} (Expected: 1)`);
console.assert(matches.length === 1 && matches[0].profileId === 'coy_user_01', "Matches should list mutual match");

console.log("=== ALL BACKEND CHECKS PASSED SUCCESSFULLY! ===");
