import TopBar from "Components/topBar";
import EFishery from "Assets/images/efishery.jpg";
import Efishery from "Assets/images/efishery-logo.jpg";
import Soge from "Assets/images/soge-logo.png";
import Dot from "Assets/icons/dot.svg";
import Check from "Assets/icons/check-circle.svg";
import Container from "Components/container";
import { useNavigate, useParams } from "react-router-dom";
import { paths } from "Consts/path.ts";
import {
  Img,
  Label,
  Title,
  ActionContainer,
  Icon,
  Text,
  Logo,
  Description,
  ChipContainer,
  ContentContainer,
} from "./_detailStyle.ts";

function DetailInnovation() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  return (
    <Container page>
      <TopBar title="Detail Inovasi" onBack={() => navigate(-1)} />
      <Img src={EFishery} alt="EFishery" />
      <ContentContainer>
        <div>
          <Title> Pakan Otomatis (eFeeder)</Title>
          <ChipContainer>
            <Label onClick={() => navigate(paths.INNOVATION_CATEGORY_PAGE)}>
              Pertanian Cerdas
            </Label>
            <Description>Dibuat tahun 2020</Description>
          </ChipContainer>
        </div>
        <ActionContainer onClick={() => navigate(paths.DETAIL_INNOVATOR_PAGE)}>
          <Logo src={Efishery} alt={Logo} />
          <Text>EFishery</Text>
        </ActionContainer>
        <div>
          <Text mb={16}>Deskripsi</Text>
          <Description>
            Pakan otomatis cerdas yang dapat dikontrol melalui telepon dan dapat
            disesuaikan dengan kebutuhan pertanian setiap petani.
          </Description>
        </div>

        <div>
          <Text mb={16}>Keuntungan</Text>
          <Description>
            <Icon mr={4} src={Dot} alt="dot" />
            Menyimpan data jumlah pakan yang dilempar oleh eFeeder yang dapat
            diakses melalui aplikasi eFeeder atau dashboard.
          </Description>
        </div>

        <div>
          <Text mb={16}>Perlu Disiapkan</Text>
          <Description>
            <Icon mr={4} src={Check} alt="Check" />
            Memiliki variabel teknologi terhadap kesiapan desa digital.
          </Description>
        </div>

        <div>
          <Text mb={16}>Desa yang Menerapkan </Text>
          <ActionContainer onClick={() => navigate(paths.DETAIL_VILLAGE_PAGE)}>
            <Logo src={Soge} alt={Logo} />
            <Text>Desa Soge</Text>
          </ActionContainer>
        </div>
      </ContentContainer>
    </Container>
  );
}

export default DetailInnovation;
