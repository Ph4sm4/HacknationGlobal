import { useAuth } from '@/contexts/AuthUserContext';
import type { AccessToken } from '@/types/ids';
import { useCallback } from 'react';

export const useAuthenticatedApi = () => {
	const { getAccessToken } = useAuth();

	const callWithToken = useCallback(
		async <T extends any[], R>(
			apiFunction: (token: AccessToken, ...args: T) => Promise<R>,
			...args: T
		): Promise<R> => {
			// const token = await getAccessToken();
			return apiFunction(undefined as unknown as AccessToken, ...args);
		},
		[getAccessToken]
	);

	return { callWithToken };
};
