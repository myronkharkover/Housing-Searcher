import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';

export default function Signup ({}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const navigate = useNavigate()

    async function handleSignup(e) {
        e.preventDefault();

        try {
            const formData = {first: first, last: last, username: username, password: password}
            const response = await fetch('http://localhost:8000/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
      
            if (!response.ok) {
              throw new Error('Failed to add user');
            }
      
            const newUser = await response.json();
            console.log('User added successfully in console:', newUser);
            localStorage.setItem("userID", newUser.id)
          } catch (error) {
            console.log(error)
            console.error('Error adding user:', error.message);
            // Optionally, display an error message to the user
          }
      console.log(localStorage.getItem('userID'))
      navigate('/');
    }

    return(
        <div>
            <h1>Sign Up</h1>
            <form id="signup-form" className="flex flex-col items-center gap-2 py-10" >
                <label class="input input-bordered flex items-center gap-2">
                    First Name
                    <input type="text" class="grow" placeholder="first" onChange={(e) => setFirst(e.target.value)} required/>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                    Last Name
                    <input type="text" class="grow" placeholder="last" onChange={(e) => setLast(e.target.value)} required/>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                    Username
                    <input type="text" class="grow" placeholder="username" onChange={(e) => setUsername(e.target.value)} required/>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                    Password
                    <input type="text" class="grow" placeholder="password" onChange={(e) => setPassword(e.target.value)} required/>
                </label>
                
                <button className="btn" type="submit" onClick={handleSignup}>Sign Up</button>
            </form>
        </div>
    )
} 