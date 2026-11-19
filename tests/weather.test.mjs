import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildWeatherUrl, CITY_COORDS, parseWeatherResponse } from '../src/utils/weather.ts';

function response() {
    return {
        current: { time: '2026-11-18T12:00', temperature_2m: 28, apparent_temperature: 30, relative_humidity_2m: 70, wind_speed_10m: 12 },
        current_units: { temperature_2m: '°C', apparent_temperature: '°C', relative_humidity_2m: '%', wind_speed_10m: 'km/h' },
        hourly: { time: ['2026-11-18T00:00', '2026-11-18T01:00'], temperature_2m: [25, 24], wind_speed_10m: [10, 11] },
        hourly_units: { temperature_2m: '°C', wind_speed_10m: 'km/h' },
    };
}

test('cada ciudad consulta sus coordenadas, variables y zona horaria', () => {
    for (const [city, coords] of Object.entries(CITY_COORDS)) {
        const url = new URL(buildWeatherUrl(city));
        assert.equal(url.hostname, 'api.open-meteo.com');
        assert.equal(Number(url.searchParams.get('latitude')), coords.latitude);
        assert.equal(Number(url.searchParams.get('longitude')), coords.longitude);
        assert.equal(url.searchParams.get('timezone'), 'America/Guayaquil');
        assert.equal(url.searchParams.get('forecast_days'), '1');
        assert.equal(url.searchParams.get('current').split(',').length, 4);
        assert.equal(url.searchParams.get('hourly'), 'temperature_2m,wind_speed_10m');
    }
});

test('rechaza ciudades desconocidas e identificadores heredados', () => {
    for (const city of ['bogota', '', '__proto__', 'constructor']) assert.throws(() => buildWeatherUrl(city), /ciudad/);
});

test('conserva valores cero y huecos nulos del pronóstico sin inventar mediciones', () => {
    const data = response();
    data.current.temperature_2m = 0;
    data.hourly.temperature_2m = [0, null];
    assert.equal(parseWeatherResponse(data), data);
});

test('rechaza respuestas de error o incompletas antes de renderizar', () => {
    for (const value of [null, {}, { error: true, reason: 'latitude invalid' }]) assert.throws(() => parseWeatherResponse(value));
    const data = response();
    delete data.current_units;
    assert.throws(() => parseWeatherResponse(data), /incompletos/);
});

test('rechaza series desalineadas y valores no numéricos', () => {
    const short = response();
    short.hourly.wind_speed_10m.pop();
    assert.throws(() => parseWeatherResponse(short), /incompletos/);
    const invalid = response();
    invalid.hourly.temperature_2m[0] = 'calor';
    assert.throws(() => parseWeatherResponse(invalid), /incompletos/);
});
