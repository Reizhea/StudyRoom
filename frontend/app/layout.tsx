"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./globals.css";

const theme = extendTheme({
  components: {
    Alert: {
      variants: {
        info: {
          container: {
            bg: "black",
            color: "white",
          },
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme} toastOptions={{ defaultOptions: { position: 'top-right'}}}>
          {children}
          </ChakraProvider>
      </body>
    </html>
  );
}
