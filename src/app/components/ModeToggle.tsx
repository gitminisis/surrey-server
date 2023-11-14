"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { IconButton, useColorMode } from "@chakra-ui/react";

const ModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="theme toggle"
      icon={colorMode === "light" ? <Moon /> : <Sun />}
      onClick={toggleColorMode}
    />
  );
};

export default ModeToggle;
