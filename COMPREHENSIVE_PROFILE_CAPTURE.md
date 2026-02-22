# Comprehensive Profile Capture for All User Types

## Overview

Extended the signup system to capture complete profile information for **Clerks** and **Adjutants**, just like soldiers. Now all user types collect all required information during initial signup.

## What's New

### Clerk Profile Fields (Added to Signup)

When a user selects "Clerk" during signup, they now enter:

- **Service Number** (e.g., BA-1001)
- **Rank** (e.g., Corporal, Lance Naib)
- **Unit** (e.g., Headquarters, Dhaka)
- **Role/Position** (e.g., Administrative Officer)
- **Date of Joining** (date picker)
- **Phone Number** (e.g., +880-1700-000000)
- **Address** (text)
- **Emergency Contact Name**
- **Emergency Contact Number**

### Adjutant Profile Fields (Added to Signup)

When a user selects "Adjutant" during signup, they now enter:

- **Service Number** (e.g., AD-2001)
- **Rank** (e.g., Major, Captain)
- **Unit** (e.g., Battalion Headquarters)
- **Date of Joining** (date picker)
- **Phone Number** (e.g., +880-1700-000000)
- **Address** (text)
- **Emergency Contact Name**
- **Emergency Contact Number**

### Soldier Profile Fields (Already Implemented)

Soldiers continue to enter:

- Service Number, Rank, Unit, Date of Joining, Blood Group
- Date of Birth, Height, Weight, Medical Category

## Files Modified

### Frontend

1. **`/app/auth/signup/page.tsx`**
   - Added state for clerk fields (9 fields)
   - Added state for adjutant fields (8 fields)
   - Added clerk form section (conditional rendering)
   - Added adjutant form section (conditional rendering)
   - Updated form submission to send all clerk/adjutant data

### Backend API

2. **`/app/api/auth/signup/route.ts`**
   - Extracts clerk and adjutant fields from request body
   - Added validation for each clerk field
   - Added validation for each adjutant field
   - Updated createUser call to pass all new fields

### Database

3. **`/prisma/schema.prisma`**
   - Added 9 clerk-specific fields to User model
   - Added 8 adjutant-specific fields to User model
   - Organized fields by user type (Soldier, Clerk, Adjutant)

4. **`/lib/db.ts`**
   - Updated UserRecord interface with all new fields
   - Modified createUser function to handle all fields
   - Updated return mapping to include all new fields

## Database Schema Changes

```prisma
model User {
  // ... existing fields ...

  // Clerk-specific fields
  clerkServiceNo       String?
  clerkRank            String?
  clerkUnit            String?
  clerkRole            String?
  clerkDateOfJoining   DateTime?
  clerkPhone           String?
  clerkAddress         String?
  clerkEmergencyContactName String?
  clerkEmergencyContact String?

  // Adjutant-specific fields
  adjutantServiceNo    String?
  adjutantRank         String?
  adjutantUnit         String?
  adjutantDateOfJoining DateTime?
  adjutantPhone        String?
  adjutantAddress      String?
  adjutantEmergencyContactName String?
  adjutantEmergencyContact String?
}
```

## Form Validation

### Clerk Validation Rules

All clerk fields are required during signup:

- ✅ Service number cannot be empty
- ✅ Rank must be provided
- ✅ Unit is mandatory
- ✅ Role/Position required
- ✅ Date of Joining must be selected
- ✅ Phone number cannot be empty
- ✅ Address is required
- ✅ Emergency contact name mandatory
- ✅ Emergency contact number required

### Adjutant Validation Rules

All adjutant fields are required during signup:

- ✅ Service number cannot be empty
- ✅ Rank must be provided
- ✅ Unit is mandatory
- ✅ Date of Joining must be selected
- ✅ Phone number cannot be empty
- ✅ Address is required
- ✅ Emergency contact name mandatory
- ✅ Emergency contact number required

## API Examples

### Create Clerk Account

```bash
POST /api/auth/signup
{
    "fullName": "Muhammad Hassan",
    "email": "hassan@military.gov.bd",
    "password": "SecurePass@123",
    "userType": "clerk",
    "clerkServiceNo": "BA-1001",
    "clerkRank": "Corporal",
    "clerkUnit": "Headquarters, Dhaka",
    "clerkRole": "Administrative Officer",
    "clerkDateOfJoining": "2005-06-15",
    "clerkPhone": "+880-1700-000001",
    "clerkAddress": "Dhaka Cantonment",
    "clerkEmergencyContactName": "Fatima Hassan",
    "clerkEmergencyContact": "+880-1712-987654"
}
```

