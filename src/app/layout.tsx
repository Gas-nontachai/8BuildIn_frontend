"use client";
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
const Sidebar = dynamic(() => import('./components/Sidebar'), { ssr: false });
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <Sidebar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
