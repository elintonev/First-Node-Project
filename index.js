import { request } from "express";
import { response } from "express";
import express, { json } from "express";
import { v4 } from "uuid";
import cors from "cors";

const port = 3001;
const app = express();
app.use(json());
app.use(cors());

const users = [];

const myFirstMiddleware = (request, response, next) => {
  const { id } = request.params;

  const Index = users.findIndex((user) => user.id === id);

  if (Index < 0) {
    return response.status(404).json({ message: "User not found. Try again" });
  }

  request.userIndex = Index;
  request.userId = id;

  next();
};

app.get("/users", (request, response) => {
  return response.json(users);
});

app.post("/users", (request, response) => {
  const { name, age } = request.body;
  let id = v4();

  const user = { id, name, age };

  users.push(user);

  return response.status(201).json(users);
});

app.put("/users/:id", myFirstMiddleware, (request, response) => {
  const { name, age } = request.body;
  const index = request.userIndex;
  const id = request.userId;

  const userUpdated = { id, name, age };

  users[index] = userUpdated;

  return response.json(userUpdated);
});

app.delete("/users/:id", myFirstMiddleware, (request, response) => {
  const Index = request.userIndex;

  users.splice(Index, 1);

  return response.status(204);
});

app.listen(port, () => {
  console.log(`💕 o servidor iniciou na porta ${port}`);
});
