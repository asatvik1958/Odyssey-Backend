import cors from 'cors';
import express from 'express';
import { connectToDB , db} from "./db.js";
import { error } from 'console';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { Sms2 } from './ms.js';



const app = express()
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "odyssey.adventure.alerts@gmail.com",
        pass: "zara wkzw wqtu xril",
        text: 'You have successfully created an account'

    }
})
let a;
let b;
const update = () =>
{
    console.log(a,b);
    db.collection("pord").updateMany({}, {$set:{status: "Accepted"}} )
    const mailOptions = {
        from: 'odyssey.adventure.alerts@gmail.com',
        to: a,
        subject: 'Odyssey: Booking approved',
        text: 'Your booking has been approved, kindly visit website for futher details'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}   

const getMnum = (mail) =>
{
    if (mail === "aditya.aptl@gmail.com")
    {
        return "+918247741411";
    }
    if (mail === "revanth23456@gmail.com")
    {
        return "+918247693087";
    }
};

const generateOtp = (length) => {
    const digits = '0123456789';
    let otp = '';
    otp += digits[Math.floor(Math.random() * (digits.length - 1)) + 1];
    for (let i = 1; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
  
    return otp;
  };
  
let otps; 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json("server is running successfully!");
})




app.post('/signup', async(req, res) => {
    await db.collection("cred").findOne({Email:req.body.Email})
    .then((result)=>{
        if (result === null)
        {
            db.collection("cred").insertOne({Fname:req.body.Fname, Lname:req.body.Lname, Age:req.body.Age, Mnum: req.body.Mnum, Email: req.body.Email, Pwd:req.body.Pwd, Gen:req.body.Gen})
            const mailOptions = {
                from: 'odyssey.adventure.alerts@gmail.com',
                to: req.body.Email,
                subject: 'Odyssey Account Created',
                text: 'You have succesfully created an account. Start your new adventure'
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log('Error:', error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.json({message:"account created", values:result})
        }
        else
        {
            res.json({error:"Email already in use"})
        }
    })
    .catch((e)=>console.log(e))
})




app.post('/signin', async(req, res) => {
    await db.collection("cred").findOne({Email:req.body.Email})
    .then((result)=>{
        if(result?.Pwd===req.body.Pwd){
            res.json({message:"login sucess", values:result})
        } else {
            res.json({error:"Wrong credentials"})
        }
    })
    .catch((e)=>console.log(e))
})


app.post('/userdata', async(req, res) => {
    await db.collection("cred").find().toArray()
    .then((result)=>{
        res.send(result)
    })
    .catch((e)=>console.log(e))
})

app.post('/landing', async(req, res) => {
    await db.collection("sportsInd").find().toArray()
    .then((result)=>{
        res.send(result)
    })
    .catch((e)=>console.log(e))
})

app.post('/orders', async(req, res) => {
    await db.collection("pord").find().toArray()
    .then((result)=>{
        res.send(result)
    })
    .catch((e)=>console.log(e))
})


app.post('/resetpwd', async(req, res) => {
    await db.collection("cred").findOne({Email:req.body.Email})
    await db.collection("cred").updateOne({Email:req.body.Email}, {$set:{Pwd: req.body.Pwd}})
    await db.collection("cred").findOne({Email:req.body.Email})
    .then((result)=>{
        if (result === null)
        {

            res.json({error:"No account with given email"})

        }
        else
        {
            db.collection("cred").updateOne({Email:req.body.Email}, {$set:{Pwd: req.body.Pwd}})
            res.json({message:"Password updates", values:result})
        }
    })
    .catch((e)=>console.log(e))

})




app.post('/booking', async(req, res) => {
    await db.collection("pord").insertOne(req.body)
    .then((result)=>{
        const mailOptions = {
            from: 'odyssey.adventure.alerts@gmail.com',
            to: req.body.user,
            subject: 'Regarding your booking | '+req.body.title,
            text: 'We have processed your request for the  booking ||' + req.body.title + ' || we arr processing your booking on medical grounds and avialibility. you will be notified once status updates '
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log('Error:', error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
            res.json({message:"Booking processed", values:result})
    })
    .catch((e)=>console.log(e))
})

app.post('/status', async(req, res) => {
    a=req.body.id;
    b=req.body.status
    console.log(req.body.id, req.body.status)
    update();
    await db.collection("pord").updateOne({id: req.body.user}, {$set:{status: req.body.status}})
    .then((result)=>{
        db.collection("pord").updateOne({id: req.body.user}, {$set:{status: req.body.status}})
        res.send(result)
        console.log(result)
    })
    .catch((e) => console.log(e))

})
app.post('/admin', async(req, res) => {
    await db.collection("pord").find({status:"pending"}).toArray()
    .then((result)=>{
        res.send(result)
    })
    .catch((e)=>console.log(e))
})

app.post('/otp', async(req, res) => {
    const user= db.collection("cred").findOne({Email:req.body.Email})
    const num = getMnum(req.body.Email)
    otps =  generateOtp(6).toString()
    console.log(req.body.Email)
    Sms2(num, otps)
            res.json({otp:otps})

})
app.post('/payment', async(req, res) => {
    await  db.collection("payments").insertOne( {auth: req.body.auth, team: req.body.teamWithSomeone, sport: req.body.sport, cost: req.body.cost, sptrl: req.body.url})
    .then((result)=>{
            const mailOptions = {
                from: 'odyssey.adventure.alerts@gmail.com',
                to: req.body.auth.Email,
                subject: 'Payment Succesful',
                text:   `Your payment of amount ${req.body.cost} was successful`,
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log('Error:', error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.json({message:"account created", status:200})
        
    })
    .catch((e)=>console.log(e))


})
app.post('/bkords', async(req, res) => {
    await db.collection("payments").find().toArray()
    .then((result)=>{
        res.send(result)
    })
    .catch((e)=>console.log(e))
})

connectToDB(() => {
    app.listen(9000, () => {
        console.log("server running at 9000");
    })
});