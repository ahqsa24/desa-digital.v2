import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";

type HeaderUploadProps = {
  selectedHeader: string;
  setSelectedHeader: (value: string) => void;
  selectFileRef: React.RefObject<HTMLInputElement>;
  onSelectHeader: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HeaderUpload: React.FC<HeaderUploadProps> = ({
  selectedHeader,
  setSelectedHeader,
  selectFileRef,
  onSelectHeader,
}) => {
  return (
    <Flex direction="column" width="100%" wrap="wrap">
      {selectedHeader ? (
        <>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              src={selectedHeader}
              width='272px'
              height="86px"
              maxWidth="272px"
              maxHeight="86px"
              borderRadius="8px"
              mt={4}
            />
            <Button
              bg="red.500"
              _hover={{ bg: "red.600" }}
              width="32px"
              height="32px"
              variant="solid"
              size="md"
              onClick={() => setSelectedHeader("")}
            >
              <DeleteIcon />
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          padding="12px 8px"
          border="1px dashed "
          direction="column"
          cursor="pointer"
          borderRadius="8px"
          width="128px"
          height="128px"
          borderColor="gray.500"
          onClick={() => selectFileRef.current?.click()}
          mt={4}
        >
          <Icon as={AddIcon} color="gray.300" fontSize="16px" />
          <Text fontSize="10pt" color="gray.500" mt={2}>
            Tambahkan foto
          </Text>
          <input
            id="file-upload"
            type="file"
            hidden
            accept="image/x-png,image/gif,image/jpeg"
            ref={selectFileRef}
            onChange={onSelectHeader}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default HeaderUpload;
