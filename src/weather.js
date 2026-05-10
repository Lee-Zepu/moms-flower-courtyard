const SHIJIAZHUANG = {
  latitude: 38.0428,
  longitude: 114.5149,
};

export async function fetchWeather() {
  const params = new URLSearchParams({
    latitude: String(SHIJIAZHUANG.latitude),
    longitude: String(SHIJIAZHUANG.longitude),
    current: "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
    daily: "precipitation_probability_max,temperature_2m_max,temperature_2m_min",
    timezone: "Asia/Shanghai",
    forecast_days: "3",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) {
    throw new Error("weather unavailable");
  }

  return response.json();
}

export function buildWeatherAdvice(weather) {
  if (!weather?.current) {
    return fallbackAdvice();
  }

  const current = weather.current;
  const daily = weather.daily ?? {};
  const temperature = Math.round(current.temperature_2m);
  const humidity = Math.round(current.relative_humidity_2m);
  const rain = Number(current.precipitation ?? 0);
  const wind = Math.round(current.wind_speed_10m ?? 0);
  const rainChance = daily.precipitation_probability_max?.[0] ?? 0;
  const maxTemp = Math.round(daily.temperature_2m_max?.[0] ?? temperature);

  const advice = [];

  if (rain > 0 || rainChance >= 55) {
    advice.push({
      title: "今天先少浇水",
      body: "有降雨或空气偏湿，盆土没干透的话，让花先透透气。",
    });
  } else if (maxTemp >= 31 && humidity < 55) {
    advice.push({
      title: "傍晚看一眼盆土",
      body: "天气偏热偏干，蓝雪花、辣椒、秋葵这类需水多的花菜要多留意。",
    });
  } else {
    advice.push({
      title: "按盆土决定浇水",
      body: "今天不用凭日子浇，先摸土：干了再浇，湿着就等等。",
    });
  }

  if (maxTemp >= 32) {
    advice.push({
      title: "中午避一避强晒",
      body: "君子兰、瑞香、一帆风顺放在散射光处更稳，三角梅和辣椒可多晒但别闷。",
    });
  }

  if (wind >= 22) {
    advice.push({
      title: "风大时稳住花盆",
      body: "阳台边的小盆先往里收一点，避免枝条折断或盆土被吹干太快。",
    });
  } else {
    advice.push({
      title: "开窗通风一会儿",
      body: "不直吹冷风的通风，能减少小飞虫和白粉问题。",
    });
  }

  return {
    status: "live",
    temperature,
    humidity,
    wind,
    rainChance,
    advice: advice.slice(0, 3),
  };
}

export function fallbackAdvice() {
  return {
    status: "fallback",
    temperature: null,
    humidity: null,
    wind: null,
    rainChance: null,
    advice: [
      {
        title: "今天按盆土来",
        body: "天气暂时没取到，先摸盆土再决定浇水，干透的再浇。",
      },
      {
        title: "先通风，再施肥",
        body: "花状态不好时先别补肥，通风、控水、观察比猛施肥更稳。",
      },
      {
        title: "夏季午后要温柔一点",
        body: "石家庄热起来后，怕晒的花放散射光处，喜晒的花也要避免闷热。",
      },
    ],
  };
}
