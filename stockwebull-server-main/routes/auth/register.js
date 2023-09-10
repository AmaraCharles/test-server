var express = require("express");
var { hashPassword, sendWelcomeEmail,resendWelcomeEmail } = require("../../utils");
const UsersDatabase = require("../../models/User");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");


function generateReferralCode(length){
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

let code = "";



for (let i = 0; i < length; i++) {

  const randomIndex = Math.floor(Math.random() * characters.length);

  code += characters.charAt(randomIndex);

}


return code;

}

function addReferredUser(referrer, referredUser) {

  referrer.referral.referredUsers.push(referredUser);

}


router.post("/register", async (req, res) => {
  const { firstName,referrerCode} = req.body;

  //   check if any user has that username
  const user = await UsersDatabase.findOne({ email });
  const referrer = UsersDatabase.find((u) => u.referral.code === referrerCode); // Change 'users' to 'UsersDatabase'

  if (referrer) {
    // Add the new user to the referrer's referredUsers array
    addReferredUser(referrer, newUser);
    UsersDatabase.push(newUser); // Change 'users' to 'UsersDatabase'
    res.status(200).json({ message: `User ${name} signed up with referral code from ${referrer.name}` });
  } else {
    res.status(400).json({ message: "Invalid referral code." });
  }
  
  // if user exists
  if (user) {
    res.status(400).json({
      success: false,
      message: "email address is already taken",
    });
    return;
  }

  await UsersDatabase.create({
    // firstName,
    // lastName,
    // email,
    // password: hashPassword(password),
    // country,
    // amountDeposited: 0,
    firstName,
    profit: 0,
    balance: 0,
    referral: {
      code: generateReferralCode(6), // Generate a referral code for the referrer
      referredUsers: [], // Store referred users
    },
    referalBonus: 0,
    transactions: [],
    withdrawals: [],
    accounts: {
      eth: {
        address: "",
      },
      ltc: {
        address: "",
      },
      btc: {
        address: "",
      },
      usdt: {
        address: "",
      },
    },
    verified: false,
    isDisabled: false,
  })
  
    .then((data) => {
      return res.json({ code: "Ok", data: user });
    })
    .then(() => {
      var token = uuidv4();
      sendWelcomeEmail({ to: req.body.email, token });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    });
});

function generateReferralCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

// Function to add a referred user to the referrer's referral property
function addReferredUser(referrer, referredUser) {
  referrer.referral.referredUsers.push(referredUser);
}

router.post("/register/resend", async (req, res) => {
  const { email } = req.body;
  const user = await UsersDatabase.findOne({ email });

  if (!user) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "User not found",
    });

    return;
  }

  try {
    
    res.status(200).json({
      success: true,
      status: 200,
      message: "OTP resent successfully",
    });

    resendWelcomeEmail({
      to:req.body.email
    });


   

  } catch (error) {
    console.log(error);
  }
});

module.exports = router;




