// components/CreateGroupModal.tsx
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import InputField from "./InputField";

// CreateGroupModal.tsx
export interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Create a Group</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InputField
          type="text"
          label="Group Name"
          placeholder="Enter your group name"
          value="" // Add state for the input value
          onChange={() => {}} // Add handler
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} className="bg-black text-white">
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default CreateGroupModal;

