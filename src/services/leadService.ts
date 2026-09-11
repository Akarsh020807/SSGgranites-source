import { supabase } from '@/lib/supabase';
import { requireAdmin } from '@/services/authService';
import type {
    CreateLeadInput,
    Lead,
    LeadPriority,
    LeadStatus,
    LeadStatusHistory
} from '@/types/lead';
import {
    normalizeLeadInput,
    validateLeadInput
} from '@/utils/validation';

export interface LeadListOptions {
    page?: number;
    pageSize?: number;
    status?: LeadStatus;
    search?: string;
    includeDeleted?: boolean;
}

export interface PaginatedLeads {
    data: Lead[];
    count: number;
    page: number;
    pageSize: number;
}

export class LeadServiceError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public override readonly cause?: unknown
    ) {
        super(message);
        this.name = 'LeadServiceError';
    }
}

function throwIfError(error: { message: string; code?: string } | null): void {
    if (error) {
        if (error.code === '23505') {
            throw new LeadServiceError(
                'This enquiry has already been submitted.',
                'DUPLICATE_SUBMISSION',
                error
            );
        }

        throw new LeadServiceError(error.message, error.code ?? 'DATABASE_ERROR', error);
    }
}

export async function createLead(input: CreateLeadInput): Promise<void> {
    const normalizedInput = normalizeLeadInput(input);
    validateLeadInput(normalizedInput);

    const { honeypot: _honeypot, submissionKey, ...leadInput } = normalizedInput;
    const { error } = await supabase
        .from('leads')
        .insert({
            ...leadInput,
            source: input.source ?? 'Website',
            status: input.status ?? 'New',
            priority: input.priority ?? 'Normal',
            submission_key: submissionKey ?? null
        });

    throwIfError(error);
}

export async function getLeads(options: LeadListOptions = {}): Promise<PaginatedLeads> {
    await requireAdmin();

    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 25));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (!options.includeDeleted) {
        query = query.is('deleted_at', null);
    }

    if (options.status) {
        query = query.eq('status', options.status);
    }

    if (options.search?.trim()) {
        const search = options.search.trim().replace(/[%(),]/g, ' ');
        query = query.or(
            `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
        );
    }

    const { data, count, error } = await query;

    throwIfError(error);
    return {
        data: (data ?? []) as Lead[],
        count: count ?? 0,
        page,
        pageSize
    };
}

export async function getLeadById(id: string): Promise<Lead> {
    await requireAdmin();

    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

    throwIfError(error);
    return data as Lead;
}

export async function updateLeadStatus(
    id: string,
    status: LeadStatus
): Promise<Lead> {
    await requireAdmin();

    const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

    throwIfError(error);
    return data as Lead;
}

export async function updateLeadPriority(
    id: string,
    priority: LeadPriority
): Promise<Lead> {
    await requireAdmin();

    const { data, error } = await supabase
        .from('leads')
        .update({ priority })
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

    throwIfError(error);
    return data as Lead;
}

export async function updateLeadNotes(
    id: string,
    notes: string | null
): Promise<Lead> {
    await requireAdmin();

    const { data, error } = await supabase
        .from('leads')
        .update({ notes })
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

    throwIfError(error);
    return data as Lead;
}

export async function deleteLead(id: string): Promise<void> {
    await requireAdmin();

    const { error } = await supabase
        .from('leads')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null);

    throwIfError(error);
}

export async function restoreLead(id: string): Promise<void> {
    await requireAdmin();

    const { error } = await supabase
        .from('leads')
        .update({ deleted_at: null })
        .eq('id', id);

    throwIfError(error);
}

export async function getLeadStatusHistory(
    leadId: string
): Promise<LeadStatusHistory[]> {
    await requireAdmin();

    const { data, error } = await supabase
        .from('lead_status_history')
        .select('*')
        .eq('lead_id', leadId)
        .order('changed_at', { ascending: false });

    throwIfError(error);
    return (data ?? []) as LeadStatusHistory[];
}
