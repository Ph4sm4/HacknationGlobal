import { useAuth } from '@/contexts/AuthUserContext';
import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi';
import { AppRoutePaths } from '@/types/types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BaseDropdown } from '../Dropdowns/BaseDropdown';
import GovCheckLogo from '../icons/AppLogo/GovCheckLogo';

export default function Header() {
	const { getUser, resetAuth } = useAuth();
	const user = getUser();
	const { callWithToken } = useAuthenticatedApi();

	const { t } = useTranslation();

	return (
		<>
			<header className="fixed top-0 z-100 w-full opacity-90 bg-bg-darker text-white text-lg">
				<div className="flex items-center h-[100px] px-10 py-5 gap-10 relative">
					<BaseDropdown
						trigger={
							<div className="flex items-center gap-5 mr-auto cursor-pointer logo-holder">
								<span>{user?.nickname}</span>
							</div>
						}
						contentClassName="w-46"
						items={[
							{
								label: t('header.yourAccount'),
								className: 'pointer-events-none'
							},
							{ separator: true },

							{
								label: t('header.logout'),
								onClick: resetAuth,
								className: 'dropdown-item'
							}
						]}
					/>

					<Link to={AppRoutePaths.mainDashboard()} className="contents">
						<GovCheckLogo className="absolute left-1/2 translate-y-[-50%] top-1/2 translate-x-[-50%]" />
					</Link>
					<div className="hoverable-text">{t('header.guidelines')}</div>
					<div className="hoverable-text">{t('header.reportsPage')}</div>
					<Link to={AppRoutePaths.mainDashboard()}>
						<div className="hoverable-text">{t('header.mainDashboard')}</div>
					</Link>
				</div>
			</header>
		</>
	);
}
