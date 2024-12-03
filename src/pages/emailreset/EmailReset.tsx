import React, { useEffect, useState } from "react";
import { Input, Button, Text } from "@chakra-ui/react";
import { Background, Container, Title, Description } from "./_EmailResetStyle";
import { useNavigate } from "react-router-dom";
import { paths } from "Consts/path"; 
import { auth } from "../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";

// Definisikan tipe untuk data formulir
type EmailResetFormData = {
  email: string;
};

const EmailReset: React.FC = () => {
    const [error, setError] = useState("");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    // Tentukan tipe data form menggunakan generics
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailResetFormData>();

    const onSubmit = (data: EmailResetFormData) => {
        if (!data.email) return setError("Email tidak boleh kosong");
        if (!/\S+@\S+\.\S+/.test(data.email)) return setError("Format email tidak valid");

        // Tambahkan logika pengiriman email di sini
        console.log("Mengirim kode ke email:", data.email);

        // Setelah berhasil, arahkan ke halaman reset password
        navigate(paths.RESET_PASSWORD_PAGE);
    };

    useEffect(() => {
        if (user) {
            console.log("User sudah login:", user);
        }
    }, [user]);

    return (
        <Background>
            <Container>
                <Title>Lupa Kata Sandi</Title>
                <Description>
                    Masukkan email yang akan kami kirimkan kode untuk reset password.
                </Description>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Text fontSize="10pt" mt="12px">
                        Email
                    </Text>
                    <Input
                        {...register("email", {
                            required: "Email wajib diisi",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Format email tidak valid",
                            },
                        })}
                        type="email"
                        placeholder="Email"
                        mt="4px"
                        fontSize="10pt"
                    />

                    {/* Error dari react-hook-form */}
                    {errors.email && (
                        <Text textAlign="left" color="red" fontSize="10pt" mt="4px">
                            {errors.email.message}
                        </Text>
                    )}

                    {/* Error tambahan */}
                    {error && (
                        <Text textAlign="left" color="red" fontSize="10pt" mt="4px">
                            {error}
                        </Text>
                    )}

                    <Button mt={3} type="submit" width="100%" isLoading={loading}>
                        Kirim Email
                    </Button>
                </form>
            </Container>
        </Background>
    );
};

export default EmailReset;