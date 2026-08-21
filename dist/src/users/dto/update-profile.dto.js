"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const update_user_dto_1 = require("./update-user.dto");
class UpdateProfileDto extends (0, mapped_types_1.OmitType)(update_user_dto_1.UpdateUserDto, [
    'password',
]) {
}
exports.UpdateProfileDto = UpdateProfileDto;
//# sourceMappingURL=update-profile.dto.js.map