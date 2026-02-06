// API Service for fetching space data from external APIs
import type { IssPosition, SpaceWeatherData, ApodResponse, SpaceNewsResponse } from '@/types';

const NASA_API_KEY = 'DEMO_KEY'; // Replace with your NASA API key for higher rate limits

// ISS Position API
export async function fetchIssPosition(): Promise<IssPosition> {
  try {
    const response = await fetch('https://api.open-notify.org/iss-now.json');
    if (!response.ok) throw new Error(`ISS API error: ${response.status}`);
    
    const data = await response.json();
    
    return {
      ...data,
      speed_kmh: 27600,
      altitude_km: 420,
    };
  } catch (error) {
    console.error('ISS fetch error:', error);
    // Fallback data
    return {
      timestamp: Math.floor(Date.now() / 1000),
      iss_position: {
        latitude: '51.5074',
        longitude: '-0.1278',
      },
      message: 'success',
      speed_kmh: 27600,
      altitude_km: 420,
    };
  }
}

// Space Weather API (NOAA)
export async function fetchSpaceWeather(): Promise<SpaceWeatherData> {
  type KpLevel = 'quiet' | 'unsettled' | 'active' | 'storm' | 'severe';
  type FluxClass = 'A' | 'B' | 'C' | 'M' | 'X';

  const getKpLevel = (kp: number): KpLevel => {
    if (kp < 3) return 'quiet';
    if (kp < 4) return 'unsettled';
    if (kp < 5) return 'active';
    if (kp < 7) return 'storm';
    return 'severe';
  };

  const getFluxClass = (flux: number): FluxClass => {
    if (flux >= 1e-4) return 'X';
    if (flux >= 1e-5) return 'M';
    if (flux >= 1e-6) return 'C';
    if (flux >= 1e-7) return 'B';
    return 'A';
  };

  try {
    const [kpResponse, plasmaResponse, xrayResponse] = await Promise.all([
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
      fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json'),
      fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json'),
    ]);

    // Parse Kp index
    let kpData = { value: 2, timestamp: new Date().toISOString(), level: 'quiet' as KpLevel };
    if (kpResponse.ok) {
      const kpRaw = await kpResponse.json();
      if (kpRaw.length > 1) {
        const latest = kpRaw[kpRaw.length - 1];
        const kpValue = parseFloat(latest[1]) || 2;
        kpData = {
          value: kpValue,
          timestamp: latest[0],
          level: getKpLevel(kpValue),
        };
      }
    }

    // Parse solar wind plasma
    let solarWindData = { speed: 400, density: 5, timestamp: new Date().toISOString() };
    if (plasmaResponse.ok) {
      const plasmaRaw = await plasmaResponse.json();
      if (plasmaRaw.length > 1) {
        for (let i = plasmaRaw.length - 1; i > 0; i--) {
          const row = plasmaRaw[i];
          const speed = parseFloat(row[2]);
          const density = parseFloat(row[1]);
          if (!isNaN(speed) && !isNaN(density)) {
            solarWindData = {
              speed: Math.round(speed),
              density: parseFloat(density.toFixed(1)),
              timestamp: row[0],
            };
            break;
          }
        }
      }
    }

    // Parse X-ray flux
    let xrayData = { flux: 1e-7, fluxClass: 'B' as FluxClass, timestamp: new Date().toISOString() };
    if (xrayResponse.ok) {
      const xrayRaw = await xrayResponse.json();
      if (xrayRaw.length > 0) {
        const latest = xrayRaw[xrayRaw.length - 1];
        const flux = parseFloat(latest.flux) || 1e-7;
        xrayData = {
          flux,
          fluxClass: getFluxClass(flux),
          timestamp: latest.time_tag,
        };
      }
    }

    return {
      kpIndex: kpData,
      solarWind: solarWindData,
      xrayFlux: xrayData,
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return {
      kpIndex: { value: 2, timestamp: new Date().toISOString(), level: 'quiet' },
      solarWind: { speed: 400, density: 5, timestamp: new Date().toISOString() },
      xrayFlux: { flux: 1e-7, fluxClass: 'B', timestamp: new Date().toISOString() },
    };
  }
}

// NASA APOD API
export async function fetchApod(date?: string): Promise<ApodResponse> {
  // Fallback data for when API is unavailable or rate limited
  const fallbackData: ApodResponse = {
    date: date || new Date().toISOString().split('T')[0],
    title: 'The Pillars of Creation - Eagle Nebula',
    explanation: 'These towering tendrils of cosmic dust and gas sit at the heart of the Eagle Nebula (M16). These pillars are part of a small region of the Eagle Nebula, a vast star-forming region 6,500 light-years from Earth. The so-called Pillars of Creation are part of an active star-forming region within the nebula and hide newborn stars in their wispy columns of cold interstellar gas and dust.',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200',
    hdurl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2000',
    media_type: 'image',
    copyright: 'NASA/ESA/Hubble Heritage Team',
  };

  try {
    const dateParam = date ? `&date=${date}` : '';
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${dateParam}`);
    
    // Handle rate limiting gracefully
    if (response.status === 429) {
      console.warn('NASA API rate limit reached, using fallback data');
      return fallbackData;
    }
    
    if (!response.ok) {
      console.warn(`NASA API error: ${response.status}, using fallback data`);
      return fallbackData;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('APOD fetch error:', error);
    return fallbackData;
  }
}

// Space News API
export async function fetchSpaceNews(limit: number = 10): Promise<SpaceNewsResponse> {
  const FALLBACK_NEWS = [
    {
      id: 1,
      title: "NASA's James Webb Space Telescope Reveals Stunning New Views of the Universe",
      url: "https://www.nasa.gov/webb",
      image_url: "https://www.nasa.gov/wp-content/uploads/2023/09/53186797262-ec87d60bc5-o.jpg",
      news_site: "NASA",
      summary: "The James Webb Space Telescope continues to transform our understanding of the cosmos.",
      published_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "SpaceX Successfully Launches New Batch of Starlink Satellites",
      url: "https://www.spacex.com/launches",
      image_url: "https://www.spacex.com/static/images/share.jpg",
      news_site: "SpaceX",
      summary: "Another successful Falcon 9 launch adds more satellites to the Starlink constellation.",
      published_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      title: "ESA Announces New Mars Exploration Mission",
      url: "https://www.esa.int",
      image_url: "https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2022/03/exomars_rover/24041619-1-eng-GB/ExoMars_rover_pillars.jpg",
      news_site: "ESA",
      summary: "The European Space Agency reveals plans for its next generation Mars rover.",
      published_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  try {
    const response = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=${limit}`);
    if (!response.ok) throw new Error(`News API error: ${response.status}`);
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data;
    }
    
    return { count: FALLBACK_NEWS.length, results: FALLBACK_NEWS.slice(0, limit) };
  } catch (error) {
    console.error('News fetch error:', error);
    return { count: FALLBACK_NEWS.length, results: FALLBACK_NEWS.slice(0, limit) };
  }
}
