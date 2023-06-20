import styled from "styled-components";

export const CardContainer = styled.div`
  overflow: auto;
  width: 100%;
  white-space: nowrap;
  
`;

export const Horizontal = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
align-content: center;
gap: 16px;
`;

export const Title = styled.p`
  font-size: 10px;
  font-weight: 400;
  color: black;
  margin: 24px 0 16px 0;
`;
