/**
 * Data layer for Outreach CRM.
 *
 * Everything else in the app talks to the `storage` object below through the
 * `CrmRepository` interface. The methods are async on purpose: to move to a
 * real database, write another implementation (e.g. one that calls a REST API)
 * and export it as `storage` instead. No component needs to change.
 */
import type { Contact, ContactInput, Deal, DealInput } from '../types';

export interface CrmRepository {
  listContacts(): Promise<Contact[]>;
  createContact(input: ContactInput): Promise<Contact>;
  updateContact(id: string, input: ContactInput): Promise<Contact>;
  /** Deletes the contact and every deal linked to it. */
  deleteContact(id: string): Promise<void>;

  listDeals(): Promise<Deal[]>;
  createDeal(input: DealInput): Promise<Deal>;
  updateDeal(id: string, patch: Partial<DealInput>): Promise<Deal>;
  deleteDeal(id: string): Promise<void>;

  /** Replaces every contact and deal with the given data. */
  replaceAll(data: { contacts: Contact[]; deals: Deal[] }): Promise<void>;
  /** Deletes every contact and deal. */
  clearAll(): Promise<void>;
}

const KEYS = {
  contacts: 'outreach-crm:contacts',
  deals: 'outreach-crm:deals',
} as const;

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

export const localStorageRepository: CrmRepository = {
  async listContacts() {
    return read<Contact>(KEYS.contacts);
  },

  async createContact(input) {
    const contact: Contact = { ...input, id: newId(), createdAt: now() };
    write(KEYS.contacts, [contact, ...read<Contact>(KEYS.contacts)]);
    return contact;
  },

  async updateContact(id, input) {
    const contacts = read<Contact>(KEYS.contacts);
    const existing = contacts.find((c) => c.id === id);
    if (!existing) throw new Error(`Contact ${id} not found`);
    const updated: Contact = { ...existing, ...input };
    write(KEYS.contacts, contacts.map((c) => (c.id === id ? updated : c)));
    return updated;
  },

  async deleteContact(id) {
    write(KEYS.contacts, read<Contact>(KEYS.contacts).filter((c) => c.id !== id));
    write(KEYS.deals, read<Deal>(KEYS.deals).filter((d) => d.contactId !== id));
  },

  async listDeals() {
    return read<Deal>(KEYS.deals);
  },

  async createDeal(input) {
    const t = now();
    const deal: Deal = { ...input, id: newId(), createdAt: t, updatedAt: t };
    write(KEYS.deals, [deal, ...read<Deal>(KEYS.deals)]);
    return deal;
  },

  async updateDeal(id, patch) {
    const deals = read<Deal>(KEYS.deals);
    const existing = deals.find((d) => d.id === id);
    if (!existing) throw new Error(`Deal ${id} not found`);
    const updated: Deal = { ...existing, ...patch, updatedAt: now() };
    write(KEYS.deals, deals.map((d) => (d.id === id ? updated : d)));
    return updated;
  },

  async deleteDeal(id) {
    write(KEYS.deals, read<Deal>(KEYS.deals).filter((d) => d.id !== id));
  },

  async replaceAll({ contacts, deals }) {
    write(KEYS.contacts, contacts);
    write(KEYS.deals, deals);
  },

  async clearAll() {
    write(KEYS.contacts, []);
    write(KEYS.deals, []);
  },
};

/** The repository the app uses. Swap this for a database-backed one later. */
export const storage: CrmRepository = localStorageRepository;
