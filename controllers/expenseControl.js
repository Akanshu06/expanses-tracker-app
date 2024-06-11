const { where } = require('sequelize');
const expanses = require('../models/expensemodel');
const User = require('../models/usermodel');
const Sequelize = require('../database/sequelize')


function isValid(string) {
   return string === undefined || string.length === 0;
}

module.exports.getExpanse = async (req, res) => {
   try {
      const result = await expanses.findAll({ where: { userId: req.user.id } })
      //console.log(result);
      res.status(200).json({ expanses: result })
   } catch (error) {
      res.status(401).json({ error: error })
   }
}
module.exports.postExpanse = async (req, res) => {

   try {
      const t = await Sequelize.transaction();
      const amount = req.body.amount
      const description = req.body.description
      const category = req.body.category
      if (isValid(amount) || isValid(description) || isValid(category)) {
         res.status(400).json({ success: false, message: 'bad petameter' });
      }
      const allExpanse = await expanses.create({ amount, description, category, userId: req.user.id }, { transaction: t });
      const totalExpense = Number(req.user.total) + Number(amount);
      //console.log(totalExpense);
      await User.update({ total: totalExpense }, { where: { id: req.user.id } }, { transaction: t })
      await t.commit();
      res.status(200).json({ expenses: allExpanse });

   } catch (error) {
     await t.rollback()
      console.log(error);
   }
}

module.exports.deleteExpanse = async (req, res) => {
   try {
      const t = await Sequelize.transaction();
      const eId = req.params.id;
      if (isValid(eId)) {
         res.status(500).json({ success: false, message: 'id is  incorrect' })
      }
      
      const expenseToDelete = await expanses.findOne({ where: { id: eId, userId: req.user.id } });
      if (!expenseToDelete) {
         res.status(404).json({ success: false, message: 'Expense not found' });
         return;
      }


      const deletRow=await expanses.destroy({ where: { id: eId, userId: req.user.id } }, { transaction: t })
      if(deletRow==0){
         res.status(404).json({success:false,message:'expense not found'})
      }
      const totalExpense = Number(req.user.total) - Number(expenseToDelete.amount);
      await User.update({ total: totalExpense }, { where: { id: req.user.id } }, { transaction: t });
      await t.commit();
      res.status(200).json({ message: 'Successfully deleted' });

   } catch (error) {
      await  t.rollback();
      res.status(500).json({ error: 'Internal Server Error' });
   }


}

function isValid(data) {
   return data === undefined || data.length === 0;
}