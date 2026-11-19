import { useState } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

interface SelectorProps {
    onOptionSelect?: (option: string) => void;
}

export default function SelectorUI({ onOptionSelect }: SelectorProps) {
    const [cityInput, setCityInput] = useState('guayaquil');

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value;
        setCityInput(selectedValue);
        onOptionSelect?.(selectedValue);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="city-select-label">Ciudad</InputLabel>
            <Select labelId="city-select-label" id="city-select" label="Ciudad"
                value={cityInput} onChange={handleChange}>
                <MenuItem value="guayaquil">Guayaquil</MenuItem>
                <MenuItem value="quito">Quito</MenuItem>
                <MenuItem value="manta">Manta</MenuItem>
                <MenuItem value="cuenca">Cuenca</MenuItem>
            </Select>
            {cityInput && <FormHelperText>
                Información del clima en <strong style={{ textTransform: 'capitalize' }}>{cityInput}</strong>
            </FormHelperText>}
        </FormControl>
    );
}
