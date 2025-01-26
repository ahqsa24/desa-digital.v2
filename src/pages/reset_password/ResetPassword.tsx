import React, { useState } from "react";
import {Input, Button, Text } from "@chakra-ui/react";
import {Background, Container, Title, Description } from "./_ResetStyle";

const ResetPassword: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Validasi kode verifikasi
    if (verificationCode.length !== 6) {
      setError("Kode salah");
      return;
    }

    setLoading(true);
  };

  return (
    <Background>
      <Container>
        <Title>Lupa Kata Sandi</Title>
        <Description>
          Kami baru saja mengirimkan kode konfirmasi ke email yang Anda daftarkan. Silakan masukkan kode untuk dapat mengubah kata sandi.
        </Description>

        <form onSubmit={handleVerifyCode}>
          <Text fontSize="10pt" mt="12px">
            Kode
          </Text>
          <Input
            name="verificationCode"
            type="text"
            maxLength={6}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            placeholder="Masukkan kode"
            mt="4px"
            value={verificationCode}
          />

          {error && (
            <Text textAlign="left" color="red" fontSize="10pt" mt="4px">
              {error}
            </Text>
          )}

          <Button
            mt={3}
            type="submit"
            width="100%"
            isLoading={loading}
          >
            Kirim kode
          </Button>
        </form>
      </Container>
    </Background>
  );
};

export default ResetPassword;