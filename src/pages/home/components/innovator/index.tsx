import CardInnovator from "Components/card/innovator";
import Container from "Components/container";
import { paths } from "Consts/path";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { firestore } from "../../../../firebase/clientApp";
import { CardContainer, Horizontal, Title } from "./_innovatorStyle";

function Innovator() {
  const navigate = useNavigate();
  const innovatorsRef = collection(firestore, "innovators");
  const [innovators, setInnovators] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchInnovators = async () => {
      const innovatorsSnapshot = await getDocs(innovatorsRef);
      const innovatorsData = innovatorsSnapshot.docs.map((doc) => doc.data());
      setInnovators(innovatorsData);
    };
    fetchInnovators();
  }, [firestore]);

  return (
    <Container>
      <Title>Inovator Unggulan</Title>
      <CardContainer>
        <Horizontal>
          {innovators.map((item, idx) => (
            <CardInnovator
              key={idx}
              id={item.id}
              header={item.header}
              logo={item.logo}
              innovatorName={item.namaInovator}
              description={item.deskripsi}
              jumlahDesaDampingan={item.jumlahDesaDampingan}
              jumlahInovasi={item.jumlahInovasi}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: item.id })
                )
              }
            />
          ))}
        </Horizontal>
      </CardContainer>
    </Container>
  );
}

export default Innovator;
