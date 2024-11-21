import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
  Checkbox,
  CheckboxGroup,
  InputGroup,
  InputLeftElement,
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
import { HStack, Radio, RadioGroup } from "@chakra-ui/react"
import Select from 'react-select';

type OptionType = {
  value: string;
  label: string;
};

const categoryOptions = [
  { value: 'E-Government', label: 'E-Government' },
  { value: 'E-Tourism', label: 'E-Tourism' },
  { value: 'Layanan Keuangan', label: 'Layanan Keuangan' },
  { value: 'Layanan Sosial', label: 'Layanan Sosial' },
  { value: 'Pemasaran Agri-Food dan E-Commerce', label: 'Pemasaran Agri-Food dan E-Commerce' },
  { value: 'Pengembangan Masyarakat dan Ekonomi', label: 'Pengembangan Masyarakat dan Ekonomi' },
  { value: 'Pengelolaan Sumber Daya', label: 'Pengelolaan Sumber Daya' },
  { value: 'Pertanian Cerdas', label: 'Pertanian Cerdas' },
  { value: 'Sistem Informasi', label: 'Sistem Informasi' },
];

const targetUsersOptions = [
  { value: "Agen keuangan/perbankan", label: "Agen keuangan/perbankan" },
  { value: "Agen pemerintah", label: "Agen pemerintah" },
  { value: "Agro-preneur", label: "Agro-preneur" },
  { value: "Lansia/Pensiunan desa", label: "Lansia/Pensiunan desa" },
  { value: "Nelayan", label: "Nelayan" },
  { value: "Pemasok", label: "Pemasok" },
  { value: "Pemuda", label: "Pemuda" },
  { value: "Penyedia layanan", label: "Penyedia layanan" },
  { value: "Perangkat desa", label: "Perangkat desa" },
  { value: "Petani", label: "Petani" },
  { value: "Peternak", label: "Peternak" },
  { value: "Pedagang", label: "Pedagang" },
  { value: "Pekerja/Buruh", label: "Pekerja/Buruh" },
  { value: "Produsen", label: "Produsen" },
  { value: "Tokoh masyarakat setempat", label: "Tokoh masyarakat setempat" },
  { value: "Wanita pedesaan", label: "Wanita pedesaan" },
  { value: "Lainnya", label: "Lainnya" },
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
    otherBusinessModel: "",
    villages: "",
    priceMin: "",
    priceMax: "",
    customTargetUser: "",
    benefit: "",
    benefitDescription: "",
  });
  const [category, setCategory] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [benefit, setBenefit] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  const [benefitDescription, setBenefitDescription] = useState<string[]>([]);
  const [newBenefitDescription, setNewBenefitDescription] = useState("");
  const [selectedModels, setSelectedModels] = useState([]);
  const [otherBusinessModel, setOtherBusinessModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTargetUser, setSelectedTargetUser] = useState<OptionType | null>(null);
  const [customTargetUser, setCustomTargetUser] = useState<string>("");


  const toast = useToast();
  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imagesArray: string[] = [];
      if (selectedFiles.length + files.length > 5) {
        alert("Maksimal 5 foto yang bisa diunggah.");
        return; // Batalkan proses jika melebihi batas
      }
      
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

  const handleTargetUserChange = (selectedOption: OptionType | null) => {
    setSelectedTargetUser(selectedOption);
    if (selectedOption && selectedOption.value === "Lainnya") {
      setCustomTargetUser(""); // Reset input custom jika dipilih "Lainnya"
    }
  };

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (name === "priceMin" || name === "priceMax") {
      // Validasi hanya angka
      if (/^\d*$/.test(value)) {
        setTextInputsValue((prev) => ({
          ...prev,
          [name]: value,
        }));
      } 
    } else if (name === "description") {
      const wordCount = value.split(/\s+/).filter((word) => word !== "").length;
      if (wordCount <= 80) {
        setTextInputsValue((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "desa"){
      const wordCount = value.split(/\s+/).filter((word) => word !== "").length;
      if (wordCount <= 20){
        setTextInputsValue((prev) => ({
        ...prev,
        [name]: value
        }));
      }
    }  else if (name === "otherBusinessModel"){
      const wordCount = value.split(/\s+/).filter((word) => word !== "").length;
      if (wordCount <= 5){
        setTextInputsValue((prev) => ({
        ...prev,
        [name]: value
        }));
      }
    }else {
      setTextInputsValue((prev) => ({
      ...prev,
      [name]: value
      })); 
    }
  };

  const getDescriptionWordCount = () => {
    return textInputsValue.description.split(/\s+/).filter((word) => word !== "").length;
  };

  const getVillagesWordCount = () => {
    return textInputsValue.villages.split(/\s+/).filter((word) => word !== "").length;
  };

  const onAddRequirement = () => {
    if (newRequirement.trim() !== "") {
      setRequirements((prev) => [...prev, newRequirement]);
      setNewRequirement("");
    }
  };

  const onAddBenefit = () => {
    if (newBenefit.trim() !== "") {
      setBenefit((prev) => [...prev, newBenefit]);
      setNewBenefit("");
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
    if (selectedModels.length === 0) {
      setError("Pilih setidaknya satu model bisnis digital.");
      return;
    }

    setLoading(true);
    const { name, year, description, villages, benefit, benefitDescription, priceMax, priceMin, otherBusinessModel } = textInputsValue;
    if (!status || !name || !year || !description || !categoryOptions || !targetUsersOptions || !villages || !benefit || !benefitDescription || !priceMin) {
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
          statusInovasi: status,
          namaInovasi: name,
          kategori: categoryOptions,
          targetPengguna: targetUsersOptions,
          tahunDibuat: year,
          deskripsi: description,
          desaMenerapkan: villages,
          hargaMinimal: priceMin,
          hargaMaksimal: priceMax, 
          manfaat: benefit,
          deskripsiManfaat: benefitDescription,
          kebutuhan: requirements,
          lainLain: otherBusinessModel, 
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
        title: "Pengajuan sedang diverifikasi admin. Pengajuan ini akan disimpan pada halaman Pengajuan inovasi.",
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

  const options = [
    { value: "1", label: "Masih diproduksi" },
    { value: "2", label: "Tidak diproduksi" },
  ];

  const customStyles = {
    control: (base: any) => ({
      ...base,
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
    <Container page px={16}>
      <TopBar title="Tambahkan Inovasi" onBack={() => navigate(-1)} />
      <form onSubmit={onAddInnovation}>
        <Flex direction="column" marginTop="24px">
          <Stack spacing={3} width="100%">
            <Text fontWeight="400" fontSize="14px" mb="-2">
              Status Inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <RadioGroup 
              defaultValue="1"
              name ="status"
              >
              <HStack spacing={4}>
                {options.map((option) => (
                  <Radio 
                    key={option.value}
                    value={option.value}
                    size="md"
                    colorScheme="green"
                    sx={{
                      "& .chakra-radio__control": {
                        borderColor: "#9CA3AF !important", // Warna border
                        borderWidth: "1px !important", // Ketebalan garis
                      },
                    }}
                  >
                    <Text fontSize="14px">{option.label}</Text>
                  </Radio>
                ))}
              </HStack>
            </RadioGroup>
            
            <Text fontWeight="400" fontSize="14px" mb="-2">
              Nama Inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="name"
              fontSize="14px"
              placeholder="Nama Inovasi"
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
              Kategori Inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih kategori"
              options={categoryOptions}
              value={selectedCategory}
              onChange={(selectedOption) => setSelectedCategory(selectedOption)}
              styles={customStyles} // Terapkan gaya khusus
              isClearable
            >

            </Select>
            
            <Text fontWeight="400" fontSize="14px" mb="-2">
              Target Pengguna <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih target pengguna"
              options={targetUsersOptions}
              value={selectedTargetUser}
              onChange={handleTargetUserChange}
              styles={customStyles} // Terapkan gaya yang sama
              isClearable
            />
            {selectedTargetUser?.value === "Lainnya" && (
              <Input
                name="customTargetUser"
                fontSize="14px"
                placeholder="Masukkan target pengguna"
                _placeholder={{ color: "#9CA3AF" }}
                _focus={{ outline: "none", bg: "white", borderColor: "black" }}
                value={customTargetUser}
                onChange={(e) => setCustomTargetUser(e.target.value)}
                mt="2"
              />
            )}
            
            <Text fontWeight="400" fontSize="14px" mb="-2">
              Tahun dibuat inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="year"
              fontSize="14px"
              placeholder="Ketik tahun"
              _placeholder={{ color: "#9CA3AF" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "none",
              }}
              value={textInputsValue.year}
              onChange={onTextChange}
            />
            
            <Text fontWeight="400" fontSize="14px" mb="-2">
              Deskripsi <span style={{ color: "red" }}>*</span>
            </Text>
            <Flex direction="column" alignItems="flex-start">
              <Textarea
                name="description"
                fontSize="14px"
                placeholder="Masukkan deskripsi singkat tentang inovasi"
                _placeholder={{ color: "#9CA3AF" }}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "none",
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
              Model Bisnis Digital <span style={{ color: "red" }}>*</span>
            </Text>
            <CheckboxGroup
              colorScheme= "green"
              value={selectedModels} 
              onChange={(values) => setSelectedModels(values)}
            >
              <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF" mb="-2">
              Dapat lebih dari 1</Text>
              <Flex gap={4} >
                {/* Kolom Pertama */}
                <Flex direction="column" gap={1}>
                  {[
                    "Gratis",
                    "Layanan Berbayar",
                    "Subsidi Parsial",
                    "Pusat Multi-Layanan",
                    "Koperasi",
                    "Lain-lain",
                  ].map((model, index) => (
                    <Checkbox key={index} value={model} 
                    sx={{
                      "& .chakra-checkbox__control": {
                        borderColor: "#9CA3AF", // Warna border
                        borderWidth: "1px", // Ketebalan garis
                      },
                      ".chakra-checkbox__label": {
                      fontSize: "12px",
                      fontStyle: "normal",
                      }
                    }}>
                      {model}
                    </Checkbox>
                  ))}
                </Flex>
                {/* Kolom Kedua */}
                <Flex direction="column" gap={1}>
                  {[
                    "Model Kemitraan",
                    "Menciptakan Pasar",
                    "Pengumpulan Data",
                    "Pelatihan/Pendidikan",
                    "Perusahaan Sosial",
                  ].map((model, index) => (
                    <Checkbox key={index} value={model}
                    sx={{
                      "& .chakra-checkbox__control": {
                        borderColor: "#9CA3AF", // Warna border
                        borderWidth: "1px", // Ketebalan garis
                      },
                      ".chakra-checkbox__label": {
                      fontSize: "12px",
                      fontStyle: "normal",
                      }
                    }}>
                      {model}
                    </Checkbox>
                  ))}
                </Flex>
              </Flex>
            </CheckboxGroup>
            {selectedModels.includes("Lain-lain") && (
              <Flex direction="column" alignItems="flex-start">
                <Input
                  name="otherBusinessModel"
                  placeholder="Silahkan tulis model bisnis lainnya"
                  value={otherBusinessModel}
                  onChange={(e) => {
                    const wordCount = e.target.value.split(/\s+/).filter((word) => word !== "").length;
                    if (wordCount <= 5) {
                      setOtherBusinessModel(e.target.value)}}}
                  fontSize="14px"
                  fontStyle="normal"
                  mt={-2} // Margin atas agar ada jarak dari checkbox
                  _placeholder={{ color: "#9CA3AF" }}
                  _focus={{
                    outline: "none",
                    boxShadow: "0 0px 0 0 blue",
                  }}
                  border="none"
                  borderBottom="1px solid #9CA3AF"
                  borderRadius="0" 
                />
                <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF">
                {otherBusinessModel.split(/\s+/).filter((word) => word !== "").length}/5 kata
                </Text>
              </Flex>
            )}


            <Text fontWeight="400" fontSize="14px" mb="-2">
              Desa yang menerapkan <span style={{ color: "red" }}>*</span>
            </Text>
            <Flex direction="column" alignItems="flex-start">
              <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF">
                Contoh: Desa A, Desa B, Desa C, dan 50 desa lainnya</Text>
              <Textarea
                name="villages"
                fontSize="14px"
                placeholder="Masukkan beberapa desa yang menerapkan"
                _placeholder={{ color: "#9CA3AF" }}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "none",
                }}
                height="100px"
                value={textInputsValue.villages}
                onChange={onTextChange}
              />
              <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="gray.500">
                {getVillagesWordCount()}/20 kata
              </Text>
            </Flex>

            <Text fontWeight="400" fontSize="14px" mb="-2">
              Kisaran harga <span style={{ color: "red" }}>*</span>
            </Text>
            <Flex direction="column" alignItems="flex-start">
              <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF">
                Contoh: Rp.1.000.000 - Rp. 2.000.000
              </Text>
              <Flex direction='row' justifyContent='center'>
                <InputGroup>
                  <InputLeftElement pointerEvents='none' color='gray.300' fontSize='12px'>
                  Rp.
                  </InputLeftElement>
                  <Input
                  name="priceMin"
                  fontSize="12px"
                  placeholder="Harga minimal"
                  _placeholder={{ color: "#9CA3AF" }}
                  _focus={{
                    outline: "none",
                    bg: "white",
                    border: "none",
                  }}
                  value={textInputsValue.priceMin}
                  onChange={onTextChange}
                />

                </InputGroup>
                <MinusIcon mx="2" color="#9CA3AF" mt="3"/>
                <InputGroup>
                  <InputLeftElement pointerEvents='none' color='gray.300' fontSize='12px'>
                  Rp.
                  </InputLeftElement>
                  <Input
                  name="priceMax"
                  fontSize="12px"
                  placeholder="Harga maksimal"
                  _placeholder={{ color: "#9CA3AF" }}
                  _focus={{
                    outline: "none",
                    bg: "white",
                    border: "none",
                  }}
                  value={textInputsValue.priceMax}
                  onChange={onTextChange}
                />

                </InputGroup>
              </Flex>

            </Flex>

            <Text fontWeight="400" fontSize="14px" mb="-2">
              Foto inovasi <span style={{ color: "red" }}>*</span>
            </Text>
              <Flex direction="column" alignItems="flex-start" >
                <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF" mb="-3">
                  Maks 5 foto, format: png, jpg.
                </Text>
              <ImageUpload 
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                selectFileRef={selectFileRef}
                onSelectImage={onSelectImage}
              />
              </Flex>

            <Text fontWeight="700" fontSize="16px" mb="-2">
              Manfaat Inovasi{" "} <span style={{ color: "red", fontSize: "14px", fontWeight: "400" }}>*</span>
            </Text>
            {benefit.map((benefit, index) => (
              <Flex
                key={index}
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontWeight="400" fontSize="14px">
                  {benefit}
                </Text>
                <Button
                  bg="red.500"
                  _hover={{ bg: "red.600" }}
                  width="32px"
                  height="32px"
                  variant="solid"
                  size="md"
                  onClick={() => {
                    setBenefit(benefit.filter((_: any, i: number) => i !== index));
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Flex>
            ))}
            <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF" >
              Contoh: Pencatatan data otomatis
            </Text>
            <Text fontWeight="400" fontSize="14px" mb="-2">
              Manfaat 1<span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="benefit"
              fontSize="14px"
              placeholder="Masukkan manfaat singkat inovasi"
              _placeholder={{ color: "#9CA3AF" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "none",
              }}
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddBenefit();
                }
              }}
            />

            <Text fontWeight="400" fontSize="14px" mb="-2">
              Deskripsi Manfaat<span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="benefitDescription"
              fontSize="14px"
              placeholder="Masukkan deskripsi manfaat"
              _placeholder={{ color: "#9CA3AF" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "none",
              }}
              value={newBenefitDescription}
              onChange={(e) => setNewBenefitDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddBenefit();
                }
              }}
            />
            <Button
              variant="outline"
              onClick={onAddBenefit}
              _hover={{ bg: "none" }}
              leftIcon={<AddIcon />}
            >
              Tambah Manfaat lain
            </Button>

            <Text fontWeight="700" fontSize="16px" mb="-2">
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
            <Text fontWeight="400" fontStyle= "normal" fontSize="10px" color="#9CA3AF">
              Contoh: Mempunyai listrik
            </Text>
            <Input
              name="requirement"
              fontSize="14px"
              placeholder="Masukkan persyaratan"
              _placeholder={{ color: "#9CA3AF" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "none",
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
          Tambah Inovasi
        </Button>
      </form>
    </Container>
  );
};

export default AddInnovation;