import { Box, Text, Flex } from "@chakra-ui/react";
import TopBar from "Components/topBar";
import { collection, doc, getDoc, getDocs, query, where, DocumentData, } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, generatePath, useParams } from "react-router-dom";
import { auth, firestore } from "../../../firebase/clientApp";
import { paths } from "Consts/path";
import {
  CardContainer,
  GridContainer,

} from "./_inovasiDiterapkanStyle";
import CardInnovation from "Components/card/innovation";


const InovasiDiterapkan: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [innovations, setInnovations] = useState<DocumentData[]>([]);


  useEffect(() => {
    const fetchVillageAndInnovations = async () => {
      if (!user) return;

      // Fetch desa berdasarkan user ID
      const villageRef = collection(firestore, "villages");
      const q = query(villageRef, where("userId", "==", user.uid));
      const villageSnap = await getDocs(q);

      if (!villageSnap.empty) {
        const villageData = villageSnap.docs[0].data();
        const inovasiDiterapkan = villageData?.inovasiDiterapkan || [];

        // Ambil semua inovasiId dari field inovasiDiterapkan
        const inovasiIds = inovasiDiterapkan.map(
          (inovasi: any) => inovasi.inovasiId
        );

        if (inovasiIds.length > 0) {
          const fetchInnovations = async () => {
            try {
              const innovationsRef = collection(firestore, "innovations");
              const q = query(innovationsRef, where("__name__", "in", inovasiIds));
              const snapshot = await getDocs(q);

              const innovationsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));

              setInnovations(innovationsData);
            } catch (error) {
              console.error("Gagal mengambil data inovasi:", error);
            }
          };

          fetchInnovations();
        }
      }
    };

    fetchVillageAndInnovations();
  }, [user]);

  const handleClick = () => {
    navigate(paths.INOVASI_DITERAPKAN_PAGE);
  };

  return (
    <Box paddingTop={14}>
      <TopBar title="Inovasi Diterapkan" onBack={() => navigate(-1)} />
      <Flex padding="16px">
        <CardContainer>
          <GridContainer>
            {innovations.length > 0 ? (
              innovations.map((innovation, idx) => (
                <CardInnovation
                  key={idx}
                  images={innovation.images}
                  namaInovasi={innovation.namaInovasi}
                  kategori={innovation.kategori}
                  deskripsi={innovation.deskripsi}
                  tahunDibuat={innovation.tahunDibuat}
                  innovatorLogo={innovation.innovatorImgURL}
                  innovatorName={innovation.namaInnovator}
                  onClick={() =>
                    navigate(
                      generatePath(paths.DETAIL_INNOVATION_PAGE, {
                        id: innovation.id,
                      })
                    )
                  }
                />
              ))
            ) : (<Text>Belum ada inovasi yang diterapkan.</Text>
            )}
          </GridContainer>
        </CardContainer>
      </Flex>
    </Box>
  );
};
export default InovasiDiterapkan;
