import {
  ComposedChart,
  Bar,
  Cell,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useMaxPrice } from "./hooks";

const TibberPriceGraph = ({
  data,
  withLaundrySuggestions = false,
  refX = null,
  refY = null,
}) => {
  const max = useMaxPrice();

  const laundrySuggestions = (priceData) => {
    const laundryPrice = priceData
      .map((v, i) => {
        if (i >= 12 && i <= 17 * 4 + 1) {
          priceData[i].laundry =
            priceData.slice(i, i + 10).reduce((cur, va) => cur + va.uv / 4, 0) +
            priceData.slice(i + 11, i + 25).reduce((cur, va) => cur + va.uv, 0);
        }
        return priceData[i].laundry;
      })
      .filter((v) => v);
    return [priceData, Math.round(Math.min(...laundryPrice))];
  };

  let laundryPriceMin = null;
  if (withLaundrySuggestions) {
    [data, laundryPriceMin] = laundrySuggestions(data);
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart width={1400} height={400} data={data}>
        <XAxis
          dataKey="name"
          ticks={[
            "00:00",
            "03:00",
            "06:00",
            "09:00",
            "12:00",
            "15:00",
            "18:00",
            "21:00",
          ]}
          padding={{ left: 15, right: 15 }}
        />
        <YAxis
          yAxisId="left"
          domain={[0, max]}
          unit={"kr/kWh"}
          ticks={[...Array.from({ length: Math.ceil(max) + 1 }, (_, i) => i)]}
        />
        <YAxis yAxisId="right" tick={false} axisLine={false} />
        {withLaundrySuggestions ? (
          <>
            <Bar
              yAxisId={"right"}
              dataKey="laundry"
              strokeWidth={2}
              stroke={"#DDD"}
              fill={"#DDD"}
              isAnimationActive={false}
              barSize={100}
            >
              {data.map((entry, index) => {
                if (Math.round(entry.laundry) === laundryPriceMin) {
                  return (
                    <Cell key={`cell-${index}`} fill={"#7E7"} stroke={"#7E7"} />
                  );
                }
                return (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={0}
                    strokeOpacity={0}
                  />
                );
              })}
            </Bar>
            <Line
              yAxisId={"right"}
              type="linear"
              dataKey="laundry"
              dot={false}
              strokeWidth={4}
              stroke={"#E7E7E7"}
              isAnimationActive={false}
            />
          </>
        ) : null}
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0.4} stopColor="red" stopOpacity={1} />
            <stop offset={0.45} stopColor="#BBBB00" stopOpacity={1} />
            <stop offset={0.5} stopColor="#BBBB00" stopOpacity={1} />
            <stop offset={0.8} stopColor="green" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Line
          yAxisId={"left"}
          type="monotone"
          dataKey="uv"
          dot={false}
          strokeWidth="4"
          stroke="url(#splitColor)"
          isAnimationActive={false}
        />
        {refX ? (
          <ReferenceLine
            yAxisId={"left"}
            x={refX}
            stroke={"black"}
            strokeOpacity={0.3}
            strokeDasharray="2 2"
            strokeWidth={2}
          />
        ) : null}
        {refY ? (
          <ReferenceLine
            yAxisId={"left"}
            y={refY}
            strokeOpacity={0.3}
            strokeDasharray="2 2"
            strokeWidth={2}
            stroke={"black"}
          />
        ) : null}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TibberPriceGraph;
