import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtPayload } from '../auth/auth.types';
import { extractToken } from './guards/ws-jwt.guard';
import { NotificationPayload } from './types/notification-payload.type';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtStrategy: JwtStrategy) {}

  // Подключаться могут только авторизованные пользователи.
  // Токен приходит в ws://host?token=jwtToken
  async handleConnection(client: Socket): Promise<void> {
    const token = extractToken(client);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload: JwtPayload = await this.jwtStrategy.validate(token);
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
