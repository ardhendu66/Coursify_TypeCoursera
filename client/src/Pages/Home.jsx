import { NavLink } from 'react-router-dom'
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'

export default () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 30
            }}
        >
            <h1 style={{textAlign: 'center'}}>Welcome to the Course-Selling Website</h1>
            <div
                style={{
                    width: '70vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20
                }}
            >
                <Card
                    style={{
                        width: 400,
                        height: 250,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant='h3'>
                        <NavLink to={'/admincourse'} style={{textDecorationLine: 'none'}}>
                            Admin Courses
                        </NavLink>
                    </Typography>
                </Card>
            </div>
        </div>
    )
}