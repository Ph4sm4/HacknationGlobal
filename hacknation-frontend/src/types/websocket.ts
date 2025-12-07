export interface WebsocketResponse<T = any> {
	data: T;
	code: number;
}
