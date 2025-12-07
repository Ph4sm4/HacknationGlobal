import envConfig from '@/types/envConfig';
import { io } from 'socket.io-client';

export const socket = io(envConfig.websocket.url, {
	autoConnect: false
});

export enum WSResponse {
	domainValidationResult = 'domain-validation-result'
}

export enum WSRequest {}
//
