const Expenses= require('../models/expensemodel');
const Users= require('../models/usermodel');


const getUserLeaderBoard=async(req,res)=>{
    try {
        const Leaderboard = await Users.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("sum", sequelize.col("expenses.money")), "Total_Cost"],
      ],
      include: [
        {
          model: Expenses,
          attributes: [],
        },
      ],
      group: ["user.id"],
      order: [["Total_Cost", "DESC"]],
      attributes: [ "name","total"],
      order: [["total", "DESC"]],
    });

    // const Leaderboard = await User.findAll({
    //   attributes: [
    //     "id",
    //     "name",
    //     [sequelize.fn("sum", sequelize.col("expenses.money")), "totalCost"],
    //   ],
    //   include: [
    //     {
    //       model: Expense,
    //       attributes: [],
    //     },
    //   ],
    //   group: ["user.id"],
    //   order: [["totalCost", "DESC"]],
    // });
    console.log(Leaderboard);
    //console.log(expenses)

    res.status(200).json(Leaderboard);

    } catch (error) {
        console.log(error);
    }
}

module.exports={getUserLeaderBoard};
