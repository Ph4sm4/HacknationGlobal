import BaseButton from '@/components/Buttons/BaseButton';
import DomainReportModal from '@/components/Modals/DomainReportModal';
import DomainValidationModal from '@/components/Modals/DomainValidationsModal';
import OfficialDomainList from '@/components/OfficialDomainList/OfficialDomainList';
import { Input } from '@/components/ui/input';
import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi';
import { getQrCodeString } from '@/services/domainProcessor';
import { socket, WSResponse } from '@/services/websocketClient';
import { DomainValidationResult } from '@/types/certs';
import { WebsocketResponse } from '@/types/websocket';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCode } from 'react-qrcode-logo';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

type Props = {};

export default function MainDashboard({}: Props) {
	const { t } = useTranslation();
	const [urlToCheck, setUrlToCheck] = useState<string>('');
	// url that is passed to the qr displayer only after pressing the generate button
	const [processedUrl, setProcessedUrl] = useState<string>('');

	const location = useLocation();
	const { callWithToken } = useAuthenticatedApi();
	const [isValidationResultsModalOpen, setIsValidationResultsModalOpen] =
		useState<boolean>(false);

	const [isDomainReportModalOpen, setIsDomainReportModalOpen] =
		useState<boolean>(false);

	const wsClientId = useRef<string>(undefined);

	const [domainValidationData, setDomainValidationData] =
		useState<DomainValidationResult>();

	useEffect(() => {
		const appBaseUrl = window.location.origin;
		const fullUrl = appBaseUrl + location.pathname;

		setUrlToCheck(fullUrl);
	}, [location]);

	useEffect(() => {
		socket.connect();

		console.log('socket connect event trigger');
		socket.on('connect', () => {
			console.log('Connected', socket.id);
			wsClientId.current = socket.id;
		});

		const handleDomainValidationResult = (
			res: WebsocketResponse<DomainValidationResult>
		) => {
			if (res.code === 400) {
				toast.error(t('errors.localhostNotSupported'));
				return;
			}
			if (res.code === 404) {
				toast.error(t('errors.qrCodeNotFoundOrExpired'));
				return;
			}
			if (res.code === 409) {
				toast.error(t('errors.qrCodeAlreadyUsed'));
				return;
			}
			if (res.code === 410) {
				toast.error(t('errors.qrCodeExpired'));
				return;
			}
			setDomainValidationData(res.data);
			setIsValidationResultsModalOpen(true);
		};

		socket.on(WSResponse.domainValidationResult, handleDomainValidationResult);

		return () => {
			socket.off(
				WSResponse.domainValidationResult,
				handleDomainValidationResult
			);

			socket.disconnect();
		};
	}, [socket]);

	async function generateCodeQR() {
		if (!wsClientId.current) return;

		try {
			const x = await callWithToken(
				getQrCodeString,
				urlToCheck,
				wsClientId.current
			);

			setProcessedUrl(x);
		} catch (err: any) {
			console.error(err);
			toast.error(t('errors.getQrCodeString'));
		}
	}

	return (
		<div className="bg-bg-primary-dark min-h-screen pt-header pb-20 text-white">
			<div className="w-[80%] mx-auto mt-20 flex flex-col">
				<DomainValidationModal
					isOpen={isValidationResultsModalOpen}
					setIsOpen={setIsValidationResultsModalOpen}
					domain={urlToCheck}
					data={domainValidationData}
				/>
				<DomainReportModal
					isOpen={isDomainReportModalOpen}
					setIsOpen={setIsDomainReportModalOpen}
				/>
				<h1 className="text-3xl mb-5">{t('mainDashboard.title')}</h1>
				<div className="flex items-center gap-2">
					<span className="text-primary-blue font-medium">
						{t('mainDashboard.domain')}:
					</span>
					<Input
						value={urlToCheck}
						onChange={(e) => setUrlToCheck(e.target.value)}
					/>
					<BaseButton
						text={t('mainDashboard.reportSite')}
						className="border-yellow-500 text-yellow-500"
						onClick={() => setIsDomainReportModalOpen(true)}
					/>
				</div>
				<div className="w-[90%] h-1 bg-dimmed-blue shadow-base rounded-full shadow-dimmed-blue my-10 mx-auto"></div>

				<BaseButton
					text={t('mainDashboard.generateQR')}
					className="mx-auto"
					onClick={generateCodeQR}
				/>

				{processedUrl && (
					<div className="mx-auto shadow-dimmed-blue shadow-xl mt-5 rounded-lg overflow-hidden">
						<QRCode value={processedUrl} size={200} />
					</div>
				)}

				<div className="mt-20">
					<OfficialDomainList />
				</div>
			</div>
		</div>
	);
}
