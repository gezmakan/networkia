import { useState, useEffect, useCallback } from 'react';
import { Contact, CreateContactInput, UpdateContactInput } from '@/lib/types';
import { generateDemoContacts } from '@/lib/demo-data';

const DEMO_STORAGE_KEY = 'demo_contacts';

/**
 * Hook for managing demo data in localStorage
 * Uses "demo_" prefix to ensure isolation from live data
 */
export function useDemoStorage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        setContacts(JSON.parse(stored));
      } else {
        // Initialize with sample data
        const demoData = generateDemoContacts();
        setContacts(demoData);
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoData));
      }
    } catch (error) {
      console.error('Failed to load demo data:', error);
      setContacts(generateDemoContacts());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist to localStorage whenever contacts change
  const persistContacts = useCallback((newContacts: Contact[]) => {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newContacts));
      setContacts(newContacts);
    } catch (error) {
      console.error('Failed to save demo data:', error);
    }
  }, []);

  const addContact = useCallback(
    (input: CreateContactInput) => {
      const newContact: Contact = {
        id: `demo-${Date.now()}`,
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      persistContacts([...contacts, newContact]);
      return newContact;
    },
    [contacts, persistContacts]
  );

  const updateContact = useCallback(
    (input: UpdateContactInput) => {
      const updated = contacts.map((contact) =>
        contact.id === input.id
          ? { ...contact, ...input, updatedAt: new Date().toISOString() }
          : contact
      );
      persistContacts(updated);
    },
    [contacts, persistContacts]
  );

  const deleteContact = useCallback(
    (id: string) => {
      const filtered = contacts.filter((contact) => contact.id !== id);
      persistContacts(filtered);
    },
    [contacts, persistContacts]
  );

  const clearDemoData = useCallback(() => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setContacts([]);
  }, []);

  return {
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
    clearDemoData,
  };
}
