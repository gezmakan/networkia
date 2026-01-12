# Data Isolation Strategy - Production Grade Setup

## Overview

This app implements a **zero-contamination** data architecture where demo (logged-out) data and live (logged-in) data are completely isolated from each other.

## The Problem This Solves

In many apps, mixing demo and live data causes:
- Demo data appearing in production databases
- User data being accidentally stored in localStorage
- Cache collisions between different users
- Confusion about which data is real vs demo

## Our Solution

### Two Separate Data Layers

#### 1. Demo Mode (Logged Out)
- **Storage**: localStorage with `demo_` prefix
- **Key**: `demo_contacts`
- **Behavior**: Fully functional CRUD operations
- **Persistence**: Survives page refresh, isolated to browser
- **Use case**: User can try the app before signing up

#### 2. Live Mode (Logged In)
- **Storage**: PostgreSQL via Prisma + Neon
- **Cache**: React Query with user-specific keys: `['contacts', 'user', userId]`
- **Behavior**: Server-side API calls with authentication
- **Persistence**: Permanent database storage
- **Use case**: Production data for authenticated users

## Architecture

```
┌─────────────────────────────────────────────────┐
│              useContacts() Hook                 │
│         (Single API for all data)               │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
  Not Signed In    Signed In
        │               │
        ▼               ▼
┌──────────────┐  ┌──────────────┐
│useDemoStorage│  │ useLiveData  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       ▼                 ▼
  localStorage      React Query
  demo_contacts     + Prisma API
                    (userId cache key)
```

## Key Files

### Hooks
- `hooks/use-contacts.ts` - Unified API that auto-switches between demo/live
- `hooks/use-demo-storage.ts` - localStorage operations for demo mode
- `hooks/use-live-data.ts` - Server API + React Query for live mode

### Data Layer
- `lib/types.ts` - TypeScript interfaces
- `lib/demo-data.ts` - Sample data generator for demo mode

### Configuration
- `app/providers.tsx` - Sets up React Query with proper cache isolation

## How It Works

### 1. Single Import Pattern

```tsx
import { useContacts } from '@/hooks/use-contacts';

function MyComponent() {
  const { contacts, addContact, deleteContact, isDemo } = useContacts();

  // Works automatically - no need to check auth state!
  // If logged out: uses localStorage
  // If logged in: uses server API
}
```

### 2. Cache Key Isolation

**Demo mode:**
```javascript
// localStorage key
"demo_contacts" → [{ id: 'demo-1', name: 'Sarah Chen' }]
```

**Live mode (User A):**
```javascript
// React Query cache key
['contacts', 'user', 'alice@example.com'] → [{ id: '123', name: 'Real Contact' }]
```

**Live mode (User B):**
```javascript
// React Query cache key - completely separate!
['contacts', 'user', 'bob@example.com'] → [{ id: '456', name: 'Different Contact' }]
```

### 3. Zero Cross-Contamination

- Demo data stays in `localStorage` with `demo_` prefix
- Live data stored in database
- React Query cache keys include `userId` for per-user isolation
- No shared state between logged-in and logged-out modes
- No shared state between different logged-in users

## Benefits

### User Experience
- Try full app functionality before signing up
- No data loss when experimenting in demo mode
- Smooth transition from demo to real account
- Clear visual indicator of demo vs live mode

### Developer Experience
- Single hook API (`useContacts`) for all components
- Automatic mode switching based on auth state
- Type-safe operations across both modes
- Easy to test both modes independently

### Production Quality
- No demo data in production database
- User data never exposed in browser storage
- Per-user cache isolation prevents data leaks
- Clear separation of concerns

## Usage Examples

### Basic CRUD Operations

```tsx
function ContactList() {
  const { contacts, addContact, deleteContact, isDemo } = useContacts();

  // Add contact (works in both modes)
  const handleAdd = async () => {
    await addContact({ name: 'John Doe' });
  };

  // Delete contact (works in both modes)
  const handleDelete = async (id: string) => {
    await deleteContact(id);
  };

  return (
    <div>
      {isDemo && <Badge>Demo Mode</Badge>}
      {contacts.map(contact => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

### Conditional Features Based on Mode

```tsx
function ExportButton() {
  const { isDemo } = useContacts();

  if (isDemo) {
    return (
      <button onClick={() => alert('Sign in to export!')}>
        Export (Sign in required)
      </button>
    );
  }

  return <button onClick={handleExport}>Export</button>;
}
```

## Testing the Isolation

### Test 1: Demo Mode Persistence
1. Log out
2. Add some contacts
3. Refresh page
4. Contacts should persist (stored in localStorage)
5. Check DevTools → Application → Local Storage → `demo_contacts`

### Test 2: Login Transition
1. In demo mode, add contacts
2. Sign in with Google
3. Mode should switch to "Live Mode"
4. Demo contacts disappear (they're still in localStorage, just not shown)
5. Your live contacts (if any) appear

### Test 3: Multi-User Isolation
1. Sign in as User A, add contacts
2. Sign out
3. Sign in as User B
4. User A's contacts should NOT appear
5. Each user has their own cache key

### Test 4: Cache Key Verification
Open React Query DevTools (if installed) and check:
- Logged out: No React Query cache entries for contacts
- Logged in: Cache key includes user identifier

## Future Enhancements

### Optional: Clear Demo Data on Sign In
Add this to your sign-in flow:

```tsx
import { useContacts } from '@/hooks/use-contacts';

function SignInButton() {
  const { clearDemoData } = useContacts();

  const handleSignIn = async () => {
    await signIn('google');
    clearDemoData?.(); // Clean up demo data after login
  };
}
```

### Optional: Import Demo Data on Sign Up
Allow users to migrate their demo data:

```tsx
function onSignUpComplete() {
  const demoData = localStorage.getItem('demo_contacts');
  if (demoData) {
    // Prompt user: "Import your demo contacts?"
    await importDemoContacts(JSON.parse(demoData));
  }
}
```

## Security Considerations

✅ **Safe:**
- Demo data in localStorage (client-side only)
- Per-user cache keys prevent data leaks
- Server API requires authentication
- No sensitive data in demo mode

⚠️ **Important:**
- Don't store PII in demo mode
- Demo data is visible in browser DevTools
- Clear demo data if it contains test PII

## Troubleshooting

### Demo data not persisting
- Check browser localStorage quota
- Verify `demo_contacts` key exists in DevTools
- Check console for localStorage errors

### Live data not loading
- Verify user is authenticated (`session` exists)
- Check network tab for API calls
- Verify React Query cache key includes userId

### Data mixing between users
- Should never happen if userId is in cache key
- Check `useLiveData` hook uses correct userId
- Verify cache keys in React Query DevTools

## Summary

This architecture provides:
- **Complete isolation** between demo and live data
- **Per-user isolation** for logged-in users
- **Production-grade** separation of concerns
- **Simple API** for developers
- **Great UX** for users trying before signing up

No data ever crosses the boundary between demo and live modes!
