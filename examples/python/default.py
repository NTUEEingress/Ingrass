import time
import math
from myLib import moveToPortal
from myLib import isMine
from myLib import xOfPortal
from myLib import yOfPortal
# type codes below
def distance( a , b ) :
	return math.sqrt( math.pow( xOfPortal( a ) - xOfPortal( b ) , 2 ) + math.pow( yOfPortal( a ) - yOfPortal( b ) , 2 ) )

def findNearestTo( a ) :
	dis = 100000
	pid = -1
	for i in range( 1 , 10 ) :
		if ( i != a and distance( a , i ) < dis and not isMine( i ) ) :
			dis = distance( a , i )
			pid = i
	return pid

nowPortal = 0
nextPortal = findNearestTo( nowPortal )
moveToPortal( nextPortal )

while True :
	if ( isMine( nextPortal ) ) :
		nowPortal = nextPortal
		nextPortal = findNearestTo( nowPortal )
		if ( nextPortal == -1 ) :
			break
		moveToPortal( nextPortal )
#id = 1
#moveToPortal( id )
#while True :
#	if isMine( id ) :
#		id = id + 1
#		moveToPortal( id )

