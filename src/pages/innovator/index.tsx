import TopBar from "Components/topBar";
import Hero from "./components/hero";
import CardInovator from "Components/card/inovator";
import Container from "Components/container";
import { useQuery } from "react-query";
import { getUsers } from "Services/userServices";
import { paths } from "Consts/path";
import { useNavigate, generatePath } from "react-router-dom";
import { GridContainer } from "./_inovatorStyle";

function Inovator() {
  const navigate = useNavigate();
  const { data: users, isFetched } = useQuery<any>("innovators", getUsers);
  const innovators = users?.filter((item: any) => item.role === "innovator");

  return (
    <Container page>
      <TopBar title="Inovator" />
      <Hero />

      <GridContainer>
        {isFetched &&
          innovators?.map((item: any, idx: number) => (
            <CardInovator
              key={idx}
              {...item}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: item.id })
                )
              }
            />
          ))}
      </GridContainer>
    </Container>
  );
}

export default Inovator;
