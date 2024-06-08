import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import {
  getProvinsi,
  getKabupaten,
  getKecamatan,
  getKelurahan,
} from "Services/locationServices";
import { updateProfile, getUserById } from "Services/userServices";
import useAuthLS from "Hooks/useAuthLS";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ImageUpload from "../../formComponents/ImageUpload"; // Import the ImageUpload component
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/clientApp"; // Import Firebase storage
import { useNavigate } from "react-router-dom";

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
});

function AddVillage() {
  const navigate = useNavigate();
  const form = useForm({ resolver: zodResolver(schema) });
  const { handleSubmit, reset } = form;

  const { auth } = useAuthLS();
  const { mutateAsync } = useMutation(updateProfile);
  const { data, isFetched } = useQuery<any>(
    "profileVillage",
    () => getUserById(auth?.id),
    {
      enabled: !!auth?.id,
    }
  );

  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

  const [logo, setLogo] = useState<string[]>([]);
  const [header, setHeader] = useState<string[]>([]);

  const selectFileRef = useRef<HTMLInputElement>(null);

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

  const uploadFile = async (file: string, folder: string) => {
    const fileName = `image_${Date.now()}`;
    const storageRef = ref(storage, `village/${folder}/${fileName}`);

    const byteString = atob(file.split(",")[1]);
    const mimeString = file.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise<string>((resolve, reject) => {
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
  };

  const onProfileSave = async (data: any) => {
    try {
      const payload = {
        id: auth?.id,
        data: data,
      };

      if (logo.length > 0) {
        const logoURL = await uploadFile(logo[0], "logo");
        payload.data.logo = logoURL;
      }

      if (header.length > 0) {
        const headerURL = await uploadFile(header[0], "header");
        payload.data.header = headerURL;
      }

      await mutateAsync(payload);
      toast("Data berhasil disimpan", { type: "success" });
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
  };

  useEffect(() => {
    if (isFetched) {
      reset({
        ...(data || {}),
      });
    }
  }, [isFetched]);

  const forms = [
    {
      label: "Provinsi",
      name: "province",
      placeholder: "Pilih provinsi",
      defaultValue: data?.province,
      isDisabled: !!data?.province,
      options:
        provinsi?.provinsi?.map((item: any) => ({
          id: item?.id,
          nama: item?.nama,
        })) || [],
      onChange: (id: any) => setSelectedProvinsi(id),
    },
    {
      label: "Kabupaten/Kota",
      name: "district",
      placeholder: "Pilih kabupaten/kota",
      defaultValue: data?.district,
      isDisabled: !!data?.district,
      options:
        kabupaten?.kota_kabupaten?.map((item: any) => ({
          id: item?.id,
          nama: item?.nama,
        })) || [],
      onChange: (id: any) => setSelectedKabupaten(id),
    },
    {
      label: "Kecamatan",
      name: "subDistrict",
      placeholder: "Pilih kecamatan",
      defaultValue: data?.subDistrict,
      isDisabled: !!data?.subDistrict,
      options:
        kecamatan?.kecamatan?.map((item: any) => ({
          id: item?.id,
          nama: item?.nama,
        })) || [],
      onChange: (id: any) => setSelectedKecamatan(id),
    },
    {
      label: "Desa/Kelurahan",
      name: "village",
      placeholder: "Pilih kelurahan",
      defaultValue: data?.village,
      isDisabled: data?.village,
      options:
        kelurahan?.kelurahan?.map((item: any) => ({
          id: item?.id,
          nama: item?.nama,
        })) || [],
    },
    {
      label: "Nama Desa",
      name: "nameVillage",
      placeholder: "Nama desa",
    },
    {
      label: "Tentang Desa",
      name: "description",
      placeholder: "Masukan deskripsi desa",
    },
    {
      label: "Logo Desa",
      name: "logo",
      placeholder: "Unggah logo desa",
    },
    {
      label: "Header Desa",
      name: "header",
      placeholder: "Unggah header desa",
    },
    {
      label: "Potensi Desa",
      name: "benefit",
      placeholder: "Masukkan potensi desa",
    },
    {
      label: "Nomor WhatsApp",
      name: "whatsApp",
      placeholder: "62812345678",
    },
  ];

  return (
    <Container page px={16}>
      <TopBar title="Profil Desa" onBack={() => navigate("/village")}/>
      <form onSubmit={handleSubmit(onProfileSave)}>
        <Flex direction="column" marginTop="24px">
          <Stack spacing={2} width="100%">
            {forms.map(
              (
                {
                  label,
                  name,
                  placeholder,
                  options,
                  onChange,
                  defaultValue,
                  isDisabled,
                },
                idx
              ) => {
                // dropdown
                if (!!options)
                  return (
                    <React.Fragment key={idx}>
                      <Text fontWeight="400" fontSize="14px">
                        {label} <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Select
                        placeholder={placeholder}
                        name={name}
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
                        defaultValue={defaultValue}
                        onChange={(e) => onChange && onChange(e.target.value)}
                        isDisabled={isDisabled}
                      >
                        {options.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.nama}
                          </option>
                        ))}
                      </Select>
                    </React.Fragment>
                  );

                // Image upload fields
                if (name === "logo" || name === "header") {
                  const imageFiles =
                    name === "logo" ? logo : name === "header" ? header : [];
                  const setImageFiles =
                    name === "logo" ? setLogo : name === "header" ? setHeader : null;
                  return (
                    <React.Fragment key={idx}>
                      <Text fontWeight="400" fontSize="14px">
                        {label} <span style={{ color: "red" }}>*</span>
                      </Text>
                      <ImageUpload
                        selectedFiles={imageFiles}
                        setSelectedFiles={setImageFiles}
                        selectFileRef={selectFileRef}
                        onSelectImage={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const files = event.target.files;
                          if (files) {
                            const imagesArray: string[] = [];
                            for (let i = 0; i < files.length; i++) {
                              const reader = new FileReader();
                              reader.onload = (readerEvent) => {
                                if (readerEvent.target?.result) {
                                  imagesArray.push(readerEvent.target.result as string);
                                  if (imagesArray.length === files.length) {
                                    setImageFiles((prev) => [...prev, ...imagesArray]);
                                  }
                                }
                              };
                              reader.readAsDataURL(files[i]);
                            }
                          }
                        }}
                      />
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={idx}>
                    <Text fontWeight="400" fontSize="14px">
                      {label} <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
                      mt={2}
                      placeholder={placeholder}
                      name={name}
                      fontSize="10pt"
                      _placeholder={{ color: "gray.500" }}
                      _focus={{
                        outline: "none",
                        bg: "white",
                        border: "1px solid",
                        borderColor: "black",
                      }}
                      defaultValue={defaultValue}
                      isDisabled={isDisabled}
                      {...form.register(name)}
                    />
                  </React.Fragment>
                );
              }
            )}
          </Stack>
        </Flex>
        <Button type="submit" mt="20px" width="100%" isLoading={form.formState.isSubmitting}>
          Simpan
        </Button>
      </form>
    </Container>
  );
}

export default AddVillage;
