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

in vec4 v_color;
in vec2 v_texCoords;
out vec4 pixel;
ivec2 size;

uniform sampler2D u_texture;
uniform float outline_thickness;
uniform vec3 outline_colour = vec3(0, 0, 0);

const float outline_threshold = .5;

void main() {
    pixel = texture(u_texture, v_texCoords);

    if (pixel.a <= outline_threshold) {
        size = textureSize(u_texture, 0);

        float uv_x = v_texCoords.x * size.x;
        float uv_y = v_texCoords.y * size.y;

        float sum = 0.0;
        for (int n = 0; n < 9; ++n) {
            uv_y = (v_texCoords.y * size.y) + (outline_thickness * float(n - 4.5));
            float h_sum = 0.0;
            h_sum += texelFetch(u_texture, ivec2(uv_x - (4.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x - (3.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x - (2.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x - outline_thickness, uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x, uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x + outline_thickness, uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x + (2.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x + (3.0 * outline_thickness), uv_y), 0).a;
            h_sum += texelFetch(u_texture, ivec2(uv_x + (4.0 * outline_thickness), uv_y), 0).a;
            sum += h_sum / 9.0;
        }

        if (sum / 9.0 >= 0.0001) {
            pixel = vec4(outline_colour, 1);
        }
    }
}