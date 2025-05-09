import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import crypto from 'crypto';

import { getOrCreateIndex } from "@/pinecone/config";
import DraftSchema from '../../../models/draft';

export default async function handler (req,res){

    const {query} = req.body;

    const index = await getOrCreateIndex();
    

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    };


   

    if(!query){
        return res.status(400).json({message:'draft name is not provided'});
    }

    try{
        const rankedResults = await index.searchRecords({

            query:{
                topK:10,
                inputs:{text:query}
            },
            rerank:{
                model: 'bge-reranker-v2-m3',
                topN: 10,
                rankFields: ['chunk_text'],
            }
        })
        
        console.log(rankedResults.result.hits);

        const answer = rankedResults.result.hits;


        const draft = await DraftSchema.find({_id:answer[0]._id});
                

        return res.status(200).json({message:"Draft added successfully",draft:draft[0]});

    }catch(err){
        console.log(err);
        return res.status(400).json({message:`error: ${err}`});
    }


}