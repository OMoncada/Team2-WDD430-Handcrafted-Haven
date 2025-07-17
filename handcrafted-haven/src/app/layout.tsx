import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./ui/navbar";
import Footer from "./ui/footer";

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "Handcrafted Haven",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
