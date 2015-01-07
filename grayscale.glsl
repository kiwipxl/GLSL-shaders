#START_VERTEX
#version 140

/**
-------------- grayscale vertex shader -------------

    author: Richman Stewart

    simple vertex shader that sets the position
    to the specified matrix and position while
    passing the vertex colour and tex coords
    to the fragment shader

**/

in vec2 a_position;
in vec2 a_tex_coord;
in vec4 a_colour;

uniform mat4 matrix;

out vec4 v_colour;
out vec2 tex_coord;

void main() {
   v_colour = a_colour;
   tex_coord = a_tex_coord;
   gl_Position = matrix * vec4(a_position, 0, 1);
}

#END_VERTEX

#START_FRAGMENT
#version 140

/**
------------ grayscale fragment shader ------------

    author: Richman Stewart

    changes each colour to grayscale using NTSC
    conversion weights

**/

in vec4 v_colour;
in vec2 tex_coord;
out vec4 pixel;

uniform sampler2D t0;

void main() {
    pixel = texture(t0, tex_coord);
    float g = dot(pixel.rgb, vec3(0.299, 0.587, 0.114));
    pixel.rgb = vec3(g, g, g);
}

#END_FRAGMENT