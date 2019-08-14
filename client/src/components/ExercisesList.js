import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Exercise = ({ exercise, deleteExercise }) => (
  <tr>
    <td>{exercise.username}</td>
    <td>{exercise.description}</td>
    <td>{exercise.duration}</td>
    <td>{exercise.date.substring(0, 10)}</td>
    <td>
      <Link
        to={`/edit/${exercise._id}?editing=true`}
        className="btn btn-primary"
        style={{ marginRight: "5px" }}
      >
        edit
      </Link>
      <button
        onClick={() => {
          deleteExercise(exercise._id);
        }}
        className="btn btn-danger"
      >
        delete
      </button>
    </td>
  </tr>
);

export const ExercisesList = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios
        .get("/exercises/")
        .catch(err => console.log(err));

      setExercises(result.data);
    };

    fetchData();
  }, []);

  const deleteExercise = id => {
    axios
      .delete(`/exercises/${id}`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));

    setExercises(exercises.filter(exercise => exercise._id !== id));
  };

  const createExercisesTableBody = () => {
    return exercises.map(exercise => (
      <Exercise
        exercise={exercise}
        deleteExercise={deleteExercise}
        key={exercise._id}
      />
    ));
  };

  return (
    <>
      <h3>Logged Exercises</h3>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Username</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{createExercisesTableBody()}</tbody>
      </table>
    </>
  );
};
