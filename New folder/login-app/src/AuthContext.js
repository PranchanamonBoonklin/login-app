import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "./config/supabase";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };
    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    };
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };
    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        return { data, error };
    };
    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
    };
    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>

    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};
