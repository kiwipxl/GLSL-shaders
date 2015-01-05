#version 140

/**
------------ one pass glow shader ------------

    author: Richman Stewart

    applies a gaussian glow horizontally and vertically
    behind the original texture

------------------ use ------------------------

    glow_size - defines the spread x and y
    glow_colour - the colour of the glow
    glow_intensity - glow intensity

**/

in vec4 v_colour;
in vec2 v_tex_coords;
out vec4 pixel;
ivec2 size;

uniform sampler2D u_texture;
uniform vec2 glow_size;
uniform vec3 glow_colour;
uniform float glow_intensity;

const float glow_threshold = .75;

void main() {
    pixel = texture(u_texture, v_tex_coords);
    if (pixel.a <= glow_threshold) {
        size = textureSize(u_texture, 0);

        float step_x = glow_size.x;
        float step_y = glow_size.y;
        float uv_x = v_tex_coords.x * size.x;
        float uv_y = v_tex_coords.y * size.y;

        float sum = 0.0;
        for (int n = 0; n < 9; ++n) {
            uv_y = (v_tex_coords.y * size.y) + (step_y * float(n - 4.5));
            float h_sum = 0.0;
            h_sum += texelFetch(u_texture, ivec2(uv_x - (4.0 * step_x), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x - (3.0 * step_x), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x - (2.0 * step_x), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x - step_x, uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x, uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x + step_x, uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x + (2.0 * step_x), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x + (3.0 * step_x), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x + (4.0 * step_x), uv_y), 0).a;
            sum += h_sum / 9.0;
        }

        pixel = vec4(glow_colour, (sum / 9.0) * glow_intensity);
    }
}