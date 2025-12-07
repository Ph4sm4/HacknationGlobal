import React from 'react';

interface SectionProps {
	title: string;
	children: React.ReactNode;
	className?: string;
	titleOnClick?: () => void;
	titleClassName?: string;
	titleIcon?: React.JSX.Element;
}

export const Section: React.FC<SectionProps> = ({
	title,
	children,
	className,
	titleOnClick,
	titleClassName,
	titleIcon
}) => {
	return (
		<div className={`flex flex-col gap-4 ${className || ''}`}>
			<h5
				className={`text-lg flex items-center justify-between font-semibold ${
					titleClassName || ''
				}`}
				onClick={titleOnClick}>
				{title}
				{titleIcon}
			</h5>
			<div className="flex flex-col gap-2">{children}</div>
		</div>
	);
};
