# The Engine

This documentation will have an overview of how the engine itself is working. This engine was largely built off of the ideas that other game engines have in place. While this is not a perfect reproduction concept of those engines, this is still a fairly straightforward interpretation on those ideals. To begin with, the first thing to discuss is anthing relating to the "setup" process or "start/awake" process.

## The Start/Awake process

- The start/awake process is the process in which scripts, objects and rendering setup processes are all ran before any animation or actual rendering has happened. During this process one would load assets, prepare the shading attributes and run the setup process for each requried object/class that needs it. A visual representation of this would be:
