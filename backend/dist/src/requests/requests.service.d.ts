import { CreateRequestDto } from './dto/create-request.dto';
import { RequestEntity } from './entities/request.entity';
import { SkillEntity } from '../skills/entities/skill.entity';
import { Repository } from 'typeorm';
import { SkillsService } from 'src/skills/skills.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { UserRole } from '../users/enums/users.enums';
export declare class RequestsService {
    private readonly requestsRepository;
    private skillsService;
    private readonly skillsRepository;
    private readonly notificationsGateway;
    constructor(requestsRepository: Repository<RequestEntity>, skillsService: SkillsService, skillsRepository: Repository<SkillEntity>, notificationsGateway: NotificationsGateway);
    create(createRequestDto: CreateRequestDto, senderId: string): Promise<RequestEntity>;
    findIncoming(userId: string): Promise<RequestEntity[]>;
    findOutgoing(userId: string): Promise<RequestEntity[]>;
    findAll(): string;
    findOne(id: string): string;
    markAsRead(requestId: string, currentUserId: string): Promise<RequestEntity>;
    accept(requestId: string, currentUserId: string): Promise<RequestEntity>;
    reject(requestId: string, currentUserId: string): Promise<RequestEntity>;
    private findRequestOrFail;
    private ensureReceiver;
    private ensurePending;
    private exchangeSkills;
    remove(requestId: string, currentUserId: string, currentUserRole: UserRole): Promise<{
        message: string;
    }>;
}
