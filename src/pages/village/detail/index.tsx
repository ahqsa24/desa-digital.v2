import React from "react";
import TopBar from "Components/topBar";
import { useNavigate, useParams } from "react-router";
import Button from "Components/button";
import Location from "Assets/icons/location.svg";
import Whatsapp from "Assets/icons/whatsapp.svg";
import Instagram from "Assets/icons/instagram.svg";
import Web from "Assets/icons/web.svg";
import {
  Title,
  ActionContainer,
  Icon,
  Text,
  Logo,
  Label,
  Description,
  ContentContainer,
  ChipContainer,
  Background,
  ContPotensiDesa,
  ButtonKontak
} from "./_detailStyle";
import { paths } from "Consts/path";
import { getUserById } from "Services/userServices";
import { useQuery } from "react-query";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  DrawerCloseButton,
  Input,
  DrawerFooter,
  Box,
} from '@chakra-ui/react'

export default function DetailVillage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data, isLoading } = useQuery<any>("villageById", () =>
    getUserById(id)
  );
  const {
    header,
    logo,
    nameVillage,
    province,
    district,
    description,
    benefit,
    whatsApp,

  } = data || {};
  const onClickHere = () => {
    window.open(`https://wa.me/+${whatsApp}`, "_blank");
  };
  console.log(data);

  if (isLoading) return <p>Sedang memuat data...</p>;

  return (
    <Box>
      <TopBar title="Detail Desa" onBack={() => navigate(-1)} />
      <div style={{ position: "relative", width: "100%" }} >
        <Background src={header} alt="background" />
        <Logo mx={16} my={-40} src="logo-desaalamendah" alt="logo" />
      </div>
      <div>
        <ContentContainer>
          <Title> {nameVillage} </Title>
          <ActionContainer>
            <Icon src={Location} alt="loc" />
            <Description>
              {district}
            </Description>
          </ActionContainer>
          <div>
            <Text margin-bottom={16}>Tentang</Text>
            <Description>{description}</Description>
          </div>
          <div>
            <Text>Potensi Desa</Text>
            <ContPotensiDesa>
              <ChipContainer>
                <Label>{benefit}</Label>
              </ChipContainer>
              <ChipContainer>
                <Label>aaaaaaaaaaaaaaaaaa</Label>
              </ChipContainer>
              <ChipContainer>
                <Label>{benefit}</Label>
              </ChipContainer>

            </ContPotensiDesa>
          </div>
          <Button size="m" fullWidth mb={70} type="submit" onClick={onOpen}>
            Kontak Desa
          </Button>{" "}

        </ContentContainer>
      </div>
      <Drawer
        isOpen={isOpen}
        placement='bottom'
        onClose={onClose}
        variant="purple"
      >
        <DrawerOverlay />
        <DrawerContent
          sx={{
            borderRadius: "lg",
            width: "360px",
            my: "auto",
            mx: "auto",
          }}
        >
          <DrawerHeader
            sx={{
              display: "flex",
              justifyContent: "center",
              color: "#1F2937",
              fontSize: "16px"
            }}
          >Kontak Inovator</DrawerHeader>
          <DrawerCloseButton mt={1} />
          <DrawerBody fontSize={12} color="#374151" paddingX={4} gap={4}>
            Terapkan produk inovasi desa digital dengan cara menghubungi inovator melalui saluran di bawah ini:
            <ButtonKontak onClick={onClickHere}>
            <Icon src={Whatsapp} alt="WA" />
              WhatsApp
            </ButtonKontak>
            <ButtonKontak>
            <Icon src={Instagram} alt="IG" />
              Instagram
            </ButtonKontak>
            <ButtonKontak>
            <Icon src={Web} alt="WA" />
              Website
            </ButtonKontak>

          </DrawerBody>

          <DrawerFooter>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}


