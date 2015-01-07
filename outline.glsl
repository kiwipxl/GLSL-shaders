#START_VERTEX
#version 140

/**
-------------- outline vertex shader -------------

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
out vec2 tex_coords;

void main() {
   v_colour = a_colour;
   tex_coords = a_tex_coord;
   gl_Position = matrix * vec4(a_position, 0, 1);
}

#END_VERTEX

#START_FRAGMENT
#version 140

/**
------------ one pass outline shader ------------

    author: Richman Stewart

    applies a gaussian blur horizontally and vertically
    behind the original texture and makes it black

------------------ use ------------------------

    outline_thickness - outline spread amount
    outline_colour - colour of the outline

**/

in vec4 v_colour;
in vec2 tex_coords;
out vec4 pixel;

uniform sampler2D t0;
uniform float outline_thickness = .2;
uniform vec3 outline_colour = vec3(0, 0, 1);
uniform float outline_threshold = .5;

void main() {
    pixel = texture(t0, tex_coords);

    if (pixel.a <= outline_threshold) {
        ivec2 size = textureSize(t0, 0);

        float uv_x = tex_coords.x * size.x;
        float uv_y = tex_coords.y * size.y;

        float sum = 0.0;
        for (int n = 0; n < 9; ++n) {
            uv_y = (tex_coords.y * size.y) + (outline_thickness * float(n - 4.5));
            float h_sum = 0.0;
            h_sum += texelFetch(t0, ivec2(uv_x - (4.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x - (3.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x - (2.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x - outline_thickness, uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x, uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x + outline_thickness, uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x + (2.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x + (3.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x + (4.0 * outline_thickness), uv_y), 0).a;
            sum += h_sum / 9.0;
        }

        if (sum / 9.0 >= 0.0001) {
            pixel = vec4(outline_colour, 1);
        }
    }
}

#END_FRAGMENT