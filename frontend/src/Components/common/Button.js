import React from "react";
import { Button } from "react-bootstrap";
import pen from "../../Components/assets/icons/pen.png";
import basket from "../../Components/assets/icons/basket.png";
import save from "../../Components/assets/icons/save.png";
import cancel from "../../Components/assets/icons/cross.png";
import view from "../../Components/assets/icons/blackeye.png";
const AddButton = (props) => {
  return (
    <Button
      onClick={() => props.handleShow1(props?.id)}
      type="button"
      className="btn btn-primary me-1"
    >
      <img src={pen} className="pen" alt="" />
    </Button>
  );
};

const EditButton = (props) => {
  return (
    <Button
      onClick={() => props.handleShow1(props?.id)}
      type="button"
      className="btn btn-primary me-1"
    >
      <img src={pen} className="pen" alt="" />
    </Button>
  );
};

const DeletButton = (props) => {
  return (
    <button
      onClick={() => {
        props.showDeleteRecord(props?.id, props?.name);
      }}
      type="button"
      className="btn btn-reset"
    >
      <img src={basket} className="pen" alt="" />
    </button>
  );
};


const SaveButton = (props) => {
  return (
    <Button
      variant="success"
      type="button"
      onClick={props.handleSubmit}
      className="btn btn-save"
    >
      <img src={save} className="save-img me-2" alt="" /> {props.name}
    </Button>
  );
};

const CancelButton = (props) => {
  return (
    <Button
      onClick={props.handleClose}
      type="button"
      variant="danger"
      className="btn btn-cancel me-2"
    >
      <img src={cancel} className="cancel-img" alt="" /> {props.name}
    </Button>
  );
};

const ViewButton = (props) => {
  return (
    <Button
      onClick={() => props.handleShow1(props?.id)}
      type="button"
      className="btn btn-eye me-1"


    >
      <i class="fa fa-id-card-o"></i>
      <img src={view} className="view" alt="" />
    </Button>
  );
};


export { AddButton, EditButton, DeletButton, CancelButton, SaveButton, ViewButton };
