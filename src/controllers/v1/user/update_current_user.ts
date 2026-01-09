import { Request, Response } from 'express';
import User from '@/models/user';
import { logger } from '@/lib/winston';

const updateCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    website,
    facebook,
    linkedin,
    x,
    instagram,
    youtube,
  } = req.body;

  try {
    const user = await User.findById(userId).select('+password -__v').exec();

    if (!user) {
      return res.status(401).json({
        code: 'NotFound',
        message: 'User not found',
      });
    }

    if (username) user.username = username;

    if (email) user.email = email;

    if (password) user.password = password;

    if (firstName) user.firstName = firstName;

    if (lastName) user.lastName = lastName;

    if (!user.socialLinks) user.socialLinks = {};

    if (website) user.socialLinks.website = website;

    if (facebook) user.socialLinks.facebook = facebook;
    if (linkedin) user.socialLinks.linkedin = linkedin;

    if (x) user.socialLinks.x = x;

    if (instagram) user.socialLinks.instagram = instagram;

    if (youtube) user.socialLinks.youtube = youtube;

    await user.save();
    logger.info('User updated successfully', user);

    return res.status(200).json({
      user,
    });
  } catch (err) {
    return res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
  }
};

export default updateCurrentUser;
