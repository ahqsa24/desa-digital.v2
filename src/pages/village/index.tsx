import Hero from "./components/hero";
import { useQuery } from "react-query";
import { getUsers } from "Services/userServices";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, generatePath } from "react-router-dom";
import { GridContainer, 
          CardContent, 
          Containers, 
          Text, 
          Texthighlight,
          Column1, 
          Column2} from "./_villageStyle";
import CardVillage from "Components/card/village";
import { auth } from "../../firebase/clientApp";
import { paths } from "Consts/path";
import {
  Box
} from "@chakra-ui/react";
import SearchBarVil from "./components/SearchBarVil";
import Dropdown from "./components/Filter";

import { getProvinces, getRegencies } from "../../services/locationServices";

interface Location {
  id: string;
  name: string;
}

const Village: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  //TODO nah ini selected province blm kepake. kayanya harus kepake
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [regencies, setRegencies] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedRegency, setSelectedRegency] = useState<string>("");
  
  const handleFetchProvinces = async () => {
    try {
      const provincesData: Location[] = await getProvinces();
      setProvinces(provincesData); // Simpan data apa adanya
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleFetchRegencies = async (provinceId: string) => {
    try {
      const regenciesData = await getRegencies(provinceId);
      setRegencies(regenciesData);
    } catch (error) {
      console.error("Error fetching regencies:", error);
    }
  };
  useEffect(() => {
    handleFetchProvinces();
  }, []);

  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = event.target.value;
    const provinceName = event.target.options[event.target.selectedIndex].text;
    setSelectedProvince(provinceName);
    handleFetchRegencies(provinceId);
    setRegencies([]);
  };

  const handleRegencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const regencyName = event.target.options[event.target.selectedIndex].text;
    setSelectedRegency(regencyName);
  };

  const { data: users, isFetched } = useQuery<any>("villages", getUsers);
  const villages = users?.filter((item: any) => item.role === "village");
 
  //TODO: onchange dropdown juga perlu diperbaiki
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
              <Dropdown
                placeholder="Pilih Provinsi"
                options={provinces} // Data provinsi yang sudah diformat
                onChange={handleProvinceChange}> 
              </Dropdown> 
            </Column2>
            <Column2>
              <Text>
                Pilih Kab/Kota
              </Text>
              <Dropdown
                placeholder="Pilih Kab/Kota"
                options={regencies} // Data provinsi yang sudah diformat
                onChange={handleRegencyChange}
              >   
              </Dropdown> 
            </Column2>
          </Column1>
          <Column1> 
                <SearchBarVil/>
          </Column1>
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
};

export default Village;
