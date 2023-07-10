import React from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Dropdown from "Components/dropDown";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label } from "./_addInnovation";
import { useMutation, useQuery } from "react-query";
import { addInnovation, getInnovation } from "Services/innovation";
import { toast } from "react-toastify";
import { paths } from "Consts/path";

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
  },
  {
    label: "Icon Inovator",
    type: "url",
    name: "icon",
  },
  {
    label: "Kategori Inovasi",
    type: "text",
    name: "category",
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
    placeholder: "pilih kategori",
  },
  {
    label: "Tahun dibuat inovasi",
    type: "date",
    name: "year",
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
  const { data, isFetched } = useQuery<any>("getInnovations", getInnovation);

  const onAddInnovation = async (data: any) => {
    try {
      await mutateAsync(data);
      toast("Inovasi berhasil ditambahkan", { type: "success" });
      reset();
    } catch (error) {
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
    navigate(paths.INNOVATION_CATEGORY_PAGE);
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
