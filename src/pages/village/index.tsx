import Hero from "./components/hero";
import { useQuery } from "react-query";
import { getUsers } from "Services/userServices";
import { useNavigate, generatePath } from "react-router-dom";
import { GridContainer, CardContent, Containers } from "./_villageStyle";
import CardVillage from "Components/card/village";
import { paths } from "Consts/path";
import Container from "Components/container";
import { Box, Flex, Text } from "@chakra-ui/react";

function Village() {
  const navigate = useNavigate();
  const { data: users, isFetched } = useQuery<any>("villages", getUsers);
  const villages = users?.filter((item: any) => item.role === "village");

  return (
  <Box>
      <Hero />
      <Containers> 
        <Text mt= "95px">aa</Text>
        <CardContent/>
        <GridContainer>
          {isFetched &&
            villages?.map((item: any, idx: number) => (
              <CardVillage
                key={idx}
                {...item}
                onClick={() =>
                  navigate(
                    generatePath(paths.DETAIL_VILLAGE_PAGE, { id: item.id })
                  )
                }
              />
            ))}
        </GridContainer>
      </Containers>

      
  </Box>
  );
}

export default Village;
