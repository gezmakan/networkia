// Core data types for the CRM
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {
  id: string;
}
