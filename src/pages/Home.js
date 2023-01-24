import React, {Fragment} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [text, setText] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [lastUpdate, setLastUpdate] = React.useState(0);
  const [newLenAddition, setNewLenAddition] = React.useState(0);

  const navigate = useNavigate();

  const submit = (txt) => {
    console.log("Text updated: " + text);
    var config = {
      method: "post",
      url: "https://acrolinx-spell-checker-production.up.railway.app/api/v1/spell/check",
      headers: {
        "Content-Type": "text/plain",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      data: txt,

    };
    console.log(config)

    axios(config)
      .then(function (response) {
        let suggestions = response.data.data.issues;
        setSuggestions(suggestions);
      })
      .catch(function (error) {
          if (error.response.status === 401) navigate('/');
          console.log(error.message);
      });
  };

  String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
  };
  
  const replaceText = (start, end, rep, replacedText) => {
    let newText;
    if (start > lastUpdate) {
      newText = text.replaceBetween(start + newLenAddition, end + newLenAddition, rep);
      setLastUpdate(start);
    } else {
      newText = text.replaceBetween(start, end, rep);
    }
    setText(newText);

    const len = rep.length - (end - start);
    setNewLenAddition(newLenAddition + len);

    let sug = suggestions.filter((item) => {
      return item?.match?.surface !== replacedText;
    });
    setSuggestions(sug);
  };

  const replaceTextWhileRefreshing = (start, end, rep, replacedText) => {
    let newText = text.replaceBetween(start, end, rep);
    setText(newText);

    if (rep.length !== replacedText.length) {
      submit(newText); // Refresh suggestions  
    }
  };

  const updateText = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="App">
      <div className="text-div">
        <textarea
          type="text"
          className="text-input"
          value={text}
          onChange={updateText}
        />
        <button className="text-button" onClick={() => submit(text)}>
          Submit
        </button>
      </div>
      <div className="suggestion-div">
        <ol style={{ textAlign: "left" }}>
          {suggestions?.map((issue) => {
            return (
              <Fragment key={issue?.match?.surface}>
                <li>{issue?.match?.surface}</li>
                <div>
                  {issue?.match?.replacement?.map((rep) => {
                    return (
                      <button
                        onClick={() =>
                          replaceTextWhileRefreshing(
                            issue?.match?.beginOffset,
                            issue?.match?.endOffset,
                            rep,
                            issue?.match?.surface
                          )
                        }
                        style={{
                          height: "auto",
                          width: "auto",
                          padding: ".5em",
                          margin: ".5em",
                          color: "white",
                          backgroundColor: "blue",
                          border: "none",
                        }}
                        key={rep}
                      >
                        {rep}
                      </button>
                    );
                  })}
                </div>
              </Fragment>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default Home;
