import { Stack } from "@chakra-ui/react";
import CardNotification from "Components/card/notification/CardNotification";
import Container from "Components/container";
import TopBar from "Components/topBar";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, firestore } from "../../../firebase/clientApp";
import AdsPage from "../ads/AdsPage";

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const [user] = useAuthState(auth);
  const [verifData, setVerifData] = useState<any[]>([]);

  const formatTimestamp = (timestamp: {
    seconds: number;
    nanoseconds: number;
  }) => {
    if (!timestamp?.seconds) return "Invalid Date";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatLocation = (lokasi: any) => {
    if (!lokasi) return "No Location";
    const kecamatan = lokasi.kecamatan?.label || "Unknown Subdistrict";
    const kabupaten = lokasi.kabupatenKota?.label || "Unknown City";
    const provinsi = lokasi.provinsi?.label || "Unknown Province";

    return `KECAMATAN ${kecamatan}, ${kabupaten}, ${provinsi}`;
  };



  const fetchCategoryData = async (collectionName: string) => {
    const docRef = collection(firestore, collectionName);
    const docSnap = await getDocs(docRef);
    return docSnap.docs.map((doc) => doc.data());
  };

  const fetchData = async () => {
    switch (category) {
      case "Verifikasi Desa":
        return await fetchCategoryData("villages");
      case "Verifikasi Innovator":
        return await fetchCategoryData("innovators");
      case "Verifikasi Tambah Innovasi":
        return await fetchCategoryData("innovations");
      default:
        return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      console.log(data);
      setVerifData(data || []);
    };
    loadData();
  }, [category]);

  return (
    <Container page>
      <TopBar title={category || "Verification"} onBack={() => navigate(-1)} />
      <Stack padding="0 16px" gap={2}>
        {category === "Pembuatan Iklan" ? (
          <AdsPage />
        ) : (
          verifData.map((data, index) => {
            const isVillageCategory = category === "Verifikasi Desa";
            const description = isVillageCategory
              ? formatLocation(data.lokasi)
              : data.deskripsi || "No Description";

            return (
              <CardNotification
                key={index}
                title={
                  data.namaDesa ||
                  data.namaInovator ||
                  data.namaInovasi ||
                  "No Title"
                }
                status={data.status || "Unknown"}
                date={formatTimestamp(data.createdAt)}
                description={description}
              />
            );
          })
        )}
      </Stack>
    </Container>
  );
};
export default VerificationPage;
