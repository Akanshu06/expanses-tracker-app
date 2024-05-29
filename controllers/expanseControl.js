const table  = require('../models/expansemodel')
module.exports.getExpanse=(req,res)=>{
  table.findAll().then((result)=>{
    //console.log(result);
    res.status(200).json({Expanse:result})
  })
}
module.exports.postExpanse=async(req,res)=>{
   const amount=req.body.amount
   const description=req.body.description
   const category = req.body.category
   const allExpanse= await table.create({
    amount,
    description,
    category
   })
   //console.log(allExpanse);
   res.status(200).json({ expenses: allExpanse });
}

module.exports.deleteExpanse = (req,res)=>{
     const eId = req.params.id;
     console.log(eId);
     table.destroy({where :{id:eId}}).then((result)=>{
         res.status(200).json({ message: 'Successfull' })
     })
}
