import { marginStyle } from "Consts/sizing";
import styled from "styled-components";

export const NotifContainer = styled.div`
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  max-width: 328px;
  width: 100%;
  
`

export const Title = styled.p`
  font-size: 14px;
  font-weight: 700;
  width: 100%;
  display: flex;
  justify-content: flex-start; /* Konten rata kiri secara horizontal */
  align-items: flex-start; /* Konten rata kiri secara vertikal */
  text-align: left; /* Menjamin teks tetap rata kiri */
`

export const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  text-align: left;
`

export const Date = styled.p`
  font-size: 10px;
  font-weight: 400;
  color: #9CA3AF;
  text-align: left;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 400px;
  width: 100%;
  
`
