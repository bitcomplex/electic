import { useNetatmoRainData } from "./hooks";
import { toHtml, icon } from "@fortawesome/fontawesome-svg-core";
import {
  faDropletSlash,
  faCloudRain,
  faCloudShowersHeavy,
} from "@fortawesome/free-solid-svg-icons";

const out = (i) => (Math.round(i * 10) / 10).toString().split(".").join(",");

const Rain = ({ children }) => {
  const { now, lastHour, last24Hours } = useNetatmoRainData();

  const getSVGURI = (faIcon, color) => {
    const abstract = icon(faIcon).abstract[0];
    if (color) abstract.children[0].attributes.fill = color;
    return `data:image/svg+xml;base64,${btoa(toHtml(abstract))}`;
  };

  const rainIcon = () => {
    if (now === 0) {
      return faDropletSlash;
    }
    if (lastHour < 4) {
      return faCloudRain;
    }
    return faCloudShowersHeavy;
  };

  return (
    <div
      className="dash"
      style={{
        backgroundImage: `url(${getSVGURI(rainIcon(), "#fff")})`,
      }}
    >
      <div className="content">
        <div className="title">{children}</div>
        <div className="main">
          {out(lastHour)} <span>mm/h</span>
        </div>
        <div className="sub">
          <p>
            Just nu:
            <br />
            <span>{out(now)}</span> mm
          </p>
          <p>
            Senaste dygnet:
            <br />
            <span>{out(last24Hours)}</span> mm
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rain;
