import React, { useState, useEffect } from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { Label } from "./_profileStyle";
import Dropdown from "Components/dropDown";
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

import { Box, Image, Input, Text, Textarea } from "@chakra-ui/react"; // Ensure Textarea is imported

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validation schema
const schema = z.object({
  benefit: z.string().min(1, { message: "*Potensi desa wajib diisi" }),
  whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
  province: z.string().min(1, { message: "*Pilih Provinsi" }),
  district: z.string().min(1, { message: "*Pilih Kabupaten/Kota" }),
  subDistrict: z.string().min(1, { message: "*Pilih Kecamatan" }),
  village: z.string().min(1, { message: "*Pilih Kelurahan" }),
  logo: z
    .instanceof(File)
    .refine((file) => file.name !== "", "*Silahkan masukkan logo"),
  header: z.instanceof(File).optional(),
  innovation: z
    .string()
    .min(1, { message: "*Tentang inovasi di desa wajib diisi" }),
  characteristics: z.object({
    geographical: z.string().min(1, { message: "*Geografis wajib diisi" }),
    infrastructure: z
      .string()
      .min(1, { message: "*Infrastruktur wajib diisi" }),
    digitalReadiness: z
      .string()
      .min(1, { message: "*Kesiapan digital wajib diisi" }),
    digitalLiteracy: z
      .string()
      .min(1, { message: "*Literasi digital wajib diisi" }),
    serviceImprovement: z
      .string()
      .min(1, { message: "*Pemantapan pelayanan wajib diisi" }),
    socialCulture: z
      .string()
      .min(1, { message: "*Sosial dan budaya wajib diisi" }),
    naturalResources: z
      .string()
      .min(1, { message: "*Sumber daya alam wajib diisi" }),
  }),
  contact: z.object({
    whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
    instagram: z.string().min(1, { message: "*Link Instagram wajib diisi" }),
    website: z.string().min(1, { message: "*Link Website wajib diisi" }),
  }),
});

// ImageUpload component defined within the same file
const ImageUpload = ({ selectedFile, onSelectImage, label, isRequired }) => {
  return (
    <Box
      border="1px dashed #ccc"
      padding="20px"
      textAlign="center"
      cursor="pointer"
      position="relative"
      onClick={() => document.getElementById(label).click()}
      width="120px"
      height="120px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="10px" // Set border-radius to round the corners
    >
      {selectedFile ? (
        <Image
          src={selectedFile}
          alt={label}
          maxHeight="100%"
          maxWidth="100%"
          borderRadius="10px"
        />
      ) : (
        <>
          <Text color="gray.500">+ Tambah foto</Text>
          {isRequired && <Text color="gray.500"></Text>}
        </>
      )}
      <Input type="file" id={label} display="none" onChange={onSelectImage} />
    </Box>
  );
};

