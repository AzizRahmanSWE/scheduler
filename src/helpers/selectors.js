function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find((d) => d.name === day);

  // Validation: if no appointments, days data should be empty.
  if (!filteredDay || !state.days.length) {
    return [];
  }

  const appointments = filteredDay.appointments.map((id) => {
    return state.appointments[id];
  });
  return [...appointments]
}

export { getAppointmentsForDay };