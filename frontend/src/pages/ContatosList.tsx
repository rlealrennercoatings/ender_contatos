import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Typography,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Card,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  ContentCopy as CopyIcon,
  Print as PrintIcon,
} from '@mui/icons-material'
import { contatosApi, Contato } from '../services/api'
import { maskPhone } from '../utils/masks'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import '../styles/print.css'

export default function ContatosList() {
  const navigate = useNavigate()
  const { user, hasPermission } = useAuth()
  const [contatos, setContatos] = useState<Contato[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; contato: Contato | null }>({
    open: false,
    contato: null,
  })
  const [viewDialog, setViewDialog] = useState<{ open: boolean; contato: Contato | null }>({
    open: false,
    contato: null,
  })

  const loadContatos = async () => {
    setLoading(true)
    try {
      const response = await contatosApi.listar(search || undefined)
      setContatos(response.data)
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(0) // Resetar para primeira página ao buscar
    loadContatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Calcular contatos para a página atual
  const startIndex = page * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const contatosPaginados = contatos.slice(startIndex, endIndex)

  const handleDelete = async () => {
    if (!deleteDialog.contato?.id) return

    try {
      await contatosApi.excluir(deleteDialog.contato.id)
      setDeleteDialog({ open: false, contato: null })
      loadContatos()
    } catch (error) {
      console.error('Erro ao excluir contato:', error)
    }
  }

  const getTelefonePrincipal = (contato: Contato): string => {
    const endereco = contato.enderecos?.[0]
    const primeiraTelefone = endereco?.telefones?.[0]
    return primeiraTelefone?.numero ? maskPhone(primeiraTelefone.numero) : '-'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handlePrint = () => {
    // Pequeno delay para garantir que o dialog está renderizado
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const getWhatsAppLink = (telefone: string): string => {
    // Remover caracteres não numéricos
    const apenasNumeros = telefone.replace(/\D/g, '')
    // Se não tiver o código do país, adicionar 55 (Brasil)
    const numeroFormatado = apenasNumeros.startsWith('55') ? apenasNumeros : '55' + apenasNumeros
    return `https://wa.me/${numeroFormatado}`
  }

  const getEmailLink = (email: string): string => {
    return `mailto:${email}`
  }

  return (
    <>
      <Header />
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              Contatos
            </Typography>
            {user && (
              <Box display="flex" gap={1} mt={1} sx={{ flexWrap: 'wrap' }}>
                <Chip
                  label={`👤 ${user.name}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`👥 ${user.groups.join(', ')}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            gap={1}
            sx={{
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {hasPermission('CREATE') && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/novo')}
                sx={{
                  flex: { xs: 1, sm: 'auto' },
                }}
              >
                Novo
              </Button>
            )}
          </Box>
        </Box>

      <TextField
        fullWidth
        placeholder="Buscar por nome, empresa, email, telefone, cidade..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Desktop Table */}
          <TableContainer
            component={Paper}
            sx={{
              display: { xs: 'none', sm: 'block' },
              overflowX: 'auto',
              borderRadius: '12px',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '10px',
                '&:hover': {
                  background: '#555',
                },
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ whiteSpace: 'nowrap', padding: '12px 8px', fontWeight: 700 }}>Nome</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', padding: '12px 8px', maxWidth: 200, fontWeight: 700 }}>Empresa</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', padding: '12px 8px', fontWeight: 700 }}>Telefone</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', padding: '12px 8px', maxWidth: 220, fontWeight: 700 }}>E-mail</TableCell>
                  <TableCell align="right" sx={{ minWidth: 100, padding: '12px 4px', whiteSpace: 'nowrap', fontWeight: 700 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
              {contatos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Nenhum contato encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                contatosPaginados.map((contato) => (
                  <TableRow key={contato.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{contato.nome}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', padding: '12px 8px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Tooltip title={contato.empresa || '-'}>
                        <span>{contato.empresa || '-'}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', padding: '12px 8px' }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {getTelefonePrincipal(contato) !== '-' && (
                          <>
                            <Tooltip title="Abrir WhatsApp">
                              <IconButton
                                component="a"
                                href={getWhatsAppLink(getTelefonePrincipal(contato))}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                sx={{ padding: '2px', color: '#25D366' }}
                              >
                                <WhatsAppIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <span>{maskPhone(getTelefonePrincipal(contato))}</span>
                            <Tooltip title="Copiar telefone">
                              <IconButton
                                size="small"
                                sx={{ padding: '2px' }}
                                onClick={() => copyToClipboard(getTelefonePrincipal(contato))}
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {getTelefonePrincipal(contato) === '-' && '-'}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', padding: '12px 8px', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {contato.email ? (
                          <>
                            <Tooltip title="Enviar e-mail">
                              <IconButton
                                component="a"
                                href={getEmailLink(contato.email)}
                                size="small"
                                sx={{ padding: '2px' }}
                              >
                                <EmailIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={contato.email}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{contato.email}</span>
                            </Tooltip>
                            <Tooltip title="Copiar e-mail">
                              <IconButton
                                size="small"
                                sx={{ padding: '2px', flexShrink: 0 }}
                                onClick={() => copyToClipboard(contato.email || '')}
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          '-'
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 120, padding: '12px 4px' }}>
                      <Box display="inline-flex" alignItems="center" justifyContent="flex-end" gap={0.25}>
                        <Tooltip title="Visualizar">
                          <IconButton
                            size="small"
                            sx={{ padding: '4px' }}
                            onClick={() => setViewDialog({ open: true, contato })}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {hasPermission('EDIT') && (
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ padding: '4px' }}
                              onClick={() => navigate(`/editar/${contato.id}`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {hasPermission('DELETE') && (
                          <Tooltip title="Excluir">
                            <IconButton
                              size="small"
                              color="error"
                              sx={{ padding: '4px' }}
                              onClick={() => setDeleteDialog({ open: true, contato })}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {contatos.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={contatos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Registros por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            />
          )}
        </TableContainer>

        {/* Mobile Cards Layout */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          {contatos.length === 0 ? (
            <Box display="flex" justifyContent="center" p={2}>
              <Typography variant="body2" color="text.secondary">
                Nenhum contato encontrado
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {contatosPaginados.map((contato) => (
                <Card
                  key={contato.id}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    '&:active': {
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1} mb={1.5}>
                    <Box flex={1} minWidth={0}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {contato.nome}
                      </Typography>
                      {contato.empresa && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {contato.empresa}
                        </Typography>
                      )}
                      {contato.cargo && (
                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {contato.cargo}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" gap={0.5} flexShrink={0}>
                      <Tooltip title="Visualizar">
                        <IconButton
                          size="small"
                          onClick={() => setViewDialog({ open: true, contato })}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {hasPermission('EDIT') && (
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/editar/${contato.id}`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {hasPermission('DELETE') && (
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteDialog({ open: true, contato })}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1.5 }}>
                    {getTelefonePrincipal(contato) !== '-' && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <WhatsAppIcon sx={{ fontSize: '20px', color: '#25D366', flexShrink: 0 }} />
                        <Tooltip title="Abrir WhatsApp">
                          <Box
                            component="a"
                            href={getWhatsAppLink(getTelefonePrincipal(contato))}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              color: 'primary.main',
                              textDecoration: 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {maskPhone(getTelefonePrincipal(contato))}
                          </Box>
                        </Tooltip>
                        <Tooltip title="Copiar telefone">
                          <IconButton
                            size="small"
                            sx={{ p: 0.5, flexShrink: 0 }}
                            onClick={() => copyToClipboard(getTelefonePrincipal(contato))}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    {contato.email && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon sx={{ fontSize: '20px', flexShrink: 0 }} />
                        <Tooltip title="Enviar e-mail">
                          <Box
                            component="a"
                            href={getEmailLink(contato.email)}
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              color: 'primary.main',
                              textDecoration: 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {contato.email}
                          </Box>
                        </Tooltip>
                        <Tooltip title="Copiar e-mail">
                          <IconButton
                            size="small"
                            sx={{ p: 0.5, flexShrink: 0 }}
                            onClick={() => copyToClipboard(contato.email || '')}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </Card>
              ))}
            </Box>
          )}

          {contatos.length > 0 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                ← Anterior
              </Button>
              <Typography variant="body2">
                {page + 1} de {Math.ceil(contatos.length / rowsPerPage)}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage(Math.min(Math.ceil(contatos.length / rowsPerPage) - 1, page + 1))}
                disabled={page >= Math.ceil(contatos.length / rowsPerPage) - 1}
              >
                Próxima →
              </Button>
            </Box>
          )}
        </Box>
        </>
      )}

      {/* Dialog de Visualização */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, contato: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <span>Detalhes do Contato</span>
            <Tooltip title="Imprimir">
              <IconButton size="small" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewDialog.contato && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {viewDialog.contato.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {viewDialog.contato.cargo && `${viewDialog.contato.cargo}`}
                {viewDialog.contato.empresa && ` - ${viewDialog.contato.empresa}`}
              </Typography>
              {viewDialog.contato.email && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>E-mail:</strong> {viewDialog.contato.email}
                </Typography>
              )}
              {viewDialog.contato.website && (
                <Typography variant="body2">
                  <strong>Website:</strong> {viewDialog.contato.website}
                </Typography>
              )}
              {viewDialog.contato.enderecos && viewDialog.contato.enderecos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Endereços:
                  </Typography>
                  {viewDialog.contato.enderecos.map((end, idx) => (
                    <Box key={idx} sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>{end.apelido || end.tipo}:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {end.endereco && `${end.endereco}, `}
                        {end.bairro && `${end.bairro} - `}
                        {end.cidade && `${end.cidade}/${end.uf || ''}`}
                        {end.cep && ` - CEP: ${end.cep}`}
                      </Typography>
                      {(end.telefones || []).map((tel, telIdx) => (
                        <Typography key={telIdx} variant="body2">
                          {tel.tipo === 'CELULAR' ? 'Cel' : 'Tel'}: {maskPhone(tel.numero)}
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </Box>
              )}
              {viewDialog.contato.observacoes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Observações:
                  </Typography>
                  <Box 
                    className="ql-editor"
                    sx={{ 
                      p: 1.5,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '& p': { mb: 1 },
                      '& h1': { fontSize: '1.75rem', fontWeight: 700, my: 1 },
                      '& h2': { fontSize: '1.5rem', fontWeight: 700, my: 1 },
                      '& h3': { fontSize: '1.25rem', fontWeight: 700, my: 1 },
                      '& ol': { pl: 3, mb: 1 },
                      '& ul': { pl: 3, mb: 1 },
                      '& blockquote': { 
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                        pl: 2,
                        ml: 0,
                        my: 1,
                        fontStyle: 'italic'
                      },
                      '& code': {
                        bgcolor: '#f5f5f5',
                        p: '2px 6px',
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                        fontSize: '0.875em'
                      },
                      '& pre': {
                        bgcolor: '#f5f5f5',
                        p: 1.5,
                        borderRadius: 1,
                        overflow: 'auto',
                        mb: 1
                      },
                      '& strong': { fontWeight: 700 },
                      '& em': { fontStyle: 'italic' },
                      '& u': { textDecoration: 'underline' },
                      '& a': { color: 'primary.main', textDecoration: 'underline' }
                    }}
                    dangerouslySetInnerHTML={{ __html: viewDialog.contato.observacoes }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, contato: null })}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, contato: null })}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Tem certeza que deseja excluir o contato <strong>{deleteDialog.contato?.nome}</strong>?
            Esta ação não pode ser desfeita.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, contato: null })}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </>
  )
}
