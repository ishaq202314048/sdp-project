#!/bin/bash

# Test the login session tracking
# This script demonstrates that login data is being stored in the database

cd /home/ishaq/Desktop/tracktroopMergedAuth/tracktroopMergedAuth

echo "════════════════════════════════════════════════════════════════"
echo "  TrackTroop Login Session Tracking Test"
echo "════════════════════════════════════════════════════════════════"
echo ""

echo "📊 Current Database State:"
echo "───────────────────────────────────────────────────────────────"
node scripts/inspect-db.js 2>&1 | tail -40

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  To test login session storage:"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  Start the development server:"
echo "   pnpm dev"
echo ""
echo "2️⃣  In another terminal, test the login API:"
echo "   curl -X POST http://localhost:3001/api/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\": \"a@gmail.com\", \"password\": \"password123\"}'"
echo ""
echo "3️⃣  Check if session was recorded:"
echo "   node scripts/inspect-login-sessions.js"
echo ""
echo "OR navigate to the login page in your browser:"
echo "   http://localhost:3001/auth/login"
echo "   Use: a@gmail.com / password123"
echo ""
echo "════════════════════════════════════════════════════════════════"
