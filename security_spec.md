# Security Specification — Paspor Literasi

## 1. Data Invariants
1. **Authentication & Verified / Anonymous Access**: Student profile writes and session recap writes require either a verified Google account (`request.auth.token.email_verified == true`) or a Firebase Anonymous student session (`request.auth.token.firebase.sign_in_provider == 'anonymous'`). Unverified email accounts remain blocked.
2. **Ownership Integrity**: Every `studentProfiles` and `sessions` document must contain `ownerUid == request.auth.uid` on creation, and `ownerUid` is immutable after creation.
3. **Teacher (Admin) Central Recap Access**: Only the verified classroom teacher (`desykhadijah52@guru.smp.belajar.id` with `email_verified == true`) or explicit `/admins/{uid}` documents may list/read/delete across all students' profiles and session records. Anonymous or signed-in students may only list/read/delete their own records (`resource.data.ownerUid == request.auth.uid`).
4. **Immutable Session Logs**: Once a `sessions/{sessionId}` record is submitted, client updates are forbidden (`allow update: if false;`) to prevent score tampering.
5. **Bounded Payloads & Server Timestamps**: Every string has strict length limits, `stampsCollected` and `stampsEarned` are bounded to `<= 6` items, `accuracy` is bounded `0..100`, `createdAt`/`updatedAt` must equal `request.time`, and no unwhitelisted shadow keys are permitted.

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Session Write**: `create /sessions/s1` with `request.auth == null`.
2. **Unverified Non-Anonymous Email Write**: `create /sessions/s1` with `email_verified: false` and `sign_in_provider != 'anonymous'`.
3. **Identity Spoofing on Create**: `create /sessions/s1` with `ownerUid: "another_student_uid"`.
4. **Shadow Ghost Field**: `create /sessions/s1` including extra field `isAdminApproved: true`.
5. **Fake Client Timestamp**: `create /sessions/s1` with `createdAt` not equal to `request.time`.
6. **Out-of-Bounds Accuracy**: `create /sessions/s1` with `accuracy: 999`.
7. **ID Poisoning**: `create /sessions/bad..id..with..1500..chars` failing `isValidId()`.
8. **Score Tampering via Update**: `update /sessions/s1` attempting to raise `score` or `correctCount`.
9. **Blanket Student List Scraping**: Student (Google or anonymous) calling `list /sessions` without filtering by `ownerUid == request.auth.uid`.
10. **Cross-Student Profile Read**: Student A calling `get /studentProfiles/student_B_profile`.
11. **Unbounded Array Injection**: `create /studentProfiles/p1` with `stampsCollected` containing 25 items (`> 6`).
12. **Privilege Escalation**: Anonymous or student user attempting `create /admins/{uid}` to grant themselves teacher access.
