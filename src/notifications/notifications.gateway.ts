import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/auth.types';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { NotificationPayload } from './types/notification-payload.type';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly wsJwtGuard: WsJwtGuard) {}

  // Подключаться могут только авторизованные пользователи.
  // Токен приходит в ws://host?token=jwtToken
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.wsJwtGuard.extractToken(client);
      const payload: JwtPayload = await this.wsJwtGuard.verify(token);
      (client.data as { user?: JwtPayload }).user = payload;
      // помещаем пользователя в комнату с его id
      await client.join(payload.sub);
    } catch {
      client.disconnect();
    }
  }

  // Отправка уведомления в личную комнату пользователя
  notifyUser(userId: string, payload: NotificationPayload): void {
    this.server.to(userId).emit('notificateNewRequest', payload);
  }
}
