"use client";

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

export interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (groupCode: string) => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose, onJoin }) => {
  const [groupCode, setGroupCode] = useState("");

  const handleJoin = () => {
    onJoin(groupCode);
    setGroupCode(""); // Reset the input value after joining
    onClose(); // Close the modal
  };

  const handleClose = () => {
    setGroupCode(""); // Reset the input value when the modal is closed
    onClose(); // Close the modal
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join a Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputField
            type="text"
            label="Group Code"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleJoin} className="bg-blue-500 text-white mr-4">
            Join
          </Button>
          <Button onClick={handleClose} className="bg-gray-200 text-black">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinGroupModal;
