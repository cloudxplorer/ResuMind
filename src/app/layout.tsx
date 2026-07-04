
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResuMind: ATS Resume Platform",
  description:
    "Build, score, optimize and tailor ATS-ready resumes with deterministic scoring and AI-assisted improvements.",
  keywords: [
    "ATS resume checker",
    "resume builder",
    "resume optimizer",
    "cover letter generator",
    "LaTeX resume",
    "job description matcher",
  ],
  authors: [{ name: "ResuMind" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "ResuMind: ATS Resume Platform",
    description: "Deterministic ATS scoring + AI-assisted resume optimization.",
    siteName: "ResuMind",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SonnerToaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
