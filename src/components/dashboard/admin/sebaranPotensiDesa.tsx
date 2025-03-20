import { Box, Flex, Text } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SebaranPotensiDesa: React.FC = () => {
    // State untuk data Bar Chart
    const [barData, setBarData] = useState<{ name: string; value: number }[]>([]);

    // Ambil Data dari Firestore
    const fetchPotensiData = async () => {
        try {
            const db = getFirestore();
            const villagesRef = collection(db, "villages"); // Koleksi "villages"
            const snapshot = await getDocs(villagesRef);

            const potensiCount: Record<string, number> = {}; // Objek untuk menyimpan jumlah desa per kategori potensi

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (Array.isArray(data.potensiDesa)) {
                    data.potensiDesa.forEach((potensi: string) => {
                        const formattedPotensi =
                            potensi.charAt(0).toUpperCase() + potensi.slice(1).toLowerCase(); // Format kapitalisasi
                        potensiCount[formattedPotensi] = (potensiCount[formattedPotensi] || 0) + 1;
                    });
                }
            });

            // Konversi hasil ke dalam format yang sesuai untuk Bar Chart
            const chartData = Object.keys(potensiCount).map((potensi) => ({
                name: potensi,
                value: potensiCount[potensi]
            }));

            setBarData(chartData);
        } catch (error) {
            console.error("Error fetching potensi data:", error);
        }
    };

    useEffect(() => {
        fetchPotensiData();
    }, []);

    return (
        <Box>
            {/* BAR CHART POTENSI DESA */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                {/* Judul */}
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Sebaran Pontensi Desa
                </Text>
            </Flex>

            {/* Bar Chart */}
            <Box
                bg="white"
                borderRadius="xl"
                pt="5px"
                pb="1px"
                mx="15px"
                boxShadow="md"
                border="2px solid"
                borderColor="gray.200"
                mt={4}
                overflow="visible"
            >
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} margin={{ top: 50, right: 40, left: 1, bottom: 0 }} barSize={20}>
                        <XAxis label={{ value: "Kategori", position: "insideBottom", fontSize: 8, dy: 1 }} dataKey="name" tick={{ fontSize: 6 }} angle={0} textAnchor="middle" interval={0} />
                        <YAxis label={{ value: "Jumlah Desa", angle: -90, position: "insideLeft", fontSize: 8, dx: 20, dy: 20 }} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1E5631" radius={[0, 0, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            {/* BAR CHART POTENSI DESA SELESAI */}
        </Box>
    );
};

export default SebaranPotensiDesa;
