"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ChakraProvider } from '@chakra-ui/react';
type Props = {
  children: React.ReactNode;
};

const ContextProvider = ({ children }: Props) => {
    <ChakraProvider>
    <Provider store={store}>

      <SessionProvider>{children}</SessionProvider>
    </Provider>

    </ChakraProvider>
  );
};

export default ContextProvider;
