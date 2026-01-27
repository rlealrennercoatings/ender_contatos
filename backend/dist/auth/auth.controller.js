"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const auth_service_1 = require("./auth.service");
const token_service_1 = require("./token.service");
const jwt_guard_1 = require("./jwt.guard");
const jwt_decode_1 = require("jwt-decode");
let AuthController = class AuthController {
    constructor(authService, tokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }
    async login(res) {
        const tenantId = process.env.AZURE_TENANT_ID;
        const clientId = process.env.AZURE_CLIENT_ID;
        const redirectUri = encodeURIComponent(process.env.AZURE_REDIRECT_URI);
        const scope = encodeURIComponent('openid profile email https://graph.microsoft.com/.default');
        const responseType = 'code';
        const claims = encodeURIComponent(JSON.stringify({
            "id_token": {
                "groups": null
            }
        }));
        const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}&response_mode=query&claims=${claims}`;
        res.redirect(authUrl);
    }
    async callback(code, error, res, req) {
        const proto = req.get('x-forwarded-proto') || req.protocol || 'https';
        const host = req.get('x-forwarded-host') || req.get('host') || 'localhost';
        const frontendHost = `${proto}://${host}`;
        if (error) {
            console.error('Erro do Azure AD:', error);
            res.redirect(`${frontendHost}/login?error=${error}`);
            return;
        }
        if (!code) {
            console.error('Código de autorização não recebido');
            res.redirect(`${frontendHost}/login?error=no_code`);
            return;
        }
        try {
            console.log('[AUTH] Recebido callback com código:', code.substring(0, 20) + '...');
            const tokenResponse = await this.exchangeCodeForToken(code);
            console.log('[AUTH] Tokens recebidos do Azure AD');
            const idToken = tokenResponse.id_token;
            const accessToken = tokenResponse.access_token;
            const decodedToken = (0, jwt_decode_1.jwtDecode)(idToken);
            console.log('[AUTH] Token decodificado:', {
                email: decodedToken.email,
                name: decodedToken.name,
                groups: decodedToken.groups,
            });
            let userGroups = decodedToken.groups || [];
            if (userGroups.length === 0 && accessToken) {
                try {
                    console.log('[AUTH] Tentando obter grupos via Microsoft Graph API...');
                    userGroups = await this.getUserGroups(accessToken);
                    console.log('[AUTH] Grupos obtidos do Microsoft Graph:', userGroups);
                }
                catch (error) {
                    console.warn('[AUTH] Aviso ao obter grupos via Graph:', error.message);
                    const decodedAccessToken = (0, jwt_decode_1.jwtDecode)(accessToken);
                    userGroups = decodedAccessToken.groups || [];
                    if (userGroups.length > 0) {
                        console.log('[AUTH] Grupos obtidos do Access Token:', userGroups);
                    }
                }
            }
            const user = this.authService.validateUser({
                oid: decodedToken.oid || decodedToken.sub,
                email: decodedToken.email || decodedToken.preferred_username,
                name: decodedToken.name || decodedToken.given_name,
                groups: userGroups,
            });
            console.log('[AUTH] Usuário validado:', { email: user.email, groups: user.groups });
            const appToken = this.tokenService.generateToken(user);
            console.log('[AUTH] JWT gerado com sucesso');
            const redirectUrl = `${frontendHost}/auth-callback?token=${appToken}`;
            console.log('[AUTH] Redirecionando para:', redirectUrl);
            res.redirect(redirectUrl);
        }
        catch (error) {
            console.error('[AUTH] Erro no callback:', error.message);
            res.redirect(`${frontendHost}/login?error=authentication_failed`);
        }
    }
    async loginManual(body) {
        if (!body.email) {
            throw new common_1.UnauthorizedException('Email é obrigatório');
        }
        const user = this.authService.validateUser({
            oid: body.email.replace('@', '-').replace('.', '-'),
            email: body.email,
            name: body.email.split('@')[0],
            groups: body.groups || ['ENDER_LEITORES'],
        });
        const token = this.tokenService.generateToken(user);
        return {
            token,
            user: {
                oid: user.oid,
                email: user.email,
                name: user.name,
                groups: user.groups,
            },
        };
    }
    getProfile(req) {
        return req.user;
    }
    logout() {
        return { message: 'Desconectado com sucesso' };
    }
    async getUserGroups(accessToken) {
        try {
            console.log('[AUTH] Obtendo IDs de grupos do usuário via Microsoft Graph...');
            const response = await axios_1.default.get('https://graph.microsoft.com/v1.0/me/memberOf/microsoft.graph.group?$select=id', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('[AUTH] Resposta do Microsoft Graph (IDs):', JSON.stringify(response.data, null, 2));
            const groupIds = [];
            if (response.data && response.data.value && response.data.value.length > 0) {
                for (const item of response.data.value) {
                    if (item.id) {
                        groupIds.push(item.id);
                    }
                }
            }
            console.log('[AUTH] IDs de grupos encontrados:', groupIds);
            const groups = [];
            const adminGroupId = process.env.ADMIN_GROUP_ID;
            const editorGroupId = process.env.EDITOR_GROUP_ID;
            const readerGroupId = process.env.READER_GROUP_ID;
            if (adminGroupId && groupIds.includes(adminGroupId)) {
                groups.push('ENDER_ADMINISTRADORES');
                console.log('[AUTH] ✓ Usuário é ADMINISTRADOR');
            }
            if (editorGroupId && groupIds.includes(editorGroupId)) {
                groups.push('ENDER_EDITORES');
                console.log('[AUTH] ✓ Usuário é EDITOR');
            }
            if (readerGroupId && groupIds.includes(readerGroupId)) {
                groups.push('ENDER_LEITORES');
                console.log('[AUTH] ✓ Usuário é LEITOR');
            }
            console.log('[AUTH] Grupos encontrados:', groups);
            return groups;
        }
        catch (error) {
            console.error('[AUTH] Erro ao obter grupos:', error.response?.data || error.message);
            return [];
        }
    }
    async exchangeCodeForToken(code) {
        const tokenUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
        console.log('[AUTH] Trocando código por token em:', tokenUrl);
        try {
            const response = await axios_1.default.post(tokenUrl, {
                client_id: process.env.AZURE_CLIENT_ID,
                client_secret: process.env.AZURE_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.AZURE_REDIRECT_URI,
                grant_type: 'authorization_code',
                scope: 'openid profile email https://graph.microsoft.com/.default',
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('[AUTH] Erro ao trocar código por token:', error.response?.data || error.message);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('error')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
__decorate([
    (0, common_1.Post)('login-manual'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginManual", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        token_service_1.TokenService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map