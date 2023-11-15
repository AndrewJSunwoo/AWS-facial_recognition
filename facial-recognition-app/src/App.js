import { useState } from "react";
import "./App.css";

const uuid = require("uuid");

function App() {
  const [image, setImage] = useState("");
  const [uploadeResultMessage, setUploadeResultMessage] = useState(
    "Please upload an image to authenticate"
  );
  const [visitorName, setVisitorName] = useState("place.jpg");
  const [isAuth, setAuth] = useState(false);

  function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch(process.env.REACT_APP_SENDIMAGE_URL + `${visitorImageName}.jpeg`, {
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: image,
    })
      .then(async () => {
        const response = await authenticate(visitorImageName);
        if (response.Message === "Success") {
          setAuth(true);
          setUploadeResultMessage(`Hi ${response["FirstName"]}`);
        } else {
          setAuth(false);
          setUploadeResultMessage("Authentication Failed");
        }
      })
      .catch((error) => {
        setAuth(false);
        setUploadeResultMessage("Error");
        console.error(error);
      });
  }

  async function authenticate(visitorImageName) {
    const requestUrl =
      process.env.REACT_APP_AUTH_URL +
      new URLSearchParams({
        objectKey: `${visitorImageName}.jpeg`,
      });
    return await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="App">
      <h2>Andrew's Facial ID</h2>
      <form onSubmit={sendImage}>
        <input
          type="file"
          name="image"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Authenticate</button>
      </form>
      <div className={isAuth ? "success" : "failure"}>
        {uploadeResultMessage}
      </div>
      <img
        src={require(`./visitors/${visitorName}`)}
        alt="Visitor"
        height={250}
        width={250}
      />
    </div>
  );
}

export default App;
