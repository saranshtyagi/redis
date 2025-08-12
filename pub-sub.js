const redis = require('redis'); 

const client = redis.createClient({
    host: 'localhost', 
    port: 6379
}); 

client.on('error', (err) => {
    console.log('Redis client error occurred!');
});

const testAdditionalFunctionality = async() => {
    try {
        await client.connect(); // client acts as publisher

        const subscriber = client.duplicate(); // creates a new client which acts as subscriber -> shares the same connection as the previous client. 
        await subscriber.connect(); // connect to redis server for the subscriber

        await subscriber.subscribe('dummy-channel', (message, channel) => {
            console.log(`Received message from ${channel}: ${message}`);
        });

        await client.publish('dummy-channel', 'Some dummy data from publisher');
        await client.publish('dummy-channel', 'Some new message from publisher');

        await new Promise((resolve) => setTimeout(resolve, 1000)); // to ensure that the message is received before unsubscribing, simply creates a buffer time of 1s before unsubscribing. 

        await subscriber.unsubscribe('dummy-channel'); 
        await subscriber.quit(); // close the subscriber connection. 
    } catch (error) {
        console.log(error);
    } finally {
        client.quit();
    }
}

testAdditionalFunctionality();