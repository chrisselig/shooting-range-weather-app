import { getStationsWeather } from "@/lib/geomet";
import { StationCard } from "@/components/StationCard";

export const revalidate = 1800;

export default async function Home() {
  const stations = await getStationsWeather();

  return (
    <main className="min-h-dvh px-4 py-8 sm:py-12">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-ink-primary">Range Weather</h1>
          <p className="text-sm text-ink-muted">
            Current conditions &amp; forecast near your shooting range stations, from
            Environment Canada via MSC GeoMet.
          </p>
        </header>

        <div className="flex flex-col gap-5">
          {stations.map((weather) => (
            <StationCard key={weather.station.name} weather={weather} />
          ))}
        </div>

        <footer className="text-xs text-ink-muted text-center pb-4">
          Data: MSC GeoMet-OGC API (api.weather.gc.ca). Station coordinates: ACIS
          (acis.alberta.ca).
        </footer>
      </div>
    </main>
  );
}
