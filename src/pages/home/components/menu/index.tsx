import { useState, useEffect } from "react";
import { paths } from "Consts/path";
import Loading from "Components/loading";
import Container from "Components/container";
import { generatePath, useNavigate } from "react-router-dom";
import { MenuContainer, GridContainer, GridItem } from "./_menuStyle";
import { useQuery } from "react-query";
import { getCategories } from "Services/categoryServices";

import React from "react";
import { Image, Text } from "@chakra-ui/react";

type MenuProps = {
  isAdmin?: boolean;
};

const Menu: React.FC<MenuProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { data, isLoading, isFetched } = useQuery("menu", getCategories);

  const predefinedCategories = [
    {
      icon: "./src/assets/icons/smart-agri.svg",
      title: "Pertanian Cerdas",
    },
    {
      icon: "./src/assets/icons/agri-food.svg",
      title: "Pemasaran Agri-Food dan E-Commerce",
    },
    {
      icon: "./src/assets/icons/e-government.svg",
      title: "E-Government",
    },
    {
      icon: "./src/assets/icons/information-system.svg",
      title: "Sistem Informasi",
    },
    {
      icon: "./src/assets/icons/local-infrastructure.svg",
      title: "Infrastruktur Lokal",
    },
    {
      icon: "./src/assets/icons/menu-all.svg",
      title: "Semua Kategori Innovasi",
    },
  ];

  const adminMenu = [
    {
      icon: "./src/assets/icons/verifikasi-desa.svg",
      title: "Verifikasi Desa",
    },
    {
      icon: "./src/assets/icons/verifikasi-innovator.svg",
      title: "Verifikasi Innovator",
    },
    {
      icon: "./src/assets/icons/verifikasi-klaim.svg",
      title: "Verifikasi Klaim Innovasi",
    },
    {
      icon: "./src/assets/icons/verifikasi-tambah-innovasi.svg",
      title: "Verifikasi Tambah Innovasi",
    },
    {
      icon: "./src/assets/icons/pembuatan-innovasi.svg",
      title: "Pembuatan Iklan",
    },
    {
      icon: "./src/assets/icons/menu-all.svg",
      title: "Semua Kategori Innovasi",
    },
  ];

  const [menu, setMenu] = useState<{ icon: string; title: string }[]>([]);
  const menuItems = isAdmin ? adminMenu : predefinedCategories;

  const onClick = (category: string) => {
    if (category === "Semua Kategori Innovasi") {
      navigate(paths.INNOVATION_PAGE);
      return;
    }
    const isAdminCategory = adminMenu.some((item) => item.title === category);

    if (isAdmin && isAdminCategory) {
      const path = generatePath(paths.VERIFICATION_PAGE, {
        category: category,
      });
      navigate(path);
      return;
    } else {
      const path = generatePath(paths.INNOVATION_CATEGORY_PAGE, {
        category: category,
      });
      navigate(path);
    }
  };

  useEffect(() => {
    if (isFetched && data) {
      setMenu(menuItems);
    }
  }, [isFetched, data, isAdmin]);

  return (
    <Container>
      <MenuContainer>
        {isLoading && <Loading />}
        {isFetched && (
          <GridContainer>
            {menu?.map(({ icon, title }: any, idx: number) => (
              <GridItem key={idx} onClick={() => onClick(title)}>
                <Image src={icon} alt={title} width={12} height={12} />
                <Text
                  fontSize="12px"
                  fontWeight="400"
                  lineHeight="140%"
                  textAlign="center"
                  mt="8px"
                  width="90px"
                  height="auto"
                >
                  {title}
                </Text>
              </GridItem>
            ))}
          </GridContainer>
        )}
      </MenuContainer>
    </Container>
  );
};
export default Menu;
