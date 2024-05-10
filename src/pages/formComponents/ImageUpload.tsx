import { Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type ImageUploadProps = {
  selectedFile?: string;
  setSelectedFile: (value: string) => void;
  selectFileRef: React.RefObject<HTMLInputElement>;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  setSelectedFile,
  selectFileRef,
  onSelectImage,
}) => {
  return (
    <Flex direction="column">
      {selectedFile ? (
        <>
          <Image
            src={selectedFile}
            maxWidth="158px"
            maxHeight="158px"
            borderRadius="8px"
          />
          <Button
            leftIcon={<DeleteIcon />}
            mt={2}
            bg="red.500"
            _hover={{ bg: "red.600" }}
            width="80px"
            height="32px"
            variant="solid"
            size="sm"
            onClick={() => setSelectedFile("")}
          >
            Hapus
          </Button>
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
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
