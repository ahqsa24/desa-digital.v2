import { StyledButton } from './_buttonStyle'
import { MarginProps } from 'Consts/sizing'

interface ButtonProps extends MarginProps {
  children: React.ReactNode
  size?: 's' | 'm' | 'l'
  onClick?: () => void
  fullWidth?: boolean
  type?: any
}

function Button(props: ButtonProps) {
  const { children } = props
  return <StyledButton {...props}>{children}</StyledButton>
}

export default Button
