import { paths } from "Consts/path";
import { useQuery } from "react-query";
import Container from "Components/container";
import { getUsers } from "Services/userServices";
import CardInovator from "Components/card/innovator";
import { generatePath, useNavigate } from "react-router-dom";
import { CardContainer, Title, Horizontal } from "./_innovatorStyle";

function Innovator() {
  const navigate = useNavigate();
  const { data: users } = useQuery<any>("innovators", getUsers);
  const innovators = users?.filter((item: any) => item.role === "innovator");
  const completedProfile = innovators?.filter((item: any) => Object.hasOwn(item, 'innovatorName'))

  return (
    <Container>
      <Title>Inovator Unggulan</Title>
      <CardContainer>
        <Horizontal>
          {completedProfile?.map((item: any, idx: number) => (
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

export default Innovator;
