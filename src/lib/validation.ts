import type { ContactInput, DealDraft } from '../types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function validateContact(input: ContactInput): FieldErrors<ContactInput> {
  const errors: FieldErrors<ContactInput> = {};
  if (!input.name.trim()) errors.name = 'Name is required.';
  if (!input.company.trim()) errors.company = 'Company is required.';
  if (input.email.trim() && !isValidEmail(input.email.trim())) {
    errors.email = 'Enter a valid email address, e.g. name@company.com.';
  }
  return errors;
}

export function validateDeal(draft: DealDraft): FieldErrors<DealDraft> {
  const errors: FieldErrors<DealDraft> = {};
  if (!draft.title.trim()) errors.title = 'Title is required.';
  if (!draft.contactId) errors.contactId = 'Pick a contact.';
  const value = Number(draft.value);
  if (draft.value.trim() === '') errors.value = 'Value is required.';
  else if (!Number.isFinite(value) || value < 0) errors.value = 'Enter a positive number.';
  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
