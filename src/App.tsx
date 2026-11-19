import { useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Container, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import { lazy, Suspense } from 'react';
import useFetchData from './hooks/useFetchData';
import './App.css';

const ChartUI = lazy(() => import('./components/ChartUI'));
const TableUI = lazy(() => import('./components/TableUI'));

export default function App() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const { data, loading, error, retry } = useFetchData(selectedOption);
    const city = selectedOption ?? 'guayaquil';
    const labels = data?.hourly.time.map(time => time.slice(11)) ?? [];

    return (
        <Container maxWidth="xl" component="main" sx={{ py: { xs: 3, md: 5 } }}>
            <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
                <Grid size={12}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 2, alignItems: { sm: 'center' } }}>
                        <Box><Typography variant="overline" color="primary">ECUADOR · OBSERVATORIO DEL CLIMA</Typography><HeaderUI /></Box>
                        <Chip label="Open-Meteo · UTC-5" variant="outlined" color="primary" />
                    </Stack>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>El clima de tu ciudad, en un solo lugar.</Typography>
                </Grid>
                <Grid size={12}>
                    <AlertUI severity="info" description="Pronóstico de hoy: selecciona una ciudad para consultar sus condiciones y su evolución por hora." />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper variant="outlined" sx={{ p: 3, height: '100%', boxSizing: 'border-box' }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Tu ubicación</Typography>
                        <SelectorUI onOptionSelect={setSelectedOption} />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 9 }} container spacing={2} aria-busy={loading}>
                    {loading && <Grid size={12}><Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }} role="status">
                        <CircularProgress aria-label="Cargando clima" size={32} />
                        <Typography sx={{ mt: 1 }}>Consultando el clima de <span className="city-name">{city}</span>…</Typography>
                    </Paper></Grid>}
                    {error && <Grid size={12}><Alert severity="error" action={<Button color="inherit" onClick={retry}>Reintentar</Button>}>{error}</Alert></Grid>}
                    {data && <>
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><IndicatorUI title="Temperatura (2m)" description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`} /></Grid>
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><IndicatorUI title="Temperatura aparente" description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`} /></Grid>
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><IndicatorUI title="Velocidad del viento" description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`} /></Grid>
                        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><IndicatorUI title="Humedad relativa" description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`} /></Grid>
                    </>}
                </Grid>
                {data && <>
                    <Grid size={12}><Typography variant="h6" component="h2" className="city-name">Pronóstico de {city}</Typography>
                        <Typography color="text.secondary">{data.current.time.slice(0, 10)} · Condiciones a las {data.current.time.slice(11)} · Hora de Ecuador continental</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}>
                        <Paper variant="outlined" sx={{ height: '100%', overflow: 'hidden' }}>
                            <Suspense fallback={<Typography sx={{ p: 3 }}>Cargando gráfico…</Typography>}><ChartUI title="Temperatura y viento por hora" labels={labels}
                                values1={data.hourly.temperature_2m} values2={data.hourly.wind_speed_10m}
                                label1={`Temperatura (${data.hourly_units.temperature_2m})`} label2={`Viento (${data.hourly_units.wind_speed_10m})`} /></Suspense>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}>
                        <Paper variant="outlined" sx={{ height: '100%', overflow: 'hidden' }}>
                            <Suspense fallback={<Typography sx={{ p: 3 }}>Cargando tabla…</Typography>}><TableUI labels={labels} values1={data.hourly.temperature_2m} values2={data.hourly.wind_speed_10m}
                                header1={`Temperatura (${data.hourly_units.temperature_2m})`} header2={`Viento (${data.hourly_units.wind_speed_10m})`} /></Suspense>
                        </Paper>
                    </Grid>
                    <Grid size={12} sx={{ display: { xs: 'block', md: 'none' } }}><Typography color="text.secondary">El gráfico y la tabla por hora están disponibles en pantallas de escritorio.</Typography></Grid>
                </>}
                <Grid size={12} component="footer">
                    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 1, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography color="text.secondary">Joshua Mero · Desarrollo de Aplicaciones Web y Móviles</Typography>
                        <Stack direction="row" sx={{ gap: 2 }}>
                            <Link href="https://open-meteo.com/">Datos: Open-Meteo</Link>
                            <Link href="https://github.com/josh-gavi/Dashboard">Repositorio</Link>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}
