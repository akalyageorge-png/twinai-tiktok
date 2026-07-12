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
    saveUninitialized: true
}));

//TikTok OAuth endpoints
const TIKTOK_AUTH_URL = "https://www.tiktok.com/auth/authorize/";
const TIKTOK_TOKEN_URL = "https://open-api.tiktokglobal.com/oauth/access_token/";

app.get('/auth/tiktok',(req,res)=>{
    const redirectUri=process.env.CALLBACK_URL;
})
