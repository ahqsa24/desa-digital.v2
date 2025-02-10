import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import redinesImg from "@public/images/rediness.svg";

const Rediness: React.FC = () => {
  return (
    // <Container>
        <Flex>
          <Box
            backgroundImage={redinesImg}
            height="160px"
            width="160px"
            backgroundSize="cover"
            backgroundPosition="center"
            padding="12px"
            borderRadius="12px"
          >
            <Text
              fontSize="16px"
              fontWeight="700"
              color="#374151"
              lineHeight="140%"
              mb="11px"
            >
              Cek Kesiapan Dirimu <br /> terhadap Desa Digital
            </Text>
            <Button
              width="87px"
              height="26px"
              fontSize="10px"
              fontWeight="500"
              padding="6px 20px"
            >
              Di sini
            </Button>
          </Box>
        </Flex>
    // </Container>
  );
};
export default Rediness;
