import { Card, CardContent, Typography } from '@mui/material';

interface IndicatorUIProps {
    title?: string;
    description?: string;
}

export default function IndicatorUI({ title, description }: IndicatorUIProps) {
    return (
        <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
                <Typography color="text.secondary" gutterBottom>{title}</Typography>
                <Typography variant="h5" component="p" fontWeight={700}>{description}</Typography>
            </CardContent>
        </Card>
    );
}
