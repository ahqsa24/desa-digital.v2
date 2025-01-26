import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Img,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Check from "Assets/icons/check-circle.svg";
import StatusCard from "Components/card/status/StatusCard.tsx";
import RejectionModal from "Components/confirmModal/RejectionModal.tsx";
import Container from "Components/container";
import ActionDrawer from "Components/drawer/ActionDrawer.tsx";
import TopBar from "Components/topBar";
import { paths } from "Consts/path.ts";
import {
  deleteField,
  doc,
  DocumentData,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCircle } from "react-icons/fa"; // Import ikon elips
import { generatePath, useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { auth, firestore } from "../../../firebase/clientApp";
import { getDocumentById } from "../../../firebase/inovationTable.ts";
import {
  ActionContainer,
  BenefitContainer,
  ChipContainer,
  ContentContainer,
  Description,
  Description2,
  Icon,
  Label,
  Logo,
  Text1,
  Text2,
  Text3,
  Title,
} from "./_detailStyle.ts";

function DetailInnovation() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user] = useAuthState(auth);
  const [data, setData] = useState<DocumentData>({});
  const [datainnovator, setDatainnovator] = useState<DocumentData>({});
  const [admin, setAdmin] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.uid) {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setAdmin(userDoc.data().role === "admin");
        }
      }
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    if (id) {
      getDocumentById("innovations", id)
        .then((detailInovasi) => {
          setData(detailInovasi);
          console.log("Innovation Data:", detailInovasi); // Log the fetched innovation data
        })
        .catch((error) => {
          console.error("Error fetching innovation details:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (data.innovatorId) {
      console.log("Fetching innovator with ID:", data.innovatorId); // Log the innovator ID
      getDocumentById("innovators", data.innovatorId)
        .then((detailInnovator) => {
          setDatainnovator(detailInnovator);
          console.log("Innovator Data:", detailInnovator); // Log the fetched innovator data
        })
        .catch((error) => {
          console.error("Error fetching innovator details:", error);
        });
    }
  }, [data.innovatorId]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      if (!id) {
        setError("Innovation ID not found");
        setLoading(false);
        return;
      }
      const innovationRef = doc(firestore, "innovations", id);
      await updateDoc(innovationRef, {
        status: "Terverifikasi",
        catatanAdmin: deleteField(),
      });
      setData({ ...data, status: "Terverifikasi" });
      const innovatorRef = doc(firestore, "innovators", data.innovatorId);
      await updateDoc(innovatorRef, {
        jumlahInovasi: increment(1),
      });
    } catch (error) {
      console.error("Error verifying innovation:", error);
      setError("Error verifying innovation");
    }
    setLoading(false);
    onClose();
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      if (!id) {
        setError("Innovation ID not found");
        setLoading(false);
        return;
      }
      const innovationRef = doc(firestore, "innovations", id);
      await updateDoc(innovationRef, {
        status: "Ditolak",
        catatanAdmin: modalInput,
      });
      setData((prevData) => ({
        ...prevData,
        status: "Ditolak",
        catatanAdmin: modalInput,
      }));
    } catch (error) {
      console.error("Error rejecting innovation:", error);
      setError("Error rejecting innovation");
    }
    setLoading(false);
    onClose();
    setOpenModal(false);
  };

  const year = new Date(data.tahunDibuat).getFullYear();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const owner = user && user.uid === data.innovatorId; // Check if the current user is the creator
  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ")
      : text;
  };

  return (
    <Container page>
      <TopBar title="Detail Inovasi" onBack={() => navigate(-1)} />
      {data.images && data.images.length > 1 ? (
        <Slider {...settings}>
          {data.images.map((image: string, index: number) => (
            <Img
              maxWidth="360px"
              maxHeight="248px"
              width="360px"
              height="248px"
              objectFit="cover"
              objectPosition="center"
              key={index}
              src={image}
              alt={`background-${index}`}
            />
          ))}
        </Slider>
      ) : (
        data.images &&
        data.images.length === 1 && (
          <Img
            src={data.images[0]}
            maxWidth="360px"
            maxHeight="248px"
            width="360px"
            height="248px"
            objectFit="cover"
            objectPosition="center"
            alt="background"
          />
        )
      )}
      <ContentContainer>
        <div>
          <Title>{data.namaInovasi}</Title>
          <ChipContainer>
            <Text
              fontSize="10px"
              fontWeight="400"
              background={
                data.statusInovasi === "Masih diproduksi"
                  ? "#DCFCE7"
                  : "#e5e7eb"
              }
              color={
                data.statusInovasi === "Masih diproduksi"
                  ? "#374151"
                  : "#000000"
              }
              padding="4px 8px"
              borderRadius="20px"
            >
              {data.statusInovasi}
            </Text>
            <Label
              onClick={() =>
                navigate(
                  generatePath(paths.INNOVATION_CATEGORY_PAGE, {
                    category: data.kategori,
                  })
                )
              }
            >
              {data.kategori}
            </Label>
            <Description2>Dibuat tahun {year}</Description2>
          </ChipContainer>
        </div>
        <ActionContainer
          onClick={() =>
            navigate(
              generatePath(paths.DETAIL_INNOVATOR_PAGE, {
                id: data.innovatorId,
              })
            )
          }
        >
          <Logo src={datainnovator.logo} alt="logo" />
          <div>
            <Text2>Inovator</Text2>
            <Text1>{datainnovator.namaInovator}</Text1>
          </div>
        </ActionContainer>
        <Stack spacing="8px">
          <div>
            <Text fontSize="16px" fontWeight="700" lineHeight="140%" mb="16px">
              Deskripsi
            </Text>
            <Box fontSize="12px" fontWeight="400" color="#4B5563">
              {isExpanded ? (
                // Tampilkan teks lengkap jika `isExpanded` true
                <>
                  {data.deskripsi}
                  {data.deskripsi.split(" ").length > 20 && (
                    <Text
                      as="span"
                      fontSize="12px"
                      fontWeight="700"
                      color="#347357"
                      cursor="pointer"
                      textDecoration="underline"
                      onClick={() => setIsExpanded(!isExpanded)} // Toggle state
                    >
                      Lebih Sedikit
                    </Text>
                  )}
                </>
              ) : (
                <>
                  {truncateText(data.deskripsi || "", 20)}
                  {data.deskripsi &&
                    data.deskripsi.split(" ").length > 20 && ( // Tampilkan "Selengkapnya" jika lebih dari 20 kata
                      <Text
                        as="span"
                        fontSize="12px"
                        fontWeight="700"
                        color="#347357"
                        cursor="pointer"
                        textDecoration="underline"
                        onClick={() => setIsExpanded(!isExpanded)} // Toggle state
                      >
                        {" "}
                        Selengkapnya
                      </Text>
                    )}
                </>
              )}
            </Box>
          </div>

          <div>
            <Text fontSize="12px" fontWeight="600">
              Model Bisnis
            </Text>
            <Text fontSize="12px" fontWeight="400">
              {data.modelBisnis?.join(", ")}
            </Text>
          </div>

          <div>
            <Text fontSize="12px" fontWeight="600">
              Desa yang Menerapkan
            </Text>
            <Text fontSize="12px" fontWeight="400">
              {data.inputDesaMenerapkan}
            </Text>
          </div>

          <div>
            <Text fontSize="12px" fontWeight="600">
              Kisaran Harga
            </Text>
            <Text fontSize="12px" fontWeight="400">
              {data.hargaMinimal
                ? `Rp. ${data.hargaMinimal}${
                    data.hargaMaksimal ? ` - Rp. ${data.hargaMaksimal}` : ""
                  }`
                : "Harga tidak tersedia"}
            </Text>
          </div>
        </Stack>

        <div>
          <Text fontSize="16px" fontWeight="700" lineHeight="140%" mb="16px">
            Manfaat
          </Text>
          <Flex>
            <Accordion width="360px" allowMultiple>
              {Array.isArray(data.manfaat) && data.manfaat.length > 0 ? (
                data.manfaat.map(
                  (
                    item: { judul: string; deskripsi: string },
                    index: number
                  ) => (
                    <Flex
                      key={index}
                      mb="12px"
                      border="1px solid var(--Gray-30, #E5E7EB);"
                      borderRadius="8px"
                    >
                      <AccordionItem width="100%" border="none">
                        <h2>
                          <AccordionButton border="none">
                            <Flex
                              w="100%"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Flex
                                alignItems="center"
                                w="auto"
                                flexWrap="nowrap"
                              >
                                <FaCircle
                                  style={{
                                    marginRight: "10px",
                                    color: "#568A73",
                                  }}
                                />
                                <Text fontSize="12px" fontWeight="700">
                                  Manfaat {index + 1}: {item.judul}
                                </Text>
                              </Flex>
                              <AccordionIcon ml={8} color="#568A73" />
                            </Flex>
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Description>{item.deskripsi}</Description>
                        </AccordionPanel>
                      </AccordionItem>
                    </Flex>
                  )
                )
              ) : (
                <Text fontSize="12px" fontWeight="400">
                  Tidak ada data manfaat.
                </Text>
              )}
            </Accordion>
          </Flex>
        </div>

        <div>
          <Text fontSize="16px" fontWeight="700" lineHeight="140%" mb="16px">
            Perlu Disiapkan
          </Text>
          {Array.isArray(data.infrastruktur) &&
          data.infrastruktur.length > 0 ? (
            data.infrastruktur.map((item, index) => (
              <BenefitContainer key={index}>
                <Icon src={Check} alt="check" />
                <Description>{item}</Description>
              </BenefitContainer>
            ))
          ) : (
            <Description>No specific needs listed.</Description>
          )}
        </div>

        <div>
          <Text fontSize="16px" fontWeight="700" lineHeight="140%" mb="16px">
            Desa yang Menerapkan
          </Text>
          <ActionContainer>
            <Text3>Belum tersedia</Text3>
          </ActionContainer>
        </div>

        {owner && ( // Conditionally render the Edit button
          <Button
            width="100%"
            marginTop={13}
            marginBottom={3}
            onClick={() =>
              navigate(
                generatePath(paths.EDIT_INNOVATION_PAGE, {
                  id: data.id,
                })
              )
            }
          >
            Edit
          </Button>
        )}
        <div>
          {admin ? (
            data.status === "Terverifikasi" || data.status === "Ditolak" ? (
              <StatusCard message={data.catatanAdmin} status={data.status} />
            ) : (
              <Button width="100%" fontSize="14px" mb={8} onClick={onOpen}>
                Verifikasi Permohonan Inovasi
              </Button>
            )
          ) : (
            <Button width="100%" fontSize="14px" mb={8} onClick={onOpen}>
              Kontak Inovator
            </Button>
          )}
        </div>
        <RejectionModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={handleReject}
          loading={loading}
          message={modalInput}
          setMessage={setModalInput}
        />
        <ActionDrawer
          isOpen={isOpen}
          onClose={onClose}
          isAdmin={admin}
          loading={loading}
          onVerify={handleVerify}
          setOpenModal={setOpenModal}
          role="Inovator"
        />
      </ContentContainer>
    </Container>
  );
}

export default DetailInnovation;
