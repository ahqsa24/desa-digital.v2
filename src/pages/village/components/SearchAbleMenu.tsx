import React, { useState } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Input} from '@chakra-ui/react';
import { ChevronDownIcon} from '@chakra-ui/icons';

interface SearchableMenuProps {
  items: string[]; // Daftar item yang bisa dicari
  placeholder: string; // Placeholder untuk input pencarian
  onSelect: (item: string) => void; // Callback ketika item dipilih
}

const SearchableMenu: React.FC<SearchableMenuProps> = ({ items, placeholder, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredItems(items.filter(item => item.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="200px">
        Pilih Item
      </MenuButton>
      <MenuList minWidth="240px">
        {/* Search Input */}
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearch}
          mb={2}
        />
        {/* Filtered Menu Items */}
        {filteredItems.map((item) => (
          <MenuItem key={item} onClick={() => onSelect(item)}>
            {item}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SearchableMenu;