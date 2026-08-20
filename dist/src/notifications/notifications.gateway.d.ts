import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { NotificationPayload } from './types/notification-payload.type';
export declare class NotificationsGateway implements OnGatewayConnection {
    private readonly wsJwtGuard;
    server: Server;
    constructor(wsJwtGuard: WsJwtGuard);
    handleConnection(client: Socket): Promise<void>;
    notifyUser(userId: string, payload: NotificationPayload): void;
}
