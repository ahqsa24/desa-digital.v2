import styled from 'styled-components'

export const Container = styled.div`
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  width: 100%;
  height: 189px;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  cursor: pointer;
  
`

export const Background = styled.img`
  height: 64px;
  width: 100%;
  object-fit: cover;
`
export const Logo = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: -25px;
`
export const CardContent = styled.div`
  padding: 8px 8px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  align-item: flex-start;
  flex: 1 0 0;
  align-self: stretch;
`
export const ContBadge = styled.div`
  display: flex;
  width: 100%;
  height: 21px;
  gap: 10 px;
  align-items: center;
  justify-content: flex-end;
  padding: 8px;

`
export const Title = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: 1F2937;
  line-height: 140%;
  
`
export const Description = styled.p`
  font-size: 10px;
  font-weight: 400;
  color: #374151;
`
export const Location = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: auto;
`