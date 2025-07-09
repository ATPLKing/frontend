const API_HOST = 'http://localhost:3000';
async function getUVs() {
    try {
        const response = await fetch(`${API_HOST}/api/uvs`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching UV list:', error);
        return null;
    }
}

async function getQuestionsByUV(uv){
     try {
        const response = await fetch(`${API_HOST}/api/questions/${uv}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching UV list:', error);
        return null;
    }
}

async function getMetadatabyUV(uv) {
    try {
        const response = await fetch(`${API_HOST}/api/subjects/${uv}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching this UV Metadata:', error);
        return null;
    }
}

export { getUVs, getQuestionsByUV, getMetadatabyUV };