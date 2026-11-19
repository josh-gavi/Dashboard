import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FGuayaquil';

export default function useFetchData() {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        async function obtenerDatos() {
            try {
                const respuesta = await fetch(API_URL, { signal: controller.signal });
                if (!respuesta.ok) throw new Error(`Error ${respuesta.status} al consultar Open-Meteo`);
                const json: OpenMeteoResponse = await respuesta.json();
                if (!controller.signal.aborted) setData(json);
            } catch (error) {
                if (!controller.signal.aborted) console.error(error);
            }
        }
        void obtenerDatos();
        return () => controller.abort();
    }, []);

    return data;
}
