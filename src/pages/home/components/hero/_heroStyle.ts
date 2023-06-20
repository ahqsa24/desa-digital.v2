import styled from 'styled-components'
import HeroBackground from 'Assets/images/hero-background.jpg'

export const Background = styled.div`
  padding: 16px;
  background-image: url(${HeroBackground});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 180px;
  border-radius: 0px 0px 24px 24px;
  display: flex;
  align-items: center;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Title = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #374151;
`

export const Description = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #374151;
`
