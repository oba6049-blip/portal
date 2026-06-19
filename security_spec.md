# Textocode Academy Registration Security Specifications

This document outlines the security parameters and threat models designed to protect candidate PII (names, phone numbers, qualifiers, emails) in the Firestore database.

## 1. Data Invariants
- **Write-Only Inbox Pattern**: A candidate registration is a sensitive document containing candidate PII (such as full name, email, phone, and date of birth). To prevent data exposure, prospects are permitted to `create` documents under the `/registrations` collection. They are strictly and systematically **forbidden** from reading (`get`, `list`), updating, or deleting any document once written.
- **Strict Size and Shape Validation**: Fields must conform to strict type assertions (e.g., `fullName` has a maximum length of 100 characters, `phone` matches a strict format under 30 characters) to prevent Denial of Wallet text payload attacks.
- **Server Timestamp Matching**: The `createdAt` field must strictly match the database request server timestamp (`request.time`) to maintain data integrity.

## 2. The "Dirty Dozen" Threat Payloads
The following payloads must be blocked automatically by our Firestore rules layer:
1. **The Scraper Read**: An unauthenticated attacker attempts to execute `list` on `/registrations` to collect student leads. (Outcome: `PERMISSION_DENIED`)
2. **The Targeted Get**: An attacker guesses a registration ID and attempts to read `/registrations/{id}`. (Outcome: `PERMISSION_DENIED`)
3. **The Identity Takeover**: An attacker attempts to `update` a submitted student record to point to their own email or status. (Outcome: `PERMISSION_DENIED`)
4. **The Data Eraser**: An attacker attempts to `delete` a registration document. (Outcome: `PERMISSION_DENIED`)
5. **The Ghost Field Injection**: A user attempts to create a registration containing random metadata fields designed to compromise database schemas (e.g. `isAdmin: true` or `ghostField: "compromise"`). (Outcome: `PERMISSION_DENIED`)
6. **The Flooder (Denial of Wallet)**: A client attempts to submit a `fullName` string that is 5MB in size to overload Firestore and exploit storage quotas. (Outcome: `PERMISSION_DENIED`)
7. **The Time Machine**: A client attempts to pass a legacy or future date in `createdAt` rather than utilizing the server timestamp (`request.time`). (Outcome: `PERMISSION_DENIED`)
8. **The Format Hijack**: An attacker attempts to store an array of integers instead of a string in `fullName`. (Outcome: `PERMISSION_DENIED`)
9. **The Enum Bypass**: A user attempts to submit a registration with an invalid `learningMode` (e.g. `learningMode: "VR-Immersive"` instead of `"Online"` or `"Physical"`). (Outcome: `PERMISSION_DENIED`)
10. **The ID Poisoning Attack**: An attacker attempts to write a registration using an ultra-long document ID (1.5KB of garbage characters) to exploit index storage. (Outcome: `PERMISSION_DENIED`)
11. **The Age Invalidation Check**: An attacker attempts to supply an invalid date format or an empty string as `dateOfBirth`. (Outcome: `PERMISSION_DENIED`)
12. **The Missing Required Key**: A payload which omits mandatory properties like `preferredCourse` or `phone`. (Outcome: `PERMISSION_DENIED`)

---

## 3. Rules Implementation Plan

Let's implement write-only registration rules in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default-deny catch-all
    match /{document=**} {
      allow read, write: if false;
    }

    // Registrations Collection Match Section
    match /registrations/{registrationId} {
      allow create: if isValidRegistrationCreate();
      allow read, update, delete: if false;
    }

    // Helper to validate the registration document structure
    function isValidRegistrationCreate() {
      let data = request.resource.data;
      return data.keys().hasAll([
        'fullName', 'email', 'phone', 'gender', 'dateOfBirth',
        'country', 'state', 'city', 'highestQualification',
        'occupation', 'preferredCourse', 'learningMode',
        'experienceLevel', 'learningGoals', 'referralSource', 'createdAt'
      ]) 
      && data.keys().size() == 16
      && data.fullName is string && data.fullName.size() > 0 && data.fullName.size() <= 100
      && data.email is string && data.email.size() > 0 && data.email.size() <= 100
      && data.phone is string && data.phone.size() > 0 && data.phone.size() <= 30
      && data.gender is string && (data.gender == 'Male' || data.gender == 'Female' || data.gender == 'Other' || data.gender == 'Prefer not to say')
      && data.dateOfBirth is string && data.dateOfBirth.size() >= 8 && data.dateOfBirth.size() <= 15
      && data.country is string && data.country.size() > 0 && data.country.size() <= 80
      && data.state is string && data.state.size() > 0 && data.state.size() <= 80
      && data.city is string && data.city.size() > 0 && data.city.size() <= 80
      && data.highestQualification is string && data.highestQualification.size() > 0 && data.highestQualification.size() <= 100
      && data.occupation is string && data.occupation.size() > 0 && data.occupation.size() <= 100
      && data.preferredCourse is string && data.preferredCourse.size() > 0 && data.preferredCourse.size() <= 150
      && data.learningMode is string && (data.learningMode == 'Online' || data.learningMode == 'Physical')
      && data.experienceLevel is string && (data.experienceLevel == 'Beginner' || data.experienceLevel == 'Intermediate' || data.experienceLevel == 'Advanced')
      && data.learningGoals is string && data.learningGoals.size() <= 1000
      && data.referralSource is string && data.referralSource.size() <= 300
      && data.createdAt == request.time;
    }
  }
}
```
