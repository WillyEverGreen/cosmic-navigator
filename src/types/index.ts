// SpaceScope TypeScript Definitions

// === API Response Types ===

export interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  thumbnail_url?: string;
}

export interface IssPosition {
  timestamp: number;
  iss_position: {
    latitude: string;
    longitude: string;
  };
  message: string;
  speed_kmh?: number;
  altitude_km?: number;
}

export interface SpaceWeatherData {
  kpIndex: KpIndexData;
  solarWind: SolarWindData;
  xrayFlux: XrayFluxData;
}

export interface KpIndexData {
  value: number;
  timestamp: string;
  level: 'quiet' | 'unsettled' | 'active' | 'storm' | 'severe';
}

export interface SolarWindData {
  speed: number;
  density: number;
  temperature?: number;
  bz?: number;
  timestamp: string;
}

export interface XrayFluxData {
  flux: number;
  fluxClass: 'A' | 'B' | 'C' | 'M' | 'X';
  timestamp: string;
}

export interface SpaceNewsArticle {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
}

export interface SpaceNewsResponse {
  count: number;
  results: SpaceNewsArticle[];
}

// Mission Types
export type MissionStatus = 'ACTIVE' | 'COMPLETED' | 'UPCOMING';

export interface Mission {
  id: string;
  name: string;
  description: string;
  agency: string;
  status: MissionStatus;
  launchDate: string;
  planet?: string;
  imageUrl?: string;
  achievements?: string[];
}
