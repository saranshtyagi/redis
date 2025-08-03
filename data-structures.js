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
        await client.lPush('notes', ['note 1', 'note 2', 'note 3']); //comment to avoid performing push operation in each successive run 
        const extractAllNotes = await client.lRange('notes', 0, -1);
        console.log(extractAllNotes);
        
        const firstNote = await client.lPop('notes');
        console.log(firstNote);

        //sets -> SADD, SMEMBERS, SISMEMBER, SREM (remove)
        await client.sAdd('user:nickName', ['john', 'varun', 'xyz']); 
        const extractNickNames = await client.sMembers('user:nickName');
        console.log(extractNickNames);
        const isVarunOneOfNickName = await client.sIsMember('user:nickName', 'varun');
        console.log(isVarunOneOfNickName);
        await client.sRem('user:nickName', 'xyz'); 

        //sorted sets -> ZADD, ZRANGE, ZRANK, ZREM
        await client.zAdd('cart', [
            {
                score: 100, 
                value: 'Cart 1'
            },
            {
                score: 150, 
                value: 'Cart 2'
            },
            {
                score: 10, 
                value: 'Cart 3'
            }
        ]);
        const getTopCartItems = await client.zRange('cart', 0, -1);
        console.log(getTopCartItems);

        const getCartItemsWithScore = await client.zRangeWithScores('cart', 0, -1);
        console.log(getCartItemsWithScore);

        const cartTwoRank = await client.zRank('cart', 'Cart 2'); 
        console.log(cartTwoRank);

        //hashes -> HSET, HGET, HGETALL. HDEL
        await client.hSet('product:1', {
            name: 'Product 1', 
            decription: 'product one description', 
            rating: '5'
        });

        const getProductRating = await client.hGet('product:1', 'rating'); 
        console.log(getProductRating);

        const getProductDetails = await client.hGetAll('product:1');
        console.log(getProductDetails);

        await client.hDel('product:1', 'rating'); 
        const updatedProductDetails = await client.hGetAll('product:1'); 
        console.log(updatedProductDetails);

    } catch (error) {
        console.log(error)
    } finally {
        client.quit();
    }
}

redisDataStructures();