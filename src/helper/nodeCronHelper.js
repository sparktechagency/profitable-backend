import cron from "node-cron";
import { createBackup } from "./dbBackup.js";
import { deleteUnpaidPayments, subscriptionRemainderEmail, updateExpiredSubscriptions, updateUserSubscriptionStatus } from "../app/module/payment/stripe.service.js";



// -------------------------------
// SAFE WRAPPER
// -------------------------------
const safeRun = async (label, cronServiceFunction) => {
  try {

    console.log(`[CRON] Starting: ${label}`);

    await cronServiceFunction();

    console.log(`[CRON] Completed: ${label}`);

  } catch (err) {
    
    console.error(`[CRON ERROR] in "${label}":`, err);
  }
};

const runCronJobEverydatAtNight = () => {

    // ─────────────────────────────────────────────
    // ⏰ Run ONCE PER WEEK (Sunday at 2 AM)
    cron.schedule("0 2 * * 0", async () => {
        await safeRun("Auto backup mongoDB collection in every week.",  createBackup);
    //   console.log("⏰ Running weekly MongoDB backup...");
    //   createBackup().catch(console.error);
    },{
        timezone: "Asia/Dubai"
    });

    cron.schedule("30 3 * * *", async () => {
        await safeRun("Delete all unpaid payments.",  deleteUnpaidPayments);
    //   console.log("⏰ Running weekly MongoDB backup...");
    //   createBackup().catch(console.error);
    },{
        timezone: "Asia/Dubai"
    });

    cron.schedule("50 3 * * *", async () => {
        await safeRun("Update expired subscription.",  updateExpiredSubscriptions);
    //   console.log("⏰ Running weekly MongoDB backup...");
    //   createBackup().catch(console.error);
    },{
        timezone: "Asia/Dubai"
    });

    cron.schedule("10 4 * * *", async () => {
        await safeRun("Update users subscription status.",  updateUserSubscriptionStatus);
    //   console.log("⏰ Running weekly MongoDB backup...");
    //   createBackup().catch(console.error);
    },{
        timezone: "Asia/Dubai"
    });

    cron.schedule("30 4 * * *", async () => {
        await safeRun("Subscription remainder email.",  subscriptionRemainderEmail);
    //   console.log("⏰ Running weekly MongoDB backup...");
    //   createBackup().catch(console.error);
    },{
        timezone: "Asia/Dubai"
    });

    
}

// {
//     timezone: "Asia/Dhaka"
// }

export default runCronJobEverydatAtNight;