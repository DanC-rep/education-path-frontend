import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Индиго (технологичный, но спокойный)
      light: '#a5b4fc',
    },
    secondary: {
      main: '#06b6d4', // Яркий циан (акцент прогресса, "загрузки")
      light: '#67e8f9',
    },
    success: {
      main: '#10b981', // Изумрудный (для завершенных уроков, успеха)
    },
    warning: {
      main: '#f59e0b', // Янтарный (предупреждения, "в процессе")
    },
    background: {
      default: '#0f172a', // Очень темный сине-серый (глубокий космос)
      paper: '#1e293b',   // Светлее фона, для карточек/панелей
    },
    text: {
      primary: '#f1f5f9', // Почти белый
      secondary: '#cbd5e1', // Светло-серый
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // Современные скругленные углы
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Без заглавных букв
          fontWeight: 600,
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #4f46e5 0%, #0891b2 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Убираем градиент с фона, чтобы был чистый цвет
          border: '1px solid #334155', // Тонкая граница для объема
        },
      },
    },
  },
})