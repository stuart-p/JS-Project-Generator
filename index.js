const fs = require("fs");
const spawn = require("child_process");

const templatePath = "./projectTemplate/";
const CURR_DIR = process.cwd();
const newProjectsPath = "testProject";

function generateDirectory(templatePath, newProjectsPath) {
  fs.readdir(templatePath, (err, dirContent) => {
    if (err) console.log(err);
    else {
      dirContent.forEach(file => {
        const filePath = `${templatePath}/${file}`;
        fs.stat(filePath, (err, stats) => {
          if (err) console.log(err);
          else {
            if (stats.isFile()) {
              fs.readFile(filePath, "utf8", (err, fileData) => {
                const writePath = `${CURR_DIR}/${newProjectsPath}/${file}`;
                fs.writeFile(writePath, fileData, err => {
                  if (err) console.log(err);
                });
              });
            } else if (stats.isDirectory()) {
              fs.mkdir(`${CURR_DIR}/${newProjectsPath}/${file}`, err => {
                if (err) console.log(err);
                else {
                  generateDirectory(
                    `${templatePath}/${file}`,
                    `${newProjectsPath}/${file}`
                  );
                }
              });
            }
          }
        });
      });
    }
  });
}

fs.mkdir(`${CURR_DIR}/${newProjectsPath}`, err => {
  if (err) console.log("error in root dir generation: " + err);
  else {
    spawn.exec(`cd ${CURR_DIR}/${newProjectsPath} | npm install`, err => {
      if (err) console.log("npm init error: " + err);
      else {
        spawn.exec(`cd ${CURR_DIR}/${newProjectsPath} | git init`, err => {
          if (err) console.log("git init error: " + err);
        });
      }
    });
    generateDirectory(templatePath, newProjectsPath);
  }
});
