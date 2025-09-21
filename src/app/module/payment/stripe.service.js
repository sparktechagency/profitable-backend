import Stripe from "stripe";
import config from "../../../config/index.js";
import { v4 as uuidv4 } from "uuid";
import validateFields from "../../../utils/validateFields.js";
import SubscriptionPlanModel from "../subscriptionPlan/subscription.model.js";
import brokerSubscriptionPlanModel from "../subscriptionPlan/brokerSubscriptionPlan.model.js";
import { errorLogger,logger} from "../../../utils/logger.js";
import ApiError from "../../../error/ApiError.js";
import PaymentModel from "./payment.model.js";
import UserModel from "../user/user.model.js";
import { sendSubscriptionEmail,sendSubscriptionExpiredEmail } from "../../../utils/emailHelpers.js";
import postNotification from "../../../utils/postNotification.js";
import CouponModel from "../coupon/coupon.model.js";
import catchAsync from "../../../utils/catchAsync.js";
import cron from "node-cron";
// import config from "../../../config/index.js";
// import { createToken } from "../../../utils/jwtHelpers.js";

//add new stripe with stripe secret key
const stripe = new Stripe(config.stripe.stripe_secret_key);
//webhook secret key
const endPointSecret = config.stripe.stripe_webhook_secret_test;

//calculate end date of subscription from duration
//need to update this function
const getEndDate = (duration) => {
  switch (duration) {
    case "15 Days":
      return new Date(new Date().setDate(new Date().getDate() + 15)); //  first hour of next day

    case "1 Months":
      return new Date(new Date().setMonth(new Date().getMonth() + 1)); //  first hour of next month

    case "3 Months":
      return new Date(new Date().setMonth(new Date().getMonth() + 3));; // first hour of next year

    case "6 Months":
      return new Date(new Date().setMonth(new Date().getMonth() + 6));; // first hour of next year

    default:
      throw new ApiError(400, "Invalid duration");
  }
};

//after completing payment update payment and send email function
const updatePaymentAndRelatedAndSendMail = async (webhookEventData) => {
  try {
    const { id: checkout_session_id, payment_intent } = webhookEventData;

    // let userRole = await PaymentModel.findOne({ checkout_session_id: checkout_session_id }).populate({path: "user",select:"role"});
    let userRole = await PaymentModel.findOne({ checkout_session_id }).populate(
      { path: "user", select: "role subscriptionPlan subscriptionStartDate subscriptionEndDate" }
    );
    
    // Step 2: Dynamically decide which collection to populate
    const planModel =
      userRole.user.role === "Broker" ? brokerSubscriptionPlanModel : SubscriptionPlanModel;

    // Step 3: Populate subscriptionPlan with correct collection
    userRole = await PaymentModel.populate(userRole, {
      path: "subscriptionPlan",
      model: planModel, // dynamic model name here
    });

    // update payment
    let payment;
    if( userRole.user.role === "Broker"){

      payment = await PaymentModel.findOneAndUpdate(
        { checkout_session_id: checkout_session_id },
        {
          $set: {
            payment_intent_id: payment_intent,
            status: "Paid",
            subscriptionStatus: "Active",
          },
        },
        { new: true, runValidators: true }
  
      );
    }

    else{

      payment = await PaymentModel.findOneAndUpdate(
        { checkout_session_id: checkout_session_id },
        {
          $set: {
            payment_intent_id: payment_intent,
            status: "Paid",
            subscriptionStatus: "Active",
          },
        },
        { new: true, runValidators: true }
  
      )
      .populate([
        {
          path: "subscriptionPlan",
          select: "subscriptionPlanType price duration",
        },
      ]);
    }

    // update user subscription
    // calculate and stamp subscriptionStartDate and subscriptionEndDate date based on the duration
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = getEndDate(payment.subscriptionPlan.duration || "6 Months");

    let updateUserData;
    if(userRole.user.role === "Broker"){
      updateUserData = {
        $set: {
          // isSubscribed: true,
          subscriptionPlanType: userRole.subscriptionPlan.subscriptionPlanType,
          subscriptionPlanPrice: userRole.amount ,
          subscriptionPlan: userRole.subscriptionPlan,
          subscriptionStartDate: userRole.subscriptionStartDate,
          subscriptionEndDate: userRole.subscriptionEndDate,
        },
      };
    }
    else{

      updateUserData = {
        $set: {
          // isSubscribed: true,
          subscriptionPlanType: payment.duration,
          subscriptionPlanPrice: payment.amount ,
          subscriptionPlan: payment.subscriptionPlan,
          subscriptionStartDate: payment.subscriptionStartDate,
          subscriptionEndDate: payment.subscriptionEndDate,
        },
      };
    }

    const updatedUser = await UserModel.findByIdAndUpdate(payment.user,updateUserData,{ new: true });

    // send email to user
    const emailData = {
      name: updatedUser.name,
      subscriptionPlan: payment.subscriptionPlan.subscriptionPlanType,
      price: payment.amount,
      currency: "USD",
      startDate: subscriptionStartDate,
      endDate: subscriptionEndDate,
      // payment_intent_id: payment_intent,
    };

    //send mail to user with payment details
    sendSubscriptionEmail(updatedUser.email, emailData);

    // send notification
    postNotification(
      "Subscription Success",
      "Your subscription has been successfully updated.",
      updatedUser._id
    );

    postNotification(
      "New Subscriber",
      "Profitable Business got a new subscriber. Check it out!"
    );

  } catch (error) {

    console.log(error);
    errorLogger.error(error.message);
  }
  
};

