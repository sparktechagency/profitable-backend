import ApiError from "../../../error/ApiError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import PaymentModel from "./payment.model.js";
import { postCheckoutService, webhookManagerService } from "./stripe.service.js";


//to display payment success page
export const successPage = catchAsync(async (req, res) => {
  // res.render("success.ejs");
  res.send("payment successful");
});

//to display payment cancelation page
export const cancelPage = catchAsync(async (req, res) => {
  res.send("payment unsuccessful");
});

//api ending point to perform payment checkout in stripe
export const postCheckout = catchAsync(async (req, res) => {

  const result = await postCheckoutService(req.user, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment for subscription initialized",
    data: result,
  });
});

//api ending point to manage stripe web hook
export const webhookManager = catchAsync(async (req, res) => {

  await webhookManagerService(req);

  res.send();
});


//dashboard
//api ending point to get all paid payment
export const getAllPaidPayment = catchAsync(
  async (req,res) => {
    let { page } = req.query;

    page = parseInt(page) || 1;
    // default page = 1
    let limit = 10; // default limit = 10

    let skip = (page - 1) * limit;

    const year = parseInt(req.query.year); // e.g. 2025
    if(!year) throw new ApiError(400,"Year is required to perform action");

    //total earnings
    const result = await PaymentModel.aggregate([
      {
        $match: { status: "Paid" } // filter only paid payments
      },
      {
        $group: {
          _id: null,               // no grouping by field → sum all
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);


    let monthlyEarnings = await PaymentModel.aggregate([
      // 1️⃣ Only include Paid payments in the selected year
      {
        $match: {
          status: "Paid",
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
          }
        }
      },

      // 2️⃣ Extract month
      {
        $project: {
          month: { $month: "$createdAt" },
          amount: 1
        }
      },

      // 3️⃣ Group by month
      {
        $group: {
          _id: "$month",
          totalEarnings: { $sum: "$amount" }
        }
      },

      // 4️⃣ Sort months ascending
      { $sort: { _id: 1 } }
    ]);
    // console.log(monthlyEarnings);

    // 5️⃣ Post-process to ensure 12 months (fill missing months with 0)
    const formattedResult = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyEarnings.find(m => m._id === i + 1);
      return {
        month: i + 1, // 1 = Jan, 12 = Dec
        totalEarnings: monthData ? monthData.totalEarnings : 0
      };
    });

    // console.log(formattedResult);

    const response = await PaymentModel.find({ status: "Paid"}).populate({
        path: "user", select: "-_id name email"
    }).select("amount status createdAt payment_intent_id").skip(skip).limit(limit).sort({createdAt: -1});

    if(!response) throw new ApiError(404, "No payment found");

    const total = await PaymentModel.countDocuments({status: "Paid"});
    let totalPage = Math.ceil(total / limit);

    sendResponse(res,{
      statusCode: 200,
      success: true,
      message: "Got all payment",
      meta:{page,limit,total,totalPage},
      data: {totalEarnings: result[0].totalAmount, monthWiseEarnings: formattedResult, allPayment: response }
    })
  }
);