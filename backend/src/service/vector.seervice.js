import { Pinecone } from '@pinecone-database/pinecone';

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding
const nyaySahayIndex = pc.Index('nyaysahay');

// This function will create memory
export async function createMemory({ vectors, metadata, messageId }) {
    try {
        await nyaySahayIndex.upsert([
            {
                id: messageId.toString(),
                values: vectors,
                metadata
            }
        ]);
    } catch (error) {
        console.error("Error creating memory:", error);
        throw error;
    }
}

export async function queryMemory({ queryVector, limit = 5, metadata }) {
    try {
        const data = await nyaySahayIndex.query({
            vector: queryVector,
            topK: limit,
            filter: metadata ? metadata : undefined,
            includeMetadata: true
        });
        return data.matches;
    } catch (error) {
        console.error("Error querying memory:", error);
        throw error;
    }
}
