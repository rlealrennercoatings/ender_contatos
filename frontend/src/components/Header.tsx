import { Box, AppBar, Toolbar, Typography, Tooltip, IconButton } from '@mui/material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { logout } = useAuth()

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#cc0000',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mr: 'auto',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              padding: '2px 2px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/renner01.png"
              alt="Renner Logo"
              style={{
                height: '40px',
                width: 'auto',
              }}
            />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'white',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Gestão de Contatos
          </Typography>
        </Box>

        {/* Logout Button */}
        <Tooltip title="Sair">
          <IconButton 
            onClick={logout} 
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}
