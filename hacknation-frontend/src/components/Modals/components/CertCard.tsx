import { CertificateInfo } from '@/types/certs';
import { Collapse } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyValue } from './KeyValue';
import { Section } from './ValidationSection';

interface CertCardProps {
	cert: CertificateInfo;
}

export const CertCard: React.FC<CertCardProps> = ({ cert }) => {
	const { t } = useTranslation();

	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<div className="border border-dimmed-blue shadow-base shadow-dimmed-blue rounded-xl p-4 flex flex-col gap-4 mb-5">
			<h6
				className="font-semibold text-base cursor-pointer flex items-center"
				onClick={() => setExpanded(!expanded)}>
				<span>
					{t('mainDashboard.validationModal.certificates.certificate')} #
					{cert.position + 1}{' '}
					{cert.isCA
						? `(${t('mainDashboard.validationModal.certificates.ca')})`
						: ''}
				</span>
				<ChevronDown
					className={`text-primary-blue ml-auto transition-transform duration-300 ${
						expanded ? 'rotate-180' : ''
					}`}
				/>
			</h6>

			<Collapse in={expanded}>
				<Section title={t('mainDashboard.validationModal.sections.subject')}>
					<pre className="text-xs p-2 rounded">
						{JSON.stringify(cert.subject, null, 2)}
					</pre>
				</Section>

				<Section title={t('mainDashboard.validationModal.sections.issuer')}>
					<pre className="text-xs p-2 rounded">
						{JSON.stringify(cert.issuer, null, 2)}
					</pre>
				</Section>

				<Section title={t('mainDashboard.validationModal.sections.validity')}>
					<KeyValue
						label={t('mainDashboard.validationModal.fields.validFrom')}
						value={cert.validFrom}
					/>
					<KeyValue
						label={t('mainDashboard.validationModal.fields.validTo')}
						value={cert.validTo}
					/>
					<KeyValue
						label={t('mainDashboard.validationModal.fields.isTimeValid')}
						value={cert.isTimeValid}
					/>
				</Section>

				<Section
					title={t('mainDashboard.validationModal.sections.additionalInfo')}
					className="mt-5 mb-10">
					{cert.subjectAltName && (
						<KeyValue
							label={t('mainDashboard.validationModal.fields.subjectAltName')}
							value={cert.subjectAltName}
						/>
					)}
					{cert.fingerprint && (
						<KeyValue
							label={t('mainDashboard.validationModal.fields.fingerprint')}
							value={cert.fingerprint}
						/>
					)}
				</Section>
			</Collapse>
		</div>
	);
};
