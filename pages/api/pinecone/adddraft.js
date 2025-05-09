import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import crypto from 'crypto';
import DraftSchema from '@/models/draft';
import { getOrCreateIndex } from "@/pinecone/config";


export default async function handler (req,res){

    const {name,type,content} = req.body;

    const index = await getOrCreateIndex();
    

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    };


   

    if(!name){
        return res.status(400).json({message:'draft name is not provided'});
    }

    try{


        const draft = new DraftSchema({
           title:name,
           category:type,
           content:content
        });
        
        await draft.save();
        

        // let uid = crypto.randomUUID();


        await index.upsertRecords([{
            _id:draft._id,
            chunk_text:name,
            category:type

        }]);

        let uid = draft._id;

        return res.status(200).json({message:"Draft added successfully",uid});

    }catch(err){
        console.log(err);
        return res.status(400).json({message:`error: ${err}`});
    }


}