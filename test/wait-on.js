const http = require('http');

async function waitFor404() {
  const url = 'http://localhost:3000';

  while (true) {
    try {
      const response = await httpRequest(url);
      if (response.statusCode === 404) {
        console.log('API response 404');
        break;
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }

    console.log('No 404 response; trying again in 1 second...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

function httpRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      resolve(response);
    }).on('error', (error) => {
      reject(error);
    });
  });
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
