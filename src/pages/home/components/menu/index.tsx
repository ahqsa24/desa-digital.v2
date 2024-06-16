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

  const predefinedCategories = [
    {
      icon: "https://github.com/fitrianurynt/PSBO/assets/79956203/9a53a458-b8bd-488c-82a6-17b0b2a86c0a",
      title: "Pertanian Cerdas",
    },
    {
      icon: "https://github.com/fitrianurynt/PSBO/assets/79956203/30cb9a40-cb83-4c3e-8950-cd6fd82a82db",
      title: "Pemasaran Agri-Food dan E-Commerce",
    },
    {
      icon: "https://github.com/fitrianurynt/PSBO/assets/79956203/8338ff39-61d6-4e78-895f-4f0577f699e1",
      title: "E-Government",
    },
    {
      icon: "https://github.com/cheishaamanda/capstone1/assets/90697739/12fd7714-7871-4956-b3e0-e6e62a495bfe",
      title: "Sistem Informasi",
    },
    {
      icon: "https://github.com/fitrianurynt/PSBO/assets/79956203/b4742250-5691-42ac-8a8a-6f9d5684b23b",
      title: "Infrastruktur Lokal",
    },
    {
      icon: "https://github.com/fitrianurynt/PSBO/assets/79956203/41581f29-9da8-417c-b24d-07bad3acd60b",
      title: "Lihat Semua",
    },
  ];

  const [menu, setMenu] = useState<any>(predefinedCategories);

  const onClick = (category: string) => {
    if (category === "Lihat Semua") {
      navigate(paths.INNOVATION_PAGE);
      return;
    }
    const path = generatePath(paths.INNOVATION_CATEGORY_PAGE, {
      category: category,
    });
    navigate(path);
  };

  useEffect(() => {
    if (isFetched && data) {
      //const temp = [...data?.slice(0, 5), data[data?.length - 1]];
      //setMenu(temp);
      setMenu(predefinedCategories);
    }
  }, [isFetched, data]);

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
