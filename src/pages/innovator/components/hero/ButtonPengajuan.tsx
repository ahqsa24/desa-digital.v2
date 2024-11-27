import React from "react";
import Button from "Components/button";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Send from "Assets/icons/send.svg";
import {Icon} from "../../../village/profile/_profileStyle"

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
      size={'xs'}
      onClick={handleClick}
    >
       <Icon src={Send} alt="send"/>
      {label} {/* Teks tombol */}
    </Button>
  );
};

export default ButtonPengajuan;