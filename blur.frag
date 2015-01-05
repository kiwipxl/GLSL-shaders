#version 140

/**
------------ one pass blur shader ------------

    author: Richman Stewart

    applies a gaussian blur horizontally and vertically

------------------ use ------------------------

    blur_size - blur spread amount

**/

in vec4 v_colour;
in vec2 v_tex_coords;
out vec4 pixel;

uniform sampler2D u_texture;
uniform vec2 blur_size;

void main() {
    ivec2 size = textureSize(u_texture, 0);

    float uv_x = v_tex_coords.x * size.x;
    float uv_y = v_tex_coords.y * size.y;

    vec4 sum = vec4(0.0);
    for (int n = 0; n < 9; ++n) {
        uv_y = (v_tex_coords.y * size.y) + (blur_size.y * float(n - 4.5));
        vec4 h_sum = vec4(0.0);
        h_sum += texelFetch(u_texture, ivec2(uv_x - (4.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x - (3.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x - (2.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x - blur_size.x, uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x, uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x + blur_size.x, uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x + (2.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x + (3.0 * blur_size.x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x + (4.0 * blur_size.x), uv_y), 0);
        sum += h_sum / 9.0;
    }

    pixel = sum / 9.0;
}