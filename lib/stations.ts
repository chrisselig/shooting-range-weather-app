export type Station = {
  name: string;
  lat: number;
  lon: number;
  elevationM: number;
  /**
   * MSC GeoMet `citypageweather-realtime` feature id for the nearest EC
   * forecast region, found by scanning every Alberta region once (bbox
   * -120,49,-110,60) and picking the smallest haversine distance. Fixed here
   * so normal requests fetch one small item instead of the whole province.
   */
  geometRegionId: string;
};

// Alberta Agriculture ACIS station coordinates (acis.alberta.ca station details pages).
export const STATIONS: Station[] = [
  { name: "Fallentimber Creek", lat: 51.5333, lon: -115.1, elevationM: 1555, geometRegionId: "ab-53" },
  { name: "Ghost Ranger Station", lat: 51.3234, lon: -114.9597, elevationM: 1472.25, geometRegionId: "ab-42" },
  { name: "Kananaskis Boundary Auto", lat: 50.93, lon: -115.12, elevationM: 1464, geometRegionId: "ab-34" },
  { name: "Queenstown", lat: 50.7, lon: -112.9167, elevationM: 944, geometRegionId: "ab-6" },
];
