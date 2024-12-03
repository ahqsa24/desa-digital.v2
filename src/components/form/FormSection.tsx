import React from "react";
import { Box, Text, Input, Textarea } from "@chakra-ui/react";

interface FormSectionProps {
  title: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  isTextArea?: boolean;
  wordCount?: number;
  maxWords?: number;
  type?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  name,
  placeholder,
  value,
  onChange,
  isTextArea = false,
  wordCount,
  maxWords,
  disabled,
  type,
}) => {
  return (
    <Box>
      <Text fontWeight="400" fontSize="14px" mb="4px">
        {title} <span style={{ color: "red" }}>*</span>
      </Text>
      {isTextArea ? (
        <Textarea
          name={name}
          fontWeight="400" 
          fontSize="14px"
          placeholder={placeholder}
          _placeholder={{ color: "#9CA3AF" }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "none",
            borderColor: "black",
          }}
          height="100px"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      ) : (
        <Input
          name={name}
          fontWeight="400" 
          fontSize="14px"
          placeholder={placeholder}
          _placeholder={{ color: "#9CA3AF" }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "none",
            borderColor: "black",
          }}
          value={value}
          onChange={onChange}
          type={type}
          disabled={disabled}
        />
      )}
      {wordCount !== undefined && maxWords !== undefined && (
        <Text fontWeight="400" fontSize="10px" mb="6px" color="#9CA3AF">
          {wordCount}/{maxWords} kata
        </Text>
      )}
    </Box>
  );
};

export default FormSection;
