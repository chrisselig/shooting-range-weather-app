"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { refreshWeather } from "@/app/actions";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await refreshWeather();
          router.refresh();
        })
      }
      className="text-xs text-accent disabled:opacity-50"
    >
      {isPending ? "Refreshing…" : "Refresh"}
    </button>
  );
}
