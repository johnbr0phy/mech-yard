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
| `yoke R`/`L` | shoulder yoke, one per side, rolled separately |
| `arm R`/`L` | upper arm below each yoke |
| `fore R`/`L` | forearm and whatever terminates it |
| `skirt` | armour hung off the belt |
| `girdle` | pelvic girdle under the torso |
| `drive` | everything below the hip |
| `aux` | the free greeble socket |

**The shoulders carry the width.** Held to the torso's own half-width they make
something tall and narrow, which is not what a mech looks like — the yokes are
supposed to be the widest thing on it, and the arms are supposed to come down
out from *under* them rather than off the sides of the ribs. The allowance runs
to about two and a half torso radii, and the yoke library fills it: the variants
were only using half to three quarters of whatever they were given, so widening
the envelope alone would have changed nothing.

The humerus is then hung well below the yoke and left to the attachment
guarantee, which drags along the mounting axis — upward, for an arm. Too little
drop and it starts inside the pauldron; too much and it is pulled up until it
meets the underside. The join is found rather than specified.

And once the yokes are broad, a head perched above them looks stuck on, so it
sinks by however far the yokes reach up the torso: a chassis carrying its
shoulders at collar height gets a head down between the pads, one carrying them
at mid-chest keeps its neck.

**The arms are handed.** Everything else is bilateral and the mirror pass gives
that away for free, but a mirror can only ever build a machine holding two of
the same thing — and one close-combat arm beside one ranged arm is not a
variation on the Dreadnought pattern, it *is* the pattern. So each arm is a
chain of its own: its own yoke, its own humerus, its own forearm, rolled
independently and locked independently. They still agree about two times in
five, because a matched pair is a real machine too.

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

### Heads

The head is 8% of the machine and carries most of its character, so it gets its
own foundry. Three rules, taken off the mobile-suit sheets rather than invented:

1. **Helmet and face are separate volumes.** The cranium sits *behind* the socket
   axis; the faceplate stands proud of it, narrower, stepped in three bands.
   The shadow gap between them is what stops a head reading as a box.
2. **The jaw tapers and comes forward.** A skull the same width at the chin as at
   the temples is a carton.
3. **Antennae sweep** — up, out and back. Vertical prongs are the single most
   cardboard thing a head can do.

Eight marks: **V-FIN, MONO-EYE, VISOR, MASK, CREST, SENSOR DRUM, CUPOLA,
TURRET** — sharing one kit of crown, faceplate, eyes, jaw, cheek pods and ear
vents, so the cheek pod on a mono-eye is the cheek pod on a V-fin and the
machines look related even when their faces do not.

### Bodies and limbs

Blockiness is a vocabulary problem, not a rendering one. The renderer has always
known how to draw a body of revolution — silhouette by convex hull, real
stations, proper meridians, elliptical cross-sections — but only the chassis
could make one, so every arm and every armour plate in the library was stuck
being a box or a constant-radius cylinder. The variant builder can make them
now, and three rules follow from mecha construction:

1. **The torso is an hourglass, not a taper.** Narrow at the belt, thrown wide
   at the yokes, drawn back in at the collar — the chest trapezoid, as a solid.
   Each chassis just says how hard to pinch.
2. **Bones swell through the belly and thin at both joints.** A constant radius
   reads as plumbing. Every joint then gets a flared cap that overhangs the bone
   below it, pointed along the bisector of the two bones — so a knee that bends
   forward is armoured on the front and a reverse joint on the back, without
   either being told which it is.
3. **Turn a plate about its thin axis.** Taking the longest extent as the axis
   of revolution is the obvious choice and it is wrong for anything flat: a
   plate 10 x 2 x 8 turned about its long side has a 4:1 cross-section, and a
   4:1 ellipse renders as a squashed lozenge with visible banding. The same
   plate turned about its *thin* axis is a short round disc, which is what a
   plate actually is. Every block picks whichever axis leaves the roundest
   section; a post still comes out a post.
4. **Armour is a lozenge with its corners taken off**, standing proud of the
   frame and stopping short of both joints so the frame shows through. Cross
   sections are oval: wider than deep on a chest, on a shin, on a plate.

### Weapons

The Dreadnought pattern, which is a different idea about arms from the one this
started with. Three things make it read:

1. **Both arms are weapons.** A hand is the exception. The arm does not hold a
   gun — the gun *is* the arm, bolted to a mantlet at the elbow, and the
   mantlet's round mount plate is the joint you see.
2. **Twin-linked.** Two bores side by side on one mount is the most recognisable
   silhouette in the catalogue and costs one extra call.
3. **The secondary is underslung and the feed is visible** — a storm bolter
   under the fist, a belt or power cable running back into the body. That is
   what makes a weapon look plumbed into the machine rather than placed next
   to it.

