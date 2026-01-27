import axios from 'axios'

// Detectar automaticamente o host e porta da API
const getApiBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Usar o mesmo protocolo e host do frontend (Nginx reverse proxy)
  const protocol = window.location.protocol
  const host = window.location.hostname
  return `${protocol}//${host}`
}

const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('📤 Requisição:', config.method?.toUpperCase(), config.url, 'Data:', config.data);
  return config
})

// Interceptor para redirecionar para login se receber 401
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta:', response.status, response.config.method?.toUpperCase(), response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error.response?.status, error.config?.method?.toUpperCase(), error.config?.url, error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface Telefone {
  id?: number
  numero: string
  tipo: 'CELULAR' | 'FIXO'
}

export interface Endereco {
  id?: number
  apelido?: string
  tipo: 'COMERCIAL' | 'RESIDENCIAL'
  endereco?: string
  bairro?: string
  cidade?: string
  cep?: string
  uf?: string
  pais?: string
  telefones?: Telefone[]
}

export interface Contato {
  id?: number
  nome: string
  cargo?: string
  empresa?: string
  website?: string
  email?: string
  observacoes?: string
  enderecos?: Endereco[]
  createdAt?: string
  updatedAt?: string
}

export const contatosApi = {
  listar: (search?: string) =>
    api.get<Contato[]>('/api/contatos', { params: { search } }),
  
  buscar: (id: number) =>
    api.get<Contato>(`/api/contatos/${id}`),
  
  criar: (data: Contato) =>
    api.post<Contato>('/api/contatos', data),
  
  atualizar: (id: number, data: Contato) =>
    api.patch<Contato>(`/api/contatos/${id}`, data),
  
  excluir: (id: number) =>
    api.delete(`/api/contatos/${id}`),
}

export default api
