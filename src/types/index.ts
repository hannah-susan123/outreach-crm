export const STAGES = ['Lead', 'Contacted', 'Proposal', 'Won', 'Lost'] as const;

export type Stage = (typeof STAGES)[number];

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string; // ISO timestamp
}

export interface Deal {
  id: string;
  contactId: string;
  title: string;
  value: number; // AED
  stage: Stage;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/** Fields the user supplies when creating or editing a contact. */
export type ContactInput = Omit<Contact, 'id' | 'createdAt'>;

/** Fields the user supplies when creating a deal. */
export type DealInput = Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>;

/** Raw deal form state, before the value is parsed into a number. */
export interface DealDraft {
  title: string;
  contactId: string;
  value: string;
  stage: Stage;
}
