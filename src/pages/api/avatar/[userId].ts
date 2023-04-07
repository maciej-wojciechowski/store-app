/* eslint-disable @typescript-eslint/require-await */
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "~/utils/supabase";
import formidable from "formidable";
import fs from "fs";
import { prisma } from "~/server/db";

const STORAGE_URL =
  "https://ljshxjkkqrbwcxhmbkga.supabase.co/storage/v1/object/public/avatars/";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "Missing userId" });
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });
  //parse request with formidabl
  const form = new formidable.IncomingForm({
    keepExtensions: true,
  });

  let reqFile: undefined | formidable.File;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Internal server error during parsing" });
    } else {
      if (files.file instanceof Array) {
        return res
          .status(500)
          .json({ message: "Internal server error - multiple files" });
      }

      reqFile = files.file as formidable.File;

      if (!reqFile) {
        return res
          .status(500)
          .json({ message: "Internal server error - file not present" });
      }
      void supabase.storage
        .from("avatars")
        .upload(userId + "_pic", fs.readFileSync(reqFile.filepath), {
          contentType: reqFile.mimetype as string,
          upsert: true,
          cacheControl: "0",
        })
        .then(async ({ data, error }) => {
          if (error) {
            return res.status(500).json({ message: error.message });
          }
          if (!user.image) {
            // uploading new avatar
            console.log("uploading new avatar");
            try {
              await prisma.user.update({
                where: { id: userId },
                data: { image: STORAGE_URL + data.path },
              });
            } catch (error) {
              return res
                .status(500)
                .json({ message: "Error during avatar update" });
            }
            return res.status(205).json({
              message: "Avatar uploaded successfully - relog to see changes",
              data: STORAGE_URL + data.path,
            });
          } else {
            // updating existing avatar
            return res
              .status(200)
              .json({ message: "Avatar updated successfully", data });
          }
        });
    }
  });
}
