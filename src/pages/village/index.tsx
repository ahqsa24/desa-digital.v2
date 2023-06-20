import React from "react";
import TopBar from "Components/topBar";
import Hero from "./components/hero";
import VillageCategory from "./components/villagecategory";
import Container from "Components/container";
import { FloatingButton } from "../home/_homeStyle";
import { useNavigate } from "react-router-dom";
import { paths } from "Consts/path";
import Add from "Assets/icons/add.svg";
import useAuthLS from "Hooks/useAuthLS";

function Village() {
  const navigate = useNavigate();
  const { auth } = useAuthLS();

  const { role } = auth || {};

  return (
    <Container page>
      <TopBar title="Desa Digital" />
      <Hero />
      <VillageCategory />
      {role === "village" && (
        <FloatingButton onClick={() => navigate(paths.ADD_VILLAGE)}>
          <img src={Add} width={20} height={20} alt="add icon" />
        </FloatingButton>
      )}
    </Container>
  );
}

export default Village;
