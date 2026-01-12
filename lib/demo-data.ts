import { Contact } from './types';

// Sample contacts for demo mode
export const generateDemoContacts = (): Contact[] => {
  const now = new Date().toISOString();

  return [
    {
      id: 'demo-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc',
      notes: 'Met at conference. Interested in collaboration.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-2',
      name: 'James Wilson',
      email: 'j.wilson@example.com',
      company: 'Design Studio',
      notes: 'Potential client for Q2',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'demo-3',
      name: 'Maria Garcia',
      phone: '+1 (555) 987-6543',
      company: 'Startup Labs',
      notes: 'Advisor, monthly check-ins',
      createdAt: now,
      updatedAt: now,
    },
  ];
};
