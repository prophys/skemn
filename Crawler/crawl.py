#-*- coding: cp949 -*-
import urllib
from bs4 import BeautifulSoup

html = urllib.urlopen('http://otorrent.me/i/board.php?bo_table=newumav&sca=&sfl=wr_subject%7C%7Cwr_5&sop=and&stx=%E3%83%AC%E3%82%BA&x=33&y=6')

soup = BeautifulSoup(html, "lxml")
titles = soup.find_all("a", "title")
print soup.title
 
for title in titles:
    print 'title:{0:10s} link:{1:20s}\n'.format(title['title'].encode('utf-8'), title['href'].encode('utf-8'))