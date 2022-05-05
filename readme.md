# Axe Throwing Project

Welcome to the repo housing Dakota Turk's Final project of EE465 Computer Graphics. This take on this project was a modular 3D environment system that would allow for the ability to interact and build the project as if one were designing a game in a 3D engine. The inspirations for this are from 3D game engines such as [Unity](https://unity.com) or [Godot](https://godotengine.org). Included in this report will be things that were both mandatory to implement and not. At the end of this report will be a summary of the mandatory implementations.

- In order to actually run this project, go ahead and give the project a pull/clone in your git bash or prefered method to download a github repo.

- Then you are going to want to install node.js on your machine. Both windows and MAC were used to test and implement this project, so it is safe to say that node.js may be the easiest or best solution to get this all working.

- After getting node.js installed, run

    ``` CMD
        npm install --global http-server 
    ```

    or what ever is your perfered method to instal the htt-server command.

- Once this is complete navigate to the "axe_thrower" folder that is contained within the pulled repo. Then by running this command:

    ``` CMD
    http-server -p 8080 -o AxeThrower/viewer.html 
    ```

    Your machine will launch a small local server as well as open the viewer.html file in your web browser which will then begin your experience with this axe thrower.

## The "Axe Throwing Simulator" Scene

![sampleImg](/AxeThrower/Screenshots/sampleImg.png)

While this isn't a very high performant or very accurate simulation of throwing an axe. The idea of this project was to have fun implementing new things while still allowing for a semi-fun experience for the user when playing this. The idea of this is simply to have some axes near the player than can be picked up and thrown across room. There is also a dice that can be "rolled" near these axes. The first thing to go over is the objects that can be found in the scene:

The chair from Lab 4:

![chair](/AxeThrower/Screenshots/lab4Chair.png)

The die from Labs 3 and 5:

![die](/AxeThrower/Screenshots/lab3and5Dice.png)

The axes which are used for the main interaction of throwing them:

![axes](/AxeThrower/Screenshots/axes.png)

The table which has the axe and ide on them:

![table](/AxeThrower/Screenshots/table.png)

And finally the target:

![target](/AxeThrower/Screenshots/target.png)

While at first this was intended to be a game where you would score more points by hitting closer to the center of the target. It was instead scoped down lower to just allowing the basic funcitonality of throwing the axes. It would be very fun and interesting to scope this project back up to its original idea, but given the timeline and amount of other features that were implemented, turning this into a full game just didn't work out for this time frame. However, there is an intention on fully working that aspect out as well as adding in a few more features that aren't currently implemented.

## Controls

The controls for this aren't very complicated. Basic WASD for movement forward, left, back and right all respectively:

![wasdMove](/AxeThrower/Screenshots/wasdMovement.gif)

Left click on the canvas and drag to look around:

![look](/AxeThrower/Screenshots/clickDragMovement.gif)

Combining the above two to give fairly natrual movement:

![combinedWASDlook](/AxeThrower/Screenshots/combinedWASDClickDrag.gif)

Then to pick up or to drop an axe back to its position it was just in, walk up close to one and press the E key on your keyboard:

![pickupdownTable](/AxeThrower/Screenshots/pickupdownTable.gif)

The most exciting part, to throw an axe, while holding one, press space ( either hold it to prepare to throw it or quick press it to throw without intentional aiming ). Of course this can be combined with the WASD and click and drag controls so that you can aim the axe anywhere in the scene you'd like it to go:

![pickupdownWall](/AxeThrower/Screenshots/pickupdownWall.gif)

One bonus feature that was added in was the ability to interact with the die on the table. To do this, walk up to the die on the table and press e near it while no axes are nearby. This is necessary because the axe interaction takes precedence:

![dieTable](/AxeThrower/Screenshots/rollDie.gif)

Another bonus feature that was left in from Lab 5 is the ability to rotate the die freely using the number keys 7-9:

![manualRoll](/AxeThrower/Screenshots/manualRollDie.gif)

The final bonus feature that is actually left in from Lab 4 is the ability to turn on/off all 6 lights that are currently in the scene using the number keys 1-6:

![lightOnOff](/AxeThrower/Screenshots/lightsOnOff.gif)

## Non-required added features

The first and arguably best feature that was added in is the support for basic obj files. While currently all obj files do need the "0 [obj name]" line in them somewhere before faces are loaded in, the current implementation does support easy adding in of obj models with very minimal setup.

Due to the highly modular design of this engine, it is easy to set up a script that can take advantage of the scene's "update" or "render" functions to perform calculations or object manipulation in order to attain a better experience. An example of this is the [LineRenderer's](/AxeThrower/lineRenderer.js) render function and the [diceRoller's](/AxeThrower/diceRoller.js) update function. Instead of needing to add more and more lines to the [scene](/AxeThrower/scene.js) script or the [game](/AxeThrower/game.js) scripts, instead the render functions and update functions are able to be separated per script/manager so that code management and visuals are highly improved.

Finally the second best feature is probably the restatements of the matrix and vector classes, in addition to the added quaternion class. These classes were given in the MV file in the common folder. Ultimately as this project grew, the additions of these classes and their surrounding functionalities became too great to ignore. Not only this, but the quaternion class itself and the magical things that can be done with it alone were a blast to learn and implement and allow for a very easy manipulation of all objects in the scene to create smooth animations.

## Things to note

A few things to note while interacting with this is that the axes seemingly "collide" with the walls, but nothing else. This isn't particularly true. The trails that the axes follow are calculated using a recursive subdivision function. The first four control points that are used in this function are the position of the axe in the hand, a calculated point of a ray intersecting the wall where the player is looking and two points that follow that ray, but are elevated slightly to give the illusion of a projectile motion path. This path is used as a guidance for the axe to follow from beginning to end. This meaning the axe simply stops in midair at the end of the displayed arc. But that arc does techinally touch whatever quad the player is looking at (the four walls and floor, there is no ceiling). Because of this, the axe never is colliding with anything so it can pass through all objects in the scene except the walls.

A second thing to note is the fact that the die rolling isn't particularly accurate. Instead, when the player interacts with the die, it will cycle through 5 randomly generated rotations to give a similar appearance to rolling it.

A final thing to note is that, sadly, there is no collision happening between any objects. This is a feature that is hopefully going to be implemented later on with this project. Beacuase of this, the player isn't actually colliding with the wall. Instead their movement is limited to within the bounds that the walls represent. This explains why the player can pass through the chair, table and all other objects in the scene.

## Improvements to make in future revisions

A few improvements to be made in the future start with the collision detections. It would be great to have discrete collision detection that would allow the axe to collide with all objects in the scene.

Another major improvement would be to revise the shaders such that they perform faster computations. In order to achieve slightly better lighting scenes, the positions of the vertex are being varried for use in the fragment shader so that the quads ( walls and floor ) are able to have correct lighting. In addition to this, there are plans set in motion to get all types of mapping tactics working with the scene. Such examples include bumb mapping, normal mapping, reflection mapping, shadow mapping, etc... Obj files have some built in functionality which may make it easy to add such things in, but this will be something that is going to be added in at a later date.

Right now there is basic OBJ file loading, but there has not been significant stress tests done to ensure all ( or nearl all ) obj file can be loaded. Currently all that are implemented have been slightly altered so that file names matched and other ease of use features were included.

Finally, one of the best improvements to make would be to make the movement a bit more fluid and less choppy. This isn't a big deal as of right now, but would improve the visual quality of this significantly.
