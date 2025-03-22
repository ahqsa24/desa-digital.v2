import { Box, Flex, Image, Text, VStack, Stack, HStack } from "@chakra-ui/react";
import TopBar from "Components/topBar";
import { useNavigate } from "react-router-dom";
import efisheryLogo from "../../../../assets/images/efishery-logo.jpg";

const dummyData = [
    { rank: 1, name: "eFeeder", innovator: "eFishery" },
    { rank: 2, name: "Habibi Garden", innovator: "Habibi Garden" },
    { rank: 3, name: "Inagri", innovator: "Inagri" },
    { rank: 4, name: "Aruna", innovator: "Aruna" },
    { rank: 5, name: "Digides", innovator: "PT Digital Desa Indonesia" },
    { rank: 6, name: "FishGo", innovator: "FishGo" },
    { rank: 7, name: "Silawas", innovator: "Departemen Ilkom" },
    { rank: 8, name: "Innovillage", innovator: "Telkom University" },
    { rank: 9, name: "OpenSID", innovator: "Opendesa" },
    { rank: 10, name: "PINANG", innovator: "Bank Rakyat Indonesia" },
];

const RekomendasiInovasi = () => {
    const navigate = useNavigate();

    const topThree = dummyData.slice(0, 3);
    const others = dummyData.slice(3);

    return (
        <Box>
            <TopBar title="Rekomendasi Inovasi" onBack={() => navigate(-1)} />

            <Stack pt="60px" px={4} spacing={6}>
                {/* Top 3 */}
                <Flex justify="center" align="flex-end" gap={4} mb="-25px">
                    {topThree.map((item, index) => {
                        const heights = [100, 140, 70];
                        const label = ["2nd", "1st", "3rd"];
                        const itemIndex = index === 0 ? 0 : index === 1 ? 1 : 2;

                        return (
                            <VStack key={item.rank} spacing={2}>
                                <Image
                                    src={efisheryLogo}
                                    boxSize="40px"
                                    borderRadius="full"
                                    objectFit="cover"
                                />
                                <Text fontSize="xs" fontWeight="semibold">
                                    {item.name}
                                </Text>
                                <Box
                                    w="50px"
                                    h={`${heights[itemIndex]}px`}
                                    bg="green.700"
                                    borderRadius="md"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text color="white" fontWeight="bold" fontSize="sm">
                                        {label[itemIndex]}
                                    </Text>
                                </Box>
                            </VStack>
                        );
                    })}
                </Flex>

                {/* Rank 4–10 */}
                <Box
                    mt={0}
                    mb={5}
                    bg="#F2F7F4" // ganti sesuai warna di design lo
                    borderRadius="3xl"
                    pt={6}
                    pb={10}
                    px={4}
                >
                    <VStack spacing={3}>
                        {others.map((item) => (
                            <HStack
                                key={item.rank}
                                bg="white"
                                w="full"
                                p={3}
                                boxShadow="md"
                                border="2px solid"
                                borderColor="gray.200"
                                borderRadius={10}
                                align="center"
                                spacing={3}
                            >
                                <Text fontWeight="bold" fontSize="lg" color="gray.600" w="30px">
                                    {String(item.rank).padStart(2, "0")}
                                </Text>
                                <Image
                                    src={efisheryLogo}
                                    boxSize="40px"
                                    borderRadius="full"
                                    objectFit="cover"
                                />
                                <Box>
                                    <Text fontWeight="semibold">{item.name}</Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Inovator: <b>{item.innovator}</b>
                                    </Text>
                                </Box>
                            </HStack>
                        ))}
                    </VStack>
                    </Box>
            </Stack>
        </Box>
    );
};

export default RekomendasiInovasi;


