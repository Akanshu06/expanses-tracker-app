
const table  = require('../models/expansemodel')
module.exports.getExpanse=(req,res)=>{
  table.findAll({where:{signupDatumId:req.user.id}}).then((result)=>{
    //console.log(result);
    res.status(200).json({expanses:result})
  })
}
module.exports.postExpanse=async(req,res)=>{
   try {
      const amount=req.body.amount
   const description=req.body.description
   const category = req.body.category
   if(isValid(amount)||isValid(description)||isValid(category)){
    res.status(400).json({success:false,message:'bad petameter'});
   }
   const allExpanse= await table.create({
    amount,
    description,
    category,
    signupDatumId:req.user.id
   })
   //console.log(allExpanse);
   res.status(200).json({ expenses: allExpanse });
      
   } catch (error) {
      console.log(error);
   }
   
}

module.exports.deleteExpanse = (req,res)=>{
     const eId = req.params.id;
     if(!eId||eId.length===0){
        res.status(500).json({success:false,message:'id is on correct'})
     }
     table.destroy({where :{id:eId,signupDatumId:req.user.id}}).then((result)=>{
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