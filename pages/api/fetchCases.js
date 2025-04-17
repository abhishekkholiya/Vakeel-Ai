export default async function handler(req, res) {
    // Ensure the method is GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get query parameter from the URL
    const { query } = req.query;
    let docID;
    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
    }

    const apiUrl = `https://api.indiankanoon.org/search/?formInput=${query}&pagenum=0`;

    const docUrl = `https://api.indiankanoon.org/doc/${docID}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${process.env.NEXT_PUBLIC_INDIAN_KANOON_API}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //     formInput: query,
            //     pagenum: 0,
            // }),
        });

        const data = await response.json();
       
               
            try{
                console.log('came here')
                const requestDocument = await fetch(`https://api.indiankanoon.org/doc/${data.docs[0].tid}/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${process.env.NEXT_PUBLIC_INDIAN_KANOON_API}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    // body: JSON.stringify({
                    //     formInput: query,
                    //     pagenum: 0,
                    // }),
                });
                const docData = await requestDocument.json();
                // console.log(docData);
                return res.status(200).json(docData);
            }catch(err){
                console.log(err);
            }
        // }
       
    } catch (error) {
        console.error("Error fetching from Indian Kanoon:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

