import React from 'react'
import { PulseLoader } from 'react-spinners'
import './loader.css'

function Loader() {
    return (
        <div className='loader'>
            <PulseLoader
                color="#0712c0"
                cssOverride={null}
                size={15}
                margin={3}
                speedMultiplier={1}
            />
        </div>
    )
}

export default Loader