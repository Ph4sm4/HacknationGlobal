import { Check } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from './BaseModal';

type Props = {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DomainReportModal({ isOpen, setIsOpen }: Props) {
	const { t } = useTranslation();

	return (
		<BaseModal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			title={t('mainDashboard.domainReportModal.title')}
			additionalBody={
				<>
					<Check size={50} className="text-green-500 mx-auto" />
				</>
			}
			onDialogSubmit={() => setIsOpen(false)}
			description={t('mainDashboard.domainReportModal.description')}
		/>
	);
}
