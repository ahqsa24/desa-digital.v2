import styled from "styled-components";
import HeroBackground from "Assets/images/Background-desadigital.svg";
import AdminBackground from "Assets/images/hero-background-admin.svg";
import InnovatorBackground from "Assets/images/Background-inovator3.svg";
import VillageBackground from "Assets/images/Background-desahome1.svg";

interface BackgroundProps {
  isAdmin?: boolean;
  isInnovator?:boolean
  isVillage?:boolean
}

export const Background = styled.div<BackgroundProps>`
  padding: 16px;
   background-image: ${({ isAdmin, isInnovator, isVillage }) =>
    `url(${isAdmin ? AdminBackground : isInnovator ? InnovatorBackground : isVillage ? VillageBackground: HeroBackground})`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 145px;
  border-radius: 0px 0px 16px 16px;
  display: flex;
  align-items: center;
  position: relative;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #374151;
`;

export const Description = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #374151;
`;
