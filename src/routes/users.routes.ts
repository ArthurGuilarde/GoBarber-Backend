import multer from "multer";
import { Router } from "express";

import authTokenCheck from "../middlewares/authTokenCheck";

import uploadConfig from "../config/upload";

import CreateUserService from "../services/UsersCreateService";
import UpdateAvatarService from "../services/UpdateAvatarService";

const usersRoute = Router();
const upload = multer(uploadConfig);

usersRoute.post("/", async (req, resp) => {
  try {
    const { name, email, password } = req.body;
    const user = await new CreateUserService().execute({
      name,
      email,
      password,
    });
    delete user.password;
    return resp.json(user);
  } catch (error) {
    return resp.status(400).json(error.message);
  }
});

usersRoute.patch(
  "/avatar",
  authTokenCheck,
  upload.single("Avatar"),
  async (req, res) => {
    const updateAvatar = new UpdateAvatarService();

    const user = await updateAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  }
);

export default usersRoute;
