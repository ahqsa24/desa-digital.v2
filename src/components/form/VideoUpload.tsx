import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Video from "Assets/icons/video-camera.svg";
import { DeleteIcon } from "@chakra-ui/icons";


type VidUploadProps = {
    selectedVid: string;
    setSelectedVid: (value: string) => void;
    selectVidRef: React.RefObject<HTMLInputElement>;
    onSelectVid: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const VidUpload: React.FC<VidUploadProps> = ({
    selectedVid,
    setSelectedVid,
    selectVidRef,
    onSelectVid,
}) => {
    return (
        <Flex justifyContent="space-between" >
            {selectedVid ? (
                <>
                    <Flex
                        direction="row"
                        justifyContent="space-between"
                        maxWidth="270px"
                        maxHeight="32px"
                        height="100%"
                        width="100%"
                        bg="#E5FFE4"
                        borderRadius="4px"
                        border="1px solid #347357"
                        paddingRight={2}
                        paddingLeft={2}
                        gap={4}
                        position="relative"

                    >
                        {/* Menampilkan nama file */}
                        <Text
                            margin={1}
                            fontSize="sm"
                            color="gray.800"
                            maxWidth="95%" /* Batasi lebar agar tidak melebihi Flex */
                            whiteSpace="nowrap" /* Pastikan teks tidak membungkus */
                            textOverflow="ellipsis" /* Tambahkan ellipsis untuk teks terpotong */
                            overflow="hidden"
                        >
                            {selectedVid}
                        </Text>

                    </Flex>
                    <Button
                        bg="red.500"
                        _hover={{ bg: "red.600" }}
                        width="32px"
                        height="32px"
                        variant="solid"
                        size="md"
                        onClick={() => setSelectedVid("")}
                    >
                        <DeleteIcon />
                    </Button>
                </>
            ) : (
                <Button
                    leftIcon={<img src={Video} alt="video" />}
                    _hover={{ bg: "DBFFE6" }}
                    size='xs'
                    variant='outline'
                    display="flex"
                    maxWidth="106px"
                    width="100%"
                    border="2px"
                    cursor="pointer"
                    borderRadius="4px"
                    borderColor="#347357"
                    onClick={() => selectVidRef.current?.click()}
                    fontSize="10pt" color="#347357" fontWeight="400"
                    justifyContent="left"
                >
                    Pilih Video
                    <input
                        id="file-upload"
                        type="file"
                        hidden
                        accept="video/mp4"
                        ref={selectVidRef}
                        onChange={onSelectVid}
                    />
                </Button>
            )}
        </Flex>
    );
};
export default VidUpload;

// <Icon as={AddIcon} color="gray.300" fontSize="16px" />