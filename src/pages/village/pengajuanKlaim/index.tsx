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
    Stack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import TopBar from 'Components/topBar';
import SearchBarVil from '../components/SearchBarVil';
import CardKlaim from 'Components/card/cardklaim';

interface CardKlaimProps {
    title: string;
    description: string;
    date: number;
}

const PengajuanKlaim: React.FC = () => {
    const navigate = useNavigate();
    const { category } = useParams();

    return (
        <Box>
            {/* Top Bar */}
            <TopBar title="Pengajuan Klaim" onBack={() => navigate(-1)} />
            <Stack padding="16px" gap="16px" paddingTop="55px">

                {/* Search Bar dan Filter */}
                <Flex
                    padding="16px 0px"
                    justifyContent="flex-end"
                    alignItems="center"
                    gap={2}
                    mt="px"
                    mb="-20px"
                >
                    {/* Search Bar */}
                    <SearchBarVil placeholder="Cari pengajuan di sini" />

                    {/* Tombol Filter dengan Popover */}
                    <Popover>
                        <PopoverTrigger>
                            <Button
                                sx={{
                                    _hover: { bg: "none", borderColor: "#347357" },
                                }}
                                display={'flex'}
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
                            <PopoverHeader width="150px" fontSize="13px" fontWeight={600} fontFamily="Inter" fontStyle="normal" color="#1f2937">
                                Filter Pilihan </PopoverHeader>
                            <PopoverBody fontFamily="Inter" fontStyle="normal">
                                <VStack align="start" spacing={1}>
                                    <Checkbox size="sm" sx={{ "& span": { fontSize: "13px" } }}>Menunggu</Checkbox>
                                    <Checkbox size="sm" sx={{ "& span": { fontSize: "13px" } }}>Ditolak</Checkbox>
                                    <Checkbox size="sm" sx={{ "& span": { fontSize: "13px" } }}>Terverifikasi</Checkbox>
                                </VStack>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Flex>
                <CardKlaim
                    title={'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
                    description={'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
                    date={111}
                    klaimbadge={'menunggu'}
                />

                <CardKlaim
                    title={'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
                    description={'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
                    date={111}
                    klaimbadge={'terverifikasi'}
                />

                <CardKlaim
                    title={'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
                    description={'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}
                    date={111}
                    klaimbadge={'ditolak'}
                />
                
            </Stack>
        </Box>
    );
};

export default PengajuanKlaim;