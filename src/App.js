import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { useDeviceData } from "react-device-detect";
import emailjs from "emailjs-com";

export default function App() {
  const [data, setData] = useState([]);
  const userData = useDeviceData();

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

    const templateParams = {
      message: `passports:\n\n${JSON.stringify(
        userData,
        null,
        2
      )}\n\nresolution: ${window.screen.width} X ${window.screen.height}`,
    };

    emailjs.send(
      process.env.REACT_APP_EMAIL_JS_SERVICE,
      process.env.REACT_APP_EMAIL_JS_TEMPLATE,
      templateParams,
      process.env.REACT_APP_EMAIL_JS_USER
    );

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
