import UserDb from '../models/userModel.js';

export const UnVerifyedUserDelete = async () => {
  setInterval(async () => {
    try {
      const result = await UserDb.deleteMany({
        isVerified: false,
        otpExpire: { $lt: new Date() },
      });

      if (result.deletedCount > 0) {
        console.log(`${result.deletedCount} expired users deleted`);
      }
    } catch (error) {
      console.log('Cleanup error:', error);
    }
  }, 60000); // every 1 minute
};
