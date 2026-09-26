import { getStationsWeather } from "@/lib/geomet";
import { StationCard } from "@/components/StationCard";
import { RefreshButton } from "@/components/RefreshButton";

export const revalidate = 1800;

export default async function Home() {
  const results = await getStationsWeather();

  return (
    <main className="min-h-dvh px-4 py-8 sm:py-12">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-primary">Range Weather</h1>
            <p className="text-sm text-ink-muted">
              Current conditions &amp; forecast near your shooting range stations, from
              Environment Canada via MSC GeoMet.
            </p>
          </div>
          <RefreshButton />
        </header>

        <div className="flex flex-col gap-5">
          {results.map((result) =>
            result.status === "ok" ? (
              <StationCard key={result.data.station.name} weather={result.data} />
            ) : (
              <div
                key={result.station.name}
                className="rounded-2xl border border-status-serious/30 bg-status-serious/10 p-5"
              >
                <h2 className="text-lg font-semibold text-ink-primary">{result.station.name}</h2>
                <p className="mt-1 text-sm text-status-serious">
                  Couldn&apos;t load weather: {result.message}
                </p>
              </div>
            ),
          )}
        </div>

        <footer className="text-xs text-ink-muted text-center pb-4">
          Data: MSC GeoMet-OGC API (api.weather.gc.ca). Station coordinates: ACIS
          (acis.alberta.ca).
        </footer>
      </div>
    </main>
  );
}
