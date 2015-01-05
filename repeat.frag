#version 140

/**
------------ texture repeat fragment shader ------------

    author: Richman Stewart

    repeats the original texture x, y amount of times

---------------------- use -----------------------------

    repeat - the amount of times to repeat
    the texture horizontally and vertically

**/

in vec4 v_colour;
in vec2 v_tex_coords;
out vec4 pixel;

uniform sampler2D u_texture;
uniform vec2 repeat;

void main() {
    pixel = v_colour * texture2D(u_texture, vec2(mod(v_tex_coords.x * repeat.x, 1), mod(v_tex_coords.y * repeat.y, 1)));
}