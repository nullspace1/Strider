import { Activity, ActivityData } from "./activity";
import { Calendar, CalendarData } from "./calendar";
import { Entity } from "./entity";

class MainInterface {

    ipcRenderer;

    async saveActivity(activity: Activity): Promise<void> {
        await this.saveEntityData(activity);
    }

    async getAthletes() {
        return []
    }

    async deleteCalendar(selectedCalendar: Calendar): Promise<Calendar[]> {
        await this.deleteEntityData(selectedCalendar);
        return await this.getCalendars();
    }

    async saveCalendar(selectedCalendar: Calendar): Promise<Calendar[]> {
        this.saveEntityData(selectedCalendar);
        this.saveEntitiesData(selectedCalendar.activities);
        return await this.getCalendars();
    }

    async getCalendars(): Promise<Calendar[]> {
        const calendar_data: { calendar: CalendarData, activities: ActivityData[] }[] = await this.ipcRenderer.invoke('GET ALL CALENDAR')
        return calendar_data.map(c => new Calendar(c.calendar, c.activities.map(a => new Activity(a))))
    }

    constructor(ipcRenderer) {
        this.ipcRenderer = ipcRenderer;
    }

    private async saveEntityData(entity: Entity<any>): Promise<void> {
        await this.ipcRenderer.invoke('SAVE ' + entity.getEntityIdentifier(), entity.getData());
    }

    private async saveEntitiesData(entities: Entity<any>[]): Promise<void> {
        if (entities.length === 0) return;
        const identifier = entities[0].getEntityIdentifier()
        await this.ipcRenderer.invoke('SAVE ALL ' + identifier, entities.map(e => e.getData()))
    }

    private async deleteEntityData(entity: Entity<any>): Promise<void> {
        await this.ipcRenderer.invoke('DELETE ' + entity.getEntityIdentifier(), entity.getData())
    }

    private async deleteEntitiesData(entities: Entity<any>[]): Promise<void> {
        if (entities.length === 0) return;
        const identifier = entities[0].getEntityIdentifier()
        await this.ipcRenderer.invoke('DELETE ALL ' + identifier, entities.map(e => e.getData()))
    }





}

export { MainInterface }