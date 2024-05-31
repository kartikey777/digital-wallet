const Balance = require("../../models/balance.model");
const { default: mongoose } = require("mongoose");

const checkBalence = async (request, response) => {
  try {
    const tempUser = await Balance.findOne({ userName: request.user._id });
    // console.log(tempUser);
    if (!tempUser) {
      const tempBalence = await Balance.create(
        { userName: request.user._id },
        { $inc: { balance: 10000 } }
      );
      console.log(tempBalence);
      return response.status(200).json(tempBalence);
    }
    return response.status(200).json({ balence: tempUser.balance });
  } catch (error) {
    return response.status(500).json(error);
  }
};

const addBalence = async (request, response) => {
  try {
    const tempUser = await Balance.findOne({ userName: request.user._id });
    if (tempUser) {
      return response
        .status(400)
        .json(
          await Balance.updateOne(
            { userName: request.user._id },
            { $inc: { balance: 10000 } }
          )
        );
    }
    const addBalence = await Balance.create({
      userName: request.user._id,
      balance: 10000,
    });
    return response.status(200).json(addBalence);
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

const transferMoney = async (request, response) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { to, amount } = request.body;

    const currentUser = await Balance.findOne({
      userName: request.user._id,
    }).session(session);

    const toUser = await Balance.findOne({ userName: to }).session(session);

    if(!toUser) {
      await Balance.create({userName : to})
    }

    if (!currentUser) {
      await session.abortTransaction();
      return response.status(400).json({ message: "User Not Found" });
    } else if (currentUser.balance < amount) {
      await session.abortTransaction();
      return response.status(400).json({ message: "Insufficient Balance" });
    }

    // update balance
    await Balance.updateOne(
      { userName: request.user._id },
      { $inc: { balance: -amount } }
    ).session(session);
    await Balance.updateOne(
      { userName: to },
      { $inc: { balance: amount } }
    ).session(session);

    //commit transfer
    await session.commitTransaction();
    session.endSession();

    return response.status(200).json({ message: "Transfered Successfully" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

module.exports = { checkBalence, addBalence, transferMoney };
