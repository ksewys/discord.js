import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { PropsWithChildren } from 'react';
import { Providers } from './providers';

import '~/styles/main.css';
import 'overlayscrollbars/overlayscrollbars.css';

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
