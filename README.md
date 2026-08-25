# Mech Yard

A procedural mech general-arrangement drawing, generated in the browser from a
seed. One self-contained HTML file, no build step, no dependencies.

## What it does

Every machine is assembled from a slot contract rather than drawn. A chassis
publishes eleven sockets — and every one of them is a real parting line, the
place the mech would actually come apart in a maintenance bay:

| | |
|---|---|
| `neck` | collar ring on the chest deck |
| `head` | on top of the neck |
| `chest` | frontal hardpoint / cockpit hatch |
| `backpack` | dorsal spine plate |
| `shoulder` | shoulder yoke, off the centreline |
| `humerus` | upper arm below the yoke |
| `forearm` | forearm and whatever terminates it |
| `skirt` | armour hung off the belt |
| `girdle` | pelvic girdle under the torso |
| `drive` | everything below the hip |
| `aux` | the free greeble socket |

Three of the eleven are chained rather than placed: the head sits wherever the
neck ended, the humerus wherever the yoke ended, the forearm wherever the
humerus ended. Every variant in the library is cut to the same socket, so any
combination mates.

The torso is not one body — it is a stack of two to four sections joined by real
couplings, so the chest of one machine can be the abdomen of the next. Chassis
topology and locomotion class are orthogonal axes: **biped, reverse-joint,
quadruped, spider, octopod, tripod, tracked, wheeled and hover** all bolt to the
same girdle, and all nine walking and rolling classes share one articulation kit,
so a spider's third knee is put together like a biped's only knee.

Detail is a property of the machine rather than of whichever variant got the most
care: pistons flank every joint, ribbed conduit runs between plates, there is a
toothed ring at every axis of rotation, and bolt circles and louvre stacks come
from the same kit everywhere they appear.

The drawing is real orthographic projection with hidden-line removal: each mech
is tessellated once into a depth buffer, and every line is clipped against it, so
nothing shows through and draw order never decides what is visible. Shading is
vector hatching cut in each surface's own parameter space, clipped by the same
buffer.

Output is pure vector throughout — the PNG and SVG exports are the same drawing.

## Controls

| | |
|---|---|
| `N` | new mech |
| `R` | reset the pictorial |
| drag | orbit the pictorial |
| rail | lock any slot and roll the rest |

## Running locally

Open `index.html`. That is the whole thing.
