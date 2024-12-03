import DigitalLit from "Assets/icons/digital-literacy.svg";
import DigitalRead from "Assets/icons/digital-readiness.svg";
import Geography from "Assets/icons/geography.svg";
import GoodService from "Assets/icons/good-service.svg";
import Infrastructure from "Assets/icons/infrastructure.svg";
import Location from "Assets/icons/location.svg";
import Resource from "Assets/icons/resource-village.svg";
import Send from "Assets/icons/send.svg";
import SocCul from "Assets/icons/socio-cultural.svg";
import CardInnovation from "Components/card/innovation";
import TopBar from "Components/topBar";
import { paths } from "Consts/path";
import { useEffect, useState } from "react";
import { paths } from "Consts/path";
import { getUserById } from "Services/userServices";
import { useQuery } from "react-query";

import {
    Title,
    ActionContainer,
    Icon,
    SubText,
    Logo,
    Label,
    Description,
    ContentContainer,
    ChipContainer,
    Background,
    ContPotensiDesa,
    ButtonKontak,
    CardContainer,
    Horizontal,
    NavbarButton,
} from "./_profileStyle";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { generatePath, useNavigate } from "react-router-dom";
import { auth, firestore } from "../../../firebase/clientApp";
import {
  ActionContainer,
  Background,
  CardContainer,
  ChipContainer,
  ContPotensiDesa,
  ContentContainer,
  Description,
  Horizontal,
  Icon,
  Label,
  Logo,
  NavbarButton,
  SubText,
  Title,
} from "./_profileStyle";
import StatusCard from "Components/card/status/StatusCard";
import RejectionModal from "Components/confirmModal/RejectionModal";
import ActionDrawer from "Components/drawer/ActionDrawer";

