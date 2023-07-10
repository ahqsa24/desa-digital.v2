import React from "react";
import { paths } from "Consts/path";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import TextField from "Components/textField";
import Button from "Components/button";
import { useMutation } from "react-query";
import { register as registerEndpoint } from "Services/authServices";
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

function Register() {
  const navigate = useNavigate();
  const form = useForm();
  const { handleSubmit, register, reset } = form;

  const { mutateAsync } = useMutation(registerEndpoint);

  const onRegister = async (data: any) => {
    try {
      await mutateAsync(data);
      reset();
      navigate(paths.LOGIN_PAGE);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Background>
      <Container>
        <Title>Halo!</Title>
        <Description>Silakan melakukan registrasi akun</Description>

        <form onSubmit={handleSubmit(onRegister)}>
          {forms?.map(({ label, type, name }, idx) => (
            <React.Fragment key={idx}>
              <Label mt={12}>{label}</Label>
              <TextField
                mt={4}
                placeholder={label}
                type={type}
                name={name}
                form={form}
              />
            </React.Fragment>
          ))}

          <Label mt={12}>Daftar sebagai:</Label>
          <CheckboxContainer mt={12}>
            <input
              type="radio"
              value="innovator"
              {...register("role", { required: true })}
            />
            <Label>Inovator</Label>
          </CheckboxContainer>

          <CheckboxContainer mt={12}>
            <input
              type="radio"
              value="village"
              {...register("role", { required: true })}
            />
            <Label>Perangkat desa</Label>
          </CheckboxContainer>

          <Button size="m" fullWidth mt={12} type="submit">
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
}

export default Register;
