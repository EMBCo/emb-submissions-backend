import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/submit-artwork", upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 }
]), async (req, res) => {

  try {
    const {
      artwork_title,
      year_created,
      medium_materials,
      support_surface,
      height_in,
      width_in,
      depth_in,
      edition_number,
      edition_size,
      artist_statement
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eastmadebeast@gmail.com",
        pass: "YOUR_APP_PASSWORD"
      }
    });

    const attachments = [
      {
        filename: req.files.image1[0].originalname,
        content: req.files.image1[0].buffer
      },
      {
        filename: req.files.image2[0].originalname,
        content: req.files.image2[0].buffer
      }
    ];

    const emailBody = `
Artwork Title: ${artwork_title}
Year Created: ${year_created}
Medium / Materials: ${medium_materials}
Support / Surface: ${support_surface}

Dimensions (in):
Height: ${height_in}
Width: ${width_in}
Depth: ${depth_in}

Edition Number: ${edition_number}
Total Edition Size: ${edition_size}

Artist Statement:
${artist_statement}
    `;

    await transporter.sendMail({
      from: "EMB Contemporary <eastmadebeast@gmail.com>",
      to: "eastmadebeast@gmail.com",
      subject: "EMB ARTWORK SUBMISSIONS",
      text: emailBody,
      attachments
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Submission failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
