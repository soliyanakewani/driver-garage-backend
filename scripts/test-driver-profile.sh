#!/usr/bin/env bash
# Test driver profile endpoints. Run with: ./scripts/test-driver-profile.sh
# Server must be running: npm run dev

BASE_URL="${BASE_URL:-http://localhost:4000}"

echo "=== 1. Driver signup ==="
SIGNUP=$(curl -s -X POST "$BASE_URL/drivers/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"Driver","email":"testdriver@example.com","phone":"+15550001111","password":"pass123"}')
echo "$SIGNUP" | head -c 200
echo ""

# Try login if signup fails (e.g. already exists)
if echo "$SIGNUP" | grep -q '"token"'; then
  TOKEN=$(echo "$SIGNUP" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
else
  echo "=== Login (in case driver already exists) ==="
  LOGIN=$(curl -s -X POST "$BASE_URL/drivers/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"phone":"+15550001111","password":"pass123"}')
  TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "No token received. Check signup/login response above."
  exit 1
fi

echo ""
echo "=== 2. GET /driver/profile ==="
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/driver/profile" | head -c 300
echo ""

echo ""
echo "=== 3. PUT /driver/profile (update firstName) ==="
curl -s -X PUT "$BASE_URL/driver/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"UpdatedName"}' | head -c 300
echo ""

echo ""
echo "=== 4. POST /driver/profile ==="
curl -s -X POST "$BASE_URL/driver/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' | head -c 300
echo ""

echo ""
echo "Done."
