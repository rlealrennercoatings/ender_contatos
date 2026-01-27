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
exports.ContatosController = void 0;
const common_1 = require("@nestjs/common");
const contatos_service_1 = require("./contatos.service");
const create_contato_dto_1 = require("./dto/create-contato.dto");
const update_contato_dto_1 = require("./dto/update-contato.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const permissions_decorator_1 = require("../auth/permissions.decorator");
let ContatosController = class ContatosController {
    constructor(contatosService) {
        this.contatosService = contatosService;
    }
    create(createContatoDto) {
        console.log('📝 POST /contatos - Criando novo contato:', createContatoDto.nome);
        return this.contatosService.create(createContatoDto);
    }
    findAll(search) {
        return this.contatosService.findAll(search);
    }
    findOne(id) {
        return this.contatosService.findOne(id);
    }
    update(id, updateContatoDto) {
        return this.contatosService.update(id, updateContatoDto);
    }
    remove(id) {
        return this.contatosService.remove(id);
    }
};
exports.ContatosController = ContatosController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('CREATE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contato_dto_1.CreateContatoDto]),
    __metadata("design:returntype", void 0)
], ContatosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('VIEW'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContatosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('VIEW'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContatosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('EDIT'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_contato_dto_1.UpdateContatoDto]),
    __metadata("design:returntype", void 0)
], ContatosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('DELETE'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContatosController.prototype, "remove", null);
exports.ContatosController = ContatosController = __decorate([
    (0, common_1.Controller)('contatos'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [contatos_service_1.ContatosService])
], ContatosController);
//# sourceMappingURL=contatos.controller.js.map