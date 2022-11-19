const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const app = express();

app.use(bodyParser.json());
app.use(cors());
const posts = {};
app.get("/posts", (req, res) => {
  res.send(posts);
});

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, status, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, comment, postId, status } = data;
    const post = posts[postId];
    comment = post.comments.find((comment) => {
      return id === comment.id;
    });
    comment.status = status;
    comment.content = content;
  }
};

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
});

app.listen(4002, async () => {
  console.log(`listening on ${4002}`);
  res = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log(`processing event`);
    handleEvent(event.type, event.data);
  }
});
