import { Box, Flex, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, SimpleGrid, Checkbox } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const SebaranKategoriInnovations: React.FC = () => {
    const [kategoriData, setKategoriData] = useState<{ name: string; value: number; color: string }[]>([]);
    const [filteredData, setFilteredData] = useState<{ name: string; value: number; color: string }[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Warna untuk tiap kategori inovasi
    const colors: string[] = ["#A7C7A5", "#1E5631", "#174E3B", "#4A7C59", "#7B9E89"];

    // Fungsi untuk mengambil data kategori dari Firestore
    const fetchKategoriData = async () => {
        try {
            const db = getFirestore();
            const innovationsRef = collection(db, "innovations");
            const snapshot = await getDocs(innovationsRef);

            const kategoriCount: Record<string, number> = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.kategori) {
                    const kategoriText = data.kategori.trim(); // Normalisasi teks

                    if (kategoriCount[kategoriText]) {
                        kategoriCount[kategoriText]++;
                    } else {
                        kategoriCount[kategoriText] = 1;
                    }
                }
            });

            // Konversi hasil ke format Pie Chart, hanya ambil 5 kategori teratas
            const sortedData = Object.entries(kategoriCount)
                .sort((a, b) => b[1] - a[1]) // Urutkan dari jumlah terbesar
                .slice(0, 5) // Ambil hanya 5 kategori teratas
                .map(([key, value], index) => ({
                    name: key,
                    value: value,
                    color: colors[index % colors.length],
                }));

            setKategoriData(sortedData);
            setFilteredData(sortedData);
            setAllCategories(Object.keys(kategoriCount)); // Simpan semua kategori untuk filter
            setSelectedCategories(Object.keys(kategoriCount).slice(0, 5)); // Pilih default 5 kategori teratas
        } catch (error) {
            console.error("❌ Error fetching category data:", error);
        }
    };

    useEffect(() => {
        fetchKategoriData();
    }, []);

    // Fungsi untuk menerapkan filter berdasarkan kategori yang dipilih
    const applyFilter = () => {
        const filtered = kategoriData.filter((item) => selectedCategories.includes(item.name));
        setFilteredData(filtered);
        setIsOpen(false);
    };

    // Fungsi untuk menangani perubahan checkbox pada filter
    const handleCheckboxChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
        );
    };

    // Custom Label agar teks ada di dalam Pie Chart
    interface LabelProps {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        name: string;
    }

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
            {/* HEADER DAN FILTER BUTTON */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Sebaran Kategori Inovasi
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
                    leftIcon={<Filter size={14} stroke="#1E5631" fill="#1E5631" />}
                    onClick={() => setIsOpen(true)}
                >
                    <Text fontSize="10px" fontWeight="medium" color="black">
                        Kategori
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
                {/* Pie Chart */}
                <Flex justify="center" align="center">
                    <PieChart width={320} height={220}>
                        <Pie
                            data={filteredData}
                            cx="55%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={130}
                            dataKey="value"
                            label={renderCustomizedLabel} // Menampilkan label persentase di dalam chart
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

            {/* MODAL FILTER KATEGORI */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="xl" p={4} width={350} overflowY="auto">
                    <ModalHeader fontSize="lg" fontWeight="bold">Filter Kategori</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={3}>
                            {allCategories.map((category) => (
                                <Checkbox
                                    key={category}
                                    isChecked={selectedCategories.includes(category)}
                                    onChange={() => handleCheckboxChange(category)}
                                >
                                    {category}
                                </Checkbox>
                            ))}
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg="#1E5631" color="white" width="100%" _hover={{ bg: "#16432D" }} onClick={applyFilter}>
                            Terapkan Filter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default SebaranKategoriInnovations;
