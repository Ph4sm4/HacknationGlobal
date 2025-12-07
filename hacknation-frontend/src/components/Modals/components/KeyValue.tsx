import React from 'react';
import { useTranslation } from 'react-i18next';
import GreenTick from './GreenTick';
import RedCross from './RedCross';

interface KeyValueProps {
	label: string;
	value: any;
}

export const KeyValue: React.FC<KeyValueProps> = ({ label, value }) => {
	const { t } = useTranslation();

	const display =
		value === null ? (
			'—'
		) : typeof value === 'boolean' ? (
			value ? (
				<GreenTick />
			) : (
				<RedCross />
			)
		) : (
			String(value)
		);

	return (
		<div className="flex items-center justify-between border-b border-gray-300 py-1">
			<span className="text-sm text-primary-blue">{label}</span>
			<span className="text-sm font-medium">{display}</span>
		</div>
	);
};
