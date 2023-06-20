import Button from 'Components/button'
import styled from 'styled-components'

export const FloatingButton = styled(Button)`
  border-radius: 50%;
  height: 50px;
  width: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  z-index: 999;
  bottom: 70px;
  margin-left: auto;
  margin-right: 10px;
`
