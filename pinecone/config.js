import { Pinecone } from "@pinecone-database/pinecone";


const pc = new Pinecone({apiKey:process.env.PINECONE_API_KEY});



const indexName = 'vakeel-index';

export async function getOrCreateIndex(){
    let indexes = await pc.listIndexes();
    console.log('indexes',indexes);
    const indexNames = indexes.indexes.map(index => index.name);
    if(!indexNames.includes(indexName)){

        await pc.createIndexForModel({
            name:indexName,
            cloud:'aws',
            region:'us-east-1',
            embed:{
                model:'llama-text-embed-v2',
                fieldMap:{text:'chunk_text'}
            },
            waitUntilReady: true
        });

        console.log('index has been created');

    }else{
        console.log('index already exists');
    }

    return pc.index(indexName);
}