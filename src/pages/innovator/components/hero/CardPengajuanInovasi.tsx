import { Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

type CardPengajuanInovasi = {};
// TODO: Buat agar card ini bisa di klik dan arahkan ke halaman detail

const CardPengajuanInovasi: React.FC<CardPengajuanInovasi> = () => {
  return (
    <Stack padding="16px" gap="16px">
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
            Pakan Otomatis Besar (eFeederBig)
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
            Pakan otomatis cerdas berukuran besar yang dapat dikontrol melalui telepon dan dapat disesuaikan dengan kebutuhan Petani.        </Text>
        <Text fontSize="10px" fontWeight="400" color="#9CA3AF">
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
            Pakan Otomatis Sedang (eFeederMed)
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
          Pakan otomatis cerdas berukuran sedang yang dapat dikontrol melalui telepon dan dapat disesuaikan dengan kebutuhan Petani.
        </Text>
        <Text fontSize="10px" fontWeight="400" color="#9CA3AF">
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
            Pakan Otomatis (eFeeder)
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
          Pakan otomatis cerdas yang dapat dikontrol melalui telepon dan dapat disesuaikan dengan kebutuhan Petani.
        </Text>
        <Text fontSize="10px" fontWeight="400" color="#9CA3AF">
          24/10/24
        </Text>
      </Flex>
    </Stack>
  );
};
export default CardPengajuanInovasi;
