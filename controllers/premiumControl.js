const Expenses= require('../models/expensemodel');
const Users= require('../models/usermodel');


const getUserLeaderBoard=async(req,res)=>{
    try {
        const users=await Users.findAll();
        const expenses=await Expenses.findAll();
        const TotalExpense={}
    expenses.forEach((expense)=>{
        //console.log(expense)
        if(TotalExpense[expense.userId]){

            TotalExpense[expense.userId]=TotalExpense[expense.userId]+expense.amount;
            //console.log(`ex-${expense.userId}`)
        }
        else{
            TotalExpense[expense.userId]=expense.amount;
        }
    });
    var Leaderboard=[];
    users.forEach((user)=>{
        //console.log(`us-${TotalExpense[user.id]}`)
        Leaderboard.push({name:user.name,Total_Cost:TotalExpense[user.id]||0})
    })
    Leaderboard.sort((a,b)=>{
        a.Total_Cost-b.Total_Cost
    })
    res.status(200).json(Leaderboard)
        
    } catch (error) {
        console.log(error);
    }
}

module.exports={getUserLeaderBoard};
