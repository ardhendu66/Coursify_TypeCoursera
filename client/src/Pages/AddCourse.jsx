import { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import axios from 'axios'

export default () => {
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [price, setPrice] = useState(null)
    const [imageLink, setImageLink] = useState(null)
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const sendPostRequestToServer = () => {
        if(title && description && price && imageLink && message) {
            axios.post('http://localhost:3000/admin/courses', 
                {
                    title: title,
                    description: description,
                    price: price,
                    imageLink: imageLink,
                    published: false,
                    admin: localStorage.getItem("Admin")
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": "Bearer " + localStorage.getItem("Token")
                    }
                }
            )
            .then(res => setMessage(res.data.message))
            .catch(err => setErrorMessage(err.message))
        }
        else {
            setErrorMessage("Fill up all the details correctly")
        }
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
            >Add all details of a Course below.</Typography>
            <Card 
                variant={'outlined'} 
                style={{
                    width: 360,
                    height: 325,
                    padding: '30px 30px'
                }}
            >
                <TextField 
                    label="Course-Title"
                    fullWidth
                    onChange={e => setTitle(e.target.value)}
                    style={{marginBottom: 15}}
                />
                <TextField 
                    label="Course-Description"
                    fullWidth
                    onChange={e => setDescription(e.target.value)}
                    style={{marginBottom: 15}}
                />
                <TextField 
                    label="Course-Price"
                    fullWidth
                    onChange={e => setPrice(e.target.value)}
                    style={{marginBottom: 15}}
                />
                <TextField 
                    label="Image-Link"
                    fullWidth
                    onChange={e => setImageLink(e.target.value)}
                    style={{marginBottom: 15}}
                />
                <Button
                    variant='contained'
                    fullWidth
                    onClick={sendPostRequestToServer}
                >Add Course</Button>
            </Card>
            <Card 
                variant='outlined'
                style={{
                    margin: 20,
                    padding: 15,
                    fontFamily: 'sans-serif',
                    fontSize: 13
                }}
            >{message || errorMessage}</Card>
        </div>
    )
}