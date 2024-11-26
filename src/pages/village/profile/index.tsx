import React from "react";
import TopBar from "Components/topBar";
import { useParams } from "react-router";
import Button from "Components/button";
import Send from "Assets/icons/send.svg";
import Location from "Assets/icons/location.svg";
import Geography from "Assets/icons/geography.svg";
import Infrastructure from "Assets/icons/infrastructure.svg";
import DigitalRead from "Assets/icons/digital-readiness.svg";
import DigitalLit from "Assets/icons/digital-literacy.svg";
import GoodService from "Assets/icons/good-service.svg";
import SocCul from "Assets/icons/socio-cultural.svg";
import Resource from "Assets/icons/resource-village.svg";
import Efishery from "Assets/images/efishery.jpg";
import EnlargedImage from "../components/Image";
import CardInnovation from "Components/card/innovation";
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
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Flex,
    Text,
    useDisclosure,
    Box,
} from '@chakra-ui/react'
import { firestore } from "../../../firebase/clientApp";
import Container from "Components/container";
import { DocumentData, collection, getDocs, query, where } from "firebase/firestore";
import { generatePath, useNavigate } from "react-router-dom";
import PengajuanKlaim from "../pengajuanKlaim";


export default function ProfileVillage() {
    const navigate = useNavigate();
    const innovationsRef = collection(firestore, "innovations");
    const [innovations, setInnovations] = useState<DocumentData[]>([]);
    const { id } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        const fetchInnovations = async () => {
            const innovationsSnapshot = await getDocs(innovationsRef);
            const innovationsData = innovationsSnapshot.docs.map((doc) => doc.data());
            setInnovations(innovationsData);
        };
        fetchInnovations();
    }, [firestore]);

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
            <TopBar title="Profil Desa" onBack={() => navigate(-1)} />
            <div style={{ position: "relative", width: "100%" }} >
                <Background src={header} alt="background" />
                <Logo mx={16} my={-40} src="logo-desaalamendah" alt="logo" />
            </div>
            <div>
                <ContentContainer>
                    <Flex flexDirection="column" alignItems="flex-end" >
                        <Button size="xs" 
                        onClick={() => navigate("/PengajuanKlaim")}
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
                                onClick={() => navigate("/target-page")} // Ganti "/target-page" dengan rute yang sesuai
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
                                        tahunDibuat={innovation.tahunDibuat}
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
                <Button size="m" fullWidth type="submit" onClick={onOpen}>
                    Edit Profil
                </Button>{" "}
            </NavbarButton>
        </Box >
    );
}
