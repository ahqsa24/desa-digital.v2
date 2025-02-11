import styled from "styled-components";

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: center;
  align-items: left;
  gap: 16px;
  padding: px;
  position: relative;
  width: 100%;
`;

export const Containers = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  top: -70px;
  margin: 16px;
  width: 100%;  
  padding: 16px;
  margin: 0px 0;
`;

export const CardContent = styled.div`
    box-shadow: 0px 1px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    min-width: 120px;
    display: flex;
    width: 100%;
    max-width: 328px;
    width: 100%;
    height: 145px;
    padding: 16px;
    Padding-top: 12px;
    flex-direction: column;
    align-items: left;
    gap: 8px;
    position: relative;
    background: #FFF;
    top: 0px;
`;

export const Text = styled.p`
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  display: inline;
  align-items: flex-start;
  color: #1F2937;
`;

export const Texthighlight = styled.span`
  font-size: 12px;
  font-weight: 700;
  display: inline;
  color: #1F2937;
`;

export const Column1 = styled.div`
display: flex;
justify-content: center;
align-items: flex-start;
gap: 6px;
width: 100%;
flex-direction: row;

`;

export const Column2 = styled.div`
display: block;
justify-content: center;
align-items: flex-start;
gap: 6x;
max-width: 140px;
width: 100%;
flex-direction: column;
`;

