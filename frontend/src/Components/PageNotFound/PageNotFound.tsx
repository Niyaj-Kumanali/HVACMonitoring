import React from 'react'
import './PageNotFound.css'
import notfoundimage from "../../assets/qIufhof.png"

const PageNotFound: React.FC = () => {
    return (
        <div id="wrapper">
            <img src={notfoundimage} />
            <div id="info">
                <h3>This page could not be found</h3>
            </div>
        </div >
    )
}

export default PageNotFound