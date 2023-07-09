import { StyledDropDown, StyledOption } from "./_dropDownStyles";

interface DropDownProps {
  options: Array<string>;
  form?: any;
  name?: string;
  placeholder?: string;
}

function Dropdown(props: DropDownProps) {
  const { options, form, name, placeholder } = props;
  const { register } = form;

  return (
    <StyledDropDown {...register(name)}>
      {!!placeholder && (
        <StyledOption value="" disabled selected hidden>
          {placeholder}
        </StyledOption>
      )}
      {options?.map((option, idx) => (
        <StyledOption key={idx}>{option}</StyledOption>
      ))}
    </StyledDropDown>
  );
}

export default Dropdown;
