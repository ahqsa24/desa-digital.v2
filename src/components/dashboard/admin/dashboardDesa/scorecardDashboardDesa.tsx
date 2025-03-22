import { Box, Flex, Grid, Text, Stack } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const ScoreCardDashboardDesa: React.FC = () => {
    // Deklarasi untuk 4 Scorecard
    const [totalVillage, setTotalVillage] = useState(0);
    const [totalProvince, setTotalProvince] = useState(0);
    const [totalKabupaten, setTotalKabupaten] = useState(0);
    const [totalKecamatan, setTotalKecamatan] = useState(0);

    // Fungsi untuk mengambil data dari Firestore
    const fetchData = async () => {
        try {
            const db = getFirestore();
            const villagesRef = collection(db, "villages"); // Referensi koleksi villages
            const snapshot = await getDocs(villagesRef);

            // Variabel untuk menyimpan data unik
            const villageSet = new Set();
            const provinceSet = new Set();
            const kabupatenSet = new Set();
            const kecamatanSet = new Set();

            // Looping setiap dokumen dalam koleksi
            snapshot.docs.forEach((doc) => {
                const data = doc.data();

                // Debugging
                console.log("Data desa:", data);

                // Pastikan namaDesa adalah string atau memiliki label
                if (typeof data.namaDesa === "string" && data.namaDesa.length > 1) {
                    villageSet.add(data.namaDesa);
                } else if (data.namaDesa?.label && typeof data.namaDesa.label === "string" && data.namaDesa.label.length > 1) {
                    villageSet.add(data.namaDesa.label);
                }

                // Periksa jika `lokasi` ada sebelum mengambil data di dalamnya
                if (data.lokasi) {
                    if (data.lokasi.provinsi?.label) provinceSet.add(data.lokasi.provinsi.label);
                    if (data.lokasi.kabupatenKota?.label) kabupatenSet.add(data.lokasi.kabupatenKota.label);
                    if (data.lokasi.kecamatan?.label) kecamatanSet.add(data.lokasi.kecamatan.label);
                }
            });

            // Simpan jumlah unik ke state
            setTotalVillage(villageSet.size);
            setTotalProvince(provinceSet.size);
            setTotalKabupaten(kabupatenSet.size);
            setTotalKecamatan(kecamatanSet.size);

        } catch (error) {
            console.error("Error fetching village data:", error);
        }
    };

    // Panggil `fetchData` saat komponen dimuat
    useEffect(() => {
        fetchData();
    }, []);

    // Data statistik untuk Scorecard
    const stats = [
        { label: "Provinsi", value: totalProvince },
        { label: "Kabupaten", value: totalKabupaten },
        { label: "Kecamatan", value: totalKecamatan },
        { label: "Desa Digital", value: totalVillage },
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
                                <Text color="gray.600">{stat.label}</Text>
                            </Flex>
                        </Box>
                    ))}
                </Grid>
            </Box>
        </Stack>
    );
};

export default ScoreCardDashboardDesa;
