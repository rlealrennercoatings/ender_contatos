import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography, Container } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setTokenFromCallback } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      console.error('Erro de autenticação:', error)
      navigate('/login?error=' + error)
      return
    }

    if (token) {
      try {
        // Salvar token e redirecionar
        setTokenFromCallback(token)
        navigate('/')
      } catch (err) {
        console.error('Erro ao processar token:', err)
        navigate('/login?error=invalid_token')
      }
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate, setTokenFromCallback])

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1">Processando autenticação...</Typography>
      </Box>
    </Container>
  )
}
