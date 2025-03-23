import {
    Box,
    Flex,
    Text,
    Button,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerCloseButton,
    Image,
    DrawerFooter,
    DrawerHeader,
} from "@chakra-ui/react";
import { FaSeedling } from "react-icons/fa6";
import efisheryLogo from "../../../assets/images/efishery-logo.jpg";
import React from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "Consts/path";


const Rekomendasi = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    return (
        <>
            {/* Card Rekomendasi */}
            <Box
                mt={4}
                p={6}
                mx="15px"
                bg="white"
                boxShadow="md"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                position="relative"
                overflow="hidden"
            >
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Inovasi digital terbaik untuk desamu
                </Text>
                <Flex alignItems="center" mb={1}>
                    <Box borderRadius="full" p={1} mr={2}>
                        <FaSeedling color="green" size="30px" />
                    </Box>
                    <Box>
                        <Text fontSize="md" fontWeight="bold" color="green.700">
                            eFeeder
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Innovator: eFishery
                        </Text>
                    </Box>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center" mb={0.9} mt={3}>
                    <Text fontSize="10px" color="gray.500">
                        Cek rekomendasi inovasi digital lainnya untuk desamu disini
                    </Text>
                    <Button
                        colorScheme="green"
                        size="xs"
                        fontSize="10px"
                        p={1}
                        borderRadius="4"
                        minW="auto"
                        
                        h="22px"
                        w='180px'
                        onClick={onOpen} // Trigger buka drawer
                        boxShadow="md" // ✅ shadow awal
                        _hover={{ bg: "#16432D" }}
                    >
                        Lihat Rekomendasi
                    </Button>
                </Flex>
            </Box>

            {/* Drawer Rekomendasi */}
            <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent
                    sx={{
                        borderRadius: "lg",
                        width: "360px", // match sama drawer lain
                        my: "auto",
                        mx: "auto",
                    }}
                >
                    <DrawerHeader
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Text fontSize="15px" fontWeight="bold">
                            Rekomendasi Inovasi
                        </Text>
                        <DrawerCloseButton />
                    </DrawerHeader>

                    <DrawerBody textAlign="center">
                        <Text fontWeight="bold" fontSize="lg">
                            eFeeder
                        </Text>
                        <Text fontSize="sm" mb={4}>
                            dari eFishery
                        </Text>

                        <Box my={6}>
                            <Image
                                src={efisheryLogo} // ganti dengan logo real
                                alt="eFeeder"
                                mx="auto"
                                boxSize="80px"
                            />
                        </Box>

                        <Text fontWeight="bold" mb={1}>
                            Cocok dengan desamu!
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Saatnya desamu berinovasi! Terapkan inovasi dan buat perubahan besar di desamu
                        </Text>
                    </DrawerBody>

                    <DrawerFooter flexDirection="column" gap={2}>
                        <Button
                            bg="#1E5631"
                            color="white"
                            w="full"
                            _hover={{ bg: "#16432D" }}
                        >
                            Detail Inovasi
                        </Button>
                        <Button
                            variant="outline"
                            colorScheme="green"
                            w="full"
                            onClick={() => {
                                onClose(); // tutup drawer
                                navigate(paths.VILLAGE_RECOMENDATION); // redirect
                            }}
                        >
                            Rekomendasi Lainnya
                        </Button>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Rekomendasi;
