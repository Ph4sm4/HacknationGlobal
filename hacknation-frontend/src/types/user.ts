export type AppUser = {
	id?: string;
	email: string;
	nickname: string;
};

export interface AccessTokenPayload {
	sub: string;
	email: string;
	nickname: string;
	exp: number;
}
