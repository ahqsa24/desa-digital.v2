import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay
} from "@chakra-ui/react";
import Instagram from "Assets/icons/instagram.svg";
import Web from "Assets/icons/web.svg";
import Whatsapp from "Assets/icons/whatsapp.svg";
import React from "react";
import {
    ButtonKontak,
    Icon
} from "../../pages/village/detail/_detailStyle";

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  loading: boolean;
  onVerify?: () => void;
  setOpenModal?: (value: boolean) => void;
  role : string;
}

const ActionDrawer: React.FC<ActionDrawerProps> = ({
  isOpen,
  onClose,
  isAdmin,
  loading,
  onVerify,
  setOpenModal,
  role
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onClose={onClose}
      variant="purple"
    >
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
                onClick={() => setOpenModal?.(true)} // Buka modal penolakan
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
              Kontak {role}
            </DrawerHeader>
            <DrawerBody fontSize={12} color="#374151" paddingX={4} gap={4}>
              Terapkan produk inovasi desa digital dengan cara menghubungi
              inovator melalui saluran di bawah ini:
              <ButtonKontak>
                <Icon src={Whatsapp} alt="WA" />
                WhatsApp
              </ButtonKontak>
              <ButtonKontak>
                <Icon src={Instagram} alt="IG" />
                Instagram
              </ButtonKontak>
              <ButtonKontak>
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
