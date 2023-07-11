import { useState, useEffect } from "react";
import { paths } from "Consts/path";
import Loading from "Components/loading";
import Container from "Components/container";
import { generatePath, useNavigate } from "react-router-dom";
import { MenuContainer, GridContainer, GridItem, Text } from "./_menuStyle";
import { useQuery } from "react-query";
import { getCategories } from "Services/categoryServices";

function Menu() {
  const navigate = useNavigate();
  const { data, isLoading, isFetched } = useQuery("menu", getCategories);

  const [menu, setMenu] = useState<any>([]);

  const onClick = (category: string) => {
    if (category === "Semua") {
      navigate(paths.INNOVATION_PAGE);
      return;
    }
    const path = generatePath(paths.INNOVATION_CATEGORY_PAGE, {
      category: category,
    });
    navigate(path);
  };

  useEffect(() => {
    if (isFetched) {
      const temp = [...data?.slice(0, 5), data[data?.length - 1]];
      setMenu(temp);
    }
  }, [isFetched]);

  return (
    <Container>
      <MenuContainer>
        {isLoading && <Loading />}
        {isFetched && (
          <GridContainer>
            {menu?.map(({ icon, title }: any, idx: number) => (
              <GridItem key={idx} onClick={() => onClick(title)}>
                <img src={icon} alt={title} width={40} height={40} />
                <Text>{title}</Text>
              </GridItem>
            ))}
          </GridContainer>
        )}
      </MenuContainer>
    </Container>
  );
}

export default Menu;
