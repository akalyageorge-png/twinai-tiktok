import express from 'express';
import session from 'express-session';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app=express();
app.use(express.json());
app.use(express.static("public"));
app.use(session({
    secret: 'twinsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false} // Not recommended for production. Use Redis or MongoDB
}));

//TikTok OAuth endpoints
const TIKTOK_AUTH_URL = "https://www.tiktok.com/auth/authorize/";
const TIKTOK_TOKEN_URL = "https://open-api.tiktokglobal.com/oauth/access_token/";

app.get('/auth/tiktok',(req,res)=>{
    const redirectUri=process.env.CALLBACK_URL;
    const url=`${TIKTOK_AUTH_URL}?client_key=${process.env.TIKTOK_CLIENT_ID}&response_type=code&scope=user.info.basic&redirectUri=${redirectUri}&state=12345`;

    res.redirect(url);
});

app.get("/auth/tiktok/callback", async(req,res)=>{
    const {code}=req.query;
    try {
        const response= await axios.post(TIKTOK_TOKEN_URL,{
            client_key: process.env.TIKTOK_CLIENT_KEY,
            client_secret: process.env.TIKTOK_CLIENT_SECRET,
            code,
            grant_type:"authorization_code",
            redirect_uri: process.env.CALLBACK_URL,
        });
        req.session.tiktokToken= response.data.access_token;
        res.redirect("/?status=connected");
    } catch (error) {
        console.error(error);
        res.send("Error during TikTok OAuth");
    }
});

//Mock Go Live endpoint
app.get("/start-live", (req,res)=>{
    if(!req.session.tiktokToken){
        return res.json({
            message: "Not connected to TIKTOK"
        });
    }
    // Push your video RTMP here
    res.json({
        message: "Live stream started"
    })
});

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));

