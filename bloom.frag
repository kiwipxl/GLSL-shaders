#version 140

/**
------------ one pass bloom shader ------------

    author: Richman Stewart

    applies a gaussian blur horizontally and vertically
    and applies it on top of the original texture

------------------ use ------------------------

    bloom_size - defines the spread x and y
    bloom_intensity - bloom intensity

**/

in vec4 v_color;
in vec2 v_texCoords;
out vec4 pixel;
ivec2 size;

uniform sampler2D u_texture;
uniform vec2 bloom_size;
uniform float bloom_intensity;

void main() {
    size = textureSize(u_texture, 0);

    float step_x = bloom_size.x;
    float step_y = bloom_size.y;
    float uv_x = v_texCoords.x * size.x;
    float uv_y = v_texCoords.y * size.y;

    vec4 sum = vec4(0.0);
    for (int n = 0; n < 9; ++n) {
        uv_y = (v_texCoords.y * size.y) + (step_y * float(n - 4));
        vec4 h_sum = vec4(0.0);
        h_sum += texelFetch(u_texture, ivec2(uv_x - (4.0 * step_x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x - (3.0 * step_x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x - (2.0 * step_x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x - step_x, uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x, uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x + step_x, uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x + (2.0 * step_x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x + (3.0 * step_x), uv_y), 0);
        h_sum += texelFetch(u_texture, ivec2(uv_x + (4.0 * step_x), uv_y), 0);
        sum += h_sum / 9.0;
    }

    pixel = texture(u_texture, v_texCoords) + ((sum / 9.0) * bloom_intensity);
}