import "./App.css";
import { useAvgPrice, usePriceData } from "./hooks";
import TibberPriceGraph from "./TibberPriceGraph";
import Rain from "./Rain";
import Wind from "./Wind";
import Temperature from "./Temperature";
import DateTime from "./DateTime";
import PriceNow from "./PriceNow";
import RealtimeUsage from "./RealtimeUsage";

const App = () => {
  const prices = usePriceData();
  const avgToday = useAvgPrice("today");
  const avgTomorrow = useAvgPrice("tomorrow");
  if (!prices) {
    return;
  }
  return (
    <div className="container">
      <div className="todayTitle">
        <h2>Elpris Idag</h2>
      </div>
      <div className="today">
        <TibberPriceGraph
          data={prices.today}
          withLaundrySuggestions={true}
          refX={prices.current.hour}
          refY={avgToday}
        />
      </div>
      <div className="tomorrowTitle">
        <h2>Elpris Imorgon</h2>
      </div>
      <div className="tomorrow">
        <TibberPriceGraph
          withLaundrySuggestions={true}
          data={prices.tomorrow}
          refY={avgTomorrow}
        />
      </div>
      <div className="topRightTitle">
        <h2>Temperatur & Väder</h2>
      </div>
      <div className="topRight">
        <Temperature location="outside">Utomhus</Temperature>
        <Temperature location="inside">Inomhus</Temperature>
        <Rain>Nederbörd</Rain>
        <Wind>Vind</Wind>
      </div>
      <div className="bottomRow">
        <DateTime />
        <RealtimeUsage />
        <PriceNow />
      </div>
    </div>
  );
};

export default App;
