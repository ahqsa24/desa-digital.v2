import { AddIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Container from "Components/container";
import { paths } from "Consts/path";
import React from "react";
import { useNavigate } from "react-router-dom";


const AdsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Flex justify="space-between" align="center" mt={4}>
        <Flex flexGrow={1} maxW="230px">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              placeholder="Cari iklan disini"
              fontSize="10pt"
              bg="white"
              _placeholder={{ color: "gray.300" }}
              _hover={{
                bg: "white",
                border: "1px solid",
                borderColor: "blue.200",
              }}
              _focus={{
                bg: "white",
                border: "1px solid",
                borderColor: "blue.200",
              }}
              borderRadius={100}
            />
          </InputGroup>
        </Flex>

        {/* // TODO: Benerin warna menu */}

        <Menu>
          <MenuButton
            px={4}
            py={2}
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px"
            _hover={{ bg: "gray.400" }}
            _expanded={{ bg: "blue.400" }}
            _focus={{ boxShadow: "outline" }}
            fontSize="12px"
            color="gray.500"
          >
            Filter <ChevronDownIcon color="brand.100" fontSize="16pt" />
          </MenuButton>
          <MenuList>
            <MenuItem>Semua</MenuItem>
            <MenuItem>Menunggu</MenuItem>
            <MenuItem>Ditampilkan</MenuItem>
            <MenuItem>Selesai</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Flex justify="center" position="relative" flexGrow={1} maxW="360px">
        <Button
          leftIcon={<AddIcon />}
          fontSize="14px"
          fontWeight="700"
          width="100%"
          position="sticky"
          bottom="0"
          left='50%'
          onClick={() => navigate(paths.MAKE_ADS)}
        >
          Tambah Iklan
        </Button>
      </Flex>
    </Container>
  );
};
export default AdsPage;
