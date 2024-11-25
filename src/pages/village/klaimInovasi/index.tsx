
import React, { useEffect, useState, useRef } from "react";
import ImageUpload from "../../../components/form/ImageUpload";
import DocUpload from "../../../components/form/DocUpload";
import VidUpload from "../../../components/form/VideoUpload";
import { Collapse } from '@chakra-ui/react'
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import TopBar from "Components/topBar";
import Button from "Components/button";
import {
    Container,
    CheckboxGroup,
    Field,
    Label,
    Text1,
    Text2,
    JenisKlaim,
    NavbarButton,
    Container2,
} from "./_klaimStyles";
import {
    Box,
    Flex
} from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/react";
const KlaimInovasi: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<string[]>([]);
    const [selectedVid, setSelectedVid] = useState<string>("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const selectedVidRef = useRef<HTMLInputElement>(null);
    const selectedDocRef = useRef<HTMLInputElement>(null);
    const { isOpen, onToggle } = useDisclosure();
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const {onOpen} = useDisclosure()


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

    return (
        <Box>
            <TopBar title="Klaim Inovasi" onBack={() => navigate(-1)} 
            />
            <Container2>
                <Container>
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
                                    marginRight: "4px", // Memberi jarak ke teks
                                }}
                                onClick={onToggle}
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
                                onClick={onToggle}
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
                                <Text2> Maks 5 foto. format: png, jpg </Text2>
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
            </Container2>
            <NavbarButton>
                <Button size="m" fullWidth type="submit" onClick={onOpen}>
                    Ajukan Klaim
                </Button>
            </NavbarButton>
        </Box >
    );
};
export default KlaimInovasi;
