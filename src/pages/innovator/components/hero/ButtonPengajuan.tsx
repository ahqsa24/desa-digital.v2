import React from "react";
import { Button, Icon } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ButtonPengajuanProps {
  label: string; // Label untuk teks tombol
  to?: string;
  onClick?: () => void; // Fungsi yang dipanggil saat tombol diklik
  icon?: React.ElementType; // Ikon opsional untuk mengganti default
}

const ButtonPengajuan: React.FC<ButtonPengajuanProps> = ({ label, to, onClick, icon = FaPaperPlane }) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      if (to) {
        navigate(to); // Navigasi ke halaman tujuan
      }
      if (onClick) {
        onClick(); // Panggil fungsi tambahan jika ada
      }
    };  
    
    return (
    <Button
      backgroundColor="#347357"
      color="white"
      _hover={{
        backgroundColor: "#285e45",
      }}
      width="140px" // Lebar tombol
      height="30px" // Tinggi tombol
      fontSize="12px" // Ukuran teks
      borderRadius="4px" // Sudut membulat
      fontFamily="Inter, sans-serif" // Font-family tombol
      leftIcon={<Icon as={icon} />} // Ikon dinamis, default ke FaPaperPlane
      onClick={handleClick}
    >
      {label} {/* Teks tombol */}
    </Button>
  );
};

export default ButtonPengajuan;