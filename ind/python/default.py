import time
import math
from myLib import moveToPortal  # moveToPortal( a ): triggers a movement toward a portal
from myLib import isMine        # isMine( a ): returns whether the portal is dominated by you
from myLib import xOfPortal     # xOfPortal( a ): returns the x-coordinate of the portal
from myLib import yOfPortal     # yOfPortal( a ): returns the y-coordinate of the portal

# complete the following functions
def distance( a , b ) :
    # returns the Euclidean distance between portal "a" and portal "b"

def findNearestTo( a ) :
    # returns the "id"(0~9) of the portal nearest to "a" (excluding "a" itself)
    # that is not yet dominated

nextPortal = 0

while True :
    if ( isMine( nextPortal ) ) :
        nextPortal = findNearestTo( nowPortal )
        if ( nextPortal == -1 ) :
            break
        moveToPortal( nextPortal )
