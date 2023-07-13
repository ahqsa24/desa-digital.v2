import React from "react";
import TopBar from "Components/topBar";
import Button from "Components/button";
import { useNavigate, useParams } from "react-router-dom";
import Container from "Components/container";
import { useQuery } from "react-query";

import {
  ContentContainer,
  Background,
  Title,
  ActionContainer,
  Text,
  Logo,
  Description,
  GridContainer,
} from "./_detailStyle";
import { paths } from "Consts/path";
import { getUserById } from "Services/userServices";
function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useQuery<any>("innovatorById", () =>
    getUserById(id)
  );
  const { background, logo, innovatorName } = data || {};
  const { product, description, modelBusiness, targetUser, instagram } =
    data || {};

  const grid = [
    {
      label: "Target pengguna",
      value: targetUser,
    },
    {
      label: "Produk",
      value: product,
    },
    {
      label: "Model bisnis digital",
      value: modelBusiness,
    },
  ];

  const onClickHere = () => {
    window.open(instagram, "_blank");
  };

  if (isLoading) return <p>Sedang memuat data...</p>;

  return (
    <Container page>
      <TopBar title="Detail Inovator" onBack={() => navigate(-1)} />
      <div style={{ position: "relative" }}>
        <Background src={background} alt="background" />
        <Logo mx={16} my={-40} src={logo} alt="logo" />
      </div>

      <ContentContainer>
        <Title> {innovatorName} </Title>
        <div>
          <Text>Tentang</Text>
          <GridContainer>
            {grid?.map((item: any, idx: number) => (
              <React.Fragment key={idx}>
                <Description mb={16} mt={idx === 0 ? 16 : 0}>
                  {item?.label}
                </Description>
                <Description mb={16} mt={idx === 0 ? 16 : 0}>
                  {item?.value}
                </Description>
              </React.Fragment>
            ))}
          </GridContainer>
          <Description>{description}</Description>
        </div>
        {/* <Text>Produk Inovasi</Text> */}
        {/* <DetailContainer>
          {" "}
          {isFetched &&
            data?.map((item, idx) => (
              <CardInnovation
                key={idx}
                {...item}
                onClick={() => navigate(paths.DETAIL_INNOVATION_PAGE)}
              />
            ))}
        </DetailContainer> */}
        {/* <Text>Desa Dampingan</Text> */}
        {/* <ActionContainer onClick={() => navigate(paths.DETAIL_VILLAGE_PAGE)}>
          <Text>Desa Soge</Text>
        </ActionContainer> */}
        <Button size="m" fullWidth mt={12} type="submit" onClick={onClickHere}>
          Kontak Inovator
        </Button>{" "}
      </ContentContainer>
    </Container>
  );
}

export default Detail;
