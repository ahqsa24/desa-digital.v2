import {
  Button,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Container from "Components/container";
import TopBar from "Components/topBar";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import HeaderUpload from "../../formComponents/HeaderUpload";
import LogoUpload from "../../formComponents/LogoUpload";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
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
    modelBusiness: "",
    whatsapp: "",
  });
  const [category, setCategory] = useState("");

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
  
  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { name, description, instagram, website, targetUser, product, modelBusiness, whatsapp } = textInputsValue;
      if (!name || !description || !instagram || !website || !targetUser || !product || !modelBusiness || !whatsapp) {
        return setError("Semua kolom harus diisi");
      }
      const docRef = await addDoc(collection(firestore, "innovators"), {
        namaInovator: name,
        id: user?.uid,
        deskripsi: description,
        kategori: category,
        editedAt: serverTimestamp(),
        jumlahInovasi: 0,
        jumlahDesaDampingan: 0,
        produk: product,
        modelBisnis: modelBusiness,
        instagram,
        website,
        targetPengguna: targetUser,
        whatsapp
      });
      console.log("Document written with ID: ", docRef.id);
      if(!selectedLogo) {
        return setError("Logo harus diisi");
      } else {
        const logoRef = ref(storage, 'innovators/' + docRef.id + '/logo');
        await uploadString(logoRef, selectedLogo, 'data_url').then(async snapshot => {
          const downloadURL = await getDownloadURL(logoRef);
          await updateDoc(doc(firestore, "innovators", docRef.id), {
            logo: downloadURL
          }); 
          console.log("File available at", downloadURL);
        });
      }

      if(selectedHeader) {
        const headerRef = ref(storage, 'innovators/' + docRef.id + '/header');
        await uploadString(headerRef, selectedHeader, 'data_url').then(async snapshot => {
          const downloadURL = await getDownloadURL(headerRef);
          await updateDoc(doc(firestore, "innovators", docRef.id), {
            header: downloadURL
          }); 
          console.log("File available at", downloadURL);
        });
      }
      setLoading(false);
      }
    catch (error) {
      console.error("Error adding document: ", error);
      setLoading(false);
      setError("Error adding document");
    }
  }
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
              Target Pengguna <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="targetUser"
              fontSize="10pt"
              placeholder="Contoh: Nelayan"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputsValue.targetUser}
              onChange={onTextChange}
            />
            <Text fontWeight="400" fontSize="14px">
              Produk <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="product"
              fontSize="10pt"
              placeholder="Nama produk"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputsValue.product}
              onChange={onTextChange}
            />
            <Text fontWeight="400" fontSize="14px">
              Model Bisnis Digital <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="modelBusiness"
              fontSize="10pt"
              placeholder="Masukkan model bisnis secara singkat"
              _placeholder={{ color: "gray.500" }}
              _focus={{ outline: "none", bg: "white", borderColor: "black" }}
              value={textInputsValue.modelBusiness}
              onChange={onTextChange}
            />
            <Text fontWeight="400" fontSize="14px">
              Deskripsi <span style={{ color: "red" }}>*</span>
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
        <Button type="submit" mt="20px" width="100%" isLoading={loading}>
          Daftarkan Akun
        </Button>
      </form>
    </Container>
  );
};

export default InnovatorForm;
