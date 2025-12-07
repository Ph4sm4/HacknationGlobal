import { AppAccessToken, AppRefreshToken } from 'src/modules/shared/types/ids';

export type UserDetails = {
	id?: string;
	email: string;
	nickname: string;
};

export interface AccessTokenPayload {
	sub: string;
	email: string;
	nickname: string;
}

export interface RefreshTokenPayload {
	sub: string;
}

export interface JWTPayload {
	sub: string;
}

export interface JWTTokensResponse {
	accessToken: AppAccessToken;
	refreshToken: AppRefreshToken;
}
