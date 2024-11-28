// components/AlertBox.tsx
import React from 'react';
import { Box, Alert, AlertDescription } from '@chakra-ui/react';

interface AlertBoxProps {
  description: string; // Deskripsi teks yang ditampilkan dalam alert
  bgColor: string;     // Warna latar belakang alert yang bisa disesuaikan
}

const AlertBox: React.FC<AlertBoxProps> = ({ description, bgColor }) => {
  return (
    <Alert
      mt={6}
      bg={bgColor}      // Menggunakan properti bg untuk latar belakang
      color="black"     // Warna teks tetap hitam
      w="328px"         // Lebar tetap 328px
      h="47px"          // Tinggi tetap 47px
      py="16px"         // Padding vertikal 16px
      px="8px"          // Padding horizontal 8px
    >
      <Box>
        <AlertDescription 
          fontWeight="400" 
          fontSize="12px" 
          lineHeight="px" // Jarak antar baris normal
        >
          {description} {/* Teks deskripsi yang diterima sebagai prop */}
        </AlertDescription>
      </Box>
    </Alert>
  );
};

export default AlertBox;