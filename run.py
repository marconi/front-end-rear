# -*- coding: utf-8 -*-

import os
import sys
import commands


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print "Usage: python run.py [URL]"
        sys.exit(1)
    base = os.path.dirname(os.path.abspath(__file__))
    conf = os.path.join(base, 'config.json')
    scaper = os.path.join(base, 'scraper.js')
    cmd = 'phantomjs --config=%s %s "%s"' % (conf, scaper, sys.argv[1])
    out = commands.getoutput(cmd)
    print out
