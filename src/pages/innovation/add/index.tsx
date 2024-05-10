import {
  Button,
  Flex,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Container from "Components/container";
import TopBar from "Components/topBar";
import { paths } from "Consts/path";
import useAuthLS from "Hooks/useAuthLS";
import { addInnovation } from "Services/innovationServices";
import { User } from "firebase/auth";
import React, { useRef, useState } from "react";
import { useMutation } from "react-query";
import { generatePath, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageUpload from "../../formComponents/ImageUpload";


type AddInnovationProps = {
  user: User;
  textInputs: {
    name: string;
    year: string;
    description: string;
    requirement: string;
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
};

const AddInnovation: React.FC<AddInnovationProps> = ({
  user,
  textInputs,
  onChange,
  handleSubmit,
  loading,
}) => {
  const navigate = useNavigate();

  const { mutateAsync } = useMutation(addInnovation);
  const { auth } = useAuthLS();

  const [selectedFile, setSelectedFile] = useState<string>();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const onAddInnovation = async (data: any) => {
    console.log(data);
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
      console.log(error);
      toast("Terjadi kesalahan jaringan", { type: "error" });
    }
  };

  return (
    <Container page px={16}>
      <TopBar title="Tambahkan Inovasi" onBack={() => navigate(-1)} />
      <form>
        <Flex direction="column" marginTop="24px">
          <Stack spacing={3} width="100%">
            <Text fontWeight="400" fontSize="14px">
              Nama Inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="name"
              fontSize="10pt"
              placeholder="Nama Inovasi"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              // value={}
              // onChange={}
            ></Input>
            <Text fontWeight="400" fontSize="14px">
              Kategori Inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih kategori"
              name="category"
              fontSize="10pt"
              variant="outline"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              _placeholder={{ color: "gray.500" }}
              // value={}
              // onChange={}
            >
              <option value="option1">Pertanian Cerdas</option>
              <option value="option2">
                Pemasaran Agri-Food dan E-Commerce
              </option>
              <option value="option3">E-Government</option>
              <option value="option3">Sistem Informasi</option>
              <option value="option3">Layanan Keuangan</option>
              <option value="option3">
                Pengembangan Masyarakat dan Ekonomi
              </option>
              <option value="option3">Pengelolaan Sumberdaya</option>
              <option value="option3">Layanan Sosial</option>
              <option value="option3">E-Tourism</option>
            </Select>
            <Text fontWeight="400" fontSize="14px">
              Tahun dibuat inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Input
              name="year"
              fontSize="10pt"
              placeholder="Ketik tahun"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              // value={}
              // onChange={}
            ></Input>
            <Text fontWeight="400" fontSize="14px">
              Deskripsi <span style={{ color: "red" }}>*</span>
            </Text>
            <Textarea
              name="description"
              fontSize="10pt"
              placeholder="Deskripsi singkat"
              _placeholder={{ color: "gray.500" }}
              _focus={{ outline: "none", bg: "white", borderColor: "black" }}
              height="100px"
              // value={}
              // onChange={}
            ></Textarea>
            <Text fontWeight="400" fontSize="14px">
              Foto inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <ImageUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              selectFileRef={selectFileRef}
              onSelectImage={onSelectImage}
            />
            <Text fontWeight="700" fontSize="16px">
              Perlu disiapkan{" "}
              <span
                style={{ color: "red", fontSize: "14px", fontWeight: "400" }}
              >
                *
              </span>
            </Text>
            <Input
              name="requirement"
              fontSize="10pt"
              placeholder="Contoh: Memerlukan listrik, Memiliki air"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              // value={}
              // onChange={}
            />
          </Stack>
        </Flex>
        <Button type="submit" mt="20px" width="100%" isLoading={loading}>
          Tambah Inovasi
        </Button>
      </form>
    </Container>
  );
};

export default AddInnovation;
