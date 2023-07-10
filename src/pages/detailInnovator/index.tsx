import TopBar from "Components/topBar";
import Dot from "Assets/icons/dot.svg";
import Efeeder from "Assets/images/efishery.jpg";
import EFishery from "Assets/images/efishery-logo.jpg";
import CardInnovation from "Components/cardInnovation";
import Button from "Components/button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Container from "Components/container";
import { useQuery } from "react-query";

import {
  ContentContainer,
  Img,
  Label,
  Title,
  ActionContainer,
  DetailContainer,
  Icon,
  Text,
  Logo,
  Description,
  ChipContainer,
} from "./_detailStyles";
import { paths } from "Consts/path";
import { getInnovatorById } from "Services/innovator";

// const data = [
//   {
//     background: Efeeder,
//     icon: EFishery,
//     title: "Efeeder",
//     category: "smart-agriculture",
//     description: `Pakan otomatis cerdas yang dapat dikontrol melalui telepon`,
//     companyName: "eFishery",
//     appliedInnovation: 1,
//   },
// ];

function DetailInnovator() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const { data, isFetched } = useQuery<any>("innovator", () =>
    getInnovatorById(id)
  );

  console.log(data);

  const onClickHere = () => {
    window.open("https://www.instagram.com/efishery/", "_blank");
  };

  console.log(data?.data?.namaInovator);

  return (
    <Container page>
      <TopBar
        title="Detail Inovator"
        onBack={() => navigate(paths.INOVATOR_PAGE)}
      />
      <div style={{ position: "relative" }}>
        <Img />
        <Logo mx={16} my={-40} src={isFetched && data?.icon} alt={Logo} />
      </div>

      <ContentContainer>
        <Title> {isFetched && data?.namaInovator} </Title>
        <Description>
          1 Inovasi <Icon src={Dot} alt="dot" /> 1 Desa Dampingan
        </Description>
        <Text>Tentang {isFetched && data?.kategoriInovator}</Text>
        <Description>
          Target Pengguna {isFetched && data?.targetPengguna}
        </Description>{" "}
        <Description>Nelayan budidaya (ikan darat)</Description>
        <Text>Produk Inovasi</Text>
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
        <Text>Desa Dampingan</Text>
        <ActionContainer onClick={() => navigate(paths.DETAIL_VILLAGE_PAGE)}>
          {" "}
          <Text>Desa Soge</Text>
        </ActionContainer>
        <Button size="m" fullWidth mt={12} type="submit" onClick={onClickHere}>
          Kontak Inovator
        </Button>{" "}
      </ContentContainer>
    </Container>
  );
}

export default DetailInnovator;
