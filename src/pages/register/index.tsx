import React, { useEffect, useState } from "react";
import { Button, Text } from "@chakra-ui/react";
import { paths } from "Consts/path";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import TextField from "Components/textField";
import {
  Background,
  Container,
  Title,
  Description,
  Label,
  ActionContainer,
  Action,
  CheckboxContainer,
} from "./_registerStyle";
import { auth, firestore } from "../../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "../../../src/firebase/errors";
import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const forms = [
  {
    label: "Email",
    type: "email",
    name: "email",
  },
  {
    label: "Kata sandi",
    type: "password",
    name: "password",
  },
];

const Register: React.FC = () => {
  const [regisForm, setRegisForm] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");
    if (!regisForm.email.includes("@")) return setError("Email tidak valid");
    if (regisForm.email === "" || regisForm.password === "")
      return setError("Email dan kata sandi harus diisi");
    if (regisForm.password.length < 6)
      return setError("Kata sandi minimal 6 karakter");
    createUserWithEmailAndPassword(regisForm.email, regisForm.password);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const navigate = useNavigate();

  const form = useForm();

  const createUserDocument = async (user: User) => {
    const userData = {
      id: user.uid,
      email: user.email,
      role: regisForm.role
    };
    await addDoc(
      collection(firestore, "users"),
      JSON.parse(JSON.stringify(userData))
    );
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
      navigate(paths.LOGIN_PAGE);
    }
  }, [userCred, navigate]);

  return (
    <Background>
      <Container>
        <Title>Halo!</Title>
        <Description>Silahkan melakukan registrasi akun</Description>

        <form onSubmit={onSubmit}>
          {forms?.map(({ label, type, name }, idx) => (
            <React.Fragment key={idx}>
              <Label mt={12}>{label}</Label>
              <TextField
                mt={4}
                placeholder={label}
                type={type}
                name={name}
                form={form}
                onChange={onChange}
              />
            </React.Fragment>
          ))}

          <Label mt={12}>Daftar sebagai:</Label>
          <CheckboxContainer mt={12}>
            <input
              name="role"
              type="radio"
              value="innovator"
              onChange={onChange}
              required
            />
            <Label>Inovator</Label>
          </CheckboxContainer>

          <CheckboxContainer mt={12}>
            <input
              name="role"
              type="radio"
              value="village"
              onChange={onChange}
              required
            />
            <Label>Perangkat desa</Label>
          </CheckboxContainer>
          {(error || userError) && (
            <Text textAlign="center" color="red" fontSize="10pt">
              {error ||
                FIREBASE_ERRORS[
                  userError?.message as keyof typeof FIREBASE_ERRORS
                ]}
            </Text>
          )}

          <Button
            mt={8}
            type="submit"
            alignItems="center"
            width="100%"
            isLoading={loading}
          >
            Registrasi
          </Button>
        </form>

        <ActionContainer mt={24}>
          <Label>Sudah memiliki akun?</Label>
          <Action onClick={() => navigate(paths.LOGIN_PAGE)}>Login</Action>
        </ActionContainer>
      </Container>
    </Background>
  );
};

export default Register;
