import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from 'nodemailer'
import {google} from 'googleapis'
import Order from "../models/order.js";
import { emailTemplate, isAuth } from "../utlis.js";

const orderRouter= express.Router()


const CLIENT_ID='836515059620-e8mgv5flipan48tco2u1q2ruamhuuv9s.apps.googleusercontent.com';
const CLIENT_SECRET='AMSboUAwW8vRD7Z9D9Q8jugt';
const REDIRECT_URI='https://developers.google.com/oauthplayground';
const REFRESH_TOKEN='1//04iEaw-1-p7GwCgYIARAAGAQSNwF-L9IrNtEOQTyih2HkjpsSzX1TzWR0h1_ntRZVbVEZJZiAaKMSLf_551fVCd9d-wXtgv5_MbU';


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});



orderRouter.get('/',isAuth,expressAsyncHandler(async(req,res)=>{
    const orders = await Order.find({userId:req.user._id})
    res.send(orders)
}))
orderRouter.get('/admin-orders',expressAsyncHandler(async(req,res)=>{
    const orders = await Order.find().sort({_id:-1}).limit(20)
    res.send(orders)
}))



orderRouter.post('/',isAuth,expressAsyncHandler(async(req,res)=>{
 if(req.body.orderItems.length===0){
  res.status(400).send({message:'cart is empty!'})
 }
 else{
    
     const newOrder= new Order({
        orderItems:req.body.orderItems,
        shippingAddress:req.body.shippingAddress,
        paymentMethod:req.body.paymentMethod,
        itemsPrice:req.body.itemsPrice,
        totalprice:req.body.totalprice,
        shippingPrice:req.body.shippingPrice,
        paymentId:req.body.paymentId,
        userId:req.user._id,
        email:req.body.email,
        userName:req.body.userName
     })
    
     const order = await newOrder.save()
     res.status(201).send({message:'Order Placed !',order:order})

 }
}))

orderRouter.get('/:id',isAuth,expressAsyncHandler(async(req,res)=>{
    const {id} = req.params;
   const order =await Order.findById(id)
   if(order){
      res.send(order)
   }
   else{
    res.status(404).send({message:'Order Not Found'})
   }
}))


export default orderRouter;