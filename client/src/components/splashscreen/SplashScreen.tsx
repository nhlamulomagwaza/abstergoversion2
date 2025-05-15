import React from 'react'
import './splashscreen.css'
import { ScaleLoader } from 'react-spinners'

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen">
      <div className="splash-screen-content">

        <h1 className='splash-title'>Abstergo</h1>

        <ScaleLoader color='white' style={{ marginTop: '1.5rem' }} />
      </div>
    </div>
  )
}

export default SplashScreen