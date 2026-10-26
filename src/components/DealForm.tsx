import { useMemo, useState, type FormEvent } from 'react';
import { STAGES, type Contact, type DealDraft, type DealInput, type Stage } from '../types';
import { hasErrors, validateDeal, type FieldErrors } from '../lib/validation';
import { Button } from './Button';
import { FormField, inputClass } from './FormField';

interface DealFormProps {
  contacts: Contact[];
  onSubmit: (input: DealInput) => Promise<void>;
  onCancel: () => void;
}

export function DealForm({ contacts, onSubmit, onCancel }: DealFormProps) {
  const [values, setValues] = useState<DealDraft>({ title: '', contactId: '', value: '', stage: 'Lead' });
  const [errors, setErrors] = useState<FieldErrors<DealDraft>>({});
  const [saving, setSaving] = useState(false);

  const sortedContacts = useMemo(
    () => [...contacts].sort((a, b) => a.name.localeCompare(b.name)),
    [contacts],
  );

  const set = <K extends keyof DealDraft>(field: K, value: DealDraft[K]) =>
    setValues((v) => ({ ...v, [field]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateDeal(values);
    setErrors(found);
    if (hasErrors(found)) return;

    setSaving(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        contactId: values.contactId,
        value: Number(values.value),
        stage: values.stage,
      });
    } finally {
      setSaving(false);
    }
  }

  if (contacts.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          You need at least one contact before you can add a deal. Add one on the Contacts page first.
        </p>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onCancel}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Deal title" htmlFor="deal-title" error={errors.title} required>
        <input
          id="deal-title"
          autoFocus
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          aria-invalid={Boolean(errors.title)}
          className={inputClass}
          placeholder="Fleet tracking pilot"
        />
      </FormField>
      <FormField label="Contact" htmlFor="deal-contact" error={errors.contactId} required>
        <select
          id="deal-contact"
          value={values.contactId}
          onChange={(e) => set('contactId', e.target.value)}
          aria-invalid={Boolean(errors.contactId)}
          className={inputClass}
        >
          <option value="">Select a contact…</option>
          {sortedContacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.company}
            </option>
          ))}
        </select>
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Value (AED)" htmlFor="deal-value" error={errors.value} required>
          <input
            id="deal-value"
            type="number"
            min={0}
            step={100}
            inputMode="numeric"
            value={values.value}
            onChange={(e) => set('value', e.target.value)}
            aria-invalid={Boolean(errors.value)}
            className={inputClass}
            placeholder="50000"
          />
        </FormField>
        <FormField label="Stage" htmlFor="deal-stage">
          <select
            id="deal-stage"
            value={values.stage}
            onChange={(e) => set('stage', e.target.value as Stage)}
            className={inputClass}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Add deal'}
        </Button>
      </div>
    </form>
  );
}
