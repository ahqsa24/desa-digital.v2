import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Flex,
  Image,
  Button
} from "@chakra-ui/react";
import SadRobot from "Assets/icons/sad-robot.svg";


interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalBody2: string;    
  onYes: () => void;

}

const ConfModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  modalBody2,
  onYes
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody paddingTop={4}>
          <Flex direction={'column'} alignItems={'center'} fontSize="12px" textAlign={'center'}>
          <Image src={SadRobot} alt="sad robot" boxSize={14} color="green.500"  />
          {modalBody2}
          </Flex>
        </ModalBody>
        <ModalFooter paddingTop={2} justifyContent={'center'} >
          <Button borderRadius={4} onClick={onYes} size={'xs'} paddingInline={6} fontWeight={500} fontSize="10px">Oke</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfModal;