function AddVillage() {
  const form = useForm({ resolver: zodResolver(schema) });
  const { handleSubmit, reset, control } = form;

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
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);

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

  const onSelectImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        if (readerEvent.target?.result) {
          setImage(readerEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
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
      type: "text",
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
      type: "text",
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
      type: "text",
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
      type: "text",
      name: "village",
      placeholder: "Pilih kelurahan",
      value: data?.village,
      defaultValue: data?.village,
      isDisabled: data?.village,
      options:
        kelurahan?.kelurahan?.map((item: any) => ({
          id: item?.id,
          nama: item?.nama,
        })) || [],
    },
    {
      label: "Logo Desa",
      type: "file",
      name: "logo",
      placeholder: "Upload logo",
    },
    {
      label: "Header Desa",
      type: "file",
      name: "header",
      placeholder: "Upload header",
      isOptional: true,
    },
    {
      label: "Tentang Inovasi di Desa",
      type: "textarea",
      name: "innovation",
      placeholder: "Masukkan deskripsi inovasi yang ada di desa",
    },
    {
      label: "Potensi Desa",
      type: "text",
      name: "benefit",
      placeholder: "Masukkan potensi desa",
    },
    {
      label: "Karakteristik Desa",
      type: "heading",
      isBold: true,
    },
    {
      label: "Geografis",
      type: "text",
      name: "characteristics.geographical",
      placeholder: "Masukkan informasi geografis",
    },
    {
      label: "Infrastruktur",
      type: "text",
      name: "characteristics.infrastructure",
      placeholder: "Masukkan informasi infrastruktur",
    },
    {
      label: "Kesiapan Digital",
      type: "text",
      name: "characteristics.digitalReadiness",
      placeholder: "Masukkan informasi kesiapan digital",
    },
    {
      label: "Literasi Digital",
      type: "text",
      name: "characteristics.digitalLiteracy",
      placeholder: "Masukkan informasi literasi digital",
    },
    {
      label: "Pemantapan Pelayanan",
      type: "text",
      name: "characteristics.serviceImprovement",
      placeholder: "Masukkan informasi pemantapan pelayanan",
    },
    {
      label: "Sosial dan Budaya",
      type: "text",
      name: "characteristics.socialCulture",
      placeholder: "Masukkan informasi sosial dan budaya",
    },
    {
      label: "Sumber Daya Alam",
      type: "text",
      name: "characteristics.naturalResources",
      placeholder: "Masukkan informasi sumber daya alam",
    },
    {
      label: "Kontak Desa",
      type: "heading",
      isBold: true,
    },
    {
      label: "Nomor WhatsApp",
      type: "tel",
      name: "contact.whatsApp",
      placeholder: "62812345678",
    },
    {
      label: "Link Instagram",
      type: "url",
      name: "contact.instagram",
      placeholder: "https://instagram.com",
    },
    {
      label: "Link Website",
      type: "url",
      name: "contact.website",
      placeholder: "https://website.com",
    },
  ];

  const onProfileSave = async (data: any) => {
    try {
      const payload = {
        id: auth?.id,
        data: data,
      };
      await mutateAsync(payload);
      toast("Data berhasil disimpan", { type: "success" });
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
  };

  return (
    <Container page px={16}>
      <TopBar title="Edit Profil Desa" />
      <form onSubmit={handleSubmit(onProfileSave)}>
        {forms?.map(
          (
            {
              label,
              type,
              name,
              placeholder,
              options,
              onChange,
              defaultValue,
              isDisabled,
              isOptional,
              isBold,
            },
            idx
          ) => {
            if (type === "heading") {
              return (
                <React.Fragment key={idx}>
                  <Text
                    as="h2"
                    fontWeight={isBold ? "bold" : "normal"}
                    color="black"
                  >
                    {label}
                  </Text>
                </React.Fragment>
              );
            }
            if (type === "file") {
              return (
                <React.Fragment key={idx}>
                  <Label mt={12} color="black">
                    {label}
                    {!isOptional && <span style={{ color: "red" }}> * </span>}
                  </Label>
                  <ImageUpload
                    selectedFile={
                      name === "logo" ? selectedLogo : selectedHeader
                    }
                    onSelectImage={(e) =>
                      onSelectImage(
                        e,
                        name === "logo" ? setSelectedLogo : setSelectedHeader
                      )
                    }
                    label={name}
                    isRequired={!isOptional}
                  />
                </React.Fragment>
              );
            }
            if (type === "textarea") {
              return (
                <React.Fragment key={idx}>
                  <Label mt={12} color="black">
                    {label}
                    {!isOptional && <span style={{ color: "red" }}> * </span>}
                  </Label>
                  <Textarea
                    mt={4}
                    placeholder={placeholder || label}
                    name={name}
                    form={form}
                    rows={4} // Add rows attribute to make the textarea larger
                    color="black" // Make text inside textarea black
                  />
                </React.Fragment>
              );
            }
            if (!!options)
              return (
                <React.Fragment key={idx}>
                  <Label mt={12} color="black">
                    {label}
                    {!isOptional && <span style={{ color: "red" }}> * </span>}
                  </Label>
                  <Dropdown
                    form={form}
                    name={name}
                    options={options}
                    onChange={onChange}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    isDisabled={isDisabled}
                  />
                </React.Fragment>
              );

            return (
              <React.Fragment key={idx}>
                <Label mt={12} color="black">
                  {label}
                  {!isOptional && <span style={{ color: "red" }}> * </span>}
                </Label>
                <TextField
                  mt={4}
                  placeholder={placeholder || label}
                  type={type}
                  name={name}
                  form={form}
                  color="black" // Make text inside TextField black
                />
              </React.Fragment>
            );
          }
        )}
        <Button size="m" fullWidth mt={12} type="submit">
          Simpan
        </Button>
      </form>
    </Container>
  );
}

export default AddVillage;
