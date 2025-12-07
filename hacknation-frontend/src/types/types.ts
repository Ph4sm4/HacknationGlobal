export const AppRoutePaths = {
	// auth
	loginPage: () => '/login',
	register: () => `/register`,
	mainDashboard: () => '/'
};

export const AppApiPaths = {
	// auth
	deleteUser: () => `auth/me`,
	postAppRefreshToken: () => `auth/refresh-token`,
	postLogin: () => `auth/login`,
	postRegister: () => `auth/register`,

	getQrCodeString: (domain: string, webclientSocketId: string) =>
		`domains/qr-code-string?domain=${domain}&webclientSocketId=${webclientSocketId}`,

	getOfficialDomainsList: (offset: number) => `domains/list?offset=${offset}`,
	getSearchDomainsList: (name: string) => `domains/list/custom?name=${name}`
};

export const SEARCH_DEBOUNCE_MS = 500;

export interface SuccessOnlyResponse {
	success: boolean;
}

export interface ApiError {
	message: string;
	error: string;
	statusCode: number;
}
