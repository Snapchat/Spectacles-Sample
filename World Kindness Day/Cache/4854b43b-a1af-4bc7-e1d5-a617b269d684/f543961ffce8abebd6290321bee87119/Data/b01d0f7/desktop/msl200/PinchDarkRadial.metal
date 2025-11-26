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
// NGS_FLAG_IS_NORMAL_MAP normalTex
// NGS_FLAG_IS_NORMAL_MAP detailNormalTex
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
//sampler sampler baseTexSmpSC 0:28
//sampler sampler detailNormalTexSmpSC 0:29
//sampler sampler intensityTextureSmpSC 0:30
//sampler sampler normalTexSmpSC 0:31
//sampler sampler opacityTexSmpSC 0:32
//sampler sampler sc_EnvmapDiffuseSmpSC 0:33
//sampler sampler sc_EnvmapSpecularSmpSC 0:34
//sampler sampler sc_RayTracingGlobalIlluminationSmpSC 0:36
//sampler sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC 0:37
//sampler sampler sc_RayTracingRayDirectionSmpSC 0:38
//sampler sampler sc_RayTracingShadowsSmpSC 0:40
//sampler sampler sc_SSAOTextureSmpSC 0:41
//sampler sampler sc_ScreenTextureSmpSC 0:42
//sampler sampler sc_ShadowTextureSmpSC 0:43
//texture texture2D baseTex 0:4:0:28
//texture texture2D detailNormalTex 0:5:0:29
//texture texture2D intensityTexture 0:6:0:30
//texture texture2D normalTex 0:7:0:31
//texture texture2D opacityTex 0:8:0:32
//texture texture2D sc_EnvmapDiffuse 0:9:0:33
//texture texture2D sc_EnvmapSpecular 0:10:0:34
//texture texture2D sc_RayTracingGlobalIllumination 0:19:0:36
//texture utexture2D sc_RayTracingHitCasterIdAndBarycentric 0:20:0:37
//texture texture2D sc_RayTracingRayDirection 0:21:0:38
//texture texture2D sc_RayTracingShadows 0:23:0:40
//texture texture2D sc_SSAOTexture 0:24:0:41
//texture texture2D sc_ScreenTexture 0:25:0:42
//texture texture2D sc_ShadowTexture 0:26:0:43
//ubo float sc_BonesUBO 0:3:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:45:5728 {
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
//int PreviewNodeID 4616
//float alphaTestThreshold 4620
//float3 recolorRed 4624
//float4 Tweak_N81 4640
//float4 baseColor 4656
//float3x3 baseTexTransform 4720
//float4 baseTexUvMinMax 4768
//float4 baseTexBorderColor 4784
//float2 uv2Scale 4800
//float2 uv2Offset 4808
//float2 uv3Scale 4816
//float2 uv3Offset 4824
//float3 recolorGreen 4832
//float3 recolorBlue 4848
//float3x3 opacityTexTransform 4912
//float4 opacityTexUvMinMax 4960
//float4 opacityTexBorderColor 4976
//float3x3 normalTexTransform 5040
//float4 normalTexUvMinMax 5088
//float4 normalTexBorderColor 5104
//float3x3 detailNormalTexTransform 5168
//float4 detailNormalTexUvMinMax 5216
//float4 detailNormalTexBorderColor 5232
//float colorMultiplier 5248
//float Port_Position1_N078 5312
//float Port_Speed_N022 5384
//float Port_Speed_N063 5440
//float4 Port_Default_N369 5456
//float Port_Value2_N073 5536
//float Port_Default_N204 5592
//float Port_Input2_N072 5604
//float Port_Strength1_N200 5632
//float3 Port_Default_N113 5648
//float Port_Strength2_N200 5664
//float3 Port_Emissive_N036 5680
//float3 Port_AO_N036 5696
//float depthRef 5712
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
//spec_const bool ENABLE_BASE_TEX 30 0
//spec_const bool ENABLE_DETAIL_NORMAL 31 0
//spec_const bool ENABLE_NORMALMAP 32 0
//spec_const bool ENABLE_OPACITY_TEX 33 0
//spec_const bool ENABLE_RECOLOR 34 0
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 35 0
//spec_const bool ENABLE_UV2_ANIMATION 36 0
//spec_const bool ENABLE_UV2 37 0
//spec_const bool ENABLE_UV3_ANIMATION 38 0
//spec_const bool ENABLE_UV3 39 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_baseTex 40 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_detailNormalTex 41 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 42 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_normalTex 43 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_opacityTex 44 0
//spec_const bool SC_USE_UV_MIN_MAX_baseTex 45 0
//spec_const bool SC_USE_UV_MIN_MAX_detailNormalTex 46 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 47 0
//spec_const bool SC_USE_UV_MIN_MAX_normalTex 48 0
//spec_const bool SC_USE_UV_MIN_MAX_opacityTex 49 0
//spec_const bool SC_USE_UV_TRANSFORM_baseTex 50 0
//spec_const bool SC_USE_UV_TRANSFORM_detailNormalTex 51 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 52 0
//spec_const bool SC_USE_UV_TRANSFORM_normalTex 53 0
//spec_const bool SC_USE_UV_TRANSFORM_opacityTex 54 0
//spec_const bool UseViewSpaceDepthVariant 55 1
//spec_const bool baseTexHasSwappedViews 56 0
//spec_const bool detailNormalTexHasSwappedViews 57 0
//spec_const bool intensityTextureHasSwappedViews 58 0
//spec_const bool normalTexHasSwappedViews 59 0
//spec_const bool opacityTexHasSwappedViews 60 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 61 0
//spec_const bool sc_BlendMode_Add 62 0
//spec_const bool sc_BlendMode_AlphaTest 63 0
//spec_const bool sc_BlendMode_AlphaToCoverage 64 0
//spec_const bool sc_BlendMode_ColoredGlass 65 0
//spec_const bool sc_BlendMode_Custom 66 0
//spec_const bool sc_BlendMode_Max 67 0
//spec_const bool sc_BlendMode_Min 68 0
//spec_const bool sc_BlendMode_MultiplyOriginal 69 0
//spec_const bool sc_BlendMode_Multiply 70 0
//spec_const bool sc_BlendMode_Normal 71 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 72 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 73 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 74 0
//spec_const bool sc_BlendMode_Screen 75 0
//spec_const bool sc_DepthOnly 76 0
//spec_const bool sc_EnvmapDiffuseHasSwappedViews 77 0
//spec_const bool sc_EnvmapSpecularHasSwappedViews 78 0
//spec_const bool sc_FramebufferFetch 79 0
//spec_const bool sc_HasDiffuseEnvmap 80 0
//spec_const bool sc_IsEditor 81 0
//spec_const bool sc_LightEstimation 82 0
//spec_const bool sc_MotionVectorsPass 83 0
//spec_const bool sc_OITCompositingPass 84 0
//spec_const bool sc_OITDepthBoundsPass 85 0
//spec_const bool sc_OITDepthGatherPass 86 0
//spec_const bool sc_OutputBounds 87 0
//spec_const bool sc_ProjectiveShadowsCaster 88 0
//spec_const bool sc_ProjectiveShadowsReceiver 89 0
//spec_const bool sc_RayTracingCasterForceOpaque 90 0
//spec_const bool sc_RayTracingGlobalIlluminationHasSwappedViews 91 0
//spec_const bool sc_RayTracingShadowsHasSwappedViews 92 0
//spec_const bool sc_RenderAlphaToColor 93 0
//spec_const bool sc_SSAOEnabled 94 0
//spec_const bool sc_ScreenTextureHasSwappedViews 95 0
//spec_const bool sc_TAAEnabled 96 0
//spec_const bool sc_VertexBlendingUseNormals 97 0
//spec_const bool sc_VertexBlending 98 0
//spec_const bool sc_Voxelization 99 0
//spec_const int NODE_13_DROPLIST_ITEM 100 0
//spec_const int NODE_181_DROPLIST_ITEM 101 0
//spec_const int NODE_184_DROPLIST_ITEM 102 0
//spec_const int NODE_27_DROPLIST_ITEM 103 0
//spec_const int NODE_38_DROPLIST_ITEM 104 0
//spec_const int NODE_49_DROPLIST_ITEM 105 0
//spec_const int NODE_69_DROPLIST_ITEM 106 0
//spec_const int SC_DEVICE_CLASS 107 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_baseTex 108 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_detailNormalTex 109 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 110 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_normalTex 111 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_opacityTex 112 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_baseTex 113 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_detailNormalTex 114 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 115 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_normalTex 116 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_opacityTex 117 -1
//spec_const int baseTexLayout 118 0
//spec_const int detailNormalTexLayout 119 0
//spec_const int intensityTextureLayout 120 0
//spec_const int normalTexLayout 121 0
//spec_const int opacityTexLayout 122 0
//spec_const int sc_AmbientLightMode0 123 0
//spec_const int sc_AmbientLightMode1 124 0
//spec_const int sc_AmbientLightMode2 125 0
//spec_const int sc_AmbientLightMode_Constant 126 0
//spec_const int sc_AmbientLightMode_EnvironmentMap 127 0
//spec_const int sc_AmbientLightMode_FromCamera 128 0
//spec_const int sc_AmbientLightMode_SphericalHarmonics 129 0
//spec_const int sc_AmbientLightsCount 130 0
//spec_const int sc_DepthBufferMode 131 0
//spec_const int sc_DirectionalLightsCount 132 0
//spec_const int sc_EnvLightMode 133 0
//spec_const int sc_EnvmapDiffuseLayout 134 0
//spec_const int sc_EnvmapSpecularLayout 135 0
//spec_const int sc_LightEstimationSGCount 136 0
//spec_const int sc_PointLightsCount 137 0
//spec_const int sc_RayTracingGlobalIlluminationLayout 138 0
//spec_const int sc_RayTracingShadowsLayout 139 0
//spec_const int sc_RenderingSpace 140 -1
//spec_const int sc_ScreenTextureLayout 141 0
//spec_const int sc_ShaderCacheConstant 142 0
//spec_const int sc_SkinBonesCount 143 0
//spec_const int sc_StereoRenderingMode 144 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 145 0
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
constant bool ENABLE_BASE_TEX [[function_constant(30)]];
constant bool ENABLE_BASE_TEX_tmp = is_function_constant_defined(ENABLE_BASE_TEX) ? ENABLE_BASE_TEX : false;
constant bool ENABLE_DETAIL_NORMAL [[function_constant(31)]];
constant bool ENABLE_DETAIL_NORMAL_tmp = is_function_constant_defined(ENABLE_DETAIL_NORMAL) ? ENABLE_DETAIL_NORMAL : false;
constant bool ENABLE_NORMALMAP [[function_constant(32)]];
constant bool ENABLE_NORMALMAP_tmp = is_function_constant_defined(ENABLE_NORMALMAP) ? ENABLE_NORMALMAP : false;
constant bool ENABLE_OPACITY_TEX [[function_constant(33)]];
constant bool ENABLE_OPACITY_TEX_tmp = is_function_constant_defined(ENABLE_OPACITY_TEX) ? ENABLE_OPACITY_TEX : false;
constant bool ENABLE_RECOLOR [[function_constant(34)]];
constant bool ENABLE_RECOLOR_tmp = is_function_constant_defined(ENABLE_RECOLOR) ? ENABLE_RECOLOR : false;
constant bool ENABLE_STIPPLE_PATTERN_TEST [[function_constant(35)]];
constant bool ENABLE_STIPPLE_PATTERN_TEST_tmp = is_function_constant_defined(ENABLE_STIPPLE_PATTERN_TEST) ? ENABLE_STIPPLE_PATTERN_TEST : false;
constant bool ENABLE_UV2_ANIMATION [[function_constant(36)]];
constant bool ENABLE_UV2_ANIMATION_tmp = is_function_constant_defined(ENABLE_UV2_ANIMATION) ? ENABLE_UV2_ANIMATION : false;
constant bool ENABLE_UV2 [[function_constant(37)]];
constant bool ENABLE_UV2_tmp = is_function_constant_defined(ENABLE_UV2) ? ENABLE_UV2 : false;
constant bool ENABLE_UV3_ANIMATION [[function_constant(38)]];
constant bool ENABLE_UV3_ANIMATION_tmp = is_function_constant_defined(ENABLE_UV3_ANIMATION) ? ENABLE_UV3_ANIMATION : false;
constant bool ENABLE_UV3 [[function_constant(39)]];
constant bool ENABLE_UV3_tmp = is_function_constant_defined(ENABLE_UV3) ? ENABLE_UV3 : false;
constant bool SC_USE_CLAMP_TO_BORDER_baseTex [[function_constant(40)]];
constant bool SC_USE_CLAMP_TO_BORDER_baseTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_baseTex) ? SC_USE_CLAMP_TO_BORDER_baseTex : false;
constant bool SC_USE_CLAMP_TO_BORDER_detailNormalTex [[function_constant(41)]];
constant bool SC_USE_CLAMP_TO_BORDER_detailNormalTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_detailNormalTex) ? SC_USE_CLAMP_TO_BORDER_detailNormalTex : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(42)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_normalTex [[function_constant(43)]];
constant bool SC_USE_CLAMP_TO_BORDER_normalTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_normalTex) ? SC_USE_CLAMP_TO_BORDER_normalTex : false;
constant bool SC_USE_CLAMP_TO_BORDER_opacityTex [[function_constant(44)]];
constant bool SC_USE_CLAMP_TO_BORDER_opacityTex_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_opacityTex) ? SC_USE_CLAMP_TO_BORDER_opacityTex : false;
constant bool SC_USE_UV_MIN_MAX_baseTex [[function_constant(45)]];
constant bool SC_USE_UV_MIN_MAX_baseTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_baseTex) ? SC_USE_UV_MIN_MAX_baseTex : false;
constant bool SC_USE_UV_MIN_MAX_detailNormalTex [[function_constant(46)]];
constant bool SC_USE_UV_MIN_MAX_detailNormalTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_detailNormalTex) ? SC_USE_UV_MIN_MAX_detailNormalTex : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(47)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_normalTex [[function_constant(48)]];
constant bool SC_USE_UV_MIN_MAX_normalTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_normalTex) ? SC_USE_UV_MIN_MAX_normalTex : false;
constant bool SC_USE_UV_MIN_MAX_opacityTex [[function_constant(49)]];
constant bool SC_USE_UV_MIN_MAX_opacityTex_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_opacityTex) ? SC_USE_UV_MIN_MAX_opacityTex : false;
constant bool SC_USE_UV_TRANSFORM_baseTex [[function_constant(50)]];
constant bool SC_USE_UV_TRANSFORM_baseTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_baseTex) ? SC_USE_UV_TRANSFORM_baseTex : false;
constant bool SC_USE_UV_TRANSFORM_detailNormalTex [[function_constant(51)]];
constant bool SC_USE_UV_TRANSFORM_detailNormalTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_detailNormalTex) ? SC_USE_UV_TRANSFORM_detailNormalTex : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(52)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_normalTex [[function_constant(53)]];
constant bool SC_USE_UV_TRANSFORM_normalTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_normalTex) ? SC_USE_UV_TRANSFORM_normalTex : false;
constant bool SC_USE_UV_TRANSFORM_opacityTex [[function_constant(54)]];
constant bool SC_USE_UV_TRANSFORM_opacityTex_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_opacityTex) ? SC_USE_UV_TRANSFORM_opacityTex : false;
constant bool UseViewSpaceDepthVariant [[function_constant(55)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool baseTexHasSwappedViews [[function_constant(56)]];
constant bool baseTexHasSwappedViews_tmp = is_function_constant_defined(baseTexHasSwappedViews) ? baseTexHasSwappedViews : false;
constant bool detailNormalTexHasSwappedViews [[function_constant(57)]];
constant bool detailNormalTexHasSwappedViews_tmp = is_function_constant_defined(detailNormalTexHasSwappedViews) ? detailNormalTexHasSwappedViews : false;
constant bool intensityTextureHasSwappedViews [[function_constant(58)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool normalTexHasSwappedViews [[function_constant(59)]];
constant bool normalTexHasSwappedViews_tmp = is_function_constant_defined(normalTexHasSwappedViews) ? normalTexHasSwappedViews : false;
constant bool opacityTexHasSwappedViews [[function_constant(60)]];
constant bool opacityTexHasSwappedViews_tmp = is_function_constant_defined(opacityTexHasSwappedViews) ? opacityTexHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(61)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(62)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(63)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(64)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(65)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(66)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(67)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(68)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(69)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(70)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(71)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(72)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(73)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(74)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(75)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(76)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_EnvmapDiffuseHasSwappedViews [[function_constant(77)]];
constant bool sc_EnvmapDiffuseHasSwappedViews_tmp = is_function_constant_defined(sc_EnvmapDiffuseHasSwappedViews) ? sc_EnvmapDiffuseHasSwappedViews : false;
constant bool sc_EnvmapSpecularHasSwappedViews [[function_constant(78)]];
constant bool sc_EnvmapSpecularHasSwappedViews_tmp = is_function_constant_defined(sc_EnvmapSpecularHasSwappedViews) ? sc_EnvmapSpecularHasSwappedViews : false;
constant bool sc_FramebufferFetch [[function_constant(79)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_HasDiffuseEnvmap [[function_constant(80)]];
constant bool sc_HasDiffuseEnvmap_tmp = is_function_constant_defined(sc_HasDiffuseEnvmap) ? sc_HasDiffuseEnvmap : false;
constant bool sc_IsEditor [[function_constant(81)]];
constant bool sc_IsEditor_tmp = is_function_constant_defined(sc_IsEditor) ? sc_IsEditor : false;
constant bool sc_LightEstimation [[function_constant(82)]];
constant bool sc_LightEstimation_tmp = is_function_constant_defined(sc_LightEstimation) ? sc_LightEstimation : false;
constant bool sc_MotionVectorsPass [[function_constant(83)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(84)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(85)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(86)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(87)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(88)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(89)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RayTracingCasterForceOpaque [[function_constant(90)]];
constant bool sc_RayTracingCasterForceOpaque_tmp = is_function_constant_defined(sc_RayTracingCasterForceOpaque) ? sc_RayTracingCasterForceOpaque : false;
constant bool sc_RayTracingGlobalIlluminationHasSwappedViews [[function_constant(91)]];
constant bool sc_RayTracingGlobalIlluminationHasSwappedViews_tmp = is_function_constant_defined(sc_RayTracingGlobalIlluminationHasSwappedViews) ? sc_RayTracingGlobalIlluminationHasSwappedViews : false;
constant bool sc_RayTracingShadowsHasSwappedViews [[function_constant(92)]];
constant bool sc_RayTracingShadowsHasSwappedViews_tmp = is_function_constant_defined(sc_RayTracingShadowsHasSwappedViews) ? sc_RayTracingShadowsHasSwappedViews : false;
constant bool sc_RenderAlphaToColor [[function_constant(93)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_SSAOEnabled [[function_constant(94)]];
constant bool sc_SSAOEnabled_tmp = is_function_constant_defined(sc_SSAOEnabled) ? sc_SSAOEnabled : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(95)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(96)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(97)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(98)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(99)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int NODE_13_DROPLIST_ITEM [[function_constant(100)]];
constant int NODE_13_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_13_DROPLIST_ITEM) ? NODE_13_DROPLIST_ITEM : 0;
constant int NODE_181_DROPLIST_ITEM [[function_constant(101)]];
constant int NODE_181_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_181_DROPLIST_ITEM) ? NODE_181_DROPLIST_ITEM : 0;
constant int NODE_184_DROPLIST_ITEM [[function_constant(102)]];
constant int NODE_184_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_184_DROPLIST_ITEM) ? NODE_184_DROPLIST_ITEM : 0;
constant int NODE_27_DROPLIST_ITEM [[function_constant(103)]];
constant int NODE_27_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_27_DROPLIST_ITEM) ? NODE_27_DROPLIST_ITEM : 0;
constant int NODE_38_DROPLIST_ITEM [[function_constant(104)]];
constant int NODE_38_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_38_DROPLIST_ITEM) ? NODE_38_DROPLIST_ITEM : 0;
constant int NODE_49_DROPLIST_ITEM [[function_constant(105)]];
constant int NODE_49_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_49_DROPLIST_ITEM) ? NODE_49_DROPLIST_ITEM : 0;
constant int NODE_69_DROPLIST_ITEM [[function_constant(106)]];
constant int NODE_69_DROPLIST_ITEM_tmp = is_function_constant_defined(NODE_69_DROPLIST_ITEM) ? NODE_69_DROPLIST_ITEM : 0;
constant int SC_DEVICE_CLASS [[function_constant(107)]];
constant int SC_DEVICE_CLASS_tmp = is_function_constant_defined(SC_DEVICE_CLASS) ? SC_DEVICE_CLASS : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_baseTex [[function_constant(108)]];
constant int SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_baseTex) ? SC_SOFTWARE_WRAP_MODE_U_baseTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_detailNormalTex [[function_constant(109)]];
constant int SC_SOFTWARE_WRAP_MODE_U_detailNormalTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex) ? SC_SOFTWARE_WRAP_MODE_U_detailNormalTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(110)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_normalTex [[function_constant(111)]];
constant int SC_SOFTWARE_WRAP_MODE_U_normalTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_normalTex) ? SC_SOFTWARE_WRAP_MODE_U_normalTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_opacityTex [[function_constant(112)]];
constant int SC_SOFTWARE_WRAP_MODE_U_opacityTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_opacityTex) ? SC_SOFTWARE_WRAP_MODE_U_opacityTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_baseTex [[function_constant(113)]];
constant int SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_baseTex) ? SC_SOFTWARE_WRAP_MODE_V_baseTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_detailNormalTex [[function_constant(114)]];
constant int SC_SOFTWARE_WRAP_MODE_V_detailNormalTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_detailNormalTex) ? SC_SOFTWARE_WRAP_MODE_V_detailNormalTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(115)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_normalTex [[function_constant(116)]];
constant int SC_SOFTWARE_WRAP_MODE_V_normalTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_normalTex) ? SC_SOFTWARE_WRAP_MODE_V_normalTex : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_opacityTex [[function_constant(117)]];
constant int SC_SOFTWARE_WRAP_MODE_V_opacityTex_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_opacityTex) ? SC_SOFTWARE_WRAP_MODE_V_opacityTex : -1;
constant int baseTexLayout [[function_constant(118)]];
constant int baseTexLayout_tmp = is_function_constant_defined(baseTexLayout) ? baseTexLayout : 0;
constant int detailNormalTexLayout [[function_constant(119)]];
constant int detailNormalTexLayout_tmp = is_function_constant_defined(detailNormalTexLayout) ? detailNormalTexLayout : 0;
constant int intensityTextureLayout [[function_constant(120)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int normalTexLayout [[function_constant(121)]];
constant int normalTexLayout_tmp = is_function_constant_defined(normalTexLayout) ? normalTexLayout : 0;
constant int opacityTexLayout [[function_constant(122)]];
constant int opacityTexLayout_tmp = is_function_constant_defined(opacityTexLayout) ? opacityTexLayout : 0;
constant int sc_AmbientLightMode0 [[function_constant(123)]];
constant int sc_AmbientLightMode0_tmp = is_function_constant_defined(sc_AmbientLightMode0) ? sc_AmbientLightMode0 : 0;
constant int sc_AmbientLightMode1 [[function_constant(124)]];
constant int sc_AmbientLightMode1_tmp = is_function_constant_defined(sc_AmbientLightMode1) ? sc_AmbientLightMode1 : 0;
constant int sc_AmbientLightMode2 [[function_constant(125)]];
constant int sc_AmbientLightMode2_tmp = is_function_constant_defined(sc_AmbientLightMode2) ? sc_AmbientLightMode2 : 0;
constant int sc_AmbientLightMode_Constant [[function_constant(126)]];
constant int sc_AmbientLightMode_Constant_tmp = is_function_constant_defined(sc_AmbientLightMode_Constant) ? sc_AmbientLightMode_Constant : 0;
constant int sc_AmbientLightMode_EnvironmentMap [[function_constant(127)]];
constant int sc_AmbientLightMode_EnvironmentMap_tmp = is_function_constant_defined(sc_AmbientLightMode_EnvironmentMap) ? sc_AmbientLightMode_EnvironmentMap : 0;
constant int sc_AmbientLightMode_FromCamera [[function_constant(128)]];
constant int sc_AmbientLightMode_FromCamera_tmp = is_function_constant_defined(sc_AmbientLightMode_FromCamera) ? sc_AmbientLightMode_FromCamera : 0;
constant int sc_AmbientLightMode_SphericalHarmonics [[function_constant(129)]];
constant int sc_AmbientLightMode_SphericalHarmonics_tmp = is_function_constant_defined(sc_AmbientLightMode_SphericalHarmonics) ? sc_AmbientLightMode_SphericalHarmonics : 0;
constant int sc_AmbientLightsCount [[function_constant(130)]];
constant int sc_AmbientLightsCount_tmp = is_function_constant_defined(sc_AmbientLightsCount) ? sc_AmbientLightsCount : 0;
constant int sc_DepthBufferMode [[function_constant(131)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_DirectionalLightsCount [[function_constant(132)]];
constant int sc_DirectionalLightsCount_tmp = is_function_constant_defined(sc_DirectionalLightsCount) ? sc_DirectionalLightsCount : 0;
constant int sc_EnvLightMode [[function_constant(133)]];
constant int sc_EnvLightMode_tmp = is_function_constant_defined(sc_EnvLightMode) ? sc_EnvLightMode : 0;
constant int sc_EnvmapDiffuseLayout [[function_constant(134)]];
constant int sc_EnvmapDiffuseLayout_tmp = is_function_constant_defined(sc_EnvmapDiffuseLayout) ? sc_EnvmapDiffuseLayout : 0;
constant int sc_EnvmapSpecularLayout [[function_constant(135)]];
constant int sc_EnvmapSpecularLayout_tmp = is_function_constant_defined(sc_EnvmapSpecularLayout) ? sc_EnvmapSpecularLayout : 0;
constant int sc_LightEstimationSGCount [[function_constant(136)]];
constant int sc_LightEstimationSGCount_tmp = is_function_constant_defined(sc_LightEstimationSGCount) ? sc_LightEstimationSGCount : 0;
constant int sc_PointLightsCount [[function_constant(137)]];
constant int sc_PointLightsCount_tmp = is_function_constant_defined(sc_PointLightsCount) ? sc_PointLightsCount : 0;
constant int sc_RayTracingGlobalIlluminationLayout [[function_constant(138)]];
constant int sc_RayTracingGlobalIlluminationLayout_tmp = is_function_constant_defined(sc_RayTracingGlobalIlluminationLayout) ? sc_RayTracingGlobalIlluminationLayout : 0;
constant int sc_RayTracingShadowsLayout [[function_constant(139)]];
constant int sc_RayTracingShadowsLayout_tmp = is_function_constant_defined(sc_RayTracingShadowsLayout) ? sc_RayTracingShadowsLayout : 0;
constant int sc_RenderingSpace [[function_constant(140)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(141)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(142)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(143)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(144)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(145)]];
constant int sc_StereoRendering_IsClipDistanceEnabled_tmp = is_function_constant_defined(sc_StereoRendering_IsClipDistanceEnabled) ? sc_StereoRendering_IsClipDistanceEnabled : 0;

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
float3 recolorRed;
float4 Tweak_N81;
float4 baseColor;
float4 baseTexSize;
float4 baseTexDims;
float4 baseTexView;
float3x3 baseTexTransform;
float4 baseTexUvMinMax;
float4 baseTexBorderColor;
float2 uv2Scale;
float2 uv2Offset;
float2 uv3Scale;
float2 uv3Offset;
float3 recolorGreen;
float3 recolorBlue;
float4 opacityTexSize;
float4 opacityTexDims;
float4 opacityTexView;
float3x3 opacityTexTransform;
float4 opacityTexUvMinMax;
float4 opacityTexBorderColor;
float4 normalTexSize;
float4 normalTexDims;
float4 normalTexView;
float3x3 normalTexTransform;
float4 normalTexUvMinMax;
float4 normalTexBorderColor;
float4 detailNormalTexSize;
float4 detailNormalTexDims;
float4 detailNormalTexView;
float3x3 detailNormalTexTransform;
float4 detailNormalTexUvMinMax;
float4 detailNormalTexBorderColor;
float colorMultiplier;
float4 Port_Import_N042;
float Port_Input1_N044;
float Port_Import_N088;
float3 Port_Import_N089;
float Port_Position1_N078;
float4 Port_Import_N384;
float Port_Import_N307;
float Port_Import_N201;
float Port_Import_N012;
float Port_Import_N010;
float Port_Import_N007;
float2 Port_Import_N008;
float2 Port_Import_N009;
float Port_Speed_N022;
float2 Port_Import_N254;
float Port_Import_N065;
float Port_Import_N055;
float Port_Import_N056;
float2 Port_Import_N000;
float2 Port_Import_N060;
float2 Port_Import_N061;
float Port_Speed_N063;
float2 Port_Import_N255;
float4 Port_Default_N369;
float4 Port_Import_N092;
float3 Port_Import_N090;
float3 Port_Import_N091;
float3 Port_Import_N144;
float Port_Value2_N073;
float4 Port_Import_N166;
float Port_Import_N206;
float Port_Import_N043;
float2 Port_Import_N151;
float2 Port_Import_N155;
float Port_Default_N204;
float Port_Import_N047;
float Port_Input1_N002;
float Port_Input2_N072;
float Port_Import_N336;
float Port_Import_N160;
float2 Port_Import_N167;
float2 Port_Import_N207;
float Port_Strength1_N200;
float Port_Import_N095;
float Port_Import_N108;
float3 Port_Default_N113;
float Port_Strength2_N200;
float3 Port_Emissive_N036;
float3 Port_AO_N036;
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
texture2d<float> baseTex [[id(4)]];
texture2d<float> detailNormalTex [[id(5)]];
texture2d<float> intensityTexture [[id(6)]];
texture2d<float> normalTex [[id(7)]];
texture2d<float> opacityTex [[id(8)]];
texture2d<float> sc_EnvmapDiffuse [[id(9)]];
texture2d<float> sc_EnvmapSpecular [[id(10)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(19)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(20)]];
texture2d<float> sc_RayTracingRayDirection [[id(21)]];
texture2d<float> sc_RayTracingShadows [[id(23)]];
texture2d<float> sc_SSAOTexture [[id(24)]];
texture2d<float> sc_ScreenTexture [[id(25)]];
texture2d<float> sc_ShadowTexture [[id(26)]];
sampler baseTexSmpSC [[id(28)]];
sampler detailNormalTexSmpSC [[id(29)]];
sampler intensityTextureSmpSC [[id(30)]];
sampler normalTexSmpSC [[id(31)]];
sampler opacityTexSmpSC [[id(32)]];
sampler sc_EnvmapDiffuseSmpSC [[id(33)]];
sampler sc_EnvmapSpecularSmpSC [[id(34)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(36)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(37)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(38)]];
sampler sc_RayTracingShadowsSmpSC [[id(40)]];
sampler sc_SSAOTextureSmpSC [[id(41)]];
sampler sc_ScreenTextureSmpSC [[id(42)]];
sampler sc_ShadowTextureSmpSC [[id(43)]];
constant userUniformsObj* UserUniforms [[id(45)]];
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
float4 VertexColor;
float2 Surface_UVCoord0;
float2 Surface_UVCoord1;
float2 gScreenCoord;
float3 VertexTangent_WorldSpace;
float3 VertexNormal_WorldSpace;
float3 VertexBinormal_WorldSpace;
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
float3 recolorRed;
float4 Tweak_N81;
float4 baseColor;
float4 baseTexSize;
float4 baseTexDims;
float4 baseTexView;
float3x3 baseTexTransform;
float4 baseTexUvMinMax;
float4 baseTexBorderColor;
float2 uv2Scale;
float2 uv2Offset;
float2 uv3Scale;
float2 uv3Offset;
float3 recolorGreen;
float3 recolorBlue;
float4 opacityTexSize;
float4 opacityTexDims;
float4 opacityTexView;
float3x3 opacityTexTransform;
float4 opacityTexUvMinMax;
float4 opacityTexBorderColor;
float4 normalTexSize;
float4 normalTexDims;
float4 normalTexView;
float3x3 normalTexTransform;
float4 normalTexUvMinMax;
float4 normalTexBorderColor;
float4 detailNormalTexSize;
float4 detailNormalTexDims;
float4 detailNormalTexView;
float3x3 detailNormalTexTransform;
float4 detailNormalTexUvMinMax;
float4 detailNormalTexBorderColor;
float colorMultiplier;
float4 Port_Import_N042;
float Port_Input1_N044;
float Port_Import_N088;
float3 Port_Import_N089;
float Port_Position1_N078;
float4 Port_Import_N384;
float Port_Import_N307;
float Port_Import_N201;
float Port_Import_N012;
float Port_Import_N010;
float Port_Import_N007;
float2 Port_Import_N008;
float2 Port_Import_N009;
float Port_Speed_N022;
float2 Port_Import_N254;
float Port_Import_N065;
float Port_Import_N055;
float Port_Import_N056;
float2 Port_Import_N000;
float2 Port_Import_N060;
float2 Port_Import_N061;
float Port_Speed_N063;
float2 Port_Import_N255;
float4 Port_Default_N369;
float4 Port_Import_N092;
float3 Port_Import_N090;
float3 Port_Import_N091;
float3 Port_Import_N144;
float Port_Value2_N073;
float4 Port_Import_N166;
float Port_Import_N206;
float Port_Import_N043;
float2 Port_Import_N151;
float2 Port_Import_N155;
float Port_Default_N204;
float Port_Import_N047;
float Port_Input1_N002;
float Port_Input2_N072;
float Port_Import_N336;
float Port_Import_N160;
float2 Port_Import_N167;
float2 Port_Import_N207;
float Port_Strength1_N200;
float Port_Import_N095;
float Port_Import_N108;
float3 Port_Default_N113;
float Port_Strength2_N200;
float3 Port_Emissive_N036;
float3 Port_AO_N036;
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
texture2d<float> baseTex [[id(4)]];
texture2d<float> detailNormalTex [[id(5)]];
texture2d<float> intensityTexture [[id(6)]];
texture2d<float> normalTex [[id(7)]];
texture2d<float> opacityTex [[id(8)]];
texture2d<float> sc_EnvmapDiffuse [[id(9)]];
texture2d<float> sc_EnvmapSpecular [[id(10)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(19)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(20)]];
texture2d<float> sc_RayTracingRayDirection [[id(21)]];
texture2d<float> sc_RayTracingShadows [[id(23)]];
texture2d<float> sc_SSAOTexture [[id(24)]];
texture2d<float> sc_ScreenTexture [[id(25)]];
texture2d<float> sc_ShadowTexture [[id(26)]];
sampler baseTexSmpSC [[id(28)]];
sampler detailNormalTexSmpSC [[id(29)]];
sampler intensityTextureSmpSC [[id(30)]];
sampler normalTexSmpSC [[id(31)]];
sampler opacityTexSmpSC [[id(32)]];
sampler sc_EnvmapDiffuseSmpSC [[id(33)]];
sampler sc_EnvmapSpecularSmpSC [[id(34)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(36)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(37)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(38)]];
sampler sc_RayTracingShadowsSmpSC [[id(40)]];
sampler sc_SSAOTextureSmpSC [[id(41)]];
sampler sc_ScreenTextureSmpSC [[id(42)]];
sampler sc_ShadowTextureSmpSC [[id(43)]];
constant userUniformsObj* UserUniforms [[id(45)]];
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
float4 ngsCalculateLighting(thread const float3& albedo,thread const float& opacity,thread const float3& normal,thread const float3& position,thread const float3& viewDir,thread const float3& emissive,thread const float& metallic,thread const float& roughness,thread const float3& ao,thread const float3& specularAO,thread int& varStereoViewID,thread texture2d<float> sc_EnvmapDiffuse,thread sampler sc_EnvmapDiffuseSmpSC,thread texture2d<float> sc_EnvmapSpecular,thread sampler sc_EnvmapSpecularSmpSC,thread texture2d<float> sc_ScreenTexture,thread sampler sc_ScreenTextureSmpSC,thread texture2d<float> sc_RayTracingGlobalIllumination,thread sampler sc_RayTracingGlobalIlluminationSmpSC,thread texture2d<float> sc_RayTracingShadows,thread sampler sc_RayTracingShadowsSmpSC,thread float4& gl_FragCoord,constant userUniformsObj& UserUniforms,thread float2& varShadowTex,thread texture2d<float> sc_ShadowTexture,thread sampler sc_ShadowTextureSmpSC,thread float4& sc_FragData0,thread texture2d<float> sc_SSAOTexture,thread sampler sc_SSAOTextureSmpSC)
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
l9_12.directSpecular=float3(0.0);
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
LightingComponents l9_270=l9_12;
LightingComponents lighting=l9_270;
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
lighting.directDiffuse=float3(0.0);
lighting.indirectDiffuse=float3(0.0);
float4 l9_271=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_272=sc_FragData0;
l9_271=l9_272;
}
else
{
float4 l9_273=gl_FragCoord;
float2 l9_274=l9_273.xy*UserUniforms.sc_CurrentRenderTargetDims.zw;
float2 l9_275=l9_274;
float2 l9_276=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_277=1;
int l9_278=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_278=0;
}
else
{
l9_278=varStereoViewID;
}
int l9_279=l9_278;
int l9_280=l9_279;
float3 l9_281=float3(l9_275,0.0);
int l9_282=l9_277;
int l9_283=l9_280;
if (l9_282==1)
{
l9_281.y=((2.0*l9_281.y)+float(l9_283))-1.0;
}
float2 l9_284=l9_281.xy;
l9_276=l9_284;
}
else
{
l9_276=l9_275;
}
float2 l9_285=l9_276;
float2 l9_286=l9_285;
float2 l9_287=l9_286;
float2 l9_288=l9_287;
float l9_289=0.0;
int l9_290;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_291=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_291=0;
}
else
{
l9_291=varStereoViewID;
}
int l9_292=l9_291;
l9_290=1-l9_292;
}
else
{
int l9_293=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_293=0;
}
else
{
l9_293=varStereoViewID;
}
int l9_294=l9_293;
l9_290=l9_294;
}
int l9_295=l9_290;
float2 l9_296=l9_288;
int l9_297=sc_ScreenTextureLayout_tmp;
int l9_298=l9_295;
float l9_299=l9_289;
float2 l9_300=l9_296;
int l9_301=l9_297;
int l9_302=l9_298;
float3 l9_303=float3(0.0);
if (l9_301==0)
{
l9_303=float3(l9_300,0.0);
}
else
{
if (l9_301==1)
{
l9_303=float3(l9_300.x,(l9_300.y*0.5)+(0.5-(float(l9_302)*0.5)),0.0);
}
else
{
l9_303=float3(l9_300,float(l9_302));
}
}
float3 l9_304=l9_303;
float3 l9_305=l9_304;
float4 l9_306=sc_ScreenTexture.sample(sc_ScreenTextureSmpSC,l9_305.xy,bias(l9_299));
float4 l9_307=l9_306;
float4 l9_308=l9_307;
l9_271=l9_308;
}
float4 l9_309=l9_271;
float3 param_5=l9_309.xyz;
float3 l9_310;
if (SC_DEVICE_CLASS_tmp>=2)
{
l9_310=float3(pow(param_5.x,2.2),pow(param_5.y,2.2),pow(param_5.z,2.2));
}
else
{
l9_310=param_5*param_5;
}
float3 l9_311=l9_310;
float3 framebuffer=l9_311;
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
float3 l9_312=param_6.albedo*(param_7.directDiffuse+(param_7.indirectDiffuse*param_6.ao));
float3 l9_313=param_7.directSpecular+(param_7.indirectSpecular*param_6.specularAo);
float3 l9_314=param_6.emissive;
float3 l9_315=param_7.transmitted;
if (param_8)
{
float l9_316=param_6.opacity;
l9_312*=srgbToLinear(l9_316);
}
float3 l9_317=((l9_312+l9_313)+l9_314)+l9_315;
float3 l9_318=l9_317;
float4 Output=float4(l9_318,surfaceProperties.opacity);
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
float l9_319=1.8;
float l9_320=1.4;
float l9_321=0.5;
float l9_322=1.5;
float3 l9_323=(param_9*((param_9*l9_319)+float3(l9_320)))/((param_9*((param_9*l9_319)+float3(l9_321)))+float3(l9_322));
Output=float4(l9_323.x,l9_323.y,l9_323.z,Output.w);
}
float3 param_10=Output.xyz;
float l9_324=param_10.x;
float l9_325=param_10.y;
float l9_326=param_10.z;
float3 l9_327=float3(linearToSrgb(l9_324),linearToSrgb(l9_325),linearToSrgb(l9_326));
Output=float4(l9_327.x,l9_327.y,l9_327.z,Output.w);
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
Globals.VertexColor=rhp.color;
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
Globals.VertexTangent_WorldSpace=rhp.tangentWS.xyz;
Globals.VertexNormal_WorldSpace=rhp.normalWS;
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*rhp.tangentWS.w;
}
else
{
Globals.BumpedNormal=float3(0.0);
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-in.varPosAndMotion.xyz);
Globals.PositionWS=in.varPosAndMotion.xyz;
Globals.VertexColor=in.varColor;
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
Globals.VertexTangent_WorldSpace=normalize(in.varTangent.xyz);
Globals.VertexNormal_WorldSpace=normalize(in.varNormalAndMotion.xyz);
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*in.varTangent.w;
}
float4 Result_N363=float4(0.0);
float4 param_1=float4(0.0);
float4 param_2=float4(0.0);
ssGlobals param_4=Globals;
float4 param_3;
if (NODE_38_DROPLIST_ITEM_tmp==1)
{
float4 l9_17=float4(0.0);
l9_17=param_4.VertexColor;
float3 l9_18=float3(0.0);
float3 l9_19=float3(0.0);
float3 l9_20=float3(0.0);
ssGlobals l9_21=param_4;
float3 l9_22;
if ((int(ENABLE_RECOLOR_tmp)!=0))
{
float3 l9_23=float3(0.0);
float3 l9_24=(*sc_set0.UserUniforms).recolorRed;
l9_23=l9_24;
float3 l9_25=float3(0.0);
l9_25=l9_23;
float2 l9_26=float2(0.0);
l9_26=l9_21.Surface_UVCoord0;
float l9_27=0.0;
float4 l9_28=float4(l9_26,0.0,0.0);
float l9_29=l9_28.y;
l9_27=l9_29;
float4 l9_30=float4(0.0);
float4 l9_31=(*sc_set0.UserUniforms).Tweak_N81;
l9_30=l9_31;
float4 l9_32=float4(0.0);
float4 l9_33=(*sc_set0.UserUniforms).baseColor;
l9_32=l9_33;
float4 l9_34=float4(0.0);
float l9_35=l9_27;
float4 l9_36=l9_30;
float l9_37=(*sc_set0.UserUniforms).Port_Position1_N078;
float4 l9_38=l9_30;
float4 l9_39=l9_32;
l9_35=fast::clamp(l9_35,0.0,1.0);
float4 l9_40;
if (l9_35<l9_37)
{
l9_40=mix(l9_36,l9_38,float4(fast::clamp(l9_35/l9_37,0.0,1.0)));
}
else
{
l9_40=mix(l9_38,l9_39,float4(fast::clamp((l9_35-l9_37)/(1.0-l9_37),0.0,1.0)));
}
bool l9_41=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_42;
if (l9_41)
{
l9_42=!PreviewInfo.Saved;
}
else
{
l9_42=l9_41;
}
bool l9_43;
if (l9_42)
{
l9_43=78==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_43=l9_42;
}
if (l9_43)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_40;
PreviewInfo.Color.w=1.0;
}
l9_34=l9_40;
float4 l9_44=float4(0.0);
l9_44=l9_34;
float4 l9_45=float4(0.0);
float4 l9_46=float4(0.0);
float4 l9_47=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals l9_48=l9_21;
float4 l9_49;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_50=float2(0.0);
float2 l9_51=float2(0.0);
float2 l9_52=float2(0.0);
float2 l9_53=float2(0.0);
float2 l9_54=float2(0.0);
float2 l9_55=float2(0.0);
ssGlobals l9_56=l9_48;
float2 l9_57;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_58=float2(0.0);
l9_58=l9_56.Surface_UVCoord0;
l9_51=l9_58;
l9_57=l9_51;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_59=float2(0.0);
l9_59=l9_56.Surface_UVCoord1;
l9_52=l9_59;
l9_57=l9_52;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_60=float2(0.0);
float2 l9_61=float2(0.0);
float2 l9_62=float2(0.0);
ssGlobals l9_63=l9_56;
float2 l9_64;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_65=float2(0.0);
float2 l9_66=float2(0.0);
float2 l9_67=float2(0.0);
ssGlobals l9_68=l9_63;
float2 l9_69;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_70=float2(0.0);
float2 l9_71=float2(0.0);
float2 l9_72=float2(0.0);
float2 l9_73=float2(0.0);
float2 l9_74=float2(0.0);
ssGlobals l9_75=l9_68;
float2 l9_76;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_77=float2(0.0);
l9_77=l9_75.Surface_UVCoord0;
l9_71=l9_77;
l9_76=l9_71;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_78=float2(0.0);
l9_78=l9_75.Surface_UVCoord1;
l9_72=l9_78;
l9_76=l9_72;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_79=float2(0.0);
l9_79=l9_75.gScreenCoord;
l9_73=l9_79;
l9_76=l9_73;
}
else
{
float2 l9_80=float2(0.0);
l9_80=l9_75.Surface_UVCoord0;
l9_74=l9_80;
l9_76=l9_74;
}
}
}
l9_70=l9_76;
float2 l9_81=float2(0.0);
float2 l9_82=(*sc_set0.UserUniforms).uv2Scale;
l9_81=l9_82;
float2 l9_83=float2(0.0);
l9_83=l9_81;
float2 l9_84=float2(0.0);
float2 l9_85=(*sc_set0.UserUniforms).uv2Offset;
l9_84=l9_85;
float2 l9_86=float2(0.0);
l9_86=l9_84;
float2 l9_87=float2(0.0);
l9_87=(l9_70*l9_83)+l9_86;
float2 l9_88=float2(0.0);
l9_88=l9_87+(l9_86*(l9_68.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_66=l9_88;
l9_69=l9_66;
}
else
{
float2 l9_89=float2(0.0);
float2 l9_90=float2(0.0);
float2 l9_91=float2(0.0);
float2 l9_92=float2(0.0);
float2 l9_93=float2(0.0);
ssGlobals l9_94=l9_68;
float2 l9_95;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_96=float2(0.0);
l9_96=l9_94.Surface_UVCoord0;
l9_90=l9_96;
l9_95=l9_90;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_97=float2(0.0);
l9_97=l9_94.Surface_UVCoord1;
l9_91=l9_97;
l9_95=l9_91;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_98=float2(0.0);
l9_98=l9_94.gScreenCoord;
l9_92=l9_98;
l9_95=l9_92;
}
else
{
float2 l9_99=float2(0.0);
l9_99=l9_94.Surface_UVCoord0;
l9_93=l9_99;
l9_95=l9_93;
}
}
}
l9_89=l9_95;
float2 l9_100=float2(0.0);
float2 l9_101=(*sc_set0.UserUniforms).uv2Scale;
l9_100=l9_101;
float2 l9_102=float2(0.0);
l9_102=l9_100;
float2 l9_103=float2(0.0);
float2 l9_104=(*sc_set0.UserUniforms).uv2Offset;
l9_103=l9_104;
float2 l9_105=float2(0.0);
l9_105=l9_103;
float2 l9_106=float2(0.0);
l9_106=(l9_89*l9_102)+l9_105;
l9_67=l9_106;
l9_69=l9_67;
}
l9_65=l9_69;
l9_61=l9_65;
l9_64=l9_61;
}
else
{
float2 l9_107=float2(0.0);
l9_107=l9_63.Surface_UVCoord0;
l9_62=l9_107;
l9_64=l9_62;
}
l9_60=l9_64;
float2 l9_108=float2(0.0);
l9_108=l9_60;
float2 l9_109=float2(0.0);
l9_109=l9_108;
l9_53=l9_109;
l9_57=l9_53;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_110=float2(0.0);
float2 l9_111=float2(0.0);
float2 l9_112=float2(0.0);
ssGlobals l9_113=l9_56;
float2 l9_114;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_115=float2(0.0);
float2 l9_116=float2(0.0);
float2 l9_117=float2(0.0);
ssGlobals l9_118=l9_113;
float2 l9_119;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_120=float2(0.0);
float2 l9_121=float2(0.0);
float2 l9_122=float2(0.0);
float2 l9_123=float2(0.0);
float2 l9_124=float2(0.0);
float2 l9_125=float2(0.0);
ssGlobals l9_126=l9_118;
float2 l9_127;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_128=float2(0.0);
l9_128=l9_126.Surface_UVCoord0;
l9_121=l9_128;
l9_127=l9_121;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_129=float2(0.0);
l9_129=l9_126.Surface_UVCoord1;
l9_122=l9_129;
l9_127=l9_122;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_130=float2(0.0);
l9_130=l9_126.gScreenCoord;
l9_123=l9_130;
l9_127=l9_123;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_131=float2(0.0);
float2 l9_132=float2(0.0);
float2 l9_133=float2(0.0);
ssGlobals l9_134=l9_126;
float2 l9_135;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_136=float2(0.0);
float2 l9_137=float2(0.0);
float2 l9_138=float2(0.0);
ssGlobals l9_139=l9_134;
float2 l9_140;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_141=float2(0.0);
float2 l9_142=float2(0.0);
float2 l9_143=float2(0.0);
float2 l9_144=float2(0.0);
float2 l9_145=float2(0.0);
ssGlobals l9_146=l9_139;
float2 l9_147;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_148=float2(0.0);
l9_148=l9_146.Surface_UVCoord0;
l9_142=l9_148;
l9_147=l9_142;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_149=float2(0.0);
l9_149=l9_146.Surface_UVCoord1;
l9_143=l9_149;
l9_147=l9_143;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_150=float2(0.0);
l9_150=l9_146.gScreenCoord;
l9_144=l9_150;
l9_147=l9_144;
}
else
{
float2 l9_151=float2(0.0);
l9_151=l9_146.Surface_UVCoord0;
l9_145=l9_151;
l9_147=l9_145;
}
}
}
l9_141=l9_147;
float2 l9_152=float2(0.0);
float2 l9_153=(*sc_set0.UserUniforms).uv2Scale;
l9_152=l9_153;
float2 l9_154=float2(0.0);
l9_154=l9_152;
float2 l9_155=float2(0.0);
float2 l9_156=(*sc_set0.UserUniforms).uv2Offset;
l9_155=l9_156;
float2 l9_157=float2(0.0);
l9_157=l9_155;
float2 l9_158=float2(0.0);
l9_158=(l9_141*l9_154)+l9_157;
float2 l9_159=float2(0.0);
l9_159=l9_158+(l9_157*(l9_139.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_137=l9_159;
l9_140=l9_137;
}
else
{
float2 l9_160=float2(0.0);
float2 l9_161=float2(0.0);
float2 l9_162=float2(0.0);
float2 l9_163=float2(0.0);
float2 l9_164=float2(0.0);
ssGlobals l9_165=l9_139;
float2 l9_166;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_167=float2(0.0);
l9_167=l9_165.Surface_UVCoord0;
l9_161=l9_167;
l9_166=l9_161;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_168=float2(0.0);
l9_168=l9_165.Surface_UVCoord1;
l9_162=l9_168;
l9_166=l9_162;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_169=float2(0.0);
l9_169=l9_165.gScreenCoord;
l9_163=l9_169;
l9_166=l9_163;
}
else
{
float2 l9_170=float2(0.0);
l9_170=l9_165.Surface_UVCoord0;
l9_164=l9_170;
l9_166=l9_164;
}
}
}
l9_160=l9_166;
float2 l9_171=float2(0.0);
float2 l9_172=(*sc_set0.UserUniforms).uv2Scale;
l9_171=l9_172;
float2 l9_173=float2(0.0);
l9_173=l9_171;
float2 l9_174=float2(0.0);
float2 l9_175=(*sc_set0.UserUniforms).uv2Offset;
l9_174=l9_175;
float2 l9_176=float2(0.0);
l9_176=l9_174;
float2 l9_177=float2(0.0);
l9_177=(l9_160*l9_173)+l9_176;
l9_138=l9_177;
l9_140=l9_138;
}
l9_136=l9_140;
l9_132=l9_136;
l9_135=l9_132;
}
else
{
float2 l9_178=float2(0.0);
l9_178=l9_134.Surface_UVCoord0;
l9_133=l9_178;
l9_135=l9_133;
}
l9_131=l9_135;
float2 l9_179=float2(0.0);
l9_179=l9_131;
float2 l9_180=float2(0.0);
l9_180=l9_179;
l9_124=l9_180;
l9_127=l9_124;
}
else
{
float2 l9_181=float2(0.0);
l9_181=l9_126.Surface_UVCoord0;
l9_125=l9_181;
l9_127=l9_125;
}
}
}
}
l9_120=l9_127;
float2 l9_182=float2(0.0);
float2 l9_183=(*sc_set0.UserUniforms).uv3Scale;
l9_182=l9_183;
float2 l9_184=float2(0.0);
l9_184=l9_182;
float2 l9_185=float2(0.0);
float2 l9_186=(*sc_set0.UserUniforms).uv3Offset;
l9_185=l9_186;
float2 l9_187=float2(0.0);
l9_187=l9_185;
float2 l9_188=float2(0.0);
l9_188=(l9_120*l9_184)+l9_187;
float2 l9_189=float2(0.0);
l9_189=l9_188+(l9_187*(l9_118.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_116=l9_189;
l9_119=l9_116;
}
else
{
float2 l9_190=float2(0.0);
float2 l9_191=float2(0.0);
float2 l9_192=float2(0.0);
float2 l9_193=float2(0.0);
float2 l9_194=float2(0.0);
float2 l9_195=float2(0.0);
ssGlobals l9_196=l9_118;
float2 l9_197;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_198=float2(0.0);
l9_198=l9_196.Surface_UVCoord0;
l9_191=l9_198;
l9_197=l9_191;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_199=float2(0.0);
l9_199=l9_196.Surface_UVCoord1;
l9_192=l9_199;
l9_197=l9_192;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_200=float2(0.0);
l9_200=l9_196.gScreenCoord;
l9_193=l9_200;
l9_197=l9_193;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_201=float2(0.0);
float2 l9_202=float2(0.0);
float2 l9_203=float2(0.0);
ssGlobals l9_204=l9_196;
float2 l9_205;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_206=float2(0.0);
float2 l9_207=float2(0.0);
float2 l9_208=float2(0.0);
ssGlobals l9_209=l9_204;
float2 l9_210;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_211=float2(0.0);
float2 l9_212=float2(0.0);
float2 l9_213=float2(0.0);
float2 l9_214=float2(0.0);
float2 l9_215=float2(0.0);
ssGlobals l9_216=l9_209;
float2 l9_217;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_218=float2(0.0);
l9_218=l9_216.Surface_UVCoord0;
l9_212=l9_218;
l9_217=l9_212;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_219=float2(0.0);
l9_219=l9_216.Surface_UVCoord1;
l9_213=l9_219;
l9_217=l9_213;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_220=float2(0.0);
l9_220=l9_216.gScreenCoord;
l9_214=l9_220;
l9_217=l9_214;
}
else
{
float2 l9_221=float2(0.0);
l9_221=l9_216.Surface_UVCoord0;
l9_215=l9_221;
l9_217=l9_215;
}
}
}
l9_211=l9_217;
float2 l9_222=float2(0.0);
float2 l9_223=(*sc_set0.UserUniforms).uv2Scale;
l9_222=l9_223;
float2 l9_224=float2(0.0);
l9_224=l9_222;
float2 l9_225=float2(0.0);
float2 l9_226=(*sc_set0.UserUniforms).uv2Offset;
l9_225=l9_226;
float2 l9_227=float2(0.0);
l9_227=l9_225;
float2 l9_228=float2(0.0);
l9_228=(l9_211*l9_224)+l9_227;
float2 l9_229=float2(0.0);
l9_229=l9_228+(l9_227*(l9_209.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_207=l9_229;
l9_210=l9_207;
}
else
{
float2 l9_230=float2(0.0);
float2 l9_231=float2(0.0);
float2 l9_232=float2(0.0);
float2 l9_233=float2(0.0);
float2 l9_234=float2(0.0);
ssGlobals l9_235=l9_209;
float2 l9_236;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_237=float2(0.0);
l9_237=l9_235.Surface_UVCoord0;
l9_231=l9_237;
l9_236=l9_231;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_238=float2(0.0);
l9_238=l9_235.Surface_UVCoord1;
l9_232=l9_238;
l9_236=l9_232;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_239=float2(0.0);
l9_239=l9_235.gScreenCoord;
l9_233=l9_239;
l9_236=l9_233;
}
else
{
float2 l9_240=float2(0.0);
l9_240=l9_235.Surface_UVCoord0;
l9_234=l9_240;
l9_236=l9_234;
}
}
}
l9_230=l9_236;
float2 l9_241=float2(0.0);
float2 l9_242=(*sc_set0.UserUniforms).uv2Scale;
l9_241=l9_242;
float2 l9_243=float2(0.0);
l9_243=l9_241;
float2 l9_244=float2(0.0);
float2 l9_245=(*sc_set0.UserUniforms).uv2Offset;
l9_244=l9_245;
float2 l9_246=float2(0.0);
l9_246=l9_244;
float2 l9_247=float2(0.0);
l9_247=(l9_230*l9_243)+l9_246;
l9_208=l9_247;
l9_210=l9_208;
}
l9_206=l9_210;
l9_202=l9_206;
l9_205=l9_202;
}
else
{
float2 l9_248=float2(0.0);
l9_248=l9_204.Surface_UVCoord0;
l9_203=l9_248;
l9_205=l9_203;
}
l9_201=l9_205;
float2 l9_249=float2(0.0);
l9_249=l9_201;
float2 l9_250=float2(0.0);
l9_250=l9_249;
l9_194=l9_250;
l9_197=l9_194;
}
else
{
float2 l9_251=float2(0.0);
l9_251=l9_196.Surface_UVCoord0;
l9_195=l9_251;
l9_197=l9_195;
}
}
}
}
l9_190=l9_197;
float2 l9_252=float2(0.0);
float2 l9_253=(*sc_set0.UserUniforms).uv3Scale;
l9_252=l9_253;
float2 l9_254=float2(0.0);
l9_254=l9_252;
float2 l9_255=float2(0.0);
float2 l9_256=(*sc_set0.UserUniforms).uv3Offset;
l9_255=l9_256;
float2 l9_257=float2(0.0);
l9_257=l9_255;
float2 l9_258=float2(0.0);
l9_258=(l9_190*l9_254)+l9_257;
l9_117=l9_258;
l9_119=l9_117;
}
l9_115=l9_119;
l9_111=l9_115;
l9_114=l9_111;
}
else
{
float2 l9_259=float2(0.0);
l9_259=l9_113.Surface_UVCoord0;
l9_112=l9_259;
l9_114=l9_112;
}
l9_110=l9_114;
float2 l9_260=float2(0.0);
l9_260=l9_110;
float2 l9_261=float2(0.0);
l9_261=l9_260;
l9_54=l9_261;
l9_57=l9_54;
}
else
{
float2 l9_262=float2(0.0);
l9_262=l9_56.Surface_UVCoord0;
l9_55=l9_262;
l9_57=l9_55;
}
}
}
}
l9_50=l9_57;
float4 l9_263=float4(0.0);
int l9_264;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_265=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_265=0;
}
else
{
l9_265=in.varStereoViewID;
}
int l9_266=l9_265;
l9_264=1-l9_266;
}
else
{
int l9_267=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_267=0;
}
else
{
l9_267=in.varStereoViewID;
}
int l9_268=l9_267;
l9_264=l9_268;
}
int l9_269=l9_264;
int l9_270=baseTexLayout_tmp;
int l9_271=l9_269;
float2 l9_272=l9_50;
bool l9_273=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_274=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_275=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_276=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_277=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_278=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_279=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_280=0.0;
bool l9_281=l9_278&&(!l9_276);
float l9_282=1.0;
float l9_283=l9_272.x;
int l9_284=l9_275.x;
if (l9_284==1)
{
l9_283=fract(l9_283);
}
else
{
if (l9_284==2)
{
float l9_285=fract(l9_283);
float l9_286=l9_283-l9_285;
float l9_287=step(0.25,fract(l9_286*0.5));
l9_283=mix(l9_285,1.0-l9_285,fast::clamp(l9_287,0.0,1.0));
}
}
l9_272.x=l9_283;
float l9_288=l9_272.y;
int l9_289=l9_275.y;
if (l9_289==1)
{
l9_288=fract(l9_288);
}
else
{
if (l9_289==2)
{
float l9_290=fract(l9_288);
float l9_291=l9_288-l9_290;
float l9_292=step(0.25,fract(l9_291*0.5));
l9_288=mix(l9_290,1.0-l9_290,fast::clamp(l9_292,0.0,1.0));
}
}
l9_272.y=l9_288;
if (l9_276)
{
bool l9_293=l9_278;
bool l9_294;
if (l9_293)
{
l9_294=l9_275.x==3;
}
else
{
l9_294=l9_293;
}
float l9_295=l9_272.x;
float l9_296=l9_277.x;
float l9_297=l9_277.z;
bool l9_298=l9_294;
float l9_299=l9_282;
float l9_300=fast::clamp(l9_295,l9_296,l9_297);
float l9_301=step(abs(l9_295-l9_300),9.9999997e-06);
l9_299*=(l9_301+((1.0-float(l9_298))*(1.0-l9_301)));
l9_295=l9_300;
l9_272.x=l9_295;
l9_282=l9_299;
bool l9_302=l9_278;
bool l9_303;
if (l9_302)
{
l9_303=l9_275.y==3;
}
else
{
l9_303=l9_302;
}
float l9_304=l9_272.y;
float l9_305=l9_277.y;
float l9_306=l9_277.w;
bool l9_307=l9_303;
float l9_308=l9_282;
float l9_309=fast::clamp(l9_304,l9_305,l9_306);
float l9_310=step(abs(l9_304-l9_309),9.9999997e-06);
l9_308*=(l9_310+((1.0-float(l9_307))*(1.0-l9_310)));
l9_304=l9_309;
l9_272.y=l9_304;
l9_282=l9_308;
}
float2 l9_311=l9_272;
bool l9_312=l9_273;
float3x3 l9_313=l9_274;
if (l9_312)
{
l9_311=float2((l9_313*float3(l9_311,1.0)).xy);
}
float2 l9_314=l9_311;
l9_272=l9_314;
float l9_315=l9_272.x;
int l9_316=l9_275.x;
bool l9_317=l9_281;
float l9_318=l9_282;
if ((l9_316==0)||(l9_316==3))
{
float l9_319=l9_315;
float l9_320=0.0;
float l9_321=1.0;
bool l9_322=l9_317;
float l9_323=l9_318;
float l9_324=fast::clamp(l9_319,l9_320,l9_321);
float l9_325=step(abs(l9_319-l9_324),9.9999997e-06);
l9_323*=(l9_325+((1.0-float(l9_322))*(1.0-l9_325)));
l9_319=l9_324;
l9_315=l9_319;
l9_318=l9_323;
}
l9_272.x=l9_315;
l9_282=l9_318;
float l9_326=l9_272.y;
int l9_327=l9_275.y;
bool l9_328=l9_281;
float l9_329=l9_282;
if ((l9_327==0)||(l9_327==3))
{
float l9_330=l9_326;
float l9_331=0.0;
float l9_332=1.0;
bool l9_333=l9_328;
float l9_334=l9_329;
float l9_335=fast::clamp(l9_330,l9_331,l9_332);
float l9_336=step(abs(l9_330-l9_335),9.9999997e-06);
l9_334*=(l9_336+((1.0-float(l9_333))*(1.0-l9_336)));
l9_330=l9_335;
l9_326=l9_330;
l9_329=l9_334;
}
l9_272.y=l9_326;
l9_282=l9_329;
float2 l9_337=l9_272;
int l9_338=l9_270;
int l9_339=l9_271;
float l9_340=l9_280;
float2 l9_341=l9_337;
int l9_342=l9_338;
int l9_343=l9_339;
float3 l9_344=float3(0.0);
if (l9_342==0)
{
l9_344=float3(l9_341,0.0);
}
else
{
if (l9_342==1)
{
l9_344=float3(l9_341.x,(l9_341.y*0.5)+(0.5-(float(l9_343)*0.5)),0.0);
}
else
{
l9_344=float3(l9_341,float(l9_343));
}
}
float3 l9_345=l9_344;
float3 l9_346=l9_345;
float4 l9_347=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_346.xy,bias(l9_340));
float4 l9_348=l9_347;
if (l9_278)
{
l9_348=mix(l9_279,l9_348,float4(l9_282));
}
float4 l9_349=l9_348;
l9_263=l9_349;
l9_46=l9_263;
l9_49=l9_46;
}
else
{
l9_49=l9_47;
}
l9_45=l9_49;
float4 l9_350=float4(0.0);
l9_350=l9_44*l9_45;
float4 l9_351=float4(0.0);
l9_351=l9_350;
float4 l9_352=float4(0.0);
l9_352=l9_351;
float l9_353=0.0;
float l9_354=0.0;
float l9_355=0.0;
float3 l9_356=l9_352.xyz;
float l9_357=l9_356.x;
float l9_358=l9_356.y;
float l9_359=l9_356.z;
l9_353=l9_357;
l9_354=l9_358;
l9_355=l9_359;
float3 l9_360=float3(0.0);
l9_360=l9_25*float3(l9_353);
float3 l9_361=float3(0.0);
float3 l9_362=(*sc_set0.UserUniforms).recolorGreen;
l9_361=l9_362;
float3 l9_363=float3(0.0);
l9_363=l9_361;
float3 l9_364=float3(0.0);
l9_364=l9_363*float3(l9_354);
float3 l9_365=float3(0.0);
float3 l9_366=(*sc_set0.UserUniforms).recolorBlue;
l9_365=l9_366;
float3 l9_367=float3(0.0);
l9_367=l9_365;
float3 l9_368=float3(0.0);
l9_368=l9_367*float3(l9_355);
float3 l9_369=float3(0.0);
l9_369=(l9_360+l9_364)+l9_368;
l9_19=l9_369;
l9_22=l9_19;
}
else
{
float2 l9_370=float2(0.0);
l9_370=l9_21.Surface_UVCoord0;
float l9_371=0.0;
float4 l9_372=float4(l9_370,0.0,0.0);
float l9_373=l9_372.y;
l9_371=l9_373;
float4 l9_374=float4(0.0);
float4 l9_375=(*sc_set0.UserUniforms).Tweak_N81;
l9_374=l9_375;
float4 l9_376=float4(0.0);
float4 l9_377=(*sc_set0.UserUniforms).baseColor;
l9_376=l9_377;
float4 l9_378=float4(0.0);
float l9_379=l9_371;
float4 l9_380=l9_374;
float l9_381=(*sc_set0.UserUniforms).Port_Position1_N078;
float4 l9_382=l9_374;
float4 l9_383=l9_376;
l9_379=fast::clamp(l9_379,0.0,1.0);
float4 l9_384;
if (l9_379<l9_381)
{
l9_384=mix(l9_380,l9_382,float4(fast::clamp(l9_379/l9_381,0.0,1.0)));
}
else
{
l9_384=mix(l9_382,l9_383,float4(fast::clamp((l9_379-l9_381)/(1.0-l9_381),0.0,1.0)));
}
bool l9_385=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_386;
if (l9_385)
{
l9_386=!PreviewInfo.Saved;
}
else
{
l9_386=l9_385;
}
bool l9_387;
if (l9_386)
{
l9_387=78==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_387=l9_386;
}
if (l9_387)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_384;
PreviewInfo.Color.w=1.0;
}
l9_378=l9_384;
float4 l9_388=float4(0.0);
l9_388=l9_378;
float4 l9_389=float4(0.0);
float4 l9_390=float4(0.0);
float4 l9_391=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals l9_392=l9_21;
float4 l9_393;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_394=float2(0.0);
float2 l9_395=float2(0.0);
float2 l9_396=float2(0.0);
float2 l9_397=float2(0.0);
float2 l9_398=float2(0.0);
float2 l9_399=float2(0.0);
ssGlobals l9_400=l9_392;
float2 l9_401;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_402=float2(0.0);
l9_402=l9_400.Surface_UVCoord0;
l9_395=l9_402;
l9_401=l9_395;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_403=float2(0.0);
l9_403=l9_400.Surface_UVCoord1;
l9_396=l9_403;
l9_401=l9_396;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_404=float2(0.0);
float2 l9_405=float2(0.0);
float2 l9_406=float2(0.0);
ssGlobals l9_407=l9_400;
float2 l9_408;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_409=float2(0.0);
float2 l9_410=float2(0.0);
float2 l9_411=float2(0.0);
ssGlobals l9_412=l9_407;
float2 l9_413;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_414=float2(0.0);
float2 l9_415=float2(0.0);
float2 l9_416=float2(0.0);
float2 l9_417=float2(0.0);
float2 l9_418=float2(0.0);
ssGlobals l9_419=l9_412;
float2 l9_420;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_421=float2(0.0);
l9_421=l9_419.Surface_UVCoord0;
l9_415=l9_421;
l9_420=l9_415;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_422=float2(0.0);
l9_422=l9_419.Surface_UVCoord1;
l9_416=l9_422;
l9_420=l9_416;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_423=float2(0.0);
l9_423=l9_419.gScreenCoord;
l9_417=l9_423;
l9_420=l9_417;
}
else
{
float2 l9_424=float2(0.0);
l9_424=l9_419.Surface_UVCoord0;
l9_418=l9_424;
l9_420=l9_418;
}
}
}
l9_414=l9_420;
float2 l9_425=float2(0.0);
float2 l9_426=(*sc_set0.UserUniforms).uv2Scale;
l9_425=l9_426;
float2 l9_427=float2(0.0);
l9_427=l9_425;
float2 l9_428=float2(0.0);
float2 l9_429=(*sc_set0.UserUniforms).uv2Offset;
l9_428=l9_429;
float2 l9_430=float2(0.0);
l9_430=l9_428;
float2 l9_431=float2(0.0);
l9_431=(l9_414*l9_427)+l9_430;
float2 l9_432=float2(0.0);
l9_432=l9_431+(l9_430*(l9_412.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_410=l9_432;
l9_413=l9_410;
}
else
{
float2 l9_433=float2(0.0);
float2 l9_434=float2(0.0);
float2 l9_435=float2(0.0);
float2 l9_436=float2(0.0);
float2 l9_437=float2(0.0);
ssGlobals l9_438=l9_412;
float2 l9_439;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_440=float2(0.0);
l9_440=l9_438.Surface_UVCoord0;
l9_434=l9_440;
l9_439=l9_434;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_441=float2(0.0);
l9_441=l9_438.Surface_UVCoord1;
l9_435=l9_441;
l9_439=l9_435;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_442=float2(0.0);
l9_442=l9_438.gScreenCoord;
l9_436=l9_442;
l9_439=l9_436;
}
else
{
float2 l9_443=float2(0.0);
l9_443=l9_438.Surface_UVCoord0;
l9_437=l9_443;
l9_439=l9_437;
}
}
}
l9_433=l9_439;
float2 l9_444=float2(0.0);
float2 l9_445=(*sc_set0.UserUniforms).uv2Scale;
l9_444=l9_445;
float2 l9_446=float2(0.0);
l9_446=l9_444;
float2 l9_447=float2(0.0);
float2 l9_448=(*sc_set0.UserUniforms).uv2Offset;
l9_447=l9_448;
float2 l9_449=float2(0.0);
l9_449=l9_447;
float2 l9_450=float2(0.0);
l9_450=(l9_433*l9_446)+l9_449;
l9_411=l9_450;
l9_413=l9_411;
}
l9_409=l9_413;
l9_405=l9_409;
l9_408=l9_405;
}
else
{
float2 l9_451=float2(0.0);
l9_451=l9_407.Surface_UVCoord0;
l9_406=l9_451;
l9_408=l9_406;
}
l9_404=l9_408;
float2 l9_452=float2(0.0);
l9_452=l9_404;
float2 l9_453=float2(0.0);
l9_453=l9_452;
l9_397=l9_453;
l9_401=l9_397;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_454=float2(0.0);
float2 l9_455=float2(0.0);
float2 l9_456=float2(0.0);
ssGlobals l9_457=l9_400;
float2 l9_458;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_459=float2(0.0);
float2 l9_460=float2(0.0);
float2 l9_461=float2(0.0);
ssGlobals l9_462=l9_457;
float2 l9_463;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_464=float2(0.0);
float2 l9_465=float2(0.0);
float2 l9_466=float2(0.0);
float2 l9_467=float2(0.0);
float2 l9_468=float2(0.0);
float2 l9_469=float2(0.0);
ssGlobals l9_470=l9_462;
float2 l9_471;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_472=float2(0.0);
l9_472=l9_470.Surface_UVCoord0;
l9_465=l9_472;
l9_471=l9_465;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_473=float2(0.0);
l9_473=l9_470.Surface_UVCoord1;
l9_466=l9_473;
l9_471=l9_466;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_474=float2(0.0);
l9_474=l9_470.gScreenCoord;
l9_467=l9_474;
l9_471=l9_467;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_475=float2(0.0);
float2 l9_476=float2(0.0);
float2 l9_477=float2(0.0);
ssGlobals l9_478=l9_470;
float2 l9_479;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_480=float2(0.0);
float2 l9_481=float2(0.0);
float2 l9_482=float2(0.0);
ssGlobals l9_483=l9_478;
float2 l9_484;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_485=float2(0.0);
float2 l9_486=float2(0.0);
float2 l9_487=float2(0.0);
float2 l9_488=float2(0.0);
float2 l9_489=float2(0.0);
ssGlobals l9_490=l9_483;
float2 l9_491;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_492=float2(0.0);
l9_492=l9_490.Surface_UVCoord0;
l9_486=l9_492;
l9_491=l9_486;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_493=float2(0.0);
l9_493=l9_490.Surface_UVCoord1;
l9_487=l9_493;
l9_491=l9_487;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_494=float2(0.0);
l9_494=l9_490.gScreenCoord;
l9_488=l9_494;
l9_491=l9_488;
}
else
{
float2 l9_495=float2(0.0);
l9_495=l9_490.Surface_UVCoord0;
l9_489=l9_495;
l9_491=l9_489;
}
}
}
l9_485=l9_491;
float2 l9_496=float2(0.0);
float2 l9_497=(*sc_set0.UserUniforms).uv2Scale;
l9_496=l9_497;
float2 l9_498=float2(0.0);
l9_498=l9_496;
float2 l9_499=float2(0.0);
float2 l9_500=(*sc_set0.UserUniforms).uv2Offset;
l9_499=l9_500;
float2 l9_501=float2(0.0);
l9_501=l9_499;
float2 l9_502=float2(0.0);
l9_502=(l9_485*l9_498)+l9_501;
float2 l9_503=float2(0.0);
l9_503=l9_502+(l9_501*(l9_483.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_481=l9_503;
l9_484=l9_481;
}
else
{
float2 l9_504=float2(0.0);
float2 l9_505=float2(0.0);
float2 l9_506=float2(0.0);
float2 l9_507=float2(0.0);
float2 l9_508=float2(0.0);
ssGlobals l9_509=l9_483;
float2 l9_510;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_511=float2(0.0);
l9_511=l9_509.Surface_UVCoord0;
l9_505=l9_511;
l9_510=l9_505;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_512=float2(0.0);
l9_512=l9_509.Surface_UVCoord1;
l9_506=l9_512;
l9_510=l9_506;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_513=float2(0.0);
l9_513=l9_509.gScreenCoord;
l9_507=l9_513;
l9_510=l9_507;
}
else
{
float2 l9_514=float2(0.0);
l9_514=l9_509.Surface_UVCoord0;
l9_508=l9_514;
l9_510=l9_508;
}
}
}
l9_504=l9_510;
float2 l9_515=float2(0.0);
float2 l9_516=(*sc_set0.UserUniforms).uv2Scale;
l9_515=l9_516;
float2 l9_517=float2(0.0);
l9_517=l9_515;
float2 l9_518=float2(0.0);
float2 l9_519=(*sc_set0.UserUniforms).uv2Offset;
l9_518=l9_519;
float2 l9_520=float2(0.0);
l9_520=l9_518;
float2 l9_521=float2(0.0);
l9_521=(l9_504*l9_517)+l9_520;
l9_482=l9_521;
l9_484=l9_482;
}
l9_480=l9_484;
l9_476=l9_480;
l9_479=l9_476;
}
else
{
float2 l9_522=float2(0.0);
l9_522=l9_478.Surface_UVCoord0;
l9_477=l9_522;
l9_479=l9_477;
}
l9_475=l9_479;
float2 l9_523=float2(0.0);
l9_523=l9_475;
float2 l9_524=float2(0.0);
l9_524=l9_523;
l9_468=l9_524;
l9_471=l9_468;
}
else
{
float2 l9_525=float2(0.0);
l9_525=l9_470.Surface_UVCoord0;
l9_469=l9_525;
l9_471=l9_469;
}
}
}
}
l9_464=l9_471;
float2 l9_526=float2(0.0);
float2 l9_527=(*sc_set0.UserUniforms).uv3Scale;
l9_526=l9_527;
float2 l9_528=float2(0.0);
l9_528=l9_526;
float2 l9_529=float2(0.0);
float2 l9_530=(*sc_set0.UserUniforms).uv3Offset;
l9_529=l9_530;
float2 l9_531=float2(0.0);
l9_531=l9_529;
float2 l9_532=float2(0.0);
l9_532=(l9_464*l9_528)+l9_531;
float2 l9_533=float2(0.0);
l9_533=l9_532+(l9_531*(l9_462.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_460=l9_533;
l9_463=l9_460;
}
else
{
float2 l9_534=float2(0.0);
float2 l9_535=float2(0.0);
float2 l9_536=float2(0.0);
float2 l9_537=float2(0.0);
float2 l9_538=float2(0.0);
float2 l9_539=float2(0.0);
ssGlobals l9_540=l9_462;
float2 l9_541;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_542=float2(0.0);
l9_542=l9_540.Surface_UVCoord0;
l9_535=l9_542;
l9_541=l9_535;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_543=float2(0.0);
l9_543=l9_540.Surface_UVCoord1;
l9_536=l9_543;
l9_541=l9_536;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_544=float2(0.0);
l9_544=l9_540.gScreenCoord;
l9_537=l9_544;
l9_541=l9_537;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_545=float2(0.0);
float2 l9_546=float2(0.0);
float2 l9_547=float2(0.0);
ssGlobals l9_548=l9_540;
float2 l9_549;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_550=float2(0.0);
float2 l9_551=float2(0.0);
float2 l9_552=float2(0.0);
ssGlobals l9_553=l9_548;
float2 l9_554;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_555=float2(0.0);
float2 l9_556=float2(0.0);
float2 l9_557=float2(0.0);
float2 l9_558=float2(0.0);
float2 l9_559=float2(0.0);
ssGlobals l9_560=l9_553;
float2 l9_561;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_562=float2(0.0);
l9_562=l9_560.Surface_UVCoord0;
l9_556=l9_562;
l9_561=l9_556;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_563=float2(0.0);
l9_563=l9_560.Surface_UVCoord1;
l9_557=l9_563;
l9_561=l9_557;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_564=float2(0.0);
l9_564=l9_560.gScreenCoord;
l9_558=l9_564;
l9_561=l9_558;
}
else
{
float2 l9_565=float2(0.0);
l9_565=l9_560.Surface_UVCoord0;
l9_559=l9_565;
l9_561=l9_559;
}
}
}
l9_555=l9_561;
float2 l9_566=float2(0.0);
float2 l9_567=(*sc_set0.UserUniforms).uv2Scale;
l9_566=l9_567;
float2 l9_568=float2(0.0);
l9_568=l9_566;
float2 l9_569=float2(0.0);
float2 l9_570=(*sc_set0.UserUniforms).uv2Offset;
l9_569=l9_570;
float2 l9_571=float2(0.0);
l9_571=l9_569;
float2 l9_572=float2(0.0);
l9_572=(l9_555*l9_568)+l9_571;
float2 l9_573=float2(0.0);
l9_573=l9_572+(l9_571*(l9_553.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_551=l9_573;
l9_554=l9_551;
}
else
{
float2 l9_574=float2(0.0);
float2 l9_575=float2(0.0);
float2 l9_576=float2(0.0);
float2 l9_577=float2(0.0);
float2 l9_578=float2(0.0);
ssGlobals l9_579=l9_553;
float2 l9_580;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_581=float2(0.0);
l9_581=l9_579.Surface_UVCoord0;
l9_575=l9_581;
l9_580=l9_575;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_582=float2(0.0);
l9_582=l9_579.Surface_UVCoord1;
l9_576=l9_582;
l9_580=l9_576;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_583=float2(0.0);
l9_583=l9_579.gScreenCoord;
l9_577=l9_583;
l9_580=l9_577;
}
else
{
float2 l9_584=float2(0.0);
l9_584=l9_579.Surface_UVCoord0;
l9_578=l9_584;
l9_580=l9_578;
}
}
}
l9_574=l9_580;
float2 l9_585=float2(0.0);
float2 l9_586=(*sc_set0.UserUniforms).uv2Scale;
l9_585=l9_586;
float2 l9_587=float2(0.0);
l9_587=l9_585;
float2 l9_588=float2(0.0);
float2 l9_589=(*sc_set0.UserUniforms).uv2Offset;
l9_588=l9_589;
float2 l9_590=float2(0.0);
l9_590=l9_588;
float2 l9_591=float2(0.0);
l9_591=(l9_574*l9_587)+l9_590;
l9_552=l9_591;
l9_554=l9_552;
}
l9_550=l9_554;
l9_546=l9_550;
l9_549=l9_546;
}
else
{
float2 l9_592=float2(0.0);
l9_592=l9_548.Surface_UVCoord0;
l9_547=l9_592;
l9_549=l9_547;
}
l9_545=l9_549;
float2 l9_593=float2(0.0);
l9_593=l9_545;
float2 l9_594=float2(0.0);
l9_594=l9_593;
l9_538=l9_594;
l9_541=l9_538;
}
else
{
float2 l9_595=float2(0.0);
l9_595=l9_540.Surface_UVCoord0;
l9_539=l9_595;
l9_541=l9_539;
}
}
}
}
l9_534=l9_541;
float2 l9_596=float2(0.0);
float2 l9_597=(*sc_set0.UserUniforms).uv3Scale;
l9_596=l9_597;
float2 l9_598=float2(0.0);
l9_598=l9_596;
float2 l9_599=float2(0.0);
float2 l9_600=(*sc_set0.UserUniforms).uv3Offset;
l9_599=l9_600;
float2 l9_601=float2(0.0);
l9_601=l9_599;
float2 l9_602=float2(0.0);
l9_602=(l9_534*l9_598)+l9_601;
l9_461=l9_602;
l9_463=l9_461;
}
l9_459=l9_463;
l9_455=l9_459;
l9_458=l9_455;
}
else
{
float2 l9_603=float2(0.0);
l9_603=l9_457.Surface_UVCoord0;
l9_456=l9_603;
l9_458=l9_456;
}
l9_454=l9_458;
float2 l9_604=float2(0.0);
l9_604=l9_454;
float2 l9_605=float2(0.0);
l9_605=l9_604;
l9_398=l9_605;
l9_401=l9_398;
}
else
{
float2 l9_606=float2(0.0);
l9_606=l9_400.Surface_UVCoord0;
l9_399=l9_606;
l9_401=l9_399;
}
}
}
}
l9_394=l9_401;
float4 l9_607=float4(0.0);
int l9_608;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_609=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_609=0;
}
else
{
l9_609=in.varStereoViewID;
}
int l9_610=l9_609;
l9_608=1-l9_610;
}
else
{
int l9_611=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_611=0;
}
else
{
l9_611=in.varStereoViewID;
}
int l9_612=l9_611;
l9_608=l9_612;
}
int l9_613=l9_608;
int l9_614=baseTexLayout_tmp;
int l9_615=l9_613;
float2 l9_616=l9_394;
bool l9_617=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_618=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_619=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_620=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_621=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_622=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_623=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_624=0.0;
bool l9_625=l9_622&&(!l9_620);
float l9_626=1.0;
float l9_627=l9_616.x;
int l9_628=l9_619.x;
if (l9_628==1)
{
l9_627=fract(l9_627);
}
else
{
if (l9_628==2)
{
float l9_629=fract(l9_627);
float l9_630=l9_627-l9_629;
float l9_631=step(0.25,fract(l9_630*0.5));
l9_627=mix(l9_629,1.0-l9_629,fast::clamp(l9_631,0.0,1.0));
}
}
l9_616.x=l9_627;
float l9_632=l9_616.y;
int l9_633=l9_619.y;
if (l9_633==1)
{
l9_632=fract(l9_632);
}
else
{
if (l9_633==2)
{
float l9_634=fract(l9_632);
float l9_635=l9_632-l9_634;
float l9_636=step(0.25,fract(l9_635*0.5));
l9_632=mix(l9_634,1.0-l9_634,fast::clamp(l9_636,0.0,1.0));
}
}
l9_616.y=l9_632;
if (l9_620)
{
bool l9_637=l9_622;
bool l9_638;
if (l9_637)
{
l9_638=l9_619.x==3;
}
else
{
l9_638=l9_637;
}
float l9_639=l9_616.x;
float l9_640=l9_621.x;
float l9_641=l9_621.z;
bool l9_642=l9_638;
float l9_643=l9_626;
float l9_644=fast::clamp(l9_639,l9_640,l9_641);
float l9_645=step(abs(l9_639-l9_644),9.9999997e-06);
l9_643*=(l9_645+((1.0-float(l9_642))*(1.0-l9_645)));
l9_639=l9_644;
l9_616.x=l9_639;
l9_626=l9_643;
bool l9_646=l9_622;
bool l9_647;
if (l9_646)
{
l9_647=l9_619.y==3;
}
else
{
l9_647=l9_646;
}
float l9_648=l9_616.y;
float l9_649=l9_621.y;
float l9_650=l9_621.w;
bool l9_651=l9_647;
float l9_652=l9_626;
float l9_653=fast::clamp(l9_648,l9_649,l9_650);
float l9_654=step(abs(l9_648-l9_653),9.9999997e-06);
l9_652*=(l9_654+((1.0-float(l9_651))*(1.0-l9_654)));
l9_648=l9_653;
l9_616.y=l9_648;
l9_626=l9_652;
}
float2 l9_655=l9_616;
bool l9_656=l9_617;
float3x3 l9_657=l9_618;
if (l9_656)
{
l9_655=float2((l9_657*float3(l9_655,1.0)).xy);
}
float2 l9_658=l9_655;
l9_616=l9_658;
float l9_659=l9_616.x;
int l9_660=l9_619.x;
bool l9_661=l9_625;
float l9_662=l9_626;
if ((l9_660==0)||(l9_660==3))
{
float l9_663=l9_659;
float l9_664=0.0;
float l9_665=1.0;
bool l9_666=l9_661;
float l9_667=l9_662;
float l9_668=fast::clamp(l9_663,l9_664,l9_665);
float l9_669=step(abs(l9_663-l9_668),9.9999997e-06);
l9_667*=(l9_669+((1.0-float(l9_666))*(1.0-l9_669)));
l9_663=l9_668;
l9_659=l9_663;
l9_662=l9_667;
}
l9_616.x=l9_659;
l9_626=l9_662;
float l9_670=l9_616.y;
int l9_671=l9_619.y;
bool l9_672=l9_625;
float l9_673=l9_626;
if ((l9_671==0)||(l9_671==3))
{
float l9_674=l9_670;
float l9_675=0.0;
float l9_676=1.0;
bool l9_677=l9_672;
float l9_678=l9_673;
float l9_679=fast::clamp(l9_674,l9_675,l9_676);
float l9_680=step(abs(l9_674-l9_679),9.9999997e-06);
l9_678*=(l9_680+((1.0-float(l9_677))*(1.0-l9_680)));
l9_674=l9_679;
l9_670=l9_674;
l9_673=l9_678;
}
l9_616.y=l9_670;
l9_626=l9_673;
float2 l9_681=l9_616;
int l9_682=l9_614;
int l9_683=l9_615;
float l9_684=l9_624;
float2 l9_685=l9_681;
int l9_686=l9_682;
int l9_687=l9_683;
float3 l9_688=float3(0.0);
if (l9_686==0)
{
l9_688=float3(l9_685,0.0);
}
else
{
if (l9_686==1)
{
l9_688=float3(l9_685.x,(l9_685.y*0.5)+(0.5-(float(l9_687)*0.5)),0.0);
}
else
{
l9_688=float3(l9_685,float(l9_687));
}
}
float3 l9_689=l9_688;
float3 l9_690=l9_689;
float4 l9_691=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_690.xy,bias(l9_684));
float4 l9_692=l9_691;
if (l9_622)
{
l9_692=mix(l9_623,l9_692,float4(l9_626));
}
float4 l9_693=l9_692;
l9_607=l9_693;
l9_390=l9_607;
l9_393=l9_390;
}
else
{
l9_393=l9_391;
}
l9_389=l9_393;
float4 l9_694=float4(0.0);
l9_694=l9_388*l9_389;
float4 l9_695=float4(0.0);
l9_695=l9_694;
float4 l9_696=float4(0.0);
l9_696=l9_695;
l9_20=l9_696.xyz;
l9_22=l9_20;
}
l9_18=l9_22;
float3 l9_697=float3(0.0);
l9_697=l9_18;
float3 l9_698=float3(0.0);
l9_698=l9_697;
float4 l9_699=float4(0.0);
l9_699=float4(l9_698.x,l9_698.y,l9_698.z,l9_699.w);
l9_699.w=(*sc_set0.UserUniforms).Port_Value2_N073;
float4 l9_700=float4(0.0);
l9_700=l9_17*l9_699;
param_1=l9_700;
param_3=param_1;
}
else
{
float3 l9_701=float3(0.0);
float3 l9_702=float3(0.0);
float3 l9_703=float3(0.0);
ssGlobals l9_704=param_4;
float3 l9_705;
if ((int(ENABLE_RECOLOR_tmp)!=0))
{
float3 l9_706=float3(0.0);
float3 l9_707=(*sc_set0.UserUniforms).recolorRed;
l9_706=l9_707;
float3 l9_708=float3(0.0);
l9_708=l9_706;
float2 l9_709=float2(0.0);
l9_709=l9_704.Surface_UVCoord0;
float l9_710=0.0;
float4 l9_711=float4(l9_709,0.0,0.0);
float l9_712=l9_711.y;
l9_710=l9_712;
float4 l9_713=float4(0.0);
float4 l9_714=(*sc_set0.UserUniforms).Tweak_N81;
l9_713=l9_714;
float4 l9_715=float4(0.0);
float4 l9_716=(*sc_set0.UserUniforms).baseColor;
l9_715=l9_716;
float4 l9_717=float4(0.0);
float l9_718=l9_710;
float4 l9_719=l9_713;
float l9_720=(*sc_set0.UserUniforms).Port_Position1_N078;
float4 l9_721=l9_713;
float4 l9_722=l9_715;
l9_718=fast::clamp(l9_718,0.0,1.0);
float4 l9_723;
if (l9_718<l9_720)
{
l9_723=mix(l9_719,l9_721,float4(fast::clamp(l9_718/l9_720,0.0,1.0)));
}
else
{
l9_723=mix(l9_721,l9_722,float4(fast::clamp((l9_718-l9_720)/(1.0-l9_720),0.0,1.0)));
}
bool l9_724=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_725;
if (l9_724)
{
l9_725=!PreviewInfo.Saved;
}
else
{
l9_725=l9_724;
}
bool l9_726;
if (l9_725)
{
l9_726=78==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_726=l9_725;
}
if (l9_726)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_723;
PreviewInfo.Color.w=1.0;
}
l9_717=l9_723;
float4 l9_727=float4(0.0);
l9_727=l9_717;
float4 l9_728=float4(0.0);
float4 l9_729=float4(0.0);
float4 l9_730=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals l9_731=l9_704;
float4 l9_732;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_733=float2(0.0);
float2 l9_734=float2(0.0);
float2 l9_735=float2(0.0);
float2 l9_736=float2(0.0);
float2 l9_737=float2(0.0);
float2 l9_738=float2(0.0);
ssGlobals l9_739=l9_731;
float2 l9_740;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_741=float2(0.0);
l9_741=l9_739.Surface_UVCoord0;
l9_734=l9_741;
l9_740=l9_734;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_742=float2(0.0);
l9_742=l9_739.Surface_UVCoord1;
l9_735=l9_742;
l9_740=l9_735;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_743=float2(0.0);
float2 l9_744=float2(0.0);
float2 l9_745=float2(0.0);
ssGlobals l9_746=l9_739;
float2 l9_747;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_748=float2(0.0);
float2 l9_749=float2(0.0);
float2 l9_750=float2(0.0);
ssGlobals l9_751=l9_746;
float2 l9_752;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_753=float2(0.0);
float2 l9_754=float2(0.0);
float2 l9_755=float2(0.0);
float2 l9_756=float2(0.0);
float2 l9_757=float2(0.0);
ssGlobals l9_758=l9_751;
float2 l9_759;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_760=float2(0.0);
l9_760=l9_758.Surface_UVCoord0;
l9_754=l9_760;
l9_759=l9_754;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_761=float2(0.0);
l9_761=l9_758.Surface_UVCoord1;
l9_755=l9_761;
l9_759=l9_755;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_762=float2(0.0);
l9_762=l9_758.gScreenCoord;
l9_756=l9_762;
l9_759=l9_756;
}
else
{
float2 l9_763=float2(0.0);
l9_763=l9_758.Surface_UVCoord0;
l9_757=l9_763;
l9_759=l9_757;
}
}
}
l9_753=l9_759;
float2 l9_764=float2(0.0);
float2 l9_765=(*sc_set0.UserUniforms).uv2Scale;
l9_764=l9_765;
float2 l9_766=float2(0.0);
l9_766=l9_764;
float2 l9_767=float2(0.0);
float2 l9_768=(*sc_set0.UserUniforms).uv2Offset;
l9_767=l9_768;
float2 l9_769=float2(0.0);
l9_769=l9_767;
float2 l9_770=float2(0.0);
l9_770=(l9_753*l9_766)+l9_769;
float2 l9_771=float2(0.0);
l9_771=l9_770+(l9_769*(l9_751.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_749=l9_771;
l9_752=l9_749;
}
else
{
float2 l9_772=float2(0.0);
float2 l9_773=float2(0.0);
float2 l9_774=float2(0.0);
float2 l9_775=float2(0.0);
float2 l9_776=float2(0.0);
ssGlobals l9_777=l9_751;
float2 l9_778;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_779=float2(0.0);
l9_779=l9_777.Surface_UVCoord0;
l9_773=l9_779;
l9_778=l9_773;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_780=float2(0.0);
l9_780=l9_777.Surface_UVCoord1;
l9_774=l9_780;
l9_778=l9_774;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_781=float2(0.0);
l9_781=l9_777.gScreenCoord;
l9_775=l9_781;
l9_778=l9_775;
}
else
{
float2 l9_782=float2(0.0);
l9_782=l9_777.Surface_UVCoord0;
l9_776=l9_782;
l9_778=l9_776;
}
}
}
l9_772=l9_778;
float2 l9_783=float2(0.0);
float2 l9_784=(*sc_set0.UserUniforms).uv2Scale;
l9_783=l9_784;
float2 l9_785=float2(0.0);
l9_785=l9_783;
float2 l9_786=float2(0.0);
float2 l9_787=(*sc_set0.UserUniforms).uv2Offset;
l9_786=l9_787;
float2 l9_788=float2(0.0);
l9_788=l9_786;
float2 l9_789=float2(0.0);
l9_789=(l9_772*l9_785)+l9_788;
l9_750=l9_789;
l9_752=l9_750;
}
l9_748=l9_752;
l9_744=l9_748;
l9_747=l9_744;
}
else
{
float2 l9_790=float2(0.0);
l9_790=l9_746.Surface_UVCoord0;
l9_745=l9_790;
l9_747=l9_745;
}
l9_743=l9_747;
float2 l9_791=float2(0.0);
l9_791=l9_743;
float2 l9_792=float2(0.0);
l9_792=l9_791;
l9_736=l9_792;
l9_740=l9_736;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_793=float2(0.0);
float2 l9_794=float2(0.0);
float2 l9_795=float2(0.0);
ssGlobals l9_796=l9_739;
float2 l9_797;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_798=float2(0.0);
float2 l9_799=float2(0.0);
float2 l9_800=float2(0.0);
ssGlobals l9_801=l9_796;
float2 l9_802;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_803=float2(0.0);
float2 l9_804=float2(0.0);
float2 l9_805=float2(0.0);
float2 l9_806=float2(0.0);
float2 l9_807=float2(0.0);
float2 l9_808=float2(0.0);
ssGlobals l9_809=l9_801;
float2 l9_810;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_811=float2(0.0);
l9_811=l9_809.Surface_UVCoord0;
l9_804=l9_811;
l9_810=l9_804;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_812=float2(0.0);
l9_812=l9_809.Surface_UVCoord1;
l9_805=l9_812;
l9_810=l9_805;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_813=float2(0.0);
l9_813=l9_809.gScreenCoord;
l9_806=l9_813;
l9_810=l9_806;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_814=float2(0.0);
float2 l9_815=float2(0.0);
float2 l9_816=float2(0.0);
ssGlobals l9_817=l9_809;
float2 l9_818;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_819=float2(0.0);
float2 l9_820=float2(0.0);
float2 l9_821=float2(0.0);
ssGlobals l9_822=l9_817;
float2 l9_823;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_824=float2(0.0);
float2 l9_825=float2(0.0);
float2 l9_826=float2(0.0);
float2 l9_827=float2(0.0);
float2 l9_828=float2(0.0);
ssGlobals l9_829=l9_822;
float2 l9_830;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_831=float2(0.0);
l9_831=l9_829.Surface_UVCoord0;
l9_825=l9_831;
l9_830=l9_825;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_832=float2(0.0);
l9_832=l9_829.Surface_UVCoord1;
l9_826=l9_832;
l9_830=l9_826;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_833=float2(0.0);
l9_833=l9_829.gScreenCoord;
l9_827=l9_833;
l9_830=l9_827;
}
else
{
float2 l9_834=float2(0.0);
l9_834=l9_829.Surface_UVCoord0;
l9_828=l9_834;
l9_830=l9_828;
}
}
}
l9_824=l9_830;
float2 l9_835=float2(0.0);
float2 l9_836=(*sc_set0.UserUniforms).uv2Scale;
l9_835=l9_836;
float2 l9_837=float2(0.0);
l9_837=l9_835;
float2 l9_838=float2(0.0);
float2 l9_839=(*sc_set0.UserUniforms).uv2Offset;
l9_838=l9_839;
float2 l9_840=float2(0.0);
l9_840=l9_838;
float2 l9_841=float2(0.0);
l9_841=(l9_824*l9_837)+l9_840;
float2 l9_842=float2(0.0);
l9_842=l9_841+(l9_840*(l9_822.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_820=l9_842;
l9_823=l9_820;
}
else
{
float2 l9_843=float2(0.0);
float2 l9_844=float2(0.0);
float2 l9_845=float2(0.0);
float2 l9_846=float2(0.0);
float2 l9_847=float2(0.0);
ssGlobals l9_848=l9_822;
float2 l9_849;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_850=float2(0.0);
l9_850=l9_848.Surface_UVCoord0;
l9_844=l9_850;
l9_849=l9_844;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_851=float2(0.0);
l9_851=l9_848.Surface_UVCoord1;
l9_845=l9_851;
l9_849=l9_845;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_852=float2(0.0);
l9_852=l9_848.gScreenCoord;
l9_846=l9_852;
l9_849=l9_846;
}
else
{
float2 l9_853=float2(0.0);
l9_853=l9_848.Surface_UVCoord0;
l9_847=l9_853;
l9_849=l9_847;
}
}
}
l9_843=l9_849;
float2 l9_854=float2(0.0);
float2 l9_855=(*sc_set0.UserUniforms).uv2Scale;
l9_854=l9_855;
float2 l9_856=float2(0.0);
l9_856=l9_854;
float2 l9_857=float2(0.0);
float2 l9_858=(*sc_set0.UserUniforms).uv2Offset;
l9_857=l9_858;
float2 l9_859=float2(0.0);
l9_859=l9_857;
float2 l9_860=float2(0.0);
l9_860=(l9_843*l9_856)+l9_859;
l9_821=l9_860;
l9_823=l9_821;
}
l9_819=l9_823;
l9_815=l9_819;
l9_818=l9_815;
}
else
{
float2 l9_861=float2(0.0);
l9_861=l9_817.Surface_UVCoord0;
l9_816=l9_861;
l9_818=l9_816;
}
l9_814=l9_818;
float2 l9_862=float2(0.0);
l9_862=l9_814;
float2 l9_863=float2(0.0);
l9_863=l9_862;
l9_807=l9_863;
l9_810=l9_807;
}
else
{
float2 l9_864=float2(0.0);
l9_864=l9_809.Surface_UVCoord0;
l9_808=l9_864;
l9_810=l9_808;
}
}
}
}
l9_803=l9_810;
float2 l9_865=float2(0.0);
float2 l9_866=(*sc_set0.UserUniforms).uv3Scale;
l9_865=l9_866;
float2 l9_867=float2(0.0);
l9_867=l9_865;
float2 l9_868=float2(0.0);
float2 l9_869=(*sc_set0.UserUniforms).uv3Offset;
l9_868=l9_869;
float2 l9_870=float2(0.0);
l9_870=l9_868;
float2 l9_871=float2(0.0);
l9_871=(l9_803*l9_867)+l9_870;
float2 l9_872=float2(0.0);
l9_872=l9_871+(l9_870*(l9_801.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_799=l9_872;
l9_802=l9_799;
}
else
{
float2 l9_873=float2(0.0);
float2 l9_874=float2(0.0);
float2 l9_875=float2(0.0);
float2 l9_876=float2(0.0);
float2 l9_877=float2(0.0);
float2 l9_878=float2(0.0);
ssGlobals l9_879=l9_801;
float2 l9_880;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_881=float2(0.0);
l9_881=l9_879.Surface_UVCoord0;
l9_874=l9_881;
l9_880=l9_874;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_882=float2(0.0);
l9_882=l9_879.Surface_UVCoord1;
l9_875=l9_882;
l9_880=l9_875;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_883=float2(0.0);
l9_883=l9_879.gScreenCoord;
l9_876=l9_883;
l9_880=l9_876;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_884=float2(0.0);
float2 l9_885=float2(0.0);
float2 l9_886=float2(0.0);
ssGlobals l9_887=l9_879;
float2 l9_888;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_889=float2(0.0);
float2 l9_890=float2(0.0);
float2 l9_891=float2(0.0);
ssGlobals l9_892=l9_887;
float2 l9_893;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_894=float2(0.0);
float2 l9_895=float2(0.0);
float2 l9_896=float2(0.0);
float2 l9_897=float2(0.0);
float2 l9_898=float2(0.0);
ssGlobals l9_899=l9_892;
float2 l9_900;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_901=float2(0.0);
l9_901=l9_899.Surface_UVCoord0;
l9_895=l9_901;
l9_900=l9_895;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_902=float2(0.0);
l9_902=l9_899.Surface_UVCoord1;
l9_896=l9_902;
l9_900=l9_896;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_903=float2(0.0);
l9_903=l9_899.gScreenCoord;
l9_897=l9_903;
l9_900=l9_897;
}
else
{
float2 l9_904=float2(0.0);
l9_904=l9_899.Surface_UVCoord0;
l9_898=l9_904;
l9_900=l9_898;
}
}
}
l9_894=l9_900;
float2 l9_905=float2(0.0);
float2 l9_906=(*sc_set0.UserUniforms).uv2Scale;
l9_905=l9_906;
float2 l9_907=float2(0.0);
l9_907=l9_905;
float2 l9_908=float2(0.0);
float2 l9_909=(*sc_set0.UserUniforms).uv2Offset;
l9_908=l9_909;
float2 l9_910=float2(0.0);
l9_910=l9_908;
float2 l9_911=float2(0.0);
l9_911=(l9_894*l9_907)+l9_910;
float2 l9_912=float2(0.0);
l9_912=l9_911+(l9_910*(l9_892.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_890=l9_912;
l9_893=l9_890;
}
else
{
float2 l9_913=float2(0.0);
float2 l9_914=float2(0.0);
float2 l9_915=float2(0.0);
float2 l9_916=float2(0.0);
float2 l9_917=float2(0.0);
ssGlobals l9_918=l9_892;
float2 l9_919;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_920=float2(0.0);
l9_920=l9_918.Surface_UVCoord0;
l9_914=l9_920;
l9_919=l9_914;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_921=float2(0.0);
l9_921=l9_918.Surface_UVCoord1;
l9_915=l9_921;
l9_919=l9_915;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_922=float2(0.0);
l9_922=l9_918.gScreenCoord;
l9_916=l9_922;
l9_919=l9_916;
}
else
{
float2 l9_923=float2(0.0);
l9_923=l9_918.Surface_UVCoord0;
l9_917=l9_923;
l9_919=l9_917;
}
}
}
l9_913=l9_919;
float2 l9_924=float2(0.0);
float2 l9_925=(*sc_set0.UserUniforms).uv2Scale;
l9_924=l9_925;
float2 l9_926=float2(0.0);
l9_926=l9_924;
float2 l9_927=float2(0.0);
float2 l9_928=(*sc_set0.UserUniforms).uv2Offset;
l9_927=l9_928;
float2 l9_929=float2(0.0);
l9_929=l9_927;
float2 l9_930=float2(0.0);
l9_930=(l9_913*l9_926)+l9_929;
l9_891=l9_930;
l9_893=l9_891;
}
l9_889=l9_893;
l9_885=l9_889;
l9_888=l9_885;
}
else
{
float2 l9_931=float2(0.0);
l9_931=l9_887.Surface_UVCoord0;
l9_886=l9_931;
l9_888=l9_886;
}
l9_884=l9_888;
float2 l9_932=float2(0.0);
l9_932=l9_884;
float2 l9_933=float2(0.0);
l9_933=l9_932;
l9_877=l9_933;
l9_880=l9_877;
}
else
{
float2 l9_934=float2(0.0);
l9_934=l9_879.Surface_UVCoord0;
l9_878=l9_934;
l9_880=l9_878;
}
}
}
}
l9_873=l9_880;
float2 l9_935=float2(0.0);
float2 l9_936=(*sc_set0.UserUniforms).uv3Scale;
l9_935=l9_936;
float2 l9_937=float2(0.0);
l9_937=l9_935;
float2 l9_938=float2(0.0);
float2 l9_939=(*sc_set0.UserUniforms).uv3Offset;
l9_938=l9_939;
float2 l9_940=float2(0.0);
l9_940=l9_938;
float2 l9_941=float2(0.0);
l9_941=(l9_873*l9_937)+l9_940;
l9_800=l9_941;
l9_802=l9_800;
}
l9_798=l9_802;
l9_794=l9_798;
l9_797=l9_794;
}
else
{
float2 l9_942=float2(0.0);
l9_942=l9_796.Surface_UVCoord0;
l9_795=l9_942;
l9_797=l9_795;
}
l9_793=l9_797;
float2 l9_943=float2(0.0);
l9_943=l9_793;
float2 l9_944=float2(0.0);
l9_944=l9_943;
l9_737=l9_944;
l9_740=l9_737;
}
else
{
float2 l9_945=float2(0.0);
l9_945=l9_739.Surface_UVCoord0;
l9_738=l9_945;
l9_740=l9_738;
}
}
}
}
l9_733=l9_740;
float4 l9_946=float4(0.0);
int l9_947;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_948=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_948=0;
}
else
{
l9_948=in.varStereoViewID;
}
int l9_949=l9_948;
l9_947=1-l9_949;
}
else
{
int l9_950=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_950=0;
}
else
{
l9_950=in.varStereoViewID;
}
int l9_951=l9_950;
l9_947=l9_951;
}
int l9_952=l9_947;
int l9_953=baseTexLayout_tmp;
int l9_954=l9_952;
float2 l9_955=l9_733;
bool l9_956=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_957=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_958=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_959=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_960=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_961=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_962=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_963=0.0;
bool l9_964=l9_961&&(!l9_959);
float l9_965=1.0;
float l9_966=l9_955.x;
int l9_967=l9_958.x;
if (l9_967==1)
{
l9_966=fract(l9_966);
}
else
{
if (l9_967==2)
{
float l9_968=fract(l9_966);
float l9_969=l9_966-l9_968;
float l9_970=step(0.25,fract(l9_969*0.5));
l9_966=mix(l9_968,1.0-l9_968,fast::clamp(l9_970,0.0,1.0));
}
}
l9_955.x=l9_966;
float l9_971=l9_955.y;
int l9_972=l9_958.y;
if (l9_972==1)
{
l9_971=fract(l9_971);
}
else
{
if (l9_972==2)
{
float l9_973=fract(l9_971);
float l9_974=l9_971-l9_973;
float l9_975=step(0.25,fract(l9_974*0.5));
l9_971=mix(l9_973,1.0-l9_973,fast::clamp(l9_975,0.0,1.0));
}
}
l9_955.y=l9_971;
if (l9_959)
{
bool l9_976=l9_961;
bool l9_977;
if (l9_976)
{
l9_977=l9_958.x==3;
}
else
{
l9_977=l9_976;
}
float l9_978=l9_955.x;
float l9_979=l9_960.x;
float l9_980=l9_960.z;
bool l9_981=l9_977;
float l9_982=l9_965;
float l9_983=fast::clamp(l9_978,l9_979,l9_980);
float l9_984=step(abs(l9_978-l9_983),9.9999997e-06);
l9_982*=(l9_984+((1.0-float(l9_981))*(1.0-l9_984)));
l9_978=l9_983;
l9_955.x=l9_978;
l9_965=l9_982;
bool l9_985=l9_961;
bool l9_986;
if (l9_985)
{
l9_986=l9_958.y==3;
}
else
{
l9_986=l9_985;
}
float l9_987=l9_955.y;
float l9_988=l9_960.y;
float l9_989=l9_960.w;
bool l9_990=l9_986;
float l9_991=l9_965;
float l9_992=fast::clamp(l9_987,l9_988,l9_989);
float l9_993=step(abs(l9_987-l9_992),9.9999997e-06);
l9_991*=(l9_993+((1.0-float(l9_990))*(1.0-l9_993)));
l9_987=l9_992;
l9_955.y=l9_987;
l9_965=l9_991;
}
float2 l9_994=l9_955;
bool l9_995=l9_956;
float3x3 l9_996=l9_957;
if (l9_995)
{
l9_994=float2((l9_996*float3(l9_994,1.0)).xy);
}
float2 l9_997=l9_994;
l9_955=l9_997;
float l9_998=l9_955.x;
int l9_999=l9_958.x;
bool l9_1000=l9_964;
float l9_1001=l9_965;
if ((l9_999==0)||(l9_999==3))
{
float l9_1002=l9_998;
float l9_1003=0.0;
float l9_1004=1.0;
bool l9_1005=l9_1000;
float l9_1006=l9_1001;
float l9_1007=fast::clamp(l9_1002,l9_1003,l9_1004);
float l9_1008=step(abs(l9_1002-l9_1007),9.9999997e-06);
l9_1006*=(l9_1008+((1.0-float(l9_1005))*(1.0-l9_1008)));
l9_1002=l9_1007;
l9_998=l9_1002;
l9_1001=l9_1006;
}
l9_955.x=l9_998;
l9_965=l9_1001;
float l9_1009=l9_955.y;
int l9_1010=l9_958.y;
bool l9_1011=l9_964;
float l9_1012=l9_965;
if ((l9_1010==0)||(l9_1010==3))
{
float l9_1013=l9_1009;
float l9_1014=0.0;
float l9_1015=1.0;
bool l9_1016=l9_1011;
float l9_1017=l9_1012;
float l9_1018=fast::clamp(l9_1013,l9_1014,l9_1015);
float l9_1019=step(abs(l9_1013-l9_1018),9.9999997e-06);
l9_1017*=(l9_1019+((1.0-float(l9_1016))*(1.0-l9_1019)));
l9_1013=l9_1018;
l9_1009=l9_1013;
l9_1012=l9_1017;
}
l9_955.y=l9_1009;
l9_965=l9_1012;
float2 l9_1020=l9_955;
int l9_1021=l9_953;
int l9_1022=l9_954;
float l9_1023=l9_963;
float2 l9_1024=l9_1020;
int l9_1025=l9_1021;
int l9_1026=l9_1022;
float3 l9_1027=float3(0.0);
if (l9_1025==0)
{
l9_1027=float3(l9_1024,0.0);
}
else
{
if (l9_1025==1)
{
l9_1027=float3(l9_1024.x,(l9_1024.y*0.5)+(0.5-(float(l9_1026)*0.5)),0.0);
}
else
{
l9_1027=float3(l9_1024,float(l9_1026));
}
}
float3 l9_1028=l9_1027;
float3 l9_1029=l9_1028;
float4 l9_1030=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_1029.xy,bias(l9_1023));
float4 l9_1031=l9_1030;
if (l9_961)
{
l9_1031=mix(l9_962,l9_1031,float4(l9_965));
}
float4 l9_1032=l9_1031;
l9_946=l9_1032;
l9_729=l9_946;
l9_732=l9_729;
}
else
{
l9_732=l9_730;
}
l9_728=l9_732;
float4 l9_1033=float4(0.0);
l9_1033=l9_727*l9_728;
float4 l9_1034=float4(0.0);
l9_1034=l9_1033;
float4 l9_1035=float4(0.0);
l9_1035=l9_1034;
float l9_1036=0.0;
float l9_1037=0.0;
float l9_1038=0.0;
float3 l9_1039=l9_1035.xyz;
float l9_1040=l9_1039.x;
float l9_1041=l9_1039.y;
float l9_1042=l9_1039.z;
l9_1036=l9_1040;
l9_1037=l9_1041;
l9_1038=l9_1042;
float3 l9_1043=float3(0.0);
l9_1043=l9_708*float3(l9_1036);
float3 l9_1044=float3(0.0);
float3 l9_1045=(*sc_set0.UserUniforms).recolorGreen;
l9_1044=l9_1045;
float3 l9_1046=float3(0.0);
l9_1046=l9_1044;
float3 l9_1047=float3(0.0);
l9_1047=l9_1046*float3(l9_1037);
float3 l9_1048=float3(0.0);
float3 l9_1049=(*sc_set0.UserUniforms).recolorBlue;
l9_1048=l9_1049;
float3 l9_1050=float3(0.0);
l9_1050=l9_1048;
float3 l9_1051=float3(0.0);
l9_1051=l9_1050*float3(l9_1038);
float3 l9_1052=float3(0.0);
l9_1052=(l9_1043+l9_1047)+l9_1051;
l9_702=l9_1052;
l9_705=l9_702;
}
else
{
float2 l9_1053=float2(0.0);
l9_1053=l9_704.Surface_UVCoord0;
float l9_1054=0.0;
float4 l9_1055=float4(l9_1053,0.0,0.0);
float l9_1056=l9_1055.y;
l9_1054=l9_1056;
float4 l9_1057=float4(0.0);
float4 l9_1058=(*sc_set0.UserUniforms).Tweak_N81;
l9_1057=l9_1058;
float4 l9_1059=float4(0.0);
float4 l9_1060=(*sc_set0.UserUniforms).baseColor;
l9_1059=l9_1060;
float4 l9_1061=float4(0.0);
float l9_1062=l9_1054;
float4 l9_1063=l9_1057;
float l9_1064=(*sc_set0.UserUniforms).Port_Position1_N078;
float4 l9_1065=l9_1057;
float4 l9_1066=l9_1059;
l9_1062=fast::clamp(l9_1062,0.0,1.0);
float4 l9_1067;
if (l9_1062<l9_1064)
{
l9_1067=mix(l9_1063,l9_1065,float4(fast::clamp(l9_1062/l9_1064,0.0,1.0)));
}
else
{
l9_1067=mix(l9_1065,l9_1066,float4(fast::clamp((l9_1062-l9_1064)/(1.0-l9_1064),0.0,1.0)));
}
bool l9_1068=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_1069;
if (l9_1068)
{
l9_1069=!PreviewInfo.Saved;
}
else
{
l9_1069=l9_1068;
}
bool l9_1070;
if (l9_1069)
{
l9_1070=78==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_1070=l9_1069;
}
if (l9_1070)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_1067;
PreviewInfo.Color.w=1.0;
}
l9_1061=l9_1067;
float4 l9_1071=float4(0.0);
l9_1071=l9_1061;
float4 l9_1072=float4(0.0);
float4 l9_1073=float4(0.0);
float4 l9_1074=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals l9_1075=l9_704;
float4 l9_1076;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_1077=float2(0.0);
float2 l9_1078=float2(0.0);
float2 l9_1079=float2(0.0);
float2 l9_1080=float2(0.0);
float2 l9_1081=float2(0.0);
float2 l9_1082=float2(0.0);
ssGlobals l9_1083=l9_1075;
float2 l9_1084;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_1085=float2(0.0);
l9_1085=l9_1083.Surface_UVCoord0;
l9_1078=l9_1085;
l9_1084=l9_1078;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_1086=float2(0.0);
l9_1086=l9_1083.Surface_UVCoord1;
l9_1079=l9_1086;
l9_1084=l9_1079;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_1087=float2(0.0);
float2 l9_1088=float2(0.0);
float2 l9_1089=float2(0.0);
ssGlobals l9_1090=l9_1083;
float2 l9_1091;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1092=float2(0.0);
float2 l9_1093=float2(0.0);
float2 l9_1094=float2(0.0);
ssGlobals l9_1095=l9_1090;
float2 l9_1096;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1097=float2(0.0);
float2 l9_1098=float2(0.0);
float2 l9_1099=float2(0.0);
float2 l9_1100=float2(0.0);
float2 l9_1101=float2(0.0);
ssGlobals l9_1102=l9_1095;
float2 l9_1103;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1104=float2(0.0);
l9_1104=l9_1102.Surface_UVCoord0;
l9_1098=l9_1104;
l9_1103=l9_1098;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1105=float2(0.0);
l9_1105=l9_1102.Surface_UVCoord1;
l9_1099=l9_1105;
l9_1103=l9_1099;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1106=float2(0.0);
l9_1106=l9_1102.gScreenCoord;
l9_1100=l9_1106;
l9_1103=l9_1100;
}
else
{
float2 l9_1107=float2(0.0);
l9_1107=l9_1102.Surface_UVCoord0;
l9_1101=l9_1107;
l9_1103=l9_1101;
}
}
}
l9_1097=l9_1103;
float2 l9_1108=float2(0.0);
float2 l9_1109=(*sc_set0.UserUniforms).uv2Scale;
l9_1108=l9_1109;
float2 l9_1110=float2(0.0);
l9_1110=l9_1108;
float2 l9_1111=float2(0.0);
float2 l9_1112=(*sc_set0.UserUniforms).uv2Offset;
l9_1111=l9_1112;
float2 l9_1113=float2(0.0);
l9_1113=l9_1111;
float2 l9_1114=float2(0.0);
l9_1114=(l9_1097*l9_1110)+l9_1113;
float2 l9_1115=float2(0.0);
l9_1115=l9_1114+(l9_1113*(l9_1095.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1093=l9_1115;
l9_1096=l9_1093;
}
else
{
float2 l9_1116=float2(0.0);
float2 l9_1117=float2(0.0);
float2 l9_1118=float2(0.0);
float2 l9_1119=float2(0.0);
float2 l9_1120=float2(0.0);
ssGlobals l9_1121=l9_1095;
float2 l9_1122;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1123=float2(0.0);
l9_1123=l9_1121.Surface_UVCoord0;
l9_1117=l9_1123;
l9_1122=l9_1117;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1124=float2(0.0);
l9_1124=l9_1121.Surface_UVCoord1;
l9_1118=l9_1124;
l9_1122=l9_1118;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1125=float2(0.0);
l9_1125=l9_1121.gScreenCoord;
l9_1119=l9_1125;
l9_1122=l9_1119;
}
else
{
float2 l9_1126=float2(0.0);
l9_1126=l9_1121.Surface_UVCoord0;
l9_1120=l9_1126;
l9_1122=l9_1120;
}
}
}
l9_1116=l9_1122;
float2 l9_1127=float2(0.0);
float2 l9_1128=(*sc_set0.UserUniforms).uv2Scale;
l9_1127=l9_1128;
float2 l9_1129=float2(0.0);
l9_1129=l9_1127;
float2 l9_1130=float2(0.0);
float2 l9_1131=(*sc_set0.UserUniforms).uv2Offset;
l9_1130=l9_1131;
float2 l9_1132=float2(0.0);
l9_1132=l9_1130;
float2 l9_1133=float2(0.0);
l9_1133=(l9_1116*l9_1129)+l9_1132;
l9_1094=l9_1133;
l9_1096=l9_1094;
}
l9_1092=l9_1096;
l9_1088=l9_1092;
l9_1091=l9_1088;
}
else
{
float2 l9_1134=float2(0.0);
l9_1134=l9_1090.Surface_UVCoord0;
l9_1089=l9_1134;
l9_1091=l9_1089;
}
l9_1087=l9_1091;
float2 l9_1135=float2(0.0);
l9_1135=l9_1087;
float2 l9_1136=float2(0.0);
l9_1136=l9_1135;
l9_1080=l9_1136;
l9_1084=l9_1080;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_1137=float2(0.0);
float2 l9_1138=float2(0.0);
float2 l9_1139=float2(0.0);
ssGlobals l9_1140=l9_1083;
float2 l9_1141;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_1142=float2(0.0);
float2 l9_1143=float2(0.0);
float2 l9_1144=float2(0.0);
ssGlobals l9_1145=l9_1140;
float2 l9_1146;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_1147=float2(0.0);
float2 l9_1148=float2(0.0);
float2 l9_1149=float2(0.0);
float2 l9_1150=float2(0.0);
float2 l9_1151=float2(0.0);
float2 l9_1152=float2(0.0);
ssGlobals l9_1153=l9_1145;
float2 l9_1154;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1155=float2(0.0);
l9_1155=l9_1153.Surface_UVCoord0;
l9_1148=l9_1155;
l9_1154=l9_1148;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1156=float2(0.0);
l9_1156=l9_1153.Surface_UVCoord1;
l9_1149=l9_1156;
l9_1154=l9_1149;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1157=float2(0.0);
l9_1157=l9_1153.gScreenCoord;
l9_1150=l9_1157;
l9_1154=l9_1150;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1158=float2(0.0);
float2 l9_1159=float2(0.0);
float2 l9_1160=float2(0.0);
ssGlobals l9_1161=l9_1153;
float2 l9_1162;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1163=float2(0.0);
float2 l9_1164=float2(0.0);
float2 l9_1165=float2(0.0);
ssGlobals l9_1166=l9_1161;
float2 l9_1167;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1168=float2(0.0);
float2 l9_1169=float2(0.0);
float2 l9_1170=float2(0.0);
float2 l9_1171=float2(0.0);
float2 l9_1172=float2(0.0);
ssGlobals l9_1173=l9_1166;
float2 l9_1174;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1175=float2(0.0);
l9_1175=l9_1173.Surface_UVCoord0;
l9_1169=l9_1175;
l9_1174=l9_1169;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1176=float2(0.0);
l9_1176=l9_1173.Surface_UVCoord1;
l9_1170=l9_1176;
l9_1174=l9_1170;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1177=float2(0.0);
l9_1177=l9_1173.gScreenCoord;
l9_1171=l9_1177;
l9_1174=l9_1171;
}
else
{
float2 l9_1178=float2(0.0);
l9_1178=l9_1173.Surface_UVCoord0;
l9_1172=l9_1178;
l9_1174=l9_1172;
}
}
}
l9_1168=l9_1174;
float2 l9_1179=float2(0.0);
float2 l9_1180=(*sc_set0.UserUniforms).uv2Scale;
l9_1179=l9_1180;
float2 l9_1181=float2(0.0);
l9_1181=l9_1179;
float2 l9_1182=float2(0.0);
float2 l9_1183=(*sc_set0.UserUniforms).uv2Offset;
l9_1182=l9_1183;
float2 l9_1184=float2(0.0);
l9_1184=l9_1182;
float2 l9_1185=float2(0.0);
l9_1185=(l9_1168*l9_1181)+l9_1184;
float2 l9_1186=float2(0.0);
l9_1186=l9_1185+(l9_1184*(l9_1166.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1164=l9_1186;
l9_1167=l9_1164;
}
else
{
float2 l9_1187=float2(0.0);
float2 l9_1188=float2(0.0);
float2 l9_1189=float2(0.0);
float2 l9_1190=float2(0.0);
float2 l9_1191=float2(0.0);
ssGlobals l9_1192=l9_1166;
float2 l9_1193;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1194=float2(0.0);
l9_1194=l9_1192.Surface_UVCoord0;
l9_1188=l9_1194;
l9_1193=l9_1188;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1195=float2(0.0);
l9_1195=l9_1192.Surface_UVCoord1;
l9_1189=l9_1195;
l9_1193=l9_1189;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1196=float2(0.0);
l9_1196=l9_1192.gScreenCoord;
l9_1190=l9_1196;
l9_1193=l9_1190;
}
else
{
float2 l9_1197=float2(0.0);
l9_1197=l9_1192.Surface_UVCoord0;
l9_1191=l9_1197;
l9_1193=l9_1191;
}
}
}
l9_1187=l9_1193;
float2 l9_1198=float2(0.0);
float2 l9_1199=(*sc_set0.UserUniforms).uv2Scale;
l9_1198=l9_1199;
float2 l9_1200=float2(0.0);
l9_1200=l9_1198;
float2 l9_1201=float2(0.0);
float2 l9_1202=(*sc_set0.UserUniforms).uv2Offset;
l9_1201=l9_1202;
float2 l9_1203=float2(0.0);
l9_1203=l9_1201;
float2 l9_1204=float2(0.0);
l9_1204=(l9_1187*l9_1200)+l9_1203;
l9_1165=l9_1204;
l9_1167=l9_1165;
}
l9_1163=l9_1167;
l9_1159=l9_1163;
l9_1162=l9_1159;
}
else
{
float2 l9_1205=float2(0.0);
l9_1205=l9_1161.Surface_UVCoord0;
l9_1160=l9_1205;
l9_1162=l9_1160;
}
l9_1158=l9_1162;
float2 l9_1206=float2(0.0);
l9_1206=l9_1158;
float2 l9_1207=float2(0.0);
l9_1207=l9_1206;
l9_1151=l9_1207;
l9_1154=l9_1151;
}
else
{
float2 l9_1208=float2(0.0);
l9_1208=l9_1153.Surface_UVCoord0;
l9_1152=l9_1208;
l9_1154=l9_1152;
}
}
}
}
l9_1147=l9_1154;
float2 l9_1209=float2(0.0);
float2 l9_1210=(*sc_set0.UserUniforms).uv3Scale;
l9_1209=l9_1210;
float2 l9_1211=float2(0.0);
l9_1211=l9_1209;
float2 l9_1212=float2(0.0);
float2 l9_1213=(*sc_set0.UserUniforms).uv3Offset;
l9_1212=l9_1213;
float2 l9_1214=float2(0.0);
l9_1214=l9_1212;
float2 l9_1215=float2(0.0);
l9_1215=(l9_1147*l9_1211)+l9_1214;
float2 l9_1216=float2(0.0);
l9_1216=l9_1215+(l9_1214*(l9_1145.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_1143=l9_1216;
l9_1146=l9_1143;
}
else
{
float2 l9_1217=float2(0.0);
float2 l9_1218=float2(0.0);
float2 l9_1219=float2(0.0);
float2 l9_1220=float2(0.0);
float2 l9_1221=float2(0.0);
float2 l9_1222=float2(0.0);
ssGlobals l9_1223=l9_1145;
float2 l9_1224;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1225=float2(0.0);
l9_1225=l9_1223.Surface_UVCoord0;
l9_1218=l9_1225;
l9_1224=l9_1218;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1226=float2(0.0);
l9_1226=l9_1223.Surface_UVCoord1;
l9_1219=l9_1226;
l9_1224=l9_1219;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1227=float2(0.0);
l9_1227=l9_1223.gScreenCoord;
l9_1220=l9_1227;
l9_1224=l9_1220;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1228=float2(0.0);
float2 l9_1229=float2(0.0);
float2 l9_1230=float2(0.0);
ssGlobals l9_1231=l9_1223;
float2 l9_1232;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1233=float2(0.0);
float2 l9_1234=float2(0.0);
float2 l9_1235=float2(0.0);
ssGlobals l9_1236=l9_1231;
float2 l9_1237;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1238=float2(0.0);
float2 l9_1239=float2(0.0);
float2 l9_1240=float2(0.0);
float2 l9_1241=float2(0.0);
float2 l9_1242=float2(0.0);
ssGlobals l9_1243=l9_1236;
float2 l9_1244;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1245=float2(0.0);
l9_1245=l9_1243.Surface_UVCoord0;
l9_1239=l9_1245;
l9_1244=l9_1239;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1246=float2(0.0);
l9_1246=l9_1243.Surface_UVCoord1;
l9_1240=l9_1246;
l9_1244=l9_1240;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1247=float2(0.0);
l9_1247=l9_1243.gScreenCoord;
l9_1241=l9_1247;
l9_1244=l9_1241;
}
else
{
float2 l9_1248=float2(0.0);
l9_1248=l9_1243.Surface_UVCoord0;
l9_1242=l9_1248;
l9_1244=l9_1242;
}
}
}
l9_1238=l9_1244;
float2 l9_1249=float2(0.0);
float2 l9_1250=(*sc_set0.UserUniforms).uv2Scale;
l9_1249=l9_1250;
float2 l9_1251=float2(0.0);
l9_1251=l9_1249;
float2 l9_1252=float2(0.0);
float2 l9_1253=(*sc_set0.UserUniforms).uv2Offset;
l9_1252=l9_1253;
float2 l9_1254=float2(0.0);
l9_1254=l9_1252;
float2 l9_1255=float2(0.0);
l9_1255=(l9_1238*l9_1251)+l9_1254;
float2 l9_1256=float2(0.0);
l9_1256=l9_1255+(l9_1254*(l9_1236.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1234=l9_1256;
l9_1237=l9_1234;
}
else
{
float2 l9_1257=float2(0.0);
float2 l9_1258=float2(0.0);
float2 l9_1259=float2(0.0);
float2 l9_1260=float2(0.0);
float2 l9_1261=float2(0.0);
ssGlobals l9_1262=l9_1236;
float2 l9_1263;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1264=float2(0.0);
l9_1264=l9_1262.Surface_UVCoord0;
l9_1258=l9_1264;
l9_1263=l9_1258;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1265=float2(0.0);
l9_1265=l9_1262.Surface_UVCoord1;
l9_1259=l9_1265;
l9_1263=l9_1259;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1266=float2(0.0);
l9_1266=l9_1262.gScreenCoord;
l9_1260=l9_1266;
l9_1263=l9_1260;
}
else
{
float2 l9_1267=float2(0.0);
l9_1267=l9_1262.Surface_UVCoord0;
l9_1261=l9_1267;
l9_1263=l9_1261;
}
}
}
l9_1257=l9_1263;
float2 l9_1268=float2(0.0);
float2 l9_1269=(*sc_set0.UserUniforms).uv2Scale;
l9_1268=l9_1269;
float2 l9_1270=float2(0.0);
l9_1270=l9_1268;
float2 l9_1271=float2(0.0);
float2 l9_1272=(*sc_set0.UserUniforms).uv2Offset;
l9_1271=l9_1272;
float2 l9_1273=float2(0.0);
l9_1273=l9_1271;
float2 l9_1274=float2(0.0);
l9_1274=(l9_1257*l9_1270)+l9_1273;
l9_1235=l9_1274;
l9_1237=l9_1235;
}
l9_1233=l9_1237;
l9_1229=l9_1233;
l9_1232=l9_1229;
}
else
{
float2 l9_1275=float2(0.0);
l9_1275=l9_1231.Surface_UVCoord0;
l9_1230=l9_1275;
l9_1232=l9_1230;
}
l9_1228=l9_1232;
float2 l9_1276=float2(0.0);
l9_1276=l9_1228;
float2 l9_1277=float2(0.0);
l9_1277=l9_1276;
l9_1221=l9_1277;
l9_1224=l9_1221;
}
else
{
float2 l9_1278=float2(0.0);
l9_1278=l9_1223.Surface_UVCoord0;
l9_1222=l9_1278;
l9_1224=l9_1222;
}
}
}
}
l9_1217=l9_1224;
float2 l9_1279=float2(0.0);
float2 l9_1280=(*sc_set0.UserUniforms).uv3Scale;
l9_1279=l9_1280;
float2 l9_1281=float2(0.0);
l9_1281=l9_1279;
float2 l9_1282=float2(0.0);
float2 l9_1283=(*sc_set0.UserUniforms).uv3Offset;
l9_1282=l9_1283;
float2 l9_1284=float2(0.0);
l9_1284=l9_1282;
float2 l9_1285=float2(0.0);
l9_1285=(l9_1217*l9_1281)+l9_1284;
l9_1144=l9_1285;
l9_1146=l9_1144;
}
l9_1142=l9_1146;
l9_1138=l9_1142;
l9_1141=l9_1138;
}
else
{
float2 l9_1286=float2(0.0);
l9_1286=l9_1140.Surface_UVCoord0;
l9_1139=l9_1286;
l9_1141=l9_1139;
}
l9_1137=l9_1141;
float2 l9_1287=float2(0.0);
l9_1287=l9_1137;
float2 l9_1288=float2(0.0);
l9_1288=l9_1287;
l9_1081=l9_1288;
l9_1084=l9_1081;
}
else
{
float2 l9_1289=float2(0.0);
l9_1289=l9_1083.Surface_UVCoord0;
l9_1082=l9_1289;
l9_1084=l9_1082;
}
}
}
}
l9_1077=l9_1084;
float4 l9_1290=float4(0.0);
int l9_1291;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_1292=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1292=0;
}
else
{
l9_1292=in.varStereoViewID;
}
int l9_1293=l9_1292;
l9_1291=1-l9_1293;
}
else
{
int l9_1294=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1294=0;
}
else
{
l9_1294=in.varStereoViewID;
}
int l9_1295=l9_1294;
l9_1291=l9_1295;
}
int l9_1296=l9_1291;
int l9_1297=baseTexLayout_tmp;
int l9_1298=l9_1296;
float2 l9_1299=l9_1077;
bool l9_1300=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_1301=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_1302=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_1303=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_1304=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_1305=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_1306=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_1307=0.0;
bool l9_1308=l9_1305&&(!l9_1303);
float l9_1309=1.0;
float l9_1310=l9_1299.x;
int l9_1311=l9_1302.x;
if (l9_1311==1)
{
l9_1310=fract(l9_1310);
}
else
{
if (l9_1311==2)
{
float l9_1312=fract(l9_1310);
float l9_1313=l9_1310-l9_1312;
float l9_1314=step(0.25,fract(l9_1313*0.5));
l9_1310=mix(l9_1312,1.0-l9_1312,fast::clamp(l9_1314,0.0,1.0));
}
}
l9_1299.x=l9_1310;
float l9_1315=l9_1299.y;
int l9_1316=l9_1302.y;
if (l9_1316==1)
{
l9_1315=fract(l9_1315);
}
else
{
if (l9_1316==2)
{
float l9_1317=fract(l9_1315);
float l9_1318=l9_1315-l9_1317;
float l9_1319=step(0.25,fract(l9_1318*0.5));
l9_1315=mix(l9_1317,1.0-l9_1317,fast::clamp(l9_1319,0.0,1.0));
}
}
l9_1299.y=l9_1315;
if (l9_1303)
{
bool l9_1320=l9_1305;
bool l9_1321;
if (l9_1320)
{
l9_1321=l9_1302.x==3;
}
else
{
l9_1321=l9_1320;
}
float l9_1322=l9_1299.x;
float l9_1323=l9_1304.x;
float l9_1324=l9_1304.z;
bool l9_1325=l9_1321;
float l9_1326=l9_1309;
float l9_1327=fast::clamp(l9_1322,l9_1323,l9_1324);
float l9_1328=step(abs(l9_1322-l9_1327),9.9999997e-06);
l9_1326*=(l9_1328+((1.0-float(l9_1325))*(1.0-l9_1328)));
l9_1322=l9_1327;
l9_1299.x=l9_1322;
l9_1309=l9_1326;
bool l9_1329=l9_1305;
bool l9_1330;
if (l9_1329)
{
l9_1330=l9_1302.y==3;
}
else
{
l9_1330=l9_1329;
}
float l9_1331=l9_1299.y;
float l9_1332=l9_1304.y;
float l9_1333=l9_1304.w;
bool l9_1334=l9_1330;
float l9_1335=l9_1309;
float l9_1336=fast::clamp(l9_1331,l9_1332,l9_1333);
float l9_1337=step(abs(l9_1331-l9_1336),9.9999997e-06);
l9_1335*=(l9_1337+((1.0-float(l9_1334))*(1.0-l9_1337)));
l9_1331=l9_1336;
l9_1299.y=l9_1331;
l9_1309=l9_1335;
}
float2 l9_1338=l9_1299;
bool l9_1339=l9_1300;
float3x3 l9_1340=l9_1301;
if (l9_1339)
{
l9_1338=float2((l9_1340*float3(l9_1338,1.0)).xy);
}
float2 l9_1341=l9_1338;
l9_1299=l9_1341;
float l9_1342=l9_1299.x;
int l9_1343=l9_1302.x;
bool l9_1344=l9_1308;
float l9_1345=l9_1309;
if ((l9_1343==0)||(l9_1343==3))
{
float l9_1346=l9_1342;
float l9_1347=0.0;
float l9_1348=1.0;
bool l9_1349=l9_1344;
float l9_1350=l9_1345;
float l9_1351=fast::clamp(l9_1346,l9_1347,l9_1348);
float l9_1352=step(abs(l9_1346-l9_1351),9.9999997e-06);
l9_1350*=(l9_1352+((1.0-float(l9_1349))*(1.0-l9_1352)));
l9_1346=l9_1351;
l9_1342=l9_1346;
l9_1345=l9_1350;
}
l9_1299.x=l9_1342;
l9_1309=l9_1345;
float l9_1353=l9_1299.y;
int l9_1354=l9_1302.y;
bool l9_1355=l9_1308;
float l9_1356=l9_1309;
if ((l9_1354==0)||(l9_1354==3))
{
float l9_1357=l9_1353;
float l9_1358=0.0;
float l9_1359=1.0;
bool l9_1360=l9_1355;
float l9_1361=l9_1356;
float l9_1362=fast::clamp(l9_1357,l9_1358,l9_1359);
float l9_1363=step(abs(l9_1357-l9_1362),9.9999997e-06);
l9_1361*=(l9_1363+((1.0-float(l9_1360))*(1.0-l9_1363)));
l9_1357=l9_1362;
l9_1353=l9_1357;
l9_1356=l9_1361;
}
l9_1299.y=l9_1353;
l9_1309=l9_1356;
float2 l9_1364=l9_1299;
int l9_1365=l9_1297;
int l9_1366=l9_1298;
float l9_1367=l9_1307;
float2 l9_1368=l9_1364;
int l9_1369=l9_1365;
int l9_1370=l9_1366;
float3 l9_1371=float3(0.0);
if (l9_1369==0)
{
l9_1371=float3(l9_1368,0.0);
}
else
{
if (l9_1369==1)
{
l9_1371=float3(l9_1368.x,(l9_1368.y*0.5)+(0.5-(float(l9_1370)*0.5)),0.0);
}
else
{
l9_1371=float3(l9_1368,float(l9_1370));
}
}
float3 l9_1372=l9_1371;
float3 l9_1373=l9_1372;
float4 l9_1374=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_1373.xy,bias(l9_1367));
float4 l9_1375=l9_1374;
if (l9_1305)
{
l9_1375=mix(l9_1306,l9_1375,float4(l9_1309));
}
float4 l9_1376=l9_1375;
l9_1290=l9_1376;
l9_1073=l9_1290;
l9_1076=l9_1073;
}
else
{
l9_1076=l9_1074;
}
l9_1072=l9_1076;
float4 l9_1377=float4(0.0);
l9_1377=l9_1071*l9_1072;
float4 l9_1378=float4(0.0);
l9_1378=l9_1377;
float4 l9_1379=float4(0.0);
l9_1379=l9_1378;
l9_703=l9_1379.xyz;
l9_705=l9_703;
}
l9_701=l9_705;
float3 l9_1380=float3(0.0);
l9_1380=l9_701;
float3 l9_1381=float3(0.0);
l9_1381=l9_1380;
float4 l9_1382=float4(0.0);
l9_1382=float4(l9_1381.x,l9_1381.y,l9_1381.z,l9_1382.w);
l9_1382.w=(*sc_set0.UserUniforms).Port_Value2_N073;
param_2=l9_1382;
param_3=param_2;
}
Result_N363=param_3;
float4 Export_N364=float4(0.0);
Export_N364=Result_N363;
float2 UVCoord_N77=float2(0.0);
UVCoord_N77=Globals.Surface_UVCoord0;
float Value2_N79=0.0;
float4 param_5=float4(UVCoord_N77,0.0,0.0);
float param_6=param_5.y;
Value2_N79=param_6;
float4 Output_N81=float4(0.0);
float4 param_7=(*sc_set0.UserUniforms).Tweak_N81;
Output_N81=param_7;
float4 Output_N5=float4(0.0);
float4 param_8=(*sc_set0.UserUniforms).baseColor;
Output_N5=param_8;
float4 Value_N78=float4(0.0);
float param_9=Value2_N79;
float4 param_10=Output_N81;
float param_11=(*sc_set0.UserUniforms).Port_Position1_N078;
float4 param_12=Output_N81;
float4 param_13=Output_N5;
param_9=fast::clamp(param_9,0.0,1.0);
float4 param_14;
if (param_9<param_11)
{
param_14=mix(param_10,param_12,float4(fast::clamp(param_9/param_11,0.0,1.0)));
}
else
{
param_14=mix(param_12,param_13,float4(fast::clamp((param_9-param_11)/(1.0-param_11),0.0,1.0)));
}
bool l9_1383=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_1384;
if (l9_1383)
{
l9_1384=!PreviewInfo.Saved;
}
else
{
l9_1384=l9_1383;
}
bool l9_1385;
if (l9_1384)
{
l9_1385=78==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_1385=l9_1384;
}
if (l9_1385)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=param_14;
PreviewInfo.Color.w=1.0;
}
Value_N78=param_14;
float4 Value_N384=float4(0.0);
Value_N384=Value_N78;
float4 Result_N369=float4(0.0);
float4 param_15=float4(0.0);
float4 param_16=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals param_18=Globals;
float4 param_17;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_1386=float2(0.0);
float2 l9_1387=float2(0.0);
float2 l9_1388=float2(0.0);
float2 l9_1389=float2(0.0);
float2 l9_1390=float2(0.0);
float2 l9_1391=float2(0.0);
ssGlobals l9_1392=param_18;
float2 l9_1393;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_1394=float2(0.0);
l9_1394=l9_1392.Surface_UVCoord0;
l9_1387=l9_1394;
l9_1393=l9_1387;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_1395=float2(0.0);
l9_1395=l9_1392.Surface_UVCoord1;
l9_1388=l9_1395;
l9_1393=l9_1388;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_1396=float2(0.0);
float2 l9_1397=float2(0.0);
float2 l9_1398=float2(0.0);
ssGlobals l9_1399=l9_1392;
float2 l9_1400;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1401=float2(0.0);
float2 l9_1402=float2(0.0);
float2 l9_1403=float2(0.0);
ssGlobals l9_1404=l9_1399;
float2 l9_1405;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1406=float2(0.0);
float2 l9_1407=float2(0.0);
float2 l9_1408=float2(0.0);
float2 l9_1409=float2(0.0);
float2 l9_1410=float2(0.0);
ssGlobals l9_1411=l9_1404;
float2 l9_1412;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1413=float2(0.0);
l9_1413=l9_1411.Surface_UVCoord0;
l9_1407=l9_1413;
l9_1412=l9_1407;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1414=float2(0.0);
l9_1414=l9_1411.Surface_UVCoord1;
l9_1408=l9_1414;
l9_1412=l9_1408;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1415=float2(0.0);
l9_1415=l9_1411.gScreenCoord;
l9_1409=l9_1415;
l9_1412=l9_1409;
}
else
{
float2 l9_1416=float2(0.0);
l9_1416=l9_1411.Surface_UVCoord0;
l9_1410=l9_1416;
l9_1412=l9_1410;
}
}
}
l9_1406=l9_1412;
float2 l9_1417=float2(0.0);
float2 l9_1418=(*sc_set0.UserUniforms).uv2Scale;
l9_1417=l9_1418;
float2 l9_1419=float2(0.0);
l9_1419=l9_1417;
float2 l9_1420=float2(0.0);
float2 l9_1421=(*sc_set0.UserUniforms).uv2Offset;
l9_1420=l9_1421;
float2 l9_1422=float2(0.0);
l9_1422=l9_1420;
float2 l9_1423=float2(0.0);
l9_1423=(l9_1406*l9_1419)+l9_1422;
float2 l9_1424=float2(0.0);
l9_1424=l9_1423+(l9_1422*(l9_1404.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1402=l9_1424;
l9_1405=l9_1402;
}
else
{
float2 l9_1425=float2(0.0);
float2 l9_1426=float2(0.0);
float2 l9_1427=float2(0.0);
float2 l9_1428=float2(0.0);
float2 l9_1429=float2(0.0);
ssGlobals l9_1430=l9_1404;
float2 l9_1431;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1432=float2(0.0);
l9_1432=l9_1430.Surface_UVCoord0;
l9_1426=l9_1432;
l9_1431=l9_1426;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1433=float2(0.0);
l9_1433=l9_1430.Surface_UVCoord1;
l9_1427=l9_1433;
l9_1431=l9_1427;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1434=float2(0.0);
l9_1434=l9_1430.gScreenCoord;
l9_1428=l9_1434;
l9_1431=l9_1428;
}
else
{
float2 l9_1435=float2(0.0);
l9_1435=l9_1430.Surface_UVCoord0;
l9_1429=l9_1435;
l9_1431=l9_1429;
}
}
}
l9_1425=l9_1431;
float2 l9_1436=float2(0.0);
float2 l9_1437=(*sc_set0.UserUniforms).uv2Scale;
l9_1436=l9_1437;
float2 l9_1438=float2(0.0);
l9_1438=l9_1436;
float2 l9_1439=float2(0.0);
float2 l9_1440=(*sc_set0.UserUniforms).uv2Offset;
l9_1439=l9_1440;
float2 l9_1441=float2(0.0);
l9_1441=l9_1439;
float2 l9_1442=float2(0.0);
l9_1442=(l9_1425*l9_1438)+l9_1441;
l9_1403=l9_1442;
l9_1405=l9_1403;
}
l9_1401=l9_1405;
l9_1397=l9_1401;
l9_1400=l9_1397;
}
else
{
float2 l9_1443=float2(0.0);
l9_1443=l9_1399.Surface_UVCoord0;
l9_1398=l9_1443;
l9_1400=l9_1398;
}
l9_1396=l9_1400;
float2 l9_1444=float2(0.0);
l9_1444=l9_1396;
float2 l9_1445=float2(0.0);
l9_1445=l9_1444;
l9_1389=l9_1445;
l9_1393=l9_1389;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_1446=float2(0.0);
float2 l9_1447=float2(0.0);
float2 l9_1448=float2(0.0);
ssGlobals l9_1449=l9_1392;
float2 l9_1450;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_1451=float2(0.0);
float2 l9_1452=float2(0.0);
float2 l9_1453=float2(0.0);
ssGlobals l9_1454=l9_1449;
float2 l9_1455;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_1456=float2(0.0);
float2 l9_1457=float2(0.0);
float2 l9_1458=float2(0.0);
float2 l9_1459=float2(0.0);
float2 l9_1460=float2(0.0);
float2 l9_1461=float2(0.0);
ssGlobals l9_1462=l9_1454;
float2 l9_1463;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1464=float2(0.0);
l9_1464=l9_1462.Surface_UVCoord0;
l9_1457=l9_1464;
l9_1463=l9_1457;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1465=float2(0.0);
l9_1465=l9_1462.Surface_UVCoord1;
l9_1458=l9_1465;
l9_1463=l9_1458;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1466=float2(0.0);
l9_1466=l9_1462.gScreenCoord;
l9_1459=l9_1466;
l9_1463=l9_1459;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1467=float2(0.0);
float2 l9_1468=float2(0.0);
float2 l9_1469=float2(0.0);
ssGlobals l9_1470=l9_1462;
float2 l9_1471;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1472=float2(0.0);
float2 l9_1473=float2(0.0);
float2 l9_1474=float2(0.0);
ssGlobals l9_1475=l9_1470;
float2 l9_1476;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1477=float2(0.0);
float2 l9_1478=float2(0.0);
float2 l9_1479=float2(0.0);
float2 l9_1480=float2(0.0);
float2 l9_1481=float2(0.0);
ssGlobals l9_1482=l9_1475;
float2 l9_1483;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1484=float2(0.0);
l9_1484=l9_1482.Surface_UVCoord0;
l9_1478=l9_1484;
l9_1483=l9_1478;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1485=float2(0.0);
l9_1485=l9_1482.Surface_UVCoord1;
l9_1479=l9_1485;
l9_1483=l9_1479;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1486=float2(0.0);
l9_1486=l9_1482.gScreenCoord;
l9_1480=l9_1486;
l9_1483=l9_1480;
}
else
{
float2 l9_1487=float2(0.0);
l9_1487=l9_1482.Surface_UVCoord0;
l9_1481=l9_1487;
l9_1483=l9_1481;
}
}
}
l9_1477=l9_1483;
float2 l9_1488=float2(0.0);
float2 l9_1489=(*sc_set0.UserUniforms).uv2Scale;
l9_1488=l9_1489;
float2 l9_1490=float2(0.0);
l9_1490=l9_1488;
float2 l9_1491=float2(0.0);
float2 l9_1492=(*sc_set0.UserUniforms).uv2Offset;
l9_1491=l9_1492;
float2 l9_1493=float2(0.0);
l9_1493=l9_1491;
float2 l9_1494=float2(0.0);
l9_1494=(l9_1477*l9_1490)+l9_1493;
float2 l9_1495=float2(0.0);
l9_1495=l9_1494+(l9_1493*(l9_1475.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1473=l9_1495;
l9_1476=l9_1473;
}
else
{
float2 l9_1496=float2(0.0);
float2 l9_1497=float2(0.0);
float2 l9_1498=float2(0.0);
float2 l9_1499=float2(0.0);
float2 l9_1500=float2(0.0);
ssGlobals l9_1501=l9_1475;
float2 l9_1502;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1503=float2(0.0);
l9_1503=l9_1501.Surface_UVCoord0;
l9_1497=l9_1503;
l9_1502=l9_1497;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1504=float2(0.0);
l9_1504=l9_1501.Surface_UVCoord1;
l9_1498=l9_1504;
l9_1502=l9_1498;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1505=float2(0.0);
l9_1505=l9_1501.gScreenCoord;
l9_1499=l9_1505;
l9_1502=l9_1499;
}
else
{
float2 l9_1506=float2(0.0);
l9_1506=l9_1501.Surface_UVCoord0;
l9_1500=l9_1506;
l9_1502=l9_1500;
}
}
}
l9_1496=l9_1502;
float2 l9_1507=float2(0.0);
float2 l9_1508=(*sc_set0.UserUniforms).uv2Scale;
l9_1507=l9_1508;
float2 l9_1509=float2(0.0);
l9_1509=l9_1507;
float2 l9_1510=float2(0.0);
float2 l9_1511=(*sc_set0.UserUniforms).uv2Offset;
l9_1510=l9_1511;
float2 l9_1512=float2(0.0);
l9_1512=l9_1510;
float2 l9_1513=float2(0.0);
l9_1513=(l9_1496*l9_1509)+l9_1512;
l9_1474=l9_1513;
l9_1476=l9_1474;
}
l9_1472=l9_1476;
l9_1468=l9_1472;
l9_1471=l9_1468;
}
else
{
float2 l9_1514=float2(0.0);
l9_1514=l9_1470.Surface_UVCoord0;
l9_1469=l9_1514;
l9_1471=l9_1469;
}
l9_1467=l9_1471;
float2 l9_1515=float2(0.0);
l9_1515=l9_1467;
float2 l9_1516=float2(0.0);
l9_1516=l9_1515;
l9_1460=l9_1516;
l9_1463=l9_1460;
}
else
{
float2 l9_1517=float2(0.0);
l9_1517=l9_1462.Surface_UVCoord0;
l9_1461=l9_1517;
l9_1463=l9_1461;
}
}
}
}
l9_1456=l9_1463;
float2 l9_1518=float2(0.0);
float2 l9_1519=(*sc_set0.UserUniforms).uv3Scale;
l9_1518=l9_1519;
float2 l9_1520=float2(0.0);
l9_1520=l9_1518;
float2 l9_1521=float2(0.0);
float2 l9_1522=(*sc_set0.UserUniforms).uv3Offset;
l9_1521=l9_1522;
float2 l9_1523=float2(0.0);
l9_1523=l9_1521;
float2 l9_1524=float2(0.0);
l9_1524=(l9_1456*l9_1520)+l9_1523;
float2 l9_1525=float2(0.0);
l9_1525=l9_1524+(l9_1523*(l9_1454.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_1452=l9_1525;
l9_1455=l9_1452;
}
else
{
float2 l9_1526=float2(0.0);
float2 l9_1527=float2(0.0);
float2 l9_1528=float2(0.0);
float2 l9_1529=float2(0.0);
float2 l9_1530=float2(0.0);
float2 l9_1531=float2(0.0);
ssGlobals l9_1532=l9_1454;
float2 l9_1533;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1534=float2(0.0);
l9_1534=l9_1532.Surface_UVCoord0;
l9_1527=l9_1534;
l9_1533=l9_1527;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1535=float2(0.0);
l9_1535=l9_1532.Surface_UVCoord1;
l9_1528=l9_1535;
l9_1533=l9_1528;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1536=float2(0.0);
l9_1536=l9_1532.gScreenCoord;
l9_1529=l9_1536;
l9_1533=l9_1529;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1537=float2(0.0);
float2 l9_1538=float2(0.0);
float2 l9_1539=float2(0.0);
ssGlobals l9_1540=l9_1532;
float2 l9_1541;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1542=float2(0.0);
float2 l9_1543=float2(0.0);
float2 l9_1544=float2(0.0);
ssGlobals l9_1545=l9_1540;
float2 l9_1546;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1547=float2(0.0);
float2 l9_1548=float2(0.0);
float2 l9_1549=float2(0.0);
float2 l9_1550=float2(0.0);
float2 l9_1551=float2(0.0);
ssGlobals l9_1552=l9_1545;
float2 l9_1553;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1554=float2(0.0);
l9_1554=l9_1552.Surface_UVCoord0;
l9_1548=l9_1554;
l9_1553=l9_1548;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1555=float2(0.0);
l9_1555=l9_1552.Surface_UVCoord1;
l9_1549=l9_1555;
l9_1553=l9_1549;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1556=float2(0.0);
l9_1556=l9_1552.gScreenCoord;
l9_1550=l9_1556;
l9_1553=l9_1550;
}
else
{
float2 l9_1557=float2(0.0);
l9_1557=l9_1552.Surface_UVCoord0;
l9_1551=l9_1557;
l9_1553=l9_1551;
}
}
}
l9_1547=l9_1553;
float2 l9_1558=float2(0.0);
float2 l9_1559=(*sc_set0.UserUniforms).uv2Scale;
l9_1558=l9_1559;
float2 l9_1560=float2(0.0);
l9_1560=l9_1558;
float2 l9_1561=float2(0.0);
float2 l9_1562=(*sc_set0.UserUniforms).uv2Offset;
l9_1561=l9_1562;
float2 l9_1563=float2(0.0);
l9_1563=l9_1561;
float2 l9_1564=float2(0.0);
l9_1564=(l9_1547*l9_1560)+l9_1563;
float2 l9_1565=float2(0.0);
l9_1565=l9_1564+(l9_1563*(l9_1545.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1543=l9_1565;
l9_1546=l9_1543;
}
else
{
float2 l9_1566=float2(0.0);
float2 l9_1567=float2(0.0);
float2 l9_1568=float2(0.0);
float2 l9_1569=float2(0.0);
float2 l9_1570=float2(0.0);
ssGlobals l9_1571=l9_1545;
float2 l9_1572;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1573=float2(0.0);
l9_1573=l9_1571.Surface_UVCoord0;
l9_1567=l9_1573;
l9_1572=l9_1567;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1574=float2(0.0);
l9_1574=l9_1571.Surface_UVCoord1;
l9_1568=l9_1574;
l9_1572=l9_1568;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1575=float2(0.0);
l9_1575=l9_1571.gScreenCoord;
l9_1569=l9_1575;
l9_1572=l9_1569;
}
else
{
float2 l9_1576=float2(0.0);
l9_1576=l9_1571.Surface_UVCoord0;
l9_1570=l9_1576;
l9_1572=l9_1570;
}
}
}
l9_1566=l9_1572;
float2 l9_1577=float2(0.0);
float2 l9_1578=(*sc_set0.UserUniforms).uv2Scale;
l9_1577=l9_1578;
float2 l9_1579=float2(0.0);
l9_1579=l9_1577;
float2 l9_1580=float2(0.0);
float2 l9_1581=(*sc_set0.UserUniforms).uv2Offset;
l9_1580=l9_1581;
float2 l9_1582=float2(0.0);
l9_1582=l9_1580;
float2 l9_1583=float2(0.0);
l9_1583=(l9_1566*l9_1579)+l9_1582;
l9_1544=l9_1583;
l9_1546=l9_1544;
}
l9_1542=l9_1546;
l9_1538=l9_1542;
l9_1541=l9_1538;
}
else
{
float2 l9_1584=float2(0.0);
l9_1584=l9_1540.Surface_UVCoord0;
l9_1539=l9_1584;
l9_1541=l9_1539;
}
l9_1537=l9_1541;
float2 l9_1585=float2(0.0);
l9_1585=l9_1537;
float2 l9_1586=float2(0.0);
l9_1586=l9_1585;
l9_1530=l9_1586;
l9_1533=l9_1530;
}
else
{
float2 l9_1587=float2(0.0);
l9_1587=l9_1532.Surface_UVCoord0;
l9_1531=l9_1587;
l9_1533=l9_1531;
}
}
}
}
l9_1526=l9_1533;
float2 l9_1588=float2(0.0);
float2 l9_1589=(*sc_set0.UserUniforms).uv3Scale;
l9_1588=l9_1589;
float2 l9_1590=float2(0.0);
l9_1590=l9_1588;
float2 l9_1591=float2(0.0);
float2 l9_1592=(*sc_set0.UserUniforms).uv3Offset;
l9_1591=l9_1592;
float2 l9_1593=float2(0.0);
l9_1593=l9_1591;
float2 l9_1594=float2(0.0);
l9_1594=(l9_1526*l9_1590)+l9_1593;
l9_1453=l9_1594;
l9_1455=l9_1453;
}
l9_1451=l9_1455;
l9_1447=l9_1451;
l9_1450=l9_1447;
}
else
{
float2 l9_1595=float2(0.0);
l9_1595=l9_1449.Surface_UVCoord0;
l9_1448=l9_1595;
l9_1450=l9_1448;
}
l9_1446=l9_1450;
float2 l9_1596=float2(0.0);
l9_1596=l9_1446;
float2 l9_1597=float2(0.0);
l9_1597=l9_1596;
l9_1390=l9_1597;
l9_1393=l9_1390;
}
else
{
float2 l9_1598=float2(0.0);
l9_1598=l9_1392.Surface_UVCoord0;
l9_1391=l9_1598;
l9_1393=l9_1391;
}
}
}
}
l9_1386=l9_1393;
float4 l9_1599=float4(0.0);
int l9_1600;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_1601=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1601=0;
}
else
{
l9_1601=in.varStereoViewID;
}
int l9_1602=l9_1601;
l9_1600=1-l9_1602;
}
else
{
int l9_1603=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1603=0;
}
else
{
l9_1603=in.varStereoViewID;
}
int l9_1604=l9_1603;
l9_1600=l9_1604;
}
int l9_1605=l9_1600;
int l9_1606=baseTexLayout_tmp;
int l9_1607=l9_1605;
float2 l9_1608=l9_1386;
bool l9_1609=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_1610=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_1611=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_1612=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_1613=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_1614=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_1615=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_1616=0.0;
bool l9_1617=l9_1614&&(!l9_1612);
float l9_1618=1.0;
float l9_1619=l9_1608.x;
int l9_1620=l9_1611.x;
if (l9_1620==1)
{
l9_1619=fract(l9_1619);
}
else
{
if (l9_1620==2)
{
float l9_1621=fract(l9_1619);
float l9_1622=l9_1619-l9_1621;
float l9_1623=step(0.25,fract(l9_1622*0.5));
l9_1619=mix(l9_1621,1.0-l9_1621,fast::clamp(l9_1623,0.0,1.0));
}
}
l9_1608.x=l9_1619;
float l9_1624=l9_1608.y;
int l9_1625=l9_1611.y;
if (l9_1625==1)
{
l9_1624=fract(l9_1624);
}
else
{
if (l9_1625==2)
{
float l9_1626=fract(l9_1624);
float l9_1627=l9_1624-l9_1626;
float l9_1628=step(0.25,fract(l9_1627*0.5));
l9_1624=mix(l9_1626,1.0-l9_1626,fast::clamp(l9_1628,0.0,1.0));
}
}
l9_1608.y=l9_1624;
if (l9_1612)
{
bool l9_1629=l9_1614;
bool l9_1630;
if (l9_1629)
{
l9_1630=l9_1611.x==3;
}
else
{
l9_1630=l9_1629;
}
float l9_1631=l9_1608.x;
float l9_1632=l9_1613.x;
float l9_1633=l9_1613.z;
bool l9_1634=l9_1630;
float l9_1635=l9_1618;
float l9_1636=fast::clamp(l9_1631,l9_1632,l9_1633);
float l9_1637=step(abs(l9_1631-l9_1636),9.9999997e-06);
l9_1635*=(l9_1637+((1.0-float(l9_1634))*(1.0-l9_1637)));
l9_1631=l9_1636;
l9_1608.x=l9_1631;
l9_1618=l9_1635;
bool l9_1638=l9_1614;
bool l9_1639;
if (l9_1638)
{
l9_1639=l9_1611.y==3;
}
else
{
l9_1639=l9_1638;
}
float l9_1640=l9_1608.y;
float l9_1641=l9_1613.y;
float l9_1642=l9_1613.w;
bool l9_1643=l9_1639;
float l9_1644=l9_1618;
float l9_1645=fast::clamp(l9_1640,l9_1641,l9_1642);
float l9_1646=step(abs(l9_1640-l9_1645),9.9999997e-06);
l9_1644*=(l9_1646+((1.0-float(l9_1643))*(1.0-l9_1646)));
l9_1640=l9_1645;
l9_1608.y=l9_1640;
l9_1618=l9_1644;
}
float2 l9_1647=l9_1608;
bool l9_1648=l9_1609;
float3x3 l9_1649=l9_1610;
if (l9_1648)
{
l9_1647=float2((l9_1649*float3(l9_1647,1.0)).xy);
}
float2 l9_1650=l9_1647;
l9_1608=l9_1650;
float l9_1651=l9_1608.x;
int l9_1652=l9_1611.x;
bool l9_1653=l9_1617;
float l9_1654=l9_1618;
if ((l9_1652==0)||(l9_1652==3))
{
float l9_1655=l9_1651;
float l9_1656=0.0;
float l9_1657=1.0;
bool l9_1658=l9_1653;
float l9_1659=l9_1654;
float l9_1660=fast::clamp(l9_1655,l9_1656,l9_1657);
float l9_1661=step(abs(l9_1655-l9_1660),9.9999997e-06);
l9_1659*=(l9_1661+((1.0-float(l9_1658))*(1.0-l9_1661)));
l9_1655=l9_1660;
l9_1651=l9_1655;
l9_1654=l9_1659;
}
l9_1608.x=l9_1651;
l9_1618=l9_1654;
float l9_1662=l9_1608.y;
int l9_1663=l9_1611.y;
bool l9_1664=l9_1617;
float l9_1665=l9_1618;
if ((l9_1663==0)||(l9_1663==3))
{
float l9_1666=l9_1662;
float l9_1667=0.0;
float l9_1668=1.0;
bool l9_1669=l9_1664;
float l9_1670=l9_1665;
float l9_1671=fast::clamp(l9_1666,l9_1667,l9_1668);
float l9_1672=step(abs(l9_1666-l9_1671),9.9999997e-06);
l9_1670*=(l9_1672+((1.0-float(l9_1669))*(1.0-l9_1672)));
l9_1666=l9_1671;
l9_1662=l9_1666;
l9_1665=l9_1670;
}
l9_1608.y=l9_1662;
l9_1618=l9_1665;
float2 l9_1673=l9_1608;
int l9_1674=l9_1606;
int l9_1675=l9_1607;
float l9_1676=l9_1616;
float2 l9_1677=l9_1673;
int l9_1678=l9_1674;
int l9_1679=l9_1675;
float3 l9_1680=float3(0.0);
if (l9_1678==0)
{
l9_1680=float3(l9_1677,0.0);
}
else
{
if (l9_1678==1)
{
l9_1680=float3(l9_1677.x,(l9_1677.y*0.5)+(0.5-(float(l9_1679)*0.5)),0.0);
}
else
{
l9_1680=float3(l9_1677,float(l9_1679));
}
}
float3 l9_1681=l9_1680;
float3 l9_1682=l9_1681;
float4 l9_1683=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_1682.xy,bias(l9_1676));
float4 l9_1684=l9_1683;
if (l9_1614)
{
l9_1684=mix(l9_1615,l9_1684,float4(l9_1618));
}
float4 l9_1685=l9_1684;
l9_1599=l9_1685;
param_15=l9_1599;
param_17=param_15;
}
else
{
param_17=param_16;
}
Result_N369=param_17;
float4 Output_N148=float4(0.0);
Output_N148=Value_N384*Result_N369;
float4 Export_N385=float4(0.0);
Export_N385=Output_N148;
float4 Value_N166=float4(0.0);
Value_N166=Export_N385;
float Output_N168=0.0;
Output_N168=Value_N166.w;
float Result_N204=0.0;
float param_19=0.0;
float param_20=(*sc_set0.UserUniforms).Port_Default_N204;
ssGlobals param_22=Globals;
float param_21;
if ((int(ENABLE_OPACITY_TEX_tmp)!=0))
{
float2 l9_1686=float2(0.0);
float2 l9_1687=float2(0.0);
float2 l9_1688=float2(0.0);
float2 l9_1689=float2(0.0);
float2 l9_1690=float2(0.0);
float2 l9_1691=float2(0.0);
ssGlobals l9_1692=param_22;
float2 l9_1693;
if (NODE_69_DROPLIST_ITEM_tmp==0)
{
float2 l9_1694=float2(0.0);
l9_1694=l9_1692.Surface_UVCoord0;
l9_1687=l9_1694;
l9_1693=l9_1687;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==1)
{
float2 l9_1695=float2(0.0);
l9_1695=l9_1692.Surface_UVCoord1;
l9_1688=l9_1695;
l9_1693=l9_1688;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==2)
{
float2 l9_1696=float2(0.0);
float2 l9_1697=float2(0.0);
float2 l9_1698=float2(0.0);
ssGlobals l9_1699=l9_1692;
float2 l9_1700;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1701=float2(0.0);
float2 l9_1702=float2(0.0);
float2 l9_1703=float2(0.0);
ssGlobals l9_1704=l9_1699;
float2 l9_1705;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1706=float2(0.0);
float2 l9_1707=float2(0.0);
float2 l9_1708=float2(0.0);
float2 l9_1709=float2(0.0);
float2 l9_1710=float2(0.0);
ssGlobals l9_1711=l9_1704;
float2 l9_1712;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1713=float2(0.0);
l9_1713=l9_1711.Surface_UVCoord0;
l9_1707=l9_1713;
l9_1712=l9_1707;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1714=float2(0.0);
l9_1714=l9_1711.Surface_UVCoord1;
l9_1708=l9_1714;
l9_1712=l9_1708;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1715=float2(0.0);
l9_1715=l9_1711.gScreenCoord;
l9_1709=l9_1715;
l9_1712=l9_1709;
}
else
{
float2 l9_1716=float2(0.0);
l9_1716=l9_1711.Surface_UVCoord0;
l9_1710=l9_1716;
l9_1712=l9_1710;
}
}
}
l9_1706=l9_1712;
float2 l9_1717=float2(0.0);
float2 l9_1718=(*sc_set0.UserUniforms).uv2Scale;
l9_1717=l9_1718;
float2 l9_1719=float2(0.0);
l9_1719=l9_1717;
float2 l9_1720=float2(0.0);
float2 l9_1721=(*sc_set0.UserUniforms).uv2Offset;
l9_1720=l9_1721;
float2 l9_1722=float2(0.0);
l9_1722=l9_1720;
float2 l9_1723=float2(0.0);
l9_1723=(l9_1706*l9_1719)+l9_1722;
float2 l9_1724=float2(0.0);
l9_1724=l9_1723+(l9_1722*(l9_1704.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1702=l9_1724;
l9_1705=l9_1702;
}
else
{
float2 l9_1725=float2(0.0);
float2 l9_1726=float2(0.0);
float2 l9_1727=float2(0.0);
float2 l9_1728=float2(0.0);
float2 l9_1729=float2(0.0);
ssGlobals l9_1730=l9_1704;
float2 l9_1731;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1732=float2(0.0);
l9_1732=l9_1730.Surface_UVCoord0;
l9_1726=l9_1732;
l9_1731=l9_1726;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1733=float2(0.0);
l9_1733=l9_1730.Surface_UVCoord1;
l9_1727=l9_1733;
l9_1731=l9_1727;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1734=float2(0.0);
l9_1734=l9_1730.gScreenCoord;
l9_1728=l9_1734;
l9_1731=l9_1728;
}
else
{
float2 l9_1735=float2(0.0);
l9_1735=l9_1730.Surface_UVCoord0;
l9_1729=l9_1735;
l9_1731=l9_1729;
}
}
}
l9_1725=l9_1731;
float2 l9_1736=float2(0.0);
float2 l9_1737=(*sc_set0.UserUniforms).uv2Scale;
l9_1736=l9_1737;
float2 l9_1738=float2(0.0);
l9_1738=l9_1736;
float2 l9_1739=float2(0.0);
float2 l9_1740=(*sc_set0.UserUniforms).uv2Offset;
l9_1739=l9_1740;
float2 l9_1741=float2(0.0);
l9_1741=l9_1739;
float2 l9_1742=float2(0.0);
l9_1742=(l9_1725*l9_1738)+l9_1741;
l9_1703=l9_1742;
l9_1705=l9_1703;
}
l9_1701=l9_1705;
l9_1697=l9_1701;
l9_1700=l9_1697;
}
else
{
float2 l9_1743=float2(0.0);
l9_1743=l9_1699.Surface_UVCoord0;
l9_1698=l9_1743;
l9_1700=l9_1698;
}
l9_1696=l9_1700;
float2 l9_1744=float2(0.0);
l9_1744=l9_1696;
float2 l9_1745=float2(0.0);
l9_1745=l9_1744;
l9_1689=l9_1745;
l9_1693=l9_1689;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==3)
{
float2 l9_1746=float2(0.0);
float2 l9_1747=float2(0.0);
float2 l9_1748=float2(0.0);
ssGlobals l9_1749=l9_1692;
float2 l9_1750;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_1751=float2(0.0);
float2 l9_1752=float2(0.0);
float2 l9_1753=float2(0.0);
ssGlobals l9_1754=l9_1749;
float2 l9_1755;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_1756=float2(0.0);
float2 l9_1757=float2(0.0);
float2 l9_1758=float2(0.0);
float2 l9_1759=float2(0.0);
float2 l9_1760=float2(0.0);
float2 l9_1761=float2(0.0);
ssGlobals l9_1762=l9_1754;
float2 l9_1763;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1764=float2(0.0);
l9_1764=l9_1762.Surface_UVCoord0;
l9_1757=l9_1764;
l9_1763=l9_1757;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1765=float2(0.0);
l9_1765=l9_1762.Surface_UVCoord1;
l9_1758=l9_1765;
l9_1763=l9_1758;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1766=float2(0.0);
l9_1766=l9_1762.gScreenCoord;
l9_1759=l9_1766;
l9_1763=l9_1759;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1767=float2(0.0);
float2 l9_1768=float2(0.0);
float2 l9_1769=float2(0.0);
ssGlobals l9_1770=l9_1762;
float2 l9_1771;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1772=float2(0.0);
float2 l9_1773=float2(0.0);
float2 l9_1774=float2(0.0);
ssGlobals l9_1775=l9_1770;
float2 l9_1776;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1777=float2(0.0);
float2 l9_1778=float2(0.0);
float2 l9_1779=float2(0.0);
float2 l9_1780=float2(0.0);
float2 l9_1781=float2(0.0);
ssGlobals l9_1782=l9_1775;
float2 l9_1783;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1784=float2(0.0);
l9_1784=l9_1782.Surface_UVCoord0;
l9_1778=l9_1784;
l9_1783=l9_1778;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1785=float2(0.0);
l9_1785=l9_1782.Surface_UVCoord1;
l9_1779=l9_1785;
l9_1783=l9_1779;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1786=float2(0.0);
l9_1786=l9_1782.gScreenCoord;
l9_1780=l9_1786;
l9_1783=l9_1780;
}
else
{
float2 l9_1787=float2(0.0);
l9_1787=l9_1782.Surface_UVCoord0;
l9_1781=l9_1787;
l9_1783=l9_1781;
}
}
}
l9_1777=l9_1783;
float2 l9_1788=float2(0.0);
float2 l9_1789=(*sc_set0.UserUniforms).uv2Scale;
l9_1788=l9_1789;
float2 l9_1790=float2(0.0);
l9_1790=l9_1788;
float2 l9_1791=float2(0.0);
float2 l9_1792=(*sc_set0.UserUniforms).uv2Offset;
l9_1791=l9_1792;
float2 l9_1793=float2(0.0);
l9_1793=l9_1791;
float2 l9_1794=float2(0.0);
l9_1794=(l9_1777*l9_1790)+l9_1793;
float2 l9_1795=float2(0.0);
l9_1795=l9_1794+(l9_1793*(l9_1775.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1773=l9_1795;
l9_1776=l9_1773;
}
else
{
float2 l9_1796=float2(0.0);
float2 l9_1797=float2(0.0);
float2 l9_1798=float2(0.0);
float2 l9_1799=float2(0.0);
float2 l9_1800=float2(0.0);
ssGlobals l9_1801=l9_1775;
float2 l9_1802;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1803=float2(0.0);
l9_1803=l9_1801.Surface_UVCoord0;
l9_1797=l9_1803;
l9_1802=l9_1797;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1804=float2(0.0);
l9_1804=l9_1801.Surface_UVCoord1;
l9_1798=l9_1804;
l9_1802=l9_1798;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1805=float2(0.0);
l9_1805=l9_1801.gScreenCoord;
l9_1799=l9_1805;
l9_1802=l9_1799;
}
else
{
float2 l9_1806=float2(0.0);
l9_1806=l9_1801.Surface_UVCoord0;
l9_1800=l9_1806;
l9_1802=l9_1800;
}
}
}
l9_1796=l9_1802;
float2 l9_1807=float2(0.0);
float2 l9_1808=(*sc_set0.UserUniforms).uv2Scale;
l9_1807=l9_1808;
float2 l9_1809=float2(0.0);
l9_1809=l9_1807;
float2 l9_1810=float2(0.0);
float2 l9_1811=(*sc_set0.UserUniforms).uv2Offset;
l9_1810=l9_1811;
float2 l9_1812=float2(0.0);
l9_1812=l9_1810;
float2 l9_1813=float2(0.0);
l9_1813=(l9_1796*l9_1809)+l9_1812;
l9_1774=l9_1813;
l9_1776=l9_1774;
}
l9_1772=l9_1776;
l9_1768=l9_1772;
l9_1771=l9_1768;
}
else
{
float2 l9_1814=float2(0.0);
l9_1814=l9_1770.Surface_UVCoord0;
l9_1769=l9_1814;
l9_1771=l9_1769;
}
l9_1767=l9_1771;
float2 l9_1815=float2(0.0);
l9_1815=l9_1767;
float2 l9_1816=float2(0.0);
l9_1816=l9_1815;
l9_1760=l9_1816;
l9_1763=l9_1760;
}
else
{
float2 l9_1817=float2(0.0);
l9_1817=l9_1762.Surface_UVCoord0;
l9_1761=l9_1817;
l9_1763=l9_1761;
}
}
}
}
l9_1756=l9_1763;
float2 l9_1818=float2(0.0);
float2 l9_1819=(*sc_set0.UserUniforms).uv3Scale;
l9_1818=l9_1819;
float2 l9_1820=float2(0.0);
l9_1820=l9_1818;
float2 l9_1821=float2(0.0);
float2 l9_1822=(*sc_set0.UserUniforms).uv3Offset;
l9_1821=l9_1822;
float2 l9_1823=float2(0.0);
l9_1823=l9_1821;
float2 l9_1824=float2(0.0);
l9_1824=(l9_1756*l9_1820)+l9_1823;
float2 l9_1825=float2(0.0);
l9_1825=l9_1824+(l9_1823*(l9_1754.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_1752=l9_1825;
l9_1755=l9_1752;
}
else
{
float2 l9_1826=float2(0.0);
float2 l9_1827=float2(0.0);
float2 l9_1828=float2(0.0);
float2 l9_1829=float2(0.0);
float2 l9_1830=float2(0.0);
float2 l9_1831=float2(0.0);
ssGlobals l9_1832=l9_1754;
float2 l9_1833;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1834=float2(0.0);
l9_1834=l9_1832.Surface_UVCoord0;
l9_1827=l9_1834;
l9_1833=l9_1827;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1835=float2(0.0);
l9_1835=l9_1832.Surface_UVCoord1;
l9_1828=l9_1835;
l9_1833=l9_1828;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1836=float2(0.0);
l9_1836=l9_1832.gScreenCoord;
l9_1829=l9_1836;
l9_1833=l9_1829;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1837=float2(0.0);
float2 l9_1838=float2(0.0);
float2 l9_1839=float2(0.0);
ssGlobals l9_1840=l9_1832;
float2 l9_1841;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1842=float2(0.0);
float2 l9_1843=float2(0.0);
float2 l9_1844=float2(0.0);
ssGlobals l9_1845=l9_1840;
float2 l9_1846;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1847=float2(0.0);
float2 l9_1848=float2(0.0);
float2 l9_1849=float2(0.0);
float2 l9_1850=float2(0.0);
float2 l9_1851=float2(0.0);
ssGlobals l9_1852=l9_1845;
float2 l9_1853;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1854=float2(0.0);
l9_1854=l9_1852.Surface_UVCoord0;
l9_1848=l9_1854;
l9_1853=l9_1848;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1855=float2(0.0);
l9_1855=l9_1852.Surface_UVCoord1;
l9_1849=l9_1855;
l9_1853=l9_1849;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1856=float2(0.0);
l9_1856=l9_1852.gScreenCoord;
l9_1850=l9_1856;
l9_1853=l9_1850;
}
else
{
float2 l9_1857=float2(0.0);
l9_1857=l9_1852.Surface_UVCoord0;
l9_1851=l9_1857;
l9_1853=l9_1851;
}
}
}
l9_1847=l9_1853;
float2 l9_1858=float2(0.0);
float2 l9_1859=(*sc_set0.UserUniforms).uv2Scale;
l9_1858=l9_1859;
float2 l9_1860=float2(0.0);
l9_1860=l9_1858;
float2 l9_1861=float2(0.0);
float2 l9_1862=(*sc_set0.UserUniforms).uv2Offset;
l9_1861=l9_1862;
float2 l9_1863=float2(0.0);
l9_1863=l9_1861;
float2 l9_1864=float2(0.0);
l9_1864=(l9_1847*l9_1860)+l9_1863;
float2 l9_1865=float2(0.0);
l9_1865=l9_1864+(l9_1863*(l9_1845.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1843=l9_1865;
l9_1846=l9_1843;
}
else
{
float2 l9_1866=float2(0.0);
float2 l9_1867=float2(0.0);
float2 l9_1868=float2(0.0);
float2 l9_1869=float2(0.0);
float2 l9_1870=float2(0.0);
ssGlobals l9_1871=l9_1845;
float2 l9_1872;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1873=float2(0.0);
l9_1873=l9_1871.Surface_UVCoord0;
l9_1867=l9_1873;
l9_1872=l9_1867;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1874=float2(0.0);
l9_1874=l9_1871.Surface_UVCoord1;
l9_1868=l9_1874;
l9_1872=l9_1868;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1875=float2(0.0);
l9_1875=l9_1871.gScreenCoord;
l9_1869=l9_1875;
l9_1872=l9_1869;
}
else
{
float2 l9_1876=float2(0.0);
l9_1876=l9_1871.Surface_UVCoord0;
l9_1870=l9_1876;
l9_1872=l9_1870;
}
}
}
l9_1866=l9_1872;
float2 l9_1877=float2(0.0);
float2 l9_1878=(*sc_set0.UserUniforms).uv2Scale;
l9_1877=l9_1878;
float2 l9_1879=float2(0.0);
l9_1879=l9_1877;
float2 l9_1880=float2(0.0);
float2 l9_1881=(*sc_set0.UserUniforms).uv2Offset;
l9_1880=l9_1881;
float2 l9_1882=float2(0.0);
l9_1882=l9_1880;
float2 l9_1883=float2(0.0);
l9_1883=(l9_1866*l9_1879)+l9_1882;
l9_1844=l9_1883;
l9_1846=l9_1844;
}
l9_1842=l9_1846;
l9_1838=l9_1842;
l9_1841=l9_1838;
}
else
{
float2 l9_1884=float2(0.0);
l9_1884=l9_1840.Surface_UVCoord0;
l9_1839=l9_1884;
l9_1841=l9_1839;
}
l9_1837=l9_1841;
float2 l9_1885=float2(0.0);
l9_1885=l9_1837;
float2 l9_1886=float2(0.0);
l9_1886=l9_1885;
l9_1830=l9_1886;
l9_1833=l9_1830;
}
else
{
float2 l9_1887=float2(0.0);
l9_1887=l9_1832.Surface_UVCoord0;
l9_1831=l9_1887;
l9_1833=l9_1831;
}
}
}
}
l9_1826=l9_1833;
float2 l9_1888=float2(0.0);
float2 l9_1889=(*sc_set0.UserUniforms).uv3Scale;
l9_1888=l9_1889;
float2 l9_1890=float2(0.0);
l9_1890=l9_1888;
float2 l9_1891=float2(0.0);
float2 l9_1892=(*sc_set0.UserUniforms).uv3Offset;
l9_1891=l9_1892;
float2 l9_1893=float2(0.0);
l9_1893=l9_1891;
float2 l9_1894=float2(0.0);
l9_1894=(l9_1826*l9_1890)+l9_1893;
l9_1753=l9_1894;
l9_1755=l9_1753;
}
l9_1751=l9_1755;
l9_1747=l9_1751;
l9_1750=l9_1747;
}
else
{
float2 l9_1895=float2(0.0);
l9_1895=l9_1749.Surface_UVCoord0;
l9_1748=l9_1895;
l9_1750=l9_1748;
}
l9_1746=l9_1750;
float2 l9_1896=float2(0.0);
l9_1896=l9_1746;
float2 l9_1897=float2(0.0);
l9_1897=l9_1896;
l9_1690=l9_1897;
l9_1693=l9_1690;
}
else
{
float2 l9_1898=float2(0.0);
l9_1898=l9_1692.Surface_UVCoord0;
l9_1691=l9_1898;
l9_1693=l9_1691;
}
}
}
}
l9_1686=l9_1693;
float4 l9_1899=float4(0.0);
int l9_1900;
if ((int(opacityTexHasSwappedViews_tmp)!=0))
{
int l9_1901=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1901=0;
}
else
{
l9_1901=in.varStereoViewID;
}
int l9_1902=l9_1901;
l9_1900=1-l9_1902;
}
else
{
int l9_1903=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1903=0;
}
else
{
l9_1903=in.varStereoViewID;
}
int l9_1904=l9_1903;
l9_1900=l9_1904;
}
int l9_1905=l9_1900;
int l9_1906=opacityTexLayout_tmp;
int l9_1907=l9_1905;
float2 l9_1908=l9_1686;
bool l9_1909=(int(SC_USE_UV_TRANSFORM_opacityTex_tmp)!=0);
float3x3 l9_1910=(*sc_set0.UserUniforms).opacityTexTransform;
int2 l9_1911=int2(SC_SOFTWARE_WRAP_MODE_U_opacityTex_tmp,SC_SOFTWARE_WRAP_MODE_V_opacityTex_tmp);
bool l9_1912=(int(SC_USE_UV_MIN_MAX_opacityTex_tmp)!=0);
float4 l9_1913=(*sc_set0.UserUniforms).opacityTexUvMinMax;
bool l9_1914=(int(SC_USE_CLAMP_TO_BORDER_opacityTex_tmp)!=0);
float4 l9_1915=(*sc_set0.UserUniforms).opacityTexBorderColor;
float l9_1916=0.0;
bool l9_1917=l9_1914&&(!l9_1912);
float l9_1918=1.0;
float l9_1919=l9_1908.x;
int l9_1920=l9_1911.x;
if (l9_1920==1)
{
l9_1919=fract(l9_1919);
}
else
{
if (l9_1920==2)
{
float l9_1921=fract(l9_1919);
float l9_1922=l9_1919-l9_1921;
float l9_1923=step(0.25,fract(l9_1922*0.5));
l9_1919=mix(l9_1921,1.0-l9_1921,fast::clamp(l9_1923,0.0,1.0));
}
}
l9_1908.x=l9_1919;
float l9_1924=l9_1908.y;
int l9_1925=l9_1911.y;
if (l9_1925==1)
{
l9_1924=fract(l9_1924);
}
else
{
if (l9_1925==2)
{
float l9_1926=fract(l9_1924);
float l9_1927=l9_1924-l9_1926;
float l9_1928=step(0.25,fract(l9_1927*0.5));
l9_1924=mix(l9_1926,1.0-l9_1926,fast::clamp(l9_1928,0.0,1.0));
}
}
l9_1908.y=l9_1924;
if (l9_1912)
{
bool l9_1929=l9_1914;
bool l9_1930;
if (l9_1929)
{
l9_1930=l9_1911.x==3;
}
else
{
l9_1930=l9_1929;
}
float l9_1931=l9_1908.x;
float l9_1932=l9_1913.x;
float l9_1933=l9_1913.z;
bool l9_1934=l9_1930;
float l9_1935=l9_1918;
float l9_1936=fast::clamp(l9_1931,l9_1932,l9_1933);
float l9_1937=step(abs(l9_1931-l9_1936),9.9999997e-06);
l9_1935*=(l9_1937+((1.0-float(l9_1934))*(1.0-l9_1937)));
l9_1931=l9_1936;
l9_1908.x=l9_1931;
l9_1918=l9_1935;
bool l9_1938=l9_1914;
bool l9_1939;
if (l9_1938)
{
l9_1939=l9_1911.y==3;
}
else
{
l9_1939=l9_1938;
}
float l9_1940=l9_1908.y;
float l9_1941=l9_1913.y;
float l9_1942=l9_1913.w;
bool l9_1943=l9_1939;
float l9_1944=l9_1918;
float l9_1945=fast::clamp(l9_1940,l9_1941,l9_1942);
float l9_1946=step(abs(l9_1940-l9_1945),9.9999997e-06);
l9_1944*=(l9_1946+((1.0-float(l9_1943))*(1.0-l9_1946)));
l9_1940=l9_1945;
l9_1908.y=l9_1940;
l9_1918=l9_1944;
}
float2 l9_1947=l9_1908;
bool l9_1948=l9_1909;
float3x3 l9_1949=l9_1910;
if (l9_1948)
{
l9_1947=float2((l9_1949*float3(l9_1947,1.0)).xy);
}
float2 l9_1950=l9_1947;
l9_1908=l9_1950;
float l9_1951=l9_1908.x;
int l9_1952=l9_1911.x;
bool l9_1953=l9_1917;
float l9_1954=l9_1918;
if ((l9_1952==0)||(l9_1952==3))
{
float l9_1955=l9_1951;
float l9_1956=0.0;
float l9_1957=1.0;
bool l9_1958=l9_1953;
float l9_1959=l9_1954;
float l9_1960=fast::clamp(l9_1955,l9_1956,l9_1957);
float l9_1961=step(abs(l9_1955-l9_1960),9.9999997e-06);
l9_1959*=(l9_1961+((1.0-float(l9_1958))*(1.0-l9_1961)));
l9_1955=l9_1960;
l9_1951=l9_1955;
l9_1954=l9_1959;
}
l9_1908.x=l9_1951;
l9_1918=l9_1954;
float l9_1962=l9_1908.y;
int l9_1963=l9_1911.y;
bool l9_1964=l9_1917;
float l9_1965=l9_1918;
if ((l9_1963==0)||(l9_1963==3))
{
float l9_1966=l9_1962;
float l9_1967=0.0;
float l9_1968=1.0;
bool l9_1969=l9_1964;
float l9_1970=l9_1965;
float l9_1971=fast::clamp(l9_1966,l9_1967,l9_1968);
float l9_1972=step(abs(l9_1966-l9_1971),9.9999997e-06);
l9_1970*=(l9_1972+((1.0-float(l9_1969))*(1.0-l9_1972)));
l9_1966=l9_1971;
l9_1962=l9_1966;
l9_1965=l9_1970;
}
l9_1908.y=l9_1962;
l9_1918=l9_1965;
float2 l9_1973=l9_1908;
int l9_1974=l9_1906;
int l9_1975=l9_1907;
float l9_1976=l9_1916;
float2 l9_1977=l9_1973;
int l9_1978=l9_1974;
int l9_1979=l9_1975;
float3 l9_1980=float3(0.0);
if (l9_1978==0)
{
l9_1980=float3(l9_1977,0.0);
}
else
{
if (l9_1978==1)
{
l9_1980=float3(l9_1977.x,(l9_1977.y*0.5)+(0.5-(float(l9_1979)*0.5)),0.0);
}
else
{
l9_1980=float3(l9_1977,float(l9_1979));
}
}
float3 l9_1981=l9_1980;
float3 l9_1982=l9_1981;
float4 l9_1983=sc_set0.opacityTex.sample(sc_set0.opacityTexSmpSC,l9_1982.xy,bias(l9_1976));
float4 l9_1984=l9_1983;
if (l9_1914)
{
l9_1984=mix(l9_1915,l9_1984,float4(l9_1918));
}
float4 l9_1985=l9_1984;
l9_1899=l9_1985;
float l9_1986=0.0;
l9_1986=l9_1899.x;
param_19=l9_1986;
param_21=param_19;
}
else
{
param_21=param_20;
}
Result_N204=param_21;
float Output_N72=0.0;
float param_23=1.0;
float param_24=(*sc_set0.UserUniforms).Port_Input2_N072;
ssGlobals param_26=Globals;
float param_25;
if (NODE_38_DROPLIST_ITEM_tmp==1)
{
float4 l9_1987=float4(0.0);
l9_1987=param_26.VertexColor;
float l9_1988=0.0;
l9_1988=l9_1987.w;
param_23=l9_1988;
param_25=param_23;
}
else
{
param_25=param_24;
}
Output_N72=param_25;
float Output_N205=0.0;
Output_N205=(Output_N168*Result_N204)*Output_N72;
float Export_N158=0.0;
Export_N158=Output_N205;
float3 Result_N337=float3(0.0);
float3 param_27=float3(0.0);
float3 param_28=float3(0.0);
ssGlobals param_30=Globals;
float3 param_29;
if ((int(ENABLE_NORMALMAP_tmp)!=0))
{
float3 l9_1989=float3(0.0);
l9_1989=param_30.VertexTangent_WorldSpace;
float3 l9_1990=float3(0.0);
l9_1990=param_30.VertexBinormal_WorldSpace;
float3 l9_1991=float3(0.0);
l9_1991=param_30.VertexNormal_WorldSpace;
float3x3 l9_1992=float3x3(float3(0.0),float3(0.0),float3(0.0));
l9_1992=float3x3(float3(l9_1989),float3(l9_1990),float3(l9_1991));
float2 l9_1993=float2(0.0);
float2 l9_1994=float2(0.0);
float2 l9_1995=float2(0.0);
float2 l9_1996=float2(0.0);
float2 l9_1997=float2(0.0);
float2 l9_1998=float2(0.0);
ssGlobals l9_1999=param_30;
float2 l9_2000;
if (NODE_181_DROPLIST_ITEM_tmp==0)
{
float2 l9_2001=float2(0.0);
l9_2001=l9_1999.Surface_UVCoord0;
l9_1994=l9_2001;
l9_2000=l9_1994;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==1)
{
float2 l9_2002=float2(0.0);
l9_2002=l9_1999.Surface_UVCoord1;
l9_1995=l9_2002;
l9_2000=l9_1995;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==2)
{
float2 l9_2003=float2(0.0);
float2 l9_2004=float2(0.0);
float2 l9_2005=float2(0.0);
ssGlobals l9_2006=l9_1999;
float2 l9_2007;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2008=float2(0.0);
float2 l9_2009=float2(0.0);
float2 l9_2010=float2(0.0);
ssGlobals l9_2011=l9_2006;
float2 l9_2012;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2013=float2(0.0);
float2 l9_2014=float2(0.0);
float2 l9_2015=float2(0.0);
float2 l9_2016=float2(0.0);
float2 l9_2017=float2(0.0);
ssGlobals l9_2018=l9_2011;
float2 l9_2019;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2020=float2(0.0);
l9_2020=l9_2018.Surface_UVCoord0;
l9_2014=l9_2020;
l9_2019=l9_2014;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2021=float2(0.0);
l9_2021=l9_2018.Surface_UVCoord1;
l9_2015=l9_2021;
l9_2019=l9_2015;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2022=float2(0.0);
l9_2022=l9_2018.gScreenCoord;
l9_2016=l9_2022;
l9_2019=l9_2016;
}
else
{
float2 l9_2023=float2(0.0);
l9_2023=l9_2018.Surface_UVCoord0;
l9_2017=l9_2023;
l9_2019=l9_2017;
}
}
}
l9_2013=l9_2019;
float2 l9_2024=float2(0.0);
float2 l9_2025=(*sc_set0.UserUniforms).uv2Scale;
l9_2024=l9_2025;
float2 l9_2026=float2(0.0);
l9_2026=l9_2024;
float2 l9_2027=float2(0.0);
float2 l9_2028=(*sc_set0.UserUniforms).uv2Offset;
l9_2027=l9_2028;
float2 l9_2029=float2(0.0);
l9_2029=l9_2027;
float2 l9_2030=float2(0.0);
l9_2030=(l9_2013*l9_2026)+l9_2029;
float2 l9_2031=float2(0.0);
l9_2031=l9_2030+(l9_2029*(l9_2011.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2009=l9_2031;
l9_2012=l9_2009;
}
else
{
float2 l9_2032=float2(0.0);
float2 l9_2033=float2(0.0);
float2 l9_2034=float2(0.0);
float2 l9_2035=float2(0.0);
float2 l9_2036=float2(0.0);
ssGlobals l9_2037=l9_2011;
float2 l9_2038;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2039=float2(0.0);
l9_2039=l9_2037.Surface_UVCoord0;
l9_2033=l9_2039;
l9_2038=l9_2033;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2040=float2(0.0);
l9_2040=l9_2037.Surface_UVCoord1;
l9_2034=l9_2040;
l9_2038=l9_2034;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2041=float2(0.0);
l9_2041=l9_2037.gScreenCoord;
l9_2035=l9_2041;
l9_2038=l9_2035;
}
else
{
float2 l9_2042=float2(0.0);
l9_2042=l9_2037.Surface_UVCoord0;
l9_2036=l9_2042;
l9_2038=l9_2036;
}
}
}
l9_2032=l9_2038;
float2 l9_2043=float2(0.0);
float2 l9_2044=(*sc_set0.UserUniforms).uv2Scale;
l9_2043=l9_2044;
float2 l9_2045=float2(0.0);
l9_2045=l9_2043;
float2 l9_2046=float2(0.0);
float2 l9_2047=(*sc_set0.UserUniforms).uv2Offset;
l9_2046=l9_2047;
float2 l9_2048=float2(0.0);
l9_2048=l9_2046;
float2 l9_2049=float2(0.0);
l9_2049=(l9_2032*l9_2045)+l9_2048;
l9_2010=l9_2049;
l9_2012=l9_2010;
}
l9_2008=l9_2012;
l9_2004=l9_2008;
l9_2007=l9_2004;
}
else
{
float2 l9_2050=float2(0.0);
l9_2050=l9_2006.Surface_UVCoord0;
l9_2005=l9_2050;
l9_2007=l9_2005;
}
l9_2003=l9_2007;
float2 l9_2051=float2(0.0);
l9_2051=l9_2003;
float2 l9_2052=float2(0.0);
l9_2052=l9_2051;
l9_1996=l9_2052;
l9_2000=l9_1996;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==3)
{
float2 l9_2053=float2(0.0);
float2 l9_2054=float2(0.0);
float2 l9_2055=float2(0.0);
ssGlobals l9_2056=l9_1999;
float2 l9_2057;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_2058=float2(0.0);
float2 l9_2059=float2(0.0);
float2 l9_2060=float2(0.0);
ssGlobals l9_2061=l9_2056;
float2 l9_2062;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_2063=float2(0.0);
float2 l9_2064=float2(0.0);
float2 l9_2065=float2(0.0);
float2 l9_2066=float2(0.0);
float2 l9_2067=float2(0.0);
float2 l9_2068=float2(0.0);
ssGlobals l9_2069=l9_2061;
float2 l9_2070;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_2071=float2(0.0);
l9_2071=l9_2069.Surface_UVCoord0;
l9_2064=l9_2071;
l9_2070=l9_2064;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_2072=float2(0.0);
l9_2072=l9_2069.Surface_UVCoord1;
l9_2065=l9_2072;
l9_2070=l9_2065;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_2073=float2(0.0);
l9_2073=l9_2069.gScreenCoord;
l9_2066=l9_2073;
l9_2070=l9_2066;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_2074=float2(0.0);
float2 l9_2075=float2(0.0);
float2 l9_2076=float2(0.0);
ssGlobals l9_2077=l9_2069;
float2 l9_2078;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2079=float2(0.0);
float2 l9_2080=float2(0.0);
float2 l9_2081=float2(0.0);
ssGlobals l9_2082=l9_2077;
float2 l9_2083;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2084=float2(0.0);
float2 l9_2085=float2(0.0);
float2 l9_2086=float2(0.0);
float2 l9_2087=float2(0.0);
float2 l9_2088=float2(0.0);
ssGlobals l9_2089=l9_2082;
float2 l9_2090;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2091=float2(0.0);
l9_2091=l9_2089.Surface_UVCoord0;
l9_2085=l9_2091;
l9_2090=l9_2085;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2092=float2(0.0);
l9_2092=l9_2089.Surface_UVCoord1;
l9_2086=l9_2092;
l9_2090=l9_2086;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2093=float2(0.0);
l9_2093=l9_2089.gScreenCoord;
l9_2087=l9_2093;
l9_2090=l9_2087;
}
else
{
float2 l9_2094=float2(0.0);
l9_2094=l9_2089.Surface_UVCoord0;
l9_2088=l9_2094;
l9_2090=l9_2088;
}
}
}
l9_2084=l9_2090;
float2 l9_2095=float2(0.0);
float2 l9_2096=(*sc_set0.UserUniforms).uv2Scale;
l9_2095=l9_2096;
float2 l9_2097=float2(0.0);
l9_2097=l9_2095;
float2 l9_2098=float2(0.0);
float2 l9_2099=(*sc_set0.UserUniforms).uv2Offset;
l9_2098=l9_2099;
float2 l9_2100=float2(0.0);
l9_2100=l9_2098;
float2 l9_2101=float2(0.0);
l9_2101=(l9_2084*l9_2097)+l9_2100;
float2 l9_2102=float2(0.0);
l9_2102=l9_2101+(l9_2100*(l9_2082.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2080=l9_2102;
l9_2083=l9_2080;
}
else
{
float2 l9_2103=float2(0.0);
float2 l9_2104=float2(0.0);
float2 l9_2105=float2(0.0);
float2 l9_2106=float2(0.0);
float2 l9_2107=float2(0.0);
ssGlobals l9_2108=l9_2082;
float2 l9_2109;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2110=float2(0.0);
l9_2110=l9_2108.Surface_UVCoord0;
l9_2104=l9_2110;
l9_2109=l9_2104;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2111=float2(0.0);
l9_2111=l9_2108.Surface_UVCoord1;
l9_2105=l9_2111;
l9_2109=l9_2105;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2112=float2(0.0);
l9_2112=l9_2108.gScreenCoord;
l9_2106=l9_2112;
l9_2109=l9_2106;
}
else
{
float2 l9_2113=float2(0.0);
l9_2113=l9_2108.Surface_UVCoord0;
l9_2107=l9_2113;
l9_2109=l9_2107;
}
}
}
l9_2103=l9_2109;
float2 l9_2114=float2(0.0);
float2 l9_2115=(*sc_set0.UserUniforms).uv2Scale;
l9_2114=l9_2115;
float2 l9_2116=float2(0.0);
l9_2116=l9_2114;
float2 l9_2117=float2(0.0);
float2 l9_2118=(*sc_set0.UserUniforms).uv2Offset;
l9_2117=l9_2118;
float2 l9_2119=float2(0.0);
l9_2119=l9_2117;
float2 l9_2120=float2(0.0);
l9_2120=(l9_2103*l9_2116)+l9_2119;
l9_2081=l9_2120;
l9_2083=l9_2081;
}
l9_2079=l9_2083;
l9_2075=l9_2079;
l9_2078=l9_2075;
}
else
{
float2 l9_2121=float2(0.0);
l9_2121=l9_2077.Surface_UVCoord0;
l9_2076=l9_2121;
l9_2078=l9_2076;
}
l9_2074=l9_2078;
float2 l9_2122=float2(0.0);
l9_2122=l9_2074;
float2 l9_2123=float2(0.0);
l9_2123=l9_2122;
l9_2067=l9_2123;
l9_2070=l9_2067;
}
else
{
float2 l9_2124=float2(0.0);
l9_2124=l9_2069.Surface_UVCoord0;
l9_2068=l9_2124;
l9_2070=l9_2068;
}
}
}
}
l9_2063=l9_2070;
float2 l9_2125=float2(0.0);
float2 l9_2126=(*sc_set0.UserUniforms).uv3Scale;
l9_2125=l9_2126;
float2 l9_2127=float2(0.0);
l9_2127=l9_2125;
float2 l9_2128=float2(0.0);
float2 l9_2129=(*sc_set0.UserUniforms).uv3Offset;
l9_2128=l9_2129;
float2 l9_2130=float2(0.0);
l9_2130=l9_2128;
float2 l9_2131=float2(0.0);
l9_2131=(l9_2063*l9_2127)+l9_2130;
float2 l9_2132=float2(0.0);
l9_2132=l9_2131+(l9_2130*(l9_2061.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_2059=l9_2132;
l9_2062=l9_2059;
}
else
{
float2 l9_2133=float2(0.0);
float2 l9_2134=float2(0.0);
float2 l9_2135=float2(0.0);
float2 l9_2136=float2(0.0);
float2 l9_2137=float2(0.0);
float2 l9_2138=float2(0.0);
ssGlobals l9_2139=l9_2061;
float2 l9_2140;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_2141=float2(0.0);
l9_2141=l9_2139.Surface_UVCoord0;
l9_2134=l9_2141;
l9_2140=l9_2134;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_2142=float2(0.0);
l9_2142=l9_2139.Surface_UVCoord1;
l9_2135=l9_2142;
l9_2140=l9_2135;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_2143=float2(0.0);
l9_2143=l9_2139.gScreenCoord;
l9_2136=l9_2143;
l9_2140=l9_2136;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_2144=float2(0.0);
float2 l9_2145=float2(0.0);
float2 l9_2146=float2(0.0);
ssGlobals l9_2147=l9_2139;
float2 l9_2148;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2149=float2(0.0);
float2 l9_2150=float2(0.0);
float2 l9_2151=float2(0.0);
ssGlobals l9_2152=l9_2147;
float2 l9_2153;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2154=float2(0.0);
float2 l9_2155=float2(0.0);
float2 l9_2156=float2(0.0);
float2 l9_2157=float2(0.0);
float2 l9_2158=float2(0.0);
ssGlobals l9_2159=l9_2152;
float2 l9_2160;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2161=float2(0.0);
l9_2161=l9_2159.Surface_UVCoord0;
l9_2155=l9_2161;
l9_2160=l9_2155;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2162=float2(0.0);
l9_2162=l9_2159.Surface_UVCoord1;
l9_2156=l9_2162;
l9_2160=l9_2156;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2163=float2(0.0);
l9_2163=l9_2159.gScreenCoord;
l9_2157=l9_2163;
l9_2160=l9_2157;
}
else
{
float2 l9_2164=float2(0.0);
l9_2164=l9_2159.Surface_UVCoord0;
l9_2158=l9_2164;
l9_2160=l9_2158;
}
}
}
l9_2154=l9_2160;
float2 l9_2165=float2(0.0);
float2 l9_2166=(*sc_set0.UserUniforms).uv2Scale;
l9_2165=l9_2166;
float2 l9_2167=float2(0.0);
l9_2167=l9_2165;
float2 l9_2168=float2(0.0);
float2 l9_2169=(*sc_set0.UserUniforms).uv2Offset;
l9_2168=l9_2169;
float2 l9_2170=float2(0.0);
l9_2170=l9_2168;
float2 l9_2171=float2(0.0);
l9_2171=(l9_2154*l9_2167)+l9_2170;
float2 l9_2172=float2(0.0);
l9_2172=l9_2171+(l9_2170*(l9_2152.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2150=l9_2172;
l9_2153=l9_2150;
}
else
{
float2 l9_2173=float2(0.0);
float2 l9_2174=float2(0.0);
float2 l9_2175=float2(0.0);
float2 l9_2176=float2(0.0);
float2 l9_2177=float2(0.0);
ssGlobals l9_2178=l9_2152;
float2 l9_2179;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2180=float2(0.0);
l9_2180=l9_2178.Surface_UVCoord0;
l9_2174=l9_2180;
l9_2179=l9_2174;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2181=float2(0.0);
l9_2181=l9_2178.Surface_UVCoord1;
l9_2175=l9_2181;
l9_2179=l9_2175;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2182=float2(0.0);
l9_2182=l9_2178.gScreenCoord;
l9_2176=l9_2182;
l9_2179=l9_2176;
}
else
{
float2 l9_2183=float2(0.0);
l9_2183=l9_2178.Surface_UVCoord0;
l9_2177=l9_2183;
l9_2179=l9_2177;
}
}
}
l9_2173=l9_2179;
float2 l9_2184=float2(0.0);
float2 l9_2185=(*sc_set0.UserUniforms).uv2Scale;
l9_2184=l9_2185;
float2 l9_2186=float2(0.0);
l9_2186=l9_2184;
float2 l9_2187=float2(0.0);
float2 l9_2188=(*sc_set0.UserUniforms).uv2Offset;
l9_2187=l9_2188;
float2 l9_2189=float2(0.0);
l9_2189=l9_2187;
float2 l9_2190=float2(0.0);
l9_2190=(l9_2173*l9_2186)+l9_2189;
l9_2151=l9_2190;
l9_2153=l9_2151;
}
l9_2149=l9_2153;
l9_2145=l9_2149;
l9_2148=l9_2145;
}
else
{
float2 l9_2191=float2(0.0);
l9_2191=l9_2147.Surface_UVCoord0;
l9_2146=l9_2191;
l9_2148=l9_2146;
}
l9_2144=l9_2148;
float2 l9_2192=float2(0.0);
l9_2192=l9_2144;
float2 l9_2193=float2(0.0);
l9_2193=l9_2192;
l9_2137=l9_2193;
l9_2140=l9_2137;
}
else
{
float2 l9_2194=float2(0.0);
l9_2194=l9_2139.Surface_UVCoord0;
l9_2138=l9_2194;
l9_2140=l9_2138;
}
}
}
}
l9_2133=l9_2140;
float2 l9_2195=float2(0.0);
float2 l9_2196=(*sc_set0.UserUniforms).uv3Scale;
l9_2195=l9_2196;
float2 l9_2197=float2(0.0);
l9_2197=l9_2195;
float2 l9_2198=float2(0.0);
float2 l9_2199=(*sc_set0.UserUniforms).uv3Offset;
l9_2198=l9_2199;
float2 l9_2200=float2(0.0);
l9_2200=l9_2198;
float2 l9_2201=float2(0.0);
l9_2201=(l9_2133*l9_2197)+l9_2200;
l9_2060=l9_2201;
l9_2062=l9_2060;
}
l9_2058=l9_2062;
l9_2054=l9_2058;
l9_2057=l9_2054;
}
else
{
float2 l9_2202=float2(0.0);
l9_2202=l9_2056.Surface_UVCoord0;
l9_2055=l9_2202;
l9_2057=l9_2055;
}
l9_2053=l9_2057;
float2 l9_2203=float2(0.0);
l9_2203=l9_2053;
float2 l9_2204=float2(0.0);
l9_2204=l9_2203;
l9_1997=l9_2204;
l9_2000=l9_1997;
}
else
{
float2 l9_2205=float2(0.0);
l9_2205=l9_1999.Surface_UVCoord0;
l9_1998=l9_2205;
l9_2000=l9_1998;
}
}
}
}
l9_1993=l9_2000;
float4 l9_2206=float4(0.0);
float2 l9_2207=l9_1993;
int l9_2208;
if ((int(normalTexHasSwappedViews_tmp)!=0))
{
int l9_2209=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2209=0;
}
else
{
l9_2209=in.varStereoViewID;
}
int l9_2210=l9_2209;
l9_2208=1-l9_2210;
}
else
{
int l9_2211=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2211=0;
}
else
{
l9_2211=in.varStereoViewID;
}
int l9_2212=l9_2211;
l9_2208=l9_2212;
}
int l9_2213=l9_2208;
int l9_2214=normalTexLayout_tmp;
int l9_2215=l9_2213;
float2 l9_2216=l9_2207;
bool l9_2217=(int(SC_USE_UV_TRANSFORM_normalTex_tmp)!=0);
float3x3 l9_2218=(*sc_set0.UserUniforms).normalTexTransform;
int2 l9_2219=int2(SC_SOFTWARE_WRAP_MODE_U_normalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_normalTex_tmp);
bool l9_2220=(int(SC_USE_UV_MIN_MAX_normalTex_tmp)!=0);
float4 l9_2221=(*sc_set0.UserUniforms).normalTexUvMinMax;
bool l9_2222=(int(SC_USE_CLAMP_TO_BORDER_normalTex_tmp)!=0);
float4 l9_2223=(*sc_set0.UserUniforms).normalTexBorderColor;
float l9_2224=0.0;
bool l9_2225=l9_2222&&(!l9_2220);
float l9_2226=1.0;
float l9_2227=l9_2216.x;
int l9_2228=l9_2219.x;
if (l9_2228==1)
{
l9_2227=fract(l9_2227);
}
else
{
if (l9_2228==2)
{
float l9_2229=fract(l9_2227);
float l9_2230=l9_2227-l9_2229;
float l9_2231=step(0.25,fract(l9_2230*0.5));
l9_2227=mix(l9_2229,1.0-l9_2229,fast::clamp(l9_2231,0.0,1.0));
}
}
l9_2216.x=l9_2227;
float l9_2232=l9_2216.y;
int l9_2233=l9_2219.y;
if (l9_2233==1)
{
l9_2232=fract(l9_2232);
}
else
{
if (l9_2233==2)
{
float l9_2234=fract(l9_2232);
float l9_2235=l9_2232-l9_2234;
float l9_2236=step(0.25,fract(l9_2235*0.5));
l9_2232=mix(l9_2234,1.0-l9_2234,fast::clamp(l9_2236,0.0,1.0));
}
}
l9_2216.y=l9_2232;
if (l9_2220)
{
bool l9_2237=l9_2222;
bool l9_2238;
if (l9_2237)
{
l9_2238=l9_2219.x==3;
}
else
{
l9_2238=l9_2237;
}
float l9_2239=l9_2216.x;
float l9_2240=l9_2221.x;
float l9_2241=l9_2221.z;
bool l9_2242=l9_2238;
float l9_2243=l9_2226;
float l9_2244=fast::clamp(l9_2239,l9_2240,l9_2241);
float l9_2245=step(abs(l9_2239-l9_2244),9.9999997e-06);
l9_2243*=(l9_2245+((1.0-float(l9_2242))*(1.0-l9_2245)));
l9_2239=l9_2244;
l9_2216.x=l9_2239;
l9_2226=l9_2243;
bool l9_2246=l9_2222;
bool l9_2247;
if (l9_2246)
{
l9_2247=l9_2219.y==3;
}
else
{
l9_2247=l9_2246;
}
float l9_2248=l9_2216.y;
float l9_2249=l9_2221.y;
float l9_2250=l9_2221.w;
bool l9_2251=l9_2247;
float l9_2252=l9_2226;
float l9_2253=fast::clamp(l9_2248,l9_2249,l9_2250);
float l9_2254=step(abs(l9_2248-l9_2253),9.9999997e-06);
l9_2252*=(l9_2254+((1.0-float(l9_2251))*(1.0-l9_2254)));
l9_2248=l9_2253;
l9_2216.y=l9_2248;
l9_2226=l9_2252;
}
float2 l9_2255=l9_2216;
bool l9_2256=l9_2217;
float3x3 l9_2257=l9_2218;
if (l9_2256)
{
l9_2255=float2((l9_2257*float3(l9_2255,1.0)).xy);
}
float2 l9_2258=l9_2255;
l9_2216=l9_2258;
float l9_2259=l9_2216.x;
int l9_2260=l9_2219.x;
bool l9_2261=l9_2225;
float l9_2262=l9_2226;
if ((l9_2260==0)||(l9_2260==3))
{
float l9_2263=l9_2259;
float l9_2264=0.0;
float l9_2265=1.0;
bool l9_2266=l9_2261;
float l9_2267=l9_2262;
float l9_2268=fast::clamp(l9_2263,l9_2264,l9_2265);
float l9_2269=step(abs(l9_2263-l9_2268),9.9999997e-06);
l9_2267*=(l9_2269+((1.0-float(l9_2266))*(1.0-l9_2269)));
l9_2263=l9_2268;
l9_2259=l9_2263;
l9_2262=l9_2267;
}
l9_2216.x=l9_2259;
l9_2226=l9_2262;
float l9_2270=l9_2216.y;
int l9_2271=l9_2219.y;
bool l9_2272=l9_2225;
float l9_2273=l9_2226;
if ((l9_2271==0)||(l9_2271==3))
{
float l9_2274=l9_2270;
float l9_2275=0.0;
float l9_2276=1.0;
bool l9_2277=l9_2272;
float l9_2278=l9_2273;
float l9_2279=fast::clamp(l9_2274,l9_2275,l9_2276);
float l9_2280=step(abs(l9_2274-l9_2279),9.9999997e-06);
l9_2278*=(l9_2280+((1.0-float(l9_2277))*(1.0-l9_2280)));
l9_2274=l9_2279;
l9_2270=l9_2274;
l9_2273=l9_2278;
}
l9_2216.y=l9_2270;
l9_2226=l9_2273;
float2 l9_2281=l9_2216;
int l9_2282=l9_2214;
int l9_2283=l9_2215;
float l9_2284=l9_2224;
float2 l9_2285=l9_2281;
int l9_2286=l9_2282;
int l9_2287=l9_2283;
float3 l9_2288=float3(0.0);
if (l9_2286==0)
{
l9_2288=float3(l9_2285,0.0);
}
else
{
if (l9_2286==1)
{
l9_2288=float3(l9_2285.x,(l9_2285.y*0.5)+(0.5-(float(l9_2287)*0.5)),0.0);
}
else
{
l9_2288=float3(l9_2285,float(l9_2287));
}
}
float3 l9_2289=l9_2288;
float3 l9_2290=l9_2289;
float4 l9_2291=sc_set0.normalTex.sample(sc_set0.normalTexSmpSC,l9_2290.xy,bias(l9_2284));
float4 l9_2292=l9_2291;
if (l9_2222)
{
l9_2292=mix(l9_2223,l9_2292,float4(l9_2226));
}
float4 l9_2293=l9_2292;
float4 l9_2294=l9_2293;
float3 l9_2295=(l9_2294.xyz*1.9921875)-float3(1.0);
l9_2294=float4(l9_2295.x,l9_2295.y,l9_2295.z,l9_2294.w);
l9_2206=l9_2294;
float3 l9_2296=float3(0.0);
float3 l9_2297=float3(0.0);
float3 l9_2298=(*sc_set0.UserUniforms).Port_Default_N113;
ssGlobals l9_2299=param_30;
float3 l9_2300;
if ((int(ENABLE_DETAIL_NORMAL_tmp)!=0))
{
float2 l9_2301=float2(0.0);
float2 l9_2302=float2(0.0);
float2 l9_2303=float2(0.0);
float2 l9_2304=float2(0.0);
float2 l9_2305=float2(0.0);
float2 l9_2306=float2(0.0);
ssGlobals l9_2307=l9_2299;
float2 l9_2308;
if (NODE_184_DROPLIST_ITEM_tmp==0)
{
float2 l9_2309=float2(0.0);
l9_2309=l9_2307.Surface_UVCoord0;
l9_2302=l9_2309;
l9_2308=l9_2302;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==1)
{
float2 l9_2310=float2(0.0);
l9_2310=l9_2307.Surface_UVCoord1;
l9_2303=l9_2310;
l9_2308=l9_2303;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==2)
{
float2 l9_2311=float2(0.0);
float2 l9_2312=float2(0.0);
float2 l9_2313=float2(0.0);
ssGlobals l9_2314=l9_2307;
float2 l9_2315;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2316=float2(0.0);
float2 l9_2317=float2(0.0);
float2 l9_2318=float2(0.0);
ssGlobals l9_2319=l9_2314;
float2 l9_2320;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2321=float2(0.0);
float2 l9_2322=float2(0.0);
float2 l9_2323=float2(0.0);
float2 l9_2324=float2(0.0);
float2 l9_2325=float2(0.0);
ssGlobals l9_2326=l9_2319;
float2 l9_2327;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2328=float2(0.0);
l9_2328=l9_2326.Surface_UVCoord0;
l9_2322=l9_2328;
l9_2327=l9_2322;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2329=float2(0.0);
l9_2329=l9_2326.Surface_UVCoord1;
l9_2323=l9_2329;
l9_2327=l9_2323;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2330=float2(0.0);
l9_2330=l9_2326.gScreenCoord;
l9_2324=l9_2330;
l9_2327=l9_2324;
}
else
{
float2 l9_2331=float2(0.0);
l9_2331=l9_2326.Surface_UVCoord0;
l9_2325=l9_2331;
l9_2327=l9_2325;
}
}
}
l9_2321=l9_2327;
float2 l9_2332=float2(0.0);
float2 l9_2333=(*sc_set0.UserUniforms).uv2Scale;
l9_2332=l9_2333;
float2 l9_2334=float2(0.0);
l9_2334=l9_2332;
float2 l9_2335=float2(0.0);
float2 l9_2336=(*sc_set0.UserUniforms).uv2Offset;
l9_2335=l9_2336;
float2 l9_2337=float2(0.0);
l9_2337=l9_2335;
float2 l9_2338=float2(0.0);
l9_2338=(l9_2321*l9_2334)+l9_2337;
float2 l9_2339=float2(0.0);
l9_2339=l9_2338+(l9_2337*(l9_2319.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2317=l9_2339;
l9_2320=l9_2317;
}
else
{
float2 l9_2340=float2(0.0);
float2 l9_2341=float2(0.0);
float2 l9_2342=float2(0.0);
float2 l9_2343=float2(0.0);
float2 l9_2344=float2(0.0);
ssGlobals l9_2345=l9_2319;
float2 l9_2346;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2347=float2(0.0);
l9_2347=l9_2345.Surface_UVCoord0;
l9_2341=l9_2347;
l9_2346=l9_2341;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2348=float2(0.0);
l9_2348=l9_2345.Surface_UVCoord1;
l9_2342=l9_2348;
l9_2346=l9_2342;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2349=float2(0.0);
l9_2349=l9_2345.gScreenCoord;
l9_2343=l9_2349;
l9_2346=l9_2343;
}
else
{
float2 l9_2350=float2(0.0);
l9_2350=l9_2345.Surface_UVCoord0;
l9_2344=l9_2350;
l9_2346=l9_2344;
}
}
}
l9_2340=l9_2346;
float2 l9_2351=float2(0.0);
float2 l9_2352=(*sc_set0.UserUniforms).uv2Scale;
l9_2351=l9_2352;
float2 l9_2353=float2(0.0);
l9_2353=l9_2351;
float2 l9_2354=float2(0.0);
float2 l9_2355=(*sc_set0.UserUniforms).uv2Offset;
l9_2354=l9_2355;
float2 l9_2356=float2(0.0);
l9_2356=l9_2354;
float2 l9_2357=float2(0.0);
l9_2357=(l9_2340*l9_2353)+l9_2356;
l9_2318=l9_2357;
l9_2320=l9_2318;
}
l9_2316=l9_2320;
l9_2312=l9_2316;
l9_2315=l9_2312;
}
else
{
float2 l9_2358=float2(0.0);
l9_2358=l9_2314.Surface_UVCoord0;
l9_2313=l9_2358;
l9_2315=l9_2313;
}
l9_2311=l9_2315;
float2 l9_2359=float2(0.0);
l9_2359=l9_2311;
float2 l9_2360=float2(0.0);
l9_2360=l9_2359;
l9_2304=l9_2360;
l9_2308=l9_2304;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==3)
{
float2 l9_2361=float2(0.0);
float2 l9_2362=float2(0.0);
float2 l9_2363=float2(0.0);
ssGlobals l9_2364=l9_2307;
float2 l9_2365;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_2366=float2(0.0);
float2 l9_2367=float2(0.0);
float2 l9_2368=float2(0.0);
ssGlobals l9_2369=l9_2364;
float2 l9_2370;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_2371=float2(0.0);
float2 l9_2372=float2(0.0);
float2 l9_2373=float2(0.0);
float2 l9_2374=float2(0.0);
float2 l9_2375=float2(0.0);
float2 l9_2376=float2(0.0);
ssGlobals l9_2377=l9_2369;
float2 l9_2378;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_2379=float2(0.0);
l9_2379=l9_2377.Surface_UVCoord0;
l9_2372=l9_2379;
l9_2378=l9_2372;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_2380=float2(0.0);
l9_2380=l9_2377.Surface_UVCoord1;
l9_2373=l9_2380;
l9_2378=l9_2373;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_2381=float2(0.0);
l9_2381=l9_2377.gScreenCoord;
l9_2374=l9_2381;
l9_2378=l9_2374;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_2382=float2(0.0);
float2 l9_2383=float2(0.0);
float2 l9_2384=float2(0.0);
ssGlobals l9_2385=l9_2377;
float2 l9_2386;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2387=float2(0.0);
float2 l9_2388=float2(0.0);
float2 l9_2389=float2(0.0);
ssGlobals l9_2390=l9_2385;
float2 l9_2391;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2392=float2(0.0);
float2 l9_2393=float2(0.0);
float2 l9_2394=float2(0.0);
float2 l9_2395=float2(0.0);
float2 l9_2396=float2(0.0);
ssGlobals l9_2397=l9_2390;
float2 l9_2398;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2399=float2(0.0);
l9_2399=l9_2397.Surface_UVCoord0;
l9_2393=l9_2399;
l9_2398=l9_2393;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2400=float2(0.0);
l9_2400=l9_2397.Surface_UVCoord1;
l9_2394=l9_2400;
l9_2398=l9_2394;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2401=float2(0.0);
l9_2401=l9_2397.gScreenCoord;
l9_2395=l9_2401;
l9_2398=l9_2395;
}
else
{
float2 l9_2402=float2(0.0);
l9_2402=l9_2397.Surface_UVCoord0;
l9_2396=l9_2402;
l9_2398=l9_2396;
}
}
}
l9_2392=l9_2398;
float2 l9_2403=float2(0.0);
float2 l9_2404=(*sc_set0.UserUniforms).uv2Scale;
l9_2403=l9_2404;
float2 l9_2405=float2(0.0);
l9_2405=l9_2403;
float2 l9_2406=float2(0.0);
float2 l9_2407=(*sc_set0.UserUniforms).uv2Offset;
l9_2406=l9_2407;
float2 l9_2408=float2(0.0);
l9_2408=l9_2406;
float2 l9_2409=float2(0.0);
l9_2409=(l9_2392*l9_2405)+l9_2408;
float2 l9_2410=float2(0.0);
l9_2410=l9_2409+(l9_2408*(l9_2390.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2388=l9_2410;
l9_2391=l9_2388;
}
else
{
float2 l9_2411=float2(0.0);
float2 l9_2412=float2(0.0);
float2 l9_2413=float2(0.0);
float2 l9_2414=float2(0.0);
float2 l9_2415=float2(0.0);
ssGlobals l9_2416=l9_2390;
float2 l9_2417;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2418=float2(0.0);
l9_2418=l9_2416.Surface_UVCoord0;
l9_2412=l9_2418;
l9_2417=l9_2412;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2419=float2(0.0);
l9_2419=l9_2416.Surface_UVCoord1;
l9_2413=l9_2419;
l9_2417=l9_2413;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2420=float2(0.0);
l9_2420=l9_2416.gScreenCoord;
l9_2414=l9_2420;
l9_2417=l9_2414;
}
else
{
float2 l9_2421=float2(0.0);
l9_2421=l9_2416.Surface_UVCoord0;
l9_2415=l9_2421;
l9_2417=l9_2415;
}
}
}
l9_2411=l9_2417;
float2 l9_2422=float2(0.0);
float2 l9_2423=(*sc_set0.UserUniforms).uv2Scale;
l9_2422=l9_2423;
float2 l9_2424=float2(0.0);
l9_2424=l9_2422;
float2 l9_2425=float2(0.0);
float2 l9_2426=(*sc_set0.UserUniforms).uv2Offset;
l9_2425=l9_2426;
float2 l9_2427=float2(0.0);
l9_2427=l9_2425;
float2 l9_2428=float2(0.0);
l9_2428=(l9_2411*l9_2424)+l9_2427;
l9_2389=l9_2428;
l9_2391=l9_2389;
}
l9_2387=l9_2391;
l9_2383=l9_2387;
l9_2386=l9_2383;
}
else
{
float2 l9_2429=float2(0.0);
l9_2429=l9_2385.Surface_UVCoord0;
l9_2384=l9_2429;
l9_2386=l9_2384;
}
l9_2382=l9_2386;
float2 l9_2430=float2(0.0);
l9_2430=l9_2382;
float2 l9_2431=float2(0.0);
l9_2431=l9_2430;
l9_2375=l9_2431;
l9_2378=l9_2375;
}
else
{
float2 l9_2432=float2(0.0);
l9_2432=l9_2377.Surface_UVCoord0;
l9_2376=l9_2432;
l9_2378=l9_2376;
}
}
}
}
l9_2371=l9_2378;
float2 l9_2433=float2(0.0);
float2 l9_2434=(*sc_set0.UserUniforms).uv3Scale;
l9_2433=l9_2434;
float2 l9_2435=float2(0.0);
l9_2435=l9_2433;
float2 l9_2436=float2(0.0);
float2 l9_2437=(*sc_set0.UserUniforms).uv3Offset;
l9_2436=l9_2437;
float2 l9_2438=float2(0.0);
l9_2438=l9_2436;
float2 l9_2439=float2(0.0);
l9_2439=(l9_2371*l9_2435)+l9_2438;
float2 l9_2440=float2(0.0);
l9_2440=l9_2439+(l9_2438*(l9_2369.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_2367=l9_2440;
l9_2370=l9_2367;
}
else
{
float2 l9_2441=float2(0.0);
float2 l9_2442=float2(0.0);
float2 l9_2443=float2(0.0);
float2 l9_2444=float2(0.0);
float2 l9_2445=float2(0.0);
float2 l9_2446=float2(0.0);
ssGlobals l9_2447=l9_2369;
float2 l9_2448;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_2449=float2(0.0);
l9_2449=l9_2447.Surface_UVCoord0;
l9_2442=l9_2449;
l9_2448=l9_2442;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_2450=float2(0.0);
l9_2450=l9_2447.Surface_UVCoord1;
l9_2443=l9_2450;
l9_2448=l9_2443;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_2451=float2(0.0);
l9_2451=l9_2447.gScreenCoord;
l9_2444=l9_2451;
l9_2448=l9_2444;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_2452=float2(0.0);
float2 l9_2453=float2(0.0);
float2 l9_2454=float2(0.0);
ssGlobals l9_2455=l9_2447;
float2 l9_2456;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2457=float2(0.0);
float2 l9_2458=float2(0.0);
float2 l9_2459=float2(0.0);
ssGlobals l9_2460=l9_2455;
float2 l9_2461;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2462=float2(0.0);
float2 l9_2463=float2(0.0);
float2 l9_2464=float2(0.0);
float2 l9_2465=float2(0.0);
float2 l9_2466=float2(0.0);
ssGlobals l9_2467=l9_2460;
float2 l9_2468;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2469=float2(0.0);
l9_2469=l9_2467.Surface_UVCoord0;
l9_2463=l9_2469;
l9_2468=l9_2463;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2470=float2(0.0);
l9_2470=l9_2467.Surface_UVCoord1;
l9_2464=l9_2470;
l9_2468=l9_2464;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2471=float2(0.0);
l9_2471=l9_2467.gScreenCoord;
l9_2465=l9_2471;
l9_2468=l9_2465;
}
else
{
float2 l9_2472=float2(0.0);
l9_2472=l9_2467.Surface_UVCoord0;
l9_2466=l9_2472;
l9_2468=l9_2466;
}
}
}
l9_2462=l9_2468;
float2 l9_2473=float2(0.0);
float2 l9_2474=(*sc_set0.UserUniforms).uv2Scale;
l9_2473=l9_2474;
float2 l9_2475=float2(0.0);
l9_2475=l9_2473;
float2 l9_2476=float2(0.0);
float2 l9_2477=(*sc_set0.UserUniforms).uv2Offset;
l9_2476=l9_2477;
float2 l9_2478=float2(0.0);
l9_2478=l9_2476;
float2 l9_2479=float2(0.0);
l9_2479=(l9_2462*l9_2475)+l9_2478;
float2 l9_2480=float2(0.0);
l9_2480=l9_2479+(l9_2478*(l9_2460.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2458=l9_2480;
l9_2461=l9_2458;
}
else
{
float2 l9_2481=float2(0.0);
float2 l9_2482=float2(0.0);
float2 l9_2483=float2(0.0);
float2 l9_2484=float2(0.0);
float2 l9_2485=float2(0.0);
ssGlobals l9_2486=l9_2460;
float2 l9_2487;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2488=float2(0.0);
l9_2488=l9_2486.Surface_UVCoord0;
l9_2482=l9_2488;
l9_2487=l9_2482;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2489=float2(0.0);
l9_2489=l9_2486.Surface_UVCoord1;
l9_2483=l9_2489;
l9_2487=l9_2483;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2490=float2(0.0);
l9_2490=l9_2486.gScreenCoord;
l9_2484=l9_2490;
l9_2487=l9_2484;
}
else
{
float2 l9_2491=float2(0.0);
l9_2491=l9_2486.Surface_UVCoord0;
l9_2485=l9_2491;
l9_2487=l9_2485;
}
}
}
l9_2481=l9_2487;
float2 l9_2492=float2(0.0);
float2 l9_2493=(*sc_set0.UserUniforms).uv2Scale;
l9_2492=l9_2493;
float2 l9_2494=float2(0.0);
l9_2494=l9_2492;
float2 l9_2495=float2(0.0);
float2 l9_2496=(*sc_set0.UserUniforms).uv2Offset;
l9_2495=l9_2496;
float2 l9_2497=float2(0.0);
l9_2497=l9_2495;
float2 l9_2498=float2(0.0);
l9_2498=(l9_2481*l9_2494)+l9_2497;
l9_2459=l9_2498;
l9_2461=l9_2459;
}
l9_2457=l9_2461;
l9_2453=l9_2457;
l9_2456=l9_2453;
}
else
{
float2 l9_2499=float2(0.0);
l9_2499=l9_2455.Surface_UVCoord0;
l9_2454=l9_2499;
l9_2456=l9_2454;
}
l9_2452=l9_2456;
float2 l9_2500=float2(0.0);
l9_2500=l9_2452;
float2 l9_2501=float2(0.0);
l9_2501=l9_2500;
l9_2445=l9_2501;
l9_2448=l9_2445;
}
else
{
float2 l9_2502=float2(0.0);
l9_2502=l9_2447.Surface_UVCoord0;
l9_2446=l9_2502;
l9_2448=l9_2446;
}
}
}
}
l9_2441=l9_2448;
float2 l9_2503=float2(0.0);
float2 l9_2504=(*sc_set0.UserUniforms).uv3Scale;
l9_2503=l9_2504;
float2 l9_2505=float2(0.0);
l9_2505=l9_2503;
float2 l9_2506=float2(0.0);
float2 l9_2507=(*sc_set0.UserUniforms).uv3Offset;
l9_2506=l9_2507;
float2 l9_2508=float2(0.0);
l9_2508=l9_2506;
float2 l9_2509=float2(0.0);
l9_2509=(l9_2441*l9_2505)+l9_2508;
l9_2368=l9_2509;
l9_2370=l9_2368;
}
l9_2366=l9_2370;
l9_2362=l9_2366;
l9_2365=l9_2362;
}
else
{
float2 l9_2510=float2(0.0);
l9_2510=l9_2364.Surface_UVCoord0;
l9_2363=l9_2510;
l9_2365=l9_2363;
}
l9_2361=l9_2365;
float2 l9_2511=float2(0.0);
l9_2511=l9_2361;
float2 l9_2512=float2(0.0);
l9_2512=l9_2511;
l9_2305=l9_2512;
l9_2308=l9_2305;
}
else
{
float2 l9_2513=float2(0.0);
l9_2513=l9_2307.Surface_UVCoord0;
l9_2306=l9_2513;
l9_2308=l9_2306;
}
}
}
}
l9_2301=l9_2308;
float4 l9_2514=float4(0.0);
float2 l9_2515=l9_2301;
int l9_2516;
if ((int(detailNormalTexHasSwappedViews_tmp)!=0))
{
int l9_2517=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2517=0;
}
else
{
l9_2517=in.varStereoViewID;
}
int l9_2518=l9_2517;
l9_2516=1-l9_2518;
}
else
{
int l9_2519=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2519=0;
}
else
{
l9_2519=in.varStereoViewID;
}
int l9_2520=l9_2519;
l9_2516=l9_2520;
}
int l9_2521=l9_2516;
int l9_2522=detailNormalTexLayout_tmp;
int l9_2523=l9_2521;
float2 l9_2524=l9_2515;
bool l9_2525=(int(SC_USE_UV_TRANSFORM_detailNormalTex_tmp)!=0);
float3x3 l9_2526=(*sc_set0.UserUniforms).detailNormalTexTransform;
int2 l9_2527=int2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex_tmp);
bool l9_2528=(int(SC_USE_UV_MIN_MAX_detailNormalTex_tmp)!=0);
float4 l9_2529=(*sc_set0.UserUniforms).detailNormalTexUvMinMax;
bool l9_2530=(int(SC_USE_CLAMP_TO_BORDER_detailNormalTex_tmp)!=0);
float4 l9_2531=(*sc_set0.UserUniforms).detailNormalTexBorderColor;
float l9_2532=0.0;
bool l9_2533=l9_2530&&(!l9_2528);
float l9_2534=1.0;
float l9_2535=l9_2524.x;
int l9_2536=l9_2527.x;
if (l9_2536==1)
{
l9_2535=fract(l9_2535);
}
else
{
if (l9_2536==2)
{
float l9_2537=fract(l9_2535);
float l9_2538=l9_2535-l9_2537;
float l9_2539=step(0.25,fract(l9_2538*0.5));
l9_2535=mix(l9_2537,1.0-l9_2537,fast::clamp(l9_2539,0.0,1.0));
}
}
l9_2524.x=l9_2535;
float l9_2540=l9_2524.y;
int l9_2541=l9_2527.y;
if (l9_2541==1)
{
l9_2540=fract(l9_2540);
}
else
{
if (l9_2541==2)
{
float l9_2542=fract(l9_2540);
float l9_2543=l9_2540-l9_2542;
float l9_2544=step(0.25,fract(l9_2543*0.5));
l9_2540=mix(l9_2542,1.0-l9_2542,fast::clamp(l9_2544,0.0,1.0));
}
}
l9_2524.y=l9_2540;
if (l9_2528)
{
bool l9_2545=l9_2530;
bool l9_2546;
if (l9_2545)
{
l9_2546=l9_2527.x==3;
}
else
{
l9_2546=l9_2545;
}
float l9_2547=l9_2524.x;
float l9_2548=l9_2529.x;
float l9_2549=l9_2529.z;
bool l9_2550=l9_2546;
float l9_2551=l9_2534;
float l9_2552=fast::clamp(l9_2547,l9_2548,l9_2549);
float l9_2553=step(abs(l9_2547-l9_2552),9.9999997e-06);
l9_2551*=(l9_2553+((1.0-float(l9_2550))*(1.0-l9_2553)));
l9_2547=l9_2552;
l9_2524.x=l9_2547;
l9_2534=l9_2551;
bool l9_2554=l9_2530;
bool l9_2555;
if (l9_2554)
{
l9_2555=l9_2527.y==3;
}
else
{
l9_2555=l9_2554;
}
float l9_2556=l9_2524.y;
float l9_2557=l9_2529.y;
float l9_2558=l9_2529.w;
bool l9_2559=l9_2555;
float l9_2560=l9_2534;
float l9_2561=fast::clamp(l9_2556,l9_2557,l9_2558);
float l9_2562=step(abs(l9_2556-l9_2561),9.9999997e-06);
l9_2560*=(l9_2562+((1.0-float(l9_2559))*(1.0-l9_2562)));
l9_2556=l9_2561;
l9_2524.y=l9_2556;
l9_2534=l9_2560;
}
float2 l9_2563=l9_2524;
bool l9_2564=l9_2525;
float3x3 l9_2565=l9_2526;
if (l9_2564)
{
l9_2563=float2((l9_2565*float3(l9_2563,1.0)).xy);
}
float2 l9_2566=l9_2563;
l9_2524=l9_2566;
float l9_2567=l9_2524.x;
int l9_2568=l9_2527.x;
bool l9_2569=l9_2533;
float l9_2570=l9_2534;
if ((l9_2568==0)||(l9_2568==3))
{
float l9_2571=l9_2567;
float l9_2572=0.0;
float l9_2573=1.0;
bool l9_2574=l9_2569;
float l9_2575=l9_2570;
float l9_2576=fast::clamp(l9_2571,l9_2572,l9_2573);
float l9_2577=step(abs(l9_2571-l9_2576),9.9999997e-06);
l9_2575*=(l9_2577+((1.0-float(l9_2574))*(1.0-l9_2577)));
l9_2571=l9_2576;
l9_2567=l9_2571;
l9_2570=l9_2575;
}
l9_2524.x=l9_2567;
l9_2534=l9_2570;
float l9_2578=l9_2524.y;
int l9_2579=l9_2527.y;
bool l9_2580=l9_2533;
float l9_2581=l9_2534;
if ((l9_2579==0)||(l9_2579==3))
{
float l9_2582=l9_2578;
float l9_2583=0.0;
float l9_2584=1.0;
bool l9_2585=l9_2580;
float l9_2586=l9_2581;
float l9_2587=fast::clamp(l9_2582,l9_2583,l9_2584);
float l9_2588=step(abs(l9_2582-l9_2587),9.9999997e-06);
l9_2586*=(l9_2588+((1.0-float(l9_2585))*(1.0-l9_2588)));
l9_2582=l9_2587;
l9_2578=l9_2582;
l9_2581=l9_2586;
}
l9_2524.y=l9_2578;
l9_2534=l9_2581;
float2 l9_2589=l9_2524;
int l9_2590=l9_2522;
int l9_2591=l9_2523;
float l9_2592=l9_2532;
float2 l9_2593=l9_2589;
int l9_2594=l9_2590;
int l9_2595=l9_2591;
float3 l9_2596=float3(0.0);
if (l9_2594==0)
{
l9_2596=float3(l9_2593,0.0);
}
else
{
if (l9_2594==1)
{
l9_2596=float3(l9_2593.x,(l9_2593.y*0.5)+(0.5-(float(l9_2595)*0.5)),0.0);
}
else
{
l9_2596=float3(l9_2593,float(l9_2595));
}
}
float3 l9_2597=l9_2596;
float3 l9_2598=l9_2597;
float4 l9_2599=sc_set0.detailNormalTex.sample(sc_set0.detailNormalTexSmpSC,l9_2598.xy,bias(l9_2592));
float4 l9_2600=l9_2599;
if (l9_2530)
{
l9_2600=mix(l9_2531,l9_2600,float4(l9_2534));
}
float4 l9_2601=l9_2600;
float4 l9_2602=l9_2601;
float3 l9_2603=(l9_2602.xyz*1.9921875)-float3(1.0);
l9_2602=float4(l9_2603.x,l9_2603.y,l9_2603.z,l9_2602.w);
l9_2514=l9_2602;
l9_2297=l9_2514.xyz;
l9_2300=l9_2297;
}
else
{
l9_2300=l9_2298;
}
l9_2296=l9_2300;
float3 l9_2604=float3(0.0);
float3 l9_2605=l9_2206.xyz;
float l9_2606=(*sc_set0.UserUniforms).Port_Strength1_N200;
float3 l9_2607=l9_2296;
float l9_2608=(*sc_set0.UserUniforms).Port_Strength2_N200;
float3 l9_2609=l9_2605;
float l9_2610=l9_2606;
float3 l9_2611=l9_2607;
float l9_2612=l9_2608;
float3 l9_2613=mix(float3(0.0,0.0,1.0),l9_2609,float3(l9_2610))+float3(0.0,0.0,1.0);
float3 l9_2614=mix(float3(0.0,0.0,1.0),l9_2611,float3(l9_2612))*float3(-1.0,-1.0,1.0);
float3 l9_2615=normalize((l9_2613*dot(l9_2613,l9_2614))-(l9_2614*l9_2613.z));
l9_2607=l9_2615;
float3 l9_2616=l9_2607;
l9_2604=l9_2616;
float3 l9_2617=float3(0.0);
l9_2617=l9_1992*l9_2604;
float3 l9_2618=float3(0.0);
float3 l9_2619=l9_2617;
float l9_2620=dot(l9_2619,l9_2619);
float l9_2621;
if (l9_2620>0.0)
{
l9_2621=1.0/sqrt(l9_2620);
}
else
{
l9_2621=0.0;
}
float l9_2622=l9_2621;
float3 l9_2623=l9_2619*l9_2622;
l9_2618=l9_2623;
param_27=l9_2618;
param_29=param_27;
}
else
{
float3 l9_2624=float3(0.0);
l9_2624=param_30.VertexNormal_WorldSpace;
float3 l9_2625=float3(0.0);
float3 l9_2626=l9_2624;
float l9_2627=dot(l9_2626,l9_2626);
float l9_2628;
if (l9_2627>0.0)
{
l9_2628=1.0/sqrt(l9_2627);
}
else
{
l9_2628=0.0;
}
float l9_2629=l9_2628;
float3 l9_2630=l9_2626*l9_2629;
l9_2625=l9_2630;
param_28=l9_2625;
param_29=param_28;
}
Result_N337=param_29;
float3 Export_N334=float3(0.0);
Export_N334=Result_N337;
float4 Output_N36=float4(0.0);
float3 param_31=Export_N364.xyz;
float param_32=Export_N158;
float3 param_33=Export_N334;
float3 param_34=(*sc_set0.UserUniforms).Port_Emissive_N036;
float3 param_35=(*sc_set0.UserUniforms).Port_AO_N036;
ssGlobals param_37=Globals;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_37.BumpedNormal=param_33;
}
param_32=fast::clamp(param_32,0.0,1.0);
float l9_2631=param_32;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_2631<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_2632=gl_FragCoord;
float2 l9_2633=floor(mod(l9_2632.xy,float2(4.0)));
float l9_2634=(mod(dot(l9_2633,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_2631<l9_2634)
{
discard_fragment();
}
}
param_31=fast::max(param_31,float3(0.0));
float4 param_36;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_36=float4(param_31,param_32);
}
else
{
float l9_2635=0.0;
float l9_2636=1.0;
float3 l9_2637=float3(1.0);
float3 l9_2638=param_31;
float l9_2639=param_32;
float3 l9_2640=param_37.BumpedNormal;
float3 l9_2641=param_37.PositionWS;
float3 l9_2642=param_37.ViewDirWS;
float3 l9_2643=param_34;
float l9_2644=l9_2635;
float l9_2645=l9_2636;
float3 l9_2646=param_35;
float3 l9_2647=l9_2637;
param_36=ngsCalculateLighting(l9_2638,l9_2639,l9_2640,l9_2641,l9_2642,l9_2643,l9_2644,l9_2645,l9_2646,l9_2647,in.varStereoViewID,sc_set0.sc_EnvmapDiffuse,sc_set0.sc_EnvmapDiffuseSmpSC,sc_set0.sc_EnvmapSpecular,sc_set0.sc_EnvmapSpecularSmpSC,sc_set0.sc_ScreenTexture,sc_set0.sc_ScreenTextureSmpSC,sc_set0.sc_RayTracingGlobalIllumination,sc_set0.sc_RayTracingGlobalIlluminationSmpSC,sc_set0.sc_RayTracingShadows,sc_set0.sc_RayTracingShadowsSmpSC,gl_FragCoord,(*sc_set0.UserUniforms),in.varShadowTex,sc_set0.sc_ShadowTexture,sc_set0.sc_ShadowTextureSmpSC,out.sc_FragData0,sc_set0.sc_SSAOTexture,sc_set0.sc_SSAOTextureSmpSC);
}
param_36=fast::max(param_36,float4(0.0));
Output_N36=param_36;
float Output_N66=0.0;
float param_38=(*sc_set0.UserUniforms).colorMultiplier;
Output_N66=param_38;
float Output_N70=0.0;
Output_N70=Output_N66+1.0;
float4 Output_N74=float4(0.0);
Output_N74=Output_N36*float4(Output_N70);
float Value4_N75=0.0;
float4 param_39=Output_N36;
float param_40=param_39.w;
Value4_N75=param_40;
float4 Value_N76=float4(0.0);
Value_N76=float4(Output_N74.xyz.x,Output_N74.xyz.y,Output_N74.xyz.z,Value_N76.w);
Value_N76.w=Value4_N75;
FinalColor=Value_N76;
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param_41=FinalColor;
if ((int(sc_RayTracingCasterForceOpaque_tmp)!=0))
{
param_41.w=1.0;
}
float4 l9_2648=fast::max(param_41,float4(0.0));
float4 param_42=l9_2648;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_42.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_42;
return out;
}
float4 param_43=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_2649=param_43;
float4 l9_2650=l9_2649;
float l9_2651=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_2651=l9_2650.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_2651=fast::clamp(l9_2650.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_2651=fast::clamp(dot(l9_2650.xyz,float3(l9_2650.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_2651=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_2651=(1.0-dot(l9_2650.xyz,float3(0.33333001)))*l9_2650.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_2651=(1.0-fast::clamp(dot(l9_2650.xyz,float3(1.0)),0.0,1.0))*l9_2650.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_2651=fast::clamp(dot(l9_2650.xyz,float3(1.0)),0.0,1.0)*l9_2650.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_2651=fast::clamp(dot(l9_2650.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_2651=fast::clamp(dot(l9_2650.xyz,float3(1.0)),0.0,1.0)*l9_2650.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_2651=dot(l9_2650.xyz,float3(0.33333001))*l9_2650.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_2651=1.0-fast::clamp(dot(l9_2650.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_2651=fast::clamp(dot(l9_2650.xyz,float3(1.0)),0.0,1.0);
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
float l9_2652=l9_2651;
float l9_2653=l9_2652;
float l9_2654=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_2653;
float3 l9_2655=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_2649.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_2656=float4(l9_2655.x,l9_2655.y,l9_2655.z,l9_2654);
param_43=l9_2656;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_43=float4(param_43.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_2657=param_43;
float4 l9_2658=float4(0.0);
float4 l9_2659=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_2660=out.sc_FragData0;
l9_2659=l9_2660;
}
else
{
float4 l9_2661=gl_FragCoord;
float2 l9_2662=l9_2661.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_2663=l9_2662;
float2 l9_2664=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_2665=1;
int l9_2666=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2666=0;
}
else
{
l9_2666=in.varStereoViewID;
}
int l9_2667=l9_2666;
int l9_2668=l9_2667;
float3 l9_2669=float3(l9_2663,0.0);
int l9_2670=l9_2665;
int l9_2671=l9_2668;
if (l9_2670==1)
{
l9_2669.y=((2.0*l9_2669.y)+float(l9_2671))-1.0;
}
float2 l9_2672=l9_2669.xy;
l9_2664=l9_2672;
}
else
{
l9_2664=l9_2663;
}
float2 l9_2673=l9_2664;
float2 l9_2674=l9_2673;
float2 l9_2675=l9_2674;
float2 l9_2676=l9_2675;
float l9_2677=0.0;
int l9_2678;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_2679=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2679=0;
}
else
{
l9_2679=in.varStereoViewID;
}
int l9_2680=l9_2679;
l9_2678=1-l9_2680;
}
else
{
int l9_2681=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2681=0;
}
else
{
l9_2681=in.varStereoViewID;
}
int l9_2682=l9_2681;
l9_2678=l9_2682;
}
int l9_2683=l9_2678;
float2 l9_2684=l9_2676;
int l9_2685=sc_ScreenTextureLayout_tmp;
int l9_2686=l9_2683;
float l9_2687=l9_2677;
float2 l9_2688=l9_2684;
int l9_2689=l9_2685;
int l9_2690=l9_2686;
float3 l9_2691=float3(0.0);
if (l9_2689==0)
{
l9_2691=float3(l9_2688,0.0);
}
else
{
if (l9_2689==1)
{
l9_2691=float3(l9_2688.x,(l9_2688.y*0.5)+(0.5-(float(l9_2690)*0.5)),0.0);
}
else
{
l9_2691=float3(l9_2688,float(l9_2690));
}
}
float3 l9_2692=l9_2691;
float3 l9_2693=l9_2692;
float4 l9_2694=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_2693.xy,bias(l9_2687));
float4 l9_2695=l9_2694;
float4 l9_2696=l9_2695;
l9_2659=l9_2696;
}
float4 l9_2697=l9_2659;
float3 l9_2698=l9_2697.xyz;
float3 l9_2699=l9_2698;
float3 l9_2700=l9_2657.xyz;
float3 l9_2701=definedBlend(l9_2699,l9_2700,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_2658=float4(l9_2701.x,l9_2701.y,l9_2701.z,l9_2658.w);
float3 l9_2702=mix(l9_2698,l9_2658.xyz,float3(l9_2657.w));
l9_2658=float4(l9_2702.x,l9_2702.y,l9_2702.z,l9_2658.w);
l9_2658.w=1.0;
float4 l9_2703=l9_2658;
param_43=l9_2703;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_2704=float4(in.varScreenPos.xyz,1.0);
param_43=l9_2704;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_2705=gl_FragCoord;
float l9_2706=fast::clamp(abs(l9_2705.z),0.0,1.0);
float4 l9_2707=float4(l9_2706,1.0-l9_2706,1.0,1.0);
param_43=l9_2707;
}
else
{
float4 l9_2708=param_43;
float4 l9_2709=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_2709=float4(mix(float3(1.0),l9_2708.xyz,float3(l9_2708.w)),l9_2708.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_2710=l9_2708.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_2710=fast::clamp(l9_2710,0.0,1.0);
}
l9_2709=float4(l9_2708.xyz*l9_2710,l9_2710);
}
else
{
l9_2709=l9_2708;
}
}
float4 l9_2711=l9_2709;
param_43=l9_2711;
}
}
}
}
}
float4 l9_2712=param_43;
FinalColor=l9_2712;
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
float4 l9_2713=float4(0.0);
l9_2713=float4(0.0);
float4 l9_2714=l9_2713;
float4 Cost=l9_2714;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_44=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_44,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_45=FinalColor;
float4 l9_2715=param_45;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_2715.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_2715;
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
float4 VertexColor;
float2 Surface_UVCoord0;
float2 Surface_UVCoord1;
float2 gScreenCoord;
float3 VertexTangent_WorldSpace;
float3 VertexNormal_WorldSpace;
float3 VertexBinormal_WorldSpace;
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
float3 recolorRed;
float4 Tweak_N81;
float4 baseColor;
float4 baseTexSize;
float4 baseTexDims;
float4 baseTexView;
float3x3 baseTexTransform;
float4 baseTexUvMinMax;
float4 baseTexBorderColor;
float2 uv2Scale;
float2 uv2Offset;
float2 uv3Scale;
float2 uv3Offset;
float3 recolorGreen;
float3 recolorBlue;
float4 opacityTexSize;
float4 opacityTexDims;
float4 opacityTexView;
float3x3 opacityTexTransform;
float4 opacityTexUvMinMax;
float4 opacityTexBorderColor;
float4 normalTexSize;
float4 normalTexDims;
float4 normalTexView;
float3x3 normalTexTransform;
float4 normalTexUvMinMax;
float4 normalTexBorderColor;
float4 detailNormalTexSize;
float4 detailNormalTexDims;
float4 detailNormalTexView;
float3x3 detailNormalTexTransform;
float4 detailNormalTexUvMinMax;
float4 detailNormalTexBorderColor;
float colorMultiplier;
float4 Port_Import_N042;
float Port_Input1_N044;
float Port_Import_N088;
float3 Port_Import_N089;
float Port_Position1_N078;
float4 Port_Import_N384;
float Port_Import_N307;
float Port_Import_N201;
float Port_Import_N012;
float Port_Import_N010;
float Port_Import_N007;
float2 Port_Import_N008;
float2 Port_Import_N009;
float Port_Speed_N022;
float2 Port_Import_N254;
float Port_Import_N065;
float Port_Import_N055;
float Port_Import_N056;
float2 Port_Import_N000;
float2 Port_Import_N060;
float2 Port_Import_N061;
float Port_Speed_N063;
float2 Port_Import_N255;
float4 Port_Default_N369;
float4 Port_Import_N092;
float3 Port_Import_N090;
float3 Port_Import_N091;
float3 Port_Import_N144;
float Port_Value2_N073;
float4 Port_Import_N166;
float Port_Import_N206;
float Port_Import_N043;
float2 Port_Import_N151;
float2 Port_Import_N155;
float Port_Default_N204;
float Port_Import_N047;
float Port_Input1_N002;
float Port_Input2_N072;
float Port_Import_N336;
float Port_Import_N160;
float2 Port_Import_N167;
float2 Port_Import_N207;
float Port_Strength1_N200;
float Port_Import_N095;
float Port_Import_N108;
float3 Port_Default_N113;
float Port_Strength2_N200;
float3 Port_Emissive_N036;
float3 Port_AO_N036;
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
texture2d<float> baseTex [[id(4)]];
texture2d<float> detailNormalTex [[id(5)]];
texture2d<float> intensityTexture [[id(6)]];
texture2d<float> normalTex [[id(7)]];
texture2d<float> opacityTex [[id(8)]];
texture2d<float> sc_EnvmapDiffuse [[id(9)]];
texture2d<float> sc_EnvmapSpecular [[id(10)]];
texture2d<float> sc_RayTracingGlobalIllumination [[id(19)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(20)]];
texture2d<float> sc_RayTracingRayDirection [[id(21)]];
texture2d<float> sc_RayTracingShadows [[id(23)]];
texture2d<float> sc_SSAOTexture [[id(24)]];
texture2d<float> sc_ScreenTexture [[id(25)]];
texture2d<float> sc_ShadowTexture [[id(26)]];
sampler baseTexSmpSC [[id(28)]];
sampler detailNormalTexSmpSC [[id(29)]];
sampler intensityTextureSmpSC [[id(30)]];
sampler normalTexSmpSC [[id(31)]];
sampler opacityTexSmpSC [[id(32)]];
sampler sc_EnvmapDiffuseSmpSC [[id(33)]];
sampler sc_EnvmapSpecularSmpSC [[id(34)]];
sampler sc_RayTracingGlobalIlluminationSmpSC [[id(36)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(37)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(38)]];
sampler sc_RayTracingShadowsSmpSC [[id(40)]];
sampler sc_SSAOTextureSmpSC [[id(41)]];
sampler sc_ScreenTextureSmpSC [[id(42)]];
sampler sc_ShadowTextureSmpSC [[id(43)]];
constant userUniformsObj* UserUniforms [[id(45)]];
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
fragment main_recv_out main_recv(main_recv_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_recv_out out={};
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
Globals.VertexColor=in.varColor;
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
Globals.VertexTangent_WorldSpace=normalize(in.varTangent.xyz);
Globals.VertexNormal_WorldSpace=normalize(in.varNormalAndMotion.xyz);
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*in.varTangent.w;
float2 UVCoord_N77=float2(0.0);
UVCoord_N77=Globals.Surface_UVCoord0;
float Value2_N79=0.0;
float4 param=float4(UVCoord_N77,0.0,0.0);
float param_1=param.y;
Value2_N79=param_1;
float4 Output_N81=float4(0.0);
float4 param_2=(*sc_set0.UserUniforms).Tweak_N81;
Output_N81=param_2;
float4 Output_N5=float4(0.0);
float4 param_3=(*sc_set0.UserUniforms).baseColor;
Output_N5=param_3;
float4 Value_N78=float4(0.0);
float param_4=Value2_N79;
float4 param_5=Output_N81;
float param_6=(*sc_set0.UserUniforms).Port_Position1_N078;
float4 param_7=Output_N81;
float4 param_8=Output_N5;
param_4=fast::clamp(param_4,0.0,1.0);
float4 param_9;
if (param_4<param_6)
{
param_9=mix(param_5,param_7,float4(fast::clamp(param_4/param_6,0.0,1.0)));
}
else
{
param_9=mix(param_7,param_8,float4(fast::clamp((param_4-param_6)/(1.0-param_6),0.0,1.0)));
}
Value_N78=param_9;
float4 Value_N384=float4(0.0);
Value_N384=Value_N78;
float4 Result_N369=float4(0.0);
float4 param_10=float4(0.0);
float4 param_11=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals param_13=Globals;
float4 param_12;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_14=float2(0.0);
float2 l9_15=float2(0.0);
float2 l9_16=float2(0.0);
float2 l9_17=float2(0.0);
float2 l9_18=float2(0.0);
float2 l9_19=float2(0.0);
ssGlobals l9_20=param_13;
float2 l9_21;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_22=float2(0.0);
l9_22=l9_20.Surface_UVCoord0;
l9_15=l9_22;
l9_21=l9_15;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_23=float2(0.0);
l9_23=l9_20.Surface_UVCoord1;
l9_16=l9_23;
l9_21=l9_16;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_24=float2(0.0);
float2 l9_25=float2(0.0);
float2 l9_26=float2(0.0);
ssGlobals l9_27=l9_20;
float2 l9_28;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_29=float2(0.0);
float2 l9_30=float2(0.0);
float2 l9_31=float2(0.0);
ssGlobals l9_32=l9_27;
float2 l9_33;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_34=float2(0.0);
float2 l9_35=float2(0.0);
float2 l9_36=float2(0.0);
float2 l9_37=float2(0.0);
float2 l9_38=float2(0.0);
ssGlobals l9_39=l9_32;
float2 l9_40;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_41=float2(0.0);
l9_41=l9_39.Surface_UVCoord0;
l9_35=l9_41;
l9_40=l9_35;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_42=float2(0.0);
l9_42=l9_39.Surface_UVCoord1;
l9_36=l9_42;
l9_40=l9_36;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_43=float2(0.0);
l9_43=l9_39.gScreenCoord;
l9_37=l9_43;
l9_40=l9_37;
}
else
{
float2 l9_44=float2(0.0);
l9_44=l9_39.Surface_UVCoord0;
l9_38=l9_44;
l9_40=l9_38;
}
}
}
l9_34=l9_40;
float2 l9_45=float2(0.0);
float2 l9_46=(*sc_set0.UserUniforms).uv2Scale;
l9_45=l9_46;
float2 l9_47=float2(0.0);
l9_47=l9_45;
float2 l9_48=float2(0.0);
float2 l9_49=(*sc_set0.UserUniforms).uv2Offset;
l9_48=l9_49;
float2 l9_50=float2(0.0);
l9_50=l9_48;
float2 l9_51=float2(0.0);
l9_51=(l9_34*l9_47)+l9_50;
float2 l9_52=float2(0.0);
l9_52=l9_51+(l9_50*(l9_32.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_30=l9_52;
l9_33=l9_30;
}
else
{
float2 l9_53=float2(0.0);
float2 l9_54=float2(0.0);
float2 l9_55=float2(0.0);
float2 l9_56=float2(0.0);
float2 l9_57=float2(0.0);
ssGlobals l9_58=l9_32;
float2 l9_59;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_60=float2(0.0);
l9_60=l9_58.Surface_UVCoord0;
l9_54=l9_60;
l9_59=l9_54;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_61=float2(0.0);
l9_61=l9_58.Surface_UVCoord1;
l9_55=l9_61;
l9_59=l9_55;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_62=float2(0.0);
l9_62=l9_58.gScreenCoord;
l9_56=l9_62;
l9_59=l9_56;
}
else
{
float2 l9_63=float2(0.0);
l9_63=l9_58.Surface_UVCoord0;
l9_57=l9_63;
l9_59=l9_57;
}
}
}
l9_53=l9_59;
float2 l9_64=float2(0.0);
float2 l9_65=(*sc_set0.UserUniforms).uv2Scale;
l9_64=l9_65;
float2 l9_66=float2(0.0);
l9_66=l9_64;
float2 l9_67=float2(0.0);
float2 l9_68=(*sc_set0.UserUniforms).uv2Offset;
l9_67=l9_68;
float2 l9_69=float2(0.0);
l9_69=l9_67;
float2 l9_70=float2(0.0);
l9_70=(l9_53*l9_66)+l9_69;
l9_31=l9_70;
l9_33=l9_31;
}
l9_29=l9_33;
l9_25=l9_29;
l9_28=l9_25;
}
else
{
float2 l9_71=float2(0.0);
l9_71=l9_27.Surface_UVCoord0;
l9_26=l9_71;
l9_28=l9_26;
}
l9_24=l9_28;
float2 l9_72=float2(0.0);
l9_72=l9_24;
float2 l9_73=float2(0.0);
l9_73=l9_72;
l9_17=l9_73;
l9_21=l9_17;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_74=float2(0.0);
float2 l9_75=float2(0.0);
float2 l9_76=float2(0.0);
ssGlobals l9_77=l9_20;
float2 l9_78;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_79=float2(0.0);
float2 l9_80=float2(0.0);
float2 l9_81=float2(0.0);
ssGlobals l9_82=l9_77;
float2 l9_83;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_84=float2(0.0);
float2 l9_85=float2(0.0);
float2 l9_86=float2(0.0);
float2 l9_87=float2(0.0);
float2 l9_88=float2(0.0);
float2 l9_89=float2(0.0);
ssGlobals l9_90=l9_82;
float2 l9_91;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_92=float2(0.0);
l9_92=l9_90.Surface_UVCoord0;
l9_85=l9_92;
l9_91=l9_85;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_93=float2(0.0);
l9_93=l9_90.Surface_UVCoord1;
l9_86=l9_93;
l9_91=l9_86;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_94=float2(0.0);
l9_94=l9_90.gScreenCoord;
l9_87=l9_94;
l9_91=l9_87;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_95=float2(0.0);
float2 l9_96=float2(0.0);
float2 l9_97=float2(0.0);
ssGlobals l9_98=l9_90;
float2 l9_99;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_100=float2(0.0);
float2 l9_101=float2(0.0);
float2 l9_102=float2(0.0);
ssGlobals l9_103=l9_98;
float2 l9_104;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_105=float2(0.0);
float2 l9_106=float2(0.0);
float2 l9_107=float2(0.0);
float2 l9_108=float2(0.0);
float2 l9_109=float2(0.0);
ssGlobals l9_110=l9_103;
float2 l9_111;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_112=float2(0.0);
l9_112=l9_110.Surface_UVCoord0;
l9_106=l9_112;
l9_111=l9_106;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_113=float2(0.0);
l9_113=l9_110.Surface_UVCoord1;
l9_107=l9_113;
l9_111=l9_107;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_114=float2(0.0);
l9_114=l9_110.gScreenCoord;
l9_108=l9_114;
l9_111=l9_108;
}
else
{
float2 l9_115=float2(0.0);
l9_115=l9_110.Surface_UVCoord0;
l9_109=l9_115;
l9_111=l9_109;
}
}
}
l9_105=l9_111;
float2 l9_116=float2(0.0);
float2 l9_117=(*sc_set0.UserUniforms).uv2Scale;
l9_116=l9_117;
float2 l9_118=float2(0.0);
l9_118=l9_116;
float2 l9_119=float2(0.0);
float2 l9_120=(*sc_set0.UserUniforms).uv2Offset;
l9_119=l9_120;
float2 l9_121=float2(0.0);
l9_121=l9_119;
float2 l9_122=float2(0.0);
l9_122=(l9_105*l9_118)+l9_121;
float2 l9_123=float2(0.0);
l9_123=l9_122+(l9_121*(l9_103.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_101=l9_123;
l9_104=l9_101;
}
else
{
float2 l9_124=float2(0.0);
float2 l9_125=float2(0.0);
float2 l9_126=float2(0.0);
float2 l9_127=float2(0.0);
float2 l9_128=float2(0.0);
ssGlobals l9_129=l9_103;
float2 l9_130;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_131=float2(0.0);
l9_131=l9_129.Surface_UVCoord0;
l9_125=l9_131;
l9_130=l9_125;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_132=float2(0.0);
l9_132=l9_129.Surface_UVCoord1;
l9_126=l9_132;
l9_130=l9_126;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_133=float2(0.0);
l9_133=l9_129.gScreenCoord;
l9_127=l9_133;
l9_130=l9_127;
}
else
{
float2 l9_134=float2(0.0);
l9_134=l9_129.Surface_UVCoord0;
l9_128=l9_134;
l9_130=l9_128;
}
}
}
l9_124=l9_130;
float2 l9_135=float2(0.0);
float2 l9_136=(*sc_set0.UserUniforms).uv2Scale;
l9_135=l9_136;
float2 l9_137=float2(0.0);
l9_137=l9_135;
float2 l9_138=float2(0.0);
float2 l9_139=(*sc_set0.UserUniforms).uv2Offset;
l9_138=l9_139;
float2 l9_140=float2(0.0);
l9_140=l9_138;
float2 l9_141=float2(0.0);
l9_141=(l9_124*l9_137)+l9_140;
l9_102=l9_141;
l9_104=l9_102;
}
l9_100=l9_104;
l9_96=l9_100;
l9_99=l9_96;
}
else
{
float2 l9_142=float2(0.0);
l9_142=l9_98.Surface_UVCoord0;
l9_97=l9_142;
l9_99=l9_97;
}
l9_95=l9_99;
float2 l9_143=float2(0.0);
l9_143=l9_95;
float2 l9_144=float2(0.0);
l9_144=l9_143;
l9_88=l9_144;
l9_91=l9_88;
}
else
{
float2 l9_145=float2(0.0);
l9_145=l9_90.Surface_UVCoord0;
l9_89=l9_145;
l9_91=l9_89;
}
}
}
}
l9_84=l9_91;
float2 l9_146=float2(0.0);
float2 l9_147=(*sc_set0.UserUniforms).uv3Scale;
l9_146=l9_147;
float2 l9_148=float2(0.0);
l9_148=l9_146;
float2 l9_149=float2(0.0);
float2 l9_150=(*sc_set0.UserUniforms).uv3Offset;
l9_149=l9_150;
float2 l9_151=float2(0.0);
l9_151=l9_149;
float2 l9_152=float2(0.0);
l9_152=(l9_84*l9_148)+l9_151;
float2 l9_153=float2(0.0);
l9_153=l9_152+(l9_151*(l9_82.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_80=l9_153;
l9_83=l9_80;
}
else
{
float2 l9_154=float2(0.0);
float2 l9_155=float2(0.0);
float2 l9_156=float2(0.0);
float2 l9_157=float2(0.0);
float2 l9_158=float2(0.0);
float2 l9_159=float2(0.0);
ssGlobals l9_160=l9_82;
float2 l9_161;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_162=float2(0.0);
l9_162=l9_160.Surface_UVCoord0;
l9_155=l9_162;
l9_161=l9_155;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_163=float2(0.0);
l9_163=l9_160.Surface_UVCoord1;
l9_156=l9_163;
l9_161=l9_156;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_164=float2(0.0);
l9_164=l9_160.gScreenCoord;
l9_157=l9_164;
l9_161=l9_157;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_165=float2(0.0);
float2 l9_166=float2(0.0);
float2 l9_167=float2(0.0);
ssGlobals l9_168=l9_160;
float2 l9_169;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_170=float2(0.0);
float2 l9_171=float2(0.0);
float2 l9_172=float2(0.0);
ssGlobals l9_173=l9_168;
float2 l9_174;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_175=float2(0.0);
float2 l9_176=float2(0.0);
float2 l9_177=float2(0.0);
float2 l9_178=float2(0.0);
float2 l9_179=float2(0.0);
ssGlobals l9_180=l9_173;
float2 l9_181;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_182=float2(0.0);
l9_182=l9_180.Surface_UVCoord0;
l9_176=l9_182;
l9_181=l9_176;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_183=float2(0.0);
l9_183=l9_180.Surface_UVCoord1;
l9_177=l9_183;
l9_181=l9_177;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_184=float2(0.0);
l9_184=l9_180.gScreenCoord;
l9_178=l9_184;
l9_181=l9_178;
}
else
{
float2 l9_185=float2(0.0);
l9_185=l9_180.Surface_UVCoord0;
l9_179=l9_185;
l9_181=l9_179;
}
}
}
l9_175=l9_181;
float2 l9_186=float2(0.0);
float2 l9_187=(*sc_set0.UserUniforms).uv2Scale;
l9_186=l9_187;
float2 l9_188=float2(0.0);
l9_188=l9_186;
float2 l9_189=float2(0.0);
float2 l9_190=(*sc_set0.UserUniforms).uv2Offset;
l9_189=l9_190;
float2 l9_191=float2(0.0);
l9_191=l9_189;
float2 l9_192=float2(0.0);
l9_192=(l9_175*l9_188)+l9_191;
float2 l9_193=float2(0.0);
l9_193=l9_192+(l9_191*(l9_173.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_171=l9_193;
l9_174=l9_171;
}
else
{
float2 l9_194=float2(0.0);
float2 l9_195=float2(0.0);
float2 l9_196=float2(0.0);
float2 l9_197=float2(0.0);
float2 l9_198=float2(0.0);
ssGlobals l9_199=l9_173;
float2 l9_200;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_201=float2(0.0);
l9_201=l9_199.Surface_UVCoord0;
l9_195=l9_201;
l9_200=l9_195;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_202=float2(0.0);
l9_202=l9_199.Surface_UVCoord1;
l9_196=l9_202;
l9_200=l9_196;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_203=float2(0.0);
l9_203=l9_199.gScreenCoord;
l9_197=l9_203;
l9_200=l9_197;
}
else
{
float2 l9_204=float2(0.0);
l9_204=l9_199.Surface_UVCoord0;
l9_198=l9_204;
l9_200=l9_198;
}
}
}
l9_194=l9_200;
float2 l9_205=float2(0.0);
float2 l9_206=(*sc_set0.UserUniforms).uv2Scale;
l9_205=l9_206;
float2 l9_207=float2(0.0);
l9_207=l9_205;
float2 l9_208=float2(0.0);
float2 l9_209=(*sc_set0.UserUniforms).uv2Offset;
l9_208=l9_209;
float2 l9_210=float2(0.0);
l9_210=l9_208;
float2 l9_211=float2(0.0);
l9_211=(l9_194*l9_207)+l9_210;
l9_172=l9_211;
l9_174=l9_172;
}
l9_170=l9_174;
l9_166=l9_170;
l9_169=l9_166;
}
else
{
float2 l9_212=float2(0.0);
l9_212=l9_168.Surface_UVCoord0;
l9_167=l9_212;
l9_169=l9_167;
}
l9_165=l9_169;
float2 l9_213=float2(0.0);
l9_213=l9_165;
float2 l9_214=float2(0.0);
l9_214=l9_213;
l9_158=l9_214;
l9_161=l9_158;
}
else
{
float2 l9_215=float2(0.0);
l9_215=l9_160.Surface_UVCoord0;
l9_159=l9_215;
l9_161=l9_159;
}
}
}
}
l9_154=l9_161;
float2 l9_216=float2(0.0);
float2 l9_217=(*sc_set0.UserUniforms).uv3Scale;
l9_216=l9_217;
float2 l9_218=float2(0.0);
l9_218=l9_216;
float2 l9_219=float2(0.0);
float2 l9_220=(*sc_set0.UserUniforms).uv3Offset;
l9_219=l9_220;
float2 l9_221=float2(0.0);
l9_221=l9_219;
float2 l9_222=float2(0.0);
l9_222=(l9_154*l9_218)+l9_221;
l9_81=l9_222;
l9_83=l9_81;
}
l9_79=l9_83;
l9_75=l9_79;
l9_78=l9_75;
}
else
{
float2 l9_223=float2(0.0);
l9_223=l9_77.Surface_UVCoord0;
l9_76=l9_223;
l9_78=l9_76;
}
l9_74=l9_78;
float2 l9_224=float2(0.0);
l9_224=l9_74;
float2 l9_225=float2(0.0);
l9_225=l9_224;
l9_18=l9_225;
l9_21=l9_18;
}
else
{
float2 l9_226=float2(0.0);
l9_226=l9_20.Surface_UVCoord0;
l9_19=l9_226;
l9_21=l9_19;
}
}
}
}
l9_14=l9_21;
float4 l9_227=float4(0.0);
int l9_228;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_229=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_229=0;
}
else
{
l9_229=in.varStereoViewID;
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
l9_231=in.varStereoViewID;
}
int l9_232=l9_231;
l9_228=l9_232;
}
int l9_233=l9_228;
int l9_234=baseTexLayout_tmp;
int l9_235=l9_233;
float2 l9_236=l9_14;
bool l9_237=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_238=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_239=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_240=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_241=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_242=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_243=(*sc_set0.UserUniforms).baseTexBorderColor;
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
float4 l9_311=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_310.xy,bias(l9_304));
float4 l9_312=l9_311;
if (l9_242)
{
l9_312=mix(l9_243,l9_312,float4(l9_246));
}
float4 l9_313=l9_312;
l9_227=l9_313;
param_10=l9_227;
param_12=param_10;
}
else
{
param_12=param_11;
}
Result_N369=param_12;
float4 Output_N148=float4(0.0);
Output_N148=Value_N384*Result_N369;
float4 Export_N385=float4(0.0);
Export_N385=Output_N148;
float4 Value_N166=float4(0.0);
Value_N166=Export_N385;
float Output_N168=0.0;
Output_N168=Value_N166.w;
float Result_N204=0.0;
float param_14=0.0;
float param_15=(*sc_set0.UserUniforms).Port_Default_N204;
ssGlobals param_17=Globals;
float param_16;
if ((int(ENABLE_OPACITY_TEX_tmp)!=0))
{
float2 l9_314=float2(0.0);
float2 l9_315=float2(0.0);
float2 l9_316=float2(0.0);
float2 l9_317=float2(0.0);
float2 l9_318=float2(0.0);
float2 l9_319=float2(0.0);
ssGlobals l9_320=param_17;
float2 l9_321;
if (NODE_69_DROPLIST_ITEM_tmp==0)
{
float2 l9_322=float2(0.0);
l9_322=l9_320.Surface_UVCoord0;
l9_315=l9_322;
l9_321=l9_315;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==1)
{
float2 l9_323=float2(0.0);
l9_323=l9_320.Surface_UVCoord1;
l9_316=l9_323;
l9_321=l9_316;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==2)
{
float2 l9_324=float2(0.0);
float2 l9_325=float2(0.0);
float2 l9_326=float2(0.0);
ssGlobals l9_327=l9_320;
float2 l9_328;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_329=float2(0.0);
float2 l9_330=float2(0.0);
float2 l9_331=float2(0.0);
ssGlobals l9_332=l9_327;
float2 l9_333;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_334=float2(0.0);
float2 l9_335=float2(0.0);
float2 l9_336=float2(0.0);
float2 l9_337=float2(0.0);
float2 l9_338=float2(0.0);
ssGlobals l9_339=l9_332;
float2 l9_340;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_341=float2(0.0);
l9_341=l9_339.Surface_UVCoord0;
l9_335=l9_341;
l9_340=l9_335;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_342=float2(0.0);
l9_342=l9_339.Surface_UVCoord1;
l9_336=l9_342;
l9_340=l9_336;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_343=float2(0.0);
l9_343=l9_339.gScreenCoord;
l9_337=l9_343;
l9_340=l9_337;
}
else
{
float2 l9_344=float2(0.0);
l9_344=l9_339.Surface_UVCoord0;
l9_338=l9_344;
l9_340=l9_338;
}
}
}
l9_334=l9_340;
float2 l9_345=float2(0.0);
float2 l9_346=(*sc_set0.UserUniforms).uv2Scale;
l9_345=l9_346;
float2 l9_347=float2(0.0);
l9_347=l9_345;
float2 l9_348=float2(0.0);
float2 l9_349=(*sc_set0.UserUniforms).uv2Offset;
l9_348=l9_349;
float2 l9_350=float2(0.0);
l9_350=l9_348;
float2 l9_351=float2(0.0);
l9_351=(l9_334*l9_347)+l9_350;
float2 l9_352=float2(0.0);
l9_352=l9_351+(l9_350*(l9_332.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_330=l9_352;
l9_333=l9_330;
}
else
{
float2 l9_353=float2(0.0);
float2 l9_354=float2(0.0);
float2 l9_355=float2(0.0);
float2 l9_356=float2(0.0);
float2 l9_357=float2(0.0);
ssGlobals l9_358=l9_332;
float2 l9_359;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_360=float2(0.0);
l9_360=l9_358.Surface_UVCoord0;
l9_354=l9_360;
l9_359=l9_354;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_361=float2(0.0);
l9_361=l9_358.Surface_UVCoord1;
l9_355=l9_361;
l9_359=l9_355;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_362=float2(0.0);
l9_362=l9_358.gScreenCoord;
l9_356=l9_362;
l9_359=l9_356;
}
else
{
float2 l9_363=float2(0.0);
l9_363=l9_358.Surface_UVCoord0;
l9_357=l9_363;
l9_359=l9_357;
}
}
}
l9_353=l9_359;
float2 l9_364=float2(0.0);
float2 l9_365=(*sc_set0.UserUniforms).uv2Scale;
l9_364=l9_365;
float2 l9_366=float2(0.0);
l9_366=l9_364;
float2 l9_367=float2(0.0);
float2 l9_368=(*sc_set0.UserUniforms).uv2Offset;
l9_367=l9_368;
float2 l9_369=float2(0.0);
l9_369=l9_367;
float2 l9_370=float2(0.0);
l9_370=(l9_353*l9_366)+l9_369;
l9_331=l9_370;
l9_333=l9_331;
}
l9_329=l9_333;
l9_325=l9_329;
l9_328=l9_325;
}
else
{
float2 l9_371=float2(0.0);
l9_371=l9_327.Surface_UVCoord0;
l9_326=l9_371;
l9_328=l9_326;
}
l9_324=l9_328;
float2 l9_372=float2(0.0);
l9_372=l9_324;
float2 l9_373=float2(0.0);
l9_373=l9_372;
l9_317=l9_373;
l9_321=l9_317;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==3)
{
float2 l9_374=float2(0.0);
float2 l9_375=float2(0.0);
float2 l9_376=float2(0.0);
ssGlobals l9_377=l9_320;
float2 l9_378;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_379=float2(0.0);
float2 l9_380=float2(0.0);
float2 l9_381=float2(0.0);
ssGlobals l9_382=l9_377;
float2 l9_383;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_384=float2(0.0);
float2 l9_385=float2(0.0);
float2 l9_386=float2(0.0);
float2 l9_387=float2(0.0);
float2 l9_388=float2(0.0);
float2 l9_389=float2(0.0);
ssGlobals l9_390=l9_382;
float2 l9_391;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_392=float2(0.0);
l9_392=l9_390.Surface_UVCoord0;
l9_385=l9_392;
l9_391=l9_385;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_393=float2(0.0);
l9_393=l9_390.Surface_UVCoord1;
l9_386=l9_393;
l9_391=l9_386;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_394=float2(0.0);
l9_394=l9_390.gScreenCoord;
l9_387=l9_394;
l9_391=l9_387;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_395=float2(0.0);
float2 l9_396=float2(0.0);
float2 l9_397=float2(0.0);
ssGlobals l9_398=l9_390;
float2 l9_399;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_400=float2(0.0);
float2 l9_401=float2(0.0);
float2 l9_402=float2(0.0);
ssGlobals l9_403=l9_398;
float2 l9_404;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_405=float2(0.0);
float2 l9_406=float2(0.0);
float2 l9_407=float2(0.0);
float2 l9_408=float2(0.0);
float2 l9_409=float2(0.0);
ssGlobals l9_410=l9_403;
float2 l9_411;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_412=float2(0.0);
l9_412=l9_410.Surface_UVCoord0;
l9_406=l9_412;
l9_411=l9_406;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_413=float2(0.0);
l9_413=l9_410.Surface_UVCoord1;
l9_407=l9_413;
l9_411=l9_407;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_414=float2(0.0);
l9_414=l9_410.gScreenCoord;
l9_408=l9_414;
l9_411=l9_408;
}
else
{
float2 l9_415=float2(0.0);
l9_415=l9_410.Surface_UVCoord0;
l9_409=l9_415;
l9_411=l9_409;
}
}
}
l9_405=l9_411;
float2 l9_416=float2(0.0);
float2 l9_417=(*sc_set0.UserUniforms).uv2Scale;
l9_416=l9_417;
float2 l9_418=float2(0.0);
l9_418=l9_416;
float2 l9_419=float2(0.0);
float2 l9_420=(*sc_set0.UserUniforms).uv2Offset;
l9_419=l9_420;
float2 l9_421=float2(0.0);
l9_421=l9_419;
float2 l9_422=float2(0.0);
l9_422=(l9_405*l9_418)+l9_421;
float2 l9_423=float2(0.0);
l9_423=l9_422+(l9_421*(l9_403.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_401=l9_423;
l9_404=l9_401;
}
else
{
float2 l9_424=float2(0.0);
float2 l9_425=float2(0.0);
float2 l9_426=float2(0.0);
float2 l9_427=float2(0.0);
float2 l9_428=float2(0.0);
ssGlobals l9_429=l9_403;
float2 l9_430;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_431=float2(0.0);
l9_431=l9_429.Surface_UVCoord0;
l9_425=l9_431;
l9_430=l9_425;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_432=float2(0.0);
l9_432=l9_429.Surface_UVCoord1;
l9_426=l9_432;
l9_430=l9_426;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_433=float2(0.0);
l9_433=l9_429.gScreenCoord;
l9_427=l9_433;
l9_430=l9_427;
}
else
{
float2 l9_434=float2(0.0);
l9_434=l9_429.Surface_UVCoord0;
l9_428=l9_434;
l9_430=l9_428;
}
}
}
l9_424=l9_430;
float2 l9_435=float2(0.0);
float2 l9_436=(*sc_set0.UserUniforms).uv2Scale;
l9_435=l9_436;
float2 l9_437=float2(0.0);
l9_437=l9_435;
float2 l9_438=float2(0.0);
float2 l9_439=(*sc_set0.UserUniforms).uv2Offset;
l9_438=l9_439;
float2 l9_440=float2(0.0);
l9_440=l9_438;
float2 l9_441=float2(0.0);
l9_441=(l9_424*l9_437)+l9_440;
l9_402=l9_441;
l9_404=l9_402;
}
l9_400=l9_404;
l9_396=l9_400;
l9_399=l9_396;
}
else
{
float2 l9_442=float2(0.0);
l9_442=l9_398.Surface_UVCoord0;
l9_397=l9_442;
l9_399=l9_397;
}
l9_395=l9_399;
float2 l9_443=float2(0.0);
l9_443=l9_395;
float2 l9_444=float2(0.0);
l9_444=l9_443;
l9_388=l9_444;
l9_391=l9_388;
}
else
{
float2 l9_445=float2(0.0);
l9_445=l9_390.Surface_UVCoord0;
l9_389=l9_445;
l9_391=l9_389;
}
}
}
}
l9_384=l9_391;
float2 l9_446=float2(0.0);
float2 l9_447=(*sc_set0.UserUniforms).uv3Scale;
l9_446=l9_447;
float2 l9_448=float2(0.0);
l9_448=l9_446;
float2 l9_449=float2(0.0);
float2 l9_450=(*sc_set0.UserUniforms).uv3Offset;
l9_449=l9_450;
float2 l9_451=float2(0.0);
l9_451=l9_449;
float2 l9_452=float2(0.0);
l9_452=(l9_384*l9_448)+l9_451;
float2 l9_453=float2(0.0);
l9_453=l9_452+(l9_451*(l9_382.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_380=l9_453;
l9_383=l9_380;
}
else
{
float2 l9_454=float2(0.0);
float2 l9_455=float2(0.0);
float2 l9_456=float2(0.0);
float2 l9_457=float2(0.0);
float2 l9_458=float2(0.0);
float2 l9_459=float2(0.0);
ssGlobals l9_460=l9_382;
float2 l9_461;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_462=float2(0.0);
l9_462=l9_460.Surface_UVCoord0;
l9_455=l9_462;
l9_461=l9_455;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_463=float2(0.0);
l9_463=l9_460.Surface_UVCoord1;
l9_456=l9_463;
l9_461=l9_456;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_464=float2(0.0);
l9_464=l9_460.gScreenCoord;
l9_457=l9_464;
l9_461=l9_457;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_465=float2(0.0);
float2 l9_466=float2(0.0);
float2 l9_467=float2(0.0);
ssGlobals l9_468=l9_460;
float2 l9_469;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_470=float2(0.0);
float2 l9_471=float2(0.0);
float2 l9_472=float2(0.0);
ssGlobals l9_473=l9_468;
float2 l9_474;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_475=float2(0.0);
float2 l9_476=float2(0.0);
float2 l9_477=float2(0.0);
float2 l9_478=float2(0.0);
float2 l9_479=float2(0.0);
ssGlobals l9_480=l9_473;
float2 l9_481;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_482=float2(0.0);
l9_482=l9_480.Surface_UVCoord0;
l9_476=l9_482;
l9_481=l9_476;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_483=float2(0.0);
l9_483=l9_480.Surface_UVCoord1;
l9_477=l9_483;
l9_481=l9_477;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_484=float2(0.0);
l9_484=l9_480.gScreenCoord;
l9_478=l9_484;
l9_481=l9_478;
}
else
{
float2 l9_485=float2(0.0);
l9_485=l9_480.Surface_UVCoord0;
l9_479=l9_485;
l9_481=l9_479;
}
}
}
l9_475=l9_481;
float2 l9_486=float2(0.0);
float2 l9_487=(*sc_set0.UserUniforms).uv2Scale;
l9_486=l9_487;
float2 l9_488=float2(0.0);
l9_488=l9_486;
float2 l9_489=float2(0.0);
float2 l9_490=(*sc_set0.UserUniforms).uv2Offset;
l9_489=l9_490;
float2 l9_491=float2(0.0);
l9_491=l9_489;
float2 l9_492=float2(0.0);
l9_492=(l9_475*l9_488)+l9_491;
float2 l9_493=float2(0.0);
l9_493=l9_492+(l9_491*(l9_473.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_471=l9_493;
l9_474=l9_471;
}
else
{
float2 l9_494=float2(0.0);
float2 l9_495=float2(0.0);
float2 l9_496=float2(0.0);
float2 l9_497=float2(0.0);
float2 l9_498=float2(0.0);
ssGlobals l9_499=l9_473;
float2 l9_500;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_501=float2(0.0);
l9_501=l9_499.Surface_UVCoord0;
l9_495=l9_501;
l9_500=l9_495;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_502=float2(0.0);
l9_502=l9_499.Surface_UVCoord1;
l9_496=l9_502;
l9_500=l9_496;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_503=float2(0.0);
l9_503=l9_499.gScreenCoord;
l9_497=l9_503;
l9_500=l9_497;
}
else
{
float2 l9_504=float2(0.0);
l9_504=l9_499.Surface_UVCoord0;
l9_498=l9_504;
l9_500=l9_498;
}
}
}
l9_494=l9_500;
float2 l9_505=float2(0.0);
float2 l9_506=(*sc_set0.UserUniforms).uv2Scale;
l9_505=l9_506;
float2 l9_507=float2(0.0);
l9_507=l9_505;
float2 l9_508=float2(0.0);
float2 l9_509=(*sc_set0.UserUniforms).uv2Offset;
l9_508=l9_509;
float2 l9_510=float2(0.0);
l9_510=l9_508;
float2 l9_511=float2(0.0);
l9_511=(l9_494*l9_507)+l9_510;
l9_472=l9_511;
l9_474=l9_472;
}
l9_470=l9_474;
l9_466=l9_470;
l9_469=l9_466;
}
else
{
float2 l9_512=float2(0.0);
l9_512=l9_468.Surface_UVCoord0;
l9_467=l9_512;
l9_469=l9_467;
}
l9_465=l9_469;
float2 l9_513=float2(0.0);
l9_513=l9_465;
float2 l9_514=float2(0.0);
l9_514=l9_513;
l9_458=l9_514;
l9_461=l9_458;
}
else
{
float2 l9_515=float2(0.0);
l9_515=l9_460.Surface_UVCoord0;
l9_459=l9_515;
l9_461=l9_459;
}
}
}
}
l9_454=l9_461;
float2 l9_516=float2(0.0);
float2 l9_517=(*sc_set0.UserUniforms).uv3Scale;
l9_516=l9_517;
float2 l9_518=float2(0.0);
l9_518=l9_516;
float2 l9_519=float2(0.0);
float2 l9_520=(*sc_set0.UserUniforms).uv3Offset;
l9_519=l9_520;
float2 l9_521=float2(0.0);
l9_521=l9_519;
float2 l9_522=float2(0.0);
l9_522=(l9_454*l9_518)+l9_521;
l9_381=l9_522;
l9_383=l9_381;
}
l9_379=l9_383;
l9_375=l9_379;
l9_378=l9_375;
}
else
{
float2 l9_523=float2(0.0);
l9_523=l9_377.Surface_UVCoord0;
l9_376=l9_523;
l9_378=l9_376;
}
l9_374=l9_378;
float2 l9_524=float2(0.0);
l9_524=l9_374;
float2 l9_525=float2(0.0);
l9_525=l9_524;
l9_318=l9_525;
l9_321=l9_318;
}
else
{
float2 l9_526=float2(0.0);
l9_526=l9_320.Surface_UVCoord0;
l9_319=l9_526;
l9_321=l9_319;
}
}
}
}
l9_314=l9_321;
float4 l9_527=float4(0.0);
int l9_528;
if ((int(opacityTexHasSwappedViews_tmp)!=0))
{
int l9_529=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_529=0;
}
else
{
l9_529=in.varStereoViewID;
}
int l9_530=l9_529;
l9_528=1-l9_530;
}
else
{
int l9_531=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_531=0;
}
else
{
l9_531=in.varStereoViewID;
}
int l9_532=l9_531;
l9_528=l9_532;
}
int l9_533=l9_528;
int l9_534=opacityTexLayout_tmp;
int l9_535=l9_533;
float2 l9_536=l9_314;
bool l9_537=(int(SC_USE_UV_TRANSFORM_opacityTex_tmp)!=0);
float3x3 l9_538=(*sc_set0.UserUniforms).opacityTexTransform;
int2 l9_539=int2(SC_SOFTWARE_WRAP_MODE_U_opacityTex_tmp,SC_SOFTWARE_WRAP_MODE_V_opacityTex_tmp);
bool l9_540=(int(SC_USE_UV_MIN_MAX_opacityTex_tmp)!=0);
float4 l9_541=(*sc_set0.UserUniforms).opacityTexUvMinMax;
bool l9_542=(int(SC_USE_CLAMP_TO_BORDER_opacityTex_tmp)!=0);
float4 l9_543=(*sc_set0.UserUniforms).opacityTexBorderColor;
float l9_544=0.0;
bool l9_545=l9_542&&(!l9_540);
float l9_546=1.0;
float l9_547=l9_536.x;
int l9_548=l9_539.x;
if (l9_548==1)
{
l9_547=fract(l9_547);
}
else
{
if (l9_548==2)
{
float l9_549=fract(l9_547);
float l9_550=l9_547-l9_549;
float l9_551=step(0.25,fract(l9_550*0.5));
l9_547=mix(l9_549,1.0-l9_549,fast::clamp(l9_551,0.0,1.0));
}
}
l9_536.x=l9_547;
float l9_552=l9_536.y;
int l9_553=l9_539.y;
if (l9_553==1)
{
l9_552=fract(l9_552);
}
else
{
if (l9_553==2)
{
float l9_554=fract(l9_552);
float l9_555=l9_552-l9_554;
float l9_556=step(0.25,fract(l9_555*0.5));
l9_552=mix(l9_554,1.0-l9_554,fast::clamp(l9_556,0.0,1.0));
}
}
l9_536.y=l9_552;
if (l9_540)
{
bool l9_557=l9_542;
bool l9_558;
if (l9_557)
{
l9_558=l9_539.x==3;
}
else
{
l9_558=l9_557;
}
float l9_559=l9_536.x;
float l9_560=l9_541.x;
float l9_561=l9_541.z;
bool l9_562=l9_558;
float l9_563=l9_546;
float l9_564=fast::clamp(l9_559,l9_560,l9_561);
float l9_565=step(abs(l9_559-l9_564),9.9999997e-06);
l9_563*=(l9_565+((1.0-float(l9_562))*(1.0-l9_565)));
l9_559=l9_564;
l9_536.x=l9_559;
l9_546=l9_563;
bool l9_566=l9_542;
bool l9_567;
if (l9_566)
{
l9_567=l9_539.y==3;
}
else
{
l9_567=l9_566;
}
float l9_568=l9_536.y;
float l9_569=l9_541.y;
float l9_570=l9_541.w;
bool l9_571=l9_567;
float l9_572=l9_546;
float l9_573=fast::clamp(l9_568,l9_569,l9_570);
float l9_574=step(abs(l9_568-l9_573),9.9999997e-06);
l9_572*=(l9_574+((1.0-float(l9_571))*(1.0-l9_574)));
l9_568=l9_573;
l9_536.y=l9_568;
l9_546=l9_572;
}
float2 l9_575=l9_536;
bool l9_576=l9_537;
float3x3 l9_577=l9_538;
if (l9_576)
{
l9_575=float2((l9_577*float3(l9_575,1.0)).xy);
}
float2 l9_578=l9_575;
l9_536=l9_578;
float l9_579=l9_536.x;
int l9_580=l9_539.x;
bool l9_581=l9_545;
float l9_582=l9_546;
if ((l9_580==0)||(l9_580==3))
{
float l9_583=l9_579;
float l9_584=0.0;
float l9_585=1.0;
bool l9_586=l9_581;
float l9_587=l9_582;
float l9_588=fast::clamp(l9_583,l9_584,l9_585);
float l9_589=step(abs(l9_583-l9_588),9.9999997e-06);
l9_587*=(l9_589+((1.0-float(l9_586))*(1.0-l9_589)));
l9_583=l9_588;
l9_579=l9_583;
l9_582=l9_587;
}
l9_536.x=l9_579;
l9_546=l9_582;
float l9_590=l9_536.y;
int l9_591=l9_539.y;
bool l9_592=l9_545;
float l9_593=l9_546;
if ((l9_591==0)||(l9_591==3))
{
float l9_594=l9_590;
float l9_595=0.0;
float l9_596=1.0;
bool l9_597=l9_592;
float l9_598=l9_593;
float l9_599=fast::clamp(l9_594,l9_595,l9_596);
float l9_600=step(abs(l9_594-l9_599),9.9999997e-06);
l9_598*=(l9_600+((1.0-float(l9_597))*(1.0-l9_600)));
l9_594=l9_599;
l9_590=l9_594;
l9_593=l9_598;
}
l9_536.y=l9_590;
l9_546=l9_593;
float2 l9_601=l9_536;
int l9_602=l9_534;
int l9_603=l9_535;
float l9_604=l9_544;
float2 l9_605=l9_601;
int l9_606=l9_602;
int l9_607=l9_603;
float3 l9_608=float3(0.0);
if (l9_606==0)
{
l9_608=float3(l9_605,0.0);
}
else
{
if (l9_606==1)
{
l9_608=float3(l9_605.x,(l9_605.y*0.5)+(0.5-(float(l9_607)*0.5)),0.0);
}
else
{
l9_608=float3(l9_605,float(l9_607));
}
}
float3 l9_609=l9_608;
float3 l9_610=l9_609;
float4 l9_611=sc_set0.opacityTex.sample(sc_set0.opacityTexSmpSC,l9_610.xy,bias(l9_604));
float4 l9_612=l9_611;
if (l9_542)
{
l9_612=mix(l9_543,l9_612,float4(l9_546));
}
float4 l9_613=l9_612;
l9_527=l9_613;
float l9_614=0.0;
l9_614=l9_527.x;
param_14=l9_614;
param_16=param_14;
}
else
{
param_16=param_15;
}
Result_N204=param_16;
float Output_N72=0.0;
float param_18=1.0;
float param_19=(*sc_set0.UserUniforms).Port_Input2_N072;
ssGlobals param_21=Globals;
float param_20;
if (NODE_38_DROPLIST_ITEM_tmp==1)
{
float4 l9_615=float4(0.0);
l9_615=param_21.VertexColor;
float l9_616=0.0;
l9_616=l9_615.w;
param_18=l9_616;
param_20=param_18;
}
else
{
param_20=param_19;
}
Output_N72=param_20;
float Output_N205=0.0;
Output_N205=(Output_N168*Result_N204)*Output_N72;
float Export_N158=0.0;
Export_N158=Output_N205;
float3 Result_N337=float3(0.0);
float3 param_22=float3(0.0);
float3 param_23=float3(0.0);
ssGlobals param_25=Globals;
float3 param_24;
if ((int(ENABLE_NORMALMAP_tmp)!=0))
{
float3 l9_617=float3(0.0);
l9_617=param_25.VertexTangent_WorldSpace;
float3 l9_618=float3(0.0);
l9_618=param_25.VertexBinormal_WorldSpace;
float3 l9_619=float3(0.0);
l9_619=param_25.VertexNormal_WorldSpace;
float3x3 l9_620=float3x3(float3(0.0),float3(0.0),float3(0.0));
l9_620=float3x3(float3(l9_617),float3(l9_618),float3(l9_619));
float2 l9_621=float2(0.0);
float2 l9_622=float2(0.0);
float2 l9_623=float2(0.0);
float2 l9_624=float2(0.0);
float2 l9_625=float2(0.0);
float2 l9_626=float2(0.0);
ssGlobals l9_627=param_25;
float2 l9_628;
if (NODE_181_DROPLIST_ITEM_tmp==0)
{
float2 l9_629=float2(0.0);
l9_629=l9_627.Surface_UVCoord0;
l9_622=l9_629;
l9_628=l9_622;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==1)
{
float2 l9_630=float2(0.0);
l9_630=l9_627.Surface_UVCoord1;
l9_623=l9_630;
l9_628=l9_623;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==2)
{
float2 l9_631=float2(0.0);
float2 l9_632=float2(0.0);
float2 l9_633=float2(0.0);
ssGlobals l9_634=l9_627;
float2 l9_635;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_636=float2(0.0);
float2 l9_637=float2(0.0);
float2 l9_638=float2(0.0);
ssGlobals l9_639=l9_634;
float2 l9_640;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_641=float2(0.0);
float2 l9_642=float2(0.0);
float2 l9_643=float2(0.0);
float2 l9_644=float2(0.0);
float2 l9_645=float2(0.0);
ssGlobals l9_646=l9_639;
float2 l9_647;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_648=float2(0.0);
l9_648=l9_646.Surface_UVCoord0;
l9_642=l9_648;
l9_647=l9_642;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_649=float2(0.0);
l9_649=l9_646.Surface_UVCoord1;
l9_643=l9_649;
l9_647=l9_643;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_650=float2(0.0);
l9_650=l9_646.gScreenCoord;
l9_644=l9_650;
l9_647=l9_644;
}
else
{
float2 l9_651=float2(0.0);
l9_651=l9_646.Surface_UVCoord0;
l9_645=l9_651;
l9_647=l9_645;
}
}
}
l9_641=l9_647;
float2 l9_652=float2(0.0);
float2 l9_653=(*sc_set0.UserUniforms).uv2Scale;
l9_652=l9_653;
float2 l9_654=float2(0.0);
l9_654=l9_652;
float2 l9_655=float2(0.0);
float2 l9_656=(*sc_set0.UserUniforms).uv2Offset;
l9_655=l9_656;
float2 l9_657=float2(0.0);
l9_657=l9_655;
float2 l9_658=float2(0.0);
l9_658=(l9_641*l9_654)+l9_657;
float2 l9_659=float2(0.0);
l9_659=l9_658+(l9_657*(l9_639.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_637=l9_659;
l9_640=l9_637;
}
else
{
float2 l9_660=float2(0.0);
float2 l9_661=float2(0.0);
float2 l9_662=float2(0.0);
float2 l9_663=float2(0.0);
float2 l9_664=float2(0.0);
ssGlobals l9_665=l9_639;
float2 l9_666;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_667=float2(0.0);
l9_667=l9_665.Surface_UVCoord0;
l9_661=l9_667;
l9_666=l9_661;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_668=float2(0.0);
l9_668=l9_665.Surface_UVCoord1;
l9_662=l9_668;
l9_666=l9_662;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_669=float2(0.0);
l9_669=l9_665.gScreenCoord;
l9_663=l9_669;
l9_666=l9_663;
}
else
{
float2 l9_670=float2(0.0);
l9_670=l9_665.Surface_UVCoord0;
l9_664=l9_670;
l9_666=l9_664;
}
}
}
l9_660=l9_666;
float2 l9_671=float2(0.0);
float2 l9_672=(*sc_set0.UserUniforms).uv2Scale;
l9_671=l9_672;
float2 l9_673=float2(0.0);
l9_673=l9_671;
float2 l9_674=float2(0.0);
float2 l9_675=(*sc_set0.UserUniforms).uv2Offset;
l9_674=l9_675;
float2 l9_676=float2(0.0);
l9_676=l9_674;
float2 l9_677=float2(0.0);
l9_677=(l9_660*l9_673)+l9_676;
l9_638=l9_677;
l9_640=l9_638;
}
l9_636=l9_640;
l9_632=l9_636;
l9_635=l9_632;
}
else
{
float2 l9_678=float2(0.0);
l9_678=l9_634.Surface_UVCoord0;
l9_633=l9_678;
l9_635=l9_633;
}
l9_631=l9_635;
float2 l9_679=float2(0.0);
l9_679=l9_631;
float2 l9_680=float2(0.0);
l9_680=l9_679;
l9_624=l9_680;
l9_628=l9_624;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==3)
{
float2 l9_681=float2(0.0);
float2 l9_682=float2(0.0);
float2 l9_683=float2(0.0);
ssGlobals l9_684=l9_627;
float2 l9_685;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_686=float2(0.0);
float2 l9_687=float2(0.0);
float2 l9_688=float2(0.0);
ssGlobals l9_689=l9_684;
float2 l9_690;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_691=float2(0.0);
float2 l9_692=float2(0.0);
float2 l9_693=float2(0.0);
float2 l9_694=float2(0.0);
float2 l9_695=float2(0.0);
float2 l9_696=float2(0.0);
ssGlobals l9_697=l9_689;
float2 l9_698;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_699=float2(0.0);
l9_699=l9_697.Surface_UVCoord0;
l9_692=l9_699;
l9_698=l9_692;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_700=float2(0.0);
l9_700=l9_697.Surface_UVCoord1;
l9_693=l9_700;
l9_698=l9_693;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_701=float2(0.0);
l9_701=l9_697.gScreenCoord;
l9_694=l9_701;
l9_698=l9_694;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_702=float2(0.0);
float2 l9_703=float2(0.0);
float2 l9_704=float2(0.0);
ssGlobals l9_705=l9_697;
float2 l9_706;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_707=float2(0.0);
float2 l9_708=float2(0.0);
float2 l9_709=float2(0.0);
ssGlobals l9_710=l9_705;
float2 l9_711;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_712=float2(0.0);
float2 l9_713=float2(0.0);
float2 l9_714=float2(0.0);
float2 l9_715=float2(0.0);
float2 l9_716=float2(0.0);
ssGlobals l9_717=l9_710;
float2 l9_718;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_719=float2(0.0);
l9_719=l9_717.Surface_UVCoord0;
l9_713=l9_719;
l9_718=l9_713;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_720=float2(0.0);
l9_720=l9_717.Surface_UVCoord1;
l9_714=l9_720;
l9_718=l9_714;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_721=float2(0.0);
l9_721=l9_717.gScreenCoord;
l9_715=l9_721;
l9_718=l9_715;
}
else
{
float2 l9_722=float2(0.0);
l9_722=l9_717.Surface_UVCoord0;
l9_716=l9_722;
l9_718=l9_716;
}
}
}
l9_712=l9_718;
float2 l9_723=float2(0.0);
float2 l9_724=(*sc_set0.UserUniforms).uv2Scale;
l9_723=l9_724;
float2 l9_725=float2(0.0);
l9_725=l9_723;
float2 l9_726=float2(0.0);
float2 l9_727=(*sc_set0.UserUniforms).uv2Offset;
l9_726=l9_727;
float2 l9_728=float2(0.0);
l9_728=l9_726;
float2 l9_729=float2(0.0);
l9_729=(l9_712*l9_725)+l9_728;
float2 l9_730=float2(0.0);
l9_730=l9_729+(l9_728*(l9_710.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_708=l9_730;
l9_711=l9_708;
}
else
{
float2 l9_731=float2(0.0);
float2 l9_732=float2(0.0);
float2 l9_733=float2(0.0);
float2 l9_734=float2(0.0);
float2 l9_735=float2(0.0);
ssGlobals l9_736=l9_710;
float2 l9_737;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_738=float2(0.0);
l9_738=l9_736.Surface_UVCoord0;
l9_732=l9_738;
l9_737=l9_732;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_739=float2(0.0);
l9_739=l9_736.Surface_UVCoord1;
l9_733=l9_739;
l9_737=l9_733;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_740=float2(0.0);
l9_740=l9_736.gScreenCoord;
l9_734=l9_740;
l9_737=l9_734;
}
else
{
float2 l9_741=float2(0.0);
l9_741=l9_736.Surface_UVCoord0;
l9_735=l9_741;
l9_737=l9_735;
}
}
}
l9_731=l9_737;
float2 l9_742=float2(0.0);
float2 l9_743=(*sc_set0.UserUniforms).uv2Scale;
l9_742=l9_743;
float2 l9_744=float2(0.0);
l9_744=l9_742;
float2 l9_745=float2(0.0);
float2 l9_746=(*sc_set0.UserUniforms).uv2Offset;
l9_745=l9_746;
float2 l9_747=float2(0.0);
l9_747=l9_745;
float2 l9_748=float2(0.0);
l9_748=(l9_731*l9_744)+l9_747;
l9_709=l9_748;
l9_711=l9_709;
}
l9_707=l9_711;
l9_703=l9_707;
l9_706=l9_703;
}
else
{
float2 l9_749=float2(0.0);
l9_749=l9_705.Surface_UVCoord0;
l9_704=l9_749;
l9_706=l9_704;
}
l9_702=l9_706;
float2 l9_750=float2(0.0);
l9_750=l9_702;
float2 l9_751=float2(0.0);
l9_751=l9_750;
l9_695=l9_751;
l9_698=l9_695;
}
else
{
float2 l9_752=float2(0.0);
l9_752=l9_697.Surface_UVCoord0;
l9_696=l9_752;
l9_698=l9_696;
}
}
}
}
l9_691=l9_698;
float2 l9_753=float2(0.0);
float2 l9_754=(*sc_set0.UserUniforms).uv3Scale;
l9_753=l9_754;
float2 l9_755=float2(0.0);
l9_755=l9_753;
float2 l9_756=float2(0.0);
float2 l9_757=(*sc_set0.UserUniforms).uv3Offset;
l9_756=l9_757;
float2 l9_758=float2(0.0);
l9_758=l9_756;
float2 l9_759=float2(0.0);
l9_759=(l9_691*l9_755)+l9_758;
float2 l9_760=float2(0.0);
l9_760=l9_759+(l9_758*(l9_689.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_687=l9_760;
l9_690=l9_687;
}
else
{
float2 l9_761=float2(0.0);
float2 l9_762=float2(0.0);
float2 l9_763=float2(0.0);
float2 l9_764=float2(0.0);
float2 l9_765=float2(0.0);
float2 l9_766=float2(0.0);
ssGlobals l9_767=l9_689;
float2 l9_768;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_769=float2(0.0);
l9_769=l9_767.Surface_UVCoord0;
l9_762=l9_769;
l9_768=l9_762;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_770=float2(0.0);
l9_770=l9_767.Surface_UVCoord1;
l9_763=l9_770;
l9_768=l9_763;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_771=float2(0.0);
l9_771=l9_767.gScreenCoord;
l9_764=l9_771;
l9_768=l9_764;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_772=float2(0.0);
float2 l9_773=float2(0.0);
float2 l9_774=float2(0.0);
ssGlobals l9_775=l9_767;
float2 l9_776;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_777=float2(0.0);
float2 l9_778=float2(0.0);
float2 l9_779=float2(0.0);
ssGlobals l9_780=l9_775;
float2 l9_781;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_782=float2(0.0);
float2 l9_783=float2(0.0);
float2 l9_784=float2(0.0);
float2 l9_785=float2(0.0);
float2 l9_786=float2(0.0);
ssGlobals l9_787=l9_780;
float2 l9_788;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_789=float2(0.0);
l9_789=l9_787.Surface_UVCoord0;
l9_783=l9_789;
l9_788=l9_783;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_790=float2(0.0);
l9_790=l9_787.Surface_UVCoord1;
l9_784=l9_790;
l9_788=l9_784;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_791=float2(0.0);
l9_791=l9_787.gScreenCoord;
l9_785=l9_791;
l9_788=l9_785;
}
else
{
float2 l9_792=float2(0.0);
l9_792=l9_787.Surface_UVCoord0;
l9_786=l9_792;
l9_788=l9_786;
}
}
}
l9_782=l9_788;
float2 l9_793=float2(0.0);
float2 l9_794=(*sc_set0.UserUniforms).uv2Scale;
l9_793=l9_794;
float2 l9_795=float2(0.0);
l9_795=l9_793;
float2 l9_796=float2(0.0);
float2 l9_797=(*sc_set0.UserUniforms).uv2Offset;
l9_796=l9_797;
float2 l9_798=float2(0.0);
l9_798=l9_796;
float2 l9_799=float2(0.0);
l9_799=(l9_782*l9_795)+l9_798;
float2 l9_800=float2(0.0);
l9_800=l9_799+(l9_798*(l9_780.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_778=l9_800;
l9_781=l9_778;
}
else
{
float2 l9_801=float2(0.0);
float2 l9_802=float2(0.0);
float2 l9_803=float2(0.0);
float2 l9_804=float2(0.0);
float2 l9_805=float2(0.0);
ssGlobals l9_806=l9_780;
float2 l9_807;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_808=float2(0.0);
l9_808=l9_806.Surface_UVCoord0;
l9_802=l9_808;
l9_807=l9_802;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_809=float2(0.0);
l9_809=l9_806.Surface_UVCoord1;
l9_803=l9_809;
l9_807=l9_803;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_810=float2(0.0);
l9_810=l9_806.gScreenCoord;
l9_804=l9_810;
l9_807=l9_804;
}
else
{
float2 l9_811=float2(0.0);
l9_811=l9_806.Surface_UVCoord0;
l9_805=l9_811;
l9_807=l9_805;
}
}
}
l9_801=l9_807;
float2 l9_812=float2(0.0);
float2 l9_813=(*sc_set0.UserUniforms).uv2Scale;
l9_812=l9_813;
float2 l9_814=float2(0.0);
l9_814=l9_812;
float2 l9_815=float2(0.0);
float2 l9_816=(*sc_set0.UserUniforms).uv2Offset;
l9_815=l9_816;
float2 l9_817=float2(0.0);
l9_817=l9_815;
float2 l9_818=float2(0.0);
l9_818=(l9_801*l9_814)+l9_817;
l9_779=l9_818;
l9_781=l9_779;
}
l9_777=l9_781;
l9_773=l9_777;
l9_776=l9_773;
}
else
{
float2 l9_819=float2(0.0);
l9_819=l9_775.Surface_UVCoord0;
l9_774=l9_819;
l9_776=l9_774;
}
l9_772=l9_776;
float2 l9_820=float2(0.0);
l9_820=l9_772;
float2 l9_821=float2(0.0);
l9_821=l9_820;
l9_765=l9_821;
l9_768=l9_765;
}
else
{
float2 l9_822=float2(0.0);
l9_822=l9_767.Surface_UVCoord0;
l9_766=l9_822;
l9_768=l9_766;
}
}
}
}
l9_761=l9_768;
float2 l9_823=float2(0.0);
float2 l9_824=(*sc_set0.UserUniforms).uv3Scale;
l9_823=l9_824;
float2 l9_825=float2(0.0);
l9_825=l9_823;
float2 l9_826=float2(0.0);
float2 l9_827=(*sc_set0.UserUniforms).uv3Offset;
l9_826=l9_827;
float2 l9_828=float2(0.0);
l9_828=l9_826;
float2 l9_829=float2(0.0);
l9_829=(l9_761*l9_825)+l9_828;
l9_688=l9_829;
l9_690=l9_688;
}
l9_686=l9_690;
l9_682=l9_686;
l9_685=l9_682;
}
else
{
float2 l9_830=float2(0.0);
l9_830=l9_684.Surface_UVCoord0;
l9_683=l9_830;
l9_685=l9_683;
}
l9_681=l9_685;
float2 l9_831=float2(0.0);
l9_831=l9_681;
float2 l9_832=float2(0.0);
l9_832=l9_831;
l9_625=l9_832;
l9_628=l9_625;
}
else
{
float2 l9_833=float2(0.0);
l9_833=l9_627.Surface_UVCoord0;
l9_626=l9_833;
l9_628=l9_626;
}
}
}
}
l9_621=l9_628;
float4 l9_834=float4(0.0);
float2 l9_835=l9_621;
int l9_836;
if ((int(normalTexHasSwappedViews_tmp)!=0))
{
int l9_837=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_837=0;
}
else
{
l9_837=in.varStereoViewID;
}
int l9_838=l9_837;
l9_836=1-l9_838;
}
else
{
int l9_839=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_839=0;
}
else
{
l9_839=in.varStereoViewID;
}
int l9_840=l9_839;
l9_836=l9_840;
}
int l9_841=l9_836;
int l9_842=normalTexLayout_tmp;
int l9_843=l9_841;
float2 l9_844=l9_835;
bool l9_845=(int(SC_USE_UV_TRANSFORM_normalTex_tmp)!=0);
float3x3 l9_846=(*sc_set0.UserUniforms).normalTexTransform;
int2 l9_847=int2(SC_SOFTWARE_WRAP_MODE_U_normalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_normalTex_tmp);
bool l9_848=(int(SC_USE_UV_MIN_MAX_normalTex_tmp)!=0);
float4 l9_849=(*sc_set0.UserUniforms).normalTexUvMinMax;
bool l9_850=(int(SC_USE_CLAMP_TO_BORDER_normalTex_tmp)!=0);
float4 l9_851=(*sc_set0.UserUniforms).normalTexBorderColor;
float l9_852=0.0;
bool l9_853=l9_850&&(!l9_848);
float l9_854=1.0;
float l9_855=l9_844.x;
int l9_856=l9_847.x;
if (l9_856==1)
{
l9_855=fract(l9_855);
}
else
{
if (l9_856==2)
{
float l9_857=fract(l9_855);
float l9_858=l9_855-l9_857;
float l9_859=step(0.25,fract(l9_858*0.5));
l9_855=mix(l9_857,1.0-l9_857,fast::clamp(l9_859,0.0,1.0));
}
}
l9_844.x=l9_855;
float l9_860=l9_844.y;
int l9_861=l9_847.y;
if (l9_861==1)
{
l9_860=fract(l9_860);
}
else
{
if (l9_861==2)
{
float l9_862=fract(l9_860);
float l9_863=l9_860-l9_862;
float l9_864=step(0.25,fract(l9_863*0.5));
l9_860=mix(l9_862,1.0-l9_862,fast::clamp(l9_864,0.0,1.0));
}
}
l9_844.y=l9_860;
if (l9_848)
{
bool l9_865=l9_850;
bool l9_866;
if (l9_865)
{
l9_866=l9_847.x==3;
}
else
{
l9_866=l9_865;
}
float l9_867=l9_844.x;
float l9_868=l9_849.x;
float l9_869=l9_849.z;
bool l9_870=l9_866;
float l9_871=l9_854;
float l9_872=fast::clamp(l9_867,l9_868,l9_869);
float l9_873=step(abs(l9_867-l9_872),9.9999997e-06);
l9_871*=(l9_873+((1.0-float(l9_870))*(1.0-l9_873)));
l9_867=l9_872;
l9_844.x=l9_867;
l9_854=l9_871;
bool l9_874=l9_850;
bool l9_875;
if (l9_874)
{
l9_875=l9_847.y==3;
}
else
{
l9_875=l9_874;
}
float l9_876=l9_844.y;
float l9_877=l9_849.y;
float l9_878=l9_849.w;
bool l9_879=l9_875;
float l9_880=l9_854;
float l9_881=fast::clamp(l9_876,l9_877,l9_878);
float l9_882=step(abs(l9_876-l9_881),9.9999997e-06);
l9_880*=(l9_882+((1.0-float(l9_879))*(1.0-l9_882)));
l9_876=l9_881;
l9_844.y=l9_876;
l9_854=l9_880;
}
float2 l9_883=l9_844;
bool l9_884=l9_845;
float3x3 l9_885=l9_846;
if (l9_884)
{
l9_883=float2((l9_885*float3(l9_883,1.0)).xy);
}
float2 l9_886=l9_883;
l9_844=l9_886;
float l9_887=l9_844.x;
int l9_888=l9_847.x;
bool l9_889=l9_853;
float l9_890=l9_854;
if ((l9_888==0)||(l9_888==3))
{
float l9_891=l9_887;
float l9_892=0.0;
float l9_893=1.0;
bool l9_894=l9_889;
float l9_895=l9_890;
float l9_896=fast::clamp(l9_891,l9_892,l9_893);
float l9_897=step(abs(l9_891-l9_896),9.9999997e-06);
l9_895*=(l9_897+((1.0-float(l9_894))*(1.0-l9_897)));
l9_891=l9_896;
l9_887=l9_891;
l9_890=l9_895;
}
l9_844.x=l9_887;
l9_854=l9_890;
float l9_898=l9_844.y;
int l9_899=l9_847.y;
bool l9_900=l9_853;
float l9_901=l9_854;
if ((l9_899==0)||(l9_899==3))
{
float l9_902=l9_898;
float l9_903=0.0;
float l9_904=1.0;
bool l9_905=l9_900;
float l9_906=l9_901;
float l9_907=fast::clamp(l9_902,l9_903,l9_904);
float l9_908=step(abs(l9_902-l9_907),9.9999997e-06);
l9_906*=(l9_908+((1.0-float(l9_905))*(1.0-l9_908)));
l9_902=l9_907;
l9_898=l9_902;
l9_901=l9_906;
}
l9_844.y=l9_898;
l9_854=l9_901;
float2 l9_909=l9_844;
int l9_910=l9_842;
int l9_911=l9_843;
float l9_912=l9_852;
float2 l9_913=l9_909;
int l9_914=l9_910;
int l9_915=l9_911;
float3 l9_916=float3(0.0);
if (l9_914==0)
{
l9_916=float3(l9_913,0.0);
}
else
{
if (l9_914==1)
{
l9_916=float3(l9_913.x,(l9_913.y*0.5)+(0.5-(float(l9_915)*0.5)),0.0);
}
else
{
l9_916=float3(l9_913,float(l9_915));
}
}
float3 l9_917=l9_916;
float3 l9_918=l9_917;
float4 l9_919=sc_set0.normalTex.sample(sc_set0.normalTexSmpSC,l9_918.xy,bias(l9_912));
float4 l9_920=l9_919;
if (l9_850)
{
l9_920=mix(l9_851,l9_920,float4(l9_854));
}
float4 l9_921=l9_920;
float4 l9_922=l9_921;
float3 l9_923=(l9_922.xyz*1.9921875)-float3(1.0);
l9_922=float4(l9_923.x,l9_923.y,l9_923.z,l9_922.w);
l9_834=l9_922;
float3 l9_924=float3(0.0);
float3 l9_925=float3(0.0);
float3 l9_926=(*sc_set0.UserUniforms).Port_Default_N113;
ssGlobals l9_927=param_25;
float3 l9_928;
if ((int(ENABLE_DETAIL_NORMAL_tmp)!=0))
{
float2 l9_929=float2(0.0);
float2 l9_930=float2(0.0);
float2 l9_931=float2(0.0);
float2 l9_932=float2(0.0);
float2 l9_933=float2(0.0);
float2 l9_934=float2(0.0);
ssGlobals l9_935=l9_927;
float2 l9_936;
if (NODE_184_DROPLIST_ITEM_tmp==0)
{
float2 l9_937=float2(0.0);
l9_937=l9_935.Surface_UVCoord0;
l9_930=l9_937;
l9_936=l9_930;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==1)
{
float2 l9_938=float2(0.0);
l9_938=l9_935.Surface_UVCoord1;
l9_931=l9_938;
l9_936=l9_931;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==2)
{
float2 l9_939=float2(0.0);
float2 l9_940=float2(0.0);
float2 l9_941=float2(0.0);
ssGlobals l9_942=l9_935;
float2 l9_943;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_944=float2(0.0);
float2 l9_945=float2(0.0);
float2 l9_946=float2(0.0);
ssGlobals l9_947=l9_942;
float2 l9_948;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_949=float2(0.0);
float2 l9_950=float2(0.0);
float2 l9_951=float2(0.0);
float2 l9_952=float2(0.0);
float2 l9_953=float2(0.0);
ssGlobals l9_954=l9_947;
float2 l9_955;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_956=float2(0.0);
l9_956=l9_954.Surface_UVCoord0;
l9_950=l9_956;
l9_955=l9_950;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_957=float2(0.0);
l9_957=l9_954.Surface_UVCoord1;
l9_951=l9_957;
l9_955=l9_951;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_958=float2(0.0);
l9_958=l9_954.gScreenCoord;
l9_952=l9_958;
l9_955=l9_952;
}
else
{
float2 l9_959=float2(0.0);
l9_959=l9_954.Surface_UVCoord0;
l9_953=l9_959;
l9_955=l9_953;
}
}
}
l9_949=l9_955;
float2 l9_960=float2(0.0);
float2 l9_961=(*sc_set0.UserUniforms).uv2Scale;
l9_960=l9_961;
float2 l9_962=float2(0.0);
l9_962=l9_960;
float2 l9_963=float2(0.0);
float2 l9_964=(*sc_set0.UserUniforms).uv2Offset;
l9_963=l9_964;
float2 l9_965=float2(0.0);
l9_965=l9_963;
float2 l9_966=float2(0.0);
l9_966=(l9_949*l9_962)+l9_965;
float2 l9_967=float2(0.0);
l9_967=l9_966+(l9_965*(l9_947.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_945=l9_967;
l9_948=l9_945;
}
else
{
float2 l9_968=float2(0.0);
float2 l9_969=float2(0.0);
float2 l9_970=float2(0.0);
float2 l9_971=float2(0.0);
float2 l9_972=float2(0.0);
ssGlobals l9_973=l9_947;
float2 l9_974;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_975=float2(0.0);
l9_975=l9_973.Surface_UVCoord0;
l9_969=l9_975;
l9_974=l9_969;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_976=float2(0.0);
l9_976=l9_973.Surface_UVCoord1;
l9_970=l9_976;
l9_974=l9_970;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_977=float2(0.0);
l9_977=l9_973.gScreenCoord;
l9_971=l9_977;
l9_974=l9_971;
}
else
{
float2 l9_978=float2(0.0);
l9_978=l9_973.Surface_UVCoord0;
l9_972=l9_978;
l9_974=l9_972;
}
}
}
l9_968=l9_974;
float2 l9_979=float2(0.0);
float2 l9_980=(*sc_set0.UserUniforms).uv2Scale;
l9_979=l9_980;
float2 l9_981=float2(0.0);
l9_981=l9_979;
float2 l9_982=float2(0.0);
float2 l9_983=(*sc_set0.UserUniforms).uv2Offset;
l9_982=l9_983;
float2 l9_984=float2(0.0);
l9_984=l9_982;
float2 l9_985=float2(0.0);
l9_985=(l9_968*l9_981)+l9_984;
l9_946=l9_985;
l9_948=l9_946;
}
l9_944=l9_948;
l9_940=l9_944;
l9_943=l9_940;
}
else
{
float2 l9_986=float2(0.0);
l9_986=l9_942.Surface_UVCoord0;
l9_941=l9_986;
l9_943=l9_941;
}
l9_939=l9_943;
float2 l9_987=float2(0.0);
l9_987=l9_939;
float2 l9_988=float2(0.0);
l9_988=l9_987;
l9_932=l9_988;
l9_936=l9_932;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==3)
{
float2 l9_989=float2(0.0);
float2 l9_990=float2(0.0);
float2 l9_991=float2(0.0);
ssGlobals l9_992=l9_935;
float2 l9_993;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_994=float2(0.0);
float2 l9_995=float2(0.0);
float2 l9_996=float2(0.0);
ssGlobals l9_997=l9_992;
float2 l9_998;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_999=float2(0.0);
float2 l9_1000=float2(0.0);
float2 l9_1001=float2(0.0);
float2 l9_1002=float2(0.0);
float2 l9_1003=float2(0.0);
float2 l9_1004=float2(0.0);
ssGlobals l9_1005=l9_997;
float2 l9_1006;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1007=float2(0.0);
l9_1007=l9_1005.Surface_UVCoord0;
l9_1000=l9_1007;
l9_1006=l9_1000;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1008=float2(0.0);
l9_1008=l9_1005.Surface_UVCoord1;
l9_1001=l9_1008;
l9_1006=l9_1001;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1009=float2(0.0);
l9_1009=l9_1005.gScreenCoord;
l9_1002=l9_1009;
l9_1006=l9_1002;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1010=float2(0.0);
float2 l9_1011=float2(0.0);
float2 l9_1012=float2(0.0);
ssGlobals l9_1013=l9_1005;
float2 l9_1014;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1015=float2(0.0);
float2 l9_1016=float2(0.0);
float2 l9_1017=float2(0.0);
ssGlobals l9_1018=l9_1013;
float2 l9_1019;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1020=float2(0.0);
float2 l9_1021=float2(0.0);
float2 l9_1022=float2(0.0);
float2 l9_1023=float2(0.0);
float2 l9_1024=float2(0.0);
ssGlobals l9_1025=l9_1018;
float2 l9_1026;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1027=float2(0.0);
l9_1027=l9_1025.Surface_UVCoord0;
l9_1021=l9_1027;
l9_1026=l9_1021;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1028=float2(0.0);
l9_1028=l9_1025.Surface_UVCoord1;
l9_1022=l9_1028;
l9_1026=l9_1022;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1029=float2(0.0);
l9_1029=l9_1025.gScreenCoord;
l9_1023=l9_1029;
l9_1026=l9_1023;
}
else
{
float2 l9_1030=float2(0.0);
l9_1030=l9_1025.Surface_UVCoord0;
l9_1024=l9_1030;
l9_1026=l9_1024;
}
}
}
l9_1020=l9_1026;
float2 l9_1031=float2(0.0);
float2 l9_1032=(*sc_set0.UserUniforms).uv2Scale;
l9_1031=l9_1032;
float2 l9_1033=float2(0.0);
l9_1033=l9_1031;
float2 l9_1034=float2(0.0);
float2 l9_1035=(*sc_set0.UserUniforms).uv2Offset;
l9_1034=l9_1035;
float2 l9_1036=float2(0.0);
l9_1036=l9_1034;
float2 l9_1037=float2(0.0);
l9_1037=(l9_1020*l9_1033)+l9_1036;
float2 l9_1038=float2(0.0);
l9_1038=l9_1037+(l9_1036*(l9_1018.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1016=l9_1038;
l9_1019=l9_1016;
}
else
{
float2 l9_1039=float2(0.0);
float2 l9_1040=float2(0.0);
float2 l9_1041=float2(0.0);
float2 l9_1042=float2(0.0);
float2 l9_1043=float2(0.0);
ssGlobals l9_1044=l9_1018;
float2 l9_1045;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1046=float2(0.0);
l9_1046=l9_1044.Surface_UVCoord0;
l9_1040=l9_1046;
l9_1045=l9_1040;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1047=float2(0.0);
l9_1047=l9_1044.Surface_UVCoord1;
l9_1041=l9_1047;
l9_1045=l9_1041;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1048=float2(0.0);
l9_1048=l9_1044.gScreenCoord;
l9_1042=l9_1048;
l9_1045=l9_1042;
}
else
{
float2 l9_1049=float2(0.0);
l9_1049=l9_1044.Surface_UVCoord0;
l9_1043=l9_1049;
l9_1045=l9_1043;
}
}
}
l9_1039=l9_1045;
float2 l9_1050=float2(0.0);
float2 l9_1051=(*sc_set0.UserUniforms).uv2Scale;
l9_1050=l9_1051;
float2 l9_1052=float2(0.0);
l9_1052=l9_1050;
float2 l9_1053=float2(0.0);
float2 l9_1054=(*sc_set0.UserUniforms).uv2Offset;
l9_1053=l9_1054;
float2 l9_1055=float2(0.0);
l9_1055=l9_1053;
float2 l9_1056=float2(0.0);
l9_1056=(l9_1039*l9_1052)+l9_1055;
l9_1017=l9_1056;
l9_1019=l9_1017;
}
l9_1015=l9_1019;
l9_1011=l9_1015;
l9_1014=l9_1011;
}
else
{
float2 l9_1057=float2(0.0);
l9_1057=l9_1013.Surface_UVCoord0;
l9_1012=l9_1057;
l9_1014=l9_1012;
}
l9_1010=l9_1014;
float2 l9_1058=float2(0.0);
l9_1058=l9_1010;
float2 l9_1059=float2(0.0);
l9_1059=l9_1058;
l9_1003=l9_1059;
l9_1006=l9_1003;
}
else
{
float2 l9_1060=float2(0.0);
l9_1060=l9_1005.Surface_UVCoord0;
l9_1004=l9_1060;
l9_1006=l9_1004;
}
}
}
}
l9_999=l9_1006;
float2 l9_1061=float2(0.0);
float2 l9_1062=(*sc_set0.UserUniforms).uv3Scale;
l9_1061=l9_1062;
float2 l9_1063=float2(0.0);
l9_1063=l9_1061;
float2 l9_1064=float2(0.0);
float2 l9_1065=(*sc_set0.UserUniforms).uv3Offset;
l9_1064=l9_1065;
float2 l9_1066=float2(0.0);
l9_1066=l9_1064;
float2 l9_1067=float2(0.0);
l9_1067=(l9_999*l9_1063)+l9_1066;
float2 l9_1068=float2(0.0);
l9_1068=l9_1067+(l9_1066*(l9_997.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_995=l9_1068;
l9_998=l9_995;
}
else
{
float2 l9_1069=float2(0.0);
float2 l9_1070=float2(0.0);
float2 l9_1071=float2(0.0);
float2 l9_1072=float2(0.0);
float2 l9_1073=float2(0.0);
float2 l9_1074=float2(0.0);
ssGlobals l9_1075=l9_997;
float2 l9_1076;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1077=float2(0.0);
l9_1077=l9_1075.Surface_UVCoord0;
l9_1070=l9_1077;
l9_1076=l9_1070;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1078=float2(0.0);
l9_1078=l9_1075.Surface_UVCoord1;
l9_1071=l9_1078;
l9_1076=l9_1071;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1079=float2(0.0);
l9_1079=l9_1075.gScreenCoord;
l9_1072=l9_1079;
l9_1076=l9_1072;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1080=float2(0.0);
float2 l9_1081=float2(0.0);
float2 l9_1082=float2(0.0);
ssGlobals l9_1083=l9_1075;
float2 l9_1084;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1085=float2(0.0);
float2 l9_1086=float2(0.0);
float2 l9_1087=float2(0.0);
ssGlobals l9_1088=l9_1083;
float2 l9_1089;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1090=float2(0.0);
float2 l9_1091=float2(0.0);
float2 l9_1092=float2(0.0);
float2 l9_1093=float2(0.0);
float2 l9_1094=float2(0.0);
ssGlobals l9_1095=l9_1088;
float2 l9_1096;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1097=float2(0.0);
l9_1097=l9_1095.Surface_UVCoord0;
l9_1091=l9_1097;
l9_1096=l9_1091;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1098=float2(0.0);
l9_1098=l9_1095.Surface_UVCoord1;
l9_1092=l9_1098;
l9_1096=l9_1092;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1099=float2(0.0);
l9_1099=l9_1095.gScreenCoord;
l9_1093=l9_1099;
l9_1096=l9_1093;
}
else
{
float2 l9_1100=float2(0.0);
l9_1100=l9_1095.Surface_UVCoord0;
l9_1094=l9_1100;
l9_1096=l9_1094;
}
}
}
l9_1090=l9_1096;
float2 l9_1101=float2(0.0);
float2 l9_1102=(*sc_set0.UserUniforms).uv2Scale;
l9_1101=l9_1102;
float2 l9_1103=float2(0.0);
l9_1103=l9_1101;
float2 l9_1104=float2(0.0);
float2 l9_1105=(*sc_set0.UserUniforms).uv2Offset;
l9_1104=l9_1105;
float2 l9_1106=float2(0.0);
l9_1106=l9_1104;
float2 l9_1107=float2(0.0);
l9_1107=(l9_1090*l9_1103)+l9_1106;
float2 l9_1108=float2(0.0);
l9_1108=l9_1107+(l9_1106*(l9_1088.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1086=l9_1108;
l9_1089=l9_1086;
}
else
{
float2 l9_1109=float2(0.0);
float2 l9_1110=float2(0.0);
float2 l9_1111=float2(0.0);
float2 l9_1112=float2(0.0);
float2 l9_1113=float2(0.0);
ssGlobals l9_1114=l9_1088;
float2 l9_1115;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1116=float2(0.0);
l9_1116=l9_1114.Surface_UVCoord0;
l9_1110=l9_1116;
l9_1115=l9_1110;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1117=float2(0.0);
l9_1117=l9_1114.Surface_UVCoord1;
l9_1111=l9_1117;
l9_1115=l9_1111;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1118=float2(0.0);
l9_1118=l9_1114.gScreenCoord;
l9_1112=l9_1118;
l9_1115=l9_1112;
}
else
{
float2 l9_1119=float2(0.0);
l9_1119=l9_1114.Surface_UVCoord0;
l9_1113=l9_1119;
l9_1115=l9_1113;
}
}
}
l9_1109=l9_1115;
float2 l9_1120=float2(0.0);
float2 l9_1121=(*sc_set0.UserUniforms).uv2Scale;
l9_1120=l9_1121;
float2 l9_1122=float2(0.0);
l9_1122=l9_1120;
float2 l9_1123=float2(0.0);
float2 l9_1124=(*sc_set0.UserUniforms).uv2Offset;
l9_1123=l9_1124;
float2 l9_1125=float2(0.0);
l9_1125=l9_1123;
float2 l9_1126=float2(0.0);
l9_1126=(l9_1109*l9_1122)+l9_1125;
l9_1087=l9_1126;
l9_1089=l9_1087;
}
l9_1085=l9_1089;
l9_1081=l9_1085;
l9_1084=l9_1081;
}
else
{
float2 l9_1127=float2(0.0);
l9_1127=l9_1083.Surface_UVCoord0;
l9_1082=l9_1127;
l9_1084=l9_1082;
}
l9_1080=l9_1084;
float2 l9_1128=float2(0.0);
l9_1128=l9_1080;
float2 l9_1129=float2(0.0);
l9_1129=l9_1128;
l9_1073=l9_1129;
l9_1076=l9_1073;
}
else
{
float2 l9_1130=float2(0.0);
l9_1130=l9_1075.Surface_UVCoord0;
l9_1074=l9_1130;
l9_1076=l9_1074;
}
}
}
}
l9_1069=l9_1076;
float2 l9_1131=float2(0.0);
float2 l9_1132=(*sc_set0.UserUniforms).uv3Scale;
l9_1131=l9_1132;
float2 l9_1133=float2(0.0);
l9_1133=l9_1131;
float2 l9_1134=float2(0.0);
float2 l9_1135=(*sc_set0.UserUniforms).uv3Offset;
l9_1134=l9_1135;
float2 l9_1136=float2(0.0);
l9_1136=l9_1134;
float2 l9_1137=float2(0.0);
l9_1137=(l9_1069*l9_1133)+l9_1136;
l9_996=l9_1137;
l9_998=l9_996;
}
l9_994=l9_998;
l9_990=l9_994;
l9_993=l9_990;
}
else
{
float2 l9_1138=float2(0.0);
l9_1138=l9_992.Surface_UVCoord0;
l9_991=l9_1138;
l9_993=l9_991;
}
l9_989=l9_993;
float2 l9_1139=float2(0.0);
l9_1139=l9_989;
float2 l9_1140=float2(0.0);
l9_1140=l9_1139;
l9_933=l9_1140;
l9_936=l9_933;
}
else
{
float2 l9_1141=float2(0.0);
l9_1141=l9_935.Surface_UVCoord0;
l9_934=l9_1141;
l9_936=l9_934;
}
}
}
}
l9_929=l9_936;
float4 l9_1142=float4(0.0);
float2 l9_1143=l9_929;
int l9_1144;
if ((int(detailNormalTexHasSwappedViews_tmp)!=0))
{
int l9_1145=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1145=0;
}
else
{
l9_1145=in.varStereoViewID;
}
int l9_1146=l9_1145;
l9_1144=1-l9_1146;
}
else
{
int l9_1147=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1147=0;
}
else
{
l9_1147=in.varStereoViewID;
}
int l9_1148=l9_1147;
l9_1144=l9_1148;
}
int l9_1149=l9_1144;
int l9_1150=detailNormalTexLayout_tmp;
int l9_1151=l9_1149;
float2 l9_1152=l9_1143;
bool l9_1153=(int(SC_USE_UV_TRANSFORM_detailNormalTex_tmp)!=0);
float3x3 l9_1154=(*sc_set0.UserUniforms).detailNormalTexTransform;
int2 l9_1155=int2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex_tmp);
bool l9_1156=(int(SC_USE_UV_MIN_MAX_detailNormalTex_tmp)!=0);
float4 l9_1157=(*sc_set0.UserUniforms).detailNormalTexUvMinMax;
bool l9_1158=(int(SC_USE_CLAMP_TO_BORDER_detailNormalTex_tmp)!=0);
float4 l9_1159=(*sc_set0.UserUniforms).detailNormalTexBorderColor;
float l9_1160=0.0;
bool l9_1161=l9_1158&&(!l9_1156);
float l9_1162=1.0;
float l9_1163=l9_1152.x;
int l9_1164=l9_1155.x;
if (l9_1164==1)
{
l9_1163=fract(l9_1163);
}
else
{
if (l9_1164==2)
{
float l9_1165=fract(l9_1163);
float l9_1166=l9_1163-l9_1165;
float l9_1167=step(0.25,fract(l9_1166*0.5));
l9_1163=mix(l9_1165,1.0-l9_1165,fast::clamp(l9_1167,0.0,1.0));
}
}
l9_1152.x=l9_1163;
float l9_1168=l9_1152.y;
int l9_1169=l9_1155.y;
if (l9_1169==1)
{
l9_1168=fract(l9_1168);
}
else
{
if (l9_1169==2)
{
float l9_1170=fract(l9_1168);
float l9_1171=l9_1168-l9_1170;
float l9_1172=step(0.25,fract(l9_1171*0.5));
l9_1168=mix(l9_1170,1.0-l9_1170,fast::clamp(l9_1172,0.0,1.0));
}
}
l9_1152.y=l9_1168;
if (l9_1156)
{
bool l9_1173=l9_1158;
bool l9_1174;
if (l9_1173)
{
l9_1174=l9_1155.x==3;
}
else
{
l9_1174=l9_1173;
}
float l9_1175=l9_1152.x;
float l9_1176=l9_1157.x;
float l9_1177=l9_1157.z;
bool l9_1178=l9_1174;
float l9_1179=l9_1162;
float l9_1180=fast::clamp(l9_1175,l9_1176,l9_1177);
float l9_1181=step(abs(l9_1175-l9_1180),9.9999997e-06);
l9_1179*=(l9_1181+((1.0-float(l9_1178))*(1.0-l9_1181)));
l9_1175=l9_1180;
l9_1152.x=l9_1175;
l9_1162=l9_1179;
bool l9_1182=l9_1158;
bool l9_1183;
if (l9_1182)
{
l9_1183=l9_1155.y==3;
}
else
{
l9_1183=l9_1182;
}
float l9_1184=l9_1152.y;
float l9_1185=l9_1157.y;
float l9_1186=l9_1157.w;
bool l9_1187=l9_1183;
float l9_1188=l9_1162;
float l9_1189=fast::clamp(l9_1184,l9_1185,l9_1186);
float l9_1190=step(abs(l9_1184-l9_1189),9.9999997e-06);
l9_1188*=(l9_1190+((1.0-float(l9_1187))*(1.0-l9_1190)));
l9_1184=l9_1189;
l9_1152.y=l9_1184;
l9_1162=l9_1188;
}
float2 l9_1191=l9_1152;
bool l9_1192=l9_1153;
float3x3 l9_1193=l9_1154;
if (l9_1192)
{
l9_1191=float2((l9_1193*float3(l9_1191,1.0)).xy);
}
float2 l9_1194=l9_1191;
l9_1152=l9_1194;
float l9_1195=l9_1152.x;
int l9_1196=l9_1155.x;
bool l9_1197=l9_1161;
float l9_1198=l9_1162;
if ((l9_1196==0)||(l9_1196==3))
{
float l9_1199=l9_1195;
float l9_1200=0.0;
float l9_1201=1.0;
bool l9_1202=l9_1197;
float l9_1203=l9_1198;
float l9_1204=fast::clamp(l9_1199,l9_1200,l9_1201);
float l9_1205=step(abs(l9_1199-l9_1204),9.9999997e-06);
l9_1203*=(l9_1205+((1.0-float(l9_1202))*(1.0-l9_1205)));
l9_1199=l9_1204;
l9_1195=l9_1199;
l9_1198=l9_1203;
}
l9_1152.x=l9_1195;
l9_1162=l9_1198;
float l9_1206=l9_1152.y;
int l9_1207=l9_1155.y;
bool l9_1208=l9_1161;
float l9_1209=l9_1162;
if ((l9_1207==0)||(l9_1207==3))
{
float l9_1210=l9_1206;
float l9_1211=0.0;
float l9_1212=1.0;
bool l9_1213=l9_1208;
float l9_1214=l9_1209;
float l9_1215=fast::clamp(l9_1210,l9_1211,l9_1212);
float l9_1216=step(abs(l9_1210-l9_1215),9.9999997e-06);
l9_1214*=(l9_1216+((1.0-float(l9_1213))*(1.0-l9_1216)));
l9_1210=l9_1215;
l9_1206=l9_1210;
l9_1209=l9_1214;
}
l9_1152.y=l9_1206;
l9_1162=l9_1209;
float2 l9_1217=l9_1152;
int l9_1218=l9_1150;
int l9_1219=l9_1151;
float l9_1220=l9_1160;
float2 l9_1221=l9_1217;
int l9_1222=l9_1218;
int l9_1223=l9_1219;
float3 l9_1224=float3(0.0);
if (l9_1222==0)
{
l9_1224=float3(l9_1221,0.0);
}
else
{
if (l9_1222==1)
{
l9_1224=float3(l9_1221.x,(l9_1221.y*0.5)+(0.5-(float(l9_1223)*0.5)),0.0);
}
else
{
l9_1224=float3(l9_1221,float(l9_1223));
}
}
float3 l9_1225=l9_1224;
float3 l9_1226=l9_1225;
float4 l9_1227=sc_set0.detailNormalTex.sample(sc_set0.detailNormalTexSmpSC,l9_1226.xy,bias(l9_1220));
float4 l9_1228=l9_1227;
if (l9_1158)
{
l9_1228=mix(l9_1159,l9_1228,float4(l9_1162));
}
float4 l9_1229=l9_1228;
float4 l9_1230=l9_1229;
float3 l9_1231=(l9_1230.xyz*1.9921875)-float3(1.0);
l9_1230=float4(l9_1231.x,l9_1231.y,l9_1231.z,l9_1230.w);
l9_1142=l9_1230;
l9_925=l9_1142.xyz;
l9_928=l9_925;
}
else
{
l9_928=l9_926;
}
l9_924=l9_928;
float3 l9_1232=float3(0.0);
float3 l9_1233=l9_834.xyz;
float l9_1234=(*sc_set0.UserUniforms).Port_Strength1_N200;
float3 l9_1235=l9_924;
float l9_1236=(*sc_set0.UserUniforms).Port_Strength2_N200;
float3 l9_1237=l9_1233;
float l9_1238=l9_1234;
float3 l9_1239=l9_1235;
float l9_1240=l9_1236;
float3 l9_1241=mix(float3(0.0,0.0,1.0),l9_1237,float3(l9_1238))+float3(0.0,0.0,1.0);
float3 l9_1242=mix(float3(0.0,0.0,1.0),l9_1239,float3(l9_1240))*float3(-1.0,-1.0,1.0);
float3 l9_1243=normalize((l9_1241*dot(l9_1241,l9_1242))-(l9_1242*l9_1241.z));
l9_1235=l9_1243;
float3 l9_1244=l9_1235;
l9_1232=l9_1244;
float3 l9_1245=float3(0.0);
l9_1245=l9_620*l9_1232;
float3 l9_1246=float3(0.0);
float3 l9_1247=l9_1245;
float l9_1248=dot(l9_1247,l9_1247);
float l9_1249;
if (l9_1248>0.0)
{
l9_1249=1.0/sqrt(l9_1248);
}
else
{
l9_1249=0.0;
}
float l9_1250=l9_1249;
float3 l9_1251=l9_1247*l9_1250;
l9_1246=l9_1251;
param_22=l9_1246;
param_24=param_22;
}
else
{
float3 l9_1252=float3(0.0);
l9_1252=param_25.VertexNormal_WorldSpace;
float3 l9_1253=float3(0.0);
float3 l9_1254=l9_1252;
float l9_1255=dot(l9_1254,l9_1254);
float l9_1256;
if (l9_1255>0.0)
{
l9_1256=1.0/sqrt(l9_1255);
}
else
{
l9_1256=0.0;
}
float l9_1257=l9_1256;
float3 l9_1258=l9_1254*l9_1257;
l9_1253=l9_1258;
param_23=l9_1253;
param_24=param_23;
}
Result_N337=param_24;
float3 Export_N334=float3(0.0);
Export_N334=Result_N337;
float param_26=Export_N158;
float3 param_27=Export_N334;
ssGlobals param_28=Globals;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_28.BumpedNormal=param_27;
}
param_26=fast::clamp(param_26,0.0,1.0);
float l9_1259=param_26;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_1259<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_1260=gl_FragCoord;
float2 l9_1261=floor(mod(l9_1260.xy,float2(4.0)));
float l9_1262=(mod(dot(l9_1261,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_1259<l9_1262)
{
discard_fragment();
}
}
float3 l9_1263=param_28.PositionWS;
float3 l9_1264=param_28.BumpedNormal;
float l9_1265=1.0;
float3 l9_1266=l9_1263;
float3 l9_1267=l9_1264;
float l9_1268=l9_1265;
uint l9_1269=0u;
uint3 l9_1270=uint3(round((l9_1266-(*sc_set0.UserUniforms).sc_RayTracingOriginOffset)*(*sc_set0.UserUniforms).sc_RayTracingOriginScale));
out.sc_RayTracingPositionAndMask=uint4(l9_1270.x,l9_1270.y,l9_1270.z,out.sc_RayTracingPositionAndMask.w);
out.sc_RayTracingPositionAndMask.w=(*sc_set0.UserUniforms).sc_RayTracingReceiverMask;
float3 l9_1271=l9_1267;
float l9_1272=dot(abs(l9_1271),float3(1.0));
l9_1271/=float3(l9_1272);
float2 l9_1273=float2(fast::clamp(-l9_1271.z,0.0,1.0));
float2 l9_1274=l9_1271.xy+mix(-l9_1273,l9_1273,step(float2(0.0),l9_1271.xy));
uint l9_1275=as_type<uint>(half2(l9_1274));
uint2 l9_1276=uint2(l9_1275&65535u,l9_1275>>16u);
out.sc_RayTracingNormalAndMore=uint4(l9_1276.x,l9_1276.y,out.sc_RayTracingNormalAndMore.z,out.sc_RayTracingNormalAndMore.w);
out.sc_RayTracingNormalAndMore.z=l9_1269;
uint l9_1277=uint(fast::clamp(l9_1268,0.0,1.0)*1000.0);
l9_1277 |= (((*sc_set0.UserUniforms).sc_RayTracingReceiverId%32u)<<10u);
out.sc_RayTracingNormalAndMore.w=l9_1277;
return out;
}
} // RECEIVER MODE SHADER
