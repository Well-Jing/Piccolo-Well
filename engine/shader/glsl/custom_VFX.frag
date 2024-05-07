#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;
layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;
layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    
    highp vec4 color       = subpassLoad(in_color).rgba;

    out_color = vec4(color.r, clamp(2.0f * color.g, 0.0f, 1.0f), color.b, color.a);
    //out_color = color;
}