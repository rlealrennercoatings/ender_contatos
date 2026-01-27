import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Container, Box } from '@mui/material'
import ContatosList from './pages/ContatosList'
import ContatoForm from './pages/ContatoForm'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'

const theme = createTheme({
  palette: {
    primary: {
      main: '#cc0000',
      light: '#ff3333',
      dark: '#990000',
    },
    secondary: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#16a34a',
    },
    warning: {
      main: '#ea580c',
    },
    error: {
      main: '#dc2626',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          padding: '10px 24px',
          '@media (max-width:600px)': {
            padding: '8px 16px',
            fontSize: '0.875rem',
          },
        },
        contained: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            transition: 'box-shadow 0.3s ease',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          '@media (max-width:600px)': {
            margin: '16px',
            maxHeight: 'calc(100% - 32px)',
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px 4px',
          },
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#f1f5f9',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px',
          },
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <BrowserRouter>
          <AuthProvider>
            <Container maxWidth="lg" sx={{ 
              flex: 1,
              px: { xs: 0, sm: 2 },
            }}>
              <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth-callback"
                element={<AuthCallbackPage />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ContatosList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/novo"
                element={
                  <ProtectedRoute>
                    <ContatoForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/novo-contato"
                element={
                  <ProtectedRoute>
                    <ContatoForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editar/:id"
                element={
                  <ProtectedRoute>
                    <ContatoForm />
                  </ProtectedRoute>
                }
              />
              </Routes>
            </Container>
          </AuthProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  )
}

export default App
