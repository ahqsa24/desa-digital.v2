import styled from 'styled-components'

export const Container = styled.div`
  padding: 16px;
  background-color: #347357;
  position: fixed;
  top: 0;
  max-width: 360px;
  display: absolute;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
`

export const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: ${({ position }: { position?: string }) => position};
`

export const Title = styled.p`
  font-size: 16px;
  color: white;
  font-weight: 700;
`

export const Icon = styled.img`
  cursor: pointer;
`

export const Login = styled.p`
  font-size: 14px;
  color: white;
  font-weight: 700;
  cursor: pointer;
`

export const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
