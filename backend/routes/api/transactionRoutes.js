const express = require("express");
const router = express.Router();
const Transaction = require("../../models/transactions");

router.get("/inbound", async (req, res) => {
  try {
    const outTrans = Transaction.find({ to: req.user.userId });
    res.status(200).json(outTrans);
  } catch (err) {
    console.error("Error fetching transactions!", err);
    res.status(500).json({ message: "Error fetching transactions!" });
  }
});

router.get("/outbound", async (req, res) => {
  try {
    const outTrans = Transaction.find({ from: req.user.userId });
    res.status(200).json(outTrans);
  } catch (err) {
    console.error("Error fetching transactions!", err);
    res.status(500).json({ message: "Error fetching transactions!" });
  }
});

router.post("/outbound", async (req, res) => {
  try {
    const newTrans = {
      paymentMethod: req.body.payMeth,
      date: req.body.date,
      from: req.user.userId,
      to: req.body.peerId,
      amount: req.body.amount,
    };
    const outTrans = Transaction.find({ from: req.user.userId });
    res.status(200).json(outTrans);
  } catch (err) {
    console.error("Error fetching transactions!", err);
    res.status(500).json({ message: "Error fetching transactions!" });
  }
});

router.post("/transactionDay", async (req, res) => {
  try {
    const { date, userId } = req.body;
    const allTransactions = await Transaction.find({ date });

    let inBoundAmount = 0;
    let outBoundAmount = 0;
    const allInbound = allTransactions.filter(
      (transaction) => transaction.to == userId
    );
    allInbound.forEach((transaction) => {
      inBoundAmount += transaction.amount;
    });

    const allOutBound = allTransactions.filter(
      (transaction) => transaction.from == userId
    );
    allOutBound.forEach((transaction) => {
      outBoundAmount += transaction.amount;
    });

    return res.status(200).json({ inBoundAmount, outBoundAmount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
