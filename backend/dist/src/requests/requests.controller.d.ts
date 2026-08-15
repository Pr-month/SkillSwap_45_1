import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AuthRequest } from 'src/auth/auth.types';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(createRequestDto: CreateRequestDto, req: AuthRequest): Promise<import("./entities/request.entity").RequestEntity>;
    findIncoming(req: AuthRequest): Promise<import("./entities/request.entity").RequestEntity[]>;
    findOutgoing(req: AuthRequest): Promise<import("./entities/request.entity").RequestEntity[]>;
    findAll(): string;
    findOne(id: string): string;
    markAsRead(id: string, req: AuthRequest): Promise<import("./entities/request.entity").RequestEntity>;
    accept(id: string, req: AuthRequest): Promise<import("./entities/request.entity").RequestEntity>;
    reject(id: string, req: AuthRequest): Promise<import("./entities/request.entity").RequestEntity>;
    remove(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
}
