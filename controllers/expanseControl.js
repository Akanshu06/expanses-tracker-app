const table  = require('../models/expansemodel')
module.exports.getExpanse=(req,res)=>{
  table.findAll().then((result)=>{
    //console.log(result);
    res.status(200).json({expanses:result})
  })
}
module.exports.postExpanse=async(req,res)=>{
   const amount=req.body.amount
   const description=req.body.description
   const category = req.body.category
   if(isValid(amount)||isValid()||isValid(category)){
    res.status(400).json({success:false,message:'bad petameter'});
   }
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
     if(!eId||eId.length===0){
        res.status(500).json({success:false,message:'id is on correct'})
     }
     table.destroy({where :{id:eId}}).then((result)=>{
         res.status(200).json({ message: 'Successfull' })
     })
}

function isValid(data){
   if(!data || data.length === 0){
    return true;
   }else{
    return false
   }
}