import time
from myLib import moveToPortal  # moveToPortal( a ): triggers a movement toward a portal
from myLib import isMine        # isMine( a ): returns whether the portal is dominated by you
i=1
moveToPortal( 1 )
start = time.time()
while True:
    if isMine(i):
        moveToPortal( (i+7)%10 )
        i=(i+7) % 10
        start = time.time()
    if time.time() - start > 5000 :
        moveToPortal( (i+7)%10 )
        start = time.time()
        i=(i+7) % 10
