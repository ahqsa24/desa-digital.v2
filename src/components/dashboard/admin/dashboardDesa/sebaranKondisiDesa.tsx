import {
    Box,
    Flex,
    Text,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    useDisclosure,
    ModalOverlay,
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Select,
    ModalFooter
  } from "@chakra-ui/react";
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import React, { useEffect, useState } from "react";
  import { Filter } from "lucide-react";
  import { DownloadIcon } from "@chakra-ui/icons";
  import * as XLSX from "xlsx";
  
  const SebaranKondisiDesa: React.FC = () => {
    interface DesaData {
      no: number;
      desa: string;
      status: string;
      jalan: string;
      provinsi: string;
      kabupaten: string;
      kecamatan: string;
    }
  
    const ITEMS_PER_PAGE = 5;
    const [desaData, setDesaData] = useState<DesaData[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [filteredDesaData, setFilteredDesaData] = useState<DesaData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [kabupatenList, setKabupatenList] = useState<string[]>([]);
    const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedKabupaten, setSelectedKabupaten] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState("");
  
    const [filteredKabupatenList, setFilteredKabupatenList] = useState<string[]>([]);
    const [filteredKecamatanList, setFilteredKecamatanList] = useState<string[]>([]);
  
    const [currentPage, setCurrentPage] = useState(1);
  
    useEffect(() => {
      fetchDesaData();
    }, []);
  
    const fetchDesaData = async () => {
      try {
        const db = getFirestore();
        const villagesRef = collection(db, "villages");
        const snapshot = await getDocs(villagesRef);
  
        let i = 1;
        const desaList: DesaData[] = [];
        const provinceSet = new Set<string>();
        const kabupatenSet = new Set<string>();
        const kecamatanSet = new Set<string>();
  
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
  
          const namaDesa = data.namaDesa?.trim() || "";
          const status = data.kesiapanDigital?.trim() || "";
          const jalan = data.infrastrukturDesa?.trim() || "";
          const provinsi = data.lokasi?.provinsi?.label?.trim() || "";
          const kabupaten = data.lokasi?.kabupatenKota?.label?.trim() || "";
          const kecamatan = data.lokasi?.kecamatan?.label?.trim() || "";
  
          if (
            !namaDesa || namaDesa.toLowerCase().includes("lorem ipsum") ||
            !status || status.toLowerCase().includes("lorem ipsum") ||
            !jalan || jalan.toLowerCase().includes("lorem ipsum") ||
            !provinsi || provinsi.toLowerCase().includes("lorem ipsum") ||
            !kabupaten || kabupaten.toLowerCase().includes("lorem ipsum") ||
            !kecamatan || kecamatan.toLowerCase().includes("lorem ipsum")
          ) {
            return;
          }
  
          const limitWords = (text: string) => text.split(" ").slice(0, 3).join(" ");
  
          desaList.push({
            no: i++,
            desa: limitWords(namaDesa),
            status: limitWords(status),
            jalan: limitWords(jalan),
            provinsi: limitWords(provinsi),
            kabupaten: limitWords(kabupaten),
            kecamatan: limitWords(kecamatan),
          });
  
          provinceSet.add(provinsi);
          kabupatenSet.add(kabupaten);
          kecamatanSet.add(kecamatan);
        });
  
        setDesaData(desaList);
        setFilteredDesaData(desaList);
        setProvinceList([...provinceSet]);
        setKabupatenList([...kabupatenSet]);
        setKecamatanList([...kecamatanSet]);
      } catch (error) {
        console.error("❌ Error fetching desa data:", error);
      }
    };
  
    useEffect(() => {
      if (selectedProvince) {
        const filteredKabupaten = desaData.filter(d => d.provinsi === selectedProvince).map(d => d.kabupaten);
        setFilteredKabupatenList([...new Set(filteredKabupaten)]);
        setSelectedKabupaten("");
        setFilteredKecamatanList([]);
      } else {
        setFilteredKabupatenList(kabupatenList);
      }
    }, [selectedProvince, desaData]);
  
    useEffect(() => {
      if (selectedKabupaten) {
        const filteredKecamatan = desaData.filter(d => d.kabupaten === selectedKabupaten).map(d => d.kecamatan);
        setFilteredKecamatanList([...new Set(filteredKecamatan)]);
        setSelectedKecamatan("");
      } else {
        setFilteredKecamatanList(kecamatanList);
      }
    }, [selectedKabupaten, desaData]);
  
    const useFilter = () => {
      let filtered = desaData;
  
      if (selectedProvince) {
        filtered = filtered.filter((d) => d.provinsi === selectedProvince);
      }
      if (selectedKabupaten) {
        filtered = filtered.filter((d) => d.kabupaten === selectedKabupaten);
      }
      if (selectedKecamatan) {
        filtered = filtered.filter((d) => d.kecamatan === selectedKecamatan);
      }
  
      setFilteredDesaData(filtered);
      setCurrentPage(1);
      onClose();
    };
  
    const handleDownloadExcel = () => {
      const data = filteredDesaData.map((item) => ({
        No: item.no,
        Desa: item.desa,
        "Status Desa": item.status,
        "Infrastruktur Jalan": item.jalan,
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sebaran Kondisi Desa");
      XLSX.writeFile(workbook, "sebaran_kondisi_sesa.xlsx");
    };
  
    const totalPages = Math.ceil(filteredDesaData.length / ITEMS_PER_PAGE);
    const currentData = filteredDesaData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
    return (
      <Box>
        {/* HEADER */}
        <Flex justify="space-between" align="center" mt="24px" mx="15px">
          <Text fontSize="sm" fontWeight="bold" color="gray.800">
            Sebaran Kondisi Desa
          </Text>
          <Flex gap={2}>
            <Button
              size="sm"
              bg="white"
              boxShadow="md"
              border="2px solid"
              borderColor="gray.200"
              px={2}
              py={2}
              display="flex"
              alignItems="center"
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              onClick={handleDownloadExcel}
            >
              <DownloadIcon boxSize={3} color="black" />
            </Button>
            <Button
              bg="white"
              size="sm"
              boxShadow="md"
              border="2px solid"
              borderColor="gray.200"
              px={2}
              py={2}
              display="flex"
              alignItems="center"
              _hover={{ bg: "gray.100" }}
              cursor="pointer"
              leftIcon={<Filter size={14} stroke="#1E5631" fill="#1E5631" />}
              onClick={onOpen}
            >
              <Text fontSize="11px" fontWeight="medium" color="black">
                Wilayah
              </Text>
            </Button>
          </Flex>
        </Flex>
  
        {/* MODAL */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent borderRadius="xl" p={4} width={300} overflowY="auto">
            <ModalHeader>Filter Wilayah</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Select placeholder="Pilih Provinsi" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                {provinceList.map((prov, index) => <option key={index} value={prov}>{prov}</option>)}
              </Select>
              <Select placeholder="Pilih Kabupaten" value={selectedKabupaten} onChange={(e) => setSelectedKabupaten(e.target.value)} mt={2} isDisabled={!selectedProvince}>
                {filteredKabupatenList.map((kab, index) => <option key={index} value={kab}>{kab}</option>)}
              </Select>
              <Select placeholder="Pilih Kecamatan" value={selectedKecamatan} onChange={(e) => setSelectedKecamatan(e.target.value)} mt={2} isDisabled={!selectedKabupaten}>
                {filteredKecamatanList.map((kec, index) => <option key={index} value={kec}>{kec}</option>)}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" onClick={useFilter}>Terapkan Filter</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        {/* TABLE */}
        <Box
          bg="white"
          borderRadius="xl"
          pt={0}
          pb={3}
          mx="15px"
          boxShadow="md"
          border="0px solid"
          borderColor="gray.200"
          mt={4}
        >
          <TableContainer maxWidth="100%" width="auto" borderRadius="md">
            <Table variant="simple" size="sm">
              <Thead bg="#F0FFF4">
                <Tr>
                  <Th p={3} fontSize="8px" textAlign="center">No</Th>
                  <Th p={1} fontSize="8px" textAlign="center">Desa</Th>
                  <Th p={1} fontSize="8px" textAlign="center">Status Desa</Th>
                  <Th p={1} fontSize="8px" textAlign="center">Infrastruktur Jalan</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentData.map((row) => (
                  <Tr key={row.no}>
                    <Td p={1} fontSize="8px" textAlign="center" fontWeight="bold">{row.no}</Td>
                    <Td p={1} fontSize="8px" textAlign="center">{row.desa}</Td>
                    <Td p={1} fontSize="8px" textAlign="center">{row.status}</Td>
                    <Td p={1} fontSize="8px" textAlign="center">{row.jalan}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
  
          {/* PAGINATION */}
          <Flex justify="center" mt={3} gap={2}>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                size="xs"
                borderRadius="full"
                bg={currentPage === index + 1 ? "gray.800" : "white"}
                color={currentPage === index + 1 ? "white" : "gray.800"}
                onClick={() => setCurrentPage(index + 1)}
                _hover={{ bg: "gray.300" }}
              >
                {index + 1}
              </Button>
            ))}
          </Flex>
        </Box>
      </Box>
    );
  };
  
  export default SebaranKondisiDesa;
  