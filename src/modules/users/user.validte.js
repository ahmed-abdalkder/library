import Joi from "joi";

export const createuservalidate = Joi.object({

    name:Joi.string().required(),

    email:Joi.string().email().required(),

    password:Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).required(),

    role:Joi.string(),
    
}).required()