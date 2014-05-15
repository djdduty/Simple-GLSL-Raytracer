Simple-GLSL-Raytracer
=====================

A raytracer that consists entirely of a fragment shader. Just throw this in a shader toy or use it to render a fullscreen quad. Runs in !REALTIME! at 60fps(vsync on) on my GTX 780 ti.

GLSL has no recursion due to obvious reasons, but I figured 3 bounces is all you'll ever need in real time and decided just to repeat the trace function three times...
