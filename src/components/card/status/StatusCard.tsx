import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, Box, Text } from "@chakra-ui/react";
import React from "react";
import village from "../village";

type StatusCardProps = {
  message: string;
  status: string;
};

const StatusCard: React.FC<StatusCardProps> = ({ message, status }) => {
  return (
    <Flex justify="center">
      <Flex
        align="center"
        justify="center"
        flexGrow={1}
        padding="12px 16px"
        borderTop="1px solid rgba(0, 0, 0, 0.1)"
        position="fixed"
        bg="white"
        bottom="0"
        maxW="360px"
        width="100%"
        boxShadow="0px -2px 4px 0px rgba(0, 0, 0, 0.06), 0px -4px 6px 0px rgba(0, 0, 0, 0.10)"
      >
        {/*  jika terverifikasi */}
        {status === "Terverifikasi" ? (
          <Flex align="center">
            <CheckIcon fontSize="14px" color="#22C55E" mr="8px" />
            <Text fontSize="14px" fontWeight="700" color="#22C55E">
              Permohonan Akun Diverifikasi
            </Text>
          </Flex>
        ) : status === "Ditolak" ? (
          <Box>
            <Flex align="center" justify='center'>
              <CloseIcon fontSize="12px" color="#EF4444" mr="8px" />
              <Text fontSize="14px" fontWeight="700" color="#EF4444">
                Permohonan Akun Ditolak
              </Text>
            </Flex>
            <Text
              fontSize="10px"
              fontWeight="500"
              color="#EF4444"
              textAlign="center"
            >
              Catatan: {message}
            </Text>
          </Box>
        ) : null}
      </Flex>
    </Flex>
  );
};
export default StatusCard;
