import styled from 'styled-components'

export const Container = styled.div`
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 16px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
`

export const Title = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: black;
`

export const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
