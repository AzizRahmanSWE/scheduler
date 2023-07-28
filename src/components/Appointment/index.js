import React from "react";
import useVisualMode from "hooks/useVisualMode"
import "./styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const DELETING = "DELETING";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE"

  const  { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function deleteAppointment(event) {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show 
            id={props.id}
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onEdit={() => transition(EDIT)}
            onDelete={() => transition(CONFIRM)}
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
        {mode === SAVING && <Status message="Saving..." />}
        {mode === CONFIRM && (
          <Confirm 
            message="Are you sure you want to delete this interview?"
            onCancel={back}
            onConfirm={() => deleteAppointment()}
          />
        )}
        {mode ===  EDIT && (
          <Form 
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
          />
        )}
        {mode === DELETING && (
          <Status message="Deleting..."/>
        )}
        {mode === ERROR_SAVE && (
          <Error message="Error to save the interview" onClose={back}/>
        )}
        {mode === ERROR_DELETE && (
          <Error message="Error to delete the interview" onClose={back}/>
        )}
    </article>
  );
}

