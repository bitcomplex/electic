import { useNetatmoWindData } from "./hooks";
import { toHtml, icon } from "@fortawesome/fontawesome-svg-core";
import { faWind, faLocationArrow } from "@fortawesome/free-solid-svg-icons";

const Wind = ({ children }) => {
  const { speed, direction } = useNetatmoWindData();
  const iconDirection = direction - 45 + 180;
  const displaySpeed = (Math.round(speed * 10) / 10)
    .toString()
    .split(".")
    .join(",");

  const getSVGURI = (faIcon, color) => {
    const abstract = icon(faIcon).abstract[0];
    if (color) abstract.children[0].attributes.fill = color;
    return `data:image/svg+xml;base64,${window.btoa(toHtml(abstract))}`;
  };

  return (
    <div
      className="dash"
      style={{ backgroundImage: `url(${getSVGURI(faWind, "#fff")})` }}
    >
      <div className="content">
        <div className="title">{children}</div>
        <div className="main">
          {displaySpeed} <span>m/s</span>
        </div>
        <div className="sub">
          <div className="compass">
            <p className="n">N</p>
            <p className="w">V</p>
            <div
              className="windDirection"
              style={{
                backgroundImage: `url(${getSVGURI(faLocationArrow)})`,
                transform: `rotate(${iconDirection}deg)`,
              }}
            ></div>
            <p className="e">Ö</p>
            <p className="s">S</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wind;
