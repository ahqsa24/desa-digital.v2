import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";

type CardNotificationProps = {
  title: string;
  status: string;
  date: string;
  description: string;
  onClick?: () => void;
};
// TODO: Buat agar card ini bisa di klik dan arahkan ke halaman detail

const CardNotification: React.FC<CardNotificationProps> = ({
  title,
  description,
  status,
  date,
  onClick,
}) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const getShortDescription = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <Flex
      padding="12px"
      borderRadius="8px"
      border="1px solid"
      borderColor="gray.300"
      direction="column"
      boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10);"
      cursor="pointer"
      onClick={onClick}
    >
      <Flex justifyContent="space-between">
        <Text fontSize="14px" fontWeight="700" lineHeight="140%" width="221px">
          {title}
        </Text>
        <Flex
          justifyContent="center"
          alignItems="center"
          width="79px"
          height="18px"
          borderRadius="12px"
          border="0.5px solid"
          borderColor={
            status === "Terverifikasi"
              ? "#16A34A"
              : status === "Ditolak"
              ? "#DC2626"
              : "#CA8A04"
          }
          background={
            status === "Terverifikasi"
              ? "#DCFCE7"
              : status === "Ditolak"
              ? "#FEE2E2"
              : "#FFFAE6"
          }
          fontSize="10px"
          fontWeight="400"
          color={
            status === "Terverifikasi"
              ? "#16A34A"
              : status === "Ditolak"
              ? "#DC2626"
              : "#CA8A04"
          }
        >
          {status}
        </Flex>
      </Flex>
      <Text
        fontSize="12px"
        fontWeight="400"
        color="gray.500"
        lineHeight="140%"
        margin="4px 0 4px 0"
      >
        {isExpanded ? description : getShortDescription(description, 14)}
        {description.split(" ").length > 14 && (
          <Button
            variant="link"
            color="brand.100"
            fontWeight='400'
            fontSize="12px"
            ml="5px"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Sembunyikan" : "Lihat Semua"}
          </Button>
        )}
      </Text>
      <Text fontSize="10px" fontWeight="400" color="gray.400">
        {date}
      </Text>
    </Flex>
  );
};
export default CardNotification;
