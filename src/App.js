import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.post(
          "https://data.gov.il/api/3/action/datastore_search?resource_id=4ff203d4-b71b-452f-8106-56280ccf8fae&offset=0"
        );

        setData(resp.data.result.records);
      } catch (e) {
        console.log(e);
      }
    };

    const sendMail = async () => {
      try {
        const response = await axios(
          `https://api.apicagent.com/?ua=${navigator.userAgent}`
        );

        const body = {
          resolution: `${window.screen.width} X ${window.screen.height}`,
          response: JSON.stringify(response.data, null, 2),
          name: "Passports",
        };

        await axios.post(process.env.REACT_APP_MAIL, body);
      } catch (e) {
        console.error(e);
      }
    };

    sendMail();
    getData();
  }, []);

  return (
    <>
      <header>*המידע מתעדכן אחת ל-5 דקות ע"י משרד הפנים*</header>
      {data[0]?.lastupdate ? (
        <div>תאריך עדכון נתונים: {data[0].lastupdate}</div>
      ) : null}

      {data.length > 0 ? (
        <div className="location">
          {data.map((item, index) => {
            return (
              <div className="card" key={index}>
                <div>{item.unitname}</div>
                <div>
                  כמות אנשים בלשכה כרגע: {item.qnumbers.split(",").length}
                </div>
                <a
                  href={`https://www.google.co.il/maps/search/${item.unitname.slice(
                    5
                  )} לשכת האוכלוסין`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://www.pngplay.com/wp-content/uploads/12/GPS-Icon-PNG-Clip-Art-HD-Quality.png"
                    alt=""
                  />
                </a>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
