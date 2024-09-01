import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import DataTable from './DataTable';
const config = require('./config')
export function Home({}) {
 
    const[schools, setSchools] = useState([]);
    const[liveability, setLiveability] = useState([]);
    const[healthcare, setHealthcare] = useState([]);
    const[healthcareOutcomes, setHealthcareOutcomes] = useState([]);
    const[healthComp, setHealthComp] = useState([])
    const [importantStats, setImportantStats] = useState([])
    const [bestHospitals, setBestHospitals] = useState([])


    const[noResults, setNoResults] = useState(false);
    
    async function getTopLiveability() {
        await fetch(`http://${config.server_host}:${config.server_port}/top-liveability`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setLiveability(resJson);
        })
    }

    async function getSchools() {
        await fetch(`http://${config.server_host}:${config.server_port}/school-info`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setSchools(resJson);
        })
    }

    async function getHealthcareSocial() {
        await fetch(`http://${config.server_host}:${config.server_port}/healthcare-social`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setHealthcare(resJson);
        })
    }

    async function getHealthcareOutcomes() {
        await fetch(`http://${config.server_host}:${config.server_port}/healthcare-outcomes`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setHealthcareOutcomes(resJson);
        })
    }

    async function getHealthComp() {
        await fetch(`http://${config.server_host}:${config.server_port}/health-comp`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setHealthComp(resJson);
        })
    }

    async function getImportantStats() {
        await fetch(`http://${config.server_host}:${config.server_port}/important-stats`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setImportantStats(resJson);
        })
    }

    async function getBestHospitals() {
        await fetch(`http://${config.server_host}:${config.server_port}/best-hospitals`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setBestHospitals(resJson);
        })
    }

    useEffect(() => {
        getTopLiveability()
        getSchools()
        getHealthcareSocial()
        getHealthcareOutcomes()
        getHealthComp()
        getImportantStats()
        getBestHospitals()
    }, [])

    return (
        <div className='py-2'>
            <div>
                <h1>
                    LocaLife.
                </h1>
            </div>
            <div className='flex flex-col px-20 gap-y-5' >
                <h2>Check out some of our highlighted locations</h2>
                <div className="collapse bg-base-200 py-5">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xl font-medium">
                        Click to view the 5 locations with best overall liveability
                    </div>
                    <div className="collapse-content"> 
                        <div className="overflow-x-auto">
                            <table className="table">
                                {/* head */}
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Location</th>
                                    <th>Total Population</th>
                                    <th>Walkability</th>
                                    <th>Median Wage</th>
                                    <th>Residential Density</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {liveability.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.CSA_Name}</td>
                                            <td>{item.TotPop}</td> {/* Assuming 'fullName' is the field name for name */}
                                            <td>{item.NatWalkInd}</td>
                                            <td>{item.R_MedWageWk}</td>
                                            <td>{item.D1A}</td> {/* Assuming 'city' and 'state' are fields for location */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>                         
                    </div>
                    <div className='divider'></div>
                    <div className="collapse bg-base-200">
                            <input type="checkbox" /> 
                            <div className="collapse-title text-xl font-medium">
                                Click to view the schools with the best student-teacher ratio.
                            </div>
                            <div className="collapse-content"> 
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        {/* head */}
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>School Name</th>
                                            <th>County</th>
                                            <th>State</th>
                                            <th>Student-Teacher Ratio</th>
                                            <th>Total Students</th>
                                            <th>Number of Fulltime Teachers</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {schools.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.School_Name}</td>
                                                    <td>{item.County_Name}</td> 
                                                    <td>{item.State_Name}</td>
                                                    <td>{item.Pupil_Teacher_Ratio}</td>
                                                    <td>{item.Total_Students}</td>
                                                    <td>{item.FullTime_Teachers}</td> 
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='divider'></div>                            
                        <div className="collapse bg-base-200">
                            <input type="checkbox" /> 
                            <div className="collapse-title text-xl font-medium">
                                Click to view the top places with great hospitals and great people.
                            </div>
                            <div className="collapse-content"> 
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        {/* head */}
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th>City</th>
                                            <th>State</th>
                                            <th>Zip Code</th>
                                            <th>Hospital Name</th>
                                            <th>Average Effective Care Score of Hospitals</th>
                                            <th>Average Volunteering Rate</th>
                                            <th>Average number of civic organizations</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {healthcare.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.City_Town}</td>
                                                    <td>{item.State}</td> 
                                                    <td>{item.ZipCode}</td>
                                                    <td>{item.FacilityName}</td>
                                                    <td>{item.AverageScore}</td>
                                                    <td>{item.AverageVolunteeringRate}</td> 
                                                    <td>{item.AverageCivicOrganizations}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='divider'></div>
                        <div className="collapse bg-base-200">
                            <input type="checkbox" /> 
                            <div className="collapse-title text-xl font-medium">
                                Click to view top healthcare outcomes
                            </div>
                            <div className="collapse-content"> 
                            <DataTable titles={["Zip Code", "Zip Name", "State", "Average Health Value", "Effective Care Score"]} fields={["Zipcode", "zip_name", "State", "Avg_Health_Value", "Max_Care_Score", "Number_of_Facilities"]} data={healthcareOutcomes}/>
                            </div>
                        </div>
                        <div className='divider'></div>
                        <div className="collapse bg-base-200">
                            <input type="checkbox" /> 
                            <div className="collapse-title text-xl font-medium">
                                Click to view healthcare metrics for each zip code vs. global and state averages
                            </div>
                            <div className="collapse-content"> 
                            <DataTable titles={["Zip Code", "State", "Average Health Value", "State Average", "Global Average"]} fields={["Zipcode", "StateAbbr", "Avg_Health_Value", "State_Average", "Global_Average"]} data={healthComp}/>
                            </div>
                        </div>
                        <div className='divider'></div>
                        <div className="collapse bg-base-200">
                            <input type="checkbox" /> 
                            <div className="collapse-title text-xl font-medium">
                                Click to view a summary of important statistics for each zip code
                            </div>
                            <div className="collapse-content"> 
                            <DataTable titles={["Zipcode", "State Name", "School Name", "Average Pupil Teacher Ratio", "Average Community Health Index", "Average Hospital Care Score", "Above Average Economic Connectivity", "Average Walkability", "High Performance Hospitals"]} fields={["Zipcode", "State_Name", "School_Name", "Avg_Pupil_Teacher_Ratio", "Community_Health_Index", "Avg_Hospital_Care_Score", "Above_Avg_Economic Connectivity", "Avg_Walkability_Index", "High_Performance_Facilities"]} data={importantStats}/>
                            </div>
                        </div>
                        <div className='divider'></div>
                        <div className="collapse bg-base-200">
                            <input type="checkbox" /> 
                            <div className="collapse-title text-xl font-medium">
                                Click to view the best hospitals and how they compare to state averages
                            </div>
                            <div className="collapse-content"> 
                            <DataTable titles={["Facility Name", "City", "State", "Effective Care Score", "Average Hospital Quality", "Average Community Health", "Average State Score"]} fields={["FacilityName", "City_Town", "State", "Score", "AVG_Hospital_Quality_Score", "Avg_Community_Health", "Average_State_Score"]} data={bestHospitals}/>
                            </div>
                        </div>


                </div>
            </div>
        </div>
    )
}