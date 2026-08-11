import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Black_Btn.css'

const Black_Btn = ({ btnText, onClick }) => {
    return (
        <section className="Black_btn_holder">
            <Button className="Black_Btn" onClick={onClick}>{btnText}</Button>
        </section>

    )
}

export default Black_Btn
