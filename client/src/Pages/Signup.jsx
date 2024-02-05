import { useState } from 'react'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import axios from 'axios'

export default () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const registerUserOnClick = (event) => {
        event.preventDefault()
        axios.post("http://localhost:3000/admin/signup", { username, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            localStorage.setItem("Token", res.data.token)
            localStorage.setItem("Admin", username)
            window.location = "/"
        })
    }
    
    return (
        <div
            style={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography 
                variant={'h5'}
                style={{margin: '40px 0px 20px 0px'}}
            >Welcome to Coursera. Sign-up below.</Typography>
            <Card 
                variant={'outlined'} 
                style={{
                    width: 360,
                    height: 200,
                    padding: '30px 30px'
                }}
            >
                <TextField  
                    label="Username" 
                    variant="filled"
                    fullWidth
                    style={{marginBottom: 15}}
                    onChange={e => setUsername(e.target.value)}
                />
                <TextField 
                    label="Password" 
                    variant="filled"
                    fullWidth
                    type='password'
                    style={{margin: '10px 0px'}}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    variant='contained' 
                    fullWidth
                    style={{marginTop: 15}}
                    onClick={registerUserOnClick}
                >Sign Up</Button>
            </Card>
        </div>
    )
}