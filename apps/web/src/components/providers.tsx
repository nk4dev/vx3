

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
<<<<<<< HEAD
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import { queryClient } from "@/utils/trpc";
=======
import { queryClient } from "@/lib/react-query-client";
>>>>>>> 3c6dead82d74b524af6f95d528cfa6f99bacf386
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi-config';


export default function Providers({ children }: { children: React.ReactNode }) {
	return (
<<<<<<< HEAD
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<WagmiProvider config={config}>
=======
		<WagmiProvider config={config}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
>>>>>>> 3c6dead82d74b524af6f95d528cfa6f99bacf386
				<QueryClientProvider client={queryClient}>
					{children}
					<ReactQueryDevtools />
				</QueryClientProvider>
<<<<<<< HEAD
			</WagmiProvider>
			<Toaster richColors />
		</ThemeProvider>
=======
				<Toaster richColors />
			</ThemeProvider>
		</WagmiProvider>
>>>>>>> 3c6dead82d74b524af6f95d528cfa6f99bacf386
	);
}
