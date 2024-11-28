import React, { useState, useRef, useEffect } from "react";
import TopBar from 'Components/topBar';
import { Box, Text, Flex } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom"; // Pastikan ini diimpor jika Anda menggunakan React Router
import FormSection from "../../../components/form/FormSection";
import { useAuthState } from "react-firebase-hooks/auth"; // Jika tidak digunakan, Anda dapat menghapusnya
import { Container, SubText } from "../klaimInovasiManual/_klaimManualStyle";
import LogoUpload from "../../../components/form/LogoUpload";
import HeaderUpload from "../../../components/form/HeaderUpload";
import ConfModal from "../../../components/confirmModal/confModal";
import SecConfModal from "../../../components/confirmModal/secConfModal";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import { Collapse } from '@chakra-ui/react'
import ImageUpload from "../../../components/form/ImageUpload";
import DocUpload from "../../../components/form/DocUpload";
import VidUpload from "../../../components/form/VideoUpload";
import Button from "Components/button";


import {
    CheckboxGroup,
    Field,
    Label,
    Text1,
    Text2,
    JenisKlaim,
    NavbarButton,
    Container2,
} from "../klaimInovasi/_klaimStyles";


const KlaimManual: React.FC = () => {
    const [selectedLogo, setSelectedLogo] = useState<string>("");
    const navigate = useNavigate();
    const selectedLogoRef = useRef<HTMLInputElement>(null);
    const [selectedHeader, setSelectedHeader] = useState<string>("");
    const selectedHeaderRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<string[]>([]);
    const [selectedVid, setSelectedVid] = useState<string>("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const selectedVidRef = useRef<HTMLInputElement>(null);
    const selectedDocRef = useRef<HTMLInputElement>(null);
    const modalBody1 = "Apakah Anda yakin ingin mengajukan klaim?"; // Konten Modal
    const modalBody2 = "Inovasi sudah ditambahkan. Admin sedang memverifikasi pengajuan klaim inovasi. Silahkan cek pada halaman pengajuan klaim"; // Konten Modal
    const [user] = useAuthState(auth);

    const handleCheckboxChange = (checkbox: string) => {
        if (selectedCheckboxes.includes(checkbox)) {
            // Jika checkbox sudah dipilih, hapus dari array
            setSelectedCheckboxes(selectedCheckboxes.filter((item) => item !== checkbox));
        } else {
            // Jika checkbox belum dipilih, tambahkan ke array
            setSelectedCheckboxes([...selectedCheckboxes, checkbox]);
        }
    };

    const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const imagesArray: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    if (readerEvent.target?.result) {
                        imagesArray.push(readerEvent.target.result as string);
                        if (imagesArray.length === files.length) {
                            setSelectedFiles((prev) => [...prev, ...imagesArray]);
                        }
                    }
                };
                reader.readAsDataURL(files[i]);
            }
        }
    };

    const onSelectVid = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedVid(readerEvent.target?.result as string);
            }
        };
    };


    const onSelectDoc = (event: React.ChangeEvent<HTMLInputElement>) => {
        const doc = event.target.files;
        if (doc) {
            const docArray: string[] = [];
            for (let i = 0; i < doc.length; i++) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    if (readerEvent.target?.result) {
                        docArray.push(readerEvent.target.result as string);
                        if (docArray.length === doc.length) {
                            setSelectedDoc((prev) => [...prev, ...docArray]);
                        }
                    }
                };
                reader.readAsDataURL(doc[i]);
            }
        }
    };

    const onSubmitForm = async (event: React.FormEvent<HTMLElement>) => {
        if (!user?.uid) {
            setError("User ID is not defined. Please make sure you are logged in.");
            setLoading(false);
            return;
        }
        const userId = user.uid;

        console.log("Document writen with ID: ", userId);

    }

    const [isModal1Open, setIsModal1Open] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);
    const closeModal = () => {
        setIsModal1Open(false);
        setIsModal2Open(false);
    };

    const handleModal1Yes = () => {
        setIsModal2Open(true);
        setIsModal1Open(false); // Tutup modal pertama
        // Di sini tidak membuka modal kedua
    };

    useEffect(() => {
        // Jika salah satu modal terbuka, sembunyikan scrollbar
        if (isModal1Open || isModal2Open) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = ''; // Kembalikan scrollbar jika kedua modal tertutup
        }
      }, [isModal1Open, isModal2Open]);



    const [textInputValue, setTextInputValue] = useState({
        innovname: "",
        description: "",
        innovation: "",
    });
    const currentWordCount = (text: string) => {
        return text.split(/\s+/).filter((word) => word !== "").length;
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSelectLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedLogo(readerEvent.target?.result as string);
            }
        };
    };
    const onSelectHeader = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedHeader(readerEvent.target?.result as string);
            }
        };
    };

    const onTextChange = ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (textInputValue.innovname || textInputValue.innovation) {
            setTextInputValue((prev) => ({ ...prev, [name]: value }));
        } else if (textInputValue.description) {
            const wordCount = value.split(/\s+/).filter((word) => word !== "").length;
            if (wordCount <= 50) {
                setTextInputValue((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            const wordCount = value.split(/\s+/).filter((word) => word !== "").length;
            if (wordCount <= 30) {
                setTextInputValue((prev) => ({ ...prev, [name]: value }));
            }
        }
    };

    const handleSubmit = () => {
        try {
            const { innovname, description, innovation } = textInputValue;

            if (!innovname || !description || !innovation) {
                setError("Semua kolom harus diisi.");
                setLoading(false);
                return;
            }

            console.log(textInputValue); // Simpan atau kirim data sesuai kebutuhan
        } catch (error) {
            console.error(error);
            setError("Terjadi kesalahan. Coba lagi.");
        }
    };

    return (
        <Box paddingTop="56px">
            <TopBar title="Klaim Penerapan Inovasi" onBack={() => navigate(-1)} />
            <Container>
                <Flex gap={3} paddingBottom={4} direction={'column'} borderBottom={'1px'} borderBottomColor={'#E5E7EB'}>
                    <Flex direction={'column'} gap={1}>
                        <SubText>Informasi Inovasi</SubText>
                        <Text fontWeight="400" fontSize="12px" color="#9CA3AF">
                            Silahkan masukkan informasi inovator dan inovasi yang akan anda klaim penerapannya
                        </Text>
                    </Flex>
                    <FormSection
                        title="Nama Inovator"
                        name="innovname"
                        placeholder="Nama Inovator"
                        value={textInputValue.innovname}
                        onChange={onTextChange}
                    />
                    <FormSection
                        title="Nama Inovasi"
                        name="innovation"
                        placeholder="Nama Inovasi"
                        value={textInputValue.innovation}
                        onChange={onTextChange}
                    />
                    <FormSection
                        title="Deskripsi Inovasi"
                        name="description"
                        placeholder="Masukkan deskripsi inovasi yang ada di desa"
                        value={textInputValue.description}
                        onChange={onTextChange}
                        isTextArea
                        wordCount={currentWordCount(textInputValue.description)}
                        maxWords={80}
                    />
                    <Box marginTop="-4px">
                        <Text fontWeight="400" fontSize="14px">
                            Logo Inovator
                        </Text>
                        <Text fontWeight="400" fontSize="10px" mb="6px" color="#9CA3AF">
                            Maks 1 foto. format: png, jpg.
                        </Text>
                        <LogoUpload
                            selectedLogo={selectedLogo}
                            setSelectedLogo={setSelectedLogo}
                            selectFileRef={selectedLogoRef}
                            onSelectLogo={onSelectLogo}
                        />
                    </Box>

                    <Box marginTop="-4px">
                        <Text fontWeight="400" fontSize="14px">
                            Foto Inovasi
                        </Text>
                        <Text fontWeight="400" fontSize="10px" mb="6px" color="#9CA3AF">
                            Maks 1 foto. format: png, jpg.
                        </Text>
                        <HeaderUpload
                            selectedHeader={selectedHeader}
                            setSelectedHeader={setSelectedHeader}
                            selectFileRef={selectedHeaderRef}
                            onSelectHeader={onSelectHeader}
                        />
                    </Box>
                </Flex>
                <Flex direction={'column'} gap={1}>
                    <SubText>Bukti Klaim</SubText>
                    <Text fontWeight="400" fontSize="12px" mb="6px" color="#9CA3AF">
                        Silahkan masukkan informasi inovator dan inovasi yang akan anda klaim penerapannya
                    </Text>
                </Flex>
                
                    <Flex flexDirection="column" gap="2px">
                        <Label>
                            Jenis Dokumen Bukti Klaim  <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Text2> Dapat lebih dari 1 </Text2>
                    </Flex>
                    <CheckboxGroup>
                        <JenisKlaim>
                            <input
                                style={{
                                    transform: "scale(1.3)", // Memperbesar checkbox
                                    marginRight: "8px", // Memberi jarak ke teks
                                }}
                                type="checkbox"
                                onChange={() => handleCheckboxChange("foto")}
                                checked={selectedCheckboxes.includes("foto")}
                            />
                            Foto
                        </JenisKlaim>
                        <JenisKlaim>
                            <input
                                style={{
                                    transform: "scale(1.3)", // Memperbesar checkbox
                                    marginRight: "8px", // Memberi jarak ke teks
                                }}
                                type="checkbox"
                                onChange={() => handleCheckboxChange("video")}
                                checked={selectedCheckboxes.includes("video")}
                            />
                            Video
                        </JenisKlaim>
                        <JenisKlaim>
                            <input
                                style={{
                                    transform: "scale(1.3)", // Memperbesar checkbox
                                    marginRight: "8px", // Memberi jarak ke teks
                                }}
                                type="checkbox"
                                onChange={() => handleCheckboxChange("dokumen")}
                                checked={selectedCheckboxes.includes("dokumen")}
                            />
                            Dokumen
                        </JenisKlaim>
                    </CheckboxGroup>

                    <Collapse in={selectedCheckboxes.includes("foto")} animateOpacity>
                        <Field>
                            <Flex flexDirection="column" gap="2px">
                                <Text1>Foto Inovasi
                                    <span style={{ color: "red" }}>*</span>
                                </Text1>
                                <Text2> Maks 2 foto. format: png, jpg </Text2>
                                <ImageUpload
                                    selectedFiles={selectedFiles}
                                    setSelectedFiles={setSelectedFiles}
                                    selectFileRef={selectedFileRef}
                                    onSelectImage={onSelectImage}
                                />
                            </Flex>
                        </Field>
                    </Collapse>

                    <Collapse in={selectedCheckboxes.includes("video")} animateOpacity>
                        <Field>
                            <Flex flexDirection="column" gap="2px">
                                <Text1>Video inovasi
                                    <span style={{ color: "red" }}>*</span>
                                </Text1>
                                <Text2> Maks 100 mb. Format: mp4 </Text2>

                            </Flex>
                            <VidUpload
                                selectedVid={selectedVid}
                                setSelectedVid={setSelectedVid}
                                selectVidRef={selectedVidRef}
                                onSelectVid={onSelectVid}
                            />
                        </Field>
                    </Collapse>

                    <Collapse in={selectedCheckboxes.includes("dokumen")} animateOpacity>
                        <Field>
                            <Flex flexDirection="column" gap="2px">
                                <Text1>Dokumen Pendukung
                                    <span style={{ color: "red" }}>*</span>
                                </Text1>
                                <Text2> Maks 3 file, 50 mb. Format: pdf, doc, docx </Text2>
                            </Flex>
                            <DocUpload
                                selectedDoc={selectedDoc}
                                setSelectedDoc={setSelectedDoc}
                                selectDocRef={selectedDocRef}
                                onSelectDoc={onSelectDoc}
                            />
                        </Field>
                    </Collapse>
                </Container>
                <div>
                <NavbarButton>
                    <Button size="m" fullWidth type="submit" onClick={() => setIsModal1Open(true)}>
                        Ajukan Klaim
                    </Button>
                </NavbarButton>
                <ConfModal
                    isOpen={isModal1Open}
                    onClose={closeModal}
                    modalTitle=""
                    modalBody1={modalBody1}     // Mengirimkan teks konten modal
                    onYes={handleModal1Yes}
                />
                <SecConfModal 
                isOpen={isModal2Open} 
                onClose={closeModal} 
                modalBody2={modalBody2}     // Mengirimkan teks konten modal
                    />
            </div>
            

        </Box>
    );
};

export default KlaimManual;
