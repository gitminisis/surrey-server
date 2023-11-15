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
import { MdMuseum } from "react-icons/md";
import { FiHome, FiArchive } from "react-icons/fi";
import { TbHomeSearch, TbListDetails } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { FaQuestionCircle } from "react-icons/fa";
interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  href: string;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/dashboard" },
  {
    name: "Union page",
    icon: TbHomeSearch,
    href: "/dashboard/component/union-home",
  },
  {
    name: "Archive page",
    icon: FiArchive,
    href: "/dashboard/component/archive-home",
  },
  {
    name: "Artifact page",
    icon: MdMuseum,
    href: "/dashboard/component/artifact-home",
  },
  {
    name: "Detail page",
    icon: TbListDetails,
    href: "/dashboard/component/detail-page",
  },
  { name: "FAQ", icon: FaQuestionCircle, href: "/dashboard/component/faq" },
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
        <NavItem href={link.href} key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  const router = useRouter();

  return (
    <Box
      as="a"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      onClick={() => router.push(href)}
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
