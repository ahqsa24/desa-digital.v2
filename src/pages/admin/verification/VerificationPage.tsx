import Container from "Components/container";
import TopBar from "Components/topBar";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListNotification from "./ListNotification";
import AdsPage from "../ads/AdsPage";


const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  return (
    <Container page>
      <TopBar title={category} onBack={() => navigate(-1)} />
      {category === "Pembuatan Iklan" ? <AdsPage /> : <ListNotification />}
    </Container>
  );
};
export default VerificationPage;
