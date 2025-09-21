import express from "express";
import authRouter from "../module/auth/auth.route.js";
import subscriptionRouter from "../module/subscriptionPlan/subscription.route.js";
import paymentRouter from "../module/payment/payment.route.js";
import userRouter from "../module/user/user.route.js";
import businessRouter from "../module/business/business.route.js";
import interestedRouter from "../module/interested/interested.route.js";
import subscriberRouter from "../module/subscriber/subscriber.route.js";
import scheduleRouter from "../module/schedule/schedule.route.js";
import couponRouter from "../module/coupon/coupon.route.js";
import faqRouter from "../module/FAQ/faq.route.js";
import formationRouter from "../module/formation/formation.router.js";
import homeRouter from "../module/home/home.route.js";
import ndaRouter from "../module/NDA/nda.route.js";
import agreementRouter from "../module/agreement/agreement.route.js";
// import webhookRouter from "../module/payment/webhook.routes.js";
import categoryRouter from "../module/category/category.route.js";
import chatRouteRouter from "../module/chat/chat.routes.js";
import notificationRouter from "../module/notification/notification.route.js";
import dashboardRouter from "../module/dashboard/dashboard.route.js";


const allRouter = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        router: authRouter
    },
    {
        path: "/subscription",
        router: subscriptionRouter
    },
    {
        path: "/payment",
        router: paymentRouter
    },
    {
        path: "/user",
        router: userRouter
    },
    {
        path: "/business",
        router: businessRouter
    },
    {
        path: "/interested",
        router: interestedRouter
    },
    {
        path: "/subscriber",
        router: subscriberRouter
    },
    {
        path: "/coupon",
        router: couponRouter
    },
    {
        path: "/faq",
        router: faqRouter
    },
    {
        path: "/formation",
        router: formationRouter
    },
    {
        path: "/schedule",
        router: scheduleRouter
    },
    {
        path: "/home",
        router: homeRouter
    },
    {
        path: "/nda",
        router: ndaRouter
    },
    {
        path: "/agreement",
        router: agreementRouter
    },
    {
        path: "/category",
        router: categoryRouter
    },
    {
        path: "/chat",
        router: chatRouteRouter
    },
    {
        path: "/notification",
        router: notificationRouter
    },
    {
        path: "/dashboard",
        router: dashboardRouter
    },
     

];

moduleRoutes.forEach((route) => allRouter.use(route.path,route.router));

export default allRouter;