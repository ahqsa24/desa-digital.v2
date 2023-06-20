import { MarginProps, PaddingProps } from 'Consts/sizing'
import { StyledContainer } from './_containerStyle'

interface ContainerProps extends PaddingProps, MarginProps {
  page?: boolean
  children: React.ReactNode
}

function Container({ page, children, ...rest }: ContainerProps) {
  return (
    <StyledContainer page={page} {...rest}>
      {children}
    </StyledContainer>
  )
}

export default Container
