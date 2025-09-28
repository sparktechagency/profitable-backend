import ApiError from "../../../error/ApiError.js";
import validateFields from "../../../utils/validateFields.js";
import brokerSubscriptionPlanModel from "./brokerSubscriptionPlan.model.js";
import SubscriptionPlanModel from "./subscription.model.js";
import PaymentModel from "../payment/payment.model.js";



//post a new subscription plan service
export const postNewSubscriptionPlanService = async (payload) => { 
    const {subscriptionPlanType, subscriptionPlanRole,features, price, duration  } = payload;

    validateFields(payload,["subscriptionPlanType","subscriptionPlanRole","features","price"]);

    if(subscriptionPlanRole === "Broker"){
         //create a new subscription plan
        const brokerSubscriptionPlan = await brokerSubscriptionPlanModel.create({
            subscriptionPlanType, subscriptionPlanRole,features, price 
        });

        //check if new plan is created or not
        if(!brokerSubscriptionPlan){
            throw new ApiError(500, "Failed to create Broker subscription");
        }

        return brokerSubscriptionPlan;
    }

    //create a new subscription plan
    const newSubscriptionPlan = await SubscriptionPlanModel.create({
        subscriptionPlanType, subscriptionPlanRole,features, price, duration 
    });

    //check if new plan is created or not
    if(!newSubscriptionPlan){
        throw new ApiError(500, "Failed to create new subscription");
    }

    return newSubscriptionPlan;
    
}

//update subscription plan service
export const updateSubscriptionService = async (req) => {

    const {subscriptionId,role} = req.query;
    if(!subscriptionId || !role) throw new ApiError(400, "Subscription id, role is required to update");

    const {subscriptionPlanType,subscriptionPlanRole,price,features,duration} = req.body;

    if(role === "Broker"){
        const subscription = await brokerSubscriptionPlanModel.findById(subscriptionId);

        if(!subscription) throw new ApiError(404, "Subcription not found to update");

        if(features) subscription.features = features;
        if(price) subscription.price = price;
        await subscription.save();

        return subscription;
    }

    const subscription = await SubscriptionPlanModel.findById(subscriptionId);

    if(!subscription) throw new ApiError(404, "Subcription not found to update");

    if(price) subscription.price = price;
    if(duration) subscription.duration = duration;
    if(features) subscription.features = features;

    await subscription.save();

    return subscription;
}

//get user role based subscription plan service
export const getAllSubscriptionPlanByUserRoleService = async(userDetails,query) => {
    const userId = userDetails.userId;
    // console.log(userId);
    const {role} = query;

    //check if role is available or not
    if(!role) throw new ApiError(400, "User role is needed to get user's subscription option");   

    if(role === "Broker"){
        //filter subscriptions from subscription collection
        const brokerSubscription = await brokerSubscriptionPlanModel.find({});

        if(!brokerSubscription){
            throw new ApiError(500, "failed to get broker subscription plan");
        }

        return brokerSubscription;
    }
     

    //filter subscriptions from subscription collection
    let allSubscription;
    allSubscription = await SubscriptionPlanModel.find({subscriptionPlanRole: role});

    if(!allSubscription){
        throw new ApiError(500, "failed to get subscription option");
    }

    //check if this user already have used Free Plan or not
    const hasFreePlan = await PaymentModel.findOne({user: userId,duration: "15 Days"});
    // console.log(hasFreePlan);
    if(hasFreePlan){
        //if used free plan then don't show free plan again
        allSubscription = allSubscription.filter((plan) => plan.duration !== "15 Days" );
        // console.log(allSubscription);
    }

    return allSubscription;

}


//get user role based subscription plan service
export const getSingleSubscriptionPlanService = async(query) => {
    const { subscriptionId,role } = query;

    //check if role is available or not
    if(!subscriptionId || !role){
        throw new ApiError(400, "Subscription Id, role are needed to get user's subscription plan");   
     }

     if(role === "Broker"){
        //filter subscriptions from subscription collection
        const subscription = await brokerSubscriptionPlanModel.findById(subscriptionId);

        if(!subscription){
            throw new ApiError(500, "failed to get subscription plan");
        }

        return subscription;
     }

    //filter subscriptions from subscription collection
    const subscription = await SubscriptionPlanModel.findById(subscriptionId);

    if(!subscription){
        throw new ApiError(500, "failed to get subscription plan");
    }

    return subscription;

}

//dashboard

//dashboard single plan service
export const dashboardSinglePlanService = async (query) => {
    const { subscriptionName,role } = query;

    //check if role is available or not
    if(!subscriptionName || !role){
        throw new ApiError(400, "Subscription Plan Name, role are needed to get user's subscription plan");   
     }

     if(role === "Broker"){
        //filter subscriptions from subscription collection
        const subscription = await brokerSubscriptionPlanModel.findOne({subscriptionPlanType: subscriptionName});

        if(!subscription){
            throw new ApiError(500, "failed to get subscription plan");
        }

        return subscription;
     }

    //filter subscriptions from subscription collection
    const subscription = await SubscriptionPlanModel.findOne({subscriptionPlanType: subscriptionName, subscriptionPlanRole: role});

    if(!subscription){
        throw new ApiError(500, "failed to get subscription plan");
    }

    return subscription;
}

    