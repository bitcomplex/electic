import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { tibberClient } from "./tibber-api-client";
import { netatmoClient } from "./netatmo-api-client";

const tibberHomeId = process.env.REACT_APP_TIBBER_HOME_ID;
const netatmoDeviceId = encodeURIComponent(
  process.env.REACT_APP_NETATMO_DEVICE_ID
);

export const useTibberRealtimeApiData = () => {
  const [data, setData] = useState({});
  try {
    tibberClient
      .subscribe({
        query: gql`
          subscription {
            liveMeasurement(homeId: "${tibberHomeId}") {
              powerProduction
              power
              currentL1
              currentL2
              currentL3
            }
          }
        `,
      })
      .subscribe({
        next(data) {
          if (data.data.liveMeasurement) {
            setData(data.data.liveMeasurement);
          }
        },
        error(err) {
          console.log(err);
        },
      });
  } catch (error) {
    console.log(error);
  }
  return data;
};

const useTibberApiData = () => {
  const [data, setData] = useState();
  useEffect(() => {
    async function fetchPrices() {
      try {
        const tibberData = await tibberClient.query({
          query: gql`
            {
              viewer {
                homes {
                  currentSubscription {
                    priceInfo {
                      current {
                        startsAt
                      }
                      today {
                        total
                        startsAt
                      }
                      tomorrow {
                        total
                      }
                    }
                  }
                }
              }
            }
          `,
          fetchPolicy: "network-only", // No cache
        });
        setData(tibberData.data.viewer.homes[0].currentSubscription.priceInfo);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPrices();

    const interval = setInterval(() => fetchPrices(), 300000);
    return () => clearInterval(interval);
  }, []);
  return data;
};

const useNetatmoApiData = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    async function fetchStationData() {
      try {
        const netatmoDataRaw = await netatmoClient.get(
          `https://api.netatmo.com/api/getstationsdata?device_id=${netatmoDeviceId}&get_favorites=false`
        );
        const netatmoData = {};
        try {
          netatmoData.Inomhus =
            netatmoDataRaw.data.body.devices[0].dashboard_data;
          netatmoDataRaw.data.body.devices[0].modules.map((module) => {
            try {
              /* module.module_name holds *my* name of the devices. For me
							 that is "Utomhus", "Vindmätare" and "Regnmätare". Uses
							 "Inomhus" above to keep the naming consistent.
							*/
              netatmoData[module.module_name] = module.dashboard_data;
            } catch (e) {}
            return null;
          });
        } catch (e) {}
        setData(netatmoData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchStationData();

    const interval = setInterval(() => fetchStationData(), 300000);
    return () => clearInterval(interval);
  }, []);
  return data;
};

export const useNetatmoTemperatureData = () => {
  const { Utomhus, Inomhus } = useNetatmoApiData();
  return {
    outside: {
      now: Utomhus?.Temperature,
      min: Utomhus?.min_temp,
      max: Utomhus?.max_temp,
      trend: Utomhus?.temp_trend,
    },
    inside: {
      now: Inomhus?.Temperature,
      min: Inomhus?.min_temp,
      max: Inomhus?.max_temp,
      trend: Inomhus?.temp_trend,
    },
  };
};

const kmh2ms = (kmh) => Math.round(kmh * (1000 / 3600) * 10) / 10;

export const useNetatmoWindData = () => {
  const { Vindmätare } = useNetatmoApiData();
  const wind = {
    speed: null,
    direction: null,
    gustSpeed: null,
    maxSpeed: null,
  };
  if (Vindmätare) {
    wind.speed = kmh2ms(Vindmätare.WindStrength);
    wind.direction = Vindmätare.WindAngle;
    wind.gustSpeed = kmh2ms(Vindmätare.GustStrength);
    wind.maxSpeed = kmh2ms(Vindmätare.max_wind_str);
  }
  return wind;
};

export const useNetatmoRainData = () => {
  const { Regnmätare } = useNetatmoApiData();
  const rain = {
    now: null,
    lastHour: null,
    last24Hours: null,
  };
  if (Regnmätare) {
    rain.now = Regnmätare.Rain;
    rain.lastHour = Regnmätare.sum_rain_1;
    rain.last24Hours = Regnmätare.sum_rain_24;
  }
  return rain;
};

/*
 To get a graph that shows a fixed price for each hour, but still
 having a nice curve between hours (the graph in Tibbers app is curved,
 incorrectly stating that the price changes gradually between hours) we
 split the hours into quarters. Using a curve type for the graph will then
 only curve the last quarter of every hour
*/
export const usePriceData = () => {
  const priceInfo = useTibberApiData();
  if (!priceInfo) {
    return;
  }
  const priceData = {
    current: {
      hour: null,
      total: null,
    },
    today: [],
    tomorrow: [],
  };

  priceInfo.today.map((item, index) => {
    if (item.startsAt === priceInfo.current.startsAt) {
      priceData.current = {
        hour: `${index.toString().padStart(2, "0")}:00`,
        total: Math.round(item.total * 100) / 100,
      };
    }
    const uv = Math.round(item.total * 100) / 100;
    const hour = index.toString().padStart(2, "0");
    priceData.today[index * 4] = {
      name: `${hour}:00`,
      uv,
    };
    priceData.today[index * 4 + 1] = {
      name: `${hour}:15`,
      uv,
    };
    priceData.today[index * 4 + 2] = {
      name: `${hour}:30`,
      uv,
    };
    priceData.today[index * 4 + 3] = {
      name: `${hour}:45`,
      uv,
    };
    return null;
  });
  priceInfo.tomorrow.map((item, index) => {
    const uv = Math.round(item.total * 100) / 100;
    const hour = index.toString().padStart(2, "0");
    priceData.tomorrow[index * 4] = {
      name: `${hour}:00`,
      uv,
    };
    priceData.tomorrow[index * 4 + 1] = {
      name: `${hour}:15`,
      uv,
    };
    priceData.tomorrow[index * 4 + 2] = {
      name: `${hour}:30`,
      uv,
    };
    priceData.tomorrow[index * 4 + 3] = {
      name: `${hour}:45`,
      uv,
    };
    return null;
  });
  return priceData;
};

export const useAvgPrice = (day) => {
  const priceData = useTibberApiData();
  if (!priceData) {
    return;
  }
  if (!(day === "today" || day === "tomorrow")) {
    return;
  }
  return (
    Math.round(
      (priceData[day].reduce((prev, current) => prev + current.total, 0) /
        priceData[day].length) *
        100
    ) / 100
  );
};

export const useMaxPrice = () => {
  const priceData = usePriceData();
  if (!priceData) {
    return;
  }
  return Math.max(
    ...[
      ...priceData.today.map((i) => i.uv),
      ...priceData.tomorrow.map((i) => i.uv),
    ]
  );
};

/*
 Very crude and simple calculation for our laundry needs.
 - Calculated for a 60 wash followed by a dryer cycle (this
   is the most expensive cycle for us)
 - Only start a wash cycle between startHour and stopHour
 - The washing machine uses approximatly 1/4 of the energy of the dryer
 - The washing machine runs for around 2.5 hours, and the dryer for 3.5 hours
*/
export const useLaundrySuggestions = () => {
  const priceData = usePriceData();
  if (!priceData) {
    return;
  }
  const startHour = 3;
  const stopHour = 17;
  const laundryPrice = priceData.today
    .map((v, i) => {
      if (i >= startHour * 4 && i <= stopHour * 4 + 1) {
        priceData.today[i].laundry =
          priceData.today
            .slice(i, i + 10) // 10 = 2.5 hours * 4 quarters
            .reduce((cur, va) => cur + va.uv / 4, 0) +
          priceData.today
            .slice(i + 11, i + 25) // 25 - 11 = 14 = 3.5 hours * 4 quarters
            .reduce((cur, va) => cur + va.uv, 0);
      }
      return priceData.today[i].laundry;
    })
    .filter((v) => v);
  return laundryPrice;
};

export const useLaundryPriceMin = () => {
  const laundryPrice = useLaundrySuggestions();
  if (!laundryPrice) {
    return;
  }
  return Math.min(...laundryPrice);
};
