import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

interface TableUIProps {
    labels: string[];
    values1: (number | null)[];
    values2: (number | null)[];
    header1: string;
    header2: string;
}

export default function TableUI({ labels, values1, values2, header1, header2 }: TableUIProps) {
    const columns: GridColDef[] = [
        { field: 'label', headerName: 'Hora', width: 160 },
        { field: 'value1', headerName: header1, width: 160 },
        { field: 'value2', headerName: header2, width: 160 },
    ];
    const rows = labels.map((label, index) => ({ id: index, label, value1: values1[index], value2: values2[index] }));
    return (
        <Box sx={{ height: 350, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} aria-label="Pronóstico por hora"
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                pageSizeOptions={[5]} disableRowSelectionOnClick />
        </Box>
    );
}
