"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import "./globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Kanit, sans-serif",
  },
});

const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>8BuildIn System</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Sidebar open={open} setOpen={setOpen} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              marginLeft: open ? "240px" : "0px",
              transition: "margin 0.3s ease-in-out",
            }}
          >
            <div className="max-h-screen w-100 p-3 -mt-12 bg-gray-100 text-black rounded-xl">
              {children}
            </div>
          </Box>
        </ThemeProvider>
      </body>
    </html >
  );
}
