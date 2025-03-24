import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Icon, useColorModeValue, Image } from "@chakra-ui/react";
import { FaUser, FaUsers } from "react-icons/fa";
import InnovationActive from "Assets/icons/innovation.svg";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface CardItemProps {
    icon: React.ReactNode;
    mainText: string;
    subText: string;
    label: string;
}

const CardItem: React.FC<CardItemProps> = ({ icon, mainText, subText, label }) => {
    const cardBg = useColorModeValue("white", "gray.800");
    const iconBg = useColorModeValue("rgba(52, 115, 87, 0.2)", "green.700");
    const textSecondary = useColorModeValue("gray.500", "gray.400");

    return (
        <Box
            bg={cardBg}
            p={4}
            mt={5}
            ml={4}
            boxShadow="md"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            w="100%"
            maxW="150px">
            <Flex justify="space-between" align="center">
                <Text fontSize="23px" fontWeight="bold">
                    {mainText}
                </Text>
                <Box bg={iconBg} w={9} h={9} display="flex" alignItems="center" justifyContent="center" borderRadius="full">
                    {icon}
                </Box>

            </Flex>
            <Text mt={1.9} fontSize="15px" fontWeight="semibold">
                {label}
            </Text>
            <Text fontSize="7px" color={textSecondary}>
                {subText}
            </Text>
        </Box>
    );
};

const TwoCard: React.FC = () => {
    const [totalInovasi, setTotalInovasi] = useState("0/0");
    const [totalInovator, setTotalInovator] = useState("0/0");

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore();

            try {
                const inovasiSnap = await getDocs(collection(db, "innovations"));
                const totalAllInovasi = inovasiSnap.size;
                const desaInovasi = inovasiSnap.docs.filter(doc => doc.data().desa === "Babakan");
                setTotalInovasi(`${desaInovasi.length}/${totalAllInovasi}`);

                const innovatorSnap = await getDocs(collection(db, "innovators"));
                const totalAllInnovators = innovatorSnap.size;
                const desaInnovators = innovatorSnap.docs.filter(doc => doc.data().desa === "Babakan");
                setTotalInovator(`${desaInnovators.length}/${totalAllInnovators}`);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Flex direction={{ base: "column", md: "row" }} gap={2}>
            <CardItem
                icon={<Image src={InnovationActive} alt="Innovation Icon" w={5} h={5} />}
                mainText={totalInovasi}
                label="Inovasi"
                subText="Telah diterapkan oleh desa Babakan"
            />
            <CardItem
                icon={<FaUsers size={20} color="#347357"/>}
                mainText={totalInovator}
                label="Inovator"
                subText="Telah memberikan inovasi untuk desa Babakan"
            />
        </Flex>
    );
};

export default TwoCard;