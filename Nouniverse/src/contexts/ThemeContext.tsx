import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeVariant = 'default' | 'neon' | 'warm' | 'cool';

interface ThemeContextType {
    mode: ThemeMode;
    variant: ThemeVariant;
    actualMode: 'light' | 'dark'; // The actual applied mode (resolves 'auto')
    setMode: (mode: ThemeMode) => void;
    setVariant: (variant: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    variant: 'default',
    actualMode: 'light',
    setMode: () => { },
    setVariant: () => { },
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('theme-mode');
        return (saved as ThemeMode) || 'light';
    });

    const [variant, setVariant] = useState<ThemeVariant>(() => {
        const saved = localStorage.getItem('theme-variant');
        return (saved as ThemeVariant) || 'default';
    });

    const [actualMode, setActualMode] = useState<'light' | 'dark'>('light');

    // Handle system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateActualMode = () => {
            if (mode === 'auto') {
                setActualMode(mediaQuery.matches ? 'dark' : 'light');
            } else {
                setActualMode(mode);
            }
        };

        updateActualMode();

        if (mode === 'auto') {
            mediaQuery.addEventListener('change', updateActualMode);
            return () => mediaQuery.removeEventListener('change', updateActualMode);
        }
    }, [mode]);

    // Apply theme classes to document
    useEffect(() => {
        const root = document.documentElement;

        // Remove all theme classes
        root.classList.remove('dark', 'theme-neon', 'theme-warm', 'theme-cool');

        // Apply mode
        if (actualMode === 'dark') {
            root.classList.add('dark');
        }

        // Apply variant
        if (variant !== 'default') {
            root.classList.add(`theme-${variant}`);
        }
    }, [actualMode, variant]);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('theme-variant', variant);
    }, [variant]);

    return (
        <ThemeContext.Provider
            value={{
                mode,
                variant,
                actualMode,
                setMode,
                setVariant,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
