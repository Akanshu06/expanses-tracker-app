const { where } = require('sequelize');
const Expense = require('../models/expensemodel');
const User = require('../models/usermodel');
const Sequelize = require('../database/sequelize');
const s3Service=require('../service/s3');
const links=require('../models/url');
require('dotenv').config();

const getURL =async(req,res)=>{
   const url = await links.findAll({where:{userId:req.user.id}});
   if(url){
      console.log('==url==>'+url);
     return res.status(201).json({url});
   }else{
      throw new error('url not found')
   }
}

const download = async (req, res) => {
   try {
      
      const expenses = await  await Expense.findAll({ where: { userId: req.user.id } });
      const stringifyExpanses=JSON.stringify(expenses);
      const userId= req.user.id;
      const fileName=`Expense${userId}/${new Date()}.txt`;
      const fileURL=await s3Service.uploadtoS3(fileName,stringifyExpanses);
     // console.log(fileURL);
     links.create({
      URL:fileURL,
      UserId:userId 
     })
       res.status(201).json({fileURL,success:true});
      
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}

 const getexpense = async (req, res) => {
   try {
      console.log('getexpanseuse==>'+req.user);
      const result = await Expense.findAll({ where: { userId: req.user.id } })
   
      res.status(200).json({ expenses: result })
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}

const postexpense = async (req, res) => {
   let t;
   try {
      t = await Sequelize.transaction();
      const { amount, description, category } = req.body;
      if (isValid(amount) || isValid(description) || isValid(category)) {
         res.status(400).json({ success: false, message: 'Bad parameter' });
         return;
      }
      const allExpense = await Expense.create({ amount, description, category, userId: req.user.id }, { transaction: t });
      const totalExpense = Number(req.user.total) + Number(amount);
      await User.update({ total: totalExpense }, { where: { id: req.user.id } }, { transaction: t })
      await t.commit();
      res.status(200).json({ expenses: allExpense });
   } catch (error) {
      if (t) await t.rollback();
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}

const deleteexpense = async (req, res) => {
   let t;
   try {
      t = await Sequelize.transaction();
      const eId = req.params.id;
      if (isValid(eId)) {
         res.status(400).json({ success: false, message: 'ID is incorrect' });
         return;
      }
      
      const expenseToDelete = await Expense.findOne({ where: { id: eId, userId: req.user.id } });
      if (!expenseToDelete) {
         res.status(404).json({ success: false, message: 'Expense not found' });
         return;
      }

      const deleteRow = await Expense.destroy({ where: { id: eId, userId: req.user.id } }, { transaction: t })
      if (deleteRow === 0) {
         res.status(404).json({ success: false, message: 'Expense not found' });
         return;
      }
      const totalExpense = Number(req.user.total) - Number(expenseToDelete.amount);
      await User.update({ total: totalExpense }, { where: { id: req.user.id } }, { transaction: t });
      await t.commit();
      res.status(200).json({ message: 'Successfully deleted' });
   } catch (error) {
      if (t) await t.rollback();
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}

function isValid(data) {
   return data === undefined || data === null || (typeof data === 'string' && data.trim().length === 0);
}

module.exports={
   getexpense,postexpense,deleteexpense,download,getURL
}