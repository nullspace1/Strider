const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron')

let mainWindow;

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './backend/db/dev.sqlite'
    },
    useNullAsDefault: true
})

knex.schema.hasTable('athletes').then(exists => {
    if (!exists) {
        return knex.schema.createTable('athletes', table => {
            table.increments('id').primary();
            table.string('name');
            table.date('birthday');
            table.double('weight');
            table.string('gender');
            table.string('location');
            table.double('height')
        })
    }
})

knex.schema.hasTable('calendars').then(exists => {
    if (!exists) {
        return knex.schema.createTable('calendars', table => {
            table.increments('id').primary();
            table.string('name');
        })
    }
})

knex.schema.hasTable('activities').then(exists => {
    if (!exists) {
        return knex.schema.createTable('activities', table => {
            table.increments('id').primary();
            table.string('name');
            table.integer('week');
            table.integer('day');
            table.integer('calendar_id').references('id').inTable('calendars').onDelete('cascade');
        })
    }
})



function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const startUrl = isDev ? 'http://localhost:3000' : url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });



}

ipcMain.handle('GET calendar', async () => {
    const calendar_values = await knex('calendars').select()
    Promise.all(calendar_values.map(async c => {
        c.activities = await knex('activities').select().where('calendar_id',c.id);
        return c
    }))
    return calendar_values;
})

ipcMain.handle('GET athlete', async () => {
    const athlete_values = await knex('athletes').select()
    return athlete_values;
})

ipcMain.handle('CREATE calendar', async (event, name) => {
     
     const id = (await knex('calendars').insert({name: name}).onConflict().ignore())[0]
     
     for (let i = 1; i <= 52; i++){
        for (let j = 1; j <= 7; j++){
            await knex('activities').insert({week: i, day:j, name: "", calendar_id: id}).onConflict().ignore()
        }
     }

     
    const new_calendar = (await knex('calendars').select().where('id',id))[0]
    const activities = await knex('activities').select().where('calendar_id',id);
    new_calendar.activities = activities;

    return new_calendar;
})

ipcMain.handle('DELETE calendar', async (event, id) => {
    await knex('calendars').where('id', id).delete()
})

app.removeAllListeners('ready');
app.whenReady().then(createWindow);

