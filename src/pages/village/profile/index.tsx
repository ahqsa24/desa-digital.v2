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

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  nameVillage: z.string().min(1, { message: "*Nama desa wajib diisi" }),
  description: z.string().min(1, { message: "*Deskripsi desa wajib diisi" }),
  benefit: z.string().min(1, { message: "*Keuntungan wajib diisi" }),
  whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
});

function AddVillage() {
  const form = useForm({ resolver: zodResolver(schema) });
  const { handleSubmit, reset } = form;

  const { auth } = useAuthLS();
  const { mutateAsync } = useMutation(updateProfile);
  const { data, isFetched } = useQuery<any>(
    "profile",
    () => getUserById(auth?.id),
    {
      enabled: !!auth?.id,
    }
  );

  // id
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

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

  const forms = [
    {
      label: "Provinsi",
      type: "text",
      name: "province",
      placeholder: "Pilih provinsi",
      defaultValue: data?.province,
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
      options:
        kelurahan?.kelurahan?.map((item: any) => ({
          id: item?.id,
          nama: item?.nama,
        })) || [],
    },
    {
      label: "Nama Desa",
      type: "text",
      name: "nameVillage",
      placeholder: "Nama desa",
    },
    {
      label: "Tentang Inovasi Desa",
      type: "text",
      name: "description",
      placeholder: "Masukan deskripsi inovasi yang ada di desa",
    },
    {
      label: "Logo Desa",
      type: "url",
      name: "logo",
      placeholder: "https://",
    },
    {
      label: "Header Desa",
      type: "url",
      name: "header",
      placeholder: "https://",
    },

    {
      label: "Potensi Desa",
      type: "text",
      name: "benefit",
      placeholder: "Masukkan potensi desa",
    },
    {
      label: "Nomor WhatsApp",
      type: "tel",
      name: "whatsApp",
      placeholder: "62812345678",
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

  useEffect(() => {
    if (isFetched) {
      reset({
        ...(data || {}),
      });
    }
  }, [isFetched]);

  return (
    <Container page px={16}>
      <TopBar title="Profil Desa" />
      <form onSubmit={handleSubmit(onProfileSave)}>
        {forms?.map(
          (
            { label, type, name, placeholder, options, onChange, defaultValue },
            idx
          ) => {
            // dropdown
            if (!!options)
              return (
                <React.Fragment key={idx}>
                  <Label mt={12}>{label} </Label>
                  <Dropdown
                    form={form}
                    name={name}
                    options={options}
                    onChange={onChange}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                  />
                </React.Fragment>
              );

            return (
              <React.Fragment key={idx}>
                <Label mt={12}>{label} </Label>
                <TextField
                  mt={4}
                  placeholder={placeholder || label}
                  type={type}
                  name={name}
                  form={form}
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
