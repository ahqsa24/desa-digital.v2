import { MarginProps, marginStyle } from "Consts/sizing";
import styled, { css } from "styled-components";

interface KlaimBadgeProps extends MarginProps {
    condition?: "menunggu" | "terverifikasi" | "ditolak";
}

export const StyledKlaimBadge = styled.div<KlaimBadgeProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 79px;
    height: 18px;
    border-radius: 12px;
    border: 0.5px solid;
    font-size: 10px;
    font-weight: 400;
    
    
  ${({ condition }) => {
        if (condition === "ditolak") {
            return css`
        color: #DC2626;
        border-color: #DC2626;
        background-color: #FEE2E2;
      `;
        }
        if (condition === "terverifikasi") {
            return css`
        color: #16A34A;
        border-color: #16a34a;
        background-color: #DCFCE7;
      `;
        }
        if (condition === "menunggu") {
            return css`
                color: #EAB308;
        border-color: #EAB308;
        background-color: #FEF9C3;
      `;
    }
    return css`
    &::before {
      content: "Status Tidak Diketahui";
    }
  `;
}}
`;
