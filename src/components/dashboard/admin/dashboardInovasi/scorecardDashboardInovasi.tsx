import { Box, Flex, Grid, Text, Stack } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const ScoreCardDashboardInnovations: React.FC = () => {
    const [totalInnovations, setTotalInnovations] = useState(0);

    // Fungsi untuk mengambil data dari Firestore
    const fetchData = async () => {
        try {
            const db = getFirestore();
            const innovationsRef = collection(db, "innovations");
            const snapshot = await getDocs(innovationsRef);

            const innovationCount = snapshot.size; // Hitung jumlah dokumen langsung

            // Simpan ke state
            setTotalInnovations(innovationCount);
        } catch (error) {
            console.error("❌ Error fetching innovation data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Data statistik untuk Scorecard
    const stats = [
        { label: "Inovasi", value: totalInnovations },
    ];

    return (
        <Stack>
            <Box p={5}>
                <Grid templateColumns={{ base: "1fr", md: "repeat(1, 1fr)" }} gap={4}>
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

export default ScoreCardDashboardInnovations;
