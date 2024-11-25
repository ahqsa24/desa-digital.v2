import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Flex,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Button,
    Checkbox,
    VStack,
    Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import CardNotification from 'Components/card/notification/CardNotification';
import TopBar from 'Components/topBar';
import Container from 'Components/container';
import SearchBarInnov from '../../components/hero/SearchBarInnov';

const PengajuanInovasi: React.FC = () => {
    const navigate = useNavigate();
    const { category } = useParams();

    return (
        <Container page>
            {/* Top Bar */}
            <TopBar title="Pengajuan Inovasi" onBack={() => navigate(-1)} />

            {/* Search Bar dan Filter */}
            <Flex
                padding="16px"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
                mt="12px"
                mb="-20px"
            >
                {/* Search Bar */}
                <SearchBarInnov placeholder="Cari pengajuan di sini" />

                {/* Tombol Filter dengan Popover */}
                <Popover>
                    <PopoverTrigger>
                        <Button
                            variant="outline"
                            borderColor="gray.300"
                            borderRadius="8px"
                            padding="8px 16px"
                            width="80px"
                            height="35px"
                            fontWeight="200"
                            fontSize="12px"
                            color="gray.600"
                            rightIcon={<ChevronDownIcon color="green.600" />}
                        >
                            Filter
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        maxWidth="300px" // Membatasi lebar maksimal Popover
                        width="90%"      // Popover akan responsif, 90% dari lebar layar
                        minWidth="200px" // Menentukan lebar minimal Popover
                        borderRadius="8px"
                        boxShadow="lg"
                    >
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader fontSize="12px" fontFamily="Inter" fontStyle="normal">
                            Filter Pilihan </PopoverHeader>
                        <PopoverBody fontSize="12px" fontFamily="Inter" fontStyle="normal">
                            <VStack align="start" spacing={2}>
                                <Checkbox size="sm" fontSize="12px">Status: Menunggu</Checkbox>
                                <Checkbox size="sm" fontSize="12px">Status: Ditolak</Checkbox>
                                <Checkbox size="sm" fontSize="12px">Status: Terverifikasi</Checkbox>
                            </VStack>
                        </PopoverBody>
                        <PopoverFooter>
                            <Button
                                size="sm" // Ukuran tombol
                                colorScheme="teal"
                                fontSize="12px" // Ukuran font tombol
                                fontWeight="500" // Ketebalan font
                                padding="6px 12px" // Padding tombol
                                onClick={() => console.log('Apply Filter')}
                            >
                                Terapkan
                            </Button>
                        </PopoverFooter>
                    </PopoverContent>
                </Popover>
            </Flex>

            {/* Daftar Notifikasi */}
            <CardNotification/>
        </Container>
    );
};

export default PengajuanInovasi;