import TopBar from "Components/topBar";
import Soge from "Assets/images/soge-logo.png";
import Location from "Assets/icons/location.svg";
import Container from "Components/container";
import { useNavigate } from "react-router";
import {
  Img,
  Title,
  ActionContainer,
  Icon,
  Text,
  Logo,
  Label,
  Description,
  ContentContainer,
  ChipContainer,
} from "./_detailVillage";
import Button from "Components/button";

function DetailVillage() {
  const navigate = useNavigate();

  return (
    <Container page>
      <TopBar title="Profil Desa" onBack={() => navigate(-1)} />
      <Img />
      <Logo mb={16} my={-40} src={Soge} alt={Logo} />
      <ContentContainer>
        <Title> Desa Soge </Title>
        <ActionContainer>
          {" "}
          <Description>
            {" "}
            <Icon src={Location} alt="loc" />
            Kecamatan Kandanghaur, Kabupaten Indramayu, <br></br>Jawa Barat
          </Description>
        </ActionContainer>{" "}
        <div>
          <Text mb={16}>Tentang</Text>
          <Description>
            Sebuah perusahaan swasta mengembangkan pengumpan ikan otomatis
            menggunakan teknologi Internet-of-thing (IoT). Perangkat ini
            menawarkan pemberian pakan otomatis ikan tangkapan secara berkala
            menggunakan smartphone yang disinkronkan dengan pengumpan otomatis.
            Bekerja sama dengan Pemerintah Provinsi Jawa Barat, perusahaan
            menyediakan teknologi digital tersebut kepada produsen ikan lele di
            desa Soge, Krimun, dan Puntang di Indonesia, yang menghasilkan
            manfaat nyata berupa peningkatan rasio konversi pakan, penghematan
            tenaga kerja, dan pendapatan yang lebih tinggi. Teknologi tersebut
            juga dilengkapi dengan pinjaman modal usaha (pakan, benih) dan
            sarana produksi budidaya lainnya, ditambah e-marketing dan
            business-to-business (B2B) Commerce. Inovasi tersebut sangat
            berhasil, ditunjukkan dengan meningkatnya adopsi di desa-desa di
            Indramayu. Di beberapa tambak ikan, jumlah tambak yang dilengkapi
            dengan auto-feeder meningkat dari 2 tambak ikan pada tahun 2019
            menjadi lebih dari 40 tambak pada tahun 2022.
          </Description>
        </div>
        <Text>Potensi Desa</Text>
        <ChipContainer>
          <Label>Pertanian Cerdas</Label>
          <Label>Perikanan Budidaya</Label>
        </ChipContainer>
      </ContentContainer>
      <Button size="m" fullWidth mt={12} type="submit">
          Kontak Desa
        </Button>{" "}
    </Container>
  );
}

export default DetailVillage;
