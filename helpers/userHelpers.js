const db = require('../configuration/connection');
const collection = require('../configuration/collections');
const bcrypt = require('bcrypt');

module.exports = {
    doSignUp:(userDet)=>{
        return new Promise(async(resolve, reject)=>{
            userDet.password = await bcrypt.hash(userDet.password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userDet)
            .then((response)=>{
                console.log(response);
                resolve(response)
            }).catch((err)=>{
                console.log(err);
                reject();
            })
        })
    },

    doLogin: (userDet)=>{
        return new Promise ( async(resolve, reject) => {
            const response = {};
            const user = await db.get().collection(collection.USER_COLLECTION).findOne({email: userDet.email});

            if(user){
                bcrypt.compare(userDet.password, user.password).then((status) => {
                    if(status){
                        response.user = user;
                        resolve(response)
                    }else{
                        response.status= "Invalid Password"
                        resolve(response)
                    }  
                });
            }else{
                response.status = "Invalid User"
                // response.passErr = "Invalid password"
                resolve(response)
            }
        })
    }
}