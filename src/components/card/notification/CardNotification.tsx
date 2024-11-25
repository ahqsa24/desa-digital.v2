import { Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

type CardNotificationProps = {};
// TODO: Buat agar card ini bisa di klik dan arahkan ke halaman detail

const CardNotification: React.FC<CardNotificationProps> = () => {
  return (
    <Stack padding="20px" gap={2}>
      <Flex
        padding="12px"
        borderRadius="8px"
        border="1px solid"
        borderColor="gray.300"
        direction="column"
        boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10);"
        cursor="pointer"
      >
        <Flex justifyContent="space-between">
          <Text
            fontSize="14px"
            fontWeight="700"
            lineHeight="140%"
            width="221px"
          >
            Desa Soge
          </Text>
          <Flex
            justifyContent="center"
            alignItems="center"
            width="79px"
            height="18px"
            borderRadius="12px"
            border="0.5px solid"
            borderColor="#EAB308"
            background="#FEF9C3"
            fontSize="10px"
            fontWeight="400"
            color="#CA8A04"
          >
            Menunggu
          </Flex>
        </Flex>
        <Text
          fontSize="12px"
          fontWeight="400"
          color="gray.500"
          lineHeight="140%"
          margin="4px 0 4px 0"
        >
          Kecamatan Kandanghaur, Kabupaten Indramayu, Jawa Barat
        </Text>
        <Text fontSize="10px" fontWeight="400" color="gray.300">
          24/10/24
        </Text>
      </Flex>
      <Flex
        padding="12px"
        borderRadius="8px"
        border="1px solid"
        borderColor="gray.300"
        direction="column"
        boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10);"
        cursor="pointer"
      >
        <Flex justifyContent="space-between">
          <Text
            fontSize="14px"
            fontWeight="700"
            lineHeight="140%"
            width="221px"
          >
            Desa Putang
          </Text>
          <Flex
            justifyContent="center"
            alignItems="center"
            width="79px"
            height="18px"
            borderRadius="12px"
            border="0.5px solid"
            borderColor="#16A34A"
            background="#DCFCE7"
            fontSize="10px"
            fontWeight="400"
            color="#16A34A"
          >
            Terverifikasi
          </Flex>
        </Flex>
        <Text
          fontSize="12px"
          fontWeight="400"
          color="gray.500"
          lineHeight="140%"
          margin="4px 0 4px 0"
        >
          Kecamatan Kandanghaur, Kabupaten Indramayu, Jawa Barat
        </Text>
        <Text fontSize="10px" fontWeight="400" color="gray.300">
          24/10/24
        </Text>
      </Flex>
      <Flex
        padding="12px"
        borderRadius="8px"
        border="1px solid"
        borderColor="gray.300"
        direction="column"
        boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10);"
        cursor="pointer"
      >
        <Flex justifyContent="space-between">
          <Text
            fontSize="14px"
            fontWeight="700"
            lineHeight="140%"
            width="221px"
          >
            Desa Cikajang
          </Text>
          <Flex
            justifyContent="center"
            alignItems="center"
            width="79px"
            height="18px"
            borderRadius="12px"
            border="0.5px solid"
            borderColor="#DC2626"
            background="#FEE2E2"
            fontSize="10px"
            fontWeight="400"
            color="#DC2626"
          >
            Ditolak
          </Flex>
        </Flex>
        <Text
          fontSize="12px"
          fontWeight="400"
          color="gray.500"
          lineHeight="140%"
          margin="4px 0 4px 0"
        >
          Kecamatan Kandanghaur, Kabupaten Indramayu, Jawa Barat
        </Text>
        <Text fontSize="10px" fontWeight="400" color="gray.300">
          24/10/24
        </Text>
      </Flex>
    </Stack>
  );
};
export default CardNotification;
