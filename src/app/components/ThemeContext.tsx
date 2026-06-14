import React, { createContext, useContext, useState } from 'react';

export interface AppTheme {
  isDark: boolean;
  // Backgrounds
  editorBg: string;
  sidebarBg: string;
  panelBg: string;
  menuBg: string;
  bubbleBg: string;
  inputBg: string;
  // Borders
  border: string;
  borderLight: string;
  // Text
  text: string;
  textMuted: string;
  textFaint: string;
  // Code syntax (VS Code language colors)
  codeKeyword: string;
  codeString: string;
  codeNumber: string;
  codeFunction: string;
  codeVariable: string;
  codeComment: string;
  codePlain: string;
  // Game accent colors
  accent: string;
  accentGreen: string;
  accentRed: string;
  accentBlue: string;
  accentYellow: string;
  // Drop zones
  dropEmptyBg: string;
  dropEmptyBorder: string;
  dropCorrectBg: string;
  dropCorrectBorder: string;
  dropWrongBg: string;
  dropWrongBorder: string;
  dropHoverBg: string;
  // Code blocks
  blockBg: string;
  blockBorder: string;
  blockHoverBg: string;
  // Editor
  lineNum: string;
  lineHover: string;
}

export const darkTheme: AppTheme = {
  isDark: true,
  editorBg: '#1E1E1E',
  sidebarBg: '#252526',
  panelBg: '#252526',
  menuBg: '#3C3C3C',
  bubbleBg: '#2D2D2D',
  inputBg: '#2D2D2D',
  border: '#3A3A3A',
  borderLight: '#2A2A2A',
  text: '#CCCCCC',
  textMuted: '#888888',
  textFaint: '#4A4A5A',
  codeKeyword: '#569CD6',
  codeString: '#CE9178',
  codeNumber: '#B5CEA8',
  codeFunction: '#DCDCAA',
  codeVariable: '#9CDCFE',
  codeComment: '#6A9955',
  codePlain: '#CCCCCC',
  accent: '#4EC9B0',
  accentGreen: '#6A9955',
  accentRed: '#F48771',
  accentBlue: '#0078D4',
  accentYellow: '#DCDCAA',
  dropEmptyBg: '#2D2D2D',
  dropEmptyBorder: '#4EC9B0',
  dropCorrectBg: '#1E3A2A',
  dropCorrectBorder: '#6A9955',
  dropWrongBg: '#3A1E1A',
  dropWrongBorder: '#F48771',
  dropHoverBg: '#2A3A4A',
  blockBg: '#2D2D2D',
  blockBorder: '#3E3E3E',
  blockHoverBg: '#37373D',
  lineNum: '#4A4A5A',
  lineHover: '#2A2D2E',
};

export const lightTheme: AppTheme = {
  isDark: false,
  editorBg: '#FFFFFF',
  sidebarBg: '#F3F3F3',
  panelBg: '#F3F3F3',
  menuBg: '#DDDDDD',
  bubbleBg: '#F8F8F8',
  inputBg: '#EFEFEF',
  border: '#E4E4E4',
  borderLight: '#F0F0F0',
  text: '#383838',
  textMuted: '#6E6E6E',
  textFaint: '#AAAAAA',
  codeKeyword: '#0000FF',
  codeString: '#A31515',
  codeNumber: '#098658',
  codeFunction: '#795E26',
  codeVariable: '#001080',
  codeComment: '#008000',
  codePlain: '#383838',
  accent: '#007ACC',
  accentGreen: '#388A34',
  accentRed: '#D32F2F',
  accentBlue: '#007ACC',
  accentYellow: '#795E26',
  dropEmptyBg: '#F0F6FF',
  dropEmptyBorder: '#007ACC',
  dropCorrectBg: '#DFF0D8',
  dropCorrectBorder: '#5A9C5A',
  dropWrongBg: '#FAECEC',
  dropWrongBorder: '#D32F2F',
  dropHoverBg: '#E8F0FE',
  blockBg: '#F5F5F5',
  blockBorder: '#CCCCCC',
  blockHoverBg: '#EAEAEA',
  lineNum: '#AAAAAA',
  lineHover: '#F8F8F8',
};

interface ThemeContextValue {
  theme: AppTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(d => !d);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
