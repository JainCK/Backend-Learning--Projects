const express = require('express');
const zod = require('zod');
const app = express();

//const schema = zod.array(zod.number());

const schema = zod.object({
    email : zod.string(),
    password: z.string,
    country: z.literal("IN")
})

  
app.use(express.json());

app.post("/health-checkup",  function (req, res) {
  // kidneys = [1, 2]
  const kidneys = req.body.kidneys;
  const response = schema.safeParse(kidneys)
  if (!response.success) {
    res.status(411).json({ msg: "Invalid input" });
  } else {
    res.send(response);
  }
  })






//app.get('/health-check', (req, res) => {

//const username = req.headers.username;
//const password = req.headers.password;
//const kidneyId = req.headers.kidneyId;
//
//    if(username === "jain" && password === "pass") {
//        res.status(400).json({"msg": "Somethings up with your ionputs"})
//        return
//    }
//
//    if (kidneyId != 1 && kidneyId != 2) {
//        res.status(400).json({"msg": "Somethings up with your ionputs"})
//        return
//    }
//
//    res.json({
//        msg: "Your kidney is fine!"
//    })
//
//});

//app.use(express.json());
//
//app.post('/health-checkup', (req, res) => {
//    const kid = req.body.kid;
//    const kidLength = kid.length;
//
//    res.send ("you have" + kidLength + "kids");
//})
//
////globsl catch
//
//app.use( (err, res, res, next) => {
//    res.json ({
//        msg: "an error occoured"
//    })
//})

app.listen(3000);
