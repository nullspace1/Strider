const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron')

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

ipcMain.handle('get:calendar_identifiers_list', async (event) => {
    const calendar_values = await knex('calendars').select('id').select('name')
    return calendar_values;
})

ipcMain.handle('save:calendar', async(event, calendarName) => {
    await knex('calendars').insert({name: calendarName}).onConflict('id').merge();
})

ipcMain.handle('get:athlete_identifiers', async (event,params) => {
    const athlete_values = await knex('athletes').select('id').select('name')
    return athlete_values;
})

ipcMain.handle('save:athlete', async(event,athlete) => {
    delete athlete.age
    await knex('athletes').insert(athlete).onConflict('id').merge()
})

ipcMain.handle('get:athlete_full_info', async (event, athlete)  => {
    const athlete_full = await knex('athletes').select().where('id',athlete.id).first()
    athlete_full.age = new Date().getFullYear() - new Date(athlete_full.birthday).getFullYear()
    return athlete_full
})

ipcMain.handle('delete:athlete', async (event,athlete) => {
    await knex('athletes').delete().where('id',athlete.id)
})

ipcMain.handle('get:full_calendar_info', async (event, calendar) => {
    const calendar_full = await knex('calendars').select().where('id', calendar.id).first();
    const activities = await knex('activities').select().where('calendar_id', calendar.id);

    let organizedActivities = new Array(52).fill(null).map(() => new Array(7).fill(null));

    activities.forEach(activity => {
        const week = activity.week; 
        const day = activity.day;   

        if (week >= 1 && week <= 52 && day >= 1 && day <= 7) {
            if (!organizedActivities[week - 1][day - 1]) {
                organizedActivities[week - 1][day - 1] = [];
            }
            organizedActivities[week - 1][day - 1].push(activity);
        }
    });

    return {
        calendar: calendar_full,
        activities: organizedActivities
    };
});

ipcMain.handle('delete:calendar', async (event, calendar) => {
    await knex('calendars').delete().where('id',calendar.id)
})




app.removeAllListeners('ready');
app.whenReady().then(createWindow);

