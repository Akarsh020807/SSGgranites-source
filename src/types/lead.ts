export const leadStatuses = [
    'New',
    'Contacted',
    'Follow Up',
    'Qualified',
    'Converted',
    'Closed',
    'Spam'
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export const leadPriorities = [
    'Low',
    'Normal',
    'High',
    'Urgent'
] as const;

export type LeadPriority = (typeof leadPriorities)[number];

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string | null;
    message: string;
    source: string;
    status: LeadStatus;
    priority: LeadPriority;
    notes: string | null;
    created_at: string;
    updated_at: string;
    submission_key: string | null;
    deleted_at: string | null;
}

export interface LeadStatusHistory {
    id: string;
    lead_id: string;
    old_status: LeadStatus | null;
    new_status: LeadStatus;
    changed_by: string | null;
    changed_at: string;
}

export interface CreateLeadInput {
    name: string;
    email: string;
    phone: string;
    subject?: string | null;
    message: string;
    source?: string;
    status?: LeadStatus;
    priority?: LeadPriority;
    notes?: string | null;
    submissionKey?: string;
    honeypot?: string;
}
