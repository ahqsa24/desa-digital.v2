import {ComponentStyleConfig} from "@chakra-ui/theme"

export const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "700",
        _focus: {
            boxShadow: "none",
        },
    },
    variants: {
        solid: {
            bg: "brand.100",
            color: "white",
            _hover: {
                bg: "brand.110",
            },
        },
        outline: {
            bg: "transparent",
            border: "1px solid",
            borderColor: "brand.100",
            color: "brand.100",
            _hover: {
                bg: "brand.100",
                color: "white",
            },
        },
        inverted: {
            bg: "white",
            color: "brand.100",
            border: "1px solid",
            borderColor: "brand.100",
            _hover: {
                bg: "brand.100",
                color: "white",
            },
        },
    },
}