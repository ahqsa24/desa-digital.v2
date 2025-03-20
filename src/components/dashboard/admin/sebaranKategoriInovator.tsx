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

    // 🔹 Ambil Data Inovator Unggulan dari Firestore
    useEffect(() => {
        const fetchTopInovator = async () => {
            try {
                const db = getFirestore();
                const inovatorRef = collection(db, "innovators");
                const snapshot = await getDocs(inovatorRef);

                const inovators = snapshot.docs
                    .map((doc) => ({
                        name: doc.data().namaInovator as string,
                        value: doc.data().jumlahInovasi as number || 0,
                    }))
                    .sort((a, b) => b.value - a.value) // Urutkan dari terbesar ke terkecil
                    .slice(0, 5); // Ambil top 5 inovator

                // Urutan khusus untuk ranking (4, 2, 1, 3, 5)
                const customOrder = [3, 1, 0, 2, 4];

                const rankedInovators = customOrder.map((index, rankIndex) => ({
                    name: inovators[index]?.name || "",
                    value: inovators[index]?.value || 0,
                    rank: `${["4th", "2nd", "1st", "3rd", "5th"][rankIndex]}`,
                }));

                setChartData(rankedInovators);
            } catch (error) {
                console.error("❌ Error fetching top innovators:", error);
            }
        };

        fetchTopInovator();
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

    type CustomLabelProps = {
        x: number;
        y: number;
        width: number;
        value: string;
    };

    interface VillageData {
        rank: string;
        name: string;
        value: number;
    }

    // 🔹 Custom label untuk Chart
    const CustomLabel: React.FC<CustomLabelProps> = ({ x, y, width, value }) => {
        return (
            <text
                x={x + width / 2}
                y={y + 20} // Padding dari atas
                fill="#FFFFFF"
                fontSize={15}
                textAnchor="middle"
                fontWeight="bold"
            >
                {value}
            </text>
        );
    };

    //-----------------DATA TABLE-------------------

    // State untuk data inovator
    const [inovatorData, setInovatorData] = useState<
        { no: number; namaInovator: string; jumlahInovasi: number; jumlahDesaDampingan: number }[]
    >([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Ambil data dari Firestore
    useEffect(() => {
        const fetchInovatorData = async () => {
            try {
                const db = getFirestore();
                const innovatorsRef = collection(db, "innovators");
                const snapshot = await getDocs(innovatorsRef);

                // Fungsi untuk membatasi maksimal 3 kata
                const limitWords = (text: string) => text.split(" ").slice(0, 3).join(" ");

                // Ambil data, urutkan DESC berdasarkan jumlahInovasi, lalu kasih nomor urut yang benar
                const fetchedData = snapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        return {
                            namaInovator: data.namaInovator ? limitWords(data.namaInovator) : "Tidak Ada Nama",
                            jumlahInovasi: data.jumlahInovasi || 0,
                            jumlahDesaDampingan: data.jumlahDesaDampingan || 0,
                        };
                    })
                    .sort((a, b) => b.jumlahInovasi - a.jumlahInovasi) // Urutkan berdasarkan jumlah inovasi DESC
                    .map((item, index) => ({ ...item, no: index + 1 })); // Tambahkan nomor urut mulai dari 1

                setInovatorData(fetchedData);
            } catch (error) {
                console.error("❌ Error fetching innovator data:", error);
            }
        };

        fetchInovatorData();
    }, []);



    // Hitung total halaman
    const totalPages = Math.ceil(inovatorData.length / ITEMS_PER_PAGE);

    // Data yang akan ditampilkan di halaman saat ini
    const currentData = inovatorData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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

            {/* 🔹 Header Inovator Unggulan */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                <Text fontSize="m" fontWeight="bold" color="gray.800">
                    Top 5 Inovator Terbaik
                </Text>
            </Flex>

            <Box
                bg="white"
                borderRadius="xl"
                pt="10px"
                pb="1px"
                mx="15px"
                boxShadow="md"
                border="2px solid"
                borderColor="gray.200"
                mt={4}
                overflow="visible"
            >
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                        <Tooltip cursor={{ fill: "transparent" }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#064E3B">
                            <LabelList
                                dataKey="name"
                                position="top"
                                fontSize="10px"
                                formatter={(name: string) => name.replace(/^Desa\s+/i, "")}
                            />
                            <LabelList dataKey="rank" content={<CustomLabel x={0} y={0} width={0} value={""} />} />
                            {chartData.map((entry, index) => (
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
                                <Th p={1} fontSize="8px" textAlign="center">Nama Inovator</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Jumlah Inovasi</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Jumlah Desa Dampingan</Th>
                            </Tr>
                        </Thead>

                        {/* Body Tabel */}
                        <Tbody>
                            {currentData.map((row) => (
                                <Tr key={row.no}>
                                    <Td p={1} fontSize="8px" textAlign="center" fontWeight="bold">{row.no}</Td>
                                    <Td p={1} fontSize="8px" textAlign="center">{row.namaInovator}</Td>
                                    <Td p={1} fontSize="8px" textAlign="center">{row.jumlahInovasi}</Td>
                                    <Td p={1} fontSize="8px" textAlign="center">{row.jumlahDesaDampingan}</Td>
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
        </Box>
    );
};

export default SebaranKategoriInovator;
