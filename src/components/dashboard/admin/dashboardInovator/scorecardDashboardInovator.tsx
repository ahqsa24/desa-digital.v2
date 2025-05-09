import { Box, Flex, Grid, Text, Stack, Image } from "@chakra-ui/react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import DesaIcon from "Assets/icons/village-active.svg"; // icon desa dampingannya

const ScoreCardDashboardInovator: React.FC = () => {
  const [totalInovators, setTotalInovators] = useState(0);
  const [totalDesaDampingan, setTotalDesaDampingan] = useState(0);

  const fetchData = async () => {
    try {
      const db = getFirestore();
      const innovatorsRef = collection(db, "innovators");
      const snapshot = await getDocs(innovatorsRef);

      let inovatorCount = 0;
      let desaDampinganCount = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (data.namaInovator) {
          inovatorCount++;
        }

        if (typeof data.jumlahDesaDampingan === "number") {
          desaDampinganCount += data.jumlahDesaDampingan;
        }
      });

      setTotalInovators(inovatorCount);
      setTotalDesaDampingan(desaDampinganCount);
    } catch (error) {
      console.error("❌ Error fetching innovator data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      label: "Inovator",
      value: totalInovators,
      iconType: "react-icon",
      icon: FaUsers,
      iconBg: "#F0FFF4",
    },
    {
      label: "Desa Dampingan",
      value: totalDesaDampingan,
      iconType: "image",
      icon: DesaIcon,
      iconBg: "#F0FFF4",
    },
  ];

  return (
    <Stack>
      <Box p={4}>
        <Grid templateColumns="1fr" gap={4}>
          {stats.map((stat, index) => (
            <Box
              key={index}
              p={3}
              borderRadius="lg"
              boxShadow="md"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              minW={0}
              overflow="hidden"
              minH="90px"
              display="flex"
              alignItems="center"
            >
              <Flex align="center">
                <Box
                  bg={stat.iconBg}
                  borderRadius="full"
                  p={1}
                  w="35px"
                  h="35px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  mr={3}
                >
                  {stat.iconType === "react-icon" ? (
                    <stat.icon size={16} color="#2F855A" />
                  ) : (
                    <Image src={stat.icon} w={4} h={4} alt={`${stat.label} icon`} />
                  )}
                </Box>
                <Box>
                  <Text fontSize="20px" fontWeight="bold" color="green.700" lineHeight="1">
                    {stat.value}
                  </Text>
                  <Text fontSize="12px" color="gray.600">
                    {stat.label}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

export default ScoreCardDashboardInovator;
