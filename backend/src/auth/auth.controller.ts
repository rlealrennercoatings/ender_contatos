import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
  Res,
  Query,
} from '@nestjs/common'
import { Response } from 'express'
import axios from 'axios'
import { AuthService } from './auth.service'
import { TokenService } from './token.service'
import { JwtGuard } from './jwt.guard'
import { jwtDecode } from 'jwt-decode'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  // Redireciona o usuário para login no Azure AD
  @Get('login')
  async login(@Res() res: Response) {
    const tenantId = process.env.AZURE_TENANT_ID
    const clientId = process.env.AZURE_CLIENT_ID
    const redirectUri = encodeURIComponent(process.env.AZURE_REDIRECT_URI)
    const scope = encodeURIComponent('openid profile email https://graph.microsoft.com/.default')
    const responseType = 'code'

    // Parâmetro claims solicita que os grupos sejam incluídos no ID token
    const claims = encodeURIComponent(JSON.stringify({
      "id_token": {
        "groups": null
      }
    }))

    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}&response_mode=query&claims=${claims}`

    res.redirect(authUrl)
  }

  // Callback do Azure AD - processa o código de autorização
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
    @Request() req: any,
  ) {
    // Detectar o frontend host usando headers do Nginx reverse proxy
    const proto = req.get('x-forwarded-proto') || req.protocol || 'https'
    const host = req.get('x-forwarded-host') || req.get('host') || 'localhost'
    const frontendHost = `${proto}://${host}`

    if (error) {
      console.error('Erro do Azure AD:', error)
      res.redirect(`${frontendHost}/login?error=${error}`)
      return
    }

    if (!code) {
      console.error('Código de autorização não recebido')
      res.redirect(`${frontendHost}/login?error=no_code`)
      return
    }

    try {
      console.log('[AUTH] Recebido callback com código:', code.substring(0, 20) + '...')

      // Trocar código por tokens
      const tokenResponse = await this.exchangeCodeForToken(code)
      console.log('[AUTH] Tokens recebidos do Azure AD')

      const idToken = tokenResponse.id_token
      const accessToken = tokenResponse.access_token

      // Decodificar o ID token
      const decodedToken: any = jwtDecode(idToken)
      console.log('[AUTH] Token decodificado:', {
        email: decodedToken.email,
        name: decodedToken.name,
        groups: decodedToken.groups,
      })

      // Tentar obter grupos de várias formas
      let userGroups: string[] = decodedToken.groups || []
      
      // Se não houver grupos no ID token, tentar via Graph API
      if (userGroups.length === 0 && accessToken) {
        try {
          console.log('[AUTH] Tentando obter grupos via Microsoft Graph API...')
          userGroups = await this.getUserGroups(accessToken)
          console.log('[AUTH] Grupos obtidos do Microsoft Graph:', userGroups)
        } catch (error) {
          console.warn('[AUTH] Aviso ao obter grupos via Graph:', error.message)
          // Tenta como fallback obter do access token decodificado
          const decodedAccessToken: any = jwtDecode(accessToken)
          userGroups = decodedAccessToken.groups || []
          if (userGroups.length > 0) {
            console.log('[AUTH] Grupos obtidos do Access Token:', userGroups)
          }
        }
      }

      // Validar usuário
      const user = this.authService.validateUser({
        oid: decodedToken.oid || decodedToken.sub,
        email: decodedToken.email || decodedToken.preferred_username,
        name: decodedToken.name || decodedToken.given_name,
        groups: userGroups,
      })

      console.log('[AUTH] Usuário validado:', { email: user.email, groups: user.groups })

      // Gerar JWT para a aplicação
      const appToken = this.tokenService.generateToken(user)
      console.log('[AUTH] JWT gerado com sucesso')

      // Redirecionar para o frontend com o token
      const redirectUrl = `${frontendHost}/auth-callback?token=${appToken}`
      console.log('[AUTH] Redirecionando para:', redirectUrl)
      res.redirect(redirectUrl)
    } catch (error) {
      console.error('[AUTH] Erro no callback:', error.message)
      res.redirect(`${frontendHost}/login?error=authentication_failed`)
    }
  }

  // Endpoint para autenticação manual (teste)
  @Post('login-manual')
  async loginManual(@Body() body: { email: string; groups: string[] }) {
    if (!body.email) {
      throw new UnauthorizedException('Email é obrigatório')
    }

    const user = this.authService.validateUser({
      oid: body.email.replace('@', '-').replace('.', '-'),
      email: body.email,
      name: body.email.split('@')[0],
      groups: body.groups || ['ENDER_LEITORES'],
    })

    const token = this.tokenService.generateToken(user)

    return {
      token,
      user: {
        oid: user.oid,
        email: user.email,
        name: user.name,
        groups: user.groups,
      },
    }
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getProfile(@Request() req) {
    return req.user
  }

  @Post('logout')
  logout() {
    return { message: 'Desconectado com sucesso' }
  }

  // Helper para obter grupos do usuário via Microsoft Graph API
  private async getUserGroups(accessToken: string): Promise<string[]> {
    try {
      console.log('[AUTH] Obtendo IDs de grupos do usuário via Microsoft Graph...')
      
      // Endpoint que retorna apenas os IDs dos grupos, sem requer permissões complexas
      const response = await axios.get(
        'https://graph.microsoft.com/v1.0/me/memberOf/microsoft.graph.group?$select=id',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      console.log('[AUTH] Resposta do Microsoft Graph (IDs):', JSON.stringify(response.data, null, 2))

      // Se conseguiu os IDs, temos que mapear para nomes
      // Mas isso requer mais permissões, então vamos tentar um workaround
      // Vamos apenas verificar se temos alguns IDs
      const groupIds: string[] = []
      if (response.data && response.data.value && response.data.value.length > 0) {
        for (const item of response.data.value) {
          if (item.id) {
            groupIds.push(item.id)
          }
        }
      }

      console.log('[AUTH] IDs de grupos encontrados:', groupIds)
      
      // Verificar contra os IDs conhecidos do .env
      const groups: string[] = []
      const adminGroupId = process.env.ADMIN_GROUP_ID
      const editorGroupId = process.env.EDITOR_GROUP_ID
      const readerGroupId = process.env.READER_GROUP_ID

      if (adminGroupId && groupIds.includes(adminGroupId)) {
        groups.push('ENDER_ADMINISTRADORES')
        console.log('[AUTH] ✓ Usuário é ADMINISTRADOR')
      }
      if (editorGroupId && groupIds.includes(editorGroupId)) {
        groups.push('ENDER_EDITORES')
        console.log('[AUTH] ✓ Usuário é EDITOR')
      }
      if (readerGroupId && groupIds.includes(readerGroupId)) {
        groups.push('ENDER_LEITORES')
        console.log('[AUTH] ✓ Usuário é LEITOR')
      }

      console.log('[AUTH] Grupos encontrados:', groups)
      return groups
    } catch (error) {
      console.error('[AUTH] Erro ao obter grupos:', error.response?.data || error.message)
      // Retorna array vazio ao invés de lançar erro para não quebrar o fluxo
      return []
    }
  }

  // Helper para trocar o código de autorização por tokens
  private async exchangeCodeForToken(code: string) {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`

    console.log('[AUTH] Trocando código por token em:', tokenUrl)

    try {
      const response = await axios.post(
        tokenUrl,
        {
          client_id: process.env.AZURE_CLIENT_ID,
          client_secret: process.env.AZURE_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.AZURE_REDIRECT_URI,
          grant_type: 'authorization_code',
          scope: 'openid profile email https://graph.microsoft.com/.default',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('[AUTH] Erro ao trocar código por token:', error.response?.data || error.message)
      throw error
    }
  }
}
