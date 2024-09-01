import React, {useState, useEffect} from "react";
import { LocationCard } from "./LocationCard";
const config = require('./config.json')

export default function Profile({}) {
    const userID = localStorage.getItem('userID')
    const [user, setUser] = useState({})
    const[savedZips, setSavedZips] = useState([])
    const [noFavorites, setNoFavorites] = useState(false)
    const[zipCardObjs, setZipCardObjs] = useState([]);

    async function getUser() {
        try {
            const response = await fetch(`http://localhost:8000/user/${userID}`);
      
            if (!response.ok) {
              throw new Error('Failed to get user');
            }
      
            const user = await response.json();
            setUser(user[0])
            setSavedZips(user[0].favoriteLocations)
            // for (let i = 0; i < savedZips.length; i++) {
            //     getZipResults(savedZips[i]);
            //     console.log(setZipCardObjs)
            // }
          } catch (error) {
            console.log(error)
            console.error('Error getting user:', error.message);
            // Optionally, display an error message to the user
          }
    }

    // async function getZipResults(zip) {
    //     await fetch(`http://${config.server_host}:${config.server_port}/state-by-zip/${zip}`)
    //     .then(res => {
    //         if (!res.ok) {
    //             console.log("there was an issue")
    //         }
    //         const resJson = res.json()
    //         return resJson;
    //     })
    //     .then(resJson => {
    //         console.log(resJson)
    //         const arr = zipCardObjs
    //         arr.push(resJson)
    //         setZipCardObjs(arr);
    //         console.log(zipCardObjs);
    //     })
    // }

    useEffect(() => {
        getUser()
    }, [])

    
    return(
        <div>
            <div>
                <h1>View your account information</h1>
                <h2 className="font-bold">Name: </h2>
                <p>{user.first + " " + user.last}</p>
                <h2 className="font-bold">Username:</h2>
                <p>{user.username}</p>
                <h2 className="font-bold">Password: </h2>
                <p>{user.password}</p>
            </div>
            <div>
                <div className="flex flex-col justify-center mx-20">
                    <div className="collapse bg-base-200 my-5">
                        <input type="checkbox" /> 
                        <div className="collapse-title text-xl font-medium">
                            <h2>View your saved locations</h2>
                        </div>
                        <div className="collapse-content"> 
                            {savedZips.length >= 1 &&
                                <div style={{"display": "flex", "justifyContent": "space-around"}}>
                                    {savedZips.map((item) => 
                                        <LocationCard zip={item.zip} zipName={item.zipName} zipState={item.zipState} />
                                    )}
                                </div>
                            }
                            {savedZips.length < 1 &&
                                <div>
                                    <h2>You don't have any saved locations yet.  Head to our search tab to find some great places.</h2>
                                </div>

                            }
                        </div>
                    </div>
                </div>
                
            </div>
            
            
        </div>
    )
}