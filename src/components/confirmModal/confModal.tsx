import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Image,
  Button
} from "@chakra-ui/react";
import QuestionRobot from "Assets/icons/question-robot.svg";


interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;   // Prop untuk judul modal
  modalBody1: string;    // Prop untuk konten modal
  onYes: () => void;
}

const ConfModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  modalTitle,
  modalBody1,
  onYes,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody paddingTop={4}>
          <Flex direction={'column'} alignItems={'center'} fontSize="12px">
          <Image src={QuestionRobot} alt="question robot" boxSize={14} color="green.500"  />
          {modalBody1}
          </Flex>
          <Flex alignItems={'center'} fontSize="10px" justifyContent={'center'}>
          Pastikan data yang anda masukkan sudah benar
          </Flex>
        </ModalBody>
        <ModalFooter paddingTop={2} justifyContent={'center'} >
        <Button borderRadius={4} variant={'outline'} mr={4} onClick={onClose} size={'xs'} paddingInline={4} fontWeight={500} fontSize="10px" >
              Tidak
            </Button>
          <Button borderRadius={4} onClick={onYes} size={'xs'} paddingInline={6} fontWeight={500} fontSize="10px">Ya</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfModal;
