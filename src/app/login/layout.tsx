import React from "react";
import { getCurrentUser } from "@/lib/session";
type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const user = await getCurrentUser();
  console.log(user);
  return <div>{children}</div>;
};

export default Layout;
