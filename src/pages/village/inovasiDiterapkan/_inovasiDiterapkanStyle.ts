import styled from "styled-components";
import { marginStyle } from "Consts/sizing";
export const CardContainer = styled.div`
  overflow: auto;
  width: 100%;
  white-space: nowrap;
`
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: center;
  align-items: left;
  gap: 16px;
  padding: px;
  position: relative;
  width: 100%;
  }
`;