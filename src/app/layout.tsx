"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import theme from "./theme";
import "./globals.css";
import Navbar from "./components/Navbar";

const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <Navbar />
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
            <div className="max-h-screen w-100 p-3 -mt-28">
              {children}
            </div>
          </Box>
        </ThemeProvider>
      </body>
    </html >
  );
}
