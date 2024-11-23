import { Box, Fade, Flex, Image, Text } from "@chakra-ui/react";
import Container from "Components/container";
import React, { useEffect, useState } from "react";

type BestBannerProps = {};

const BestBanner: React.FC<BestBannerProps> = () => {
  const [visibleBox, setVisibleBox] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleBox((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <Box padding="0 14px" pos="relative">
      <Text fontSize="16px" fontWeight="700" lineHeight="140%" mb="16px">
        Inovator dan Desa Unggulan
      </Text>
      <Box>
        <Flex position="relative">
          <Fade in={visibleBox === 0}>
            <Box
              backgroundImage="src/assets/images/banner-unggulan.svg"
              width="329px"
              height="135px"
              padding="23px 23px 13px 23px"
              position="absolute"
            >
              <Flex justifyContent="space-between">
                <Box justifyItems="center" mt="21px">
                  <Image src="src/assets/icons/seccond.svg" />
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    lineHeight="140%"
                    textAlign="center"
                    width="90px"
                    height="auto"
                  >
                    Habibi Garden
                  </Text>
                </Box>
                <Box justifyItems="center">
                  <Image src="src/assets/icons/first.svg" />
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    lineHeight="140%"
                    textAlign="center"
                    width="90px"
                    height="auto"
                  >
                    eFishery
                  </Text>
                </Box>
                <Box justifyItems="center" mt="21px">
                  <Image src="src/assets/icons/third.svg" />
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    lineHeight="140%"
                    textAlign="center"
                    width="90px"
                    height="auto"
                  >
                    Inagria
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Fade>

          <Fade in={visibleBox === 1}>
            <Box
              backgroundImage="src/assets/images/banner-unggulan.svg"
              width="329px"
              height="135px"
              padding="23px 23px 13px 23px"
              position="absolute"
            >
              <Flex justifyContent="space-between">
                <Box justifyItems="center" mt="21px">
                  <Image src="src/assets/icons/seccond.svg" />
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    lineHeight="140%"
                    textAlign="center"
                    width="90px"
                    height="auto"
                  >
                    Desa Soge
                  </Text>
                </Box>
                <Box justifyItems="center">
                  <Image src="src/assets/icons/first.svg" />
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    lineHeight="140%"
                    textAlign="center"
                    width="90px"
                    height="auto"
                  >
                    Desa Cikajang
                  </Text>
                </Box>
                <Box justifyItems="center" mt="21px">
                  <Image src="src/assets/icons/third.svg" />
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    lineHeight="140%"
                    textAlign="center"
                    width="90px"
                    height="auto"
                  >
                    Desa Dramaga
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Fade>
        </Flex>
      </Box>
    </Box>
  );
};

export default BestBanner;
