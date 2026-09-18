import { getContact, createContact, updateContact } from './client';
import { EmailOctopusContactFields } from './types';

async function syncContact(
  email: string,
  newTag: string,
  fields?: EmailOctopusContactFields
) {
  // Check if contact already exists to merge tags (avoid overwriting)
  const existing = await getContact(email);
  
  const tags = new Set<string>();
  tags.add(newTag);
  
  let mergedFields: EmailOctopusContactFields = { ...fields };

  if (existing) {
    if (existing.tags) {
      existing.tags.forEach((t: string) => tags.add(t));
    }
    // Merge fields - keep existing ones if not provided in the new payload
    mergedFields = { ...existing.fields, ...fields };

    return await updateContact({
      email_address: email,
      fields: mergedFields,
      tags: Array.from(tags),
      status: 'SUBSCRIBED',
    });
  } else {
    return await createContact({
      email_address: email,
      fields: mergedFields,
      tags: Array.from(tags),
      status: 'SUBSCRIBED',
    });
  }
}

export async function addNewsletterSubscriber(email: string) {
  return await syncContact(email, 'newsletter');
}

export async function addDonorContact(email: string, fields: EmailOctopusContactFields) {
  return await syncContact(email, 'donor', fields);
}

export async function addPartnerContact(email: string, fields: EmailOctopusContactFields) {
  return await syncContact(email, 'partner', fields);
}

export async function addEnquiryContact(email: string, fields: EmailOctopusContactFields) {
  return await syncContact(email, 'company-enquiry', fields);
}
