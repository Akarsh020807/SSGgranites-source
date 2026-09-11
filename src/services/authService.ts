import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

function throwIfError(error: { message: string } | null): void {
    if (error) {
        throw new Error(error.message);
    }
}

export async function adminLogin(
    email: string,
    password: string
): Promise<Session> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    throwIfError(error);

    if (!data.session || !data.user) {
        throw new Error('Login did not return a session');
    }

    try {
        await requireAdmin(data.user.id);
    } catch (error) {
        await supabase.auth.signOut();
        throw error;
    }

    return data.session;
}

export async function isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

    throwIfError(error);
    return Boolean(data);
}

export async function requireAdmin(userId?: string): Promise<User> {
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (error || !user || (userId && user.id !== userId) || !(await isAdmin(user.id))) {
        throw new Error('Admin authorization required');
    }

    return user;
}

export async function getCurrentSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();

    throwIfError(error);
    return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return null;
    }

    return data.user;
}

export async function logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    throwIfError(error);
}
