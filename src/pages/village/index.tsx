import Hero from "./components/hero";
import { useQuery } from "react-query";
import { getUsers } from "Services/userServices";
import { useNavigate, generatePath } from "react-router-dom";
import { GridContainer, 
          CardContent, 
          Containers, 
          Text, 
          Texthighlight,
          Column1, 
          Column2} from "./_villageStyle";
import CardVillage from "Components/card/village";
import { paths } from "Consts/path";
import Container from "Components/container";
import {Box, Select} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import SearchBar from "Components/search/SearchBar";
import SearchBarVil from "./components/SearchBarVil";

const categories = [
  "Kabupaten Bandung",
  "Kabupaten Bogor",
  "Kota Bogor",
  "Kabupaten Kuningan"
,
];

function Village() {
  const navigate = useNavigate();
  const { data: users, isFetched } = useQuery<any>("villages", getUsers);
  const villages = users?.filter((item: any) => item.role === "village");

  return (
  <Box>
      <Hero />
      <Containers> 
        <CardContent> 
          <Column1>
            <Column2>
              <Text>
                Pilih Provinsi
              </Text>
              <Select
                placeholder="Pilih Provinsi"
                name="category"
                fontSize="10pt"
                variant="outline"
                cursor="pointer"
                color={"gray.500"}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "1px solid",
                  borderColor: "#E5E7EB",
                }}
                //value={category}
                //onChange={onSelectCategory}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Column2>
            <Column2>
              <Text>
                Pilih Kabupaten/Kota
              </Text>
              <Select
                placeholder="Pilih Kab/Kota"
                name="category"
                fontSize="10pt"
                variant="outline"
                cursor="pointer"
                color={"gray.500"}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "1px solid",
                  borderColor: "#E5E7EB",
                }}
                //value={category}
                //onChange={onSelectCategory}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Column2>
          </Column1>
          <Column2> 
                <SearchBarVil/>
          </Column2>
        </CardContent>
        <Text> Menampilkan 8 desa untuk <Texthighlight>"Semua Provinsi"</Texthighlight> </Text>
        <GridContainer>
          {isFetched &&
            villages?.map((item: any, idx: number) => (
              <CardVillage
                key={idx}
                {...item}
                onClick={() =>
                  navigate(
                    generatePath(paths.DETAIL_VILLAGE_PAGE, { id: item.id })
                  )
                }
              />
            ))}
        </GridContainer>
        
      </Containers>
    </Box>
  );
}

export default Village;
