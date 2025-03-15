import { Box, Flex, Stack, Text, Grid, Badge, IconButton, Link as ChakraLink, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, SimpleGrid, Checkbox, ModalFooter } from "@chakra-ui/react";
import { ArrowUpRight, ArrowDownRight, Leaf, Users, Phone, Icon, SlidersHorizontal } from "lucide-react";
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



const DashboardAdminDesa: React.FC = () => {
    //State untuk navigasi page
    const navigate = useNavigate();
    // State untuk menyimpan peran pengguna
    const [userRole, setUserRole] = useState(null);
    // Data statistik statis
    const stats = [
        { label: "Desa Digital", value: 100 },
        { label: "Provinsi", value: 23 },
        { label: "Kabupaten", value: 50 },
        { label: "Kecamatan", value: 120 },
    ];
    // Data Pie Chart - 5 Provinsi
    const data = [
        { name: "Jawa Barat", value: 10, color: "#A7C7A5" },
        { name: "Jakarta", value: 10, color: "#1E5631" },
        { name: "Jawa Timur", value: 20, color: "#174E3B" },
        { name: "Jawa Tengah", value: 35, color: "#C1D6C3" },
    ];

    // Daftar Provinsi untuk Filter
    const provinces = ["Jawa Barat", "Jakarta", "Jawa Timur", "Jawa Tengah"];

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState(data);

    // Fungsi untuk menangani perubahan checkbox filter
    const handleCheckboxChange = (provinsi: string) => {
        setSelectedProvinces((prev) =>
            prev.includes(provinsi) ? prev.filter((p) => p !== provinsi) : [...prev, provinsi]
        );
    };

    // Terapkan Filter ke Pie Chart
    const applyFilter = () => {
        if (selectedProvinces.length === 0) {
            setFilteredData(data); // Jika tidak ada yang dipilih, tampilkan semua data
        } else {
            setFilteredData(data.filter((item) => selectedProvinces.includes(item.name)));
        }
        onClose();
    };


    // Data Pie Chart - Klasifikasi Geografis
    const geo = [
        { name: "Dataran Tinggi", value: 15, color: "#A7C7A5" },
        { name: "Dataran Rendah", value: 10, color: "#1E5631" },
        { name: "Dataran Sedang", value: 12, color: "#174E3B" },
    ];

    const bar = [
        { name: "Pertanian", value: 10 },
        { name: "Perikanan", value: 15 },
        { name: "Peternakan", value: 22 },
        { name: "Ekowisata", value: 14 },
        { name: "Pariwisata", value: 12 },
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


    type TopBarProps = {
        title: string | undefined;
        onBack?: () => void;
        onFilterClick?: () => void; // Tambahkan fungsi untuk membuka modal filter
    };


    return (
        <Box>
            {/* Top Bar */}
            <TopBar title="Dashboard Desa" onBack={() => navigate(-1)} />

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
                                    <Text color="gray.600">{stat.label}</Text>
                                </Flex>
                            </Box>
                        ))}
                    </Grid>
                </Box>
            </Stack>
            {/* SCORECARD STATISTIK SELESAI */}


            {/* PIE CHART SEBARAN PROVINSI DESA */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                {/* Judul */}
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Sebaran Provinsi Desa Digital
                </Text>

                {/* Tombol Filter */}
                <Button
                    bg="white"
                    boxShadow="md"
                    border="2px solid"
                    borderColor="gray.200"
                    px={2}
                    py={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                    leftIcon={<Filter size={14} stroke="#1E5631" fill="#1E5631" />}
                    onClick={onOpen} // Menampilkan modal filter
                >
                    <Text fontSize="10px" fontWeight="medium" color="black">
                        Provinsi
                    </Text>
                </Button>
            </Flex>

            {/* PIE CHART */}
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
                            data={filteredData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            dataKey="value"
                            label={renderCustomizedLabel}
                        >
                            {filteredData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>

                    {/* Legend */}
                    <Box ml={4}>
                        {filteredData.map((entry, index) => (
                            <Flex key={index} align="center" mb={1} mr={7} whiteSpace="nowrap">
                                <Box w={2} h={2} bg={entry.color} borderRadius="full" mr={2} />
                                <Text fontSize="10px">{entry.name}</Text>
                            </Flex>
                        ))}
                    </Box>
                </Flex>
            </Box>

            {/* MODAL FILTER PROVINSI */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="xl" p={4}>
                    <ModalHeader fontSize="lg" fontWeight="bold">
                        Filter Provinsi
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <SimpleGrid columns={2} spacing={3}>
                            {provinces.map((provinsi) => (
                                <Checkbox
                                    key={provinsi}
                                    isChecked={selectedProvinces.includes(provinsi)}
                                    onChange={() => handleCheckboxChange(provinsi)}
                                >
                                    {provinsi}
                                </Checkbox>
                            ))}
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            bg="#1E5631"
                            color="white"
                            width="100%"
                            _hover={{ bg: "#16432D" }}
                            onClick={applyFilter} // Terapkan filter ke Pie Chart
                        >
                            Terapkan Filter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* PIE CHART SEBARAN PROVINSI DESA SELESAI */}

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
                        {geo.map((entry, index) => (
                            <Flex key={index} align="center" mb={1} mr={7} whiteSpace="nowrap">
                                <Box w={2} h={2} bg={entry.color} borderRadius="full" mr={2} />
                                <Text fontSize="10px">{entry.name}</Text>
                            </Flex>
                        ))}
                    </Box>
                </Flex>
            </Box>
            {/* PIE CHART SEBARAN KLASIFIKASI GEOGRAFIS DESA SELESAI */}

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
                    <BarChart data={bar} margin={{ top: 50, right: 40, left: 20, bottom: 0 }} barSize={20}>
                        <XAxis dataKey="name" tick={{ fontSize: 6 }} angle={0} textAnchor="middle" interval={0} />
                        <YAxis label={{ value: "Jumlah Desa", angle: -90, position: "insideLeft", fontSize: 12 }} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1E5631" radius={[0, 0, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            {/* BAR CHART POTENSI DESA SELESAI*/}

            {/* TABEL SEBARAN KONDISI DESA */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                {/* Judul */}
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Sebaran Kondisi Desa
                </Text>

                {/* Tombol Filter */}
                <Button
                    bg="white"
                    boxShadow="md"
                    border="2px solid"
                    borderColor="gray.200"
                    px={2}
                    py={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                    leftIcon={<Filter size={14} stroke="#1E5631" fill="#1E5631" />}                >
                    <Text fontSize="11px" fontWeight="medium" color="black">
                        Wilayah
                    </Text>
                </Button>
            </Flex>

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
            <Box pb={10} />
        </Box >
    );
};

export default DashboardAdminDesa;