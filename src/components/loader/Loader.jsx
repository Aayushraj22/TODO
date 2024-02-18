import React from 'react'
import { CircleLoader } from 'react-spinners'
import './loader.css'

function Loader() {
    return (
        <div className='loader'>
            <CircleLoader
                color="#0712c0"
                cssOverride={null}
                size={60}
                speedMultiplier={1}
            />
        </div>
    )
}

export default Loader