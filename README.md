# iBot Framework

iBot is an IRC client-side framework designed to be extensible and easy to use.

## Usage

### Installation

```
npm install ibot
```

### Quick Start

It's very easy to connect to an IRC server using iBot.

##### index.js
```javascript
require('ibot').start();
```

##### config.json
```json
{
  "servers": {
    "example": {
      "host": "irc.example.com",
      "nick": "MyNick",
      "master": "^.+!.+@isp\.com$"
    }
  },
  "modules": [
    "core",
    "log"
  ]
}
```

`Server.master` is a regular expression which is used for permission checking. This may be changed to an authentication system at a later stage.

The IRC commands available through core are as follows. Angle bracket parameters are required, square bracket parameters are optional.

* `!lmctx <module>`                    - load a module instance into all servers
* `!umctx <module>`                    - unload a module from all servers
* `!lmsrv <module> [name]`             - load a module instance into the current server or the server specified by name
* `!umsrv <module> [name]`             - unload a module from the current server or the server specified by name
* `!modules [name]`                    - list all loaded modules for the current server or the server specified by name
* `!servers`                           - list all servers in the context
* `!addsrv <name> <host> <nick> [ident] [port] [ssl true/false] [master] [modules a,b,etc] [pass]` - connect to a new server with the specified options
* `!rmsrv <name>`                      - disconnect from and remove the server specified by name
* `!quit`                              - disconnect from the current server and remove it
* `!save`                              - save config to disk
* `!rehash`                            - load config from disk
* `!getmaster [name]`                  - get master regexp for the current server or the server specified by name
* `!setmaster <master> [name]`         - set master regexp for the current server or the server specified by name
* `!do <command>`                      - echo the command and then run it
* `!times <num> <command>`             - run the command multiple times

### Modules

iBot has an extensible, robust module system. Some modules are bundled with the package, such as `core` and `log`. User modules should go inside the `modules` directory in the root project directory. Modules can be loaded at startup by adding them to the modules section of config.json as in the Quick Start.

##### Outputs `Hello, <nick>!`
```javascript
exports.mod = function(context, server)
{
	// hook into cmd event from core
	this.core$cmd = function(prefix, target, command, params, $core)
	{
		if(command === 'helloworld')
		{
			// will output "Hello, <nick>!"
			$core._privmsg(target, 'Hello, ' + prefix.nick + '!');
		}
	}
}
```

##### Increments a counter and saves back to the config

```javascript
exports.mod = function(context, server)
{
	this.counter = 0;

	// load
	this._load = function(data)
	{
		if(typeof data === 'number') this.counter = data;
	}

	// save
	this._save = function()
	{
		return this.counter;
	}

	// suspend
	this._suspend = function()
	{
		return this.counter;
	}

	// resume
	this._resume = function(data)
	{
		if(typeof data === 'number') this.counter = data;
	}

	// hook into cmd event from core
	this.core$cmd = function(prefix, target, command, params)
	{
		if(command === 'counter')
		{
			server.do('core$privmsg', target, 'Counter is now: ' + ++this.counter);
		}
	}
}
```

##### Detects CTCP requests and replies
```javascript
exports.mod = function(context, server)
{
	// hook into global recv event
	this.$recv = function(prefix, opcode, params)
	{
		// params[0] is target, params[1] is message
		switch(opcode)
		{
			case 'PRIVMSG':
				if(params[1][0] === '\001' && params[1][params[1].length - 1] === '\001')
				{
					console.log('detected CTCP request!');
				}
				break;
			case 'NOTICE':
				if(params[1][0] === '\001' && params[1][params[1].length - 1] === '\001')
				{
					console.log('detected CTCP reply!');
				}
				break;
		}
	}
}
```
