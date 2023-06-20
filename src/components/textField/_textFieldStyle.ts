import { MarginProps, marginStyle } from "Consts/sizing";
import styled from "styled-components";

interface InputProps extends MarginProps {}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Input = styled.input<InputProps>`
  border: 1px solid #eeeeee;
  border-radius: 8px;
  padding: 12px 8px;
  width: 100%;

  ${marginStyle}
`;

export const Error = styled.p`
  font-size: 14px;
  color: red;
  font-weight: 400;
  margin-left: 8px;
`;
