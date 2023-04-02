const electron = require("electron");
const database = require('./database.js')

if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("api",{
      database
    })
  } catch (error) {
    console.error(error);
  }
} else {
  database.create(process.env.DATABASE_PATH)
  window.api = {
    database
  };
}