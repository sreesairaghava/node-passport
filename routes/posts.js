const router = require('express').Router()
const verify = require('./verifyToken')
router.get('/',verify,(req,res)=>{
    res.json({
        title:"My first post",
        content:"This is content of first post"
    })
})

module.exports = router;