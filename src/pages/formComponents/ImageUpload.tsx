import { Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type ImageUploadProps = {
  selectedFiles: string[];
  setSelectedFiles: (value: string[]) => void;
  selectFileRef: React.RefObject<HTMLInputElement>;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFiles,
  setSelectedFiles,
  selectFileRef,
  onSelectImage,
}) => {
  const handleDelete = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };
  return (
    <Flex direction="column" width="100%" wrap='wrap'>
      {selectedFiles.map((file, index) => (
        <Flex key={index} direction="row" alignItems="center" justifyContent="space-between">
          <Image
            src={file}
            maxWidth="178px"
            maxHeight="178px"
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
            onClick={() => handleDelete(index)}
          >
            <DeleteIcon />
          </Button>
        </Flex>
      ))}
      {selectedFiles.length < 3 && (
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
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;