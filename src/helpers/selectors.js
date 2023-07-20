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


function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const {student, interviewer} = interview;
  const interviewerData = state.interviewers[interviewer];
  
  return {
    student,
    interviewer: interviewerData
  }
}

function getInterviewersForDay(state, day) {
  const filteredDay = state.days.find((d) => d.name === day);

  if (!filteredDay || !filteredDay.interviewers.length) {
    return [];
  }

  const interviewers = filteredDay.interviewers.map((interviewerId) => state.interviewers[interviewerId]
  );
  return interviewers;
}

export { getAppointmentsForDay, getInterview, getInterviewersForDay };