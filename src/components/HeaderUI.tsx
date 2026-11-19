import Typography from '@mui/material/Typography';

export default function HeaderUI() {
    return (
        <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '2.75rem' }, letterSpacing: '-0.04em' }}>
            Dashboard del Clima
        </Typography>
    );
}
