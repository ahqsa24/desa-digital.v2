import {
  Button,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import Container from "Components/container";
import TopBar from "Components/topBar";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import HeaderUpload from "../../../components/form/HeaderUpload";
import LogoUpload from "../../../components/form/LogoUpload";
import { auth } from "../../../firebase/clientApp";

import {
  getProvinces,
  getRegencies,
  getDistricts,
  getVillages,
} from "../../../services/locationServices";

interface Location {
  id: string;
  name: string;
}

const AddVillage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [selectedHeader, setSelectedHeader] = useState<string>("");
  const selectedLogoRef = useRef<HTMLInputElement>(null);
  const selectedHeaderRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textInputValue, setTextInputValue] = useState({
    name: "",
    description: "",
    potensi: "",
    geografis: "",
    infrastruktur: "",
    kesiapan: "",
    literasi: "",
    pemantapan: "",
    sosial: "",
    resource: "",
    whatsapp: "",
    instagram: "",
    website: "",
  });
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [regencies, setRegencies] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [villages, setVillages] = useState<Location[]>([]);

  const handleFetchProvinces = async () => {
    try {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
      console.log(provincesData); // For debugging
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleFetchRegencies = async (provinceId: string) => {
    try {
      const regenciesData = await getRegencies(provinceId);
      setRegencies(regenciesData);
    } catch (error) {
      console.error("Error fetching regencies:", error);
    }
  };

  const handleFetchDistricts = async (regencyId: string) => {
    try {
      const districtsData = await getDistricts(regencyId);
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleFetchVillages = async (districtId: string) => {
    try {
      const villagesData = await getVillages(districtId);
      setVillages(villagesData);
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };

  useEffect(() => {
    handleFetchProvinces();
  }, []);

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceId = event.target.value;
    handleFetchRegencies(provinceId);
    setDistricts([]); // Clear districts
    setVillages([]); // Clear villages
  };

  const handleRegencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const regencyId = event.target.value;
    handleFetchDistricts(regencyId);
    setVillages([]); // Clear villages
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const districtId = event.target.value;
    handleFetchVillages(districtId);
  };

  const toas = useToast();

  const onSelectLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedLogo(readerEvent.target?.result as string);
      }
    };
  };

  const onSelectHeader = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedHeader(readerEvent.target?.result as string);
      }
    };
  };

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container page px={16}>
      <TopBar title="Registrasi Desa" onBack={() => navigate(-1)} />
      <form>
        <Flex direction="column" marginTop="24px">
          <Stack spacing={3} width="100%">
            <Text fontWeight="400" fontSize="14px">
              Nama Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="name"
              fontSize="10pt"
              placeholder="Nama Desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.name}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Provinsi <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Provinsi"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              onChange={handleProvinceChange}
            >
              {provinces.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  style={{ color: "black" }}
                >
                  {item.name}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Kabupaten/Kota <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Kabupaten/Kota"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              onChange={handleRegencyChange}
              disabled={regencies.length === 0}
            >
              {regencies.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Kecamatan <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Kecamatan"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              onChange={handleDistrictChange}
              disabled={districts.length === 0}
            >
              {districts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Desa/Kelurahan <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Kelurahan"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              disabled={villages.length === 0}
            >
              {villages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Logo Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <LogoUpload
              selectedLogo={selectedLogo}
              setSelectedLogo={setSelectedLogo}
              selectFileRef={selectedLogoRef}
              onSelectLogo={onSelectLogo}
            />

            <Text fontWeight="400" fontSize="14px">
              Header Desa
            </Text>
            <HeaderUpload
              selectedHeader={selectedHeader}
              setSelectedHeader={setSelectedHeader}
              selectFileRef={selectedHeaderRef}
              onSelectHeader={onSelectHeader}
            />

            <Text fontWeight="400" fontSize="16px">
              Tentang Inovasi di Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <Textarea
              name="deskripsi"
              fontSize="10pt"
              placeholder="Masukkan deskripsi desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              height="100px"
              value={textInputValue.description}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Potensi Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Masukkan potensi desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.potensi}
              onChange={onTextChange}
            />

            <Text fontWeight="700" fontSize="16px">
              Karakteristik Desa
            </Text>
            <Text fontWeight="400" fontSize="14px">
              Geografis <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Deskripsi geografis desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.geografis}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Infrastruktur <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Deskripsi infrastruktur desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.infrastruktur}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Kesiapan Digital <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Deskripsi kesiapan digital desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.kesiapan}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Literasi Digital <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Deskripsi literasi digital desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.literasi}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Pemantapan Pelayanan <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Deskripsi pemantapan pelayanan desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.pemantapan}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Sosial dan Budaya <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Deskripsi sosial dan budaya desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.sosial}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Sumber Daya Alam <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Deskripsi sumber daya alam desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.resource}
              onChange={onTextChange}
            />

            <Text fontWeight="700" fontSize="16px">
              Kontak Desa
            </Text>
            <Text fontWeight="400" fontSize="14px">
              Nomor WhatsApp <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="62812345678"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.whatsapp}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Link Instagram <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              type="url"
              fontSize="10pt"
              placeholder="Link Instagram desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.instagram}
              onChange={onTextChange}
            />

            <Text fontWeight="400" fontSize="14px">
              Link Website <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              type="url"
              fontSize="10pt"
              placeholder="Link Website desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputValue.website}
              onChange={onTextChange}
            />
          </Stack>
        </Flex>
        <Button type="submit" mt="20px" width="100%">
          Simpan
        </Button>
      </form>
    </Container>
  );
};

export default AddVillage;
