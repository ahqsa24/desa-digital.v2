import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
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
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import ImageUpload from "../../formComponents/ImageUpload";

const provinces = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bangka Belitung",
  "Bengkulu",
  "Lampung",
  "DKI Jakarta",
  "Jawa Barat",
  "Banten",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Sulawesi Tengah",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Gorontalo",
  "Sulawesi Barat",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
  "Papua Selatan",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Barat Daya",
];

type Innovation = {
  user: User;
  name: string;
  year: string;
  description: string;
  requirement: string;
  innovatorName?: string;
  innovatorImgURL?: string;
  innovatorId: string;
};

const AddInnovation: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textInputsValue, setTextInputsValue] = useState({
    name: "",
    year: "",
    description: "",
    instagram: "",
    website: "",
    targetUser: "",
    product: "",
    modelBusiness: "",
    whatsapp: "",
  });
  const [category, setCategory] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [province, setProvince] = useState("");

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

  const onSelectProvince = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProvince(event.target.value);
  };

  const onAddRequirement = () => {
    if (newRequirement.trim() !== "") {
      setRequirements((prev) => [...prev, newRequirement]);
      setNewRequirement("");
    }
  };

  const onAddInnovation = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const {
      name,
      year,
      description,
      instagram,
      website,
      targetUser,
      product,
      modelBusiness,
      whatsapp,
    } = textInputsValue;
    try {
      const innovationDocRef = await addDoc(
        collection(firestore, "innovations"),
        {
          namaInovasi: name,
          tahunDibuat: year,
          deskripsi: description,
          kebutuhan: requirements,
          kategori: category,
          provinsi: province,
          innovatorId: user?.uid,
          createdAt: serverTimestamp(),
          editedAt: serverTimestamp(),
          namaInnovator: user?.displayName,
          innovatorImgURL: user?.photoURL,
          instagram,
          website,
          targetUser,
          product,
          modelBusiness,
          whatsapp,
        }
      );

      console.log("Document written with ID: ", innovationDocRef.id);

      const imagePromises = selectedFiles.map(async (file) => {
        const response = await fetch(file);
        const blob = await response.blob();
        const fileName = file.split("/").pop();
        const imageRef = ref(
          storage,
          `innovations/${innovationDocRef.id}/images/${fileName}`
        );
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
      });

      const imageUrls = await Promise.all(imagePromises);
      await updateDoc(innovationDocRef, {
        images: imageUrls,
      });
      console.log("Images uploaded", imageUrls);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setError("Gagal menambahkan inovasi");
      setLoading(false);
    }
  };

  return (
    <Container page px={16}>
      <TopBar title="Register Inovator" onBack={() => navigate(-1)} />
      <form onSubmit={onAddInnovation}>
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
              placeholder="Pilih provinsi"
              name="province"
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
              value={province}
              onChange={onSelectProvince}
            >
              {provinces.map((prov, index) => (
                <option key={index} value={prov}>
                  {prov}
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
            <ImageUpload
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectFileRef={selectFileRef}
              onSelectImage={onSelectImage}
            />
            <Text fontWeight="400" fontSize="14px">
              Header Inovator
            </Text>
            <ImageUpload
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectFileRef={selectFileRef}
              onSelectImage={onSelectImage}
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

export default AddInnovation;
