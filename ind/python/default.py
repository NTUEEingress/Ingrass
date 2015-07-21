import time
import math
from myLib import moveToPortal  # moveToPortal( a ): triggers a movement toward a portal
from myLib import isMine        # isMine( a ): returns whether the portal is dominated by you
from myLib import xOfPortal     # xOfPortal( a ): returns the x-coordinate of the portal
from myLib import yOfPortal     # yOfPortal( a ): returns the y-coordinate of the portal

# complete the following functions
def distance( a , b ) :
    return ( ( xOfPortal( a ) - xOfPortal( b ) ) ** 2 + ( yOfPortal( a ) - yOfPortal( b ) ) ** 2 ) ** 0.5
    # returns the Euclidean distance between portal "a" and portal "b"

def findNearestTo( a ) :
    x = 200000
    y = -1
    for i in range( 0 , 10 ) :
        if distance( a , i ) < x and not isMine( i ) :
            x = distance( a , i )
            y = i
    return y
    # returns the "id"(0~9) of the portal nearest to "a" (excluding "a" itself)
    # that is not yet dominated

nextPortal = 0

while True :
    if ( isMine( nextPortal ) ) :
        nextPortal = findNearestTo( nextPortal )
        if ( nextPortal == -1 ) :
            break
        moveToPortal( nextPortal )
