import { postRefreshToken } from '@/services/auth';
import type { AccessToken, RefreshToken } from '@/types/ids';
import { AccessTokenPayload, AppUser } from '@/types/user';
import { Helpers } from '@/utils/helpers';
import { jwtDecode } from 'jwt-decode';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type Dispatch,
	type SetStateAction
} from 'react';

export interface AuthState {
	accessToken: AccessToken | null;
	refreshToken: RefreshToken | null;
	expiresIn: number | null;
	user: AppUser | null;
	isLoading: boolean;
}

const initialAuthState: AuthState = {
	accessToken: null,
	refreshToken: null,
	expiresIn: null,
	user: null,
	isLoading: true
};

export interface AuthContextValue {
	auth: AuthState;
	setAuth: Dispatch<SetStateAction<AuthState>>;
	resetAuth: () => void;
	setAuthTokens: (accessToken: AccessToken, refreshToken: RefreshToken) => void;
	getAccessToken: () => Promise<AccessToken>;
	getUser: () => AppUser | null;
	issueNewTokens: () => Promise<void>;
}

/** in seconds */
const REFRESH_TOKEN_TIME_BUFFER = 120;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
	children: React.ReactNode;
};

function decodeUserFromToken(token?: AccessToken): {
	user: AppUser;
	exp: number;
} | null {
	if (!token) return null;

	const decoded: AccessTokenPayload = jwtDecode(token);

	return {
		user: {
			id: decoded.sub,
			email: decoded.email,
			nickname: decoded.nickname
		},
		exp: decoded.exp
	};
}

export default function AuthUserContext({ children }: Props) {
	const [auth, setAuth] = useState<AuthState>(initialAuthState);

	async function refreshAccessToken(): Promise<{
		refreshToken: RefreshToken;
		accessToken: AccessToken;
	}> {
		if (!auth.refreshToken) {
			throw new Error('refresh token not found');
		}

		const res = await postRefreshToken(auth.refreshToken);

		return res;
	}

	async function getAccessToken(): Promise<AccessToken> {
		if (!auth.accessToken || !auth.refreshToken) {
			throw new Error('Access token not found');
		}

		try {
			if (isRefreshTokenExpiring()) {
				console.log('issuing refresh');
				const { accessToken, refreshToken } = await refreshAccessToken();
				console.log('new tokens received');

				setAuthTokens(accessToken, refreshToken);

				return accessToken;
			} else {
				return auth.accessToken;
			}
		} catch (err: any) {
			resetAuth();
			throw new Error('failed to refresh access token:', err);
		}
	}

	function isRefreshTokenExpiring(): boolean {
		if (!auth.expiresIn) return true;

		return (
			auth.expiresIn <=
			Helpers.getCurrentTimeInSeconds() + REFRESH_TOKEN_TIME_BUFFER
		);
	}

	function resetAuth() {
		setAuth({ ...initialAuthState, isLoading: false });

		localStorage.removeItem('refreshToken');
		localStorage.removeItem('accessToken');
	}

	function getUser() {
		return auth.user;
	}

	function setAuthTokens(accessToken: AccessToken, refreshToken: RefreshToken) {
		const userTokenData = decodeUserFromToken(accessToken);
		if (!userTokenData?.user)
			throw new Error('unable to set auth, invalid access token');

		setAuth({
			user: userTokenData.user,
			accessToken: accessToken,
			refreshToken: refreshToken,
			expiresIn: userTokenData.exp,
			isLoading: false
		});
		localStorage.setItem('refreshToken', refreshToken);
		localStorage.setItem('accessToken', accessToken);
	}

	async function issueNewTokens() {
		const { accessToken, refreshToken } = await refreshAccessToken();

		setAuthTokens(accessToken, refreshToken);
	}

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken') as AccessToken;
		const refreshToken = localStorage.getItem('refreshToken') as RefreshToken;
		const tokenData = decodeUserFromToken(accessToken);

		setAuth({
			accessToken,
			refreshToken,
			user: tokenData?.user ?? null,
			expiresIn: tokenData?.exp ?? null,
			isLoading: false
		});
	}, []);

	useEffect(() => {
		if (
			auth.refreshToken !== initialAuthState.refreshToken &&
			auth.refreshToken !== null
		) {
			localStorage.setItem('refreshToken', auth.refreshToken);
		}
	}, [auth.refreshToken]);

	useEffect(() => {
		if (
			auth.accessToken !== initialAuthState.accessToken &&
			auth.accessToken !== null
		) {
			localStorage.setItem('accessToken', auth.accessToken);
		}
	}, [auth.accessToken]);

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				setAuthTokens,
				resetAuth,
				getAccessToken,
				getUser,
				issueNewTokens
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = (): AuthContextValue => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');

	return context;
};
