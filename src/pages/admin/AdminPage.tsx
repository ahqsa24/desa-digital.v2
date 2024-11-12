import Container from "Components/container";
import TopBar from "Components/topBar";
import React from "react";
import Hero from "../home/components/hero";
import SearchBar from "Components/search/SearchBar";
import Menu from "../home/components/menu";
import { Flex, Stack } from "@chakra-ui/react";
import Rediness from "Components/rediness/Rediness";
import Ads from "Components/ads/Ads";

type AdminPageProps = {};

const AdminPage: React.FC<AdminPageProps> = () => {
  return (
    <Container page>
      <TopBar title="Desa Digital Indonesia" />
      <Hero
        description="Admin Inovasi Desa"
        text="Digital Indonesia"
        isAdmin={true}
      />
      <Stack direction="column">
        <SearchBar />
        <Menu isAdmin={true} />
        <Flex direction="row" justifyContent='space-between' padding='0 14px'>
          <Rediness />
          <Ads />
        </Flex>
      </Stack>
    </Container>
  );
};
export default AdminPage;
