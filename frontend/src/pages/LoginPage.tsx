import { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Microsoft as MicrosoftIcon } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { loading } = useAuth()
  const [error, setError] = useState('')

  const handleLoginAzure = () => {
    const protocol = window.location.protocol
    const host = window.location.hostname
    window.location.href = `${protocol}//${host}/auth/login`
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: '16px',
            p: { xs: 3, sm: 4, md: 5 },
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          {/* Logo Renner */}
          <Box
            sx={{
              mb: 3,
            }}
          >
            <img
              src="/renner01.png"
              alt="Renner Logo"
              style={{
                maxWidth: '120px',
                height: 'auto',
                borderRadius: '12px',
              }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: '#cc0000',
              mb: 1,
            }}
          >
            Gestão de Contatos
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            Acesse sua plataforma de gestão com segurança
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLoginAzure}
            disabled={loading}
            sx={{
              backgroundColor: '#cc0000',
              fontSize: { xs: '0.95rem', sm: '1rem' },
              py: { xs: 1.5, sm: 2 },
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#990000',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <MicrosoftIcon sx={{ mr: 1 }} />
                Entrar com Entra ID
              </>
            )}
          </Button>

          <Typography
            variant="body2"
            sx={{
              mt: 3,
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            © 2026 Gestão de Contatos. Todos os direitos reservados.
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
