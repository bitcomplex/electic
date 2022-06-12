import { toHtml, icon } from "@fortawesome/fontawesome-svg-core";
import {
  faTemperatureHalf,
  faTemperatureArrowDown,
  faTemperatureArrowUp,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import { useNetatmoTemperatureData } from "./hooks";

const ptoc = (str = "") => str.toString().split(".").join(",");

const getSVGURI = (faIcon, color) => {
  const abstract = icon(faIcon).abstract[0];
  if (color) abstract.children[0].attributes.fill = color;
  return `data:image/svg+xml;base64,${window.btoa(toHtml(abstract))}`;
};

const temperatureIcon = (now) => {
  if (now < 0) {
    return faSnowflake;
  }
  return faTemperatureHalf;
};

const Temperature = ({ location, children }) => {
  const temperature = useNetatmoTemperatureData();
  const { now, min, max, trend } = temperature[location];
  return (
    <div
      className="dash"
      style={{
        backgroundImage: `url(${getSVGURI(temperatureIcon(now), "#fff")})`,
      }}
    >
      <div className="content">
        <div className="title">{children}</div>
        <div className="main">{ptoc(now)}°</div>
        <div className="sub">
          <div>
            Min:
            <br />
            <span>{ptoc(min)}</span>
            <sup>°</sup>
          </div>
          <div>
            {trend === "down" ? (
              <div
                className="icon"
                style={{
                  backgroundImage: `url(${getSVGURI(
                    faTemperatureArrowDown,
                    "#444"
                  )})`,
                }}
              ></div>
            ) : trend === "up" ? (
              <div
                className="icon"
                style={{
                  backgroundImage: `url(${getSVGURI(
                    faTemperatureArrowUp,
                    "#444"
                  )})`,
                }}
              ></div>
            ) : null}
          </div>
          <div>
            Max:
            <br />
            <span>{ptoc(max)}</span>
            <sup>°</sup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temperature;
