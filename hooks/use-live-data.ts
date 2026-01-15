import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Contact, CreateContactInput, UpdateContactInput } from '@/lib/types';

/**
 * Hook for managing live server data with user-specific cache keys
 * Cache keys are namespaced per user to prevent data mixing
 */
export function useLiveData(userId: string) {
  const queryClient = useQueryClient();

  // User-specific cache key - this is CRITICAL for data isolation
  const contactsKey = ['contacts', 'user', userId];

  // Fetch contacts from server
  const {
    data: contacts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: contactsKey,
    queryFn: async () => {
      const response = await fetch('/api/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      return response.json() as Promise<Contact[]>;
    },
  });

  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: async (input: CreateContactInput) => {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error('Failed to create contact');
      }
      return response.json() as Promise<Contact>;
    },
    onSuccess: () => {
      // Invalidate and refetch with user-specific key
      queryClient.invalidateQueries({ queryKey: contactsKey });
    },
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async (input: UpdateContactInput) => {
      const response = await fetch(`/api/contacts/${input.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update contact: ${response.status}`);
      }
      return response.json() as Promise<Contact>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactsKey });
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactsKey });
    },
  });

  return {
    contacts,
    isLoading,
    error,
    addContact: (input: CreateContactInput) => addContactMutation.mutateAsync(input),
    updateContact: (input: UpdateContactInput) => updateContactMutation.mutateAsync(input),
    deleteContact: (id: string) => deleteContactMutation.mutateAsync(id),
  };
}
