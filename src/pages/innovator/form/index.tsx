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
    setTextInputsValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSelectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
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

  return (
    <Container page px={16}>
      <TopBar title="Register Inovator" onBack={() => navigate(-1)} />
      <form onSubmit={onSubmitForm}>
        <Flex direction="column" marginTop="24px">
          <Stack spacing={3} width="100%">
            <Text fontWeight="400" fontSize="14px">
              Nama Inovator <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="name"
              fontSize="10pt"
              placeholder="Nama Inovator"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputsValue.name}
              onChange={onTextChange}
            />
            <Text fontWeight="400" fontSize="14px">
              Kategori Inovator <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Kategori"
              name="category"
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
              _placeholder={{ color: "gray.500" }}
              value={category}
              onChange={onSelectCategory}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Text fontWeight="400" fontSize="14px">
              Model Bisnis Digital <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih Model Bisnis"
              name="modelBusiness"
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
              _placeholder={{ color: "gray.500" }}
              value={modelBusiness}
              onChange={onSelectModelBusiness}
            >
              {businessModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </Select>
            <Text fontWeight="400" fontSize="14px">
              Deskripsi Inovator <span style={{ color: "red" }}>*</span>
            </Text>
            <Textarea
              name="description"
              fontSize="10pt"
              placeholder="Masukkan deskripsi singkat tentang inovator"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                borderColor: "black",
              }}
              height="100px"
              value={textInputsValue.description}
              onChange={onTextChange}
            />
            <Text fontWeight="400" fontSize="14px">
              Logo Inovator <span style={{ color: "red" }}>*</span>
            </Text>
            <LogoUpload
              selectedLogo={selectedLogo}
              setSelectedLogo={setSelectedLogo}
              selectFileRef={selectLogoRef}
              onSelectLogo={onSelectLogo}
            />
            <Text fontWeight="400" fontSize="14px">
              Header Inovator
            </Text>
            <HeaderUpload
              selectedHeader={selectedHeader}
              setSelectedHeader={setSelectedHeader}
              selectFileRef={selectHeaderRef}
              onSelectHeader={onSelectHeader}
            />
            <Text fontWeight="700" fontSize="16px">
              Kontak Inovator
            </Text>
            <Text fontWeight="400" fontSize="14px">
              Nomor WhatsApp <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="whatsapp"
              fontSize="10pt"
              placeholder="Contoh: 08xxxxxx"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputsValue.whatsapp}
              onChange={onTextChange}
            />
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
                border: "1px solid",
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
                border: "1px solid",
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
      </form>
    </Container>
  );
};

export default InnovatorForm;
