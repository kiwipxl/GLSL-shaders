#version 140

/**
------------ grayscale fragment shader ------------

    author: Richman Stewart

    changes each colour to grayscale using NTSC
    conversion weights

**/

in vec4 v_colour;
in vec2 v_tex_coords;
out vec4 pixel;

uniform sampler2D u_texture;

void main() {
    pixel = texture(u_texture, v_tex_coords);
    float g = dot(pixel.rgb, vec3(0.299, 0.587, 0.114));
    pixel.rgb = vec3(g, g, g);
}