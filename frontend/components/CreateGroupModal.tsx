import React, { useState } from "react";
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

export interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (groupName: string) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    onCreate(groupName);
    setGroupName(""); // Reset the input value after group creation
    onClose(); // Close the modal
  };

  const handleClose = () => {
    setGroupName(""); // Reset the input value when the modal is closed
    onClose(); // Close the modal
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputField
            type="text"
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreate} className="bg-black text-white mr-4">
            Create
          </Button>
          <Button onClick={handleClose} className="bg-gray-200 text-black">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateGroupModal;
