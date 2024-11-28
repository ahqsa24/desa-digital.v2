import {
  Button,
  Flex,
  Input,
  Select as ChakraSelect,
  Stack,
  Text,
  Textarea,
  useToast,
  Box,
} from "@chakra-ui/react";
import Container from "Components/container";
import TopBar from "Components/topBar";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import HeaderUpload from "../../../components/form/HeaderUpload";
import LogoUpload from "../../../components/form/LogoUpload";
import {
  DocumentData,
  DocumentReference,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import AlertBox from "../components/hero/alert";
import  ReactSelect  from 'react-select'; 

const categories = [
  "Agribisnis",
  "Akademisi",
  "Dibawah Pemerintah",
  "Layanan Finansial",
  "Lembaga Swadaya Masyarakat (LSM)",
  "Organisasi Pertanian",
  "Pemerintah Daerah",
  "Perusahaan",
  "Start Up",
];

const businessModels = [
  "Layanan Berbayar",
  "Layanan Gratis",
  "Layanan Subsidi",
];

const InnovatorForm: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [selectedCategory, setSelectedCategory] = useState<{ label: string; value: string } | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [selectedHeader, setSelectedHeader] = useState<string>("");
  const selectLogoRef = useRef<HTMLInputElement>(null);
  const selectHeaderRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textInputsValue, setTextInputsValue] = useState({
    name: "",
    description: "",
    instagram: "",
    website: "",
    targetUser: "",
    product: "",
    whatsapp: "",
  });
  const [category, setCategory] = useState("");
  const [modelBusiness, setModelBusiness] = useState("");


  const toast = useToast();

  const categoryOptions = categories.map((category) => ({
    label: category, // Label yang ditampilkan pada dropdown
    value: category.toLowerCase().replace(/\s+/g, '-'), // Menggunakan format value yang lebih aman
  }));

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
    if (name === "description"){
      const wordCount = value.split(/\s+/).filter((word) => word !== "").length;
      if (wordCount <= 80) {
        setTextInputsValue((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setTextInputsValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getDescriptionWordCount = () => {
    return textInputsValue.description.split(/\s+/).filter((word) => word !== "").length;
  };

  const onSelectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const handleCategoryChange = (selectedOption: { label: string; value: string } | null) => {
    setSelectedCategory(selectedOption);
  };

  const onSelectModelBusiness = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModelBusiness(event.target.value);
  };

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    // Ensure user and user.uid are defined
    if (!user?.uid) {
      setError("User ID is not defined. Please make sure you are logged in.");
      setLoading(false);
      return;
    }

    try {
      const {
        name,
        description,
        instagram,
        website,
        targetUser,
        product,
        whatsapp,
      } = textInputsValue;

      // Check if all required fields are filled
      if (
        !name ||
        !description ||
        !instagram ||
        !website ||
        !modelBusiness ||
        !whatsapp ||
        !selectedLogo ||
        !category
      ) {
        setError("Semua kolom harus diisi");
        setLoading(false);
        console.log({
          name,
          description,
          instagram,
          website,
          modelBusiness,
          whatsapp,
          selectedLogo,
          category,
        });
        return;
      }

      const userId = user.uid;

      // Use setDoc to set the document with a specific ID
      const docRef = doc(firestore, "innovators", userId);
      await setDoc(docRef, {
        namaInovator: name,
        id: userId,
        deskripsi: description,
        kategori: category,
        editedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        jumlahInovasi: 0,
        jumlahDesaDampingan: 0,
        modelBisnis: modelBusiness,
        instagram,
        website,
        whatsapp,
      });
      console.log("Document written with ID: ", userId);

      // Upload logo
      if (selectedLogo) {
        const logoRef = ref(storage, `innovators/${userId}/logo`);
        await uploadString(logoRef, selectedLogo, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(logoRef);
          await updateDoc(doc(firestore, "innovators", userId), {
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
        const headerRef = ref(storage, `innovators/${userId}/header`);
        await uploadString(headerRef, selectedHeader, "data_url").then(
          async () => {
            const downloadURL = await getDownloadURL(headerRef);
            await updateDoc(doc(firestore, "innovators", userId), {
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
      navigate("/")
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

  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      fontSize: "14px",
      borderColor: "#none",
      boxShadow: "none",
      ":hover": {
        borderColor: "#3367D1",
      },
    }),
    menu: (base: any) => ({
      ...base,
      marginTop: 0,
      zIndex: 10,
    }),
    option: (base: any, state: { isFocused: any; }) => ({
      ...base,
      fontSize: "14px",
      padding: "2px 10px",
      backgroundColor: state.isFocused ? "#E5E7EB" : "white",
      color: "black",
      cursor: "pointer",
      ":active": {
        backgroundColor: "#D1D5DB",
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9CA3AF",
    }),
  };

  return (
    <Container page >
      <TopBar title="Register Inovator" onBack={() => navigate(-1)}/>
      
      <form onSubmit={onSubmitForm}>
        <Box p='0 16px'>
        <AlertBox
          description="Profil masih kosong. Silahkan isi data di bawah terlebih dahulu"
          bgColor="#FFF3B1" // Latar belakang kuning cerah
        />
          <Flex direction="column" marginTop="20px">
            <Stack spacing={3} width="100%">
              <Text fontWeight="400" fontSize="14px">
                Nama Inovator <span style={{ color: "red" }}>*</span>
              </Text>
              <Input
                name="name"
                fontSize="14px"
                placeholder="Nama Inovator"
                _placeholder={{ color: "#9CA3AF" }}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "none",
                }}
                value={textInputsValue.name}
                onChange={onTextChange}
              />
              <Text fontWeight="400" fontSize="14px" mb="-2">
                Kategori Inovator <span style={{ color: 'red' }}>*</span>
              </Text>

              {/* Menggunakan Select dari react-select */}
              <ReactSelect
                placeholder="Pilih kategori"
                options={categoryOptions}  // Daftar opsi yang sudah diformat
                value={selectedCategory}
                onChange={handleCategoryChange}
                styles={customStyles} // Terapkan gaya khusus
                isClearable
              />
              <Text fontWeight="400" fontSize="14px">
                Model Bisnis Digital <span style={{ color: "red" }}>*</span>
              </Text>
              <ChakraSelect
                placeholder="Pilih Model Bisnis"
                name="modelBusiness"
                fontSize="10pt"
                variant="outline"
                cursor="pointer"
                color={"black"}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "none",
                  borderColor: "black",
                }}
                _placeholder={{ color: "gray.500" }}
                value={modelBusiness}
                onChange={onSelectModelBusiness}
              >
                {businessModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </ChakraSelect>
              <Text fontWeight="400" fontSize="14px">
                Deskripsi Inovator <span style={{ color: "red" }}>*</span>
              </Text>
              <Flex direction="column" alignItems="flex-start">
                <Textarea
                  name="description"
                  fontSize="14px"
                  placeholder="Masukkan deskripsi singkat tentang inovator"
                  _placeholder={{ color: "#9CA3AF" }}
                  _focus={{
                    outline: "none",
                    bg: "white",
                    border:"none",
                    borderColor: "none",
                  }}
                  height="100px"
                  value={textInputsValue.description}
                  onChange={onTextChange}
                />
                <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="gray.500">
                  {getDescriptionWordCount()}/80 kata
                </Text>
              </Flex>

              <Text fontWeight="400" fontSize="14px" mb="-2">
                Logo Inovator <span style={{ color: "red" }}>*</span>
              </Text>
              <Flex direction="column" alignItems="flex-start">
                <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF" mb="-2"> 
                  Maks 1 foto, format: png, jpg.</Text>
                  <LogoUpload
                    selectedLogo={selectedLogo}
                    setSelectedLogo={setSelectedLogo}
                    selectFileRef={selectLogoRef}
                    onSelectLogo={onSelectLogo}
                  />
              </Flex>
              <Text fontWeight="400" fontSize="14px" mb="-2">
                Header Inovator
              </Text>
              <Flex direction="column" alignItems="flex-start">
                <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF"> 
                    Maks 1 foto, format: png, jpg.</Text>
                  <HeaderUpload
                    selectedHeader={selectedHeader}
                    setSelectedHeader={setSelectedHeader}
                    selectFileRef={selectHeaderRef}
                    onSelectHeader={onSelectHeader}
                  />
              </Flex>
              <Text fontWeight="700" fontSize="16px">
                Kontak Inovator
              </Text>
              <Text fontWeight="400" fontSize="14px" mb="-2">
                Nomor WhatsApp <span style={{ color: "red" }}>*</span>
              </Text>
              <Flex direction="column" alignItems="flex-start">
                <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF" > 
                    Contoh: 08XXXX</Text>
                    <Input
                      name="whatsapp"
                      fontSize="10pt"
                      placeholder="Nomor Whatsapp"
                      _placeholder={{ color: "gray.500" }}
                      _focus={{
                        outline: "none",
                        bg: "white",
                        border: "none",
                        borderColor: "black",
                      }}
                      value={textInputsValue.whatsapp}
                      onChange={onTextChange}
                    />
              </Flex>
              <Text fontWeight="400" fontSize="14px">
                Instagram <span style={{ color: "red" }}>*</span>
              </Text>
              <Input
                name="instagram"
                type="url" // Correctly specify the input type as URL
                fontSize="10pt"
                placeholder="Link instagram"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "none",
                  borderColor: "black",
                }}
                value={textInputsValue.instagram} // Ensure the state value corresponds to 'instagram'
                onChange={onTextChange} // Use the correct change handler
              />
              <Text fontWeight="400" fontSize="14px">
                Website <span style={{ color: "red" }}>*</span>
              </Text>
              <Input
                name="website"
                type="url" // Correctly specify the input type as URL
                fontSize="10pt"
                placeholder="Link website"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "none",
                  borderColor: "black",
                }}
                value={textInputsValue.website} // Ensure the state value corresponds to 'website'
                onChange={onTextChange} // Use the correct change handler
              />
            </Stack>
          </Flex>
          {error && (
            <Text color="red" fontSize="10pt" textAlign="center" mt={2}>
              {error}
            </Text>
          )}

          <Button type="submit" mt="20px" width="100%" isLoading={loading}>
            Daftarkan Akun
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default InnovatorForm;
