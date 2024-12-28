// components/PinInputComponent.tsx
import React from "react";
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";

interface PinInputComponentProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
}

const PinInputComponent: React.FC<PinInputComponentProps> = ({ value, onChange, onComplete }) => {
  return (
    <HStack spacing={4} justify="center">
      <PinInput value={value} onChange={onChange} onComplete={onComplete} size="lg">
        {Array.from({ length: 6 }).map((_, index) => (
          <PinInputField key={index} />
        ))}
      </PinInput>
    </HStack>
  );
};

export default PinInputComponent;
