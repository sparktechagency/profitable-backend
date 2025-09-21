import mongoose from "mongoose";


const scheduleSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name:{
        type: String,
        required: [true, "Name is required"]
    },
    email:{
        type: String,
        required: [true, "email is required"]
    },
    date:{
        type: Date,
        required: [true, "Date is required"]
    },
    time:{
        type: String,
        required: [true, "Time is required"]
    },
    timeZone:{
        type: String,
        required: [true, "Timezone is required"]
    },
    topic:{
        type: String,
        required: [true, "Meeting Topic is required"]
    },
    note:{
        type: String,
        
    },
},{timestamps: true});


const ScheduleModel = mongoose.models.Schedule || mongoose.model("Schedule",scheduleSchema);

export default ScheduleModel;