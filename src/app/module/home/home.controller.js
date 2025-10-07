import ApiError from "../../../error/ApiError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import BusinessModel from "../business/business.model.js";
import nodemailer from "nodemailer";
import config from "../../../config/index.js";
import termsAndConditionModel from "./termsAndCondition.model.js";
import privacyPolicyModel from "./privacyPolicy.model.js";
import QueryBuilder from "../../../builder/queryBuilder.js";
import RefundCancellationModel from "./refund.model.js";



//api ending point to perform search from home page
export const homePageSearch = catchAsync(
    async (req,res) => {
        const { searchText } = req.query;
        if(!searchText){
            throw new ApiError(400, "Search text is required to perform search");
        }
        //$regex: searchTerm → Matches titles that contain the given term.
        //$options: "i" → Makes it case-insensitive (so "Coffee" matches "coffee").
        // const response = await BusinessModel.aggregate([ 
        //    {
        //         $match: { title: { $regex: searchText, $options: "i" }, isApproved: true }
        //    }
        // ]);

        //using query builder to execute query
        const businessQuery = new QueryBuilder(
            BusinessModel.find({}), query
        ).search(["title"])
        .filter();

        const business = await businessQuery.modelQuery;
        const total = await businessQuery.countTotal();

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Got data after searching",
            data: {business,total}
        })

    }
);

//api ending point to post felp & support
export const helpAndSupportController = catchAsync(
    async (req,res) => {
        
        const {firstName,lastName,email,phone,message} = req.body;

        //sent this data to admin email
        try {
            
            const transporter = nodemailer.createTransport({
                 host: config.smtp.smtp_host,
                 service: config.smtp.smtp_service,
                 auth: {
                    user: config.smtp.smtp_mail,
                    pass: config.smtp.smtp_password, // Use App Password for Gmail with 2FA
                 },
            });
    
            const mailOptions = {
            from: `Profitable Business <${config.smtp.smtp_mail}>`,
            to: config.smtp.smtp_mail,
            subject: 'Help and Suport',
            text: `Hello Admin,

                This is ${firstName ? firstName : "NA"}.

                I am reaching out to report an issue I am currently facing. Please find the details below:

                Issue Message: ${message ? message : "NA"}

                User Details:
                - Name  : ${firstName ? firstName : "NA"} ${lastName ? lastName : "NA"}
                - Email : ${email ? email : "NA"}
                - Phone : ${phone ? phone : "NA"}

                I kindly request you to look into this matter and take the necessary steps to resolve the issue at the earliest.

                Thank you for your support.

                Best regards,  
                ${firstName ? firstName : "NA"}
                `

            };
    
            // Send email
            await transporter.sendMail(mailOptions);
    
            // Optional: Delete uploaded files after sending email
            // files.forEach(file => fs.unlinkSync(file.path));
    
            // res.status(200).json({ message: 'Email sent successfully!' });
        } 
        catch (error) {
            console.error('Error sending email:', error);
            // res.status(500).json({ message: 'Something went wrong.' });
            throw new ApiError(500,"failed to send email from Help and Support");
        }


        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Sent data to admin",
           
        })

    }
);

//api ending point to create terms and condition
export const updateTermsAndCondition = catchAsync(
    async (req,res) => {

        const  termsId  = "6899d140df8b42b2014be785";
        const { description } = req.body;
        if(!description) throw new ApiError(400, "Terms and condition description is needed to update");

        const response = await termsAndConditionModel.findByIdAndUpdate(termsId,{description},{new: true});
        if(!response) throw new ApiError(500, "Failed to update terms and condition");

        sendResponse(res,{
            statusCode: 201,
            success: true,
            message: "updated terms and condition successfully",
            data: response
        });
    }
);

//api ending point to create terms and condition
export const gettermsAndCondition = catchAsync(
    async (req,res) => {

        const termsId = "6899d140df8b42b2014be785";
        const response = await termsAndConditionModel.findById(termsId);

        if (!response) throw new ApiError(500, "Failed to get terms and condition");

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Retrieved terms and condition successfully",
            data: response
        });
    }
);
//api ending point to create terms and condition
export const updatePrivacyPolicy = catchAsync(
    async (req,res) => {

        const {description} = req.body;
        if(!description) throw new ApiError(400, "Privacy policy is needed to create");
        
        const policyId = "6899ce82d3d2b8cb90f96d39";

        const response = await privacyPolicyModel.findByIdAndUpdate(policyId,{description},{new: true});
        if(!response) throw new ApiError(500, "Failed to update Privacy Policy");

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "updated privacy policy",
            data: response
        });
    }
);

//api ending point to create terms and condition
export const getPrivacyPolicy = catchAsync(
    async (req,res) => {
        const privacyId = "6899ce82d3d2b8cb90f96d39";
        const response = await privacyPolicyModel.findById(privacyId);
        if (!response) throw new ApiError(500, "Failed to get privacy policy");

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "got privacy policy",
            data: response
        });
    }
);

//api ending point to create refund and cancellation policy
export const getRefundPolicy = catchAsync(
    async (req,res) => {

        const privacyId = "68e4a09539a79ca94f470524";

        const response = await RefundCancellationModel.findById(privacyId);

        if (!response) throw new ApiError(500, "Failed to get privacy policy");

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "got refund policy",
            data: response
        });
    }
);

//api ending point to update refund and cancellation policy
export const updateRefundPolicy = catchAsync(
    async (req,res) => {

        const {description} = req.body;

        if(!description) throw new ApiError(400, "Refund policy is needed to update");
        
        const policyId = "68e4a09539a79ca94f470524";

        const response = await RefundCancellationModel.findByIdAndUpdate(policyId,{description},{new: true});
        if(!response) throw new ApiError(500, "Failed to update Privacy Policy");

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "updated refund policy",
            data: response
        });
    }
);

