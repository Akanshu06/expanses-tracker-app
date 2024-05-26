const singupModel=require('../models/singupmodel');

module.exports.postSingUpData= async(req,res)=>{
    console.log(req.body.name);
      const singupData=await singupModel.create('singupInfo',{
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
      });
res.status(200).json({singupData:singupData});
}