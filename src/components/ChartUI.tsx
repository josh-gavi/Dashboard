import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';

interface ChartUIProps {
    title: string;
    labels: string[];
    values1: (number | null)[];
    values2: (number | null)[];
    label1: string;
    label2: string;
}

export default function ChartUI({ title, labels, values1, values2, label1, label2 }: ChartUIProps) {
    return <>
        <Typography variant="h6" component="h2" sx={{ px: 2, pt: 2 }}>{title}</Typography>
        <LineChart height={350}
            series={[
                { data: values1, label: label1, color: '#1565c0', showMark: false },
                { data: values2, label: label2, color: '#b45309', showMark: false },
            ]}
            xAxis={[{ scaleType: 'point', data: labels, label: 'Hora local (UTC-5)' }]}
        />
    </>;
}
