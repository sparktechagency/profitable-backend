import path from "path";
import fs from "fs";

const deleteFile = (imgFolder,imgName) => {
    
     const filePath = path.join(`uploads/${imgFolder}`, imgName);
    
    if (fs.existsSync(filePath)) {

        fs.unlinkSync(filePath); // delete the file
        
        console.log(`Image file: ${imgName} deleted from ${imgFolder}`)
    }

}

export default deleteFile;