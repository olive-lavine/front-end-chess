import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    // Load theme setting from localStorage or use default value
    const savedTheme = localStorage.getItem('theme');
    const defaultTheme = savedTheme || 'blue';

    const [theme, setTheme] = useState(defaultTheme);

    // Load sound choice setting from localStorage or use default value
    const savedSoundChoice = localStorage.getItem('soundChoice');
    const defaultSoundChoice = savedSoundChoice || 'none';

    const [soundChoice, setSoundChoice] = useState(defaultSoundChoice);

    // Load color theme settings from localStorage or use default values
    const savedColorTheme = localStorage.getItem('colorTheme');
    const defaultColorTheme = savedColorTheme
        ? JSON.parse(savedColorTheme)
        : {
            light: { backgroundColor: "rgb(235, 234, 232)" },
            dark: { backgroundColor: "rgb(125, 172, 189)" },
            drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
        };

    const [colorTheme, setColorTheme] = useState(defaultColorTheme);

    // Load the sound setting from localStorage or use an empty string
    const savedSound = localStorage.getItem('sound');
    const defaultSound = savedSound ? savedSound : '';

    const [sound, setSound] = useState(defaultSound); // Set to an empty string if savedSound is null

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('colorTheme', JSON.stringify(colorTheme));
    }, [colorTheme]);

    useEffect(() => {
        localStorage.setItem('sound', sound !== null ? sound : '');
    }, [sound]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('soundChoice', soundChoice);
    }, [soundChoice]);

    return (
        <SettingsContext.Provider
            value={{ colorTheme, setColorTheme, theme, setTheme, sound, setSound, soundChoice, setSoundChoice }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

// Custom hook to access the context
export function useSettingsContext() {
    return useContext(SettingsContext);
}
