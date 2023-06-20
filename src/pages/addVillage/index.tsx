import React from "react";
import TopBar from "Components/topBar";
import Container from "Components/container";
import TextField from "Components/textField";
import Button from "Components/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Label, TagContainer } from "./_addVillage";

function AddVillage() {
  const navigate = useNavigate();
  const form = useForm();
  const { handleSubmit } = form;

  const onRegisterInovator = async (data: any) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const containerStyle = {
    paddingTop: "50px",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingBottom: "80px",
  };

  return (
    <Container>
      <TopBar title="Registrasi Desa" />
      <div style={containerStyle}>
        <form onSubmit={handleSubmit(onRegisterInovator)}>
          <React.Fragment>
            <Label mt={12}> Provinsi </Label>
            <form>
              <select>
                <option key={1} value={32}>
                  jawa barat
                </option>
                <option key={1} value={32}>
                  jawa barat
                </option>
                <option key={1} value={32}>
                  jawa barat
                </option>
              </select>
              {/* <input type="text" /> */}
            </form>
          </React.Fragment>
          <React.Fragment>
            <Label mt={12}> Kabupaten/Kota </Label>
            <form>
              <select>
                <option key={1} value={32}>
                  jawa barat
                </option>
                <option key={1} value={32}>
                  jawa barat
                </option>
                <option key={1} value={32}>
                  jawa barat
                </option>
              </select>
              {/* <input type="text" /> */}
            </form>
          </React.Fragment>
          <React.Fragment>
            <Label mt={12}> Kecamatan </Label>
            <form>
              <select>
                <option key={1} value={32}>
                  jawa barat
                </option>
                <option key={1} value={32}>
                  jawa barat
                </option>
                <option key={1} value={32}>
                  jawa barat
                </option>
              </select>
              {/* <input type="text" /> */}
            </form>
          </React.Fragment>
          <React.Fragment>
            <Label mt={12}> Desa/Kelurahan </Label>
            <form>
              <select>
                <option key={1} value={32}>
                  jawa barat
                </option>
                <option key={1} value={32}>
                  jawa barat
                </option>
                <option key={1} value={32}>
                  jawa barat
                </option>
              </select>
              {/* <input type="text" /> */}
            </form>
          </React.Fragment>
          <Label mt={12}>Tentang Inovasi di Desa</Label>
          <TextField
            mt={4}
            placeholder="Tentang Inovasi di Desa"
            type="text"
            name="tentang"
            form={form}
          />
          <Label mt={12}>Potensi Desa</Label>
          <TextField
            mt={4}
            placeholder="Potensi Desa"
            type="text"
            name="potensi"
            form={form}
          />

          <Button size="m" fullWidth mt={12} type="submit">
            Tambahkan Desa{" "}
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default AddVillage;
