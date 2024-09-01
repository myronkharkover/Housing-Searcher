import React, {useEffect, useState} from "react";
import DataTable from "./DataTable";
const config = require('./config.json');
export function Location({}) {
    const [zip, setZip] = useState("");
    const [name, setName] = useState("");
    const [state, setState] = useState("");
    const [noResponse, setNoResponse] = useState(false)
    const [showToast, setShowToast] = useState(false);

    const[allData, setAllData] = useState("");
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setZip(urlParams.get('zip'))
        setName(urlParams.get('name'))
        setState(urlParams.get('state'))
        getAllData(urlParams.get('zip'))
    }, [])

    async function getAllData(dataZip) {
        const route = `/zips-by-state/`
        await fetch(`http://${config.server_host}:${config.server_port}/zipcode-info/${dataZip}`)
        .then(res => {
            if (!res.ok) {
                setNoResponse(true)
            }
            setNoResponse(false)
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setAllData(resJson);
        })
    }
    
    async function saveLocation() {
        try {
            const newLocation = {userId: localStorage.getItem('userID'), newLocation: {zip: zip, zipName: name, zipState: state}}
            console.log(newLocation)
            const response = await fetch('http://localhost:8000/addFavorite', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newLocation)
            });
      
            if (!response.ok) {
              throw new Error('Failed to add new location');
            }
            setShowToast(true)
          } catch (error) {
            console.log(error)
            console.error('Error adding user:', error.message);
            // Optionally, display an error message to the user
          }
    }

    function handleSave() {
        saveLocation()
        setTimeout(() => {
            setShowToast(false);
        }, 20000); // 20 seconds
    }

    return (
        <div>
            <h1 className="py-5">{`Are you ready to become a ${state} resident?`}</h1>
            <h2 className="py-5">{`Click below to view information about ${name} with zip code ${zip} in ${state}.`}</h2>
            <h2>Each row represents a different point of collection.</h2>
            <div className="flex flex-col justify-center mx-20">
                <div className="collapse bg-base-200 my-5">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xl font-medium">
                        <h2>Liveability</h2>
                    </div>
                    <div className="collapse-content"> 
                    {!noResponse && <DataTable titles={["Total Population", "Residential Density", "Distance to public transit", "Walkability Index"]} fields={["TotPop", "D1A", "D4A", "NatWalkInd"]} data={allData} caller="liveability"/>}
                    </div>
                </div>
                <div className="collapse bg-base-200 my-5">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xl font-medium">
                        <h2>School Information</h2>
                    </div>
                    <div className="collapse-content"> 
                    {!noResponse && <DataTable titles={["School Name", "County", "Number of Students", "Number of Teachers", "Student-Teacher Ratio"]} fields={["School_Name", "County_Name", "Total_Students", "FullTime_Teachers", "Pupil_Teacher_Ratio"]} data={allData}/>}
                    </div>
                </div>
                <div className="collapse bg-base-200 my-5">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xl font-medium">
                        <h2>Social Capital Indicators</h2>
                    </div>
                    <div className="collapse-content"> 
                    {!noResponse && <DataTable titles={["Economic Connectedness Score", "Volunteering Rate", "Civic Organizations"]} fields={["ec_zip", "volunteering_rate_zip", "civic_organizations_zip"]} data={allData}/>}
                    </div>
                </div>
                <div className="collapse bg-base-200 my-5">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xl font-medium">
                        <h2>Hospital Information</h2>
                    </div>
                    <div className="collapse-content"> 
                    {!noResponse && <DataTable titles={["Hospital Name", "Measure_Name", "Measure Description", "Care Effectiveness"]} fields={["FacilityName", "Sum_Condition", "Measure_Name", "Score"]} data={allData}/>}
                    </div>
                </div>
            </div>
            <button className="btn btn-primary" style={{"marginRight": "40px"}} onClick={handleSave}>Save Location</button>
            {showToast &&
                <div className="toast">
                    <div className="alert alert-info">
                    <span>Location successfully saved</span>
                    </div>
                </div>
            }
        </div>
    )
}