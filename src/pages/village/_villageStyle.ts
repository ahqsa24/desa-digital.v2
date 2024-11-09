import styled from "styled-components";

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: center;
  gap: 16px;
  padding: 6px;
`;

export const Containers = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  top: -56px;
  margin: 16px;
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
    height: 135px;
    padding: 16px;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    position: absolute;
    background: #FFF;
    top: 0px;
     
    
`