import React from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Dropdown from "Components/dropDown";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { generatePath, useNavigate } from "react-router-dom";
import { Label } from "./_addStyle";
import { useMutation } from "react-query";
import { addInnovation } from "Services/innovationServices";
import { toast } from "react-toastify";
import { paths } from "Consts/path";
import useAuthLS from "Hooks/useAuthLS";

const forms = [
  {
    label: "Nama Inovasi",
    type: "text",
    name: "name",
  },
  {
    label: "Header Inovasi",
    type: "url",
    name: "background",
    placeholder: "https://",
  },
  {
    label: "Icon Innovator",
    type: "url",
    name: "logo",
    placeholder: "https://",
  },
  {
    label: "Kategori Inovasi",
    type: "text",
    name: "category",
    placeholder: "Pilih kategori",
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
  },
  {
    label: "Tanggal dibuat inovasi",
    type: "date",
    name: "date",
  },
  {
    label: "Deskripsi",
    type: "text",
    name: "description",
    placeholder: "Deskripsi singkat produk",
  },
  {
    label: "Keuntungan",
    type: "text",
    name: "benefit",
  },
  {
    label: "Perlu disiapkan",
    placeholder: "Contoh: memerlukan listrik",
    type: "text",
    name: "requirement",
  },
];

function AddInnovation() {
  const navigate = useNavigate();
  const form = useForm();
  const { handleSubmit, reset } = form;

  const { mutateAsync } = useMutation(addInnovation);
  const { auth } = useAuthLS();

  const onAddInnovation = async (data: any) => {
    try {
      const payload = {
        ...data,
        innovatorId: auth?.id,
      };
      await mutateAsync(payload);
      toast("Inovasi berhasil ditambahkan", { type: "success" });
      navigate(
        generatePath(paths.INNOVATION_CATEGORY_PAGE, {
          category: data?.category,
        })
      );
      reset();
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
  };

  return (
    <Container page px={16}>
      <TopBar title="Tambahkan Inovasi" onBack={() => navigate(-1)} />
      <form onSubmit={handleSubmit(onAddInnovation)}>
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
          Tambah Inovasi{" "}
        </Button>
      </form>
    </Container>
  );
}

export default AddInnovation;