//perform stripe checkout service
export const postCheckoutService = async (userData, payload) => {
  const {userId,role} = userData;
  const {subscriptionId,price,couponCode,duration} = payload;
  console.log(payload);

  validateFields(payload, ["subscriptionId","price","duration"]);
  const priceNumber = Number(price);
  // console.log(price);

  let subscriptionPlan;
  if(role === "Broker"){

    subscriptionPlan = await brokerSubscriptionPlanModel.findById(subscriptionId);
  }else{

     subscriptionPlan = await SubscriptionPlanModel.findById(
      subscriptionId
    ).lean();
  }


  if (!subscriptionPlan){
      throw new ApiError(400 , "SubscriptionPlan not found");
  }

  //calculate subscription start date and end date
  const subscriptionStartDate = new Date();
  const subscriptionEndDate = getEndDate(duration);

  //if user prefer a free plan
  if(priceNumber == 0){

    //check if user has already used Free plan or not
    const freePlan = await PaymentModel.findOne({user: userId, amount: 0});
    if(freePlan) throw new ApiError(403,"Already you have used free plan. You can't use it for twice");

    const paymentData = {
      user: userId, amount: 0,duration,checkout_session_id: `FREE-${uuidv4()}`,subscriptionPlan: subscriptionPlan._id,
      status: "Paid", subscriptionStatus: "Active", subscriptionStartDate, subscriptionEndDate,
    };

    const payment = await PaymentModel.create(paymentData);
    if(!payment) throw new ApiError(500," Failed to create new Payment");

    await UserModel.findByIdAndUpdate(userId,{
      subscriptionPlan: subscriptionId, subscriptionPlanPrice: 0, subscriptionPlanType: duration, subscriptionStartDate,subscriptionEndDate
    });

    return 'http://10.10.20.60:3005/payment-successfull';
  }

  //get the amount in bdt and convert it to dollar
  var amountInCents = Math.ceil( priceNumber.toFixed(2) * 100 );
  var amount = amountInCents / 100;

  //handle coupon
  if (couponCode) {

      // 2️⃣ Find the coupon
      const coupon = await CouponModel.findOne({ couponCode: couponCode });

      if (!coupon) {
          throw new ApiError(404, "Coupon Not found by this Coupon Code");
      }

      // 3️⃣ Check if coupon is active
      if (coupon.status !== "Active") {
          throw new ApiError(400, "This coupon is already expired. you can't use it.");
      }

      // 4️⃣ Check date validity
      const today = new Date();
      if (today < coupon.validFrom || today > coupon.validTo) {
          throw new ApiError(400,  "Coupon is expired or not yet valid." );
      }

      // 5️⃣ Calculate discount
      const discountAmount = (amountInCents * coupon.discount) / 100; // discount as percentage
      amountInCents = amountInCents - discountAmount;

      // 6️⃣ Increase usage count
      coupon.couponUsesCount = coupon.couponUsesCount + 1;
      await coupon.save();

  }
  //complete payment using stripe
  let session = {};
  // const amountInCents = Math.ceil( subscriptionPlan.price.toFixed(2) * 100 );
  // const amount = amountInCents / 100;

  const sessionData = {
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `http://10.10.20.60:3005/payment-successfull`,
    cancel_url: `http://10.10.20.60:3005/Error-payment`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Subscription Fee",
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
  };

  try {
    session = await stripe.checkout.sessions.create(sessionData);

  } catch (error) {
    console.log(error);
    errorLogger.error(error.message);
    throw new ApiError(500, error.message);
  }

  const { id: checkout_session_id, url } = session || {};
  // const subscriptionStartDate = new Date();
  // const subscriptionEndDate = getEndDate(subscriptionPlan.duration);

  const paymentData = {
    user: userId,
    amount,
    duration,
    checkout_session_id,
    subscriptionPlan: subscriptionPlan._id,
    status: "Unpaid",
    subscriptionStartDate,
    subscriptionEndDate,
  };

  const payment = await PaymentModel.create(paymentData);
  if(!payment) throw new ApiError(500," Failed to create new Payment");

  return url;
};

