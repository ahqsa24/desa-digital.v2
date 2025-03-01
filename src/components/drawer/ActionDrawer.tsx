import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerCloseButton,
} from "@chakra-ui/react";
import Instagram from "Assets/icons/instagram.svg";
import Web from "Assets/icons/web.svg";
import Whatsapp from "Assets/icons/whatsapp.svg";
import React from "react";
import {
    ButtonKontak,
    Icon
} from "../../pages/village/detail/_detailStyle";



interface ContactData {
  whatsapp?: string;
  instagram?: string;
  website?: string;
}

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  loading?: boolean;
  onVerify?: () => void;
  setOpenModal?: (value: boolean) => void;

  role: string;
  contactData?: ContactData; // Menambahkan data kontak
}

const ActionDrawer: React.FC<ActionDrawerProps> = ({
  isOpen,
  onClose,
  isAdmin,
  loading,
  onVerify,
  setOpenModal,
  role,
  contactData, // Menerima contactData
}) => {
  // console.log("Data Kontak yang diterima:", contactData); // Debugging
  
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} variant="purple">
      <DrawerOverlay />
      <DrawerContent
        sx={{
          borderRadius: "lg",
          width: "360px",
          my: "auto",
          mx: "auto",
        }}
      >
        {isAdmin ? (
          <>
            <DrawerHeader
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "#1F2937",
                fontSize: "16px",
              }}
            >
              Apakah Anda ingin memverifikasi atau menolak permohonan ini?
            </DrawerHeader>
            <DrawerBody fontSize={12} color="#374151" paddingX={4} gap={4}>
              <Button
                colorScheme="green"
                width="100%"
                mb={4}
                onClick={onVerify}
                isLoading={loading}
              >
                Verifikasi
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                width="100%"
                onClick={() => setOpenModal?.(true)}
                _hover={{ bg: "red.500", color: "white", border: "none" }}
              >
                Tolak
              </Button>
            </DrawerBody>
          </>
        ) : (
          <>
            <DrawerHeader
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "#1F2937",
                fontSize: "16px",
              }}
            >
              <DrawerCloseButton
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "#1F2937",
                  paddingTop: "10px",
                }}
              />
              Kontak {role}
            </DrawerHeader>
            <DrawerBody fontSize={12} color="#374151" paddingX={4} gap={4}>

              Terapkan produk inovasi desa digital dengan cara menghubungi&nbsp;
              {role} melalui saluran di bawah ini:
              
              {/* Tombol WA */}
              <ButtonKontak as="a" href={contactData?.whatsapp ? `https://wa.me/${contactData.whatsapp}` : "#"} target="_blank">
                <Icon src={Whatsapp} alt="WA" />
                WhatsApp
              </ButtonKontak>

                {/* Tombol ig */}
              <ButtonKontak as="a" href={contactData?.instagram || "#"} target="_blank">
                <Icon src={Instagram} alt="IG" />
                Instagram
              </ButtonKontak>

                {/* Tombol web */}
              <ButtonKontak as="a" href={contactData?.website || "#"} target="_blank">
                <Icon src={Web} alt="Web" />
                Website
              </ButtonKontak>
            </DrawerBody>
          </>
        )}
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ActionDrawer;
