import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createApp } from "./app";
import { createSeedTasks } from "./seed";

const port = Number(process.env.PORT ?? 3001);
const app = createApp(createSeedTasks());
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const clientBuild = path.join(projectRoot, "dist");

if (existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      next();
      return;
    }

    response.sendFile(path.join(clientBuild, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Taskline API listening on http://localhost:${port}`);
});
