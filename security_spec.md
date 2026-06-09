# Security Spec

## Data Invariants
1. Products can only be created, updated, or deleted by admins. Anyone can read.
2. Categories can only be created, updated, or deleted by admins. Anyone can read.
3. Orders can be read by the owner or an admin. They can be created by authenticated users. Status updates can only be made by admins.
4. Users can only read and update their own profile, except admins who can read all users and update roles.

## Dirty Dozen Payloads
- Ghost fields in product creation
- Unverified email spoofing
- Invalid prices
- Non-admin attempting to delete product

(Rules enforce these)
