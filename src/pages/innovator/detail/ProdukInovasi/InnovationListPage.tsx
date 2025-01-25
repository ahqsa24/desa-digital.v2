import React from "react";
import { Flex, Text, SimpleGrid } from "@chakra-ui/react";
import CardInnovation from "Components/card/innovation";

const InnovationListPage = ({ innovations }: any) => {
  return (
    <Flex direction="column" p={4}>
      <Text fontSize="20px" fontWeight="700" mb={4}>
        Semua Produk Inovasi
      </Text>
      <SimpleGrid columns={[1, 2]} spacing={4}>
        {innovations.map((innovation: any, idx: number) => (
          <CardInnovation
            key={idx}
            images={innovation.images}
            namaInovasi={innovation.namaInovasi}
            kategori={innovation.kategori}
            deskripsi={innovation.deskripsi}
            tahunDibuat={innovation.tahunDibuat}
            innovatorLogo={innovation.innovatorImgURL}
            innovatorName={innovation.namaInnovator}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default InnovationListPage;