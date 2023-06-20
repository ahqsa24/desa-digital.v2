import styled from "styled-components";
import { marginStyle } from "Consts/sizing";
import EFishery from "Assets/images/efishery.jpg";

export const ContentContainer = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
`;

export const Img = styled.div`
  background-image: url(${EFishery});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 360px;
  height: 100px;
`;
export const Title = styled.p`
  font-size: 18px;
  font-weight: 700;
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

export const Label = styled.p`
  font-style: normal;
  padding: 4px 8px;
  background: #e5e7eb;
  border-radius: 20px;
  font-weight: 400;
  font-size: 12px;
  color: #000000;
  text-align: justify;
  width: fit-content;
  cursor: pointer;
  ${marginStyle}
`;
export const Description = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: #4b5563;
  gap: 6px;
  text-align: justify;
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

export const Icon = styled.img`
  cursor: pointer;
  position: flex;
  justify-content: space-between;
  height: 8px;
  width: 10px;
  border-radius: 0px;
  ${marginStyle}
`;

export const Text = styled.p`
  position: flex;
  justify-content: space-between;
  margin-right: 100px;
  font-weight: 700;
  font-size: 16px;
  ${marginStyle}
`;

export const Logo = styled.img`
  height: 80px;
  width: 80px;
  ${marginStyle}
`;
export const ChipContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
