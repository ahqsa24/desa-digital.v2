import React, { useEffect } from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import Dropdown from "Components/dropDown";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label, FormContainer } from "./_innovatorStyles";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { updateProfile, getUserById } from "Services/userServices";
import useAuthLS from "Hooks/useAuthLS";

const forms = [
  {
    label: "Nama Inovator",
    type: "text",
    name: "inovatorName",
  },
  {
    label: "Kategori Inovator",
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
    label: "Target Pengguna",
    type: "text",
    name: "targetUser",
    placeholder: "contoh: nelayan",
  },
  {
    label: "Produk",
    type: "text",
    name: "product",
    placeholder: "Masukkan nama produk",
  },
  {
    label: "Model Bisnis Digital",
    type: "text",
    name: "modelBusiness",
    placeholder: "Masukkan model bisnis secara singkat",
  },
  {
    label: "Deskripsi",
    type: "text",
    name: "description",
    placeholder: "Masukkan deskripsi singkat tentang inovator",
  },
  {
    label: "Logo Inovator",
    type: "url",
    name: "logo",
    placeholder: "https://",
  },
  {
    label: "Header Inovator",
    type: "url",
    name: "background",
    placeholder: "https://",
  },
  {
    label: "Nomor WhatsApp",
    type: "tel",
    name: "whatsApp",
    placeholder: "0812345678",
  },
  {
    label: "Link Instagram",
    type: "url",
    name: "instagram",
    placeholder: "https://instagram.com/username",
  },
  {
    label: "Link Website",
    type: "url",
    name: "website",
    placeholder: "https://",
  },
];

function Profile() {
  const navigate = useNavigate();
  const form = useForm();
  const { handleSubmit, reset } = form;

  const { mutateAsync } = useMutation(updateProfile);
  const { auth } = useAuthLS();

  const { data, isFetched } = useQuery("profile", () => getUserById(auth?.id), {
    enabled: !!auth?.id,
  });

  const onProfileSave = async (data: any) => {
    try {
      const payload = {
        id: auth?.id,
        data: data,
      };
      await mutateAsync(payload);
      toast("Data profil berhasil disimpan", { type: "success" });
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
    <Container page>
      <TopBar title="Profil Inovator" onBack={() => navigate(-1)} />
      <FormContainer>
        <form onSubmit={handleSubmit(onProfileSave)}>
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
            Simpan
          </Button>
        </form>
      </FormContainer>
    </Container>
  );
}

export default Profile;
