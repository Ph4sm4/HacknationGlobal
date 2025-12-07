import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi';
import { cn } from '@/lib/utils';
import {
	getOfficialDomainsList,
	getSearchDomainsList
} from '@/services/domainProcessor';
import { Helpers } from '@/utils/helpers';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseButton from '../Buttons/BaseButton';
import { Input } from '../ui/input';

export type DomainData = {
	id: string;
	name: string;
};

export default function OfficialDomainList() {
	const [domains, setDomains] = useState<DomainData[]>([]);
	const [mappedDomains, setMappedDomains] = useState<DomainData[]>([]);

	const [search, setSearch] = useState<string>();
	const [isLoading, setIsLoading] = useState(false);
	const { t } = useTranslation();
	const SEARCH_DEBOUNCE_MS = 500;
	const searchDebounceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
	const { callWithToken } = useAuthenticatedApi();

	const [baseOffset, setBaseOffset] = useState<number>(0);

	useEffect(() => {
		if (search === undefined) return;

		Helpers.debounce(
			async () => {
				if (!search.length) {
					setMappedDomains(domains);
					return;
				}

				setIsLoading(true);

				const res = await callWithToken(getSearchDomainsList, search);
				setMappedDomains(res);

				setIsLoading(false);
			},
			SEARCH_DEBOUNCE_MS,
			searchDebounceTimeout
		)();
	}, [search]);

	useEffect(() => {
		setMappedDomains(domains);
	}, [domains]);

	useEffect(() => {
		initDomains();
	}, [baseOffset]);

	async function initDomains() {
		setIsLoading(true);

		const dms = await callWithToken(getOfficialDomainsList, baseOffset);
		setDomains([...domains, ...dms]);

		setIsLoading(false);
	}

	return (
		<div className="flex flex-col gap-5">
			<Input
				placeholder={t('mainDashboard.officialDomainList.searchPlaceholder')}
				value={search || ''}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<div
				className={cn(
					`max-h-[50vh] overflow-y-auto shadow-base shadow-dimmed-blue border border-gray-500`,
					`rounded-lg px-10 py-3 w-1/2 mx-auto flex flex-col`
				)}>
				{isLoading ? (
					<span className="mx-auto text-xl">
						{t('mainDashboard.officialDomainList.loading')}
					</span>
				) : (
					mappedDomains.map((d, ind) => {
						return (
							<div
								className="w-full flex items-center gap-5 justify-between border-b"
								key={d.id + ind}>
								<span>{ind + 1}</span>
								<span>{d.name}</span>
							</div>
						);
					})
				)}

				<BaseButton
					text={t('mainDashboard.officialDomainList.loadMore')}
					onClick={() => setBaseOffset((prev) => prev + 100)}
					className="mx-auto mt-5"
				/>
			</div>
		</div>
	);
}
