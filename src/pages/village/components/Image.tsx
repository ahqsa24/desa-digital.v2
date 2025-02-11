import React from "react";
import {Container, Image, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Button, } from "@chakra-ui/react";
import {SearchIcon} from '@chakra-ui/icons'
import {Icon} from "src/pages/village/detail/_detailStyle";
interface EnlargedImageProps {
    src: string;
}

const EnlargedImage: React.FC<EnlargedImageProps> = ({ src }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {/* Gambar kecil */}
                <Image
                    src={src}
                    borderRadius="8px"
                    height="120px"
                    width="120px"
                    objectFit="cover"
                    cursor="pointer"
                    onClick={onOpen}
                    position="relative"
                />

            {/* Modal untuk gambar besar */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered blockScrollOnMount={false}>
                <ModalOverlay />
                <ModalContent bg="transparent" boxShadow="none" maxW="fit-content">
                    <ModalBody >
                        <Image
                            src={src}
                            borderRadius="4px"
                            objectFit="cover"
                            maxHeight="200px"
                            maxWidth="300px"
                            position="relative"
                            marginRight="12px"

                        />

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EnlargedImage;
