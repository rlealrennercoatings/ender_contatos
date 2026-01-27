import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'
import { contatosApi, Contato, Endereco, Telefone } from '../services/api'
import { maskCEP, maskPhone } from '../utils/masks'
import { UFS } from '../utils/ufs'

export default function ContatoForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [editingApelidoIndex, setEditingApelidoIndex] = useState<number | null>(null)
  const [contato, setContato] = useState<Contato>({
    nome: '',
    cargo: '',
    empresa: '',
    website: '',
    email: '',
    observacoes: '',
    enderecos: [
      {
        tipo: 'COMERCIAL',
        endereco: '',
        bairro: '',
        cidade: '',
        cep: '',
        uf: '',
        pais: '',
        telefones: [],
      },
    ],
  })

  useEffect(() => {
    if (isEditing && id) {
      loadContato(parseInt(id))
    }
  }, [id, isEditing])

  const loadContato = async (contatoId: number) => {
    setLoading(true)
    try {
      const response = await contatosApi.buscar(contatoId)
      const contatoData = response.data
      
      // Se não tem endereços, adicionar um vazio para permitir edição
      if (!contatoData.enderecos || contatoData.enderecos.length === 0) {
        contatoData.enderecos = [
          {
            tipo: 'COMERCIAL',
            endereco: '',
            bairro: '',
            cidade: '',
            cep: '',
            uf: '',
            pais: '',
            telefones: [],
          },
        ]
      }
      
      setContato(contatoData)
    } catch (err) {
      setError('Erro ao carregar contato')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleContatoChange = (field: keyof Contato, value: any) => {
    setContato((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEnderecoChange = (
    index: number,
    field: keyof Endereco,
    value: any
  ) => {
    const newEnderecos = [...(contato.enderecos || [])]
    newEnderecos[index] = {
      ...newEnderecos[index],
      [field]: value,
    }
    setContato((prev) => ({
      ...prev,
      enderecos: newEnderecos,
    }))
  }

  const handleTelefoneChange = (
    enderecoIndex: number,
    telefoneIndex: number,
    field: keyof Telefone,
    value: any
  ) => {
    const newEnderecos = [...(contato.enderecos || [])]
    const telefones = [...(newEnderecos[enderecoIndex].telefones || [])]
    // Aplicar máscara se for campo de número
    const finalValue = field === 'numero' ? maskPhone(value) : value
    telefones[telefoneIndex] = {
      ...telefones[telefoneIndex],
      [field]: finalValue,
    }
    newEnderecos[enderecoIndex] = {
      ...newEnderecos[enderecoIndex],
      telefones,
    }
    setContato((prev) => ({
      ...prev,
      enderecos: newEnderecos,
    }))
  }

  const handleAddTelefone = (enderecoIndex: number) => {
    const newEnderecos = [...(contato.enderecos || [])]
    if (!newEnderecos[enderecoIndex].telefones) {
      newEnderecos[enderecoIndex].telefones = []
    }
    newEnderecos[enderecoIndex].telefones!.push({
      numero: '',
      tipo: 'CELULAR',
    })
    setContato((prev) => ({
      ...prev,
      enderecos: newEnderecos,
    }))
  }

  const handleRemoveTelefone = (enderecoIndex: number, telefoneIndex: number) => {
    const newEnderecos = [...(contato.enderecos || [])]
    newEnderecos[enderecoIndex].telefones?.splice(telefoneIndex, 1)
    setContato((prev) => ({
      ...prev,
      enderecos: newEnderecos,
    }))
  }

  const handleAddEndereco = () => {
    setContato((prev) => ({
      ...prev,
      enderecos: [
        ...(prev.enderecos || []),
        {
          apelido: '',
          tipo: 'COMERCIAL',
          endereco: '',
          bairro: '',
          cidade: '',
          cep: '',
          uf: '',
          pais: '',
          telefones: [],
        },
      ],
    }))
  }

  const handleRemoveEndereco = (index: number) => {
    setContato((prev) => ({
      ...prev,
      enderecos: prev.enderecos?.filter((_, i) => i !== index),
    }))
  }

  const handleCEPBlur = async (index: number, cepValue: string) => {
    // Remover máscara para obter apenas números
    const cepLimpo = cepValue.replace(/\D/g, '')
    
    // Validar se tem 8 dígitos
    if (cepLimpo.length !== 8) {
      return
    }

    try {
      // Chamar API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        setError('CEP não encontrado')
        return
      }

      // Preencher os campos automaticamente
      const newEnderecos = [...(contato.enderecos || [])]
      newEnderecos[index] = {
        ...newEnderecos[index],
        endereco: data.logradouro || newEnderecos[index].endereco,
        bairro: data.bairro || newEnderecos[index].bairro,
        cidade: data.localidade || newEnderecos[index].cidade,
        uf: data.uf || newEnderecos[index].uf,
        pais: 'Brasil',
      }
      setContato((prev) => ({
        ...prev,
        enderecos: newEnderecos,
      }))
      setError('') // Limpar erro se houver
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
      setError('Erro ao buscar CEP. Tente novamente.')
    }
  }

  const handleSave = async () => {
    setError('')

    if (!contato.nome.trim()) {
      setError('Nome é obrigatório')
      return
    }

    // Filtrar endereços vazios (deve ter pelo menos um campo preenchido além do tipo)
    const enderecosValidos = (contato.enderecos || []).filter(
      (endereco) =>
        endereco.endereco?.trim() ||
        endereco.bairro?.trim() ||
        endereco.cidade?.trim() ||
        endereco.cep?.trim() ||
        (endereco.telefones && endereco.telefones.length > 0)
    )

    // Remover IDs dos endereços e telefones (eles não devem ser enviados na criação)
    const enderecosParaSalvar = enderecosValidos.map(({ id, ...endereco }) => ({
      ...endereco,
      telefones: (endereco.telefones || [])
        .filter((t) => t.numero?.trim())
        .map(({ id: _, ...t }) => t),
    }))

    const contatoParaSalvar = {
      ...contato,
      enderecos: enderecosParaSalvar.length > 0 ? enderecosParaSalvar : undefined,
    }

    setSaving(true)
    try {
      if (isEditing && id) {
        await contatosApi.atualizar(parseInt(id), contatoParaSalvar)
      } else {
        await contatosApi.criar(contatoParaSalvar)
      }
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erro ao salvar contato'
      setError(errorMessage)
      console.error('Erro ao salvar contato:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton
            size="small"
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            {isEditing ? 'Editar Contato' : 'Novo Contato'}
          </Typography>
        </Box>
        <Box
          display="flex"
          gap={1}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            disabled={saving}
            sx={{ flex: { xs: 1, sm: 'auto' } }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{ flex: { xs: 1, sm: 'auto' } }}
          >
            {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: '12px',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Informações Pessoais
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome *"
              value={contato.nome}
              onChange={(e) => handleContatoChange('nome', e.target.value)}
              error={!contato.nome.trim() && false}
              size="medium"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cargo"
              value={contato.cargo || ''}
              onChange={(e) => handleContatoChange('cargo', e.target.value)}
              size="medium"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Empresa"
              value={contato.empresa || ''}
              onChange={(e) => handleContatoChange('empresa', e.target.value)}
              size="medium"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={contato.email || ''}
              onChange={(e) => handleContatoChange('email', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              value={contato.website || ''}
              onChange={(e) => handleContatoChange('website', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Observações
            </Typography>
            <Box sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.23)', 
              borderRadius: '8px',
              overflow: 'hidden',
              '& .ql-toolbar': {
                borderRadius: '8px 8px 0 0',
              },
              '& .ql-container': {
                fontSize: { xs: '13px', sm: '14px' },
                minHeight: { xs: '150px', sm: '200px' },
              },
              '& .ql-editor': {
                minHeight: { xs: '150px', sm: '200px' },
              }
            }}>
              <ReactQuill 
                value={contato.observacoes || ''} 
                onChange={(content) => handleContatoChange('observacoes', content)}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['link'],
                    ['clean']
                  ]
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Endereços */}
      <Box sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb={2}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1, sm: 0 }}
        >
          <Typography variant="h6">Endereços</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddEndereco}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Adicionar Endereço
          </Button>
        </Box>

        {contato.enderecos?.map((endereco, index) => (
          <Card
            key={index}
            sx={{
              mb: 2,
              borderRadius: '12px',
              backgroundColor: 'background.paper',
            }}
          >
            {editingApelidoIndex === index ? (
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nome/Apelido do Endereço"
                  value={endereco.apelido || ''}
                  onChange={(e) =>
                    handleEnderecoChange(index, 'apelido', e.target.value)
                  }
                  onBlur={() => setEditingApelidoIndex(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setEditingApelidoIndex(null)
                    if (e.key === 'Escape') setEditingApelidoIndex(null)
                  }}
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.25rem',
                      fontWeight: 500,
                    }
                  }}
                />
              </Box>
            ) : (
              <CardHeader
                title={
                  <Box
                    onClick={() => setEditingApelidoIndex(index)}
                    sx={{
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                  >
                    {endereco.apelido ? `${endereco.apelido}` : `Endereço ${index + 1}`}
                  </Box>
                }
                action={
                  contato.enderecos!.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveEndereco(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              />
            )}
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={endereco.tipo}
                      label="Tipo"
                      onChange={(e) =>
                        handleEnderecoChange(
                          index,
                          'tipo',
                          e.target.value as 'COMERCIAL' | 'RESIDENCIAL'
                        )
                      }
                    >
                      <MenuItem value="COMERCIAL">Comercial</MenuItem>
                      <MenuItem value="RESIDENCIAL">Residencial</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="País"
                    value={endereco.pais || ''}
                    onChange={(e) =>
                      handleEnderecoChange(index, 'pais', e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    value={endereco.endereco || ''}
                    onChange={(e) =>
                      handleEnderecoChange(index, 'endereco', e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={endereco.bairro || ''}
                    onChange={(e) =>
                      handleEnderecoChange(index, 'bairro', e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={endereco.cidade || ''}
                    onChange={(e) =>
                      handleEnderecoChange(index, 'cidade', e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>UF</InputLabel>
                    <Select
                      value={endereco.uf || ''}
                      label="UF"
                      onChange={(e) =>
                        handleEnderecoChange(index, 'uf', e.target.value)
                      }
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      {UFS.map((uf) => (
                        <MenuItem key={uf} value={uf}>
                          {uf}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={endereco.cep || ''}
                    onChange={(e) =>
                      handleEnderecoChange(
                        index,
                        'cep',
                        maskCEP(e.target.value)
                      )
                    }
                    onBlur={(e) => handleCEPBlur(index, e.target.value)}
                    placeholder="00.000-000"
                  />
                </Grid>

                {/* Telefones */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2">Telefones</Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddTelefone(index)}
                    >
                      Adicionar
                    </Button>
                  </Box>

                  {(endereco.telefones || []).map((telefone, telIndex) => (
                    <Grid container spacing={1} key={telIndex} sx={{ mb: 1 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Número"
                          placeholder="(11) 99999-9999"
                          size="small"
                          value={telefone.numero || ''}
                          onChange={(e) =>
                            handleTelefoneChange(
                              index,
                              telIndex,
                              'numero',
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={10} sm={5}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Tipo</InputLabel>
                          <Select
                            value={telefone.tipo || 'CELULAR'}
                            label="Tipo"
                            onChange={(e) =>
                              handleTelefoneChange(
                                index,
                                telIndex,
                                'tipo',
                                e.target.value as 'CELULAR' | 'FIXO'
                              )
                            }
                          >
                            <MenuItem value="CELULAR">Celular</MenuItem>
                            <MenuItem value="FIXO">Fixo</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2} sm={1} display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveTelefone(index, telIndex)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Botões de Ação */}
      <Box display="flex" gap={2} mt={4}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
        </Button>
      </Box>

      {/* Snackbar de Sucesso */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {isEditing ? '✅ Contato atualizado com sucesso!' : '✅ Contato criado com sucesso!'}
        </Alert>
      </Snackbar>
    </Box>
  )
}
