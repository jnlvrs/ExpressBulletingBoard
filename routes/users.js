var express = require('express');
var router = express.Router();
var models = require('../models')
var authService = require('../services/auth');
var mysql = require('mysql2')



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET signup
router.get('/signup', function (req, res, next) {
  res.render('signup');
});
// POST signup
router.post('/signup', function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        UserName: req.body.userName
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password),
        Deleted: false,
        Admin: false
      }
    }).spread(function (result, created) {
      if (created) {
        res.redirect('login');
      } else {
        res.send('This user already exists')
      }
    });
});

// GET login
router.get('/login', function (req, res, next) {
  res.render('login');
});
// POST login
router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      UserName: req.body.userName
    }
  }).then(user => {
    if (!user) {
      console.log('User not found')
      return res.status(401).json({
        message: "Login Failed"
      });
    } else {
      let passwordMatch = authService.comparePasswords(req.body.password, user.Password);
      if (passwordMatch) {
        let token = authService.signUser(user);
        res.cookie('jwt', token);
        if (user.Admin === true){          
          res.redirect('/users/admin')          
        }else {
          res.redirect('profile/' + user.UserId)
        }
      } else {
        console.log('Wrong password');
        res.send('Wrong password');
      }
    }
  });
});


router.get('/admin',function(req, res, next){
  models.users.findAll({ where: { Admin: false, Deleted: false } }).then(resultsFound => {
    res.render('admin', { usersInfo: resultsFound })
  });
})

// Step 9
// Admin users should be able to click on a user and view their information, but not edit their information
// Use the route / users / admin / editUser /: id
// I already had the view made with the name edit user but it has all the functionality it requires
router.get('/adminviewuser/:id', function(req, res, next){
  let paramId = parseInt(req.params.id)
  models.users.findByPk(paramId)
      .then(user => {
        if (user) {
          models.posts.findOne({
            where: {
              UserId: paramId,
            }
          }).then(post => {
            if (post = !null) {
              models.posts.findAll({ where: { UserId: paramId, Deleted:false } })
                .then(userPost => {
                  if (userPost) {
                    res.render('adminviewuser', {
                      postsByUser: userPost,
                      FirstName: user.FirstName,
                      LastName: user.LastName,
                      Email: user.Email,
                      UserName: user.UserName,
                      UserId: user.UserId
                    });
                  }
                })
            } else {
              res.render('adminviewuser', {
                FirstName: user.FirstName,
                LastName: user.LastName,
                Email: user.Email,
                UserName: user.UserName,
                UserId: user.UserId
              })
            }
          })
        } else {
          res.send('User not found');
        }
      })
})
// GET the user's profile
router.get('/profile/:id', function (req, res, next) {
  let token = req.cookies.jwt;
  let paramId = parseInt(req.params.id)
  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user) {
          models.users
            .findByPk(paramId)
            .then(user => {
              if (user) {
                models.posts.findOne({
                  where: {
                    UserId: paramId,
                  }
                }).then(post => {
                  if (post = !null) {
                    models.posts.findAll({where : {UserId : paramId, Deleted: false}})
                    .then(userPost =>{
                      if(userPost){
                        res.render('profile', {
                          postsByUser: userPost,
                          FirstName: user.FirstName,
                          LastName: user.LastName,
                          Email: user.Email,
                          UserName: user.UserName,
                          UserId: user.UserId
                        });
                      }
                    })            
                  } else {
                    res.render('profile',{
                      FirstName: user.FirstName,
                      LastName: user.LastName,
                      Email: user.Email,
                      UserName: user.UserName,
                      UserId: user.UserId
                    })
                }})   
              } else {
                res.send('User not found');
              }
            })
        }    
      }); 
  } else {
    res.status(401);
    res.send('Must be logged in');
  }
});

// GET User's profile to Update
router.get('/edit/:id',function(req, res,next){
  let userId = parseInt(req.params.id);
  models.users.findByPk(userId)
    .then(user=>{
      if(user){
        res.render('edituser',{
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          UserId: user.UserId,
        })
      } else{
        res.send(user)
      }
  })
})    

// POST Submit update Profile
router.post('/update/:id', function(req, res, next){
  let userId = parseInt(req.params.id);
  models.users.update({
    FirstName: req.body.firstName,
    LastName: req.body.lastName,
    Email: req.body.email
  }, {
    where: {
      UserId:userId
    }
  }).then(result =>{
    res.redirect('/users/profile/' + userId)
  }).catch(() => {
    res.status(400).send("error")
  })
});

// "Delete" technacally am updating and erasing data from user since if i use .destroy it would remove it completely and i need the deleted colum to be updated
router.post('/delete/:id', function (req, res, next) {
  let userId = parseInt(req.params.id);
  models.posts.findOne({
    PostId:req.params.id
  }).then(result=>{
    if(result){
      models.users.findOne({
        where:{
          UserId: userId
        }})
    }}).then(user=>{
      models.posts.update({
          PostTitle: null,
          PostBody: null,
          Deleted: true
        },{
          where:{
            UserId: userId
          }
    }).then(
        models.users.update({
          FirstName: null,
          LastName: null,
          Email: null,
          UserName: null,
          Password: null,
          Deleted: true
        }, {
          where: {
            UserId: userId
          }
        }).then(
            res.redirect('/users/admin')
        )
    )})
});


// POST Logout
router.post('/logout', function (req, res, next) {
  res.cookie('jwt', "", { expires: new Date(0) });
  res.redirect('login');
})
module.exports = router;