import { border } from '@chakra-ui/react';
import { marginStyle } from 'Consts/sizing';
import React, { useState } from 'react';
import Select from 'react-select';

//TODO: onChange disini juga perlu disesuain kayanya
  interface DropdownProps {
    placeholder?: string; // Menambahkan props placeholder
    options: Location[]; // Menambahkan props options dengan tipe array objek
    onChange?: React.ChangeEventHandler<HTMLSelectElement> 
  }
  interface Location {
    id: string;
    name: string;
  }
  
  //TODO: kayanya ini perlu diperbaiki bagian handlecategory
  const Dropdown: React.FC<DropdownProps> = ({ placeholder = "Pilih Opsi", options, onChange}) => {
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [provinces, setProvinces] = useState<Location[]>([]);
    const handleCategoryChange = (selectedOption: any) => {
      setSelectedCategory(selectedOption);
    };

    const customStyles = {
      control: (provided: any) => ({
        ...provided,
        width: '100%', // Mengubah lebar dropdown
        fontSize: '12px', // Mengubah ukuran font
        padding: '2px', // Menambah padding
        border: '1px solid #E5E7EB', // Mengubah warna border menjadi abu-abu (#ccc)
        borderRadius: '4px', // Mengubah radius border menjadi 8px (membuat sudut lebih melengkung)
        overflow: 'hidden', // Menyembunyikan teks yang lebih panjang dari lebar kontrol
        textOverflow: 'ellipsis', // Memotong teks yang terlalu panjang
        whiteSpace: 'nowrap',
      }),
      menu: (provided: any) => ({
        ...provided,
        fontSize: '12px', // Ukuran font menu
        maxHeight: '500px', // Membatasi tinggi menu
      }),
      input: (provided: any) => ({
        ...provided,
        fontSize: '12px', // Mengubah ukuran font di input field
        width: '100%',
      }),
      placeholder: (provided: any) => ({
        ...provided,
        whiteSpace: 'nowrap', // Mencegah placeholder membungkus ke baris berikutnya
        overflow: 'hidden', // Menyembunyikan placeholder jika melebihi lebar kontrol
        textOverflow: 'ellipsis', // Memotong placeholder yang terlalu panjang
      }),
    };

    return (
      <div>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange} //TODO: karena dia belum bisa ngarahin untuk buka field kabupaten. kalau di kode lu, dia harusnya {handle...Change}
          options={options.map((options)=>({
            label: options.name, // Ubah name menjadi label
            value: options.id,   // Ubah id menjadi value
            }))}
          placeholder={placeholder}
          isSearchable // Mengaktifkan fitur pencarian
          styles={customStyles}
        />
      </div>
    );
  };
  export default Dropdown;
