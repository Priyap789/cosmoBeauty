const cron = require("node-cron");
const Order = require("../models/Order");
const sendEmail = require("./sendEmail");

cron.schedule("0 * * * *", async () => {
  try {

    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const orders = await Order.find({
      refundStatus: "processing",
      refundDate: { $lte: twoDaysAgo }
    }).populate("userId");

    for (const order of orders) {

      const user = order.userId;

      if (user?.email) {

        await sendEmail(
          user.email,
          `Refund Completed - Order ${order._id}`,
          `
          <h2>Hello ${user.name}</h2>

          <p>Your refund has been successfully processed.</p>

          <p>The amount has been returned to your account.</p>

          <br/>
          <p>Thank you for shopping with us ❤️</p>
          `
        );
      }

      order.refundStatus = "completed";
      await order.save();
    }

  } catch (error) {
    console.log("Refund Cron Error:", error);
  }
});