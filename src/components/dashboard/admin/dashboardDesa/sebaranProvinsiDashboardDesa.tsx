import { Box, Flex, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, SimpleGrid, Checkbox, useDisclosure } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SebaranProvinsiDashboardDesa: React.FC = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [provinceData, setProvinceData] = useState<{ name: string; count: number }[]>([]);
    const [filteredData, setFilteredData] = useState(provinceData);
    const [markers, setMarkers] = useState<{ [key: string]: { lat: number; lon: number } }>({});

    // Fetch koordinat provinsi dari Nominatim API
    async function getCoordinates(provinsi: string) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(provinsi + ", Indonesia")}`
            );
            const data = await response.json();
            if (data.length > 0) {
                return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
        return null;
    }

    // Fetch data desa dari Firestore
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

            const chartData = Object.keys(provinceCount).map((province) => ({
                name: province,
                count: provinceCount[province],
            }));

            setProvinceData(chartData);
            setFilteredData(chartData);
        } catch (error) {
            console.error("Error fetching province data:", error);
        }
    };

    useEffect(() => {
        fetchProvinceData();
    }, []);

    useEffect(() => {
        async function fetchCoordinates() {
            const newMarkers: { [key: string]: { lat: number; lon: number } } = {};
            for (const item of provinceData) {
                if (!newMarkers[item.name]) {
                    const coords = await getCoordinates(item.name);
                    if (coords) {
                        newMarkers[item.name] = coords;
                    }
                }
            }
            setMarkers(newMarkers);
        }

        fetchCoordinates();
    }, [provinceData]);

    // Daftar Provinsi untuk Filter
    const provinces = provinceData.map((d) => d.name);

    // Fungsi untuk menangani perubahan checkbox filter
    const handleCheckboxChange = (provinsi: string) => {
        setSelectedProvinces((prev) =>
            prev.includes(provinsi) ? prev.filter((p) => p !== provinsi) : [...prev, provinsi]
        );
    };

    // Terapkan Filter ke Peta
    const applyFilter = () => {
        if (selectedProvinces.length === 0) {
            setFilteredData(provinceData);
        } else {
            setFilteredData(provinceData.filter((item) => selectedProvinces.includes(item.name)));
        }
        onClose();
    };

    return (
        <Box>
            {/* HEADER + FILTER BUTTON */}
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    Sebaran Provinsi Desa Digital
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
                    onClick={onOpen}
                >
                    <Text fontSize="10px" fontWeight="medium" color="black">
                        Provinsi
                    </Text>
                </Button>
            </Flex>

            {/* LEAFLET MAP */}
            <Box
                bg="white"
                borderRadius="xl"
                pt="5px"
                pb="1px"
                mx="15px"
                boxShadow="md"
                borderColor="gray.200"
                mt={4}
                overflow="hidden"
            >
                <MapContainer center={[-2.5, 118]} zoom={3} style={{ height: "250px", width: "100%", borderRadius:"10px" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredData.map((item, index) => {
                        const coords = markers[item.name];
                        if (!coords) return null;
                        return (
                         <Marker key={index} position={[coords.lat, coords.lon]}>
                                <Popup>
                                    <Text fontSize="sm" fontWeight="bold">{item.name}</Text>
                                    <Text fontSize="xs">Total Desa: {item.count}</Text>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </Box>

            {/* MODAL FILTER PROVINSI */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="xl" p={4} width={350} overflowY="auto">
                    <ModalHeader fontSize="lg" fontWeight="bold">Filter Provinsi</ModalHeader>
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
                        <Button bg="#1E5631" color="white" width="100%" _hover={{ bg: "#16432D" }} onClick={applyFilter}>
                            Terapkan Filter
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default SebaranProvinsiDashboardDesa;
