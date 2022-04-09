const express = require("express");
const app = express();
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch-commonjs");
const path = require("path");

const webpush = require("web-push");
//ene keynuudiig ene cmd-aar avna neg udaa gen teriigee hadgalna const vapidKeys = webpush.generateVAPIDKeys();
const publicKey =
    process.env.PUBLIC_VAPID_KEY ||
    "YOUR_PUBLIC_KEY";
const privKey =
    process.env.PRIVATE_VAPID_KEY ||
    "YOUR_PRIV_KEY";

webpush.setVapidDetails("mailto:itka0526@gmail.com", publicKey, privKey);
//-- Ene tabluudiih ni schema ni 

// CREATE TABLE "session" (
//   "sid" varchar NOT NULL COLLATE "default",
// 	"sess" json NOT NULL,
// 	"expire" timestamp(6) NOT NULL
// )
// WITH (OIDS=FALSE);
// ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
// CREATE INDEX "IDX_session_expire" ON "session" ("expire");

// create table posts(
//     post_id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     date VARCHAR(120) NOT NULL,
//     body jsonb DEFAULT '{}',
//     latest_comment text default ''
//     );

// create table comments(
//     id SERIAL PRIMARY KEY, 
//     post_id int references posts(post_id),
//     nickname text default 'Anonymous',
// 	username text not null,
//     message text NOT NULL
// );    

// create table ListOfSubscribers(
// 	list_id SERIAL PRIMARY KEY, 
// 	subscribers jsonb default '[]'
// )

//--eniig zaalval hiigerei 
// insert into ListOfSubscribers(subscribers) values ('[]')
const pgPool = new Pool(
    process.env.PRODUCTION
        ? {
              connectionString: process.env.DATABASE_URL,
              ssl: {
                  rejectUnauthorized: false,
              },
          }
        : {
              user: "itgelt",
              database: "blogging_DB_V2",
              password: "",
              host: "localhost",
              port: 5432,
          }
);


const PORT = process.env.PORT || 4000;

const RealAdminId = {
    nickname: "nuuts",
    username: "test@gmail.com",
    password: "kod",
};

const expresession = require("express-session");
const pgSession = require("connect-pg-simple")(expresession);

const sessionMiddleWare = expresession({
    secret: "blogger",
    resave: false,
    saveUninitialized: false,
    //httpOnly: false,
    cookie: {
        maxAge: 43200000,
    },
    store: new pgSession({
        pool: pgPool,
        tableName: "session",
    }),
});
app.use(express.static(path.join(__dirname, 'build')));

app.use('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.use("/sub", express.static(path.join(__dirname, "client")));

app.use(express.json({ limit: "5mb" }));
app.use(sessionMiddleWare);
//make some kind limit = cuz size is now 512kb++
app.get("/worker", (_, res) => {
    res.sendFile(__dirname + "/client/worker.js");
});
//subscribe route
app.get("/publickey", (_, res) => {
    res.set({ "Content-Type": "text/html" });
    res.send(publicKey);
});
app.post("/subscribe", async (req, res) => {
    try {
        const subscription = req.body;
        await pgPool.query(
            `
            UPDATE ListOfSubscribers 
            SET subscribers=(subscribers || $1::jsonb);
            `,
            [JSON.stringify(subscription)]
        );
        res.status(201).json({});
        const payload = JSON.stringify({
            title: "Thank you for subscribing! ",
        });
        // Pass object into sendNotification
        await webpush.sendNotification(subscription, payload);
    } catch (err) {
        console.log(err);
        res.status(500);
    }
});

app.get("/posts", async (req, res) => {
    try {
        const { rows: allPosts } = await pgPool.query(
            `
              SELECT * FROM posts;
            `
        );
        res.json(allPosts);
    } catch (error) {
        console.log(err);
    }
});
app.route("/comments")
    .get((req, res) => {
        const { post_id } = req.query;
        if (post_id)
            pgPool.query(
                `
            SELECT * FROM comments
            WHERE post_id=$1;
            `,
                [post_id],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        res.json({ status: "failed", message: "" });
                        return;
                    } else if (result) {
                        res.json({
                            status: "success",
                            message: result.rows || [],
                        });
                    }
                }
            );
    })
    .post(async (req, res) => {
        if (req.session.user === undefined)
            req.session.user = {
                nickname: "Anonymous",
                username: uuidv4(),
            };
        pgPool.query(
            `
            UPDATE posts 
            SET latest_comment=$1
            WHERE post_id=$2;
            `,
            [req.body.comment, req.body.post_id],
            (error1, result1) => {
                if (error1) {
                    console.log(error1);
                    res.json({ status: "failed", message: "" });
                    return;
                } else if (result1) {
                    pgPool.query(
                        `
                       INSERT INTO comments(post_id, nickname, username, message) values ($1, $2, $3, $4);
                         `,
                        [
                            req.body.post_id,
                            req.session.user.nickname,
                            req.session.user.username,
                            req.body.comment,
                        ],
                        (error, result) => {
                            if (error) {
                                console.log(error);
                                res.json({ status: "failed", message: "" });
                                return;
                            } else if (result) {
                                res.json({
                                    status: "success",
                                    message: result.rows[0] || [],
                                });
                            }
                        }
                    );
                }
            }
        );
    });

