// --- Cluster Telemetry ---
import { logger } from '../monitoring/logger';
export interface ClusterTelemetryEvent {
  path: string;
  clusterType: ClusterType;
  inventory: number;
  depth: number;
  priorityScore: number;
  shouldIndex: boolean;
  canonical: string;
  includedInSitemap: boolean;
  timestamp: number;
}

function emitTelemetry(event: ClusterTelemetryEvent) {
  if (typeof process === "undefined") return;
  if (process.env.NODE_ENV !== "production") return;
  if (!process.env.ENABLE_CLUSTER_TELEMETRY) return;
  queueMicrotask(() => {
    try {
      logger.info('Canonical engine', {
        type: "cluster_evaluation",
        ...event,
      });
    } catch {
      // never break rendering
    }
  });
}

import type { ParsedFilters } from "./parseFilters";

export type ClusterType =
  | "brand_city"
  | "brand"
  | "city"
  | "brand_model"
  | "budget"
  | "fuel"
  | "transmission"
  | "deep";

const priorityMap: Record<ClusterType, number> = {
  brand_city: 5,
  brand: 4,
  city: 4,
  brand_model: 3,
  budget: 3,
  fuel: 2,
  transmission: 2,
  deep: 1,
};

function shouldIndex({
  inventory,
  depth,
  priorityScore,
}: {
  inventory: number;
  depth: number;
  priorityScore: number;
}) {
  if (inventory < 3) return false;
  if (depth > 3) return false;
  if (priorityScore < 3) return false;
  return true;
}

function shouldCompress({
  depth,
  inventory,
}: {
  depth: number;
  inventory: number;
}) {
  if (depth === 3 && inventory < 15) return true;
  if (depth > 3) return true;
  return false;
}

// Compose canonical path from strongest parent (for compression)
export function getCanonicalPath(filters: ParsedFilters) {
  const segments: string[] = [];
  if (filters.brand) segments.push(filters.brand.toLowerCase());
  if (filters.model) segments.push(filters.model.toLowerCase());
  if (filters.city) {
    segments.push("city");
    segments.push(filters.city.toLowerCase());
  }
  if (filters.maxPrice) {
    segments.push("budget");
    segments.push(`under-${filters.maxPrice / 100000}-lakh`);
  }
  if (filters.fuel) segments.push(filters.fuel.toLowerCase());
  if (filters.transmission) segments.push(filters.transmission.toLowerCase());
  return "/cars/" + segments.join("/");
}

// Derive cluster type from parsed filters (deterministic)
export function getClusterType(filters: ParsedFilters): ClusterType {
  if (filters.brand && filters.city) return "brand_city";
  if (filters.brand && filters.model) return "brand_model";
  if (filters.brand) return "brand";
  if (filters.city) return "city";
  if (filters.maxPrice) return "budget";
  if (filters.fuel) return "fuel";
  if (filters.transmission) return "transmission";
  return "deep";
}

// Find strongest parent path for compression/canonicalization
export function getStrongestParentPath(filters: ParsedFilters) {
  // Remove the weakest filter (lowest priority)
  const keys = ["transmission", "fuel", "budget", "maxPrice", "model", "city", "brand"];
  const parent: ParsedFilters = { ...filters };
  for (const key of keys) {
    if (parent[key as keyof ParsedFilters]) {
      delete parent[key as keyof ParsedFilters];
      break;
    }
  }
  return getCanonicalPath(parent);
}

export function evaluateCluster({
  inventory,
  depth,
  clusterType,
  strongestParentPath,
  currentPath,
}: {
  inventory: number;
  depth: number;
  clusterType: ClusterType;
  strongestParentPath: string;
  currentPath: string;
}) {
  const priorityScore = priorityMap[clusterType];
  const index = shouldIndex({ inventory, depth, priorityScore });
  const compress = shouldCompress({ depth, inventory });
  const canonical = compress || !index ? strongestParentPath : currentPath;
  const includeInSitemap = index;
  const result = {
    priorityScore,
    shouldIndex: index,
    canonical,
    includeInSitemap,
  };
  emitTelemetry({
    path: currentPath,
    clusterType,
    inventory,
    depth,
    priorityScore,
    shouldIndex: index,
    canonical,
    includedInSitemap: includeInSitemap,
    timestamp: Date.now(),
  });
  return result;
}
