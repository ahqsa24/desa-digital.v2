import React from "react";
import Skeleton from "react-loading-skeleton";
import {
  Container,
  Title,
  Category,
  Description,
  Background,
  Content,
  Icon,
  CompanyContainer,
  Applied,
  InnovatorName,
} from "./_cardInnovationStyle";
import { Flex } from "@chakra-ui/react";
import { Column } from "src/pages/innovator/_innovatorStyle";

type CardInnovationProps = {
  images?: string[];
  namaInovasi?: string;
  kategori?: string;
  deskripsi?: string;
  jumlahDiterapkan?: string;
  innovatorLogo?: string | React.ReactNode;
  innovatorName?: string | React.ReactNode;
  onClick?: () => void;
};

function CardInnovation(props: CardInnovationProps) {
  const { images, namaInovasi, kategori, deskripsi, jumlahDiterapkan, innovatorLogo, innovatorName, onClick } = props;

  return (
    <Container onClick={onClick}>
      <Background src={images ? images[0] : undefined} alt={namaInovasi} />
      <Content>
        <Flex direction={'column'}>
        <Title>{namaInovasi}</Title>
        <Category>{kategori}</Category>
        <Description>{deskripsi}</Description>
        </Flex>
        <Flex direction={'column'} marginTop={2}>
        <CompanyContainer>
          {typeof innovatorLogo === "string" ? (
            <Icon src={innovatorLogo} alt={namaInovasi} />
          ) : (
            <div>{innovatorLogo}</div>
          )}
          {typeof innovatorName === "string" ? (
            <InnovatorName>{innovatorName}</InnovatorName>
          ) : (
            <div>{innovatorName}</div>
          )}
        </CompanyContainer>
        <Applied>Diterapkan{jumlahDiterapkan} desa</Applied>
        </Flex>
      </Content>
    </Container>
  );
}

export default CardInnovation;