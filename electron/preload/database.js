const electron = require('electron')
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs')

let sqlConn;

const getConnection = function() {
    if(sqlConn) return sqlConn
    sqlConn = new sqlite3.Database(process.env.DATABASE_PATH);
    return sqlConn
}

export const create = function() {
    const conn = getConnection()
    try {
        const script = fs.readFileSync('./schema.sql','utf-8')
        conn.exec(script);
    } catch(e ) {
        console.error(e)
    }
}
export const close = function() {
    const conn = getConnection()
    conn.close()
}

export const add = function(table, data) {
    const conn = getConnection()
    return new Promise((resolve, reject) => {
        if (Array.isArray(data)) throw new Error("Doesnt support Arrays");
        const query = `insert into ${table} (${Object.keys(data)}) values ('${Object.values(data).join("','")}')`;
        const stmt = conn.prepare(query);
        stmt.run((err) => {
            if (err)
                reject(err);
            });
            stmt.finalize(() => {
            conn.get(`select last_insert_rowid() as insertedId from ${table}`, (err, row) => {
                if (err)
                return reject(err);
                resolve(row);
            });
        });
    });
}

export const replace = function(table, data) {
    const conn = getConnection()
    return new Promise((resolve, reject) => {
        if (Array.isArray(data)) throw new Error("Doesnt support Arrays");
        if (!data.hasOwnProperty("id")) throw new Error("data must contain an id");

        let subquery = Object.keys(data)
            .filter((e) => e.toLocaleLowerCase() !== "id")
            .map((key) => {
                return `${key} = '${data[key]}'`;
            })
            .join(",");

        const query = `update ${table} set ${subquery} where id=${data.id}`;
        const stmt = conn.prepare(query);
        stmt.run((err) => {
            if (err) reject(err);
        });
        stmt.finalize();
        resolve(true);
    });
}

export const remove = function(table, data) {
    const conn = getConnection()
    return new Promise((resolve, reject) => {
        if (!data.hasOwnProperty("id")) throw new Error("data must contain an id");
        const query = `delete from ${table} where id = ${data.id}`;
        const stmt = conn.prepare(query);
        stmt.run((err) => {
        if (err)
            reject(err);
        });
        stmt.finalize();
        resolve(true);
    });
}
export const findOne = function(table, id) {
    const conn = getConnection()
    return new Promise((resolve, reject) => {
        let stmt = `select * from ${table} where id = ${id}`;
        conn.each(stmt, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

export const find = function(table, id = false) {
    const conn = getConnection()
    return new Promise((resolve, reject) => {
        let stmt = `select * from ${table}`;
        if (id)
        stmt += ` where id = ${id}`;
        stmt += "  order by id desc";
        conn.all(stmt, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}