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
            table.date('date');
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
    await Promise.all(calendar_values.map(async c => {
        const activityMap = new Map();
        const activitiesList = (await knex('activities').select().where('calendar_id', c.id));
        activitiesList.forEach(a => {
            activityMap.set(a.date, a)
        })
        c.activities = activityMap
        return c
    }))
    return calendar_values;
})

ipcMain.handle('GET athlete', async () => {
    const athlete_values = await knex('athletes').select()
    return athlete_values;
})

ipcMain.handle('CREATE calendar', async (event, name) => {
    const [id] = (await knex('calendars').insert({ name: name }).onConflict().ignore())
    const [new_calendar] = (await knex('calendars').select().where('id', id))
    new_calendar.activities = new Map()
    return new_calendar;
})

ipcMain.handle('DELETE calendar', async (event, id) => {
    await knex('calendars').where('id', id).delete()
    await knex('activities').where('calendar_id', id).delete()
})

ipcMain.handle('CREATE activity', async (event, calendar_id, date) => {
    const [id] = await knex('activities').insert({ calendar_id: calendar_id, date: date, name: "" });
    const [activity] = await knex('activities').select().where('id', id)
    return activity
})


app.removeAllListeners('ready');
app.whenReady().then(createWindow);

