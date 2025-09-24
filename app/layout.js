'use client';

import SideMenu from "@/components/SideMenu";
import { AuthProvider } from "./Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Hide sidebar on login/register
  const hideSidebarRoutes = ["/login", "/register"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex bg-gray-100`}>
        <AuthProvider>
          {shouldShowSidebar && <SideMenu />}
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
