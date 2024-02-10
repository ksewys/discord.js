import { getHighlighterCore } from 'shiki/core';
import getWasm from 'shiki/wasm';

const highlighter = await getHighlighterCore({
	themes: [import('shiki/themes/vitesse-light.mjs'), import('shiki/themes/vitesse-dark.mjs')],
	langs: [import('shiki/langs/typescript.mjs'), import('shiki/langs/javascript.mjs')],
	loadWasm: getWasm,
});

export function SyntaxHighlighter({
	lang,
	code,
	className = '',
}: {
	readonly className?: string;
	readonly code: string;
	readonly lang: string;
}) {
	const codeHTML = highlighter.codeToHtml(code.trim(), {
		lang,
		themes: {
			light: 'vitesse-light',
			dark: 'vitesse-dark',
		},
	});

	return (
		<>
			{/* eslint-disable-next-line react/no-danger */}
			<div className={className} dangerouslySetInnerHTML={{ __html: codeHTML }} />
		</>
	);
}
