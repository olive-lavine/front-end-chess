import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  // Load theme setting from localStorage or use default value
  const savedTheme = localStorage.getItem("theme");
  const defaultTheme = savedTheme || "blue";

  const [theme, setTheme] = useState(defaultTheme);

  // Load moad setting from localStorage or use default value
  const savedMode = localStorage.getItem("mode");
  const defaultMode = savedMode || "light";

  const [mode, setMode] = useState(defaultMode);

  // Load sound choice setting from localStorage or use default value
  const savedSoundChoice = localStorage.getItem("soundChoice");
  const defaultSoundChoice = savedSoundChoice || "none";

  const [soundChoice, setSoundChoice] = useState(defaultSoundChoice);

  // Load color theme settings from localStorage or use default values
  const savedColorTheme = localStorage.getItem("colorTheme");
  const defaultColorTheme = savedColorTheme
    ? JSON.parse(savedColorTheme)
    : {
        light: { backgroundColor: "rgb(235, 234, 232)" },
        dark: { backgroundColor: "rgb(125, 172, 189)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
        hintColor: "rgb(144, 234, 252)",
        primaryRGB: "92, 150, 173",
      };

  const [colorTheme, setColorTheme] = useState(defaultColorTheme);
  const [primaryColor, setPrimaryColor] = useState(
    defaultColorTheme.primaryRGB
  );
  const [hintColor, setHintColor] = useState(defaultColorTheme.hintColor);

  // Load the sound setting from localStorage or use an empty string
  const savedSound = localStorage.getItem("sound");
  const defaultSound = savedSound ? savedSound : "";

  const [sound, setSound] = useState(defaultSound); // Set to an empty string if savedSound is null

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("colorTheme", JSON.stringify(colorTheme));
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem("sound", sound !== null ? sound : "");
  }, [sound]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("soundChoice", soundChoice);
  }, [soundChoice]);

  useEffect(() => {
    localStorage.setItem("primaryColor", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <SettingsContext.Provider
      value={{
        colorTheme,
        setColorTheme,
        theme,
        setTheme,
        sound,
        setSound,
        soundChoice,
        setSoundChoice,
        primaryColor,
        setPrimaryColor,
        hintColor,
        setHintColor,
        mode,
        setMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to access the context
export function useSettingsContext() {
  return useContext(SettingsContext);
}
