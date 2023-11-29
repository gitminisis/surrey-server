"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "@/store";
type Props = {
  children: React.ReactNode;
};

const ContextProvider = ({ children }: Props) => {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <SessionProvider refetchInterval={60 * 60}>{children}</SessionProvider>
      </Provider>
    </ChakraProvider>
  );
};

export default ContextProvider;
