import { StyledDropDown, StyledOption } from './_dropDownStyles'

interface DropDownProps {
  options: Array<string>
  form?: any
  name?: string
}

function Dropdown(props: DropDownProps) {
  const { options, form, name } = props
  const { register } = form

  return (
    <StyledDropDown {...register(name)}>
      {options?.map((option, idx) => (
        <StyledOption key={idx}>{option}</StyledOption>
      ))}
    </StyledDropDown>
  )
}

export default Dropdown
