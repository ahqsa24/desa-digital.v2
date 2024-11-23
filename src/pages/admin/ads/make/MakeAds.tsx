import { MinusIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import Container from "Components/container";
import LogoUpload from "Components/form/LogoUpload";
import TopBar from "Components/topBar";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
// import { auth } from "src/firebase/clientApp";

const MakeAds: React.FC = () => {
  const navigate = useNavigate();
  //   const [user] = useAuthState(auth);

  const [selectedImg, setSelectedImg] = useState<string>("");
  const ImgRef = useRef<HTMLInputElement>(null);
  return (
    <Container page>
      <TopBar title="Tambah Iklan" onBack={() => navigate(-1)} />
      <Stack padding="0 14px" direction="column" mt={4} gap={4}>
        <Box>
          <Text fontSize="14px" fontWeight="400">
            Pemesan Iklan <span style={{ color: "red" }}>*</span>
          </Text>
          <Input
            placeholder="Nama Pemesan Iklan"
            name="name"
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            mt={2}
          />
        </Box>
        <Box>
          <Text fontSize="14px" fontWeight="400">
            Tanggal Iklan <span style={{ color: "red" }}>*</span>
          </Text>
          <Flex align="center" justify="space-between">
            <Input
              placeholder="DD/MM/YYYY"
              name="minDate"
              fontSize="10pt"
              _placeholder={{ color: "gray.500" }}
              mt={2}
              type="date"
              maxW="150px"
            />
            <MinusIcon fontSize="8pt" />
            <Input
              placeholder="DD/MM/YYYY"
              name="maxDate"
              fontSize="10pt"
              _placeholder={{ color: "gray.500" }}
              mt={2}
              type="date"
              maxW="150px"
            />
          </Flex>
        </Box>
        <Box>
          <Text fontSize="14px" fontWeight="400">
            Gambar Iklan <span style={{ color: "red" }}>*</span>
          </Text>
          <Text fontSize="10pt" color="gray.400">
            Format gambar: .jpg, .jpeg, .png
          </Text>
          <Flex>
            <LogoUpload
              selectedLogo={selectedImg}
              setSelectedLogo={setSelectedImg}
              selectFileRef={ImgRef}
              onSelectLogo={() => {}}
            />
          </Flex>
        </Box>
        <Box>
          <Text fontSize="14px" fontWeight="400">
            Link Iklan <span style={{ color: "red" }}>*</span>
          </Text>
          <Input
            placeholder="https://example.com"
            name="link"
            fontSize="10pt"
            _placeholder={{ color: "gray.500" }}
            mt={2}
            type="link"
          />
        </Box>
      </Stack>
      <Flex
        align="center"
        justify="center"
        flexGrow={1}
        padding="12px 18px"
        borderTop="1px solid rgba(0, 0, 0, 0.1)"
        position="fixed"
        bottom="0"
        width="100%"
        maxW="360px"
        boxShadow="0px -2px 4px 0px rgba(0, 0, 0, 0.06), 0px -4px 6px 0px rgba(0, 0, 0, 0.10)"
      >
        <Button width="100%">Kirim Iklan</Button>
      </Flex>
    </Container>
  );
};
export default MakeAds;
