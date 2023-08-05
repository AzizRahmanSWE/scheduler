import { useState, useEffect } from "react";
import axios from "axios";
// import updateSpots from "helpers/updateSpots";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  function updateSpots(appointments, dayName) {
    // get the index of the day obj whose day matches the given day
    const foundDayIndex = state.days.findIndex(
      (dayObj) => dayObj.name === dayName
    );

    // get the dayObj at foundDayIndex
    const foundDay = state.days[foundDayIndex];

    // translate the day appointments id from the given appointments to their interview properties
    const foundDayInterviews = foundDay.appointments.map(
      (appointmentId) => appointments[appointmentId].interview
    );

    // get the number of falsy interviews
    const spotsRemaining = foundDayInterviews.filter(
      (interview) => !interview
    ).length;

    // const spotsRemaining2 = foundDayInterviews.length - foundDayInterviews.filter(Boolean).length;

    // make a copy of foundDay and override the spots with spotsRemaining
    const newFoundDay = { ...foundDay, spots: spotsRemaining };

    // create a copy of state.days, replacing the foundDay obj (at foundDayIndex) with newFoundDay
    const newDays = state.days
      .slice(0, foundDayIndex)
      .concat(newFoundDay)
      .concat(state.days.slice(foundDayIndex + 1));

    return newDays;
  }
  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => 
        setState({ 
          ...state,
          appointments,
          days: updateSpots(appointments, state.day)
        })
      )
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => 
        setState({ 
          ...state,
          appointments,
          days: updateSpots(appointments, state.day)
        })
      )
  };
  return { state, setDay, bookInterview, cancelInterview };
};