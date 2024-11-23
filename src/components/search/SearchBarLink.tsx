import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import React from "react";

type SearchBarLinkProps = {};

const SearchBarLink: React.FC<SearchBarLinkProps> = () => {
  return (
    <Flex justify="center" maxW="360px" mb='16px'>
      <Flex position='absolute' top='175px'>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            placeholder="Search"
            fontSize="10pt"
            bg="white"
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "brand.100",
            }}
            _focus={{
              bg: "white",
              border: "1px solid",
              borderColor: "brand.100",
            }}
            borderRadius={100}
            width="329px"
          />
        </InputGroup>
      </Flex>
    </Flex>
  );
};
export default SearchBarLink;
