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
            table.integer('day');
            table.integer('week');
            table.integer('year');
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

async function getAllCalendars(){
    const calendars = await knex('calendars').select();
    const calendarsWithActivities = await Promise.all(calendars.map(async (calendar) => {
        const activities = await knex('activities')
            .where('calendar_id', calendar.id)
            .select();
        return { calendar, activities };
    }));
    return calendarsWithActivities
}

ipcMain.handle('GET ALL CALENDAR', async () => {
    return getAllCalendars();
})


ipcMain.handle('SAVE CALENDAR', async (e,calendar) => {
     await knex('calendars').insert(calendar).onConflict('id').merge()
})

ipcMain.handle('SAVE ACTIVITY', async (event,activity) => {
    await knex('activities').insert(activity).onConflict('id').merge()
})


ipcMain.handle('DELETE CALENDAR', async (event, calendar) => {
    console.log(calendar)
    await knex('calendars').delete().where('id',calendar.id)
    await knex('activities').delete().where('calendar_id',calendar.id)
})




app.removeAllListeners('ready');
app.whenReady().then(createWindow);


