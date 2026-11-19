import { Box, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';

interface TableUIProps {
    labels: string[];
    values1: (number | null)[];
    values2: (number | null)[];
    header1: string;
    header2: string;
}

export default function TableUI({ labels, values1, values2, header1, header2 }: TableUIProps) {
    const columns: GridColDef[] = [
        { field: 'label', headerName: 'Hora', flex: 0.7, minWidth: 85 },
        { field: 'value1', headerName: header1, type: 'number', flex: 1, minWidth: 160 },
        { field: 'value2', headerName: header2, type: 'number', flex: 1, minWidth: 130 },
    ];
    const rows = labels.map((label, index) => ({ id: index, label, value1: values1[index], value2: values2[index] }));
    return <>
        <Typography variant="h6" component="h2" sx={{ px: 2, py: 2 }}>Detalle por hora</Typography>
        <Box sx={{ height: 350, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} aria-label="Pronóstico por hora"
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                pageSizeOptions={[5]} disableRowSelectionOnClick sx={{ border: 0 }} />
        </Box>
    </>;
}
