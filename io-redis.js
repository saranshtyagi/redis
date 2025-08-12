const Redis = require('ioredis'); 

const client = new Redis(); 

const ioRedisDemo = async() => {
    try {
        await client.set('key', 'value'); 
        const val = await client.get('key'); 
        console.log(val);
    } catch (error) {
        console.log(error);
    } finally {
        client.quit();
    }
}

ioRedisDemo();