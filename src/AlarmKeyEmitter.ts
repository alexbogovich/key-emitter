import KeyEmitter from "./KeyEmitter";

export default class AlarmKeyEmitter extends KeyEmitter {
    constructor() {
        super();

        chrome.alarms.onAlarm.addListener((alarm) => {
            this.emit(alarm.name);
        });
    }
}
