const client = require('../lib/client');
// import our seed data:
const yelp = require('./yelp.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      yelp.map(item => {
        return client.query(`
                    INSERT INTO yelp (name, review_count, img_url, rating, yelp_db_id, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [item.name, item.review_count, item.img_url, item.rating, item.yelp_db_id, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
