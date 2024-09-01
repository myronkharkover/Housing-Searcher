import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
const config = require('./config.json');
export function LocationCard({zip, zipName, zipState}) {
    // const [zipInfo, setZipInfo] = useState({})
    // const [zipName, setZipName] = useState("")
    // const [zipState, setZipState] = useState("")

    return(
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{`${zipName}`}</h2>
                <div>
                    <p>Zip code: {zip}</p>
                    <p>Zip code name: {zipName}</p>
                    <p>State: {zipState}</p>
                </div>
                <div className="card-actions justify-end">
                    <NavLink to={`/location?zip=${zip}&name=${zipName}&state=${zipState}`}>
                        <button className="btn btn-primary">View More</button>
                    </NavLink>
                
                </div>
            </div>
        </div>
    )
}