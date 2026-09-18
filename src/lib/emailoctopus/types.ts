export interface EmailOctopusContactFields {
  FirstName?: string;
  LastName?: string;
  Phone?: string;
  Organisation?: string;
  ContactType?: string;
  Message?: string;
}

export interface EmailOctopusContactPayload {
  email_address: string;
  fields?: EmailOctopusContactFields;
  tags?: string[];
  status?: "SUBSCRIBED" | "UNSUBSCRIBED" | "PENDING";
}

export interface EmailOctopusContactResponse {
  id: string;
  email_address: string;
  fields: EmailOctopusContactFields;
  tags: string[];
  status: string;
  created_at: string;
}
