import { marginStyle } from "Consts/sizing";
import styled from "styled-components";

export const KlaimContainer = styled.div`
display: flex;
width: 100%;
height: 82px;
justify-content: center;
align-items: center;
flex-shrink: 0;
background-color: #DCFCE7;
border-radius: 0px 0px 14px 14px;
flex-direction: column;
gap: 6px;
padding:16px;
`;

export const Text = styled.p`
color: #347357;
text-align: center;
font-size: 12px;
font-style: normal;
font-weight: 500;
line-height: 140%; 
`;

export const ButtonKlaim = styled.div`
display: flex;
padding: 6px 8px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 6px;
border: 1px solid var(--Primary, #347357);
background-color: #FFF;
width:100%;
cursor:pointer;
`;

export const TextButton = styled.p`
color: var(--Primary, #347357);
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: 140%; /* 16.8px */
`;

