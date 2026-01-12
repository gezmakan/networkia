import { useSession } from 'next-auth/react';
import { useDemoStorage } from './use-demo-storage';
import { useLiveData } from './use-live-data';
import { CreateContactInput, UpdateContactInput } from '@/lib/types';

/**
 * Unified hook that automatically switches between demo and live data
 *
 * - Logged out: Uses localStorage with "demo_" prefix
 * - Logged in: Uses server API with user-specific React Query cache keys
 *
 * This ensures complete data isolation with zero cross-contamination
 */
export function useContacts() {
  const { data: session, status } = useSession();
  const demoStorage = useDemoStorage();
  const userId = session?.user?.email || session?.user?.id || '';
  const liveData = useLiveData(userId);

  // Return appropriate data source based on auth state
  if (status === 'loading') {
    return {
      contacts: [],
      isLoading: true,
      addContact: async () => {},
      updateContact: async () => {},
      deleteContact: async () => {},
      isDemo: false,
    };
  }

  if (session) {
    // User is logged in - use live server data
    return {
      ...liveData,
      isDemo: false,
    };
  }

  // User is logged out - use demo localStorage data
  return {
    contacts: demoStorage.contacts,
    isLoading: demoStorage.isLoading,
    addContact: async (input: CreateContactInput) => {
      demoStorage.addContact(input);
    },
    updateContact: async (input: UpdateContactInput) => {
      demoStorage.updateContact(input);
    },
    deleteContact: async (id: string) => {
      demoStorage.deleteContact(id);
    },
    clearDemoData: demoStorage.clearDemoData,
    isDemo: true,
  };
}
