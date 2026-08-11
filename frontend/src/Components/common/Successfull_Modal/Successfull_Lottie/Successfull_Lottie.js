import React from 'react';
import Lottie from 'lottie-react';
import './Successfull_Lottie.css';
import * as animationData from './Successfull_Lottie.json';

function Successfull_Lottie() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <section className='main'>
      <div className='Successfull_Lottie_icon'>
        <Lottie className="me-auto"
          options={defaultOptions}
        // height={60}
        // width={60}          
        />
      </div>
    </section>
  );
}
export default Successfull_Lottie;