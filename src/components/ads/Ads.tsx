import { Box, Button, Flex, Fade, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import defAds1 from "@public/images/default-ads-1.svg";
import defAds2 from "@public/images/default-ads-2.svg";

const Ads: React.FC = () => {
  const [visibleBox, setVisibleBox] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleBox((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <Flex position="relative" height="166px" width="161px">
      <Fade in={visibleBox === 0}>
        <Box
          backgroundImage={defAds1}
          height="160px"
          width="160px"
          backgroundSize="cover"
          backgroundPosition="center"
          padding="12px"
          borderRadius="12px"
          position="absolute"
        >
          <Text
            fontSize="12px"
            fontWeight="700"
            lineHeight="140%"
            color="white"
          >
            Temukan inovasi yang kamu inginkan disini
          </Text>
          <Text
            fontSize="10px"
            fontWeight="500"
            lineHeight="140%"
            color="white"
          >
            Menyajikan <br />{" "}
            <span
              style={{
                fontSize: "28px",
                fontWeight: "700",
                lineHeight: "120%",
              }}
            >
              100+
            </span>
            <br />
            Informasi inovasi digital desa
          </Text>
          <Flex justifyContent="flex-end" mt="12px">
            <Button
              variant="inverted"
              border="none"
              fontSize="8px"
              fontWeight="500"
              borderRadius="4px"
              width="84px"
              height="16px"
              padding="6px 20px"
            >
              Ketahui lebih lanjut
            </Button>
          </Flex>
        </Box>
      </Fade>

      <Fade in={visibleBox === 1}>
        <Box
          backgroundImage={defAds2}
          height="160px"
          width="160px"
          backgroundSize="cover"
          backgroundPosition="center"
          padding="12px"
          borderRadius="12px"
          position="absolute"
        >
          <Text
            fontSize="12px"
            fontWeight="700"
            lineHeight="140%"
            color="white"
          >
            Temukan desa digital yang kamu inginkan disini
          </Text>
          <Text
            fontSize="10px"
            fontWeight="500"
            lineHeight="140%"
            color="white"
          >
            Menyajikan <br />{" "}
            <span
              style={{
                fontSize: "28px",
                fontWeight: "700",
                lineHeight: "120%",
              }}
            >
              50+
            </span>
            <br />
            Desa digital di Indonesia
          </Text>
          <Flex justifyContent="flex-end" mt="10px">
            <Button
              variant="inverted"
              border="none"
              fontSize="8px"
              fontWeight="500"
              borderRadius="4px"
              width="84px"
              height="16px"
              padding="6px 20px"
            >
              Ketahui lebih lanjut
            </Button>
          </Flex>
        </Box>
      </Fade>
    </Flex>
  );
};

export default Ads;
