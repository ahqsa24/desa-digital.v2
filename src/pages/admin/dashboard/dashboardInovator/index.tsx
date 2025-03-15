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
import { firestore } from "../../../../firebase/clientApp";
import { FaSeedling } from "react-icons/fa6";
import redinesImg from "@public/images/rediness.svg";
import { Filter } from "lucide-react";


const DashboardAdminInovator: React.FC = () => {
    //State untuk navigasi page
    const navigate = useNavigate();
    // State untuk menyimpan peran pengguna
    const [userRole, setUserRole] = useState(null);
    // Data statistik statis
    const stats = [
        { label: "Inovator", value: 51 },
        { label: "Desa Dampingan", value: 200 },
    ];
    // Data Pie Chart - 5 Provinsi
    const data = [
        { name: "Pemerintah", value: 21, color: "#A7C7A5" },
        { name: "Akademisi", value: 10, color: "#1E5631" },
        { name: "Swasta", value: 14, color: "#174E3B" },
    ];

    // Data Pie Chart - Klasifikasi Geografis
    const geo = [
        { name: "Dataran Tinggi", value: 15, color: "#A7C7A5" },
        { name: "Dataran Rendah", value: 10, color: "#1E5631" },
        { name: "Dataran Sedang", value: 12, color: "#174E3B" },
    ];

    const bar = [
        { name: "Bantu Desa", value: 10 },
        { name: "Sebumi", value: 15 },
        { name: "e-Fishery", value: 22 },
        { name: "Inagri", value: 14 },
        { name: "Open Desa", value: 12 },
    ];

    // Definisikan interface untuk struktur data tabel
    interface DesaData {
        no: number;
        desa: string;
        status: string;
        jalan: string;
    }

    // Data Tabel
    const desaData: DesaData[] = [
        { no: 1, desa: "Desa Soge", status: "Maju", jalan: "Beraspal penuh" },
        { no: 2, desa: "Desa Ciroke", status: "Berkembang", jalan: "Beraspal sebagian" },
        { no: 3, desa: "Desa Cikajang", status: "Mandiri", jalan: "Beraspal sebagian" },
        { no: 4, desa: "Desa Cibodas", status: "Maju", jalan: "Beraspal penuh" },
        { no: 5, desa: "Desa Dramaga", status: "Tertinggal", jalan: "Beraspal penuh" },
        { no: 6, desa: "Desa Sukajadi", status: "Berkembang", jalan: "Beraspal sebagian" },
        { no: 7, desa: "Desa Tanjungsari", status: "Mandiri", jalan: "Beraspal penuh" },
        { no: 8, desa: "Desa Cikarang", status: "Maju", jalan: "Beraspal penuh" },
        { no: 9, desa: "Desa Rancamaya", status: "Berkembang", jalan: "Beraspal sebagian" },
        { no: 10, desa: "Desa Sindang", status: "Tertinggal", jalan: "Beraspal penuh" },
    ];

    // Konfigurasi jumlah data per halaman
    const ITEMS_PER_PAGE = 5;

    const [currentPage, setCurrentPage] = useState(1);

    // Hitung jumlah total halaman
    const totalPages = Math.ceil(desaData.length / ITEMS_PER_PAGE);

    // Data yang ditampilkan di halaman saat ini
    const currentData = desaData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    // Warna untuk tiap slice biar mirip sama gambar lo
    const COLORS = ["#A9C6B9", "#264D3F", "#315B4E", "#7DA693"];

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
            {/* Top Bar */}
            <TopBar title="Dashboard Inovator" onBack={() => navigate(-1)} />

            <Stack gap="16px" paddingTop="55px" />

            {/* SCORECARD STATISTIK */}
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
            {/* SCORECARD STATISTIK SELESAI */}


            {/* PIE CHART SEBARAN KATEGORI INOVATOR */}
            <Flex justify="space-between" align="center" mt="11px" mx="15px">
                {/* Judul */}
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Sebaran Provinsi Desa Digital
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
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            dataKey="value"
                            label={renderCustomizedLabel} // Menampilkan label persentase di dalam chart
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>

                    {/* Legend */}
                    <Box ml={4}>
                        {data.map((entry, index) => (
                            <Flex key={index} align="center" mb={1} mr={7} whiteSpace="nowrap">
                                <Box w={2} h={2} bg={entry.color} borderRadius="full" mr={2} />
                                <Text fontSize="10px">{entry.name}</Text>
                            </Flex>
                        ))}
                    </Box>
                </Flex>
            </Box>
            {/* PIE CHART SEBARAN KATEGORI INOVATOR SELESAI */}


            {/* TOP 5 INOVATOR TERBAIK */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Top 5 Inovator Terbaik
                </Text>
            </Flex>
            <Box
                bg="white"
                borderRadius="xl"
                pt="15px"
                pb="1px"
                mx="15px"
                boxShadow="md"
                border="2px solid"
                borderColor="gray.200"
                mt={4}
                overflow="visible"
            >
                <ResponsiveContainer width="100%" height={170}>
                    <BarChart data={bar} margin={{ top: 25, right: 20, left: 20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#064E3B">
                            <LabelList dataKey="name" position="top" fontSize="10px" formatter={(name: string) => name.replace(/^Desa\s+/i, "")} />
                            <LabelList
                                dataKey="rank"
                                content={(props) => {
                                    const { x, y, value } = props;
                                    return (
                                        <text x={x} y={y} fill="black" textAnchor="middle" fontSize="10px">
                                            {value}
                                        </text>
                                    );
                                }}
                            />                            {bar.map((entry, index) => (
                                <Cell key={`cell-${index}`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <Box
                bg="white"
                borderRadius="xl"
                pt={0}
                pb={3}
                mx="15px"
                boxShadow="md"
                border="0px solid"
                borderColor="gray.200"
                mt={4}
            >
                {/* Table Container */}
                <TableContainer maxWidth="100%" width="auto" borderRadius="md">
                    <Table variant="simple" size="sm" > {/* Mengurangi ukuran tabel */}
                        {/* Header Tabel */}
                        <Thead bg="#D1EDE1">
                            <Tr>
                                <Th p={3} fontSize="8px" textAlign="center">No</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Desa</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Status Desa</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Infrastruktur Jalan</Th>
                            </Tr>
                        </Thead>

                        {/* Body Tabel */}
                        <Tbody>
                            {currentData.map((row) => (
                                <Tr key={row.no}>
                                    <Td p={1} fontSize="8px" textAlign="center" fontWeight="bold">{row.no}</Td>
                                    <Td p={1} fontSize="8px" textAlign="center">{row.desa}</Td>
                                    <Td p={1} fontSize="8px" textAlign="center">{row.status}</Td>
                                    <Td p={1} fontSize="8px" textAlign="center">{row.jalan}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>

                {/* Paginasi */}
                <Flex justify="center" mt={3} gap={2}>
                    {[...Array(totalPages)].map((_, index) => (
                        <Button
                            key={index}
                            size="xs"
                            borderRadius="full"
                            bg={currentPage === index + 1 ? "gray.800" : "white"}
                            color={currentPage === index + 1 ? "white" : "gray.800"}
                            onClick={() => setCurrentPage(index + 1)}
                            _hover={{ bg: "gray.300" }}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </Flex>
            </Box>
            {/* TOP 5 INOVATOR SELESAI */}
            <Box pb={10} />
        </Box>
    );
};

export default DashboardAdminInovator;