const axios = require('axios');

async function waitFor404() {
  const url = 'http://api:3000';

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

function withTimeout(promise, timeout) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Promise timed out after ${timeout} ms`));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

withTimeout(waitFor404(), 60000)
  .then(() => {
    console.log('waitFor404 completed within 60 seconds');
  })
  .catch((error) => {
    console.error(error.message);
  });
