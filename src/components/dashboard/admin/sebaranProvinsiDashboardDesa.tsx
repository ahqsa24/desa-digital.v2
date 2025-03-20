import { Box, Flex, Text, Stack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, SimpleGrid, Checkbox, useDisclosure } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SebaranProvinsiDashboardDesa: React.FC = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // State untuk filter provinsi
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);
    const [filteredData, setFilteredData] = useState(data);
    const colors = ["#A7C7A5", "#1E5631", "#174E3B", "#C1D6C3", "#88B04B"];

    // Fetch Data dari Firestore
    const fetchProvinceData = async () => {
        try {
            const db = getFirestore();
            const villagesRef = collection(db, "villages");
            const snapshot = await getDocs(villagesRef);

            const provinceCount: { [key: string]: number } = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.lokasi?.provinsi?.label) {
                    const province = data.lokasi.provinsi.label;
                    provinceCount[province] = (provinceCount[province] || 0) + 1;
                }
            });

            const chartData = Object.keys(provinceCount).map((province, index) => ({
                name: province,
                value: provinceCount[province],
                color: colors[index % colors.length],
            }));

            setData(chartData);
            setFilteredData(chartData);
        } catch (error) {
            console.error("Error fetching province data:", error);
        }
    };

    useEffect(() => {
        fetchProvinceData();
    }, []);

    // Daftar Provinsi untuk Filter
    const provinces = data.map((d) => d.name);

    // Fungsi untuk menangani perubahan checkbox filter
    const handleCheckboxChange = (provinsi: string) => {
        setSelectedProvinces((prev) =>
            prev.includes(provinsi) ? prev.filter((p) => p !== provinsi) : [...prev, provinsi]
        );
    };

    // Terapkan Filter ke Pie Chart
    const applyFilter = () => {
        if (selectedProvinces.length === 0) {
            setFilteredData(data);
        } else {
            setFilteredData(data.filter((item) => selectedProvinces.includes(item.name)));
        }
        onClose();
    };

    // Custom Label untuk Pie Chart
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
                <ModalContent borderRadius="xl" p={4} width={350} overflowY="auto">
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
                            onClick={applyFilter}
                        >
                            Terapkan Filter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default SebaranProvinsiDashboardDesa;
    