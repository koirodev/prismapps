import gulp from "gulp";
import config from "./scripts/config.mjs";

import appPath from "./scripts/paths/app.mjs";
import tasksPath from "./scripts/paths/tasks.mjs";

const header = `
/*
 * Prismium ${config.version}
 * Contemporary style and functionality - an accordion that does more.
 * https://github.com/koirodev/prismium
 *
 * Copyright 2024-${new Date().getFullYear()} Vitaly Koiro
 *
 * Released under the MIT License
 *
 * Released on: ${config.date}
*/
`;

const paths = {
  tasks: tasksPath,
  app: appPath
}

for (const taskPath of paths.tasks) {
  const task = await import(taskPath);
  task.default(gulp, config, header);
}

const defaultTasks = [
  "sass",
  "sass:minified",
  "js:process",
  "js:process:min",
  "js:process:modules",
  "copy",
];

gulp.task("default", gulp.series(
  "clean",
  gulp.parallel(...defaultTasks)
));

gulp.task("dev", gulp.series(
  "clean",
  gulp.parallel(...defaultTasks),
  "watch"
));
