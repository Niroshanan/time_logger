import { supabase } from '../utils/supabase';

interface LoginCredentials {
    email: string,
    password: string
}

export const loginWithPassword = async ({ email, password }: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
};
