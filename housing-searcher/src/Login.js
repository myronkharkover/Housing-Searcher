import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { NavLink } from "react-router-dom"

export default function Login({}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [success, setSuccess] = useState(true)
    const navigate = useNavigate()

    function handleUsername(e) {
        setUsername(e.target.value)
    }
    
    function handlePassword(e) {
        setPassword(e.target.value)
    } 

    async function login() {
        try {
            console.log(username)
            console.log(password)
            const formData = {username: username, password: password}
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST', // Specify the POST method
                headers: {
                    'Content-Type': 'application/json' // Specify the content type as JSON
                },
                body: JSON.stringify(formData) // Stringify the form data
            });
            console.log(response)
      
            const user = await response.json();
            if (user.success) {
                setSuccess(true)
                localStorage.setItem("userID", user.id)
            } else {
                setSuccess(false)
                navigate('/login')
            }
            console.log('User added successfully in console:', user);
            
          } catch (error) {
            console.log(error)
            console.error('Error adding user:', error.message);
            // Optionally, display an error message to the user
          }
    }

    const handleLogin = () => {
        login()

    }

    return (
        <div className="my-20">
            <div>
                <h1>LocaLife.</h1>
                <h2>Login or Sign up below</h2>
                {!success && <p>Invalid username or password. Try again.</p>}
                <br/>
            </div>
            <div className="" style={{"display": "flex", "justifyContent": "center"}}>
                <div style={{"width": "50%"}}>
                    <label className="input input-bordered flex items-center gap-2">
                    Username
                    <input type="text" className="grow" placeholder="username" onChange={(e) => handleUsername(e)}/>
                    </label>
                    <br/>
                    <label className="input input-bordered flex items-center gap-2">
                    Password
                    <input type="text" className="grow" placeholder="password" onChange={(e) => handlePassword(e)}/>
                    </label>
                    <br/>
                    <NavLink to="/">
                        <button className="btn" onClick={handleLogin}> Log In </button>
                    </NavLink>
                    <NavLink to="/signup">
                        <button className="btn"> Sign Up </button>
                    </NavLink>
                </div>
            </div>
            
        </div>
    )
}