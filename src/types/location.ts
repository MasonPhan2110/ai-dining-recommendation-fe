export type LocationSource = "gps" | "manual";

export type AppLocation = {
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  /** Pre-formatted display string, e.g. "Hoan Kiem · Hanoi" */
  label?: string;
  source: LocationSource;
};

export type PermissionStatus = "granted" | "denied" | "undetermined";
