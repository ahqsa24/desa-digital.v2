import React, { useState, useEffect, useRef } from "react";
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
import TopBar from "Components/topBar";
import Container from "Components/container";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import HeaderUpload from "../../../components/form/HeaderUpload";
import LogoUpload from "../../../components/form/LogoUpload";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../../../firebase/clientApp";
import { useNavigate } from "react-router-dom";
import {
  getProvinsi,
  getKabupaten,
  getKecamatan,
  getKelurahan,
} from "Services/locationServices";
import { updateProfile, getUserById } from "Services/userServices";
import useAuthLS from "Hooks/useAuthLS";

const schema = z.object({
  nameVillage: z.string().min(1, { message: "*Nama desa wajib diisi" }),
  description: z.string().min(1, { message: "*Deskripsi desa wajib diisi" }),
  benefit: z.string().min(1, { message: "*Keuntungan wajib diisi" }),
  whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
  province: z.string().min(1, { message: "*Pilih Provinsi" }),
  district: z.string().min(1, { message: "*Pilih Kabupaten/Kota" }),
  subDistrict: z.string().min(1, { message: "*Pilih Kecamatan" }),
  village: z.string().min(1, { message: "*Pilih Kelurahan" }),
  logo: z.string().optional(),
  header: z.string().optional(),
  instagram: z.string().url({ message: "Invalid URL format" }).optional(),
  website: z.string().url({ message: "Invalid URL format" }).optional(),
  geographic: z.string().optional(),
  infrastructure: z.string().optional(),
  digitalReadiness: z.string().optional(),
  digitalLiteracy: z.string().optional(),
  serviceImprovement: z.string().optional(),
  socialCulture: z.string().optional(),
  naturalResources: z.string().optional(),
});

const AddVillage: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuthLS();
  const {
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });
  const { mutateAsync } = useMutation(updateProfile);
  const { data, isFetched } = useQuery<any>(
    "profileVillage",
    () => getUserById(auth?.id),
    { enabled: !!auth?.id }
  );
  const toast = useToast();

  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedLogo, setSelectedLogo] = useState<string>("");
  const [selectedHeader, setSelectedHeader] = useState<string>("");
  const selectLogoRef = useRef<HTMLInputElement>(null);
  const selectHeaderRef = useRef<HTMLInputElement>(null);

  const { data: provinsi } = useQuery<any>("provinsi", getProvinsi);
  const { data: kabupaten } = useQuery<any>(
    ["kabupaten", selectedProvinsi],
    () => getKabupaten(selectedProvinsi || data?.province),
    { enabled: !!selectedProvinsi || isFetched }
  );
  const { data: kecamatan } = useQuery<any>(
    ["kecamatan", selectedKabupaten],
    () => getKecamatan(selectedKabupaten || data?.district),
    { enabled: !!selectedKabupaten || isFetched }
  );
  const { data: kelurahan } = useQuery<any>(
    ["kelurahan", selectedKecamatan],
    () => getKelurahan(selectedKecamatan || data?.subDistrict),
    { enabled: !!selectedKecamatan || isFetched }
  );

  useEffect(() => {
    if (isFetched) {
      reset({ ...(data || {}) });
    }
  }, [isFetched]);

  const uploadImage = async (image: string, folder: string, userId: string) => {
    const storageRef = ref(storage, `village/${userId}/${folder}`);
    await uploadString(storageRef, image, "data_url");
    return await getDownloadURL(storageRef);
  };

  const onProfileSave = async (data: any) => {
    if (!auth?.id) {
      toast({
        title: "User ID is not defined. Please make sure you are logged in.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const payload = {
        id: auth.id,
        data: data,
      };

      if (selectedLogo) {
        const logoURL = await uploadImage(selectedLogo, "logo", auth.id);
        payload.data.logo = logoURL;
      }

      if (selectedHeader) {
        const headerURL = await uploadImage(selectedHeader, "header", auth.id);
        payload.data.header = headerURL;
      }

      await mutateAsync(payload);
      toast({
        title: "Data berhasil disimpan",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate(-1);
    } catch (error) {
      toast({
        title: "Terjadi kesalahan jaringan",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSelectLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedLogo(readerEvent.target.result as string);
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
        setSelectedHeader(readerEvent.target.result as string);
      }
    };
  };

  return (
    <Container page px={16}>
      <TopBar title="Registrasi Desa" onBack={() => navigate(-1)} />
      <form onSubmit={handleSubmit(onProfileSave)}>
        <Flex direction="column" marginTop="24px">
          <Stack spacing={3} width="100%">
            <Text fontWeight="400" fontSize="14px">
              Nama Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              fontSize="10pt"
              placeholder="Nama Desa"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              {...register("nameVillage")}
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
              {...register("province")}
              onChange={(e) => setSelectedProvinsi(e.target.value)}
            >
              {provinsi?.provinsi?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
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
              {...register("district")}
              onChange={(e) => setSelectedKabupaten(e.target.value)}
            >
              {kabupaten?.kota_kabupaten?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
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
              {...register("subDistrict")}
              onChange={(e) => setSelectedKecamatan(e.target.value)}
            >
              {kecamatan?.kecamatan?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
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
              {...register("village")}
            >
              {kelurahan?.kelurahan?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </Select>

            <Text fontWeight="400" fontSize="14px">
              Logo Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <LogoUpload
              selectedLogo={selectedLogo}
              setSelectedLogo={setSelectedLogo}
              selectFileRef={selectLogoRef}
              onSelectLogo={onSelectLogo}
            />

            <Text fontWeight="400" fontSize="14px">
              Header Desa
            </Text>
            <HeaderUpload
              selectedHeader={selectedHeader}
              setSelectedHeader={setSelectedHeader}
              selectFileRef={selectHeaderRef}
              onSelectHeader={onSelectHeader}
            />

            <Text fontWeight="400" fontSize="16px">
              Tentang Inovasi di Desa <span style={{ color: "red" }}>*</span>
            </Text>
            <Textarea
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
              {...register("description")}
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
              {...register("benefit")}
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
              {...register("geographic")}
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
              {...register("infrastructure")}
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
              {...register("digitalReadiness")}
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
              {...register("digitalLiteracy")}
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
              {...register("serviceImprovement")}
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
              {...register("socialCulture")}
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
              {...register("naturalResources")}
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
              {...register("whatsApp")}
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
              {...register("instagram")}
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
              {...register("website")}
            />
          </Stack>
        </Flex>
        <Button type="submit" mt="20px" width="100%" isLoading={isSubmitting}>
          Simpan
        </Button>
      </form>
    </Container>
  );
};

export default AddVillage;
