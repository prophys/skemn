import os
from os import walk

gameScript = '(function() {'

for (dirpath, dirnames, filenames) in walk('.\\src'):
	for filename in filenames:
		path = dirpath + '\\' + filename
		print 'parsing..' + path
		f = open(path, 'r+')
		script = f.read()
		gameScript = gameScript + '\r\n'
		gameScript = gameScript + script

gameScript = gameScript + '\r\n'
gameScript = gameScript + 'Main();'
gameScript = gameScript + '\r\n'
gameScript = gameScript + '}())'

try:
    os.remove('game.js')
except OSError:
    pass
sf = open('game.js', 'w+')
sf.write(gameScript)