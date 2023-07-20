import React from "react";
import useVisualMode from "hooks/useVisualMode"
import "./styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";

  const  { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW));
  }

  function deleteAppointment() {
    props.cancelInterview(props.id).then(() => transition(EMPTY))
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show 
            id={props.id}
            student={props.interview.student}
            interviewer={props.interview.interviewer}
          />
        )}
        {mode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
            bookInterview={props.bookInterview}
          />
        )}
        {mode === SAVING && <Status message={"Saving..."} />}
        {mode === CONFIRM && (
           <Confirm 
            message="Are you sure you want to delete this interview?"
            onCancel={back}
              onConfirm={cancelInterview}
           />
        )}
      </article>
  );
}

