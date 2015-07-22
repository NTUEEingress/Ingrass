import sys
import time

def moveToPortal( x ) :
    time.sleep( 0.05 )
    assert( x >= 0 and x < 10 )
    print( x )
    sys.stdout.flush()

def isMine( x ) :
    time.sleep( 0.05 )
    assert( x >= 0 and x < 10 )
    print( x + 10 )
    sys.stdout.flush()
    host = input()
    #print( "zzz: "+host )
    return host == "true"

def xOfPortal( x ) :
    time.sleep( 0.01 )
    assert( x >= 0 and x < 10 )
    print( x + 20 )
    sys.stdout.flush()
    host = input()
    return float( host )

def yOfPortal( x ) :
    time.sleep( 0.01 )
    assert( x >= 0 and x < 10 )
    print( x + 30 )
    sys.stdout.flush()
    host = input()
    return float( host )

