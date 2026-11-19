import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';
import { buildWeatherUrl, parseWeatherResponse } from '../utils/weather';

interface FetchResult {
    requestKey: string;
    data: OpenMeteoResponse | null;
    error: string | null;
}

export default function useFetchData(selectedOption: string | null) {
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState<FetchResult | null>(null);
    const city = selectedOption ?? 'guayaquil';
    const requestKey = `${city}:${attempt}`;

    useEffect(() => {
        const controller = new AbortController();
        let timedOut = false;
        const timeout = window.setTimeout(() => {
            timedOut = true;
            controller.abort();
        }, 15000);

        async function obtenerDatos() {
            try {
                const respuesta = await fetch(buildWeatherUrl(city), { signal: controller.signal });
                if (!respuesta.ok) throw new Error(`Error ${respuesta.status} al consultar Open-Meteo.`);
                const data = parseWeatherResponse(await respuesta.json());
                if (!controller.signal.aborted) setResult({ requestKey, data, error: null });
            } catch (error) {
                if (!controller.signal.aborted || timedOut) {
                    const message = timedOut ? 'La consulta tardó demasiado. Intenta nuevamente.'
                        : error instanceof TypeError ? 'No se pudo conectar con Open-Meteo. Revisa tu conexión.'
                        : error instanceof Error ? error.message : 'No se pudo consultar el clima.';
                    setResult({ requestKey, data: null, error: message });
                }
            } finally {
                window.clearTimeout(timeout);
            }
        }

        void obtenerDatos();
        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [city, requestKey]);

    // Hide the previous city's data immediately, including the render before the effect.
    const loading = result?.requestKey !== requestKey;
    return {
        data: loading ? null : result!.data,
        loading,
        error: loading ? null : result!.error,
        retry: () => setAttempt(value => value + 1),
    };
}