//webhook manager servicee
export const webhookManagerService = async (req) => {
  const sig = req.headers["stripe-signature"];
  // console.log("Content-Type:", req.headers["content-type"]);

  let event;
  const date = new Date();

  console.log("webhook hiting successfully");

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endPointSecret);
  } catch (error) {
    console.log(error);
    response.status(400).send(`Webhook error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      updatePaymentAndRelatedAndSendMail(event.data.object);
      break;
    default:
      console.log(
        `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} Unhandled event type (${
          event.type
        })`
      );
  }
};

// Delete unpaid payments
const deleteUnpaidPayments = catchAsync(async () => {
  const paymentDeletionResult = await PaymentModel.deleteMany({
    status: "Unpaid",
  });

  if (paymentDeletionResult.deletedCount > 0) {
    logger.info(
      `Deleted ${paymentDeletionResult.deletedCount} unpaid payments`
    );
  }
});

// Update expired subscriptions
const updateExpiredSubscriptions = catchAsync(async () => {

  const expiredSubscriptions = await PaymentModel.updateMany(
    {
      subscriptionStatus: "Active",
      subscriptionEndDate: { $lt: new Date() },
    },
    {
      $set: {
        subscriptionStatus: "Expired",
      },
    }
  );

  if (expiredSubscriptions.modifiedCount > 0) {
    logger.info(
      `Updated ${expiredSubscriptions.modifiedCount} expired subscriptions`
    );
  }
});

// update user subscription status
const updateUserSubscriptionStatus = catchAsync(async () => {

  const subscriptionExpiredUsers = await UserModel.find({
    subscriptionPlan: { $ne: null},
    subscriptionEndDate: { $lt: new Date() },
  }).select("name email subscriptionEndDate").lean();

  const emailOfExpiredUsers = subscriptionExpiredUsers.map((user) => ({
        name: user.name,
        email: user.email,
        subscriptionEndDate: user.subscriptionEndDate,
    }) 
  );

  // send email to each expired user
  emailOfExpiredUsers.forEach((user) => {
    sendSubscriptionExpiredEmail(user.email,{name: user.name, subscriptionEndDate: user.subscriptionEndDate});
    console.log("email sent to", user.email);
  });

  const updatedUser = await UserModel.updateMany(
    {
      subscriptionPlan: { $ne: null},
      subscriptionEndDate: { $lt: new Date() },
    },
    {
      $set: {
        // isSubscribed: false,
        subscriptionPlan: null,
        subscriptionPlanPrice: null,
        subscriptionPlanType: null,
        subscriptionStartDate: null,
        subscriptionEndDate: null,
      },
    }
  );

  if (updatedUser.modifiedCount > 0) {
    logger.info(
      `Updated user ${updatedUser.modifiedCount} subscription status`
    );
  }
});

// Run cron job every day at afternoon 03:10
cron.schedule("10 15 * * *", () => {
  
    deleteUnpaidPayments();
    updateExpiredSubscriptions();
    updateUserSubscriptionStatus();
  });
//node cron is working perfectly



