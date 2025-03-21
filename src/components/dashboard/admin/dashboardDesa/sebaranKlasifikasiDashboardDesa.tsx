import { Box, Flex, Text } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const SebaranKlasifikasiDashboardDesa: React.FC = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string | null>(null);

    const [geo, setGeo] = useState<{ name: string; value: number; color: string }[]>([]);

    // Warna khusus untuk tiap kategori geografis
    const colors2: Record<string, string> = {
        "Dataran Tinggi": "#A7C7A5",
        "Dataran Rendah": "#1E5631",
        "Dataran Sedang": "#174E3B"
    };

    // Fungsi untuk mengambil data geografis dari Firestore
    const fetchGeoData = async () => {
        try {
            const db = getFirestore();
            const villagesRef = collection(db, "villages"); // Referensi ke koleksi villages
            const snapshot = await getDocs(villagesRef);

            const geoCount: Record<string, number> = {
                "Dataran Tinggi": 0,
                "Dataran Rendah": 0,
                "Dataran Sedang": 0
            };

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.geografisDesa) {
                    const geoText = data.geografisDesa.toLowerCase(); // Normalisasi teks

                    if (geoText.includes("dataran tinggi")) {
                        geoCount["Dataran Tinggi"]++;
                    } else if (geoText.includes("dataran rendah")) {
                        geoCount["Dataran Rendah"]++;
                    } else if (geoText.includes("dataran sedang")) {
                        geoCount["Dataran Sedang"]++;
                    }
                }
            });

            // Konversi hasil ke dalam format yang sesuai untuk Pie Chart
            const chartData = Object.keys(geoCount)
                .filter((key) => geoCount[key] > 0) // Hanya masukkan jika ada data
                .map((key) => ({
                    name: key,
                    value: geoCount[key],
                    color: colors2[key as keyof typeof colors2] // Pastikan TypeScript mengenali key sebagai kunci yang valid
                }));

            setGeo(chartData);
        } catch (error) {
            console.error("Error fetching geographic data:", error);
        }
    };

    useEffect(() => {
        fetchGeoData();
    }, []);

    // Definisikan tipe parameter untuk fungsi label custom
    interface LabelProps {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        name: string;
    }

    // Custom Label agar teks ada di dalam Pie Chart
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: LabelProps) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold" fontFamily="poppins">
                {`${name} ${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Box>
            {/* PIE CHART SEBARAN KLASIFIKASI GEOGRAFIS DESA */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                {/* Judul */}
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Sebaran Klasifikasi Geografis Desa
                </Text>
            </Flex>

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
                {/* Pie Chart */}
                <Flex justify="center" align="center">
                    <PieChart width={320} height={220}>
                        <Pie
                            data={geo}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            dataKey="value"
                            label={renderCustomizedLabel}
                        >
                            {geo.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>

                    {/* Legend */}
                    <Box ml={4}>
                        {geo.map((entry, index) => (
                            <Flex key={index} align="center" mb={1} mr={7} whiteSpace="nowrap">
                                <Box w={2} h={2} bg={entry.color} borderRadius="full" mr={2} />
                                <Text fontSize="10px">{entry.name}</Text>
                            </Flex>
                        ))}
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default SebaranKlasifikasiDashboardDesa;
