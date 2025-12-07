import BaseButton from '@/components/Buttons/BaseButton';
import GovCheckLogo from '@/components/icons/AppLogo/GovCheckLogo';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthUserContext';
import { postRegister } from '@/services/auth';
import { AppRoutePaths } from '@/types/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Register() {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<{
		email: string;
		nickname: string;
		password: string;
		confirmPassword: string;
	}>({ email: '', password: '', nickname: '', confirmPassword: '' });

	const [isPassVisible, setIsPassVisible] = useState<boolean>(false);
	const [isConfirmPassVisible, setIsConfirmPassVisible] =
		useState<boolean>(false);

	const navigate = useNavigate();
	const { setAuthTokens } = useAuth();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	}

	async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		console.log(formData);

		try {
			const res = await postRegister({
				email: formData.email,
				nickname: formData.nickname,
				password: formData.password
			});

			setAuthTokens(res.accessToken, res.refreshToken);

			navigate(AppRoutePaths.mainDashboard());
		} catch (err: any) {
			console.error(err);
			toast.error(t('errors.invalidRegisterAttempt'));
		}
	}

	return (
		<div className="bg-bg-primary-dark h-screen">
			<div className="w-[600px] rounded-lg login-holder py-10 border border-gray-500 text-white">
				<div className="flex flex-col">
					<div className="flex flex-col items-center">
						<GovCheckLogo className="h-32" />
						<h1 className="tracking-wide text-3xl font-medium mt-5">
							{t('login.welcome')}
						</h1>
						<span>{t('register.registerToApp')}</span>
					</div>
					<div className="bg-gray-500 w-[90%] mx-auto h-[2px] my-10" />

					<form onSubmit={handleRegister} className="contents">
						<div className="flex flex-col gap-8 w-[80%] mx-auto">
							<div className="flex flex-col gap-1">
								<label>{t('login.email')}</label>
								<Input
									value={formData.email}
									onChange={handleChange}
									name="email"
									autoComplete="email"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label>{t('register.nickname')}</label>
								<Input
									value={formData.nickname}
									onChange={handleChange}
									name="nickname"
									autoComplete="email"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label>{t('login.password')}</label>
								<Input
									value={formData.password}
									type={isPassVisible ? 'text' : 'password'}
									onChange={handleChange}
									name="password"
									password={{
										passwordVisible: isPassVisible,
										setPasswordVisible: setIsPassVisible
									}}
									autoComplete="current-password"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label>{t('register.confirmPassword')}</label>
								<Input
									value={formData.confirmPassword}
									type={isConfirmPassVisible ? 'text' : 'password'}
									onChange={handleChange}
									name="confirmPassword"
									password={{
										passwordVisible: isConfirmPassVisible,
										setPasswordVisible: setIsConfirmPassVisible
									}}
									autoComplete="current-password"
								/>
							</div>
						</div>

						<div className="flex flex-col items-center gap-5 mt-15">
							<BaseButton type="submit">{t('register.register')}</BaseButton>
							<span className="text-xs ml-auto mr-5">
								<Link to={AppRoutePaths.loginPage()}>
									{t('register.hasAccount')}{' '}
									<span className="text-primary-blue! hoverable-text cursor-pointer">
										{t('register.login')}
									</span>
								</Link>
							</span>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
