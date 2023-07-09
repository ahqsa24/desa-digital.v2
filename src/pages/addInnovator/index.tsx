import React, { useEffect } from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label } from "./_addInnovatorStyles";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { paths } from "Consts/path";
import { addInnovator, getInnovator } from "Services/innovator";
import Dropdown from "Components/dropDown";
const forms = [
  {
    label: "Nama Inovator",
    type: "text",
    name: "namaInovator",
  },
  {
    label: "Kategori Inovator",
    type: "text",
    name: "kategoriInovator",
    options: [
      "Pertanian Cerdas",
      "Pemasaran Agri-Food dan E-Commerce",
      "E-Government",
      "Sistem Informasi",
      "Layanan Keuangan",
      "Pengembangan Masyarakat dan Ekonomi",
      "Infrastruktur Lokal",
      "Pengelolaan Sumber Daya",
      "Layanan Sosial",
      "E-Tourism",
    ],
    placeholder: "Pilih kategori",
  },
  {
    label: "Target Pengguna",
    type: "text",
    name: "targetPengguna",
  },
  {
    label: "Produk",
    type: "text",
    name: "produk",
    placeholder: "Masukkan nama produk",
  },
  {
    label: "Model Bisnis Digital",
    type: "text",
    name: "modelBisnis",
    placeholder: "Masukkan model bisnis secara singkat",
  },
  {
    label: "Deskripsi",
    type: "text",
    name: "deskripsi",
    placeholder: "Masukkan deskripsi singkat tentang inovator",
  },
  {
    label: "Logo Inovator",
    type: "url",
    name: "logo",
    placeholder: "Tambah Foto",
  },
  {
    label: "Header Inovator",
    type: "url",
    name: "header",
    placeholder: "Tambah Foto",
  },
  {
    label: "Nomor WhatsApp",
    type: "tel",
    name: "nomorWhatsApp",
  },
  {
    label: "Link Instagram",
    type: "url",
    name: "linkInstagram",
  },
  {
    label: "Link Website",
    type: "url",
    name: "linkWebsite",
  },
];

function AddInnovator() {
  const navigate = useNavigate();
  const form = useForm();
  const { handleSubmit, reset } = form;
  const { mutateAsync } = useMutation(addInnovator);
  const { data, isFetched } = useQuery<any>("getInnovator", getInnovator);

  const onRegisterInovator = async (data: any) => {
    try {
      await mutateAsync(data);
      toast("Berhasil menambahkan inovator", { type: "success" });
      reset();
    } catch (error) {
      console.log("err");
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
    navigate(paths.INOVATOR_PAGE);
  };

  const containerStyle = {
    paddingTop: "50px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingBottom: "80px",
  };

  if (isFetched) {
    console.log(data);
  }

  return (
    <Container>
      <TopBar
        title="Profil Inovator"
        onBack={() => navigate(paths.INOVATOR_PAGE)}
      />
      <div style={containerStyle}>
        <form onSubmit={handleSubmit(onRegisterInovator)}>
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
            Tambah Innovator{" "}
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default AddInnovator;
