import { Box, Flex, Stack, Text, Grid, Badge, IconButton, Link as ChakraLink, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { ArrowUpRight, ArrowDownRight, Leaf, Users, Phone, Icon } from "lucide-react";
import TopBar from "Components/topBar";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList, ScatterChart, Scatter, ZAxis, Pie, PieChart, Legend } from "recharts";
import VillageActive from 'Assets/icons/village-active.svg';
import { FaUser } from "react-icons/fa";
import { getFirestore, collection, getDocs, doc, getDoc, query, where, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { paths } from "Consts/path";
import { getAuth } from "firebase/auth";
import { FaSeedling } from "react-icons/fa6";
import redinesImg from "@public/images/rediness.svg";
import { Filter } from "lucide-react";

const ITEMS_PER_PAGE = 5; // Jumlah data per halaman

const SebaranKategoriInovator: React.FC = () => {
    const navigate = useNavigate();
    const [kategoriData, setKategoriData] = useState<{ name: string; value: number; color: string }[]>([]);
    const [chartData, setChartData] = useState<{ name: string; value: number; rank: string }[]>([]);

    // Warna khusus untuk tiap kategori inovator
    const colors: string[] = ["#A7C7A5", "#1E5631", "#174E3B", "#FF8C00", "#FF5733", "#6A5ACD"];

    // 🔹 Ambil Data Kategori Inovator dari Firestore
    useEffect(() => {
        const fetchKategoriData = async () => {
            try {
                const db = getFirestore();
                const innovatorsRef = collection(db, "innovators");
                const snapshot = await getDocs(innovatorsRef);

                const kategoriCount: Record<string, number> = {};

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.kategori) {
                        const kategori = data.kategori.trim();
                        kategoriCount[kategori] = (kategoriCount[kategori] || 0) + 1;
                    }
                });

                // **Ambil hanya 3 kategori teratas**
                const sortedKategori = Object.entries(kategoriCount)
                    .sort((a, b) => b[1] - a[1]) // Urutkan dari terbesar ke terkecil
                    .slice(0, 3) // Ambil hanya 3 kategori teratas
                    .map(([key, value], index) => ({
                        name: key,
                        value,
                        color: colors[index % colors.length], // Pilih warna dari daftar
                    }));

                setKategoriData(sortedKategori);
            } catch (error) {
                console.error("❌ Error fetching kategori data:", error);
            }
        };

        fetchKategoriData();
    }, []);


    // 🔹 Custom Label di dalam Pie Chart
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
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
            {/* 🔹 PIE CHART SEBARAN KATEGORI INOVATOR */}
            <Flex justify="space-between" align="center" mt="11px" mx="15px">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Sebaran Kategori Inovator (Top 3)
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
                <Flex justify="center" align="center">
                    <PieChart width={320} height={220}>
                        <Pie
                            data={kategoriData}
                            cx="55%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={130}
                            dataKey="value"
                            label={renderCustomizedLabel}
                        >
                            {kategoriData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>

                    <Box ml={4}>
                        {kategoriData.map((entry, index) => (
                            <Flex key={index} align="center" mb={1} mr={3} whiteSpace="nowrap">
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

export default SebaranKategoriInovator;
