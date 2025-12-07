type Props = {
	label: string;
	value: string;
};

export default function DomainValidationItem({ label, value }: Props) {
	return (
		<div className="flex items-center justify-between gap-2 w-full">
			<span className="w-[200px]">{label}</span>
			<strong>{value}</strong>
		</div>
	);
}
