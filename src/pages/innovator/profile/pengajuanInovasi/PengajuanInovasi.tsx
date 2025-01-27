import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    VStack
} from '@chakra-ui/react';
import TopBar from 'Components/topBar';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardPengajuanInovasi from '../../components/hero/CardPengajuanInovasi';
import SearchBarInnov from '../../components/hero/SearchBarInnov';

const PengajuanInovasi: React.FC = () => {
    const navigate = useNavigate();
    const { category } = useParams();

    return (
        <Box>
            {/* Top Bar */}
            <TopBar title="Pengajuan Inovasi" onBack={() => navigate(-1)} />

            {/* Search Bar dan Filter */}
            <Flex
                padding="16px"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
                mt="52px"
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
                            rightIcon={<ChevronDownIcon color="green.600" boxSize={4} />}
                        >
                            Filter
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        sx={{
                            display: "flex",
                            width: "100%",
                            right: "40px",
                            borderRadius: "8px",
                            boxShadow: "lg",
                        }}

                    >
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader width="150px" fontSize="14px" fontFamily="Inter" fontStyle="normal">
                            Filter Pilihan </PopoverHeader>
                        <PopoverBody fontFamily="Inter" fontStyle="normal">
                            <VStack align="start" spacing={1}>
                                <Checkbox size="sm" sx={{ "& span": { fontSize: "13px" } }}>Menunggu</Checkbox>
                                <Checkbox size="sm" sx={{ "& span": { fontSize: "13px" } }}>Ditolak</Checkbox>
                                <Checkbox size="sm" sx={{ "& span": { fontSize: "13px" } }}>Terverifikasi</Checkbox>
                            </VStack>
                        </PopoverBody>
                        <PopoverFooter display={'flex'} justifyContent={'end'}>
                            <Button
                                size="s" // Ukuran tombol
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
            <CardPengajuanInovasi />

        </Box>
    );
};

export default PengajuanInovasi;