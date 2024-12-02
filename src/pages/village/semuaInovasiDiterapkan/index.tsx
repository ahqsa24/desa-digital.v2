import React from "react";
import { Flex, Text, SimpleGrid, Box } from "@chakra-ui/react";
import CardInnovation from "Components/card/innovation";
import {
    GridContainer,
} from "./_semuaInovasiDIterapkanStyle";
import TopBar from "Components/topBar";
import { useNavigate } from "react-router-dom";

//TODO: Masukin datanya biar muncul
const SemuaInovasiDiterapkan = ({ innovations }: any) => {
    const navigate = useNavigate();
    return (
        <Box>
            <TopBar title="Inovasi Diterapkan" onBack={() => navigate(-1)} />
            <Flex direction="column" p={4} pt="72px">
                <GridContainer>
                <CardInnovation>
                </CardInnovation>
                
                <CardInnovation></CardInnovation>
                <CardInnovation></CardInnovation>
                </GridContainer>
            </Flex>
        </Box>
    );
};

export default SemuaInovasiDiterapkan;

