// AVC Fitness Theme Configuration
// Colores basados en la identidad visual de Instagram

export const theme = {
  colors: {
    // Colores principales
    primary: {
      red: '#DC2626',        // Rojo principal AVC
      redHover: '#B91C1C',   // Rojo más oscuro para hover
      redLight: '#EF4444',   // Rojo más claro
      redDark: '#991B1B',    // Rojo muy oscuro
    },
    
    // Colores base (tema claro)
    base: {
      white: '#FFFFFF',      // Blanco puro
      offWhite: '#F9FAFB',   // Blanco ligeramente gris
      lightGray: '#F3F4F6',  // Gris muy claro para fondos
    },
    
    // Grises
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    
    // Negro
    black: {
      pure: '#000000',
      soft: '#0A0A0A',
      medium: '#1A1A1A',
    },
    
    // Estados
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Espaciados
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Tipografía
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
};

// Tailwind config colors (para usar en tailwind.config.js)
export const tailwindColors = {
  'avc-red': {
    DEFAULT: '#DC2626',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  'avc-gray': {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  'avc-black': {
    DEFAULT: '#0A0A0A',
    light: '#1A1A1A',
    pure: '#000000',
  },
};

export default theme;
