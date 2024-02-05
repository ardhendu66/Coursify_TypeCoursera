import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default () => {
    const [course, setCourse] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const adminCourse = []

    useEffect(() => {
        axios.get('http://localhost:3000/admin/courses', {
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("Token")
            }
        })
        .then(res => {
            setCourse(res.data.Courses)
        })
        .catch(err => setErrorMessage(err.message))
    }, [])

    for(let i = 0; i < course.length; i++) {
        if(course[i].admin === localStorage.getItem("Admin")) {
            adminCourse.push(course[i])
        }
    }
    console.log(adminCourse)

    return (
        <>
            <div 
                style={{
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center',
                }}
            >
                {
                    adminCourse.map(ele => (
                        <CourseComponent ele={ele} key={ele._id} />
                    ))
                }
                {errorMessage}
                {/* {JSON.stringify(adminCourse)} */}
            </div>
        </>
    )
}

export const CourseComponent = ({ele}) => {
    return (
        <Card 
            variant='outlined' 
            style={{
                width: 350,
                height: 160,
                margin: 30,
                padding: 20,
                textAlign: 'center',
                backgroundColor: 'green',
                color: 'white',
                borderRadius: 30,
                fontSize: 15,
                cursor: 'pointer',
            }}
            onClick={() => window.location = `/admincourse/${ele._id}`}
        >
            <Typography>{ele.title}</Typography>
            <Typography>{ele.description}</Typography>
            <Typography>{ele.price}</Typography>
            <img 
                src={ele.imageLink} 
                style={{width: 80, height: 80, borderRadius: '50%'}}
            />
        </Card>
    )
}