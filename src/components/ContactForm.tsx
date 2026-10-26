import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Contact, ContactInput } from '../types';
import { hasErrors, validateContact, type FieldErrors } from '../lib/validation';
import { Button } from './Button';
import { FormField, inputClass } from './FormField';

const EMPTY: ContactInput = { name: '', company: '', email: '', phone: '', notes: '' };

interface ContactFormProps {
  initial?: Contact | null;
  onSubmit: (input: ContactInput) => Promise<void>;
  onCancel: () => void;
}

export function ContactForm({ initial, onSubmit, onCancel }: ContactFormProps) {
  const [values, setValues] = useState<ContactInput>(() =>
    initial
      ? {
          name: initial.name,
          company: initial.company,
          email: initial.email,
          phone: initial.phone,
          notes: initial.notes,
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState<FieldErrors<ContactInput>>({});
  const [saving, setSaving] = useState(false);

  const update =
    (field: keyof ContactInput) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed: ContactInput = {
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      notes: values.notes.trim(),
    };
    const found = validateContact(trimmed);
    setErrors(found);
    if (hasErrors(found)) return;

    setSaving(true);
    try {
      await onSubmit(trimmed);
    } finally {
      setSaving(false);
    }
  }

  const fieldProps = (field: keyof ContactInput) => ({
    id: `contact-${field}`,
    value: values[field],
    onChange: update(field),
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
    className: inputClass,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="contact-name" error={errors.name} required>
          <input {...fieldProps('name')} autoFocus placeholder="Aisha Rahman" />
        </FormField>
        <FormField label="Company" htmlFor="contact-company" error={errors.company} required>
          <input {...fieldProps('company')} placeholder="Falcon Logistics" />
        </FormField>
        <FormField label="Email" htmlFor="contact-email" error={errors.email}>
          <input {...fieldProps('email')} type="email" placeholder="name@company.com" />
        </FormField>
        <FormField label="Phone" htmlFor="contact-phone" error={errors.phone}>
          <input {...fieldProps('phone')} type="tel" placeholder="+971 50 000 0000" />
        </FormField>
      </div>
      <FormField label="Notes" htmlFor="contact-notes" error={errors.notes}>
        <textarea {...fieldProps('notes')} rows={3} placeholder="Where you met, what they need…" />
      </FormField>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Add contact'}
        </Button>
      </div>
    </form>
  );
}
