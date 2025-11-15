let assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

let moduleObj = {
  id: "M101",
  name: "Intro to React",
  description: "Basics of components and hooks",
  course: "CS5610",
};

export default function WorkingWithObjects(app) {
  app.get("/lab5/assignment", (req, res) => {
    res.json(assignment);
  });
  
  app.get("/lab5/assignment/title", (req, res) => {
    res.json(assignment.title);
  });
  
  app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    assignment.title = req.params.newTitle;
    res.json(assignment);
  });
  
  app.get("/lab5/assignment/score/:score", (req, res) => {
    assignment.score = parseInt(req.params.score);
    res.json(assignment);
  });
  
  app.get("/lab5/assignment/completed/:completed", (req, res) => {
    assignment.completed = req.params.completed === "true";
    res.json(assignment);
  });

  app.get("/lab5/module", (req, res) => {
    res.json(moduleObj);
  });
  
  app.get("/lab5/module/name", (req, res) => {
    res.json(moduleObj.name);
  });
  
  app.get("/lab5/module/name/:name", (req, res) => {
    moduleObj.name = req.params.name;
    res.json(moduleObj);
  });
  
  app.get("/lab5/module/description/:description", (req, res) => {
    moduleObj.description = decodeURIComponent(req.params.description);
    res.json(moduleObj);
  });
}