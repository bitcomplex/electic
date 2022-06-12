import { useAvgPrice, usePriceData } from "./hooks";

const out = (v) => v.toString().split(".").join(",");

const PriceNow = () => {
  const price = usePriceData();
  const avg = useAvgPrice("today");
  if (!(price && avg)) {
    return;
  }

  const color = price.current.total < 1.5 ? "green" : "#444";

  return (
    <div className="priceNow">
      <span className="now" style={{ color }}>
        JUST NU: {out(price.current.total)}kr/kWh
      </span>
      <span className="avg">SNITTPRIS IDAG: {out(avg)}kr/kWh</span>
    </div>
  );
};
export default PriceNow;
