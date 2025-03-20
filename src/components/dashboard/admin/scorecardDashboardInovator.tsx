import { Box, Flex, Grid, Text, Stack } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const ScoreCardDashboardInovator: React.FC = () => {
    const [totalInovators, setTotalInovators] = useState(0);
    const [totalDesaDampingan, setTotalDesaDampingan] = useState(0);

    // Fungsi untuk mengambil data dari Firestore
    const fetchData = async () => {
        try {
            const db = getFirestore();
            const innovatorsRef = collection(db, "innovators");
            const snapshot = await getDocs(innovatorsRef);

            let inovatorCount = 0;
            let desaDampinganCount = 0;

            snapshot.docs.forEach((doc) => {
                const data = doc.data();

                // Hitung jumlah inovator dari field "namaInovator"
                if (data.namaInovator) {
                    inovatorCount++;
                }

                // Ambil nilai jumlah desa dampingannya
                if (typeof data.jumlahDesaDampingan === "number") {
                    desaDampinganCount += data.jumlahDesaDampingan;
                }
            });

            // Simpan ke state
            setTotalInovators(inovatorCount);
            setTotalDesaDampingan(desaDampinganCount);
        } catch (error) {
            console.error("❌ Error fetching innovator data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Data statistik untuk Scorecard (hanya 2)
    const stats = [
        { label: "Inovator", value: totalInovators },
        { label: "Desa Dampingan", value: totalDesaDampingan },
    ];

    return (
        <Stack>
            <Box p={5}>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                    {stats.map((stat, index) => (
                        <Box
                            key={index}
                            p={5}
                            borderRadius="lg"
                            boxShadow="lg"
                            border="2px solid"
                            borderColor="gray.200"
                            bg="white"
                            position="relative"
                        >
                            <Flex direction="column">
                                <Text fontSize="2xl" fontWeight="bold" color="green.700">
                                    {stat.value}
                                </Text>
                                <Text fontSize="12px" color="gray.600">{stat.label}</Text>
                            </Flex>
                        </Box>
                    ))}
                </Grid>
            </Box>
        </Stack>
    );
};

export default ScoreCardDashboardInovator;
