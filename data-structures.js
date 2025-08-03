const redis = require('redis');

const client = redis.createClient({
    host: 'localhost', 
    port: 6379
});

client.on('erorr', (err) => {
    console.log('Redis client error occured!', err)
});

const redisDataStructures = async() => {
    try {
        await client.connect();
        console.log('Redis connection successful!');

        //Strings -> SET, GET, MSET, MGET
        await client.set('user:name', 'Saransh Tyagi'); 
        const name = await client.get('user:name');
        console.log(name);

        await client.mSet(['user:email', 'saransh@gmail.com', 'user:age', '21', 'user:country', 'India']);
        const [email, age, country] = await client.mGet(['user:email', 'user:age', 'user:country']);
        console.log(email, age, country);

        //lists -> LPUSH, RPUSH, LRANGE, LPOP, RPOP
        await client.lPush('notes', ['note 1', 'note 2', 'note 3']);
        const extractAllNotes = await client.lRange('notes', 0, -1);
        console.log(extractAllNotes);

    } catch (error) {
        console.log(error)
    } finally {
        client.quit();
    }
}

redisDataStructures();