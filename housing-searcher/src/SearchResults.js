import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import { LocationCard } from "./LocationCard";
const config = require('./config.json');

export default function SearchResults ({}) {
    const [zipSearch, setZipSearch] = useState("");
    const [searchMatch, setSearchMatch] = useState([]);
    const [noResults, setNoResults] = useState(false)

    async function getStateResults(state) {
        await fetch(`http://${config.server_host}:${config.server_port}/zips-by-state/${state}`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setSearchMatch(resJson);
        })
    }

    async function getZipResults(zip) {
        await fetch(`http://${config.server_host}:${config.server_port}/state-by-zip/${zip}`)
        .then(res => {
            if (!res.ok) {
                setNoResults(true);
            }
            const resJson = res.json()
            return resJson;
        })
        .then(resJson => {
            setSearchMatch(resJson);
        })
    }

    function handleSearch() {
        if (!isNaN(zipSearch)){
            getZipResults(zipSearch)
        }  else {
            getStateResults(zipSearch)
        }
    }

    return (
        <div>
            <div className='py-10 px-40 flex space-x-2' >
                <label className="input input-bordered flex flex-grow items-center gap-2">
                    <input type="text" className="grow" placeholder="Search by zip code or 2-letter capitalized state abbreviations" onChange={(e) => {setZipSearch(e.target.value)}}/>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
                </label>
                <NavLink to={`/searchresults?zip=${zipSearch}`}>
                    <button className='btn btn-primary' onClick={handleSearch}>Search</button>
                </NavLink>
            </div>
            <div className='flex flex-wrap gap-5 justify-center'>
                {(noResults || searchMatch.length == 0) &&
                    <h2 className="px-20">No search results are available. Enter a new search term to try again.</h2>
                }
                {!noResults && searchMatch.map((obj, index) => (
                    <LocationCard key={index} zip={obj.zip} zipName={obj.zip_name} zipState ={obj.zip_state}  />
                ))}
            </div>
        </div>
    );
}