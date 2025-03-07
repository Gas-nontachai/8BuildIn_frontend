"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Box, Card, CardContent } from "@mui/material";
import "./globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CartProvider } from "@/context/CartContext";

const theme = createTheme({
  typography: {
    fontFamily: "Kanit, sans-serif",
  },
});

const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>8BUILT - IN</title>
        <style>
          {
            ` .swal2-container {
              z-index: 9999999 !important;
            }`
          }
        </style>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CartProvider>
            {!isAuthPage && <Sidebar open={open} setOpen={setOpen} />}
            <Box
              sx={{
                flexGrow: 1,
                p: 3,
                marginTop: -6,
                marginLeft: !isAuthPage && open ? "240px" : "0px",
                transition: "margin 0.3s ease-in-out",
                backgroundColor: "#f4f5fa",
                minHeight: '100vh'
              }}
            >
              <Card>
                <CardContent>
                  {children}
                </CardContent>
              </Card>
            </Box>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}