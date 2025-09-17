

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";


export function ThemeProvider({
	children,
	attribute = "class",
	defaultTheme,
	enableSystem,
	disableTransitionOnChange
}: {
	children: React.ReactNode;
	attribute?: "class";
	defaultTheme?: string;
	enableSystem?: boolean;
	disableTransitionOnChange?: boolean;
}) {
	return (
		<NextThemesProvider
			attribute={attribute}
			defaultTheme={defaultTheme}
			enableSystem={enableSystem}
			disableTransitionOnChange={disableTransitionOnChange}
		>
			{children}
		</NextThemesProvider>
	);
}
