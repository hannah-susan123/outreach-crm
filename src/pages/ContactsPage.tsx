import { useMemo, useState } from 'react';
import type { Contact, ContactInput } from '../types';
import { useCrm } from '../lib/CrmContext';
import { formatDate } from '../lib/format';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ContactForm } from '../components/ContactForm';
import { EmptyState } from '../components/EmptyState';
import { inputClass } from '../components/FormField';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import type { PageProps } from '../components/Sidebar';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function ContactsPage({ onNavigate }: PageProps) {
  const { contacts, deals, addContact, updateContact, deleteContact } = useCrm();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<Contact | null>(null);

  const dealCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of deals) counts.set(d.contactId, (counts.get(d.contactId) ?? 0) + 1);
    return counts;
  }, [deals]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, query]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(contact: Contact) {
    setEditing(contact);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function handleSubmit(input: ContactInput) {
    if (editing) await updateContact(editing.id, input);
    else await addContact(input);
    closeForm();
  }

  async function confirmDelete() {
    if (!deleting) return;
    await deleteContact(deleting.id);
    setDeleting(null);
  }

  const deletingDeals = deleting ? dealCounts.get(deleting.id) ?? 0 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description={plural(contacts.length, 'contact')}
        actions={
          contacts.length > 0 && (
            <Button onClick={openAdd}>+ Add contact</Button>
          )
        }
      />

      {contacts.length === 0 ? (
        <EmptyState
          icon="contacts"
          title="No contacts yet"
          message="Contacts are the people you're reaching out to. Add your first one, or load sample data from the Dashboard."
          actions={
            <>
              <Button onClick={openAdd}>+ Add contact</Button>
              <Button variant="secondary" onClick={() => onNavigate('dashboard')}>
                Go to Dashboard
              </Button>
            </>
          }
        />
      ) : (
        <>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or company…"
            aria-label="Search contacts"
            className={`${inputClass} sm:max-w-sm`}
          />

          {visible.length === 0 ? (
            <EmptyState
              icon="search"
              title="No matching contacts"
              message={`Nobody's name or company matches “${query.trim()}”.`}
              actions={
                <Button variant="secondary" onClick={() => setQuery('')}>
                  Clear search
                </Button>
              }
            />
          ) : (
            <>
              {/* Below 1280px: cards (two per row on tablets) */}
              <ul className="grid gap-3 md:grid-cols-2 xl:hidden">
                {visible.map((c) => (
                  <li key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{c.name}</p>
                        <p className="text-sm text-slate-600">{c.company}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {plural(dealCounts.get(c.id) ?? 0, 'deal')}
                      </span>
                    </div>
                    <dl className="mt-3 space-y-1 text-sm">
                      {c.email && (
                        <div className="truncate">
                          <dt className="sr-only">Email</dt>
                          <dd>
                            <a href={`mailto:${c.email}`} className="text-indigo-600 hover:underline">
                              {c.email}
                            </a>
                          </dd>
                        </div>
                      )}
                      {c.phone && (
                        <div>
                          <dt className="sr-only">Phone</dt>
                          <dd className="text-slate-700">{c.phone}</dd>
                        </div>
                      )}
                      {c.notes && (
                        <div>
                          <dt className="sr-only">Notes</dt>
                          <dd className="text-slate-500">{c.notes}</dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-500">Added {formatDate(c.createdAt)}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" className="px-2 py-1" onClick={() => openEdit(c)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => setDeleting(c)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 1280px and up: table */}
              <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm xl:block">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3 text-right">Deals</th>
                      <th className="px-4 py-3">Added</th>
                      <th className="px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{c.name}</div>
                          {c.notes && (
                            <div className="max-w-[16rem] truncate text-xs text-slate-500" title={c.notes}>
                              {c.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{c.company}</td>
                        <td className="px-4 py-3">
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="block text-indigo-600 hover:underline">
                              {c.email}
                            </a>
                          )}
                          {c.phone && <div className="whitespace-nowrap text-xs text-slate-500">{c.phone}</div>}
                          {!c.email && !c.phone && <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-700">{dealCounts.get(c.id) ?? 0}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(c.createdAt)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Button variant="ghost" className="px-2 py-1" onClick={() => openEdit(c)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="px-2 py-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => setDeleting(c)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      <Modal open={formOpen} title={editing ? 'Edit contact' : 'Add contact'} onClose={closeForm}>
        <ContactForm key={editing?.id ?? 'new'} initial={editing} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete ${deleting?.name ?? 'contact'}?`}
        message={
          deletingDeals > 0
            ? `This also deletes their ${plural(deletingDeals, 'deal')}. This can't be undone.`
            : "This can't be undone."
        }
        confirmLabel="Delete contact"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