### Create Adjutant Account

```bash
POST /api/auth/signup
{
    "fullName": "Major Rahman Khan",
    "email": "rahman@military.gov.bd",
    "password": "SecurePass@123",
    "userType": "adjutant",
    "adjutantServiceNo": "AD-2001",
    "adjutantRank": "Major",
    "adjutantUnit": "Battalion Headquarters",
    "adjutantDateOfJoining": "2015-08-20",
    "adjutantPhone": "+880-1700-000002",
    "adjutantAddress": "Mirpur Cantonment",
    "adjutantEmergencyContactName": "Sara Khan",
    "adjutantEmergencyContact": "+880-1712-987655"
}
```

## User Experience

### Signup Flow by User Type

**Soldiers:**

1. Enter basic info + email/password
2. See soldier-specific fields
3. Enter all soldier fields (service no, rank, unit, DOB, DOJ, blood group, height, weight, medical category)
4. Submit → Account created with complete profile

**Clerks:**

1. Enter basic info + email/password
2. See clerk-specific fields
3. Enter all clerk fields (service no, rank, unit, role, DOJ, phone, address, emergency contact)
4. Submit → Account created with complete profile

**Adjutants:**

1. Enter basic info + email/password
2. See adjutant-specific fields
3. Enter all adjutant fields (service no, rank, unit, DOJ, phone, address, emergency contact)
4. Submit → Account created with complete profile

## Accessing Stored Data

After signup, all profile data is stored in the database and accessible via:

### For Clerk:

```
GET /api/profile?userId={userId}
```

Clerk profile data will include:

- clerkServiceNo
- clerkRank
- clerkUnit
- clerkRole
- clerkDateOfJoining
- clerkPhone
- clerkAddress
- clerkEmergencyContactName
- clerkEmergencyContact

### For Adjutant:

Similar structure with adjutant-prefixed fields.

## Testing the Feature

### Test Clerk Signup

1. Go to http://localhost:3000/auth/signup
2. Select "Clerk" as user type
3. Fill in all clerk-specific fields
4. Submit form
5. Verify data appears in `/dashboard/clerk/profile`

### Test Adjutant Signup

1. Go to http://localhost:3000/auth/signup
2. Select "Adjutant" as user type
3. Fill in all adjutant-specific fields
4. Submit form
5. Verify data appears in `/dashboard/adjutant/profile`

### Database Verification

After signup:

- Open database viewer
- Check `users` table
- Verify `clerkServiceNo`, `clerkRank`, etc. are populated for clerk users
- Verify `adjutantServiceNo`, `adjutantRank`, etc. are populated for adjutant users

## Benefits

✅ **Complete Onboarding** - All profile info collected at signup, no post-signup completion needed
✅ **Consistency** - Same approach across all user types (Soldier, Clerk, Adjutant)
✅ **Role-Specific** - Each role only sees relevant fields
✅ **Immediate Access** - Users have complete profiles from day one
✅ **Data Quality** - Validation ensures all required info is provided
✅ **Scalable** - Easy to add new user types with specific fields

## Backward Compatibility

✅ Existing soldier accounts remain unchanged
✅ Existing login functionality unaffected
✅ Profile pages compatible with new data
✅ No breaking changes to existing APIs

## Build Status

- ✅ TypeScript compilation successful (0 errors)
- ✅ Prisma client regenerated (4.15.0)
- ✅ Dev server running
- ✅ Signup page accessible
- ✅ All form fields visible and functional

## Next Steps (Optional Enhancements)

1. Update clerk profile page UI to display all captured data
2. Update adjutant profile page UI to display all captured data
3. Add ability to edit profile data after signup
4. Implement profile completion progress tracking
5. Add role-specific profile templates
6. Implement profile data export/reporting

## Troubleshooting

**Issue:** Clerk fields not showing in form
**Solution:** Make sure userType is set to "clerk"

**Issue:** Validation errors on submit
**Solution:** Ensure all clerk/adjutant fields have valid values

**Issue:** Build errors after changes
**Solution:** Run `npx prisma generate` to regenerate Prisma client

## Code Statistics

- **New State Variables:** 17 (9 for clerk + 8 for adjutant)
- **New Form Fields:** 17
- **New Database Fields:** 17
- **New Validation Rules:** 17
- **Files Modified:** 4
- **Lines Added:** ~500+

---

**Status:** ✅ **COMPLETE** - Comprehensive profile capture implemented for all user types
