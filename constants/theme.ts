export const Theme = {
  colors: {
    // background: '#1A1F3A',
    background: '#50739B',
    // backgroundSecondary: '#0F1624',
    backgroundSecondary: '#1A1F3A',
    white: '#FFFFFF',
    text: {
      primary: '#FFFFFF',
      secondary: '#B8C5D6',
      tertiary: '#7A8FAD',
      accent: '#00D4FF',
    },
    status: {
      uncaught: {
        background: '#2A2A40',
        border: '#4A4A6A',
        accent: '#6A6A8A',
      },
      caught: {
        background: '#FFE0B2',
        border: '#FF9800',
        accent: '#FF6B00',
      },
      living: {
        background: '#B2FFB2',
        border: '#4CAF50',
        accent: '#00C853',
      },
    },
    badge: {
      default: '#FF6B00',
      text: '#FFFFFF',
    },
    digimon: {
      primary: '#FF6B00',
      secondary: '#00D4FF',
      accent: '#9C27B0',
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      color: '#FFFFFF',
    },
    h2: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: '#B8C5D6',
    },
    cardTitle: {
      fontSize: 11,
      fontWeight: '700' as const,
    },
    cardNumber: {
      fontSize: 9,
      fontWeight: '500' as const,
    },
    cardText: {
      fontSize: 10,
      fontWeight: '600' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    card: 12,
    badge: 6,
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
  },
  glow: {
    card: {
      shadowColor: '#00D4FF',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 8,
    },
  },
  border: {
    card: {
      borderWidth: 2,
    },
  },
} as const;
