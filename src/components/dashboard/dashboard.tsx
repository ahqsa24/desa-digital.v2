import { Box, Flex, Text, Image, Link, Button } from "@chakra-ui/react";
import VillageActive from 'Assets/icons/village-active.svg';
import { FaUser } from "react-icons/fa";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { paths } from "Consts/path";
import { getAuth } from "firebase/auth";
import { firestore } from "../../firebase/clientApp";
import { FaSeedling } from "react-icons/fa6";
import redinesImg from "@public/images/rediness.svg";


const Dashboard = () => {

    //Get Total Desa
    const [userRole, setUserRole] = useState(null); // State untuk menyimpan peran pengguna
    const [totalVillage, setTotalVillage] = useState(0);
    const [totalInnovators, setTotalInnovators] = useState(0);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (currentUser) {
                    const userRef = doc(firestore, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUserRole(userSnap.data()?.role); // Set userRole dari Firestore
                    }
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        };

        const fetchInnovatorCount = async () => {
            try {
                const db = getFirestore(); // Dapatkan instance Firestore
                const innovatorsRef = collection(db, "innovators"); // Referensi ke koleksi "innovators"
                const snapshot = await getDocs(innovatorsRef); // Ambil semua dokumen
                setTotalInnovators(snapshot.size); // Set jumlah inovator
            } catch (error) {
                console.error("Error fetching innovator count:", error);
            }
        };

        const fetchVillageCount = async () => {
            try {
                const db = getFirestore();
                const villageRef = collection(db, "villages");
                const snapshot = await getDocs(villageRef);
                const validVillages = snapshot.docs.filter((doc) => {
                    const data = doc.data();
                    return data.namaDesa && data.namaDesa.length > 1;
                });
                setTotalVillage(validVillages.length);
            } catch (error) {
                console.error("Error fetching village count:", error);
            }
        };

        fetchUserRole();
        fetchInnovatorCount();
        fetchVillageCount(); // Panggil fungsi saat komponen dimuat
    }, []);

    const data = [
        { label: "Desa Digital", value: totalVillage, icon: <Box bg="rgba(52, 115, 87, 0.2)" borderRadius="full" p={2}><Image src={VillageActive} w={5} h={5} alt="Village Icon" /></Box> },
        { label: "Inovator", value: totalInnovators, icon: <Box bg="rgba(52, 115, 87, 0.2)" borderRadius="full" p={2}><FaUser size="20px" color="#347357" /> </Box> },
    ];

    return (
        <Box p={4}>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="17" fontWeight="bold" color="gray.700">
                    Dashboard
                </Text>
                <Link
                    as={NavLink}
                    to={userRole === "admin" ? paths.ADMIN_DASHBOARD : paths.VILLAGE_DASHBOARD}
                    fontSize="sm"
                    color="gray.500"
                    textDecoration="underline"
                >
                    Selengkapnya
                </Link>
            </Flex>
            <Flex gap={4}>
                {data.map((item, index) => (
                    <Box
                        key={index}
                        p={4}
                        bg="white"
                        boxShadow="md"
                        borderRadius="lg"
                        flex="1"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                {item.value}
                            </Text>
                            <Text fontSize="sm" color="gray.500" alignItems="center">
                                {item.label}
                            </Text>
                        </Box>
                        {item.icon}
                    </Box>
                ))}
            </Flex>
            {userRole === 'village' && (
                <Box
                    mt={4}
                    p={6}
                    bg="white"
                    boxShadow="md"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                    position="relative"
                    overflow="hidden"
                >
                    {/* Konten di atas background */}
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                        Inovasi digital terbaik untuk desamu
                    </Text>
                    <Flex alignItems="center" mb={1}>
                        <Box borderRadius="full" p={1} mr={2}>
                            <FaSeedling color="green" size="30px" />
                        </Box>
                        <Box>
                            <Text fontSize="md" fontWeight="bold" color="green.700">
                                eFeeder
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Innovator: eFishery
                            </Text>
                        </Box>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center" mb={2} mt={4}>
                        <Text fontSize="10px" color="gray.500">
                            Cek rekomendasi inovasi digital lainnya untuk desamu disini
                        </Text>
                        <Button
                            colorScheme="green"
                            size="xs"
                            p={1}
                            borderRadius="md"
                            minW="auto"
                            h="20px"
                        >
                            Lihat Rekomendasi
                        </Button>
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
