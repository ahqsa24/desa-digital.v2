import { SearchIcon } from "@chakra-ui/icons";
import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react";
import React from "react";

const SearchBar: React.FC = () => {
  return (
    <Flex justify="center" mt={2} maxW="360px">
      <Flex>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            placeholder="Search"
            fontSize="10pt"
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
export default SearchBar;
