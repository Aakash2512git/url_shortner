const express=require("express");
const urlRoute=require("./routes/url");
const { connectMongo } = require("./connect");
const URL=require('./models/url');
const app=express();
app.use(express.json());
const PORT=8001;

connectMongo("mongodb+srv://akashshuklaankur:@cluster0.qznz2sv.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log('databse connected'));

app.use("/url",urlRoute);
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    console.log('Short ID:', shortId);

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );

    

    if (entry) {
        console.log('Redirecting to:', entry.redirectURL);
        res.redirect(entry.redirectURL);
    } else {
        console.log('Short URL not found');
        res.status(404).send("Short URL not found");
    }
});




app.listen(PORT,()=>console.log(`server started on ${PORT}`));

