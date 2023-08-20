//const {nanoid}=require("nanoid");
//const shortid = require('shortid');
const ShortUniqueId = require('short-unique-id');

const URL =require('../models/url'); 


async function handelGenerateNewShortURL(req,res){
          const body=req.body;

             if(!body.url) return res.status(400).json({error:'url is required'});


             const uid = new ShortUniqueId();
             const shortID = uid.randomUUID(5);
          await URL.create(
            {   shortId:shortID,
                  redirectURL:body.url,
                  visitHistory:[],

            }
          );

          return res.json({id:shortID});
}


async function handelGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const totalClick = result.visitHistory.length;
        const analytics = result.visitHistory;

        return res.json({ totalClick, analytics });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching analytics' });
    }
}



module.exports={
    handelGenerateNewShortURL,handelGetAnalytics,
}