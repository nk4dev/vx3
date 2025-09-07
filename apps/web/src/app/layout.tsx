import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import Header from "@/components/header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "VX3 | VARIUS",
	description: "all in one web3 platform",
	viewport: "width=device-width, initial-scale=1",
	openGraph: {
		title: "VX3 | VARIUS",
		description: "all in one web3 platform",
		url: "https://vx3.varius.technology",
		siteName: "VX3 | VARIUS",
		images: [
			{
				url: "https://ogp-img-gen.vercel.app/api/img-gen?text=VX3%20%7C%20VARIUS&host=vx3.varius.technology",
				width: 1200,
				height: 630,
				alt: "VX3 | VARIUS",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					
					<div className="grid grid-rows-[auto_1fr] h-svh">
						<Header />
						
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
