import React from 'react';
import Axios from 'axios'
import {URL,URL1} from "./Constants"

class Service {
    sendData(data){
        return Axios.post(URL,data,{
            headers:{
                Authentication:"Bearer "+token
            }
        });
    }

    deleteTag(tagid){
        return Axios.delete(URL+"/"+tagid,{
            headers:{
                Authentication:"Bearer "+token
            }
        })
    }

    authenticate(username,password){
        return Axios.post(URL1+"/authenticate",{
            username:username,
            password:password
        })
    }
}

export default new Service();
