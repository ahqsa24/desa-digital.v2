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
import {
  Box,
  Select, 
} from "@chakra-ui/react";
import SearchBarVil from "./components/SearchBarVil";
import Container from "Components/container";
import Dropdown from "./components/filter";

const categories = [
  "JAw",
  "Kabupaten Bogor",
  "Kota Bogor",
  "Kabupaten Kuningan ",
  "Kabupaten Kuningan",
  "Kabupaten Kuningan",
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
              <Dropdown/> 
            </Column2>
            <Column2>
              <Text>
                Pilih Kab/Kota
              </Text>
              <Dropdown/>  
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
