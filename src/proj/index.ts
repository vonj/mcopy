/** class representing the Projector features **/

import Log = require('log');

class Projector {
	private state : any = { dir : true, digital : false };
	private arduino : Arduino = null;
	//private dig : Digital = null;
	private log : any;
	private cfg : any;
	private ui : any;
	private ipc : any;
	private dig : any;

	/**
	 *
	 **/
	constructor (arduino : Arduino, cfg : any, ui : any, dig : any) {
		this.arduino = arduino;
		this.cfg = cfg;
		this.ui = ui;
		this.dig = dig;
		this.init();
	}

	/**
	 *
	 **/
	async init () {
		this.log = await Log({ label : 'proj' })
		this.ipc = require('electron').ipcMain;
		this.listen();
	}

	/**
	 *
	 **/
	private listen () {
		this.ipc.on('proj', this.listener.bind(this));
	}

	/**
	 *
	 **/
	async set (dir : boolean, id : string) {
		let cmd : string;
		let ms : number;
		if (dir) {
			cmd = this.cfg.arduino.cmd.proj_forward
		} else {
			cmd = this.cfg.arduino.cmd.proj_backward
		}
		this.state.dir = dir
		if (this.dig.state.enabled) {
			this.dig.set(dir)
		} else {
			try {
				ms = await this.arduino.send('projector', cmd)
			} catch (err) {
				this.log.error('Error setting projector direction', err)
			}
		}
		return await this.end(cmd, id, ms)
	}

	/**
	 *
	 **/
	async move (frame : any, id : string) {
		const cmd : string = this.cfg.arduino.cmd.projector;
		let ms : number;
		if (this.dig.state.enabled) {
			try {
				ms = await this.dig.move()
			} catch (err) {
				this.log.error(err)
			}
		} else {
			try {
				ms = await this.arduino.send('projector', cmd)
			} catch (err) {
				this.log.error('Error moving projector', err)
			}
		}
		this.log.info('Projector move time', { ms });
		return await this.end(this.cfg.arduino.cmd.projector, id, ms)
	}

	/**
	 *
	 **/
	private async listener  (event : any, arg : any){
		if (typeof arg.dir !== 'undefined') {
			try {
				await this.set(arg.dir, arg.id)
			} catch (err) {
				this.log.error(err)
			}
		} else if (typeof arg.frame !== 'undefined') {
			try {
				await this.move(arg.frame, arg.id)
			} catch (err) {
				this.log.error(err)
			}
		} else if (typeof arg.val !== 'undefined') {
			this.dig.state.frame = arg.val
		}
		event.returnValue = true
	}

	/**
	 *
	 **/
	async end (cmd : string, id : string, ms : number) {
		let message : string = '';
		if (cmd === this.cfg.arduino.cmd.proj_forward) {
			message = 'Projector set to FORWARD'
		} else if (cmd === this.cfg.arduino.cmd.proj_backward) {
			message = 'Projector set to BACKWARD'
		} else if (cmd === this.cfg.arduino.cmd.projector) {
			message = 'Projector '
			if (this.state.dir) {
				message += 'ADVANCED'
			} else {
				message += 'REWOUND'
			}
			message += ' 1 frame'
		}
		this.log.info(message, 'PROJECTOR')
		return await this.ui.send('proj', {cmd: cmd, id : id, ms: ms})
	}
}

module.exports = function (arduino : Arduino, cfg : any, ui : any, dig : any) {
	return new Projector(arduino, cfg, ui, dig);
}