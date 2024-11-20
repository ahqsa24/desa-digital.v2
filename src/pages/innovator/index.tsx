import {
  useDisclosure
} from "@chakra-ui/react";
import Container from "Components/container";
import TopBar from "Components/topBar";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getUsers } from "Services/userServices";
import Hero from "./components/hero";

function Innovator() {
  const navigate = useNavigate();
  const { data: users, isFetched } = useQuery<any>("innovators", getUsers);
  const innovators = users?.filter((item: any) => item.role === "innovator");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

  return (
    <Container page>
      <TopBar title="Inovator" />
      <Hero />

      <p>This page is currently still in development.</p>
      {/* <GridContainer>
        {isFetched &&
          innovators?.map((item: any, idx: number) => (
            <CardInnovator
              key={idx}
              {...item}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: item.id })
                )
              }
            />
          ))}
      </GridContainer> */}
    </Container>
  );
}

export default Innovator;
