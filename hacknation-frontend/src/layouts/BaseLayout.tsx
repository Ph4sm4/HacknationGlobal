import Header from '@/components/Header/Header';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

export default function BaseLayout({ children }: Props) {
	return (
		<div className="flex flex-col">
			<Header />
			{children}
		</div>
	);
}
