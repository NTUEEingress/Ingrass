import time
import math
from myLib import moveToPortal  # moveToPortal( a ): triggers a movement toward a portal
from myLib import isMine        # isMine( a ): returns whether the portal is dominated by you
from myLib import xOfPortal     # xOfPortal( a ): returns the x-coordinate of the portal
from myLib import yOfPortal     # yOfPortal( a ): returns the y-coordinate of the portal

nextPortal = 0

for nextPortal in range( 10 ) :
    moveToPortal( nextPortal )
    while ( not isMine( nextPortal ) ) : pass
