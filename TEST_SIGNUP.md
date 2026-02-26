# Complete Signup Flow Test

## Test Scenario: Create a Soldier Account with All Profile Information

### Test Steps:

1. **Navigate to Signup Page**
   - URL: http://localhost:3000/auth/signup
   - Expected: Form displays with all fields

2. **Fill out Basic Information**
   - Full Name: John Doe
   - Email: john.doe@military.com
   - User Type: Soldier

3. **Verify Conditional Soldier Fields Appear**
   - Service Number field should appear
   - Unit field should appear
   - Date of Birth field should appear
   - Date of Joining field should appear
   - Blood Group dropdown should appear
   - Rank field should appear (NEW)
   - Height field should appear (NEW)
   - Weight field should appear (NEW)
   - Medical Category dropdown should appear (NEW)

4. **Fill out All Soldier Profile Fields**
   - Service Number: SN12345678
   - Unit: 3rd Infantry Battalion
   - Date of Birth: 1990-06-15
   - Date of Joining: 2015-08-20
   - Blood Group: O+
   - Rank: Sepoy
   - Height: 175 (cm)
   - Weight: 75 (kg)
   - Medical Category: A - Fit for General Service

5. **Fill out Password Information**
   - Password: SecurePass@123
   - Confirm Password: SecurePass@123

6. **Submit Signup Form**
   - Click "Sign up" button
   - Expected: Account created, user redirected to /dashboard/soldier

7. **Verify Profile Page Shows All Information**
   - Navigate to http://localhost:3000/dashboard/soldier/profile
   - Expected: All soldier profile fields are displayed with data from signup
   - Service No: SN12345678
   - Rank: Sepoy
   - Unit: 3rd Infantry Battalion
   - Date of Birth: June 15, 1990
   - Date of Joining: August 20, 2015
   - Blood Group: O+
   - Height: 175 cm
   - Weight: 75 kg
   - Medical Category: A - Fit for General Service

8. **Test Profile Edit Functionality**
   - Click "Edit" button on profile page
   - Modify one field (e.g., phone number)
   - Save changes
   - Expected: Changes persist and display correctly

## Test Scenario: Create a Clerk/Adjutant Account

1. **Navigate to Signup Page**
2. **Fill out Basic Information**
   - Full Name: Jane Smith
   - Email: jane.smith@military.com
   - User Type: Clerk (or Adjutant)
3. **Verify No Soldier-Specific Fields Appear**
   - Service Number should NOT appear
   - Soldier profile fields should NOT appear
4. **Fill out Password and Submit**
5. **Verify Redirect to Appropriate Dashboard**
   - Clerk → /dashboard/clerk
   - Adjutant → /dashboard/adjutant/home

## Database Verification

After testing, verify data was stored correctly:

- Open database viewer (if available)
- Check users table for created accounts
- Verify all fields are populated for soldier accounts
- Verify null/undefined for non-soldier fields in clerk/adjutant accounts

## API Validation Points

1. **POST /api/auth/signup**
   - Accepts all new fields (rank, height, weight, medicalCategory)
   - Validates numeric ranges (height: 50-300cm, weight: 20-200kg)
   - Validates medical category from allowed values (A, B, C)
   - Only requires soldier fields for "soldier" user type
   - Returns created user without password in response

2. **GET /api/profile?userId=X**
   - Returns all profile fields including new ones
   - Includes rank, height, weight, medicalCategory in response

3. **PATCH /api/profile**
   - Allows updating profile fields including new ones
   - Persists changes to database

## Expected Outcomes

- ✅ Signup form shows all profile fields for soldiers
- ✅ Signup form hides soldier fields for clerk/adjutant
- ✅ All profile data saved to database during signup
- ✅ Profile page displays all data from database
- ✅ Profile edit/update functionality works
- ✅ No post-signup profile completion needed for soldiers
- ✅ TypeScript compilation successful
- ✅ No build errors
