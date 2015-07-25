import time
import math
from myLib import moveToPortal  # moveToPortal( a ): triggers a movement toward a portal
from myLib import isMine        # isMine( a ): returns 1 when the portal is dominated by you
                                #                      0 when the portal is dominated by the other player
                                #                     -1 when not dominated by anyone
from myLib import xOfPortal     # xOfPortal( a ): returns the x-coordinate of the portal
from myLib import yOfPortal     # yOfPortal( a ): returns the y-coordinate of the portal

# complete the following functions
def distance(a, b):
    # returns the Euclidean distance between portal "a" and portal "b"

def findNearestTo(a):
    # returns the "id"(0~9) of the portal nearest to "a" (excluding "a" itself)
    # that is not yet dominated
    # NOTE: returns -1 when all portals are dominated by you

nextPortal = 0

while True:
    if isMine( nextPortal ) == 1:
        nextPortal = findNearestTo( nextPortal )
        if nextPortal == -1:
            break
        moveToPortal( nextPortal )
