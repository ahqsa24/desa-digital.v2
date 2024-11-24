import { MarginProps, marginStyle } from "Consts/sizing";
import styled, { css } from "styled-components";

interface ButtonProps extends MarginProps {
  size?: "s" | "m" | "l"| "xs";
  fullWidth?: boolean;
}

export const StyledButton = styled.button<ButtonProps>`
  border-radius: 8px;
  background-color: #347357;
  color: #ffffff;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  ${({ size }) => {
    if (size === "s") {
      return css`
        padding: 8px 16px;
        font-size: 14px;
      `;
    }
    if (size === "xs") {
      return css`
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 500;
      `;
    }
    if (size === "m") {
      return css`
        padding: 12px 24px;
        font-size: 16px;
      `;
    }

    return css`
      padding: 16px 32px;
      font-size: 18px;
    `;
  }}

  :hover {
    background-color: #2e5e4b;
  }

  ${({ fullWidth }) => {
    if (fullWidth)
      return css`
        width: 100%;
      `;
    return css`
      width: fit-content;
    `;
  }}

  ${marginStyle}
`;
