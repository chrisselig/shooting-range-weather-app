import type { StationWeather } from "@/lib/geomet";
import { formatObservedTime } from "@/lib/format";

export function StationCard({ weather }: { weather: StationWeather }) {
  const {
    station,
    regionName,
    distanceKm,
    observedAt,
    obsStationName,
    conditionText,
    tempC,
    windChillC,
    humidityPct,
    windSpeedKmh,
    windGustKmh,
    windDirection,
    forecast,
  } = weather;

  // Wind chill is only meteorologically meaningful in cold conditions; the
  // feed sometimes carries a stale/near-zero value alongside a mild
  // temperature, so only surface it below a sane threshold.
  const feelsLike =
    tempC <= 10 && windChillC !== null && Math.round(windChillC) !== Math.round(tempC)
      ? windChillC
      : null;

  return (
    <div className="rounded-2xl bg-surface border border-hairline p-5 shadow-sm">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
        <h2 className="text-lg font-semibold text-ink-primary">{station.name}</h2>
        <span className="text-xs text-ink-muted">
          {distanceKm.toFixed(0)} km from {regionName}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="text-5xl font-bold tabular-nums text-ink-primary">
          {Math.round(tempC)}°
        </div>
        <div className="flex-1">
          <div className="text-ink-secondary">{conditionText}</div>
          {feelsLike !== null && (
            <div className="text-sm text-ink-muted">Feels like {Math.round(feelsLike)}°</div>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-y-1 text-sm text-ink-secondary">
        <dt className="text-ink-muted">Wind</dt>
        <dd className="tabular-nums">
          {windDirection} {windSpeedKmh} km/h
          {windGustKmh ? ` (gust ${windGustKmh})` : ""}
        </dd>
        <dt className="text-ink-muted">Humidity</dt>
        <dd className="tabular-nums">{humidityPct}%</dd>
      </dl>

      <p className="mt-2 text-xs text-ink-muted">
        Observed {formatObservedTime(observedAt)} at {obsStationName}
      </p>

      <div className="mt-4 flex gap-3 overflow-x-auto pt-1 -mx-1 px-1">
        {forecast.map((period) => (
          <div
            key={period.name}
            className="flex flex-col items-center gap-1 shrink-0 w-20 rounded-lg border border-hairline px-2 py-2 text-center"
          >
            <span className="text-xs font-medium text-ink-secondary">{period.name}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={period.iconUrl} alt={period.conditionText} width={40} height={40} />
            <span className="text-xs tabular-nums text-ink-primary">{period.tempSummary}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
