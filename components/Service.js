import React from 'react';
import Axios from 'axios'
import {URL} from "./Constants"

class Service {
    sendData(data){
        return Axios.post(URL,data);
    }

    deleteTag(tagid){
        return Axios.delete(URL+"/"+tagid)
    }
}

export default new Service();
