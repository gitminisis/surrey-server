import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Text,
  FlexProps,
  Icon,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import NextLink from "next/link";

import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from "react-icons/fi";
interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/dashboard" },
  {
    name: "Union page",
    icon: FiTrendingUp,
    href: "/dashboard/component/union-home",
  },
  {
    name: "Archive page",
    icon: FiCompass,
    href: "/dashboard/component/archive-home",
  },
  {
    name: "Artifact page",
    icon: FiStar,
    href: "/dashboard/component/artifact-home",
  },
  { name: "FAQ", icon: FiStar, href: "/faq" },
  // { name: "Settings", icon: FiSettings },
];
export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          <Link as={NextLink} href={link.href}>
            {link.name}
          </Link>
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};
