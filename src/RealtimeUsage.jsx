import { useTibberRealtimeApiData } from "./hooks";

const outL = (v) => {
  const str = v.toString();
  if (str.indexOf(".") === -1) {
    return `${str},0`;
  }
  return str.split(".").join(",");
};

const outP = (power, powerProduction) => {
  if (power > 0) {
    return <div className="power red">{power.toLocaleString("sv-SE")} w</div>;
  } else {
    return (
      <div className="power green">
        {(-1 * powerProduction).toLocaleString("sv-SE")} w
      </div>
    );
  }
};

const RealtimeUsage = () => {
  const m = useTibberRealtimeApiData();
  if (m.power === undefined) {
    return;
  }
  return (
    <div className="realtime">
      <div className="phase">
        <div>&nbsp;</div>
      </div>
      {outP(m.power, m.powerProduction)}
      <div className="phase">
        <div>{outL(m.currentL1)} / 25 A</div>
        <div>{outL(m.currentL2)} / 25 A</div>
        <div>{outL(m.currentL3)} / 25 A</div>
      </div>
    </div>
  );
};

export default RealtimeUsage;
