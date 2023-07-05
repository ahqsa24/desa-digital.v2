import React from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label } from "./_addVillage";
import Dropdown from "Components/dropDown";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { addVillage } from "Services/villages";
import { paths } from "Consts/path";

const forms = [
  {
    label: "Provinsi",
    type: "text",
    name: "name",
    options: ["Jawa Barat"],
    placeholder:""

  },
  {
    label: "Kabupaten/Kota",
    type: "text",
    name: "city",
    options: ["Bandung"],
    placeholder:""

  },
  {
    label: "Kecamatan",
    type: "text",
    name: "subdistrict",
    options: ["Buah Batu"],
    placeholder:""

  },
  {
    label: "Desa/Kelurahan",
    type: "text",
    name: "village",
    options: ["Bojong Soang"],
    placeholder:""

  },
  {
    label: "Tentang Inovasi Desa",
    type: "text",
    name: "description",
    placeholder:""

  },
  
  {
    label: "Potensi Desa",
    type: "text",
    name: "benefit",
    placeholder:""
  },
];

function AddVillage() {
  const navigate = useNavigate();
  const form = useForm();
  const { handleSubmit, reset } = form;

  const { mutateAsync } = useMutation(addVillage);

  const onAddVillage = async (data: any) => {
    try {
      await mutateAsync(data);
      toast("Desa berhasil ditambahkan", { type: "success" });
      reset();
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
  };

  return (
    <Container page px={16}>
      <TopBar title="Registrasi Desa" />
      <form onSubmit={handleSubmit(onAddVillage)}>
        {forms?.map(({ label, type, name, placeholder, options }, idx) => {
          if (!!options)
            return (
              <React.Fragment key={idx}>
                <Label mt={12}>{label} </Label>
                <Dropdown options={options} form={form} name={name} />
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

        <Button
          size="m"
          fullWidth
          mt={12}
          type="submit"
          onClick={() => navigate(paths.VILLAGE_PAGE)}
        >
          Tambah Inovasi{" "}
        </Button>
      </form>
    </Container>
  );
}

export default AddVillage;
