import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Green_Btn.css'

const Green_Btn = (props) => {

    
    return (
        <button className="Green_Btn" onClick={props?.onClick} type={props.type||'button'}>
            {props?.leftIcon && (
                <div className='icon_holder'>
                    <FontAwesomeIcon icon={props?.leftIcon} className='left_icon' />
                </div>
            )}

            <p className='btn_text'>{props?.btn_name}</p>

            {props?.rightIcon && (
                <div className='icon_holder'>
                    <FontAwesomeIcon icon={props?.rightIcon} className='right_icon' />
                </div>
            )}
        </button>
    )
}

export default Green_Btn
