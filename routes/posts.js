var express = require('express');
var router = express.Router();
var models = require('../models')
var authService = require('../services/auth');



// GET posts site
router.get('/', function (req, res, next) {
    let token = req.cookies.jwt;

    if (token) {
        authService.verifyUser(token)
            .then(user =>{
                res.render('posts',{
                    UserId: user.UserId,
                    UserName: user.UserName
                })
            })               
    } else {
        res.status(401);
        res.send('Must be logged in');
    }
});


// Post submit a post 
router.post('/submit/:id',function(req, res, next){
    let userId = parseInt(req.params.id)
    models.posts.findOrCreate({
        where:{
            UserId: userId,
            PostTitle: req.body.postTitle,
            PostBody: req.body.postBody,
            Deleted: false
    }
    }).spread(function(results, created) {
      if(created){
          res.redirect('/users/profile/' + userId)
    } else{
        res.send('Problem sending post')
    }
    });
});

// GET Edit a Post
router.get('/edit/:id', function(req, res, next){
    let postId = parseInt(req.params.id);
    let token = req.cookies.jwt;

    if (token) {
        authService.verifyUser(token)
            .then(user => {
                models.posts.findOne({
                    where:{
                        PostId: postId
                    }
                }).then(post =>{
                    res.render('editpost', {
                        UserId: user.UserId,
                        UserName: user.UserName,
                        PostTitle: post.PostTitle,
                        PostBody: post.PostBody,
                        PostId: post.PostId
                })})
            })
    } else {
        res.status(401);
        res.send('Must be logged in');
    }
});

//Post for Submitting a edit post
router.post('/update/:id', function(req, res, next){
    let postId = parseInt(req.params.id);
    models.posts.update({
        PostTitle: req.body.postTitle,
        PostBody: req.body.postBody
    }, {
        where: {
            PostId: postId
        }
    }).then(result => {
        models.posts.findOne({
            where:{
                PostId: postId
            }
        }).then(post =>{
            res.redirect('/users/profile/' + post.UserId)    
        });
    }).catch(() => {
        res.status(400).send("error")
    })
});


router.post('/delete/:id', function (req, res, next) {
    let token = req.cookies.jwt
    let postId = parseInt(req.params.id);
    if(token){
        authService.verifyUser(token)
        .then(user =>{
            if(user.Admin === true){
                models.posts.findOne({
                    where: {
                        PostId: postId
                    }
                }).then(post => {
                    models.posts.update({
                        PostTitle: null,
                        PostBody: null,
                        Deleted: true
                    }, {
                        where: {
                            PostId: postId
                        }
                    }).then(result => {
                        res.redirect('/users/admin')
                    })
                })
            } else {
                models.posts.findOne({
                    where: {
                        PostId: postId
                    }
                }).then(post =>{
                    models.posts.update({
                    PostTitle: null,
                    PostBody: null,
                    Deleted: true
                }, {
                    where: {
                        PostId: postId
                    }
                }).then(result => {
                    res.redirect('/users/profile/' + post.UserId)
                })
                })
            }
        })
    }
});

module.exports = router;