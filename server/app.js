const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000
const secretKeyForAdmin = "ASDFGHJKLPOIUYTREWQZXCVBNM!@#$%^&*()sywfsn,tpmfjdj"
const secretKeyForUser = "asdfghjklmnbvcxzqwertyuiop!@#$%^&*()HEWIHEIFENCU.,;'[]"

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
})

const adminSchema = new mongoose.Schema({
    username: String, password: String
})

const coursesSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: {
        type: Boolean,
        default: false
    },
    admin: String
})

const User = mongoose.model("User", userSchema)
const Admin = mongoose.model("Admin", adminSchema)
const Course = mongoose.model("Course", coursesSchema)

const generateToken = (payload, secretKey) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' })
}
const authenticateJwtAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, secretKeyForAdmin, (err, user) => {
            if(err) {
                return res.status(403).json({message: "Token authorization failed"})
            }
            req.user = user
            next()
        })
    }
    else {
        res.status(401).json({message: "Jwt authentication failed"})
    }
}
const authenticateJwtUser = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, secretKeyForUser, (err, user) => {
            if(err) {
                return res.status(403).json({message: "Token authorization failed"})
            }
            req.user = user
            next()
        })
    }
    else {
        res.status(401).json({message: "Jwt authentication failed"})
    }
}

mongoose.connect("mongodb://127.0.0.1:27017/Authentication")
.then(res => console.log('mongodb connected'))
.catch(e => console.error(e.message))


// Admin route management
app.post('/admin/signup', async (req, res) => {
    const { username, password } = req.body
    const admin = await Admin.findOne({username})
    if(admin) {
        res.status(403).json({message: "Admin already exists"})
    }
    else {
        const newAdmin = new Admin({ username, password })
        await newAdmin.save()
        const token = generateToken({username, role: 'admin'}, secretKeyForAdmin)
        res.status(201).json({message: "Admin created successfully", token: token})
    }
})
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body
    const admin = await Admin.findOne({ username, password })
    if(admin) {
        const token = generateToken({username, role: 'admin'}, secretKeyForAdmin)
        res.json({message: "Logged in successfully", token: token})
    }
    else {
        res.status(403).json({message: "Invalid username or password"})
    }
})
app.post('/admin/courses', authenticateJwtAdmin, async (req, res) => {
    try {
        const course = new Course({...req.body, admin: req.user.username})
        await course.save()
        res.status(201).json({message: "Course created successfully"})
    }
    catch(err) {
        res.status(500).json({message: "Course creation failed"})
    }
})
app.put('/admin/courses/:courseId', authenticateJwtAdmin, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body)
    if(course) {
        res.status(202).json({message: "Course updated successfully"})
    }
    else {
        res.status(404).json({message: "Course not found"})
    }
})
app.get('/admin/courses', authenticateJwtAdmin, async (req, res) => {
    const courses = await Course.find({admin: req.user.username})
    res.json({Courses: courses})
})
app.get('/admin/profile', authenticateJwtAdmin, (req, res) => {
    res.json({username: req.user.username})
})
app.get('/admin/courses/:courseId', authenticateJwtAdmin, async (req, res) => {
    const course = await Course.findById({_id: req.params.courseId})
    res.json({Course: course})
})


// User route management
app.post('/users/signup', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({username})
    if(user) {
        res.status(403).json({message: "User already exists"})
    }
    else {
        const newUser = new User({ username, password })
        await newUser.save()
        const token = generateToken({username, role: 'user'}, secretKeyForUser)
        res.status(201).json({message: "User created successfully", token: token})
    }
})
app.post('/users/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username, password })
    if(user) {
        const token = generateToken({username, role: 'user'}, secretKeyForUser)
        res.json({message: "Logged in successfully", token: token})
    }
    else {
        res.status(403).json({message: "Invalid username or password"})
    }
})
app.get('/users/courses', authenticateJwtUser, async (req, res) => {
    const courses = await Course.find({published: true})
    res.json({Courses: courses})
})
app.post('/users/courses/:courseId', authenticateJwtUser, async (req, res) => {
    const course = await Course.findById(req.params.courseId)
    console.log(course);
    if(course) {
        const user = await User.findOne({username: req.user.username})
        if(user) {
            user.purchasedCourses.push(course)
            await user.save()
            res.status(201).json({message: "Course purchased successfully"})
        }
        else {
            res.status(403).json({message: "User not found"})
        }
    }
    else {
        res.status(404).json({message: "Course not found"})
    }
})
app.get('/users/purchasedCourses', authenticateJwtUser, async (req, res) => {
    const user = await User.findOne({username: req.user.username}).populate('purchasedCourses')
    if(user) {
        res.json({purchasedCourses: user.purchasedCourses || []})
    }
    else {
        res.status(403).json({message: "User not found"})
    }
})


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})