#START_VERTEX
#version 140

/**
-------------- blur vertex shader -------------

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
------------ one pass blur shader ------------

    author: Richman Stewart

    applies a gaussian blur horizontally and vertically

------------------ use ------------------------

    blur_size - blur spread amount

**/

in vec4 v_colour;
in vec2 tex_coord;
out vec4 pixel;

uniform sampler2D t0;
uniform vec2 blur_size = vec2(.5, .5);

void main() {
    ivec2 size = textureSize(t0, 0);

    float uv_x = tex_coord.x * size.x;
    float uv_y = tex_coord.y * size.y;

    vec4 sum = vec4(0.0);
    for (int n = 0; n < 9; ++n) {
        uv_y = (tex_coord.y * size.y) + (blur_size.y * float(n - 4.5));
        vec4 h_sum = vec4(0.0);
        h_sum += texelFetch(t0, ivec2(uv_x - (4.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x - (3.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x - (2.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x - blur_size.x, uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x, uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x + blur_size.x, uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x + (2.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x + (3.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x + (4.0 * blur_size.x), uv_y), 0);
        sum += h_sum / 9.0;
    }

    pixel = sum / 9.0;
}

#END_FRAGMENT