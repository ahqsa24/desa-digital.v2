import React from "react";
import { Box, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { IconType } from "react-icons"; // penting nih buat tipe icon!
import { LuSmartphoneNfc } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { FaSeedling, FaUser } from "react-icons/fa6";


interface CardItemProps {
    icon: IconType;
    mainText: string;
    subText: string;
    label: string;
}

const CardItem: React.FC<CardItemProps> = ({ icon, mainText, subText, label }) => {
    const cardBg = useColorModeValue("white", "gray.800");
    const iconBg = useColorModeValue("green.100", "green.700");
    const iconColor = useColorModeValue("green.700", "green.200");
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
                <Box bg={iconBg} p={2} borderRadius="full">
                    <Icon as={icon} w={4} h={4} color={iconColor} />
                </Box>
            </Flex>
            <Text mt={2} fontSize="15px" fontWeight="semibold">
                {label}
            </Text>
            <Text fontSize="7px" color={textSecondary}>
                {subText}
            </Text>
        </Box>
    );
};

const TwoCard: React.FC = () => {
    return (
        <Flex direction={{ base: "column", md: "row" }} gap={2}>
            <CardItem
                icon={LuSmartphoneNfc}
                mainText="23/121"
                label="Inovasi"
                subText="Telah diterapkan oleh desa Babakan"
            />
            <CardItem
                icon={FaUsers}
                mainText="12/47"
                label="Inovator"
                subText="Telah memberikan inovasi untuk desa Babakan"
            />
        </Flex>
    );
};

export default TwoCard;
