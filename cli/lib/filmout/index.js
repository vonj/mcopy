'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("delay");
class FilmOut {
    /**
     *
     **/
    constructor(display, ffmpeg, ffprobe, ui, light) {
        this.id = 'filmout';
        this.state = {
            frame: 0,
            frames: 0,
            path: null,
            fileName: null,
            info: {},
            dir: true,
            enabled: false
        };
        this.display = display;
        this.ffmpeg = ffmpeg;
        this.ffprobe = ffprobe;
        this.ui = ui;
        this.light = light;
        this.init();
    }
    /**
     *
     **/
    async init() {
        const Log = require('log');
        this.log = await Log({ label: this.id });
        this.ipc = require('electron').ipcMain;
        this.listen();
    }
    /**
     *
     **/
    listen() {
        this.ipc.on(this.id, this.onConnect.bind(this));
        this.ipc.on('focus', this.focus.bind(this));
        this.ipc.on('field', this.field.bind(this));
        this.ipc.on('meter', this.meter.bind(this));
        this.ipc.on('filmout_close', this.close.bind(this));
        this.ipc.on('preview', this.preview.bind(this));
        this.ipc.on('preview_frame', this.previewFrame.bind(this));
        this.ipc.on('display', this.onDisplay.bind(this));
    }
    /**
     *
     **/
    set(dir) {
        this.state.dir = dir;
    }
    /**
     *
     **/
    async move() {
        let start = +new Date();
        if (this.state.dir) {
            this.state.frame++;
        }
        else {
            this.state.frame--;
        }
        if (this.state.frame < 1) {
            this.state.frame = 1;
        }
        return (+new Date()) - start;
    }
    /**
    *
    **/
    async start() {
        try {
            await this.ffmpeg.clearAll();
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
            throw err;
        }
        try {
            await this.ffmpeg.frame(this.state, this.light.state);
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
            throw err;
        }
        await this.display.show(this.state.frame);
        await delay_1.delay(20);
    }
    /**
    *
    **/
    async end() {
        await delay_1.delay(20);
        this.display.hide();
    }
    /**
     * Use a video file as a film out source on "projector"
     *
     **/
    async onConnect(evt, arg) {
        let info;
        let frames = 0;
        try {
            info = await this.ffprobe.info(arg.path);
        }
        catch (err) {
            //this.log.error(err, 'FILMOUT', true, true);
            this.state.enabled = false;
            await this.ui.send(this.id, { valid: false });
            return false;
        }
        try {
            frames = await this.ffprobe.frames(arg.path);
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
            this.state.enabled = false;
            await this.ui.send(this.id, { valid: false });
            return false;
        }
        this.state.frame = 0;
        this.state.path = arg.path;
        this.state.fileName = arg.fileName;
        this.state.frames = frames;
        this.state.info = info;
        this.log.info(`Opened ${this.state.fileName}`, 'FILMOUT', true, true);
        this.log.info(`Frames : ${frames}`, 'FILMOUT', true, true);
        this.state.enabled = true;
        return await this.ui.send(this.id, { valid: true, state: JSON.stringify(this.state) });
    }
    async previewFrame(evt, arg) {
        const state = JSON.parse(JSON.stringify(this.state));
        let path;
        state.frame = arg.frame;
        try {
            path = await this.ffmpeg.frame(state, { color: [255, 255, 255] });
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
            ;
            throw err;
        }
        this.ui.send('preview_frame', { path, frame: arg.frame });
    }
    async preview(evt, arg) {
        const state = JSON.parse(JSON.stringify(this.state));
        let path;
        state.frame = arg.frame;
        this.log.info(`Previewing frame ${state.frame} of ${state.fileName}`);
        try {
            path = await this.ffmpeg.frame(state, { color: [255, 255, 255] });
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
            throw err;
        }
        try {
            await this.display.open();
            await this.display.show(arg.frame);
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
        }
    }
    async focus(evt, arg) {
        this.log.info(`Showing focus screen`);
        try {
            await this.display.open();
            await this.display.focus();
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
        }
    }
    async field(evt, arg) {
        this.log.info(`Showing field guide screen`);
        try {
            await this.display.open();
            await this.display.field();
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
        }
    }
    async meter(evt, arg) {
        this.log.info(`Showing meter screen`);
        try {
            await this.display.open();
            await this.display.meter();
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
        }
    }
    async close(evt, arg) {
        try {
            await this.display.hide();
            await this.display.close();
        }
        catch (err) {
            this.log.error(err, 'FILMOUT', true, true);
        }
    }
    onDisplay(evt, arg) {
        this.display.change(arg.display);
        this.log.info(`Changing the display to ${arg.display}`);
    }
}
module.exports = (display, ffmpeg, ffprobe, ui, light) => {
    return new FilmOut(display, ffmpeg, ffprobe, ui, light);
};
//# sourceMappingURL=index.js.map