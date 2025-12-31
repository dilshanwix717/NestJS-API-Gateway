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
exports.UserProfileController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const auth_guard_1 = require("../guards/auth/auth.guard");
const create_profile_dto_1 = require("../lib/dto/create-profile.dto");
const update_profile_dto_1 = require("../lib/dto/update-profile.dto");
let UserProfileController = class UserProfileController {
    constructor(userClient) {
        this.userClient = userClient;
    }
    async create(dto) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('user.profile.create', dto));
    }
    async findById(id) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('user.profile.findById', { id }));
    }
    async findByAuthUserId(authUserId) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('user.profile.findByAuthUserId', { authUserId }));
    }
    async update(id, dto) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('user.profile.update', { id, dto }));
    }
    async delete(id) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('user.profile.delete', { id }));
    }
    async findAll(page, limit) {
        return (0, rxjs_1.firstValueFrom)(this.userClient.send('user.profile.findAll', {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
        }));
    }
};
exports.UserProfileController = UserProfileController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_profile_dto_1.CreateProfileDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('auth/:authUserId'),
    __param(0, (0, common_1.Param)('authUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "findByAuthUserId", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "findAll", null);
exports.UserProfileController = UserProfileController = __decorate([
    (0, common_1.Controller)('user/profiles'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Inject)('USER-SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], UserProfileController);
//# sourceMappingURL=user-profile.controller.js.map