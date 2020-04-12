const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const Register = require('./models/Register');
const CoffeeShop = require('./models/CoffeeShop');
const app= express();
const router = express.Router();
const bcrypt = require('bcrypt'); 
const multer=require('multer');
 const storage = multer.diskStorage({
     destination: function(req, file,cb) {
         cb(null, './uploads/');
     },
     filename: function(req, file, cb) {
         cb(null, file.originalname);
     }
});

 const fileFilter = (req, file, cb) =>{
     if(file.mimetype ==='image/jpeg' || file.mimetype === 'image/png'){
         cb(null, true);
     }
     else {
     cb(new Error('message'), false);
     }
 }
 const upload = multer({ 
     storage : storage 
 });

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/register');
mongoose.connect('mongodb://localhost:27017/points');
mongoose.connect('mongodb://localhost:27017/login');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MONGOdB DATABASE CONNECTION established successfully");
});

//ROUTES FOR REGISTRATION
router.post("/register/add",upload.single('photo'), (req, res, next) => {
    Register.find({ email : req.body.email })
    .exec()
    .then(issue => {
        if(issue.length>=1) {
            return res.status(409).json({
                message:'Mail exists'
            });
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err)
                {
                    return res.status(500).json({
                        error:err
                    });
                }
                else{
                    const issue= new Register({
                _id: new mongoose.Types.ObjectId(),
                name:req.body.name,
                email : req.body.email,
                gender :req.body.gender,
                phone_number:req.body.phone_number,
                alternate_number:req.body.alternate_number,
                dob :req.body.dob,
                photo : req.file.path,
                password : hash,
                security_que :req.body.security_que,
                security_ans :req.body.security_ans

                        });
                    issue.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message : "User Created"
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error : err
                        });
                    });
                    }
               });
        }    
        });
    });
     router.delete("/register/delete/:id", (req, res, next) => {
         Register.remove({ _id: req.params.id })
         .exec()
         .then(result => {
             res.status(200).json({
                 message: "User Deleted"
             });
         })
         .catch(err => {
             console.log(err);
             res.status(500).json({
                 error: err
             });
         });
     })
    
     router.post('/register/update/:id',(req, res) => {
            Register.findById(req.params.id, (err, issue) => {
                 if(!issue)
                     return next(new Error('Could not load document'));
                 else
                     issue.name= req.body.name;
                     issue.email= req.body.email;
                     issue.gender= req.body.gender;
                     issue.phone_number= req.body.phone_number;
                     issue.alternate_number= req.body.alternate_number;
                     issue.dob= req.body.dob;
                     issue.photo= req.body.photo;
                     issue.password=req.body.password;
                     issue.security_que= req.body.security_que;
                     issue.security_ans= req.body.security_ans;
                     issue.save().then(issue => {
                         console.log(issue);
                         res.json('update done');
                     }).catch(err => {
                         res.status(400).send('Update failed');
                     });
                 });
            });
        
//ROUTES FOR LOGIN
router.post("/login", (req, res, next)  => {
    Register.find({ email: req.body.email})
    .exec()
    .then(issue => {
            if(issue.length < 1)
            {
                return res.status(401).json({
                    message : "Authentication failed"
                });
            }
            bcrypt.compare(req.body.password, issue[0].password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        message : "Authentication failed"
                    });
                }
                if(result) {
                    return res.status(200).json({
                        message : "Authentication successful"
                });
            }
            return res.status(401).json({
                message : "Authentication failed"
            });
        })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}); 
});











































//ROUTES FOR FORGET PASSWORD
// router.post("/forget", (req, res, next)  => {
//     Register.find({ security_ans: req.body.security_ans})
//     .exec()
//     .then(issue => {
//             // if(issue.length < 1)
//             // {
//             //     return res.status(401).json({
//             //         message : "Authentication failed"
//             //     });
//             // }
//             bcrypt.compare(req.body.security_ans, issue[0].security_ans, (err, result) => {
//                 if(err) {
//                     return res.status(401).json({
//                         message : "Wrong answer "
//                     });
//                 }
//                 if(result) {
//                     return res.status(200).json({
//                         message : "Authentication successful"
//                 });
//             }
//             return res.status(401).json({
//                 message : "Authentication failed"
//             });
//         })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// }); 
// });
 

//Routes for coffeeshop
router.route('/points').get((req, res) => {
    CoffeeShop.find((err, points) => {
        if(err)
            console.log(err);
        else    
            res.json(points);
    });
});

router.route('/points/:id').get((req, res) =>
{
    CoffeeShop.findById(req.params.id, (err, issue) => {
        if(err)
            console.log(err);
        else
            res.json(issue);
    });
});

router.route('/points/add').post((req, res) => {
    let issue = new CoffeeShop(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({'issue' : 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/points/update/:id').post((req, res) => {
    CoffeeShop.findById(req.params.id, (err, issue) => {
        if(!issue)
            return next(new Error('Could not load document'));
        else
            issue.id= req.body.id;
            issue.name= req.body.name;
            issue.location= req.body.location;
            issue.description= req.body.description;
            issue.avg_rating= req.body.avg_rating;
            issue.mark_fav= req.body.mark_fav;
          
            issue.save().then(issue => {
                res.json('update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        });
   });

router.route('/points/delete/:id').get((req, res) => {
    CoffeeShop.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
    if(err) 
        res.json(err);
    else
        res.json('Remove successfully');
    })
})



app.use('/',router);

app.listen(3000, () => console.log("Express server running on port 3000"));