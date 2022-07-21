import { useState, useEffect } from "react";

const getWeekNumber = (date) => {
  var d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

function DateTime() {
  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return () => clearInterval(timerId);
  }, []);
  return (
    <div className="dateTime">
      <span className="date">
        {date.toLocaleDateString("sv-SE", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        <br />
        Vecka {getWeekNumber(date)}
      </span>
      <span className="clock">
        {date.toLocaleTimeString("sv-SE", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
export default DateTime;