Bores come in **patterns, not sizes**, because a las tube and a melta bore are
different objects rather than the same object scaled: `las` is long, slim and
ringed with coils; `melta` is stubby and all aperture; `plasma` is a bulbous
containment bottle necking down to an emitter; `bolter` is a ribbed cooling
jacket; `solid` is a heavy tube with a muzzle brake.

Fourteen forearms run from a five-finger manipulator to a twin lascannon:
**MANIPULATOR, THREE-CLAW, CLAMP, AUTOCANNON, BEAM RIFLE, SHIELD ARM, DRILL,
TWIN LASCANNON, ASSAULT CANNON, POWER FIST, MULTI-MELTA, PLASMA CANNON,
MISSILE RACK, MISSILE FIST** — and the yoke carries its own: a carapace
**CYCLONE** cell block, a **TWIN MOUNT** turret, a gatling drum, a missile box.

What a machine ends up carrying is what names it: the role is read off the
finished build, so a drill and a clamp with no gun on them makes a works rig
and a pair of cannon makes an assault walker.

Detail elsewhere is a property of the machine rather than of whichever variant
got the most care: pistons flank every joint, ribbed conduit runs between plates, there is a
toothed ring at every axis of rotation, and bolt circles and louvre stacks come
from the same kit everywhere they appear.

### Big masses

A large body drawn as one smooth solid reads as a barrel however well it is
proportioned, because there is nothing on it to give the eye a scale. The torso
escapes that by being a *stack* — sections, couplings, rings — and the
chassis-authored masses did not, so a split hull came out as two sausages and a
dorsal pack as a keg. They get the same treatment now: the length broken into
segments with a real waist and a bolted ring at every joint, strakes down the
outside, a plate on each end. None of it is fine detail; it is all silhouette
and shadow line, which is exactly what a big surface is short of.

### Rigging

A variant is authored blind. The forearm does not know a backpack exists, the
yoke does not know what chassis it landed on, and neither can run a cable to the
other because neither can see it — so every loom inside the variant library is a
loop that starts and ends on the same part. Decoration, not plumbing.

Once the machine is assembled that constraint is gone, so a final pass looks at
the finished object and asks a question no variant can: **what is near what?**
It runs conduit *between* groups along a table of routes that a real machine
would follow — pack to yoke, yoke to humerus, girdle to drive — bolts a boss
where each run lands, adds plug sockets and panel fittings on the surfaces with
room for them, and clamps the slack down.

It runs *after* the mirror, so the port side gets its own routing. Two identical
arms still come out rigged differently, which is where most of a frame's
individuality now comes from. Every run starts from a point already on a
surface, so nothing the pass adds can float; the sag is pushed out along both
surface normals, because a run that dips inward is correctly hidden by the
hidden-line pass and was never worth drawing.

About a third of the parts on a finished machine are rigging.

**The plate does not move when the drawing does.** A designation is a bijection
of the seed, so nothing on it may depend on how densely the sheet is dressed —
and four separate things did. Random values drawn *inside* a detail-sized loop
shifted the whole stream, so the Greebling slider rolled a different machine out
of the same seed; the class name was drawn after the rigging pass had consumed
randomness in proportion to detail; the bounding box grew as fittings were added
to it; and tonnage read off that box carried the drift into the role band, which
picks the name pool. Loops now draw a fixed table and emit part of it, the class
name comes off the seed, the plate quotes the structure rather than the dressing,
and both tonnage and role band come from chassis bulk — a figure fixed before a
single part is drawn. Measured across 200 seeds at both ends of the slider:
zero drift.

### Nothing floats

Every socket is checked against the thing it hangs off, and anything in mid-air
is drawn back along its mounting direction until it bites. That test used to ask
one question per socket — does this variant, *taken as a whole*, touch its
parent? — which is right for a variant that is one object and wrong for one that
is nine: a launcher bolted on by its root passes while its cells hang in space.

Each group is now split into what is actually connected to what. Islands that
reach the anchor are kept, islands that do not are pulled in, and anything that
never bites is dropped — a floating cell block is worse than no cell block.
Contact is judged on where a part's mass is, not only on its extremities:
corners are the eight points of a box furthest from its own bulk, and a louvre
seated snugly in a curved shell has all eight of them poking out through the
surface.

Chained sockets get a second rule. A child is placed a fixed way along its
parent's *envelope* — the humerus at 0.70 of the yoke's allowance — and that is
only right if variants fill their envelopes, which they do not: a missile box
takes half the yoke it is given, so the arm hung at a spread the yoke never
reached. The join was being placed against a promise instead of against the
part. Now the parent is asked where it actually got to: project everything it
built onto its own outward axis, take the furthest, put the child there. And a
chained slot roots in **its parent only** — handing it the chassis as well let
an arm count as attached because it grazed the torso, and the drag then stopped
the moment it did.

Measured across 30–80 machines: floating parts 0.90% → 0.06%, and detached
chained joins — head to neck, humerus to yoke, forearm to humerus, drive to
girdle — 8.1% → 0%.

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
