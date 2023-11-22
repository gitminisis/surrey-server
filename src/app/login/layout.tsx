import React from "react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div>
      {user?.name.toString()}
      {children}
    </div>
  );
};

export default Layout;
