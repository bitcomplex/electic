import { useNetatmoWindData } from "./hooks";
import { toHtml, icon } from "@fortawesome/fontawesome-svg-core";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

const Wind = ({ children }) => {
  const { speed, direction, gustSpeed, maxSpeed } = useNetatmoWindData();
  const iconDirection = direction - 45 + 180;

  const getSVGURI = (faIcon, color) => {
    const abstract = icon(faIcon).abstract[0];
    if (color) {
      abstract.children[0].attributes.fill = color;
    }
    return `data:image/svg+xml;base64,${window.btoa(toHtml(abstract))}`;
  };

  const out = (v) => {
    if (v === null) {
      return;
    }
    return v.toLocaleString("sv-SE");
  };

  return (
    <div className="dash wind">
      <div className="compassContainer">
        <div className="compass">
          <p className="n">N</p>
          <p className="w">V</p>
          <div
            className="windDirection"
            style={{
              backgroundImage: `url(${getSVGURI(faLocationArrow, "#fff")})`,
              transform: `rotate(${iconDirection}deg)`,
            }}
          ></div>
          <p className="e">Ö</p>
          <p className="s">S</p>
        </div>
      </div>
      <div className="content">
        <div className="title">{children}</div>
        <div className="main">
          {out(speed)} <span>m/s</span>
        </div>
        <div className="sub">
          <p>
            Byvind:
            <br />
            <span>{out(gustSpeed)}</span> m/s
          </p>
          <p>
            Max idag:
            <br />
            <span>{out(maxSpeed)}</span> m/s
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wind;
