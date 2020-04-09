const express = require("express");
const db = require("../dbconnection");
const { predictPreference } = require("../predictPreference");

const router = express.Router();

router.post("/nutrition", (req, res) => {
  db.query(`read_user_nutrition'${req.body.userNumber}'`,
    (err, rows) => {
    if (err) console.log("Nutrition 정보를 가져오는데 실패했습니다.");
    else {
      res.send(rows.recordsets[0][0]);
    }
  });
});

router.post("/intake", (req, res) => {
  console.log("유저 번호 : "+req.body.userNumber);
  db.query(`read_user_today_nutrition'${req.body.userNumber}'`,
    (err, rows) => {
    if (err) console.log("Intake 정보를 가져오는데 실패했습니다.");
    else {
      res.send(rows.recordsets[0][0]);
    }
  });
});

router.post('/preference/main', (req, res) => {
  const userNumber = req.body.userNumber;
  db.query('read_main_food_preference', async (err, result) => {
    let userPreferences = result.recordset;
    if (err || userPreferences === undefined) {
      res.send({ err: "Null Preference Error" });
    } else {
      const preferences = userPreferences.map(userPreference => Object.values(userPreference));
      let foodNumberList = Object.keys(userPreferences[0]);
      foodNumberList = foodNumberList.map(s => Number(s.slice(3, s.length)));

      const predicted = await predictPreference(preferences, foodNumberList, userNumber);
      res.send({ pref: predicted });
    }
  });
});

module.exports = router;
