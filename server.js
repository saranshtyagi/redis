const redis = require('redis'); 

//create client
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});

//event listener for redis client error
client.on('erorr', (err) => {
    console.log('Redis client error occured!', err)
});

const testRedisConnection = async() => {
    try {
        await client.connect();
        console.log('Redis connection successful!');

        //to set key-value pair and get value using key
        await client.set('name', 'xyz');
        const extractValue = await client.get('name');
        console.log(extractValue);

        //delete key-value pair
        const deleteCount = await client.del('name');
        console.log(deleteCount);

    } catch (error) {
        console.log(error);
    } finally { //to make sure there is no open connection
        client.quit();
    }
};

testRedisConnection();