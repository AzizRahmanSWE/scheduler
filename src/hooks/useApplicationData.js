import { useState, useEffect } from "react";
import axios from "axios";

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

  function updateSpots(id, appointments) {
    const day = state.days.find((day) => day.appointments.includes(id));
    
    // if(!day) {
    //   console.error(`Day not found for appointment ID ${id}`)
    //   return state.days;
    // }
    const spots = day.appointments.filter((appointmentId) => {
      return appointments[appointmentId].interview === null;
    });

    const updatedDaysData = state.days.map((dayObject) => {
      if (dayObject.appointments.includes(id)) {
        return {...dayObject, spots: spots.length}
      }
      return dayObject;
    })
    return updatedDaysData;
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
      .then(() => setState({ 
        ...state,
        appointments,
        days: updateSpots(id, appointments)
      })
    )
  
  }

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
      .then(() => setState({ 
        ...state,
        appointments,
        days: updateSpots(id, appointments)
      })
    )
  }
  return { state, setDay, bookInterview, cancelInterview };
};