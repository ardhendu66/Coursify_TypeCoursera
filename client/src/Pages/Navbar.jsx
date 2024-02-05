import { useEffect, useState } from 'react'
import axios from 'axios'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

export default () => {
    const [username, setUsername] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:3000/admin/profile', {
            headers: {
                "Content-Type": "application/json",
                'authorization': 'Bearer ' + localStorage.getItem("Token")
            }
        })
        .then(res => setUsername(res.data.username))
        .catch(err => setErrorMessage(err.message))
    }, [])

    if(username) {
        return (
            <>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: 10
                    }}
                >
                    <div>
                        <Typography>
                            <NavLink to={'/'} style={{textDecorationLine: 'none'}}>Coursify</NavLink>
                        </Typography>
                    </div>
                    <div>
                        <Typography variant='h5'>{username}</Typography>
                        <Button 
                            variant='contained' 
                            style={{marginRight: 10}}
                            onClick={() => {
                                localStorage.setItem("Token", null)
                                window.location = "/login"
                            }}
                        >Log Out
                        </Button>
                    </div>
                </div>
                <Outlet/>
            </>
        )
    }
    
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 10
                }}
            >
                <div>
                    <Typography>
                        <NavLink to={'/'} style={{textDecorationLine: 'none'}}>
                            Coursera
                        </NavLink>
                    </Typography>
                </div>
                <div>
                    <Button variant='contained' style={{marginRight: 10}}>
                        <NavLink
                            to={'/register'}
                            style={{textDecoration: 'none', color: 'white'}}
                        >Sign Up
                        </NavLink>
                    </Button>
                    <Button variant='contained' style={{marginLeft: 10}}>
                        <NavLink
                            to={'/login'}
                            style={{textDecoration: 'none', color: 'white'}}
                        >Log In
                        </NavLink>
                    </Button>
                </div>
            </div>
            <Outlet/>
        </>
    )
}