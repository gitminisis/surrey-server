import { useSession, signIn, signOut } from "next-auth/react";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getCurrentUser } from "@/lib/session";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  console.log(user);
  if (!user) {
    redirect("/login");
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
