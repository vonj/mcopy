'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const delay_1 = require("delay");
class Commands {
    /**
     * @constructor
     * Assign all connected devices and mock devices as private classes.
     *
     * @param {object} cfg Configuration object
     * @param {object} proj Projector 1
     * @param {object} cam  Camera 1
     * @param {object} light Light source
     * @param {object} cam2 (optional) Camera 2
     * @param {object} proj2 {optional} Projector 2
     **/
    constructor(cfg, proj, cam, light, cam2 = null, proj2 = null) {
        this.cfg = cfg;
        this.proj = proj;
        this.cam = cam;
        this.light = light;
        if (cam2)
            this.cam2 = cam2;
        if (proj2)
            this.proj2 = proj2;
        this.ipc = require('electron').ipcMain;
    }
    /**
     * Move the projector one frame forward
     *
     * @returns {integer} Length of action in ms
     **/
    async projector_forward() {
        let ms;
        try {
            if (!this.proj.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.proj.move();
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the projector one frame backward
     *
     * @returns {integer} Length of action in ms
     **/
    async projector_backward() {
        let ms;
        try {
            if (this.proj.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.proj.move();
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the camera one frame forward
     *
     * @param {array} 	 rgb 	   Color to set light for frame
     *
     * @returns {integer} Length of action in ms
     **/
    async camera_forward(rgb = [255, 255, 255]) {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let ms;
        try {
            if (!this.cam.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(rgb, id);
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.cam.move();
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the camera one frame forward with light off
     *
     * @returns {integer} Length of action in ms
     **/
    async black_forward() {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let ms;
        try {
            if (!this.cam.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id); //make sure set to off
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.cam.move();
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the camera one frame backward
     *
     * @param {array} 	 rgb 	   Color to set light for frame
     *
     * @returns {integer} Length of action in ms
     **/
    async camera_backward(rgb = [255, 255, 255]) {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let ms;
        try {
            if (this.cam.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(rgb, id);
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.cam.move();
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the camera one frame forward, light set to black or off
     *
     * @returns {integer} Length of action in ms
     **/
    async black_backward() {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let ms;
        try {
            if (this.cam.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id); //make sure set to off
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.cam.move();
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the second camera one frame forward
     *
     * @param {array} 	 rgb 	   Color to set light for frame
     *
     * @returns {integer} Length of action in ms
     **/
    async camera_second_forward(rgb = [255, 255, 255]) {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let ms;
        try {
            if (!this.cam2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam2.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(rgb, id);
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.cam2.move();
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the second camera one frame backward
     *
     * @param {array} 	 rgb 	   Color to set light for frame
     *
     * @returns {integer} Length of action in ms
     **/
    async camera_second_backward(rgb = [255, 255, 255]) {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let ms;
        try {
            if (this.cam2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam2.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(rgb, id);
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.cam2.move();
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the both cameras one frame forward
     *
     * @param {array} 	 rgb 	   Color to set light for frame
     *
     * @returns {integer} Length of action in ms
     **/
    async cameras_forward(rgb = [255, 255, 255]) {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let both;
        let ms;
        try {
            if (!this.cam.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam.set(true);
            }
            if (!this.cam2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam2.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(rgb, id);
            await delay_1.delay(this.cfg.arduino.serialDelay);
            if (this.cam && this.cam2 && this.cam.arduino.alias.camera === this.cam.arduino.alias.camera_second) {
                ms = await this.cam.both();
            }
            else {
                this.cam.move();
                this.cam2.move();
                both = [await this.cam.move, await this.cam2.move];
                ms = Math.max(...both);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the both cameras one frame backward
     *
     * @param {array} 	 rgb 	   Color to set light for frame
     *
     * @returns {integer} Length of action in ms
     **/
    async cameras_backward(rgb = [255, 255, 255]) {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let both;
        let ms;
        try {
            if (this.cam.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam.set(false);
            }
            if (this.cam2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam2.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(rgb, id);
            await delay_1.delay(this.cfg.arduino.serialDelay);
            if (this.cam && this.cam2 && this.cam.arduino.alias.camera === this.cam.arduino.alias.camera_second) {
                ms = await this.cam.both();
            }
            else {
                this.cam.move();
                this.cam2.move();
                both = [await this.cam.move, await this.cam2.move];
                ms = Math.max(...both);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move first camera one frame forward and rewind secondary camera one frame backward
     *
     * @param {array} 	 rgb 	   Color to set light for frames
     *
     * @returns {integer} Length of action in ms
     **/
    async camera_forward_camera_second_backward(rgb = [255, 255, 255]) {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let both;
        let ms;
        try {
            if (!this.cam.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam.set(true);
            }
            if (this.cam2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam2.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(rgb, id);
            await delay_1.delay(this.cfg.arduino.serialDelay);
            if (this.cam && this.cam2 && this.cam.arduino.alias.camera === this.cam.arduino.alias.camera_second) {
                ms = await this.cam.both();
            }
            else {
                this.cam.move();
                this.cam2.move();
                both = [await this.cam.move, await this.cam2.move];
                ms = Math.max(...both);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Rewind first camera one frame backward and move secondary camera one frame forward
     *
     * @param {array} 	 rgb 	   Color to set light for frame
     *
     * @returns {integer} Length of action in ms
     **/
    async camera_backward_camera_second_forward(rgb = [255, 255, 255]) {
        const id = uuid_1.v4();
        const off = [0, 0, 0];
        let both;
        let ms;
        try {
            if (this.cam.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam.set(false);
            }
            if (!this.cam2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.cam2.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(rgb, id);
            await delay_1.delay(this.cfg.arduino.serialDelay);
            if (this.cam && this.cam2 && this.cam.arduino.alias.camera === this.cam.arduino.alias.camera_second) {
                ms = await this.cam.both();
            }
            else {
                this.cam.move();
                this.cam.move();
                both = [await this.cam.move, await this.proj2.move];
                ms = Math.max(...both);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            await this.light.set(off, id);
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the secondary projector forward one frame
     *
     * @returns {integer} Length of action in ms
     **/
    async projector_second_forward() {
        let ms;
        try {
            if (!this.proj2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj2.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.proj2.move();
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Rewind the secondary projector backward one frame
     *
     * @returns {integer} Length of action in ms
     **/
    async projector_second_backward() {
        let ms;
        try {
            if (this.proj2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj2.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            ms = await this.proj2.move();
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the both projectors forward one frame
     *
     * @returns {integer} Length of action in ms
     **/
    async projectors_forward() {
        let both;
        let ms;
        try {
            if (!this.proj.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj.set(true);
            }
            if (!this.proj2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj2.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            if (this.proj && this.proj2 && this.proj.arduino.alias.projector === this.proj.arduino.alias.projector_second) {
                ms = await this.proj.both();
            }
            else {
                this.proj.move();
                this.proj2.move();
                both = [await this.proj.move, await this.proj2.move];
                ms = Math.max(...both);
            }
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Rewind both projectors backwards one frame
     *
     * @returns {integer} Length of action in ms
     **/
    async projectors_backward() {
        let both;
        let ms;
        try {
            if (this.proj.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj.set(false);
            }
            if (this.proj2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj2.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            //run one projector without await?
            if (this.proj && this.proj2 && this.proj.arduino.alias.projector === this.proj.arduino.alias.projector_second) {
                ms = await this.proj.both();
            }
            else {
                this.proj.move();
                this.proj2.move();
                both = [await this.proj.move, await this.proj2.move];
                ms = Math.max(...both);
            }
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Move the primary projector forward one frame and rewind the secondary projector
     * one frame backwards.
     *
     * @returns {integer} Length of action in ms
     **/
    async projector_forward_projector_second_backward() {
        let both;
        let ms;
        try {
            if (!this.proj.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj.set(true);
            }
            if (this.proj2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj2.set(false);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            //run one projector without await?
            if (this.proj && this.proj2 && this.proj.arduino.alias.projector === this.proj.arduino.alias.projector_second) {
                ms = await this.proj.both();
            }
            else {
                this.proj.move();
                this.proj2.move();
                both = [await this.proj.move, await this.proj2.move];
                ms = Math.max(...both);
            }
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
    /**
     * Rewind the primary projector backwards one frame and move the secondary
     * projector forward one frame.
     *
     * @returns {integer} Length of action in ms
     **/
    async projector_backward_projector_second_forward() {
        let both;
        let ms;
        try {
            if (this.proj.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj.set(false);
            }
            if (!this.proj2.state.dir) {
                await delay_1.delay(this.cfg.arduino.serialDelay);
                await this.proj2.set(true);
            }
            await delay_1.delay(this.cfg.arduino.serialDelay);
            //run one projector without await?
            if (this.proj && this.proj2 && this.proj.arduino.alias.projector === this.proj.arduino.alias.projector_second) {
                ms = await this.proj.both();
            }
            else {
                this.proj.move();
                this.proj2.move();
                both = [await this.proj.move, await this.proj2.move];
                ms = Math.max(...both);
            }
        }
        catch (err) {
            throw err;
        }
        return ms;
    }
}
module.exports = function (cfg, proj, cam, light, cam2, proj2) {
    return new Commands(cfg, proj, cam, light, cam2, proj2);
};
//# sourceMappingURL=index.js.map