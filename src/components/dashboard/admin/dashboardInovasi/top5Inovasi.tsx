import { Box, Flex, Text, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5; // Jumlah data per halaman

const Top5Innovations: React.FC = () => {
    const [chartData, setChartData] = useState<{ name: string; value: number; rank: string }[]>([]);
    const [tableData, setTableData] = useState<{ no: number; name: string; count: number }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Ambil Data Inovasi dari Firestore
    useEffect(() => {
        const fetchInnovations = async () => {
            try {
                const db = getFirestore();
                const innovationsRef = collection(db, "innovations");
                const snapshot = await getDocs(innovationsRef);

                // Ambil data & urutkan DESC berdasarkan jumlahDesaKlaim
                const sortedInnovations = snapshot.docs
                    .map((doc) => ({
                        name: doc.data().namaInovasi as string,
                        count: doc.data().jumlahDesaKlaim as number || 0,
                    }))
                    .sort((a, b) => b.count - a.count); // Urutkan DESC

                // 🔥 Reset nomor urut setelah sorting
                const tableFormatted = sortedInnovations.map((item, index) => ({
                    no: index + 1, // ✅ Nomor urut mengikuti urutan hasil sorting
                    name: item.name,
                    count: item.count,
                }));

                setTableData(tableFormatted);

                // 🔹 Ambil top 5 untuk barchart dengan urutan custom (4, 2, 1, 3, 5)
                const top5 = tableFormatted.slice(0, 5);
                const customOrder = [3, 1, 0, 2, 4];
                const customHeights = [20, 40, 50, 35, 15]; // Custom tinggi batang sesuai ranking (1st - 5th)

                const rankedInnovations = customOrder.map((index, rankIndex) => ({
                    name: top5[index]?.name || "",
                    value: customHeights[rankIndex], // dipakai buat chart
                    rank: `${["4th", "2nd", "1st", "3rd", "5th"][rankIndex]}`,
                }));

                setChartData(rankedInnovations);
            } catch (error) {
                console.error("❌ Error fetching innovation data:", error);
            }
        };

        fetchInnovations();
    }, []);


    // Hitung total halaman
    const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);

    // Data yang akan ditampilkan di halaman saat ini
    const currentData = tableData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    type CustomLabelProps = {
        x: number;
        y: number;
        width: number;
        value: string;
    };

    // Custom Label untuk Chart
    const CustomLabel: React.FC<CustomLabelProps> = ({ x, y, width, value }) => (
        <text x={x + width / 2} y={y + 20} fill="#FFFFFF" fontSize={15} textAnchor="middle" fontWeight="bold">
            {value}
        </text>
    );

    return (
        <Box>
            {/* 🔹 Header Inovasi */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Top 5 Inovasi Terbaik
                </Text>
            </Flex>

            {/* 🔹 Bar Chart (Sama seperti sebelumnya, hanya ganti datanya) */}
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
                            <LabelList dataKey="name" position="top" fontSize="10px" />
                            <LabelList dataKey="rank" content={<CustomLabel x={0} y={0} width={0} value={""} />} />
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* 🔹 Tabel Inovasi (Tidak Ada Perubahan, Hanya Ubah Data) */}
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
                <TableContainer maxWidth="100%" width="auto" borderRadius="md">
                    <Table variant="simple" size="sm">
                        {/* Header Tabel */}
                        <Thead bg="#D1EDE1">
                            <Tr>
                                <Th p={3} fontSize="8px" textAlign="center">No</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Nama Inovasi</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Jumlah Desa Yang Menerapkan</Th>
                            </Tr>
                        </Thead>

                        {/* Body Tabel */}
                        <Tbody>
                            {currentData.map((row) => (
                                <Tr key={row.no}>
                                    <Td p={1} fontSize="8px" textAlign="center" fontWeight="bold">{row.no}</Td>
                                    <Td p={1} fontSize="8px" textAlign="center">{row.name}</Td>
                                    <Td p={1} fontSize="8px" textAlign="center">{row.count}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>

                {/* 🔹 Paginasi */}
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

export default Top5Innovations;
