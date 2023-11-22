import PageContainer from "@/components/easyload/PageContainer";
import { Authorize } from "@/lib/upload";
import React from "react";

type Props = {};

const Easyload = (props: Props) => {
  return (
    <div>
      <PageContainer
        credentials={{
          tenant_id: process.env.TENANT_ID || "",
          tenant_pwd: process.env.TENANT_PASSWORD || "",
        }}
      />
    </div>
  );
};

export default Easyload;
