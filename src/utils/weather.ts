import type { OpenMeteoResponse } from '../types/DashboardTypes';

export const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
    guayaquil: { latitude: -2.1962, longitude: -79.8862 },
    quito: { latitude: -0.2299, longitude: -78.5249 },
    manta: { latitude: -0.9677, longitude: -80.7089 },
    cuenca: { latitude: -2.9005, longitude: -79.0045 },
};

export function buildWeatherUrl(city: string): string {
    if (!Object.hasOwn(CITY_COORDS, city)) throw new Error('La ciudad seleccionada no es válida.');
    const coords = CITY_COORDS[city];
    const params = new URLSearchParams({
        latitude: String(coords.latitude), longitude: String(coords.longitude),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m',
        hourly: 'temperature_2m,wind_speed_10m', timezone: 'America/Guayaquil', forecast_days: '1',
    });
    return `https://api.open-meteo.com/v1/forecast?${params}`;
}

export function parseWeatherResponse(value: unknown): OpenMeteoResponse {
    if (!value || typeof value !== 'object') throw new Error('Open-Meteo devolvió una respuesta inválida.');
    const data = value as OpenMeteoResponse;
    const variables = ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'wind_speed_10m'] as const;
    const hourlyVariables = ['temperature_2m', 'wind_speed_10m'] as const;
    if (!data.current || !data.current_units || !data.hourly || !data.hourly_units
        || typeof data.current.time !== 'string'
        || variables.some(key => !Number.isFinite(data.current[key]) || typeof data.current_units[key] !== 'string')
        || !Array.isArray(data.hourly.time) || data.hourly.time.length === 0
        || data.hourly.time.some(time => typeof time !== 'string')
        || hourlyVariables.some(key => !Array.isArray(data.hourly[key])
            || data.hourly[key].length !== data.hourly.time.length
            || data.hourly[key].some(item => item !== null && !Number.isFinite(item))
            || typeof data.hourly_units[key] !== 'string')) {
        throw new Error('Los datos recibidos de Open-Meteo están incompletos. Intenta nuevamente.');
    }
    return data;
}
