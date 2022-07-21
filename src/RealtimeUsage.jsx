import { useTibberRealtimeApiData } from "./hooks";

const fuseSize = process.env.REACT_APP_MAIN_FUSE_SIZE;

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
  const overloadL1 = m.currentL1 > fuseSize;
  const overloadL2 = m.currentL2 > fuseSize;
  const overloadL3 = m.currentL3 > fuseSize;
  return (
    <div className="realtime">
      <div className="phase">
        <div>&nbsp;</div>
      </div>
      {outP(m.power, m.powerProduction)}
      <div className="phase">
        <div className={overloadL1 ? "red" : ""}>
          {outL(m.currentL1)} / {fuseSize} A
        </div>
        <div className={overloadL2 ? "red" : ""}>
          {outL(m.currentL2)} / {fuseSize} A
        </div>
        <div className={overloadL3 ? "red" : ""}>
          {outL(m.currentL3)} / {fuseSize} A
        </div>
      </div>
    </div>
  );
};

export default RealtimeUsage;
