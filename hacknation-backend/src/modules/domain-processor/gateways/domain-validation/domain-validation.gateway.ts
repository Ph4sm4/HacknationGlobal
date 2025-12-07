// chat.gateway.ts
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway
} from '@nestjs/websockets';
import 'dotenv/config';
import { Server, Socket } from 'socket.io';

const corsOrigin = process.env.FRONT_APP_URL || '*';

@WebSocketGateway({
	cors: {
		origin: corsOrigin
	}
})
export class DomainValidationGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	server: Server;

	afterInit(server: Server) {
		this.server = server;
		console.log('WebSocket server initialized', corsOrigin);
	}

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	// @SubscribeMessage('message')
	// handleMessage(
	// 	@MessageBody() payload: any,
	// 	@ConnectedSocket() client: Socket
	// ) {
	// 	console.log('Received message:', payload);

	// 	client.emit('message', { msg: 'Message received', data: payload });

	// 	client.broadcast.emit('message', { msg: 'New message', data: payload });
	// }
}