export default function ProfileVillage() {
  const navigate = useNavigate();
  const [userLogin] = useAuthState(auth);
  const innovationsRef = collection(firestore, "innovations");
  const [innovations, setInnovations] = useState<DocumentData[]>([]);
  const [village, setVillage] = useState<DocumentData | undefined>(undefined);
  const [owner, setOwner] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openModal, setOpenModal] = useState(false);
  const [modalInput, setModalInput] = useState("");

  const formatLocation = (lokasi: any) => {
    if (!lokasi) return "No Location";
    const kecamatan = lokasi.kecamatan?.label || "Unknown Subdistrict";
    const kabupaten = lokasi.kabupatenKota?.label || "Unknown City";
    const provinsi = lokasi.provinsi?.label || "Unknown Province";

    return `KECAMATAN ${kecamatan}, ${kabupaten}, ${provinsi}`;
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      if (id) {
        const docRef = doc(firestore, "villages", id);
        await updateDoc(docRef, {
          status: "Terverifikasi",
        });
        setVillage((prev) => ({
          ...prev,
          status: "Terverifikasi",
        }));
      } else {
        throw new Error("Village ID is undefined");
      }
    } catch (error) {
      // setError(error.message);
    }
    setLoading(false);
    onClose();
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      if (id) {
        const docRef = doc(firestore, "villages", id);
        await updateDoc(docRef, {
          status: "Ditolak",
          catatanAdmin: modalInput, // Simpan alasan penolakan ke Firestore
        });
        setVillage((prev) => ({
          ...prev,
          status: "Ditolak",
          catatanAdmin: modalInput,
        }));
      } else {
        throw new Error("Village ID is undefined");
      }
    } catch (error) {
      console.error("Error during rejection:", error);
    }
    setLoading(false);
    setOpenModal(false); // Tutup modal setelah menyimpan
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (userLogin?.uid) {
        const userRef = doc(firestore, "users", userLogin.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const user = userDoc.data();
          setAdmin(user?.role === "admin");
        }
      }
    };
    fetchUser();
  });

  useEffect(() => {
    const fetchVillageData = async () => {
      if (id) {
        const docRef = doc(firestore, "villages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVillage(docSnap.data());
          if (docSnap.data()?.userId === userLogin?.uid) {
            setOwner(true);
          }
        }
      }
    };
    fetchVillageData();
  });

  useEffect(() => {
    const fetchInnovations = async () => {
      const innovationsSnapshot = await getDocs(innovationsRef);
      const innovationsData = innovationsSnapshot.docs.map((doc) => doc.data());
      setInnovations(innovationsData);
    };
    fetchInnovations();
  }, [innovationsRef]);

    return (
        <Box>
            <TopBar title="Profil Desa" onBack={() => navigate(-1)} />
            <div style={{ position: "relative", width: "100%" }} >
                <Background src={header} alt="background" />
                <Logo mx={16} my={-40} src="logo-desaalamendah" alt="logo" />
            </div>
            <div>
                <ContentContainer>
                    <Flex flexDirection="column" alignItems="flex-end" >
                        <Button size="xs" 
                        onClick={() => navigate("/village/pengajuanKlaim")}
                        >
                            <Icon src={Send} alt="send"/>
                            Pengajuan Klaim
                        </Button>
                    </Flex>
                    <Title> Desa soge {nameVillage} </Title>
                    <ActionContainer>
                        <Icon src={Location} alt="loc" />
                        <Description>
                            {district}
                        </Description>
                    </ActionContainer>
                    <div>
                        <SubText margin-bottom={16}>Tentang</SubText>
                        <Description>{description}</Description>
                    </div>
                    <SubText>Kontak Desa</SubText>
                    <Flex flexDirection="column" alignItems="flex-start" gap="12px" >
                        <Flex width="100%" flexDirection="row" alignItems="flex-start" gap="16px" paddingBottom="12px">
                            <Box color="#4B5563" fontSize="12px" minWidth="110px">Nomor WhatsApp</Box>
                            <Description>08126489023</Description>
                        </Flex>
                        <Flex width="100%" flexDirection="row" alignItems="flex-start" gap="16px" paddingBottom="12px">
                            <Box color="#4B5563" fontSize="12px" minWidth="110px">Link Instagram</Box>
                            <Description>https://www.instagram.com /desasoge/</Description>
                        </Flex>
                        <Flex width="100%" flexDirection="row" alignItems="flex-start" gap="16px" paddingBottom="12px">
                            <Box color="#4B5563" fontSize="12px" minWidth="110px">Link Website</Box>
                            <Description>https://www.instagram.com/desasoge/</Description>
                        </Flex>
                    </Flex>
                    <div>
                        <SubText>Potensi Desa</SubText>
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
                    <div>
                        <SubText>Karakteristik Desa</SubText>
                        <Accordion defaultIndex={[0]} allowMultiple>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton paddingLeft="4px" paddingRight="4px">
                                        <Flex as='span' flex='1' textAlign='left' fontSize="12px" fontWeight="700" gap={2}>
                                            <Icon src={Geography} alt="geo" /> Geografis
                                        </Flex>
                                        <AccordionIcon color="#347357" />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} fontSize={12} paddingLeft="4px" paddingRight="4px">
                                    Dataran rendah seluas 4,50 Km
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton paddingLeft="4px" paddingRight="4px">
                                        <Flex as='span' flex='1' textAlign='left' fontSize="12px" fontWeight="700" gap={2}>
                                            <Icon src={Infrastructure} alt="Infrastrusture" /> Infrastruktur
                                        </Flex>
                                        <AccordionIcon color="#347357" />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} fontSize={12} paddingLeft="4px" paddingRight="4px">
                                    Dataran rendah seluas 4,50 Km
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton paddingLeft="4px" paddingRight="4px">
                                        <Flex as='span' flex='1' textAlign='left' fontSize="12px" fontWeight="700" gap={2}>
                                            <Icon src={DigitalRead} alt="DigR" /> Kesiapan Digital
                                        </Flex>
                                        <AccordionIcon color="#347357" />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} fontSize={12} paddingLeft="4px" paddingRight="4px">
                                    Dataran rendah seluas 4,50 Km
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton paddingLeft="4px" paddingRight="4px">
                                        <Flex as='span' flex='1' textAlign='left' fontSize="12px" fontWeight="700" gap={2}>
                                            <Icon src={DigitalLit} alt="DigL" /> Literasi Digital
                                        </Flex>
                                        <AccordionIcon color="#347357" />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} fontSize={12} paddingLeft="4px" paddingRight="4px">
                                    Dataran rendah seluas 4,50 Km
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton paddingLeft="4px" paddingRight="4px">
                                        <Flex as='span' flex='1' textAlign='left' fontSize="12px" fontWeight="700" gap={2}>
                                            <Icon src={GoodService} alt="GoodService" /> Pemantapan Pelayanan
                                        </Flex>
                                        <AccordionIcon color="#347357" />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} fontSize={12} paddingLeft="4px" paddingRight="4px">
                                    Dataran rendah seluas 4,50 Km
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton paddingLeft="4px" paddingRight="4px">
                                        <Flex as='span' flex='1' textAlign='left' fontSize="12px" fontWeight="700" gap={2}>
                                            <Icon src={SocCul} alt="SocCul" /> Sosial dan Budaya
                                        </Flex>
                                        <AccordionIcon color="#347357" />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} fontSize={12} paddingLeft="4px" paddingRight="4px">
                                    Dataran rendah seluas 4,50 Km
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton paddingLeft="4px" paddingRight="4px">
                                        <Flex as='span' flex='1' textAlign='left' fontSize="12px" fontWeight="700" gap={2}>
                                            <Icon src={Resource} alt="Resource" /> Sumber Daya Alam
                                        </Flex>
                                        <AccordionIcon color="#347357" />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} fontSize={12} paddingLeft="4px" paddingRight="4px">
                                    Dataran rendah seluas 4,50 Km
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div>
                        <SubText>Galeri Desa</SubText>
                        <CardContainer>
                            <Horizontal>
                                <EnlargedImage src={Efishery} />
                                <EnlargedImage src={Efishery} />
                                <EnlargedImage src={Efishery} />
                                <EnlargedImage src={Efishery} />
                            </Horizontal>
                        </CardContainer>
                    </div>
                    <div>
                        <Flex justifyContent="space-between" alignItems="flex-end" alignSelf="stretch">
                            <SubText>Inovasi yang Diterapkan</SubText>
                            <Text
                                onClick={() => navigate("/village/semuaInovasiDiterapkan")} // Ganti "/target-page" dengan rute yang sesuai
                                cursor="pointer"
                                color="var(--Primary, #347357)"
                                fontSize="12px"
                                fontWeight="500"
                                textDecorationLine="underline"
                                paddingBottom="12px"
                            > Lihat Semua </Text>
                        </Flex>
                        <CardContainer>
                            <Horizontal>
                                {innovations.map((innovation, idx) => (
                                    <CardInnovation 
                                        key={idx}
                                        images={innovation.images}
                                        namaInovasi={innovation.namaInovasi}
                                        kategori={innovation.kategori}
                                        deskripsi={innovation.deskripsi}
                                        jumlahDiterapkan={innovation.jumlahDiterapkan}
                                        innovatorLogo={innovation.innovatorImgURL}
                                        innovatorName={innovation.namaInnovator}
                                        onClick={() =>
                                            navigate(generatePath(paths.DETAIL_INNOVATION_PAGE, { id: innovation.id }))
                                        }
                                    />
                                ))}
                            </Horizontal>
                        </CardContainer>
                    </div>
                </ContentContainer>
            </div >
            <NavbarButton>
              <Button width="100%" fontSize="14px" onClick={onOpen}>
                Verifikasi Permohonan Akun
              </Button>
            </NavbarButton>
          )
        ) : (
          <NavbarButton>
            <Button width="100%" onClick={onOpen}>
              Edit Profil
            </Button>{" "}
          </NavbarButton>
        )}
        <RejectionModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={handleReject}
          loading={loading}
          setMessage={setModalInput}
          message={modalInput}
        />
        <ActionDrawer
          isOpen={isOpen}
          onClose={onClose}
          onVerify={handleVerify}
          isAdmin={admin}
          role="Desa"
          loading={loading}
          setOpenModal={setOpenModal}
        />
      </Box>
    </Box>
  );
}
