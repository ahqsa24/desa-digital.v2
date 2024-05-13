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
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import ImageUpload from "../../formComponents/ImageUpload";



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

  // const [selectedFile, setSelectedFile] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textInputsValue, setTextInputsValue] = useState({
    name: "",
    year: "",
    description: "",
  });
  const [category, setCategory] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  // const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const reader = new FileReader();
  //   if (event.target.files?.[0]) {
  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  //   reader.onload = (readerEvent) => {
  //     if (readerEvent.target?.result) {
  //       setSelectedFile(readerEvent.target?.result as string);
  //     }
  //   };
  // };

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

  const onAddRequirement = () => {
    if (newRequirement.trim() !== "") {
      setRequirements((prev) => [...prev, newRequirement]);
      setNewRequirement("");
    }
  };

  const onAddInnovation = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { name, year, description } = textInputsValue;
    try {
      const innovationDocRef = await addDoc(collection(firestore, "innovations"), {
        namaInovasi: name,
        tahunDibuat: year,
        deskripsi: description,
        kebutuhan: requirements,
        kategori: category,
        innovatorId: user?.uid,
        createdAt: serverTimestamp(),
        editedAt: serverTimestamp(),
        namaInnovator: user?.displayName,
        innovatorImgURL: user?.photoURL,
      });

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
      <TopBar title="Tambahkan Inovasi" onBack={() => navigate(-1)} />
      <form onSubmit={onAddInnovation}>
        <Flex direction="column" marginTop="24px">
          <Stack spacing={3} width="100%">
            <Text fontWeight="400" fontSize="14px">
              Nama Inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="name"
              fontSize="10pt"
              placeholder="Nama Inovasi"
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
              Kategori Inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih kategori"
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
              <option value="Pertanian Cerdas">Pertanian Cerdas</option>
              <option value="Pemasaran Agri-Food dan E-Commerce">
                Pemasaran Agri-Food dan E-Commerce
              </option>
              <option value="E-Government">E-Government</option>
              <option value="Sistem Informasi">Sistem Informasi</option>
              <option value="Layanan Keuangan">Layanan Keuangan</option>
              <option value="Pengembangan Masyarakat dan Ekonomi">
                Pengembangan Masyarakat dan Ekonomi
              </option>
              <option value="Pengelolaan Sumberdaya">
                Pengelolaan Sumberdaya
              </option>
              <option value="Layanan Sosial">Layanan Sosial</option>
              <option value="E-Tourism">E-Tourism</option>
            </Select>
            <Text fontWeight="400" fontSize="14px">
              Tahun dibuat inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="year"
              fontSize="10pt"
              placeholder="Ketik tahun"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={textInputsValue.year}
              onChange={onTextChange}
            />
            <Text fontWeight="400" fontSize="14px">
              Deskripsi <span style={{ color: "red" }}>*</span>
            </Text>
            <Textarea
              name="description"
              fontSize="10pt"
              placeholder="Deskripsi singkat"
              _placeholder={{ color: "gray.500" }}
              _focus={{ outline: "none", bg: "white", borderColor: "black" }}
              height="100px"
              value={textInputsValue.description}
              onChange={onTextChange}
            />
            <Text fontWeight="400" fontSize="14px">
              Foto inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <ImageUpload
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectFileRef={selectFileRef}
              onSelectImage={onSelectImage}
            />
            <Text fontWeight="700" fontSize="16px">
              Perlu disiapkan{" "}
              <span
                style={{ color: "red", fontSize: "14px", fontWeight: "400" }}
              >
                *
              </span>
            </Text>
            {requirements.map((requirement, index) => (
              <Flex
                key={index}
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontWeight="400" fontSize="14px">
                  {requirement}
                </Text>
                <Button
                  bg="red.500"
                  _hover={{ bg: "red.600" }}
                  width="32px"
                  height="32px"
                  variant="solid"
                  size="md"
                  onClick={() => {
                    setRequirements(requirements.filter((_, i) => i !== index));
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Flex>
            ))}
            <Input
              name="requirement"
              fontSize="10pt"
              placeholder="Contoh: Memerlukan listrik, Memiliki air"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddRequirement();
                }
              }}
            />
            <Button
              variant="outline"
              onClick={onAddRequirement}
              _hover={{ bg: "none" }}
              leftIcon={<AddIcon />}
            >
              Tambah persyaratan lain
            </Button>
          </Stack>
        </Flex>
        <Button type="submit" mt="20px" width="100%" isLoading={loading} >
          Tambah Inovasi
        </Button>
      </form>
    </Container>
  );
};

export default AddInnovation;
