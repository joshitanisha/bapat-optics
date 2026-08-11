import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import "./OffcanvasCon.css";
import { Table } from "react-bootstrap";
const OffcanvasCon = (props) => {
 
  return (
    <>
      <Offcanvas
        show={props.show}
        onHide={props.handleClose}
        placement={"end"}
        // {...props}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <section className="Offcanvasmiancon">
            <div className="container-fluid">
              <div className="card">
                <div className="card-body">
                  <div className="offhead">
                    <h3>Import Report:</h3>
                  </div>

                  <div className="table-responsive mainTableOff">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Added Records</th>
                          <td>{props?.show?.Added_Count}</td>
                          <th>Not Added Records</th>
                          <td>{props.show.Exits_Count}</td>
                          <th>Total Records</th>
                          <td>{props.show.Total}</td>
                        </tr>
                        <tr></tr>
                      </thead>
                    </Table>
                  </div>
                  <div className="storeAddedhead">
                    <p>Added List:</p>
                  </div>

                  <div className="table-responsive mainTableOff">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          {props?.show?.Head?.map((head) => (
                            <th>{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {props?.show?.Added?.map((added, index) => (
                          <tr key={index}>
                            <td>{++index}</td>
                            {props?.show?.Head?.map((head) => (
                              <td>{added[head]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  <div className="storeAddedhead">
                    <p>Not Added List:</p>
                  </div>

                  <div className="table-responsive mainTableOff">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Sr.No</th>
                          {props?.show?.Head?.map((head) => (
                            <th>{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {props?.show?.Exits?.map((exits, index) => (
                          <tr key={index}>
                            <td>{++index}</td>
                            {props?.show?.Head?.map((head) => (
                              <td>{exits[head]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffcanvasCon;
