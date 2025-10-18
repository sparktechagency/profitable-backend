import ApiError from "../../../error/ApiError.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import validateFields from "../../../utils/validateFields.js";
import Agreement from "./agreement.model.js";
import createNDAFile from "../../../utils/mergePdf.js";
import fs from "fs";
import { sendNdaEmailToAdmin, sendNdaEmailToUser } from "../../../utils/emailHelpers.js";
import config from "../../../config/index.js";


export const createNewAgreement = catchAsync(
    async (req,res) => {
        
        const {userId,role} = req.user;
        const files = req.files;
        //const signatureImg = files.find(n => n.path === "upload/NDA/signature-img.png");
        const { name,email,phone,nidPassportNumber } = req.body;

        validateFields(req.body,["name","email","phone","nidPassportNumber"]);
        
        //handle file name from files
        // const file1 = files[0] ? files[0].filename : ''; 
        // const file2 = files[1] ? files[1].filename : ''; 
        // const file3 = files[2] ? files[2].filename : ''; 

        const pdfPath = await createNDAFile({ name, email, phone, nidPassportNumber},role, files);
        // console.log(pdfPath);

        const agreement = await Agreement.create({
           user: userId, userRole: role,name,email,phone,nidPassportNumber, nda: pdfPath
        });

        if(!agreement) throw new ApiError(500," Failed to create new aggremt");

        //send email to admin and user
        await sendNdaEmailToAdmin(config.smtp.smtp_mail,{name,email,phone,role});
        await sendNdaEmailToUser(email,{name,pdfPath});

        //delete all unused file
        files.forEach(file => fs.unlinkSync(file.path));

        sendResponse(res,{
            statusCode: 201,
            success: true,
            message: "Created new Agreement successfully",
            data: agreement
        });
    }
);


//dashboard
//api ending point to get all nda agreement
export const getAllNdaAgreement = catchAsync(
    async (req,res) => {

        let {page} = req.query;

        page = parseInt(page) || 1;
        // default limit = 10
        let limit = 10;
        let skip = (page - 1) * limit;

        const response = await Agreement.find({}).sort({createdAt: -1}).skip(skip).limit(limit);

        if(!response) throw new ApiError(404,"No agreement found");

        let total = await Agreement.countDocuments();
        let totalPage = Math.ceil(total / limit);

        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Retrieved all agreement",
            meta:{page,limit,total,totalPage},
            data: response
        })
    }
);

//delete an agreement
export const deleteAgreement = catchAsync(
    async (req,res) => {

        const { agreementId } = req.params;
        if(!agreementId) throw new ApiError(400,"Agreement Id is required to delete an agreement");

        const agreement = await Agreement.findByIdAndDelete(agreementId);

        if(!agreement) throw new ApiError(404,"No agreement found");
        
        //delete the nda file also
        if(agreement.nda && fs.existsSync(agreement.nda)){
            fs.unlinkSync(agreement.nda);
        }
        
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Deleted an agreement successfully",
            data: agreement
        });
    }
);