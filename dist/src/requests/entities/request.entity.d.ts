import { UserEntity } from '../../users/entities/user.entity';
import { SkillEntity } from '../../skills/entities/skill.entity';
import { RequestStatus } from '../enums/requests.enums';
export declare class RequestEntity {
    id: string;
    createdAt: Date;
    sender: UserEntity;
    receiver: UserEntity;
    status: RequestStatus;
    offeredSkill: SkillEntity;
    requestedSkill: SkillEntity;
    isRead: boolean;
}
