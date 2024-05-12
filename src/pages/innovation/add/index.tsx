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
import { User } from "firebase/auth";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../formComponents/ImageUpload";

type AddInnovationProps = {
  user: User;
  textInputs: {
    name: string;
    year: string;
    description: string;
    requirement: string;
  };
};

const AddInnovation: React.FC<AddInnovationProps> = ({ user, textInputs }) => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<string>();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textInputsValue, setTextInputsValue] = useState({
    name: "",
    year: "",
    description: "",
  });
  const [category, setCategory] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

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

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputsValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSelectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const onAddRequirement = () => {
    if (newRequirement.trim() !== "") {
      setRequirements((prev) => [...prev, newRequirement]);
      setNewRequirement("");
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
              value={textInputsValue.name}
              onChange={onTextChange}
            />
            <Text fontWeight="400" fontSize="14px">
              Kategori Inovasi <span style={{ color: "red" }}>*</span>
            </Text>
            <Select
              placeholder="Pilih kategori"
              name="category"
              fontSize="10pt"
              variant="outline"
              cursor="pointer"
              color={"gray.500"}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              _placeholder={{ color: "gray.500" }}
              value={category}
              onChange={onSelectCategory}
            >
              <option value="Pertanian Cerdas">Pertanian Cerdas</option>
              <option value="Pemasaran Agri-Food dan E-Commerce">
                Pemasaran Agri-Food dan E-Commerce
              </option>
              <option value="E-Government">E-Government</option>
              <option value="Sistem Informasi">Sistem Informasi</option>
              <option value="Layanan Keuangan">Layanan Keuangan</option>
              <option value="Pengembangan Masyarakat dan Ekonomi">
                Pengembangan Masyarakat dan Ekonomi
              </option>
              <option value="Pengelolaan Sumberdaya">
                Pengelolaan Sumberdaya
              </option>
              <option value="Layanan Sosial">Layanan Sosial</option>
              <option value="E-Tourism">E-Tourism</option>
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
              value={textInputsValue.year}
              onChange={onTextChange}
            />
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
              value={textInputsValue.description}
              onChange={onTextChange}
            />
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
            {requirements.map((requirement, index) => (
              <Flex
                key={index}
                justifyContent="space-between"
                alignItems="center"
                mt="10px"
              >
                <Text>{requirement}</Text>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRequirements(requirements.filter((_, i) => i !== index));
                  }}
                >
                  Hapus
                </Button>
              </Flex>
            ))}
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
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddRequirement();
                }
              }}
            />
            <Button
              variant="outline"
              onClick={onAddRequirement}
              _hover={{ bg: "none" }}
            >
              Tambah Kebutuhan
            </Button>
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
