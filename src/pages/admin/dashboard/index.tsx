import { Box, Flex, Stack, Text, Icon, Link as ChakraLink } from "@chakra-ui/react";
import { ArrowUpRight, ArrowDownRight, Leaf, Users, Phone } from "lucide-react";
import Ads from "Components/ads/Ads";
import BestBanner from "Components/banner/BestBanner";
import Container from "Components/container";
import Rediness from "Components/rediness/Rediness";
import SearchBarLink from "Components/search/SearchBarLink";
import TopBar from "Components/topBar";
import Hero from "../../home/components/hero";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";
import VillageActive from 'Assets/icons/village-active.svg';
import { FaUser } from "react-icons/fa";
import { getFirestore, collection, getDocs, doc, getDoc, query, where, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { paths } from "Consts/path";
import { getAuth } from "firebase/auth";
import { firestore } from "../../../firebase/clientApp";
import { FaSeedling } from "react-icons/fa6";
import redinesImg from "@public/images/rediness.svg";


// Kartu Informasi Umum
type InfoCardProps = {
    icon: React.ElementType;
    title: string;
    value: number;
    change: number;
    isIncrease: boolean;
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

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, change, isIncrease }) => {
    return (
        <Flex
            m={3}
            mb={1}
            align="center"
            gap="13px"
            bg="white"
            borderRadius="xl"
            p="15px"
            boxShadow="lg"
            border="2px solid"
            borderColor="gray.200"
            transition="all 0.2s ease-in-out"
            height="100px"
        >
            <Box bg="green.50" p="8px" borderRadius="lg">
                <Icon as={icon} boxSize={6} color="green.500" />
            </Box>
            <Box>
                <Text fontSize="15px" fontWeight="semibold" color="green.700">
                    {title}
                </Text>
                <Flex justify="space-between" align="center" w="full">
                    <Text fontSize="25px" fontWeight="bold" color="green.800" mr={2}>
                        {value}
                    </Text>

                    <Flex align="center" color={isIncrease ? "green.500" : "red.500"}>
                        <Icon as={isIncrease ? ArrowUpRight : ArrowDownRight} boxSize={3} mt={2} />
                        <Text ml="2px" fontWeight="medium" fontSize="14px" mt={2}>
                            {Math.abs(change)} {isIncrease ? "bertambah" : "berkurang"} dari bulan lalu
                        </Text>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

const CustomLabel = ({ x, y, width, value }: CustomLabelProps) => {
    return (
        <text
            x={x + width / 2}
            y={y + 20} // Padding 2px dari ujung atas
            fill="#FFFFFF"
            textAnchor="middle"
            fontWeight="bold"
        >
            {value}
        </text>
    );
};



const DashboardAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null); // State untuk menyimpan peran pengguna
    const [totalVillage, setTotalVillage] = useState(0);
    const [totalInnovators, setTotalInnovators] = useState(0);
    const [totalInnovation, setTotalInnovation] = useState(0);
    const [changeInnovator, setChangeInnovator] = useState(0);
    const [isIncreaseInnovator, setIsIncreaseInnovator] = useState(true);
    const [changeVillage, setChangeVillage] = useState(0);
    const [isIncreaseVillage, setIsIncreaseVillage] = useState(true);
    const [changeInnovation, setChangeInnovation] = useState(0);
    const [isIncreaseInnovation, setIsIncreaseInnovation] = useState(true);
    const [chartData, setChartData] = useState<VillageData[]>([]);

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

        const fetchInnovationCount = async () => {
            try {
                const db = getFirestore();
                const innovationsRef = collection(db, "innovations");

                // Query hanya dokumen dengan inovasiId yang tidak kosong
                const q = query(innovationsRef, where("namaInovasi", "!=", ""));
                const snapshot = await getDocs(q);
                setTotalInnovation(snapshot.size);
            } catch (error) {
                console.error("Error fetching innovation count:", error);
            }
        };

        //Perbandingan jumlah innovator bulan ini dengan bulan sebelumnya
        const fetchInnovatornChange = async () => {
            try {
                const db = getFirestore();
                const innovatorsRef = collection(db, "innovator");

                const now = new Date();
                const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

                // Query untuk data bulan ini
                const thisMonthQuery = query(
                    innovatorsRef,
                    where("createdAt", ">=", Timestamp.fromDate(startOfThisMonth))
                );
                const thisMonthSnapshot = await getDocs(thisMonthQuery);
                const thisMonthCount = thisMonthSnapshot.size;

                // Query untuk data bulan sebelumnya
                const lastMonthQuery = query(
                    innovatorsRef,
                    where("createdAt", ">=", Timestamp.fromDate(startOfLastMonth)),
                    where("createdAt", "<", Timestamp.fromDate(startOfThisMonth))
                );
                const lastMonthSnapshot = await getDocs(lastMonthQuery);
                const lastMonthCount = lastMonthSnapshot.size;

                // Hitung perubahan
                const difference = thisMonthCount - lastMonthCount;
                setChangeInnovator(Math.abs(difference));
                setIsIncreaseInnovator(difference >= 0);

                console.log("Bulan ini:", thisMonthCount, "Bulan lalu:", lastMonthCount);
            } catch (error) {
                console.error("Error fetching innovator change:", error);
            }
        };

        //Perbandingan jumlah desa digital bulan ini dengan bulan sebelumnya
        const fetchVillageChange = async () => {
            try {
                const db = getFirestore();
                const villagesRef = collection(db, "village");

                const now = new Date();
                const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

                // Query untuk data bulan ini
                const thisMonthQuery = query(
                    villagesRef,
                    where("createdAt", ">=", Timestamp.fromDate(startOfThisMonth))
                );
                const thisMonthSnapshot = await getDocs(thisMonthQuery);
                const thisMonthCount = thisMonthSnapshot.size;

                // Query untuk data bulan sebelumnya
                const lastMonthQuery = query(
                    villagesRef,
                    where("createdAt", ">=", Timestamp.fromDate(startOfLastMonth)),
                    where("createdAt", "<", Timestamp.fromDate(startOfThisMonth))
                );
                const lastMonthSnapshot = await getDocs(lastMonthQuery);
                const lastMonthCount = lastMonthSnapshot.size;

                // Hitung perubahan
                const difference = thisMonthCount - lastMonthCount;
                setChangeVillage(Math.abs(difference));
                setIsIncreaseVillage(difference >= 0);

                console.log("Bulan ini:", thisMonthCount, "Bulan lalu:", lastMonthCount);
            } catch (error) {
                console.error("Error fetching village change:", error);
            }
        };

        //Perbandingan jumlah innovation bulan ini dengan bulan sebelumnya
        const fetchInnovationChange = async () => {
            try {
                const db = getFirestore();
                const innovationsRef = collection(db, "innovations");

                const now = new Date();
                const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

                // Query untuk data bulan ini
                const thisMonthQuery = query(
                    innovationsRef,
                    where("createdAt", ">=", Timestamp.fromDate(startOfThisMonth))
                );
                const thisMonthSnapshot = await getDocs(thisMonthQuery);
                const thisMonthCount = thisMonthSnapshot.size;

                // Query untuk data bulan sebelumnya
                const lastMonthQuery = query(
                    innovationsRef,
                    where("createdAt", ">=", Timestamp.fromDate(startOfLastMonth)),
                    where("createdAt", "<", Timestamp.fromDate(startOfThisMonth))
                );
                const lastMonthSnapshot = await getDocs(lastMonthQuery);
                const lastMonthCount = lastMonthSnapshot.size;

                // Hitung perubahan
                const difference = thisMonthCount - lastMonthCount;
                setChangeInnovation(Math.abs(difference));
                setIsIncreaseInnovation(difference >= 0);

                console.log("Bulan ini:", thisMonthCount, "Bulan lalu:", lastMonthCount);
            } catch (error) {
                console.error("Error fetching innovation change:", error);
            }
        };

        const fetchTopVillages = async () => {
            try {
                const db = getFirestore();
                const villageRef = collection(db, "villages");
                const snapshot = await getDocs(villageRef);

                // Ambil data desa dan urutkan berdasarkan jumlahInovasi (desc)
                const villages = snapshot.docs
                    .map((doc) => ({
                        name: doc.data().namaDesa as string,
                        value: doc.data().jumlahInovasi as number || 0,
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5);

                // Urutan khusus untuk ranking (4, 2, 1, 3, 5)
                const customOrder = [3, 1, 0, 2, 4];

                const rankedVillages = customOrder.map((index, rankIndex) => ({
                    name: villages[index]?.name || "",
                    value: villages[index]?.value || 0,
                    rank: `${["4th", "2nd", "1st", "3rd", "5th"][rankIndex]}`,
                }));

                setChartData(rankedVillages);

                console.log("Ranked Villages:", rankedVillages); // Tambahkan log untuk memastikan data

            } catch (error) {
                console.error("Error fetching top villages:", error);
            }
        };

        fetchUserRole();
        fetchInnovatorCount();
        fetchVillageCount(); // Panggil fungsi saat komponen dimuat
        fetchInnovationCount();
        fetchInnovatornChange();
        fetchVillageChange();
        fetchInnovationChange();
        fetchTopVillages();
    }, []);

    return (
        <Box>
            {/* Top Bar */}
            <TopBar
                title="Dashboard" onBack={() => navigate(-1)} />
            <Stack
                gap="16px"
                paddingTop="55px">
            </Stack>
            <Hero
                description="Admin"
                text=""
                customTitle="Selamat Datang"
            />

            <Text fontSize="m" fontWeight="bold" mt="24px" mb="8px" ml="15px" color="gray.700">
                Informasi Umum
            </Text>

            <Stack gap="1px">
                <InfoCard
                    icon={Leaf}
                    title="Desa Digital"
                    value={totalVillage}
                    change={changeVillage}
                    isIncrease={isIncreaseVillage}
                />
                <InfoCard
                    icon={Users}
                    title="Innovator"
                    value={totalInnovators}
                    change={changeInnovator}
                    isIncrease={isIncreaseInnovator}
                />
                <InfoCard
                    icon={Phone}
                    title="Inovasi"
                    value={totalInnovation}
                    change={changeInnovation}
                    isIncrease={isIncreaseInnovation}
                />
            </Stack>
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                <Text fontSize="m" fontWeight="bold" color="gray.800">
                    Desa Digital Unggulan
                </Text>
                <ChakraLink
                    as={NavLink}
                    to={userRole === "admin" ? paths.ADMIN_DASHBOARD : paths.VILLAGE_DASHBOARD}
                    fontSize="sm"
                    color="gray.500"
                    textDecoration="underline"
                >
                    Lihat Dashboard
                </ChakraLink>
            </Flex>

            <Box
                bg="white"
                borderRadius="xl"
                pt="50px"
                pb="1px"
                mx="15px"
                boxShadow="md"
                border="2px solid"
                borderColor="gray.200"
                mt={4}
                overflow="visible"
            >
                <ResponsiveContainer width="100%" height={170}>
                    <BarChart data={chartData} margin={{ top: 25, right: 20, left: 20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#064E3B">
                            <LabelList dataKey="name" position="top" fontSize="10px" formatter={(name: string) => name.replace(/^Desa\s+/i, "")} />
                            <LabelList dataKey="rank" content={<CustomLabel x={0} y={0} width={0} value={""} />} />
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <Flex justify="space-between" align="center" mt="24px" mx="15px">
                <Text fontSize="m" fontWeight="bold" color="gray.800">
                    Inovator Unggulan
                </Text>
                <ChakraLink
                    as={NavLink}
                    to={userRole === "admin" ? paths.ADMIN_DASHBOARD : paths.VILLAGE_DASHBOARD}
                    fontSize="sm"
                    color="gray.500"
                    textDecoration="underline"
                >
                    Lihat Dashboard
                </ChakraLink>
            </Flex>
            <Box
                bg="white"
                borderRadius="xl"
                pt="50px"
                pb="1px"
                mx="15px"
                boxShadow="md"
                border="2px solid"
                borderColor="gray.200"
                mt={4}
                overflow="visible"
            >
                <ResponsiveContainer width="100%" height={170}>
                    <BarChart data={chartData} margin={{ top: 25, right: 20, left: 20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#064E3B">
                            <LabelList dataKey="name" position="top" fontSize="10px" formatter={(name: string) => name.replace(/^Desa\s+/i, "")} />
                            <LabelList dataKey="rank" content={<CustomLabel x={0} y={0} width={0} value={""} />} />
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>


        </Box>
    );
};

export default DashboardAdmin;
