exports = function(options)
{
	this.options = options;
	this.servers = {};

	this.lc =
	{
		out: process.stdout,
		err: process.stderr
	};

	this.start = function()
	{
		for(var kServer in this.servers)
		{
			this.servers[kServer].connect();
		}
	}

	this.log = function(logChannel, message)
	{
		message = util.inspect(message).replace(/[\x00-\x19]/g, '[\\x]');
		this.logUnsafe(logChannel, message);
	}

	this.logUnsafe = function(logChannel, message)
	{
		this.lc[logChannel].write(util.inspect(message) + '\n');
	}

	this.loadModule = function(name, server)
	{
		var path = this.options.modulesPath + '/' + name;

		if(typeof require.cache[require.resolve(path)] !== 'undefined')
		{
			delete require.cache[require.resolve(path)];
		}

		var module = require(path);
		var mod = new module.mod(this);

		if(typeof server === 'undefined' || server === null)
		{
			for(var kServer in this.servers)
			{
				this.servers[kServer].modules[name] = mod;
			}
		}
		else
		{
			server.modules[name] = mod;
		}

		console.error('Loaded module: ' + name);
	}

	this.unloadModule = function(name, server)
	{
		if(server === null)
		{
			for(var kServer in this.servers)
			{
				this.servers[kServer].modules[name] = null;
				delete this.servers[kServer].modules[name];
			}
		}
		else
		{
			server.modules[name] = null;
			delete server.modules[name];
		}

		console.error('Unloaded module: ' + name);
	}
}
