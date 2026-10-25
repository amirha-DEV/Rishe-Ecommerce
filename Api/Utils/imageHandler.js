import {__dirname} from '../app.js'
import fs from 'fs'
export const imageHandler=(oldMedia,newMedia)=>{
    for(let media of oldMedia){
        const isExist=newMedia.includes(media)
        if(!isExist){
            fs.unlinkSync(`${__dirname}/Public/${media}`)
        }
    }   
}