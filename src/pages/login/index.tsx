import React, { useEffect, useState } from "react";
import { paths } from "Consts/path";
// import Button from "Components/button";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import TextField from "Components/textField";
import { useNavigate } from "react-router-dom";
import {
  Action,
  Background,
  Container,
  Description,
  Label,
  ActionContainer,
  Title,
} from "./_loginStyle";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { Text } from "@chakra-ui/react";
import { FIREBASE_ERRORS } from "../../../src/firebase/errors";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { CheckboxContainer } from "../register/_registerStyle";

const Login: React.FC = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [signInWithEmailAndPassword, user, loading, userError] =
    useSignInWithEmailAndPassword(auth);

  const [show, setShow] = useState(false);
  const onShowPassword = () => setShow(!show);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");
    if (!loginForm.email.includes("@")) return setError("Email tidak valid");
    if (loginForm.password.length < 6)
      return setError("Kata sandi minimal 6 karakter");
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };
  const onChange = ({ target }: { target: HTMLInputElement }) => {
    setLoginForm((prev) => ({ ...prev, [target.name]: target.value }));
    if (error) setError("");
  };
  const [userAuth, loadingAuth, errorAuth] = useAuthState(auth);

  const navigate = useNavigate();
  const form = useForm();
  useEffect(() => {
    if (user) {
      navigate(paths.LANDING_PAGE);
    }
    console.log("userAuth", user);
  }, [user, navigate]);

  return (
    <Background>
      <Container>
        <Title>Halo!</Title>
        <Description>Silakan masukkan akun</Description>

        <form onSubmit={onSubmit}>
          <Text fontSize="10pt" mt="12px">
            Email
          </Text>
          <Input
            name="email"
            type="email"
            onChange={onChange}
            required
            placeholder="Email"
            mt="4px"
          />
          <Text fontSize="10pt" mt="12px">
            Password
          </Text>

          <InputGroup mt="4px" alignItems="center">
            <Input
              name="password"
              type={show ? "text" : "password"}
              onChange={onChange}
              required
              placeholder="Password"
            />
            <InputRightElement
              onClick={onShowPassword}
              cursor="pointer"
              mt="4px"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </InputRightElement>
          </InputGroup>
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
            Masuk
          </Button>
        </form>

        <ActionContainer mt={24}>
          <Label>Belum memiliki akun?</Label>
          <Action onClick={() => navigate(paths.REGISTER_PAGE)}>
            Registrasi
          </Action>
        </ActionContainer>
      </Container>
    </Background>
  );
};

export default Login;
