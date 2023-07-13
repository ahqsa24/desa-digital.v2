import { MarginProps } from "Consts/sizing";
import { Container, Input, Error } from "./_textFieldStyle";

interface TextFieldProps extends MarginProps {
  placeholder: string;
  type: string;
  error?: string;
  form?: any;
  name?: string;
}

function TextField(props: TextFieldProps) {
  const { placeholder, type, error, form, name, ...rest } = props;
  const { register, formState } = form;
  const { errors } = formState;
  
  return (
    <Container>
      <Input
        placeholder={placeholder}
        type={type}
        {...register(name)}
        {...rest}
      />
      {!!errors && <Error>{errors[name!]?.message}</Error>}
    </Container>
  );
}

export default TextField;
