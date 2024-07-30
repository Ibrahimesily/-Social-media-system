const express = require('express')
const catchAsync = require('express-async-handler')
const fs = require('fs')
const app = express()
const port = 3000

const postsFile = fs.readFileSync(`${__dirname}/posts-data.json`,'utf8')
const allPosts = JSON.parse(postsFile)
//------------------------------------------------------- 1 - get all posts
app.get('/bianatTask/allPosts',catchAsync((req,res)=>{
    const page = req.query.page * 1 || 1 
    const limit = req.query.limit * 1 || allPosts.length
    const skipped = (page - 1) * limit
    if(page && skipped>allPosts.length){
        res.status(400).json({
            message:'page not found'
        })
    }
    const sortedPosts = allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const posts = sortedPosts.slice(skipped,skipped + limit)
    res.status(200).json({
        status:'success',
        length:ensureInteger(posts.length),
        posts
    })
}))
//------------------------------------------------------- 2 - get active users
app.get('/bianatTask/activeUsers',catchAsync(async (req,res)=>{
    const postsWithActiveUsers = await allPosts.filter(post => post.user.active === true)
    const activeUsers = postsWithActiveUsers.map(post => {
        return post.user
    });
    res.status(200).json({
        status:'success',
        length:ensureInteger(activeUsers.length),
        activeUsers
    })
}))
//------------------------------------------------------- 3 - get inactive users
app.get('/bianatTask/inactiveUsers',catchAsync(async (req,res)=>{
    const postsWithInactiveUsers = await allPosts.filter(post => post.user.active === false)
    const inactiveUsers = postsWithInactiveUsers.map(post => {
        return post.user
    });
    res.status(200).json({
        status:'success',
        length:ensureInteger(inactiveUsers.length),
        inactiveUsers
    })
}))
//------------------------------------------------------- 4 - get post likes
app.get('/bianatTask/postLikes/:id',catchAsync(async (req,res)=>{
    const postId = req.params.id
    const post =await allPosts.filter(post => post.id === postId)
    const postLikes = post[0].likes
    const activeUsersLikes = await postLikes.filter(user => user.active === true)
    res.status(200).json({
        status:'success',
        activeUsersLikes : ensureInteger(activeUsersLikes.length)
    })
}))
//------------------------------------------------------- 5 - filter posts by category
app.get('/bianatTask/filterPostsByCategory',catchAsync(async (req,res)=>{
    const category = req.query.category
    const posts =await allPosts.filter(post => post.categories.some(el => el.name === category ))
    res.status(200).json({
        status:'success',
        posts
    })
}))
//------------------------------------------------------- 6 - Ensure Integer Data
const ensureInteger =(value)=> {return parseInt(value)}
//-------------------------------------------------------
app.listen(port,()=>{
    console.log(`server is running on port ${port} 💙💙💙`)
})


