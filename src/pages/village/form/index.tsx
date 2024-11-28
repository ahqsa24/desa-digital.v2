import {
  Button,
  Flex,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import Container from "Components/container";
import TopBar from "Components/topBar";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Form, useNavigate } from "react-router-dom";
import HeaderUpload from "../../../components/form/HeaderUpload";
import LogoUpload from "../../../components/form/LogoUpload";
import ImageUpload from "../../../components/form/ImageUpload";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import Dropdown from "../components/Filter";
import Select from "react-select";
import {
  getProvinces,
  getRegencies,
  getDistricts,
  getVillages,
} from "../../../services/locationServices";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { Alert, Box } from "@chakra-ui/react";
import LocationSelector from "Components/form/LocationSellector";
import FormSection from "../../../components/form/FormSection";

interface Location {
  id: string;
  name: string;
}

const AddVillage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [selectedHeader, setSelectedHeader] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const selectedLogoRef = useRef<HTMLInputElement>(null);
  const selectedHeaderRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const [textInputValue, setTextInputValue] = useState({
    name: "",
    description: "",
    potensi: "",
    geografis: "",
    infrastruktur: "",
    kesiapan: "",
    teknologi: "",
    pelayanan: "",
    sosial: "",
    resource: "",
    whatsapp: "",
    instagram: "",
    website: "",
    literasi: "",
    pemantapan: "",
  });
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [regencies, setRegencies] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [villages, setVillages] = useState<Location[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Location | null>(
    null
  );
  const [selectedRegency, setSelectedRegency] = useState<Location | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(
    null
  );
  const [selectedVillage, setSelectedVillage] = useState<Location | null>(null);

  const fetchProvinces = async () => {
    try {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchRegencies = async (provinceId: string) => {
    try {
      const regenciesData = await getRegencies(provinceId);
      setRegencies(regenciesData);
    } catch (error) {
      console.error("Error fetching regencies:", error);
    }
  };

  const fetchDistricts = async (regencyId: string) => {
    try {
      const districtsData = await getDistricts(regencyId);
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchVillages = async (districtId: string) => {
    try {
      const villagesData = await getVillages(districtId);
      setVillages(villagesData);
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleProvinceChange = (selected: any) => {
    setSelectedProvince(selected);
    setSelectedRegency(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    if (selected) fetchRegencies(selected.value);
    console.log(selected);
  };

  const handleRegencyChange = (selected: any) => {
    setSelectedRegency(selected);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setDistricts([]);
    setVillages([]);
    if (selected) fetchDistricts(selected.value);
    console.log(selected);
  };

  const handleDistrictChange = (selected: any) => {
    setSelectedDistrict(selected);
    setSelectedVillage(null);
    setVillages([]);
    if (selected) fetchVillages(selected.value);
  };

  const handleVillageChange = (selected: any) => {
    setSelectedVillage(selected);
  };

  const mapToOptions = (
    locations: Location[]
  ): { value: string; label: string }[] =>
    locations.map((loc) => ({ value: loc.id, label: loc.name }));

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imagesArray: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          if (readerEvent.target?.result) {
            imagesArray.push(readerEvent.target.result as string);
            if (imagesArray.length === files.length) {
              setSelectedFiles((prev) => [...prev, ...imagesArray]);
            }
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };
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
    if (
      textInputValue.name ||
      textInputValue.potensi ||
      textInputValue.whatsapp ||
      textInputValue.instagram ||
      textInputValue.website
    ) {
      setTextInputValue((prev) => ({ ...prev, [name]: value }));
    } else if (textInputValue.description) {
      const wordCount = value.split(/\s+/).filter((word) => word !== "").length;
      if (wordCount <= 50) {
        setTextInputValue((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      const wordCount = value.split(/\s+/).filter((word) => word !== "").length;
      if (wordCount <= 30) {
        setTextInputValue((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const currentWordCount = (text: string) => {
    return text.split(/\s+/).filter((word) => word !== "").length;
  };

  const onSubmitForm = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!user?.uid) {
      setError("User ID is not defined. Please make sure you are logged in.");
      setLoading(false);
      return;
    }

    try {
      const {
        name,
        description,
        potensi,
        geografis,
        infrastruktur,
        kesiapan,
        literasi,
        pemantapan,
        sosial,
        resource,
        whatsapp,
        instagram,
        website,
      } = textInputValue;
      if (
        !name ||
        !description ||
        !potensi ||
        !geografis ||
        !infrastruktur ||
        !kesiapan ||
        !literasi ||
        !pemantapan ||
        !sosial ||
        !resource ||
        !whatsapp ||
        !instagram ||
        !website
        // !selectedProvince ||
        // !selectedDistrict ||
        // !selectedRegency ||
        // !selectedVillage
      ) {
        setError("Semua kolom harus diisi");
        setLoading(false);
        return;
      }
      console.log(textInputValue);

      const userId = user.uid;
      const docRef = doc(firestore, "villages", userId);
      await setDoc(docRef, {
        namaDesa: name,
        id: userId,
        deskripsi: description,
        potensiDesa: potensi,
        geografisDesa: geografis,
        infrastrukturDesa: infrastruktur,
        kesiapanDesa: kesiapan,
        literasiDesa: literasi,
        pemantapanDesa: pemantapan,
        sosialBudaya: sosial,
        sumberDaya: resource,
        whatsapp: whatsapp,
        instagram: instagram,
        website: website,
        lokasi: {
          provinsi: selectedProvince,
          kabupatenKota: selectedRegency,
          kecamatan: selectedDistrict,
          desaKelurahan: selectedVillage,
        },
      });
      console.log("Document writen with ID: ", userId);
      // Upload logo
      if (selectedLogo) {
        const logoRef = ref(storage, `villages/${userId}/logo`);
        await uploadString(logoRef, selectedLogo, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(logoRef);
          await updateDoc(doc(firestore, "villages", userId), {
            logo: downloadURL,
          });
          console.log("File available at", downloadURL);
        });
      } else {
        setError("Logo harus diisi");
        setLoading(false);
        return;
      }

      // Upload header if provided
      if (selectedHeader) {
        const headerRef = ref(storage, `villages/${userId}/header`);
        await uploadString(headerRef, selectedHeader, "data_url").then(
          async () => {
            const downloadURL = await getDownloadURL(headerRef);
            await updateDoc(doc(firestore, "villages", userId), {
              header: downloadURL,
            });
            console.log("File available at", downloadURL);
          }
        );
      }

      setLoading(false);

      toast({
        title: "Profile berhasil dibuat",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      setLoading(false);
      setError("Error adding document");
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menambahkan dokumen.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container page>
      <TopBar title="Registrasi Profil Desa" onBack={() => navigate(-1)} />
      <Box p="0 16px">
        <form onSubmit={onSubmitForm}>
          <Flex direction="column" marginTop="24px">
            <Stack spacing="12px" width="100%">
              <Alert
                status="warning"
                fontSize={12}
                borderRadius={4}
                padding="8px"
              >
                Profil masih kosong. Silahkan isi data di bawah terlebih dahulu.
              </Alert>
              <FormSection
                title="Nama Desa"
                name="name"
                placeholder="Nama Desa"
                value={textInputValue.name}
                onChange={onTextChange}
              />
              <LocationSelector
                label="Provinsi"
                placeholder="Pilih Provinsi"
                options={mapToOptions(provinces)}
                value={selectedProvince}
                onChange={handleProvinceChange}
                isRequired
              />

              <LocationSelector
                label="Kabupaten/Kota"
                placeholder="Pilih Kabupaten/Kota"
                options={mapToOptions(regencies)}
                value={selectedRegency}
                onChange={handleRegencyChange}
                isDisabled={!selectedProvince}
                isRequired
              />
              <LocationSelector
                label="Kecamatan"
                placeholder="Pilih Kecamatan"
                options={mapToOptions(districts)}
                value={selectedDistrict}
                onChange={handleDistrictChange}
                isDisabled={!selectedRegency}
                isRequired
              />
              <LocationSelector
                label="Desa/Kelurahan"
                placeholder="Pilih Kelurahan"
                options={mapToOptions(villages)}
                value={selectedVillage}
                onChange={handleVillageChange}
                isDisabled={!selectedDistrict}
                isRequired
              />

              <Box>
                <Text fontWeight="400" fontSize="14px">
                  Logo Desa <span style={{ color: "red" }}>*</span>
                </Text>
                <Text fontWeight="400" fontSize="10px" mb="6px" color="#9CA3AF">
                  Maks 1 foto. format: png, jpg.
                </Text>
                <LogoUpload
                  selectedLogo={selectedLogo}
                  setSelectedLogo={setSelectedLogo}
                  selectFileRef={selectedLogoRef}
                  onSelectLogo={onSelectLogo}
                />
              </Box>

              <Box>
                <Text fontWeight="400" fontSize="14px">
                  Header Desa
                </Text>
                <Text fontWeight="400" fontSize="10px" mb="6px" color="#9CA3AF">
                  Maks 1 foto. format: png, jpg.
                </Text>
                <HeaderUpload
                  selectedHeader={selectedHeader}
                  setSelectedHeader={setSelectedHeader}
                  selectFileRef={selectedHeaderRef}
                  onSelectHeader={onSelectHeader}
                />
              </Box>

              <Box>
                <Text fontWeight="400" fontSize="14px">
                  Foto Inovasi di Desa
                </Text>
                <Text fontWeight="400" fontSize="10px" mb="6px" color="#9CA3AF">
                  Maks 5 foto. format: png, jpg.
                </Text>
                <ImageUpload
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  selectFileRef={selectedFileRef}
                  onSelectImage={onSelectImage}
                />
              </Box>

              <FormSection
                title="Tentang Inovasi di Desa"
                name="description"
                placeholder="Masukkan deskripsi inovasi yang ada di desa"
                value={textInputValue.description}
                onChange={onTextChange}
                isTextArea
                wordCount={currentWordCount(textInputValue.description)}
                maxWords={100}
              />

              <Box>
                <Text fontWeight="400" fontSize="14px">
                  Potensi Desa <span style={{ color: "red" }}>*</span>
                </Text>
                <Text fontWeight="400" fontSize="10px" mb="6px" color="#9CA3AF">
                  Ditulis singkat dan dipisahkan dengan koma. Contoh: Perikanan,
                  Pertanian
                </Text>
                <Input
                  name="potensi"
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
              </Box>

              <Box>
                <Text fontWeight="700" fontSize="16px" mb="6px">
                  Karakteristik Desa
                </Text>
                <FormSection
                  title="Geografis"
                  name="geografis"
                  placeholder="Deskripsi geografis desa"
                  value={textInputValue.geografis}
                  onChange={onTextChange}
                  wordCount={currentWordCount(textInputValue.geografis)}
                  maxWords={30}
                />
              </Box>

              <FormSection
                title="Infrastruktur"
                name="infrastruktur"
                placeholder="Deskripsi infrastruktur desa"
                value={textInputValue.infrastruktur}
                onChange={onTextChange}
                wordCount={currentWordCount(textInputValue.infrastruktur)}
                maxWords={30}
              />

              <FormSection
                title="Kesiapan Digital"
                name="kesiapan"
                placeholder="Deskripsi kesiapan digital desa"
                value={textInputValue.kesiapan}
                onChange={onTextChange}
                wordCount={currentWordCount(textInputValue.kesiapan)}
                maxWords={30}
              />

              <FormSection
                title="Kemampuan Penggunaan Teknologi"
                name="Teknologi"
                placeholder="Deskripsi kemampuan digital desa"
                value={textInputValue.teknologi}
                onChange={onTextChange}
                wordCount={currentWordCount(textInputValue.teknologi)}
                maxWords={30}
              />

              <FormSection
                title="Pemantapan Pelayanan"
                name="pelayanan"
                placeholder="Deskripsi pemantapan pelayanan desa"
                value={textInputValue.pelayanan}
                onChange={onTextChange}
                wordCount={currentWordCount(textInputValue.pelayanan)}
                maxWords={30}
              />

              <FormSection
                title="Sosial dan Budaya"
                name="sosial"
                placeholder="Deskripsi sosial dan budaya desa"
                value={textInputValue.sosial}
                onChange={onTextChange}
                wordCount={currentWordCount(textInputValue.sosial)}
                maxWords={30}
              />

              <FormSection
                title="Sumber Daya Alam"
                name="resource"
                placeholder="Deskripsi sumber daya alam desa"
                value={textInputValue.resource}
                onChange={onTextChange}
                wordCount={currentWordCount(textInputValue.resource)}
                maxWords={30}
              />

              <Text fontWeight="700" fontSize="16px">
                Kontak Desa
              </Text>
              <FormSection
                title="Whatsapp"
                name="whatsapp"
                placeholder="628123456789"
                type="number"
                value={textInputValue.whatsapp}
                onChange={onTextChange}
              />

              <FormSection
                title="Link Instagram"
                name="instagram"
                placeholder="https://instagram.com/desa"
                type="url"
                value={textInputValue.instagram}
                onChange={onTextChange}
              />
              <FormSection
                title="Link Website"
                name="website"
                placeholder="https://desa.com"
                type="url"
                value={textInputValue.website}
                onChange={onTextChange}
              />
            </Stack>
          </Flex>
          {error && (
            <Text color="red" fontSize="10pt" textAlign="center" mt={2}>
              {error}
            </Text>
          )}
          <Button
            type="submit"
            fontSize={14}
            mt="20px"
            width="100%"
            height="44px"
            isLoading={loading}
          >
            Daftarkan Profil
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddVillage;
