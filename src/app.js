const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateId(req, res, next){
  const { id } = req.params

  if (!isUuid(id)){
    return res.status(400).json({error: "Invalid ID"})
  }

  return next()
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateId)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repositorie)

  return response.status(200).json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({error: "Repositorie ID not found."})
  }

  const repositorie = {
    id,
    title, 
    url, 
    techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = repositorie

  return response.json(repositorie)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({error: "Repositorie ID not found."})
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({error: "Repositorie ID not found."})
  }

  repositories[repoIndex].likes = repositories[repoIndex].likes+1

  return response.json(repositories[repoIndex])
});

module.exports = app;
