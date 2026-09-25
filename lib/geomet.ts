import { STATIONS, type Station } from "./stations";

// MSC GeoMet-OGC API: https://api.weather.gc.ca
// "citypageweather-realtime" gives current conditions + forecast per predefined
// Environment Canada forecast region. Each station is pre-mapped (see
// stations.ts) to its nearest region id, so we fetch that one small item
// instead of every region in the province.
const itemUrl = (id: string) =>
  `https://api.weather.gc.ca/collections/citypageweather-realtime/items/${id}?f=json`;

type Bilingual<T> = { en: T; fr: T };

type RawForecastPeriod = {
  period: { textForecastName: Bilingual<string> };
  temperatures: { textSummary: Bilingual<string> };
  abbreviatedForecast: {
    textSummary: Bilingual<string>;
    icon: { url: string };
  };
};

type RawFeature = {
  properties: {
    identifier: string;
    name: Bilingual<string>;
    region: Bilingual<string>;
    currentConditions: {
      timestamp: Bilingual<string>;
      condition?: Bilingual<string>;
      temperature: { value: Bilingual<number> };
      windChill?: { value: Bilingual<number> };
      relativeHumidity: { value: Bilingual<number> };
      wind: {
        speed: { value: Bilingual<number> };
        gust?: { value: Bilingual<number> };
        direction: { value: Bilingual<string> };
      };
      station: { value: Bilingual<string> };
    };
    forecastGroup: { forecasts: RawForecastPeriod[] };
  };
  geometry: { coordinates: [number, number] };
};

export type ForecastPeriod = {
  name: string;
  tempSummary: string;
  conditionText: string;
  iconUrl: string;
};

export type StationWeather = {
  station: Station;
  regionName: string;
  distanceKm: number;
  observedAt: string;
  obsStationName: string;
  conditionText: string;
  tempC: number;
  windChillC: number | null;
  humidityPct: number;
  windSpeedKmh: number;
  windGustKmh: number | null;
  windDirection: string;
  forecast: ForecastPeriod[];
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function fetchRegion(regionId: string): Promise<RawFeature> {
  const res = await fetch(itemUrl(regionId), { next: { revalidate: 1800 } });
  if (!res.ok) {
    throw new Error(`GeoMet request failed for ${regionId}: ${res.status}`);
  }
  return res.json();
}

function toStationWeather(station: Station, feature: RawFeature): StationWeather {
  const p = feature.properties;
  const cc = p.currentConditions;
  const [regionLon, regionLat] = feature.geometry.coordinates;
  return {
    station,
    regionName: p.name.en,
    distanceKm: haversineKm(station.lat, station.lon, regionLat, regionLon),
    observedAt: cc.timestamp.en,
    obsStationName: cc.station.value.en,
    // Some automatic stations report no text condition, only instrument
    // readings; fall back to today's forecast summary in that case.
    conditionText:
      cc.condition?.en ?? p.forecastGroup.forecasts[0]?.abbreviatedForecast.textSummary.en ?? "—",
    tempC: cc.temperature.value.en,
    windChillC: cc.windChill ? cc.windChill.value.en : null,
    humidityPct: cc.relativeHumidity.value.en,
    windSpeedKmh: cc.wind.speed.value.en,
    windGustKmh: cc.wind.gust ? cc.wind.gust.value.en : null,
    windDirection: cc.wind.direction.value.en,
    forecast: p.forecastGroup.forecasts.slice(0, 6).map((f) => ({
      name: f.period.textForecastName.en,
      tempSummary: f.temperatures.textSummary.en,
      conditionText: f.abbreviatedForecast.textSummary.en,
      iconUrl: f.abbreviatedForecast.icon.url,
    })),
  };
}

export async function getStationsWeather(): Promise<StationWeather[]> {
  return Promise.all(
    STATIONS.map(async (station) => {
      const feature = await fetchRegion(station.geometRegionId);
      return toStationWeather(station, feature);
    }),
  );
}
