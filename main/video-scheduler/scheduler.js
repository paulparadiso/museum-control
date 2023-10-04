const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const schedule = require('node-schedule');
const _ = require('lodash');

class Scheduler {

    constructor(schedulePath) {
        this.schedulePath = schedulePath;
        this.scheduleYaml = null;
        this.schedule = null;
        this.monitor = this.logMessage;
        this.scheduledJobs = {};
        this.clips = {};
        this.currentCue = null;
        //this.activeJobs = [];
        this.loadSchedule();
    }

    loadSchedule() {
        const schedulePath = path.join(__dirname, this.schedulePath);
        const scheduleFile = fs.readFileSync(schedulePath, 'utf8');
        this.scheduleYaml = yaml.load(scheduleFile);
        this.parseSchedule();
    }   

    parseSchedule() {
        const schedules = this.scheduleYaml.schedules;
        const parts = this.scheduleYaml.parts;
        const clips = this.scheduleYaml.clips;
        this.schedule = {};
        clips.forEach(clip => {
            this.clips[clip.number] = {'title': clip.title, 'description': clip.description}
        });
        parts.forEach(part => {
            this.schedule[part.tag] = {}
            schedules.forEach(sch => {
                this.schedule[part.tag][sch.tag] = [];
                this.scheduleYaml[part.tag][sch.tag].forEach(e => {
                    this.schedule[part.tag][sch.tag].push(e);
                });
            });
        });
    }

    startClip(clip) {
        console.log(`Loading clip - ${clip}`);
    }

    clearSchedule() {
        const jobNames = _.keys(schedule.scheduledJobs);
        for(let name of jobNames) schedule.cancelJob(name);
    }

    load(partID, scheduleID) {  
        this.clearSchedule();
        this.schedule[partID][scheduleID].forEach(e => {
            const timeTokens = e.time.split(':');
            let cronString;
            if(timeTokens.length > 2) {
                cronString = `${timeTokens[2]} ${timeTokens[1]} ${timeTokens[0]} * * *`;
            } else {
                cronString = `0 ${timeTokens[1]} ${timeTokens[0]} * * *`;

            }
            this.monitor(`[CUE SCHEDULER]Adding cue ${e.clip_number} | ${cronString}`);
            const job = schedule.scheduleJob(cronString, () => {
                this.startClip(e.clip_number);
            });
            let name = job.name;
            this.scheduledJobs[name] = {
                'clip': e.clip_number
            }
        });
    }

    getCue(clip) {
        let cue = this.clips[clip];
        return {
            clip: clip,
            title: cue.title,
            description: cue.description
        }
    }

    getNextCue() {
        const jobs = schedule.scheduledJobs;
        let nextJob = null;
        let futureTime = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
        const currentTime = new Date();
        for(const job in jobs) {
            const jobTime = new Date(jobs[job].nextInvocation());
            if((jobTime - currentTime) < (futureTime - currentTime)) {
                futureTime = jobTime;
                nextJob = job;
            } 
        }
        //console.log(this.scheduledJobs[nextJob]);
        const clip = this.scheduledJobs[nextJob].clip;
        return {'clip': clip, 
                'title': this.clips[clip].title, 
                'description': this.clips[clip].description,
                'time': futureTime
        };
    }

    logMessage(m) {
        console.log(`${m}`);
    }

    getClips() {
        return this.scheduleYaml.clips;
    }

    getParts() {
        return this.scheduleYaml.parts;
    }

    getSchedules() {
        return this.scheduleYaml.schedules;
    }

}

module.exports = Scheduler;