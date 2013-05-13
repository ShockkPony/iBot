/*
 * Copyright (c) 2013, David Farrell <shokku.ra@gmail.com>
 *  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * 
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * 
 * - Neither the name of iBot nor the names of its contributors may be used to
 *   endorse or promote products derived from this software without specific
 *   prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

exports.mod = function(context)
{
	this.core$cmd = function(server, prefix, target, cmd, params)
	{
		switch(cmd)
		{
			case 'channels':
				var k;
				if(typeof params[0] === 'undefined')
				{
					k = Object.keys(server.user.channels);
				}
				else
				{
					k = Object.keys(server.users[params[0]].channels);
				}

				server.send('PRIVMSG ' + target + ' :Channels: ' + k.join(', '));
				break;
			case 'myinfo':
				server.send('PRIVMSG ' + target + ' :MYINFO: ' + params[0] + ' = ' + server.get('core').myinfo[params[0]]);
				break;
			case 'isupport':
				server.send('PRIVMSG ' + target + ' :ISUPPORT: ' + params[0] + ' = ' + server.get('core').isupport[params[0]]);
				break;
			case 'mynick':
				server.send('PRIVMSG ' + target + ' :My nick is ' + server.user.nick);
				break;
			case 'identof':
				server.send('PRIVMSG ' + target + ' :Ident of ' + params[0] + ' = ' + server.users[params[0]].ident);
				break;
			case 'hostof':
				server.send('PRIVMSG ' + target + ' :Host of ' + params[0] + ' = ' + server.users[params[0]].host);
				break;

		}
	}

	this.core$mode = function(server, prefix, channel, state, modechar, param)
	{
		server.send('PRIVMSG ' + channel + ' :Mode change detected: ' + (state ? '+' : '-') + modechar + ' ' + param);
	}
}
