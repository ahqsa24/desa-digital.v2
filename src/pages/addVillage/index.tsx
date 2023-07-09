import React from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label } from "./_addVillage";
import Dropdown from "Components/dropDown";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { addVillage, getVillages } from "Services/villages";
import { paths } from "Consts/path";
import { getProvinsi } from "Services/locationServices";

const forms = [
  {
    label: "Provinsi",
    type: "text",
    name: "name",
    options: ["Jawa Barat"],
    placeholder: "Semua Provinsi",
  },
  {
    label: "Kabupaten/Kota",
    type: "text",
    name: "city",
    options: ["Bandung"],
    placeholder: "Semua Kabupaten/Kota",
  },
  {
    label: "Kecamatan",
    type: "text",
    name: "subdistrict",
    options: ["Buah Batu"],
    placeholder: "Semua Kecamatan",
  },
  {
    label: "Desa/Kelurahan",
    type: "text",
    name: "village",
    options: ["Bojong Soang"],
    placeholder: "Semua Kelurahan",
  },
  {
    label: "Nama Desa",
    type: "text",
    name: "nameVillage",
    placeholder: "Nama Desa",
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
    placeholder: "Tambah Foto",
  },
  {
    label: "Header Desa",
    type: "url",
    name: "header",
    placeholder: "Tambah Foto",
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
    name: "nomorWhatsApp",
  },
];

function AddVillage() {
  const navigate = useNavigate();
  const form = useForm();
  const { handleSubmit, reset } = form;
  const { mutateAsync } = useMutation(addVillage);
  const { data, isFetched } = useQuery<any>("getInnovator", getVillages);

  const onAddVillage = async (data: any) => {
    try {
      await mutateAsync(data);
      toast("Desa berhasil ditambahkan", { type: "success" });
      reset();
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
    navigate(paths.VILLAGE_PAGE);
  };

  if (isFetched) {
    console.log(data);
  }

  return (
    <Container page px={16}>
      <TopBar title="Profil Desa" />
      <form onSubmit={handleSubmit(onAddVillage)}>
        {forms?.map(({ label, type, name, placeholder, options }, idx) => {
          if (!!options)
            return (
              <React.Fragment key={idx}>
                <Label mt={12}>{label} </Label>
                <Dropdown
                  options={options}
                  form={form}
                  name={name}
                  placeholder={placeholder}
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
        })}

        <Button size="m" fullWidth mt={12} type="submit">
          Tambah Desa{" "}
        </Button>
      </form>
    </Container>
  );
}

export default AddVillage;
