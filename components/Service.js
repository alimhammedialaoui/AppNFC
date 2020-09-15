import React from 'react';
import Axios from 'axios';
import {authenticate, microservice_personne, microservice_tag, microservice_tag_register, URL} from './Constants';
import {credentials} from './Constants';

class Service {
    GetUserById(id){
        return Axios.get(URL+microservice_personne+"/"+id,{
            headers:{
                Authorization:"Bearer "+token
            }
        })
    }

    GetAllTagUser(){
        return Axios.get(URL+microservice_tag,{
            headers:{
                Authorization:"Bearer "+token
            }
        })
    }

    TagRegister(data){
        return Axios.post(URL+microservice_tag_register+'/add',data,{
            headers:{
                'Content-Type':'application/json',
                Authorization:"Bearer "+token
            }
        });
    }

    deleteTag(tagid){
        return Axios.delete(URL+"/"+tagid,{
            headers:{
                Authorization:"Bearer "+token
            }
        })
    }

    authenticate(username,password){
        return Axios.post(URL+authenticate,{
            username:username,
            password:password
        })
    }
}

export default new Service();
