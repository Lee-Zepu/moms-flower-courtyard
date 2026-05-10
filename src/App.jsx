import { useEffect, useMemo, useRef, useState } from "react";
import {
  CloudSun,
  Flower2,
  Home,
  Leaf,
  Menu,
  Stethoscope,
  SunMedium,
  Wind,
} from "lucide-react";
import { plants, featuredPlantIds } from "./data/plants";
import { symptoms } from "./data/symptoms";
import { buildWeatherAdvice, fallbackAdvice, fetchWeather } from "./weather";
import courtyardGarden from "./assets/courtyard-garden.png";

const navItems = [
  { id: "today", label: "今日照护", icon: CloudSun },
  { id: "plants", label: "我的花", icon: Flower2 },
  { id: "clinic", label: "急救箱", icon: Stethoscope },
];

function App() {
  const [activePlant, setActivePlant] = useState(plants[0]);
  const [activeSymptom, setActiveSymptom] = useState(symptoms[0]);
  const [weatherAdvice, setWeatherAdvice] = useState(() => fallbackAdvice());
  const plantDetailRef = useRef(null);

  useEffect(() => {
    let alive = true;

    fetchWeather()
      .then((weather) => {
        if (alive) setWeatherAdvice(buildWeatherAdvice(weather));
      })
      .catch(() => {
        if (alive) setWeatherAdvice(fallbackAdvice());
      });

    return () => {
      alive = false;
    };
  }, []);

  const featuredPlants = useMemo(
    () => featuredPlantIds.map((id) => plants.find((plant) => plant.id === id)).filter(Boolean),
    [],
  );

  const revealPlantDetail = () => {
    window.requestAnimationFrame(() => {
      plantDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectPlant = (plant, options = {}) => {
    setActivePlant(plant);

    if (options.revealDetail) {
      revealPlantDetail();
    }
  };

  const selectPlantFromList = (plant) => {
    const isCompactLayout = window.matchMedia("(max-width: 900px)").matches;
    selectPlant(plant, { revealDetail: isCompactLayout });
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="回到首页">
          <span className="brand-mark">
            <Home size={19} />
          </span>
          <span>
            <strong>妈妈的花花小院</strong>
            <small>石家庄 · 家里的花</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="主要导航">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.id} href={`#${item.id}`}>
                <Icon size={17} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <a className="menu-button" href="#plants" aria-label="查看我的花">
          <Menu size={20} />
        </a>
      </header>

      <main id="top">
        <section className="hero-section">
          <img src={courtyardGarden} alt="清晨东方庭院里的盆栽花草" className="hero-image" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow">给最会把日子养开花的妈妈</p>
            <h1>今天的小院，也有人轻轻惦记着。</h1>
            <p className="hero-copy">
              这里记着妈妈养的花、石家庄的天气，还有那些不用费力搜索也能看懂的小提醒。
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#today">
                <CloudSun size={19} />
                看今日照护
              </a>
              <a className="secondary-action" href="#clinic">
                <Stethoscope size={19} />
                花病急救
              </a>
            </div>
          </div>
        </section>

        <section className="section care-section" id="today">
          <div className="section-heading">
            <p className="eyebrow">今日照护</p>
            <h2>先看天气，再照顾花。</h2>
          </div>

          <div className="care-grid">
            <article className="weather-panel">
              <div>
                <span className="panel-kicker">石家庄天气参考</span>
                <h3>
                  {weatherAdvice.status === "live"
                    ? `${weatherAdvice.temperature}°C · 湿度 ${weatherAdvice.humidity}%`
                    : "天气暂时没取到"}
                </h3>
              </div>
              <div className="weather-metrics">
                <Metric icon={SunMedium} label="降雨概率" value={formatMetric(weatherAdvice.rainChance, "%")} />
                <Metric icon={Wind} label="风速" value={formatMetric(weatherAdvice.wind, " km/h")} />
              </div>
              <p className="soft-note">
                天气只是参考，真正浇水前还是摸一摸盆土。花不舒服时，先停肥、通风、观察。
              </p>
            </article>

            <div className="advice-list">
              {weatherAdvice.advice.map((item) => (
                <article className="advice-card" key={item.title}>
                  <Leaf size={20} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="featured-strip">
            {featuredPlants.map((plant) => (
              <button
                className="featured-plant"
                key={plant.id}
                type="button"
                onClick={() => {
                  selectPlant(plant, { revealDetail: true });
                }}
              >
                <img src={plant.image} alt={plant.name} />
                <strong>{plant.name}</strong>
                <small>{plant.water}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="section plants-section" id="plants">
          <div className="section-heading">
            <p className="eyebrow">我的花</p>
            <h2>每一盆都有自己的小脾气。</h2>
          </div>

          <div className="plant-layout">
            <div className="plant-list" aria-label="植物列表">
              {plants.map((plant) => (
                <button
                  className={`plant-card ${activePlant.id === plant.id ? "is-active" : ""}`}
                  key={plant.id}
                  type="button"
                  aria-pressed={activePlant.id === plant.id}
                  onClick={() => selectPlantFromList(plant)}
                >
                  <span className="plant-art" style={{ background: plant.imageTone }}>
                    <img src={plant.image} alt={plant.name} />
                  </span>
                  <span>
                    <strong>{plant.name}</strong>
                    <small>{plant.latin}</small>
                  </span>
                </button>
              ))}
            </div>

            <article className="plant-detail" ref={plantDetailRef}>
              <div className="detail-hero" style={{ background: activePlant.imageTone }}>
                <img src={activePlant.image} alt={activePlant.name} />
              </div>
              <div className="detail-content">
                <span className="panel-kicker">花花档案</span>
                <h3>{activePlant.name}</h3>
                <div className="plant-facts">
                  <Fact label="光照" value={activePlant.light} />
                  <Fact label="浇水" value={activePlant.water} />
                  <Fact label="怕什么" value={activePlant.fear} />
                </div>
                <div className="detail-block">
                  <h4>石家庄当季提醒</h4>
                  <p>{activePlant.seasonal}</p>
                </div>
                <div className="detail-block">
                  <h4>常见问题</h4>
                  <p>{activePlant.common}</p>
                </div>
                <div className="detail-block rescue">
                  <h4>先做这一步</h4>
                  <p>{activePlant.rescue}</p>
                </div>
                <div className="care-tags">
                  {activePlant.care.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="section clinic-section" id="clinic">
          <div className="section-heading">
            <p className="eyebrow">花病急救箱</p>
            <h2>看到症状，先做三件稳妥的小事。</h2>
          </div>

          <div className="clinic-layout">
            <div className="symptom-grid">
              {symptoms.map((symptom) => (
                <button
                  className={`symptom-button ${activeSymptom.id === symptom.id ? "is-active" : ""}`}
                  key={symptom.id}
                  type="button"
                  onClick={() => setActiveSymptom(symptom)}
                >
                  <span>{symptom.label}</span>
                  <small>{symptom.hint}</small>
                </button>
              ))}
            </div>

            <article className="diagnosis-card">
              <span className="panel-kicker">当前症状</span>
              <h3>{activeSymptom.label}</h3>
              <ol>
                {activeSymptom.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="soft-note">
                用药和施肥都先从少量开始。花的状态不明朗时，停肥、通风、减少打扰，通常更安全。
              </p>
            </article>
          </div>
        </section>

      </main>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatMetric(value, suffix) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "参考中";
  }

  return `${value}${suffix}`;
}

export default App;
