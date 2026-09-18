import { EmailOctopusContactPayload, EmailOctopusContactResponse } from './types';
import crypto from 'crypto';

const API_KEY = process.env.EMAILOCTOPUS_API_KEY;
const LIST_ID = process.env.EMAILOCTOPUS_LIST_ID;
const API_URL = 'https://emailoctopus.com/api/1.6';

if (!API_KEY || !LIST_ID) {
  console.warn("EmailOctopus API keys are missing in environment variables.");
}

function getMd5Hash(email: string): string {
  return crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
}

/**
 * Checks if a contact already exists and returns it, or returns null if not found.
 */
export async function getContact(email: string): Promise<EmailOctopusContactResponse | null> {
  if (!API_KEY || !LIST_ID) return null;
  const hash = getMd5Hash(email);
  
  try {
    const res = await fetch(`${API_URL}/lists/${LIST_ID}/contacts/${hash}?api_key=${API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return await res.json();
    }
    
    if (res.status === 404) {
      return null;
    }

    console.error(`EmailOctopus GET contact failed: ${res.statusText}`);
    return null;
  } catch (error) {
    console.error('EmailOctopus GET contact error:', error);
    return null;
  }
}

/**
 * Creates a new contact.
 */
export async function createContact(payload: EmailOctopusContactPayload): Promise<EmailOctopusContactResponse | null> {
  if (!API_KEY || !LIST_ID) return null;
  
  const endpoint = `${API_URL}/lists/${LIST_ID}/contacts`;
  
  const body = {
    api_key: API_KEY,
    email_address: payload.email_address,
    fields: payload.fields || {},
    tags: payload.tags || [],
    status: payload.status || "SUBSCRIBED"
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return await res.json();
    }

    const text = await res.text();
    console.error(`EmailOctopus POST contact failed: ${res.status} - ${text}`);
    return null;
  } catch (error) {
    console.error('EmailOctopus POST contact error:', error);
    return null;
  }
}

/**
 * Updates an existing contact.
 */
export async function updateContact(payload: EmailOctopusContactPayload): Promise<EmailOctopusContactResponse | null> {
  if (!API_KEY || !LIST_ID) return null;
  
  const hash = getMd5Hash(payload.email_address);
  const endpoint = `${API_URL}/lists/${LIST_ID}/contacts/${hash}`;
  
  const body = {
    api_key: API_KEY,
    email_address: payload.email_address,
    fields: payload.fields || {},
    status: payload.status || "SUBSCRIBED"
  };

  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return await res.json();
    }

    const text = await res.text();
    console.error(`EmailOctopus PUT contact failed: ${res.status} - ${text}`);
    return null;
  } catch (error) {
    console.error('EmailOctopus PUT contact error:', error);
    return null;
  }
}
