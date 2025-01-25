import { Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type ImageUploadProps = {
  selectedFiles: string[];
  disabled?: boolean;
  setSelectedFiles: (value: string[]) => void;
  selectFileRef: React.RefObject<HTMLInputElement>;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxFiles: number;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFiles,
  setSelectedFiles,
  selectFileRef,
  onSelectImage,
  disabled,
  maxFiles,
}) => {
  const handleDelete = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };
  return (
    <Flex direction="row" width="130" wrap="wrap" gap= "10px">
      {selectedFiles.map((file, index) => (
        <Flex
          key={index}
          direction="row"
          alignItems="center"
          position="relative"
          align-items= "center" 
          align-content= "center"
          maxWidth="130px"
          maxHeight="130px"
          height="100%"
          width="100%"
          overflow="hidden"
        >
          <Image
            src={file}
            borderRadius="8px"
            height="130px"
            width="130px"
            objectFit="cover" 
          />
          <Button
            bg="red.500"
            _hover={{ bg: "red.600" }}
            width="32px"
            height="32px"
            variant="solid"
            size="md"
            onClick={() => handleDelete(index)}
            position="absolute"
            bottom="8px" /* Atur posisi tombol */
            right="8px"
            disabled={disabled}
          >
            <DeleteIcon />
          </Button>
        </Flex>
      ))}
      {selectedFiles.length < maxFiles && (
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
          _disabled={{ cursor: "not-allowed" }}
        >
          <Icon as={AddIcon} color="gray.300" fontSize="16px" />
          <Text fontSize="10pt" color="gray.500" mt={2}>
            Tambahkan foto
          </Text>
          <input
            id="file-upload"
            type="file"
            hidden
            accept="image/png,image/jpeg,image/jpg"
            ref={selectFileRef}
            onChange={onSelectImage}
            disabled={disabled}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
