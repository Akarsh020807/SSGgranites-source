import type { CreateLeadInput } from '@/types/lead';

const limits = {
    name: 120,
    email: 254,
    phone: 30,
    subject: 200,
    message: 5000,
    notes: 10000
} as const;

export function validateLeadInput(input: CreateLeadInput): void {
    const requiredFields: Array<keyof CreateLeadInput> = [
        'name',
        'email',
        'phone',
        'message'
    ];

    for (const field of requiredFields) {
        const value = input[field];

        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new Error(`${field} is required`);
        }
    }

    if (!isValidEmail(input.email)) {
        throw new Error('email must be valid');
    }

    for (const [field, limit] of Object.entries(limits)) {
        const value = input[field as keyof CreateLeadInput];

        if (typeof value === 'string' && value.length > limit) {
            throw new Error(`${field} must be ${limit} characters or fewer`);
        }
    }

    if (input.honeypot?.trim()) {
        throw new Error('Spam submission rejected');
    }

    if (input.submissionKey !== undefined && input.submissionKey.trim() === '') {
        throw new Error('submissionKey must not be empty');
    }
}

export function normalizeLeadInput(input: CreateLeadInput): CreateLeadInput {
    const normalized: CreateLeadInput = {
        ...input,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        subject: input.subject?.trim() || null,
        message: input.message.trim(),
        notes: input.notes?.trim() || null
    };

    if (input.source !== undefined) {
        normalized.source = input.source.trim();
    }

    if (input.submissionKey !== undefined) {
        normalized.submissionKey = input.submissionKey.trim();
    }

    return normalized;
}

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
