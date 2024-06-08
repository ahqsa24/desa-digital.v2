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
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import ImageUpload from "../../formComponents/ImageUpload";

const categories = [
  "Pertanian Cerdas",
  "Pemasaran Agri-Food dan E-Commerce",
  "E-Government",
  "Sistem Informasi",
  "Layanan Keuangan",
  "Pengembangan Masyarakat dan Ekonomi",
  "Pengelolaan Sumber Daya",
  "Layanan Sosial",
  "E-Tourism",
];

const EditInnovation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Assuming the route contains the innovation ID as a parameter
  const [user] = useAuthState(auth);

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

  useEffect(() => {
    const fetchInnovation = async () => {
      if (!id) return;
      try {
        const docRef = doc(firestore, "innovations", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTextInputsValue({
            name: data.namaInovasi,
            year: data.tahunDibuat,
            description: data.deskripsi,
          });
          setCategory(data.kategori);
          setRequirements(data.kebutuhan || []);
          setSelectedFiles(data.images || []);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching innovation:", error);
      }
    };
    fetchInnovation();
  }, [id]);

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

  const onUpdateInnovation = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { name, year, description } = textInputsValue;

    if (!name || !year || !description || !category) {
      setError("Semua kolom harus diisi");
      setLoading(false);
      return;
    }
    try {
      const innovationDocRef = doc(firestore, "innovations", id!);

      await updateDoc(innovationDocRef, {
        namaInovasi: name,
        tahunDibuat: year,
        deskripsi: description,
        kebutuhan: requirements,
        kategori: category,
        editedAt: serverTimestamp(),
        images: selectedFiles, // assume previously uploaded images are part of selectedFiles
      });

      console.log("Document updated with ID: ", innovationDocRef.id);

      if (selectedFiles.length > 0) {
        const imageUrls = await uploadFiles(selectedFiles, innovationDocRef.id);
        await updateDoc(innovationDocRef, {
          images: imageUrls,
        });
        console.log("Images uploaded", imageUrls);
      }

      setLoading(false);
      navigate(`/innovation/detail/${id}`); // Navigate to the detail page after successful update
    } catch (error) {
      console.log("error", error);
      setError("Gagal mengubah inovasi");
      setLoading(false);
    }
  };

  return (
    <Container page px={16}>
      <TopBar title="Edit Inovasi" onBack={() => navigate(-1)} />
      <form onSubmit={onUpdateInnovation}>
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
        {error && (
          <Text color="red.500" fontSize="12px" mt="4px">
            {error}
          </Text>
        )}
        <Button type="submit" mt="20px" width="100%" isLoading={loading}>
          Update Inovasi
        </Button>
      </form>
    </Container>
  );
};

export default EditInnovation;
