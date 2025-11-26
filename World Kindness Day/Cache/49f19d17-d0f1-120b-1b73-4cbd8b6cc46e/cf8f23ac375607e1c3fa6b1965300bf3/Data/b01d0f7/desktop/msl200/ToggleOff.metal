#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
namespace SNAP_VS {
int sc_GetStereoViewIndex()
{
return 0;
}
}
#ifndef sc_TextureRenderingLayout_Regular
#define sc_TextureRenderingLayout_Regular 0
#define sc_TextureRenderingLayout_StereoInstancedClipped 1
#define sc_TextureRenderingLayout_StereoMultiview 2
#endif
// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// SCC_BACKEND_SHADER_FLAGS_END__
//SG_REFLECTION_BEGIN(200)
//attribute vec4 boneData 5
//attribute vec3 blendShape0Pos 6
//attribute vec3 blendShape0Normal 12
//attribute vec3 blendShape1Pos 7
//attribute vec3 blendShape1Normal 13
//attribute vec3 blendShape2Pos 8
//attribute vec3 blendShape2Normal 14
//attribute vec3 blendShape3Pos 9
//attribute vec3 blendShape4Pos 10
//attribute vec3 blendShape5Pos 11
//attribute vec4 position 0
//attribute vec3 normal 1
//attribute vec4 tangent 2
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec4 color 18
//attribute vec3 positionNext 15
//attribute vec3 positionPrevious 16
//attribute vec4 strandProperties 17
//output vec4 sc_FragData0 0
//output uvec4 sc_RayTracingPositionAndMask 0
//output uvec4 sc_RayTracingNormalAndMore 1
//sampler sampler baseColorTextureSmpSC 0:35
//sampler sampler clearcoatNormalTextureSmpSC 0:36
//sampler sampler clearcoatRoughnessTextureSmpSC 0:37
//sampler sampler clearcoatTextureSmpSC 0:38
//sampler sampler emissiveTextureSmpSC 0:39
//sampler sampler intensityTextureSmpSC 0:40
//sampler sampler metallicRoughnessTextureSmpSC 0:41
//sampler sampler normalTextureSmpSC 0:42
//sampler sampler sc_EnvmapDiffuseSmpSC 0:43
//sampler sampler sc_EnvmapSpecularSmpSC 0:44
//sampler sampler sc_RayTracingGlobalIlluminationSmpSC 0:46
//sampler sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC 0:47
//sampler sampler sc_RayTracingRayDirectionSmpSC 0:48
//sampler sampler sc_RayTracingReflectionsSmpSC 0:49
//sampler sampler sc_RayTracingShadowsSmpSC 0:50
//sampler sampler sc_SSAOTextureSmpSC 0:51
//sampler sampler sc_ScreenTextureSmpSC 0:52
//sampler sampler sc_ShadowTextureSmpSC 0:53
//sampler sampler screenTextureSmpSC 0:55
//sampler sampler sheenColorTextureSmpSC 0:56
//sampler sampler sheenRoughnessTextureSmpSC 0:57
//sampler sampler transmissionTextureSmpSC 0:58
//texture texture2D baseColorTexture 0:4:0:35
//texture texture2D clearcoatNormalTexture 0:5:0:36
//texture texture2D clearcoatRoughnessTexture 0:6:0:37
//texture texture2D clearcoatTexture 0:7:0:38
//texture texture2D emissiveTexture 0:8:0:39
//texture texture2D intensityTexture 0:9:0:40
//texture texture2D metallicRoughnessTexture 0:10:0:41
//texture texture2D normalTexture 0:11:0:42
//texture texture2D sc_EnvmapDiffuse 0:12:0:43
//texture texture2D sc_EnvmapSpecular 0:13:0:44
//texture texture2D sc_RayTracingGlobalIllumination 0:22:0:46
//texture utexture2D sc_RayTracingHitCasterIdAndBarycentric 0:23:0:47
//texture texture2D sc_RayTracingRayDirection 0:24:0:48
//texture texture2D sc_RayTracingReflections 0:25:0:49
//texture texture2D sc_RayTracingShadows 0:26:0:50
//texture texture2D sc_SSAOTexture 0:27:0:51
//texture texture2D sc_ScreenTexture 0:28:0:52
//texture texture2D sc_ShadowTexture 0:29:0:53
//texture texture2D screenTexture 0:31:0:55
//texture texture2D sheenColorTexture 0:32:0:56
//texture texture2D sheenRoughnessTexture 0:33:0:57
//texture texture2D transmissionTexture 0:34:0:58
//ubo float sc_BonesUBO 0:3:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:59:6544 {
//sc_PointLight_t sc_PointLights 0:[3]:80
//bool sc_PointLights.falloffEnabled 0
//float sc_PointLights.falloffEndDistance 4
//float sc_PointLights.negRcpFalloffEndDistance4 8
//float sc_PointLights.angleScale 12
//float sc_PointLights.angleOffset 16
//float3 sc_PointLights.direction 32
//float3 sc_PointLights.position 48
//float4 sc_PointLights.color 64
//sc_DirectionalLight_t sc_DirectionalLights 240:[5]:32
//float3 sc_DirectionalLights.direction 0
//float4 sc_DirectionalLights.color 16
//sc_AmbientLight_t sc_AmbientLights 400:[3]:32
//float3 sc_AmbientLights.color 0
//float sc_AmbientLights.intensity 16
//sc_LightEstimationData_t sc_LightEstimationData 496
//sc_SphericalGaussianLight_t sc_LightEstimationData.sg 0:[12]:48
//float3 sc_LightEstimationData.sg.color 0
//float sc_LightEstimationData.sg.sharpness 16
//float3 sc_LightEstimationData.sg.axis 32
//float3 sc_LightEstimationData.ambientLight 576
//float4 sc_EnvmapDiffuseSize 1088
//float4 sc_EnvmapSpecularSize 1136
//float3 sc_EnvmapRotation 1184
//float sc_EnvmapExposure 1200
//float3 sc_Sh 1216:[9]:16
//float sc_ShIntensity 1360
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4x4 sc_ViewProjectionMatrixArray 1680:[2]:64
//float4x4 sc_ModelViewMatrixArray 1936:[2]:64
//float4x4 sc_ProjectionMatrixArray 2384:[2]:64
//float4x4 sc_ProjectionMatrixInverseArray 2512:[2]:64
//float4x4 sc_ViewMatrixArray 2640:[2]:64
//float4x4 sc_PrevFrameViewProjectionMatrixArray 2896:[2]:64
//float4x4 sc_ModelMatrix 3024
//float4x4 sc_ModelMatrixInverse 3088
//float3x3 sc_NormalMatrix 3152
//float4x4 sc_PrevFrameModelMatrix 3248
//float4 sc_CurrentRenderTargetDims 3456
//sc_Camera_t sc_Camera 3472
//float3 sc_Camera.position 0
//float sc_Camera.aspect 16
//float2 sc_Camera.clipPlanes 24
//float sc_ShadowDensity 3504
//float4 sc_ShadowColor 3520
//float4x4 sc_ProjectorMatrix 3536
//float4 weights0 3616
//float4 weights1 3632
//float4 sc_StereoClipPlanes 3664:[2]:16
//float2 sc_TAAJitterOffset 3704
//int sc_RayTracingReceiverEffectsMask 3824
//float3 sc_RayTracingOriginScale 3984
//uint sc_RayTracingReceiverMask 4000
//float3 sc_RayTracingOriginOffset 4032
//uint sc_RayTracingReceiverId 4048
//uint4 sc_RayTracingCasterConfiguration 4064
//uint4 sc_RayTracingCasterOffsetPNTC 4080
//uint4 sc_RayTracingCasterOffsetTexture 4096
//uint4 sc_RayTracingCasterFormatPNTC 4112
//uint4 sc_RayTracingCasterFormatTexture 4128
//float4 voxelization_params_0 4192
//float4 voxelization_params_frustum_lrbt 4208
//float4 voxelization_params_frustum_nf 4224
//float3 voxelization_params_camera_pos 4240
//float4x4 sc_ModelMatrixVoxelization 4256
//float correctedIntensity 4320
//float3x3 intensityTextureTransform 4384
//float4 intensityTextureUvMinMax 4432
//float4 intensityTextureBorderColor 4448
//int PreviewEnabled 4612
//float alphaTestThreshold 4620
//float3 emissiveFactor 4624
//float3x3 emissiveTextureTransform 4688
//float4 emissiveTextureUvMinMax 4736
//float4 emissiveTextureBorderColor 4752
//float normalTextureScale 4768
//float3x3 normalTextureTransform 4832
//float4 normalTextureUvMinMax 4880
//float4 normalTextureBorderColor 4896
//float metallicFactor 4912
//float roughnessFactor 4916
//float occlusionTextureStrength 4920
//float3x3 metallicRoughnessTextureTransform 4976
//float4 metallicRoughnessTextureUvMinMax 5024
//float4 metallicRoughnessTextureBorderColor 5040
//float transmissionFactor 5056
//float3x3 transmissionTextureTransform 5120
//float4 transmissionTextureUvMinMax 5168
//float4 transmissionTextureBorderColor 5184
//float3x3 screenTextureTransform 5248
//float4 screenTextureUvMinMax 5296
//float4 screenTextureBorderColor 5312
//float3 sheenColorFactor 5328
//float3x3 sheenColorTextureTransform 5392
//float4 sheenColorTextureUvMinMax 5440
//float4 sheenColorTextureBorderColor 5456
//float sheenRoughnessFactor 5472
//float3x3 sheenRoughnessTextureTransform 5536
//float4 sheenRoughnessTextureUvMinMax 5584
//float4 sheenRoughnessTextureBorderColor 5600
//float clearcoatFactor 5616
//float3x3 clearcoatTextureTransform 5680
//float4 clearcoatTextureUvMinMax 5728
//float4 clearcoatTextureBorderColor 5744
//float clearcoatRoughnessFactor 5760
//float3x3 clearcoatRoughnessTextureTransform 5824
//float4 clearcoatRoughnessTextureUvMinMax 5872
//float4 clearcoatRoughnessTextureBorderColor 5888
//float3x3 clearcoatNormalTextureTransform 5952
//float4 clearcoatNormalTextureUvMinMax 6000
//float4 clearcoatNormalTextureBorderColor 6016
//float3x3 baseColorTextureTransform 6080
//float4 baseColorTextureUvMinMax 6128
//float4 baseColorTextureBorderColor 6144
//float4 baseColorFactor 6160
//float2 baseColorTexture_offset 6176
//float2 baseColorTexture_scale 6184
//float baseColorTexture_rotation 6192
//float2 emissiveTexture_offset 6200
//float2 emissiveTexture_scale 6208
//float emissiveTexture_rotation 6216
//float2 normalTexture_offset 6224
//float2 normalTexture_scale 6232
//float normalTexture_rotation 6240
//float2 metallicRoughnessTexture_offset 6248
//float2 metallicRoughnessTexture_scale 6256
//float metallicRoughnessTexture_rotation 6264
//float2 transmissionTexture_offset 6272
//float2 transmissionTexture_scale 6280
//float transmissionTexture_rotation 6288
//float2 sheenColorTexture_offset 6296
//float2 sheenColorTexture_scale 6304
//float sheenColorTexture_rotation 6312
//float2 sheenRoughnessTexture_offset 6320
//float2 sheenRoughnessTexture_scale 6328
//float sheenRoughnessTexture_rotation 6336
//float2 clearcoatTexture_offset 6344
//float2 clearcoatTexture_scale 6352
//float clearcoatTexture_rotation 6360
//float2 clearcoatNormalTexture_offset 6368
//float2 clearcoatNormalTexture_scale 6376
//float clearcoatNormalTexture_rotation 6384
//float2 clearcoatRoughnessTexture_offset 6392
//float2 clearcoatRoughnessTexture_scale 6400
//float clearcoatRoughnessTexture_rotation 6408
//float colorMultiplier 6412
//float Port_Input2_N043 6424
//float Port_Input2_N062 6428
//float3 Port_SpecularAO_N036 6432
//float3 Port_Albedo_N405 6448
//float Port_Opacity_N405 6464
//float3 Port_Emissive_N405 6480
//float Port_Metallic_N405 6496
//float3 Port_SpecularAO_N405 6512
//float depthRef 6528
//}
//ssbo int sc_RayTracingCasterIndexBuffer 0:0:4 {
//uint sc_RayTracingCasterTriangles 0:[1]:4
//}
//ssbo float sc_RayTracingCasterNonAnimatedVertexBuffer 0:2:4 {
//float sc_RayTracingCasterNonAnimatedVertices 0:[1]:4
//}
//ssbo float sc_RayTracingCasterVertexBuffer 0:1:4 {
//float sc_RayTracingCasterVertices 0:[1]:4
//}
//spec_const bool BLEND_MODE_AVERAGE 0 0
//spec_const bool BLEND_MODE_BRIGHT 1 0
//spec_const bool BLEND_MODE_COLOR_BURN 2 0
//spec_const bool BLEND_MODE_COLOR_DODGE 3 0
//spec_const bool BLEND_MODE_COLOR 4 0
//spec_const bool BLEND_MODE_DARKEN 5 0
//spec_const bool BLEND_MODE_DIFFERENCE 6 0
//spec_const bool BLEND_MODE_DIVIDE 7 0
//spec_const bool BLEND_MODE_DIVISION 8 0
//spec_const bool BLEND_MODE_EXCLUSION 9 0
//spec_const bool BLEND_MODE_FORGRAY 10 0
//spec_const bool BLEND_MODE_HARD_GLOW 11 0
//spec_const bool BLEND_MODE_HARD_LIGHT 12 0
//spec_const bool BLEND_MODE_HARD_MIX 13 0
//spec_const bool BLEND_MODE_HARD_PHOENIX 14 0
//spec_const bool BLEND_MODE_HARD_REFLECT 15 0
//spec_const bool BLEND_MODE_HUE 16 0
//spec_const bool BLEND_MODE_INTENSE 17 0
//spec_const bool BLEND_MODE_LIGHTEN 18 0
//spec_const bool BLEND_MODE_LINEAR_LIGHT 19 0
//spec_const bool BLEND_MODE_LUMINOSITY 20 0
//spec_const bool BLEND_MODE_NEGATION 21 0
//spec_const bool BLEND_MODE_NOTBRIGHT 22 0
//spec_const bool BLEND_MODE_OVERLAY 23 0
//spec_const bool BLEND_MODE_PIN_LIGHT 24 0
//spec_const bool BLEND_MODE_REALISTIC 25 0
//spec_const bool BLEND_MODE_SATURATION 26 0
//spec_const bool BLEND_MODE_SOFT_LIGHT 27 0
//spec_const bool BLEND_MODE_SUBTRACT 28 0
//spec_const bool BLEND_MODE_VIVID_LIGHT 29 0
//spec_const bool ENABLE_BASE_TEXTURE_TRANSFORM 30 0
//spec_const bool ENABLE_BASE_TEX 31 0
//spec_const bool ENABLE_CLEARCOAT_NORMAL_TEXTURE_TRANSFORM 32 0
//spec_const bool ENABLE_CLEARCOAT_NORMAL_TEX 33 0
//spec_const bool ENABLE_CLEARCOAT_ROUGHNESS_TEXTURE_TRANSFORM 34 0
//spec_const bool ENABLE_CLEARCOAT_ROUGHNESS_TEX 35 0
//spec_const bool ENABLE_CLEARCOAT_TEXTURE_TRANSFORM 36 0
//spec_const bool ENABLE_CLEARCOAT_TEX 37 0
//spec_const bool ENABLE_CLEARCOAT 38 0
//spec_const bool ENABLE_EMISSIVE_TEXTURE_TRANSFORM 39 0
//spec_const bool ENABLE_EMISSIVE 40 0
//spec_const bool ENABLE_GLTF_LIGHTING 41 0
//spec_const bool ENABLE_METALLIC_ROUGHNESS_TEXTURE_TRANSFORM 42 0
//spec_const bool ENABLE_METALLIC_ROUGHNESS_TEX 43 0
//spec_const bool ENABLE_NORMALMAP 44 0
//spec_const bool ENABLE_NORMAL_TEXTURE_TRANSFORM 45 0
//spec_const bool ENABLE_SHEEN_COLOR_TEXTURE_TRANSFORM 46 0
//spec_const bool ENABLE_SHEEN_COLOR_TEX 47 0
//spec_const bool ENABLE_SHEEN_ROUGHNESS_TEXTURE_TRANSFORM 48 0
//spec_const bool ENABLE_SHEEN_ROUGHNESS_TEX 49 0
//spec_const bool ENABLE_SHEEN 50 0
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 51 0
//spec_const bool ENABLE_TEXTURE_TRANSFORM 52 0
//spec_const bool ENABLE_TRANSMISSION_TEXTURE_TRANSFORM 53 0
//spec_const bool ENABLE_TRANSMISSION_TEX 54 0
//spec_const bool ENABLE_TRANSMISSION 55 0
//spec_const bool ENABLE_VERTEX_COLOR_BASE 56 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_baseColorTexture 57 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_clearcoatNormalTexture 58 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_clearcoatRoughnessTexture 59 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_clearcoatTexture 60 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_emissiveTexture 61 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 62 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_metallicRoughnessTexture 63 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_normalTexture 64 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_screenTexture 65 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_sheenColorTexture 66 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_sheenRoughnessTexture 67 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_transmissionTexture 68 0
//spec_const bool SC_USE_UV_MIN_MAX_baseColorTexture 69 0
//spec_const bool SC_USE_UV_MIN_MAX_clearcoatNormalTexture 70 0
//spec_const bool SC_USE_UV_MIN_MAX_clearcoatRoughnessTexture 71 0
//spec_const bool SC_USE_UV_MIN_MAX_clearcoatTexture 72 0
//spec_const bool SC_USE_UV_MIN_MAX_emissiveTexture 73 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 74 0
//spec_const bool SC_USE_UV_MIN_MAX_metallicRoughnessTexture 75 0
//spec_const bool SC_USE_UV_MIN_MAX_normalTexture 76 0
//spec_const bool SC_USE_UV_MIN_MAX_screenTexture 77 0
//spec_const bool SC_USE_UV_MIN_MAX_sheenColorTexture 78 0
//spec_const bool SC_USE_UV_MIN_MAX_sheenRoughnessTexture 79 0
//spec_const bool SC_USE_UV_MIN_MAX_transmissionTexture 80 0
//spec_const bool SC_USE_UV_TRANSFORM_baseColorTexture 81 0
//spec_const bool SC_USE_UV_TRANSFORM_clearcoatNormalTexture 82 0
//spec_const bool SC_USE_UV_TRANSFORM_clearcoatRoughnessTexture 83 0
//spec_const bool SC_USE_UV_TRANSFORM_clearcoatTexture 84 0
//spec_const bool SC_USE_UV_TRANSFORM_emissiveTexture 85 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 86 0
//spec_const bool SC_USE_UV_TRANSFORM_metallicRoughnessTexture 87 0
//spec_const bool SC_USE_UV_TRANSFORM_normalTexture 88 0
//spec_const bool SC_USE_UV_TRANSFORM_screenTexture 89 0
//spec_const bool SC_USE_UV_TRANSFORM_sheenColorTexture 90 0
//spec_const bool SC_USE_UV_TRANSFORM_sheenRoughnessTexture 91 0
//spec_const bool SC_USE_UV_TRANSFORM_transmissionTexture 92 0
//spec_const bool UseViewSpaceDepthVariant 93 1
//spec_const bool baseColorTextureHasSwappedViews 94 0
//spec_const bool clearcoatNormalTextureHasSwappedViews 95 0
//spec_const bool clearcoatRoughnessTextureHasSwappedViews 96 0
//spec_const bool clearcoatTextureHasSwappedViews 97 0
//spec_const bool emissiveTextureHasSwappedViews 98 0
//spec_const bool intensityTextureHasSwappedViews 99 0
//spec_const bool metallicRoughnessTextureHasSwappedViews 100 0
//spec_const bool normalTextureHasSwappedViews 101 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 102 0
//spec_const bool sc_BlendMode_Add 103 0
//spec_const bool sc_BlendMode_AlphaTest 104 0
//spec_const bool sc_BlendMode_AlphaToCoverage 105 0
//spec_const bool sc_BlendMode_ColoredGlass 106 0
//spec_const bool sc_BlendMode_Custom 107 0
//spec_const bool sc_BlendMode_Max 108 0
//spec_const bool sc_BlendMode_Min 109 0
//spec_const bool sc_BlendMode_MultiplyOriginal 110 0
//spec_const bool sc_BlendMode_Multiply 111 0
//spec_const bool sc_BlendMode_Normal 112 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 113 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 114 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 115 0
//spec_const bool sc_BlendMode_Screen 116 0
//spec_const bool sc_DepthOnly 117 0
//spec_const bool sc_EnvmapDiffuseHasSwappedViews 118 0
//spec_const bool sc_EnvmapSpecularHasSwappedViews 119 0
//spec_const bool sc_FramebufferFetch 120 0
//spec_const bool sc_HasDiffuseEnvmap 121 0
//spec_const bool sc_IsEditor 122 0
//spec_const bool sc_LightEstimation 123 0
//spec_const bool sc_MotionVectorsPass 124 0
//spec_const bool sc_OITCompositingPass 125 0
//spec_const bool sc_OITDepthBoundsPass 126 0
//spec_const bool sc_OITDepthGatherPass 127 0
//spec_const bool sc_OutputBounds 128 0
//spec_const bool sc_ProjectiveShadowsCaster 129 0
//spec_const bool sc_ProjectiveShadowsReceiver 130 0
//spec_const bool sc_RayTracingCasterForceOpaque 131 0
//spec_const bool sc_RayTracingGlobalIlluminationHasSwappedViews 132 0
//spec_const bool sc_RayTracingReflectionsHasSwappedViews 133 0
//spec_const bool sc_RayTracingShadowsHasSwappedViews 134 0
//spec_const bool sc_RenderAlphaToColor 135 0
//spec_const bool sc_SSAOEnabled 136 0
//spec_const bool sc_ScreenTextureHasSwappedViews 137 0
//spec_const bool sc_TAAEnabled 138 0
//spec_const bool sc_VertexBlendingUseNormals 139 0
//spec_const bool sc_VertexBlending 140 0
//spec_const bool sc_Voxelization 141 0
//spec_const bool screenTextureHasSwappedViews 142 0
//spec_const bool sheenColorTextureHasSwappedViews 143 0
//spec_const bool sheenRoughnessTextureHasSwappedViews 144 0
//spec_const bool transmissionTextureHasSwappedViews 145 0
//spec_const int NODE_10_DROPLIST_ITEM 146 0
//spec_const int NODE_11_DROPLIST_ITEM 147 0
//spec_const int NODE_7_DROPLIST_ITEM 148 0
//spec_const int NODE_8_DROPLIST_ITEM 149 0
//spec_const int SC_DEVICE_CLASS 150 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_baseColorTexture 151 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_clearcoatNormalTexture 152 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_clearcoatRoughnessTexture 153 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_clearcoatTexture 154 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_emissiveTexture 155 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 156 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_metallicRoughnessTexture 157 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_normalTexture 158 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_screenTexture 159 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_sheenColorTexture 160 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_sheenRoughnessTexture 161 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_transmissionTexture 162 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_baseColorTexture 163 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_clearcoatNormalTexture 164 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_clearcoatRoughnessTexture 165 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_clearcoatTexture 166 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_emissiveTexture 167 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 168 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_metallicRoughnessTexture 169 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_normalTexture 170 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_screenTexture 171 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_sheenColorTexture 172 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_sheenRoughnessTexture 173 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_transmissionTexture 174 -1
//spec_const int Tweak_N30 175 0
//spec_const int Tweak_N32 176 0
//spec_const int Tweak_N37 177 0
//spec_const int Tweak_N44 178 0
//spec_const int Tweak_N47 179 0
//spec_const int Tweak_N60 180 0
//spec_const int baseColorTextureLayout 181 0
//spec_const int clearcoatNormalTextureLayout 182 0
//spec_const int clearcoatRoughnessTextureLayout 183 0
//spec_const int clearcoatTextureLayout 184 0
//spec_const int emissiveTextureLayout 185 0
//spec_const int intensityTextureLayout 186 0
//spec_const int metallicRoughnessTextureLayout 187 0
//spec_const int normalTextureLayout 188 0
//spec_const int sc_AmbientLightMode0 189 0
//spec_const int sc_AmbientLightMode1 190 0
//spec_const int sc_AmbientLightMode2 191 0
//spec_const int sc_AmbientLightMode_Constant 192 0
//spec_const int sc_AmbientLightMode_EnvironmentMap 193 0
//spec_const int sc_AmbientLightMode_FromCamera 194 0
//spec_const int sc_AmbientLightMode_SphericalHarmonics 195 0
//spec_const int sc_AmbientLightsCount 196 0
//spec_const int sc_DepthBufferMode 197 0
//spec_const int sc_DirectionalLightsCount 198 0
//spec_const int sc_EnvLightMode 199 0
//spec_const int sc_EnvmapDiffuseLayout 200 0
//spec_const int sc_EnvmapSpecularLayout 201 0
//spec_const int sc_LightEstimationSGCount 202 0
//spec_const int sc_PointLightsCount 203 0
//spec_const int sc_RayTracingGlobalIlluminationLayout 204 0
//spec_const int sc_RayTracingReflectionsLayout 205 0
//spec_const int sc_RayTracingShadowsLayout 206 0
//spec_const int sc_RenderingSpace 207 -1
//spec_const int sc_ScreenTextureLayout 208 0
//spec_const int sc_ShaderCacheConstant 209 0
//spec_const int sc_SkinBonesCount 210 0
//spec_const int sc_StereoRenderingMode 211 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 212 0
//spec_const int screenTextureLayout 213 0
//spec_const int sheenColorTextureLayout 214 0
//spec_const int sheenRoughnessTextureLayout 215 0
//spec_const int transmissionTextureLayout 216 0
//SG_REFLECTION_END
constant bool BLEND_MODE_AVERAGE [[function_constant(0)]];
constant bool BLEND_MODE_AVERAGE_tmp = is_function_constant_defined(BLEND_MODE_AVERAGE) ? BLEND_MODE_AVERAGE : false;
constant bool BLEND_MODE_BRIGHT [[function_constant(1)]];
constant bool BLEND_MODE_BRIGHT_tmp = is_function_constant_defined(BLEND_MODE_BRIGHT) ? BLEND_MODE_BRIGHT : false;
constant bool BLEND_MODE_COLOR_BURN [[function_constant(2)]];
constant bool BLEND_MODE_COLOR_BURN_tmp = is_function_constant_defined(BLEND_MODE_COLOR_BURN) ? BLEND_MODE_COLOR_BURN : false;
constant bool BLEND_MODE_COLOR_DODGE [[function_constant(3)]];
constant bool BLEND_MODE_COLOR_DODGE_tmp = is_function_constant_defined(BLEND_MODE_COLOR_DODGE) ? BLEND_MODE_COLOR_DODGE : false;
constant bool BLEND_MODE_COLOR [[function_constant(4)]];
constant bool BLEND_MODE_COLOR_tmp = is_function_constant_defined(BLEND_MODE_COLOR) ? BLEND_MODE_COLOR : false;
constant bool BLEND_MODE_DARKEN [[function_constant(5)]];
constant bool BLEND_MODE_DARKEN_tmp = is_function_constant_defined(BLEND_MODE_DARKEN) ? BLEND_MODE_DARKEN : false;
constant bool BLEND_MODE_DIFFERENCE [[function_constant(6)]];
constant bool BLEND_MODE_DIFFERENCE_tmp = is_function_constant_defined(BLEND_MODE_DIFFERENCE) ? BLEND_MODE_DIFFERENCE : false;
constant bool BLEND_MODE_DIVIDE [[function_constant(7)]];
constant bool BLEND_MODE_DIVIDE_tmp = is_function_constant_defined(BLEND_MODE_DIVIDE) ? BLEND_MODE_DIVIDE : false;
constant bool BLEND_MODE_DIVISION [[function_constant(8)]];
constant bool BLEND_MODE_DIVISION_tmp = is_function_constant_defined(BLEND_MODE_DIVISION) ? BLEND_MODE_DIVISION : false;
constant bool BLEND_MODE_EXCLUSION [[function_constant(9)]];
constant bool BLEND_MODE_EXCLUSION_tmp = is_function_constant_defined(BLEND_MODE_EXCLUSION) ? BLEND_MODE_EXCLUSION : false;
constant bool BLEND_MODE_FORGRAY [[function_constant(10)]];
constant bool BLEND_MODE_FORGRAY_tmp = is_function_constant_defined(BLEND_MODE_FORGRAY) ? BLEND_MODE_FORGRAY : false;
constant bool BLEND_MODE_HARD_GLOW [[function_constant(11)]];
constant bool BLEND_MODE_HARD_GLOW_tmp = is_function_constant_defined(BLEND_MODE_HARD_GLOW) ? BLEND_MODE_HARD_GLOW : false;
constant bool BLEND_MODE_HARD_LIGHT [[function_constant(12)]];
constant bool BLEND_MODE_HARD_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_HARD_LIGHT) ? BLEND_MODE_HARD_LIGHT : false;
constant bool BLEND_MODE_HARD_MIX [[function_constant(13)]];
constant bool BLEND_MODE_HARD_MIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_MIX) ? BLEND_MODE_HARD_MIX : false;
constant bool BLEND_MODE_HARD_PHOENIX [[function_constant(14)]];
constant bool BLEND_MODE_HARD_PHOENIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_PHOENIX) ? BLEND_MODE_HARD_PHOENIX : false;
constant bool BLEND_MODE_HARD_REFLECT [[function_constant(15)]];
constant bool BLEND_MODE_HARD_REFLECT_tmp = is_function_constant_defined(BLEND_MODE_HARD_REFLECT) ? BLEND_MODE_HARD_REFLECT : false;
constant bool BLEND_MODE_HUE [[function_constant(16)]];
constant bool BLEND_MODE_HUE_tmp = is_function_constant_defined(BLEND_MODE_HUE) ? BLEND_MODE_HUE : false;
constant bool BLEND_MODE_INTENSE [[function_constant(17)]];
constant bool BLEND_MODE_INTENSE_tmp = is_function_constant_defined(BLEND_MODE_INTENSE) ? BLEND_MODE_INTENSE : false;
constant bool BLEND_MODE_LIGHTEN [[function_constant(18)]];
constant bool BLEND_MODE_LIGHTEN_tmp = is_function_constant_defined(BLEND_MODE_LIGHTEN) ? BLEND_MODE_LIGHTEN : false;
constant bool BLEND_MODE_LINEAR_LIGHT [[function_constant(19)]];
constant bool BLEND_MODE_LINEAR_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_LINEAR_LIGHT) ? BLEND_MODE_LINEAR_LIGHT : false;
constant bool BLEND_MODE_LUMINOSITY [[function_constant(20)]];
constant bool BLEND_MODE_LUMINOSITY_tmp = is_function_constant_defined(BLEND_MODE_LUMINOSITY) ? BLEND_MODE_LUMINOSITY : false;
constant bool BLEND_MODE_NEGATION [[function_constant(21)]];
constant bool BLEND_MODE_NEGATION_tmp = is_function_constant_defined(BLEND_MODE_NEGATION) ? BLEND_MODE_NEGATION : false;
constant bool BLEND_MODE_NOTBRIGHT [[function_constant(22)]];
constant bool BLEND_MODE_NOTBRIGHT_tmp = is_function_constant_defined(BLEND_MODE_NOTBRIGHT) ? BLEND_MODE_NOTBRIGHT : false;
constant bool BLEND_MODE_OVERLAY [[function_constant(23)]];
constant bool BLEND_MODE_OVERLAY_tmp = is_function_constant_defined(BLEND_MODE_OVERLAY) ? BLEND_MODE_OVERLAY : false;
constant bool BLEND_MODE_PIN_LIGHT [[function_constant(24)]];
constant bool BLEND_MODE_PIN_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_PIN_LIGHT) ? BLEND_MODE_PIN_LIGHT : false;
constant bool BLEND_MODE_REALISTIC [[function_constant(25)]];
constant bool BLEND_MODE_REALISTIC_tmp = is_function_constant_defined(BLEND_MODE_REALISTIC) ? BLEND_MODE_REALISTIC : false;
constant bool BLEND_MODE_SATURATION [[function_constant(26)]];
constant bool BLEND_MODE_SATURATION_tmp = is_function_constant_defined(BLEND_MODE_SATURATION) ? BLEND_MODE_SATURATION : false;
constant bool BLEND_MODE_SOFT_LIGHT [[function_constant(27)]];
constant bool BLEND_MODE_SOFT_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_SOFT_LIGHT) ? BLEND_MODE_SOFT_LIGHT : false;
constant bool BLEND_MODE_SUBTRACT [[function_constant(28)]];
constant bool BLEND_MODE_SUBTRACT_tmp = is_function_constant_defined(BLEND_MODE_SUBTRACT) ? BLEND_MODE_SUBTRACT : false;
constant bool BLEND_MODE_VIVID_LIGHT [[function_constant(29)]];
constant bool BLEND_MODE_VIVID_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_VIVID_LIGHT) ? BLEND_MODE_VIVID_LIGHT : false;
constant bool ENABLE_BASE_TEXTURE_TRANSFORM [[function_constant(30)]];
constant bool ENABLE_BASE_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_BASE_TEXTURE_TRANSFORM) ? ENABLE_BASE_TEXTURE_TRANSFORM : false;
constant bool ENABLE_BASE_TEX [[function_constant(31)]];
constant bool ENABLE_BASE_TEX_tmp = is_function_constant_defined(ENABLE_BASE_TEX) ? ENABLE_BASE_TEX : false;
constant bool ENABLE_CLEARCOAT_NORMAL_TEXTURE_TRANSFORM [[function_constant(32)]];
constant bool ENABLE_CLEARCOAT_NORMAL_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_CLEARCOAT_NORMAL_TEXTURE_TRANSFORM) ? ENABLE_CLEARCOAT_NORMAL_TEXTURE_TRANSFORM : false;
constant bool ENABLE_CLEARCOAT_NORMAL_TEX [[function_constant(33)]];
constant bool ENABLE_CLEARCOAT_NORMAL_TEX_tmp = is_function_constant_defined(ENABLE_CLEARCOAT_NORMAL_TEX) ? ENABLE_CLEARCOAT_NORMAL_TEX : false;
constant bool ENABLE_CLEARCOAT_ROUGHNESS_TEXTURE_TRANSFORM [[function_constant(34)]];
constant bool ENABLE_CLEARCOAT_ROUGHNESS_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_CLEARCOAT_ROUGHNESS_TEXTURE_TRANSFORM) ? ENABLE_CLEARCOAT_ROUGHNESS_TEXTURE_TRANSFORM : false;
constant bool ENABLE_CLEARCOAT_ROUGHNESS_TEX [[function_constant(35)]];
constant bool ENABLE_CLEARCOAT_ROUGHNESS_TEX_tmp = is_function_constant_defined(ENABLE_CLEARCOAT_ROUGHNESS_TEX) ? ENABLE_CLEARCOAT_ROUGHNESS_TEX : false;
constant bool ENABLE_CLEARCOAT_TEXTURE_TRANSFORM [[function_constant(36)]];
constant bool ENABLE_CLEARCOAT_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_CLEARCOAT_TEXTURE_TRANSFORM) ? ENABLE_CLEARCOAT_TEXTURE_TRANSFORM : false;
constant bool ENABLE_CLEARCOAT_TEX [[function_constant(37)]];
constant bool ENABLE_CLEARCOAT_TEX_tmp = is_function_constant_defined(ENABLE_CLEARCOAT_TEX) ? ENABLE_CLEARCOAT_TEX : false;
constant bool ENABLE_CLEARCOAT [[function_constant(38)]];
constant bool ENABLE_CLEARCOAT_tmp = is_function_constant_defined(ENABLE_CLEARCOAT) ? ENABLE_CLEARCOAT : false;
constant bool ENABLE_EMISSIVE_TEXTURE_TRANSFORM [[function_constant(39)]];
constant bool ENABLE_EMISSIVE_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_EMISSIVE_TEXTURE_TRANSFORM) ? ENABLE_EMISSIVE_TEXTURE_TRANSFORM : false;
constant bool ENABLE_EMISSIVE [[function_constant(40)]];
constant bool ENABLE_EMISSIVE_tmp = is_function_constant_defined(ENABLE_EMISSIVE) ? ENABLE_EMISSIVE : false;
constant bool ENABLE_GLTF_LIGHTING [[function_constant(41)]];
constant bool ENABLE_GLTF_LIGHTING_tmp = is_function_constant_defined(ENABLE_GLTF_LIGHTING) ? ENABLE_GLTF_LIGHTING : false;
constant bool ENABLE_METALLIC_ROUGHNESS_TEXTURE_TRANSFORM [[function_constant(42)]];
constant bool ENABLE_METALLIC_ROUGHNESS_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_METALLIC_ROUGHNESS_TEXTURE_TRANSFORM) ? ENABLE_METALLIC_ROUGHNESS_TEXTURE_TRANSFORM : false;
constant bool ENABLE_METALLIC_ROUGHNESS_TEX [[function_constant(43)]];
constant bool ENABLE_METALLIC_ROUGHNESS_TEX_tmp = is_function_constant_defined(ENABLE_METALLIC_ROUGHNESS_TEX) ? ENABLE_METALLIC_ROUGHNESS_TEX : false;
constant bool ENABLE_NORMALMAP [[function_constant(44)]];
constant bool ENABLE_NORMALMAP_tmp = is_function_constant_defined(ENABLE_NORMALMAP) ? ENABLE_NORMALMAP : false;
constant bool ENABLE_NORMAL_TEXTURE_TRANSFORM [[function_constant(45)]];
constant bool ENABLE_NORMAL_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_NORMAL_TEXTURE_TRANSFORM) ? ENABLE_NORMAL_TEXTURE_TRANSFORM : false;
constant bool ENABLE_SHEEN_COLOR_TEXTURE_TRANSFORM [[function_constant(46)]];
constant bool ENABLE_SHEEN_COLOR_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_SHEEN_COLOR_TEXTURE_TRANSFORM) ? ENABLE_SHEEN_COLOR_TEXTURE_TRANSFORM : false;
constant bool ENABLE_SHEEN_COLOR_TEX [[function_constant(47)]];
constant bool ENABLE_SHEEN_COLOR_TEX_tmp = is_function_constant_defined(ENABLE_SHEEN_COLOR_TEX) ? ENABLE_SHEEN_COLOR_TEX : false;
constant bool ENABLE_SHEEN_ROUGHNESS_TEXTURE_TRANSFORM [[function_constant(48)]];
constant bool ENABLE_SHEEN_ROUGHNESS_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_SHEEN_ROUGHNESS_TEXTURE_TRANSFORM) ? ENABLE_SHEEN_ROUGHNESS_TEXTURE_TRANSFORM : false;
constant bool ENABLE_SHEEN_ROUGHNESS_TEX [[function_constant(49)]];
constant bool ENABLE_SHEEN_ROUGHNESS_TEX_tmp = is_function_constant_defined(ENABLE_SHEEN_ROUGHNESS_TEX) ? ENABLE_SHEEN_ROUGHNESS_TEX : false;
constant bool ENABLE_SHEEN [[function_constant(50)]];
constant bool ENABLE_SHEEN_tmp = is_function_constant_defined(ENABLE_SHEEN) ? ENABLE_SHEEN : false;
constant bool ENABLE_STIPPLE_PATTERN_TEST [[function_constant(51)]];
constant bool ENABLE_STIPPLE_PATTERN_TEST_tmp = is_function_constant_defined(ENABLE_STIPPLE_PATTERN_TEST) ? ENABLE_STIPPLE_PATTERN_TEST : false;
constant bool ENABLE_TEXTURE_TRANSFORM [[function_constant(52)]];
constant bool ENABLE_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_TEXTURE_TRANSFORM) ? ENABLE_TEXTURE_TRANSFORM : false;
constant bool ENABLE_TRANSMISSION_TEXTURE_TRANSFORM [[function_constant(53)]];
constant bool ENABLE_TRANSMISSION_TEXTURE_TRANSFORM_tmp = is_function_constant_defined(ENABLE_TRANSMISSION_TEXTURE_TRANSFORM) ? ENABLE_TRANSMISSION_TEXTURE_TRANSFORM : false;
constant bool ENABLE_TRANSMISSION_TEX [[function_constant(54)]];
constant bool ENABLE_TRANSMISSION_TEX_tmp = is_function_constant_defined(ENABLE_TRANSMISSION_TEX) ? ENABLE_TRANSMISSION_TEX : false;
constant bool ENABLE_TRANSMISSION [[function_constant(55)]];
constant bool ENABLE_TRANSMISSION_tmp = is_function_constant_defined(ENABLE_TRANSMISSION) ? ENABLE_TRANSMISSION : false;
constant bool ENABLE_VERTEX_COLOR_BASE [[function_constant(56)]];
constant bool ENABLE_VERTEX_COLOR_BASE_tmp = is_function_constant_defined(ENABLE_VERTEX_COLOR_BASE) ? ENABLE_VERTEX_COLOR_BASE : false;
constant bool SC_USE_CLAMP_TO_BORDER_baseColorTexture [[function_constant(57)]];
constant bool SC_USE_CLAMP_TO_BORDER_baseColorTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_baseColorTexture) ? SC_USE_CLAMP_TO_BORDER_baseColorTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_clearcoatNormalTexture [[function_constant(58)]];
constant bool SC_USE_CLAMP_TO_BORDER_clearcoatNormalTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_clearcoatNormalTexture) ? SC_USE_CLAMP_TO_BORDER_clearcoatNormalTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_clearcoatRoughnessTexture [[function_constant(59)]];
constant bool SC_USE_CLAMP_TO_BORDER_clearcoatRoughnessTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_clearcoatRoughnessTexture) ? SC_USE_CLAMP_TO_BORDER_clearcoatRoughnessTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_clearcoatTexture [[function_constant(60)]];
constant bool SC_USE_CLAMP_TO_BORDER_clearcoatTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_clearcoatTexture) ? SC_USE_CLAMP_TO_BORDER_clearcoatTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_emissiveTexture [[function_constant(61)]];
constant bool SC_USE_CLAMP_TO_BORDER_emissiveTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_emissiveTexture) ? SC_USE_CLAMP_TO_BORDER_emissiveTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(62)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_metallicRoughnessTexture [[function_constant(63)]];
constant bool SC_USE_CLAMP_TO_BORDER_metallicRoughnessTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_metallicRoughnessTexture) ? SC_USE_CLAMP_TO_BORDER_metallicRoughnessTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_normalTexture [[function_constant(64)]];
constant bool SC_USE_CLAMP_TO_BORDER_normalTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_normalTexture) ? SC_USE_CLAMP_TO_BORDER_normalTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_screenTexture [[function_constant(65)]];
constant bool SC_USE_CLAMP_TO_BORDER_screenTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_screenTexture) ? SC_USE_CLAMP_TO_BORDER_screenTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_sheenColorTexture [[function_constant(66)]];
constant bool SC_USE_CLAMP_TO_BORDER_sheenColorTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_sheenColorTexture) ? SC_USE_CLAMP_TO_BORDER_sheenColorTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_sheenRoughnessTexture [[function_constant(67)]];
constant bool SC_USE_CLAMP_TO_BORDER_sheenRoughnessTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_sheenRoughnessTexture) ? SC_USE_CLAMP_TO_BORDER_sheenRoughnessTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_transmissionTexture [[function_constant(68)]];
constant bool SC_USE_CLAMP_TO_BORDER_transmissionTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_transmissionTexture) ? SC_USE_CLAMP_TO_BORDER_transmissionTexture : false;
constant bool SC_USE_UV_MIN_MAX_baseColorTexture [[function_constant(69)]];
constant bool SC_USE_UV_MIN_MAX_baseColorTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_baseColorTexture) ? SC_USE_UV_MIN_MAX_baseColorTexture : false;
constant bool SC_USE_UV_MIN_MAX_clearcoatNormalTexture [[function_constant(70)]];
constant bool SC_USE_UV_MIN_MAX_clearcoatNormalTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_clearcoatNormalTexture) ? SC_USE_UV_MIN_MAX_clearcoatNormalTexture : false;
constant bool SC_USE_UV_MIN_MAX_clearcoatRoughnessTexture [[function_constant(71)]];
constant bool SC_USE_UV_MIN_MAX_clearcoatRoughnessTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_clearcoatRoughnessTexture) ? SC_USE_UV_MIN_MAX_clearcoatRoughnessTexture : false;
constant bool SC_USE_UV_MIN_MAX_clearcoatTexture [[function_constant(72)]];
constant bool SC_USE_UV_MIN_MAX_clearcoatTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_clearcoatTexture) ? SC_USE_UV_MIN_MAX_clearcoatTexture : false;
constant bool SC_USE_UV_MIN_MAX_emissiveTexture [[function_constant(73)]];
constant bool SC_USE_UV_MIN_MAX_emissiveTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_emissiveTexture) ? SC_USE_UV_MIN_MAX_emissiveTexture : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(74)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_metallicRoughnessTexture [[function_constant(75)]];
constant bool SC_USE_UV_MIN_MAX_metallicRoughnessTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_metallicRoughnessTexture) ? SC_USE_UV_MIN_MAX_metallicRoughnessTexture : false;
constant bool SC_USE_UV_MIN_MAX_normalTexture [[function_constant(76)]];
constant bool SC_USE_UV_MIN_MAX_normalTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_normalTexture) ? SC_USE_UV_MIN_MAX_normalTexture : false;
constant bool SC_USE_UV_MIN_MAX_screenTexture [[function_constant(77)]];
constant bool SC_USE_UV_MIN_MAX_screenTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_screenTexture) ? SC_USE_UV_MIN_MAX_screenTexture : false;
constant bool SC_USE_UV_MIN_MAX_sheenColorTexture [[function_constant(78)]];
constant bool SC_USE_UV_MIN_MAX_sheenColorTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_sheenColorTexture) ? SC_USE_UV_MIN_MAX_sheenColorTexture : false;
constant bool SC_USE_UV_MIN_MAX_sheenRoughnessTexture [[function_constant(79)]];
constant bool SC_USE_UV_MIN_MAX_sheenRoughnessTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_sheenRoughnessTexture) ? SC_USE_UV_MIN_MAX_sheenRoughnessTexture : false;
constant bool SC_USE_UV_MIN_MAX_transmissionTexture [[function_constant(80)]];
constant bool SC_USE_UV_MIN_MAX_transmissionTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_transmissionTexture) ? SC_USE_UV_MIN_MAX_transmissionTexture : false;
constant bool SC_USE_UV_TRANSFORM_baseColorTexture [[function_constant(81)]];
constant bool SC_USE_UV_TRANSFORM_baseColorTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_baseColorTexture) ? SC_USE_UV_TRANSFORM_baseColorTexture : false;
constant bool SC_USE_UV_TRANSFORM_clearcoatNormalTexture [[function_constant(82)]];
constant bool SC_USE_UV_TRANSFORM_clearcoatNormalTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_clearcoatNormalTexture) ? SC_USE_UV_TRANSFORM_clearcoatNormalTexture : false;
constant bool SC_USE_UV_TRANSFORM_clearcoatRoughnessTexture [[function_constant(83)]];
constant bool SC_USE_UV_TRANSFORM_clearcoatRoughnessTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_clearcoatRoughnessTexture) ? SC_USE_UV_TRANSFORM_clearcoatRoughnessTexture : false;
constant bool SC_USE_UV_TRANSFORM_clearcoatTexture [[function_constant(84)]];
constant bool SC_USE_UV_TRANSFORM_clearcoatTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_clearcoatTexture) ? SC_USE_UV_TRANSFORM_clearcoatTexture : false;
constant bool SC_USE_UV_TRANSFORM_emissiveTexture [[function_constant(85)]];
constant bool SC_USE_UV_TRANSFORM_emissiveTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_emissiveTexture) ? SC_USE_UV_TRANSFORM_emissiveTexture : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(86)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_metallicRoughnessTexture [[function_constant(87)]];
constant bool SC_USE_UV_TRANSFORM_metallicRoughnessTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_metallicRoughnessTexture) ? SC_USE_UV_TRANSFORM_metallicRoughnessTexture : false;
constant bool SC_USE_UV_TRANSFORM_normalTexture [[function_constant(88)]];
constant bool SC_USE_UV_TRANSFORM_normalTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_normalTexture) ? SC_USE_UV_TRANSFORM_normalTexture : false;
constant bool SC_USE_UV_TRANSFORM_screenTexture [[function_constant(89)]];
constant bool SC_USE_UV_TRANSFORM_screenTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_screenTexture) ? SC_USE_UV_TRANSFORM_screenTexture : false;
constant bool SC_USE_UV_TRANSFORM_sheenColorTexture [[function_constant(90)]];
constant bool SC_USE_UV_TRANSFORM_sheenColorTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_sheenColorTexture) ? SC_USE_UV_TRANSFORM_sheenColorTexture : false;
constant bool SC_USE_UV_TRANSFORM_sheenRoughnessTexture [[function_constant(91)]];
constant bool SC_USE_UV_TRANSFORM_sheenRoughnessTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_sheenRoughnessTexture) ? SC_USE_UV_TRANSFORM_sheenRoughnessTexture : false;
constant bool SC_USE_UV_TRANSFORM_transmissionTexture [[function_constant(92)]];
constant bool SC_USE_UV_TRANSFORM_transmissionTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_transmissionTexture) ? SC_USE_UV_TRANSFORM_transmissionTexture : false;
constant bool UseViewSpaceDepthVariant [[function_constant(93)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool baseColorTextureHasSwappedViews [[function_constant(94)]];
constant bool baseColorTextureHasSwappedViews_tmp = is_function_constant_defined(baseColorTextureHasSwappedViews) ? baseColorTextureHasSwappedViews : false;
constant bool clearcoatNormalTextureHasSwappedViews [[function_constant(95)]];
constant bool clearcoatNormalTextureHasSwappedViews_tmp = is_function_constant_defined(clearcoatNormalTextureHasSwappedViews) ? clearcoatNormalTextureHasSwappedViews : false;
constant bool clearcoatRoughnessTextureHasSwappedViews [[function_constant(96)]];
constant bool clearcoatRoughnessTextureHasSwappedViews_tmp = is_function_constant_defined(clearcoatRoughnessTextureHasSwappedViews) ? clearcoatRoughnessTextureHasSwappedViews : false;
constant bool clearcoatTextureHasSwappedViews [[function_constant(97)]];
constant bool clearcoatTextureHasSwappedViews_tmp = is_function_constant_defined(clearcoatTextureHasSwappedViews) ? clearcoatTextureHasSwappedViews : false;
constant bool emissiveTextureHasSwappedViews [[function_constant(98)]];
constant bool emissiveTextureHasSwappedViews_tmp = is_function_constant_defined(emissiveTextureHasSwappedViews) ? emissiveTextureHasSwappedViews : false;
constant bool intensityTextureHasSwappedViews [[function_constant(99)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool metallicRoughnessTextureHasSwappedViews [[function_constant(100)]];
constant bool metallicRoughnessTextureHasSwappedViews_tmp = is_function_constant_defined(metallicRoughnessTextureHasSwappedViews) ? metallicRoughnessTextureHasSwappedViews : false;
constant bool normalTextureHasSwappedViews [[function_constant(101)]];
constant bool normalTextureHasSwappedViews_tmp = is_function_constant_defined(normalTextureHasSwappedViews) ? normalTextureHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(102)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(103)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(104)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(105)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(106)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(107)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(108)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(109)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(110)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(111)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(112)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(113)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(114)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(115)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(116)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(117)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_EnvmapDiffuseHasSwappedViews [[function_constant(118)]];
constant bool sc_EnvmapDiffuseHasSwappedViews_tmp = is_function_constant_defined(sc_EnvmapDiffuseHasSwappedViews) ? sc_EnvmapDiffuseHasSwappedViews : false;
constant bool sc_EnvmapSpecularHasSwappedViews [[function_constant(119)]];
constant bool sc_EnvmapSpecularHasSwappedViews_tmp = is_function_constant_defined(sc_EnvmapSpecularHasSwappedViews) ? sc_EnvmapSpecularHasSwappedViews : false;
constant bool sc_FramebufferFetch [[function_constant(120)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_HasDiffuseEnvmap [[function_constant(121)]];
constant bool sc_HasDiffuseEnvmap_tmp = is_function_constant_defined(sc_HasDiffuseEnvmap) ? sc_HasDiffuseEnvmap : false;
constant bool sc_IsEditor [[function_constant(122)]];
constant bool sc_IsEditor_tmp = is_function_constant_defined(sc_IsEditor) ? sc_IsEditor : false;
constant bool sc_LightEstimation [[function_constant(123)]];
constant bool sc_LightEstimation_tmp = is_function_constant_defined(sc_LightEstimation) ? sc_LightEstimation : false;
constant bool sc_MotionVectorsPass [[function_constant(124)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(125)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(126)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(127)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(128)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(129)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(130)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RayTracingCasterForceOpaque [[function_constant(131)]];
constant bool sc_RayTracingCasterForceOpaque_tmp = is_function_constant_defined(sc_RayTracingCasterForceOpaque) ? sc_RayTracingCasterForceOpaque : false;
constant bool sc_RayTracingGlobalIlluminationHasSwappedViews [[function_constant(132)]];
constant bool sc_RayTracingGlobalIlluminationHasSwappedViews_tmp = is_function_constant_defined(sc_RayTracingGlobalIlluminationHasSwappedViews) ? sc_RayTracingGlobalIlluminationHasSwappedViews : false;
constant bool sc_RayTracingReflectionsHasSwappedViews [[function_constant(133)]];
constant bool sc_RayTracingReflectionsHasSwappedViews_tmp = is_function_constant_defined(sc_RayTracingReflectionsHasSwappedViews) ? sc_RayTracingReflectionsHasSwappedViews : false;
constant bool sc_RayTracingShadowsHasSwappedViews [[function_constant(134)]];
constant bool sc_RayTracingShadowsHasSwappedViews_tmp = is_function_constant_defined(sc_RayTracingShadowsHasSwappedViews) ? sc_RayTracingShadowsHasSwappedViews : false;
constant bool sc_RenderAlphaToColor [[function_constant(135)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_SSAOEnabled [[function_constant(136)]];
constant bool sc_SSAOEnabled_tmp = is_function_constant_defined(sc_SSAOEnabled) ? sc_SSAOEnabled : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(137)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(138)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(139)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(140)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(141)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant bool screenTextureHasSwappedViews [[function_constant(142)]];
constant bool screenTextureHasSwappedViews_tmp = is_function_constant_defined(screenTextureHasSwappedViews) ? screenTextureHasSwappedViews : false;
constant bool sheenColorTextureHasSwappedViews [[function_constant(143)]];
constant bool sheenColorTextureHasSwappedViews_tmp = is_function_constant_defined(sheenColorTextureHasSwappedViews) ? sheenColorTextureHasSwappedViews : false;
constant bool sheenRoughnessTextureHasSwappedViews [[function_constant(144)]];
constant bool sheenRoughnessTextureHasSwappedViews_tmp = is_function_constant_defined(sheenRoughnessTextureHasSwappedViews) ? sheenRoughnessTextureHasSwappedViews : false;
constant bool transmissionTextureHasSwappedViews [[function_constant(145)]];
constant bool transmissionTextureHasSwappedViews_tmp = is_function_constant_defined(transmissionTextureHasSwappedViews) ? transmissionTextureHasSwappedViews : false;
constant int NODE_10_DROPLIST_ITEM [[function_constant(146)]];
constant int NODE_10_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_10_DROPLIST_ITEM) ? NODE_10_DROPLIST_ITEM : 0;
constant int NODE_11_DROPLIST_ITEM [[function_constant(147)]];
constant int NODE_11_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_11_DROPLIST_ITEM) ? NODE_11_DROPLIST_ITEM : 0;
constant int NODE_7_DROPLIST_ITEM [[function_constant(148)]];
constant int NODE_7_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_7_DROPLIST_ITEM) ? NODE_7_DROPLIST_ITEM : 0;
constant int NODE_8_DROPLIST_ITEM [[function_constant(149)]];
constant int NODE_8_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_8_DROPLIST_ITEM) ? NODE_8_DROPLIST_ITEM : 0;
constant int SC_DEVICE_CLASS [[function_constant(150)]];
constant int SC_DEVICE_CLASS_tmp = is_function_constant_defined(SC_DEVICE_CLASS) ? SC_DEVICE_CLASS : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_baseColorTexture [[function_constant(151)]];
constant int SC_SOFTWARE_WRAP_MODE_U_baseColorTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_baseColorTexture) ? SC_SOFTWARE_WRAP_MODE_U_baseColorTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_clearcoatNormalTexture [[function_constant(152)]];
constant int SC_SOFTWARE_WRAP_MODE_U_clearcoatNormalTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_clearcoatNormalTexture) ? SC_SOFTWARE_WRAP_MODE_U_clearcoatNormalTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_clearcoatRoughnessTexture [[function_constant(153)]];
constant int SC_SOFTWARE_WRAP_MODE_U_clearcoatRoughnessTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_clearcoatRoughnessTexture) ? SC_SOFTWARE_WRAP_MODE_U_clearcoatRoughnessTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_clearcoatTexture [[function_constant(154)]];
constant int SC_SOFTWARE_WRAP_MODE_U_clearcoatTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_clearcoatTexture) ? SC_SOFTWARE_WRAP_MODE_U_clearcoatTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_emissiveTexture [[function_constant(155)]];
constant int SC_SOFTWARE_WRAP_MODE_U_emissiveTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_emissiveTexture) ? SC_SOFTWARE_WRAP_MODE_U_emissiveTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(156)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_metallicRoughnessTexture [[function_constant(157)]];
constant int SC_SOFTWARE_WRAP_MODE_U_metallicRoughnessTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_metallicRoughnessTexture) ? SC_SOFTWARE_WRAP_MODE_U_metallicRoughnessTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_normalTexture [[function_constant(158)]];
constant int SC_SOFTWARE_WRAP_MODE_U_normalTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_normalTexture) ? SC_SOFTWARE_WRAP_MODE_U_normalTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_screenTexture [[function_constant(159)]];
constant int SC_SOFTWARE_WRAP_MODE_U_screenTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_screenTexture) ? SC_SOFTWARE_WRAP_MODE_U_screenTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_sheenColorTexture [[function_constant(160)]];
constant int SC_SOFTWARE_WRAP_MODE_U_sheenColorTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_sheenColorTexture) ? SC_SOFTWARE_WRAP_MODE_U_sheenColorTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_sheenRoughnessTexture [[function_constant(161)]];
constant int SC_SOFTWARE_WRAP_MODE_U_sheenRoughnessTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_sheenRoughnessTexture) ? SC_SOFTWARE_WRAP_MODE_U_sheenRoughnessTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_transmissionTexture [[function_constant(162)]];
constant int SC_SOFTWARE_WRAP_MODE_U_transmissionTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_transmissionTexture) ? SC_SOFTWARE_WRAP_MODE_U_transmissionTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_baseColorTexture [[function_constant(163)]];
constant int SC_SOFTWARE_WRAP_MODE_V_baseColorTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_baseColorTexture) ? SC_SOFTWARE_WRAP_MODE_V_baseColorTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_clearcoatNormalTexture [[function_constant(164)]];
constant int SC_SOFTWARE_WRAP_MODE_V_clearcoatNormalTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_clearcoatNormalTexture) ? SC_SOFTWARE_WRAP_MODE_V_clearcoatNormalTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_clearcoatRoughnessTexture [[function_constant(165)]];
constant int SC_SOFTWARE_WRAP_MODE_V_clearcoatRoughnessTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_clearcoatRoughnessTexture) ? SC_SOFTWARE_WRAP_MODE_V_clearcoatRoughnessTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_clearcoatTexture [[function_constant(166)]];
constant int SC_SOFTWARE_WRAP_MODE_V_clearcoatTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_clearcoatTexture) ? SC_SOFTWARE_WRAP_MODE_V_clearcoatTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_emissiveTexture [[function_constant(167)]];
constant int SC_SOFTWARE_WRAP_MODE_V_emissiveTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_emissiveTexture) ? SC_SOFTWARE_WRAP_MODE_V_emissiveTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(168)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_metallicRoughnessTexture [[function_constant(169)]];
constant int SC_SOFTWARE_WRAP_MODE_V_metallicRoughnessTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_metallicRoughnessTexture) ? SC_SOFTWARE_WRAP_MODE_V_metallicRoughnessTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_normalTexture [[function_constant(170)]];
constant int SC_SOFTWARE_WRAP_MODE_V_normalTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_normalTexture) ? SC_SOFTWARE_WRAP_MODE_V_normalTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_screenTexture [[function_constant(171)]];
constant int SC_SOFTWARE_WRAP_MODE_V_screenTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_screenTexture) ? SC_SOFTWARE_WRAP_MODE_V_screenTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_sheenColorTexture [[function_constant(172)]];
constant int SC_SOFTWARE_WRAP_MODE_V_sheenColorTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_sheenColorTexture) ? SC_SOFTWARE_WRAP_MODE_V_sheenColorTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_sheenRoughnessTexture [[function_constant(173)]];
constant int SC_SOFTWARE_WRAP_MODE_V_sheenRoughnessTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_sheenRoughnessTexture) ? SC_SOFTWARE_WRAP_MODE_V_sheenRoughnessTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_transmissionTexture [[function_constant(174)]];
constant int SC_SOFTWARE_WRAP_MODE_V_transmissionTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_transmissionTexture) ? SC_SOFTWARE_WRAP_MODE_V_transmissionTexture : -1;
constant int Tweak_N30 [[function_constant(175)]];
constant int Tweak_N30_tmp = is_function_constant_defined(Tweak_N30) ? Tweak_N30 : 0;
constant int Tweak_N32 [[function_constant(176)]];
constant int Tweak_N32_tmp = is_function_constant_defined(Tweak_N32) ? Tweak_N32 : 0;
constant int Tweak_N37 [[function_constant(177)]];
constant int Tweak_N37_tmp = is_function_constant_defined(Tweak_N37) ? Tweak_N37 : 0;
constant int Tweak_N44 [[function_constant(178)]];
constant int Tweak_N44_tmp = is_function_constant_defined(Tweak_N44) ? Tweak_N44 : 0;
constant int Tweak_N47 [[function_constant(179)]];
constant int Tweak_N47_tmp = is_function_constant_defined(Tweak_N47) ? Tweak_N47 : 0;
constant int Tweak_N60 [[function_constant(180)]];
constant int Tweak_N60_tmp = is_function_constant_defined(Tweak_N60) ? Tweak_N60 : 0;
constant int baseColorTextureLayout [[function_constant(181)]];
constant int baseColorTextureLayout_tmp = is_function_constant_defined(baseColorTextureLayout) ? baseColorTextureLayout : 0;
constant int clearcoatNormalTextureLayout [[function_constant(182)]];
constant int clearcoatNormalTextureLayout_tmp = is_function_constant_defined(clearcoatNormalTextureLayout) ? clearcoatNormalTextureLayout : 0;
constant int clearcoatRoughnessTextureLayout [[function_constant(183)]];
constant int clearcoatRoughnessTextureLayout_tmp = is_function_constant_defined(clearcoatRoughnessTextureLayout) ? clearcoatRoughnessTextureLayout : 0;
constant int clearcoatTextureLayout [[function_constant(184)]];
constant int clearcoatTextureLayout_tmp = is_function_constant_defined(clearcoatTextureLayout) ? clearcoatTextureLayout : 0;
constant int emissiveTextureLayout [[function_constant(185)]];
constant int emissiveTextureLayout_tmp = is_function_constant_defined(emissiveTextureLayout) ? emissiveTextureLayout : 0;
constant int intensityTextureLayout [[function_constant(186)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int metallicRoughnessTextureLayout [[function_constant(187)]];
constant int metallicRoughnessTextureLayout_tmp = is_function_constant_defined(metallicRoughnessTextureLayout) ? metallicRoughnessTextureLayout : 0;
constant int normalTextureLayout [[function_constant(188)]];
constant int normalTextureLayout_tmp = is_function_constant_defined(normalTextureLayout) ? normalTextureLayout : 0;
constant int sc_AmbientLightMode0 [[function_constant(189)]];
constant int sc_AmbientLightMode0_tmp = is_function_constant_defined(sc_AmbientLightMode0) ? sc_AmbientLightMode0 : 0;
constant int sc_AmbientLightMode1 [[function_constant(190)]];
constant int sc_AmbientLightMode1_tmp = is_function_constant_defined(sc_AmbientLightMode1) ? sc_AmbientLightMode1 : 0;
constant int sc_AmbientLightMode2 [[function_constant(191)]];
constant int sc_AmbientLightMode2_tmp = is_function_constant_defined(sc_AmbientLightMode2) ? sc_AmbientLightMode2 : 0;
constant int sc_AmbientLightMode_Constant [[function_constant(192)]];
constant int sc_AmbientLightMode_Constant_tmp = is_function_constant_defined(sc_AmbientLightMode_Constant) ? sc_AmbientLightMode_Constant : 0;
constant int sc_AmbientLightMode_EnvironmentMap [[function_constant(193)]];
constant int sc_AmbientLightMode_EnvironmentMap_tmp = is_function_constant_defined(sc_AmbientLightMode_EnvironmentMap) ? sc_AmbientLightMode_EnvironmentMap : 0;
constant int sc_AmbientLightMode_FromCamera [[function_constant(194)]];
constant int sc_AmbientLightMode_FromCamera_tmp = is_function_constant_defined(sc_AmbientLightMode_FromCamera) ? sc_AmbientLightMode_FromCamera : 0;
constant int sc_AmbientLightMode_SphericalHarmonics [[function_constant(195)]];
constant int sc_AmbientLightMode_SphericalHarmonics_tmp = is_function_constant_defined(sc_AmbientLightMode_SphericalHarmonics) ? sc_AmbientLightMode_SphericalHarmonics : 0;
constant int sc_AmbientLightsCount [[function_constant(196)]];
constant int sc_AmbientLightsCount_tmp = is_function_constant_defined(sc_AmbientLightsCount) ? sc_AmbientLightsCount : 0;
constant int sc_DepthBufferMode [[function_constant(197)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_DirectionalLightsCount [[function_constant(198)]];
constant int sc_DirectionalLightsCount_tmp = is_function_constant_defined(sc_DirectionalLightsCount) ? sc_DirectionalLightsCount : 0;
constant int sc_EnvLightMode [[function_constant(199)]];
constant int sc_EnvLightMode_tmp = is_function_constant_defined(sc_EnvLightMode) ? sc_EnvLightMode : 0;
constant int sc_EnvmapDiffuseLayout [[function_constant(200)]];
constant int sc_EnvmapDiffuseLayout_tmp = is_function_constant_defined(sc_EnvmapDiffuseLayout) ? sc_EnvmapDiffuseLayout : 0;
constant int sc_EnvmapSpecularLayout [[function_constant(201)]];
constant int sc_EnvmapSpecularLayout_tmp = is_function_constant_defined(sc_EnvmapSpecularLayout) ? sc_EnvmapSpecularLayout : 0;
constant int sc_LightEstimationSGCount [[function_constant(202)]];
constant int sc_LightEstimationSGCount_tmp = is_function_constant_defined(sc_LightEstimationSGCount) ? sc_LightEstimationSGCount : 0;
constant int sc_PointLightsCount [[function_constant(203)]];
constant int sc_PointLightsCount_tmp = is_function_constant_defined(sc_PointLightsCount) ? sc_PointLightsCount : 0;
constant int sc_RayTracingGlobalIlluminationLayout [[function_constant(204)]];
constant int sc_RayTracingGlobalIlluminationLayout_tmp = is_function_constant_defined(sc_RayTracingGlobalIlluminationLayout) ? sc_RayTracingGlobalIlluminationLayout : 0;
constant int sc_RayTracingReflectionsLayout [[function_constant(205)]];
constant int sc_RayTracingReflectionsLayout_tmp = is_function_constant_defined(sc_RayTracingReflectionsLayout) ? sc_RayTracingReflectionsLayout : 0;
constant int sc_RayTracingShadowsLayout [[function_constant(206)]];
constant int sc_RayTracingShadowsLayout_tmp = is_function_constant_defined(sc_RayTracingShadowsLayout) ? sc_RayTracingShadowsLayout : 0;
constant int sc_RenderingSpace [[function_constant(207)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(208)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(209)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(210)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(211)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(212)]];
constant int sc_StereoRendering_IsClipDistanceEnabled_tmp = is_function_constant_defined(sc_StereoRendering_IsClipDistanceEnabled) ? sc_StereoRendering_IsClipDistanceEnabled : 0;
constant int screenTextureLayout [[function_constant(213)]];
constant int screenTextureLayout_tmp = is_function_constant_defined(screenTextureLayout) ? screenTextureLayout : 0;
constant int sheenColorTextureLayout [[function_constant(214)]];
constant int sheenColorTextureLayout_tmp = is_function_constant_defined(sheenColorTextureLayout) ? sheenColorTextureLayout : 0;
constant int sheenRoughnessTextureLayout [[function_constant(215)]];
constant int sheenRoughnessTextureLayout_tmp = is_function_constant_defined(sheenRoughnessTextureLayout) ? sheenRoughnessTextureLayout : 0;
constant int transmissionTextureLayout [[function_constant(216)]];
constant int transmissionTextureLayout_tmp = is_function_constant_defined(transmissionTextureLayout) ? transmissionTextureLayout : 0;

namespace SNAP_VS {
struct sc_Vertex_t
{
float4 position;
float3 normal;
float3 tangent;
float2 texture0;
float2 texture1;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
int sc_RayTracingReceiverEffectsMask;
float4 sc_RayTracingReflectionsSize;
float4 sc_RayTracingReflectionsDims;
float4 sc_RayTracingReflectionsView;
float4 sc_RayTracingGlobalIlluminationSize;
float4 sc_RayTracingGlobalIlluminationDims;
float4 sc_RayTracingGlobalIlluminationView;
float4 sc_RayTracingShadowsSize;
float4 sc_RayTracingShadowsDims;
float4 sc_RayTracingShadowsView;
float3 sc_RayTracingOriginScale;
uint sc_RayTracingReceiverMask;
float3 sc_RayTracingOriginScaleInv;
float3 sc_RayTracingOriginOffset;
uint sc_RayTracingReceiverId;
uint4 sc_RayTracingCasterConfiguration;
uint4 sc_RayTracingCasterOffsetPNTC;
uint4 sc_RayTracingCasterOffsetTexture;
uint4 sc_RayTracingCasterFormatPNTC;
uint4 sc_RayTracingCasterFormatTexture;
float4 sc_RayTracingRayDirectionSize;
float4 sc_RayTracingRayDirectionDims;
float4 sc_RayTracingRayDirectionView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float3 emissiveFactor;
float4 emissiveTextureSize;
float4 emissiveTextureDims;
float4 emissiveTextureView;
float3x3 emissiveTextureTransform;
float4 emissiveTextureUvMinMax;
float4 emissiveTextureBorderColor;
float normalTextureScale;
float4 normalTextureSize;
float4 normalTextureDims;
float4 normalTextureView;
float3x3 normalTextureTransform;
float4 normalTextureUvMinMax;
float4 normalTextureBorderColor;
float metallicFactor;
float roughnessFactor;
float occlusionTextureStrength;
float4 metallicRoughnessTextureSize;
float4 metallicRoughnessTextureDims;
float4 metallicRoughnessTextureView;
float3x3 metallicRoughnessTextureTransform;
float4 metallicRoughnessTextureUvMinMax;
float4 metallicRoughnessTextureBorderColor;
float transmissionFactor;
float4 transmissionTextureSize;
float4 transmissionTextureDims;
float4 transmissionTextureView;
float3x3 transmissionTextureTransform;
float4 transmissionTextureUvMinMax;
float4 transmissionTextureBorderColor;
float4 screenTextureSize;
float4 screenTextureDims;
float4 screenTextureView;
float3x3 screenTextureTransform;
float4 screenTextureUvMinMax;
float4 screenTextureBorderColor;
float3 sheenColorFactor;
float4 sheenColorTextureSize;
float4 sheenColorTextureDims;
float4 sheenColorTextureView;
float3x3 sheenColorTextureTransform;
float4 sheenColorTextureUvMinMax;
float4 sheenColorTextureBorderColor;
float sheenRoughnessFactor;
float4 sheenRoughnessTextureSize;
float4 sheenRoughnessTextureDims;
float4 sheenRoughnessTextureView;
float3x3 sheenRoughnessTextureTransform;
float4 sheenRoughnessTextureUvMinMax;
float4 sheenRoughnessTextureBorderColor;
float clearcoatFactor;
float4 clearcoatTextureSize;
float4 clearcoatTextureDims;
float4 clearcoatTextureView;
float3x3 clearcoatTextureTransform;
float4 clearcoatTextureUvMinMax;
float4 clearcoatTextureBorderColor;
float clearcoatRoughnessFactor;
float4 clearcoatRoughnessTextureSize;
float4 clearcoatRoughnessTextureDims;
float4 clearcoatRoughnessTextureView;
float3x3 clearcoatRoughnessTextureTransform;
float4 clearcoatRoughnessTextureUvMinMax;
float4 clearcoatRoughnessTextureBorderColor;
float4 clearcoatNormalTextureSize;
float4 clearcoatNormalTextureDims;
float4 clearcoatNormalTextureView;
float3x3 clearcoatNormalTextureTransform;
float4 clearcoatNormalTextureUvMinMax;
float4 clearcoatNormalTextureBorderColor;
float4 baseColorTextureSize;
float4 baseColorTextureDims;
float4 baseColorTextureView;
float3x3 baseColorTextureTransform;
float4 baseColorTextureUvMinMax;
float4 baseColorTextureBorderColor;
float4 baseColorFactor;
float2 baseColorTexture_offset;
float2 baseColorTexture_scale;
float baseColorTexture_rotation;
float2 emissiveTexture_offset;
float2 emissiveTexture_scale;
float emissiveTexture_rotation;
float2 normalTexture_offset;
float2 normalTexture_scale;
float normalTexture_rotation;
float2 metallicRoughnessTexture_offset;
float2 metallicRoughnessTexture_scale;
float metallicRoughnessTexture_rotation;
float2 transmissionTexture_offset;
float2 transmissionTexture_scale;
float transmissionTexture_rotation;
float2 sheenColorTexture_offset;
float2 sheenColorTexture_scale;
float sheenColorTexture_rotation;
float2 sheenRoughnessTexture_offset;
float2 sheenRoughnessTexture_scale;
float sheenRoughnessTexture_rotation;
float2 clearcoatTexture_offset;
float2 clearcoatTexture_scale;
float clearcoatTexture_rotation;
float2 clearcoatNormalTexture_offset;
float2 clearcoatNormalTexture_scale;
float clearcoatNormalTexture_rotation;
float2 clearcoatRoughnessTexture_offset;
float2 clearcoatRoughnessTexture_scale;
float clearcoatRoughnessTexture_rotation;
float colorMultiplier;
float Port_DebugSheenEnvLightMult_N003;
float Port_DebugSheenPunctualLightMult_N003;
float Port_Input2_N043;
float Port_Input2_N062;
float3 Port_SpecularAO_N036;
float3 Port_Albedo_N405;
float Port_Opacity_N405;
float3 Port_Emissive_N405;
float Port_Metallic_N405;
float3 Port_SpecularAO_N405;
float depthRef;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_RayTracingCasterIndexBuffer_obj
{
uint sc_RayTracingCasterTriangles[1];
};
struct sc_RayTracingCasterVertexBuffer_obj
{
float sc_RayTracingCasterVertices[1];
};
struct sc_RayTracingCasterNonAnimatedVertexBuffer_obj
{
float sc_RayTracingCasterNonAnimatedVertices[1];
};
struct sc_Set0
{
const device sc_RayTracingCasterIndexBuffer_obj* sc_RayTracingCasterIndexBuffer [[id(0)]];
const device sc_RayTracingCasterVertexBuffer_obj* sc_RayTracingCasterVertexBuffer [[id(1)]];
const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj* sc_RayTracingCasterNonAnimatedVertexBuffer [[id(2)]];
constant sc_Bones_obj* sc_BonesUBO [[id(3)]];
texture2d<float> baseColorTexture [[id(4)]];
texture2d<float> clearcoatNormalTexture [[id(5)]];
texture2d<float> clearcoatRoughnessTexture [[id(6)]];
texture2d<float> clearcoatTexture [[id(7)]];
texture2d<float> emissiveTexture [[id(8)]];
texture2d<float> intensityTexture [[id(9)]];
texture2d<float> metallicRoughnessTexture [[id(10)]];
texture2d<float> normalTexture [[id(11)]];
texture2d<float> sc_EnvmapDiffuse [[id(12)]];
texture2d<float> sc_EnvmapSpecular [[id(13)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(22)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(23)]];
texture2d<float> sc_RayTracingRayDirection [[id(24)]];
texture2d<float> sc_RayTracingReflections [[id(25)]];
texture2d<float> sc_RayTracingShadows [[id(26)]];
texture2d<float> sc_SSAOTexture [[id(27)]];
texture2d<float> sc_ScreenTexture [[id(28)]];
texture2d<float> sc_ShadowTexture [[id(29)]];
texture2d<float> screenTexture [[id(31)]];
texture2d<float> sheenColorTexture [[id(32)]];
texture2d<float> sheenRoughnessTexture [[id(33)]];
texture2d<float> transmissionTexture [[id(34)]];
sampler baseColorTextureSmpSC [[id(35)]];
sampler clearcoatNormalTextureSmpSC [[id(36)]];
sampler clearcoatRoughnessTextureSmpSC [[id(37)]];
sampler clearcoatTextureSmpSC [[id(38)]];
sampler emissiveTextureSmpSC [[id(39)]];
sampler intensityTextureSmpSC [[id(40)]];
sampler metallicRoughnessTextureSmpSC [[id(41)]];
sampler normalTextureSmpSC [[id(42)]];
sampler sc_EnvmapDiffuseSmpSC [[id(43)]];
sampler sc_EnvmapSpecularSmpSC [[id(44)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(46)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(47)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(48)]];
sampler sc_RayTracingReflectionsSmpSC [[id(49)]];
sampler sc_RayTracingShadowsSmpSC [[id(50)]];
sampler sc_SSAOTextureSmpSC [[id(51)]];
sampler sc_ScreenTextureSmpSC [[id(52)]];
sampler sc_ShadowTextureSmpSC [[id(53)]];
sampler screenTextureSmpSC [[id(55)]];
sampler sheenColorTextureSmpSC [[id(56)]];
sampler sheenRoughnessTextureSmpSC [[id(57)]];
sampler transmissionTextureSmpSC [[id(58)]];
constant userUniformsObj* UserUniforms [[id(59)]];
};
struct main_vert_out
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
float4 gl_Position [[position]];
};
struct main_vert_in
{
float4 position [[attribute(0)]];
float3 normal [[attribute(1)]];
float4 tangent [[attribute(2)]];
float2 texture0 [[attribute(3)]];
float2 texture1 [[attribute(4)]];
float4 boneData [[attribute(5)]];
float3 blendShape0Pos [[attribute(6)]];
float3 blendShape1Pos [[attribute(7)]];
float3 blendShape2Pos [[attribute(8)]];
float3 blendShape3Pos [[attribute(9)]];
float3 blendShape4Pos [[attribute(10)]];
float3 blendShape5Pos [[attribute(11)]];
float3 blendShape0Normal [[attribute(12)]];
float3 blendShape1Normal [[attribute(13)]];
float3 blendShape2Normal [[attribute(14)]];
float3 positionNext [[attribute(15)]];
float3 positionPrevious [[attribute(16)]];
float4 strandProperties [[attribute(17)]];
float4 color [[attribute(18)]];
};
vertex main_vert_out main_vert(main_vert_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],uint gl_InstanceIndex [[instance_id]])
{
main_vert_out out={};
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param=float4(in.position.xy,(*sc_set0.UserUniforms).depthRef+(1e-10*in.position.z),1.0+(1e-10*in.position.w));
if (sc_ShaderCacheConstant_tmp!=0)
{
param.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_0=param;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_1=dot(l9_0,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_2=l9_1;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_2;
}
}
float4 l9_3=float4(param.x,-param.y,(param.z*0.5)+(param.w*0.5),param.w);
out.gl_Position=l9_3;
return out;
}
out.PreviewVertexColor=float4(0.5);
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=float4(0.5);
PreviewInfo.Saved=false;
out.PreviewVertexSaved=0.0;
sc_Vertex_t l9_5;
l9_5.position=in.position;
l9_5.normal=in.normal;
l9_5.tangent=in.tangent.xyz;
l9_5.texture0=in.texture0;
l9_5.texture1=in.texture1;
sc_Vertex_t l9_6=l9_5;
sc_Vertex_t param_1=l9_6;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_7=param_1;
param_1=l9_7;
}
sc_Vertex_t l9_8=param_1;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_9=l9_8;
float3 l9_10=in.blendShape0Pos;
float3 l9_11=in.blendShape0Normal;
float l9_12=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_13=l9_9;
float3 l9_14=l9_10;
float l9_15=l9_12;
float3 l9_16=l9_13.position.xyz+(l9_14*l9_15);
l9_13.position=float4(l9_16.x,l9_16.y,l9_16.z,l9_13.position.w);
l9_9=l9_13;
l9_9.normal+=(l9_11*l9_12);
l9_8=l9_9;
sc_Vertex_t l9_17=l9_8;
float3 l9_18=in.blendShape1Pos;
float3 l9_19=in.blendShape1Normal;
float l9_20=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_21=l9_17;
float3 l9_22=l9_18;
float l9_23=l9_20;
float3 l9_24=l9_21.position.xyz+(l9_22*l9_23);
l9_21.position=float4(l9_24.x,l9_24.y,l9_24.z,l9_21.position.w);
l9_17=l9_21;
l9_17.normal+=(l9_19*l9_20);
l9_8=l9_17;
sc_Vertex_t l9_25=l9_8;
float3 l9_26=in.blendShape2Pos;
float3 l9_27=in.blendShape2Normal;
float l9_28=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_29=l9_25;
float3 l9_30=l9_26;
float l9_31=l9_28;
float3 l9_32=l9_29.position.xyz+(l9_30*l9_31);
l9_29.position=float4(l9_32.x,l9_32.y,l9_32.z,l9_29.position.w);
l9_25=l9_29;
l9_25.normal+=(l9_27*l9_28);
l9_8=l9_25;
}
else
{
sc_Vertex_t l9_33=l9_8;
float3 l9_34=in.blendShape0Pos;
float l9_35=(*sc_set0.UserUniforms).weights0.x;
float3 l9_36=l9_33.position.xyz+(l9_34*l9_35);
l9_33.position=float4(l9_36.x,l9_36.y,l9_36.z,l9_33.position.w);
l9_8=l9_33;
sc_Vertex_t l9_37=l9_8;
float3 l9_38=in.blendShape1Pos;
float l9_39=(*sc_set0.UserUniforms).weights0.y;
float3 l9_40=l9_37.position.xyz+(l9_38*l9_39);
l9_37.position=float4(l9_40.x,l9_40.y,l9_40.z,l9_37.position.w);
l9_8=l9_37;
sc_Vertex_t l9_41=l9_8;
float3 l9_42=in.blendShape2Pos;
float l9_43=(*sc_set0.UserUniforms).weights0.z;
float3 l9_44=l9_41.position.xyz+(l9_42*l9_43);
l9_41.position=float4(l9_44.x,l9_44.y,l9_44.z,l9_41.position.w);
l9_8=l9_41;
sc_Vertex_t l9_45=l9_8;
float3 l9_46=in.blendShape3Pos;
float l9_47=(*sc_set0.UserUniforms).weights0.w;
float3 l9_48=l9_45.position.xyz+(l9_46*l9_47);
l9_45.position=float4(l9_48.x,l9_48.y,l9_48.z,l9_45.position.w);
l9_8=l9_45;
sc_Vertex_t l9_49=l9_8;
float3 l9_50=in.blendShape4Pos;
float l9_51=(*sc_set0.UserUniforms).weights1.x;
float3 l9_52=l9_49.position.xyz+(l9_50*l9_51);
l9_49.position=float4(l9_52.x,l9_52.y,l9_52.z,l9_49.position.w);
l9_8=l9_49;
sc_Vertex_t l9_53=l9_8;
float3 l9_54=in.blendShape5Pos;
float l9_55=(*sc_set0.UserUniforms).weights1.y;
float3 l9_56=l9_53.position.xyz+(l9_54*l9_55);
l9_53.position=float4(l9_56.x,l9_56.y,l9_56.z,l9_53.position.w);
l9_8=l9_53;
}
}
param_1=l9_8;
sc_Vertex_t l9_57=param_1;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_58=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_58=float4(1.0,fract(in.boneData.yzw));
l9_58.x-=dot(l9_58.yzw,float3(1.0));
}
float4 l9_59=l9_58;
float4 l9_60=l9_59;
int l9_61=int(in.boneData.x);
int l9_62=int(in.boneData.y);
int l9_63=int(in.boneData.z);
int l9_64=int(in.boneData.w);
int l9_65=l9_61;
float4 l9_66=l9_57.position;
float3 l9_67=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_68=l9_65;
float4 l9_69=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[0];
float4 l9_70=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[1];
float4 l9_71=(*sc_set0.sc_BonesUBO).sc_Bones[l9_68].boneMatrix[2];
float4 l9_72[3];
l9_72[0]=l9_69;
l9_72[1]=l9_70;
l9_72[2]=l9_71;
l9_67=float3(dot(l9_66,l9_72[0]),dot(l9_66,l9_72[1]),dot(l9_66,l9_72[2]));
}
else
{
l9_67=l9_66.xyz;
}
float3 l9_73=l9_67;
float3 l9_74=l9_73;
float l9_75=l9_60.x;
int l9_76=l9_62;
float4 l9_77=l9_57.position;
float3 l9_78=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_79=l9_76;
float4 l9_80=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[0];
float4 l9_81=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[1];
float4 l9_82=(*sc_set0.sc_BonesUBO).sc_Bones[l9_79].boneMatrix[2];
float4 l9_83[3];
l9_83[0]=l9_80;
l9_83[1]=l9_81;
l9_83[2]=l9_82;
l9_78=float3(dot(l9_77,l9_83[0]),dot(l9_77,l9_83[1]),dot(l9_77,l9_83[2]));
}
else
{
l9_78=l9_77.xyz;
}
float3 l9_84=l9_78;
float3 l9_85=l9_84;
float l9_86=l9_60.y;
int l9_87=l9_63;
float4 l9_88=l9_57.position;
float3 l9_89=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_90=l9_87;
float4 l9_91=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[0];
float4 l9_92=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[1];
float4 l9_93=(*sc_set0.sc_BonesUBO).sc_Bones[l9_90].boneMatrix[2];
float4 l9_94[3];
l9_94[0]=l9_91;
l9_94[1]=l9_92;
l9_94[2]=l9_93;
l9_89=float3(dot(l9_88,l9_94[0]),dot(l9_88,l9_94[1]),dot(l9_88,l9_94[2]));
}
else
{
l9_89=l9_88.xyz;
}
float3 l9_95=l9_89;
float3 l9_96=l9_95;
float l9_97=l9_60.z;
int l9_98=l9_64;
float4 l9_99=l9_57.position;
float3 l9_100=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_101=l9_98;
float4 l9_102=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[0];
float4 l9_103=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[1];
float4 l9_104=(*sc_set0.sc_BonesUBO).sc_Bones[l9_101].boneMatrix[2];
float4 l9_105[3];
l9_105[0]=l9_102;
l9_105[1]=l9_103;
l9_105[2]=l9_104;
l9_100=float3(dot(l9_99,l9_105[0]),dot(l9_99,l9_105[1]),dot(l9_99,l9_105[2]));
}
else
{
l9_100=l9_99.xyz;
}
float3 l9_106=l9_100;
float3 l9_107=(((l9_74*l9_75)+(l9_85*l9_86))+(l9_96*l9_97))+(l9_106*l9_60.w);
l9_57.position=float4(l9_107.x,l9_107.y,l9_107.z,l9_57.position.w);
int l9_108=l9_61;
float3x3 l9_109=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[2].xyz));
float3x3 l9_110=l9_109;
float3x3 l9_111=l9_110;
int l9_112=l9_62;
float3x3 l9_113=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[2].xyz));
float3x3 l9_114=l9_113;
float3x3 l9_115=l9_114;
int l9_116=l9_63;
float3x3 l9_117=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[2].xyz));
float3x3 l9_118=l9_117;
float3x3 l9_119=l9_118;
int l9_120=l9_64;
float3x3 l9_121=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_120].normalMatrix[2].xyz));
float3x3 l9_122=l9_121;
float3x3 l9_123=l9_122;
l9_57.normal=((((l9_111*l9_57.normal)*l9_60.x)+((l9_115*l9_57.normal)*l9_60.y))+((l9_119*l9_57.normal)*l9_60.z))+((l9_123*l9_57.normal)*l9_60.w);
l9_57.tangent=((((l9_111*l9_57.tangent)*l9_60.x)+((l9_115*l9_57.tangent)*l9_60.y))+((l9_119*l9_57.tangent)*l9_60.z))+((l9_123*l9_57.tangent)*l9_60.w);
}
param_1=l9_57;
if (sc_RenderingSpace_tmp==3)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==4)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
out.varPosAndMotion=float4(param_1.position.xyz.x,param_1.position.xyz.y,param_1.position.xyz.z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param_1.normal.x,param_1.normal.y,param_1.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param_1.tangent.x,param_1.tangent.y,param_1.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
float3 l9_124=((*sc_set0.UserUniforms).sc_ModelMatrix*param_1.position).xyz;
out.varPosAndMotion=float4(l9_124.x,l9_124.y,l9_124.z,out.varPosAndMotion.w);
float3 l9_125=(*sc_set0.UserUniforms).sc_NormalMatrix*param_1.normal;
out.varNormalAndMotion=float4(l9_125.x,l9_125.y,l9_125.z,out.varNormalAndMotion.w);
float3 l9_126=(*sc_set0.UserUniforms).sc_NormalMatrix*param_1.tangent;
out.varTangent=float4(l9_126.x,l9_126.y,l9_126.z,out.varTangent.w);
}
}
}
}
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
param_1.texture0.x=1.0-param_1.texture0.x;
}
out.varColor=in.color;
sc_Vertex_t v=param_1;
float3 WorldPosition=out.varPosAndMotion.xyz;
float3 WorldNormal=out.varNormalAndMotion.xyz;
float3 WorldTangent=out.varTangent.xyz;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPosAndMotion.xyz;
WorldNormal=out.varNormalAndMotion.xyz;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_2=v;
float3 param_3=WorldPosition;
float3 param_4=WorldNormal;
float3 param_5=WorldTangent;
float4 param_6=v.position;
out.varPosAndMotion=float4(param_3.x,param_3.y,param_3.z,out.varPosAndMotion.w);
float3 l9_127=normalize(param_4);
out.varNormalAndMotion=float4(l9_127.x,l9_127.y,l9_127.z,out.varNormalAndMotion.w);
float3 l9_128=normalize(param_5);
out.varTangent=float4(l9_128.x,l9_128.y,l9_128.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_129=param_2.position;
float4 l9_130=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
int l9_131=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_131=0;
}
else
{
l9_131=gl_InstanceIndex%2;
}
int l9_132=l9_131;
l9_130=(*sc_set0.UserUniforms).sc_ProjectionMatrixInverseArray[l9_132]*l9_129;
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_133=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_133=0;
}
else
{
l9_133=gl_InstanceIndex%2;
}
int l9_134=l9_133;
l9_130=(*sc_set0.UserUniforms).sc_ViewMatrixArray[l9_134]*l9_129;
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_135=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_135=0;
}
else
{
l9_135=gl_InstanceIndex%2;
}
int l9_136=l9_135;
l9_130=(*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_136]*l9_129;
}
else
{
l9_130=l9_129;
}
}
}
float4 l9_137=l9_130;
out.varViewSpaceDepth=-l9_137.z;
}
float4 l9_138=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
l9_138=param_6;
}
else
{
if (sc_RenderingSpace_tmp==4)
{
int l9_139=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_139=0;
}
else
{
l9_139=gl_InstanceIndex%2;
}
int l9_140=l9_139;
l9_138=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_140]*param_2.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_141=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_141=0;
}
else
{
l9_141=gl_InstanceIndex%2;
}
int l9_142=l9_141;
l9_138=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_142]*float4(out.varPosAndMotion.xyz,1.0);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_143=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_143=0;
}
else
{
l9_143=gl_InstanceIndex%2;
}
int l9_144=l9_143;
l9_138=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_144]*float4(out.varPosAndMotion.xyz,1.0);
}
}
}
}
out.varTex01=float4(param_2.texture0,param_2.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_145=param_2.position;
float4 l9_146=l9_145;
if (sc_RenderingSpace_tmp==1)
{
l9_146=(*sc_set0.UserUniforms).sc_ModelMatrix*l9_145;
}
float4 l9_147=(*sc_set0.UserUniforms).sc_ProjectorMatrix*l9_146;
float2 l9_148=((l9_147.xy/float2(l9_147.w))*0.5)+float2(0.5);
out.varShadowTex=l9_148;
}
float4 l9_149=l9_138;
if (sc_DepthBufferMode_tmp==1)
{
int l9_150=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_150=0;
}
else
{
l9_150=gl_InstanceIndex%2;
}
int l9_151=l9_150;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_151][2].w!=0.0)
{
float l9_152=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
l9_149.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+l9_149.w))*l9_152)-1.0)*l9_149.w;
}
}
float4 l9_153=l9_149;
l9_138=l9_153;
float4 l9_154=l9_138;
if ((int(sc_TAAEnabled_tmp)!=0))
{
float2 l9_155=l9_154.xy+((*sc_set0.UserUniforms).sc_TAAJitterOffset*l9_154.w);
l9_154=float4(l9_155.x,l9_155.y,l9_154.z,l9_154.w);
}
float4 l9_156=l9_154;
l9_138=l9_156;
float4 l9_157=l9_138;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_157.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_158=l9_157;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_159=dot(l9_158,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_160=l9_159;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_160;
}
}
float4 l9_161=float4(l9_157.x,-l9_157.y,(l9_157.z*0.5)+(l9_157.w*0.5),l9_157.w);
out.gl_Position=l9_161;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_162=param_2;
sc_Vertex_t l9_163=l9_162;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_164=l9_163;
float3 l9_165=in.blendShape0Pos;
float3 l9_166=in.blendShape0Normal;
float l9_167=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_168=l9_164;
float3 l9_169=l9_165;
float l9_170=l9_167;
float3 l9_171=l9_168.position.xyz+(l9_169*l9_170);
l9_168.position=float4(l9_171.x,l9_171.y,l9_171.z,l9_168.position.w);
l9_164=l9_168;
l9_164.normal+=(l9_166*l9_167);
l9_163=l9_164;
sc_Vertex_t l9_172=l9_163;
float3 l9_173=in.blendShape1Pos;
float3 l9_174=in.blendShape1Normal;
float l9_175=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_176=l9_172;
float3 l9_177=l9_173;
float l9_178=l9_175;
float3 l9_179=l9_176.position.xyz+(l9_177*l9_178);
l9_176.position=float4(l9_179.x,l9_179.y,l9_179.z,l9_176.position.w);
l9_172=l9_176;
l9_172.normal+=(l9_174*l9_175);
l9_163=l9_172;
sc_Vertex_t l9_180=l9_163;
float3 l9_181=in.blendShape2Pos;
float3 l9_182=in.blendShape2Normal;
float l9_183=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_184=l9_180;
float3 l9_185=l9_181;
float l9_186=l9_183;
float3 l9_187=l9_184.position.xyz+(l9_185*l9_186);
l9_184.position=float4(l9_187.x,l9_187.y,l9_187.z,l9_184.position.w);
l9_180=l9_184;
l9_180.normal+=(l9_182*l9_183);
l9_163=l9_180;
}
else
{
sc_Vertex_t l9_188=l9_163;
float3 l9_189=in.blendShape0Pos;
float l9_190=(*sc_set0.UserUniforms).weights0.x;
float3 l9_191=l9_188.position.xyz+(l9_189*l9_190);
l9_188.position=float4(l9_191.x,l9_191.y,l9_191.z,l9_188.position.w);
l9_163=l9_188;
sc_Vertex_t l9_192=l9_163;
float3 l9_193=in.blendShape1Pos;
float l9_194=(*sc_set0.UserUniforms).weights0.y;
float3 l9_195=l9_192.position.xyz+(l9_193*l9_194);
l9_192.position=float4(l9_195.x,l9_195.y,l9_195.z,l9_192.position.w);
l9_163=l9_192;
sc_Vertex_t l9_196=l9_163;
float3 l9_197=in.blendShape2Pos;
float l9_198=(*sc_set0.UserUniforms).weights0.z;
float3 l9_199=l9_196.position.xyz+(l9_197*l9_198);
l9_196.position=float4(l9_199.x,l9_199.y,l9_199.z,l9_196.position.w);
l9_163=l9_196;
sc_Vertex_t l9_200=l9_163;
float3 l9_201=in.blendShape3Pos;
float l9_202=(*sc_set0.UserUniforms).weights0.w;
float3 l9_203=l9_200.position.xyz+(l9_201*l9_202);
l9_200.position=float4(l9_203.x,l9_203.y,l9_203.z,l9_200.position.w);
l9_163=l9_200;
sc_Vertex_t l9_204=l9_163;
float3 l9_205=in.blendShape4Pos;
float l9_206=(*sc_set0.UserUniforms).weights1.x;
float3 l9_207=l9_204.position.xyz+(l9_205*l9_206);
l9_204.position=float4(l9_207.x,l9_207.y,l9_207.z,l9_204.position.w);
l9_163=l9_204;
sc_Vertex_t l9_208=l9_163;
float3 l9_209=in.blendShape5Pos;
float l9_210=(*sc_set0.UserUniforms).weights1.y;
float3 l9_211=l9_208.position.xyz+(l9_209*l9_210);
l9_208.position=float4(l9_211.x,l9_211.y,l9_211.z,l9_208.position.w);
l9_163=l9_208;
}
}
l9_162=l9_163;
sc_Vertex_t l9_212=l9_162;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_213=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_213=float4(1.0,fract(in.boneData.yzw));
l9_213.x-=dot(l9_213.yzw,float3(1.0));
}
float4 l9_214=l9_213;
float4 l9_215=l9_214;
int l9_216=int(in.boneData.x);
int l9_217=int(in.boneData.y);
int l9_218=int(in.boneData.z);
int l9_219=int(in.boneData.w);
int l9_220=l9_216;
float4 l9_221=l9_212.position;
float3 l9_222=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_223=l9_220;
float4 l9_224=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[0];
float4 l9_225=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[1];
float4 l9_226=(*sc_set0.sc_BonesUBO).sc_Bones[l9_223].boneMatrix[2];
float4 l9_227[3];
l9_227[0]=l9_224;
l9_227[1]=l9_225;
l9_227[2]=l9_226;
l9_222=float3(dot(l9_221,l9_227[0]),dot(l9_221,l9_227[1]),dot(l9_221,l9_227[2]));
}
else
{
l9_222=l9_221.xyz;
}
float3 l9_228=l9_222;
float3 l9_229=l9_228;
float l9_230=l9_215.x;
int l9_231=l9_217;
float4 l9_232=l9_212.position;
float3 l9_233=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_234=l9_231;
float4 l9_235=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[0];
float4 l9_236=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[1];
float4 l9_237=(*sc_set0.sc_BonesUBO).sc_Bones[l9_234].boneMatrix[2];
float4 l9_238[3];
l9_238[0]=l9_235;
l9_238[1]=l9_236;
l9_238[2]=l9_237;
l9_233=float3(dot(l9_232,l9_238[0]),dot(l9_232,l9_238[1]),dot(l9_232,l9_238[2]));
}
else
{
l9_233=l9_232.xyz;
}
float3 l9_239=l9_233;
float3 l9_240=l9_239;
float l9_241=l9_215.y;
int l9_242=l9_218;
float4 l9_243=l9_212.position;
float3 l9_244=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_245=l9_242;
float4 l9_246=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[0];
float4 l9_247=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[1];
float4 l9_248=(*sc_set0.sc_BonesUBO).sc_Bones[l9_245].boneMatrix[2];
float4 l9_249[3];
l9_249[0]=l9_246;
l9_249[1]=l9_247;
l9_249[2]=l9_248;
l9_244=float3(dot(l9_243,l9_249[0]),dot(l9_243,l9_249[1]),dot(l9_243,l9_249[2]));
}
else
{
l9_244=l9_243.xyz;
}
float3 l9_250=l9_244;
float3 l9_251=l9_250;
float l9_252=l9_215.z;
int l9_253=l9_219;
float4 l9_254=l9_212.position;
float3 l9_255=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_256=l9_253;
float4 l9_257=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[0];
float4 l9_258=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[1];
float4 l9_259=(*sc_set0.sc_BonesUBO).sc_Bones[l9_256].boneMatrix[2];
float4 l9_260[3];
l9_260[0]=l9_257;
l9_260[1]=l9_258;
l9_260[2]=l9_259;
l9_255=float3(dot(l9_254,l9_260[0]),dot(l9_254,l9_260[1]),dot(l9_254,l9_260[2]));
}
else
{
l9_255=l9_254.xyz;
}
float3 l9_261=l9_255;
float3 l9_262=(((l9_229*l9_230)+(l9_240*l9_241))+(l9_251*l9_252))+(l9_261*l9_215.w);
l9_212.position=float4(l9_262.x,l9_262.y,l9_262.z,l9_212.position.w);
int l9_263=l9_216;
float3x3 l9_264=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[2].xyz));
float3x3 l9_265=l9_264;
float3x3 l9_266=l9_265;
int l9_267=l9_217;
float3x3 l9_268=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[2].xyz));
float3x3 l9_269=l9_268;
float3x3 l9_270=l9_269;
int l9_271=l9_218;
float3x3 l9_272=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[2].xyz));
float3x3 l9_273=l9_272;
float3x3 l9_274=l9_273;
int l9_275=l9_219;
float3x3 l9_276=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_275].normalMatrix[2].xyz));
float3x3 l9_277=l9_276;
float3x3 l9_278=l9_277;
l9_212.normal=((((l9_266*l9_212.normal)*l9_215.x)+((l9_270*l9_212.normal)*l9_215.y))+((l9_274*l9_212.normal)*l9_215.z))+((l9_278*l9_212.normal)*l9_215.w);
l9_212.tangent=((((l9_266*l9_212.tangent)*l9_215.x)+((l9_270*l9_212.tangent)*l9_215.y))+((l9_274*l9_212.tangent)*l9_215.z))+((l9_278*l9_212.tangent)*l9_215.w);
}
l9_162=l9_212;
float l9_279=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_280=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_281=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_282=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_283=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_284=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_285=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_286=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_287=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_288=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_289=l9_279/l9_280;
int l9_290=gl_InstanceIndex;
int l9_291=l9_290;
l9_162.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_162.position;
float3 l9_292=l9_162.position.xyz;
float3 l9_293=float3(float(l9_291%int(l9_281))*l9_279,float(l9_291/int(l9_281))*l9_279,(float(l9_291)*l9_289)+l9_286);
float3 l9_294=l9_292+l9_293;
float4 l9_295=float4(l9_294-l9_288,1.0);
float l9_296=l9_282;
float l9_297=l9_283;
float l9_298=l9_284;
float l9_299=l9_285;
float l9_300=l9_286;
float l9_301=l9_287;
float4x4 l9_302=float4x4(float4(2.0/(l9_297-l9_296),0.0,0.0,(-(l9_297+l9_296))/(l9_297-l9_296)),float4(0.0,2.0/(l9_299-l9_298),0.0,(-(l9_299+l9_298))/(l9_299-l9_298)),float4(0.0,0.0,(-2.0)/(l9_301-l9_300),(-(l9_301+l9_300))/(l9_301-l9_300)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_303=l9_302;
float4 l9_304=l9_303*l9_295;
l9_304.w=1.0;
out.varScreenPos=l9_304;
float4 l9_305=l9_304*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_305.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_306=l9_305;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_307=dot(l9_306,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_308=l9_307;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_308;
}
}
float4 l9_309=float4(l9_305.x,-l9_305.y,(l9_305.z*0.5)+(l9_305.w*0.5),l9_305.w);
out.gl_Position=l9_309;
param_2=l9_162;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_310=param_2;
sc_Vertex_t l9_311=l9_310;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_312=l9_311;
float3 l9_313=in.blendShape0Pos;
float3 l9_314=in.blendShape0Normal;
float l9_315=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_316=l9_312;
float3 l9_317=l9_313;
float l9_318=l9_315;
float3 l9_319=l9_316.position.xyz+(l9_317*l9_318);
l9_316.position=float4(l9_319.x,l9_319.y,l9_319.z,l9_316.position.w);
l9_312=l9_316;
l9_312.normal+=(l9_314*l9_315);
l9_311=l9_312;
sc_Vertex_t l9_320=l9_311;
float3 l9_321=in.blendShape1Pos;
float3 l9_322=in.blendShape1Normal;
float l9_323=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_324=l9_320;
float3 l9_325=l9_321;
float l9_326=l9_323;
float3 l9_327=l9_324.position.xyz+(l9_325*l9_326);
l9_324.position=float4(l9_327.x,l9_327.y,l9_327.z,l9_324.position.w);
l9_320=l9_324;
l9_320.normal+=(l9_322*l9_323);
l9_311=l9_320;
sc_Vertex_t l9_328=l9_311;
float3 l9_329=in.blendShape2Pos;
float3 l9_330=in.blendShape2Normal;
float l9_331=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_332=l9_328;
float3 l9_333=l9_329;
float l9_334=l9_331;
float3 l9_335=l9_332.position.xyz+(l9_333*l9_334);
l9_332.position=float4(l9_335.x,l9_335.y,l9_335.z,l9_332.position.w);
l9_328=l9_332;
l9_328.normal+=(l9_330*l9_331);
l9_311=l9_328;
}
else
{
sc_Vertex_t l9_336=l9_311;
float3 l9_337=in.blendShape0Pos;
float l9_338=(*sc_set0.UserUniforms).weights0.x;
float3 l9_339=l9_336.position.xyz+(l9_337*l9_338);
l9_336.position=float4(l9_339.x,l9_339.y,l9_339.z,l9_336.position.w);
l9_311=l9_336;
sc_Vertex_t l9_340=l9_311;
float3 l9_341=in.blendShape1Pos;
float l9_342=(*sc_set0.UserUniforms).weights0.y;
float3 l9_343=l9_340.position.xyz+(l9_341*l9_342);
l9_340.position=float4(l9_343.x,l9_343.y,l9_343.z,l9_340.position.w);
l9_311=l9_340;
sc_Vertex_t l9_344=l9_311;
float3 l9_345=in.blendShape2Pos;
float l9_346=(*sc_set0.UserUniforms).weights0.z;
float3 l9_347=l9_344.position.xyz+(l9_345*l9_346);
l9_344.position=float4(l9_347.x,l9_347.y,l9_347.z,l9_344.position.w);
l9_311=l9_344;
sc_Vertex_t l9_348=l9_311;
float3 l9_349=in.blendShape3Pos;
float l9_350=(*sc_set0.UserUniforms).weights0.w;
float3 l9_351=l9_348.position.xyz+(l9_349*l9_350);
l9_348.position=float4(l9_351.x,l9_351.y,l9_351.z,l9_348.position.w);
l9_311=l9_348;
sc_Vertex_t l9_352=l9_311;
float3 l9_353=in.blendShape4Pos;
float l9_354=(*sc_set0.UserUniforms).weights1.x;
float3 l9_355=l9_352.position.xyz+(l9_353*l9_354);
l9_352.position=float4(l9_355.x,l9_355.y,l9_355.z,l9_352.position.w);
l9_311=l9_352;
sc_Vertex_t l9_356=l9_311;
float3 l9_357=in.blendShape5Pos;
float l9_358=(*sc_set0.UserUniforms).weights1.y;
float3 l9_359=l9_356.position.xyz+(l9_357*l9_358);
l9_356.position=float4(l9_359.x,l9_359.y,l9_359.z,l9_356.position.w);
l9_311=l9_356;
}
}
l9_310=l9_311;
sc_Vertex_t l9_360=l9_310;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_361=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_361=float4(1.0,fract(in.boneData.yzw));
l9_361.x-=dot(l9_361.yzw,float3(1.0));
}
float4 l9_362=l9_361;
float4 l9_363=l9_362;
int l9_364=int(in.boneData.x);
int l9_365=int(in.boneData.y);
int l9_366=int(in.boneData.z);
int l9_367=int(in.boneData.w);
int l9_368=l9_364;
float4 l9_369=l9_360.position;
float3 l9_370=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_371=l9_368;
float4 l9_372=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[0];
float4 l9_373=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[1];
float4 l9_374=(*sc_set0.sc_BonesUBO).sc_Bones[l9_371].boneMatrix[2];
float4 l9_375[3];
l9_375[0]=l9_372;
l9_375[1]=l9_373;
l9_375[2]=l9_374;
l9_370=float3(dot(l9_369,l9_375[0]),dot(l9_369,l9_375[1]),dot(l9_369,l9_375[2]));
}
else
{
l9_370=l9_369.xyz;
}
float3 l9_376=l9_370;
float3 l9_377=l9_376;
float l9_378=l9_363.x;
int l9_379=l9_365;
float4 l9_380=l9_360.position;
float3 l9_381=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_382=l9_379;
float4 l9_383=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[0];
float4 l9_384=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[1];
float4 l9_385=(*sc_set0.sc_BonesUBO).sc_Bones[l9_382].boneMatrix[2];
float4 l9_386[3];
l9_386[0]=l9_383;
l9_386[1]=l9_384;
l9_386[2]=l9_385;
l9_381=float3(dot(l9_380,l9_386[0]),dot(l9_380,l9_386[1]),dot(l9_380,l9_386[2]));
}
else
{
l9_381=l9_380.xyz;
}
float3 l9_387=l9_381;
float3 l9_388=l9_387;
float l9_389=l9_363.y;
int l9_390=l9_366;
float4 l9_391=l9_360.position;
float3 l9_392=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_393=l9_390;
float4 l9_394=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[0];
float4 l9_395=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[1];
float4 l9_396=(*sc_set0.sc_BonesUBO).sc_Bones[l9_393].boneMatrix[2];
float4 l9_397[3];
l9_397[0]=l9_394;
l9_397[1]=l9_395;
l9_397[2]=l9_396;
l9_392=float3(dot(l9_391,l9_397[0]),dot(l9_391,l9_397[1]),dot(l9_391,l9_397[2]));
}
else
{
l9_392=l9_391.xyz;
}
float3 l9_398=l9_392;
float3 l9_399=l9_398;
float l9_400=l9_363.z;
int l9_401=l9_367;
float4 l9_402=l9_360.position;
float3 l9_403=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_404=l9_401;
float4 l9_405=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[0];
float4 l9_406=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[1];
float4 l9_407=(*sc_set0.sc_BonesUBO).sc_Bones[l9_404].boneMatrix[2];
float4 l9_408[3];
l9_408[0]=l9_405;
l9_408[1]=l9_406;
l9_408[2]=l9_407;
l9_403=float3(dot(l9_402,l9_408[0]),dot(l9_402,l9_408[1]),dot(l9_402,l9_408[2]));
}
else
{
l9_403=l9_402.xyz;
}
float3 l9_409=l9_403;
float3 l9_410=(((l9_377*l9_378)+(l9_388*l9_389))+(l9_399*l9_400))+(l9_409*l9_363.w);
l9_360.position=float4(l9_410.x,l9_410.y,l9_410.z,l9_360.position.w);
int l9_411=l9_364;
float3x3 l9_412=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[2].xyz));
float3x3 l9_413=l9_412;
float3x3 l9_414=l9_413;
int l9_415=l9_365;
float3x3 l9_416=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[2].xyz));
float3x3 l9_417=l9_416;
float3x3 l9_418=l9_417;
int l9_419=l9_366;
float3x3 l9_420=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[2].xyz));
float3x3 l9_421=l9_420;
float3x3 l9_422=l9_421;
int l9_423=l9_367;
float3x3 l9_424=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_423].normalMatrix[2].xyz));
float3x3 l9_425=l9_424;
float3x3 l9_426=l9_425;
l9_360.normal=((((l9_414*l9_360.normal)*l9_363.x)+((l9_418*l9_360.normal)*l9_363.y))+((l9_422*l9_360.normal)*l9_363.z))+((l9_426*l9_360.normal)*l9_363.w);
l9_360.tangent=((((l9_414*l9_360.tangent)*l9_363.x)+((l9_418*l9_360.tangent)*l9_363.y))+((l9_422*l9_360.tangent)*l9_363.z))+((l9_426*l9_360.tangent)*l9_363.w);
}
l9_310=l9_360;
float3 l9_427=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_428=((l9_310.position.xy/float2(l9_310.position.w))*0.5)+float2(0.5);
out.varTex01=float4(l9_428.x,l9_428.y,out.varTex01.z,out.varTex01.w);
l9_310.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_310.position;
float3 l9_429=l9_310.position.xyz-l9_427;
l9_310.position=float4(l9_429.x,l9_429.y,l9_429.z,l9_310.position.w);
out.varPosAndMotion=float4(l9_310.position.xyz.x,l9_310.position.xyz.y,l9_310.position.xyz.z,out.varPosAndMotion.w);
float3 l9_430=normalize(l9_310.normal);
out.varNormalAndMotion=float4(l9_430.x,l9_430.y,l9_430.z,out.varNormalAndMotion.w);
float l9_431=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_432=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_433=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_434=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_435=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_436=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_437=l9_431;
float l9_438=l9_432;
float l9_439=l9_433;
float l9_440=l9_434;
float l9_441=l9_435;
float l9_442=l9_436;
float4x4 l9_443=float4x4(float4(2.0/(l9_438-l9_437),0.0,0.0,(-(l9_438+l9_437))/(l9_438-l9_437)),float4(0.0,2.0/(l9_440-l9_439),0.0,(-(l9_440+l9_439))/(l9_440-l9_439)),float4(0.0,0.0,(-2.0)/(l9_442-l9_441),(-(l9_442+l9_441))/(l9_442-l9_441)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_444=l9_443;
float4 l9_445=float4(0.0);
float3 l9_446=(l9_444*l9_310.position).xyz;
l9_445=float4(l9_446.x,l9_446.y,l9_446.z,l9_445.w);
l9_445.w=1.0;
out.varScreenPos=l9_445;
float4 l9_447=l9_445*1.0;
float4 l9_448=l9_447;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_448.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_449=l9_448;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_450=dot(l9_449,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_451=l9_450;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_451;
}
}
float4 l9_452=float4(l9_448.x,-l9_448.y,(l9_448.z*0.5)+(l9_448.w*0.5),l9_448.w);
out.gl_Position=l9_452;
param_2=l9_310;
}
}
v=param_2;
float3 param_7=out.varPosAndMotion.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float4 l9_453=((*sc_set0.UserUniforms).sc_PrevFrameModelMatrix*(*sc_set0.UserUniforms).sc_ModelMatrixInverse)*float4(param_7,1.0);
float3 l9_454=param_7;
float3 l9_455=l9_453.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
int l9_456=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_456=0;
}
else
{
l9_456=gl_InstanceIndex%2;
}
int l9_457=l9_456;
float4 l9_458=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_457]*float4(l9_454,1.0);
float2 l9_459=l9_458.xy/float2(l9_458.w);
l9_458=float4(l9_459.x,l9_459.y,l9_458.z,l9_458.w);
int l9_460=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_460=0;
}
else
{
l9_460=gl_InstanceIndex%2;
}
int l9_461=l9_460;
float4 l9_462=(*sc_set0.UserUniforms).sc_PrevFrameViewProjectionMatrixArray[l9_461]*float4(l9_455,1.0);
float2 l9_463=l9_462.xy/float2(l9_462.w);
l9_462=float4(l9_463.x,l9_463.y,l9_462.z,l9_462.w);
float2 l9_464=(l9_458.xy-l9_462.xy)*0.5;
out.varPosAndMotion.w=l9_464.x;
out.varNormalAndMotion.w=l9_464.y;
}
}
if (PreviewInfo.Saved)
{
out.PreviewVertexColor=float4(PreviewInfo.Color.xyz,1.0);
out.PreviewVertexSaved=1.0;
}
return out;
}
} // VERTEX SHADER


namespace SNAP_FS {
struct sc_RayTracingHitPayload
{
float3 viewDirWS;
float3 positionWS;
float3 normalWS;
float4 tangentWS;
float4 color;
float2 uv0;
float2 uv1;
float2 uv2;
float2 uv3;
uint2 id;
};
struct SurfaceProperties
{
float3 albedo;
float opacity;
float3 normal;
float3 positionWS;
float3 viewDirWS;
float metallic;
float roughness;
float3 emissive;
float3 ao;
float3 specularAo;
float3 bakedShadows;
float3 specColor;
};
struct LightingComponents
{
float3 directDiffuse;
float3 directSpecular;
float3 indirectDiffuse;
float3 indirectSpecular;
float3 emitted;
float3 transmitted;
};
struct LightProperties
{
float3 direction;
float3 color;
float attenuation;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float3 BumpedNormal;
float3 ViewDirWS;
float3 PositionWS;
float3 SurfacePosition_WorldSpace;
float3 VertexNormal_WorldSpace;
float3 VertexTangent_WorldSpace;
float3 VertexBinormal_WorldSpace;
float2 Surface_UVCoord0;
float2 Surface_UVCoord1;
float2 gScreenCoord;
float4 VertexColor;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
int sc_RayTracingReceiverEffectsMask;
float4 sc_RayTracingReflectionsSize;
float4 sc_RayTracingReflectionsDims;
float4 sc_RayTracingReflectionsView;
float4 sc_RayTracingGlobalIlluminationSize;
float4 sc_RayTracingGlobalIlluminationDims;
float4 sc_RayTracingGlobalIlluminationView;
float4 sc_RayTracingShadowsSize;
float4 sc_RayTracingShadowsDims;
float4 sc_RayTracingShadowsView;
float3 sc_RayTracingOriginScale;
uint sc_RayTracingReceiverMask;
float3 sc_RayTracingOriginScaleInv;
float3 sc_RayTracingOriginOffset;
uint sc_RayTracingReceiverId;
uint4 sc_RayTracingCasterConfiguration;
uint4 sc_RayTracingCasterOffsetPNTC;
uint4 sc_RayTracingCasterOffsetTexture;
uint4 sc_RayTracingCasterFormatPNTC;
uint4 sc_RayTracingCasterFormatTexture;
float4 sc_RayTracingRayDirectionSize;
float4 sc_RayTracingRayDirectionDims;
float4 sc_RayTracingRayDirectionView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float3 emissiveFactor;
float4 emissiveTextureSize;
float4 emissiveTextureDims;
float4 emissiveTextureView;
float3x3 emissiveTextureTransform;
float4 emissiveTextureUvMinMax;
float4 emissiveTextureBorderColor;
float normalTextureScale;
float4 normalTextureSize;
float4 normalTextureDims;
float4 normalTextureView;
float3x3 normalTextureTransform;
float4 normalTextureUvMinMax;
float4 normalTextureBorderColor;
float metallicFactor;
float roughnessFactor;
float occlusionTextureStrength;
float4 metallicRoughnessTextureSize;
float4 metallicRoughnessTextureDims;
float4 metallicRoughnessTextureView;
float3x3 metallicRoughnessTextureTransform;
float4 metallicRoughnessTextureUvMinMax;
float4 metallicRoughnessTextureBorderColor;
float transmissionFactor;
float4 transmissionTextureSize;
float4 transmissionTextureDims;
float4 transmissionTextureView;
float3x3 transmissionTextureTransform;
float4 transmissionTextureUvMinMax;
float4 transmissionTextureBorderColor;
float4 screenTextureSize;
float4 screenTextureDims;
float4 screenTextureView;
float3x3 screenTextureTransform;
float4 screenTextureUvMinMax;
float4 screenTextureBorderColor;
float3 sheenColorFactor;
float4 sheenColorTextureSize;
float4 sheenColorTextureDims;
float4 sheenColorTextureView;
float3x3 sheenColorTextureTransform;
float4 sheenColorTextureUvMinMax;
float4 sheenColorTextureBorderColor;
float sheenRoughnessFactor;
float4 sheenRoughnessTextureSize;
float4 sheenRoughnessTextureDims;
float4 sheenRoughnessTextureView;
float3x3 sheenRoughnessTextureTransform;
float4 sheenRoughnessTextureUvMinMax;
float4 sheenRoughnessTextureBorderColor;
float clearcoatFactor;
float4 clearcoatTextureSize;
float4 clearcoatTextureDims;
float4 clearcoatTextureView;
float3x3 clearcoatTextureTransform;
float4 clearcoatTextureUvMinMax;
float4 clearcoatTextureBorderColor;
float clearcoatRoughnessFactor;
float4 clearcoatRoughnessTextureSize;
float4 clearcoatRoughnessTextureDims;
float4 clearcoatRoughnessTextureView;
float3x3 clearcoatRoughnessTextureTransform;
float4 clearcoatRoughnessTextureUvMinMax;
float4 clearcoatRoughnessTextureBorderColor;
float4 clearcoatNormalTextureSize;
float4 clearcoatNormalTextureDims;
float4 clearcoatNormalTextureView;
float3x3 clearcoatNormalTextureTransform;
float4 clearcoatNormalTextureUvMinMax;
float4 clearcoatNormalTextureBorderColor;
float4 baseColorTextureSize;
float4 baseColorTextureDims;
float4 baseColorTextureView;
float3x3 baseColorTextureTransform;
float4 baseColorTextureUvMinMax;
float4 baseColorTextureBorderColor;
float4 baseColorFactor;
float2 baseColorTexture_offset;
float2 baseColorTexture_scale;
float baseColorTexture_rotation;
float2 emissiveTexture_offset;
float2 emissiveTexture_scale;
float emissiveTexture_rotation;
float2 normalTexture_offset;
float2 normalTexture_scale;
float normalTexture_rotation;
float2 metallicRoughnessTexture_offset;
float2 metallicRoughnessTexture_scale;
float metallicRoughnessTexture_rotation;
float2 transmissionTexture_offset;
float2 transmissionTexture_scale;
float transmissionTexture_rotation;
float2 sheenColorTexture_offset;
float2 sheenColorTexture_scale;
float sheenColorTexture_rotation;
float2 sheenRoughnessTexture_offset;
float2 sheenRoughnessTexture_scale;
float sheenRoughnessTexture_rotation;
float2 clearcoatTexture_offset;
float2 clearcoatTexture_scale;
float clearcoatTexture_rotation;
float2 clearcoatNormalTexture_offset;
float2 clearcoatNormalTexture_scale;
float clearcoatNormalTexture_rotation;
float2 clearcoatRoughnessTexture_offset;
float2 clearcoatRoughnessTexture_scale;
float clearcoatRoughnessTexture_rotation;
float colorMultiplier;
float Port_DebugSheenEnvLightMult_N003;
float Port_DebugSheenPunctualLightMult_N003;
float Port_Input2_N043;
float Port_Input2_N062;
float3 Port_SpecularAO_N036;
float3 Port_Albedo_N405;
float Port_Opacity_N405;
float3 Port_Emissive_N405;
float Port_Metallic_N405;
float3 Port_SpecularAO_N405;
float depthRef;
};
struct sc_RayTracingCasterVertexBuffer_obj
{
float sc_RayTracingCasterVertices[1];
};
struct sc_RayTracingCasterNonAnimatedVertexBuffer_obj
{
float sc_RayTracingCasterNonAnimatedVertices[1];
};
struct sc_RayTracingCasterIndexBuffer_obj
{
uint sc_RayTracingCasterTriangles[1];
};
struct sc_PointLight_t_1
{
bool falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct sc_Set0
{
const device sc_RayTracingCasterIndexBuffer_obj* sc_RayTracingCasterIndexBuffer [[id(0)]];
const device sc_RayTracingCasterVertexBuffer_obj* sc_RayTracingCasterVertexBuffer [[id(1)]];
const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj* sc_RayTracingCasterNonAnimatedVertexBuffer [[id(2)]];
constant sc_Bones_obj* sc_BonesUBO [[id(3)]];
texture2d<float> baseColorTexture [[id(4)]];
texture2d<float> clearcoatNormalTexture [[id(5)]];
texture2d<float> clearcoatRoughnessTexture [[id(6)]];
texture2d<float> clearcoatTexture [[id(7)]];
texture2d<float> emissiveTexture [[id(8)]];
texture2d<float> intensityTexture [[id(9)]];
texture2d<float> metallicRoughnessTexture [[id(10)]];
texture2d<float> normalTexture [[id(11)]];
texture2d<float> sc_EnvmapDiffuse [[id(12)]];
texture2d<float> sc_EnvmapSpecular [[id(13)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(22)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(23)]];
texture2d<float> sc_RayTracingRayDirection [[id(24)]];
texture2d<float> sc_RayTracingReflections [[id(25)]];
texture2d<float> sc_RayTracingShadows [[id(26)]];
texture2d<float> sc_SSAOTexture [[id(27)]];
texture2d<float> sc_ScreenTexture [[id(28)]];
texture2d<float> sc_ShadowTexture [[id(29)]];
texture2d<float> screenTexture [[id(31)]];
texture2d<float> sheenColorTexture [[id(32)]];
texture2d<float> sheenRoughnessTexture [[id(33)]];
texture2d<float> transmissionTexture [[id(34)]];
sampler baseColorTextureSmpSC [[id(35)]];
sampler clearcoatNormalTextureSmpSC [[id(36)]];
sampler clearcoatRoughnessTextureSmpSC [[id(37)]];
sampler clearcoatTextureSmpSC [[id(38)]];
sampler emissiveTextureSmpSC [[id(39)]];
sampler intensityTextureSmpSC [[id(40)]];
sampler metallicRoughnessTextureSmpSC [[id(41)]];
sampler normalTextureSmpSC [[id(42)]];
sampler sc_EnvmapDiffuseSmpSC [[id(43)]];
sampler sc_EnvmapSpecularSmpSC [[id(44)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(46)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(47)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(48)]];
sampler sc_RayTracingReflectionsSmpSC [[id(49)]];
sampler sc_RayTracingShadowsSmpSC [[id(50)]];
sampler sc_SSAOTextureSmpSC [[id(51)]];
sampler sc_ScreenTextureSmpSC [[id(52)]];
sampler sc_ShadowTextureSmpSC [[id(53)]];
sampler screenTextureSmpSC [[id(55)]];
sampler sheenColorTextureSmpSC [[id(56)]];
sampler sheenRoughnessTextureSmpSC [[id(57)]];
sampler transmissionTextureSmpSC [[id(58)]];
constant userUniformsObj* UserUniforms [[id(59)]];
};
struct main_frag_out
{
float4 sc_FragData0 [[color(0)]];
};
struct main_frag_in
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
// Implementation of the GLSL radians() function
template<typename T>
T radians(T d)
{
return d*T(0.01745329251);
}
sc_RayTracingHitPayload sc_RayTracingEvaluateHitPayload(thread const int2& screenPos,constant userUniformsObj& UserUniforms,const device sc_RayTracingCasterVertexBuffer_obj& sc_RayTracingCasterVertexBuffer,const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj& sc_RayTracingCasterNonAnimatedVertexBuffer,const device sc_RayTracingCasterIndexBuffer_obj& sc_RayTracingCasterIndexBuffer,thread texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric,thread sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC,thread texture2d<float> sc_RayTracingRayDirection,thread sampler sc_RayTracingRayDirectionSmpSC)
{
uint4 idAndBarycentric=sc_RayTracingHitCasterIdAndBarycentric.read(uint2(screenPos),0);
sc_RayTracingHitPayload rhp;
rhp.id=idAndBarycentric.xy;
if (rhp.id.x!=(UserUniforms.sc_RayTracingCasterConfiguration.y&65535u))
{
return rhp;
}
float2 brcVW=float2(as_type<half2>(idAndBarycentric.z|(idAndBarycentric.w<<uint(16))));
float3 brc=float3((1.0-brcVW.x)-brcVW.y,brcVW);
float2 param=sc_RayTracingRayDirection.read(uint2(screenPos),0).xy;
float3 l9_0=float3(param.x,param.y,(1.0-abs(param.x))-abs(param.y));
float l9_1=fast::clamp(-l9_0.z,0.0,1.0);
float l9_2;
if (l9_0.x>=0.0)
{
l9_2=-l9_1;
}
else
{
l9_2=l9_1;
}
float l9_3=l9_2;
float l9_4;
if (l9_0.y>=0.0)
{
l9_4=-l9_1;
}
else
{
l9_4=l9_1;
}
float2 l9_5=l9_0.xy+float2(l9_3,l9_4);
l9_0=float3(l9_5.x,l9_5.y,l9_0.z);
float3 l9_6=normalize(l9_0);
float3 rayDir=l9_6;
rhp.viewDirWS=-rayDir;
uint param_1=rhp.id.y;
uint l9_7=min(param_1,UserUniforms.sc_RayTracingCasterConfiguration.z);
uint l9_8=l9_7*6u;
uint l9_9=l9_8&4294967292u;
uint4 l9_10=(uint4(uint2(sc_RayTracingCasterIndexBuffer.sc_RayTracingCasterTriangles[l9_9/4u]),uint2(sc_RayTracingCasterIndexBuffer.sc_RayTracingCasterTriangles[(l9_9/4u)+1u]))&uint4(65535u,4294967295u,65535u,4294967295u))>>uint4(0u,16u,0u,16u);
uint3 l9_11;
if (l9_8==l9_9)
{
l9_11=l9_10.xyz;
}
else
{
l9_11=l9_10.yzw;
}
uint3 l9_12=l9_11;
uint3 i=l9_12;
if (UserUniforms.sc_RayTracingCasterConfiguration.x==2u)
{
float3 param_2=brc;
uint3 param_3=i;
uint param_4=0u;
uint3 l9_13=uint3((param_3*uint3(6u))+uint3(param_4));
uint l9_14=l9_13.x;
float3 l9_15=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_14+2u]);
uint l9_16=l9_13.y;
float3 l9_17=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_16+2u]);
uint l9_18=l9_13.z;
float3 l9_19=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_18+2u]);
float3 l9_20=((l9_15*param_2.x)+(l9_17*param_2.y))+(l9_19*param_2.z);
rhp.positionWS=l9_20;
}
else
{
float3 param_5=brc;
uint3 param_6=i;
uint3 l9_21=uint3((param_6.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x,(param_6.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x,(param_6.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.x);
float3 l9_22=float3(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.x==5u)
{
uint l9_23=l9_21.x;
float3 l9_24=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_23+2u]);
uint l9_25=l9_21.y;
float3 l9_26=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_25+2u]);
uint l9_27=l9_21.z;
float3 l9_28=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_27+2u]);
l9_22=((l9_24*param_5.x)+(l9_26*param_5.y))+(l9_28*param_5.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.x==6u)
{
uint l9_29=l9_21.x;
float3 l9_30=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_29]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_29+1u]))).x);
uint l9_31=l9_21.y;
float3 l9_32=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_31]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_31+1u]))).x);
uint l9_33=l9_21.z;
float3 l9_34=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_33]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_33+1u]))).x);
l9_22=((l9_30*param_5.x)+(l9_32*param_5.y))+(l9_34*param_5.z);
}
else
{
l9_22=float3(1.0,0.0,0.0);
}
}
float3 l9_35=l9_22;
float3 positionOS=l9_35;
rhp.positionWS=(UserUniforms.sc_ModelMatrix*float4(positionOS,1.0)).xyz;
}
if (UserUniforms.sc_RayTracingCasterOffsetPNTC.y>0u)
{
if (UserUniforms.sc_RayTracingCasterConfiguration.x==2u)
{
float3 param_7=brc;
uint3 param_8=i;
uint param_9=3u;
uint3 l9_36=uint3((param_8*uint3(6u))+uint3(param_9));
uint l9_37=l9_36.x;
float3 l9_38=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_37+2u]);
uint l9_39=l9_36.y;
float3 l9_40=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_39+2u]);
uint l9_41=l9_36.z;
float3 l9_42=float3(sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41+1u],sc_RayTracingCasterNonAnimatedVertexBuffer.sc_RayTracingCasterNonAnimatedVertices[l9_41+2u]);
float3 l9_43=((l9_38*param_7.x)+(l9_40*param_7.y))+(l9_42*param_7.z);
rhp.normalWS=l9_43;
}
else
{
float3 param_10=brc;
uint3 param_11=i;
uint3 l9_44=uint3((param_11.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y,(param_11.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y,(param_11.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.y);
float3 l9_45=float3(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.y==5u)
{
uint l9_46=l9_44.x;
float3 l9_47=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_46+2u]);
uint l9_48=l9_44.y;
float3 l9_49=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_48+2u]);
uint l9_50=l9_44.z;
float3 l9_51=float3(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_50+2u]);
l9_45=((l9_47*param_10.x)+(l9_49*param_10.y))+(l9_51*param_10.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.y==6u)
{
uint l9_52=l9_44.x;
float3 l9_53=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_52]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_52+1u]))).x);
uint l9_54=l9_44.y;
float3 l9_55=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_54]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_54+1u]))).x);
uint l9_56=l9_44.z;
float3 l9_57=float3(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_56]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_56+1u]))).x);
l9_45=((l9_53*param_10.x)+(l9_55*param_10.y))+(l9_57*param_10.z);
}
else
{
l9_45=float3(1.0,0.0,0.0);
}
}
float3 l9_58=l9_45;
float3 normalOS=l9_58;
rhp.normalWS=normalize(UserUniforms.sc_NormalMatrix*normalOS);
}
}
else
{
rhp.normalWS=float3(1.0,0.0,0.0);
}
bool l9_59=!(UserUniforms.sc_RayTracingCasterConfiguration.x==2u);
bool l9_60;
if (l9_59)
{
l9_60=UserUniforms.sc_RayTracingCasterOffsetPNTC.z>0u;
}
else
{
l9_60=l9_59;
}
if (l9_60)
{
float3 param_12=brc;
uint3 param_13=i;
uint3 l9_61=uint3((param_13.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z,(param_13.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z,(param_13.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.z);
float4 l9_62=float4(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==5u)
{
uint l9_63=l9_61.x;
float4 l9_64=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_63+3u]);
uint l9_65=l9_61.y;
float4 l9_66=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_65+3u]);
uint l9_67=l9_61.z;
float4 l9_68=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_67+3u]);
l9_62=((l9_64*param_12.x)+(l9_66*param_12.y))+(l9_68*param_12.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==6u)
{
uint l9_69=l9_61.x;
float4 l9_70=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_69]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_69+1u]))));
uint l9_71=l9_61.y;
float4 l9_72=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_71]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_71+1u]))));
uint l9_73=l9_61.z;
float4 l9_74=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_73]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_73+1u]))));
l9_62=((l9_70*param_12.x)+(l9_72*param_12.y))+(l9_74*param_12.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.z==2u)
{
uint l9_75=l9_61.x;
uint l9_76=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_75]);
uint l9_77=l9_76&255u;
uint l9_78=(l9_76>>uint(8))&255u;
uint l9_79=(l9_76>>uint(16))&255u;
uint l9_80=(l9_76>>uint(24))&255u;
float4 l9_81=float4(float(l9_77),float(l9_78),float(l9_79),float(l9_80))/float4(255.0);
uint l9_82=l9_61.y;
uint l9_83=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_82]);
uint l9_84=l9_83&255u;
uint l9_85=(l9_83>>uint(8))&255u;
uint l9_86=(l9_83>>uint(16))&255u;
uint l9_87=(l9_83>>uint(24))&255u;
float4 l9_88=float4(float(l9_84),float(l9_85),float(l9_86),float(l9_87))/float4(255.0);
uint l9_89=l9_61.z;
uint l9_90=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_89]);
uint l9_91=l9_90&255u;
uint l9_92=(l9_90>>uint(8))&255u;
uint l9_93=(l9_90>>uint(16))&255u;
uint l9_94=(l9_90>>uint(24))&255u;
float4 l9_95=float4(float(l9_91),float(l9_92),float(l9_93),float(l9_94))/float4(255.0);
l9_62=((l9_81*param_12.x)+(l9_88*param_12.y))+(l9_95*param_12.z);
}
else
{
l9_62=float4(1.0,0.0,0.0,0.0);
}
}
}
float4 l9_96=l9_62;
float4 tangentOS=l9_96;
float3 tangentWS=normalize(UserUniforms.sc_NormalMatrix*tangentOS.xyz);
rhp.tangentWS=float4(tangentWS,tangentOS.w);
}
else
{
rhp.tangentWS=float4(1.0,0.0,0.0,1.0);
}
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w>0u)
{
float3 param_14=brc;
uint3 param_15=i;
uint3 l9_97=uint3((param_15.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w,(param_15.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w,(param_15.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetPNTC.w);
float4 l9_98=float4(0.0);
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==5u)
{
uint l9_99=l9_97.x;
float4 l9_100=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_99+3u]);
uint l9_101=l9_97.y;
float4 l9_102=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_101+3u]);
uint l9_103=l9_97.z;
float4 l9_104=float4(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+1u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+2u],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_103+3u]);
l9_98=((l9_100*param_14.x)+(l9_102*param_14.y))+(l9_104*param_14.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==6u)
{
uint l9_105=l9_97.x;
float4 l9_106=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_105]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_105+1u]))));
uint l9_107=l9_97.y;
float4 l9_108=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_107]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_107+1u]))));
uint l9_109=l9_97.z;
float4 l9_110=float4(float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_109]))),float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_109+1u]))));
l9_98=((l9_106*param_14.x)+(l9_108*param_14.y))+(l9_110*param_14.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatPNTC.w==2u)
{
uint l9_111=l9_97.x;
uint l9_112=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_111]);
uint l9_113=l9_112&255u;
uint l9_114=(l9_112>>uint(8))&255u;
uint l9_115=(l9_112>>uint(16))&255u;
uint l9_116=(l9_112>>uint(24))&255u;
float4 l9_117=float4(float(l9_113),float(l9_114),float(l9_115),float(l9_116))/float4(255.0);
uint l9_118=l9_97.y;
uint l9_119=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_118]);
uint l9_120=l9_119&255u;
uint l9_121=(l9_119>>uint(8))&255u;
uint l9_122=(l9_119>>uint(16))&255u;
uint l9_123=(l9_119>>uint(24))&255u;
float4 l9_124=float4(float(l9_120),float(l9_121),float(l9_122),float(l9_123))/float4(255.0);
uint l9_125=l9_97.z;
uint l9_126=as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_125]);
uint l9_127=l9_126&255u;
uint l9_128=(l9_126>>uint(8))&255u;
uint l9_129=(l9_126>>uint(16))&255u;
uint l9_130=(l9_126>>uint(24))&255u;
float4 l9_131=float4(float(l9_127),float(l9_128),float(l9_129),float(l9_130))/float4(255.0);
l9_98=((l9_117*param_14.x)+(l9_124*param_14.y))+(l9_131*param_14.z);
}
else
{
l9_98=float4(1.0,0.0,0.0,0.0);
}
}
}
float4 l9_132=l9_98;
rhp.color=l9_132;
}
float2 dummyRedBlack=float2(dot(brc,float3(uint3(1u)-(i%uint3(2u)))),0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.x>0u)
{
float3 param_16=brc;
uint3 param_17=i;
uint3 l9_133=uint3((param_17.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x,(param_17.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x,(param_17.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.x);
float2 l9_134=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.x==5u)
{
uint l9_135=l9_133.x;
float2 l9_136=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_135],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_135+1u]);
uint l9_137=l9_133.y;
float2 l9_138=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_137],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_137+1u]);
uint l9_139=l9_133.z;
float2 l9_140=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_139],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_139+1u]);
l9_134=((l9_136*param_16.x)+(l9_138*param_16.y))+(l9_140*param_16.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.x==6u)
{
uint l9_141=l9_133.x;
float2 l9_142=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_141])));
uint l9_143=l9_133.y;
float2 l9_144=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_143])));
uint l9_145=l9_133.z;
float2 l9_146=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_145])));
l9_134=((l9_142*param_16.x)+(l9_144*param_16.y))+(l9_146*param_16.z);
}
else
{
l9_134=float2(1.0,0.0);
}
}
float2 l9_147=l9_134;
rhp.uv0=l9_147;
}
else
{
rhp.uv0=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.y>0u)
{
float3 param_18=brc;
uint3 param_19=i;
uint3 l9_148=uint3((param_19.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y,(param_19.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y,(param_19.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.y);
float2 l9_149=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.y==5u)
{
uint l9_150=l9_148.x;
float2 l9_151=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_150],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_150+1u]);
uint l9_152=l9_148.y;
float2 l9_153=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_152],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_152+1u]);
uint l9_154=l9_148.z;
float2 l9_155=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_154],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_154+1u]);
l9_149=((l9_151*param_18.x)+(l9_153*param_18.y))+(l9_155*param_18.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.y==6u)
{
uint l9_156=l9_148.x;
float2 l9_157=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_156])));
uint l9_158=l9_148.y;
float2 l9_159=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_158])));
uint l9_160=l9_148.z;
float2 l9_161=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_160])));
l9_149=((l9_157*param_18.x)+(l9_159*param_18.y))+(l9_161*param_18.z);
}
else
{
l9_149=float2(1.0,0.0);
}
}
float2 l9_162=l9_149;
rhp.uv1=l9_162;
}
else
{
rhp.uv1=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.z>0u)
{
float3 param_20=brc;
uint3 param_21=i;
uint3 l9_163=uint3((param_21.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z,(param_21.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z,(param_21.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.z);
float2 l9_164=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.z==5u)
{
uint l9_165=l9_163.x;
float2 l9_166=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_165],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_165+1u]);
uint l9_167=l9_163.y;
float2 l9_168=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_167],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_167+1u]);
uint l9_169=l9_163.z;
float2 l9_170=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_169],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_169+1u]);
l9_164=((l9_166*param_20.x)+(l9_168*param_20.y))+(l9_170*param_20.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.z==6u)
{
uint l9_171=l9_163.x;
float2 l9_172=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_171])));
uint l9_173=l9_163.y;
float2 l9_174=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_173])));
uint l9_175=l9_163.z;
float2 l9_176=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_175])));
l9_164=((l9_172*param_20.x)+(l9_174*param_20.y))+(l9_176*param_20.z);
}
else
{
l9_164=float2(1.0,0.0);
}
}
float2 l9_177=l9_164;
rhp.uv2=l9_177;
}
else
{
rhp.uv2=dummyRedBlack;
}
if (UserUniforms.sc_RayTracingCasterFormatTexture.w>0u)
{
float3 param_22=brc;
uint3 param_23=i;
uint3 l9_178=uint3((param_23.x*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w,(param_23.y*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w,(param_23.z*(UserUniforms.sc_RayTracingCasterConfiguration.y>>16u))+UserUniforms.sc_RayTracingCasterOffsetTexture.w);
float2 l9_179=float2(0.0);
if (UserUniforms.sc_RayTracingCasterFormatTexture.w==5u)
{
uint l9_180=l9_178.x;
float2 l9_181=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_180],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_180+1u]);
uint l9_182=l9_178.y;
float2 l9_183=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_182],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_182+1u]);
uint l9_184=l9_178.z;
float2 l9_185=float2(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_184],sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_184+1u]);
l9_179=((l9_181*param_22.x)+(l9_183*param_22.y))+(l9_185*param_22.z);
}
else
{
if (UserUniforms.sc_RayTracingCasterFormatTexture.w==6u)
{
uint l9_186=l9_178.x;
float2 l9_187=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_186])));
uint l9_188=l9_178.y;
float2 l9_189=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_188])));
uint l9_190=l9_178.z;
float2 l9_191=float2(as_type<half2>(as_type<uint>(sc_RayTracingCasterVertexBuffer.sc_RayTracingCasterVertices[l9_190])));
l9_179=((l9_187*param_22.x)+(l9_189*param_22.y))+(l9_191*param_22.z);
}
else
{
l9_179=float2(1.0,0.0);
}
}
float2 l9_192=l9_179;
rhp.uv3=l9_192;
}
else
{
rhp.uv3=dummyRedBlack;
}
return rhp;
}
float2 calcSeamlessPanoramicUvsForSampling(thread const float2& uv,thread const float2& topMipRes,thread const float& lod)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float2 thisMipRes=fast::max(float2(1.0),topMipRes/float2(exp2(lod)));
return ((uv*(thisMipRes-float2(1.0)))/thisMipRes)+(float2(0.5)/thisMipRes);
}
else
{
return uv;
}
}
float3 evaluateSSAO(thread const float3& positionWS,thread int& varStereoViewID,constant userUniformsObj& UserUniforms,thread texture2d<float> sc_SSAOTexture,thread sampler sc_SSAOTextureSmpSC)
{
if ((int(sc_SSAOEnabled_tmp)!=0))
{
int l9_0=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_0=0;
}
else
{
l9_0=varStereoViewID;
}
int l9_1=l9_0;
float4 clipSpaceCoord=UserUniforms.sc_ViewProjectionMatrixArray[l9_1]*float4(positionWS,1.0);
float3 l9_2=clipSpaceCoord.xyz/float3(clipSpaceCoord.w);
clipSpaceCoord=float4(l9_2.x,l9_2.y,l9_2.z,clipSpaceCoord.w);
float4 shadowSample=sc_SSAOTexture.sample(sc_SSAOTextureSmpSC,((clipSpaceCoord.xy*0.5)+float2(0.5)));
return float3(shadowSample.x);
}
else
{
return float3(1.0);
}
}
float3 calculateDirectSpecular(thread const SurfaceProperties& surfaceProperties,thread const float3& L,thread const float3& V,constant userUniformsObj& UserUniforms)
{
float r=fast::max(surfaceProperties.roughness,0.029999999);
float3 F0=surfaceProperties.specColor;
float3 N=surfaceProperties.normal;
float3 H=normalize(L+V);
float param=dot(N,L);
float l9_0=fast::clamp(param,0.0,1.0);
float NdotL=l9_0;
float param_1=dot(N,V);
float l9_1=fast::clamp(param_1,0.0,1.0);
float NdotV=l9_1;
float param_2=dot(N,H);
float l9_2=fast::clamp(param_2,0.0,1.0);
float NdotH=l9_2;
float param_3=dot(V,H);
float l9_3=fast::clamp(param_3,0.0,1.0);
float VdotH=l9_3;
if (SC_DEVICE_CLASS_tmp>=2)
{
float param_4=NdotH;
float param_5=r;
float l9_4=param_5*param_5;
float l9_5=l9_4*l9_4;
float l9_6=param_4*param_4;
float l9_7=(l9_6*(l9_5-1.0))+1.0;
float l9_8=l9_7*l9_7;
float l9_9=9.9999999e-09;
if (UserUniforms.sc_RayTracingCasterConfiguration.x!=0u)
{
l9_9=1e-07;
}
float l9_10=l9_5/(l9_8+l9_9);
float param_6=NdotL;
float param_7=NdotV;
float param_8=r;
float l9_11=param_6;
float l9_12=param_8;
float l9_13=l9_12+1.0;
l9_13=(l9_13*l9_13)*0.125;
float l9_14=(l9_11*(1.0-l9_13))+l9_13;
float l9_15=param_7;
float l9_16=param_8;
float l9_17=l9_16+1.0;
l9_17=(l9_17*l9_17)*0.125;
float l9_18=(l9_15*(1.0-l9_17))+l9_17;
float l9_19=1.0/(l9_14*l9_18);
float param_9=VdotH;
float3 param_10=F0;
float l9_20=param_9;
float3 l9_21=param_10;
float3 l9_22=float3(1.0);
float l9_23=1.0-l9_20;
float l9_24=l9_23*l9_23;
float l9_25=(l9_24*l9_24)*l9_23;
float3 l9_26=l9_21+((l9_22-l9_21)*l9_25);
float3 l9_27=l9_26;
return l9_27*(((l9_10*l9_19)*0.25)*NdotL);
}
else
{
float specPower=exp2(11.0-(10.0*r));
float param_11=VdotH;
float3 param_12=F0;
float l9_28=param_11;
float3 l9_29=param_12;
float3 l9_30=float3(1.0);
float l9_31=1.0-l9_28;
float l9_32=l9_31*l9_31;
float l9_33=(l9_32*l9_32)*l9_31;
float3 l9_34=l9_29+((l9_30-l9_29)*l9_33);
float3 l9_35=l9_34;
return ((l9_35*((specPower*0.125)+0.25))*pow(NdotH,specPower))*NdotL;
}
}
float computeDistanceAttenuation(thread const float& distanceToLight,thread const float& falloffEndDistance)
{
float distanceToLightSquared=distanceToLight*distanceToLight;
if (falloffEndDistance==0.0)
{
return 1.0/distanceToLightSquared;
}
float distanceToLightToTheFourth=distanceToLightSquared*distanceToLightSquared;
float falloffEndDistanceToTheFourth=pow(falloffEndDistance,4.0);
return fast::max(fast::min(1.0-(distanceToLightToTheFourth/falloffEndDistanceToTheFourth),1.0),0.0)/distanceToLightSquared;
}
float3 getSpecularDominantDir(thread const float3& N,thread const float3& R,thread const float& roughness)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float lerpFactor=(roughness*roughness)*roughness;
return normalize(mix(R,N,float3(lerpFactor)));
}
else
{
return R;
}
}
float3 envBRDFApprox(thread const SurfaceProperties& surfaceProperties,thread const float& NdotV)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float param=surfaceProperties.roughness;
float param_1=NdotV;
float4 l9_0=(float4(-1.0,-0.0275,-0.57200003,0.022)*param)+float4(1.0,0.0425,1.04,-0.039999999);
float l9_1=(fast::min(l9_0.x*l9_0.x,exp2((-9.2799997)*param_1))*l9_0.x)+l9_0.y;
float2 l9_2=(float2(-1.04,1.04)*l9_1)+l9_0.zw;
float2 l9_3=l9_2;
float2 AB=l9_3;
return fast::max((surfaceProperties.specColor*AB.x)+float3(AB.y),float3(0.0));
}
else
{
float3 fresnelMax=fast::max(float3(1.0-surfaceProperties.roughness),surfaceProperties.specColor);
float param_2=NdotV;
float3 param_3=surfaceProperties.specColor;
float3 param_4=fresnelMax;
float l9_4=1.0-param_2;
float l9_5=l9_4*l9_4;
float l9_6=(l9_5*l9_5)*l9_4;
float3 l9_7=param_3+((param_4-param_3)*l9_6);
return l9_7;
}
}
float srgbToLinear(thread const float& x)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
return pow(x,2.2);
}
else
{
return x*x;
}
}
float linearToSrgb(thread const float& x)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
return pow(x,0.45454547);
}
else
{
return sqrt(x);
}
}
float4 ngsCalculateLighting(thread const float3& albedo,thread const float& opacity,thread const float3& normal,thread const float3& position,thread const float3& viewDir,thread const float3& emissive,thread const float& metallic,thread const float& roughness,thread const float3& ao,thread const float3& specularAO,thread int& varStereoViewID,thread texture2d<float> sc_EnvmapDiffuse,thread sampler sc_EnvmapDiffuseSmpSC,thread texture2d<float> sc_EnvmapSpecular,thread sampler sc_EnvmapSpecularSmpSC,thread texture2d<float> sc_ScreenTexture,thread sampler sc_ScreenTextureSmpSC,thread texture2d<float> sc_RayTracingReflections,thread sampler sc_RayTracingReflectionsSmpSC,thread texture2d<float> sc_RayTracingGlobalIllumination,thread sampler sc_RayTracingGlobalIlluminationSmpSC,thread texture2d<float> sc_RayTracingShadows,thread sampler sc_RayTracingShadowsSmpSC,thread float4& gl_FragCoord,constant userUniformsObj& UserUniforms,thread float2& varShadowTex,thread texture2d<float> sc_ShadowTexture,thread sampler sc_ShadowTextureSmpSC,thread float4& sc_FragData0,thread texture2d<float> sc_SSAOTexture,thread sampler sc_SSAOTextureSmpSC)
{
SurfaceProperties l9_0;
l9_0.albedo=float3(0.0);
l9_0.opacity=1.0;
l9_0.normal=float3(0.0);
l9_0.positionWS=float3(0.0);
l9_0.viewDirWS=float3(0.0);
l9_0.metallic=0.0;
l9_0.roughness=0.0;
l9_0.emissive=float3(0.0);
l9_0.ao=float3(1.0);
l9_0.specularAo=float3(1.0);
l9_0.bakedShadows=float3(1.0);
SurfaceProperties l9_1=l9_0;
SurfaceProperties surfaceProperties=l9_1;
surfaceProperties.opacity=opacity;
float3 param=albedo;
float3 l9_2;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_2=float3(pow(param.x,2.2),pow(param.y,2.2),pow(param.z,2.2));
}
else
{
l9_2=param*param;
}
float3 l9_3=l9_2;
surfaceProperties.albedo=l9_3;
surfaceProperties.normal=normalize(normal);
surfaceProperties.positionWS=position;
surfaceProperties.viewDirWS=viewDir;
float3 param_1=emissive;
float3 l9_4;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_4=float3(pow(param_1.x,2.2),pow(param_1.y,2.2),pow(param_1.z,2.2));
}
else
{
l9_4=param_1*param_1;
}
float3 l9_5=l9_4;
surfaceProperties.emissive=l9_5;
surfaceProperties.metallic=metallic;
surfaceProperties.roughness=roughness;
surfaceProperties.ao=ao;
surfaceProperties.specularAo=specularAO;
if ((int(sc_SSAOEnabled_tmp)!=0))
{
float3 param_2=surfaceProperties.positionWS;
surfaceProperties.ao=evaluateSSAO(param_2,varStereoViewID,UserUniforms,sc_SSAOTexture,sc_SSAOTextureSmpSC);
}
SurfaceProperties param_3=surfaceProperties;
SurfaceProperties l9_6=param_3;
float3 l9_7=mix(float3(0.039999999),l9_6.albedo*l9_6.metallic,float3(l9_6.metallic));
float3 l9_8=mix(l9_6.albedo*(1.0-l9_6.metallic),float3(0.0),float3(l9_6.metallic));
param_3.albedo=l9_8;
param_3.specColor=l9_7;
SurfaceProperties l9_9=param_3;
surfaceProperties=l9_9;
SurfaceProperties param_4=surfaceProperties;
LightingComponents l9_10;
l9_10.directDiffuse=float3(0.0);
l9_10.directSpecular=float3(0.0);
l9_10.indirectDiffuse=float3(1.0);
l9_10.indirectSpecular=float3(0.0);
l9_10.emitted=float3(0.0);
l9_10.transmitted=float3(0.0);
LightingComponents l9_11=l9_10;
LightingComponents l9_12=l9_11;
float3 l9_13=param_4.viewDirWS;
int l9_14=0;
float4 l9_15=float4(param_4.bakedShadows,1.0);
if (sc_DirectionalLightsCount_tmp>0)
{
sc_DirectionalLight_t l9_16;
LightProperties l9_17;
int l9_18=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_18<sc_DirectionalLightsCount_tmp)
{
l9_16.direction=UserUniforms.sc_DirectionalLights[l9_18].direction;
l9_16.color=UserUniforms.sc_DirectionalLights[l9_18].color;
l9_17.direction=l9_16.direction;
l9_17.color=l9_16.color.xyz;
l9_17.attenuation=l9_16.color.w;
l9_17.attenuation*=l9_15[(l9_14<3) ? l9_14 : 3];
l9_14++;
LightingComponents l9_19=l9_12;
LightProperties l9_20=l9_17;
SurfaceProperties l9_21=param_4;
float3 l9_22=l9_13;
SurfaceProperties l9_23=l9_21;
float3 l9_24=l9_20.direction;
float l9_25=dot(l9_23.normal,l9_24);
float l9_26=fast::clamp(l9_25,0.0,1.0);
float3 l9_27=float3(l9_26);
l9_19.directDiffuse+=((l9_27*l9_20.color)*l9_20.attenuation);
SurfaceProperties l9_28=l9_21;
float3 l9_29=l9_20.direction;
float3 l9_30=l9_22;
l9_19.directSpecular+=((calculateDirectSpecular(l9_28,l9_29,l9_30,UserUniforms)*l9_20.color)*l9_20.attenuation);
LightingComponents l9_31=l9_19;
l9_12=l9_31;
l9_18++;
continue;
}
else
{
break;
}
}
}
if (sc_PointLightsCount_tmp>0)
{
sc_PointLight_t_1 l9_32;
LightProperties l9_33;
int l9_34=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_34<sc_PointLightsCount_tmp)
{
l9_32.falloffEnabled=UserUniforms.sc_PointLights[l9_34].falloffEnabled!=0;
l9_32.falloffEndDistance=UserUniforms.sc_PointLights[l9_34].falloffEndDistance;
l9_32.negRcpFalloffEndDistance4=UserUniforms.sc_PointLights[l9_34].negRcpFalloffEndDistance4;
l9_32.angleScale=UserUniforms.sc_PointLights[l9_34].angleScale;
l9_32.angleOffset=UserUniforms.sc_PointLights[l9_34].angleOffset;
l9_32.direction=UserUniforms.sc_PointLights[l9_34].direction;
l9_32.position=UserUniforms.sc_PointLights[l9_34].position;
l9_32.color=UserUniforms.sc_PointLights[l9_34].color;
float3 l9_35=l9_32.position-param_4.positionWS;
l9_33.direction=normalize(l9_35);
l9_33.color=l9_32.color.xyz;
l9_33.attenuation=l9_32.color.w;
l9_33.attenuation*=l9_15[(l9_14<3) ? l9_14 : 3];
float3 l9_36=l9_33.direction;
float3 l9_37=l9_32.direction;
float l9_38=l9_32.angleScale;
float l9_39=l9_32.angleOffset;
float l9_40=dot(l9_36,l9_37);
float l9_41=fast::clamp((l9_40*l9_38)+l9_39,0.0,1.0);
float l9_42=l9_41*l9_41;
l9_33.attenuation*=l9_42;
if (l9_32.falloffEnabled)
{
float l9_43=length(l9_35);
float l9_44=l9_32.falloffEndDistance;
l9_33.attenuation*=computeDistanceAttenuation(l9_43,l9_44);
}
l9_14++;
LightingComponents l9_45=l9_12;
LightProperties l9_46=l9_33;
SurfaceProperties l9_47=param_4;
float3 l9_48=l9_13;
SurfaceProperties l9_49=l9_47;
float3 l9_50=l9_46.direction;
float l9_51=dot(l9_49.normal,l9_50);
float l9_52=fast::clamp(l9_51,0.0,1.0);
float3 l9_53=float3(l9_52);
l9_45.directDiffuse+=((l9_53*l9_46.color)*l9_46.attenuation);
SurfaceProperties l9_54=l9_47;
float3 l9_55=l9_46.direction;
float3 l9_56=l9_48;
l9_45.directSpecular+=((calculateDirectSpecular(l9_54,l9_55,l9_56,UserUniforms)*l9_46.color)*l9_46.attenuation);
LightingComponents l9_57=l9_45;
l9_12=l9_57;
l9_34++;
continue;
}
else
{
break;
}
}
}
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float3 l9_58=float3(0.0);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float2 l9_59=abs(varShadowTex-float2(0.5));
float l9_60=fast::max(l9_59.x,l9_59.y);
float l9_61=step(l9_60,0.5);
float4 l9_62=sc_ShadowTexture.sample(sc_ShadowTextureSmpSC,varShadowTex)*l9_61;
float3 l9_63=mix(UserUniforms.sc_ShadowColor.xyz,UserUniforms.sc_ShadowColor.xyz*l9_62.xyz,float3(UserUniforms.sc_ShadowColor.w));
float l9_64=l9_62.w*UserUniforms.sc_ShadowDensity;
l9_58=mix(float3(1.0),l9_63,float3(l9_64));
}
else
{
l9_58=float3(1.0);
}
float3 l9_65=l9_58;
float3 l9_66=l9_65;
l9_12.directDiffuse*=l9_66;
l9_12.directSpecular*=l9_66;
}
if ((UserUniforms.sc_RayTracingReceiverEffectsMask&4)!=0)
{
float4 l9_67=gl_FragCoord;
float2 l9_68=l9_67.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_69=l9_68;
float2 l9_70=l9_69;
float l9_71=0.0;
int l9_72;
if ((int(sc_RayTracingShadowsHasSwappedViews_tmp)!=0))
{
int l9_73=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_73=0;
}
else
{
l9_73=varStereoViewID;
}
int l9_74=l9_73;
l9_72=1-l9_74;
}
else
{
int l9_75=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_75=0;
}
else
{
l9_75=varStereoViewID;
}
int l9_76=l9_75;
l9_72=l9_76;
}
int l9_77=l9_72;
float2 l9_78=l9_70;
int l9_79=sc_RayTracingShadowsLayout_tmp;
int l9_80=l9_77;
float l9_81=l9_71;
float2 l9_82=l9_78;
int l9_83=l9_79;
int l9_84=l9_80;
float3 l9_85=float3(0.0);
if (l9_83==0)
{
l9_85=float3(l9_82,0.0);
}
else
{
if (l9_83==1)
{
l9_85=float3(l9_82.x,(l9_82.y*0.5)+(0.5-(float(l9_84)*0.5)),0.0);
}
else
{
l9_85=float3(l9_82,float(l9_84));
}
}
float3 l9_86=l9_85;
float3 l9_87=l9_86;
float4 l9_88=sc_RayTracingShadows.sample(sc_RayTracingShadowsSmpSC,l9_87.xy,bias(l9_81));
float4 l9_89=l9_88;
float4 l9_90=l9_89;
float l9_91=l9_90.x;
float l9_92=1.0-l9_91;
l9_12.directDiffuse*=l9_92;
l9_12.directSpecular*=l9_92;
}
SurfaceProperties l9_93=param_4;
float3 l9_94=l9_93.normal;
float3 l9_95=float3(0.0);
if ((sc_EnvLightMode_tmp==sc_AmbientLightMode_EnvironmentMap_tmp)||(sc_EnvLightMode_tmp==sc_AmbientLightMode_FromCamera_tmp))
{
float3 l9_96=l9_94;
float3 l9_97=l9_96;
float l9_98=UserUniforms.sc_EnvmapRotation.y;
float2 l9_99=float2(0.0);
float l9_100=l9_97.x;
float l9_101=-l9_97.z;
float l9_102=(l9_100<0.0) ? (-1.0) : 1.0;
float l9_103=l9_102*acos(fast::clamp(l9_101/length(float2(l9_100,l9_101)),-1.0,1.0));
l9_99.x=l9_103-1.5707964;
l9_99.y=acos(l9_97.y);
l9_99/=float2(6.2831855,3.1415927);
l9_99.y=1.0-l9_99.y;
l9_99.x+=(l9_98/360.0);
l9_99.x=fract((l9_99.x+floor(l9_99.x))+1.0);
float2 l9_104=l9_99;
float2 l9_105=l9_104;
float4 l9_106=float4(0.0);
if (sc_EnvLightMode_tmp==sc_AmbientLightMode_FromCamera_tmp)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float2 l9_107=l9_105;
float2 l9_108=UserUniforms.sc_EnvmapSpecularSize.xy;
float l9_109=5.0;
l9_105=calcSeamlessPanoramicUvsForSampling(l9_107,l9_108,l9_109);
}
float2 l9_110=l9_105;
float l9_111=13.0;
int l9_112;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_113=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_113=0;
}
else
{
l9_113=varStereoViewID;
}
int l9_114=l9_113;
l9_112=1-l9_114;
}
else
{
int l9_115=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_115=0;
}
else
{
l9_115=varStereoViewID;
}
int l9_116=l9_115;
l9_112=l9_116;
}
int l9_117=l9_112;
float2 l9_118=l9_110;
int l9_119=sc_EnvmapSpecularLayout_tmp;
int l9_120=l9_117;
float l9_121=l9_111;
float2 l9_122=l9_118;
int l9_123=l9_119;
int l9_124=l9_120;
float3 l9_125=float3(0.0);
if (l9_123==0)
{
l9_125=float3(l9_122,0.0);
}
else
{
if (l9_123==1)
{
l9_125=float3(l9_122.x,(l9_122.y*0.5)+(0.5-(float(l9_124)*0.5)),0.0);
}
else
{
l9_125=float3(l9_122,float(l9_124));
}
}
float3 l9_126=l9_125;
float3 l9_127=l9_126;
float4 l9_128=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_127.xy,bias(l9_121));
float4 l9_129=l9_128;
l9_106=l9_129;
}
else
{
if ((int(sc_HasDiffuseEnvmap_tmp)!=0))
{
float2 l9_130=l9_105;
float2 l9_131=UserUniforms.sc_EnvmapDiffuseSize.xy;
float l9_132=0.0;
l9_105=calcSeamlessPanoramicUvsForSampling(l9_130,l9_131,l9_132);
if (UserUniforms.sc_RayTracingCasterConfiguration.x!=0u)
{
float2 l9_133=l9_105;
float l9_134=0.0;
int l9_135;
if ((int(sc_EnvmapDiffuseHasSwappedViews_tmp)!=0))
{
int l9_136=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_136=0;
}
else
{
l9_136=varStereoViewID;
}
int l9_137=l9_136;
l9_135=1-l9_137;
}
else
{
int l9_138=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_138=0;
}
else
{
l9_138=varStereoViewID;
}
int l9_139=l9_138;
l9_135=l9_139;
}
int l9_140=l9_135;
float2 l9_141=l9_133;
int l9_142=sc_EnvmapDiffuseLayout_tmp;
int l9_143=l9_140;
float l9_144=l9_134;
float2 l9_145=l9_141;
int l9_146=l9_142;
int l9_147=l9_143;
float3 l9_148=float3(0.0);
if (l9_146==0)
{
l9_148=float3(l9_145,0.0);
}
else
{
if (l9_146==1)
{
l9_148=float3(l9_145.x,(l9_145.y*0.5)+(0.5-(float(l9_147)*0.5)),0.0);
}
else
{
l9_148=float3(l9_145,float(l9_147));
}
}
float3 l9_149=l9_148;
float3 l9_150=l9_149;
float4 l9_151=sc_EnvmapDiffuse.sample(sc_EnvmapDiffuseSmpSC,l9_150.xy,level(l9_144));
float4 l9_152=l9_151;
l9_106=l9_152;
}
else
{
float2 l9_153=l9_105;
float l9_154=-13.0;
int l9_155;
if ((int(sc_EnvmapDiffuseHasSwappedViews_tmp)!=0))
{
int l9_156=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_156=0;
}
else
{
l9_156=varStereoViewID;
}
int l9_157=l9_156;
l9_155=1-l9_157;
}
else
{
int l9_158=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_158=0;
}
else
{
l9_158=varStereoViewID;
}
int l9_159=l9_158;
l9_155=l9_159;
}
int l9_160=l9_155;
float2 l9_161=l9_153;
int l9_162=sc_EnvmapDiffuseLayout_tmp;
int l9_163=l9_160;
float l9_164=l9_154;
float2 l9_165=l9_161;
int l9_166=l9_162;
int l9_167=l9_163;
float3 l9_168=float3(0.0);
if (l9_166==0)
{
l9_168=float3(l9_165,0.0);
}
else
{
if (l9_166==1)
{
l9_168=float3(l9_165.x,(l9_165.y*0.5)+(0.5-(float(l9_167)*0.5)),0.0);
}
else
{
l9_168=float3(l9_165,float(l9_167));
}
}
float3 l9_169=l9_168;
float3 l9_170=l9_169;
float4 l9_171=sc_EnvmapDiffuse.sample(sc_EnvmapDiffuseSmpSC,l9_170.xy,bias(l9_164));
float4 l9_172=l9_171;
l9_106=l9_172;
}
}
else
{
float2 l9_173=l9_105;
float l9_174=13.0;
int l9_175;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_176=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_176=0;
}
else
{
l9_176=varStereoViewID;
}
int l9_177=l9_176;
l9_175=1-l9_177;
}
else
{
int l9_178=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_178=0;
}
else
{
l9_178=varStereoViewID;
}
int l9_179=l9_178;
l9_175=l9_179;
}
int l9_180=l9_175;
float2 l9_181=l9_173;
int l9_182=sc_EnvmapSpecularLayout_tmp;
int l9_183=l9_180;
float l9_184=l9_174;
float2 l9_185=l9_181;
int l9_186=l9_182;
int l9_187=l9_183;
float3 l9_188=float3(0.0);
if (l9_186==0)
{
l9_188=float3(l9_185,0.0);
}
else
{
if (l9_186==1)
{
l9_188=float3(l9_185.x,(l9_185.y*0.5)+(0.5-(float(l9_187)*0.5)),0.0);
}
else
{
l9_188=float3(l9_185,float(l9_187));
}
}
float3 l9_189=l9_188;
float3 l9_190=l9_189;
float4 l9_191=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_190.xy,bias(l9_184));
float4 l9_192=l9_191;
l9_106=l9_192;
}
}
float4 l9_193=l9_106;
float3 l9_194=l9_193.xyz*(1.0/l9_193.w);
float3 l9_195=l9_194*UserUniforms.sc_EnvmapExposure;
l9_95=l9_195;
}
else
{
if (sc_EnvLightMode_tmp==sc_AmbientLightMode_SphericalHarmonics_tmp)
{
float3 l9_196=UserUniforms.sc_Sh[0];
float3 l9_197=UserUniforms.sc_Sh[1];
float3 l9_198=UserUniforms.sc_Sh[2];
float3 l9_199=UserUniforms.sc_Sh[3];
float3 l9_200=UserUniforms.sc_Sh[4];
float3 l9_201=UserUniforms.sc_Sh[5];
float3 l9_202=UserUniforms.sc_Sh[6];
float3 l9_203=UserUniforms.sc_Sh[7];
float3 l9_204=UserUniforms.sc_Sh[8];
float3 l9_205=-l9_94;
float l9_206=0.0;
l9_206=l9_205.x;
float l9_207=l9_205.y;
float l9_208=l9_205.z;
float l9_209=l9_206*l9_206;
float l9_210=l9_207*l9_207;
float l9_211=l9_208*l9_208;
float l9_212=l9_206*l9_207;
float l9_213=l9_207*l9_208;
float l9_214=l9_206*l9_208;
float3 l9_215=((((((l9_204*0.42904299)*(l9_209-l9_210))+((l9_202*0.74312502)*l9_211))+(l9_196*0.88622701))-(l9_202*0.24770799))+((((l9_200*l9_212)+(l9_203*l9_214))+(l9_201*l9_213))*0.85808599))+((((l9_199*l9_206)+(l9_197*l9_207))+(l9_198*l9_208))*1.0233279);
l9_95=l9_215*UserUniforms.sc_ShIntensity;
}
}
if ((UserUniforms.sc_RayTracingReceiverEffectsMask&2)!=0)
{
float4 l9_216=gl_FragCoord;
float2 l9_217=l9_216.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_218=l9_217;
float2 l9_219=l9_218;
float l9_220=0.0;
int l9_221;
if ((int(sc_RayTracingGlobalIlluminationHasSwappedViews_tmp)!=0))
{
int l9_222=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_222=0;
}
else
{
l9_222=varStereoViewID;
}
int l9_223=l9_222;
l9_221=1-l9_223;
}
else
{
int l9_224=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_224=0;
}
else
{
l9_224=varStereoViewID;
}
int l9_225=l9_224;
l9_221=l9_225;
}
int l9_226=l9_221;
float2 l9_227=l9_219;
int l9_228=sc_RayTracingGlobalIlluminationLayout_tmp;
int l9_229=l9_226;
float l9_230=l9_220;
float2 l9_231=l9_227;
int l9_232=l9_228;
int l9_233=l9_229;
float3 l9_234=float3(0.0);
if (l9_232==0)
{
l9_234=float3(l9_231,0.0);
}
else
{
if (l9_232==1)
{
l9_234=float3(l9_231.x,(l9_231.y*0.5)+(0.5-(float(l9_233)*0.5)),0.0);
}
else
{
l9_234=float3(l9_231,float(l9_233));
}
}
float3 l9_235=l9_234;
float3 l9_236=l9_235;
float4 l9_237=sc_RayTracingGlobalIllumination.sample(sc_RayTracingGlobalIlluminationSmpSC,l9_236.xy,bias(l9_230));
float4 l9_238=l9_237;
float4 l9_239=l9_238;
float4 l9_240=l9_239;
l9_95=mix(l9_95,l9_240.xyz,float3(l9_240.w));
}
if (sc_AmbientLightsCount_tmp>0)
{
if (sc_AmbientLightMode0_tmp==sc_AmbientLightMode_Constant_tmp)
{
l9_95+=(UserUniforms.sc_AmbientLights[0].color*UserUniforms.sc_AmbientLights[0].intensity);
}
else
{
l9_95.x+=(1e-06*UserUniforms.sc_AmbientLights[0].color.x);
}
}
if (sc_AmbientLightsCount_tmp>1)
{
if (sc_AmbientLightMode1_tmp==sc_AmbientLightMode_Constant_tmp)
{
l9_95+=(UserUniforms.sc_AmbientLights[1].color*UserUniforms.sc_AmbientLights[1].intensity);
}
else
{
l9_95.x+=(1e-06*UserUniforms.sc_AmbientLights[1].color.x);
}
}
if (sc_AmbientLightsCount_tmp>2)
{
if (sc_AmbientLightMode2_tmp==sc_AmbientLightMode_Constant_tmp)
{
l9_95+=(UserUniforms.sc_AmbientLights[2].color*UserUniforms.sc_AmbientLights[2].intensity);
}
else
{
l9_95.x+=(1e-06*UserUniforms.sc_AmbientLights[2].color.x);
}
}
if ((int(sc_LightEstimation_tmp)!=0))
{
float3 l9_241=l9_94;
float3 l9_242=UserUniforms.sc_LightEstimationData.ambientLight;
sc_SphericalGaussianLight_t l9_243;
float l9_244;
int l9_245=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_245<sc_LightEstimationSGCount_tmp)
{
l9_243.color=UserUniforms.sc_LightEstimationData.sg[l9_245].color;
l9_243.sharpness=UserUniforms.sc_LightEstimationData.sg[l9_245].sharpness;
l9_243.axis=UserUniforms.sc_LightEstimationData.sg[l9_245].axis;
float3 l9_246=l9_241;
float l9_247=dot(l9_243.axis,l9_246);
float l9_248=l9_243.sharpness;
float l9_249=0.36000001;
float l9_250=1.0/(4.0*l9_249);
float l9_251=exp(-l9_248);
float l9_252=l9_251*l9_251;
float l9_253=1.0/l9_248;
float l9_254=(1.0+(2.0*l9_252))-l9_253;
float l9_255=((l9_251-l9_252)*l9_253)-l9_252;
float l9_256=sqrt(1.0-l9_254);
float l9_257=l9_249*l9_247;
float l9_258=l9_250*l9_256;
float l9_259=l9_257+l9_258;
float l9_260=l9_247;
float l9_261=fast::clamp(l9_260,0.0,1.0);
float l9_262=l9_261;
if (step(abs(l9_257),l9_258)>0.5)
{
l9_244=(l9_259*l9_259)/l9_256;
}
else
{
l9_244=l9_262;
}
l9_262=l9_244;
float l9_263=(l9_254*l9_262)+l9_255;
sc_SphericalGaussianLight_t l9_264=l9_243;
float3 l9_265=(l9_264.color/float3(l9_264.sharpness))*6.2831855;
float3 l9_266=(l9_265*l9_263)/float3(3.1415927);
l9_242+=l9_266;
l9_245++;
continue;
}
else
{
break;
}
}
float3 l9_267=l9_242;
l9_95+=l9_267;
}
float3 l9_268=l9_95;
float3 l9_269=l9_268;
l9_12.indirectDiffuse=l9_269;
SurfaceProperties l9_270=param_4;
float3 l9_271=l9_13;
float3 l9_272=float3(0.0);
if ((sc_EnvLightMode_tmp==sc_AmbientLightMode_EnvironmentMap_tmp)||(sc_EnvLightMode_tmp==sc_AmbientLightMode_FromCamera_tmp))
{
SurfaceProperties l9_273=l9_270;
float3 l9_274=l9_271;
float3 l9_275=l9_273.normal;
float3 l9_276=reflect(-l9_274,l9_275);
float3 l9_277=l9_275;
float3 l9_278=l9_276;
float l9_279=l9_273.roughness;
l9_276=getSpecularDominantDir(l9_277,l9_278,l9_279);
float l9_280=l9_273.roughness;
float l9_281=pow(l9_280,0.66666669);
float l9_282=fast::clamp(l9_281,0.0,1.0);
float l9_283=l9_282*5.0;
float l9_284=l9_283;
float l9_285=l9_284;
float3 l9_286=l9_276;
float l9_287=l9_285;
float3 l9_288=l9_286;
float l9_289=l9_287;
float4 l9_290=float4(0.0);
float3 l9_291=l9_288;
float l9_292=UserUniforms.sc_EnvmapRotation.y;
float2 l9_293=float2(0.0);
float l9_294=l9_291.x;
float l9_295=-l9_291.z;
float l9_296=(l9_294<0.0) ? (-1.0) : 1.0;
float l9_297=l9_296*acos(fast::clamp(l9_295/length(float2(l9_294,l9_295)),-1.0,1.0));
l9_293.x=l9_297-1.5707964;
l9_293.y=acos(l9_291.y);
l9_293/=float2(6.2831855,3.1415927);
l9_293.y=1.0-l9_293.y;
l9_293.x+=(l9_292/360.0);
l9_293.x=fract((l9_293.x+floor(l9_293.x))+1.0);
float2 l9_298=l9_293;
float2 l9_299=l9_298;
if (SC_DEVICE_CLASS_tmp>=2)
{
float l9_300=floor(l9_289);
float l9_301=ceil(l9_289);
float l9_302=l9_289-l9_300;
float2 l9_303=l9_299;
float2 l9_304=UserUniforms.sc_EnvmapSpecularSize.xy;
float l9_305=l9_300;
float2 l9_306=calcSeamlessPanoramicUvsForSampling(l9_303,l9_304,l9_305);
float2 l9_307=l9_306;
float l9_308=l9_300;
float2 l9_309=l9_307;
float l9_310=l9_308;
int l9_311;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_312=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_312=0;
}
else
{
l9_312=varStereoViewID;
}
int l9_313=l9_312;
l9_311=1-l9_313;
}
else
{
int l9_314=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_314=0;
}
else
{
l9_314=varStereoViewID;
}
int l9_315=l9_314;
l9_311=l9_315;
}
int l9_316=l9_311;
float2 l9_317=l9_309;
int l9_318=sc_EnvmapSpecularLayout_tmp;
int l9_319=l9_316;
float l9_320=l9_310;
float2 l9_321=l9_317;
int l9_322=l9_318;
int l9_323=l9_319;
float3 l9_324=float3(0.0);
if (l9_322==0)
{
l9_324=float3(l9_321,0.0);
}
else
{
if (l9_322==1)
{
l9_324=float3(l9_321.x,(l9_321.y*0.5)+(0.5-(float(l9_323)*0.5)),0.0);
}
else
{
l9_324=float3(l9_321,float(l9_323));
}
}
float3 l9_325=l9_324;
float3 l9_326=l9_325;
float4 l9_327=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_326.xy,level(l9_320));
float4 l9_328=l9_327;
float4 l9_329=l9_328;
float4 l9_330=l9_329;
float2 l9_331=l9_299;
float2 l9_332=UserUniforms.sc_EnvmapSpecularSize.xy;
float l9_333=l9_301;
float2 l9_334=calcSeamlessPanoramicUvsForSampling(l9_331,l9_332,l9_333);
float2 l9_335=l9_334;
float l9_336=l9_301;
float2 l9_337=l9_335;
float l9_338=l9_336;
int l9_339;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_340=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_340=0;
}
else
{
l9_340=varStereoViewID;
}
int l9_341=l9_340;
l9_339=1-l9_341;
}
else
{
int l9_342=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_342=0;
}
else
{
l9_342=varStereoViewID;
}
int l9_343=l9_342;
l9_339=l9_343;
}
int l9_344=l9_339;
float2 l9_345=l9_337;
int l9_346=sc_EnvmapSpecularLayout_tmp;
int l9_347=l9_344;
float l9_348=l9_338;
float2 l9_349=l9_345;
int l9_350=l9_346;
int l9_351=l9_347;
float3 l9_352=float3(0.0);
if (l9_350==0)
{
l9_352=float3(l9_349,0.0);
}
else
{
if (l9_350==1)
{
l9_352=float3(l9_349.x,(l9_349.y*0.5)+(0.5-(float(l9_351)*0.5)),0.0);
}
else
{
l9_352=float3(l9_349,float(l9_351));
}
}
float3 l9_353=l9_352;
float3 l9_354=l9_353;
float4 l9_355=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_354.xy,level(l9_348));
float4 l9_356=l9_355;
float4 l9_357=l9_356;
float4 l9_358=l9_357;
l9_290=mix(l9_330,l9_358,float4(l9_302));
}
else
{
float2 l9_359=l9_299;
float l9_360=l9_289;
float2 l9_361=l9_359;
float l9_362=l9_360;
int l9_363;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_364=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_364=0;
}
else
{
l9_364=varStereoViewID;
}
int l9_365=l9_364;
l9_363=1-l9_365;
}
else
{
int l9_366=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_366=0;
}
else
{
l9_366=varStereoViewID;
}
int l9_367=l9_366;
l9_363=l9_367;
}
int l9_368=l9_363;
float2 l9_369=l9_361;
int l9_370=sc_EnvmapSpecularLayout_tmp;
int l9_371=l9_368;
float l9_372=l9_362;
float2 l9_373=l9_369;
int l9_374=l9_370;
int l9_375=l9_371;
float3 l9_376=float3(0.0);
if (l9_374==0)
{
l9_376=float3(l9_373,0.0);
}
else
{
if (l9_374==1)
{
l9_376=float3(l9_373.x,(l9_373.y*0.5)+(0.5-(float(l9_375)*0.5)),0.0);
}
else
{
l9_376=float3(l9_373,float(l9_375));
}
}
float3 l9_377=l9_376;
float3 l9_378=l9_377;
float4 l9_379=sc_EnvmapSpecular.sample(sc_EnvmapSpecularSmpSC,l9_378.xy,level(l9_372));
float4 l9_380=l9_379;
float4 l9_381=l9_380;
l9_290=l9_381;
}
float4 l9_382=l9_290;
float3 l9_383=l9_382.xyz*(1.0/l9_382.w);
float3 l9_384=l9_383;
float3 l9_385=l9_384*UserUniforms.sc_EnvmapExposure;
l9_385+=float3(1e-06);
float3 l9_386=l9_385;
float3 l9_387=l9_386;
if ((UserUniforms.sc_RayTracingReceiverEffectsMask&1)!=0)
{
float4 l9_388=gl_FragCoord;
float2 l9_389=l9_388.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_390=l9_389;
float2 l9_391=l9_390;
float l9_392=0.0;
int l9_393;
if ((int(sc_RayTracingReflectionsHasSwappedViews_tmp)!=0))
{
int l9_394=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_394=0;
}
else
{
l9_394=varStereoViewID;
}
int l9_395=l9_394;
l9_393=1-l9_395;
}
else
{
int l9_396=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_396=0;
}
else
{
l9_396=varStereoViewID;
}
int l9_397=l9_396;
l9_393=l9_397;
}
int l9_398=l9_393;
float2 l9_399=l9_391;
int l9_400=sc_RayTracingReflectionsLayout_tmp;
int l9_401=l9_398;
float l9_402=l9_392;
float2 l9_403=l9_399;
int l9_404=l9_400;
int l9_405=l9_401;
float3 l9_406=float3(0.0);
if (l9_404==0)
{
l9_406=float3(l9_403,0.0);
}
else
{
if (l9_404==1)
{
l9_406=float3(l9_403.x,(l9_403.y*0.5)+(0.5-(float(l9_405)*0.5)),0.0);
}
else
{
l9_406=float3(l9_403,float(l9_405));
}
}
float3 l9_407=l9_406;
float3 l9_408=l9_407;
float4 l9_409=sc_RayTracingReflections.sample(sc_RayTracingReflectionsSmpSC,l9_408.xy,bias(l9_402));
float4 l9_410=l9_409;
float4 l9_411=l9_410;
float4 l9_412=l9_411;
l9_387=mix(l9_387,l9_412.xyz,float3(l9_412.w));
}
float l9_413=abs(dot(l9_275,l9_274));
SurfaceProperties l9_414=l9_273;
float l9_415=l9_413;
float3 l9_416=l9_387*envBRDFApprox(l9_414,l9_415);
l9_272+=l9_416;
}
if ((int(sc_LightEstimation_tmp)!=0))
{
SurfaceProperties l9_417=l9_270;
float3 l9_418=l9_271;
float l9_419=fast::clamp(l9_417.roughness*l9_417.roughness,0.0099999998,1.0);
float3 l9_420=UserUniforms.sc_LightEstimationData.ambientLight*l9_417.specColor;
sc_SphericalGaussianLight_t l9_421;
sc_SphericalGaussianLight_t l9_422;
sc_SphericalGaussianLight_t l9_423;
int l9_424=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_424<sc_LightEstimationSGCount_tmp)
{
l9_421.color=UserUniforms.sc_LightEstimationData.sg[l9_424].color;
l9_421.sharpness=UserUniforms.sc_LightEstimationData.sg[l9_424].sharpness;
l9_421.axis=UserUniforms.sc_LightEstimationData.sg[l9_424].axis;
float3 l9_425=l9_417.normal;
float l9_426=l9_419;
float3 l9_427=l9_418;
float3 l9_428=l9_417.specColor;
float3 l9_429=l9_425;
float l9_430=l9_426;
l9_422.axis=l9_429;
float l9_431=l9_430*l9_430;
l9_422.sharpness=2.0/l9_431;
l9_422.color=float3(1.0/(3.1415927*l9_431));
sc_SphericalGaussianLight_t l9_432=l9_422;
sc_SphericalGaussianLight_t l9_433=l9_432;
sc_SphericalGaussianLight_t l9_434=l9_433;
float3 l9_435=l9_427;
l9_423.axis=reflect(-l9_435,l9_434.axis);
l9_423.color=l9_434.color;
l9_423.sharpness=l9_434.sharpness;
l9_423.sharpness/=(4.0*fast::max(dot(l9_434.axis,l9_435),9.9999997e-05));
sc_SphericalGaussianLight_t l9_436=l9_423;
sc_SphericalGaussianLight_t l9_437=l9_436;
sc_SphericalGaussianLight_t l9_438=l9_437;
sc_SphericalGaussianLight_t l9_439=l9_421;
float l9_440=length((l9_438.axis*l9_438.sharpness)+(l9_439.axis*l9_439.sharpness));
float3 l9_441=(l9_438.color*exp((l9_440-l9_438.sharpness)-l9_439.sharpness))*l9_439.color;
float l9_442=1.0-exp((-2.0)*l9_440);
float3 l9_443=((l9_441*6.2831855)*l9_442)/float3(l9_440);
float3 l9_444=l9_443;
float3 l9_445=l9_437.axis;
float l9_446=l9_426*l9_426;
float l9_447=dot(l9_425,l9_445);
float l9_448=fast::clamp(l9_447,0.0,1.0);
float l9_449=l9_448;
float l9_450=dot(l9_425,l9_427);
float l9_451=fast::clamp(l9_450,0.0,1.0);
float l9_452=l9_451;
float3 l9_453=normalize(l9_437.axis+l9_427);
float l9_454=l9_446;
float l9_455=l9_449;
float l9_456=1.0/(l9_455+sqrt(l9_454+(((1.0-l9_454)*l9_455)*l9_455)));
float l9_457=l9_446;
float l9_458=l9_452;
float l9_459=1.0/(l9_458+sqrt(l9_457+(((1.0-l9_457)*l9_458)*l9_458)));
l9_444*=(l9_456*l9_459);
float l9_460=dot(l9_445,l9_453);
float l9_461=fast::clamp(l9_460,0.0,1.0);
float l9_462=pow(1.0-l9_461,5.0);
l9_444*=(l9_428+((float3(1.0)-l9_428)*l9_462));
l9_444*=l9_449;
float3 l9_463=l9_444;
l9_420+=l9_463;
l9_424++;
continue;
}
else
{
break;
}
}
float3 l9_464=l9_420;
l9_272+=l9_464;
}
float3 l9_465=l9_272;
l9_12.indirectSpecular=l9_465;
LightingComponents l9_466=l9_12;
LightingComponents lighting=l9_466;
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
lighting.directDiffuse=float3(0.0);
lighting.indirectDiffuse=float3(0.0);
float4 l9_467=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_468=sc_FragData0;
l9_467=l9_468;
}
else
{
float4 l9_469=gl_FragCoord;
float2 l9_470=l9_469.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_471=l9_470;
float2 l9_472=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_473=1;
int l9_474=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_474=0;
}
else
{
l9_474=varStereoViewID;
}
int l9_475=l9_474;
int l9_476=l9_475;
float3 l9_477=float3(l9_471,0.0);
int l9_478=l9_473;
int l9_479=l9_476;
if (l9_478==1)
{
l9_477.y=((2.0*l9_477.y)+float(l9_479))-1.0;
}
float2 l9_480=l9_477.xy;
l9_472=l9_480;
}
else
{
l9_472=l9_471;
}
float2 l9_481=l9_472;
float2 l9_482=l9_481;
float2 l9_483=l9_482;
float2 l9_484=l9_483;
float l9_485=0.0;
int l9_486;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_487=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_487=0;
}
else
{
l9_487=varStereoViewID;
}
int l9_488=l9_487;
l9_486=1-l9_488;
}
else
{
int l9_489=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_489=0;
}
else
{
l9_489=varStereoViewID;
}
int l9_490=l9_489;
l9_486=l9_490;
}
int l9_491=l9_486;
float2 l9_492=l9_484;
int l9_493=sc_ScreenTextureLayout_tmp;
int l9_494=l9_491;
float l9_495=l9_485;
float2 l9_496=l9_492;
int l9_497=l9_493;
int l9_498=l9_494;
float3 l9_499=float3(0.0);
if (l9_497==0)
{
l9_499=float3(l9_496,0.0);
}
else
{
if (l9_497==1)
{
l9_499=float3(l9_496.x,(l9_496.y*0.5)+(0.5-(float(l9_498)*0.5)),0.0);
}
else
{
l9_499=float3(l9_496,float(l9_498));
}
}
float3 l9_500=l9_499;
float3 l9_501=l9_500;
float4 l9_502=sc_ScreenTexture.sample(sc_ScreenTextureSmpSC,l9_501.xy,bias(l9_495));
float4 l9_503=l9_502;
float4 l9_504=l9_503;
l9_467=l9_504;
}
float4 l9_505=l9_467;
float3 param_5=l9_505.xyz;
float3 l9_506;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_506=float3(pow(param_5.x,2.2),pow(param_5.y,2.2),pow(param_5.z,2.2));
}
else
{
l9_506=param_5*param_5;
}
float3 l9_507=l9_506;
float3 framebuffer=l9_507;
lighting.transmitted=framebuffer*mix(float3(1.0),surfaceProperties.albedo,float3(surfaceProperties.opacity));
surfaceProperties.opacity=1.0;
}
bool enablePremultipliedAlpha=false;
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
enablePremultipliedAlpha=true;
}
SurfaceProperties param_6=surfaceProperties;
LightingComponents param_7=lighting;
bool param_8=enablePremultipliedAlpha;
float3 l9_508=param_6.albedo*(param_7.directDiffuse+(param_7.indirectDiffuse*param_6.ao));
float3 l9_509=param_7.directSpecular+(param_7.indirectSpecular*param_6.specularAo);
float3 l9_510=param_6.emissive;
float3 l9_511=param_7.transmitted;
if (param_8)
{
float l9_512=param_6.opacity;
l9_508*=srgbToLinear(l9_512);
}
float3 l9_513=((l9_508+l9_509)+l9_510)+l9_511;
float3 l9_514=l9_513;
float4 Output=float4(l9_514,surfaceProperties.opacity);
if ((int(sc_IsEditor_tmp)!=0))
{
Output.x+=((surfaceProperties.ao.x*surfaceProperties.specularAo.x)*9.9999997e-06);
}
if (UserUniforms.sc_RayTracingCasterConfiguration.x!=0u)
{
return Output;
}
if (!(int(sc_BlendMode_Multiply_tmp)!=0))
{
float3 param_9=Output.xyz;
float l9_515=1.8;
float l9_516=1.4;
float l9_517=0.5;
float l9_518=1.5;
float3 l9_519=(param_9*((param_9*l9_515)+float3(l9_516)))/((param_9*((param_9*l9_515)+float3(l9_517)))+float3(l9_518));
Output=float4(l9_519.x,l9_519.y,l9_519.z,Output.w);
}
float3 param_10=Output.xyz;
float l9_520=param_10.x;
float l9_521=param_10.y;
float l9_522=param_10.z;
float3 l9_523=float3(linearToSrgb(l9_520),linearToSrgb(l9_521),linearToSrgb(l9_522));
Output=float4(l9_523.x,l9_523.y,l9_523.z,Output.w);
return Output;
}
float transformSingleColor(thread const float& original,thread const float& intMap,thread const float& target)
{
if (((int(BLEND_MODE_REALISTIC_tmp)!=0)||(int(BLEND_MODE_FORGRAY_tmp)!=0))||(int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
return original/pow(1.0-target,intMap);
}
else
{
if ((int(BLEND_MODE_DIVISION_tmp)!=0))
{
return original/(1.0-target);
}
else
{
if ((int(BLEND_MODE_BRIGHT_tmp)!=0))
{
return original/pow(1.0-target,2.0-(2.0*original));
}
}
}
return 0.0;
}
float3 transformColor(thread const float& yValue,thread const float3& original,thread const float3& target,thread const float& weight,thread const float& intMap)
{
if ((int(BLEND_MODE_INTENSE_tmp)!=0))
{
float3 param=original;
float3 l9_0=param;
float4 l9_1;
if (l9_0.y<l9_0.z)
{
l9_1=float4(l9_0.zy,-1.0,0.66666669);
}
else
{
l9_1=float4(l9_0.yz,0.0,-0.33333334);
}
float4 l9_2=l9_1;
float4 l9_3;
if (l9_0.x<l9_2.x)
{
l9_3=float4(l9_2.xyw,l9_0.x);
}
else
{
l9_3=float4(l9_0.x,l9_2.yzx);
}
float4 l9_4=l9_3;
float l9_5=l9_4.x-fast::min(l9_4.w,l9_4.y);
float l9_6=abs(((l9_4.w-l9_4.y)/((6.0*l9_5)+1e-07))+l9_4.z);
float l9_7=l9_4.x;
float3 l9_8=float3(l9_6,l9_5,l9_7);
float3 l9_9=l9_8;
float l9_10=l9_9.z-(l9_9.y*0.5);
float l9_11=l9_9.y/((1.0-abs((2.0*l9_10)-1.0))+1e-07);
float3 l9_12=float3(l9_9.x,l9_11,l9_10);
float3 hslOrig=l9_12;
float3 res=float3(0.0);
res.x=target.x;
res.y=target.y;
res.z=hslOrig.z;
float3 param_1=res;
float l9_13=param_1.x;
float l9_14=abs((6.0*l9_13)-3.0)-1.0;
float l9_15=2.0-abs((6.0*l9_13)-2.0);
float l9_16=2.0-abs((6.0*l9_13)-4.0);
float3 l9_17=fast::clamp(float3(l9_14,l9_15,l9_16),float3(0.0),float3(1.0));
float3 l9_18=l9_17;
float l9_19=(1.0-abs((2.0*param_1.z)-1.0))*param_1.y;
l9_18=((l9_18-float3(0.5))*l9_19)+float3(param_1.z);
float3 l9_20=l9_18;
res=l9_20;
float3 resColor=mix(original,res,float3(weight));
return resColor;
}
else
{
float3 tmpColor=float3(0.0);
float param_2=yValue;
float param_3=intMap;
float param_4=target.x;
tmpColor.x=transformSingleColor(param_2,param_3,param_4);
float param_5=yValue;
float param_6=intMap;
float param_7=target.y;
tmpColor.y=transformSingleColor(param_5,param_6,param_7);
float param_8=yValue;
float param_9=intMap;
float param_10=target.z;
tmpColor.z=transformSingleColor(param_8,param_9,param_10);
tmpColor=fast::clamp(tmpColor,float3(0.0),float3(1.0));
float3 resColor_1=mix(original,tmpColor,float3(weight));
return resColor_1;
}
}
float3 definedBlend(thread const float3& a,thread const float3& b,thread int& varStereoViewID,constant userUniformsObj& UserUniforms,thread texture2d<float> intensityTexture,thread sampler intensityTextureSmpSC)
{
if ((int(BLEND_MODE_LIGHTEN_tmp)!=0))
{
return fast::max(a,b);
}
else
{
if ((int(BLEND_MODE_DARKEN_tmp)!=0))
{
return fast::min(a,b);
}
else
{
if ((int(BLEND_MODE_DIVIDE_tmp)!=0))
{
return b/a;
}
else
{
if ((int(BLEND_MODE_AVERAGE_tmp)!=0))
{
return (a+b)*0.5;
}
else
{
if ((int(BLEND_MODE_SUBTRACT_tmp)!=0))
{
return fast::max((a+b)-float3(1.0),float3(0.0));
}
else
{
if ((int(BLEND_MODE_DIFFERENCE_tmp)!=0))
{
return abs(a-b);
}
else
{
if ((int(BLEND_MODE_NEGATION_tmp)!=0))
{
return float3(1.0)-abs((float3(1.0)-a)-b);
}
else
{
if ((int(BLEND_MODE_EXCLUSION_tmp)!=0))
{
return (a+b)-((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_OVERLAY_tmp)!=0))
{
float l9_0;
if (a.x<0.5)
{
l9_0=(2.0*a.x)*b.x;
}
else
{
l9_0=1.0-((2.0*(1.0-a.x))*(1.0-b.x));
}
float l9_1=l9_0;
float l9_2;
if (a.y<0.5)
{
l9_2=(2.0*a.y)*b.y;
}
else
{
l9_2=1.0-((2.0*(1.0-a.y))*(1.0-b.y));
}
float l9_3=l9_2;
float l9_4;
if (a.z<0.5)
{
l9_4=(2.0*a.z)*b.z;
}
else
{
l9_4=1.0-((2.0*(1.0-a.z))*(1.0-b.z));
}
return float3(l9_1,l9_3,l9_4);
}
else
{
if ((int(BLEND_MODE_SOFT_LIGHT_tmp)!=0))
{
return (((float3(1.0)-(b*2.0))*a)*a)+((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_HARD_LIGHT_tmp)!=0))
{
float l9_5;
if (b.x<0.5)
{
l9_5=(2.0*b.x)*a.x;
}
else
{
l9_5=1.0-((2.0*(1.0-b.x))*(1.0-a.x));
}
float l9_6=l9_5;
float l9_7;
if (b.y<0.5)
{
l9_7=(2.0*b.y)*a.y;
}
else
{
l9_7=1.0-((2.0*(1.0-b.y))*(1.0-a.y));
}
float l9_8=l9_7;
float l9_9;
if (b.z<0.5)
{
l9_9=(2.0*b.z)*a.z;
}
else
{
l9_9=1.0-((2.0*(1.0-b.z))*(1.0-a.z));
}
return float3(l9_6,l9_8,l9_9);
}
else
{
if ((int(BLEND_MODE_COLOR_DODGE_tmp)!=0))
{
float l9_10;
if (b.x==1.0)
{
l9_10=b.x;
}
else
{
l9_10=fast::min(a.x/(1.0-b.x),1.0);
}
float l9_11=l9_10;
float l9_12;
if (b.y==1.0)
{
l9_12=b.y;
}
else
{
l9_12=fast::min(a.y/(1.0-b.y),1.0);
}
float l9_13=l9_12;
float l9_14;
if (b.z==1.0)
{
l9_14=b.z;
}
else
{
l9_14=fast::min(a.z/(1.0-b.z),1.0);
}
return float3(l9_11,l9_13,l9_14);
}
else
{
if ((int(BLEND_MODE_COLOR_BURN_tmp)!=0))
{
float l9_15;
if (b.x==0.0)
{
l9_15=b.x;
}
else
{
l9_15=fast::max(1.0-((1.0-a.x)/b.x),0.0);
}
float l9_16=l9_15;
float l9_17;
if (b.y==0.0)
{
l9_17=b.y;
}
else
{
l9_17=fast::max(1.0-((1.0-a.y)/b.y),0.0);
}
float l9_18=l9_17;
float l9_19;
if (b.z==0.0)
{
l9_19=b.z;
}
else
{
l9_19=fast::max(1.0-((1.0-a.z)/b.z),0.0);
}
return float3(l9_16,l9_18,l9_19);
}
else
{
if ((int(BLEND_MODE_LINEAR_LIGHT_tmp)!=0))
{
float l9_20;
if (b.x<0.5)
{
l9_20=fast::max((a.x+(2.0*b.x))-1.0,0.0);
}
else
{
l9_20=fast::min(a.x+(2.0*(b.x-0.5)),1.0);
}
float l9_21=l9_20;
float l9_22;
if (b.y<0.5)
{
l9_22=fast::max((a.y+(2.0*b.y))-1.0,0.0);
}
else
{
l9_22=fast::min(a.y+(2.0*(b.y-0.5)),1.0);
}
float l9_23=l9_22;
float l9_24;
if (b.z<0.5)
{
l9_24=fast::max((a.z+(2.0*b.z))-1.0,0.0);
}
else
{
l9_24=fast::min(a.z+(2.0*(b.z-0.5)),1.0);
}
return float3(l9_21,l9_23,l9_24);
}
else
{
if ((int(BLEND_MODE_VIVID_LIGHT_tmp)!=0))
{
float l9_25;
if (b.x<0.5)
{
float l9_26;
if ((2.0*b.x)==0.0)
{
l9_26=2.0*b.x;
}
else
{
l9_26=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_25=l9_26;
}
else
{
float l9_27;
if ((2.0*(b.x-0.5))==1.0)
{
l9_27=2.0*(b.x-0.5);
}
else
{
l9_27=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_25=l9_27;
}
float l9_28=l9_25;
float l9_29;
if (b.y<0.5)
{
float l9_30;
if ((2.0*b.y)==0.0)
{
l9_30=2.0*b.y;
}
else
{
l9_30=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_29=l9_30;
}
else
{
float l9_31;
if ((2.0*(b.y-0.5))==1.0)
{
l9_31=2.0*(b.y-0.5);
}
else
{
l9_31=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_29=l9_31;
}
float l9_32=l9_29;
float l9_33;
if (b.z<0.5)
{
float l9_34;
if ((2.0*b.z)==0.0)
{
l9_34=2.0*b.z;
}
else
{
l9_34=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_33=l9_34;
}
else
{
float l9_35;
if ((2.0*(b.z-0.5))==1.0)
{
l9_35=2.0*(b.z-0.5);
}
else
{
l9_35=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_33=l9_35;
}
return float3(l9_28,l9_32,l9_33);
}
else
{
if ((int(BLEND_MODE_PIN_LIGHT_tmp)!=0))
{
float l9_36;
if (b.x<0.5)
{
l9_36=fast::min(a.x,2.0*b.x);
}
else
{
l9_36=fast::max(a.x,2.0*(b.x-0.5));
}
float l9_37=l9_36;
float l9_38;
if (b.y<0.5)
{
l9_38=fast::min(a.y,2.0*b.y);
}
else
{
l9_38=fast::max(a.y,2.0*(b.y-0.5));
}
float l9_39=l9_38;
float l9_40;
if (b.z<0.5)
{
l9_40=fast::min(a.z,2.0*b.z);
}
else
{
l9_40=fast::max(a.z,2.0*(b.z-0.5));
}
return float3(l9_37,l9_39,l9_40);
}
else
{
if ((int(BLEND_MODE_HARD_MIX_tmp)!=0))
{
float l9_41;
if (b.x<0.5)
{
float l9_42;
if ((2.0*b.x)==0.0)
{
l9_42=2.0*b.x;
}
else
{
l9_42=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_41=l9_42;
}
else
{
float l9_43;
if ((2.0*(b.x-0.5))==1.0)
{
l9_43=2.0*(b.x-0.5);
}
else
{
l9_43=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_41=l9_43;
}
float l9_44=l9_41;
float l9_45;
if (b.y<0.5)
{
float l9_46;
if ((2.0*b.y)==0.0)
{
l9_46=2.0*b.y;
}
else
{
l9_46=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_45=l9_46;
}
else
{
float l9_47;
if ((2.0*(b.y-0.5))==1.0)
{
l9_47=2.0*(b.y-0.5);
}
else
{
l9_47=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_45=l9_47;
}
float l9_48=l9_45;
float l9_49;
if (b.z<0.5)
{
float l9_50;
if ((2.0*b.z)==0.0)
{
l9_50=2.0*b.z;
}
else
{
l9_50=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_49=l9_50;
}
else
{
float l9_51;
if ((2.0*(b.z-0.5))==1.0)
{
l9_51=2.0*(b.z-0.5);
}
else
{
l9_51=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_49=l9_51;
}
return float3((l9_44<0.5) ? 0.0 : 1.0,(l9_48<0.5) ? 0.0 : 1.0,(l9_49<0.5) ? 0.0 : 1.0);
}
else
{
if ((int(BLEND_MODE_HARD_REFLECT_tmp)!=0))
{
float l9_52;
if (b.x==1.0)
{
l9_52=b.x;
}
else
{
l9_52=fast::min((a.x*a.x)/(1.0-b.x),1.0);
}
float l9_53=l9_52;
float l9_54;
if (b.y==1.0)
{
l9_54=b.y;
}
else
{
l9_54=fast::min((a.y*a.y)/(1.0-b.y),1.0);
}
float l9_55=l9_54;
float l9_56;
if (b.z==1.0)
{
l9_56=b.z;
}
else
{
l9_56=fast::min((a.z*a.z)/(1.0-b.z),1.0);
}
return float3(l9_53,l9_55,l9_56);
}
else
{
if ((int(BLEND_MODE_HARD_GLOW_tmp)!=0))
{
float l9_57;
if (a.x==1.0)
{
l9_57=a.x;
}
else
{
l9_57=fast::min((b.x*b.x)/(1.0-a.x),1.0);
}
float l9_58=l9_57;
float l9_59;
if (a.y==1.0)
{
l9_59=a.y;
}
else
{
l9_59=fast::min((b.y*b.y)/(1.0-a.y),1.0);
}
float l9_60=l9_59;
float l9_61;
if (a.z==1.0)
{
l9_61=a.z;
}
else
{
l9_61=fast::min((b.z*b.z)/(1.0-a.z),1.0);
}
return float3(l9_58,l9_60,l9_61);
}
else
{
if ((int(BLEND_MODE_HARD_PHOENIX_tmp)!=0))
{
return (fast::min(a,b)-fast::max(a,b))+float3(1.0);
}
else
{
if ((int(BLEND_MODE_HUE_tmp)!=0))
{
float3 param=a;
float3 param_1=b;
float3 l9_62=param;
float3 l9_63=l9_62;
float4 l9_64;
if (l9_63.y<l9_63.z)
{
l9_64=float4(l9_63.zy,-1.0,0.66666669);
}
else
{
l9_64=float4(l9_63.yz,0.0,-0.33333334);
}
float4 l9_65=l9_64;
float4 l9_66;
if (l9_63.x<l9_65.x)
{
l9_66=float4(l9_65.xyw,l9_63.x);
}
else
{
l9_66=float4(l9_63.x,l9_65.yzx);
}
float4 l9_67=l9_66;
float l9_68=l9_67.x-fast::min(l9_67.w,l9_67.y);
float l9_69=abs(((l9_67.w-l9_67.y)/((6.0*l9_68)+1e-07))+l9_67.z);
float l9_70=l9_67.x;
float3 l9_71=float3(l9_69,l9_68,l9_70);
float3 l9_72=l9_71;
float l9_73=l9_72.z-(l9_72.y*0.5);
float l9_74=l9_72.y/((1.0-abs((2.0*l9_73)-1.0))+1e-07);
float3 l9_75=float3(l9_72.x,l9_74,l9_73);
float3 l9_76=l9_75;
float3 l9_77=param_1;
float3 l9_78=l9_77;
float4 l9_79;
if (l9_78.y<l9_78.z)
{
l9_79=float4(l9_78.zy,-1.0,0.66666669);
}
else
{
l9_79=float4(l9_78.yz,0.0,-0.33333334);
}
float4 l9_80=l9_79;
float4 l9_81;
if (l9_78.x<l9_80.x)
{
l9_81=float4(l9_80.xyw,l9_78.x);
}
else
{
l9_81=float4(l9_78.x,l9_80.yzx);
}
float4 l9_82=l9_81;
float l9_83=l9_82.x-fast::min(l9_82.w,l9_82.y);
float l9_84=abs(((l9_82.w-l9_82.y)/((6.0*l9_83)+1e-07))+l9_82.z);
float l9_85=l9_82.x;
float3 l9_86=float3(l9_84,l9_83,l9_85);
float3 l9_87=l9_86;
float l9_88=l9_87.z-(l9_87.y*0.5);
float l9_89=l9_87.y/((1.0-abs((2.0*l9_88)-1.0))+1e-07);
float3 l9_90=float3(l9_87.x,l9_89,l9_88);
float3 l9_91=float3(l9_90.x,l9_76.y,l9_76.z);
float l9_92=l9_91.x;
float l9_93=abs((6.0*l9_92)-3.0)-1.0;
float l9_94=2.0-abs((6.0*l9_92)-2.0);
float l9_95=2.0-abs((6.0*l9_92)-4.0);
float3 l9_96=fast::clamp(float3(l9_93,l9_94,l9_95),float3(0.0),float3(1.0));
float3 l9_97=l9_96;
float l9_98=(1.0-abs((2.0*l9_91.z)-1.0))*l9_91.y;
l9_97=((l9_97-float3(0.5))*l9_98)+float3(l9_91.z);
float3 l9_99=l9_97;
float3 l9_100=l9_99;
return l9_100;
}
else
{
if ((int(BLEND_MODE_SATURATION_tmp)!=0))
{
float3 param_2=a;
float3 param_3=b;
float3 l9_101=param_2;
float3 l9_102=l9_101;
float4 l9_103;
if (l9_102.y<l9_102.z)
{
l9_103=float4(l9_102.zy,-1.0,0.66666669);
}
else
{
l9_103=float4(l9_102.yz,0.0,-0.33333334);
}
float4 l9_104=l9_103;
float4 l9_105;
if (l9_102.x<l9_104.x)
{
l9_105=float4(l9_104.xyw,l9_102.x);
}
else
{
l9_105=float4(l9_102.x,l9_104.yzx);
}
float4 l9_106=l9_105;
float l9_107=l9_106.x-fast::min(l9_106.w,l9_106.y);
float l9_108=abs(((l9_106.w-l9_106.y)/((6.0*l9_107)+1e-07))+l9_106.z);
float l9_109=l9_106.x;
float3 l9_110=float3(l9_108,l9_107,l9_109);
float3 l9_111=l9_110;
float l9_112=l9_111.z-(l9_111.y*0.5);
float l9_113=l9_111.y/((1.0-abs((2.0*l9_112)-1.0))+1e-07);
float3 l9_114=float3(l9_111.x,l9_113,l9_112);
float3 l9_115=l9_114;
float l9_116=l9_115.x;
float3 l9_117=param_3;
float3 l9_118=l9_117;
float4 l9_119;
if (l9_118.y<l9_118.z)
{
l9_119=float4(l9_118.zy,-1.0,0.66666669);
}
else
{
l9_119=float4(l9_118.yz,0.0,-0.33333334);
}
float4 l9_120=l9_119;
float4 l9_121;
if (l9_118.x<l9_120.x)
{
l9_121=float4(l9_120.xyw,l9_118.x);
}
else
{
l9_121=float4(l9_118.x,l9_120.yzx);
}
float4 l9_122=l9_121;
float l9_123=l9_122.x-fast::min(l9_122.w,l9_122.y);
float l9_124=abs(((l9_122.w-l9_122.y)/((6.0*l9_123)+1e-07))+l9_122.z);
float l9_125=l9_122.x;
float3 l9_126=float3(l9_124,l9_123,l9_125);
float3 l9_127=l9_126;
float l9_128=l9_127.z-(l9_127.y*0.5);
float l9_129=l9_127.y/((1.0-abs((2.0*l9_128)-1.0))+1e-07);
float3 l9_130=float3(l9_127.x,l9_129,l9_128);
float3 l9_131=float3(l9_116,l9_130.y,l9_115.z);
float l9_132=l9_131.x;
float l9_133=abs((6.0*l9_132)-3.0)-1.0;
float l9_134=2.0-abs((6.0*l9_132)-2.0);
float l9_135=2.0-abs((6.0*l9_132)-4.0);
float3 l9_136=fast::clamp(float3(l9_133,l9_134,l9_135),float3(0.0),float3(1.0));
float3 l9_137=l9_136;
float l9_138=(1.0-abs((2.0*l9_131.z)-1.0))*l9_131.y;
l9_137=((l9_137-float3(0.5))*l9_138)+float3(l9_131.z);
float3 l9_139=l9_137;
float3 l9_140=l9_139;
return l9_140;
}
else
{
if ((int(BLEND_MODE_COLOR_tmp)!=0))
{
float3 param_4=a;
float3 param_5=b;
float3 l9_141=param_5;
float3 l9_142=l9_141;
float4 l9_143;
if (l9_142.y<l9_142.z)
{
l9_143=float4(l9_142.zy,-1.0,0.66666669);
}
else
{
l9_143=float4(l9_142.yz,0.0,-0.33333334);
}
float4 l9_144=l9_143;
float4 l9_145;
if (l9_142.x<l9_144.x)
{
l9_145=float4(l9_144.xyw,l9_142.x);
}
else
{
l9_145=float4(l9_142.x,l9_144.yzx);
}
float4 l9_146=l9_145;
float l9_147=l9_146.x-fast::min(l9_146.w,l9_146.y);
float l9_148=abs(((l9_146.w-l9_146.y)/((6.0*l9_147)+1e-07))+l9_146.z);
float l9_149=l9_146.x;
float3 l9_150=float3(l9_148,l9_147,l9_149);
float3 l9_151=l9_150;
float l9_152=l9_151.z-(l9_151.y*0.5);
float l9_153=l9_151.y/((1.0-abs((2.0*l9_152)-1.0))+1e-07);
float3 l9_154=float3(l9_151.x,l9_153,l9_152);
float3 l9_155=l9_154;
float l9_156=l9_155.x;
float l9_157=l9_155.y;
float3 l9_158=param_4;
float3 l9_159=l9_158;
float4 l9_160;
if (l9_159.y<l9_159.z)
{
l9_160=float4(l9_159.zy,-1.0,0.66666669);
}
else
{
l9_160=float4(l9_159.yz,0.0,-0.33333334);
}
float4 l9_161=l9_160;
float4 l9_162;
if (l9_159.x<l9_161.x)
{
l9_162=float4(l9_161.xyw,l9_159.x);
}
else
{
l9_162=float4(l9_159.x,l9_161.yzx);
}
float4 l9_163=l9_162;
float l9_164=l9_163.x-fast::min(l9_163.w,l9_163.y);
float l9_165=abs(((l9_163.w-l9_163.y)/((6.0*l9_164)+1e-07))+l9_163.z);
float l9_166=l9_163.x;
float3 l9_167=float3(l9_165,l9_164,l9_166);
float3 l9_168=l9_167;
float l9_169=l9_168.z-(l9_168.y*0.5);
float l9_170=l9_168.y/((1.0-abs((2.0*l9_169)-1.0))+1e-07);
float3 l9_171=float3(l9_168.x,l9_170,l9_169);
float3 l9_172=float3(l9_156,l9_157,l9_171.z);
float l9_173=l9_172.x;
float l9_174=abs((6.0*l9_173)-3.0)-1.0;
float l9_175=2.0-abs((6.0*l9_173)-2.0);
float l9_176=2.0-abs((6.0*l9_173)-4.0);
float3 l9_177=fast::clamp(float3(l9_174,l9_175,l9_176),float3(0.0),float3(1.0));
float3 l9_178=l9_177;
float l9_179=(1.0-abs((2.0*l9_172.z)-1.0))*l9_172.y;
l9_178=((l9_178-float3(0.5))*l9_179)+float3(l9_172.z);
float3 l9_180=l9_178;
float3 l9_181=l9_180;
return l9_181;
}
else
{
if ((int(BLEND_MODE_LUMINOSITY_tmp)!=0))
{
float3 param_6=a;
float3 param_7=b;
float3 l9_182=param_6;
float3 l9_183=l9_182;
float4 l9_184;
if (l9_183.y<l9_183.z)
{
l9_184=float4(l9_183.zy,-1.0,0.66666669);
}
else
{
l9_184=float4(l9_183.yz,0.0,-0.33333334);
}
float4 l9_185=l9_184;
float4 l9_186;
if (l9_183.x<l9_185.x)
{
l9_186=float4(l9_185.xyw,l9_183.x);
}
else
{
l9_186=float4(l9_183.x,l9_185.yzx);
}
float4 l9_187=l9_186;
float l9_188=l9_187.x-fast::min(l9_187.w,l9_187.y);
float l9_189=abs(((l9_187.w-l9_187.y)/((6.0*l9_188)+1e-07))+l9_187.z);
float l9_190=l9_187.x;
float3 l9_191=float3(l9_189,l9_188,l9_190);
float3 l9_192=l9_191;
float l9_193=l9_192.z-(l9_192.y*0.5);
float l9_194=l9_192.y/((1.0-abs((2.0*l9_193)-1.0))+1e-07);
float3 l9_195=float3(l9_192.x,l9_194,l9_193);
float3 l9_196=l9_195;
float l9_197=l9_196.x;
float l9_198=l9_196.y;
float3 l9_199=param_7;
float3 l9_200=l9_199;
float4 l9_201;
if (l9_200.y<l9_200.z)
{
l9_201=float4(l9_200.zy,-1.0,0.66666669);
}
else
{
l9_201=float4(l9_200.yz,0.0,-0.33333334);
}
float4 l9_202=l9_201;
float4 l9_203;
if (l9_200.x<l9_202.x)
{
l9_203=float4(l9_202.xyw,l9_200.x);
}
else
{
l9_203=float4(l9_200.x,l9_202.yzx);
}
float4 l9_204=l9_203;
float l9_205=l9_204.x-fast::min(l9_204.w,l9_204.y);
float l9_206=abs(((l9_204.w-l9_204.y)/((6.0*l9_205)+1e-07))+l9_204.z);
float l9_207=l9_204.x;
float3 l9_208=float3(l9_206,l9_205,l9_207);
float3 l9_209=l9_208;
float l9_210=l9_209.z-(l9_209.y*0.5);
float l9_211=l9_209.y/((1.0-abs((2.0*l9_210)-1.0))+1e-07);
float3 l9_212=float3(l9_209.x,l9_211,l9_210);
float3 l9_213=float3(l9_197,l9_198,l9_212.z);
float l9_214=l9_213.x;
float l9_215=abs((6.0*l9_214)-3.0)-1.0;
float l9_216=2.0-abs((6.0*l9_214)-2.0);
float l9_217=2.0-abs((6.0*l9_214)-4.0);
float3 l9_218=fast::clamp(float3(l9_215,l9_216,l9_217),float3(0.0),float3(1.0));
float3 l9_219=l9_218;
float l9_220=(1.0-abs((2.0*l9_213.z)-1.0))*l9_213.y;
l9_219=((l9_219-float3(0.5))*l9_220)+float3(l9_213.z);
float3 l9_221=l9_219;
float3 l9_222=l9_221;
return l9_222;
}
else
{
float3 param_8=a;
float3 param_9=b;
float3 l9_223=param_8;
float l9_224=((0.29899999*l9_223.x)+(0.58700001*l9_223.y))+(0.114*l9_223.z);
float l9_225=l9_224;
float l9_226=1.0;
float l9_227=pow(l9_225,1.0/UserUniforms.correctedIntensity);
int l9_228;
if ((int(intensityTextureHasSwappedViews_tmp)!=0))
{
int l9_229=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_229=0;
}
else
{
l9_229=varStereoViewID;
}
int l9_230=l9_229;
l9_228=1-l9_230;
}
else
{
int l9_231=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_231=0;
}
else
{
l9_231=varStereoViewID;
}
int l9_232=l9_231;
l9_228=l9_232;
}
int l9_233=l9_228;
int l9_234=intensityTextureLayout_tmp;
int l9_235=l9_233;
float2 l9_236=float2(l9_227,0.5);
bool l9_237=(int(SC_USE_UV_TRANSFORM_intensityTexture_tmp)!=0);
float3x3 l9_238=UserUniforms.intensityTextureTransform;
int2 l9_239=int2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp);
bool l9_240=(int(SC_USE_UV_MIN_MAX_intensityTexture_tmp)!=0);
float4 l9_241=UserUniforms.intensityTextureUvMinMax;
bool l9_242=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp)!=0);
float4 l9_243=UserUniforms.intensityTextureBorderColor;
float l9_244=0.0;
bool l9_245=l9_242&&(!l9_240);
float l9_246=1.0;
float l9_247=l9_236.x;
int l9_248=l9_239.x;
if (l9_248==1)
{
l9_247=fract(l9_247);
}
else
{
if (l9_248==2)
{
float l9_249=fract(l9_247);
float l9_250=l9_247-l9_249;
float l9_251=step(0.25,fract(l9_250*0.5));
l9_247=mix(l9_249,1.0-l9_249,fast::clamp(l9_251,0.0,1.0));
}
}
l9_236.x=l9_247;
float l9_252=l9_236.y;
int l9_253=l9_239.y;
if (l9_253==1)
{
l9_252=fract(l9_252);
}
else
{
if (l9_253==2)
{
float l9_254=fract(l9_252);
float l9_255=l9_252-l9_254;
float l9_256=step(0.25,fract(l9_255*0.5));
l9_252=mix(l9_254,1.0-l9_254,fast::clamp(l9_256,0.0,1.0));
}
}
l9_236.y=l9_252;
if (l9_240)
{
bool l9_257=l9_242;
bool l9_258;
if (l9_257)
{
l9_258=l9_239.x==3;
}
else
{
l9_258=l9_257;
}
float l9_259=l9_236.x;
float l9_260=l9_241.x;
float l9_261=l9_241.z;
bool l9_262=l9_258;
float l9_263=l9_246;
float l9_264=fast::clamp(l9_259,l9_260,l9_261);
float l9_265=step(abs(l9_259-l9_264),9.9999997e-06);
l9_263*=(l9_265+((1.0-float(l9_262))*(1.0-l9_265)));
l9_259=l9_264;
l9_236.x=l9_259;
l9_246=l9_263;
bool l9_266=l9_242;
bool l9_267;
if (l9_266)
{
l9_267=l9_239.y==3;
}
else
{
l9_267=l9_266;
}
float l9_268=l9_236.y;
float l9_269=l9_241.y;
float l9_270=l9_241.w;
bool l9_271=l9_267;
float l9_272=l9_246;
float l9_273=fast::clamp(l9_268,l9_269,l9_270);
float l9_274=step(abs(l9_268-l9_273),9.9999997e-06);
l9_272*=(l9_274+((1.0-float(l9_271))*(1.0-l9_274)));
l9_268=l9_273;
l9_236.y=l9_268;
l9_246=l9_272;
}
float2 l9_275=l9_236;
bool l9_276=l9_237;
float3x3 l9_277=l9_238;
if (l9_276)
{
l9_275=float2((l9_277*float3(l9_275,1.0)).xy);
}
float2 l9_278=l9_275;
l9_236=l9_278;
float l9_279=l9_236.x;
int l9_280=l9_239.x;
bool l9_281=l9_245;
float l9_282=l9_246;
if ((l9_280==0)||(l9_280==3))
{
float l9_283=l9_279;
float l9_284=0.0;
float l9_285=1.0;
bool l9_286=l9_281;
float l9_287=l9_282;
float l9_288=fast::clamp(l9_283,l9_284,l9_285);
float l9_289=step(abs(l9_283-l9_288),9.9999997e-06);
l9_287*=(l9_289+((1.0-float(l9_286))*(1.0-l9_289)));
l9_283=l9_288;
l9_279=l9_283;
l9_282=l9_287;
}
l9_236.x=l9_279;
l9_246=l9_282;
float l9_290=l9_236.y;
int l9_291=l9_239.y;
bool l9_292=l9_245;
float l9_293=l9_246;
if ((l9_291==0)||(l9_291==3))
{
float l9_294=l9_290;
float l9_295=0.0;
float l9_296=1.0;
bool l9_297=l9_292;
float l9_298=l9_293;
float l9_299=fast::clamp(l9_294,l9_295,l9_296);
float l9_300=step(abs(l9_294-l9_299),9.9999997e-06);
l9_298*=(l9_300+((1.0-float(l9_297))*(1.0-l9_300)));
l9_294=l9_299;
l9_290=l9_294;
l9_293=l9_298;
}
l9_236.y=l9_290;
l9_246=l9_293;
float2 l9_301=l9_236;
int l9_302=l9_234;
int l9_303=l9_235;
float l9_304=l9_244;
float2 l9_305=l9_301;
int l9_306=l9_302;
int l9_307=l9_303;
float3 l9_308=float3(0.0);
if (l9_306==0)
{
l9_308=float3(l9_305,0.0);
}
else
{
if (l9_306==1)
{
l9_308=float3(l9_305.x,(l9_305.y*0.5)+(0.5-(float(l9_307)*0.5)),0.0);
}
else
{
l9_308=float3(l9_305,float(l9_307));
}
}
float3 l9_309=l9_308;
float3 l9_310=l9_309;
float4 l9_311=intensityTexture.sample(intensityTextureSmpSC,l9_310.xy,bias(l9_304));
float4 l9_312=l9_311;
if (l9_242)
{
l9_312=mix(l9_243,l9_312,float4(l9_246));
}
float4 l9_313=l9_312;
float3 l9_314=l9_313.xyz;
float3 l9_315=l9_314;
float l9_316=16.0;
float l9_317=((((l9_315.x*256.0)+l9_315.y)+(l9_315.z/256.0))/257.00391)*l9_316;
float l9_318=l9_317;
if ((int(BLEND_MODE_FORGRAY_tmp)!=0))
{
l9_318=fast::max(l9_318,1.0);
}
if ((int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
l9_318=fast::min(l9_318,1.0);
}
float l9_319=l9_225;
float3 l9_320=param_8;
float3 l9_321=param_9;
float l9_322=l9_226;
float l9_323=l9_318;
float3 l9_324=transformColor(l9_319,l9_320,l9_321,l9_322,l9_323);
return l9_324;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
float4 sc_OutputMotionVectorIfNeeded(thread const float4& finalColor,thread float4& varPosAndMotion,thread float4& varNormalAndMotion)
{
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float2 param=float2(varPosAndMotion.w,varNormalAndMotion.w);
float l9_0=(param.x*5.0)+0.5;
float l9_1=floor(l9_0*65535.0);
float l9_2=floor(l9_1*0.00390625);
float2 l9_3=float2(l9_2/255.0,(l9_1-(l9_2*256.0))/255.0);
float l9_4=(param.y*5.0)+0.5;
float l9_5=floor(l9_4*65535.0);
float l9_6=floor(l9_5*0.00390625);
float2 l9_7=float2(l9_6/255.0,(l9_5-(l9_6*256.0))/255.0);
float4 l9_8=float4(l9_3,l9_7);
return l9_8;
}
else
{
return finalColor;
}
}
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_frag_out out={};
float4 N31_PbrIn=float4(0.0);
bool N31_EnableTransmission=false;
float N31_Opacity=0.0;
float3 N31_Background=float3(0.0);
bool N31_EnableSheen=false;
float4 N31_SheenColor=float4(0.0);
bool N31_EnableClearcoat=false;
float N31_ClearcoatBase=0.0;
float4 N31_ClearcoatColor=float4(0.0);
float4 N31_Result=float4(0.0);
float3 N3_EmissiveColor=float3(0.0);
bool N3_EnableEmissiveTexture=false;
int N3_EmissiveTextureCoord=0;
bool N3_EnableNormalTexture=false;
float N3_NormalScale=0.0;
int N3_NormalTextureCoord=0;
float N3_MetallicValue=0.0;
float N3_RoughnessValue=0.0;
bool N3_EnableMetallicRoughnessTexture=false;
float N3_OcclusionStrength=0.0;
int N3_MaterialParamsTextureCoord=0;
bool N3_TransmissionEnable=false;
float N3_TransmissionFactor=0.0;
bool N3_EnableTransmissionTexture=false;
int N3_TransmissionTextureCoord=0;
bool N3_SheenEnable=false;
float3 N3_SheenColorFactor=float3(0.0);
bool N3_EnableSheenTexture=false;
int N3_SheenColorTextureCoord=0;
float N3_SheenRoughnessFactor=0.0;
bool N3_EnableSheenRoughnessTexture=false;
int N3_SheenRoughnessTextureCoord=0;
bool N3_ClearcoatEnable=false;
float N3_ClearcoatFactor=0.0;
bool N3_EnableClearcoatTexture=false;
int N3_ClearcoatTextureCoord=0;
float N3_ClearcoatRoughnessFactor=0.0;
bool N3_EnableClearCoatRoughnessTexture=false;
int N3_ClearcoatRoughnessTextureCoord=0;
bool N3_EnableClearCoatNormalTexture=false;
int N3_ClearcoatNormalMapCoord=0;
float3 N3_BaseColorIn=float3(0.0);
float N3_OpacityIn=0.0;
bool N3_EnableTextureTransform=false;
bool N3_EmissiveTextureTransform=false;
float2 N3_EmissiveTextureOffset=float2(0.0);
float2 N3_EmissiveTextureScale=float2(0.0);
float N3_EmissiveTextureRotation=0.0;
bool N3_NormalTextureTransform=false;
float2 N3_NormalTextureOffset=float2(0.0);
float2 N3_NormalTextureScale=float2(0.0);
float N3_NormalTextureRotation=0.0;
bool N3_MaterialParamsTextureTransform=false;
float2 N3_MaterialParamsTextureOffset=float2(0.0);
float2 N3_MaterialParamsTextureScale=float2(0.0);
float N3_MaterialParamsTextureRotation=0.0;
bool N3_TransmissionTextureTransform=false;
float2 N3_TransmissionTextureOffset=float2(0.0);
float2 N3_TransmissionTextureScale=float2(0.0);
float N3_TransmissionTextureRotation=0.0;
bool N3_SheenColorTextureTransform=false;
float2 N3_SheenColorTextureOffset=float2(0.0);
float2 N3_SheenColorTextureScale=float2(0.0);
float N3_SheenColorTextureRotation=0.0;
bool N3_SheenRoughnessTextureTransform=false;
float2 N3_SheenRoughnessTextureOffset=float2(0.0);
float2 N3_SheenRoughnessTextureScale=float2(0.0);
float N3_SheenRoughnessTextureRotation=0.0;
bool N3_ClearcoatTextureTransform=false;
float2 N3_ClearcoatTextureOffset=float2(0.0);
float2 N3_ClearcoatTextureScale=float2(0.0);
float N3_ClearcoatTextureRotation=0.0;
bool N3_ClearcoatNormalTextureTransform=false;
float2 N3_ClearcoatNormalTextureOffset=float2(0.0);
float2 N3_ClearcoatNormalTextureScale=float2(0.0);
float N3_ClearcoatNormalTextureRotation=0.0;
bool N3_ClearcoatRoughnessTextureTransform=false;
float2 N3_ClearcoatRoughnessTextureOffset=float2(0.0);
float2 N3_ClearcoatRoughnessTextureScale=float2(0.0);
float N3_ClearcoatRoughnessTextureRotation=0.0;
float3 N3_BaseColor=float3(0.0);
float N3_Opacity=0.0;
float3 N3_Normal=float3(0.0);
float3 N3_Emissive=float3(0.0);
float N3_Metallic=0.0;
float N3_Roughness=0.0;
float4 N3_Occlusion=float4(0.0);
float3 N3_Background=float3(0.0);
float4 N3_SheenOut=float4(0.0);
float N3_ClearcoatBase=0.0;
float3 N3_ClearcoatNormal=float3(0.0);
float N3_ClearcoatRoughness=0.0;
bool N35_EnableVertexColor=false;
bool N35_EnableBaseTexture=false;
int N35_BaseColorTextureCoord=0;
float4 N35_BaseColorFactor=float4(0.0);
bool N35_EnableTextureTransform=false;
bool N35_BaseTextureTransform=false;
float2 N35_BaseTextureOffset=float2(0.0);
float2 N35_BaseTextureScale=float2(0.0);
float N35_BaseTextureRotation=0.0;
float3 N35_BaseColor=float3(0.0);
float N35_Opacity=0.0;
float4 N35_UnlitColor=float4(0.0);
if ((int(sc_DepthOnly_tmp)!=0))
{
return out;
}
if ((sc_StereoRenderingMode_tmp==1)&&(sc_StereoRendering_IsClipDistanceEnabled_tmp==0))
{
if (in.varClipDistance<0.0)
{
discard_fragment();
}
}
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=in.PreviewVertexColor;
PreviewInfo.Saved=((in.PreviewVertexSaved*1.0)!=0.0) ? true : false;
float4 FinalColor=float4(1.0);
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 l9_0=gl_FragCoord;
int2 param=int2(l9_0.xy);
sc_RayTracingHitPayload rhp=sc_RayTracingEvaluateHitPayload(param,(*sc_set0.UserUniforms),(*sc_set0.sc_RayTracingCasterVertexBuffer),(*sc_set0.sc_RayTracingCasterNonAnimatedVertexBuffer),(*sc_set0.sc_RayTracingCasterIndexBuffer),sc_set0.sc_RayTracingHitCasterIdAndBarycentric,sc_set0.sc_RayTracingHitCasterIdAndBarycentricSmpSC,sc_set0.sc_RayTracingRayDirection,sc_set0.sc_RayTracingRayDirectionSmpSC);
if (rhp.id.x!=((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.y&65535u))
{
return out;
}
Globals.BumpedNormal=float3(0.0);
Globals.ViewDirWS=rhp.viewDirWS;
Globals.PositionWS=rhp.positionWS;
Globals.SurfacePosition_WorldSpace=rhp.positionWS;
Globals.VertexNormal_WorldSpace=rhp.normalWS;
Globals.VertexTangent_WorldSpace=rhp.tangentWS.xyz;
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*rhp.tangentWS.w;
Globals.Surface_UVCoord0=rhp.uv0;
Globals.Surface_UVCoord1=rhp.uv1;
int l9_1=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1=0;
}
else
{
l9_1=in.varStereoViewID;
}
int l9_2=l9_1;
float4 emitterPositionCS=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_2]*float4(rhp.positionWS,1.0);
Globals.gScreenCoord=((emitterPositionCS.xy/float2(emitterPositionCS.w))*0.5)+float2(0.5);
Globals.VertexColor=rhp.color;
}
else
{
Globals.BumpedNormal=float3(0.0);
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-in.varPosAndMotion.xyz);
Globals.PositionWS=in.varPosAndMotion.xyz;
Globals.SurfacePosition_WorldSpace=in.varPosAndMotion.xyz;
Globals.VertexNormal_WorldSpace=normalize(in.varNormalAndMotion.xyz);
Globals.VertexTangent_WorldSpace=normalize(in.varTangent.xyz);
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*in.varTangent.w;
Globals.Surface_UVCoord0=in.varTex01.xy;
Globals.Surface_UVCoord1=in.varTex01.zw;
float4 l9_3=gl_FragCoord;
float2 l9_4=l9_3.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_5=l9_4;
float2 l9_6=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_7=1;
int l9_8=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_8=0;
}
else
{
l9_8=in.varStereoViewID;
}
int l9_9=l9_8;
int l9_10=l9_9;
float3 l9_11=float3(l9_5,0.0);
int l9_12=l9_7;
int l9_13=l9_10;
if (l9_12==1)
{
l9_11.y=((2.0*l9_11.y)+float(l9_13))-1.0;
}
float2 l9_14=l9_11.xy;
l9_6=l9_14;
}
else
{
l9_6=l9_5;
}
float2 l9_15=l9_6;
float2 l9_16=l9_15;
Globals.gScreenCoord=l9_16;
Globals.VertexColor=in.varColor;
}
float4 Output_N17=float4(0.0);
float4 param_1=float4(1.0);
float4 param_2=float4(0.0);
ssGlobals param_4=Globals;
ssGlobals tempGlobals;
float4 param_3;
if ((int(ENABLE_GLTF_LIGHTING_tmp)!=0))
{
float3 l9_17=float3(0.0);
float3 l9_18=(*sc_set0.UserUniforms).emissiveFactor;
l9_17=l9_18;
float l9_19=0.0;
float l9_20=1.0;
float l9_21=(*sc_set0.UserUniforms).Port_Input2_N043;
float l9_22;
if ((int(ENABLE_NORMALMAP_tmp)!=0))
{
float l9_23=0.0;
float l9_24=(*sc_set0.UserUniforms).normalTextureScale;
l9_23=l9_24;
l9_20=l9_23;
l9_22=l9_20;
}
else
{
l9_22=l9_21;
}
l9_19=l9_22;
float l9_25=0.0;
float l9_26=(*sc_set0.UserUniforms).metallicFactor;
l9_25=l9_26;
float l9_27=0.0;
float l9_28=(*sc_set0.UserUniforms).roughnessFactor;
l9_27=l9_28;
float l9_29=0.0;
float l9_30=1.0;
float l9_31=(*sc_set0.UserUniforms).Port_Input2_N062;
float l9_32;
if ((int(ENABLE_METALLIC_ROUGHNESS_TEX_tmp)!=0))
{
float l9_33=0.0;
float l9_34=(*sc_set0.UserUniforms).occlusionTextureStrength;
l9_33=l9_34;
l9_30=l9_33;
l9_32=l9_30;
}
else
{
l9_32=l9_31;
}
l9_29=l9_32;
float l9_35=0.0;
float l9_36=(*sc_set0.UserUniforms).transmissionFactor;
l9_35=l9_36;
float3 l9_37=float3(0.0);
float3 l9_38=(*sc_set0.UserUniforms).sheenColorFactor;
l9_37=l9_38;
float l9_39=0.0;
float l9_40=(*sc_set0.UserUniforms).sheenRoughnessFactor;
l9_39=l9_40;
float l9_41=0.0;
float l9_42=(*sc_set0.UserUniforms).clearcoatFactor;
l9_41=l9_42;
float l9_43=0.0;
float l9_44=(*sc_set0.UserUniforms).clearcoatRoughnessFactor;
l9_43=l9_44;
float4 l9_45=float4(0.0);
float4 l9_46=(*sc_set0.UserUniforms).baseColorFactor;
l9_45=l9_46;
float2 l9_47=float2(0.0);
float2 l9_48=(*sc_set0.UserUniforms).baseColorTexture_offset;
l9_47=l9_48;
float2 l9_49=float2(0.0);
float2 l9_50=(*sc_set0.UserUniforms).baseColorTexture_scale;
l9_49=l9_50;
float l9_51=0.0;
float l9_52=(*sc_set0.UserUniforms).baseColorTexture_rotation;
l9_51=l9_52;
float3 l9_53=float3(0.0);
float l9_54=0.0;
float4 l9_55=l9_45;
float2 l9_56=l9_47;
float2 l9_57=l9_49;
float l9_58=l9_51;
ssGlobals l9_59=param_4;
tempGlobals=l9_59;
float3 l9_60=float3(0.0);
float l9_61=0.0;
N35_EnableVertexColor=(int(ENABLE_VERTEX_COLOR_BASE_tmp)!=0);
N35_EnableBaseTexture=(int(ENABLE_BASE_TEX_tmp)!=0);
N35_BaseColorTextureCoord=NODE_7_DROPLIST_ITEM_tmp;
N35_BaseColorFactor=l9_55;
N35_EnableTextureTransform=(int(ENABLE_TEXTURE_TRANSFORM_tmp)!=0);
N35_BaseTextureTransform=(int(ENABLE_BASE_TEXTURE_TRANSFORM_tmp)!=0);
N35_BaseTextureOffset=l9_56;
N35_BaseTextureScale=l9_57;
N35_BaseTextureRotation=l9_58;
float4 l9_62=N35_BaseColorFactor;
if (N35_EnableBaseTexture)
{
int l9_63=N35_BaseColorTextureCoord;
float2 l9_64=tempGlobals.Surface_UVCoord0;
float2 l9_65=l9_64;
if (l9_63==0)
{
float2 l9_66=tempGlobals.Surface_UVCoord0;
l9_65=l9_66;
}
if (l9_63==1)
{
float2 l9_67=tempGlobals.Surface_UVCoord1;
l9_65=l9_67;
}
float2 l9_68=l9_65;
float2 l9_69=l9_68;
if (N35_EnableTextureTransform&&N35_BaseTextureTransform)
{
float2 l9_70=l9_69;
float2 l9_71=N35_BaseTextureOffset;
float2 l9_72=N35_BaseTextureScale;
float l9_73=N35_BaseTextureRotation;
float3x3 l9_74=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_71.x,l9_71.y,1.0));
float3x3 l9_75=float3x3(float3(cos(l9_73),sin(l9_73),0.0),float3(-sin(l9_73),cos(l9_73),0.0),float3(0.0,0.0,1.0));
float3x3 l9_76=float3x3(float3(l9_72.x,0.0,0.0),float3(0.0,l9_72.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_77=(l9_74*l9_75)*l9_76;
float2 l9_78=(l9_77*float3(l9_70,1.0)).xy;
l9_69=l9_78;
}
float2 l9_79=l9_69;
float4 l9_80=float4(0.0);
int l9_81;
if ((int(baseColorTextureHasSwappedViews_tmp)!=0))
{
int l9_82=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_82=0;
}
else
{
l9_82=in.varStereoViewID;
}
int l9_83=l9_82;
l9_81=1-l9_83;
}
else
{
int l9_84=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_84=0;
}
else
{
l9_84=in.varStereoViewID;
}
int l9_85=l9_84;
l9_81=l9_85;
}
int l9_86=l9_81;
int l9_87=baseColorTextureLayout_tmp;
int l9_88=l9_86;
float2 l9_89=l9_79;
bool l9_90=(int(SC_USE_UV_TRANSFORM_baseColorTexture_tmp)!=0);
float3x3 l9_91=(*sc_set0.UserUniforms).baseColorTextureTransform;
int2 l9_92=int2(SC_SOFTWARE_WRAP_MODE_U_baseColorTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_baseColorTexture_tmp);
bool l9_93=(int(SC_USE_UV_MIN_MAX_baseColorTexture_tmp)!=0);
float4 l9_94=(*sc_set0.UserUniforms).baseColorTextureUvMinMax;
bool l9_95=(int(SC_USE_CLAMP_TO_BORDER_baseColorTexture_tmp)!=0);
float4 l9_96=(*sc_set0.UserUniforms).baseColorTextureBorderColor;
float l9_97=0.0;
bool l9_98=l9_95&&(!l9_93);
float l9_99=1.0;
float l9_100=l9_89.x;
int l9_101=l9_92.x;
if (l9_101==1)
{
l9_100=fract(l9_100);
}
else
{
if (l9_101==2)
{
float l9_102=fract(l9_100);
float l9_103=l9_100-l9_102;
float l9_104=step(0.25,fract(l9_103*0.5));
l9_100=mix(l9_102,1.0-l9_102,fast::clamp(l9_104,0.0,1.0));
}
}
l9_89.x=l9_100;
float l9_105=l9_89.y;
int l9_106=l9_92.y;
if (l9_106==1)
{
l9_105=fract(l9_105);
}
else
{
if (l9_106==2)
{
float l9_107=fract(l9_105);
float l9_108=l9_105-l9_107;
float l9_109=step(0.25,fract(l9_108*0.5));
l9_105=mix(l9_107,1.0-l9_107,fast::clamp(l9_109,0.0,1.0));
}
}
l9_89.y=l9_105;
if (l9_93)
{
bool l9_110=l9_95;
bool l9_111;
if (l9_110)
{
l9_111=l9_92.x==3;
}
else
{
l9_111=l9_110;
}
float l9_112=l9_89.x;
float l9_113=l9_94.x;
float l9_114=l9_94.z;
bool l9_115=l9_111;
float l9_116=l9_99;
float l9_117=fast::clamp(l9_112,l9_113,l9_114);
float l9_118=step(abs(l9_112-l9_117),9.9999997e-06);
l9_116*=(l9_118+((1.0-float(l9_115))*(1.0-l9_118)));
l9_112=l9_117;
l9_89.x=l9_112;
l9_99=l9_116;
bool l9_119=l9_95;
bool l9_120;
if (l9_119)
{
l9_120=l9_92.y==3;
}
else
{
l9_120=l9_119;
}
float l9_121=l9_89.y;
float l9_122=l9_94.y;
float l9_123=l9_94.w;
bool l9_124=l9_120;
float l9_125=l9_99;
float l9_126=fast::clamp(l9_121,l9_122,l9_123);
float l9_127=step(abs(l9_121-l9_126),9.9999997e-06);
l9_125*=(l9_127+((1.0-float(l9_124))*(1.0-l9_127)));
l9_121=l9_126;
l9_89.y=l9_121;
l9_99=l9_125;
}
float2 l9_128=l9_89;
bool l9_129=l9_90;
float3x3 l9_130=l9_91;
if (l9_129)
{
l9_128=float2((l9_130*float3(l9_128,1.0)).xy);
}
float2 l9_131=l9_128;
l9_89=l9_131;
float l9_132=l9_89.x;
int l9_133=l9_92.x;
bool l9_134=l9_98;
float l9_135=l9_99;
if ((l9_133==0)||(l9_133==3))
{
float l9_136=l9_132;
float l9_137=0.0;
float l9_138=1.0;
bool l9_139=l9_134;
float l9_140=l9_135;
float l9_141=fast::clamp(l9_136,l9_137,l9_138);
float l9_142=step(abs(l9_136-l9_141),9.9999997e-06);
l9_140*=(l9_142+((1.0-float(l9_139))*(1.0-l9_142)));
l9_136=l9_141;
l9_132=l9_136;
l9_135=l9_140;
}
l9_89.x=l9_132;
l9_99=l9_135;
float l9_143=l9_89.y;
int l9_144=l9_92.y;
bool l9_145=l9_98;
float l9_146=l9_99;
if ((l9_144==0)||(l9_144==3))
{
float l9_147=l9_143;
float l9_148=0.0;
float l9_149=1.0;
bool l9_150=l9_145;
float l9_151=l9_146;
float l9_152=fast::clamp(l9_147,l9_148,l9_149);
float l9_153=step(abs(l9_147-l9_152),9.9999997e-06);
l9_151*=(l9_153+((1.0-float(l9_150))*(1.0-l9_153)));
l9_147=l9_152;
l9_143=l9_147;
l9_146=l9_151;
}
l9_89.y=l9_143;
l9_99=l9_146;
float2 l9_154=l9_89;
int l9_155=l9_87;
int l9_156=l9_88;
float l9_157=l9_97;
float2 l9_158=l9_154;
int l9_159=l9_155;
int l9_160=l9_156;
float3 l9_161=float3(0.0);
if (l9_159==0)
{
l9_161=float3(l9_158,0.0);
}
else
{
if (l9_159==1)
{
l9_161=float3(l9_158.x,(l9_158.y*0.5)+(0.5-(float(l9_160)*0.5)),0.0);
}
else
{
l9_161=float3(l9_158,float(l9_160));
}
}
float3 l9_162=l9_161;
float3 l9_163=l9_162;
float4 l9_164=sc_set0.baseColorTexture.sample(sc_set0.baseColorTextureSmpSC,l9_163.xy,bias(l9_157));
float4 l9_165=l9_164;
if (l9_95)
{
l9_165=mix(l9_96,l9_165,float4(l9_99));
}
float4 l9_166=l9_165;
l9_80=l9_166;
float4 l9_167=l9_80;
float4 l9_168=l9_167;
float4 l9_169;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_169=float4(pow(l9_168.x,2.2),pow(l9_168.y,2.2),pow(l9_168.z,2.2),pow(l9_168.w,2.2));
}
else
{
l9_169=l9_168*l9_168;
}
float4 l9_170=l9_169;
l9_62*=l9_170;
}
if (N35_EnableVertexColor)
{
float4 l9_171=tempGlobals.VertexColor;
l9_62*=l9_171;
}
N35_BaseColor=l9_62.xyz;
N35_Opacity=l9_62.w;
float4 l9_172=l9_62;
float4 l9_173;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_173=float4(pow(l9_172.x,0.45454544),pow(l9_172.y,0.45454544),pow(l9_172.z,0.45454544),pow(l9_172.w,0.45454544));
}
else
{
l9_173=sqrt(l9_172);
}
float4 l9_174=l9_173;
N35_UnlitColor=l9_174;
l9_60=N35_BaseColor;
l9_61=N35_Opacity;
l9_53=l9_60;
l9_54=l9_61;
float2 l9_175=float2(0.0);
float2 l9_176=(*sc_set0.UserUniforms).emissiveTexture_offset;
l9_175=l9_176;
float2 l9_177=float2(0.0);
float2 l9_178=(*sc_set0.UserUniforms).emissiveTexture_scale;
l9_177=l9_178;
float l9_179=0.0;
float l9_180=(*sc_set0.UserUniforms).emissiveTexture_rotation;
l9_179=l9_180;
float2 l9_181=float2(0.0);
float2 l9_182=(*sc_set0.UserUniforms).normalTexture_offset;
l9_181=l9_182;
float2 l9_183=float2(0.0);
float2 l9_184=(*sc_set0.UserUniforms).normalTexture_scale;
l9_183=l9_184;
float l9_185=0.0;
float l9_186=(*sc_set0.UserUniforms).normalTexture_rotation;
l9_185=l9_186;
float2 l9_187=float2(0.0);
float2 l9_188=(*sc_set0.UserUniforms).metallicRoughnessTexture_offset;
l9_187=l9_188;
float2 l9_189=float2(0.0);
float2 l9_190=(*sc_set0.UserUniforms).metallicRoughnessTexture_scale;
l9_189=l9_190;
float l9_191=0.0;
float l9_192=(*sc_set0.UserUniforms).metallicRoughnessTexture_rotation;
l9_191=l9_192;
float2 l9_193=float2(0.0);
float2 l9_194=(*sc_set0.UserUniforms).transmissionTexture_offset;
l9_193=l9_194;
float2 l9_195=float2(0.0);
float2 l9_196=(*sc_set0.UserUniforms).transmissionTexture_scale;
l9_195=l9_196;
float l9_197=0.0;
float l9_198=(*sc_set0.UserUniforms).transmissionTexture_rotation;
l9_197=l9_198;
float2 l9_199=float2(0.0);
float2 l9_200=(*sc_set0.UserUniforms).sheenColorTexture_offset;
l9_199=l9_200;
float2 l9_201=float2(0.0);
float2 l9_202=(*sc_set0.UserUniforms).sheenColorTexture_scale;
l9_201=l9_202;
float l9_203=0.0;
float l9_204=(*sc_set0.UserUniforms).sheenColorTexture_rotation;
l9_203=l9_204;
float2 l9_205=float2(0.0);
float2 l9_206=(*sc_set0.UserUniforms).sheenRoughnessTexture_offset;
l9_205=l9_206;
float2 l9_207=float2(0.0);
float2 l9_208=(*sc_set0.UserUniforms).sheenRoughnessTexture_scale;
l9_207=l9_208;
float l9_209=0.0;
float l9_210=(*sc_set0.UserUniforms).sheenRoughnessTexture_rotation;
l9_209=l9_210;
float2 l9_211=float2(0.0);
float2 l9_212=(*sc_set0.UserUniforms).clearcoatTexture_offset;
l9_211=l9_212;
float2 l9_213=float2(0.0);
float2 l9_214=(*sc_set0.UserUniforms).clearcoatTexture_scale;
l9_213=l9_214;
float l9_215=0.0;
float l9_216=(*sc_set0.UserUniforms).clearcoatTexture_rotation;
l9_215=l9_216;
float2 l9_217=float2(0.0);
float2 l9_218=(*sc_set0.UserUniforms).clearcoatNormalTexture_offset;
l9_217=l9_218;
float2 l9_219=float2(0.0);
float2 l9_220=(*sc_set0.UserUniforms).clearcoatNormalTexture_scale;
l9_219=l9_220;
float l9_221=0.0;
float l9_222=(*sc_set0.UserUniforms).clearcoatNormalTexture_rotation;
l9_221=l9_222;
float2 l9_223=float2(0.0);
float2 l9_224=(*sc_set0.UserUniforms).clearcoatRoughnessTexture_offset;
l9_223=l9_224;
float2 l9_225=float2(0.0);
float2 l9_226=(*sc_set0.UserUniforms).clearcoatRoughnessTexture_scale;
l9_225=l9_226;
float l9_227=0.0;
float l9_228=(*sc_set0.UserUniforms).clearcoatRoughnessTexture_rotation;
l9_227=l9_228;
float3 l9_229=float3(0.0);
float l9_230=0.0;
float3 l9_231=float3(0.0);
float3 l9_232=float3(0.0);
float l9_233=0.0;
float l9_234=0.0;
float4 l9_235=float4(0.0);
float3 l9_236=float3(0.0);
float4 l9_237=float4(0.0);
float l9_238=0.0;
float3 l9_239=float3(0.0);
float l9_240=0.0;
float3 l9_241=l9_17;
float l9_242=l9_19;
float l9_243=l9_25;
float l9_244=l9_27;
float l9_245=l9_29;
float l9_246=l9_35;
float3 l9_247=l9_37;
float l9_248=l9_39;
float l9_249=l9_41;
float l9_250=l9_43;
float3 l9_251=l9_53;
float l9_252=l9_54;
float2 l9_253=l9_175;
float2 l9_254=l9_177;
float l9_255=l9_179;
float2 l9_256=l9_181;
float2 l9_257=l9_183;
float l9_258=l9_185;
float2 l9_259=l9_187;
float2 l9_260=l9_189;
float l9_261=l9_191;
float2 l9_262=l9_193;
float2 l9_263=l9_195;
float l9_264=l9_197;
float2 l9_265=l9_199;
float2 l9_266=l9_201;
float l9_267=l9_203;
float2 l9_268=l9_205;
float2 l9_269=l9_207;
float l9_270=l9_209;
float2 l9_271=l9_211;
float2 l9_272=l9_213;
float l9_273=l9_215;
float2 l9_274=l9_217;
float2 l9_275=l9_219;
float l9_276=l9_221;
float2 l9_277=l9_223;
float2 l9_278=l9_225;
float l9_279=l9_227;
ssGlobals l9_280=param_4;
tempGlobals=l9_280;
float3 l9_281=float3(0.0);
float l9_282=0.0;
float3 l9_283=float3(0.0);
float3 l9_284=float3(0.0);
float l9_285=0.0;
float l9_286=0.0;
float4 l9_287=float4(0.0);
float3 l9_288=float3(0.0);
float4 l9_289=float4(0.0);
float l9_290=0.0;
float3 l9_291=float3(0.0);
float l9_292=0.0;
N3_EmissiveColor=l9_241;
N3_EnableEmissiveTexture=(int(ENABLE_EMISSIVE_tmp)!=0);
N3_EmissiveTextureCoord=NODE_10_DROPLIST_ITEM_tmp;
N3_EnableNormalTexture=(int(ENABLE_NORMALMAP_tmp)!=0);
N3_NormalScale=l9_242;
N3_NormalTextureCoord=NODE_8_DROPLIST_ITEM_tmp;
N3_MetallicValue=l9_243;
N3_RoughnessValue=l9_244;
N3_EnableMetallicRoughnessTexture=(int(ENABLE_METALLIC_ROUGHNESS_TEX_tmp)!=0);
N3_OcclusionStrength=l9_245;
N3_MaterialParamsTextureCoord=NODE_11_DROPLIST_ITEM_tmp;
N3_TransmissionEnable=(int(ENABLE_TRANSMISSION_tmp)!=0);
N3_TransmissionFactor=l9_246;
N3_EnableTransmissionTexture=(int(ENABLE_TRANSMISSION_TEX_tmp)!=0);
N3_TransmissionTextureCoord=Tweak_N30_tmp;
N3_SheenEnable=(int(ENABLE_SHEEN_tmp)!=0);
N3_SheenColorFactor=l9_247;
N3_EnableSheenTexture=(int(ENABLE_SHEEN_COLOR_TEX_tmp)!=0);
N3_SheenColorTextureCoord=Tweak_N32_tmp;
N3_SheenRoughnessFactor=l9_248;
N3_EnableSheenRoughnessTexture=(int(ENABLE_SHEEN_ROUGHNESS_TEX_tmp)!=0);
N3_SheenRoughnessTextureCoord=Tweak_N37_tmp;
N3_ClearcoatEnable=(int(ENABLE_CLEARCOAT_tmp)!=0);
N3_ClearcoatFactor=l9_249;
N3_EnableClearcoatTexture=(int(ENABLE_CLEARCOAT_TEX_tmp)!=0);
N3_ClearcoatTextureCoord=Tweak_N44_tmp;
N3_ClearcoatRoughnessFactor=l9_250;
N3_EnableClearCoatRoughnessTexture=(int(ENABLE_CLEARCOAT_ROUGHNESS_TEX_tmp)!=0);
N3_ClearcoatRoughnessTextureCoord=Tweak_N60_tmp;
N3_EnableClearCoatNormalTexture=(int(ENABLE_CLEARCOAT_NORMAL_TEX_tmp)!=0);
N3_ClearcoatNormalMapCoord=Tweak_N47_tmp;
N3_BaseColorIn=l9_251;
N3_OpacityIn=l9_252;
N3_EnableTextureTransform=(int(ENABLE_TEXTURE_TRANSFORM_tmp)!=0);
N3_EmissiveTextureTransform=(int(ENABLE_EMISSIVE_TEXTURE_TRANSFORM_tmp)!=0);
N3_EmissiveTextureOffset=l9_253;
N3_EmissiveTextureScale=l9_254;
N3_EmissiveTextureRotation=l9_255;
N3_NormalTextureTransform=(int(ENABLE_NORMAL_TEXTURE_TRANSFORM_tmp)!=0);
N3_NormalTextureOffset=l9_256;
N3_NormalTextureScale=l9_257;
N3_NormalTextureRotation=l9_258;
N3_MaterialParamsTextureTransform=(int(ENABLE_METALLIC_ROUGHNESS_TEXTURE_TRANSFORM_tmp)!=0);
N3_MaterialParamsTextureOffset=l9_259;
N3_MaterialParamsTextureScale=l9_260;
N3_MaterialParamsTextureRotation=l9_261;
N3_TransmissionTextureTransform=(int(ENABLE_TRANSMISSION_TEXTURE_TRANSFORM_tmp)!=0);
N3_TransmissionTextureOffset=l9_262;
N3_TransmissionTextureScale=l9_263;
N3_TransmissionTextureRotation=l9_264;
N3_SheenColorTextureTransform=(int(ENABLE_SHEEN_COLOR_TEXTURE_TRANSFORM_tmp)!=0);
N3_SheenColorTextureOffset=l9_265;
N3_SheenColorTextureScale=l9_266;
N3_SheenColorTextureRotation=l9_267;
N3_SheenRoughnessTextureTransform=(int(ENABLE_SHEEN_ROUGHNESS_TEXTURE_TRANSFORM_tmp)!=0);
N3_SheenRoughnessTextureOffset=l9_268;
N3_SheenRoughnessTextureScale=l9_269;
N3_SheenRoughnessTextureRotation=l9_270;
N3_ClearcoatTextureTransform=(int(ENABLE_CLEARCOAT_TEXTURE_TRANSFORM_tmp)!=0);
N3_ClearcoatTextureOffset=l9_271;
N3_ClearcoatTextureScale=l9_272;
N3_ClearcoatTextureRotation=l9_273;
N3_ClearcoatNormalTextureTransform=(int(ENABLE_CLEARCOAT_NORMAL_TEXTURE_TRANSFORM_tmp)!=0);
N3_ClearcoatNormalTextureOffset=l9_274;
N3_ClearcoatNormalTextureScale=l9_275;
N3_ClearcoatNormalTextureRotation=l9_276;
N3_ClearcoatRoughnessTextureTransform=(int(ENABLE_CLEARCOAT_ROUGHNESS_TEXTURE_TRANSFORM_tmp)!=0);
N3_ClearcoatRoughnessTextureOffset=l9_277;
N3_ClearcoatRoughnessTextureScale=l9_278;
N3_ClearcoatRoughnessTextureRotation=l9_279;
N3_BaseColor=N3_BaseColorIn;
N3_Opacity=N3_OpacityIn;
N3_Emissive=N3_EmissiveColor;
if (N3_EnableEmissiveTexture)
{
float3 l9_293=N3_Emissive;
int l9_294=N3_EmissiveTextureCoord;
float2 l9_295=tempGlobals.Surface_UVCoord0;
float2 l9_296=l9_295;
if (l9_294==0)
{
float2 l9_297=tempGlobals.Surface_UVCoord0;
l9_296=l9_297;
}
if (l9_294==1)
{
float2 l9_298=tempGlobals.Surface_UVCoord1;
l9_296=l9_298;
}
float2 l9_299=l9_296;
float2 l9_300=l9_299;
if (N3_EnableTextureTransform&&N3_EmissiveTextureTransform)
{
float2 l9_301=l9_300;
float2 l9_302=N3_EmissiveTextureOffset;
float2 l9_303=N3_EmissiveTextureScale;
float l9_304=N3_EmissiveTextureRotation;
float l9_305=radians(l9_304);
float3x3 l9_306=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_302.x,l9_302.y,1.0));
float3x3 l9_307=float3x3(float3(cos(l9_305),sin(l9_305),0.0),float3(-sin(l9_305),cos(l9_305),0.0),float3(0.0,0.0,1.0));
float3x3 l9_308=float3x3(float3(l9_303.x,0.0,0.0),float3(0.0,l9_303.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_309=(l9_306*l9_307)*l9_308;
float2 l9_310=(l9_309*float3(l9_301,1.0)).xy;
l9_300=l9_310;
}
float2 l9_311=l9_300;
float4 l9_312=float4(0.0);
int l9_313;
if ((int(emissiveTextureHasSwappedViews_tmp)!=0))
{
int l9_314=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_314=0;
}
else
{
l9_314=in.varStereoViewID;
}
int l9_315=l9_314;
l9_313=1-l9_315;
}
else
{
int l9_316=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_316=0;
}
else
{
l9_316=in.varStereoViewID;
}
int l9_317=l9_316;
l9_313=l9_317;
}
int l9_318=l9_313;
int l9_319=emissiveTextureLayout_tmp;
int l9_320=l9_318;
float2 l9_321=l9_311;
bool l9_322=(int(SC_USE_UV_TRANSFORM_emissiveTexture_tmp)!=0);
float3x3 l9_323=(*sc_set0.UserUniforms).emissiveTextureTransform;
int2 l9_324=int2(SC_SOFTWARE_WRAP_MODE_U_emissiveTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_emissiveTexture_tmp);
bool l9_325=(int(SC_USE_UV_MIN_MAX_emissiveTexture_tmp)!=0);
float4 l9_326=(*sc_set0.UserUniforms).emissiveTextureUvMinMax;
bool l9_327=(int(SC_USE_CLAMP_TO_BORDER_emissiveTexture_tmp)!=0);
float4 l9_328=(*sc_set0.UserUniforms).emissiveTextureBorderColor;
float l9_329=0.0;
bool l9_330=l9_327&&(!l9_325);
float l9_331=1.0;
float l9_332=l9_321.x;
int l9_333=l9_324.x;
if (l9_333==1)
{
l9_332=fract(l9_332);
}
else
{
if (l9_333==2)
{
float l9_334=fract(l9_332);
float l9_335=l9_332-l9_334;
float l9_336=step(0.25,fract(l9_335*0.5));
l9_332=mix(l9_334,1.0-l9_334,fast::clamp(l9_336,0.0,1.0));
}
}
l9_321.x=l9_332;
float l9_337=l9_321.y;
int l9_338=l9_324.y;
if (l9_338==1)
{
l9_337=fract(l9_337);
}
else
{
if (l9_338==2)
{
float l9_339=fract(l9_337);
float l9_340=l9_337-l9_339;
float l9_341=step(0.25,fract(l9_340*0.5));
l9_337=mix(l9_339,1.0-l9_339,fast::clamp(l9_341,0.0,1.0));
}
}
l9_321.y=l9_337;
if (l9_325)
{
bool l9_342=l9_327;
bool l9_343;
if (l9_342)
{
l9_343=l9_324.x==3;
}
else
{
l9_343=l9_342;
}
float l9_344=l9_321.x;
float l9_345=l9_326.x;
float l9_346=l9_326.z;
bool l9_347=l9_343;
float l9_348=l9_331;
float l9_349=fast::clamp(l9_344,l9_345,l9_346);
float l9_350=step(abs(l9_344-l9_349),9.9999997e-06);
l9_348*=(l9_350+((1.0-float(l9_347))*(1.0-l9_350)));
l9_344=l9_349;
l9_321.x=l9_344;
l9_331=l9_348;
bool l9_351=l9_327;
bool l9_352;
if (l9_351)
{
l9_352=l9_324.y==3;
}
else
{
l9_352=l9_351;
}
float l9_353=l9_321.y;
float l9_354=l9_326.y;
float l9_355=l9_326.w;
bool l9_356=l9_352;
float l9_357=l9_331;
float l9_358=fast::clamp(l9_353,l9_354,l9_355);
float l9_359=step(abs(l9_353-l9_358),9.9999997e-06);
l9_357*=(l9_359+((1.0-float(l9_356))*(1.0-l9_359)));
l9_353=l9_358;
l9_321.y=l9_353;
l9_331=l9_357;
}
float2 l9_360=l9_321;
bool l9_361=l9_322;
float3x3 l9_362=l9_323;
if (l9_361)
{
l9_360=float2((l9_362*float3(l9_360,1.0)).xy);
}
float2 l9_363=l9_360;
l9_321=l9_363;
float l9_364=l9_321.x;
int l9_365=l9_324.x;
bool l9_366=l9_330;
float l9_367=l9_331;
if ((l9_365==0)||(l9_365==3))
{
float l9_368=l9_364;
float l9_369=0.0;
float l9_370=1.0;
bool l9_371=l9_366;
float l9_372=l9_367;
float l9_373=fast::clamp(l9_368,l9_369,l9_370);
float l9_374=step(abs(l9_368-l9_373),9.9999997e-06);
l9_372*=(l9_374+((1.0-float(l9_371))*(1.0-l9_374)));
l9_368=l9_373;
l9_364=l9_368;
l9_367=l9_372;
}
l9_321.x=l9_364;
l9_331=l9_367;
float l9_375=l9_321.y;
int l9_376=l9_324.y;
bool l9_377=l9_330;
float l9_378=l9_331;
if ((l9_376==0)||(l9_376==3))
{
float l9_379=l9_375;
float l9_380=0.0;
float l9_381=1.0;
bool l9_382=l9_377;
float l9_383=l9_378;
float l9_384=fast::clamp(l9_379,l9_380,l9_381);
float l9_385=step(abs(l9_379-l9_384),9.9999997e-06);
l9_383*=(l9_385+((1.0-float(l9_382))*(1.0-l9_385)));
l9_379=l9_384;
l9_375=l9_379;
l9_378=l9_383;
}
l9_321.y=l9_375;
l9_331=l9_378;
float2 l9_386=l9_321;
int l9_387=l9_319;
int l9_388=l9_320;
float l9_389=l9_329;
float2 l9_390=l9_386;
int l9_391=l9_387;
int l9_392=l9_388;
float3 l9_393=float3(0.0);
if (l9_391==0)
{
l9_393=float3(l9_390,0.0);
}
else
{
if (l9_391==1)
{
l9_393=float3(l9_390.x,(l9_390.y*0.5)+(0.5-(float(l9_392)*0.5)),0.0);
}
else
{
l9_393=float3(l9_390,float(l9_392));
}
}
float3 l9_394=l9_393;
float3 l9_395=l9_394;
float4 l9_396=sc_set0.emissiveTexture.sample(sc_set0.emissiveTextureSmpSC,l9_395.xy,bias(l9_389));
float4 l9_397=l9_396;
if (l9_327)
{
l9_397=mix(l9_328,l9_397,float4(l9_331));
}
float4 l9_398=l9_397;
l9_312=l9_398;
float4 l9_399=l9_312;
float3 l9_400=l9_399.xyz;
float3 l9_401;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_401=float3(pow(l9_400.x,2.2),pow(l9_400.y,2.2),pow(l9_400.z,2.2));
}
else
{
l9_401=l9_400*l9_400;
}
float3 l9_402=l9_401;
float3 l9_403=l9_402;
float3 l9_404=l9_293;
float3 l9_405;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_405=float3(pow(l9_404.x,2.2),pow(l9_404.y,2.2),pow(l9_404.z,2.2));
}
else
{
l9_405=l9_404*l9_404;
}
float3 l9_406=l9_405;
l9_293=l9_403*l9_406;
N3_Emissive=l9_293;
}
float3 l9_407=tempGlobals.VertexNormal_WorldSpace;
N3_Normal=normalize(l9_407);
if (N3_EnableNormalTexture)
{
float3 l9_408=N3_Normal;
int l9_409=N3_NormalTextureCoord;
float2 l9_410=tempGlobals.Surface_UVCoord0;
float2 l9_411=l9_410;
if (l9_409==0)
{
float2 l9_412=tempGlobals.Surface_UVCoord0;
l9_411=l9_412;
}
if (l9_409==1)
{
float2 l9_413=tempGlobals.Surface_UVCoord1;
l9_411=l9_413;
}
float2 l9_414=l9_411;
float2 l9_415=l9_414;
if (N3_EnableTextureTransform&&N3_NormalTextureTransform)
{
float2 l9_416=l9_415;
float2 l9_417=N3_NormalTextureOffset;
float2 l9_418=N3_NormalTextureScale;
float l9_419=N3_NormalTextureRotation;
float l9_420=radians(l9_419);
float3x3 l9_421=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_417.x,l9_417.y,1.0));
float3x3 l9_422=float3x3(float3(cos(l9_420),sin(l9_420),0.0),float3(-sin(l9_420),cos(l9_420),0.0),float3(0.0,0.0,1.0));
float3x3 l9_423=float3x3(float3(l9_418.x,0.0,0.0),float3(0.0,l9_418.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_424=(l9_421*l9_422)*l9_423;
float2 l9_425=(l9_424*float3(l9_416,1.0)).xy;
l9_415=l9_425;
}
float2 l9_426=l9_415;
float4 l9_427=float4(0.0);
int l9_428;
if ((int(normalTextureHasSwappedViews_tmp)!=0))
{
int l9_429=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_429=0;
}
else
{
l9_429=in.varStereoViewID;
}
int l9_430=l9_429;
l9_428=1-l9_430;
}
else
{
int l9_431=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_431=0;
}
else
{
l9_431=in.varStereoViewID;
}
int l9_432=l9_431;
l9_428=l9_432;
}
int l9_433=l9_428;
int l9_434=normalTextureLayout_tmp;
int l9_435=l9_433;
float2 l9_436=l9_426;
bool l9_437=(int(SC_USE_UV_TRANSFORM_normalTexture_tmp)!=0);
float3x3 l9_438=(*sc_set0.UserUniforms).normalTextureTransform;
int2 l9_439=int2(SC_SOFTWARE_WRAP_MODE_U_normalTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_normalTexture_tmp);
bool l9_440=(int(SC_USE_UV_MIN_MAX_normalTexture_tmp)!=0);
float4 l9_441=(*sc_set0.UserUniforms).normalTextureUvMinMax;
bool l9_442=(int(SC_USE_CLAMP_TO_BORDER_normalTexture_tmp)!=0);
float4 l9_443=(*sc_set0.UserUniforms).normalTextureBorderColor;
float l9_444=0.0;
bool l9_445=l9_442&&(!l9_440);
float l9_446=1.0;
float l9_447=l9_436.x;
int l9_448=l9_439.x;
if (l9_448==1)
{
l9_447=fract(l9_447);
}
else
{
if (l9_448==2)
{
float l9_449=fract(l9_447);
float l9_450=l9_447-l9_449;
float l9_451=step(0.25,fract(l9_450*0.5));
l9_447=mix(l9_449,1.0-l9_449,fast::clamp(l9_451,0.0,1.0));
}
}
l9_436.x=l9_447;
float l9_452=l9_436.y;
int l9_453=l9_439.y;
if (l9_453==1)
{
l9_452=fract(l9_452);
}
else
{
if (l9_453==2)
{
float l9_454=fract(l9_452);
float l9_455=l9_452-l9_454;
float l9_456=step(0.25,fract(l9_455*0.5));
l9_452=mix(l9_454,1.0-l9_454,fast::clamp(l9_456,0.0,1.0));
}
}
l9_436.y=l9_452;
if (l9_440)
{
bool l9_457=l9_442;
bool l9_458;
if (l9_457)
{
l9_458=l9_439.x==3;
}
else
{
l9_458=l9_457;
}
float l9_459=l9_436.x;
float l9_460=l9_441.x;
float l9_461=l9_441.z;
bool l9_462=l9_458;
float l9_463=l9_446;
float l9_464=fast::clamp(l9_459,l9_460,l9_461);
float l9_465=step(abs(l9_459-l9_464),9.9999997e-06);
l9_463*=(l9_465+((1.0-float(l9_462))*(1.0-l9_465)));
l9_459=l9_464;
l9_436.x=l9_459;
l9_446=l9_463;
bool l9_466=l9_442;
bool l9_467;
if (l9_466)
{
l9_467=l9_439.y==3;
}
else
{
l9_467=l9_466;
}
float l9_468=l9_436.y;
float l9_469=l9_441.y;
float l9_470=l9_441.w;
bool l9_471=l9_467;
float l9_472=l9_446;
float l9_473=fast::clamp(l9_468,l9_469,l9_470);
float l9_474=step(abs(l9_468-l9_473),9.9999997e-06);
l9_472*=(l9_474+((1.0-float(l9_471))*(1.0-l9_474)));
l9_468=l9_473;
l9_436.y=l9_468;
l9_446=l9_472;
}
float2 l9_475=l9_436;
bool l9_476=l9_437;
float3x3 l9_477=l9_438;
if (l9_476)
{
l9_475=float2((l9_477*float3(l9_475,1.0)).xy);
}
float2 l9_478=l9_475;
l9_436=l9_478;
float l9_479=l9_436.x;
int l9_480=l9_439.x;
bool l9_481=l9_445;
float l9_482=l9_446;
if ((l9_480==0)||(l9_480==3))
{
float l9_483=l9_479;
float l9_484=0.0;
float l9_485=1.0;
bool l9_486=l9_481;
float l9_487=l9_482;
float l9_488=fast::clamp(l9_483,l9_484,l9_485);
float l9_489=step(abs(l9_483-l9_488),9.9999997e-06);
l9_487*=(l9_489+((1.0-float(l9_486))*(1.0-l9_489)));
l9_483=l9_488;
l9_479=l9_483;
l9_482=l9_487;
}
l9_436.x=l9_479;
l9_446=l9_482;
float l9_490=l9_436.y;
int l9_491=l9_439.y;
bool l9_492=l9_445;
float l9_493=l9_446;
if ((l9_491==0)||(l9_491==3))
{
float l9_494=l9_490;
float l9_495=0.0;
float l9_496=1.0;
bool l9_497=l9_492;
float l9_498=l9_493;
float l9_499=fast::clamp(l9_494,l9_495,l9_496);
float l9_500=step(abs(l9_494-l9_499),9.9999997e-06);
l9_498*=(l9_500+((1.0-float(l9_497))*(1.0-l9_500)));
l9_494=l9_499;
l9_490=l9_494;
l9_493=l9_498;
}
l9_436.y=l9_490;
l9_446=l9_493;
float2 l9_501=l9_436;
int l9_502=l9_434;
int l9_503=l9_435;
float l9_504=l9_444;
float2 l9_505=l9_501;
int l9_506=l9_502;
int l9_507=l9_503;
float3 l9_508=float3(0.0);
if (l9_506==0)
{
l9_508=float3(l9_505,0.0);
}
else
{
if (l9_506==1)
{
l9_508=float3(l9_505.x,(l9_505.y*0.5)+(0.5-(float(l9_507)*0.5)),0.0);
}
else
{
l9_508=float3(l9_505,float(l9_507));
}
}
float3 l9_509=l9_508;
float3 l9_510=l9_509;
float4 l9_511=sc_set0.normalTexture.sample(sc_set0.normalTextureSmpSC,l9_510.xy,bias(l9_504));
float4 l9_512=l9_511;
if (l9_442)
{
l9_512=mix(l9_443,l9_512,float4(l9_446));
}
float4 l9_513=l9_512;
l9_427=l9_513;
float4 l9_514=l9_427;
float3 l9_515=(l9_514.xyz*1.9921875)-float3(1.0);
l9_515=mix(float3(0.0,0.0,1.0),l9_515,float3(N3_NormalScale));
float3 l9_516=tempGlobals.VertexTangent_WorldSpace;
float3 l9_517=l9_516;
float3 l9_518=tempGlobals.VertexBinormal_WorldSpace;
float3 l9_519=l9_518;
float3x3 l9_520=float3x3(float3(l9_517),float3(l9_519),float3(l9_408));
l9_408=normalize(l9_520*l9_515);
N3_Normal=l9_408;
}
N3_Metallic=N3_MetallicValue;
N3_Roughness=N3_RoughnessValue;
N3_Occlusion=float4(1.0,1.0,1.0,0.0);
if (N3_EnableMetallicRoughnessTexture)
{
float l9_521=N3_Metallic;
float l9_522=N3_Roughness;
float4 l9_523=N3_Occlusion;
int l9_524=N3_MaterialParamsTextureCoord;
float2 l9_525=tempGlobals.Surface_UVCoord0;
float2 l9_526=l9_525;
if (l9_524==0)
{
float2 l9_527=tempGlobals.Surface_UVCoord0;
l9_526=l9_527;
}
if (l9_524==1)
{
float2 l9_528=tempGlobals.Surface_UVCoord1;
l9_526=l9_528;
}
float2 l9_529=l9_526;
float2 l9_530=l9_529;
if (N3_EnableTextureTransform&&N3_MaterialParamsTextureTransform)
{
float2 l9_531=l9_530;
float2 l9_532=N3_MaterialParamsTextureOffset;
float2 l9_533=N3_MaterialParamsTextureScale;
float l9_534=N3_MaterialParamsTextureRotation;
float l9_535=radians(l9_534);
float3x3 l9_536=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_532.x,l9_532.y,1.0));
float3x3 l9_537=float3x3(float3(cos(l9_535),sin(l9_535),0.0),float3(-sin(l9_535),cos(l9_535),0.0),float3(0.0,0.0,1.0));
float3x3 l9_538=float3x3(float3(l9_533.x,0.0,0.0),float3(0.0,l9_533.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_539=(l9_536*l9_537)*l9_538;
float2 l9_540=(l9_539*float3(l9_531,1.0)).xy;
l9_530=l9_540;
}
float2 l9_541=l9_530;
float4 l9_542=float4(0.0);
int l9_543;
if ((int(metallicRoughnessTextureHasSwappedViews_tmp)!=0))
{
int l9_544=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_544=0;
}
else
{
l9_544=in.varStereoViewID;
}
int l9_545=l9_544;
l9_543=1-l9_545;
}
else
{
int l9_546=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_546=0;
}
else
{
l9_546=in.varStereoViewID;
}
int l9_547=l9_546;
l9_543=l9_547;
}
int l9_548=l9_543;
int l9_549=metallicRoughnessTextureLayout_tmp;
int l9_550=l9_548;
float2 l9_551=l9_541;
bool l9_552=(int(SC_USE_UV_TRANSFORM_metallicRoughnessTexture_tmp)!=0);
float3x3 l9_553=(*sc_set0.UserUniforms).metallicRoughnessTextureTransform;
int2 l9_554=int2(SC_SOFTWARE_WRAP_MODE_U_metallicRoughnessTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_metallicRoughnessTexture_tmp);
bool l9_555=(int(SC_USE_UV_MIN_MAX_metallicRoughnessTexture_tmp)!=0);
float4 l9_556=(*sc_set0.UserUniforms).metallicRoughnessTextureUvMinMax;
bool l9_557=(int(SC_USE_CLAMP_TO_BORDER_metallicRoughnessTexture_tmp)!=0);
float4 l9_558=(*sc_set0.UserUniforms).metallicRoughnessTextureBorderColor;
float l9_559=0.0;
bool l9_560=l9_557&&(!l9_555);
float l9_561=1.0;
float l9_562=l9_551.x;
int l9_563=l9_554.x;
if (l9_563==1)
{
l9_562=fract(l9_562);
}
else
{
if (l9_563==2)
{
float l9_564=fract(l9_562);
float l9_565=l9_562-l9_564;
float l9_566=step(0.25,fract(l9_565*0.5));
l9_562=mix(l9_564,1.0-l9_564,fast::clamp(l9_566,0.0,1.0));
}
}
l9_551.x=l9_562;
float l9_567=l9_551.y;
int l9_568=l9_554.y;
if (l9_568==1)
{
l9_567=fract(l9_567);
}
else
{
if (l9_568==2)
{
float l9_569=fract(l9_567);
float l9_570=l9_567-l9_569;
float l9_571=step(0.25,fract(l9_570*0.5));
l9_567=mix(l9_569,1.0-l9_569,fast::clamp(l9_571,0.0,1.0));
}
}
l9_551.y=l9_567;
if (l9_555)
{
bool l9_572=l9_557;
bool l9_573;
if (l9_572)
{
l9_573=l9_554.x==3;
}
else
{
l9_573=l9_572;
}
float l9_574=l9_551.x;
float l9_575=l9_556.x;
float l9_576=l9_556.z;
bool l9_577=l9_573;
float l9_578=l9_561;
float l9_579=fast::clamp(l9_574,l9_575,l9_576);
float l9_580=step(abs(l9_574-l9_579),9.9999997e-06);
l9_578*=(l9_580+((1.0-float(l9_577))*(1.0-l9_580)));
l9_574=l9_579;
l9_551.x=l9_574;
l9_561=l9_578;
bool l9_581=l9_557;
bool l9_582;
if (l9_581)
{
l9_582=l9_554.y==3;
}
else
{
l9_582=l9_581;
}
float l9_583=l9_551.y;
float l9_584=l9_556.y;
float l9_585=l9_556.w;
bool l9_586=l9_582;
float l9_587=l9_561;
float l9_588=fast::clamp(l9_583,l9_584,l9_585);
float l9_589=step(abs(l9_583-l9_588),9.9999997e-06);
l9_587*=(l9_589+((1.0-float(l9_586))*(1.0-l9_589)));
l9_583=l9_588;
l9_551.y=l9_583;
l9_561=l9_587;
}
float2 l9_590=l9_551;
bool l9_591=l9_552;
float3x3 l9_592=l9_553;
if (l9_591)
{
l9_590=float2((l9_592*float3(l9_590,1.0)).xy);
}
float2 l9_593=l9_590;
l9_551=l9_593;
float l9_594=l9_551.x;
int l9_595=l9_554.x;
bool l9_596=l9_560;
float l9_597=l9_561;
if ((l9_595==0)||(l9_595==3))
{
float l9_598=l9_594;
float l9_599=0.0;
float l9_600=1.0;
bool l9_601=l9_596;
float l9_602=l9_597;
float l9_603=fast::clamp(l9_598,l9_599,l9_600);
float l9_604=step(abs(l9_598-l9_603),9.9999997e-06);
l9_602*=(l9_604+((1.0-float(l9_601))*(1.0-l9_604)));
l9_598=l9_603;
l9_594=l9_598;
l9_597=l9_602;
}
l9_551.x=l9_594;
l9_561=l9_597;
float l9_605=l9_551.y;
int l9_606=l9_554.y;
bool l9_607=l9_560;
float l9_608=l9_561;
if ((l9_606==0)||(l9_606==3))
{
float l9_609=l9_605;
float l9_610=0.0;
float l9_611=1.0;
bool l9_612=l9_607;
float l9_613=l9_608;
float l9_614=fast::clamp(l9_609,l9_610,l9_611);
float l9_615=step(abs(l9_609-l9_614),9.9999997e-06);
l9_613*=(l9_615+((1.0-float(l9_612))*(1.0-l9_615)));
l9_609=l9_614;
l9_605=l9_609;
l9_608=l9_613;
}
l9_551.y=l9_605;
l9_561=l9_608;
float2 l9_616=l9_551;
int l9_617=l9_549;
int l9_618=l9_550;
float l9_619=l9_559;
float2 l9_620=l9_616;
int l9_621=l9_617;
int l9_622=l9_618;
float3 l9_623=float3(0.0);
if (l9_621==0)
{
l9_623=float3(l9_620,0.0);
}
else
{
if (l9_621==1)
{
l9_623=float3(l9_620.x,(l9_620.y*0.5)+(0.5-(float(l9_622)*0.5)),0.0);
}
else
{
l9_623=float3(l9_620,float(l9_622));
}
}
float3 l9_624=l9_623;
float3 l9_625=l9_624;
float4 l9_626=sc_set0.metallicRoughnessTexture.sample(sc_set0.metallicRoughnessTextureSmpSC,l9_625.xy,bias(l9_619));
float4 l9_627=l9_626;
if (l9_557)
{
l9_627=mix(l9_558,l9_627,float4(l9_561));
}
float4 l9_628=l9_627;
l9_542=l9_628;
float4 l9_629=l9_542;
float3 l9_630=l9_629.xyz;
l9_521*=l9_630.x;
l9_522*=l9_630.y;
l9_523.w=N3_OcclusionStrength;
float3 l9_631=float3(1.0+(l9_523.w*(l9_630.z-1.0)));
l9_523=float4(l9_631.x,l9_631.y,l9_631.z,l9_523.w);
N3_Metallic=l9_521;
N3_Roughness=l9_522;
N3_Occlusion=l9_523;
}
if (N3_TransmissionEnable)
{
float3 l9_632=N3_BaseColor;
float3 l9_633=N3_Emissive;
float l9_634=N3_Metallic;
float2 l9_635=tempGlobals.gScreenCoord;
float2 l9_636=l9_635;
float4 l9_637=float4(0.0);
int l9_638;
if ((int(screenTextureHasSwappedViews_tmp)!=0))
{
int l9_639=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_639=0;
}
else
{
l9_639=in.varStereoViewID;
}
int l9_640=l9_639;
l9_638=1-l9_640;
}
else
{
int l9_641=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_641=0;
}
else
{
l9_641=in.varStereoViewID;
}
int l9_642=l9_641;
l9_638=l9_642;
}
int l9_643=l9_638;
int l9_644=screenTextureLayout_tmp;
int l9_645=l9_643;
float2 l9_646=l9_636;
bool l9_647=(int(SC_USE_UV_TRANSFORM_screenTexture_tmp)!=0);
float3x3 l9_648=(*sc_set0.UserUniforms).screenTextureTransform;
int2 l9_649=int2(SC_SOFTWARE_WRAP_MODE_U_screenTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_screenTexture_tmp);
bool l9_650=(int(SC_USE_UV_MIN_MAX_screenTexture_tmp)!=0);
float4 l9_651=(*sc_set0.UserUniforms).screenTextureUvMinMax;
bool l9_652=(int(SC_USE_CLAMP_TO_BORDER_screenTexture_tmp)!=0);
float4 l9_653=(*sc_set0.UserUniforms).screenTextureBorderColor;
float l9_654=0.0;
bool l9_655=l9_652&&(!l9_650);
float l9_656=1.0;
float l9_657=l9_646.x;
int l9_658=l9_649.x;
if (l9_658==1)
{
l9_657=fract(l9_657);
}
else
{
if (l9_658==2)
{
float l9_659=fract(l9_657);
float l9_660=l9_657-l9_659;
float l9_661=step(0.25,fract(l9_660*0.5));
l9_657=mix(l9_659,1.0-l9_659,fast::clamp(l9_661,0.0,1.0));
}
}
l9_646.x=l9_657;
float l9_662=l9_646.y;
int l9_663=l9_649.y;
if (l9_663==1)
{
l9_662=fract(l9_662);
}
else
{
if (l9_663==2)
{
float l9_664=fract(l9_662);
float l9_665=l9_662-l9_664;
float l9_666=step(0.25,fract(l9_665*0.5));
l9_662=mix(l9_664,1.0-l9_664,fast::clamp(l9_666,0.0,1.0));
}
}
l9_646.y=l9_662;
if (l9_650)
{
bool l9_667=l9_652;
bool l9_668;
if (l9_667)
{
l9_668=l9_649.x==3;
}
else
{
l9_668=l9_667;
}
float l9_669=l9_646.x;
float l9_670=l9_651.x;
float l9_671=l9_651.z;
bool l9_672=l9_668;
float l9_673=l9_656;
float l9_674=fast::clamp(l9_669,l9_670,l9_671);
float l9_675=step(abs(l9_669-l9_674),9.9999997e-06);
l9_673*=(l9_675+((1.0-float(l9_672))*(1.0-l9_675)));
l9_669=l9_674;
l9_646.x=l9_669;
l9_656=l9_673;
bool l9_676=l9_652;
bool l9_677;
if (l9_676)
{
l9_677=l9_649.y==3;
}
else
{
l9_677=l9_676;
}
float l9_678=l9_646.y;
float l9_679=l9_651.y;
float l9_680=l9_651.w;
bool l9_681=l9_677;
float l9_682=l9_656;
float l9_683=fast::clamp(l9_678,l9_679,l9_680);
float l9_684=step(abs(l9_678-l9_683),9.9999997e-06);
l9_682*=(l9_684+((1.0-float(l9_681))*(1.0-l9_684)));
l9_678=l9_683;
l9_646.y=l9_678;
l9_656=l9_682;
}
float2 l9_685=l9_646;
bool l9_686=l9_647;
float3x3 l9_687=l9_648;
if (l9_686)
{
l9_685=float2((l9_687*float3(l9_685,1.0)).xy);
}
float2 l9_688=l9_685;
l9_646=l9_688;
float l9_689=l9_646.x;
int l9_690=l9_649.x;
bool l9_691=l9_655;
float l9_692=l9_656;
if ((l9_690==0)||(l9_690==3))
{
float l9_693=l9_689;
float l9_694=0.0;
float l9_695=1.0;
bool l9_696=l9_691;
float l9_697=l9_692;
float l9_698=fast::clamp(l9_693,l9_694,l9_695);
float l9_699=step(abs(l9_693-l9_698),9.9999997e-06);
l9_697*=(l9_699+((1.0-float(l9_696))*(1.0-l9_699)));
l9_693=l9_698;
l9_689=l9_693;
l9_692=l9_697;
}
l9_646.x=l9_689;
l9_656=l9_692;
float l9_700=l9_646.y;
int l9_701=l9_649.y;
bool l9_702=l9_655;
float l9_703=l9_656;
if ((l9_701==0)||(l9_701==3))
{
float l9_704=l9_700;
float l9_705=0.0;
float l9_706=1.0;
bool l9_707=l9_702;
float l9_708=l9_703;
float l9_709=fast::clamp(l9_704,l9_705,l9_706);
float l9_710=step(abs(l9_704-l9_709),9.9999997e-06);
l9_708*=(l9_710+((1.0-float(l9_707))*(1.0-l9_710)));
l9_704=l9_709;
l9_700=l9_704;
l9_703=l9_708;
}
l9_646.y=l9_700;
l9_656=l9_703;
float2 l9_711=l9_646;
int l9_712=l9_644;
int l9_713=l9_645;
float l9_714=l9_654;
float2 l9_715=l9_711;
int l9_716=l9_712;
int l9_717=l9_713;
float3 l9_718=float3(0.0);
if (l9_716==0)
{
l9_718=float3(l9_715,0.0);
}
else
{
if (l9_716==1)
{
l9_718=float3(l9_715.x,(l9_715.y*0.5)+(0.5-(float(l9_717)*0.5)),0.0);
}
else
{
l9_718=float3(l9_715,float(l9_717));
}
}
float3 l9_719=l9_718;
float3 l9_720=l9_719;
float4 l9_721=sc_set0.screenTexture.sample(sc_set0.screenTextureSmpSC,l9_720.xy,bias(l9_714));
float4 l9_722=l9_721;
if (l9_652)
{
l9_722=mix(l9_653,l9_722,float4(l9_656));
}
float4 l9_723=l9_722;
l9_637=l9_723;
float4 l9_724=l9_637;
float3 l9_725=l9_724.xyz;
float3 l9_726;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_726=float3(pow(l9_725.x,2.2),pow(l9_725.y,2.2),pow(l9_725.z,2.2));
}
else
{
l9_726=l9_725*l9_725;
}
float3 l9_727=l9_726;
N3_Background=l9_727;
float l9_728=1.0;
if (N3_EnableTransmissionTexture)
{
int l9_729=N3_TransmissionTextureCoord;
float2 l9_730=tempGlobals.Surface_UVCoord0;
float2 l9_731=l9_730;
if (l9_729==0)
{
float2 l9_732=tempGlobals.Surface_UVCoord0;
l9_731=l9_732;
}
if (l9_729==1)
{
float2 l9_733=tempGlobals.Surface_UVCoord1;
l9_731=l9_733;
}
float2 l9_734=l9_731;
float2 l9_735=l9_734;
if (N3_EnableTextureTransform&&N3_TransmissionTextureTransform)
{
float2 l9_736=l9_735;
float2 l9_737=N3_TransmissionTextureOffset;
float2 l9_738=N3_TransmissionTextureScale;
float l9_739=N3_TransmissionTextureRotation;
float l9_740=radians(l9_739);
float3x3 l9_741=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_737.x,l9_737.y,1.0));
float3x3 l9_742=float3x3(float3(cos(l9_740),sin(l9_740),0.0),float3(-sin(l9_740),cos(l9_740),0.0),float3(0.0,0.0,1.0));
float3x3 l9_743=float3x3(float3(l9_738.x,0.0,0.0),float3(0.0,l9_738.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_744=(l9_741*l9_742)*l9_743;
float2 l9_745=(l9_744*float3(l9_736,1.0)).xy;
l9_735=l9_745;
}
float2 l9_746=l9_735;
float4 l9_747=float4(0.0);
int l9_748;
if ((int(transmissionTextureHasSwappedViews_tmp)!=0))
{
int l9_749=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_749=0;
}
else
{
l9_749=in.varStereoViewID;
}
int l9_750=l9_749;
l9_748=1-l9_750;
}
else
{
int l9_751=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_751=0;
}
else
{
l9_751=in.varStereoViewID;
}
int l9_752=l9_751;
l9_748=l9_752;
}
int l9_753=l9_748;
int l9_754=transmissionTextureLayout_tmp;
int l9_755=l9_753;
float2 l9_756=l9_746;
bool l9_757=(int(SC_USE_UV_TRANSFORM_transmissionTexture_tmp)!=0);
float3x3 l9_758=(*sc_set0.UserUniforms).transmissionTextureTransform;
int2 l9_759=int2(SC_SOFTWARE_WRAP_MODE_U_transmissionTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_transmissionTexture_tmp);
bool l9_760=(int(SC_USE_UV_MIN_MAX_transmissionTexture_tmp)!=0);
float4 l9_761=(*sc_set0.UserUniforms).transmissionTextureUvMinMax;
bool l9_762=(int(SC_USE_CLAMP_TO_BORDER_transmissionTexture_tmp)!=0);
float4 l9_763=(*sc_set0.UserUniforms).transmissionTextureBorderColor;
float l9_764=0.0;
bool l9_765=l9_762&&(!l9_760);
float l9_766=1.0;
float l9_767=l9_756.x;
int l9_768=l9_759.x;
if (l9_768==1)
{
l9_767=fract(l9_767);
}
else
{
if (l9_768==2)
{
float l9_769=fract(l9_767);
float l9_770=l9_767-l9_769;
float l9_771=step(0.25,fract(l9_770*0.5));
l9_767=mix(l9_769,1.0-l9_769,fast::clamp(l9_771,0.0,1.0));
}
}
l9_756.x=l9_767;
float l9_772=l9_756.y;
int l9_773=l9_759.y;
if (l9_773==1)
{
l9_772=fract(l9_772);
}
else
{
if (l9_773==2)
{
float l9_774=fract(l9_772);
float l9_775=l9_772-l9_774;
float l9_776=step(0.25,fract(l9_775*0.5));
l9_772=mix(l9_774,1.0-l9_774,fast::clamp(l9_776,0.0,1.0));
}
}
l9_756.y=l9_772;
if (l9_760)
{
bool l9_777=l9_762;
bool l9_778;
if (l9_777)
{
l9_778=l9_759.x==3;
}
else
{
l9_778=l9_777;
}
float l9_779=l9_756.x;
float l9_780=l9_761.x;
float l9_781=l9_761.z;
bool l9_782=l9_778;
float l9_783=l9_766;
float l9_784=fast::clamp(l9_779,l9_780,l9_781);
float l9_785=step(abs(l9_779-l9_784),9.9999997e-06);
l9_783*=(l9_785+((1.0-float(l9_782))*(1.0-l9_785)));
l9_779=l9_784;
l9_756.x=l9_779;
l9_766=l9_783;
bool l9_786=l9_762;
bool l9_787;
if (l9_786)
{
l9_787=l9_759.y==3;
}
else
{
l9_787=l9_786;
}
float l9_788=l9_756.y;
float l9_789=l9_761.y;
float l9_790=l9_761.w;
bool l9_791=l9_787;
float l9_792=l9_766;
float l9_793=fast::clamp(l9_788,l9_789,l9_790);
float l9_794=step(abs(l9_788-l9_793),9.9999997e-06);
l9_792*=(l9_794+((1.0-float(l9_791))*(1.0-l9_794)));
l9_788=l9_793;
l9_756.y=l9_788;
l9_766=l9_792;
}
float2 l9_795=l9_756;
bool l9_796=l9_757;
float3x3 l9_797=l9_758;
if (l9_796)
{
l9_795=float2((l9_797*float3(l9_795,1.0)).xy);
}
float2 l9_798=l9_795;
l9_756=l9_798;
float l9_799=l9_756.x;
int l9_800=l9_759.x;
bool l9_801=l9_765;
float l9_802=l9_766;
if ((l9_800==0)||(l9_800==3))
{
float l9_803=l9_799;
float l9_804=0.0;
float l9_805=1.0;
bool l9_806=l9_801;
float l9_807=l9_802;
float l9_808=fast::clamp(l9_803,l9_804,l9_805);
float l9_809=step(abs(l9_803-l9_808),9.9999997e-06);
l9_807*=(l9_809+((1.0-float(l9_806))*(1.0-l9_809)));
l9_803=l9_808;
l9_799=l9_803;
l9_802=l9_807;
}
l9_756.x=l9_799;
l9_766=l9_802;
float l9_810=l9_756.y;
int l9_811=l9_759.y;
bool l9_812=l9_765;
float l9_813=l9_766;
if ((l9_811==0)||(l9_811==3))
{
float l9_814=l9_810;
float l9_815=0.0;
float l9_816=1.0;
bool l9_817=l9_812;
float l9_818=l9_813;
float l9_819=fast::clamp(l9_814,l9_815,l9_816);
float l9_820=step(abs(l9_814-l9_819),9.9999997e-06);
l9_818*=(l9_820+((1.0-float(l9_817))*(1.0-l9_820)));
l9_814=l9_819;
l9_810=l9_814;
l9_813=l9_818;
}
l9_756.y=l9_810;
l9_766=l9_813;
float2 l9_821=l9_756;
int l9_822=l9_754;
int l9_823=l9_755;
float l9_824=l9_764;
float2 l9_825=l9_821;
int l9_826=l9_822;
int l9_827=l9_823;
float3 l9_828=float3(0.0);
if (l9_826==0)
{
l9_828=float3(l9_825,0.0);
}
else
{
if (l9_826==1)
{
l9_828=float3(l9_825.x,(l9_825.y*0.5)+(0.5-(float(l9_827)*0.5)),0.0);
}
else
{
l9_828=float3(l9_825,float(l9_827));
}
}
float3 l9_829=l9_828;
float3 l9_830=l9_829;
float4 l9_831=sc_set0.transmissionTexture.sample(sc_set0.transmissionTextureSmpSC,l9_830.xy,bias(l9_824));
float4 l9_832=l9_831;
if (l9_762)
{
l9_832=mix(l9_763,l9_832,float4(l9_766));
}
float4 l9_833=l9_832;
l9_747=l9_833;
float4 l9_834=l9_747;
l9_728=l9_834.x;
}
l9_728*=N3_TransmissionFactor;
float3 l9_835=l9_632;
l9_632=mix(l9_835,float3(0.0),float3(l9_728));
l9_632=mix(l9_632,l9_835,float3(l9_634));
float3 l9_836=l9_633;
l9_633=mix(float3(0.0),l9_835,float3(l9_728))*N3_Background;
l9_633=mix(l9_633,float3(0.0),float3(l9_634))+l9_836;
N3_BaseColor=l9_632;
N3_Emissive=l9_633;
}
float3 l9_837=N3_BaseColor;
float3 l9_838;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_838=float3(pow(l9_837.x,0.45454544),pow(l9_837.y,0.45454544),pow(l9_837.z,0.45454544));
}
else
{
l9_838=sqrt(l9_837);
}
float3 l9_839=l9_838;
N3_BaseColor=l9_839;
float l9_840=N3_Opacity;
float l9_841;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_841=pow(l9_840,0.45454544);
}
else
{
l9_841=sqrt(l9_840);
}
float l9_842=l9_841;
N3_Opacity=l9_842;
float3 l9_843=N3_Emissive;
float3 l9_844;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_844=float3(pow(l9_843.x,0.45454544),pow(l9_843.y,0.45454544),pow(l9_843.z,0.45454544));
}
else
{
l9_844=sqrt(l9_843);
}
float3 l9_845=l9_844;
N3_Emissive=l9_845;
if (N3_SheenEnable)
{
float3 l9_846=N3_Normal;
float4 l9_847=N3_Occlusion;
float3 l9_848=N3_SheenColorFactor;
float l9_849=N3_SheenRoughnessFactor;
if (N3_EnableSheenTexture)
{
int l9_850=N3_SheenColorTextureCoord;
float2 l9_851=tempGlobals.Surface_UVCoord0;
float2 l9_852=l9_851;
if (l9_850==0)
{
float2 l9_853=tempGlobals.Surface_UVCoord0;
l9_852=l9_853;
}
if (l9_850==1)
{
float2 l9_854=tempGlobals.Surface_UVCoord1;
l9_852=l9_854;
}
float2 l9_855=l9_852;
float2 l9_856=l9_855;
if (N3_EnableTextureTransform&&N3_SheenColorTextureTransform)
{
float2 l9_857=l9_856;
float2 l9_858=N3_SheenColorTextureOffset;
float2 l9_859=N3_SheenColorTextureScale;
float l9_860=N3_SheenColorTextureRotation;
float l9_861=radians(l9_860);
float3x3 l9_862=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_858.x,l9_858.y,1.0));
float3x3 l9_863=float3x3(float3(cos(l9_861),sin(l9_861),0.0),float3(-sin(l9_861),cos(l9_861),0.0),float3(0.0,0.0,1.0));
float3x3 l9_864=float3x3(float3(l9_859.x,0.0,0.0),float3(0.0,l9_859.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_865=(l9_862*l9_863)*l9_864;
float2 l9_866=(l9_865*float3(l9_857,1.0)).xy;
l9_856=l9_866;
}
float2 l9_867=l9_856;
float4 l9_868=float4(0.0);
int l9_869;
if ((int(sheenColorTextureHasSwappedViews_tmp)!=0))
{
int l9_870=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_870=0;
}
else
{
l9_870=in.varStereoViewID;
}
int l9_871=l9_870;
l9_869=1-l9_871;
}
else
{
int l9_872=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_872=0;
}
else
{
l9_872=in.varStereoViewID;
}
int l9_873=l9_872;
l9_869=l9_873;
}
int l9_874=l9_869;
int l9_875=sheenColorTextureLayout_tmp;
int l9_876=l9_874;
float2 l9_877=l9_867;
bool l9_878=(int(SC_USE_UV_TRANSFORM_sheenColorTexture_tmp)!=0);
float3x3 l9_879=(*sc_set0.UserUniforms).sheenColorTextureTransform;
int2 l9_880=int2(SC_SOFTWARE_WRAP_MODE_U_sheenColorTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_sheenColorTexture_tmp);
bool l9_881=(int(SC_USE_UV_MIN_MAX_sheenColorTexture_tmp)!=0);
float4 l9_882=(*sc_set0.UserUniforms).sheenColorTextureUvMinMax;
bool l9_883=(int(SC_USE_CLAMP_TO_BORDER_sheenColorTexture_tmp)!=0);
float4 l9_884=(*sc_set0.UserUniforms).sheenColorTextureBorderColor;
float l9_885=0.0;
bool l9_886=l9_883&&(!l9_881);
float l9_887=1.0;
float l9_888=l9_877.x;
int l9_889=l9_880.x;
if (l9_889==1)
{
l9_888=fract(l9_888);
}
else
{
if (l9_889==2)
{
float l9_890=fract(l9_888);
float l9_891=l9_888-l9_890;
float l9_892=step(0.25,fract(l9_891*0.5));
l9_888=mix(l9_890,1.0-l9_890,fast::clamp(l9_892,0.0,1.0));
}
}
l9_877.x=l9_888;
float l9_893=l9_877.y;
int l9_894=l9_880.y;
if (l9_894==1)
{
l9_893=fract(l9_893);
}
else
{
if (l9_894==2)
{
float l9_895=fract(l9_893);
float l9_896=l9_893-l9_895;
float l9_897=step(0.25,fract(l9_896*0.5));
l9_893=mix(l9_895,1.0-l9_895,fast::clamp(l9_897,0.0,1.0));
}
}
l9_877.y=l9_893;
if (l9_881)
{
bool l9_898=l9_883;
bool l9_899;
if (l9_898)
{
l9_899=l9_880.x==3;
}
else
{
l9_899=l9_898;
}
float l9_900=l9_877.x;
float l9_901=l9_882.x;
float l9_902=l9_882.z;
bool l9_903=l9_899;
float l9_904=l9_887;
float l9_905=fast::clamp(l9_900,l9_901,l9_902);
float l9_906=step(abs(l9_900-l9_905),9.9999997e-06);
l9_904*=(l9_906+((1.0-float(l9_903))*(1.0-l9_906)));
l9_900=l9_905;
l9_877.x=l9_900;
l9_887=l9_904;
bool l9_907=l9_883;
bool l9_908;
if (l9_907)
{
l9_908=l9_880.y==3;
}
else
{
l9_908=l9_907;
}
float l9_909=l9_877.y;
float l9_910=l9_882.y;
float l9_911=l9_882.w;
bool l9_912=l9_908;
float l9_913=l9_887;
float l9_914=fast::clamp(l9_909,l9_910,l9_911);
float l9_915=step(abs(l9_909-l9_914),9.9999997e-06);
l9_913*=(l9_915+((1.0-float(l9_912))*(1.0-l9_915)));
l9_909=l9_914;
l9_877.y=l9_909;
l9_887=l9_913;
}
float2 l9_916=l9_877;
bool l9_917=l9_878;
float3x3 l9_918=l9_879;
if (l9_917)
{
l9_916=float2((l9_918*float3(l9_916,1.0)).xy);
}
float2 l9_919=l9_916;
l9_877=l9_919;
float l9_920=l9_877.x;
int l9_921=l9_880.x;
bool l9_922=l9_886;
float l9_923=l9_887;
if ((l9_921==0)||(l9_921==3))
{
float l9_924=l9_920;
float l9_925=0.0;
float l9_926=1.0;
bool l9_927=l9_922;
float l9_928=l9_923;
float l9_929=fast::clamp(l9_924,l9_925,l9_926);
float l9_930=step(abs(l9_924-l9_929),9.9999997e-06);
l9_928*=(l9_930+((1.0-float(l9_927))*(1.0-l9_930)));
l9_924=l9_929;
l9_920=l9_924;
l9_923=l9_928;
}
l9_877.x=l9_920;
l9_887=l9_923;
float l9_931=l9_877.y;
int l9_932=l9_880.y;
bool l9_933=l9_886;
float l9_934=l9_887;
if ((l9_932==0)||(l9_932==3))
{
float l9_935=l9_931;
float l9_936=0.0;
float l9_937=1.0;
bool l9_938=l9_933;
float l9_939=l9_934;
float l9_940=fast::clamp(l9_935,l9_936,l9_937);
float l9_941=step(abs(l9_935-l9_940),9.9999997e-06);
l9_939*=(l9_941+((1.0-float(l9_938))*(1.0-l9_941)));
l9_935=l9_940;
l9_931=l9_935;
l9_934=l9_939;
}
l9_877.y=l9_931;
l9_887=l9_934;
float2 l9_942=l9_877;
int l9_943=l9_875;
int l9_944=l9_876;
float l9_945=l9_885;
float2 l9_946=l9_942;
int l9_947=l9_943;
int l9_948=l9_944;
float3 l9_949=float3(0.0);
if (l9_947==0)
{
l9_949=float3(l9_946,0.0);
}
else
{
if (l9_947==1)
{
l9_949=float3(l9_946.x,(l9_946.y*0.5)+(0.5-(float(l9_948)*0.5)),0.0);
}
else
{
l9_949=float3(l9_946,float(l9_948));
}
}
float3 l9_950=l9_949;
float3 l9_951=l9_950;
float4 l9_952=sc_set0.sheenColorTexture.sample(sc_set0.sheenColorTextureSmpSC,l9_951.xy,bias(l9_945));
float4 l9_953=l9_952;
if (l9_883)
{
l9_953=mix(l9_884,l9_953,float4(l9_887));
}
float4 l9_954=l9_953;
l9_868=l9_954;
float4 l9_955=l9_868;
float3 l9_956=l9_955.xyz;
float3 l9_957;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_957=float3(pow(l9_956.x,2.2),pow(l9_956.y,2.2),pow(l9_956.z,2.2));
}
else
{
l9_957=l9_956*l9_956;
}
float3 l9_958=l9_957;
l9_848*=l9_958;
}
if (N3_EnableSheenRoughnessTexture)
{
int l9_959=N3_SheenRoughnessTextureCoord;
float2 l9_960=tempGlobals.Surface_UVCoord0;
float2 l9_961=l9_960;
if (l9_959==0)
{
float2 l9_962=tempGlobals.Surface_UVCoord0;
l9_961=l9_962;
}
if (l9_959==1)
{
float2 l9_963=tempGlobals.Surface_UVCoord1;
l9_961=l9_963;
}
float2 l9_964=l9_961;
float2 l9_965=l9_964;
if (N3_EnableTextureTransform&&N3_SheenRoughnessTextureTransform)
{
float2 l9_966=l9_965;
float2 l9_967=N3_SheenRoughnessTextureOffset;
float2 l9_968=N3_SheenRoughnessTextureScale;
float l9_969=N3_SheenRoughnessTextureRotation;
float l9_970=radians(l9_969);
float3x3 l9_971=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_967.x,l9_967.y,1.0));
float3x3 l9_972=float3x3(float3(cos(l9_970),sin(l9_970),0.0),float3(-sin(l9_970),cos(l9_970),0.0),float3(0.0,0.0,1.0));
float3x3 l9_973=float3x3(float3(l9_968.x,0.0,0.0),float3(0.0,l9_968.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_974=(l9_971*l9_972)*l9_973;
float2 l9_975=(l9_974*float3(l9_966,1.0)).xy;
l9_965=l9_975;
}
float2 l9_976=l9_965;
float4 l9_977=float4(0.0);
int l9_978;
if ((int(sheenRoughnessTextureHasSwappedViews_tmp)!=0))
{
int l9_979=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_979=0;
}
else
{
l9_979=in.varStereoViewID;
}
int l9_980=l9_979;
l9_978=1-l9_980;
}
else
{
int l9_981=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_981=0;
}
else
{
l9_981=in.varStereoViewID;
}
int l9_982=l9_981;
l9_978=l9_982;
}
int l9_983=l9_978;
int l9_984=sheenRoughnessTextureLayout_tmp;
int l9_985=l9_983;
float2 l9_986=l9_976;
bool l9_987=(int(SC_USE_UV_TRANSFORM_sheenRoughnessTexture_tmp)!=0);
float3x3 l9_988=(*sc_set0.UserUniforms).sheenRoughnessTextureTransform;
int2 l9_989=int2(SC_SOFTWARE_WRAP_MODE_U_sheenRoughnessTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_sheenRoughnessTexture_tmp);
bool l9_990=(int(SC_USE_UV_MIN_MAX_sheenRoughnessTexture_tmp)!=0);
float4 l9_991=(*sc_set0.UserUniforms).sheenRoughnessTextureUvMinMax;
bool l9_992=(int(SC_USE_CLAMP_TO_BORDER_sheenRoughnessTexture_tmp)!=0);
float4 l9_993=(*sc_set0.UserUniforms).sheenRoughnessTextureBorderColor;
float l9_994=0.0;
bool l9_995=l9_992&&(!l9_990);
float l9_996=1.0;
float l9_997=l9_986.x;
int l9_998=l9_989.x;
if (l9_998==1)
{
l9_997=fract(l9_997);
}
else
{
if (l9_998==2)
{
float l9_999=fract(l9_997);
float l9_1000=l9_997-l9_999;
float l9_1001=step(0.25,fract(l9_1000*0.5));
l9_997=mix(l9_999,1.0-l9_999,fast::clamp(l9_1001,0.0,1.0));
}
}
l9_986.x=l9_997;
float l9_1002=l9_986.y;
int l9_1003=l9_989.y;
if (l9_1003==1)
{
l9_1002=fract(l9_1002);
}
else
{
if (l9_1003==2)
{
float l9_1004=fract(l9_1002);
float l9_1005=l9_1002-l9_1004;
float l9_1006=step(0.25,fract(l9_1005*0.5));
l9_1002=mix(l9_1004,1.0-l9_1004,fast::clamp(l9_1006,0.0,1.0));
}
}
l9_986.y=l9_1002;
if (l9_990)
{
bool l9_1007=l9_992;
bool l9_1008;
if (l9_1007)
{
l9_1008=l9_989.x==3;
}
else
{
l9_1008=l9_1007;
}
float l9_1009=l9_986.x;
float l9_1010=l9_991.x;
float l9_1011=l9_991.z;
bool l9_1012=l9_1008;
float l9_1013=l9_996;
float l9_1014=fast::clamp(l9_1009,l9_1010,l9_1011);
float l9_1015=step(abs(l9_1009-l9_1014),9.9999997e-06);
l9_1013*=(l9_1015+((1.0-float(l9_1012))*(1.0-l9_1015)));
l9_1009=l9_1014;
l9_986.x=l9_1009;
l9_996=l9_1013;
bool l9_1016=l9_992;
bool l9_1017;
if (l9_1016)
{
l9_1017=l9_989.y==3;
}
else
{
l9_1017=l9_1016;
}
float l9_1018=l9_986.y;
float l9_1019=l9_991.y;
float l9_1020=l9_991.w;
bool l9_1021=l9_1017;
float l9_1022=l9_996;
float l9_1023=fast::clamp(l9_1018,l9_1019,l9_1020);
float l9_1024=step(abs(l9_1018-l9_1023),9.9999997e-06);
l9_1022*=(l9_1024+((1.0-float(l9_1021))*(1.0-l9_1024)));
l9_1018=l9_1023;
l9_986.y=l9_1018;
l9_996=l9_1022;
}
float2 l9_1025=l9_986;
bool l9_1026=l9_987;
float3x3 l9_1027=l9_988;
if (l9_1026)
{
l9_1025=float2((l9_1027*float3(l9_1025,1.0)).xy);
}
float2 l9_1028=l9_1025;
l9_986=l9_1028;
float l9_1029=l9_986.x;
int l9_1030=l9_989.x;
bool l9_1031=l9_995;
float l9_1032=l9_996;
if ((l9_1030==0)||(l9_1030==3))
{
float l9_1033=l9_1029;
float l9_1034=0.0;
float l9_1035=1.0;
bool l9_1036=l9_1031;
float l9_1037=l9_1032;
float l9_1038=fast::clamp(l9_1033,l9_1034,l9_1035);
float l9_1039=step(abs(l9_1033-l9_1038),9.9999997e-06);
l9_1037*=(l9_1039+((1.0-float(l9_1036))*(1.0-l9_1039)));
l9_1033=l9_1038;
l9_1029=l9_1033;
l9_1032=l9_1037;
}
l9_986.x=l9_1029;
l9_996=l9_1032;
float l9_1040=l9_986.y;
int l9_1041=l9_989.y;
bool l9_1042=l9_995;
float l9_1043=l9_996;
if ((l9_1041==0)||(l9_1041==3))
{
float l9_1044=l9_1040;
float l9_1045=0.0;
float l9_1046=1.0;
bool l9_1047=l9_1042;
float l9_1048=l9_1043;
float l9_1049=fast::clamp(l9_1044,l9_1045,l9_1046);
float l9_1050=step(abs(l9_1044-l9_1049),9.9999997e-06);
l9_1048*=(l9_1050+((1.0-float(l9_1047))*(1.0-l9_1050)));
l9_1044=l9_1049;
l9_1040=l9_1044;
l9_1043=l9_1048;
}
l9_986.y=l9_1040;
l9_996=l9_1043;
float2 l9_1051=l9_986;
int l9_1052=l9_984;
int l9_1053=l9_985;
float l9_1054=l9_994;
float2 l9_1055=l9_1051;
int l9_1056=l9_1052;
int l9_1057=l9_1053;
float3 l9_1058=float3(0.0);
if (l9_1056==0)
{
l9_1058=float3(l9_1055,0.0);
}
else
{
if (l9_1056==1)
{
l9_1058=float3(l9_1055.x,(l9_1055.y*0.5)+(0.5-(float(l9_1057)*0.5)),0.0);
}
else
{
l9_1058=float3(l9_1055,float(l9_1057));
}
}
float3 l9_1059=l9_1058;
float3 l9_1060=l9_1059;
float4 l9_1061=sc_set0.sheenRoughnessTexture.sample(sc_set0.sheenRoughnessTextureSmpSC,l9_1060.xy,bias(l9_1054));
float4 l9_1062=l9_1061;
if (l9_992)
{
l9_1062=mix(l9_993,l9_1062,float4(l9_996));
}
float4 l9_1063=l9_1062;
l9_977=l9_1063;
float4 l9_1064=l9_977;
float l9_1065=l9_1064.w;
float l9_1066;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1066=pow(l9_1065,2.2);
}
else
{
l9_1066=l9_1065*l9_1065;
}
float l9_1067=l9_1066;
l9_849*=l9_1067;
}
l9_849=fast::max(l9_849,9.9999997e-05);
N3_SheenOut=float4(0.0);
float3 l9_1068=l9_846;
float3 l9_1069=(*sc_set0.UserUniforms).sc_Camera.position;
float3 l9_1070=tempGlobals.SurfacePosition_WorldSpace;
float3 l9_1071=normalize(l9_1069-l9_1070);
float3 l9_1072=l9_1068;
float3 l9_1073=l9_1071;
float l9_1074=fast::clamp(dot(l9_1072,l9_1073),0.0,1.0);
float l9_1075=fast::max(l9_1074,9.9999997e-05);
float l9_1076=l9_849*l9_849;
float3 l9_1077=normalize(reflect(-l9_1071,l9_1068));
float l9_1078=l9_1075;
float3 l9_1079=l9_1077;
float l9_1080=l9_849;
float3 l9_1081=l9_848;
float l9_1082=l9_1080*4.0;
l9_1082=3.0+(((l9_1082-0.0)*2.0)/5.000001);
float l9_1083=l9_1080*l9_1080;
float l9_1084;
if (l9_1080<0.25)
{
l9_1084=(((-339.20001)*l9_1083)+(161.39999*l9_1080))-25.9;
}
else
{
l9_1084=(((-8.4799995)*l9_1083)+(14.3*l9_1080))-9.9499998;
}
float l9_1085=l9_1084;
float l9_1086;
if (l9_1080<0.25)
{
l9_1086=((44.0*l9_1083)-(23.700001*l9_1080))+3.26;
}
else
{
l9_1086=((1.97*l9_1083)-(3.27*l9_1080))+0.72000003;
}
float l9_1087=l9_1086;
float l9_1088=l9_1085;
float l9_1089=l9_1078;
float l9_1090=l9_1087;
float l9_1091;
if (l9_1080<0.25)
{
l9_1091=0.0;
}
else
{
l9_1091=0.1*(l9_1080-0.25);
}
float l9_1092=exp((l9_1088*l9_1089)+l9_1090)+l9_1091;
float l9_1093=3.1415927;
l9_1092=fast::clamp(l9_1092*l9_1093,0.0,1.0);
float3 l9_1094=l9_1079;
float l9_1095=l9_1082;
float3 l9_1096=float3(0.0);
float3 l9_1097=l9_1094;
float l9_1098=l9_1095;
float3 l9_1099=l9_1097;
float l9_1100=l9_1098;
float4 l9_1101=float4(0.0);
float3 l9_1102=l9_1099;
float l9_1103=(*sc_set0.UserUniforms).sc_EnvmapRotation.y;
float2 l9_1104=float2(0.0);
float l9_1105=l9_1102.x;
float l9_1106=-l9_1102.z;
float l9_1107=(l9_1105<0.0) ? (-1.0) : 1.0;
float l9_1108=l9_1107*acos(fast::clamp(l9_1106/length(float2(l9_1105,l9_1106)),-1.0,1.0));
l9_1104.x=l9_1108-1.5707964;
l9_1104.y=acos(l9_1102.y);
l9_1104/=float2(6.2831855,3.1415927);
l9_1104.y=1.0-l9_1104.y;
l9_1104.x+=(l9_1103/360.0);
l9_1104.x=fract((l9_1104.x+floor(l9_1104.x))+1.0);
float2 l9_1109=l9_1104;
float2 l9_1110=l9_1109;
if (SC_DEVICE_CLASS_tmp>=2)
{
float l9_1111=floor(l9_1100);
float l9_1112=ceil(l9_1100);
float l9_1113=l9_1100-l9_1111;
float2 l9_1114=l9_1110;
float2 l9_1115=(*sc_set0.UserUniforms).sc_EnvmapSpecularSize.xy;
float l9_1116=l9_1111;
float2 l9_1117=calcSeamlessPanoramicUvsForSampling(l9_1114,l9_1115,l9_1116);
float2 l9_1118=l9_1117;
float l9_1119=l9_1111;
float2 l9_1120=l9_1118;
float l9_1121=l9_1119;
int l9_1122;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_1123=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1123=0;
}
else
{
l9_1123=in.varStereoViewID;
}
int l9_1124=l9_1123;
l9_1122=1-l9_1124;
}
else
{
int l9_1125=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1125=0;
}
else
{
l9_1125=in.varStereoViewID;
}
int l9_1126=l9_1125;
l9_1122=l9_1126;
}
int l9_1127=l9_1122;
float2 l9_1128=l9_1120;
int l9_1129=sc_EnvmapSpecularLayout_tmp;
int l9_1130=l9_1127;
float l9_1131=l9_1121;
float2 l9_1132=l9_1128;
int l9_1133=l9_1129;
int l9_1134=l9_1130;
float3 l9_1135=float3(0.0);
if (l9_1133==0)
{
l9_1135=float3(l9_1132,0.0);
}
else
{
if (l9_1133==1)
{
l9_1135=float3(l9_1132.x,(l9_1132.y*0.5)+(0.5-(float(l9_1134)*0.5)),0.0);
}
else
{
l9_1135=float3(l9_1132,float(l9_1134));
}
}
float3 l9_1136=l9_1135;
float3 l9_1137=l9_1136;
float4 l9_1138=sc_set0.sc_EnvmapSpecular.sample(sc_set0.sc_EnvmapSpecularSmpSC,l9_1137.xy,level(l9_1131));
float4 l9_1139=l9_1138;
float4 l9_1140=l9_1139;
float4 l9_1141=l9_1140;
float2 l9_1142=l9_1110;
float2 l9_1143=(*sc_set0.UserUniforms).sc_EnvmapSpecularSize.xy;
float l9_1144=l9_1112;
float2 l9_1145=calcSeamlessPanoramicUvsForSampling(l9_1142,l9_1143,l9_1144);
float2 l9_1146=l9_1145;
float l9_1147=l9_1112;
float2 l9_1148=l9_1146;
float l9_1149=l9_1147;
int l9_1150;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_1151=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1151=0;
}
else
{
l9_1151=in.varStereoViewID;
}
int l9_1152=l9_1151;
l9_1150=1-l9_1152;
}
else
{
int l9_1153=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1153=0;
}
else
{
l9_1153=in.varStereoViewID;
}
int l9_1154=l9_1153;
l9_1150=l9_1154;
}
int l9_1155=l9_1150;
float2 l9_1156=l9_1148;
int l9_1157=sc_EnvmapSpecularLayout_tmp;
int l9_1158=l9_1155;
float l9_1159=l9_1149;
float2 l9_1160=l9_1156;
int l9_1161=l9_1157;
int l9_1162=l9_1158;
float3 l9_1163=float3(0.0);
if (l9_1161==0)
{
l9_1163=float3(l9_1160,0.0);
}
else
{
if (l9_1161==1)
{
l9_1163=float3(l9_1160.x,(l9_1160.y*0.5)+(0.5-(float(l9_1162)*0.5)),0.0);
}
else
{
l9_1163=float3(l9_1160,float(l9_1162));
}
}
float3 l9_1164=l9_1163;
float3 l9_1165=l9_1164;
float4 l9_1166=sc_set0.sc_EnvmapSpecular.sample(sc_set0.sc_EnvmapSpecularSmpSC,l9_1165.xy,level(l9_1159));
float4 l9_1167=l9_1166;
float4 l9_1168=l9_1167;
float4 l9_1169=l9_1168;
l9_1101=mix(l9_1141,l9_1169,float4(l9_1113));
}
else
{
float2 l9_1170=l9_1110;
float l9_1171=l9_1100;
float2 l9_1172=l9_1170;
float l9_1173=l9_1171;
int l9_1174;
if ((int(sc_EnvmapSpecularHasSwappedViews_tmp)!=0))
{
int l9_1175=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1175=0;
}
else
{
l9_1175=in.varStereoViewID;
}
int l9_1176=l9_1175;
l9_1174=1-l9_1176;
}
else
{
int l9_1177=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1177=0;
}
else
{
l9_1177=in.varStereoViewID;
}
int l9_1178=l9_1177;
l9_1174=l9_1178;
}
int l9_1179=l9_1174;
float2 l9_1180=l9_1172;
int l9_1181=sc_EnvmapSpecularLayout_tmp;
int l9_1182=l9_1179;
float l9_1183=l9_1173;
float2 l9_1184=l9_1180;
int l9_1185=l9_1181;
int l9_1186=l9_1182;
float3 l9_1187=float3(0.0);
if (l9_1185==0)
{
l9_1187=float3(l9_1184,0.0);
}
else
{
if (l9_1185==1)
{
l9_1187=float3(l9_1184.x,(l9_1184.y*0.5)+(0.5-(float(l9_1186)*0.5)),0.0);
}
else
{
l9_1187=float3(l9_1184,float(l9_1186));
}
}
float3 l9_1188=l9_1187;
float3 l9_1189=l9_1188;
float4 l9_1190=sc_set0.sc_EnvmapSpecular.sample(sc_set0.sc_EnvmapSpecularSmpSC,l9_1189.xy,level(l9_1183));
float4 l9_1191=l9_1190;
float4 l9_1192=l9_1191;
l9_1101=l9_1192;
}
float4 l9_1193=l9_1101;
float3 l9_1194=l9_1193.xyz*(1.0/l9_1193.w);
float3 l9_1195=l9_1194;
float3 l9_1196=l9_1195*(*sc_set0.UserUniforms).sc_EnvmapExposure;
l9_1196+=float3(1e-06);
float3 l9_1197=l9_1196;
l9_1096=l9_1197;
float3 l9_1198=l9_1096;
float3 l9_1199=l9_1198;
float3 l9_1200=(l9_1199*l9_1081)*l9_1092;
float3 l9_1201=N3_SheenOut.xyz+l9_1200;
N3_SheenOut=float4(l9_1201.x,l9_1201.y,l9_1201.z,N3_SheenOut.w);
float3 l9_1202=mix(N3_SheenOut.xyz,N3_SheenOut.xyz*l9_847.xyz,float3(l9_847.w));
N3_SheenOut=float4(l9_1202.x,l9_1202.y,l9_1202.z,N3_SheenOut.w);
float3 l9_1203=l9_848;
float3 l9_1204=l9_1068;
float3 l9_1205=l9_1071;
float l9_1206=l9_1075;
float l9_1207=l9_1076;
float3 l9_1208=float3(0.0);
int l9_1209=0;
l9_1209=sc_DirectionalLightsCount_tmp;
int l9_1210=l9_1209;
if (l9_1210>0)
{
float l9_1211;
int l9_1212=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
int l9_1213=0;
l9_1213=sc_DirectionalLightsCount_tmp;
int l9_1214=l9_1213;
if (l9_1212<l9_1214)
{
int l9_1215=l9_1212;
float3 l9_1216=float3(0.0);
if (l9_1215<sc_DirectionalLightsCount_tmp)
{
l9_1216=(*sc_set0.UserUniforms).sc_DirectionalLights[l9_1215].color.xyz;
}
float3 l9_1217=l9_1216;
float3 l9_1218=l9_1217;
int l9_1219=l9_1212;
float l9_1220=0.0;
if (l9_1219<sc_DirectionalLightsCount_tmp)
{
l9_1220=(*sc_set0.UserUniforms).sc_DirectionalLights[l9_1219].color.w;
}
float l9_1221=l9_1220;
float l9_1222=l9_1221;
l9_1218*=l9_1222;
l9_1218*=3.1415901;
int l9_1223=l9_1212;
float3 l9_1224=float3(0.0);
if (l9_1223<sc_DirectionalLightsCount_tmp)
{
l9_1224=-(*sc_set0.UserUniforms).sc_DirectionalLights[l9_1223].direction;
}
float3 l9_1225=l9_1224;
float3 l9_1226=normalize(-l9_1225);
float3 l9_1227=normalize(l9_1226+l9_1205);
float3 l9_1228=l9_1204;
float3 l9_1229=l9_1227;
float l9_1230=fast::clamp(dot(l9_1228,l9_1229),0.0,1.0);
float l9_1231=l9_1230;
float3 l9_1232=l9_1204;
float3 l9_1233=l9_1226;
float l9_1234=fast::clamp(dot(l9_1232,l9_1233),0.0,1.0);
float l9_1235=l9_1234;
float l9_1236=l9_1207;
float l9_1237=l9_1231;
float l9_1238=1.0/l9_1236;
float l9_1239=l9_1237*l9_1237;
float l9_1240=1.0-l9_1239;
float l9_1241=l9_1238;
float l9_1242=l9_1240;
float l9_1243=l9_1238*0.5;
if (l9_1242<=0.0)
{
l9_1211=0.0;
}
else
{
l9_1211=pow(l9_1242,l9_1243);
}
float l9_1244=l9_1211;
float l9_1245=3.1415927;
float l9_1246=((2.0+l9_1241)*l9_1244)/(2.0*l9_1245);
float l9_1247=l9_1246;
float l9_1248=l9_1206;
float l9_1249=l9_1235;
float l9_1250=1.0/(4.0*((l9_1249+l9_1248)-(l9_1249*l9_1248)));
float l9_1251=l9_1250;
l9_1208+=((((l9_1218*l9_1203)*l9_1247)*l9_1251)*l9_1235);
l9_1212++;
continue;
}
else
{
break;
}
}
}
int l9_1252=0;
l9_1252=sc_PointLightsCount_tmp;
int l9_1253=l9_1252;
if (l9_1253>0)
{
float l9_1254;
int l9_1255=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
int l9_1256=0;
l9_1256=sc_PointLightsCount_tmp;
int l9_1257=l9_1256;
if (l9_1255<l9_1257)
{
int l9_1258=l9_1255;
float3 l9_1259=float3(0.0);
if (l9_1258<sc_PointLightsCount_tmp)
{
l9_1259=(*sc_set0.UserUniforms).sc_PointLights[l9_1258].color.xyz;
}
float3 l9_1260=l9_1259;
float3 l9_1261=l9_1260;
int l9_1262=l9_1255;
float l9_1263=0.0;
if (l9_1262<sc_PointLightsCount_tmp)
{
l9_1263=(*sc_set0.UserUniforms).sc_PointLights[l9_1262].color.w;
}
float l9_1264=l9_1263;
float l9_1265=l9_1264;
l9_1261*=l9_1265;
l9_1261*=3.1415901;
int l9_1266=l9_1255;
float3 l9_1267=float3(0.0);
if (l9_1266<sc_PointLightsCount_tmp)
{
l9_1267=(*sc_set0.UserUniforms).sc_PointLights[l9_1266].position;
}
float3 l9_1268=l9_1267;
float3 l9_1269=l9_1268;
float3 l9_1270=tempGlobals.SurfacePosition_WorldSpace;
float3 l9_1271=normalize(l9_1269-l9_1270);
float3 l9_1272=normalize(l9_1271+l9_1205);
float3 l9_1273=l9_1204;
float3 l9_1274=l9_1272;
float l9_1275=fast::clamp(dot(l9_1273,l9_1274),0.0,1.0);
float l9_1276=l9_1275;
float3 l9_1277=l9_1204;
float3 l9_1278=l9_1271;
float l9_1279=fast::clamp(dot(l9_1277,l9_1278),0.0,1.0);
float l9_1280=l9_1279;
float l9_1281=l9_1207;
float l9_1282=l9_1276;
float l9_1283=1.0/l9_1281;
float l9_1284=l9_1282*l9_1282;
float l9_1285=1.0-l9_1284;
float l9_1286=l9_1283;
float l9_1287=l9_1285;
float l9_1288=l9_1283*0.5;
if (l9_1287<=0.0)
{
l9_1254=0.0;
}
else
{
l9_1254=pow(l9_1287,l9_1288);
}
float l9_1289=l9_1254;
float l9_1290=3.1415927;
float l9_1291=((2.0+l9_1286)*l9_1289)/(2.0*l9_1290);
float l9_1292=l9_1291;
float l9_1293=l9_1206;
float l9_1294=l9_1280;
float l9_1295=1.0/(4.0*((l9_1294+l9_1293)-(l9_1294*l9_1293)));
float l9_1296=l9_1295;
l9_1208+=((((l9_1261*l9_1203)*l9_1292)*l9_1296)*l9_1280);
l9_1255++;
continue;
}
else
{
break;
}
}
}
int l9_1297=0;
l9_1297=sc_AmbientLightsCount_tmp;
int l9_1298=l9_1297;
if (l9_1298>0)
{
int l9_1299=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
int l9_1300=0;
l9_1300=sc_AmbientLightsCount_tmp;
int l9_1301=l9_1300;
if (l9_1299<l9_1301)
{
int l9_1302=l9_1299;
float3 l9_1303=float3(0.0);
if (l9_1302<sc_AmbientLightsCount_tmp)
{
l9_1303=(*sc_set0.UserUniforms).sc_AmbientLights[l9_1302].color;
}
float3 l9_1304=l9_1303;
float3 l9_1305=l9_1304;
int l9_1306=l9_1299;
float l9_1307=0.0;
if (l9_1306<sc_AmbientLightsCount_tmp)
{
l9_1307=(*sc_set0.UserUniforms).sc_AmbientLights[l9_1306].intensity;
}
float l9_1308=l9_1307;
float l9_1309=l9_1308;
l9_1305*=l9_1309;
l9_1305/=float3(3.1415901);
l9_1208+=(l9_1305*l9_1203);
l9_1299++;
continue;
}
else
{
break;
}
}
}
float3 l9_1310=l9_1208;
float3 l9_1311=N3_SheenOut.xyz+l9_1310;
N3_SheenOut=float4(l9_1311.x,l9_1311.y,l9_1311.z,N3_SheenOut.w);
float3 l9_1312=l9_848;
float3 l9_1313=l9_1312;
float l9_1314=fast::max(fast::max(l9_1313.x,l9_1313.y),l9_1313.z);
float l9_1315=1.0-(l9_1314*0.15700001);
N3_SheenOut.w=l9_1315;
}
if (N3_ClearcoatEnable)
{
N3_ClearcoatBase=1.0;
N3_ClearcoatRoughness=1.0;
N3_ClearcoatNormal=float3(0.0,0.0,1.0);
if (N3_EnableClearcoatTexture)
{
int l9_1316=N3_ClearcoatTextureCoord;
float2 l9_1317=tempGlobals.Surface_UVCoord0;
float2 l9_1318=l9_1317;
if (l9_1316==0)
{
float2 l9_1319=tempGlobals.Surface_UVCoord0;
l9_1318=l9_1319;
}
if (l9_1316==1)
{
float2 l9_1320=tempGlobals.Surface_UVCoord1;
l9_1318=l9_1320;
}
float2 l9_1321=l9_1318;
float2 l9_1322=l9_1321;
if (N3_EnableTextureTransform&&N3_ClearcoatTextureTransform)
{
float2 l9_1323=l9_1322;
float2 l9_1324=N3_ClearcoatTextureOffset;
float2 l9_1325=N3_ClearcoatTextureScale;
float l9_1326=N3_ClearcoatTextureRotation;
float l9_1327=radians(l9_1326);
float3x3 l9_1328=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_1324.x,l9_1324.y,1.0));
float3x3 l9_1329=float3x3(float3(cos(l9_1327),sin(l9_1327),0.0),float3(-sin(l9_1327),cos(l9_1327),0.0),float3(0.0,0.0,1.0));
float3x3 l9_1330=float3x3(float3(l9_1325.x,0.0,0.0),float3(0.0,l9_1325.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_1331=(l9_1328*l9_1329)*l9_1330;
float2 l9_1332=(l9_1331*float3(l9_1323,1.0)).xy;
l9_1322=l9_1332;
}
float2 l9_1333=l9_1322;
float4 l9_1334=float4(0.0);
int l9_1335;
if ((int(clearcoatTextureHasSwappedViews_tmp)!=0))
{
int l9_1336=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1336=0;
}
else
{
l9_1336=in.varStereoViewID;
}
int l9_1337=l9_1336;
l9_1335=1-l9_1337;
}
else
{
int l9_1338=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1338=0;
}
else
{
l9_1338=in.varStereoViewID;
}
int l9_1339=l9_1338;
l9_1335=l9_1339;
}
int l9_1340=l9_1335;
int l9_1341=clearcoatTextureLayout_tmp;
int l9_1342=l9_1340;
float2 l9_1343=l9_1333;
bool l9_1344=(int(SC_USE_UV_TRANSFORM_clearcoatTexture_tmp)!=0);
float3x3 l9_1345=(*sc_set0.UserUniforms).clearcoatTextureTransform;
int2 l9_1346=int2(SC_SOFTWARE_WRAP_MODE_U_clearcoatTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_clearcoatTexture_tmp);
bool l9_1347=(int(SC_USE_UV_MIN_MAX_clearcoatTexture_tmp)!=0);
float4 l9_1348=(*sc_set0.UserUniforms).clearcoatTextureUvMinMax;
bool l9_1349=(int(SC_USE_CLAMP_TO_BORDER_clearcoatTexture_tmp)!=0);
float4 l9_1350=(*sc_set0.UserUniforms).clearcoatTextureBorderColor;
float l9_1351=0.0;
bool l9_1352=l9_1349&&(!l9_1347);
float l9_1353=1.0;
float l9_1354=l9_1343.x;
int l9_1355=l9_1346.x;
if (l9_1355==1)
{
l9_1354=fract(l9_1354);
}
else
{
if (l9_1355==2)
{
float l9_1356=fract(l9_1354);
float l9_1357=l9_1354-l9_1356;
float l9_1358=step(0.25,fract(l9_1357*0.5));
l9_1354=mix(l9_1356,1.0-l9_1356,fast::clamp(l9_1358,0.0,1.0));
}
}
l9_1343.x=l9_1354;
float l9_1359=l9_1343.y;
int l9_1360=l9_1346.y;
if (l9_1360==1)
{
l9_1359=fract(l9_1359);
}
else
{
if (l9_1360==2)
{
float l9_1361=fract(l9_1359);
float l9_1362=l9_1359-l9_1361;
float l9_1363=step(0.25,fract(l9_1362*0.5));
l9_1359=mix(l9_1361,1.0-l9_1361,fast::clamp(l9_1363,0.0,1.0));
}
}
l9_1343.y=l9_1359;
if (l9_1347)
{
bool l9_1364=l9_1349;
bool l9_1365;
if (l9_1364)
{
l9_1365=l9_1346.x==3;
}
else
{
l9_1365=l9_1364;
}
float l9_1366=l9_1343.x;
float l9_1367=l9_1348.x;
float l9_1368=l9_1348.z;
bool l9_1369=l9_1365;
float l9_1370=l9_1353;
float l9_1371=fast::clamp(l9_1366,l9_1367,l9_1368);
float l9_1372=step(abs(l9_1366-l9_1371),9.9999997e-06);
l9_1370*=(l9_1372+((1.0-float(l9_1369))*(1.0-l9_1372)));
l9_1366=l9_1371;
l9_1343.x=l9_1366;
l9_1353=l9_1370;
bool l9_1373=l9_1349;
bool l9_1374;
if (l9_1373)
{
l9_1374=l9_1346.y==3;
}
else
{
l9_1374=l9_1373;
}
float l9_1375=l9_1343.y;
float l9_1376=l9_1348.y;
float l9_1377=l9_1348.w;
bool l9_1378=l9_1374;
float l9_1379=l9_1353;
float l9_1380=fast::clamp(l9_1375,l9_1376,l9_1377);
float l9_1381=step(abs(l9_1375-l9_1380),9.9999997e-06);
l9_1379*=(l9_1381+((1.0-float(l9_1378))*(1.0-l9_1381)));
l9_1375=l9_1380;
l9_1343.y=l9_1375;
l9_1353=l9_1379;
}
float2 l9_1382=l9_1343;
bool l9_1383=l9_1344;
float3x3 l9_1384=l9_1345;
if (l9_1383)
{
l9_1382=float2((l9_1384*float3(l9_1382,1.0)).xy);
}
float2 l9_1385=l9_1382;
l9_1343=l9_1385;
float l9_1386=l9_1343.x;
int l9_1387=l9_1346.x;
bool l9_1388=l9_1352;
float l9_1389=l9_1353;
if ((l9_1387==0)||(l9_1387==3))
{
float l9_1390=l9_1386;
float l9_1391=0.0;
float l9_1392=1.0;
bool l9_1393=l9_1388;
float l9_1394=l9_1389;
float l9_1395=fast::clamp(l9_1390,l9_1391,l9_1392);
float l9_1396=step(abs(l9_1390-l9_1395),9.9999997e-06);
l9_1394*=(l9_1396+((1.0-float(l9_1393))*(1.0-l9_1396)));
l9_1390=l9_1395;
l9_1386=l9_1390;
l9_1389=l9_1394;
}
l9_1343.x=l9_1386;
l9_1353=l9_1389;
float l9_1397=l9_1343.y;
int l9_1398=l9_1346.y;
bool l9_1399=l9_1352;
float l9_1400=l9_1353;
if ((l9_1398==0)||(l9_1398==3))
{
float l9_1401=l9_1397;
float l9_1402=0.0;
float l9_1403=1.0;
bool l9_1404=l9_1399;
float l9_1405=l9_1400;
float l9_1406=fast::clamp(l9_1401,l9_1402,l9_1403);
float l9_1407=step(abs(l9_1401-l9_1406),9.9999997e-06);
l9_1405*=(l9_1407+((1.0-float(l9_1404))*(1.0-l9_1407)));
l9_1401=l9_1406;
l9_1397=l9_1401;
l9_1400=l9_1405;
}
l9_1343.y=l9_1397;
l9_1353=l9_1400;
float2 l9_1408=l9_1343;
int l9_1409=l9_1341;
int l9_1410=l9_1342;
float l9_1411=l9_1351;
float2 l9_1412=l9_1408;
int l9_1413=l9_1409;
int l9_1414=l9_1410;
float3 l9_1415=float3(0.0);
if (l9_1413==0)
{
l9_1415=float3(l9_1412,0.0);
}
else
{
if (l9_1413==1)
{
l9_1415=float3(l9_1412.x,(l9_1412.y*0.5)+(0.5-(float(l9_1414)*0.5)),0.0);
}
else
{
l9_1415=float3(l9_1412,float(l9_1414));
}
}
float3 l9_1416=l9_1415;
float3 l9_1417=l9_1416;
float4 l9_1418=sc_set0.clearcoatTexture.sample(sc_set0.clearcoatTextureSmpSC,l9_1417.xy,bias(l9_1411));
float4 l9_1419=l9_1418;
if (l9_1349)
{
l9_1419=mix(l9_1350,l9_1419,float4(l9_1353));
}
float4 l9_1420=l9_1419;
l9_1334=l9_1420;
float4 l9_1421=l9_1334;
float l9_1422=l9_1421.x;
float l9_1423;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1423=pow(l9_1422,2.2);
}
else
{
l9_1423=l9_1422*l9_1422;
}
float l9_1424=l9_1423;
N3_ClearcoatBase=l9_1424;
}
N3_ClearcoatBase*=N3_ClearcoatFactor;
if (N3_EnableClearCoatRoughnessTexture)
{
int l9_1425=N3_ClearcoatRoughnessTextureCoord;
float2 l9_1426=tempGlobals.Surface_UVCoord0;
float2 l9_1427=l9_1426;
if (l9_1425==0)
{
float2 l9_1428=tempGlobals.Surface_UVCoord0;
l9_1427=l9_1428;
}
if (l9_1425==1)
{
float2 l9_1429=tempGlobals.Surface_UVCoord1;
l9_1427=l9_1429;
}
float2 l9_1430=l9_1427;
float2 l9_1431=l9_1430;
if (N3_EnableTextureTransform&&N3_ClearcoatRoughnessTextureTransform)
{
float2 l9_1432=l9_1431;
float2 l9_1433=N3_ClearcoatRoughnessTextureOffset;
float2 l9_1434=N3_ClearcoatRoughnessTextureScale;
float l9_1435=N3_ClearcoatRoughnessTextureRotation;
float l9_1436=radians(l9_1435);
float3x3 l9_1437=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_1433.x,l9_1433.y,1.0));
float3x3 l9_1438=float3x3(float3(cos(l9_1436),sin(l9_1436),0.0),float3(-sin(l9_1436),cos(l9_1436),0.0),float3(0.0,0.0,1.0));
float3x3 l9_1439=float3x3(float3(l9_1434.x,0.0,0.0),float3(0.0,l9_1434.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_1440=(l9_1437*l9_1438)*l9_1439;
float2 l9_1441=(l9_1440*float3(l9_1432,1.0)).xy;
l9_1431=l9_1441;
}
float2 l9_1442=l9_1431;
float4 l9_1443=float4(0.0);
int l9_1444;
if ((int(clearcoatRoughnessTextureHasSwappedViews_tmp)!=0))
{
int l9_1445=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1445=0;
}
else
{
l9_1445=in.varStereoViewID;
}
int l9_1446=l9_1445;
l9_1444=1-l9_1446;
}
else
{
int l9_1447=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1447=0;
}
else
{
l9_1447=in.varStereoViewID;
}
int l9_1448=l9_1447;
l9_1444=l9_1448;
}
int l9_1449=l9_1444;
int l9_1450=clearcoatRoughnessTextureLayout_tmp;
int l9_1451=l9_1449;
float2 l9_1452=l9_1442;
bool l9_1453=(int(SC_USE_UV_TRANSFORM_clearcoatRoughnessTexture_tmp)!=0);
float3x3 l9_1454=(*sc_set0.UserUniforms).clearcoatRoughnessTextureTransform;
int2 l9_1455=int2(SC_SOFTWARE_WRAP_MODE_U_clearcoatRoughnessTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_clearcoatRoughnessTexture_tmp);
bool l9_1456=(int(SC_USE_UV_MIN_MAX_clearcoatRoughnessTexture_tmp)!=0);
float4 l9_1457=(*sc_set0.UserUniforms).clearcoatRoughnessTextureUvMinMax;
bool l9_1458=(int(SC_USE_CLAMP_TO_BORDER_clearcoatRoughnessTexture_tmp)!=0);
float4 l9_1459=(*sc_set0.UserUniforms).clearcoatRoughnessTextureBorderColor;
float l9_1460=0.0;
bool l9_1461=l9_1458&&(!l9_1456);
float l9_1462=1.0;
float l9_1463=l9_1452.x;
int l9_1464=l9_1455.x;
if (l9_1464==1)
{
l9_1463=fract(l9_1463);
}
else
{
if (l9_1464==2)
{
float l9_1465=fract(l9_1463);
float l9_1466=l9_1463-l9_1465;
float l9_1467=step(0.25,fract(l9_1466*0.5));
l9_1463=mix(l9_1465,1.0-l9_1465,fast::clamp(l9_1467,0.0,1.0));
}
}
l9_1452.x=l9_1463;
float l9_1468=l9_1452.y;
int l9_1469=l9_1455.y;
if (l9_1469==1)
{
l9_1468=fract(l9_1468);
}
else
{
if (l9_1469==2)
{
float l9_1470=fract(l9_1468);
float l9_1471=l9_1468-l9_1470;
float l9_1472=step(0.25,fract(l9_1471*0.5));
l9_1468=mix(l9_1470,1.0-l9_1470,fast::clamp(l9_1472,0.0,1.0));
}
}
l9_1452.y=l9_1468;
if (l9_1456)
{
bool l9_1473=l9_1458;
bool l9_1474;
if (l9_1473)
{
l9_1474=l9_1455.x==3;
}
else
{
l9_1474=l9_1473;
}
float l9_1475=l9_1452.x;
float l9_1476=l9_1457.x;
float l9_1477=l9_1457.z;
bool l9_1478=l9_1474;
float l9_1479=l9_1462;
float l9_1480=fast::clamp(l9_1475,l9_1476,l9_1477);
float l9_1481=step(abs(l9_1475-l9_1480),9.9999997e-06);
l9_1479*=(l9_1481+((1.0-float(l9_1478))*(1.0-l9_1481)));
l9_1475=l9_1480;
l9_1452.x=l9_1475;
l9_1462=l9_1479;
bool l9_1482=l9_1458;
bool l9_1483;
if (l9_1482)
{
l9_1483=l9_1455.y==3;
}
else
{
l9_1483=l9_1482;
}
float l9_1484=l9_1452.y;
float l9_1485=l9_1457.y;
float l9_1486=l9_1457.w;
bool l9_1487=l9_1483;
float l9_1488=l9_1462;
float l9_1489=fast::clamp(l9_1484,l9_1485,l9_1486);
float l9_1490=step(abs(l9_1484-l9_1489),9.9999997e-06);
l9_1488*=(l9_1490+((1.0-float(l9_1487))*(1.0-l9_1490)));
l9_1484=l9_1489;
l9_1452.y=l9_1484;
l9_1462=l9_1488;
}
float2 l9_1491=l9_1452;
bool l9_1492=l9_1453;
float3x3 l9_1493=l9_1454;
if (l9_1492)
{
l9_1491=float2((l9_1493*float3(l9_1491,1.0)).xy);
}
float2 l9_1494=l9_1491;
l9_1452=l9_1494;
float l9_1495=l9_1452.x;
int l9_1496=l9_1455.x;
bool l9_1497=l9_1461;
float l9_1498=l9_1462;
if ((l9_1496==0)||(l9_1496==3))
{
float l9_1499=l9_1495;
float l9_1500=0.0;
float l9_1501=1.0;
bool l9_1502=l9_1497;
float l9_1503=l9_1498;
float l9_1504=fast::clamp(l9_1499,l9_1500,l9_1501);
float l9_1505=step(abs(l9_1499-l9_1504),9.9999997e-06);
l9_1503*=(l9_1505+((1.0-float(l9_1502))*(1.0-l9_1505)));
l9_1499=l9_1504;
l9_1495=l9_1499;
l9_1498=l9_1503;
}
l9_1452.x=l9_1495;
l9_1462=l9_1498;
float l9_1506=l9_1452.y;
int l9_1507=l9_1455.y;
bool l9_1508=l9_1461;
float l9_1509=l9_1462;
if ((l9_1507==0)||(l9_1507==3))
{
float l9_1510=l9_1506;
float l9_1511=0.0;
float l9_1512=1.0;
bool l9_1513=l9_1508;
float l9_1514=l9_1509;
float l9_1515=fast::clamp(l9_1510,l9_1511,l9_1512);
float l9_1516=step(abs(l9_1510-l9_1515),9.9999997e-06);
l9_1514*=(l9_1516+((1.0-float(l9_1513))*(1.0-l9_1516)));
l9_1510=l9_1515;
l9_1506=l9_1510;
l9_1509=l9_1514;
}
l9_1452.y=l9_1506;
l9_1462=l9_1509;
float2 l9_1517=l9_1452;
int l9_1518=l9_1450;
int l9_1519=l9_1451;
float l9_1520=l9_1460;
float2 l9_1521=l9_1517;
int l9_1522=l9_1518;
int l9_1523=l9_1519;
float3 l9_1524=float3(0.0);
if (l9_1522==0)
{
l9_1524=float3(l9_1521,0.0);
}
else
{
if (l9_1522==1)
{
l9_1524=float3(l9_1521.x,(l9_1521.y*0.5)+(0.5-(float(l9_1523)*0.5)),0.0);
}
else
{
l9_1524=float3(l9_1521,float(l9_1523));
}
}
float3 l9_1525=l9_1524;
float3 l9_1526=l9_1525;
float4 l9_1527=sc_set0.clearcoatRoughnessTexture.sample(sc_set0.clearcoatRoughnessTextureSmpSC,l9_1526.xy,bias(l9_1520));
float4 l9_1528=l9_1527;
if (l9_1458)
{
l9_1528=mix(l9_1459,l9_1528,float4(l9_1462));
}
float4 l9_1529=l9_1528;
l9_1443=l9_1529;
float4 l9_1530=l9_1443;
float l9_1531=l9_1530.y;
float l9_1532;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1532=pow(l9_1531,2.2);
}
else
{
l9_1532=l9_1531*l9_1531;
}
float l9_1533=l9_1532;
N3_ClearcoatRoughness=l9_1533;
}
N3_ClearcoatRoughness*=N3_ClearcoatRoughnessFactor;
if (N3_EnableClearCoatNormalTexture)
{
int l9_1534=N3_ClearcoatNormalMapCoord;
float2 l9_1535=tempGlobals.Surface_UVCoord0;
float2 l9_1536=l9_1535;
if (l9_1534==0)
{
float2 l9_1537=tempGlobals.Surface_UVCoord0;
l9_1536=l9_1537;
}
if (l9_1534==1)
{
float2 l9_1538=tempGlobals.Surface_UVCoord1;
l9_1536=l9_1538;
}
float2 l9_1539=l9_1536;
float2 l9_1540=l9_1539;
if (N3_EnableTextureTransform&&N3_ClearcoatNormalTextureTransform)
{
float2 l9_1541=l9_1540;
float2 l9_1542=N3_ClearcoatNormalTextureOffset;
float2 l9_1543=N3_ClearcoatNormalTextureScale;
float l9_1544=N3_ClearcoatNormalTextureRotation;
float l9_1545=radians(l9_1544);
float3x3 l9_1546=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_1542.x,l9_1542.y,1.0));
float3x3 l9_1547=float3x3(float3(cos(l9_1545),sin(l9_1545),0.0),float3(-sin(l9_1545),cos(l9_1545),0.0),float3(0.0,0.0,1.0));
float3x3 l9_1548=float3x3(float3(l9_1543.x,0.0,0.0),float3(0.0,l9_1543.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_1549=(l9_1546*l9_1547)*l9_1548;
float2 l9_1550=(l9_1549*float3(l9_1541,1.0)).xy;
l9_1540=l9_1550;
}
float2 l9_1551=l9_1540;
float4 l9_1552=float4(0.0);
int l9_1553;
if ((int(clearcoatNormalTextureHasSwappedViews_tmp)!=0))
{
int l9_1554=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1554=0;
}
else
{
l9_1554=in.varStereoViewID;
}
int l9_1555=l9_1554;
l9_1553=1-l9_1555;
}
else
{
int l9_1556=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1556=0;
}
else
{
l9_1556=in.varStereoViewID;
}
int l9_1557=l9_1556;
l9_1553=l9_1557;
}
int l9_1558=l9_1553;
int l9_1559=clearcoatNormalTextureLayout_tmp;
int l9_1560=l9_1558;
float2 l9_1561=l9_1551;
bool l9_1562=(int(SC_USE_UV_TRANSFORM_clearcoatNormalTexture_tmp)!=0);
float3x3 l9_1563=(*sc_set0.UserUniforms).clearcoatNormalTextureTransform;
int2 l9_1564=int2(SC_SOFTWARE_WRAP_MODE_U_clearcoatNormalTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_clearcoatNormalTexture_tmp);
bool l9_1565=(int(SC_USE_UV_MIN_MAX_clearcoatNormalTexture_tmp)!=0);
float4 l9_1566=(*sc_set0.UserUniforms).clearcoatNormalTextureUvMinMax;
bool l9_1567=(int(SC_USE_CLAMP_TO_BORDER_clearcoatNormalTexture_tmp)!=0);
float4 l9_1568=(*sc_set0.UserUniforms).clearcoatNormalTextureBorderColor;
float l9_1569=0.0;
bool l9_1570=l9_1567&&(!l9_1565);
float l9_1571=1.0;
float l9_1572=l9_1561.x;
int l9_1573=l9_1564.x;
if (l9_1573==1)
{
l9_1572=fract(l9_1572);
}
else
{
if (l9_1573==2)
{
float l9_1574=fract(l9_1572);
float l9_1575=l9_1572-l9_1574;
float l9_1576=step(0.25,fract(l9_1575*0.5));
l9_1572=mix(l9_1574,1.0-l9_1574,fast::clamp(l9_1576,0.0,1.0));
}
}
l9_1561.x=l9_1572;
float l9_1577=l9_1561.y;
int l9_1578=l9_1564.y;
if (l9_1578==1)
{
l9_1577=fract(l9_1577);
}
else
{
if (l9_1578==2)
{
float l9_1579=fract(l9_1577);
float l9_1580=l9_1577-l9_1579;
float l9_1581=step(0.25,fract(l9_1580*0.5));
l9_1577=mix(l9_1579,1.0-l9_1579,fast::clamp(l9_1581,0.0,1.0));
}
}
l9_1561.y=l9_1577;
if (l9_1565)
{
bool l9_1582=l9_1567;
bool l9_1583;
if (l9_1582)
{
l9_1583=l9_1564.x==3;
}
else
{
l9_1583=l9_1582;
}
float l9_1584=l9_1561.x;
float l9_1585=l9_1566.x;
float l9_1586=l9_1566.z;
bool l9_1587=l9_1583;
float l9_1588=l9_1571;
float l9_1589=fast::clamp(l9_1584,l9_1585,l9_1586);
float l9_1590=step(abs(l9_1584-l9_1589),9.9999997e-06);
l9_1588*=(l9_1590+((1.0-float(l9_1587))*(1.0-l9_1590)));
l9_1584=l9_1589;
l9_1561.x=l9_1584;
l9_1571=l9_1588;
bool l9_1591=l9_1567;
bool l9_1592;
if (l9_1591)
{
l9_1592=l9_1564.y==3;
}
else
{
l9_1592=l9_1591;
}
float l9_1593=l9_1561.y;
float l9_1594=l9_1566.y;
float l9_1595=l9_1566.w;
bool l9_1596=l9_1592;
float l9_1597=l9_1571;
float l9_1598=fast::clamp(l9_1593,l9_1594,l9_1595);
float l9_1599=step(abs(l9_1593-l9_1598),9.9999997e-06);
l9_1597*=(l9_1599+((1.0-float(l9_1596))*(1.0-l9_1599)));
l9_1593=l9_1598;
l9_1561.y=l9_1593;
l9_1571=l9_1597;
}
float2 l9_1600=l9_1561;
bool l9_1601=l9_1562;
float3x3 l9_1602=l9_1563;
if (l9_1601)
{
l9_1600=float2((l9_1602*float3(l9_1600,1.0)).xy);
}
float2 l9_1603=l9_1600;
l9_1561=l9_1603;
float l9_1604=l9_1561.x;
int l9_1605=l9_1564.x;
bool l9_1606=l9_1570;
float l9_1607=l9_1571;
if ((l9_1605==0)||(l9_1605==3))
{
float l9_1608=l9_1604;
float l9_1609=0.0;
float l9_1610=1.0;
bool l9_1611=l9_1606;
float l9_1612=l9_1607;
float l9_1613=fast::clamp(l9_1608,l9_1609,l9_1610);
float l9_1614=step(abs(l9_1608-l9_1613),9.9999997e-06);
l9_1612*=(l9_1614+((1.0-float(l9_1611))*(1.0-l9_1614)));
l9_1608=l9_1613;
l9_1604=l9_1608;
l9_1607=l9_1612;
}
l9_1561.x=l9_1604;
l9_1571=l9_1607;
float l9_1615=l9_1561.y;
int l9_1616=l9_1564.y;
bool l9_1617=l9_1570;
float l9_1618=l9_1571;
if ((l9_1616==0)||(l9_1616==3))
{
float l9_1619=l9_1615;
float l9_1620=0.0;
float l9_1621=1.0;
bool l9_1622=l9_1617;
float l9_1623=l9_1618;
float l9_1624=fast::clamp(l9_1619,l9_1620,l9_1621);
float l9_1625=step(abs(l9_1619-l9_1624),9.9999997e-06);
l9_1623*=(l9_1625+((1.0-float(l9_1622))*(1.0-l9_1625)));
l9_1619=l9_1624;
l9_1615=l9_1619;
l9_1618=l9_1623;
}
l9_1561.y=l9_1615;
l9_1571=l9_1618;
float2 l9_1626=l9_1561;
int l9_1627=l9_1559;
int l9_1628=l9_1560;
float l9_1629=l9_1569;
float2 l9_1630=l9_1626;
int l9_1631=l9_1627;
int l9_1632=l9_1628;
float3 l9_1633=float3(0.0);
if (l9_1631==0)
{
l9_1633=float3(l9_1630,0.0);
}
else
{
if (l9_1631==1)
{
l9_1633=float3(l9_1630.x,(l9_1630.y*0.5)+(0.5-(float(l9_1632)*0.5)),0.0);
}
else
{
l9_1633=float3(l9_1630,float(l9_1632));
}
}
float3 l9_1634=l9_1633;
float3 l9_1635=l9_1634;
float4 l9_1636=sc_set0.clearcoatNormalTexture.sample(sc_set0.clearcoatNormalTextureSmpSC,l9_1635.xy,bias(l9_1629));
float4 l9_1637=l9_1636;
if (l9_1567)
{
l9_1637=mix(l9_1568,l9_1637,float4(l9_1571));
}
float4 l9_1638=l9_1637;
l9_1552=l9_1638;
float4 l9_1639=l9_1552;
N3_ClearcoatNormal=l9_1639.xyz;
N3_ClearcoatNormal*=0.9921875;
}
}
l9_281=N3_BaseColor;
l9_282=N3_Opacity;
l9_283=N3_Normal;
l9_284=N3_Emissive;
l9_285=N3_Metallic;
l9_286=N3_Roughness;
l9_287=N3_Occlusion;
l9_288=N3_Background;
l9_289=N3_SheenOut;
l9_290=N3_ClearcoatBase;
l9_291=N3_ClearcoatNormal;
l9_292=N3_ClearcoatRoughness;
l9_229=l9_281;
l9_230=l9_282;
l9_231=l9_283;
l9_232=l9_284;
l9_233=l9_285;
l9_234=l9_286;
l9_235=l9_287;
l9_236=l9_288;
l9_237=l9_289;
l9_238=l9_290;
l9_239=l9_291;
l9_240=l9_292;
float4 l9_1640=float4(0.0);
float3 l9_1641=l9_229;
float l9_1642=l9_230;
float3 l9_1643=l9_231;
float3 l9_1644=l9_232;
float l9_1645=l9_233;
float l9_1646=l9_234;
float3 l9_1647=l9_235.xyz;
float3 l9_1648=(*sc_set0.UserUniforms).Port_SpecularAO_N036;
ssGlobals l9_1649=param_4;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
l9_1649.BumpedNormal=l9_1643;
}
l9_1642=fast::clamp(l9_1642,0.0,1.0);
float l9_1650=l9_1642;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_1650<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_1651=gl_FragCoord;
float2 l9_1652=floor(mod(l9_1651.xy,float2(4.0)));
float l9_1653=(mod(dot(l9_1652,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_1650<l9_1653)
{
discard_fragment();
}
}
l9_1641=fast::max(l9_1641,float3(0.0));
float4 l9_1654;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
l9_1654=float4(l9_1641,l9_1642);
}
else
{
l9_1644=fast::max(l9_1644,float3(0.0));
l9_1645=fast::clamp(l9_1645,0.0,1.0);
l9_1646=fast::clamp(l9_1646,0.0,1.0);
l9_1647=fast::clamp(l9_1647,float3(0.0),float3(1.0));
float3 l9_1655=l9_1641;
float l9_1656=l9_1642;
float3 l9_1657=l9_1649.BumpedNormal;
float3 l9_1658=l9_1649.PositionWS;
float3 l9_1659=l9_1649.ViewDirWS;
float3 l9_1660=l9_1644;
float l9_1661=l9_1645;
float l9_1662=l9_1646;
float3 l9_1663=l9_1647;
float3 l9_1664=l9_1648;
l9_1654=ngsCalculateLighting(l9_1655,l9_1656,l9_1657,l9_1658,l9_1659,l9_1660,l9_1661,l9_1662,l9_1663,l9_1664,in.varStereoViewID,sc_set0.sc_EnvmapDiffuse,sc_set0.sc_EnvmapDiffuseSmpSC,sc_set0.sc_EnvmapSpecular,sc_set0.sc_EnvmapSpecularSmpSC,sc_set0.sc_ScreenTexture,sc_set0.sc_ScreenTextureSmpSC,sc_set0.sc_RayTracingReflections,sc_set0.sc_RayTracingReflectionsSmpSC,sc_set0.sc_RayTracingGlobalIllumination,sc_set0.sc_RayTracingGlobalIlluminationSmpSC,sc_set0.sc_RayTracingShadows,sc_set0.sc_RayTracingShadowsSmpSC,gl_FragCoord,(*sc_set0.UserUniforms),in.varShadowTex,sc_set0.sc_ShadowTexture,sc_set0.sc_ShadowTextureSmpSC,out.sc_FragData0,sc_set0.sc_SSAOTexture,sc_set0.sc_SSAOTextureSmpSC);
}
l9_1654=fast::max(l9_1654,float4(0.0));
l9_1640=l9_1654;
float4 l9_1665=float4(0.0);
float3 l9_1666=(*sc_set0.UserUniforms).Port_Albedo_N405;
float l9_1667=(*sc_set0.UserUniforms).Port_Opacity_N405;
float3 l9_1668=l9_239;
float3 l9_1669=(*sc_set0.UserUniforms).Port_Emissive_N405;
float l9_1670=(*sc_set0.UserUniforms).Port_Metallic_N405;
float l9_1671=l9_240;
float3 l9_1672=(*sc_set0.UserUniforms).Port_SpecularAO_N405;
ssGlobals l9_1673=param_4;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
l9_1673.BumpedNormal=float3x3(float3(l9_1673.VertexTangent_WorldSpace),float3(l9_1673.VertexBinormal_WorldSpace),float3(l9_1673.VertexNormal_WorldSpace))*l9_1668;
}
float l9_1674=l9_1667;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_1674<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_1675=gl_FragCoord;
float2 l9_1676=floor(mod(l9_1675.xy,float2(4.0)));
float l9_1677=(mod(dot(l9_1676,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_1674<l9_1677)
{
discard_fragment();
}
}
float4 l9_1678;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
l9_1678=float4(l9_1666,l9_1667);
}
else
{
l9_1671=fast::clamp(l9_1671,0.0,1.0);
float3 l9_1679=float3(1.0);
float3 l9_1680=l9_1666;
float l9_1681=l9_1667;
float3 l9_1682=l9_1673.BumpedNormal;
float3 l9_1683=l9_1673.PositionWS;
float3 l9_1684=l9_1673.ViewDirWS;
float3 l9_1685=l9_1669;
float l9_1686=l9_1670;
float l9_1687=l9_1671;
float3 l9_1688=l9_1679;
float3 l9_1689=l9_1672;
l9_1678=ngsCalculateLighting(l9_1680,l9_1681,l9_1682,l9_1683,l9_1684,l9_1685,l9_1686,l9_1687,l9_1688,l9_1689,in.varStereoViewID,sc_set0.sc_EnvmapDiffuse,sc_set0.sc_EnvmapDiffuseSmpSC,sc_set0.sc_EnvmapSpecular,sc_set0.sc_EnvmapSpecularSmpSC,sc_set0.sc_ScreenTexture,sc_set0.sc_ScreenTextureSmpSC,sc_set0.sc_RayTracingReflections,sc_set0.sc_RayTracingReflectionsSmpSC,sc_set0.sc_RayTracingGlobalIllumination,sc_set0.sc_RayTracingGlobalIlluminationSmpSC,sc_set0.sc_RayTracingShadows,sc_set0.sc_RayTracingShadowsSmpSC,gl_FragCoord,(*sc_set0.UserUniforms),in.varShadowTex,sc_set0.sc_ShadowTexture,sc_set0.sc_ShadowTextureSmpSC,out.sc_FragData0,sc_set0.sc_SSAOTexture,sc_set0.sc_SSAOTextureSmpSC);
}
l9_1678=fast::max(l9_1678,float4(0.0));
l9_1665=l9_1678;
float4 l9_1690=float4(0.0);
float4 l9_1691=l9_1640;
float l9_1692=l9_230;
float3 l9_1693=l9_236;
float4 l9_1694=l9_237;
float l9_1695=l9_238;
float4 l9_1696=l9_1665;
ssGlobals l9_1697=param_4;
tempGlobals=l9_1697;
float4 l9_1698=float4(0.0);
N31_PbrIn=l9_1691;
N31_EnableTransmission=(int(ENABLE_TRANSMISSION_tmp)!=0);
N31_Opacity=l9_1692;
N31_Background=l9_1693;
N31_EnableSheen=(int(ENABLE_SHEEN_tmp)!=0);
N31_SheenColor=l9_1694;
N31_EnableClearcoat=(int(ENABLE_CLEARCOAT_tmp)!=0);
N31_ClearcoatBase=l9_1695;
N31_ClearcoatColor=l9_1696;
N31_Result=N31_PbrIn;
if ((N31_EnableSheen||N31_EnableTransmission)||N31_EnableClearcoat)
{
float4 l9_1699=N31_Result;
float4 l9_1700;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1700=float4(pow(l9_1699.x,2.2),pow(l9_1699.y,2.2),pow(l9_1699.z,2.2),pow(l9_1699.w,2.2));
}
else
{
l9_1700=l9_1699*l9_1699;
}
float4 l9_1701=l9_1700;
N31_Result=l9_1701;
if (N31_EnableSheen)
{
float l9_1702=N31_SheenColor.w;
float3 l9_1703=(N31_Result.xyz*l9_1702)+N31_SheenColor.xyz;
N31_Result=float4(l9_1703.x,l9_1703.y,l9_1703.z,N31_Result.w);
}
if (N31_EnableTransmission)
{
float4 l9_1704=N31_Result;
float l9_1705=N31_Opacity;
float l9_1706;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1706=pow(l9_1705,2.2);
}
else
{
l9_1706=l9_1705*l9_1705;
}
float l9_1707=l9_1706;
N31_Result=mix(float4(N31_Background,1.0),l9_1704,float4(l9_1707));
N31_Result.w=1.0;
}
if (N31_EnableClearcoat)
{
float l9_1708=N31_ClearcoatBase;
float4 l9_1709=N31_ClearcoatColor;
float4 l9_1710;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1710=float4(pow(l9_1709.x,2.2),pow(l9_1709.y,2.2),pow(l9_1709.z,2.2),pow(l9_1709.w,2.2));
}
else
{
l9_1710=l9_1709*l9_1709;
}
float4 l9_1711=l9_1710;
float4 l9_1712=l9_1711*l9_1708;
float3 l9_1713=N31_Result.xyz+l9_1712.xyz;
N31_Result=float4(l9_1713.x,l9_1713.y,l9_1713.z,N31_Result.w);
}
float4 l9_1714=N31_Result;
float4 l9_1715;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1715=float4(pow(l9_1714.x,0.45454544),pow(l9_1714.y,0.45454544),pow(l9_1714.z,0.45454544),pow(l9_1714.w,0.45454544));
}
else
{
l9_1715=sqrt(l9_1714);
}
float4 l9_1716=l9_1715;
N31_Result=l9_1716;
}
l9_1698=N31_Result;
l9_1690=l9_1698;
param_1=l9_1690;
param_3=param_1;
}
else
{
float4 l9_1717=float4(0.0);
float4 l9_1718=(*sc_set0.UserUniforms).baseColorFactor;
l9_1717=l9_1718;
float2 l9_1719=float2(0.0);
float2 l9_1720=(*sc_set0.UserUniforms).baseColorTexture_offset;
l9_1719=l9_1720;
float2 l9_1721=float2(0.0);
float2 l9_1722=(*sc_set0.UserUniforms).baseColorTexture_scale;
l9_1721=l9_1722;
float l9_1723=0.0;
float l9_1724=(*sc_set0.UserUniforms).baseColorTexture_rotation;
l9_1723=l9_1724;
float4 l9_1725=float4(0.0);
float4 l9_1726=l9_1717;
float2 l9_1727=l9_1719;
float2 l9_1728=l9_1721;
float l9_1729=l9_1723;
ssGlobals l9_1730=param_4;
tempGlobals=l9_1730;
float4 l9_1731=float4(0.0);
N35_EnableVertexColor=(int(ENABLE_VERTEX_COLOR_BASE_tmp)!=0);
N35_EnableBaseTexture=(int(ENABLE_BASE_TEX_tmp)!=0);
N35_BaseColorTextureCoord=NODE_7_DROPLIST_ITEM_tmp;
N35_BaseColorFactor=l9_1726;
N35_EnableTextureTransform=(int(ENABLE_TEXTURE_TRANSFORM_tmp)!=0);
N35_BaseTextureTransform=(int(ENABLE_BASE_TEXTURE_TRANSFORM_tmp)!=0);
N35_BaseTextureOffset=l9_1727;
N35_BaseTextureScale=l9_1728;
N35_BaseTextureRotation=l9_1729;
float4 l9_1732=N35_BaseColorFactor;
if (N35_EnableBaseTexture)
{
int l9_1733=N35_BaseColorTextureCoord;
float2 l9_1734=tempGlobals.Surface_UVCoord0;
float2 l9_1735=l9_1734;
if (l9_1733==0)
{
float2 l9_1736=tempGlobals.Surface_UVCoord0;
l9_1735=l9_1736;
}
if (l9_1733==1)
{
float2 l9_1737=tempGlobals.Surface_UVCoord1;
l9_1735=l9_1737;
}
float2 l9_1738=l9_1735;
float2 l9_1739=l9_1738;
if (N35_EnableTextureTransform&&N35_BaseTextureTransform)
{
float2 l9_1740=l9_1739;
float2 l9_1741=N35_BaseTextureOffset;
float2 l9_1742=N35_BaseTextureScale;
float l9_1743=N35_BaseTextureRotation;
float3x3 l9_1744=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_1741.x,l9_1741.y,1.0));
float3x3 l9_1745=float3x3(float3(cos(l9_1743),sin(l9_1743),0.0),float3(-sin(l9_1743),cos(l9_1743),0.0),float3(0.0,0.0,1.0));
float3x3 l9_1746=float3x3(float3(l9_1742.x,0.0,0.0),float3(0.0,l9_1742.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_1747=(l9_1744*l9_1745)*l9_1746;
float2 l9_1748=(l9_1747*float3(l9_1740,1.0)).xy;
l9_1739=l9_1748;
}
float2 l9_1749=l9_1739;
float4 l9_1750=float4(0.0);
int l9_1751;
if ((int(baseColorTextureHasSwappedViews_tmp)!=0))
{
int l9_1752=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1752=0;
}
else
{
l9_1752=in.varStereoViewID;
}
int l9_1753=l9_1752;
l9_1751=1-l9_1753;
}
else
{
int l9_1754=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1754=0;
}
else
{
l9_1754=in.varStereoViewID;
}
int l9_1755=l9_1754;
l9_1751=l9_1755;
}
int l9_1756=l9_1751;
int l9_1757=baseColorTextureLayout_tmp;
int l9_1758=l9_1756;
float2 l9_1759=l9_1749;
bool l9_1760=(int(SC_USE_UV_TRANSFORM_baseColorTexture_tmp)!=0);
float3x3 l9_1761=(*sc_set0.UserUniforms).baseColorTextureTransform;
int2 l9_1762=int2(SC_SOFTWARE_WRAP_MODE_U_baseColorTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_baseColorTexture_tmp);
bool l9_1763=(int(SC_USE_UV_MIN_MAX_baseColorTexture_tmp)!=0);
float4 l9_1764=(*sc_set0.UserUniforms).baseColorTextureUvMinMax;
bool l9_1765=(int(SC_USE_CLAMP_TO_BORDER_baseColorTexture_tmp)!=0);
float4 l9_1766=(*sc_set0.UserUniforms).baseColorTextureBorderColor;
float l9_1767=0.0;
bool l9_1768=l9_1765&&(!l9_1763);
float l9_1769=1.0;
float l9_1770=l9_1759.x;
int l9_1771=l9_1762.x;
if (l9_1771==1)
{
l9_1770=fract(l9_1770);
}
else
{
if (l9_1771==2)
{
float l9_1772=fract(l9_1770);
float l9_1773=l9_1770-l9_1772;
float l9_1774=step(0.25,fract(l9_1773*0.5));
l9_1770=mix(l9_1772,1.0-l9_1772,fast::clamp(l9_1774,0.0,1.0));
}
}
l9_1759.x=l9_1770;
float l9_1775=l9_1759.y;
int l9_1776=l9_1762.y;
if (l9_1776==1)
{
l9_1775=fract(l9_1775);
}
else
{
if (l9_1776==2)
{
float l9_1777=fract(l9_1775);
float l9_1778=l9_1775-l9_1777;
float l9_1779=step(0.25,fract(l9_1778*0.5));
l9_1775=mix(l9_1777,1.0-l9_1777,fast::clamp(l9_1779,0.0,1.0));
}
}
l9_1759.y=l9_1775;
if (l9_1763)
{
bool l9_1780=l9_1765;
bool l9_1781;
if (l9_1780)
{
l9_1781=l9_1762.x==3;
}
else
{
l9_1781=l9_1780;
}
float l9_1782=l9_1759.x;
float l9_1783=l9_1764.x;
float l9_1784=l9_1764.z;
bool l9_1785=l9_1781;
float l9_1786=l9_1769;
float l9_1787=fast::clamp(l9_1782,l9_1783,l9_1784);
float l9_1788=step(abs(l9_1782-l9_1787),9.9999997e-06);
l9_1786*=(l9_1788+((1.0-float(l9_1785))*(1.0-l9_1788)));
l9_1782=l9_1787;
l9_1759.x=l9_1782;
l9_1769=l9_1786;
bool l9_1789=l9_1765;
bool l9_1790;
if (l9_1789)
{
l9_1790=l9_1762.y==3;
}
else
{
l9_1790=l9_1789;
}
float l9_1791=l9_1759.y;
float l9_1792=l9_1764.y;
float l9_1793=l9_1764.w;
bool l9_1794=l9_1790;
float l9_1795=l9_1769;
float l9_1796=fast::clamp(l9_1791,l9_1792,l9_1793);
float l9_1797=step(abs(l9_1791-l9_1796),9.9999997e-06);
l9_1795*=(l9_1797+((1.0-float(l9_1794))*(1.0-l9_1797)));
l9_1791=l9_1796;
l9_1759.y=l9_1791;
l9_1769=l9_1795;
}
float2 l9_1798=l9_1759;
bool l9_1799=l9_1760;
float3x3 l9_1800=l9_1761;
if (l9_1799)
{
l9_1798=float2((l9_1800*float3(l9_1798,1.0)).xy);
}
float2 l9_1801=l9_1798;
l9_1759=l9_1801;
float l9_1802=l9_1759.x;
int l9_1803=l9_1762.x;
bool l9_1804=l9_1768;
float l9_1805=l9_1769;
if ((l9_1803==0)||(l9_1803==3))
{
float l9_1806=l9_1802;
float l9_1807=0.0;
float l9_1808=1.0;
bool l9_1809=l9_1804;
float l9_1810=l9_1805;
float l9_1811=fast::clamp(l9_1806,l9_1807,l9_1808);
float l9_1812=step(abs(l9_1806-l9_1811),9.9999997e-06);
l9_1810*=(l9_1812+((1.0-float(l9_1809))*(1.0-l9_1812)));
l9_1806=l9_1811;
l9_1802=l9_1806;
l9_1805=l9_1810;
}
l9_1759.x=l9_1802;
l9_1769=l9_1805;
float l9_1813=l9_1759.y;
int l9_1814=l9_1762.y;
bool l9_1815=l9_1768;
float l9_1816=l9_1769;
if ((l9_1814==0)||(l9_1814==3))
{
float l9_1817=l9_1813;
float l9_1818=0.0;
float l9_1819=1.0;
bool l9_1820=l9_1815;
float l9_1821=l9_1816;
float l9_1822=fast::clamp(l9_1817,l9_1818,l9_1819);
float l9_1823=step(abs(l9_1817-l9_1822),9.9999997e-06);
l9_1821*=(l9_1823+((1.0-float(l9_1820))*(1.0-l9_1823)));
l9_1817=l9_1822;
l9_1813=l9_1817;
l9_1816=l9_1821;
}
l9_1759.y=l9_1813;
l9_1769=l9_1816;
float2 l9_1824=l9_1759;
int l9_1825=l9_1757;
int l9_1826=l9_1758;
float l9_1827=l9_1767;
float2 l9_1828=l9_1824;
int l9_1829=l9_1825;
int l9_1830=l9_1826;
float3 l9_1831=float3(0.0);
if (l9_1829==0)
{
l9_1831=float3(l9_1828,0.0);
}
else
{
if (l9_1829==1)
{
l9_1831=float3(l9_1828.x,(l9_1828.y*0.5)+(0.5-(float(l9_1830)*0.5)),0.0);
}
else
{
l9_1831=float3(l9_1828,float(l9_1830));
}
}
float3 l9_1832=l9_1831;
float3 l9_1833=l9_1832;
float4 l9_1834=sc_set0.baseColorTexture.sample(sc_set0.baseColorTextureSmpSC,l9_1833.xy,bias(l9_1827));
float4 l9_1835=l9_1834;
if (l9_1765)
{
l9_1835=mix(l9_1766,l9_1835,float4(l9_1769));
}
float4 l9_1836=l9_1835;
l9_1750=l9_1836;
float4 l9_1837=l9_1750;
float4 l9_1838=l9_1837;
float4 l9_1839;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1839=float4(pow(l9_1838.x,2.2),pow(l9_1838.y,2.2),pow(l9_1838.z,2.2),pow(l9_1838.w,2.2));
}
else
{
l9_1839=l9_1838*l9_1838;
}
float4 l9_1840=l9_1839;
l9_1732*=l9_1840;
}
if (N35_EnableVertexColor)
{
float4 l9_1841=tempGlobals.VertexColor;
l9_1732*=l9_1841;
}
N35_BaseColor=l9_1732.xyz;
N35_Opacity=l9_1732.w;
float4 l9_1842=l9_1732;
float4 l9_1843;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_1843=float4(pow(l9_1842.x,0.45454544),pow(l9_1842.y,0.45454544),pow(l9_1842.z,0.45454544),pow(l9_1842.w,0.45454544));
}
else
{
l9_1843=sqrt(l9_1842);
}
float4 l9_1844=l9_1843;
N35_UnlitColor=l9_1844;
l9_1731=N35_UnlitColor;
l9_1725=l9_1731;
param_2=l9_1725;
param_3=param_2;
}
Output_N17=param_3;
float Output_N89=0.0;
float param_5=(*sc_set0.UserUniforms).colorMultiplier;
Output_N89=param_5;
float Output_N90=0.0;
Output_N90=Output_N89+1.0;
float4 Output_N91=float4(0.0);
Output_N91=Output_N17*float4(Output_N90);
float Value4_N92=0.0;
float4 param_6=Output_N17;
float param_7=param_6.w;
Value4_N92=param_7;
float4 Value_N93=float4(0.0);
Value_N93=float4(Output_N91.xyz.x,Output_N91.xyz.y,Output_N91.xyz.z,Value_N93.w);
Value_N93.w=Value4_N92;
FinalColor=Value_N93;
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param_8=FinalColor;
if ((int(sc_RayTracingCasterForceOpaque_tmp)!=0))
{
param_8.w=1.0;
}
float4 l9_1845=fast::max(param_8,float4(0.0));
float4 param_9=l9_1845;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_9.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_9;
return out;
}
float4 param_10=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_1846=param_10;
float4 l9_1847=l9_1846;
float l9_1848=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_1848=l9_1847.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_1848=fast::clamp(l9_1847.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_1848=fast::clamp(dot(l9_1847.xyz,float3(l9_1847.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_1848=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_1848=(1.0-dot(l9_1847.xyz,float3(0.33333001)))*l9_1847.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_1848=(1.0-fast::clamp(dot(l9_1847.xyz,float3(1.0)),0.0,1.0))*l9_1847.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_1848=fast::clamp(dot(l9_1847.xyz,float3(1.0)),0.0,1.0)*l9_1847.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_1848=fast::clamp(dot(l9_1847.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_1848=fast::clamp(dot(l9_1847.xyz,float3(1.0)),0.0,1.0)*l9_1847.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_1848=dot(l9_1847.xyz,float3(0.33333001))*l9_1847.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_1848=1.0-fast::clamp(dot(l9_1847.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_1848=fast::clamp(dot(l9_1847.xyz,float3(1.0)),0.0,1.0);
}
}
}
}
}
}
}
}
}
}
}
}
float l9_1849=l9_1848;
float l9_1850=l9_1849;
float l9_1851=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_1850;
float3 l9_1852=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_1846.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_1853=float4(l9_1852.x,l9_1852.y,l9_1852.z,l9_1851);
param_10=l9_1853;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_10=float4(param_10.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_1854=param_10;
float4 l9_1855=float4(0.0);
float4 l9_1856=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_1857=out.sc_FragData0;
l9_1856=l9_1857;
}
else
{
float4 l9_1858=gl_FragCoord;
float2 l9_1859=l9_1858.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_1860=l9_1859;
float2 l9_1861=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_1862=1;
int l9_1863=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1863=0;
}
else
{
l9_1863=in.varStereoViewID;
}
int l9_1864=l9_1863;
int l9_1865=l9_1864;
float3 l9_1866=float3(l9_1860,0.0);
int l9_1867=l9_1862;
int l9_1868=l9_1865;
if (l9_1867==1)
{
l9_1866.y=((2.0*l9_1866.y)+float(l9_1868))-1.0;
}
float2 l9_1869=l9_1866.xy;
l9_1861=l9_1869;
}
else
{
l9_1861=l9_1860;
}
float2 l9_1870=l9_1861;
float2 l9_1871=l9_1870;
float2 l9_1872=l9_1871;
float2 l9_1873=l9_1872;
float l9_1874=0.0;
int l9_1875;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_1876=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1876=0;
}
else
{
l9_1876=in.varStereoViewID;
}
int l9_1877=l9_1876;
l9_1875=1-l9_1877;
}
else
{
int l9_1878=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1878=0;
}
else
{
l9_1878=in.varStereoViewID;
}
int l9_1879=l9_1878;
l9_1875=l9_1879;
}
int l9_1880=l9_1875;
float2 l9_1881=l9_1873;
int l9_1882=sc_ScreenTextureLayout_tmp;
int l9_1883=l9_1880;
float l9_1884=l9_1874;
float2 l9_1885=l9_1881;
int l9_1886=l9_1882;
int l9_1887=l9_1883;
float3 l9_1888=float3(0.0);
if (l9_1886==0)
{
l9_1888=float3(l9_1885,0.0);
}
else
{
if (l9_1886==1)
{
l9_1888=float3(l9_1885.x,(l9_1885.y*0.5)+(0.5-(float(l9_1887)*0.5)),0.0);
}
else
{
l9_1888=float3(l9_1885,float(l9_1887));
}
}
float3 l9_1889=l9_1888;
float3 l9_1890=l9_1889;
float4 l9_1891=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_1890.xy,bias(l9_1884));
float4 l9_1892=l9_1891;
float4 l9_1893=l9_1892;
l9_1856=l9_1893;
}
float4 l9_1894=l9_1856;
float3 l9_1895=l9_1894.xyz;
float3 l9_1896=l9_1895;
float3 l9_1897=l9_1854.xyz;
float3 l9_1898=definedBlend(l9_1896,l9_1897,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_1855=float4(l9_1898.x,l9_1898.y,l9_1898.z,l9_1855.w);
float3 l9_1899=mix(l9_1895,l9_1855.xyz,float3(l9_1854.w));
l9_1855=float4(l9_1899.x,l9_1899.y,l9_1899.z,l9_1855.w);
l9_1855.w=1.0;
float4 l9_1900=l9_1855;
param_10=l9_1900;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_1901=float4(in.varScreenPos.xyz,1.0);
param_10=l9_1901;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_1902=gl_FragCoord;
float l9_1903=fast::clamp(abs(l9_1902.z),0.0,1.0);
float4 l9_1904=float4(l9_1903,1.0-l9_1903,1.0,1.0);
param_10=l9_1904;
}
else
{
float4 l9_1905=param_10;
float4 l9_1906=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_1906=float4(mix(float3(1.0),l9_1905.xyz,float3(l9_1905.w)),l9_1905.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_1907=l9_1905.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_1907=fast::clamp(l9_1907,0.0,1.0);
}
l9_1906=float4(l9_1905.xyz*l9_1907,l9_1907);
}
else
{
l9_1906=l9_1905;
}
}
float4 l9_1908=l9_1906;
param_10=l9_1908;
}
}
}
}
}
float4 l9_1909=param_10;
FinalColor=l9_1909;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
if (PreviewInfo.Saved)
{
FinalColor=float4(PreviewInfo.Color);
}
else
{
FinalColor=float4(0.0);
}
}
float4 l9_1910=float4(0.0);
l9_1910=float4(0.0);
float4 l9_1911=l9_1910;
float4 Cost=l9_1911;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_11=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_11,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_12=FinalColor;
float4 l9_1912=param_12;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_1912.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_1912;
return out;
}
} // FRAGMENT SHADER

namespace SNAP_RECV {
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float3 BumpedNormal;
float3 ViewDirWS;
float3 PositionWS;
float3 SurfacePosition_WorldSpace;
float3 VertexNormal_WorldSpace;
float3 VertexTangent_WorldSpace;
float3 VertexBinormal_WorldSpace;
float2 Surface_UVCoord0;
float2 Surface_UVCoord1;
float2 gScreenCoord;
float4 VertexColor;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
int sc_RayTracingReceiverEffectsMask;
float4 sc_RayTracingReflectionsSize;
float4 sc_RayTracingReflectionsDims;
float4 sc_RayTracingReflectionsView;
float4 sc_RayTracingGlobalIlluminationSize;
float4 sc_RayTracingGlobalIlluminationDims;
float4 sc_RayTracingGlobalIlluminationView;
float4 sc_RayTracingShadowsSize;
float4 sc_RayTracingShadowsDims;
float4 sc_RayTracingShadowsView;
float3 sc_RayTracingOriginScale;
uint sc_RayTracingReceiverMask;
float3 sc_RayTracingOriginScaleInv;
float3 sc_RayTracingOriginOffset;
uint sc_RayTracingReceiverId;
uint4 sc_RayTracingCasterConfiguration;
uint4 sc_RayTracingCasterOffsetPNTC;
uint4 sc_RayTracingCasterOffsetTexture;
uint4 sc_RayTracingCasterFormatPNTC;
uint4 sc_RayTracingCasterFormatTexture;
float4 sc_RayTracingRayDirectionSize;
float4 sc_RayTracingRayDirectionDims;
float4 sc_RayTracingRayDirectionView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float3 emissiveFactor;
float4 emissiveTextureSize;
float4 emissiveTextureDims;
float4 emissiveTextureView;
float3x3 emissiveTextureTransform;
float4 emissiveTextureUvMinMax;
float4 emissiveTextureBorderColor;
float normalTextureScale;
float4 normalTextureSize;
float4 normalTextureDims;
float4 normalTextureView;
float3x3 normalTextureTransform;
float4 normalTextureUvMinMax;
float4 normalTextureBorderColor;
float metallicFactor;
float roughnessFactor;
float occlusionTextureStrength;
float4 metallicRoughnessTextureSize;
float4 metallicRoughnessTextureDims;
float4 metallicRoughnessTextureView;
float3x3 metallicRoughnessTextureTransform;
float4 metallicRoughnessTextureUvMinMax;
float4 metallicRoughnessTextureBorderColor;
float transmissionFactor;
float4 transmissionTextureSize;
float4 transmissionTextureDims;
float4 transmissionTextureView;
float3x3 transmissionTextureTransform;
float4 transmissionTextureUvMinMax;
float4 transmissionTextureBorderColor;
float4 screenTextureSize;
float4 screenTextureDims;
float4 screenTextureView;
float3x3 screenTextureTransform;
float4 screenTextureUvMinMax;
float4 screenTextureBorderColor;
float3 sheenColorFactor;
float4 sheenColorTextureSize;
float4 sheenColorTextureDims;
float4 sheenColorTextureView;
float3x3 sheenColorTextureTransform;
float4 sheenColorTextureUvMinMax;
float4 sheenColorTextureBorderColor;
float sheenRoughnessFactor;
float4 sheenRoughnessTextureSize;
float4 sheenRoughnessTextureDims;
float4 sheenRoughnessTextureView;
float3x3 sheenRoughnessTextureTransform;
float4 sheenRoughnessTextureUvMinMax;
float4 sheenRoughnessTextureBorderColor;
float clearcoatFactor;
float4 clearcoatTextureSize;
float4 clearcoatTextureDims;
float4 clearcoatTextureView;
float3x3 clearcoatTextureTransform;
float4 clearcoatTextureUvMinMax;
float4 clearcoatTextureBorderColor;
float clearcoatRoughnessFactor;
float4 clearcoatRoughnessTextureSize;
float4 clearcoatRoughnessTextureDims;
float4 clearcoatRoughnessTextureView;
float3x3 clearcoatRoughnessTextureTransform;
float4 clearcoatRoughnessTextureUvMinMax;
float4 clearcoatRoughnessTextureBorderColor;
float4 clearcoatNormalTextureSize;
float4 clearcoatNormalTextureDims;
float4 clearcoatNormalTextureView;
float3x3 clearcoatNormalTextureTransform;
float4 clearcoatNormalTextureUvMinMax;
float4 clearcoatNormalTextureBorderColor;
float4 baseColorTextureSize;
float4 baseColorTextureDims;
float4 baseColorTextureView;
float3x3 baseColorTextureTransform;
float4 baseColorTextureUvMinMax;
float4 baseColorTextureBorderColor;
float4 baseColorFactor;
float2 baseColorTexture_offset;
float2 baseColorTexture_scale;
float baseColorTexture_rotation;
float2 emissiveTexture_offset;
float2 emissiveTexture_scale;
float emissiveTexture_rotation;
float2 normalTexture_offset;
float2 normalTexture_scale;
float normalTexture_rotation;
float2 metallicRoughnessTexture_offset;
float2 metallicRoughnessTexture_scale;
float metallicRoughnessTexture_rotation;
float2 transmissionTexture_offset;
float2 transmissionTexture_scale;
float transmissionTexture_rotation;
float2 sheenColorTexture_offset;
float2 sheenColorTexture_scale;
float sheenColorTexture_rotation;
float2 sheenRoughnessTexture_offset;
float2 sheenRoughnessTexture_scale;
float sheenRoughnessTexture_rotation;
float2 clearcoatTexture_offset;
float2 clearcoatTexture_scale;
float clearcoatTexture_rotation;
float2 clearcoatNormalTexture_offset;
float2 clearcoatNormalTexture_scale;
float clearcoatNormalTexture_rotation;
float2 clearcoatRoughnessTexture_offset;
float2 clearcoatRoughnessTexture_scale;
float clearcoatRoughnessTexture_rotation;
float colorMultiplier;
float Port_DebugSheenEnvLightMult_N003;
float Port_DebugSheenPunctualLightMult_N003;
float Port_Input2_N043;
float Port_Input2_N062;
float3 Port_SpecularAO_N036;
float3 Port_Albedo_N405;
float Port_Opacity_N405;
float3 Port_Emissive_N405;
float Port_Metallic_N405;
float3 Port_SpecularAO_N405;
float depthRef;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct sc_RayTracingCasterIndexBuffer_obj
{
uint sc_RayTracingCasterTriangles[1];
};
struct sc_RayTracingCasterVertexBuffer_obj
{
float sc_RayTracingCasterVertices[1];
};
struct sc_RayTracingCasterNonAnimatedVertexBuffer_obj
{
float sc_RayTracingCasterNonAnimatedVertices[1];
};
struct sc_Set0
{
const device sc_RayTracingCasterIndexBuffer_obj* sc_RayTracingCasterIndexBuffer [[id(0)]];
const device sc_RayTracingCasterVertexBuffer_obj* sc_RayTracingCasterVertexBuffer [[id(1)]];
const device sc_RayTracingCasterNonAnimatedVertexBuffer_obj* sc_RayTracingCasterNonAnimatedVertexBuffer [[id(2)]];
constant sc_Bones_obj* sc_BonesUBO [[id(3)]];
texture2d<float> baseColorTexture [[id(4)]];
texture2d<float> clearcoatNormalTexture [[id(5)]];
texture2d<float> clearcoatRoughnessTexture [[id(6)]];
texture2d<float> clearcoatTexture [[id(7)]];
texture2d<float> emissiveTexture [[id(8)]];
texture2d<float> intensityTexture [[id(9)]];
texture2d<float> metallicRoughnessTexture [[id(10)]];
texture2d<float> normalTexture [[id(11)]];
texture2d<float> sc_EnvmapDiffuse [[id(12)]];
texture2d<float> sc_EnvmapSpecular [[id(13)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(22)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(23)]];
texture2d<float> sc_RayTracingRayDirection [[id(24)]];
texture2d<float> sc_RayTracingReflections [[id(25)]];
texture2d<float> sc_RayTracingShadows [[id(26)]];
texture2d<float> sc_SSAOTexture [[id(27)]];
texture2d<float> sc_ScreenTexture [[id(28)]];
texture2d<float> sc_ShadowTexture [[id(29)]];
texture2d<float> screenTexture [[id(31)]];
texture2d<float> sheenColorTexture [[id(32)]];
texture2d<float> sheenRoughnessTexture [[id(33)]];
texture2d<float> transmissionTexture [[id(34)]];
sampler baseColorTextureSmpSC [[id(35)]];
sampler clearcoatNormalTextureSmpSC [[id(36)]];
sampler clearcoatRoughnessTextureSmpSC [[id(37)]];
sampler clearcoatTextureSmpSC [[id(38)]];
sampler emissiveTextureSmpSC [[id(39)]];
sampler intensityTextureSmpSC [[id(40)]];
sampler metallicRoughnessTextureSmpSC [[id(41)]];
sampler normalTextureSmpSC [[id(42)]];
sampler sc_EnvmapDiffuseSmpSC [[id(43)]];
sampler sc_EnvmapSpecularSmpSC [[id(44)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(46)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(47)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(48)]];
sampler sc_RayTracingReflectionsSmpSC [[id(49)]];
sampler sc_RayTracingShadowsSmpSC [[id(50)]];
sampler sc_SSAOTextureSmpSC [[id(51)]];
sampler sc_ScreenTextureSmpSC [[id(52)]];
sampler sc_ShadowTextureSmpSC [[id(53)]];
sampler screenTextureSmpSC [[id(55)]];
sampler sheenColorTextureSmpSC [[id(56)]];
sampler sheenRoughnessTextureSmpSC [[id(57)]];
sampler transmissionTextureSmpSC [[id(58)]];
constant userUniformsObj* UserUniforms [[id(59)]];
};
struct main_recv_out
{
uint4 sc_RayTracingPositionAndMask [[color(0)]];
uint4 sc_RayTracingNormalAndMore [[color(1)]];
};
struct main_recv_in
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
// Implementation of the GLSL radians() function
template<typename T>
T radians(T d)
{
return d*T(0.01745329251);
}
float2 calcSeamlessPanoramicUvsForSampling(thread const float2& uv,thread const float2& topMipRes,thread const float& lod)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float2 thisMipRes=fast::max(float2(1.0),topMipRes/float2(exp2(lod)));
return ((uv*(thisMipRes-float2(1.0)))/thisMipRes)+(float2(0.5)/thisMipRes);
}
else
{
return uv;
}
}
fragment main_recv_out main_recv(main_recv_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_recv_out out={};
bool N3_EnableNormalTexture=false;
float N3_NormalScale=0.0;
int N3_NormalTextureCoord=0;
float N3_RoughnessValue=0.0;
bool N3_EnableMetallicRoughnessTexture=false;
int N3_MaterialParamsTextureCoord=0;
bool N3_SheenEnable=false;
float N3_SheenRoughnessFactor=0.0;
bool N3_EnableSheenRoughnessTexture=false;
int N3_SheenRoughnessTextureCoord=0;
bool N3_ClearcoatEnable=false;
float N3_ClearcoatRoughnessFactor=0.0;
bool N3_EnableClearCoatRoughnessTexture=false;
int N3_ClearcoatRoughnessTextureCoord=0;
bool N3_EnableClearCoatNormalTexture=false;
int N3_ClearcoatNormalMapCoord=0;
float N3_OpacityIn=0.0;
bool N3_EnableTextureTransform=false;
bool N3_NormalTextureTransform=false;
float2 N3_NormalTextureOffset=float2(0.0);
float2 N3_NormalTextureScale=float2(0.0);
float N3_NormalTextureRotation=0.0;
bool N3_MaterialParamsTextureTransform=false;
float2 N3_MaterialParamsTextureOffset=float2(0.0);
float2 N3_MaterialParamsTextureScale=float2(0.0);
float N3_MaterialParamsTextureRotation=0.0;
bool N3_SheenRoughnessTextureTransform=false;
float2 N3_SheenRoughnessTextureOffset=float2(0.0);
float2 N3_SheenRoughnessTextureScale=float2(0.0);
float N3_SheenRoughnessTextureRotation=0.0;
bool N3_ClearcoatNormalTextureTransform=false;
float2 N3_ClearcoatNormalTextureOffset=float2(0.0);
float2 N3_ClearcoatNormalTextureScale=float2(0.0);
float N3_ClearcoatNormalTextureRotation=0.0;
bool N3_ClearcoatRoughnessTextureTransform=false;
float2 N3_ClearcoatRoughnessTextureOffset=float2(0.0);
float2 N3_ClearcoatRoughnessTextureScale=float2(0.0);
float N3_ClearcoatRoughnessTextureRotation=0.0;
float N3_Opacity=0.0;
float3 N3_Normal=float3(0.0);
float N3_Roughness=0.0;
float3 N3_ClearcoatNormal=float3(0.0);
float N3_ClearcoatRoughness=0.0;
bool N35_EnableVertexColor=false;
bool N35_EnableBaseTexture=false;
int N35_BaseColorTextureCoord=0;
float4 N35_BaseColorFactor=float4(0.0);
bool N35_EnableTextureTransform=false;
bool N35_BaseTextureTransform=false;
float2 N35_BaseTextureOffset=float2(0.0);
float2 N35_BaseTextureScale=float2(0.0);
float N35_BaseTextureRotation=0.0;
float N35_Opacity=0.0;
if ((int(sc_DepthOnly_tmp)!=0))
{
return out;
}
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
Globals.BumpedNormal=float3(0.0);
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-in.varPosAndMotion.xyz);
Globals.PositionWS=in.varPosAndMotion.xyz;
Globals.SurfacePosition_WorldSpace=in.varPosAndMotion.xyz;
Globals.VertexNormal_WorldSpace=normalize(in.varNormalAndMotion.xyz);
Globals.VertexTangent_WorldSpace=normalize(in.varTangent.xyz);
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*in.varTangent.w;
Globals.Surface_UVCoord0=in.varTex01.xy;
Globals.Surface_UVCoord1=in.varTex01.zw;
float4 l9_0=gl_FragCoord;
float2 l9_1=l9_0.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_2=l9_1;
float2 l9_3=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_4=1;
int l9_5=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_5=0;
}
else
{
l9_5=in.varStereoViewID;
}
int l9_6=l9_5;
int l9_7=l9_6;
float3 l9_8=float3(l9_2,0.0);
int l9_9=l9_4;
int l9_10=l9_7;
if (l9_9==1)
{
l9_8.y=((2.0*l9_8.y)+float(l9_10))-1.0;
}
float2 l9_11=l9_8.xy;
l9_3=l9_11;
}
else
{
l9_3=l9_2;
}
float2 l9_12=l9_3;
float2 l9_13=l9_12;
Globals.gScreenCoord=l9_13;
Globals.VertexColor=in.varColor;
ssGlobals param=Globals;
ssGlobals tempGlobals;
if ((int(ENABLE_GLTF_LIGHTING_tmp)!=0))
{
float l9_14=0.0;
float l9_15=1.0;
float l9_16=(*sc_set0.UserUniforms).Port_Input2_N043;
float l9_17;
if ((int(ENABLE_NORMALMAP_tmp)!=0))
{
float l9_18=0.0;
float l9_19=(*sc_set0.UserUniforms).normalTextureScale;
l9_18=l9_19;
l9_15=l9_18;
l9_17=l9_15;
}
else
{
l9_17=l9_16;
}
l9_14=l9_17;
float l9_20=0.0;
float l9_21=(*sc_set0.UserUniforms).roughnessFactor;
l9_20=l9_21;
float l9_22=0.0;
float l9_23=(*sc_set0.UserUniforms).sheenRoughnessFactor;
l9_22=l9_23;
float l9_24=0.0;
float l9_25=(*sc_set0.UserUniforms).clearcoatRoughnessFactor;
l9_24=l9_25;
float4 l9_26=float4(0.0);
float4 l9_27=(*sc_set0.UserUniforms).baseColorFactor;
l9_26=l9_27;
float2 l9_28=float2(0.0);
float2 l9_29=(*sc_set0.UserUniforms).baseColorTexture_offset;
l9_28=l9_29;
float2 l9_30=float2(0.0);
float2 l9_31=(*sc_set0.UserUniforms).baseColorTexture_scale;
l9_30=l9_31;
float l9_32=0.0;
float l9_33=(*sc_set0.UserUniforms).baseColorTexture_rotation;
l9_32=l9_33;
float l9_34=0.0;
float4 l9_35=l9_26;
float2 l9_36=l9_28;
float2 l9_37=l9_30;
float l9_38=l9_32;
ssGlobals l9_39=param;
tempGlobals=l9_39;
float l9_40=0.0;
N35_EnableVertexColor=(int(ENABLE_VERTEX_COLOR_BASE_tmp)!=0);
N35_EnableBaseTexture=(int(ENABLE_BASE_TEX_tmp)!=0);
N35_BaseColorTextureCoord=NODE_7_DROPLIST_ITEM_tmp;
N35_BaseColorFactor=l9_35;
N35_EnableTextureTransform=(int(ENABLE_TEXTURE_TRANSFORM_tmp)!=0);
N35_BaseTextureTransform=(int(ENABLE_BASE_TEXTURE_TRANSFORM_tmp)!=0);
N35_BaseTextureOffset=l9_36;
N35_BaseTextureScale=l9_37;
N35_BaseTextureRotation=l9_38;
float4 l9_41=N35_BaseColorFactor;
if (N35_EnableBaseTexture)
{
int l9_42=N35_BaseColorTextureCoord;
float2 l9_43=tempGlobals.Surface_UVCoord0;
float2 l9_44=l9_43;
if (l9_42==0)
{
float2 l9_45=tempGlobals.Surface_UVCoord0;
l9_44=l9_45;
}
if (l9_42==1)
{
float2 l9_46=tempGlobals.Surface_UVCoord1;
l9_44=l9_46;
}
float2 l9_47=l9_44;
float2 l9_48=l9_47;
if (N35_EnableTextureTransform&&N35_BaseTextureTransform)
{
float2 l9_49=l9_48;
float2 l9_50=N35_BaseTextureOffset;
float2 l9_51=N35_BaseTextureScale;
float l9_52=N35_BaseTextureRotation;
float3x3 l9_53=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_50.x,l9_50.y,1.0));
float3x3 l9_54=float3x3(float3(cos(l9_52),sin(l9_52),0.0),float3(-sin(l9_52),cos(l9_52),0.0),float3(0.0,0.0,1.0));
float3x3 l9_55=float3x3(float3(l9_51.x,0.0,0.0),float3(0.0,l9_51.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_56=(l9_53*l9_54)*l9_55;
float2 l9_57=(l9_56*float3(l9_49,1.0)).xy;
l9_48=l9_57;
}
float2 l9_58=l9_48;
float4 l9_59=float4(0.0);
int l9_60;
if ((int(baseColorTextureHasSwappedViews_tmp)!=0))
{
int l9_61=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_61=0;
}
else
{
l9_61=in.varStereoViewID;
}
int l9_62=l9_61;
l9_60=1-l9_62;
}
else
{
int l9_63=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_63=0;
}
else
{
l9_63=in.varStereoViewID;
}
int l9_64=l9_63;
l9_60=l9_64;
}
int l9_65=l9_60;
int l9_66=baseColorTextureLayout_tmp;
int l9_67=l9_65;
float2 l9_68=l9_58;
bool l9_69=(int(SC_USE_UV_TRANSFORM_baseColorTexture_tmp)!=0);
float3x3 l9_70=(*sc_set0.UserUniforms).baseColorTextureTransform;
int2 l9_71=int2(SC_SOFTWARE_WRAP_MODE_U_baseColorTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_baseColorTexture_tmp);
bool l9_72=(int(SC_USE_UV_MIN_MAX_baseColorTexture_tmp)!=0);
float4 l9_73=(*sc_set0.UserUniforms).baseColorTextureUvMinMax;
bool l9_74=(int(SC_USE_CLAMP_TO_BORDER_baseColorTexture_tmp)!=0);
float4 l9_75=(*sc_set0.UserUniforms).baseColorTextureBorderColor;
float l9_76=0.0;
bool l9_77=l9_74&&(!l9_72);
float l9_78=1.0;
float l9_79=l9_68.x;
int l9_80=l9_71.x;
if (l9_80==1)
{
l9_79=fract(l9_79);
}
else
{
if (l9_80==2)
{
float l9_81=fract(l9_79);
float l9_82=l9_79-l9_81;
float l9_83=step(0.25,fract(l9_82*0.5));
l9_79=mix(l9_81,1.0-l9_81,fast::clamp(l9_83,0.0,1.0));
}
}
l9_68.x=l9_79;
float l9_84=l9_68.y;
int l9_85=l9_71.y;
if (l9_85==1)
{
l9_84=fract(l9_84);
}
else
{
if (l9_85==2)
{
float l9_86=fract(l9_84);
float l9_87=l9_84-l9_86;
float l9_88=step(0.25,fract(l9_87*0.5));
l9_84=mix(l9_86,1.0-l9_86,fast::clamp(l9_88,0.0,1.0));
}
}
l9_68.y=l9_84;
if (l9_72)
{
bool l9_89=l9_74;
bool l9_90;
if (l9_89)
{
l9_90=l9_71.x==3;
}
else
{
l9_90=l9_89;
}
float l9_91=l9_68.x;
float l9_92=l9_73.x;
float l9_93=l9_73.z;
bool l9_94=l9_90;
float l9_95=l9_78;
float l9_96=fast::clamp(l9_91,l9_92,l9_93);
float l9_97=step(abs(l9_91-l9_96),9.9999997e-06);
l9_95*=(l9_97+((1.0-float(l9_94))*(1.0-l9_97)));
l9_91=l9_96;
l9_68.x=l9_91;
l9_78=l9_95;
bool l9_98=l9_74;
bool l9_99;
if (l9_98)
{
l9_99=l9_71.y==3;
}
else
{
l9_99=l9_98;
}
float l9_100=l9_68.y;
float l9_101=l9_73.y;
float l9_102=l9_73.w;
bool l9_103=l9_99;
float l9_104=l9_78;
float l9_105=fast::clamp(l9_100,l9_101,l9_102);
float l9_106=step(abs(l9_100-l9_105),9.9999997e-06);
l9_104*=(l9_106+((1.0-float(l9_103))*(1.0-l9_106)));
l9_100=l9_105;
l9_68.y=l9_100;
l9_78=l9_104;
}
float2 l9_107=l9_68;
bool l9_108=l9_69;
float3x3 l9_109=l9_70;
if (l9_108)
{
l9_107=float2((l9_109*float3(l9_107,1.0)).xy);
}
float2 l9_110=l9_107;
l9_68=l9_110;
float l9_111=l9_68.x;
int l9_112=l9_71.x;
bool l9_113=l9_77;
float l9_114=l9_78;
if ((l9_112==0)||(l9_112==3))
{
float l9_115=l9_111;
float l9_116=0.0;
float l9_117=1.0;
bool l9_118=l9_113;
float l9_119=l9_114;
float l9_120=fast::clamp(l9_115,l9_116,l9_117);
float l9_121=step(abs(l9_115-l9_120),9.9999997e-06);
l9_119*=(l9_121+((1.0-float(l9_118))*(1.0-l9_121)));
l9_115=l9_120;
l9_111=l9_115;
l9_114=l9_119;
}
l9_68.x=l9_111;
l9_78=l9_114;
float l9_122=l9_68.y;
int l9_123=l9_71.y;
bool l9_124=l9_77;
float l9_125=l9_78;
if ((l9_123==0)||(l9_123==3))
{
float l9_126=l9_122;
float l9_127=0.0;
float l9_128=1.0;
bool l9_129=l9_124;
float l9_130=l9_125;
float l9_131=fast::clamp(l9_126,l9_127,l9_128);
float l9_132=step(abs(l9_126-l9_131),9.9999997e-06);
l9_130*=(l9_132+((1.0-float(l9_129))*(1.0-l9_132)));
l9_126=l9_131;
l9_122=l9_126;
l9_125=l9_130;
}
l9_68.y=l9_122;
l9_78=l9_125;
float2 l9_133=l9_68;
int l9_134=l9_66;
int l9_135=l9_67;
float l9_136=l9_76;
float2 l9_137=l9_133;
int l9_138=l9_134;
int l9_139=l9_135;
float3 l9_140=float3(0.0);
if (l9_138==0)
{
l9_140=float3(l9_137,0.0);
}
else
{
if (l9_138==1)
{
l9_140=float3(l9_137.x,(l9_137.y*0.5)+(0.5-(float(l9_139)*0.5)),0.0);
}
else
{
l9_140=float3(l9_137,float(l9_139));
}
}
float3 l9_141=l9_140;
float3 l9_142=l9_141;
float4 l9_143=sc_set0.baseColorTexture.sample(sc_set0.baseColorTextureSmpSC,l9_142.xy,bias(l9_136));
float4 l9_144=l9_143;
if (l9_74)
{
l9_144=mix(l9_75,l9_144,float4(l9_78));
}
float4 l9_145=l9_144;
l9_59=l9_145;
float4 l9_146=l9_59;
float4 l9_147=l9_146;
float4 l9_148;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_148=float4(pow(l9_147.x,2.2),pow(l9_147.y,2.2),pow(l9_147.z,2.2),pow(l9_147.w,2.2));
}
else
{
l9_148=l9_147*l9_147;
}
float4 l9_149=l9_148;
l9_41*=l9_149;
}
if (N35_EnableVertexColor)
{
float4 l9_150=tempGlobals.VertexColor;
l9_41*=l9_150;
}
N35_Opacity=l9_41.w;
l9_40=N35_Opacity;
l9_34=l9_40;
float2 l9_151=float2(0.0);
float2 l9_152=(*sc_set0.UserUniforms).normalTexture_offset;
l9_151=l9_152;
float2 l9_153=float2(0.0);
float2 l9_154=(*sc_set0.UserUniforms).normalTexture_scale;
l9_153=l9_154;
float l9_155=0.0;
float l9_156=(*sc_set0.UserUniforms).normalTexture_rotation;
l9_155=l9_156;
float2 l9_157=float2(0.0);
float2 l9_158=(*sc_set0.UserUniforms).metallicRoughnessTexture_offset;
l9_157=l9_158;
float2 l9_159=float2(0.0);
float2 l9_160=(*sc_set0.UserUniforms).metallicRoughnessTexture_scale;
l9_159=l9_160;
float l9_161=0.0;
float l9_162=(*sc_set0.UserUniforms).metallicRoughnessTexture_rotation;
l9_161=l9_162;
float2 l9_163=float2(0.0);
float2 l9_164=(*sc_set0.UserUniforms).sheenRoughnessTexture_offset;
l9_163=l9_164;
float2 l9_165=float2(0.0);
float2 l9_166=(*sc_set0.UserUniforms).sheenRoughnessTexture_scale;
l9_165=l9_166;
float l9_167=0.0;
float l9_168=(*sc_set0.UserUniforms).sheenRoughnessTexture_rotation;
l9_167=l9_168;
float2 l9_169=float2(0.0);
float2 l9_170=(*sc_set0.UserUniforms).clearcoatNormalTexture_offset;
l9_169=l9_170;
float2 l9_171=float2(0.0);
float2 l9_172=(*sc_set0.UserUniforms).clearcoatNormalTexture_scale;
l9_171=l9_172;
float l9_173=0.0;
float l9_174=(*sc_set0.UserUniforms).clearcoatNormalTexture_rotation;
l9_173=l9_174;
float2 l9_175=float2(0.0);
float2 l9_176=(*sc_set0.UserUniforms).clearcoatRoughnessTexture_offset;
l9_175=l9_176;
float2 l9_177=float2(0.0);
float2 l9_178=(*sc_set0.UserUniforms).clearcoatRoughnessTexture_scale;
l9_177=l9_178;
float l9_179=0.0;
float l9_180=(*sc_set0.UserUniforms).clearcoatRoughnessTexture_rotation;
l9_179=l9_180;
float l9_181=0.0;
float3 l9_182=float3(0.0);
float l9_183=0.0;
float3 l9_184=float3(0.0);
float l9_185=0.0;
float l9_186=l9_14;
float l9_187=l9_20;
float l9_188=l9_22;
float l9_189=l9_24;
float l9_190=l9_34;
float2 l9_191=l9_151;
float2 l9_192=l9_153;
float l9_193=l9_155;
float2 l9_194=l9_157;
float2 l9_195=l9_159;
float l9_196=l9_161;
float2 l9_197=l9_163;
float2 l9_198=l9_165;
float l9_199=l9_167;
float2 l9_200=l9_169;
float2 l9_201=l9_171;
float l9_202=l9_173;
float2 l9_203=l9_175;
float2 l9_204=l9_177;
float l9_205=l9_179;
ssGlobals l9_206=param;
tempGlobals=l9_206;
float l9_207=0.0;
float3 l9_208=float3(0.0);
float l9_209=0.0;
float3 l9_210=float3(0.0);
float l9_211=0.0;
N3_EnableNormalTexture=(int(ENABLE_NORMALMAP_tmp)!=0);
N3_NormalScale=l9_186;
N3_NormalTextureCoord=NODE_8_DROPLIST_ITEM_tmp;
N3_RoughnessValue=l9_187;
N3_EnableMetallicRoughnessTexture=(int(ENABLE_METALLIC_ROUGHNESS_TEX_tmp)!=0);
N3_MaterialParamsTextureCoord=NODE_11_DROPLIST_ITEM_tmp;
N3_SheenEnable=(int(ENABLE_SHEEN_tmp)!=0);
N3_SheenRoughnessFactor=l9_188;
N3_EnableSheenRoughnessTexture=(int(ENABLE_SHEEN_ROUGHNESS_TEX_tmp)!=0);
N3_SheenRoughnessTextureCoord=Tweak_N37_tmp;
N3_ClearcoatEnable=(int(ENABLE_CLEARCOAT_tmp)!=0);
N3_ClearcoatRoughnessFactor=l9_189;
N3_EnableClearCoatRoughnessTexture=(int(ENABLE_CLEARCOAT_ROUGHNESS_TEX_tmp)!=0);
N3_ClearcoatRoughnessTextureCoord=Tweak_N60_tmp;
N3_EnableClearCoatNormalTexture=(int(ENABLE_CLEARCOAT_NORMAL_TEX_tmp)!=0);
N3_ClearcoatNormalMapCoord=Tweak_N47_tmp;
N3_OpacityIn=l9_190;
N3_EnableTextureTransform=(int(ENABLE_TEXTURE_TRANSFORM_tmp)!=0);
N3_NormalTextureTransform=(int(ENABLE_NORMAL_TEXTURE_TRANSFORM_tmp)!=0);
N3_NormalTextureOffset=l9_191;
N3_NormalTextureScale=l9_192;
N3_NormalTextureRotation=l9_193;
N3_MaterialParamsTextureTransform=(int(ENABLE_METALLIC_ROUGHNESS_TEXTURE_TRANSFORM_tmp)!=0);
N3_MaterialParamsTextureOffset=l9_194;
N3_MaterialParamsTextureScale=l9_195;
N3_MaterialParamsTextureRotation=l9_196;
N3_SheenRoughnessTextureTransform=(int(ENABLE_SHEEN_ROUGHNESS_TEXTURE_TRANSFORM_tmp)!=0);
N3_SheenRoughnessTextureOffset=l9_197;
N3_SheenRoughnessTextureScale=l9_198;
N3_SheenRoughnessTextureRotation=l9_199;
N3_ClearcoatNormalTextureTransform=(int(ENABLE_CLEARCOAT_NORMAL_TEXTURE_TRANSFORM_tmp)!=0);
N3_ClearcoatNormalTextureOffset=l9_200;
N3_ClearcoatNormalTextureScale=l9_201;
N3_ClearcoatNormalTextureRotation=l9_202;
N3_ClearcoatRoughnessTextureTransform=(int(ENABLE_CLEARCOAT_ROUGHNESS_TEXTURE_TRANSFORM_tmp)!=0);
N3_ClearcoatRoughnessTextureOffset=l9_203;
N3_ClearcoatRoughnessTextureScale=l9_204;
N3_ClearcoatRoughnessTextureRotation=l9_205;
N3_Opacity=N3_OpacityIn;
float3 l9_212=tempGlobals.VertexNormal_WorldSpace;
N3_Normal=normalize(l9_212);
if (N3_EnableNormalTexture)
{
float3 l9_213=N3_Normal;
int l9_214=N3_NormalTextureCoord;
float2 l9_215=tempGlobals.Surface_UVCoord0;
float2 l9_216=l9_215;
if (l9_214==0)
{
float2 l9_217=tempGlobals.Surface_UVCoord0;
l9_216=l9_217;
}
if (l9_214==1)
{
float2 l9_218=tempGlobals.Surface_UVCoord1;
l9_216=l9_218;
}
float2 l9_219=l9_216;
float2 l9_220=l9_219;
if (N3_EnableTextureTransform&&N3_NormalTextureTransform)
{
float2 l9_221=l9_220;
float2 l9_222=N3_NormalTextureOffset;
float2 l9_223=N3_NormalTextureScale;
float l9_224=N3_NormalTextureRotation;
float l9_225=radians(l9_224);
float3x3 l9_226=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_222.x,l9_222.y,1.0));
float3x3 l9_227=float3x3(float3(cos(l9_225),sin(l9_225),0.0),float3(-sin(l9_225),cos(l9_225),0.0),float3(0.0,0.0,1.0));
float3x3 l9_228=float3x3(float3(l9_223.x,0.0,0.0),float3(0.0,l9_223.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_229=(l9_226*l9_227)*l9_228;
float2 l9_230=(l9_229*float3(l9_221,1.0)).xy;
l9_220=l9_230;
}
float2 l9_231=l9_220;
float4 l9_232=float4(0.0);
int l9_233;
if ((int(normalTextureHasSwappedViews_tmp)!=0))
{
int l9_234=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_234=0;
}
else
{
l9_234=in.varStereoViewID;
}
int l9_235=l9_234;
l9_233=1-l9_235;
}
else
{
int l9_236=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_236=0;
}
else
{
l9_236=in.varStereoViewID;
}
int l9_237=l9_236;
l9_233=l9_237;
}
int l9_238=l9_233;
int l9_239=normalTextureLayout_tmp;
int l9_240=l9_238;
float2 l9_241=l9_231;
bool l9_242=(int(SC_USE_UV_TRANSFORM_normalTexture_tmp)!=0);
float3x3 l9_243=(*sc_set0.UserUniforms).normalTextureTransform;
int2 l9_244=int2(SC_SOFTWARE_WRAP_MODE_U_normalTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_normalTexture_tmp);
bool l9_245=(int(SC_USE_UV_MIN_MAX_normalTexture_tmp)!=0);
float4 l9_246=(*sc_set0.UserUniforms).normalTextureUvMinMax;
bool l9_247=(int(SC_USE_CLAMP_TO_BORDER_normalTexture_tmp)!=0);
float4 l9_248=(*sc_set0.UserUniforms).normalTextureBorderColor;
float l9_249=0.0;
bool l9_250=l9_247&&(!l9_245);
float l9_251=1.0;
float l9_252=l9_241.x;
int l9_253=l9_244.x;
if (l9_253==1)
{
l9_252=fract(l9_252);
}
else
{
if (l9_253==2)
{
float l9_254=fract(l9_252);
float l9_255=l9_252-l9_254;
float l9_256=step(0.25,fract(l9_255*0.5));
l9_252=mix(l9_254,1.0-l9_254,fast::clamp(l9_256,0.0,1.0));
}
}
l9_241.x=l9_252;
float l9_257=l9_241.y;
int l9_258=l9_244.y;
if (l9_258==1)
{
l9_257=fract(l9_257);
}
else
{
if (l9_258==2)
{
float l9_259=fract(l9_257);
float l9_260=l9_257-l9_259;
float l9_261=step(0.25,fract(l9_260*0.5));
l9_257=mix(l9_259,1.0-l9_259,fast::clamp(l9_261,0.0,1.0));
}
}
l9_241.y=l9_257;
if (l9_245)
{
bool l9_262=l9_247;
bool l9_263;
if (l9_262)
{
l9_263=l9_244.x==3;
}
else
{
l9_263=l9_262;
}
float l9_264=l9_241.x;
float l9_265=l9_246.x;
float l9_266=l9_246.z;
bool l9_267=l9_263;
float l9_268=l9_251;
float l9_269=fast::clamp(l9_264,l9_265,l9_266);
float l9_270=step(abs(l9_264-l9_269),9.9999997e-06);
l9_268*=(l9_270+((1.0-float(l9_267))*(1.0-l9_270)));
l9_264=l9_269;
l9_241.x=l9_264;
l9_251=l9_268;
bool l9_271=l9_247;
bool l9_272;
if (l9_271)
{
l9_272=l9_244.y==3;
}
else
{
l9_272=l9_271;
}
float l9_273=l9_241.y;
float l9_274=l9_246.y;
float l9_275=l9_246.w;
bool l9_276=l9_272;
float l9_277=l9_251;
float l9_278=fast::clamp(l9_273,l9_274,l9_275);
float l9_279=step(abs(l9_273-l9_278),9.9999997e-06);
l9_277*=(l9_279+((1.0-float(l9_276))*(1.0-l9_279)));
l9_273=l9_278;
l9_241.y=l9_273;
l9_251=l9_277;
}
float2 l9_280=l9_241;
bool l9_281=l9_242;
float3x3 l9_282=l9_243;
if (l9_281)
{
l9_280=float2((l9_282*float3(l9_280,1.0)).xy);
}
float2 l9_283=l9_280;
l9_241=l9_283;
float l9_284=l9_241.x;
int l9_285=l9_244.x;
bool l9_286=l9_250;
float l9_287=l9_251;
if ((l9_285==0)||(l9_285==3))
{
float l9_288=l9_284;
float l9_289=0.0;
float l9_290=1.0;
bool l9_291=l9_286;
float l9_292=l9_287;
float l9_293=fast::clamp(l9_288,l9_289,l9_290);
float l9_294=step(abs(l9_288-l9_293),9.9999997e-06);
l9_292*=(l9_294+((1.0-float(l9_291))*(1.0-l9_294)));
l9_288=l9_293;
l9_284=l9_288;
l9_287=l9_292;
}
l9_241.x=l9_284;
l9_251=l9_287;
float l9_295=l9_241.y;
int l9_296=l9_244.y;
bool l9_297=l9_250;
float l9_298=l9_251;
if ((l9_296==0)||(l9_296==3))
{
float l9_299=l9_295;
float l9_300=0.0;
float l9_301=1.0;
bool l9_302=l9_297;
float l9_303=l9_298;
float l9_304=fast::clamp(l9_299,l9_300,l9_301);
float l9_305=step(abs(l9_299-l9_304),9.9999997e-06);
l9_303*=(l9_305+((1.0-float(l9_302))*(1.0-l9_305)));
l9_299=l9_304;
l9_295=l9_299;
l9_298=l9_303;
}
l9_241.y=l9_295;
l9_251=l9_298;
float2 l9_306=l9_241;
int l9_307=l9_239;
int l9_308=l9_240;
float l9_309=l9_249;
float2 l9_310=l9_306;
int l9_311=l9_307;
int l9_312=l9_308;
float3 l9_313=float3(0.0);
if (l9_311==0)
{
l9_313=float3(l9_310,0.0);
}
else
{
if (l9_311==1)
{
l9_313=float3(l9_310.x,(l9_310.y*0.5)+(0.5-(float(l9_312)*0.5)),0.0);
}
else
{
l9_313=float3(l9_310,float(l9_312));
}
}
float3 l9_314=l9_313;
float3 l9_315=l9_314;
float4 l9_316=sc_set0.normalTexture.sample(sc_set0.normalTextureSmpSC,l9_315.xy,bias(l9_309));
float4 l9_317=l9_316;
if (l9_247)
{
l9_317=mix(l9_248,l9_317,float4(l9_251));
}
float4 l9_318=l9_317;
l9_232=l9_318;
float4 l9_319=l9_232;
float3 l9_320=(l9_319.xyz*1.9921875)-float3(1.0);
l9_320=mix(float3(0.0,0.0,1.0),l9_320,float3(N3_NormalScale));
float3 l9_321=tempGlobals.VertexTangent_WorldSpace;
float3 l9_322=l9_321;
float3 l9_323=tempGlobals.VertexBinormal_WorldSpace;
float3 l9_324=l9_323;
float3x3 l9_325=float3x3(float3(l9_322),float3(l9_324),float3(l9_213));
l9_213=normalize(l9_325*l9_320);
N3_Normal=l9_213;
}
N3_Roughness=N3_RoughnessValue;
if (N3_EnableMetallicRoughnessTexture)
{
float l9_326=N3_Roughness;
int l9_327=N3_MaterialParamsTextureCoord;
float2 l9_328=tempGlobals.Surface_UVCoord0;
float2 l9_329=l9_328;
if (l9_327==0)
{
float2 l9_330=tempGlobals.Surface_UVCoord0;
l9_329=l9_330;
}
if (l9_327==1)
{
float2 l9_331=tempGlobals.Surface_UVCoord1;
l9_329=l9_331;
}
float2 l9_332=l9_329;
float2 l9_333=l9_332;
if (N3_EnableTextureTransform&&N3_MaterialParamsTextureTransform)
{
float2 l9_334=l9_333;
float2 l9_335=N3_MaterialParamsTextureOffset;
float2 l9_336=N3_MaterialParamsTextureScale;
float l9_337=N3_MaterialParamsTextureRotation;
float l9_338=radians(l9_337);
float3x3 l9_339=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_335.x,l9_335.y,1.0));
float3x3 l9_340=float3x3(float3(cos(l9_338),sin(l9_338),0.0),float3(-sin(l9_338),cos(l9_338),0.0),float3(0.0,0.0,1.0));
float3x3 l9_341=float3x3(float3(l9_336.x,0.0,0.0),float3(0.0,l9_336.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_342=(l9_339*l9_340)*l9_341;
float2 l9_343=(l9_342*float3(l9_334,1.0)).xy;
l9_333=l9_343;
}
float2 l9_344=l9_333;
float4 l9_345=float4(0.0);
int l9_346;
if ((int(metallicRoughnessTextureHasSwappedViews_tmp)!=0))
{
int l9_347=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_347=0;
}
else
{
l9_347=in.varStereoViewID;
}
int l9_348=l9_347;
l9_346=1-l9_348;
}
else
{
int l9_349=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_349=0;
}
else
{
l9_349=in.varStereoViewID;
}
int l9_350=l9_349;
l9_346=l9_350;
}
int l9_351=l9_346;
int l9_352=metallicRoughnessTextureLayout_tmp;
int l9_353=l9_351;
float2 l9_354=l9_344;
bool l9_355=(int(SC_USE_UV_TRANSFORM_metallicRoughnessTexture_tmp)!=0);
float3x3 l9_356=(*sc_set0.UserUniforms).metallicRoughnessTextureTransform;
int2 l9_357=int2(SC_SOFTWARE_WRAP_MODE_U_metallicRoughnessTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_metallicRoughnessTexture_tmp);
bool l9_358=(int(SC_USE_UV_MIN_MAX_metallicRoughnessTexture_tmp)!=0);
float4 l9_359=(*sc_set0.UserUniforms).metallicRoughnessTextureUvMinMax;
bool l9_360=(int(SC_USE_CLAMP_TO_BORDER_metallicRoughnessTexture_tmp)!=0);
float4 l9_361=(*sc_set0.UserUniforms).metallicRoughnessTextureBorderColor;
float l9_362=0.0;
bool l9_363=l9_360&&(!l9_358);
float l9_364=1.0;
float l9_365=l9_354.x;
int l9_366=l9_357.x;
if (l9_366==1)
{
l9_365=fract(l9_365);
}
else
{
if (l9_366==2)
{
float l9_367=fract(l9_365);
float l9_368=l9_365-l9_367;
float l9_369=step(0.25,fract(l9_368*0.5));
l9_365=mix(l9_367,1.0-l9_367,fast::clamp(l9_369,0.0,1.0));
}
}
l9_354.x=l9_365;
float l9_370=l9_354.y;
int l9_371=l9_357.y;
if (l9_371==1)
{
l9_370=fract(l9_370);
}
else
{
if (l9_371==2)
{
float l9_372=fract(l9_370);
float l9_373=l9_370-l9_372;
float l9_374=step(0.25,fract(l9_373*0.5));
l9_370=mix(l9_372,1.0-l9_372,fast::clamp(l9_374,0.0,1.0));
}
}
l9_354.y=l9_370;
if (l9_358)
{
bool l9_375=l9_360;
bool l9_376;
if (l9_375)
{
l9_376=l9_357.x==3;
}
else
{
l9_376=l9_375;
}
float l9_377=l9_354.x;
float l9_378=l9_359.x;
float l9_379=l9_359.z;
bool l9_380=l9_376;
float l9_381=l9_364;
float l9_382=fast::clamp(l9_377,l9_378,l9_379);
float l9_383=step(abs(l9_377-l9_382),9.9999997e-06);
l9_381*=(l9_383+((1.0-float(l9_380))*(1.0-l9_383)));
l9_377=l9_382;
l9_354.x=l9_377;
l9_364=l9_381;
bool l9_384=l9_360;
bool l9_385;
if (l9_384)
{
l9_385=l9_357.y==3;
}
else
{
l9_385=l9_384;
}
float l9_386=l9_354.y;
float l9_387=l9_359.y;
float l9_388=l9_359.w;
bool l9_389=l9_385;
float l9_390=l9_364;
float l9_391=fast::clamp(l9_386,l9_387,l9_388);
float l9_392=step(abs(l9_386-l9_391),9.9999997e-06);
l9_390*=(l9_392+((1.0-float(l9_389))*(1.0-l9_392)));
l9_386=l9_391;
l9_354.y=l9_386;
l9_364=l9_390;
}
float2 l9_393=l9_354;
bool l9_394=l9_355;
float3x3 l9_395=l9_356;
if (l9_394)
{
l9_393=float2((l9_395*float3(l9_393,1.0)).xy);
}
float2 l9_396=l9_393;
l9_354=l9_396;
float l9_397=l9_354.x;
int l9_398=l9_357.x;
bool l9_399=l9_363;
float l9_400=l9_364;
if ((l9_398==0)||(l9_398==3))
{
float l9_401=l9_397;
float l9_402=0.0;
float l9_403=1.0;
bool l9_404=l9_399;
float l9_405=l9_400;
float l9_406=fast::clamp(l9_401,l9_402,l9_403);
float l9_407=step(abs(l9_401-l9_406),9.9999997e-06);
l9_405*=(l9_407+((1.0-float(l9_404))*(1.0-l9_407)));
l9_401=l9_406;
l9_397=l9_401;
l9_400=l9_405;
}
l9_354.x=l9_397;
l9_364=l9_400;
float l9_408=l9_354.y;
int l9_409=l9_357.y;
bool l9_410=l9_363;
float l9_411=l9_364;
if ((l9_409==0)||(l9_409==3))
{
float l9_412=l9_408;
float l9_413=0.0;
float l9_414=1.0;
bool l9_415=l9_410;
float l9_416=l9_411;
float l9_417=fast::clamp(l9_412,l9_413,l9_414);
float l9_418=step(abs(l9_412-l9_417),9.9999997e-06);
l9_416*=(l9_418+((1.0-float(l9_415))*(1.0-l9_418)));
l9_412=l9_417;
l9_408=l9_412;
l9_411=l9_416;
}
l9_354.y=l9_408;
l9_364=l9_411;
float2 l9_419=l9_354;
int l9_420=l9_352;
int l9_421=l9_353;
float l9_422=l9_362;
float2 l9_423=l9_419;
int l9_424=l9_420;
int l9_425=l9_421;
float3 l9_426=float3(0.0);
if (l9_424==0)
{
l9_426=float3(l9_423,0.0);
}
else
{
if (l9_424==1)
{
l9_426=float3(l9_423.x,(l9_423.y*0.5)+(0.5-(float(l9_425)*0.5)),0.0);
}
else
{
l9_426=float3(l9_423,float(l9_425));
}
}
float3 l9_427=l9_426;
float3 l9_428=l9_427;
float4 l9_429=sc_set0.metallicRoughnessTexture.sample(sc_set0.metallicRoughnessTextureSmpSC,l9_428.xy,bias(l9_422));
float4 l9_430=l9_429;
if (l9_360)
{
l9_430=mix(l9_361,l9_430,float4(l9_364));
}
float4 l9_431=l9_430;
l9_345=l9_431;
float4 l9_432=l9_345;
float3 l9_433=l9_432.xyz;
l9_326*=l9_433.y;
N3_Roughness=l9_326;
}
float l9_434=N3_Opacity;
float l9_435;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_435=pow(l9_434,0.45454544);
}
else
{
l9_435=sqrt(l9_434);
}
float l9_436=l9_435;
N3_Opacity=l9_436;
if (N3_SheenEnable)
{
float3 l9_437=N3_Normal;
float l9_438=N3_SheenRoughnessFactor;
if (N3_EnableSheenRoughnessTexture)
{
int l9_439=N3_SheenRoughnessTextureCoord;
float2 l9_440=tempGlobals.Surface_UVCoord0;
float2 l9_441=l9_440;
if (l9_439==0)
{
float2 l9_442=tempGlobals.Surface_UVCoord0;
l9_441=l9_442;
}
if (l9_439==1)
{
float2 l9_443=tempGlobals.Surface_UVCoord1;
l9_441=l9_443;
}
float2 l9_444=l9_441;
float2 l9_445=l9_444;
if (N3_EnableTextureTransform&&N3_SheenRoughnessTextureTransform)
{
float2 l9_446=l9_445;
float2 l9_447=N3_SheenRoughnessTextureOffset;
float2 l9_448=N3_SheenRoughnessTextureScale;
float l9_449=N3_SheenRoughnessTextureRotation;
float l9_450=radians(l9_449);
float3x3 l9_451=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_447.x,l9_447.y,1.0));
float3x3 l9_452=float3x3(float3(cos(l9_450),sin(l9_450),0.0),float3(-sin(l9_450),cos(l9_450),0.0),float3(0.0,0.0,1.0));
float3x3 l9_453=float3x3(float3(l9_448.x,0.0,0.0),float3(0.0,l9_448.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_454=(l9_451*l9_452)*l9_453;
float2 l9_455=(l9_454*float3(l9_446,1.0)).xy;
l9_445=l9_455;
}
float2 l9_456=l9_445;
float4 l9_457=float4(0.0);
int l9_458;
if ((int(sheenRoughnessTextureHasSwappedViews_tmp)!=0))
{
int l9_459=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_459=0;
}
else
{
l9_459=in.varStereoViewID;
}
int l9_460=l9_459;
l9_458=1-l9_460;
}
else
{
int l9_461=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_461=0;
}
else
{
l9_461=in.varStereoViewID;
}
int l9_462=l9_461;
l9_458=l9_462;
}
int l9_463=l9_458;
int l9_464=sheenRoughnessTextureLayout_tmp;
int l9_465=l9_463;
float2 l9_466=l9_456;
bool l9_467=(int(SC_USE_UV_TRANSFORM_sheenRoughnessTexture_tmp)!=0);
float3x3 l9_468=(*sc_set0.UserUniforms).sheenRoughnessTextureTransform;
int2 l9_469=int2(SC_SOFTWARE_WRAP_MODE_U_sheenRoughnessTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_sheenRoughnessTexture_tmp);
bool l9_470=(int(SC_USE_UV_MIN_MAX_sheenRoughnessTexture_tmp)!=0);
float4 l9_471=(*sc_set0.UserUniforms).sheenRoughnessTextureUvMinMax;
bool l9_472=(int(SC_USE_CLAMP_TO_BORDER_sheenRoughnessTexture_tmp)!=0);
float4 l9_473=(*sc_set0.UserUniforms).sheenRoughnessTextureBorderColor;
float l9_474=0.0;
bool l9_475=l9_472&&(!l9_470);
float l9_476=1.0;
float l9_477=l9_466.x;
int l9_478=l9_469.x;
if (l9_478==1)
{
l9_477=fract(l9_477);
}
else
{
if (l9_478==2)
{
float l9_479=fract(l9_477);
float l9_480=l9_477-l9_479;
float l9_481=step(0.25,fract(l9_480*0.5));
l9_477=mix(l9_479,1.0-l9_479,fast::clamp(l9_481,0.0,1.0));
}
}
l9_466.x=l9_477;
float l9_482=l9_466.y;
int l9_483=l9_469.y;
if (l9_483==1)
{
l9_482=fract(l9_482);
}
else
{
if (l9_483==2)
{
float l9_484=fract(l9_482);
float l9_485=l9_482-l9_484;
float l9_486=step(0.25,fract(l9_485*0.5));
l9_482=mix(l9_484,1.0-l9_484,fast::clamp(l9_486,0.0,1.0));
}
}
l9_466.y=l9_482;
if (l9_470)
{
bool l9_487=l9_472;
bool l9_488;
if (l9_487)
{
l9_488=l9_469.x==3;
}
else
{
l9_488=l9_487;
}
float l9_489=l9_466.x;
float l9_490=l9_471.x;
float l9_491=l9_471.z;
bool l9_492=l9_488;
float l9_493=l9_476;
float l9_494=fast::clamp(l9_489,l9_490,l9_491);
float l9_495=step(abs(l9_489-l9_494),9.9999997e-06);
l9_493*=(l9_495+((1.0-float(l9_492))*(1.0-l9_495)));
l9_489=l9_494;
l9_466.x=l9_489;
l9_476=l9_493;
bool l9_496=l9_472;
bool l9_497;
if (l9_496)
{
l9_497=l9_469.y==3;
}
else
{
l9_497=l9_496;
}
float l9_498=l9_466.y;
float l9_499=l9_471.y;
float l9_500=l9_471.w;
bool l9_501=l9_497;
float l9_502=l9_476;
float l9_503=fast::clamp(l9_498,l9_499,l9_500);
float l9_504=step(abs(l9_498-l9_503),9.9999997e-06);
l9_502*=(l9_504+((1.0-float(l9_501))*(1.0-l9_504)));
l9_498=l9_503;
l9_466.y=l9_498;
l9_476=l9_502;
}
float2 l9_505=l9_466;
bool l9_506=l9_467;
float3x3 l9_507=l9_468;
if (l9_506)
{
l9_505=float2((l9_507*float3(l9_505,1.0)).xy);
}
float2 l9_508=l9_505;
l9_466=l9_508;
float l9_509=l9_466.x;
int l9_510=l9_469.x;
bool l9_511=l9_475;
float l9_512=l9_476;
if ((l9_510==0)||(l9_510==3))
{
float l9_513=l9_509;
float l9_514=0.0;
float l9_515=1.0;
bool l9_516=l9_511;
float l9_517=l9_512;
float l9_518=fast::clamp(l9_513,l9_514,l9_515);
float l9_519=step(abs(l9_513-l9_518),9.9999997e-06);
l9_517*=(l9_519+((1.0-float(l9_516))*(1.0-l9_519)));
l9_513=l9_518;
l9_509=l9_513;
l9_512=l9_517;
}
l9_466.x=l9_509;
l9_476=l9_512;
float l9_520=l9_466.y;
int l9_521=l9_469.y;
bool l9_522=l9_475;
float l9_523=l9_476;
if ((l9_521==0)||(l9_521==3))
{
float l9_524=l9_520;
float l9_525=0.0;
float l9_526=1.0;
bool l9_527=l9_522;
float l9_528=l9_523;
float l9_529=fast::clamp(l9_524,l9_525,l9_526);
float l9_530=step(abs(l9_524-l9_529),9.9999997e-06);
l9_528*=(l9_530+((1.0-float(l9_527))*(1.0-l9_530)));
l9_524=l9_529;
l9_520=l9_524;
l9_523=l9_528;
}
l9_466.y=l9_520;
l9_476=l9_523;
float2 l9_531=l9_466;
int l9_532=l9_464;
int l9_533=l9_465;
float l9_534=l9_474;
float2 l9_535=l9_531;
int l9_536=l9_532;
int l9_537=l9_533;
float3 l9_538=float3(0.0);
if (l9_536==0)
{
l9_538=float3(l9_535,0.0);
}
else
{
if (l9_536==1)
{
l9_538=float3(l9_535.x,(l9_535.y*0.5)+(0.5-(float(l9_537)*0.5)),0.0);
}
else
{
l9_538=float3(l9_535,float(l9_537));
}
}
float3 l9_539=l9_538;
float3 l9_540=l9_539;
float4 l9_541=sc_set0.sheenRoughnessTexture.sample(sc_set0.sheenRoughnessTextureSmpSC,l9_540.xy,bias(l9_534));
float4 l9_542=l9_541;
if (l9_472)
{
l9_542=mix(l9_473,l9_542,float4(l9_476));
}
float4 l9_543=l9_542;
l9_457=l9_543;
float4 l9_544=l9_457;
float l9_545=l9_544.w;
float l9_546;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_546=pow(l9_545,2.2);
}
else
{
l9_546=l9_545*l9_545;
}
float l9_547=l9_546;
l9_438*=l9_547;
}
l9_438=fast::max(l9_438,9.9999997e-05);
float3 l9_548=l9_437;
float3 l9_549=(*sc_set0.UserUniforms).sc_Camera.position;
float3 l9_550=tempGlobals.SurfacePosition_WorldSpace;
float3 l9_551=normalize(l9_549-l9_550);
float3 l9_552=normalize(reflect(-l9_551,l9_548));
float3 l9_553=l9_552;
float l9_554=l9_438;
float l9_555=l9_554*4.0;
l9_555=3.0+(((l9_555-0.0)*2.0)/5.000001);
float3 l9_556=l9_553;
float l9_557=l9_555;
float3 l9_558=l9_556;
float l9_559=l9_557;
float3 l9_560=l9_558;
float l9_561=l9_559;
float3 l9_562=l9_560;
float l9_563=(*sc_set0.UserUniforms).sc_EnvmapRotation.y;
float2 l9_564=float2(0.0);
float l9_565=l9_562.x;
float l9_566=-l9_562.z;
float l9_567=(l9_565<0.0) ? (-1.0) : 1.0;
float l9_568=l9_567*acos(fast::clamp(l9_566/length(float2(l9_565,l9_566)),-1.0,1.0));
l9_564.x=l9_568-1.5707964;
l9_564.y=acos(l9_562.y);
l9_564/=float2(6.2831855,3.1415927);
l9_564.y=1.0-l9_564.y;
l9_564.x+=(l9_563/360.0);
l9_564.x=fract((l9_564.x+floor(l9_564.x))+1.0);
float2 l9_569=l9_564;
float2 l9_570=l9_569;
if (SC_DEVICE_CLASS_tmp>=2)
{
float l9_571=floor(l9_561);
float l9_572=ceil(l9_561);
float2 l9_573=l9_570;
float2 l9_574=(*sc_set0.UserUniforms).sc_EnvmapSpecularSize.xy;
float l9_575=l9_571;
float2 l9_576=l9_570;
float2 l9_577=(*sc_set0.UserUniforms).sc_EnvmapSpecularSize.xy;
float l9_578=l9_572;
}
else
{
}
}
if (N3_ClearcoatEnable)
{
N3_ClearcoatRoughness=1.0;
N3_ClearcoatNormal=float3(0.0,0.0,1.0);
if (N3_EnableClearCoatRoughnessTexture)
{
int l9_579=N3_ClearcoatRoughnessTextureCoord;
float2 l9_580=tempGlobals.Surface_UVCoord0;
float2 l9_581=l9_580;
if (l9_579==0)
{
float2 l9_582=tempGlobals.Surface_UVCoord0;
l9_581=l9_582;
}
if (l9_579==1)
{
float2 l9_583=tempGlobals.Surface_UVCoord1;
l9_581=l9_583;
}
float2 l9_584=l9_581;
float2 l9_585=l9_584;
if (N3_EnableTextureTransform&&N3_ClearcoatRoughnessTextureTransform)
{
float2 l9_586=l9_585;
float2 l9_587=N3_ClearcoatRoughnessTextureOffset;
float2 l9_588=N3_ClearcoatRoughnessTextureScale;
float l9_589=N3_ClearcoatRoughnessTextureRotation;
float l9_590=radians(l9_589);
float3x3 l9_591=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_587.x,l9_587.y,1.0));
float3x3 l9_592=float3x3(float3(cos(l9_590),sin(l9_590),0.0),float3(-sin(l9_590),cos(l9_590),0.0),float3(0.0,0.0,1.0));
float3x3 l9_593=float3x3(float3(l9_588.x,0.0,0.0),float3(0.0,l9_588.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_594=(l9_591*l9_592)*l9_593;
float2 l9_595=(l9_594*float3(l9_586,1.0)).xy;
l9_585=l9_595;
}
float2 l9_596=l9_585;
float4 l9_597=float4(0.0);
int l9_598;
if ((int(clearcoatRoughnessTextureHasSwappedViews_tmp)!=0))
{
int l9_599=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_599=0;
}
else
{
l9_599=in.varStereoViewID;
}
int l9_600=l9_599;
l9_598=1-l9_600;
}
else
{
int l9_601=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_601=0;
}
else
{
l9_601=in.varStereoViewID;
}
int l9_602=l9_601;
l9_598=l9_602;
}
int l9_603=l9_598;
int l9_604=clearcoatRoughnessTextureLayout_tmp;
int l9_605=l9_603;
float2 l9_606=l9_596;
bool l9_607=(int(SC_USE_UV_TRANSFORM_clearcoatRoughnessTexture_tmp)!=0);
float3x3 l9_608=(*sc_set0.UserUniforms).clearcoatRoughnessTextureTransform;
int2 l9_609=int2(SC_SOFTWARE_WRAP_MODE_U_clearcoatRoughnessTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_clearcoatRoughnessTexture_tmp);
bool l9_610=(int(SC_USE_UV_MIN_MAX_clearcoatRoughnessTexture_tmp)!=0);
float4 l9_611=(*sc_set0.UserUniforms).clearcoatRoughnessTextureUvMinMax;
bool l9_612=(int(SC_USE_CLAMP_TO_BORDER_clearcoatRoughnessTexture_tmp)!=0);
float4 l9_613=(*sc_set0.UserUniforms).clearcoatRoughnessTextureBorderColor;
float l9_614=0.0;
bool l9_615=l9_612&&(!l9_610);
float l9_616=1.0;
float l9_617=l9_606.x;
int l9_618=l9_609.x;
if (l9_618==1)
{
l9_617=fract(l9_617);
}
else
{
if (l9_618==2)
{
float l9_619=fract(l9_617);
float l9_620=l9_617-l9_619;
float l9_621=step(0.25,fract(l9_620*0.5));
l9_617=mix(l9_619,1.0-l9_619,fast::clamp(l9_621,0.0,1.0));
}
}
l9_606.x=l9_617;
float l9_622=l9_606.y;
int l9_623=l9_609.y;
if (l9_623==1)
{
l9_622=fract(l9_622);
}
else
{
if (l9_623==2)
{
float l9_624=fract(l9_622);
float l9_625=l9_622-l9_624;
float l9_626=step(0.25,fract(l9_625*0.5));
l9_622=mix(l9_624,1.0-l9_624,fast::clamp(l9_626,0.0,1.0));
}
}
l9_606.y=l9_622;
if (l9_610)
{
bool l9_627=l9_612;
bool l9_628;
if (l9_627)
{
l9_628=l9_609.x==3;
}
else
{
l9_628=l9_627;
}
float l9_629=l9_606.x;
float l9_630=l9_611.x;
float l9_631=l9_611.z;
bool l9_632=l9_628;
float l9_633=l9_616;
float l9_634=fast::clamp(l9_629,l9_630,l9_631);
float l9_635=step(abs(l9_629-l9_634),9.9999997e-06);
l9_633*=(l9_635+((1.0-float(l9_632))*(1.0-l9_635)));
l9_629=l9_634;
l9_606.x=l9_629;
l9_616=l9_633;
bool l9_636=l9_612;
bool l9_637;
if (l9_636)
{
l9_637=l9_609.y==3;
}
else
{
l9_637=l9_636;
}
float l9_638=l9_606.y;
float l9_639=l9_611.y;
float l9_640=l9_611.w;
bool l9_641=l9_637;
float l9_642=l9_616;
float l9_643=fast::clamp(l9_638,l9_639,l9_640);
float l9_644=step(abs(l9_638-l9_643),9.9999997e-06);
l9_642*=(l9_644+((1.0-float(l9_641))*(1.0-l9_644)));
l9_638=l9_643;
l9_606.y=l9_638;
l9_616=l9_642;
}
float2 l9_645=l9_606;
bool l9_646=l9_607;
float3x3 l9_647=l9_608;
if (l9_646)
{
l9_645=float2((l9_647*float3(l9_645,1.0)).xy);
}
float2 l9_648=l9_645;
l9_606=l9_648;
float l9_649=l9_606.x;
int l9_650=l9_609.x;
bool l9_651=l9_615;
float l9_652=l9_616;
if ((l9_650==0)||(l9_650==3))
{
float l9_653=l9_649;
float l9_654=0.0;
float l9_655=1.0;
bool l9_656=l9_651;
float l9_657=l9_652;
float l9_658=fast::clamp(l9_653,l9_654,l9_655);
float l9_659=step(abs(l9_653-l9_658),9.9999997e-06);
l9_657*=(l9_659+((1.0-float(l9_656))*(1.0-l9_659)));
l9_653=l9_658;
l9_649=l9_653;
l9_652=l9_657;
}
l9_606.x=l9_649;
l9_616=l9_652;
float l9_660=l9_606.y;
int l9_661=l9_609.y;
bool l9_662=l9_615;
float l9_663=l9_616;
if ((l9_661==0)||(l9_661==3))
{
float l9_664=l9_660;
float l9_665=0.0;
float l9_666=1.0;
bool l9_667=l9_662;
float l9_668=l9_663;
float l9_669=fast::clamp(l9_664,l9_665,l9_666);
float l9_670=step(abs(l9_664-l9_669),9.9999997e-06);
l9_668*=(l9_670+((1.0-float(l9_667))*(1.0-l9_670)));
l9_664=l9_669;
l9_660=l9_664;
l9_663=l9_668;
}
l9_606.y=l9_660;
l9_616=l9_663;
float2 l9_671=l9_606;
int l9_672=l9_604;
int l9_673=l9_605;
float l9_674=l9_614;
float2 l9_675=l9_671;
int l9_676=l9_672;
int l9_677=l9_673;
float3 l9_678=float3(0.0);
if (l9_676==0)
{
l9_678=float3(l9_675,0.0);
}
else
{
if (l9_676==1)
{
l9_678=float3(l9_675.x,(l9_675.y*0.5)+(0.5-(float(l9_677)*0.5)),0.0);
}
else
{
l9_678=float3(l9_675,float(l9_677));
}
}
float3 l9_679=l9_678;
float3 l9_680=l9_679;
float4 l9_681=sc_set0.clearcoatRoughnessTexture.sample(sc_set0.clearcoatRoughnessTextureSmpSC,l9_680.xy,bias(l9_674));
float4 l9_682=l9_681;
if (l9_612)
{
l9_682=mix(l9_613,l9_682,float4(l9_616));
}
float4 l9_683=l9_682;
l9_597=l9_683;
float4 l9_684=l9_597;
float l9_685=l9_684.y;
float l9_686;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_686=pow(l9_685,2.2);
}
else
{
l9_686=l9_685*l9_685;
}
float l9_687=l9_686;
N3_ClearcoatRoughness=l9_687;
}
N3_ClearcoatRoughness*=N3_ClearcoatRoughnessFactor;
if (N3_EnableClearCoatNormalTexture)
{
int l9_688=N3_ClearcoatNormalMapCoord;
float2 l9_689=tempGlobals.Surface_UVCoord0;
float2 l9_690=l9_689;
if (l9_688==0)
{
float2 l9_691=tempGlobals.Surface_UVCoord0;
l9_690=l9_691;
}
if (l9_688==1)
{
float2 l9_692=tempGlobals.Surface_UVCoord1;
l9_690=l9_692;
}
float2 l9_693=l9_690;
float2 l9_694=l9_693;
if (N3_EnableTextureTransform&&N3_ClearcoatNormalTextureTransform)
{
float2 l9_695=l9_694;
float2 l9_696=N3_ClearcoatNormalTextureOffset;
float2 l9_697=N3_ClearcoatNormalTextureScale;
float l9_698=N3_ClearcoatNormalTextureRotation;
float l9_699=radians(l9_698);
float3x3 l9_700=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_696.x,l9_696.y,1.0));
float3x3 l9_701=float3x3(float3(cos(l9_699),sin(l9_699),0.0),float3(-sin(l9_699),cos(l9_699),0.0),float3(0.0,0.0,1.0));
float3x3 l9_702=float3x3(float3(l9_697.x,0.0,0.0),float3(0.0,l9_697.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_703=(l9_700*l9_701)*l9_702;
float2 l9_704=(l9_703*float3(l9_695,1.0)).xy;
l9_694=l9_704;
}
float2 l9_705=l9_694;
float4 l9_706=float4(0.0);
int l9_707;
if ((int(clearcoatNormalTextureHasSwappedViews_tmp)!=0))
{
int l9_708=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_708=0;
}
else
{
l9_708=in.varStereoViewID;
}
int l9_709=l9_708;
l9_707=1-l9_709;
}
else
{
int l9_710=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_710=0;
}
else
{
l9_710=in.varStereoViewID;
}
int l9_711=l9_710;
l9_707=l9_711;
}
int l9_712=l9_707;
int l9_713=clearcoatNormalTextureLayout_tmp;
int l9_714=l9_712;
float2 l9_715=l9_705;
bool l9_716=(int(SC_USE_UV_TRANSFORM_clearcoatNormalTexture_tmp)!=0);
float3x3 l9_717=(*sc_set0.UserUniforms).clearcoatNormalTextureTransform;
int2 l9_718=int2(SC_SOFTWARE_WRAP_MODE_U_clearcoatNormalTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_clearcoatNormalTexture_tmp);
bool l9_719=(int(SC_USE_UV_MIN_MAX_clearcoatNormalTexture_tmp)!=0);
float4 l9_720=(*sc_set0.UserUniforms).clearcoatNormalTextureUvMinMax;
bool l9_721=(int(SC_USE_CLAMP_TO_BORDER_clearcoatNormalTexture_tmp)!=0);
float4 l9_722=(*sc_set0.UserUniforms).clearcoatNormalTextureBorderColor;
float l9_723=0.0;
bool l9_724=l9_721&&(!l9_719);
float l9_725=1.0;
float l9_726=l9_715.x;
int l9_727=l9_718.x;
if (l9_727==1)
{
l9_726=fract(l9_726);
}
else
{
if (l9_727==2)
{
float l9_728=fract(l9_726);
float l9_729=l9_726-l9_728;
float l9_730=step(0.25,fract(l9_729*0.5));
l9_726=mix(l9_728,1.0-l9_728,fast::clamp(l9_730,0.0,1.0));
}
}
l9_715.x=l9_726;
float l9_731=l9_715.y;
int l9_732=l9_718.y;
if (l9_732==1)
{
l9_731=fract(l9_731);
}
else
{
if (l9_732==2)
{
float l9_733=fract(l9_731);
float l9_734=l9_731-l9_733;
float l9_735=step(0.25,fract(l9_734*0.5));
l9_731=mix(l9_733,1.0-l9_733,fast::clamp(l9_735,0.0,1.0));
}
}
l9_715.y=l9_731;
if (l9_719)
{
bool l9_736=l9_721;
bool l9_737;
if (l9_736)
{
l9_737=l9_718.x==3;
}
else
{
l9_737=l9_736;
}
float l9_738=l9_715.x;
float l9_739=l9_720.x;
float l9_740=l9_720.z;
bool l9_741=l9_737;
float l9_742=l9_725;
float l9_743=fast::clamp(l9_738,l9_739,l9_740);
float l9_744=step(abs(l9_738-l9_743),9.9999997e-06);
l9_742*=(l9_744+((1.0-float(l9_741))*(1.0-l9_744)));
l9_738=l9_743;
l9_715.x=l9_738;
l9_725=l9_742;
bool l9_745=l9_721;
bool l9_746;
if (l9_745)
{
l9_746=l9_718.y==3;
}
else
{
l9_746=l9_745;
}
float l9_747=l9_715.y;
float l9_748=l9_720.y;
float l9_749=l9_720.w;
bool l9_750=l9_746;
float l9_751=l9_725;
float l9_752=fast::clamp(l9_747,l9_748,l9_749);
float l9_753=step(abs(l9_747-l9_752),9.9999997e-06);
l9_751*=(l9_753+((1.0-float(l9_750))*(1.0-l9_753)));
l9_747=l9_752;
l9_715.y=l9_747;
l9_725=l9_751;
}
float2 l9_754=l9_715;
bool l9_755=l9_716;
float3x3 l9_756=l9_717;
if (l9_755)
{
l9_754=float2((l9_756*float3(l9_754,1.0)).xy);
}
float2 l9_757=l9_754;
l9_715=l9_757;
float l9_758=l9_715.x;
int l9_759=l9_718.x;
bool l9_760=l9_724;
float l9_761=l9_725;
if ((l9_759==0)||(l9_759==3))
{
float l9_762=l9_758;
float l9_763=0.0;
float l9_764=1.0;
bool l9_765=l9_760;
float l9_766=l9_761;
float l9_767=fast::clamp(l9_762,l9_763,l9_764);
float l9_768=step(abs(l9_762-l9_767),9.9999997e-06);
l9_766*=(l9_768+((1.0-float(l9_765))*(1.0-l9_768)));
l9_762=l9_767;
l9_758=l9_762;
l9_761=l9_766;
}
l9_715.x=l9_758;
l9_725=l9_761;
float l9_769=l9_715.y;
int l9_770=l9_718.y;
bool l9_771=l9_724;
float l9_772=l9_725;
if ((l9_770==0)||(l9_770==3))
{
float l9_773=l9_769;
float l9_774=0.0;
float l9_775=1.0;
bool l9_776=l9_771;
float l9_777=l9_772;
float l9_778=fast::clamp(l9_773,l9_774,l9_775);
float l9_779=step(abs(l9_773-l9_778),9.9999997e-06);
l9_777*=(l9_779+((1.0-float(l9_776))*(1.0-l9_779)));
l9_773=l9_778;
l9_769=l9_773;
l9_772=l9_777;
}
l9_715.y=l9_769;
l9_725=l9_772;
float2 l9_780=l9_715;
int l9_781=l9_713;
int l9_782=l9_714;
float l9_783=l9_723;
float2 l9_784=l9_780;
int l9_785=l9_781;
int l9_786=l9_782;
float3 l9_787=float3(0.0);
if (l9_785==0)
{
l9_787=float3(l9_784,0.0);
}
else
{
if (l9_785==1)
{
l9_787=float3(l9_784.x,(l9_784.y*0.5)+(0.5-(float(l9_786)*0.5)),0.0);
}
else
{
l9_787=float3(l9_784,float(l9_786));
}
}
float3 l9_788=l9_787;
float3 l9_789=l9_788;
float4 l9_790=sc_set0.clearcoatNormalTexture.sample(sc_set0.clearcoatNormalTextureSmpSC,l9_789.xy,bias(l9_783));
float4 l9_791=l9_790;
if (l9_721)
{
l9_791=mix(l9_722,l9_791,float4(l9_725));
}
float4 l9_792=l9_791;
l9_706=l9_792;
float4 l9_793=l9_706;
N3_ClearcoatNormal=l9_793.xyz;
N3_ClearcoatNormal*=0.9921875;
}
}
l9_207=N3_Opacity;
l9_208=N3_Normal;
l9_209=N3_Roughness;
l9_210=N3_ClearcoatNormal;
l9_211=N3_ClearcoatRoughness;
l9_181=l9_207;
l9_182=l9_208;
l9_183=l9_209;
l9_184=l9_210;
l9_185=l9_211;
float l9_794=l9_181;
float3 l9_795=l9_182;
float l9_796=l9_183;
ssGlobals l9_797=param;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
l9_797.BumpedNormal=l9_795;
}
l9_794=fast::clamp(l9_794,0.0,1.0);
float l9_798=l9_794;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_798<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_799=gl_FragCoord;
float2 l9_800=floor(mod(l9_799.xy,float2(4.0)));
float l9_801=(mod(dot(l9_800,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_798<l9_801)
{
discard_fragment();
}
}
float3 l9_802=l9_797.PositionWS;
float3 l9_803=l9_797.BumpedNormal;
float l9_804=l9_796;
float3 l9_805=l9_802;
float3 l9_806=l9_803;
float l9_807=l9_804;
uint l9_808=0u;
uint3 l9_809=uint3(round((l9_805-(*sc_set0.UserUniforms).sc_RayTracingOriginOffset)*(*sc_set0.UserUniforms).sc_RayTracingOriginScale));
out.sc_RayTracingPositionAndMask=uint4(l9_809.x,l9_809.y,l9_809.z,out.sc_RayTracingPositionAndMask.w);
out.sc_RayTracingPositionAndMask.w=(*sc_set0.UserUniforms).sc_RayTracingReceiverMask;
float3 l9_810=l9_806;
float l9_811=dot(abs(l9_810),float3(1.0));
l9_810/=float3(l9_811);
float2 l9_812=float2(fast::clamp(-l9_810.z,0.0,1.0));
float2 l9_813=l9_810.xy+mix(-l9_812,l9_812,step(float2(0.0),l9_810.xy));
uint l9_814=as_type<uint>(half2(l9_813));
uint2 l9_815=uint2(l9_814&65535u,l9_814>>16u);
out.sc_RayTracingNormalAndMore=uint4(l9_815.x,l9_815.y,out.sc_RayTracingNormalAndMore.z,out.sc_RayTracingNormalAndMore.w);
out.sc_RayTracingNormalAndMore.z=l9_808;
uint l9_816=uint(fast::clamp(l9_807,0.0,1.0)*1000.0);
l9_816 |= (((*sc_set0.UserUniforms).sc_RayTracingReceiverId%32u)<<10u);
out.sc_RayTracingNormalAndMore.w=l9_816;
float l9_817=(*sc_set0.UserUniforms).Port_Opacity_N405;
float3 l9_818=l9_184;
float l9_819=l9_185;
ssGlobals l9_820=param;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
l9_820.BumpedNormal=float3x3(float3(l9_820.VertexTangent_WorldSpace),float3(l9_820.VertexBinormal_WorldSpace),float3(l9_820.VertexNormal_WorldSpace))*l9_818;
}
float l9_821=l9_817;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_821<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_822=gl_FragCoord;
float2 l9_823=floor(mod(l9_822.xy,float2(4.0)));
float l9_824=(mod(dot(l9_823,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_821<l9_824)
{
discard_fragment();
}
}
float3 l9_825=l9_820.PositionWS;
float3 l9_826=l9_820.BumpedNormal;
float l9_827=l9_819;
float3 l9_828=l9_825;
float3 l9_829=l9_826;
float l9_830=l9_827;
uint l9_831=0u;
uint3 l9_832=uint3(round((l9_828-(*sc_set0.UserUniforms).sc_RayTracingOriginOffset)*(*sc_set0.UserUniforms).sc_RayTracingOriginScale));
out.sc_RayTracingPositionAndMask=uint4(l9_832.x,l9_832.y,l9_832.z,out.sc_RayTracingPositionAndMask.w);
out.sc_RayTracingPositionAndMask.w=(*sc_set0.UserUniforms).sc_RayTracingReceiverMask;
float3 l9_833=l9_829;
float l9_834=dot(abs(l9_833),float3(1.0));
l9_833/=float3(l9_834);
float2 l9_835=float2(fast::clamp(-l9_833.z,0.0,1.0));
float2 l9_836=l9_833.xy+mix(-l9_835,l9_835,step(float2(0.0),l9_833.xy));
uint l9_837=as_type<uint>(half2(l9_836));
uint2 l9_838=uint2(l9_837&65535u,l9_837>>16u);
out.sc_RayTracingNormalAndMore=uint4(l9_838.x,l9_838.y,out.sc_RayTracingNormalAndMore.z,out.sc_RayTracingNormalAndMore.w);
out.sc_RayTracingNormalAndMore.z=l9_831;
uint l9_839=uint(fast::clamp(l9_830,0.0,1.0)*1000.0);
l9_839 |= (((*sc_set0.UserUniforms).sc_RayTracingReceiverId%32u)<<10u);
out.sc_RayTracingNormalAndMore.w=l9_839;
ssGlobals l9_840=param;
tempGlobals=l9_840;
}
else
{
float4 l9_841=float4(0.0);
float4 l9_842=(*sc_set0.UserUniforms).baseColorFactor;
l9_841=l9_842;
float2 l9_843=float2(0.0);
float2 l9_844=(*sc_set0.UserUniforms).baseColorTexture_offset;
l9_843=l9_844;
float2 l9_845=float2(0.0);
float2 l9_846=(*sc_set0.UserUniforms).baseColorTexture_scale;
l9_845=l9_846;
float l9_847=0.0;
float l9_848=(*sc_set0.UserUniforms).baseColorTexture_rotation;
l9_847=l9_848;
float4 l9_849=l9_841;
float2 l9_850=l9_843;
float2 l9_851=l9_845;
float l9_852=l9_847;
ssGlobals l9_853=param;
tempGlobals=l9_853;
N35_EnableVertexColor=(int(ENABLE_VERTEX_COLOR_BASE_tmp)!=0);
N35_EnableBaseTexture=(int(ENABLE_BASE_TEX_tmp)!=0);
N35_BaseColorTextureCoord=NODE_7_DROPLIST_ITEM_tmp;
N35_BaseColorFactor=l9_849;
N35_EnableTextureTransform=(int(ENABLE_TEXTURE_TRANSFORM_tmp)!=0);
N35_BaseTextureTransform=(int(ENABLE_BASE_TEXTURE_TRANSFORM_tmp)!=0);
N35_BaseTextureOffset=l9_850;
N35_BaseTextureScale=l9_851;
N35_BaseTextureRotation=l9_852;
float4 l9_854=N35_BaseColorFactor;
if (N35_EnableBaseTexture)
{
int l9_855=N35_BaseColorTextureCoord;
float2 l9_856=tempGlobals.Surface_UVCoord0;
float2 l9_857=l9_856;
if (l9_855==0)
{
float2 l9_858=tempGlobals.Surface_UVCoord0;
l9_857=l9_858;
}
if (l9_855==1)
{
float2 l9_859=tempGlobals.Surface_UVCoord1;
l9_857=l9_859;
}
float2 l9_860=l9_857;
float2 l9_861=l9_860;
if (N35_EnableTextureTransform&&N35_BaseTextureTransform)
{
float2 l9_862=l9_861;
float2 l9_863=N35_BaseTextureOffset;
float2 l9_864=N35_BaseTextureScale;
float l9_865=N35_BaseTextureRotation;
float3x3 l9_866=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(l9_863.x,l9_863.y,1.0));
float3x3 l9_867=float3x3(float3(cos(l9_865),sin(l9_865),0.0),float3(-sin(l9_865),cos(l9_865),0.0),float3(0.0,0.0,1.0));
float3x3 l9_868=float3x3(float3(l9_864.x,0.0,0.0),float3(0.0,l9_864.y,0.0),float3(0.0,0.0,1.0));
float3x3 l9_869=(l9_866*l9_867)*l9_868;
float2 l9_870=(l9_869*float3(l9_862,1.0)).xy;
l9_861=l9_870;
}
float2 l9_871=l9_861;
float4 l9_872=float4(0.0);
int l9_873;
if ((int(baseColorTextureHasSwappedViews_tmp)!=0))
{
int l9_874=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_874=0;
}
else
{
l9_874=in.varStereoViewID;
}
int l9_875=l9_874;
l9_873=1-l9_875;
}
else
{
int l9_876=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_876=0;
}
else
{
l9_876=in.varStereoViewID;
}
int l9_877=l9_876;
l9_873=l9_877;
}
int l9_878=l9_873;
int l9_879=baseColorTextureLayout_tmp;
int l9_880=l9_878;
float2 l9_881=l9_871;
bool l9_882=(int(SC_USE_UV_TRANSFORM_baseColorTexture_tmp)!=0);
float3x3 l9_883=(*sc_set0.UserUniforms).baseColorTextureTransform;
int2 l9_884=int2(SC_SOFTWARE_WRAP_MODE_U_baseColorTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_baseColorTexture_tmp);
bool l9_885=(int(SC_USE_UV_MIN_MAX_baseColorTexture_tmp)!=0);
float4 l9_886=(*sc_set0.UserUniforms).baseColorTextureUvMinMax;
bool l9_887=(int(SC_USE_CLAMP_TO_BORDER_baseColorTexture_tmp)!=0);
float4 l9_888=(*sc_set0.UserUniforms).baseColorTextureBorderColor;
float l9_889=0.0;
bool l9_890=l9_887&&(!l9_885);
float l9_891=1.0;
float l9_892=l9_881.x;
int l9_893=l9_884.x;
if (l9_893==1)
{
l9_892=fract(l9_892);
}
else
{
if (l9_893==2)
{
float l9_894=fract(l9_892);
float l9_895=l9_892-l9_894;
float l9_896=step(0.25,fract(l9_895*0.5));
l9_892=mix(l9_894,1.0-l9_894,fast::clamp(l9_896,0.0,1.0));
}
}
l9_881.x=l9_892;
float l9_897=l9_881.y;
int l9_898=l9_884.y;
if (l9_898==1)
{
l9_897=fract(l9_897);
}
else
{
if (l9_898==2)
{
float l9_899=fract(l9_897);
float l9_900=l9_897-l9_899;
float l9_901=step(0.25,fract(l9_900*0.5));
l9_897=mix(l9_899,1.0-l9_899,fast::clamp(l9_901,0.0,1.0));
}
}
l9_881.y=l9_897;
if (l9_885)
{
bool l9_902=l9_887;
bool l9_903;
if (l9_902)
{
l9_903=l9_884.x==3;
}
else
{
l9_903=l9_902;
}
float l9_904=l9_881.x;
float l9_905=l9_886.x;
float l9_906=l9_886.z;
bool l9_907=l9_903;
float l9_908=l9_891;
float l9_909=fast::clamp(l9_904,l9_905,l9_906);
float l9_910=step(abs(l9_904-l9_909),9.9999997e-06);
l9_908*=(l9_910+((1.0-float(l9_907))*(1.0-l9_910)));
l9_904=l9_909;
l9_881.x=l9_904;
l9_891=l9_908;
bool l9_911=l9_887;
bool l9_912;
if (l9_911)
{
l9_912=l9_884.y==3;
}
else
{
l9_912=l9_911;
}
float l9_913=l9_881.y;
float l9_914=l9_886.y;
float l9_915=l9_886.w;
bool l9_916=l9_912;
float l9_917=l9_891;
float l9_918=fast::clamp(l9_913,l9_914,l9_915);
float l9_919=step(abs(l9_913-l9_918),9.9999997e-06);
l9_917*=(l9_919+((1.0-float(l9_916))*(1.0-l9_919)));
l9_913=l9_918;
l9_881.y=l9_913;
l9_891=l9_917;
}
float2 l9_920=l9_881;
bool l9_921=l9_882;
float3x3 l9_922=l9_883;
if (l9_921)
{
l9_920=float2((l9_922*float3(l9_920,1.0)).xy);
}
float2 l9_923=l9_920;
l9_881=l9_923;
float l9_924=l9_881.x;
int l9_925=l9_884.x;
bool l9_926=l9_890;
float l9_927=l9_891;
if ((l9_925==0)||(l9_925==3))
{
float l9_928=l9_924;
float l9_929=0.0;
float l9_930=1.0;
bool l9_931=l9_926;
float l9_932=l9_927;
float l9_933=fast::clamp(l9_928,l9_929,l9_930);
float l9_934=step(abs(l9_928-l9_933),9.9999997e-06);
l9_932*=(l9_934+((1.0-float(l9_931))*(1.0-l9_934)));
l9_928=l9_933;
l9_924=l9_928;
l9_927=l9_932;
}
l9_881.x=l9_924;
l9_891=l9_927;
float l9_935=l9_881.y;
int l9_936=l9_884.y;
bool l9_937=l9_890;
float l9_938=l9_891;
if ((l9_936==0)||(l9_936==3))
{
float l9_939=l9_935;
float l9_940=0.0;
float l9_941=1.0;
bool l9_942=l9_937;
float l9_943=l9_938;
float l9_944=fast::clamp(l9_939,l9_940,l9_941);
float l9_945=step(abs(l9_939-l9_944),9.9999997e-06);
l9_943*=(l9_945+((1.0-float(l9_942))*(1.0-l9_945)));
l9_939=l9_944;
l9_935=l9_939;
l9_938=l9_943;
}
l9_881.y=l9_935;
l9_891=l9_938;
float2 l9_946=l9_881;
int l9_947=l9_879;
int l9_948=l9_880;
float l9_949=l9_889;
float2 l9_950=l9_946;
int l9_951=l9_947;
int l9_952=l9_948;
float3 l9_953=float3(0.0);
if (l9_951==0)
{
l9_953=float3(l9_950,0.0);
}
else
{
if (l9_951==1)
{
l9_953=float3(l9_950.x,(l9_950.y*0.5)+(0.5-(float(l9_952)*0.5)),0.0);
}
else
{
l9_953=float3(l9_950,float(l9_952));
}
}
float3 l9_954=l9_953;
float3 l9_955=l9_954;
float4 l9_956=sc_set0.baseColorTexture.sample(sc_set0.baseColorTextureSmpSC,l9_955.xy,bias(l9_949));
float4 l9_957=l9_956;
if (l9_887)
{
l9_957=mix(l9_888,l9_957,float4(l9_891));
}
float4 l9_958=l9_957;
l9_872=l9_958;
float4 l9_959=l9_872;
float4 l9_960=l9_959;
float4 l9_961;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_961=float4(pow(l9_960.x,2.2),pow(l9_960.y,2.2),pow(l9_960.z,2.2),pow(l9_960.w,2.2));
}
else
{
l9_961=l9_960*l9_960;
}
float4 l9_962=l9_961;
l9_854*=l9_962;
}
if (N35_EnableVertexColor)
{
float4 l9_963=tempGlobals.VertexColor;
l9_854*=l9_963;
}
N35_Opacity=l9_854.w;
}
return out;
}
} // RECEIVER MODE SHADER
