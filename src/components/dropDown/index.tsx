import { StyledDropDown, StyledOption } from "./_dropDownStyles";

type Option = {
  id: string;
  nama: string;
};

interface DropDownProps {
  options: Array<string> | Array<Option>;
  form?: any;
  name?: string;
  placeholder?: string;
  onChange?: (value: string | Option) => void;
  defaultValue?: string;
  isDisabled?: boolean
}

function Dropdown(props: DropDownProps) {
  const {
    options = [],
    form,
    name,
    placeholder,
    onChange,
    defaultValue,
    isDisabled
  } = props;
  const { register } = form;

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(e.target.value);
  };

  return (
    <StyledDropDown
      {...register(name)}
      onChange={handleOnChange}
      value={defaultValue}
      isDisabled={isDisabled}
    >
      {!!placeholder && (
        <StyledOption value="" disabled hidden>
          {placeholder}
        </StyledOption>
      )}
      {options?.map((option, idx) => {
        const value = typeof option === "string" ? option : option?.id;
        const label = typeof option === "string" ? option : option?.nama;

        return (
          <StyledOption
            key={idx}
            value={value}
            disabled={value === defaultValue}
          >
            {label}
          </StyledOption>
        );
      })}
    </StyledDropDown>
  );
}

export default Dropdown;
