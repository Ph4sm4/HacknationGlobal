import { cn } from '@/lib/utils';
import { DomainValidationResult } from '@/types/certs';
import { Collapse } from '@mui/material';
import { Angry, ChevronDown, Smile } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from './BaseModal';
import { CertCard } from './components/CertCard';
import { KeyValue } from './components/KeyValue';
import { Section } from './components/ValidationSection';

type Props = {
	domain: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	data: DomainValidationResult | undefined;
};

export default function DomainValidationModal({
	isOpen,
	setIsOpen,
	domain,
	data
}: Props) {
	const { t } = useTranslation();
	const [sslSummaryOpen, setSslSummaryOpen] = useState<boolean>(false);

	const isAiCheckedAsOk =
		data?.aiAnalysis ===
			'Potencjalnie bezpieczna - zalecane ostrożne postępowanie.' ||
		data?.isInOfficialList;
	return (
		<BaseModal
			title={t('mainDashboard.validationModal.title')}
			description={t('mainDashboard.validationModal.description')}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			className="w-[80%] max-h-[70%] overflow-y-auto"
			buttonContinueClassName="mx-auto"
			buttonContinueCustomText={t('mainDashboard.validationModal.common.ok')}
			onDialogSubmit={() => setIsOpen(false)}
			additionalBody={
				<div className="flex flex-col mt-10 text-white">
					<h3 className="mx-auto">
						{t('mainDashboard.validationModal.domainLabel')}:{' '}
						<i className="text-primary-blue">
							<a href={domain} target="_blank">
								{domain}
							</a>
						</i>
					</h3>
					<div
						className={cn(
							`my-6 py-2 px-4 items-center flex gap-4 mx-auto shadow-base shadow-green-700 rounded-lg`,
							`${isAiCheckedAsOk ? 'bg-[#17815191]' : 'bg-[#a2080881]'}`
						)}>
						{isAiCheckedAsOk ? (
							<Smile className="text-green-600" size={26} />
						) : (
							<Angry className="text-red-600" size={26} />
						)}
						<div className="flex items-center gap-3">
							<span>
								{t('mainDashboard.validationModal.aiAnalysisResult')}:
							</span>
							<i className="text-sm font-medium">{data?.aiAnalysis}</i>
						</div>
					</div>
					<div className="flex flex-col gap-10">
						{/* 1. DOMAIN OVERVIEW */}
						<Section
							title={t(
								'mainDashboard.validationModal.sections.domainOverview'
							)}>
							<KeyValue
								label={t(
									'mainDashboard.validationModal.fields.domainIncludesGov'
								)}
								value={data?.domainIncludesGov}
							/>
							<KeyValue
								label={t(
									'mainDashboard.validationModal.fields.isInOfficialList'
								)}
								value={data?.isInOfficialList}
							/>
						</Section>

						{/* 2. SSL SUMMARY */}
						<Section
							titleOnClick={() => setSslSummaryOpen(!sslSummaryOpen)}
							className="cursor-pointer"
							titleIcon={
								<ChevronDown
									className={`${
										sslSummaryOpen ? 'rotate-180' : ''
									} transition-transform duration-300 text-primary-blue`}
								/>
							}
							title={t(
								'mainDashboard.validationModal.sections.sslCertificateSummary'
							)}>
							<Collapse in={sslSummaryOpen}>
								<KeyValue
									label={t('mainDashboard.validationModal.fields.host')}
									value={data?.certificatesData?.host}
								/>
								<KeyValue
									label={t('mainDashboard.validationModal.fields.port')}
									value={data?.certificatesData?.port}
								/>
								<KeyValue
									label={t(
										'mainDashboard.validationModal.fields.overallTimeValid'
									)}
									value={data?.certificatesData?.overallTimeValid}
								/>
								<KeyValue
									label={t('mainDashboard.validationModal.fields.isTrusted')}
									value={data?.certificatesData?.isTrusted}
								/>
								<KeyValue
									label={t('mainDashboard.validationModal.fields.trustError')}
									value={
										data?.certificatesData?.trustError ||
										t('mainDashboard.validationModal.common.none')
									}
								/>
							</Collapse>
						</Section>

						{/* 3. CERTIFICATE CHAIN */}
						<Section
							title={t(
								'mainDashboard.validationModal.sections.certificateChain'
							)}>
							{data?.certificatesData?.certificates.map((cert) => (
								<CertCard key={cert.position} cert={cert} />
							))}
							{data?.certificatesData.certificates.length === 0 && (
								<span className="font-medium">
									{t('mainDashboard.validationModal.noCertificates')}
								</span>
							)}
						</Section>
					</div>
				</div>
			}
		/>
	);
}
