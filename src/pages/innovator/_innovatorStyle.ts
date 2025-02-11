import styled from "styled-components";

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(50px, 1fr)); /* Dua kolom dengan lebar yang sama */
  gap: 20px; /* Jarak antar elemen */
  justify-content: center; /* Pusatkan grid secara horizontal */
  align-items: center; /* Pusatkan elemen dalam kolom */
  padding: 3px; /* Ruang dalam grid */
  max-width: 1200px; /* Pastikan mengambil lebar penuh */
  box-sizing: border-box; /* Pastikan padding tidak memengaruhi ukuran */
  margin-top: -5px;
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
    
`
export const Text = styled.p`
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  display: inline;
  flex-direction: left;
  align-items: flex-start;
  color: #1F2937;
`;

export const Texthighlight = styled.span`
  font-size: 12px;
  font-weight: 700;
  display: inline;
  color: #1F2937;
`;

export const Column = styled.div`
display: flex;
padding-top: 1px;
flex-direction: column;
justify-content: center;
align-items: flex-start;
gap: 6px;
width: 100%
`;