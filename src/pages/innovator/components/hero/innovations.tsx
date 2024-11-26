import React from "react";
import { Flex, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CardInnovation from "Components/card/innovation";

const InnovationPreview = ({ innovations, innovatorId }: any) => {
  const navigate = useNavigate();

  // Cek jumlah inovasi
  const hasMoreInnovations = innovations.length > 2;

  return (
    <Flex direction="column">
      {/* Header Produk Inovasi */}
      <Flex justify="space-between" align="center">
        <Text fontSize="16px" fontWeight="700">
          Produk Inovasi
        </Text>
        {hasMoreInnovations && (
          <Text
            fontSize="12px"
            fontWeight="500"
            color="#347357"
            cursor="pointer"
            textDecoration="underline"
            onClick={() => navigate(`/innovator/${innovatorId}/all-innovations`)}
          >
            Lainnya
          </Text>
        )}
      </Flex>

      {/* Daftar Produk */}
      <Flex
        mt={4}
        direction="row" // Mengatur elemen sebaris
        gap={4} // Jarak antar card
        wrap="wrap" // Membungkus ke baris baru jika layar tidak cukup lebar
        justify="flex-start" // Mengatur posisi card
        align="stretch"
      >
        {innovations.slice(0, 2).map((innovation: any, idx: number) => (
          <Box key={idx} width="calc(50% - 8px)" display="flex" flexDirection="column"> {/* 50% agar 2 card tampil berdampingan */}
            <CardInnovation
              images={innovation.images}
              namaInovasi={innovation.namaInovasi}
              kategori={innovation.kategori}
              deskripsi={innovation.deskripsi}
              tahunDibuat={innovation.tahunDibuat}
              innovatorLogo={innovation.innovatorImgURL}
              innovatorName={innovation.namaInnovator}
            />
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default InnovationPreview;
