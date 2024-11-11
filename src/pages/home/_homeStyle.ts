import Button from 'Components/button';
import styled from 'styled-components';
import { ButtonHTMLAttributes } from "react";

export const FloatingButton = styled(Button)<ButtonHTMLAttributes<HTMLButtonElement>>`
  border-radius: 50%;
  height: 60px;
  width: 60px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  z-index: 999;
  bottom: 70px;
  margin-left: auto;
  margin-right: 19px;
`;

export const Toast = styled.div`
  color: #347357; /* Warna hijau */
  padding: 8px; /* p={2}, diubah ke piksel */
  background-color: #FFF; /* Warna putih */
  border-radius: 4px; /* md diubah ke nilai piksel */
  font-family: 'Inter', sans-serif; /* Font Inter */
  font-size: 14px; /* Ukuran font */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* lg diubah ke nilai eksplisit */
`;

