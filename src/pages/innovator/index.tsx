import Hero from "./components/hero";
import { useQuery } from "react-query";
import { getUsers } from "Services/userServices";
import { useNavigate, generatePath } from "react-router-dom";
import { GridContainer, CardContent, Containers } from "./_innovatorStyle";
import CardInnovator from "Components/card/innovator";
import { paths } from "Consts/path";
import { Box, Flex, Text } from "@chakra-ui/react";

function Innovator() {
  const navigate = useNavigate();
  const { data: users, isFetched } = useQuery<any>("innovators", getUsers);
  const innovators = users?.filter((item: any) => item.role === "innovator");

  return (
  <Box>
    <Hero />
    <Containers>
      <Text mt= "95px">aa</Text>
      <CardContent/>
      <GridContainer>
        {isFetched &&
          innovators?.map((item: any, idx: number) => (
          <CardInnovator
            key={idx}
            {...item}
            onClick={() =>
              navigate(
                generatePath(paths.INNOVATOR_PROFILE_PAGE, { id: item.id})
              )
            }
          />
        ))}
      </GridContainer>
    </Containers>
  </Box>
  );
}
     
export default Innovator;