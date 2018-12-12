var express = require('express')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')

var Grocery = require('./models/groceries')
var Needed = require('./models/neededGroceries')
var User = require('./models/user')
var Roomate = require('./models/roomate')
var Bill = require('./models/bills')


var app = express();

app.set('view engine', 'html')
mongoose.connect('mongodb://ajwallace17:pass123@ds119088.mlab.com:19088/users', {useNewUrlParser: true})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: "application/json" }))


app.use(cookieSession({
  name: 'session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get('/bills', function (req, res) {
  User.find({email: req.session.user}, function(err, data) {
    Roomate.find({_id: data[0].roomateID}, function(err1, data1) {
      Bill.find({_id : {$in: data1[0].billIDs}}, function(err2, data2) {
        res.json({data: data2})
      })
    })
  })
})

app.get('/groceries', function (req, res) {
  User.find({email: req.session.user}, function(err, data) {
    Roomate.find({_id: data[0].roomateID}, function(err1, data1) {
      Grocery.find({_id : {$in: data1[0].groceryIDs}}, function(err2, data2) {
        res.json({data: data2})
      })
    })
  })
})

app.get('/needed', function (req, res) {
  User.find({email: req.session.user}, function(err, data) {
    Roomate.find({_id: data[0].roomateID}, function(err1, data1) {
      Needed.find({_id : {$in: data1[0].neededIDs}}, function(err2, data2) {
        res.json({data: data2})
      })
    })
  })
})

app.post('/addgroceryneeded', function(req, res) {
  User.find({email: req.session.user}, function(err, data) {
      var newNeed = new Needed({name: req.body.item, addedBy: req.session.user})
      newNeed.save(function(err, result) {
        Roomate.updateOne({_id: data[0].roomateID}, {$push: {neededIDs : result._id}}, function(err1, data1) {
          res.redirect('/groceries')
        })
      })
  })
})
  
  app.post('/deletegroceryneeded', function(req, res) {
    Needed.deleteOne({_id: Object.keys(req.body)[0]}, function(err, data) {
      User.find({email: req.session.user}, function(err1, data1) {
        Roomate.updateOne({_id: data1[0].roomateID}, {$pull: {neededIDs : {$in: [Object.keys(req.body)[0]]}}}, function(e, d) {
          res.redirect('/groceries')
        })
      })
    }) 
  })

  app.post('/completegroceryneeded', function(req, res) {
    User.find({email: req.session.user}, function(err, data) {
        Needed.find({_id: Object.keys(req.body)[1]}, function(err, da) {
          var grocery = new Grocery({name: da[0].name, cost: req.body.cost, purchaser: req.session.user, datePurchased: new Date()})
          grocery.save(function(err, result) {
            Roomate.updateOne({_id: data[0].roomateID}, {$push: {groceryIDs : result._id}}, function(err1, data1) {
              Needed.deleteOne({_id: Object.keys(req.body)[1]}, function(err, d) {
                Roomate.find({_id: data[0].roomateID}, function(ee, rr) {
                  var bill = new Bill({name: grocery.name, cost: grocery.cost, purchaser: grocery.purchaser, datePurchased: grocery.datePurchased, split: rr[0].members.length})
                  bill.save(function(er, re) {
                    Roomate.updateOne({_id: data[0].roomateID}, {$push: {billIDs : re._id}}, function(err1, data1) {
                      res.redirect('/groceries')
                    })
                  })
                })
                
              })
            })
          })
        })
    })
  })

app.get('/owe', function(req, res) {
  User.find({email: req.session.user}, function(err, data) {
    console.log(data)
    res.json({data: data})
  })
})

app.post('/splitbill', function(req, res) {
  var billID = Object.keys(req.body)[0]
  Bill.find({_id: billID}, function(err, data) {
    Roomate.find({members : {$in: [data[0].purchaser]}}, function(err1, data1) {
      console.log(data1)
      var arr = data1[0].members
      var ind = arr.indexOf(data[0].purchaser)
      var incr = data[0].cost / data[0].split
      for (var i = 0; i < arr.length; i++) {
        if (i !== ind) {
          User.updateOne({email: arr[i]}, {$inc: {amountOwed: incr}}, function(err2, data2) {
            console.log(data2)
            res.json({message: "ok"})
          })
        }
      }
    })
    //find roomate members with this bill id, divide everyone but the purchaser by split vale, increment userOwed amount
  })
})

app.post('/login', function(req, res) {
  if (req.body.email == '' || req.body.pass == '') {
    res.send({message: "All fields required"})
  } else {
    var user = {email: req.body.email, password: req.body.pass}
    var em = user.email
    var ps = user.password
    User.find({email: em, password: ps}, function(err, result) {
      if (result.length == 1) {
        req.session.user = req.body.email
        res.send({message: "ok"})
      } else {
        res.send({message: "Incorrect username or password. Please try again"})
      }     
    })
  }
})

app.post('/signup', function(req, res) {
  if (req.body.first == '' || req.body.last == '' || req.body.email == '' || req.body.pass == '') {
    res.send({message: "All fields required"})
  } else {
    var user = {firstName: req.body.first, lastName: req.body.last, email: req.body.email, password: req.body.pass}
    User.find({email:req.body.email}, function(err, result1) {
      if (err) {
        //error
      } else {
        if (result1.length == 0) {
          if (req.body.values == "new") {
            arr = [req.body.email]
            var roomate = new Roomate({members: arr, groceryIDs: [], neededIDs: [], billIDs: [], choreIDs: []})
            roomate.save(function(err, result2) {
              if (result2) {
                user.roomateID = result2._id
                user.amountOwed = 0
                var saveUser = new User(user)
                saveUser.save(function(err, result3) {
                  req.session.user = req.body.email
                  res.send({message: "ok"})
                })
              }
            })
          } else {
            User.find({email: req.body.roomate}, function(err, result4) {
              if (err) {
                //error
              } else {
                if (result4.length == 0) {
                  res.send({message: "Roomate requested is not a member. Please enter a valid user email."})
                } else {
                  req.session.user = req.body.email
                  user.roomateID = result4[0].roomateID
                  user.amountOwed = 0
                  var saveUser = new User(user)
                  saveUser.save(function(err, result5) {
                    Roomate.updateOne({_id: user.roomateID}, {$push: {members : user.email}}, function(err, d) {
                      res.send({message: "ok"})
                    })    
                  })
                }
              }
            })
          }
        } else {
          //user info taken, please try again
          res.send({message: "Desired username already taken, please pick a different one!"})
        }    
      }
    })
  }
}) 

app.listen(process.env.PORT || 3001, function () {
  console.log('App listening on port ' + (process.env.PORT || 3001))
})
