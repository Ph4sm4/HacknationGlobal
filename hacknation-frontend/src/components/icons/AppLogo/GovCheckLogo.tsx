import Logo from '../../../assets/images/logo.png';

type Props = {
	className?: string;
};

export default function GovCheckLogo({ className }: Props) {
	return <img src={Logo} className={`h-18 w-min ${className}`} />;
}
