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
import { paths } from "Consts/path";

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

  const categoryToPathMap: Record<string, string> = {
    "Verifikasi Desa": paths.VILLAGE_PROFILE_PAGE,
    "Verifikasi Inovator": paths.INNOVATOR_PROFILE_PAGE,
    "Verifikasi Tambah Inovasi": paths.DETAIL_INNOVATION_PAGE,
  };

  const handleCardClick = (id: string) => {
    const pathTemplate = categoryToPathMap[category || ""];
    if (pathTemplate) {
      const path = pathTemplate.replace(":id", id);
      navigate(path);
    } else {
      console.error("Unknown category or path mapping missing");
    }
  };

  const fetchCategoryData = async (collectionName: string) => {
    const docRef = collection(firestore, collectionName);
    const docSnap = await getDocs(docRef);
    return docSnap.docs.map((doc) => ({
      id: doc.id, // Include ID for path generation
      ...doc.data(),
    }));
  };

  const fetchData = async () => {
    const categoryToCollectionMap: Record<string, string> = {
      "Verifikasi Desa": "villages",
      "Verifikasi Inovator": "innovators",
      "Verifikasi Tambah Inovasi": "innovations",
    };

    const collectionName = categoryToCollectionMap[category || ""];
    if (collectionName) {
      return await fetchCategoryData(collectionName);
    }
    return [];
  };

  // Memuat data ketika kategori berubah
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
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
                onClick={() => handleCardClick(data.id)}
              />
            );
          })
        )}
      </Stack>
    </Container>
  );
};
export default VerificationPage;
