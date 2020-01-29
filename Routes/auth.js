let express=require("express");
let router=express.Router();
let Joi=require("@hapi/joi");
let bcrypt=require("bcrypt");
let user=require("../../dbModel/user");

router.post("/auth",async(req,res)=>{
    let {error}=AuthValidation(req.body);
    if(error){return res.send(error.details[0].message)}
    let users=await user.userModel.findOne({"UserLogin.EmailId":req.body.UserLogin.EmailId});
    if(!users){return res.status(403).send({message:"Invlaid EmailId"})}
    // let password=await user.findOne({"UserLogin.password":req.body.UserLogin,password});
    // if(!password){return res.status(403).send({message:"Invalid Password"})}
    let passwords=await bcrypt.compare(req.body.UserLogin.password,users.UserLogin.password);
    if(!passwords){return res.status(403).send({message:"Invalid Password"})}
    res.send({message:"Login Successfully"});
    
});

function AuthValidation(error){
   let Schema=Joi.object({
       UserLogin:{
           EmailId:Joi.string().required().email(),
           password:Joi.string().required()
       }
   });
   return Schema.validate(error);
}

module.exports=router;