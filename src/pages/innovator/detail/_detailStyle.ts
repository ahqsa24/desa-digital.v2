import styled from "styled-components";
import { marginStyle } from "Consts/sizing";

export const ContentContainer = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
`;

export const Background = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

export const Logo = styled.img`
  width: 80px;
  height: 80px;
  ${marginStyle}

  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const Title = styled.p`
  font-size: 18px;
  font-weight: 700;
  margin-top: 40px;
`;

export const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 4px 8px;
  width: 150px;
  height: 25px;
  background: #e5e7eb;
  border-radius: 20px;
  font-weight: 400;
  margin-left: 16px;
`;

export const Description = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: #4b5563;
  gap: 6px;
  text-align: justify;
  ${marginStyle}
`;

export const ActionContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  cursor: pointer;
`;

export const Text = styled.p`
  position: flex;
  justify-content: space-between;
  margin-right: 100px;
  font-weight: 700;
  font-size: 16px;
  ${marginStyle}
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
