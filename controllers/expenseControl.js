const table  = require('../models/expensemodel');
function isValid(string) {
   return string ===undefined || string.length === 0;
}

module.exports.getExpanse=(req,res)=>{
  table.findAll({where:{userId:req.user.id}}).then((result)=>{
  // console.log(result);
    res.status(200).json({expanses:result})
  }).catch((error)=>{
   res.status(401).json({error:error})
  })
}
module.exports.postExpanse=async(req,res)=>{
   //console.log(req.body);
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
    userId:req.user.id
   });
   //console.log(allExpanse);
   res.status(200).json({ expenses: allExpanse });

   } catch (error) {
      console.log(error);
   }
}
module.exports.deleteExpanse = (req,res)=>{
     const eId = req.params.id;
     if(isValid(eId)){
        res.status(500).json({success:false,message:'id is  incorrect'})
     }
     table.destroy({where :{id:eId,userId:req.user.id}}).then((result)=>{
         res.status(200).json({ message: 'Successfull' })
     })
}

function isValid(data){
  return data===undefined||data.length===0;
}