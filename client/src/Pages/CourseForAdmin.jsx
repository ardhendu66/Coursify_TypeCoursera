import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Card, Typography, TextField, Button, Checkbox } from '@mui/material'
import { CourseComponent } from './AdminCourses'

export default () => {
    const { courseId } = useParams()
    const [courses, setCourses] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:3000/admin/courses`, {
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("Token")
            }
        })
        .then(res => setCourses(res.data.Courses))
        .catch(err => setErrorMessage(err.message))
    }, [])
    
    let course = null
    for(let index = 0; index < courses.length; index++) {
        if(courses[index]._id === courseId) {
            course = courses[index]
        }
    }

    if(!course) {
        return <h1>Loading...</h1>
    }

    return (
        <center>
            <CourseComponent ele={course} />
            <UpdateCourse course={course} />
        </center>
    )
}

const UpdateCourse = ({course}) => {
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [price, setPrice] = useState(null)
    const [imageLink, setImageLink] = useState(null)
    const [publishedValue, setPublishedValue] = useState(null)
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const sendPutRequestToServer = () => {
        axios.put(`http://localhost:3000/admin/courses/${course._id}`,
            {
                title: (title !== null) ? title : course.title,
                description: (description !== null) ? description : course.description,
                price: (price !== null) ? price : course.price,
                imageLink: (imageLink !== null) ? imageLink : course.imageLink,
                published: (publishedValue !== null) ? publishedValue : course.published
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    'authorization': 'Bearer ' + localStorage.getItem("Token")
                }
            }
        )
        .then(res => setMessage(res.data.message))
        .catch(err => setErrorMessage(err.message))
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
                    height: 368,
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
                    style={{marginBottom: 4}}
                />
                <Checkbox 
                    sx={{'& .MuiSvgIcon-root': {fontSize: 36}}}
                    onChange={(e) => {
                        setPublishedValue(e.target.checked)
                        console.log(publishedValue)
                    }}
                />
                <Button
                    variant='contained'
                    fullWidth
                    onClick={sendPutRequestToServer}
                    style={{marginTop: 4}}
                >Update Course</Button>
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