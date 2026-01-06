import cron from "node-cron";
import { createBackup } from "./dbBackup.js";



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
    // Schedule the task
    // “50 23 * * *” means every day at 23:50 (11:50 PM)
    
    // cron.schedule("50 23 * * *", async () => {
    
    //   console.log("Running daily inventory generation…");
    
    //   await generateDailyInventoryService();
    //   await resetSupplierDailyFieldsService();
    // });

    // Run at 23:50
    // cron.schedule("50 23 * * *", async () => {
    //   await safeRun("Generate daily inventry for Supplier", generateDailyInventoryService);
    // }, {
    //   timezone: "Asia/Dhaka"
    // });

    // Run at 23:50
    // cron.schedule("55 23 * * *", async () => {
    //   await safeRun("Update supplier field after inventory generation", resetSupplierDailyFieldsService);
    // }, {
    //   timezone: "Asia/Dhaka"
    // });

    // ─────────────────────────────────────────────
    // ⏰ Run ONCE PER WEEK (Sunday at 2 AM)
    cron.schedule("0 2 * * 0", async () => {
        await safeRun("Auto backup mongoDB collection in every week.",  createBackup);
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