app.post("/login", async (req, res) => {
    const CLIENT = req.body;
    console.log(req.body, req.session.user);
    const ResponseBad = {
        auth: false,
        message: "Username and password don't match. ",
    };
    const ResponseGood = {
        auth: true,
        message: "",
    };
    try {
        if (req.session.user === undefined) {
            if (
                CLIENT.username === RealAdminId.username &&
                CLIENT.password === RealAdminId.password
            ) {
                req.session.user = RealAdminId;
                res.json(ResponseGood);
            } else {
                res.json(ResponseBad);
            }
        } else if (
            req.session.user.username === RealAdminId.username &&
            req.session.user.password === RealAdminId.password
        ) {
            res.json(ResponseGood);
        } else {
            res.json(ResponseBad);
        }
    } catch (err) {
        console.log(err);
    }
});
app.route("/posthandler")
    .all((req, res, next) => {
        //protector here ?
        const userSession = req.session.user;
        if (userSession === undefined) {
            res.json({
                auth: false,
            });
        } else if (
            RealAdminId.username === userSession.username &&
            RealAdminId.password === userSession.password
        ) {
            next();
        }
    })
    .post((req, res) => {
        const newpost = req.body;
        if (newpost) {
            pgPool.query(
                `
                     INSERT INTO posts(title, date, body) VALUES ($1, $2, $3::jsonb)
                     RETURNING *;
                    `,
                [newpost.title, newpost.date, newpost.body],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        res.json({ status: "failed", message: "" });
                        return;
                    } else if (result) {
                        pgPool.query(
                            `
                            SELECT subscribers
                            FROM ListOfSubscribers
                            WHERE list_id = 1;
                            `,
                            (er, re) => {
                                if (er) {
                                    console.log(er);
                                    return;
                                } else if (re) {
                                    const post_info = JSON.stringify(
                                        result.rows[0]
                                    );
                                    if (re.rows[0].subscribers)
                                        re.rows[0].subscribers.map(
                                            (subscriberID) => {
                                                webpush
                                                    .sendNotification(
                                                        subscriberID,
                                                        post_info
                                                    )
                                                    .catch((err) =>
                                                        console.error(
                                                            err,
                                                            "fuck happened here too "
                                                        )
                                                    );
                                            }
                                        );
                                }
                            }
                        );

                        res.json({
                            status: "success",
                            message: result.rows[0],
                        });
                    }
                }
            );
        }
    })
    .put((req, res) => {
        const updated_post = req.body;
        if (updated_post) {
            pgPool.query(
                `
                             UPDATE posts
                             SET body=$1::jsonb
                             WHERE post_id=$2
                             RETURNING *;
                            `,
                [updated_post.updated_body, updated_post.post_id],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        res.json({ status: "failed", message: "" });
                        return;
                    } else if (result) {
                        res.json({
                            status: "success",
                            message: result.rows[0],
                        });
                    }
                }
            );
        }
    })
    .delete((req, res) => {
        const deletePost = req.body;
        fetch(
            "namaigustgaarai",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "|DELETED|",
                    date: "XX/XX/XXXX",
                    body: JSON.stringify(deletePost),
                }),
            }
        );
        if (deletePost) {
            pgPool.query(
                `
                delete from posts where post_id=$1
                returning *;
                `,
                [deletePost.post_id],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        res.json({ status: "failed", message: "" });
                        return;
                    } else if (result) {
                        res.json({
                            status: "success",
                            message: result.rows[0],
                        });
                    }
                }
            );
        }
    });

app.listen(PORT, () => console.log(`Server is listening on -p ${PORT}`));
