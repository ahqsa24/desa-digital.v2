import React, { useEffect } from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label, FormContainer } from "./_innovatorStyles";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { updateProfile, getUserById } from "Services/userServices";
import useAuthLS from "Hooks/useAuthLS";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  innovatorName: z.string().min(1, { message: "*Nama inovator wajib diisi" }),
  targetUser: z.string().min(1, { message: "*Target pengguna wajib diisi" }),
  product: z.string().min(1, { message: "*Isi nama produk" }),
  description: z.string().min(1, { message: "*Deskripsi wajib diisi" }),
  modelBusiness: z.string().min(1, { message: "*Model bisnis wajib diisi" }),
  logo: z.string().min(1, { message: "*Silahkan masukkan logo" }),
  background: z.string().min(1, { message: "*Silahkan masukkan background" }),
  whatsApp: z.string().min(1, { message: "*Nomor whatsapp wajib diisi" }),
  website: z.string().min(1, { message: "*Website wajib diisi" }),
  instagram: z.string().min(1, { message: "*Instagram wajib diisi" }),
});

const forms = [
  {
    label: "Nama Inovator",
    type: "text",
    name: "innovatorName",
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
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset } = form;

  const { mutateAsync } = useMutation(updateProfile);
  const { auth } = useAuthLS();

  const { data, isFetched } = useQuery(
    "profileInnovator",
    () => getUserById(auth?.id),
    {
      enabled: !!auth?.id,
    }
  );

  const onProfileSave = async (data: any) => {
    console.log(data);
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
          {forms?.map(({ label, type, name, placeholder }, idx) => (
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
          ))}

          <Button size="m" fullWidth mt={12} type="submit">
            Simpan
          </Button>
        </form>
      </FormContainer>
    </Container>
  );
}

export default Profile;
