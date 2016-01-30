import os
from os import walk

gameScript = '// This is automatically generated file.\r'
gameScript = gameScript + '// Do not modify this file.\r'
gameScript = gameScript + '(function() {'

for (dirpath, dirnames, filenames) in walk('.\\src'):
	for filename in filenames:
		path = dirpath + '\\' + filename
		print 'parsing..' + path
		f = open(path, 'r+')
		script = f.read()
		gameScript = gameScript + '\r'
		gameScript = gameScript + script

gameScript = gameScript + '\r'
gameScript = gameScript + 'Main();'
gameScript = gameScript + '\r'
gameScript = gameScript + '}())'

try:
    os.remove('game.js')
except OSError:
    pass
sf = open('game.js', 'w+')
sf.write(gameScript)

os.system('index.html')