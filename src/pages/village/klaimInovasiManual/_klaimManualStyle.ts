import { marginStyle } from "Consts/sizing";
import styled from "styled-components";

export const Container = styled.div`
display: flex;
width: 100%;
justify-content: center;
flex-direction: column;
gap: 12px;
padding:16px;
margin-bottom: 24px;
`;

export const SubText = styled.p`
color: var(--gray-80-h-txt-light-border-card-dark-bg-input, #374151);
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 140%; /* 22.4px */
`;