import styled, {css} from "styled-components";

export const StyledDropDown = styled.select<{ isDisabled?: boolean }>`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 0 8px;
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  margin-top: 4px;
  &:focus {
    border: 2px solid #000000;
  }

  ${({isDisabled}) => {
    if(isDisabled) 
      return css`
        opacity: 0.8; 
        cursor: not-allowed;
        pointer-events: none; 
        background-color: #eaeaea;
      `
  }}
`;

export const StyledOption = styled.option`
  font-size: 14px;
  color: #000000;
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
  &:focus {
    border: 2px solid #000000;
  }
`;
