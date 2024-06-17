import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
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
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { generatePath, useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import ImageUpload from "../../../components/form/ImageUpload";
import { paths } from "Consts/path";

const categories = [
  "E-Government",
  "E-Tourism",
  "Layanan Keuangan",
  "Layanan Sosial",
  "Pemasaran Agri-Food dan E-Commerce",
  "Pengembangan Masyarakat dan Ekonomi",
  "Pengelolaan Sumber Daya",
  "Pertanian Cerdas",
  "Sistem Informasi",
];

const targetUsers = [
  "Agen keuangan/perbankan",
  "Agen pemerintah",
  "Agro-preneur",
  "Lansia/Pensiunan desa",
  "Nelayan",
  "Pemasok",
  "Pemuda",
  "Penyedia layanan",
  "Perangkat desa",
  "Petani",
  "Peternak",
  "Pedagang",
  "Pekerja/Buruh",
  "Produsen",
  "Tokoh masyarakat setempat",
  "Wanita pedesaan",
  "Lainnya",
];

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
    customTargetUser: "",
  });
  const [category, setCategory] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [isCustomTargetUser, setIsCustomTargetUser] = useState(false);

  const toast = useToast();
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

  const onSelectTargetUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTargetUser(value);
    setIsCustomTargetUser(value === "Lainnya");
  };

  const onAddRequirement = () => {
    if (newRequirement.trim() !== "") {
      setRequirements((prev) => [...prev, newRequirement]);
      setNewRequirement("");
    }
  };

  const uploadFiles = async (
    files: string[],
    innovationId: string
  ): Promise<string[]> => {
    const promises: Promise<string>[] = [];
    files.forEach((file, index) => {
      const fileName = `image_${Date.now()}_${index}`;
      const storageRef = ref(
        storage,
        `innovations/${innovationId}/images/${fileName}`
      );

      // Convert base64 to Blob
      const byteString = atob(file.split(",")[1]);
      const mimeString = file.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const uploadTask = uploadBytesResumable(storageRef, blob);
      const promise = new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(prog);
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          }
        );
      });
      promises.push(promise);
    });
    return Promise.all(promises);
  };

  const onAddInnovation = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { name, year, description, customTargetUser } = textInputsValue;

    const finalTargetUser = isCustomTargetUser ? customTargetUser : targetUser;

    if (!name || !year || !description || !category || !finalTargetUser) {
      setError("Semua kolom harus diisi");
      setLoading(false);
      return;
    }

    // Fetch innovator data
    const innovatorDocRef = doc(firestore, "innovators", user?.uid as string);
    const innovatorDocSnap = await getDoc(innovatorDocRef);

    if (!innovatorDocSnap.exists()) {
      console.error("Innovator document not found");
      setError("Gagal menambahkan inovasi");
      setLoading(false);
      toast({
        title: "Gagal menambahkan inovasi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const innovatorData = innovatorDocSnap.data();

    try {
      const innovationDocRef = await addDoc(
        collection(firestore, "innovations"),
        {
          namaInovasi: name,
          tahunDibuat: year,
          deskripsi: description,
          kebutuhan: requirements,
          kategori: category,
          targetPengguna: finalTargetUser,
          innovatorId: user?.uid,
          createdAt: serverTimestamp(),
          editedAt: serverTimestamp(),
          namaInnovator: innovatorData?.namaInovator,
          innovatorImgURL: innovatorData?.logo,
        }
      );

      console.log("Document written with ID: ", innovationDocRef.id);

      if (selectedFiles.length > 0) {
        const imageUrls = await uploadFiles(selectedFiles, innovationDocRef.id);
        await updateDoc(innovationDocRef, {
          images: imageUrls,
        });
        console.log("Images uploaded", imageUrls);
      }

      setLoading(false);
      
      // Update jumlahInovasi in innovators collection
      const innovatorDocRef = doc(firestore, "innovators", user?.uid as string);
      await updateDoc(innovatorDocRef, {
        jumlahInovasi: increment(1),
      });

      toast({
        title: "Inovasi berhasil ditambahkan",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(
        generatePath(paths.INNOVATION_CATEGORY_PAGE, {
          category: category,
        })
      ); // Ganti dengan rute yang sesuai
    } catch (error) {
      console.log("error", error);
      setError("Gagal menambahkan inovasi");
      setLoading(false);
      toast({
        title: "Gagal menambahkan inovasi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <Text fontWeight="400" fontSize="14px">
              Target Pengguna <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih target pengguna"
              name="targetUser"
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
              value={targetUser}
              onChange={onSelectTargetUser}
            >
              {targetUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </Select>
            {isCustomTargetUser && (
              <Input
                name="customTargetUser"
                fontSize="10pt"
                placeholder="Masukkan target pengguna"
                _placeholder={{ color: "gray.500" }}
                _focus={{ outline: "none", bg: "white", borderColor: "black" }}
                value={textInputsValue.customTargetUser}
                onChange={onTextChange}
              />
            )}
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
              placeholder="Ketik deskripsi inovasi"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
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
              Persiapan Infrastuktur{" "}
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
            <Text fontWeight="300" fontSize="8pt">
              Contoh: Memiliki tambak, air, dan listrik
            </Text>
            <Input
              name="requirement"
              fontSize="10pt"
              placeholder="Masukan persiapan infrastuktur"
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
              Tambah infrastruktur lain
            </Button>
          </Stack>
        </Flex>
        {error && (
          <Text color="red.500" fontSize="12px" mt="4px">
            {error}
          </Text>
        )}
        <Button type="submit" mt="20px" width="100%" isLoading={loading}>
          Simpan
        </Button>
      </form>
    </Container>
  );
};

export default AddInnovation;
