#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp vec4 color       = subpassLoad(in_color).rgba;

    // Lut tex is a 2D representation for 3D color space.
    // The the 3rd color dimention is sliced into many 2D images, and finally make a long 2D texture. 
    // In this case, R is x-axis, G is y-axis, B is the "z"-axis
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float numberOfSlices = float(int(lut_tex_size.x) / int(lut_tex_size.y)); // to make it less type cast, use float here

    // When input color locates between 2 slices, use floor() and ceil() to find the nearest slices
    // Since the slices are in a line, so use L and R to represent the order
    highp float BColorPosition = numberOfSlices * color.b;
    highp int tempL = int(floor(BColorPosition));
    highp int tempR = min(int(ceil(BColorPosition)), int(numberOfSlices - 1.0f));

    highp vec2 uvL = vec2((float(tempL) + color.r) / numberOfSlices, color.g);
    highp vec4 lutColorL = texture(color_grading_lut_texture_sampler, uvL);
    highp vec2 uvR = vec2((float(tempR) + color.r) / numberOfSlices, color.g);
    highp vec4 lutColorR = texture(color_grading_lut_texture_sampler, uvR);

    highp float ratio = BColorPosition - float(tempL);
    highp vec4 finalColor = mix(lutColorL, lutColorR, ratio);

    out_color = finalColor;
}
