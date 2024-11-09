import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { paths } from "Consts/path";
import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router";
import { FIREBASE_ERRORS } from "../../../src/firebase/errors";
import { auth, firestore } from "../../firebase/clientApp";
import {
  Action,
  ActionContainer,
  Background,
  CheckboxContainer,
  Container,
  Description,
  Label,
  Title,
} from "./_registerStyle";


const Register: React.FC = () => {
  const [regisForm, setRegisForm] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState(""); // State untuk konfirmasi kata sandi
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const [show, setShow] = useState(false);
  const onShowPassword = () => setShow(!show);
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");
    if (!regisForm.email.includes("@")) return setError("Email tidak valid");
    if (regisForm.email === "" || regisForm.password === "")
      return setError("Email dan kata sandi harus diisi");
    if (regisForm.password.length < 6)
      return setError("Kata sandi minimal 6 karakter");
    if (regisForm.password !== confirmPassword)
      return setError("Kata sandi dan konfirmasi kata sandi tidak cocok"); // Cek kesesuaian kata sandi
    createUserWithEmailAndPassword(regisForm.email, regisForm.password);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value); // Update konfirmasi kata sandi
  };

  const navigate = useNavigate();


  const createUserDocument = async (user: User) => {
    const userData = {
      id: user.uid,
      email: user.email,
      role: regisForm.role,
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
            Kata sandi
          </Text>

          <InputGroup mt="4px" alignItems="center">
            <Input
              name="password"
              type={show ? "text" : "password"}
              onChange={onChange}
              required
              placeholder="Kata sandi"
            />
            <InputRightElement
              onClick={onShowPassword}
              cursor="pointer"
              mt="4px"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </InputRightElement>
          </InputGroup>

          <Text fontSize="10pt" mt="12px">
            Konfirmasi kata sandi
          </Text>

          <InputGroup mt="4px" alignItems="center">
            <Input
              name="password"
              type={show ? "text" : "password"}
              onChange={onConfirmPasswordChange} // Gunakan onConfirmPasswordChange
              required
              placeholder="Konfirmasi kata sandi"
            />
            <InputRightElement
              onClick={onShowPassword}
              cursor="pointer"
              mt="4px"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </InputRightElement>
          </InputGroup>

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
            <Text textAlign="center" color="red" fontSize="10pt" mt={1} >
              {error ||
                FIREBASE_ERRORS[
                  userError?.message as keyof typeof FIREBASE_ERRORS
                ]}
            </Text>
          )}

          <Button
            mt={2}
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
