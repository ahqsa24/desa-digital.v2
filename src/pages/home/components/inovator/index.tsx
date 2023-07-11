import Container from "Components/container";
import CardInovator from "Components/card/inovator";
import { CardContainer, Title, Horizontal } from "./_inovatorStyle";
import { generatePath, useNavigate } from "react-router-dom";
import { paths } from "Consts/path";
import { useQuery } from "react-query";
import { getUsers } from "Services/userServices";

function Inovator() {
  const navigate = useNavigate();
  const { data: users, isFetched } = useQuery<any>("innovators", getUsers);
  const innovators = users?.filter((item: any) => item.role === "innovator");

  return (
    <Container>
      <Title>Inovator Unggulan</Title>
      <CardContainer>
        <Horizontal>
          {innovators.map((item: any, idx: number) => (
            <CardInovator
              key={idx}
              {...item}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: item?.id })
                )
              }
            />
          ))}
        </Horizontal>
      </CardContainer>
    </Container>
  );
}

export default Inovator;
