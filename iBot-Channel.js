exports.Channel = function(name)
{
	this.name = name;
	this.topic = '';
	this.users = {};
	this.modes = [];
}
