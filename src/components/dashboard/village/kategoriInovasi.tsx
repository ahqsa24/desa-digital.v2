import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Select, ModalFooter } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, LabelList, Cell } from "recharts";
import { DownloadIcon } from "@chakra-ui/icons"; // Import icon

type ChartData = {
    valueAsli: any;
    name: string;
    value: number;
    rank: string;
};

type CustomLabelProps = {
    x: number;
    y: number;
    width: number;
    value: string;
};

// 🔹 Custom label persis kayak DesaDigitalUnggulan
const CustomLabel: React.FC<CustomLabelProps> = ({ x, y, width, value }) => {
    return (
        <text
            x={x + width / 2}
            y={y + 20}
            fill="#FFFFFF"
            fontSize={15}
            textAnchor="middle"
            fontWeight="bold"
        >
            {value}
        </text>
    );
};

const KategoriInovasiDesa: React.FC = () => {
    const [barData, setBarData] = useState<ChartData[]>([]);
    const [allKategoriData, setAllKategoriData] = useState<Record<string, number>>({});
    const [kondisiData, setKondisiData] = useState<{ kategori: string; jumlah: number }[]>([]);
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);


    const fetchKategoriData = async () => {
        try {
            const db = getFirestore();
            const innovationsRef = collection(db, "innovations");
            const snapshot = await getDocs(innovationsRef);

            const kategoriCount: Record<string, number> = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                const kategori = data.kategori;

                if (kategori && typeof kategori === "string") {
                    const formatted = kategori.charAt(0).toUpperCase() + kategori.slice(1).toLowerCase();
                    kategoriCount[formatted] = (kategoriCount[formatted] || 0) + 1;
                }
            });

            setAllKategoriData({ ...kategoriCount });

            const kondisiArray = Object.keys(kategoriCount)
                .map((key) => ({
                    kategori: key,
                    jumlah: kategoriCount[key],
                }))
                .sort((a, b) => b.jumlah - a.jumlah);

            setKondisiData(kondisiArray);

            // Chart top 5 logic
            const sortedKategori = Object.keys(kategoriCount)
                .map((name) => ({ name, value: kategoriCount[name] }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5);

            const customOrder = [3, 1, 0, 2, 4];
            const customHeights = [20, 40, 50, 35, 15];
            const customRanks = ["4th", "2nd", "1st", "3rd", "5th"];

            const rankedData = customOrder.map((index, rankIndex) => ({
                name: sortedKategori[index]?.name || "",
                value: customHeights[rankIndex],
                valueAsli: sortedKategori[index]?.value || 0,
                rank: customRanks[rankIndex],
            }));

            setBarData(rankedData);
        } catch (error) {
            console.error("Error fetching kategori data:", error);
        }
    };


    const handleDownload = () => {
        const sorted = Object.entries(allKategoriData)
            .map(([name, count]) => ({ name, value: count as number }))
            .sort((a, b) => b.value - a.value);

        const excelData = sorted.map((item, index) => ({
            No: index + 1,
            Kategori: item.name,
            "Jumlah Desa": item.value,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "PotensiDesa");

        XLSX.writeFile(workbook, "Sebaran_Semua_Potensi_Desa.xlsx");
    };

    useEffect(() => {
        fetchKategoriData();
    }, []);

    const totalPages = Math.ceil(kondisiData.length / ITEMS_PER_PAGE);

    return (
        <Box>
            {/* 🔹 Header */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Kategori Inovasi yang Diterapkan
                </Text>
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
                    onClick={handleDownload}
                ><DownloadIcon boxSize={3} color="black" /> {/* Tambahin Icon */}
                    <Text fontSize="10px" fontWeight="medium" color="black">
                        Download
                    </Text>
                </Button>
            </Flex>

            {/* 🔹 Chart */}
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
                    <BarChart data={barData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                        <Tooltip cursor={{ fill: "transparent" }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#1E5631">
                            <LabelList
                                dataKey="name"
                                position="top"
                                fontSize="10px"
                                formatter={(name: string) => name.replace(/^Desa\s+/i, "")}
                            />
                            <LabelList
                                dataKey="rank"
                                content={<CustomLabel x={0} y={0} width={0} value={""} />}
                            />
                            {barData.map((_, index) => (
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
                    <Table variant="simple" size="sm"> {/* Mengurangi ukuran tabel */}
                        {/* Header Tabel */}
                        <Thead bg="#D1EDE1">
                            <Tr>
                                <Th p={3} fontSize="8px" textAlign="center">No</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Kategori Potensi</Th>
                                <Th p={1} fontSize="8px" textAlign="center">Jumlah</Th>
                            </Tr>
                        </Thead>

                        {/* Body Tabel */}
                        <Tbody>
                            {kondisiData
                                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                                .map((row, index) => (
                                    <Tr key={index}>
                                        <Td p={1} fontSize="8px" textAlign="center" fontWeight="bold">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </Td>
                                        <Td p={1} fontSize="8px" textAlign="center">{row.kategori}</Td>
                                        <Td p={1} fontSize="8px" textAlign="center">{row.jumlah}</Td>
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

export default KategoriInovasiDesa;
