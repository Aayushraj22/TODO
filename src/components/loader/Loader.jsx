import React from 'react'
import { HashLoader } from 'react-spinners'
import './loader.css'

function Loader() {
    return (
    <div className='loader'>
        <HashLoader
            color="#0abff2"
            cssOverride={null}
            loading
            size={80}
            speedMultiplier={1}
        />
    </div>
    )
}

export default Loader