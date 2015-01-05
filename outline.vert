#version 140

/**
-------------- outline vertex shader -------------

    author: Richman Stewart

    simple vertex shader that sets the position
    to the inputted matrix and position while
    passing the vertex colour and tex coords
    to the fragment shader

**/

in vec4 a_position;
in vec4 a_color;
in vec2 a_texCoord0;

uniform mat4 u_projTrans;

out vec4 v_colour;
out vec2 v_tex_coords;

void main() {
   v_colour = a_color;
   v_tex_coords = a_texCoord0;
   gl_Position = u_projTrans * a_position;
}