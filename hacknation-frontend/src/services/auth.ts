import type { AccessToken, RefreshToken } from '@/types/ids';
import { AppApiPaths, SuccessOnlyResponse } from '@/types/types';
import apiClient, { type RequestConfig } from './apiClient';

interface PostRefreshTokenResponse {
	accessToken: AccessToken;
	refreshToken: RefreshToken;
}

export async function postRefreshToken(refreshToken: RefreshToken): Promise<{
	accessToken: AccessToken;
	refreshToken: RefreshToken;
}> {
	const res = (await apiClient.post(AppApiPaths.postAppRefreshToken(), {
		refreshToken
	})) as PostRefreshTokenResponse;
	console.log('tokens received from post:', res);

	return res;
}

export interface RegisterDetails {
	email: string;
	password: string;
	nickname: string;
}

export async function postRegister(data: RegisterDetails) {
	const res = (await apiClient.post(
		AppApiPaths.postRegister(),
		data
	)) as PostRefreshTokenResponse;

	return res;
}

export async function postUserLogin(email: string, password: string) {
	const res = (await apiClient.post(AppApiPaths.postLogin(), {
		email,
		password
	})) as PostRefreshTokenResponse;

	return res;
}

export async function deleteMyAccount(token: AccessToken) {
	const config: RequestConfig = {
		token
	};

	const res = (await apiClient.delete(
		AppApiPaths.deleteUser(),
		config
	)) as SuccessOnlyResponse;

	return res;
}
