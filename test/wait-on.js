const axios = require('axios');

async function waitFor404() {
    const url = 'http://localhost:3000';

    while (true) {
        try {
            await axios.get(url);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('API response 404');
                break;
            }
        }

        console.log('not response 404 try again in 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

waitFor404();