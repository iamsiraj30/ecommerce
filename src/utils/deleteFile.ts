import fs from "fs";
import path from "path";

const deleteFile = (fileUrl: string) => {
  const filePath = path.join(process.cwd(), fileUrl.replace(/^\/+/, ""));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export default deleteFile;
