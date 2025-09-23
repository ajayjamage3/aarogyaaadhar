"use client";

import { usePathname } from "next/navigation";
import SideMenu from "@/components/SideMenu";

export default function ClientSidebarWrapper({ children }) {
  const pathname = usePathname();
  const hideSidebarRoutes = ["/login", "/register"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(pathname);

  return (
    <>
      {shouldShowSidebar && <SideMenu />}
      <main className={`flex-1 p-6 ${shouldShowSidebar ? "md:ml-64" : ""}`}>
        {children}
      </main>
    </>
  );
}
