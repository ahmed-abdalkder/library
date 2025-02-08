import User from "../../db/models/user.model.js"
import jwt from 'jsonwebtoken'

export const authgraphql = async(token, roles = [])=>{
  
      
    if(!token){

      throw new Error("token not found")

    }

    if(!token.startsWith("ahmed__")){
      
       throw new Error("invalid token")

      }
      const newtoken = token.split("ahmed__")[1]

      if(!newtoken){

        throw new Error("invalid newtoken")

      }

      const decoded = jwt.verify(newtoken,"tokenkey")

      if(!decoded?.id){

        throw new Error("newtoken not found")

    }

    const user = await User.findById(decoded.id)

    if(!user){

      throw new Error("user not found")

     }

     if(!roles.includes(user.role)){

      throw new Error("you have not permission")

     }

    return user
    
}
