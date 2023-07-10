import React from "react";
import TopBar from "Components/topBar";
import Hero from "./components/hero";
import VillageCategory from "./components/villagecategory";
import Container from "Components/container";

function Village() {
  return (
    <Container page>
      <TopBar title="Desa Digital" />
      <Hero />
      <VillageCategory />
    </Container>
  );
}

export default Village;
