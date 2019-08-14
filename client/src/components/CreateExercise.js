import React, { useState, useEffect } from "react";
import axios from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const CreateExercise = ({ match, location }) => {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (location.search) {
      setEditing(location.search.split("=")[1]);
    }
    editing
      ? axios
          .get(`http://localhost:5000/exercises/${match.params.id}`)
          .then(res => {
            setUsername(res.data.username);
            setDescription(res.data.description);
            setDuration(res.data.duration);
            setDate(new Date(res.data.date));
          })
          .catch(err => console.log(err))
      : axios
          .get("http://localhost:5000/users/")
          .then(res => {
            if (res.data.length > 0) {
              setUsers(res.data.map(user => user.username));
              setUsername(res.data[0].username);
            }
          })
          .catch(err => console.log(err));
  }, [editing, location, match.params.id]);

  const onSubmit = e => {
    e.preventDefault();

    const exercise = {
      username: username,
      description: description,
      duration: duration,
      date: date
    };
    console.log(exercise);
    editing
      ? axios.post(`http://localhost:5000/exercises/update/${match.params.id}`)
      : axios
          .post("http://localhost:5000/exercises/add", exercise)
          .then(res => console.log(res.data));

    window.location = "/";
  };

  return (
    <>
      <h3>{editing ? "Edit Exercise Log" : "Create New Exercise Log"}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <select
            // ref="userInput"
            required
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
          >
            {users.map(user => (
              <option key={user} value={user}>
                {user}{" "}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            required
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Duration (in minutes): </label>
          <input
            type="text"
            className="form-control"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker selected={date} onChange={date => setDate(date)} />
          </div>
        </div>

        <div className="form-group">
          <input
            type="submit"
            value={editing ? "Edit Exercise Log" : "Create Exercise Log"}
            className="btn btn-primary"
          />
        </div>
      </form>
    </>
  );
};
