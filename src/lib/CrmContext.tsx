import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { storage } from './storage';
import { generateSampleData } from './sampleData';
import type { Contact, ContactInput, Deal, DealInput, Stage } from '../types';

interface CrmContextValue {
  contacts: Contact[];
  deals: Deal[];
  loading: boolean;
  error: string | null;
  addContact(input: ContactInput): Promise<void>;
  updateContact(id: string, input: ContactInput): Promise<void>;
  deleteContact(id: string): Promise<void>;
  addDeal(input: DealInput): Promise<void>;
  moveDeal(id: string, stage: Stage): Promise<void>;
  deleteDeal(id: string): Promise<void>;
  /** Replaces all data with the demo contacts and deals. */
  loadSampleData(): Promise<void>;
  /** Deletes all contacts and deals. */
  resetData(): Promise<void>;
}

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([storage.listContacts(), storage.listDeals()])
      .then(([c, d]) => {
        if (cancelled) return;
        setContacts(c);
        setDeals(d);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value: CrmContextValue = {
    contacts,
    deals,
    loading,
    error,

    async addContact(input) {
      const contact = await storage.createContact(input);
      setContacts((prev) => [contact, ...prev]);
    },

    async updateContact(id, input) {
      const updated = await storage.updateContact(id, input);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    },

    async deleteContact(id) {
      await storage.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setDeals((prev) => prev.filter((d) => d.contactId !== id));
    },

    async addDeal(input) {
      const deal = await storage.createDeal(input);
      setDeals((prev) => [deal, ...prev]);
    },

    async moveDeal(id, stage) {
      const updated = await storage.updateDeal(id, { stage });
      setDeals((prev) => prev.map((d) => (d.id === id ? updated : d)));
    },

    async deleteDeal(id) {
      await storage.deleteDeal(id);
      setDeals((prev) => prev.filter((d) => d.id !== id));
    },

    async loadSampleData() {
      const data = generateSampleData();
      await storage.replaceAll(data);
      setContacts(data.contacts);
      setDeals(data.deals);
    },

    async resetData() {
      await storage.clearAll();
      setContacts([]);
      setDeals([]);
    },
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error('useCrm must be used inside <CrmProvider>');
  return ctx;
}
