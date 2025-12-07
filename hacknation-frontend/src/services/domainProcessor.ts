import { DomainData } from '@/components/OfficialDomainList/OfficialDomainList';
import { AccessToken } from '@/types/ids';
import { AppApiPaths } from '@/types/types';
import apiClient, { RequestConfig } from './apiClient';

export async function getQrCodeString(
	token: AccessToken,
	domain: string,
	webclientSocketId: string
) {
	const config: RequestConfig = { token };

	const res = (await apiClient.get(
		AppApiPaths.getQrCodeString(domain, webclientSocketId),
		config
	)) as string;

	return res;
}

export async function getOfficialDomainsList(
	token: AccessToken,
	offset: number
) {
	const config: RequestConfig = { token };

	const res = (await apiClient.get(
		AppApiPaths.getOfficialDomainsList(offset),
		config
	)) as DomainData[];

	return res;
}

export async function getSearchDomainsList(token: AccessToken, name: string) {
	const config: RequestConfig = { token };

	const res = (await apiClient.get(
		AppApiPaths.getSearchDomainsList(name),
		config
	)) as DomainData[];

	return res;
}
