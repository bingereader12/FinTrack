const express = require("express");
const router = express.Router();
const Investment = require("../../models/investments");
const User = require("../../models/users");
const yahooFinance = require("yahoo-finance2").default;
const auth = require("../../middleware/auth");

router.post("/add", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, type, date, currentValue, initialValue } = req.body;
    const exists = await Investment.findOne({ name });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User doesnt exist" });
    }
    if (exists)
      return res.status(400).json({ message: "Investment already exists" });

    const investment = new Investment({
      userId,
      name,
      type,
      date,
      currentValue,
      initialValue,
    });
    const investmentRes = await investment.save();
    user.investments.push(investmentRes._id);

    await user.save();

    res.status(200).json({ message: "Investment added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getAll", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const investments = await Investment.find({ userId });
    return res.status(200).json({ message: investments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/risk", auth, async (req, res) => {
  const results = await yahooFinance.quote("AAPL");

  function normalize(value, min, max) {
    return (value - min) / (max - min);
  }

  function calculateRiskScore(data) {
    // Normalize metrics
    const priceChangeNormalized = normalize(
      data.regularMarketChangePercent,
      -100,
      100
    );
    const volumeNormalized = normalize(data.regularMarketVolume, 0, 1000000000); // Assuming a maximum volume of 1 billion
    const peRatioNormalized = normalize(data.trailingPE, 0, 100); // Assuming a maximum PE ratio of 100
    const marketCapNormalized = normalize(data.marketCap, 0, 1000000000000); // Assuming a maximum market cap of 1 trillion
    const epsNormalized = normalize(data.epsTrailingTwelveMonths, 0, 10); // Assuming a maximum EPS of 10

    // Calculate risk score
    const riskScore =
      (priceChangeNormalized +
        volumeNormalized +
        peRatioNormalized +
        marketCapNormalized +
        epsNormalized) /
      5;

    return riskScore;
  }

  const riskScore = calculateRiskScore(results);
  console.log(`Risk Score: ${riskScore}`);

  res.status(200).json(riskScore);
});

router.get('/types', auth, async(req,res)=>{
  try{
    const userId = req.user.userId;
    const investments = await Investment.find({ userId });
    var data = {}
    investments.forEach((inv)=>{
      data[inv.type] = inv.currentValue
    })
    console.log(data)
    res.status(200).json(data)
  }catch(err){
    res.status(500).json({ message: err.message });
  }
})

router.get("/:id", auth, async (req, res) => {
  try {
    const investmentId = req.params.id;
    const userId = req.user.userId;
    const investment = await Investment.findById(investmentId);
    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    if (investment.userId != userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this investment" });
    }

    return res.status(200).json({ investment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const investmentId = req.params.id;
    const userId = req.user.userId;
    const investment = await Investment.findById(investmentId);
    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    if (investment.userId != userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this investment" });
    }

    const deletedInvestment = await Investment.findByIdAndDelete(investmentId);

    if (!deletedInvestment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    const user = await User.findById(userId);
    user.investments.pull(deletedInvestment._id);
    await user.save();

    return res.status(200).json({ message: "Investment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
