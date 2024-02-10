import { AlertTriangle } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export function Badge({ children, className = '' }: PropsWithChildren<{ readonly className?: string }>) {
	return (
		<span
			className={`inline-flex place-items-center gap-1 rounded-full px-2 py-1 font-sans text-sm font-normal leading-none ${className}`}
		>
			{children}
		</span>
	);
}

export function Badges({ item }: { readonly item: any }) {
	const isDeprecated = Boolean(item.summary?.deprecatedBlock?.length);
	const isProtected = item.isProtected;
	const isStatic = item.isStatic;
	const isAbstract = item.isAbstract;
	const isReadonly = item.isReadonly;
	const isOptional = item.isOptional;

	const isAny = isDeprecated || isProtected || isStatic || isAbstract || isReadonly || isOptional;

	return isAny ? (
		<div className="mb-1 flex gap-3 md:mb-0 md:inline-flex">
			{isDeprecated ? (
				<Badge className="bg-red-500/10 text-red-500">
					<AlertTriangle size={14} /> deprecated
				</Badge>
			) : null}
			{isProtected ? <Badge className="bg-purple-500/10 text-purple-500">protected</Badge> : null}
			{isStatic ? <Badge className="bg-purple-500/10 text-purple-500">static</Badge> : null}
			{isAbstract ? <Badge className="bg-cyan-500/10 text-cyan-500">abstract</Badge> : null}
			{isReadonly ? <Badge className="bg-purple-500/10 text-purple-500">readonly</Badge> : null}
			{isOptional ? <Badge className="bg-cyan-500/10 text-cyan-500">optional</Badge> : null}
		</div>
	) : null;
}
