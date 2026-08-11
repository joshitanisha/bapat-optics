import React, { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import ChromePicker from "react-color";
import classNames from "classnames";

const ColorPickerInput = ({ value, onChange, errors }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleColorChange = (color) => {
        onChange(color.hex);
    };



    return (
        <div>
            <InputGroup>
                <Form.Control
                    type="text"
                    name="header_color"
                    placeholder="Header Color"
                    value={value}
                    className={classNames("", {
                        "is-invalid": errors?.header_color,
                    })}
                    readOnly // Prevents users from typing directly into the input
                    onClick={() => setShowPicker(!showPicker)} // Toggle color picker visibility on input click
                />
            </InputGroup>
            {showPicker && (
                <ChromePicker
                    color={value}
                    onChange={(color) => handleColorChange(color)}
                />
            )}
            {errors.header_color && (
                <span className="text-danger">{errors.header_color.message}</span>
            )}
        </div>
    );
};

export default ColorPickerInput;
