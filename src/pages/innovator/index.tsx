import React from "react";
import TopBar from "Components/topBar";
import Hero from "./hero";
import MenuInovator from "./menuinovator";
import Container from "Components/container";
import { FloatingButton } from "../home/_homeStyle";
import { useNavigate } from "react-router-dom";
import { paths } from "Consts/path";
import Add from "Assets/icons/add.svg";
import useAuthLS from "Hooks/useAuthLS";
import { getInnovator } from "Services/innovator";
import { useQuery } from "react-query";

function Inovator() {
  const navigate = useNavigate();



  const { auth } = useAuthLS();
  const { role } = auth || {};

  return (
    <Container page>
      <TopBar title="Inovator" />
      <Hero />
      <MenuInovator />
      {role === "innovator" && (
        <FloatingButton onClick={() => navigate(paths.ADD_INNOVATOR)}>
          <img src={Add} width={20} height={20} alt="add icon" />
        </FloatingButton>
      )}
    </Container>
  );
}

export default Inovator;
