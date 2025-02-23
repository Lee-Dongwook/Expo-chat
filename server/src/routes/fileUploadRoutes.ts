import { Router } from "express";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload", upload.single("file"), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }
  const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
