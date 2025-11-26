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
//ubo int UserUniforms 0:45:5760 {
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
//float3 recolorRed 4624
//float Level 4640
//float4 innerColor1 4656
//float4 innerColor2 4672
//float4 outerColor1 4688
//float4 outerColor2 4704
//float3x3 baseTexTransform 4768
//float4 baseTexUvMinMax 4816
//float4 baseTexBorderColor 4832
//float2 uv2Scale 4848
//float2 uv2Offset 4856
//float2 uv3Scale 4864
//float2 uv3Offset 4872
//float3 recolorGreen 4880
//float3 recolorBlue 4896
//float3x3 opacityTexTransform 4960
//float4 opacityTexUvMinMax 5008
//float4 opacityTexBorderColor 5024
//float3x3 normalTexTransform 5088
//float4 normalTexUvMinMax 5136
//float4 normalTexBorderColor 5152
//float3x3 detailNormalTexTransform 5216
//float4 detailNormalTexUvMinMax 5264
//float4 detailNormalTexBorderColor 5280
//float innerColorMultiplier 5296
//float outerColorMultiplier 5300
//float Port_Speed_N022 5416
//float Port_Speed_N063 5472
//float4 Port_Default_N369 5488
//float Port_Value2_N073 5568
//float Port_Default_N204 5624
//float Port_Input2_N072 5636
//float Port_Strength1_N200 5664
//float3 Port_Default_N113 5680
//float Port_Strength2_N200 5696
//float3 Port_Emissive_N036 5712
//float3 Port_AO_N036 5728
//float depthRef 5744
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
float Level;
float4 innerColor1;
float4 innerColor2;
float4 outerColor1;
float4 outerColor2;
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
float innerColorMultiplier;
float outerColorMultiplier;
float4 Port_Import_N042;
float Port_Input1_N044;
float Port_Import_N088;
float3 Port_Import_N089;
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
float Level;
float4 innerColor1;
float4 innerColor2;
float4 outerColor1;
float4 outerColor2;
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
float innerColorMultiplier;
float outerColorMultiplier;
float4 Port_Import_N042;
float Port_Input1_N044;
float Port_Import_N088;
float3 Port_Import_N089;
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
float4 l9_26=float4(0.0);
float l9_27=1.0;
float4 l9_28=float4(1.0);
float4 l9_29=float4(0.0);
ssGlobals l9_30=l9_21;
float2 l9_31=float2(0.0);
l9_31=l9_30.Surface_UVCoord0;
float l9_32=0.0;
float2 l9_33=l9_31;
float l9_34=l9_33.x;
l9_32=l9_34;
float l9_35=0.0;
float l9_36=(*sc_set0.UserUniforms).Level;
l9_35=l9_36;
float l9_37=0.0;
l9_37=float(l9_32<l9_35);
l9_27=l9_37;
float4 l9_38;
if ((l9_27*1.0)!=0.0)
{
float4 l9_39=float4(0.0);
float4 l9_40=(*sc_set0.UserUniforms).innerColor1;
l9_39=l9_40;
float4 l9_41=float4(0.0);
float4 l9_42=(*sc_set0.UserUniforms).innerColor2;
l9_41=l9_42;
float2 l9_43=float2(0.0);
l9_43=l9_30.Surface_UVCoord0;
float l9_44=0.0;
float2 l9_45=l9_43;
float l9_46=l9_45.y;
l9_44=l9_46;
float4 l9_47=float4(0.0);
l9_47=mix(l9_39,l9_41,float4(l9_44));
l9_28=l9_47;
l9_38=l9_28;
}
else
{
float4 l9_48=float4(0.0);
float4 l9_49=(*sc_set0.UserUniforms).outerColor1;
l9_48=l9_49;
float4 l9_50=float4(0.0);
float4 l9_51=(*sc_set0.UserUniforms).outerColor2;
l9_50=l9_51;
float2 l9_52=float2(0.0);
l9_52=l9_30.Surface_UVCoord0;
float l9_53=0.0;
float2 l9_54=l9_52;
float l9_55=l9_54.y;
l9_53=l9_55;
float4 l9_56=float4(0.0);
l9_56=mix(l9_48,l9_50,float4(l9_53));
l9_29=l9_56;
l9_38=l9_29;
}
l9_26=l9_38;
float4 l9_57=float4(0.0);
l9_57=l9_26;
float4 l9_58=float4(0.0);
float4 l9_59=float4(0.0);
float4 l9_60=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals l9_61=l9_21;
float4 l9_62;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_63=float2(0.0);
float2 l9_64=float2(0.0);
float2 l9_65=float2(0.0);
float2 l9_66=float2(0.0);
float2 l9_67=float2(0.0);
float2 l9_68=float2(0.0);
ssGlobals l9_69=l9_61;
float2 l9_70;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_71=float2(0.0);
l9_71=l9_69.Surface_UVCoord0;
l9_64=l9_71;
l9_70=l9_64;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_72=float2(0.0);
l9_72=l9_69.Surface_UVCoord1;
l9_65=l9_72;
l9_70=l9_65;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_73=float2(0.0);
float2 l9_74=float2(0.0);
float2 l9_75=float2(0.0);
ssGlobals l9_76=l9_69;
float2 l9_77;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_78=float2(0.0);
float2 l9_79=float2(0.0);
float2 l9_80=float2(0.0);
ssGlobals l9_81=l9_76;
float2 l9_82;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_83=float2(0.0);
float2 l9_84=float2(0.0);
float2 l9_85=float2(0.0);
float2 l9_86=float2(0.0);
float2 l9_87=float2(0.0);
ssGlobals l9_88=l9_81;
float2 l9_89;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_90=float2(0.0);
l9_90=l9_88.Surface_UVCoord0;
l9_84=l9_90;
l9_89=l9_84;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_91=float2(0.0);
l9_91=l9_88.Surface_UVCoord1;
l9_85=l9_91;
l9_89=l9_85;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_92=float2(0.0);
l9_92=l9_88.gScreenCoord;
l9_86=l9_92;
l9_89=l9_86;
}
else
{
float2 l9_93=float2(0.0);
l9_93=l9_88.Surface_UVCoord0;
l9_87=l9_93;
l9_89=l9_87;
}
}
}
l9_83=l9_89;
float2 l9_94=float2(0.0);
float2 l9_95=(*sc_set0.UserUniforms).uv2Scale;
l9_94=l9_95;
float2 l9_96=float2(0.0);
l9_96=l9_94;
float2 l9_97=float2(0.0);
float2 l9_98=(*sc_set0.UserUniforms).uv2Offset;
l9_97=l9_98;
float2 l9_99=float2(0.0);
l9_99=l9_97;
float2 l9_100=float2(0.0);
l9_100=(l9_83*l9_96)+l9_99;
float2 l9_101=float2(0.0);
l9_101=l9_100+(l9_99*(l9_81.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_79=l9_101;
l9_82=l9_79;
}
else
{
float2 l9_102=float2(0.0);
float2 l9_103=float2(0.0);
float2 l9_104=float2(0.0);
float2 l9_105=float2(0.0);
float2 l9_106=float2(0.0);
ssGlobals l9_107=l9_81;
float2 l9_108;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_109=float2(0.0);
l9_109=l9_107.Surface_UVCoord0;
l9_103=l9_109;
l9_108=l9_103;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_110=float2(0.0);
l9_110=l9_107.Surface_UVCoord1;
l9_104=l9_110;
l9_108=l9_104;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_111=float2(0.0);
l9_111=l9_107.gScreenCoord;
l9_105=l9_111;
l9_108=l9_105;
}
else
{
float2 l9_112=float2(0.0);
l9_112=l9_107.Surface_UVCoord0;
l9_106=l9_112;
l9_108=l9_106;
}
}
}
l9_102=l9_108;
float2 l9_113=float2(0.0);
float2 l9_114=(*sc_set0.UserUniforms).uv2Scale;
l9_113=l9_114;
float2 l9_115=float2(0.0);
l9_115=l9_113;
float2 l9_116=float2(0.0);
float2 l9_117=(*sc_set0.UserUniforms).uv2Offset;
l9_116=l9_117;
float2 l9_118=float2(0.0);
l9_118=l9_116;
float2 l9_119=float2(0.0);
l9_119=(l9_102*l9_115)+l9_118;
l9_80=l9_119;
l9_82=l9_80;
}
l9_78=l9_82;
l9_74=l9_78;
l9_77=l9_74;
}
else
{
float2 l9_120=float2(0.0);
l9_120=l9_76.Surface_UVCoord0;
l9_75=l9_120;
l9_77=l9_75;
}
l9_73=l9_77;
float2 l9_121=float2(0.0);
l9_121=l9_73;
float2 l9_122=float2(0.0);
l9_122=l9_121;
l9_66=l9_122;
l9_70=l9_66;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_123=float2(0.0);
float2 l9_124=float2(0.0);
float2 l9_125=float2(0.0);
ssGlobals l9_126=l9_69;
float2 l9_127;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_128=float2(0.0);
float2 l9_129=float2(0.0);
float2 l9_130=float2(0.0);
ssGlobals l9_131=l9_126;
float2 l9_132;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_133=float2(0.0);
float2 l9_134=float2(0.0);
float2 l9_135=float2(0.0);
float2 l9_136=float2(0.0);
float2 l9_137=float2(0.0);
float2 l9_138=float2(0.0);
ssGlobals l9_139=l9_131;
float2 l9_140;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_141=float2(0.0);
l9_141=l9_139.Surface_UVCoord0;
l9_134=l9_141;
l9_140=l9_134;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_142=float2(0.0);
l9_142=l9_139.Surface_UVCoord1;
l9_135=l9_142;
l9_140=l9_135;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_143=float2(0.0);
l9_143=l9_139.gScreenCoord;
l9_136=l9_143;
l9_140=l9_136;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_144=float2(0.0);
float2 l9_145=float2(0.0);
float2 l9_146=float2(0.0);
ssGlobals l9_147=l9_139;
float2 l9_148;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_149=float2(0.0);
float2 l9_150=float2(0.0);
float2 l9_151=float2(0.0);
ssGlobals l9_152=l9_147;
float2 l9_153;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_154=float2(0.0);
float2 l9_155=float2(0.0);
float2 l9_156=float2(0.0);
float2 l9_157=float2(0.0);
float2 l9_158=float2(0.0);
ssGlobals l9_159=l9_152;
float2 l9_160;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_161=float2(0.0);
l9_161=l9_159.Surface_UVCoord0;
l9_155=l9_161;
l9_160=l9_155;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_162=float2(0.0);
l9_162=l9_159.Surface_UVCoord1;
l9_156=l9_162;
l9_160=l9_156;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_163=float2(0.0);
l9_163=l9_159.gScreenCoord;
l9_157=l9_163;
l9_160=l9_157;
}
else
{
float2 l9_164=float2(0.0);
l9_164=l9_159.Surface_UVCoord0;
l9_158=l9_164;
l9_160=l9_158;
}
}
}
l9_154=l9_160;
float2 l9_165=float2(0.0);
float2 l9_166=(*sc_set0.UserUniforms).uv2Scale;
l9_165=l9_166;
float2 l9_167=float2(0.0);
l9_167=l9_165;
float2 l9_168=float2(0.0);
float2 l9_169=(*sc_set0.UserUniforms).uv2Offset;
l9_168=l9_169;
float2 l9_170=float2(0.0);
l9_170=l9_168;
float2 l9_171=float2(0.0);
l9_171=(l9_154*l9_167)+l9_170;
float2 l9_172=float2(0.0);
l9_172=l9_171+(l9_170*(l9_152.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_150=l9_172;
l9_153=l9_150;
}
else
{
float2 l9_173=float2(0.0);
float2 l9_174=float2(0.0);
float2 l9_175=float2(0.0);
float2 l9_176=float2(0.0);
float2 l9_177=float2(0.0);
ssGlobals l9_178=l9_152;
float2 l9_179;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_180=float2(0.0);
l9_180=l9_178.Surface_UVCoord0;
l9_174=l9_180;
l9_179=l9_174;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_181=float2(0.0);
l9_181=l9_178.Surface_UVCoord1;
l9_175=l9_181;
l9_179=l9_175;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_182=float2(0.0);
l9_182=l9_178.gScreenCoord;
l9_176=l9_182;
l9_179=l9_176;
}
else
{
float2 l9_183=float2(0.0);
l9_183=l9_178.Surface_UVCoord0;
l9_177=l9_183;
l9_179=l9_177;
}
}
}
l9_173=l9_179;
float2 l9_184=float2(0.0);
float2 l9_185=(*sc_set0.UserUniforms).uv2Scale;
l9_184=l9_185;
float2 l9_186=float2(0.0);
l9_186=l9_184;
float2 l9_187=float2(0.0);
float2 l9_188=(*sc_set0.UserUniforms).uv2Offset;
l9_187=l9_188;
float2 l9_189=float2(0.0);
l9_189=l9_187;
float2 l9_190=float2(0.0);
l9_190=(l9_173*l9_186)+l9_189;
l9_151=l9_190;
l9_153=l9_151;
}
l9_149=l9_153;
l9_145=l9_149;
l9_148=l9_145;
}
else
{
float2 l9_191=float2(0.0);
l9_191=l9_147.Surface_UVCoord0;
l9_146=l9_191;
l9_148=l9_146;
}
l9_144=l9_148;
float2 l9_192=float2(0.0);
l9_192=l9_144;
float2 l9_193=float2(0.0);
l9_193=l9_192;
l9_137=l9_193;
l9_140=l9_137;
}
else
{
float2 l9_194=float2(0.0);
l9_194=l9_139.Surface_UVCoord0;
l9_138=l9_194;
l9_140=l9_138;
}
}
}
}
l9_133=l9_140;
float2 l9_195=float2(0.0);
float2 l9_196=(*sc_set0.UserUniforms).uv3Scale;
l9_195=l9_196;
float2 l9_197=float2(0.0);
l9_197=l9_195;
float2 l9_198=float2(0.0);
float2 l9_199=(*sc_set0.UserUniforms).uv3Offset;
l9_198=l9_199;
float2 l9_200=float2(0.0);
l9_200=l9_198;
float2 l9_201=float2(0.0);
l9_201=(l9_133*l9_197)+l9_200;
float2 l9_202=float2(0.0);
l9_202=l9_201+(l9_200*(l9_131.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_129=l9_202;
l9_132=l9_129;
}
else
{
float2 l9_203=float2(0.0);
float2 l9_204=float2(0.0);
float2 l9_205=float2(0.0);
float2 l9_206=float2(0.0);
float2 l9_207=float2(0.0);
float2 l9_208=float2(0.0);
ssGlobals l9_209=l9_131;
float2 l9_210;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_211=float2(0.0);
l9_211=l9_209.Surface_UVCoord0;
l9_204=l9_211;
l9_210=l9_204;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_212=float2(0.0);
l9_212=l9_209.Surface_UVCoord1;
l9_205=l9_212;
l9_210=l9_205;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_213=float2(0.0);
l9_213=l9_209.gScreenCoord;
l9_206=l9_213;
l9_210=l9_206;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_214=float2(0.0);
float2 l9_215=float2(0.0);
float2 l9_216=float2(0.0);
ssGlobals l9_217=l9_209;
float2 l9_218;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_219=float2(0.0);
float2 l9_220=float2(0.0);
float2 l9_221=float2(0.0);
ssGlobals l9_222=l9_217;
float2 l9_223;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_224=float2(0.0);
float2 l9_225=float2(0.0);
float2 l9_226=float2(0.0);
float2 l9_227=float2(0.0);
float2 l9_228=float2(0.0);
ssGlobals l9_229=l9_222;
float2 l9_230;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_231=float2(0.0);
l9_231=l9_229.Surface_UVCoord0;
l9_225=l9_231;
l9_230=l9_225;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_232=float2(0.0);
l9_232=l9_229.Surface_UVCoord1;
l9_226=l9_232;
l9_230=l9_226;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_233=float2(0.0);
l9_233=l9_229.gScreenCoord;
l9_227=l9_233;
l9_230=l9_227;
}
else
{
float2 l9_234=float2(0.0);
l9_234=l9_229.Surface_UVCoord0;
l9_228=l9_234;
l9_230=l9_228;
}
}
}
l9_224=l9_230;
float2 l9_235=float2(0.0);
float2 l9_236=(*sc_set0.UserUniforms).uv2Scale;
l9_235=l9_236;
float2 l9_237=float2(0.0);
l9_237=l9_235;
float2 l9_238=float2(0.0);
float2 l9_239=(*sc_set0.UserUniforms).uv2Offset;
l9_238=l9_239;
float2 l9_240=float2(0.0);
l9_240=l9_238;
float2 l9_241=float2(0.0);
l9_241=(l9_224*l9_237)+l9_240;
float2 l9_242=float2(0.0);
l9_242=l9_241+(l9_240*(l9_222.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_220=l9_242;
l9_223=l9_220;
}
else
{
float2 l9_243=float2(0.0);
float2 l9_244=float2(0.0);
float2 l9_245=float2(0.0);
float2 l9_246=float2(0.0);
float2 l9_247=float2(0.0);
ssGlobals l9_248=l9_222;
float2 l9_249;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_250=float2(0.0);
l9_250=l9_248.Surface_UVCoord0;
l9_244=l9_250;
l9_249=l9_244;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_251=float2(0.0);
l9_251=l9_248.Surface_UVCoord1;
l9_245=l9_251;
l9_249=l9_245;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_252=float2(0.0);
l9_252=l9_248.gScreenCoord;
l9_246=l9_252;
l9_249=l9_246;
}
else
{
float2 l9_253=float2(0.0);
l9_253=l9_248.Surface_UVCoord0;
l9_247=l9_253;
l9_249=l9_247;
}
}
}
l9_243=l9_249;
float2 l9_254=float2(0.0);
float2 l9_255=(*sc_set0.UserUniforms).uv2Scale;
l9_254=l9_255;
float2 l9_256=float2(0.0);
l9_256=l9_254;
float2 l9_257=float2(0.0);
float2 l9_258=(*sc_set0.UserUniforms).uv2Offset;
l9_257=l9_258;
float2 l9_259=float2(0.0);
l9_259=l9_257;
float2 l9_260=float2(0.0);
l9_260=(l9_243*l9_256)+l9_259;
l9_221=l9_260;
l9_223=l9_221;
}
l9_219=l9_223;
l9_215=l9_219;
l9_218=l9_215;
}
else
{
float2 l9_261=float2(0.0);
l9_261=l9_217.Surface_UVCoord0;
l9_216=l9_261;
l9_218=l9_216;
}
l9_214=l9_218;
float2 l9_262=float2(0.0);
l9_262=l9_214;
float2 l9_263=float2(0.0);
l9_263=l9_262;
l9_207=l9_263;
l9_210=l9_207;
}
else
{
float2 l9_264=float2(0.0);
l9_264=l9_209.Surface_UVCoord0;
l9_208=l9_264;
l9_210=l9_208;
}
}
}
}
l9_203=l9_210;
float2 l9_265=float2(0.0);
float2 l9_266=(*sc_set0.UserUniforms).uv3Scale;
l9_265=l9_266;
float2 l9_267=float2(0.0);
l9_267=l9_265;
float2 l9_268=float2(0.0);
float2 l9_269=(*sc_set0.UserUniforms).uv3Offset;
l9_268=l9_269;
float2 l9_270=float2(0.0);
l9_270=l9_268;
float2 l9_271=float2(0.0);
l9_271=(l9_203*l9_267)+l9_270;
l9_130=l9_271;
l9_132=l9_130;
}
l9_128=l9_132;
l9_124=l9_128;
l9_127=l9_124;
}
else
{
float2 l9_272=float2(0.0);
l9_272=l9_126.Surface_UVCoord0;
l9_125=l9_272;
l9_127=l9_125;
}
l9_123=l9_127;
float2 l9_273=float2(0.0);
l9_273=l9_123;
float2 l9_274=float2(0.0);
l9_274=l9_273;
l9_67=l9_274;
l9_70=l9_67;
}
else
{
float2 l9_275=float2(0.0);
l9_275=l9_69.Surface_UVCoord0;
l9_68=l9_275;
l9_70=l9_68;
}
}
}
}
l9_63=l9_70;
float4 l9_276=float4(0.0);
int l9_277;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_278=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_278=0;
}
else
{
l9_278=in.varStereoViewID;
}
int l9_279=l9_278;
l9_277=1-l9_279;
}
else
{
int l9_280=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_280=0;
}
else
{
l9_280=in.varStereoViewID;
}
int l9_281=l9_280;
l9_277=l9_281;
}
int l9_282=l9_277;
int l9_283=baseTexLayout_tmp;
int l9_284=l9_282;
float2 l9_285=l9_63;
bool l9_286=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_287=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_288=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_289=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_290=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_291=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_292=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_293=0.0;
bool l9_294=l9_291&&(!l9_289);
float l9_295=1.0;
float l9_296=l9_285.x;
int l9_297=l9_288.x;
if (l9_297==1)
{
l9_296=fract(l9_296);
}
else
{
if (l9_297==2)
{
float l9_298=fract(l9_296);
float l9_299=l9_296-l9_298;
float l9_300=step(0.25,fract(l9_299*0.5));
l9_296=mix(l9_298,1.0-l9_298,fast::clamp(l9_300,0.0,1.0));
}
}
l9_285.x=l9_296;
float l9_301=l9_285.y;
int l9_302=l9_288.y;
if (l9_302==1)
{
l9_301=fract(l9_301);
}
else
{
if (l9_302==2)
{
float l9_303=fract(l9_301);
float l9_304=l9_301-l9_303;
float l9_305=step(0.25,fract(l9_304*0.5));
l9_301=mix(l9_303,1.0-l9_303,fast::clamp(l9_305,0.0,1.0));
}
}
l9_285.y=l9_301;
if (l9_289)
{
bool l9_306=l9_291;
bool l9_307;
if (l9_306)
{
l9_307=l9_288.x==3;
}
else
{
l9_307=l9_306;
}
float l9_308=l9_285.x;
float l9_309=l9_290.x;
float l9_310=l9_290.z;
bool l9_311=l9_307;
float l9_312=l9_295;
float l9_313=fast::clamp(l9_308,l9_309,l9_310);
float l9_314=step(abs(l9_308-l9_313),9.9999997e-06);
l9_312*=(l9_314+((1.0-float(l9_311))*(1.0-l9_314)));
l9_308=l9_313;
l9_285.x=l9_308;
l9_295=l9_312;
bool l9_315=l9_291;
bool l9_316;
if (l9_315)
{
l9_316=l9_288.y==3;
}
else
{
l9_316=l9_315;
}
float l9_317=l9_285.y;
float l9_318=l9_290.y;
float l9_319=l9_290.w;
bool l9_320=l9_316;
float l9_321=l9_295;
float l9_322=fast::clamp(l9_317,l9_318,l9_319);
float l9_323=step(abs(l9_317-l9_322),9.9999997e-06);
l9_321*=(l9_323+((1.0-float(l9_320))*(1.0-l9_323)));
l9_317=l9_322;
l9_285.y=l9_317;
l9_295=l9_321;
}
float2 l9_324=l9_285;
bool l9_325=l9_286;
float3x3 l9_326=l9_287;
if (l9_325)
{
l9_324=float2((l9_326*float3(l9_324,1.0)).xy);
}
float2 l9_327=l9_324;
l9_285=l9_327;
float l9_328=l9_285.x;
int l9_329=l9_288.x;
bool l9_330=l9_294;
float l9_331=l9_295;
if ((l9_329==0)||(l9_329==3))
{
float l9_332=l9_328;
float l9_333=0.0;
float l9_334=1.0;
bool l9_335=l9_330;
float l9_336=l9_331;
float l9_337=fast::clamp(l9_332,l9_333,l9_334);
float l9_338=step(abs(l9_332-l9_337),9.9999997e-06);
l9_336*=(l9_338+((1.0-float(l9_335))*(1.0-l9_338)));
l9_332=l9_337;
l9_328=l9_332;
l9_331=l9_336;
}
l9_285.x=l9_328;
l9_295=l9_331;
float l9_339=l9_285.y;
int l9_340=l9_288.y;
bool l9_341=l9_294;
float l9_342=l9_295;
if ((l9_340==0)||(l9_340==3))
{
float l9_343=l9_339;
float l9_344=0.0;
float l9_345=1.0;
bool l9_346=l9_341;
float l9_347=l9_342;
float l9_348=fast::clamp(l9_343,l9_344,l9_345);
float l9_349=step(abs(l9_343-l9_348),9.9999997e-06);
l9_347*=(l9_349+((1.0-float(l9_346))*(1.0-l9_349)));
l9_343=l9_348;
l9_339=l9_343;
l9_342=l9_347;
}
l9_285.y=l9_339;
l9_295=l9_342;
float2 l9_350=l9_285;
int l9_351=l9_283;
int l9_352=l9_284;
float l9_353=l9_293;
float2 l9_354=l9_350;
int l9_355=l9_351;
int l9_356=l9_352;
float3 l9_357=float3(0.0);
if (l9_355==0)
{
l9_357=float3(l9_354,0.0);
}
else
{
if (l9_355==1)
{
l9_357=float3(l9_354.x,(l9_354.y*0.5)+(0.5-(float(l9_356)*0.5)),0.0);
}
else
{
l9_357=float3(l9_354,float(l9_356));
}
}
float3 l9_358=l9_357;
float3 l9_359=l9_358;
float4 l9_360=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_359.xy,bias(l9_353));
float4 l9_361=l9_360;
if (l9_291)
{
l9_361=mix(l9_292,l9_361,float4(l9_295));
}
float4 l9_362=l9_361;
l9_276=l9_362;
l9_59=l9_276;
l9_62=l9_59;
}
else
{
l9_62=l9_60;
}
l9_58=l9_62;
float4 l9_363=float4(0.0);
l9_363=l9_57*l9_58;
float4 l9_364=float4(0.0);
l9_364=l9_363;
float4 l9_365=float4(0.0);
l9_365=l9_364;
float l9_366=0.0;
float l9_367=0.0;
float l9_368=0.0;
float3 l9_369=l9_365.xyz;
float l9_370=l9_369.x;
float l9_371=l9_369.y;
float l9_372=l9_369.z;
l9_366=l9_370;
l9_367=l9_371;
l9_368=l9_372;
float3 l9_373=float3(0.0);
l9_373=l9_25*float3(l9_366);
float3 l9_374=float3(0.0);
float3 l9_375=(*sc_set0.UserUniforms).recolorGreen;
l9_374=l9_375;
float3 l9_376=float3(0.0);
l9_376=l9_374;
float3 l9_377=float3(0.0);
l9_377=l9_376*float3(l9_367);
float3 l9_378=float3(0.0);
float3 l9_379=(*sc_set0.UserUniforms).recolorBlue;
l9_378=l9_379;
float3 l9_380=float3(0.0);
l9_380=l9_378;
float3 l9_381=float3(0.0);
l9_381=l9_380*float3(l9_368);
float3 l9_382=float3(0.0);
l9_382=(l9_373+l9_377)+l9_381;
l9_19=l9_382;
l9_22=l9_19;
}
else
{
float4 l9_383=float4(0.0);
float l9_384=1.0;
float4 l9_385=float4(1.0);
float4 l9_386=float4(0.0);
ssGlobals l9_387=l9_21;
float2 l9_388=float2(0.0);
l9_388=l9_387.Surface_UVCoord0;
float l9_389=0.0;
float2 l9_390=l9_388;
float l9_391=l9_390.x;
l9_389=l9_391;
float l9_392=0.0;
float l9_393=(*sc_set0.UserUniforms).Level;
l9_392=l9_393;
float l9_394=0.0;
l9_394=float(l9_389<l9_392);
l9_384=l9_394;
float4 l9_395;
if ((l9_384*1.0)!=0.0)
{
float4 l9_396=float4(0.0);
float4 l9_397=(*sc_set0.UserUniforms).innerColor1;
l9_396=l9_397;
float4 l9_398=float4(0.0);
float4 l9_399=(*sc_set0.UserUniforms).innerColor2;
l9_398=l9_399;
float2 l9_400=float2(0.0);
l9_400=l9_387.Surface_UVCoord0;
float l9_401=0.0;
float2 l9_402=l9_400;
float l9_403=l9_402.y;
l9_401=l9_403;
float4 l9_404=float4(0.0);
l9_404=mix(l9_396,l9_398,float4(l9_401));
l9_385=l9_404;
l9_395=l9_385;
}
else
{
float4 l9_405=float4(0.0);
float4 l9_406=(*sc_set0.UserUniforms).outerColor1;
l9_405=l9_406;
float4 l9_407=float4(0.0);
float4 l9_408=(*sc_set0.UserUniforms).outerColor2;
l9_407=l9_408;
float2 l9_409=float2(0.0);
l9_409=l9_387.Surface_UVCoord0;
float l9_410=0.0;
float2 l9_411=l9_409;
float l9_412=l9_411.y;
l9_410=l9_412;
float4 l9_413=float4(0.0);
l9_413=mix(l9_405,l9_407,float4(l9_410));
l9_386=l9_413;
l9_395=l9_386;
}
l9_383=l9_395;
float4 l9_414=float4(0.0);
l9_414=l9_383;
float4 l9_415=float4(0.0);
float4 l9_416=float4(0.0);
float4 l9_417=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals l9_418=l9_21;
float4 l9_419;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_420=float2(0.0);
float2 l9_421=float2(0.0);
float2 l9_422=float2(0.0);
float2 l9_423=float2(0.0);
float2 l9_424=float2(0.0);
float2 l9_425=float2(0.0);
ssGlobals l9_426=l9_418;
float2 l9_427;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_428=float2(0.0);
l9_428=l9_426.Surface_UVCoord0;
l9_421=l9_428;
l9_427=l9_421;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_429=float2(0.0);
l9_429=l9_426.Surface_UVCoord1;
l9_422=l9_429;
l9_427=l9_422;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_430=float2(0.0);
float2 l9_431=float2(0.0);
float2 l9_432=float2(0.0);
ssGlobals l9_433=l9_426;
float2 l9_434;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_435=float2(0.0);
float2 l9_436=float2(0.0);
float2 l9_437=float2(0.0);
ssGlobals l9_438=l9_433;
float2 l9_439;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_440=float2(0.0);
float2 l9_441=float2(0.0);
float2 l9_442=float2(0.0);
float2 l9_443=float2(0.0);
float2 l9_444=float2(0.0);
ssGlobals l9_445=l9_438;
float2 l9_446;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_447=float2(0.0);
l9_447=l9_445.Surface_UVCoord0;
l9_441=l9_447;
l9_446=l9_441;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_448=float2(0.0);
l9_448=l9_445.Surface_UVCoord1;
l9_442=l9_448;
l9_446=l9_442;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_449=float2(0.0);
l9_449=l9_445.gScreenCoord;
l9_443=l9_449;
l9_446=l9_443;
}
else
{
float2 l9_450=float2(0.0);
l9_450=l9_445.Surface_UVCoord0;
l9_444=l9_450;
l9_446=l9_444;
}
}
}
l9_440=l9_446;
float2 l9_451=float2(0.0);
float2 l9_452=(*sc_set0.UserUniforms).uv2Scale;
l9_451=l9_452;
float2 l9_453=float2(0.0);
l9_453=l9_451;
float2 l9_454=float2(0.0);
float2 l9_455=(*sc_set0.UserUniforms).uv2Offset;
l9_454=l9_455;
float2 l9_456=float2(0.0);
l9_456=l9_454;
float2 l9_457=float2(0.0);
l9_457=(l9_440*l9_453)+l9_456;
float2 l9_458=float2(0.0);
l9_458=l9_457+(l9_456*(l9_438.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_436=l9_458;
l9_439=l9_436;
}
else
{
float2 l9_459=float2(0.0);
float2 l9_460=float2(0.0);
float2 l9_461=float2(0.0);
float2 l9_462=float2(0.0);
float2 l9_463=float2(0.0);
ssGlobals l9_464=l9_438;
float2 l9_465;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_466=float2(0.0);
l9_466=l9_464.Surface_UVCoord0;
l9_460=l9_466;
l9_465=l9_460;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_467=float2(0.0);
l9_467=l9_464.Surface_UVCoord1;
l9_461=l9_467;
l9_465=l9_461;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_468=float2(0.0);
l9_468=l9_464.gScreenCoord;
l9_462=l9_468;
l9_465=l9_462;
}
else
{
float2 l9_469=float2(0.0);
l9_469=l9_464.Surface_UVCoord0;
l9_463=l9_469;
l9_465=l9_463;
}
}
}
l9_459=l9_465;
float2 l9_470=float2(0.0);
float2 l9_471=(*sc_set0.UserUniforms).uv2Scale;
l9_470=l9_471;
float2 l9_472=float2(0.0);
l9_472=l9_470;
float2 l9_473=float2(0.0);
float2 l9_474=(*sc_set0.UserUniforms).uv2Offset;
l9_473=l9_474;
float2 l9_475=float2(0.0);
l9_475=l9_473;
float2 l9_476=float2(0.0);
l9_476=(l9_459*l9_472)+l9_475;
l9_437=l9_476;
l9_439=l9_437;
}
l9_435=l9_439;
l9_431=l9_435;
l9_434=l9_431;
}
else
{
float2 l9_477=float2(0.0);
l9_477=l9_433.Surface_UVCoord0;
l9_432=l9_477;
l9_434=l9_432;
}
l9_430=l9_434;
float2 l9_478=float2(0.0);
l9_478=l9_430;
float2 l9_479=float2(0.0);
l9_479=l9_478;
l9_423=l9_479;
l9_427=l9_423;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_480=float2(0.0);
float2 l9_481=float2(0.0);
float2 l9_482=float2(0.0);
ssGlobals l9_483=l9_426;
float2 l9_484;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_485=float2(0.0);
float2 l9_486=float2(0.0);
float2 l9_487=float2(0.0);
ssGlobals l9_488=l9_483;
float2 l9_489;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_490=float2(0.0);
float2 l9_491=float2(0.0);
float2 l9_492=float2(0.0);
float2 l9_493=float2(0.0);
float2 l9_494=float2(0.0);
float2 l9_495=float2(0.0);
ssGlobals l9_496=l9_488;
float2 l9_497;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_498=float2(0.0);
l9_498=l9_496.Surface_UVCoord0;
l9_491=l9_498;
l9_497=l9_491;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_499=float2(0.0);
l9_499=l9_496.Surface_UVCoord1;
l9_492=l9_499;
l9_497=l9_492;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_500=float2(0.0);
l9_500=l9_496.gScreenCoord;
l9_493=l9_500;
l9_497=l9_493;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_501=float2(0.0);
float2 l9_502=float2(0.0);
float2 l9_503=float2(0.0);
ssGlobals l9_504=l9_496;
float2 l9_505;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_506=float2(0.0);
float2 l9_507=float2(0.0);
float2 l9_508=float2(0.0);
ssGlobals l9_509=l9_504;
float2 l9_510;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_511=float2(0.0);
float2 l9_512=float2(0.0);
float2 l9_513=float2(0.0);
float2 l9_514=float2(0.0);
float2 l9_515=float2(0.0);
ssGlobals l9_516=l9_509;
float2 l9_517;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_518=float2(0.0);
l9_518=l9_516.Surface_UVCoord0;
l9_512=l9_518;
l9_517=l9_512;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_519=float2(0.0);
l9_519=l9_516.Surface_UVCoord1;
l9_513=l9_519;
l9_517=l9_513;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_520=float2(0.0);
l9_520=l9_516.gScreenCoord;
l9_514=l9_520;
l9_517=l9_514;
}
else
{
float2 l9_521=float2(0.0);
l9_521=l9_516.Surface_UVCoord0;
l9_515=l9_521;
l9_517=l9_515;
}
}
}
l9_511=l9_517;
float2 l9_522=float2(0.0);
float2 l9_523=(*sc_set0.UserUniforms).uv2Scale;
l9_522=l9_523;
float2 l9_524=float2(0.0);
l9_524=l9_522;
float2 l9_525=float2(0.0);
float2 l9_526=(*sc_set0.UserUniforms).uv2Offset;
l9_525=l9_526;
float2 l9_527=float2(0.0);
l9_527=l9_525;
float2 l9_528=float2(0.0);
l9_528=(l9_511*l9_524)+l9_527;
float2 l9_529=float2(0.0);
l9_529=l9_528+(l9_527*(l9_509.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_507=l9_529;
l9_510=l9_507;
}
else
{
float2 l9_530=float2(0.0);
float2 l9_531=float2(0.0);
float2 l9_532=float2(0.0);
float2 l9_533=float2(0.0);
float2 l9_534=float2(0.0);
ssGlobals l9_535=l9_509;
float2 l9_536;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_537=float2(0.0);
l9_537=l9_535.Surface_UVCoord0;
l9_531=l9_537;
l9_536=l9_531;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_538=float2(0.0);
l9_538=l9_535.Surface_UVCoord1;
l9_532=l9_538;
l9_536=l9_532;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_539=float2(0.0);
l9_539=l9_535.gScreenCoord;
l9_533=l9_539;
l9_536=l9_533;
}
else
{
float2 l9_540=float2(0.0);
l9_540=l9_535.Surface_UVCoord0;
l9_534=l9_540;
l9_536=l9_534;
}
}
}
l9_530=l9_536;
float2 l9_541=float2(0.0);
float2 l9_542=(*sc_set0.UserUniforms).uv2Scale;
l9_541=l9_542;
float2 l9_543=float2(0.0);
l9_543=l9_541;
float2 l9_544=float2(0.0);
float2 l9_545=(*sc_set0.UserUniforms).uv2Offset;
l9_544=l9_545;
float2 l9_546=float2(0.0);
l9_546=l9_544;
float2 l9_547=float2(0.0);
l9_547=(l9_530*l9_543)+l9_546;
l9_508=l9_547;
l9_510=l9_508;
}
l9_506=l9_510;
l9_502=l9_506;
l9_505=l9_502;
}
else
{
float2 l9_548=float2(0.0);
l9_548=l9_504.Surface_UVCoord0;
l9_503=l9_548;
l9_505=l9_503;
}
l9_501=l9_505;
float2 l9_549=float2(0.0);
l9_549=l9_501;
float2 l9_550=float2(0.0);
l9_550=l9_549;
l9_494=l9_550;
l9_497=l9_494;
}
else
{
float2 l9_551=float2(0.0);
l9_551=l9_496.Surface_UVCoord0;
l9_495=l9_551;
l9_497=l9_495;
}
}
}
}
l9_490=l9_497;
float2 l9_552=float2(0.0);
float2 l9_553=(*sc_set0.UserUniforms).uv3Scale;
l9_552=l9_553;
float2 l9_554=float2(0.0);
l9_554=l9_552;
float2 l9_555=float2(0.0);
float2 l9_556=(*sc_set0.UserUniforms).uv3Offset;
l9_555=l9_556;
float2 l9_557=float2(0.0);
l9_557=l9_555;
float2 l9_558=float2(0.0);
l9_558=(l9_490*l9_554)+l9_557;
float2 l9_559=float2(0.0);
l9_559=l9_558+(l9_557*(l9_488.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_486=l9_559;
l9_489=l9_486;
}
else
{
float2 l9_560=float2(0.0);
float2 l9_561=float2(0.0);
float2 l9_562=float2(0.0);
float2 l9_563=float2(0.0);
float2 l9_564=float2(0.0);
float2 l9_565=float2(0.0);
ssGlobals l9_566=l9_488;
float2 l9_567;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_568=float2(0.0);
l9_568=l9_566.Surface_UVCoord0;
l9_561=l9_568;
l9_567=l9_561;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_569=float2(0.0);
l9_569=l9_566.Surface_UVCoord1;
l9_562=l9_569;
l9_567=l9_562;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_570=float2(0.0);
l9_570=l9_566.gScreenCoord;
l9_563=l9_570;
l9_567=l9_563;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_571=float2(0.0);
float2 l9_572=float2(0.0);
float2 l9_573=float2(0.0);
ssGlobals l9_574=l9_566;
float2 l9_575;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_576=float2(0.0);
float2 l9_577=float2(0.0);
float2 l9_578=float2(0.0);
ssGlobals l9_579=l9_574;
float2 l9_580;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_581=float2(0.0);
float2 l9_582=float2(0.0);
float2 l9_583=float2(0.0);
float2 l9_584=float2(0.0);
float2 l9_585=float2(0.0);
ssGlobals l9_586=l9_579;
float2 l9_587;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_588=float2(0.0);
l9_588=l9_586.Surface_UVCoord0;
l9_582=l9_588;
l9_587=l9_582;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_589=float2(0.0);
l9_589=l9_586.Surface_UVCoord1;
l9_583=l9_589;
l9_587=l9_583;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_590=float2(0.0);
l9_590=l9_586.gScreenCoord;
l9_584=l9_590;
l9_587=l9_584;
}
else
{
float2 l9_591=float2(0.0);
l9_591=l9_586.Surface_UVCoord0;
l9_585=l9_591;
l9_587=l9_585;
}
}
}
l9_581=l9_587;
float2 l9_592=float2(0.0);
float2 l9_593=(*sc_set0.UserUniforms).uv2Scale;
l9_592=l9_593;
float2 l9_594=float2(0.0);
l9_594=l9_592;
float2 l9_595=float2(0.0);
float2 l9_596=(*sc_set0.UserUniforms).uv2Offset;
l9_595=l9_596;
float2 l9_597=float2(0.0);
l9_597=l9_595;
float2 l9_598=float2(0.0);
l9_598=(l9_581*l9_594)+l9_597;
float2 l9_599=float2(0.0);
l9_599=l9_598+(l9_597*(l9_579.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_577=l9_599;
l9_580=l9_577;
}
else
{
float2 l9_600=float2(0.0);
float2 l9_601=float2(0.0);
float2 l9_602=float2(0.0);
float2 l9_603=float2(0.0);
float2 l9_604=float2(0.0);
ssGlobals l9_605=l9_579;
float2 l9_606;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_607=float2(0.0);
l9_607=l9_605.Surface_UVCoord0;
l9_601=l9_607;
l9_606=l9_601;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_608=float2(0.0);
l9_608=l9_605.Surface_UVCoord1;
l9_602=l9_608;
l9_606=l9_602;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_609=float2(0.0);
l9_609=l9_605.gScreenCoord;
l9_603=l9_609;
l9_606=l9_603;
}
else
{
float2 l9_610=float2(0.0);
l9_610=l9_605.Surface_UVCoord0;
l9_604=l9_610;
l9_606=l9_604;
}
}
}
l9_600=l9_606;
float2 l9_611=float2(0.0);
float2 l9_612=(*sc_set0.UserUniforms).uv2Scale;
l9_611=l9_612;
float2 l9_613=float2(0.0);
l9_613=l9_611;
float2 l9_614=float2(0.0);
float2 l9_615=(*sc_set0.UserUniforms).uv2Offset;
l9_614=l9_615;
float2 l9_616=float2(0.0);
l9_616=l9_614;
float2 l9_617=float2(0.0);
l9_617=(l9_600*l9_613)+l9_616;
l9_578=l9_617;
l9_580=l9_578;
}
l9_576=l9_580;
l9_572=l9_576;
l9_575=l9_572;
}
else
{
float2 l9_618=float2(0.0);
l9_618=l9_574.Surface_UVCoord0;
l9_573=l9_618;
l9_575=l9_573;
}
l9_571=l9_575;
float2 l9_619=float2(0.0);
l9_619=l9_571;
float2 l9_620=float2(0.0);
l9_620=l9_619;
l9_564=l9_620;
l9_567=l9_564;
}
else
{
float2 l9_621=float2(0.0);
l9_621=l9_566.Surface_UVCoord0;
l9_565=l9_621;
l9_567=l9_565;
}
}
}
}
l9_560=l9_567;
float2 l9_622=float2(0.0);
float2 l9_623=(*sc_set0.UserUniforms).uv3Scale;
l9_622=l9_623;
float2 l9_624=float2(0.0);
l9_624=l9_622;
float2 l9_625=float2(0.0);
float2 l9_626=(*sc_set0.UserUniforms).uv3Offset;
l9_625=l9_626;
float2 l9_627=float2(0.0);
l9_627=l9_625;
float2 l9_628=float2(0.0);
l9_628=(l9_560*l9_624)+l9_627;
l9_487=l9_628;
l9_489=l9_487;
}
l9_485=l9_489;
l9_481=l9_485;
l9_484=l9_481;
}
else
{
float2 l9_629=float2(0.0);
l9_629=l9_483.Surface_UVCoord0;
l9_482=l9_629;
l9_484=l9_482;
}
l9_480=l9_484;
float2 l9_630=float2(0.0);
l9_630=l9_480;
float2 l9_631=float2(0.0);
l9_631=l9_630;
l9_424=l9_631;
l9_427=l9_424;
}
else
{
float2 l9_632=float2(0.0);
l9_632=l9_426.Surface_UVCoord0;
l9_425=l9_632;
l9_427=l9_425;
}
}
}
}
l9_420=l9_427;
float4 l9_633=float4(0.0);
int l9_634;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_635=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_635=0;
}
else
{
l9_635=in.varStereoViewID;
}
int l9_636=l9_635;
l9_634=1-l9_636;
}
else
{
int l9_637=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_637=0;
}
else
{
l9_637=in.varStereoViewID;
}
int l9_638=l9_637;
l9_634=l9_638;
}
int l9_639=l9_634;
int l9_640=baseTexLayout_tmp;
int l9_641=l9_639;
float2 l9_642=l9_420;
bool l9_643=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_644=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_645=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_646=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_647=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_648=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_649=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_650=0.0;
bool l9_651=l9_648&&(!l9_646);
float l9_652=1.0;
float l9_653=l9_642.x;
int l9_654=l9_645.x;
if (l9_654==1)
{
l9_653=fract(l9_653);
}
else
{
if (l9_654==2)
{
float l9_655=fract(l9_653);
float l9_656=l9_653-l9_655;
float l9_657=step(0.25,fract(l9_656*0.5));
l9_653=mix(l9_655,1.0-l9_655,fast::clamp(l9_657,0.0,1.0));
}
}
l9_642.x=l9_653;
float l9_658=l9_642.y;
int l9_659=l9_645.y;
if (l9_659==1)
{
l9_658=fract(l9_658);
}
else
{
if (l9_659==2)
{
float l9_660=fract(l9_658);
float l9_661=l9_658-l9_660;
float l9_662=step(0.25,fract(l9_661*0.5));
l9_658=mix(l9_660,1.0-l9_660,fast::clamp(l9_662,0.0,1.0));
}
}
l9_642.y=l9_658;
if (l9_646)
{
bool l9_663=l9_648;
bool l9_664;
if (l9_663)
{
l9_664=l9_645.x==3;
}
else
{
l9_664=l9_663;
}
float l9_665=l9_642.x;
float l9_666=l9_647.x;
float l9_667=l9_647.z;
bool l9_668=l9_664;
float l9_669=l9_652;
float l9_670=fast::clamp(l9_665,l9_666,l9_667);
float l9_671=step(abs(l9_665-l9_670),9.9999997e-06);
l9_669*=(l9_671+((1.0-float(l9_668))*(1.0-l9_671)));
l9_665=l9_670;
l9_642.x=l9_665;
l9_652=l9_669;
bool l9_672=l9_648;
bool l9_673;
if (l9_672)
{
l9_673=l9_645.y==3;
}
else
{
l9_673=l9_672;
}
float l9_674=l9_642.y;
float l9_675=l9_647.y;
float l9_676=l9_647.w;
bool l9_677=l9_673;
float l9_678=l9_652;
float l9_679=fast::clamp(l9_674,l9_675,l9_676);
float l9_680=step(abs(l9_674-l9_679),9.9999997e-06);
l9_678*=(l9_680+((1.0-float(l9_677))*(1.0-l9_680)));
l9_674=l9_679;
l9_642.y=l9_674;
l9_652=l9_678;
}
float2 l9_681=l9_642;
bool l9_682=l9_643;
float3x3 l9_683=l9_644;
if (l9_682)
{
l9_681=float2((l9_683*float3(l9_681,1.0)).xy);
}
float2 l9_684=l9_681;
l9_642=l9_684;
float l9_685=l9_642.x;
int l9_686=l9_645.x;
bool l9_687=l9_651;
float l9_688=l9_652;
if ((l9_686==0)||(l9_686==3))
{
float l9_689=l9_685;
float l9_690=0.0;
float l9_691=1.0;
bool l9_692=l9_687;
float l9_693=l9_688;
float l9_694=fast::clamp(l9_689,l9_690,l9_691);
float l9_695=step(abs(l9_689-l9_694),9.9999997e-06);
l9_693*=(l9_695+((1.0-float(l9_692))*(1.0-l9_695)));
l9_689=l9_694;
l9_685=l9_689;
l9_688=l9_693;
}
l9_642.x=l9_685;
l9_652=l9_688;
float l9_696=l9_642.y;
int l9_697=l9_645.y;
bool l9_698=l9_651;
float l9_699=l9_652;
if ((l9_697==0)||(l9_697==3))
{
float l9_700=l9_696;
float l9_701=0.0;
float l9_702=1.0;
bool l9_703=l9_698;
float l9_704=l9_699;
float l9_705=fast::clamp(l9_700,l9_701,l9_702);
float l9_706=step(abs(l9_700-l9_705),9.9999997e-06);
l9_704*=(l9_706+((1.0-float(l9_703))*(1.0-l9_706)));
l9_700=l9_705;
l9_696=l9_700;
l9_699=l9_704;
}
l9_642.y=l9_696;
l9_652=l9_699;
float2 l9_707=l9_642;
int l9_708=l9_640;
int l9_709=l9_641;
float l9_710=l9_650;
float2 l9_711=l9_707;
int l9_712=l9_708;
int l9_713=l9_709;
float3 l9_714=float3(0.0);
if (l9_712==0)
{
l9_714=float3(l9_711,0.0);
}
else
{
if (l9_712==1)
{
l9_714=float3(l9_711.x,(l9_711.y*0.5)+(0.5-(float(l9_713)*0.5)),0.0);
}
else
{
l9_714=float3(l9_711,float(l9_713));
}
}
float3 l9_715=l9_714;
float3 l9_716=l9_715;
float4 l9_717=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_716.xy,bias(l9_710));
float4 l9_718=l9_717;
if (l9_648)
{
l9_718=mix(l9_649,l9_718,float4(l9_652));
}
float4 l9_719=l9_718;
l9_633=l9_719;
l9_416=l9_633;
l9_419=l9_416;
}
else
{
l9_419=l9_417;
}
l9_415=l9_419;
float4 l9_720=float4(0.0);
l9_720=l9_414*l9_415;
float4 l9_721=float4(0.0);
l9_721=l9_720;
float4 l9_722=float4(0.0);
l9_722=l9_721;
l9_20=l9_722.xyz;
l9_22=l9_20;
}
l9_18=l9_22;
float3 l9_723=float3(0.0);
l9_723=l9_18;
float3 l9_724=float3(0.0);
l9_724=l9_723;
float4 l9_725=float4(0.0);
l9_725=float4(l9_724.x,l9_724.y,l9_724.z,l9_725.w);
l9_725.w=(*sc_set0.UserUniforms).Port_Value2_N073;
float4 l9_726=float4(0.0);
l9_726=l9_17*l9_725;
param_1=l9_726;
param_3=param_1;
}
else
{
float3 l9_727=float3(0.0);
float3 l9_728=float3(0.0);
float3 l9_729=float3(0.0);
ssGlobals l9_730=param_4;
float3 l9_731;
if ((int(ENABLE_RECOLOR_tmp)!=0))
{
float3 l9_732=float3(0.0);
float3 l9_733=(*sc_set0.UserUniforms).recolorRed;
l9_732=l9_733;
float3 l9_734=float3(0.0);
l9_734=l9_732;
float4 l9_735=float4(0.0);
float l9_736=1.0;
float4 l9_737=float4(1.0);
float4 l9_738=float4(0.0);
ssGlobals l9_739=l9_730;
float2 l9_740=float2(0.0);
l9_740=l9_739.Surface_UVCoord0;
float l9_741=0.0;
float2 l9_742=l9_740;
float l9_743=l9_742.x;
l9_741=l9_743;
float l9_744=0.0;
float l9_745=(*sc_set0.UserUniforms).Level;
l9_744=l9_745;
float l9_746=0.0;
l9_746=float(l9_741<l9_744);
l9_736=l9_746;
float4 l9_747;
if ((l9_736*1.0)!=0.0)
{
float4 l9_748=float4(0.0);
float4 l9_749=(*sc_set0.UserUniforms).innerColor1;
l9_748=l9_749;
float4 l9_750=float4(0.0);
float4 l9_751=(*sc_set0.UserUniforms).innerColor2;
l9_750=l9_751;
float2 l9_752=float2(0.0);
l9_752=l9_739.Surface_UVCoord0;
float l9_753=0.0;
float2 l9_754=l9_752;
float l9_755=l9_754.y;
l9_753=l9_755;
float4 l9_756=float4(0.0);
l9_756=mix(l9_748,l9_750,float4(l9_753));
l9_737=l9_756;
l9_747=l9_737;
}
else
{
float4 l9_757=float4(0.0);
float4 l9_758=(*sc_set0.UserUniforms).outerColor1;
l9_757=l9_758;
float4 l9_759=float4(0.0);
float4 l9_760=(*sc_set0.UserUniforms).outerColor2;
l9_759=l9_760;
float2 l9_761=float2(0.0);
l9_761=l9_739.Surface_UVCoord0;
float l9_762=0.0;
float2 l9_763=l9_761;
float l9_764=l9_763.y;
l9_762=l9_764;
float4 l9_765=float4(0.0);
l9_765=mix(l9_757,l9_759,float4(l9_762));
l9_738=l9_765;
l9_747=l9_738;
}
l9_735=l9_747;
float4 l9_766=float4(0.0);
l9_766=l9_735;
float4 l9_767=float4(0.0);
float4 l9_768=float4(0.0);
float4 l9_769=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals l9_770=l9_730;
float4 l9_771;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_772=float2(0.0);
float2 l9_773=float2(0.0);
float2 l9_774=float2(0.0);
float2 l9_775=float2(0.0);
float2 l9_776=float2(0.0);
float2 l9_777=float2(0.0);
ssGlobals l9_778=l9_770;
float2 l9_779;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_780=float2(0.0);
l9_780=l9_778.Surface_UVCoord0;
l9_773=l9_780;
l9_779=l9_773;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_781=float2(0.0);
l9_781=l9_778.Surface_UVCoord1;
l9_774=l9_781;
l9_779=l9_774;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_782=float2(0.0);
float2 l9_783=float2(0.0);
float2 l9_784=float2(0.0);
ssGlobals l9_785=l9_778;
float2 l9_786;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_787=float2(0.0);
float2 l9_788=float2(0.0);
float2 l9_789=float2(0.0);
ssGlobals l9_790=l9_785;
float2 l9_791;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_792=float2(0.0);
float2 l9_793=float2(0.0);
float2 l9_794=float2(0.0);
float2 l9_795=float2(0.0);
float2 l9_796=float2(0.0);
ssGlobals l9_797=l9_790;
float2 l9_798;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_799=float2(0.0);
l9_799=l9_797.Surface_UVCoord0;
l9_793=l9_799;
l9_798=l9_793;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_800=float2(0.0);
l9_800=l9_797.Surface_UVCoord1;
l9_794=l9_800;
l9_798=l9_794;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_801=float2(0.0);
l9_801=l9_797.gScreenCoord;
l9_795=l9_801;
l9_798=l9_795;
}
else
{
float2 l9_802=float2(0.0);
l9_802=l9_797.Surface_UVCoord0;
l9_796=l9_802;
l9_798=l9_796;
}
}
}
l9_792=l9_798;
float2 l9_803=float2(0.0);
float2 l9_804=(*sc_set0.UserUniforms).uv2Scale;
l9_803=l9_804;
float2 l9_805=float2(0.0);
l9_805=l9_803;
float2 l9_806=float2(0.0);
float2 l9_807=(*sc_set0.UserUniforms).uv2Offset;
l9_806=l9_807;
float2 l9_808=float2(0.0);
l9_808=l9_806;
float2 l9_809=float2(0.0);
l9_809=(l9_792*l9_805)+l9_808;
float2 l9_810=float2(0.0);
l9_810=l9_809+(l9_808*(l9_790.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_788=l9_810;
l9_791=l9_788;
}
else
{
float2 l9_811=float2(0.0);
float2 l9_812=float2(0.0);
float2 l9_813=float2(0.0);
float2 l9_814=float2(0.0);
float2 l9_815=float2(0.0);
ssGlobals l9_816=l9_790;
float2 l9_817;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_818=float2(0.0);
l9_818=l9_816.Surface_UVCoord0;
l9_812=l9_818;
l9_817=l9_812;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_819=float2(0.0);
l9_819=l9_816.Surface_UVCoord1;
l9_813=l9_819;
l9_817=l9_813;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_820=float2(0.0);
l9_820=l9_816.gScreenCoord;
l9_814=l9_820;
l9_817=l9_814;
}
else
{
float2 l9_821=float2(0.0);
l9_821=l9_816.Surface_UVCoord0;
l9_815=l9_821;
l9_817=l9_815;
}
}
}
l9_811=l9_817;
float2 l9_822=float2(0.0);
float2 l9_823=(*sc_set0.UserUniforms).uv2Scale;
l9_822=l9_823;
float2 l9_824=float2(0.0);
l9_824=l9_822;
float2 l9_825=float2(0.0);
float2 l9_826=(*sc_set0.UserUniforms).uv2Offset;
l9_825=l9_826;
float2 l9_827=float2(0.0);
l9_827=l9_825;
float2 l9_828=float2(0.0);
l9_828=(l9_811*l9_824)+l9_827;
l9_789=l9_828;
l9_791=l9_789;
}
l9_787=l9_791;
l9_783=l9_787;
l9_786=l9_783;
}
else
{
float2 l9_829=float2(0.0);
l9_829=l9_785.Surface_UVCoord0;
l9_784=l9_829;
l9_786=l9_784;
}
l9_782=l9_786;
float2 l9_830=float2(0.0);
l9_830=l9_782;
float2 l9_831=float2(0.0);
l9_831=l9_830;
l9_775=l9_831;
l9_779=l9_775;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_832=float2(0.0);
float2 l9_833=float2(0.0);
float2 l9_834=float2(0.0);
ssGlobals l9_835=l9_778;
float2 l9_836;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_837=float2(0.0);
float2 l9_838=float2(0.0);
float2 l9_839=float2(0.0);
ssGlobals l9_840=l9_835;
float2 l9_841;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_842=float2(0.0);
float2 l9_843=float2(0.0);
float2 l9_844=float2(0.0);
float2 l9_845=float2(0.0);
float2 l9_846=float2(0.0);
float2 l9_847=float2(0.0);
ssGlobals l9_848=l9_840;
float2 l9_849;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_850=float2(0.0);
l9_850=l9_848.Surface_UVCoord0;
l9_843=l9_850;
l9_849=l9_843;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_851=float2(0.0);
l9_851=l9_848.Surface_UVCoord1;
l9_844=l9_851;
l9_849=l9_844;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_852=float2(0.0);
l9_852=l9_848.gScreenCoord;
l9_845=l9_852;
l9_849=l9_845;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_853=float2(0.0);
float2 l9_854=float2(0.0);
float2 l9_855=float2(0.0);
ssGlobals l9_856=l9_848;
float2 l9_857;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_858=float2(0.0);
float2 l9_859=float2(0.0);
float2 l9_860=float2(0.0);
ssGlobals l9_861=l9_856;
float2 l9_862;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_863=float2(0.0);
float2 l9_864=float2(0.0);
float2 l9_865=float2(0.0);
float2 l9_866=float2(0.0);
float2 l9_867=float2(0.0);
ssGlobals l9_868=l9_861;
float2 l9_869;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_870=float2(0.0);
l9_870=l9_868.Surface_UVCoord0;
l9_864=l9_870;
l9_869=l9_864;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_871=float2(0.0);
l9_871=l9_868.Surface_UVCoord1;
l9_865=l9_871;
l9_869=l9_865;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_872=float2(0.0);
l9_872=l9_868.gScreenCoord;
l9_866=l9_872;
l9_869=l9_866;
}
else
{
float2 l9_873=float2(0.0);
l9_873=l9_868.Surface_UVCoord0;
l9_867=l9_873;
l9_869=l9_867;
}
}
}
l9_863=l9_869;
float2 l9_874=float2(0.0);
float2 l9_875=(*sc_set0.UserUniforms).uv2Scale;
l9_874=l9_875;
float2 l9_876=float2(0.0);
l9_876=l9_874;
float2 l9_877=float2(0.0);
float2 l9_878=(*sc_set0.UserUniforms).uv2Offset;
l9_877=l9_878;
float2 l9_879=float2(0.0);
l9_879=l9_877;
float2 l9_880=float2(0.0);
l9_880=(l9_863*l9_876)+l9_879;
float2 l9_881=float2(0.0);
l9_881=l9_880+(l9_879*(l9_861.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_859=l9_881;
l9_862=l9_859;
}
else
{
float2 l9_882=float2(0.0);
float2 l9_883=float2(0.0);
float2 l9_884=float2(0.0);
float2 l9_885=float2(0.0);
float2 l9_886=float2(0.0);
ssGlobals l9_887=l9_861;
float2 l9_888;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_889=float2(0.0);
l9_889=l9_887.Surface_UVCoord0;
l9_883=l9_889;
l9_888=l9_883;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_890=float2(0.0);
l9_890=l9_887.Surface_UVCoord1;
l9_884=l9_890;
l9_888=l9_884;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_891=float2(0.0);
l9_891=l9_887.gScreenCoord;
l9_885=l9_891;
l9_888=l9_885;
}
else
{
float2 l9_892=float2(0.0);
l9_892=l9_887.Surface_UVCoord0;
l9_886=l9_892;
l9_888=l9_886;
}
}
}
l9_882=l9_888;
float2 l9_893=float2(0.0);
float2 l9_894=(*sc_set0.UserUniforms).uv2Scale;
l9_893=l9_894;
float2 l9_895=float2(0.0);
l9_895=l9_893;
float2 l9_896=float2(0.0);
float2 l9_897=(*sc_set0.UserUniforms).uv2Offset;
l9_896=l9_897;
float2 l9_898=float2(0.0);
l9_898=l9_896;
float2 l9_899=float2(0.0);
l9_899=(l9_882*l9_895)+l9_898;
l9_860=l9_899;
l9_862=l9_860;
}
l9_858=l9_862;
l9_854=l9_858;
l9_857=l9_854;
}
else
{
float2 l9_900=float2(0.0);
l9_900=l9_856.Surface_UVCoord0;
l9_855=l9_900;
l9_857=l9_855;
}
l9_853=l9_857;
float2 l9_901=float2(0.0);
l9_901=l9_853;
float2 l9_902=float2(0.0);
l9_902=l9_901;
l9_846=l9_902;
l9_849=l9_846;
}
else
{
float2 l9_903=float2(0.0);
l9_903=l9_848.Surface_UVCoord0;
l9_847=l9_903;
l9_849=l9_847;
}
}
}
}
l9_842=l9_849;
float2 l9_904=float2(0.0);
float2 l9_905=(*sc_set0.UserUniforms).uv3Scale;
l9_904=l9_905;
float2 l9_906=float2(0.0);
l9_906=l9_904;
float2 l9_907=float2(0.0);
float2 l9_908=(*sc_set0.UserUniforms).uv3Offset;
l9_907=l9_908;
float2 l9_909=float2(0.0);
l9_909=l9_907;
float2 l9_910=float2(0.0);
l9_910=(l9_842*l9_906)+l9_909;
float2 l9_911=float2(0.0);
l9_911=l9_910+(l9_909*(l9_840.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_838=l9_911;
l9_841=l9_838;
}
else
{
float2 l9_912=float2(0.0);
float2 l9_913=float2(0.0);
float2 l9_914=float2(0.0);
float2 l9_915=float2(0.0);
float2 l9_916=float2(0.0);
float2 l9_917=float2(0.0);
ssGlobals l9_918=l9_840;
float2 l9_919;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_920=float2(0.0);
l9_920=l9_918.Surface_UVCoord0;
l9_913=l9_920;
l9_919=l9_913;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_921=float2(0.0);
l9_921=l9_918.Surface_UVCoord1;
l9_914=l9_921;
l9_919=l9_914;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_922=float2(0.0);
l9_922=l9_918.gScreenCoord;
l9_915=l9_922;
l9_919=l9_915;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_923=float2(0.0);
float2 l9_924=float2(0.0);
float2 l9_925=float2(0.0);
ssGlobals l9_926=l9_918;
float2 l9_927;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_928=float2(0.0);
float2 l9_929=float2(0.0);
float2 l9_930=float2(0.0);
ssGlobals l9_931=l9_926;
float2 l9_932;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_933=float2(0.0);
float2 l9_934=float2(0.0);
float2 l9_935=float2(0.0);
float2 l9_936=float2(0.0);
float2 l9_937=float2(0.0);
ssGlobals l9_938=l9_931;
float2 l9_939;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_940=float2(0.0);
l9_940=l9_938.Surface_UVCoord0;
l9_934=l9_940;
l9_939=l9_934;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_941=float2(0.0);
l9_941=l9_938.Surface_UVCoord1;
l9_935=l9_941;
l9_939=l9_935;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_942=float2(0.0);
l9_942=l9_938.gScreenCoord;
l9_936=l9_942;
l9_939=l9_936;
}
else
{
float2 l9_943=float2(0.0);
l9_943=l9_938.Surface_UVCoord0;
l9_937=l9_943;
l9_939=l9_937;
}
}
}
l9_933=l9_939;
float2 l9_944=float2(0.0);
float2 l9_945=(*sc_set0.UserUniforms).uv2Scale;
l9_944=l9_945;
float2 l9_946=float2(0.0);
l9_946=l9_944;
float2 l9_947=float2(0.0);
float2 l9_948=(*sc_set0.UserUniforms).uv2Offset;
l9_947=l9_948;
float2 l9_949=float2(0.0);
l9_949=l9_947;
float2 l9_950=float2(0.0);
l9_950=(l9_933*l9_946)+l9_949;
float2 l9_951=float2(0.0);
l9_951=l9_950+(l9_949*(l9_931.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_929=l9_951;
l9_932=l9_929;
}
else
{
float2 l9_952=float2(0.0);
float2 l9_953=float2(0.0);
float2 l9_954=float2(0.0);
float2 l9_955=float2(0.0);
float2 l9_956=float2(0.0);
ssGlobals l9_957=l9_931;
float2 l9_958;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_959=float2(0.0);
l9_959=l9_957.Surface_UVCoord0;
l9_953=l9_959;
l9_958=l9_953;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_960=float2(0.0);
l9_960=l9_957.Surface_UVCoord1;
l9_954=l9_960;
l9_958=l9_954;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_961=float2(0.0);
l9_961=l9_957.gScreenCoord;
l9_955=l9_961;
l9_958=l9_955;
}
else
{
float2 l9_962=float2(0.0);
l9_962=l9_957.Surface_UVCoord0;
l9_956=l9_962;
l9_958=l9_956;
}
}
}
l9_952=l9_958;
float2 l9_963=float2(0.0);
float2 l9_964=(*sc_set0.UserUniforms).uv2Scale;
l9_963=l9_964;
float2 l9_965=float2(0.0);
l9_965=l9_963;
float2 l9_966=float2(0.0);
float2 l9_967=(*sc_set0.UserUniforms).uv2Offset;
l9_966=l9_967;
float2 l9_968=float2(0.0);
l9_968=l9_966;
float2 l9_969=float2(0.0);
l9_969=(l9_952*l9_965)+l9_968;
l9_930=l9_969;
l9_932=l9_930;
}
l9_928=l9_932;
l9_924=l9_928;
l9_927=l9_924;
}
else
{
float2 l9_970=float2(0.0);
l9_970=l9_926.Surface_UVCoord0;
l9_925=l9_970;
l9_927=l9_925;
}
l9_923=l9_927;
float2 l9_971=float2(0.0);
l9_971=l9_923;
float2 l9_972=float2(0.0);
l9_972=l9_971;
l9_916=l9_972;
l9_919=l9_916;
}
else
{
float2 l9_973=float2(0.0);
l9_973=l9_918.Surface_UVCoord0;
l9_917=l9_973;
l9_919=l9_917;
}
}
}
}
l9_912=l9_919;
float2 l9_974=float2(0.0);
float2 l9_975=(*sc_set0.UserUniforms).uv3Scale;
l9_974=l9_975;
float2 l9_976=float2(0.0);
l9_976=l9_974;
float2 l9_977=float2(0.0);
float2 l9_978=(*sc_set0.UserUniforms).uv3Offset;
l9_977=l9_978;
float2 l9_979=float2(0.0);
l9_979=l9_977;
float2 l9_980=float2(0.0);
l9_980=(l9_912*l9_976)+l9_979;
l9_839=l9_980;
l9_841=l9_839;
}
l9_837=l9_841;
l9_833=l9_837;
l9_836=l9_833;
}
else
{
float2 l9_981=float2(0.0);
l9_981=l9_835.Surface_UVCoord0;
l9_834=l9_981;
l9_836=l9_834;
}
l9_832=l9_836;
float2 l9_982=float2(0.0);
l9_982=l9_832;
float2 l9_983=float2(0.0);
l9_983=l9_982;
l9_776=l9_983;
l9_779=l9_776;
}
else
{
float2 l9_984=float2(0.0);
l9_984=l9_778.Surface_UVCoord0;
l9_777=l9_984;
l9_779=l9_777;
}
}
}
}
l9_772=l9_779;
float4 l9_985=float4(0.0);
int l9_986;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_987=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_987=0;
}
else
{
l9_987=in.varStereoViewID;
}
int l9_988=l9_987;
l9_986=1-l9_988;
}
else
{
int l9_989=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_989=0;
}
else
{
l9_989=in.varStereoViewID;
}
int l9_990=l9_989;
l9_986=l9_990;
}
int l9_991=l9_986;
int l9_992=baseTexLayout_tmp;
int l9_993=l9_991;
float2 l9_994=l9_772;
bool l9_995=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_996=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_997=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_998=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_999=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_1000=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_1001=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_1002=0.0;
bool l9_1003=l9_1000&&(!l9_998);
float l9_1004=1.0;
float l9_1005=l9_994.x;
int l9_1006=l9_997.x;
if (l9_1006==1)
{
l9_1005=fract(l9_1005);
}
else
{
if (l9_1006==2)
{
float l9_1007=fract(l9_1005);
float l9_1008=l9_1005-l9_1007;
float l9_1009=step(0.25,fract(l9_1008*0.5));
l9_1005=mix(l9_1007,1.0-l9_1007,fast::clamp(l9_1009,0.0,1.0));
}
}
l9_994.x=l9_1005;
float l9_1010=l9_994.y;
int l9_1011=l9_997.y;
if (l9_1011==1)
{
l9_1010=fract(l9_1010);
}
else
{
if (l9_1011==2)
{
float l9_1012=fract(l9_1010);
float l9_1013=l9_1010-l9_1012;
float l9_1014=step(0.25,fract(l9_1013*0.5));
l9_1010=mix(l9_1012,1.0-l9_1012,fast::clamp(l9_1014,0.0,1.0));
}
}
l9_994.y=l9_1010;
if (l9_998)
{
bool l9_1015=l9_1000;
bool l9_1016;
if (l9_1015)
{
l9_1016=l9_997.x==3;
}
else
{
l9_1016=l9_1015;
}
float l9_1017=l9_994.x;
float l9_1018=l9_999.x;
float l9_1019=l9_999.z;
bool l9_1020=l9_1016;
float l9_1021=l9_1004;
float l9_1022=fast::clamp(l9_1017,l9_1018,l9_1019);
float l9_1023=step(abs(l9_1017-l9_1022),9.9999997e-06);
l9_1021*=(l9_1023+((1.0-float(l9_1020))*(1.0-l9_1023)));
l9_1017=l9_1022;
l9_994.x=l9_1017;
l9_1004=l9_1021;
bool l9_1024=l9_1000;
bool l9_1025;
if (l9_1024)
{
l9_1025=l9_997.y==3;
}
else
{
l9_1025=l9_1024;
}
float l9_1026=l9_994.y;
float l9_1027=l9_999.y;
float l9_1028=l9_999.w;
bool l9_1029=l9_1025;
float l9_1030=l9_1004;
float l9_1031=fast::clamp(l9_1026,l9_1027,l9_1028);
float l9_1032=step(abs(l9_1026-l9_1031),9.9999997e-06);
l9_1030*=(l9_1032+((1.0-float(l9_1029))*(1.0-l9_1032)));
l9_1026=l9_1031;
l9_994.y=l9_1026;
l9_1004=l9_1030;
}
float2 l9_1033=l9_994;
bool l9_1034=l9_995;
float3x3 l9_1035=l9_996;
if (l9_1034)
{
l9_1033=float2((l9_1035*float3(l9_1033,1.0)).xy);
}
float2 l9_1036=l9_1033;
l9_994=l9_1036;
float l9_1037=l9_994.x;
int l9_1038=l9_997.x;
bool l9_1039=l9_1003;
float l9_1040=l9_1004;
if ((l9_1038==0)||(l9_1038==3))
{
float l9_1041=l9_1037;
float l9_1042=0.0;
float l9_1043=1.0;
bool l9_1044=l9_1039;
float l9_1045=l9_1040;
float l9_1046=fast::clamp(l9_1041,l9_1042,l9_1043);
float l9_1047=step(abs(l9_1041-l9_1046),9.9999997e-06);
l9_1045*=(l9_1047+((1.0-float(l9_1044))*(1.0-l9_1047)));
l9_1041=l9_1046;
l9_1037=l9_1041;
l9_1040=l9_1045;
}
l9_994.x=l9_1037;
l9_1004=l9_1040;
float l9_1048=l9_994.y;
int l9_1049=l9_997.y;
bool l9_1050=l9_1003;
float l9_1051=l9_1004;
if ((l9_1049==0)||(l9_1049==3))
{
float l9_1052=l9_1048;
float l9_1053=0.0;
float l9_1054=1.0;
bool l9_1055=l9_1050;
float l9_1056=l9_1051;
float l9_1057=fast::clamp(l9_1052,l9_1053,l9_1054);
float l9_1058=step(abs(l9_1052-l9_1057),9.9999997e-06);
l9_1056*=(l9_1058+((1.0-float(l9_1055))*(1.0-l9_1058)));
l9_1052=l9_1057;
l9_1048=l9_1052;
l9_1051=l9_1056;
}
l9_994.y=l9_1048;
l9_1004=l9_1051;
float2 l9_1059=l9_994;
int l9_1060=l9_992;
int l9_1061=l9_993;
float l9_1062=l9_1002;
float2 l9_1063=l9_1059;
int l9_1064=l9_1060;
int l9_1065=l9_1061;
float3 l9_1066=float3(0.0);
if (l9_1064==0)
{
l9_1066=float3(l9_1063,0.0);
}
else
{
if (l9_1064==1)
{
l9_1066=float3(l9_1063.x,(l9_1063.y*0.5)+(0.5-(float(l9_1065)*0.5)),0.0);
}
else
{
l9_1066=float3(l9_1063,float(l9_1065));
}
}
float3 l9_1067=l9_1066;
float3 l9_1068=l9_1067;
float4 l9_1069=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_1068.xy,bias(l9_1062));
float4 l9_1070=l9_1069;
if (l9_1000)
{
l9_1070=mix(l9_1001,l9_1070,float4(l9_1004));
}
float4 l9_1071=l9_1070;
l9_985=l9_1071;
l9_768=l9_985;
l9_771=l9_768;
}
else
{
l9_771=l9_769;
}
l9_767=l9_771;
float4 l9_1072=float4(0.0);
l9_1072=l9_766*l9_767;
float4 l9_1073=float4(0.0);
l9_1073=l9_1072;
float4 l9_1074=float4(0.0);
l9_1074=l9_1073;
float l9_1075=0.0;
float l9_1076=0.0;
float l9_1077=0.0;
float3 l9_1078=l9_1074.xyz;
float l9_1079=l9_1078.x;
float l9_1080=l9_1078.y;
float l9_1081=l9_1078.z;
l9_1075=l9_1079;
l9_1076=l9_1080;
l9_1077=l9_1081;
float3 l9_1082=float3(0.0);
l9_1082=l9_734*float3(l9_1075);
float3 l9_1083=float3(0.0);
float3 l9_1084=(*sc_set0.UserUniforms).recolorGreen;
l9_1083=l9_1084;
float3 l9_1085=float3(0.0);
l9_1085=l9_1083;
float3 l9_1086=float3(0.0);
l9_1086=l9_1085*float3(l9_1076);
float3 l9_1087=float3(0.0);
float3 l9_1088=(*sc_set0.UserUniforms).recolorBlue;
l9_1087=l9_1088;
float3 l9_1089=float3(0.0);
l9_1089=l9_1087;
float3 l9_1090=float3(0.0);
l9_1090=l9_1089*float3(l9_1077);
float3 l9_1091=float3(0.0);
l9_1091=(l9_1082+l9_1086)+l9_1090;
l9_728=l9_1091;
l9_731=l9_728;
}
else
{
float4 l9_1092=float4(0.0);
float l9_1093=1.0;
float4 l9_1094=float4(1.0);
float4 l9_1095=float4(0.0);
ssGlobals l9_1096=l9_730;
float2 l9_1097=float2(0.0);
l9_1097=l9_1096.Surface_UVCoord0;
float l9_1098=0.0;
float2 l9_1099=l9_1097;
float l9_1100=l9_1099.x;
l9_1098=l9_1100;
float l9_1101=0.0;
float l9_1102=(*sc_set0.UserUniforms).Level;
l9_1101=l9_1102;
float l9_1103=0.0;
l9_1103=float(l9_1098<l9_1101);
l9_1093=l9_1103;
float4 l9_1104;
if ((l9_1093*1.0)!=0.0)
{
float4 l9_1105=float4(0.0);
float4 l9_1106=(*sc_set0.UserUniforms).innerColor1;
l9_1105=l9_1106;
float4 l9_1107=float4(0.0);
float4 l9_1108=(*sc_set0.UserUniforms).innerColor2;
l9_1107=l9_1108;
float2 l9_1109=float2(0.0);
l9_1109=l9_1096.Surface_UVCoord0;
float l9_1110=0.0;
float2 l9_1111=l9_1109;
float l9_1112=l9_1111.y;
l9_1110=l9_1112;
float4 l9_1113=float4(0.0);
l9_1113=mix(l9_1105,l9_1107,float4(l9_1110));
l9_1094=l9_1113;
l9_1104=l9_1094;
}
else
{
float4 l9_1114=float4(0.0);
float4 l9_1115=(*sc_set0.UserUniforms).outerColor1;
l9_1114=l9_1115;
float4 l9_1116=float4(0.0);
float4 l9_1117=(*sc_set0.UserUniforms).outerColor2;
l9_1116=l9_1117;
float2 l9_1118=float2(0.0);
l9_1118=l9_1096.Surface_UVCoord0;
float l9_1119=0.0;
float2 l9_1120=l9_1118;
float l9_1121=l9_1120.y;
l9_1119=l9_1121;
float4 l9_1122=float4(0.0);
l9_1122=mix(l9_1114,l9_1116,float4(l9_1119));
l9_1095=l9_1122;
l9_1104=l9_1095;
}
l9_1092=l9_1104;
float4 l9_1123=float4(0.0);
l9_1123=l9_1092;
float4 l9_1124=float4(0.0);
float4 l9_1125=float4(0.0);
float4 l9_1126=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals l9_1127=l9_730;
float4 l9_1128;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_1129=float2(0.0);
float2 l9_1130=float2(0.0);
float2 l9_1131=float2(0.0);
float2 l9_1132=float2(0.0);
float2 l9_1133=float2(0.0);
float2 l9_1134=float2(0.0);
ssGlobals l9_1135=l9_1127;
float2 l9_1136;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_1137=float2(0.0);
l9_1137=l9_1135.Surface_UVCoord0;
l9_1130=l9_1137;
l9_1136=l9_1130;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_1138=float2(0.0);
l9_1138=l9_1135.Surface_UVCoord1;
l9_1131=l9_1138;
l9_1136=l9_1131;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_1139=float2(0.0);
float2 l9_1140=float2(0.0);
float2 l9_1141=float2(0.0);
ssGlobals l9_1142=l9_1135;
float2 l9_1143;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1144=float2(0.0);
float2 l9_1145=float2(0.0);
float2 l9_1146=float2(0.0);
ssGlobals l9_1147=l9_1142;
float2 l9_1148;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1149=float2(0.0);
float2 l9_1150=float2(0.0);
float2 l9_1151=float2(0.0);
float2 l9_1152=float2(0.0);
float2 l9_1153=float2(0.0);
ssGlobals l9_1154=l9_1147;
float2 l9_1155;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1156=float2(0.0);
l9_1156=l9_1154.Surface_UVCoord0;
l9_1150=l9_1156;
l9_1155=l9_1150;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1157=float2(0.0);
l9_1157=l9_1154.Surface_UVCoord1;
l9_1151=l9_1157;
l9_1155=l9_1151;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1158=float2(0.0);
l9_1158=l9_1154.gScreenCoord;
l9_1152=l9_1158;
l9_1155=l9_1152;
}
else
{
float2 l9_1159=float2(0.0);
l9_1159=l9_1154.Surface_UVCoord0;
l9_1153=l9_1159;
l9_1155=l9_1153;
}
}
}
l9_1149=l9_1155;
float2 l9_1160=float2(0.0);
float2 l9_1161=(*sc_set0.UserUniforms).uv2Scale;
l9_1160=l9_1161;
float2 l9_1162=float2(0.0);
l9_1162=l9_1160;
float2 l9_1163=float2(0.0);
float2 l9_1164=(*sc_set0.UserUniforms).uv2Offset;
l9_1163=l9_1164;
float2 l9_1165=float2(0.0);
l9_1165=l9_1163;
float2 l9_1166=float2(0.0);
l9_1166=(l9_1149*l9_1162)+l9_1165;
float2 l9_1167=float2(0.0);
l9_1167=l9_1166+(l9_1165*(l9_1147.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1145=l9_1167;
l9_1148=l9_1145;
}
else
{
float2 l9_1168=float2(0.0);
float2 l9_1169=float2(0.0);
float2 l9_1170=float2(0.0);
float2 l9_1171=float2(0.0);
float2 l9_1172=float2(0.0);
ssGlobals l9_1173=l9_1147;
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
l9_1146=l9_1185;
l9_1148=l9_1146;
}
l9_1144=l9_1148;
l9_1140=l9_1144;
l9_1143=l9_1140;
}
else
{
float2 l9_1186=float2(0.0);
l9_1186=l9_1142.Surface_UVCoord0;
l9_1141=l9_1186;
l9_1143=l9_1141;
}
l9_1139=l9_1143;
float2 l9_1187=float2(0.0);
l9_1187=l9_1139;
float2 l9_1188=float2(0.0);
l9_1188=l9_1187;
l9_1132=l9_1188;
l9_1136=l9_1132;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_1189=float2(0.0);
float2 l9_1190=float2(0.0);
float2 l9_1191=float2(0.0);
ssGlobals l9_1192=l9_1135;
float2 l9_1193;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_1194=float2(0.0);
float2 l9_1195=float2(0.0);
float2 l9_1196=float2(0.0);
ssGlobals l9_1197=l9_1192;
float2 l9_1198;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_1199=float2(0.0);
float2 l9_1200=float2(0.0);
float2 l9_1201=float2(0.0);
float2 l9_1202=float2(0.0);
float2 l9_1203=float2(0.0);
float2 l9_1204=float2(0.0);
ssGlobals l9_1205=l9_1197;
float2 l9_1206;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1207=float2(0.0);
l9_1207=l9_1205.Surface_UVCoord0;
l9_1200=l9_1207;
l9_1206=l9_1200;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1208=float2(0.0);
l9_1208=l9_1205.Surface_UVCoord1;
l9_1201=l9_1208;
l9_1206=l9_1201;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1209=float2(0.0);
l9_1209=l9_1205.gScreenCoord;
l9_1202=l9_1209;
l9_1206=l9_1202;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1210=float2(0.0);
float2 l9_1211=float2(0.0);
float2 l9_1212=float2(0.0);
ssGlobals l9_1213=l9_1205;
float2 l9_1214;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1215=float2(0.0);
float2 l9_1216=float2(0.0);
float2 l9_1217=float2(0.0);
ssGlobals l9_1218=l9_1213;
float2 l9_1219;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1220=float2(0.0);
float2 l9_1221=float2(0.0);
float2 l9_1222=float2(0.0);
float2 l9_1223=float2(0.0);
float2 l9_1224=float2(0.0);
ssGlobals l9_1225=l9_1218;
float2 l9_1226;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1227=float2(0.0);
l9_1227=l9_1225.Surface_UVCoord0;
l9_1221=l9_1227;
l9_1226=l9_1221;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1228=float2(0.0);
l9_1228=l9_1225.Surface_UVCoord1;
l9_1222=l9_1228;
l9_1226=l9_1222;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1229=float2(0.0);
l9_1229=l9_1225.gScreenCoord;
l9_1223=l9_1229;
l9_1226=l9_1223;
}
else
{
float2 l9_1230=float2(0.0);
l9_1230=l9_1225.Surface_UVCoord0;
l9_1224=l9_1230;
l9_1226=l9_1224;
}
}
}
l9_1220=l9_1226;
float2 l9_1231=float2(0.0);
float2 l9_1232=(*sc_set0.UserUniforms).uv2Scale;
l9_1231=l9_1232;
float2 l9_1233=float2(0.0);
l9_1233=l9_1231;
float2 l9_1234=float2(0.0);
float2 l9_1235=(*sc_set0.UserUniforms).uv2Offset;
l9_1234=l9_1235;
float2 l9_1236=float2(0.0);
l9_1236=l9_1234;
float2 l9_1237=float2(0.0);
l9_1237=(l9_1220*l9_1233)+l9_1236;
float2 l9_1238=float2(0.0);
l9_1238=l9_1237+(l9_1236*(l9_1218.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1216=l9_1238;
l9_1219=l9_1216;
}
else
{
float2 l9_1239=float2(0.0);
float2 l9_1240=float2(0.0);
float2 l9_1241=float2(0.0);
float2 l9_1242=float2(0.0);
float2 l9_1243=float2(0.0);
ssGlobals l9_1244=l9_1218;
float2 l9_1245;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1246=float2(0.0);
l9_1246=l9_1244.Surface_UVCoord0;
l9_1240=l9_1246;
l9_1245=l9_1240;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1247=float2(0.0);
l9_1247=l9_1244.Surface_UVCoord1;
l9_1241=l9_1247;
l9_1245=l9_1241;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1248=float2(0.0);
l9_1248=l9_1244.gScreenCoord;
l9_1242=l9_1248;
l9_1245=l9_1242;
}
else
{
float2 l9_1249=float2(0.0);
l9_1249=l9_1244.Surface_UVCoord0;
l9_1243=l9_1249;
l9_1245=l9_1243;
}
}
}
l9_1239=l9_1245;
float2 l9_1250=float2(0.0);
float2 l9_1251=(*sc_set0.UserUniforms).uv2Scale;
l9_1250=l9_1251;
float2 l9_1252=float2(0.0);
l9_1252=l9_1250;
float2 l9_1253=float2(0.0);
float2 l9_1254=(*sc_set0.UserUniforms).uv2Offset;
l9_1253=l9_1254;
float2 l9_1255=float2(0.0);
l9_1255=l9_1253;
float2 l9_1256=float2(0.0);
l9_1256=(l9_1239*l9_1252)+l9_1255;
l9_1217=l9_1256;
l9_1219=l9_1217;
}
l9_1215=l9_1219;
l9_1211=l9_1215;
l9_1214=l9_1211;
}
else
{
float2 l9_1257=float2(0.0);
l9_1257=l9_1213.Surface_UVCoord0;
l9_1212=l9_1257;
l9_1214=l9_1212;
}
l9_1210=l9_1214;
float2 l9_1258=float2(0.0);
l9_1258=l9_1210;
float2 l9_1259=float2(0.0);
l9_1259=l9_1258;
l9_1203=l9_1259;
l9_1206=l9_1203;
}
else
{
float2 l9_1260=float2(0.0);
l9_1260=l9_1205.Surface_UVCoord0;
l9_1204=l9_1260;
l9_1206=l9_1204;
}
}
}
}
l9_1199=l9_1206;
float2 l9_1261=float2(0.0);
float2 l9_1262=(*sc_set0.UserUniforms).uv3Scale;
l9_1261=l9_1262;
float2 l9_1263=float2(0.0);
l9_1263=l9_1261;
float2 l9_1264=float2(0.0);
float2 l9_1265=(*sc_set0.UserUniforms).uv3Offset;
l9_1264=l9_1265;
float2 l9_1266=float2(0.0);
l9_1266=l9_1264;
float2 l9_1267=float2(0.0);
l9_1267=(l9_1199*l9_1263)+l9_1266;
float2 l9_1268=float2(0.0);
l9_1268=l9_1267+(l9_1266*(l9_1197.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_1195=l9_1268;
l9_1198=l9_1195;
}
else
{
float2 l9_1269=float2(0.0);
float2 l9_1270=float2(0.0);
float2 l9_1271=float2(0.0);
float2 l9_1272=float2(0.0);
float2 l9_1273=float2(0.0);
float2 l9_1274=float2(0.0);
ssGlobals l9_1275=l9_1197;
float2 l9_1276;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1277=float2(0.0);
l9_1277=l9_1275.Surface_UVCoord0;
l9_1270=l9_1277;
l9_1276=l9_1270;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1278=float2(0.0);
l9_1278=l9_1275.Surface_UVCoord1;
l9_1271=l9_1278;
l9_1276=l9_1271;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1279=float2(0.0);
l9_1279=l9_1275.gScreenCoord;
l9_1272=l9_1279;
l9_1276=l9_1272;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1280=float2(0.0);
float2 l9_1281=float2(0.0);
float2 l9_1282=float2(0.0);
ssGlobals l9_1283=l9_1275;
float2 l9_1284;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1285=float2(0.0);
float2 l9_1286=float2(0.0);
float2 l9_1287=float2(0.0);
ssGlobals l9_1288=l9_1283;
float2 l9_1289;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1290=float2(0.0);
float2 l9_1291=float2(0.0);
float2 l9_1292=float2(0.0);
float2 l9_1293=float2(0.0);
float2 l9_1294=float2(0.0);
ssGlobals l9_1295=l9_1288;
float2 l9_1296;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1297=float2(0.0);
l9_1297=l9_1295.Surface_UVCoord0;
l9_1291=l9_1297;
l9_1296=l9_1291;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1298=float2(0.0);
l9_1298=l9_1295.Surface_UVCoord1;
l9_1292=l9_1298;
l9_1296=l9_1292;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1299=float2(0.0);
l9_1299=l9_1295.gScreenCoord;
l9_1293=l9_1299;
l9_1296=l9_1293;
}
else
{
float2 l9_1300=float2(0.0);
l9_1300=l9_1295.Surface_UVCoord0;
l9_1294=l9_1300;
l9_1296=l9_1294;
}
}
}
l9_1290=l9_1296;
float2 l9_1301=float2(0.0);
float2 l9_1302=(*sc_set0.UserUniforms).uv2Scale;
l9_1301=l9_1302;
float2 l9_1303=float2(0.0);
l9_1303=l9_1301;
float2 l9_1304=float2(0.0);
float2 l9_1305=(*sc_set0.UserUniforms).uv2Offset;
l9_1304=l9_1305;
float2 l9_1306=float2(0.0);
l9_1306=l9_1304;
float2 l9_1307=float2(0.0);
l9_1307=(l9_1290*l9_1303)+l9_1306;
float2 l9_1308=float2(0.0);
l9_1308=l9_1307+(l9_1306*(l9_1288.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1286=l9_1308;
l9_1289=l9_1286;
}
else
{
float2 l9_1309=float2(0.0);
float2 l9_1310=float2(0.0);
float2 l9_1311=float2(0.0);
float2 l9_1312=float2(0.0);
float2 l9_1313=float2(0.0);
ssGlobals l9_1314=l9_1288;
float2 l9_1315;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1316=float2(0.0);
l9_1316=l9_1314.Surface_UVCoord0;
l9_1310=l9_1316;
l9_1315=l9_1310;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1317=float2(0.0);
l9_1317=l9_1314.Surface_UVCoord1;
l9_1311=l9_1317;
l9_1315=l9_1311;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1318=float2(0.0);
l9_1318=l9_1314.gScreenCoord;
l9_1312=l9_1318;
l9_1315=l9_1312;
}
else
{
float2 l9_1319=float2(0.0);
l9_1319=l9_1314.Surface_UVCoord0;
l9_1313=l9_1319;
l9_1315=l9_1313;
}
}
}
l9_1309=l9_1315;
float2 l9_1320=float2(0.0);
float2 l9_1321=(*sc_set0.UserUniforms).uv2Scale;
l9_1320=l9_1321;
float2 l9_1322=float2(0.0);
l9_1322=l9_1320;
float2 l9_1323=float2(0.0);
float2 l9_1324=(*sc_set0.UserUniforms).uv2Offset;
l9_1323=l9_1324;
float2 l9_1325=float2(0.0);
l9_1325=l9_1323;
float2 l9_1326=float2(0.0);
l9_1326=(l9_1309*l9_1322)+l9_1325;
l9_1287=l9_1326;
l9_1289=l9_1287;
}
l9_1285=l9_1289;
l9_1281=l9_1285;
l9_1284=l9_1281;
}
else
{
float2 l9_1327=float2(0.0);
l9_1327=l9_1283.Surface_UVCoord0;
l9_1282=l9_1327;
l9_1284=l9_1282;
}
l9_1280=l9_1284;
float2 l9_1328=float2(0.0);
l9_1328=l9_1280;
float2 l9_1329=float2(0.0);
l9_1329=l9_1328;
l9_1273=l9_1329;
l9_1276=l9_1273;
}
else
{
float2 l9_1330=float2(0.0);
l9_1330=l9_1275.Surface_UVCoord0;
l9_1274=l9_1330;
l9_1276=l9_1274;
}
}
}
}
l9_1269=l9_1276;
float2 l9_1331=float2(0.0);
float2 l9_1332=(*sc_set0.UserUniforms).uv3Scale;
l9_1331=l9_1332;
float2 l9_1333=float2(0.0);
l9_1333=l9_1331;
float2 l9_1334=float2(0.0);
float2 l9_1335=(*sc_set0.UserUniforms).uv3Offset;
l9_1334=l9_1335;
float2 l9_1336=float2(0.0);
l9_1336=l9_1334;
float2 l9_1337=float2(0.0);
l9_1337=(l9_1269*l9_1333)+l9_1336;
l9_1196=l9_1337;
l9_1198=l9_1196;
}
l9_1194=l9_1198;
l9_1190=l9_1194;
l9_1193=l9_1190;
}
else
{
float2 l9_1338=float2(0.0);
l9_1338=l9_1192.Surface_UVCoord0;
l9_1191=l9_1338;
l9_1193=l9_1191;
}
l9_1189=l9_1193;
float2 l9_1339=float2(0.0);
l9_1339=l9_1189;
float2 l9_1340=float2(0.0);
l9_1340=l9_1339;
l9_1133=l9_1340;
l9_1136=l9_1133;
}
else
{
float2 l9_1341=float2(0.0);
l9_1341=l9_1135.Surface_UVCoord0;
l9_1134=l9_1341;
l9_1136=l9_1134;
}
}
}
}
l9_1129=l9_1136;
float4 l9_1342=float4(0.0);
int l9_1343;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_1344=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1344=0;
}
else
{
l9_1344=in.varStereoViewID;
}
int l9_1345=l9_1344;
l9_1343=1-l9_1345;
}
else
{
int l9_1346=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1346=0;
}
else
{
l9_1346=in.varStereoViewID;
}
int l9_1347=l9_1346;
l9_1343=l9_1347;
}
int l9_1348=l9_1343;
int l9_1349=baseTexLayout_tmp;
int l9_1350=l9_1348;
float2 l9_1351=l9_1129;
bool l9_1352=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_1353=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_1354=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_1355=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_1356=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_1357=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_1358=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_1359=0.0;
bool l9_1360=l9_1357&&(!l9_1355);
float l9_1361=1.0;
float l9_1362=l9_1351.x;
int l9_1363=l9_1354.x;
if (l9_1363==1)
{
l9_1362=fract(l9_1362);
}
else
{
if (l9_1363==2)
{
float l9_1364=fract(l9_1362);
float l9_1365=l9_1362-l9_1364;
float l9_1366=step(0.25,fract(l9_1365*0.5));
l9_1362=mix(l9_1364,1.0-l9_1364,fast::clamp(l9_1366,0.0,1.0));
}
}
l9_1351.x=l9_1362;
float l9_1367=l9_1351.y;
int l9_1368=l9_1354.y;
if (l9_1368==1)
{
l9_1367=fract(l9_1367);
}
else
{
if (l9_1368==2)
{
float l9_1369=fract(l9_1367);
float l9_1370=l9_1367-l9_1369;
float l9_1371=step(0.25,fract(l9_1370*0.5));
l9_1367=mix(l9_1369,1.0-l9_1369,fast::clamp(l9_1371,0.0,1.0));
}
}
l9_1351.y=l9_1367;
if (l9_1355)
{
bool l9_1372=l9_1357;
bool l9_1373;
if (l9_1372)
{
l9_1373=l9_1354.x==3;
}
else
{
l9_1373=l9_1372;
}
float l9_1374=l9_1351.x;
float l9_1375=l9_1356.x;
float l9_1376=l9_1356.z;
bool l9_1377=l9_1373;
float l9_1378=l9_1361;
float l9_1379=fast::clamp(l9_1374,l9_1375,l9_1376);
float l9_1380=step(abs(l9_1374-l9_1379),9.9999997e-06);
l9_1378*=(l9_1380+((1.0-float(l9_1377))*(1.0-l9_1380)));
l9_1374=l9_1379;
l9_1351.x=l9_1374;
l9_1361=l9_1378;
bool l9_1381=l9_1357;
bool l9_1382;
if (l9_1381)
{
l9_1382=l9_1354.y==3;
}
else
{
l9_1382=l9_1381;
}
float l9_1383=l9_1351.y;
float l9_1384=l9_1356.y;
float l9_1385=l9_1356.w;
bool l9_1386=l9_1382;
float l9_1387=l9_1361;
float l9_1388=fast::clamp(l9_1383,l9_1384,l9_1385);
float l9_1389=step(abs(l9_1383-l9_1388),9.9999997e-06);
l9_1387*=(l9_1389+((1.0-float(l9_1386))*(1.0-l9_1389)));
l9_1383=l9_1388;
l9_1351.y=l9_1383;
l9_1361=l9_1387;
}
float2 l9_1390=l9_1351;
bool l9_1391=l9_1352;
float3x3 l9_1392=l9_1353;
if (l9_1391)
{
l9_1390=float2((l9_1392*float3(l9_1390,1.0)).xy);
}
float2 l9_1393=l9_1390;
l9_1351=l9_1393;
float l9_1394=l9_1351.x;
int l9_1395=l9_1354.x;
bool l9_1396=l9_1360;
float l9_1397=l9_1361;
if ((l9_1395==0)||(l9_1395==3))
{
float l9_1398=l9_1394;
float l9_1399=0.0;
float l9_1400=1.0;
bool l9_1401=l9_1396;
float l9_1402=l9_1397;
float l9_1403=fast::clamp(l9_1398,l9_1399,l9_1400);
float l9_1404=step(abs(l9_1398-l9_1403),9.9999997e-06);
l9_1402*=(l9_1404+((1.0-float(l9_1401))*(1.0-l9_1404)));
l9_1398=l9_1403;
l9_1394=l9_1398;
l9_1397=l9_1402;
}
l9_1351.x=l9_1394;
l9_1361=l9_1397;
float l9_1405=l9_1351.y;
int l9_1406=l9_1354.y;
bool l9_1407=l9_1360;
float l9_1408=l9_1361;
if ((l9_1406==0)||(l9_1406==3))
{
float l9_1409=l9_1405;
float l9_1410=0.0;
float l9_1411=1.0;
bool l9_1412=l9_1407;
float l9_1413=l9_1408;
float l9_1414=fast::clamp(l9_1409,l9_1410,l9_1411);
float l9_1415=step(abs(l9_1409-l9_1414),9.9999997e-06);
l9_1413*=(l9_1415+((1.0-float(l9_1412))*(1.0-l9_1415)));
l9_1409=l9_1414;
l9_1405=l9_1409;
l9_1408=l9_1413;
}
l9_1351.y=l9_1405;
l9_1361=l9_1408;
float2 l9_1416=l9_1351;
int l9_1417=l9_1349;
int l9_1418=l9_1350;
float l9_1419=l9_1359;
float2 l9_1420=l9_1416;
int l9_1421=l9_1417;
int l9_1422=l9_1418;
float3 l9_1423=float3(0.0);
if (l9_1421==0)
{
l9_1423=float3(l9_1420,0.0);
}
else
{
if (l9_1421==1)
{
l9_1423=float3(l9_1420.x,(l9_1420.y*0.5)+(0.5-(float(l9_1422)*0.5)),0.0);
}
else
{
l9_1423=float3(l9_1420,float(l9_1422));
}
}
float3 l9_1424=l9_1423;
float3 l9_1425=l9_1424;
float4 l9_1426=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_1425.xy,bias(l9_1419));
float4 l9_1427=l9_1426;
if (l9_1357)
{
l9_1427=mix(l9_1358,l9_1427,float4(l9_1361));
}
float4 l9_1428=l9_1427;
l9_1342=l9_1428;
l9_1125=l9_1342;
l9_1128=l9_1125;
}
else
{
l9_1128=l9_1126;
}
l9_1124=l9_1128;
float4 l9_1429=float4(0.0);
l9_1429=l9_1123*l9_1124;
float4 l9_1430=float4(0.0);
l9_1430=l9_1429;
float4 l9_1431=float4(0.0);
l9_1431=l9_1430;
l9_729=l9_1431.xyz;
l9_731=l9_729;
}
l9_727=l9_731;
float3 l9_1432=float3(0.0);
l9_1432=l9_727;
float3 l9_1433=float3(0.0);
l9_1433=l9_1432;
float4 l9_1434=float4(0.0);
l9_1434=float4(l9_1433.x,l9_1433.y,l9_1433.z,l9_1434.w);
l9_1434.w=(*sc_set0.UserUniforms).Port_Value2_N073;
param_2=l9_1434;
param_3=param_2;
}
Result_N363=param_3;
float4 Export_N364=float4(0.0);
Export_N364=Result_N363;
float4 Output_N70=float4(0.0);
float param_5=1.0;
float4 param_6=float4(1.0);
float4 param_7=float4(0.0);
ssGlobals param_9=Globals;
float2 l9_1435=float2(0.0);
l9_1435=param_9.Surface_UVCoord0;
float l9_1436=0.0;
float2 l9_1437=l9_1435;
float l9_1438=l9_1437.x;
l9_1436=l9_1438;
float l9_1439=0.0;
float l9_1440=(*sc_set0.UserUniforms).Level;
l9_1439=l9_1440;
float l9_1441=0.0;
l9_1441=float(l9_1436<l9_1439);
param_5=l9_1441;
float4 param_8;
if ((param_5*1.0)!=0.0)
{
float4 l9_1442=float4(0.0);
float4 l9_1443=(*sc_set0.UserUniforms).innerColor1;
l9_1442=l9_1443;
float4 l9_1444=float4(0.0);
float4 l9_1445=(*sc_set0.UserUniforms).innerColor2;
l9_1444=l9_1445;
float2 l9_1446=float2(0.0);
l9_1446=param_9.Surface_UVCoord0;
float l9_1447=0.0;
float2 l9_1448=l9_1446;
float l9_1449=l9_1448.y;
l9_1447=l9_1449;
float4 l9_1450=float4(0.0);
l9_1450=mix(l9_1442,l9_1444,float4(l9_1447));
param_6=l9_1450;
param_8=param_6;
}
else
{
float4 l9_1451=float4(0.0);
float4 l9_1452=(*sc_set0.UserUniforms).outerColor1;
l9_1451=l9_1452;
float4 l9_1453=float4(0.0);
float4 l9_1454=(*sc_set0.UserUniforms).outerColor2;
l9_1453=l9_1454;
float2 l9_1455=float2(0.0);
l9_1455=param_9.Surface_UVCoord0;
float l9_1456=0.0;
float2 l9_1457=l9_1455;
float l9_1458=l9_1457.y;
l9_1456=l9_1458;
float4 l9_1459=float4(0.0);
l9_1459=mix(l9_1451,l9_1453,float4(l9_1456));
param_7=l9_1459;
param_8=param_7;
}
Output_N70=param_8;
float4 Value_N384=float4(0.0);
Value_N384=Output_N70;
float4 Result_N369=float4(0.0);
float4 param_10=float4(0.0);
float4 param_11=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals param_13=Globals;
float4 param_12;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_1460=float2(0.0);
float2 l9_1461=float2(0.0);
float2 l9_1462=float2(0.0);
float2 l9_1463=float2(0.0);
float2 l9_1464=float2(0.0);
float2 l9_1465=float2(0.0);
ssGlobals l9_1466=param_13;
float2 l9_1467;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_1468=float2(0.0);
l9_1468=l9_1466.Surface_UVCoord0;
l9_1461=l9_1468;
l9_1467=l9_1461;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_1469=float2(0.0);
l9_1469=l9_1466.Surface_UVCoord1;
l9_1462=l9_1469;
l9_1467=l9_1462;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_1470=float2(0.0);
float2 l9_1471=float2(0.0);
float2 l9_1472=float2(0.0);
ssGlobals l9_1473=l9_1466;
float2 l9_1474;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1475=float2(0.0);
float2 l9_1476=float2(0.0);
float2 l9_1477=float2(0.0);
ssGlobals l9_1478=l9_1473;
float2 l9_1479;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1480=float2(0.0);
float2 l9_1481=float2(0.0);
float2 l9_1482=float2(0.0);
float2 l9_1483=float2(0.0);
float2 l9_1484=float2(0.0);
ssGlobals l9_1485=l9_1478;
float2 l9_1486;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1487=float2(0.0);
l9_1487=l9_1485.Surface_UVCoord0;
l9_1481=l9_1487;
l9_1486=l9_1481;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1488=float2(0.0);
l9_1488=l9_1485.Surface_UVCoord1;
l9_1482=l9_1488;
l9_1486=l9_1482;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1489=float2(0.0);
l9_1489=l9_1485.gScreenCoord;
l9_1483=l9_1489;
l9_1486=l9_1483;
}
else
{
float2 l9_1490=float2(0.0);
l9_1490=l9_1485.Surface_UVCoord0;
l9_1484=l9_1490;
l9_1486=l9_1484;
}
}
}
l9_1480=l9_1486;
float2 l9_1491=float2(0.0);
float2 l9_1492=(*sc_set0.UserUniforms).uv2Scale;
l9_1491=l9_1492;
float2 l9_1493=float2(0.0);
l9_1493=l9_1491;
float2 l9_1494=float2(0.0);
float2 l9_1495=(*sc_set0.UserUniforms).uv2Offset;
l9_1494=l9_1495;
float2 l9_1496=float2(0.0);
l9_1496=l9_1494;
float2 l9_1497=float2(0.0);
l9_1497=(l9_1480*l9_1493)+l9_1496;
float2 l9_1498=float2(0.0);
l9_1498=l9_1497+(l9_1496*(l9_1478.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1476=l9_1498;
l9_1479=l9_1476;
}
else
{
float2 l9_1499=float2(0.0);
float2 l9_1500=float2(0.0);
float2 l9_1501=float2(0.0);
float2 l9_1502=float2(0.0);
float2 l9_1503=float2(0.0);
ssGlobals l9_1504=l9_1478;
float2 l9_1505;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1506=float2(0.0);
l9_1506=l9_1504.Surface_UVCoord0;
l9_1500=l9_1506;
l9_1505=l9_1500;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1507=float2(0.0);
l9_1507=l9_1504.Surface_UVCoord1;
l9_1501=l9_1507;
l9_1505=l9_1501;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1508=float2(0.0);
l9_1508=l9_1504.gScreenCoord;
l9_1502=l9_1508;
l9_1505=l9_1502;
}
else
{
float2 l9_1509=float2(0.0);
l9_1509=l9_1504.Surface_UVCoord0;
l9_1503=l9_1509;
l9_1505=l9_1503;
}
}
}
l9_1499=l9_1505;
float2 l9_1510=float2(0.0);
float2 l9_1511=(*sc_set0.UserUniforms).uv2Scale;
l9_1510=l9_1511;
float2 l9_1512=float2(0.0);
l9_1512=l9_1510;
float2 l9_1513=float2(0.0);
float2 l9_1514=(*sc_set0.UserUniforms).uv2Offset;
l9_1513=l9_1514;
float2 l9_1515=float2(0.0);
l9_1515=l9_1513;
float2 l9_1516=float2(0.0);
l9_1516=(l9_1499*l9_1512)+l9_1515;
l9_1477=l9_1516;
l9_1479=l9_1477;
}
l9_1475=l9_1479;
l9_1471=l9_1475;
l9_1474=l9_1471;
}
else
{
float2 l9_1517=float2(0.0);
l9_1517=l9_1473.Surface_UVCoord0;
l9_1472=l9_1517;
l9_1474=l9_1472;
}
l9_1470=l9_1474;
float2 l9_1518=float2(0.0);
l9_1518=l9_1470;
float2 l9_1519=float2(0.0);
l9_1519=l9_1518;
l9_1463=l9_1519;
l9_1467=l9_1463;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_1520=float2(0.0);
float2 l9_1521=float2(0.0);
float2 l9_1522=float2(0.0);
ssGlobals l9_1523=l9_1466;
float2 l9_1524;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_1525=float2(0.0);
float2 l9_1526=float2(0.0);
float2 l9_1527=float2(0.0);
ssGlobals l9_1528=l9_1523;
float2 l9_1529;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_1530=float2(0.0);
float2 l9_1531=float2(0.0);
float2 l9_1532=float2(0.0);
float2 l9_1533=float2(0.0);
float2 l9_1534=float2(0.0);
float2 l9_1535=float2(0.0);
ssGlobals l9_1536=l9_1528;
float2 l9_1537;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1538=float2(0.0);
l9_1538=l9_1536.Surface_UVCoord0;
l9_1531=l9_1538;
l9_1537=l9_1531;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1539=float2(0.0);
l9_1539=l9_1536.Surface_UVCoord1;
l9_1532=l9_1539;
l9_1537=l9_1532;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1540=float2(0.0);
l9_1540=l9_1536.gScreenCoord;
l9_1533=l9_1540;
l9_1537=l9_1533;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1541=float2(0.0);
float2 l9_1542=float2(0.0);
float2 l9_1543=float2(0.0);
ssGlobals l9_1544=l9_1536;
float2 l9_1545;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1546=float2(0.0);
float2 l9_1547=float2(0.0);
float2 l9_1548=float2(0.0);
ssGlobals l9_1549=l9_1544;
float2 l9_1550;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1551=float2(0.0);
float2 l9_1552=float2(0.0);
float2 l9_1553=float2(0.0);
float2 l9_1554=float2(0.0);
float2 l9_1555=float2(0.0);
ssGlobals l9_1556=l9_1549;
float2 l9_1557;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1558=float2(0.0);
l9_1558=l9_1556.Surface_UVCoord0;
l9_1552=l9_1558;
l9_1557=l9_1552;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1559=float2(0.0);
l9_1559=l9_1556.Surface_UVCoord1;
l9_1553=l9_1559;
l9_1557=l9_1553;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1560=float2(0.0);
l9_1560=l9_1556.gScreenCoord;
l9_1554=l9_1560;
l9_1557=l9_1554;
}
else
{
float2 l9_1561=float2(0.0);
l9_1561=l9_1556.Surface_UVCoord0;
l9_1555=l9_1561;
l9_1557=l9_1555;
}
}
}
l9_1551=l9_1557;
float2 l9_1562=float2(0.0);
float2 l9_1563=(*sc_set0.UserUniforms).uv2Scale;
l9_1562=l9_1563;
float2 l9_1564=float2(0.0);
l9_1564=l9_1562;
float2 l9_1565=float2(0.0);
float2 l9_1566=(*sc_set0.UserUniforms).uv2Offset;
l9_1565=l9_1566;
float2 l9_1567=float2(0.0);
l9_1567=l9_1565;
float2 l9_1568=float2(0.0);
l9_1568=(l9_1551*l9_1564)+l9_1567;
float2 l9_1569=float2(0.0);
l9_1569=l9_1568+(l9_1567*(l9_1549.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1547=l9_1569;
l9_1550=l9_1547;
}
else
{
float2 l9_1570=float2(0.0);
float2 l9_1571=float2(0.0);
float2 l9_1572=float2(0.0);
float2 l9_1573=float2(0.0);
float2 l9_1574=float2(0.0);
ssGlobals l9_1575=l9_1549;
float2 l9_1576;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1577=float2(0.0);
l9_1577=l9_1575.Surface_UVCoord0;
l9_1571=l9_1577;
l9_1576=l9_1571;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1578=float2(0.0);
l9_1578=l9_1575.Surface_UVCoord1;
l9_1572=l9_1578;
l9_1576=l9_1572;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1579=float2(0.0);
l9_1579=l9_1575.gScreenCoord;
l9_1573=l9_1579;
l9_1576=l9_1573;
}
else
{
float2 l9_1580=float2(0.0);
l9_1580=l9_1575.Surface_UVCoord0;
l9_1574=l9_1580;
l9_1576=l9_1574;
}
}
}
l9_1570=l9_1576;
float2 l9_1581=float2(0.0);
float2 l9_1582=(*sc_set0.UserUniforms).uv2Scale;
l9_1581=l9_1582;
float2 l9_1583=float2(0.0);
l9_1583=l9_1581;
float2 l9_1584=float2(0.0);
float2 l9_1585=(*sc_set0.UserUniforms).uv2Offset;
l9_1584=l9_1585;
float2 l9_1586=float2(0.0);
l9_1586=l9_1584;
float2 l9_1587=float2(0.0);
l9_1587=(l9_1570*l9_1583)+l9_1586;
l9_1548=l9_1587;
l9_1550=l9_1548;
}
l9_1546=l9_1550;
l9_1542=l9_1546;
l9_1545=l9_1542;
}
else
{
float2 l9_1588=float2(0.0);
l9_1588=l9_1544.Surface_UVCoord0;
l9_1543=l9_1588;
l9_1545=l9_1543;
}
l9_1541=l9_1545;
float2 l9_1589=float2(0.0);
l9_1589=l9_1541;
float2 l9_1590=float2(0.0);
l9_1590=l9_1589;
l9_1534=l9_1590;
l9_1537=l9_1534;
}
else
{
float2 l9_1591=float2(0.0);
l9_1591=l9_1536.Surface_UVCoord0;
l9_1535=l9_1591;
l9_1537=l9_1535;
}
}
}
}
l9_1530=l9_1537;
float2 l9_1592=float2(0.0);
float2 l9_1593=(*sc_set0.UserUniforms).uv3Scale;
l9_1592=l9_1593;
float2 l9_1594=float2(0.0);
l9_1594=l9_1592;
float2 l9_1595=float2(0.0);
float2 l9_1596=(*sc_set0.UserUniforms).uv3Offset;
l9_1595=l9_1596;
float2 l9_1597=float2(0.0);
l9_1597=l9_1595;
float2 l9_1598=float2(0.0);
l9_1598=(l9_1530*l9_1594)+l9_1597;
float2 l9_1599=float2(0.0);
l9_1599=l9_1598+(l9_1597*(l9_1528.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_1526=l9_1599;
l9_1529=l9_1526;
}
else
{
float2 l9_1600=float2(0.0);
float2 l9_1601=float2(0.0);
float2 l9_1602=float2(0.0);
float2 l9_1603=float2(0.0);
float2 l9_1604=float2(0.0);
float2 l9_1605=float2(0.0);
ssGlobals l9_1606=l9_1528;
float2 l9_1607;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1608=float2(0.0);
l9_1608=l9_1606.Surface_UVCoord0;
l9_1601=l9_1608;
l9_1607=l9_1601;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1609=float2(0.0);
l9_1609=l9_1606.Surface_UVCoord1;
l9_1602=l9_1609;
l9_1607=l9_1602;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1610=float2(0.0);
l9_1610=l9_1606.gScreenCoord;
l9_1603=l9_1610;
l9_1607=l9_1603;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1611=float2(0.0);
float2 l9_1612=float2(0.0);
float2 l9_1613=float2(0.0);
ssGlobals l9_1614=l9_1606;
float2 l9_1615;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1616=float2(0.0);
float2 l9_1617=float2(0.0);
float2 l9_1618=float2(0.0);
ssGlobals l9_1619=l9_1614;
float2 l9_1620;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1621=float2(0.0);
float2 l9_1622=float2(0.0);
float2 l9_1623=float2(0.0);
float2 l9_1624=float2(0.0);
float2 l9_1625=float2(0.0);
ssGlobals l9_1626=l9_1619;
float2 l9_1627;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1628=float2(0.0);
l9_1628=l9_1626.Surface_UVCoord0;
l9_1622=l9_1628;
l9_1627=l9_1622;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1629=float2(0.0);
l9_1629=l9_1626.Surface_UVCoord1;
l9_1623=l9_1629;
l9_1627=l9_1623;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1630=float2(0.0);
l9_1630=l9_1626.gScreenCoord;
l9_1624=l9_1630;
l9_1627=l9_1624;
}
else
{
float2 l9_1631=float2(0.0);
l9_1631=l9_1626.Surface_UVCoord0;
l9_1625=l9_1631;
l9_1627=l9_1625;
}
}
}
l9_1621=l9_1627;
float2 l9_1632=float2(0.0);
float2 l9_1633=(*sc_set0.UserUniforms).uv2Scale;
l9_1632=l9_1633;
float2 l9_1634=float2(0.0);
l9_1634=l9_1632;
float2 l9_1635=float2(0.0);
float2 l9_1636=(*sc_set0.UserUniforms).uv2Offset;
l9_1635=l9_1636;
float2 l9_1637=float2(0.0);
l9_1637=l9_1635;
float2 l9_1638=float2(0.0);
l9_1638=(l9_1621*l9_1634)+l9_1637;
float2 l9_1639=float2(0.0);
l9_1639=l9_1638+(l9_1637*(l9_1619.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1617=l9_1639;
l9_1620=l9_1617;
}
else
{
float2 l9_1640=float2(0.0);
float2 l9_1641=float2(0.0);
float2 l9_1642=float2(0.0);
float2 l9_1643=float2(0.0);
float2 l9_1644=float2(0.0);
ssGlobals l9_1645=l9_1619;
float2 l9_1646;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1647=float2(0.0);
l9_1647=l9_1645.Surface_UVCoord0;
l9_1641=l9_1647;
l9_1646=l9_1641;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1648=float2(0.0);
l9_1648=l9_1645.Surface_UVCoord1;
l9_1642=l9_1648;
l9_1646=l9_1642;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1649=float2(0.0);
l9_1649=l9_1645.gScreenCoord;
l9_1643=l9_1649;
l9_1646=l9_1643;
}
else
{
float2 l9_1650=float2(0.0);
l9_1650=l9_1645.Surface_UVCoord0;
l9_1644=l9_1650;
l9_1646=l9_1644;
}
}
}
l9_1640=l9_1646;
float2 l9_1651=float2(0.0);
float2 l9_1652=(*sc_set0.UserUniforms).uv2Scale;
l9_1651=l9_1652;
float2 l9_1653=float2(0.0);
l9_1653=l9_1651;
float2 l9_1654=float2(0.0);
float2 l9_1655=(*sc_set0.UserUniforms).uv2Offset;
l9_1654=l9_1655;
float2 l9_1656=float2(0.0);
l9_1656=l9_1654;
float2 l9_1657=float2(0.0);
l9_1657=(l9_1640*l9_1653)+l9_1656;
l9_1618=l9_1657;
l9_1620=l9_1618;
}
l9_1616=l9_1620;
l9_1612=l9_1616;
l9_1615=l9_1612;
}
else
{
float2 l9_1658=float2(0.0);
l9_1658=l9_1614.Surface_UVCoord0;
l9_1613=l9_1658;
l9_1615=l9_1613;
}
l9_1611=l9_1615;
float2 l9_1659=float2(0.0);
l9_1659=l9_1611;
float2 l9_1660=float2(0.0);
l9_1660=l9_1659;
l9_1604=l9_1660;
l9_1607=l9_1604;
}
else
{
float2 l9_1661=float2(0.0);
l9_1661=l9_1606.Surface_UVCoord0;
l9_1605=l9_1661;
l9_1607=l9_1605;
}
}
}
}
l9_1600=l9_1607;
float2 l9_1662=float2(0.0);
float2 l9_1663=(*sc_set0.UserUniforms).uv3Scale;
l9_1662=l9_1663;
float2 l9_1664=float2(0.0);
l9_1664=l9_1662;
float2 l9_1665=float2(0.0);
float2 l9_1666=(*sc_set0.UserUniforms).uv3Offset;
l9_1665=l9_1666;
float2 l9_1667=float2(0.0);
l9_1667=l9_1665;
float2 l9_1668=float2(0.0);
l9_1668=(l9_1600*l9_1664)+l9_1667;
l9_1527=l9_1668;
l9_1529=l9_1527;
}
l9_1525=l9_1529;
l9_1521=l9_1525;
l9_1524=l9_1521;
}
else
{
float2 l9_1669=float2(0.0);
l9_1669=l9_1523.Surface_UVCoord0;
l9_1522=l9_1669;
l9_1524=l9_1522;
}
l9_1520=l9_1524;
float2 l9_1670=float2(0.0);
l9_1670=l9_1520;
float2 l9_1671=float2(0.0);
l9_1671=l9_1670;
l9_1464=l9_1671;
l9_1467=l9_1464;
}
else
{
float2 l9_1672=float2(0.0);
l9_1672=l9_1466.Surface_UVCoord0;
l9_1465=l9_1672;
l9_1467=l9_1465;
}
}
}
}
l9_1460=l9_1467;
float4 l9_1673=float4(0.0);
int l9_1674;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_1675=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1675=0;
}
else
{
l9_1675=in.varStereoViewID;
}
int l9_1676=l9_1675;
l9_1674=1-l9_1676;
}
else
{
int l9_1677=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1677=0;
}
else
{
l9_1677=in.varStereoViewID;
}
int l9_1678=l9_1677;
l9_1674=l9_1678;
}
int l9_1679=l9_1674;
int l9_1680=baseTexLayout_tmp;
int l9_1681=l9_1679;
float2 l9_1682=l9_1460;
bool l9_1683=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_1684=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_1685=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_1686=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_1687=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_1688=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_1689=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_1690=0.0;
bool l9_1691=l9_1688&&(!l9_1686);
float l9_1692=1.0;
float l9_1693=l9_1682.x;
int l9_1694=l9_1685.x;
if (l9_1694==1)
{
l9_1693=fract(l9_1693);
}
else
{
if (l9_1694==2)
{
float l9_1695=fract(l9_1693);
float l9_1696=l9_1693-l9_1695;
float l9_1697=step(0.25,fract(l9_1696*0.5));
l9_1693=mix(l9_1695,1.0-l9_1695,fast::clamp(l9_1697,0.0,1.0));
}
}
l9_1682.x=l9_1693;
float l9_1698=l9_1682.y;
int l9_1699=l9_1685.y;
if (l9_1699==1)
{
l9_1698=fract(l9_1698);
}
else
{
if (l9_1699==2)
{
float l9_1700=fract(l9_1698);
float l9_1701=l9_1698-l9_1700;
float l9_1702=step(0.25,fract(l9_1701*0.5));
l9_1698=mix(l9_1700,1.0-l9_1700,fast::clamp(l9_1702,0.0,1.0));
}
}
l9_1682.y=l9_1698;
if (l9_1686)
{
bool l9_1703=l9_1688;
bool l9_1704;
if (l9_1703)
{
l9_1704=l9_1685.x==3;
}
else
{
l9_1704=l9_1703;
}
float l9_1705=l9_1682.x;
float l9_1706=l9_1687.x;
float l9_1707=l9_1687.z;
bool l9_1708=l9_1704;
float l9_1709=l9_1692;
float l9_1710=fast::clamp(l9_1705,l9_1706,l9_1707);
float l9_1711=step(abs(l9_1705-l9_1710),9.9999997e-06);
l9_1709*=(l9_1711+((1.0-float(l9_1708))*(1.0-l9_1711)));
l9_1705=l9_1710;
l9_1682.x=l9_1705;
l9_1692=l9_1709;
bool l9_1712=l9_1688;
bool l9_1713;
if (l9_1712)
{
l9_1713=l9_1685.y==3;
}
else
{
l9_1713=l9_1712;
}
float l9_1714=l9_1682.y;
float l9_1715=l9_1687.y;
float l9_1716=l9_1687.w;
bool l9_1717=l9_1713;
float l9_1718=l9_1692;
float l9_1719=fast::clamp(l9_1714,l9_1715,l9_1716);
float l9_1720=step(abs(l9_1714-l9_1719),9.9999997e-06);
l9_1718*=(l9_1720+((1.0-float(l9_1717))*(1.0-l9_1720)));
l9_1714=l9_1719;
l9_1682.y=l9_1714;
l9_1692=l9_1718;
}
float2 l9_1721=l9_1682;
bool l9_1722=l9_1683;
float3x3 l9_1723=l9_1684;
if (l9_1722)
{
l9_1721=float2((l9_1723*float3(l9_1721,1.0)).xy);
}
float2 l9_1724=l9_1721;
l9_1682=l9_1724;
float l9_1725=l9_1682.x;
int l9_1726=l9_1685.x;
bool l9_1727=l9_1691;
float l9_1728=l9_1692;
if ((l9_1726==0)||(l9_1726==3))
{
float l9_1729=l9_1725;
float l9_1730=0.0;
float l9_1731=1.0;
bool l9_1732=l9_1727;
float l9_1733=l9_1728;
float l9_1734=fast::clamp(l9_1729,l9_1730,l9_1731);
float l9_1735=step(abs(l9_1729-l9_1734),9.9999997e-06);
l9_1733*=(l9_1735+((1.0-float(l9_1732))*(1.0-l9_1735)));
l9_1729=l9_1734;
l9_1725=l9_1729;
l9_1728=l9_1733;
}
l9_1682.x=l9_1725;
l9_1692=l9_1728;
float l9_1736=l9_1682.y;
int l9_1737=l9_1685.y;
bool l9_1738=l9_1691;
float l9_1739=l9_1692;
if ((l9_1737==0)||(l9_1737==3))
{
float l9_1740=l9_1736;
float l9_1741=0.0;
float l9_1742=1.0;
bool l9_1743=l9_1738;
float l9_1744=l9_1739;
float l9_1745=fast::clamp(l9_1740,l9_1741,l9_1742);
float l9_1746=step(abs(l9_1740-l9_1745),9.9999997e-06);
l9_1744*=(l9_1746+((1.0-float(l9_1743))*(1.0-l9_1746)));
l9_1740=l9_1745;
l9_1736=l9_1740;
l9_1739=l9_1744;
}
l9_1682.y=l9_1736;
l9_1692=l9_1739;
float2 l9_1747=l9_1682;
int l9_1748=l9_1680;
int l9_1749=l9_1681;
float l9_1750=l9_1690;
float2 l9_1751=l9_1747;
int l9_1752=l9_1748;
int l9_1753=l9_1749;
float3 l9_1754=float3(0.0);
if (l9_1752==0)
{
l9_1754=float3(l9_1751,0.0);
}
else
{
if (l9_1752==1)
{
l9_1754=float3(l9_1751.x,(l9_1751.y*0.5)+(0.5-(float(l9_1753)*0.5)),0.0);
}
else
{
l9_1754=float3(l9_1751,float(l9_1753));
}
}
float3 l9_1755=l9_1754;
float3 l9_1756=l9_1755;
float4 l9_1757=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_1756.xy,bias(l9_1750));
float4 l9_1758=l9_1757;
if (l9_1688)
{
l9_1758=mix(l9_1689,l9_1758,float4(l9_1692));
}
float4 l9_1759=l9_1758;
l9_1673=l9_1759;
param_10=l9_1673;
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
float2 l9_1760=float2(0.0);
float2 l9_1761=float2(0.0);
float2 l9_1762=float2(0.0);
float2 l9_1763=float2(0.0);
float2 l9_1764=float2(0.0);
float2 l9_1765=float2(0.0);
ssGlobals l9_1766=param_17;
float2 l9_1767;
if (NODE_69_DROPLIST_ITEM_tmp==0)
{
float2 l9_1768=float2(0.0);
l9_1768=l9_1766.Surface_UVCoord0;
l9_1761=l9_1768;
l9_1767=l9_1761;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==1)
{
float2 l9_1769=float2(0.0);
l9_1769=l9_1766.Surface_UVCoord1;
l9_1762=l9_1769;
l9_1767=l9_1762;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==2)
{
float2 l9_1770=float2(0.0);
float2 l9_1771=float2(0.0);
float2 l9_1772=float2(0.0);
ssGlobals l9_1773=l9_1766;
float2 l9_1774;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1775=float2(0.0);
float2 l9_1776=float2(0.0);
float2 l9_1777=float2(0.0);
ssGlobals l9_1778=l9_1773;
float2 l9_1779;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1780=float2(0.0);
float2 l9_1781=float2(0.0);
float2 l9_1782=float2(0.0);
float2 l9_1783=float2(0.0);
float2 l9_1784=float2(0.0);
ssGlobals l9_1785=l9_1778;
float2 l9_1786;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1787=float2(0.0);
l9_1787=l9_1785.Surface_UVCoord0;
l9_1781=l9_1787;
l9_1786=l9_1781;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1788=float2(0.0);
l9_1788=l9_1785.Surface_UVCoord1;
l9_1782=l9_1788;
l9_1786=l9_1782;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1789=float2(0.0);
l9_1789=l9_1785.gScreenCoord;
l9_1783=l9_1789;
l9_1786=l9_1783;
}
else
{
float2 l9_1790=float2(0.0);
l9_1790=l9_1785.Surface_UVCoord0;
l9_1784=l9_1790;
l9_1786=l9_1784;
}
}
}
l9_1780=l9_1786;
float2 l9_1791=float2(0.0);
float2 l9_1792=(*sc_set0.UserUniforms).uv2Scale;
l9_1791=l9_1792;
float2 l9_1793=float2(0.0);
l9_1793=l9_1791;
float2 l9_1794=float2(0.0);
float2 l9_1795=(*sc_set0.UserUniforms).uv2Offset;
l9_1794=l9_1795;
float2 l9_1796=float2(0.0);
l9_1796=l9_1794;
float2 l9_1797=float2(0.0);
l9_1797=(l9_1780*l9_1793)+l9_1796;
float2 l9_1798=float2(0.0);
l9_1798=l9_1797+(l9_1796*(l9_1778.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1776=l9_1798;
l9_1779=l9_1776;
}
else
{
float2 l9_1799=float2(0.0);
float2 l9_1800=float2(0.0);
float2 l9_1801=float2(0.0);
float2 l9_1802=float2(0.0);
float2 l9_1803=float2(0.0);
ssGlobals l9_1804=l9_1778;
float2 l9_1805;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1806=float2(0.0);
l9_1806=l9_1804.Surface_UVCoord0;
l9_1800=l9_1806;
l9_1805=l9_1800;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1807=float2(0.0);
l9_1807=l9_1804.Surface_UVCoord1;
l9_1801=l9_1807;
l9_1805=l9_1801;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1808=float2(0.0);
l9_1808=l9_1804.gScreenCoord;
l9_1802=l9_1808;
l9_1805=l9_1802;
}
else
{
float2 l9_1809=float2(0.0);
l9_1809=l9_1804.Surface_UVCoord0;
l9_1803=l9_1809;
l9_1805=l9_1803;
}
}
}
l9_1799=l9_1805;
float2 l9_1810=float2(0.0);
float2 l9_1811=(*sc_set0.UserUniforms).uv2Scale;
l9_1810=l9_1811;
float2 l9_1812=float2(0.0);
l9_1812=l9_1810;
float2 l9_1813=float2(0.0);
float2 l9_1814=(*sc_set0.UserUniforms).uv2Offset;
l9_1813=l9_1814;
float2 l9_1815=float2(0.0);
l9_1815=l9_1813;
float2 l9_1816=float2(0.0);
l9_1816=(l9_1799*l9_1812)+l9_1815;
l9_1777=l9_1816;
l9_1779=l9_1777;
}
l9_1775=l9_1779;
l9_1771=l9_1775;
l9_1774=l9_1771;
}
else
{
float2 l9_1817=float2(0.0);
l9_1817=l9_1773.Surface_UVCoord0;
l9_1772=l9_1817;
l9_1774=l9_1772;
}
l9_1770=l9_1774;
float2 l9_1818=float2(0.0);
l9_1818=l9_1770;
float2 l9_1819=float2(0.0);
l9_1819=l9_1818;
l9_1763=l9_1819;
l9_1767=l9_1763;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==3)
{
float2 l9_1820=float2(0.0);
float2 l9_1821=float2(0.0);
float2 l9_1822=float2(0.0);
ssGlobals l9_1823=l9_1766;
float2 l9_1824;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_1825=float2(0.0);
float2 l9_1826=float2(0.0);
float2 l9_1827=float2(0.0);
ssGlobals l9_1828=l9_1823;
float2 l9_1829;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_1830=float2(0.0);
float2 l9_1831=float2(0.0);
float2 l9_1832=float2(0.0);
float2 l9_1833=float2(0.0);
float2 l9_1834=float2(0.0);
float2 l9_1835=float2(0.0);
ssGlobals l9_1836=l9_1828;
float2 l9_1837;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1838=float2(0.0);
l9_1838=l9_1836.Surface_UVCoord0;
l9_1831=l9_1838;
l9_1837=l9_1831;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1839=float2(0.0);
l9_1839=l9_1836.Surface_UVCoord1;
l9_1832=l9_1839;
l9_1837=l9_1832;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1840=float2(0.0);
l9_1840=l9_1836.gScreenCoord;
l9_1833=l9_1840;
l9_1837=l9_1833;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1841=float2(0.0);
float2 l9_1842=float2(0.0);
float2 l9_1843=float2(0.0);
ssGlobals l9_1844=l9_1836;
float2 l9_1845;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1846=float2(0.0);
float2 l9_1847=float2(0.0);
float2 l9_1848=float2(0.0);
ssGlobals l9_1849=l9_1844;
float2 l9_1850;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1851=float2(0.0);
float2 l9_1852=float2(0.0);
float2 l9_1853=float2(0.0);
float2 l9_1854=float2(0.0);
float2 l9_1855=float2(0.0);
ssGlobals l9_1856=l9_1849;
float2 l9_1857;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1858=float2(0.0);
l9_1858=l9_1856.Surface_UVCoord0;
l9_1852=l9_1858;
l9_1857=l9_1852;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1859=float2(0.0);
l9_1859=l9_1856.Surface_UVCoord1;
l9_1853=l9_1859;
l9_1857=l9_1853;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1860=float2(0.0);
l9_1860=l9_1856.gScreenCoord;
l9_1854=l9_1860;
l9_1857=l9_1854;
}
else
{
float2 l9_1861=float2(0.0);
l9_1861=l9_1856.Surface_UVCoord0;
l9_1855=l9_1861;
l9_1857=l9_1855;
}
}
}
l9_1851=l9_1857;
float2 l9_1862=float2(0.0);
float2 l9_1863=(*sc_set0.UserUniforms).uv2Scale;
l9_1862=l9_1863;
float2 l9_1864=float2(0.0);
l9_1864=l9_1862;
float2 l9_1865=float2(0.0);
float2 l9_1866=(*sc_set0.UserUniforms).uv2Offset;
l9_1865=l9_1866;
float2 l9_1867=float2(0.0);
l9_1867=l9_1865;
float2 l9_1868=float2(0.0);
l9_1868=(l9_1851*l9_1864)+l9_1867;
float2 l9_1869=float2(0.0);
l9_1869=l9_1868+(l9_1867*(l9_1849.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1847=l9_1869;
l9_1850=l9_1847;
}
else
{
float2 l9_1870=float2(0.0);
float2 l9_1871=float2(0.0);
float2 l9_1872=float2(0.0);
float2 l9_1873=float2(0.0);
float2 l9_1874=float2(0.0);
ssGlobals l9_1875=l9_1849;
float2 l9_1876;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1877=float2(0.0);
l9_1877=l9_1875.Surface_UVCoord0;
l9_1871=l9_1877;
l9_1876=l9_1871;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1878=float2(0.0);
l9_1878=l9_1875.Surface_UVCoord1;
l9_1872=l9_1878;
l9_1876=l9_1872;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1879=float2(0.0);
l9_1879=l9_1875.gScreenCoord;
l9_1873=l9_1879;
l9_1876=l9_1873;
}
else
{
float2 l9_1880=float2(0.0);
l9_1880=l9_1875.Surface_UVCoord0;
l9_1874=l9_1880;
l9_1876=l9_1874;
}
}
}
l9_1870=l9_1876;
float2 l9_1881=float2(0.0);
float2 l9_1882=(*sc_set0.UserUniforms).uv2Scale;
l9_1881=l9_1882;
float2 l9_1883=float2(0.0);
l9_1883=l9_1881;
float2 l9_1884=float2(0.0);
float2 l9_1885=(*sc_set0.UserUniforms).uv2Offset;
l9_1884=l9_1885;
float2 l9_1886=float2(0.0);
l9_1886=l9_1884;
float2 l9_1887=float2(0.0);
l9_1887=(l9_1870*l9_1883)+l9_1886;
l9_1848=l9_1887;
l9_1850=l9_1848;
}
l9_1846=l9_1850;
l9_1842=l9_1846;
l9_1845=l9_1842;
}
else
{
float2 l9_1888=float2(0.0);
l9_1888=l9_1844.Surface_UVCoord0;
l9_1843=l9_1888;
l9_1845=l9_1843;
}
l9_1841=l9_1845;
float2 l9_1889=float2(0.0);
l9_1889=l9_1841;
float2 l9_1890=float2(0.0);
l9_1890=l9_1889;
l9_1834=l9_1890;
l9_1837=l9_1834;
}
else
{
float2 l9_1891=float2(0.0);
l9_1891=l9_1836.Surface_UVCoord0;
l9_1835=l9_1891;
l9_1837=l9_1835;
}
}
}
}
l9_1830=l9_1837;
float2 l9_1892=float2(0.0);
float2 l9_1893=(*sc_set0.UserUniforms).uv3Scale;
l9_1892=l9_1893;
float2 l9_1894=float2(0.0);
l9_1894=l9_1892;
float2 l9_1895=float2(0.0);
float2 l9_1896=(*sc_set0.UserUniforms).uv3Offset;
l9_1895=l9_1896;
float2 l9_1897=float2(0.0);
l9_1897=l9_1895;
float2 l9_1898=float2(0.0);
l9_1898=(l9_1830*l9_1894)+l9_1897;
float2 l9_1899=float2(0.0);
l9_1899=l9_1898+(l9_1897*(l9_1828.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_1826=l9_1899;
l9_1829=l9_1826;
}
else
{
float2 l9_1900=float2(0.0);
float2 l9_1901=float2(0.0);
float2 l9_1902=float2(0.0);
float2 l9_1903=float2(0.0);
float2 l9_1904=float2(0.0);
float2 l9_1905=float2(0.0);
ssGlobals l9_1906=l9_1828;
float2 l9_1907;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1908=float2(0.0);
l9_1908=l9_1906.Surface_UVCoord0;
l9_1901=l9_1908;
l9_1907=l9_1901;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1909=float2(0.0);
l9_1909=l9_1906.Surface_UVCoord1;
l9_1902=l9_1909;
l9_1907=l9_1902;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1910=float2(0.0);
l9_1910=l9_1906.gScreenCoord;
l9_1903=l9_1910;
l9_1907=l9_1903;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1911=float2(0.0);
float2 l9_1912=float2(0.0);
float2 l9_1913=float2(0.0);
ssGlobals l9_1914=l9_1906;
float2 l9_1915;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1916=float2(0.0);
float2 l9_1917=float2(0.0);
float2 l9_1918=float2(0.0);
ssGlobals l9_1919=l9_1914;
float2 l9_1920;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1921=float2(0.0);
float2 l9_1922=float2(0.0);
float2 l9_1923=float2(0.0);
float2 l9_1924=float2(0.0);
float2 l9_1925=float2(0.0);
ssGlobals l9_1926=l9_1919;
float2 l9_1927;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1928=float2(0.0);
l9_1928=l9_1926.Surface_UVCoord0;
l9_1922=l9_1928;
l9_1927=l9_1922;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1929=float2(0.0);
l9_1929=l9_1926.Surface_UVCoord1;
l9_1923=l9_1929;
l9_1927=l9_1923;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1930=float2(0.0);
l9_1930=l9_1926.gScreenCoord;
l9_1924=l9_1930;
l9_1927=l9_1924;
}
else
{
float2 l9_1931=float2(0.0);
l9_1931=l9_1926.Surface_UVCoord0;
l9_1925=l9_1931;
l9_1927=l9_1925;
}
}
}
l9_1921=l9_1927;
float2 l9_1932=float2(0.0);
float2 l9_1933=(*sc_set0.UserUniforms).uv2Scale;
l9_1932=l9_1933;
float2 l9_1934=float2(0.0);
l9_1934=l9_1932;
float2 l9_1935=float2(0.0);
float2 l9_1936=(*sc_set0.UserUniforms).uv2Offset;
l9_1935=l9_1936;
float2 l9_1937=float2(0.0);
l9_1937=l9_1935;
float2 l9_1938=float2(0.0);
l9_1938=(l9_1921*l9_1934)+l9_1937;
float2 l9_1939=float2(0.0);
l9_1939=l9_1938+(l9_1937*(l9_1919.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1917=l9_1939;
l9_1920=l9_1917;
}
else
{
float2 l9_1940=float2(0.0);
float2 l9_1941=float2(0.0);
float2 l9_1942=float2(0.0);
float2 l9_1943=float2(0.0);
float2 l9_1944=float2(0.0);
ssGlobals l9_1945=l9_1919;
float2 l9_1946;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1947=float2(0.0);
l9_1947=l9_1945.Surface_UVCoord0;
l9_1941=l9_1947;
l9_1946=l9_1941;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1948=float2(0.0);
l9_1948=l9_1945.Surface_UVCoord1;
l9_1942=l9_1948;
l9_1946=l9_1942;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1949=float2(0.0);
l9_1949=l9_1945.gScreenCoord;
l9_1943=l9_1949;
l9_1946=l9_1943;
}
else
{
float2 l9_1950=float2(0.0);
l9_1950=l9_1945.Surface_UVCoord0;
l9_1944=l9_1950;
l9_1946=l9_1944;
}
}
}
l9_1940=l9_1946;
float2 l9_1951=float2(0.0);
float2 l9_1952=(*sc_set0.UserUniforms).uv2Scale;
l9_1951=l9_1952;
float2 l9_1953=float2(0.0);
l9_1953=l9_1951;
float2 l9_1954=float2(0.0);
float2 l9_1955=(*sc_set0.UserUniforms).uv2Offset;
l9_1954=l9_1955;
float2 l9_1956=float2(0.0);
l9_1956=l9_1954;
float2 l9_1957=float2(0.0);
l9_1957=(l9_1940*l9_1953)+l9_1956;
l9_1918=l9_1957;
l9_1920=l9_1918;
}
l9_1916=l9_1920;
l9_1912=l9_1916;
l9_1915=l9_1912;
}
else
{
float2 l9_1958=float2(0.0);
l9_1958=l9_1914.Surface_UVCoord0;
l9_1913=l9_1958;
l9_1915=l9_1913;
}
l9_1911=l9_1915;
float2 l9_1959=float2(0.0);
l9_1959=l9_1911;
float2 l9_1960=float2(0.0);
l9_1960=l9_1959;
l9_1904=l9_1960;
l9_1907=l9_1904;
}
else
{
float2 l9_1961=float2(0.0);
l9_1961=l9_1906.Surface_UVCoord0;
l9_1905=l9_1961;
l9_1907=l9_1905;
}
}
}
}
l9_1900=l9_1907;
float2 l9_1962=float2(0.0);
float2 l9_1963=(*sc_set0.UserUniforms).uv3Scale;
l9_1962=l9_1963;
float2 l9_1964=float2(0.0);
l9_1964=l9_1962;
float2 l9_1965=float2(0.0);
float2 l9_1966=(*sc_set0.UserUniforms).uv3Offset;
l9_1965=l9_1966;
float2 l9_1967=float2(0.0);
l9_1967=l9_1965;
float2 l9_1968=float2(0.0);
l9_1968=(l9_1900*l9_1964)+l9_1967;
l9_1827=l9_1968;
l9_1829=l9_1827;
}
l9_1825=l9_1829;
l9_1821=l9_1825;
l9_1824=l9_1821;
}
else
{
float2 l9_1969=float2(0.0);
l9_1969=l9_1823.Surface_UVCoord0;
l9_1822=l9_1969;
l9_1824=l9_1822;
}
l9_1820=l9_1824;
float2 l9_1970=float2(0.0);
l9_1970=l9_1820;
float2 l9_1971=float2(0.0);
l9_1971=l9_1970;
l9_1764=l9_1971;
l9_1767=l9_1764;
}
else
{
float2 l9_1972=float2(0.0);
l9_1972=l9_1766.Surface_UVCoord0;
l9_1765=l9_1972;
l9_1767=l9_1765;
}
}
}
}
l9_1760=l9_1767;
float4 l9_1973=float4(0.0);
int l9_1974;
if ((int(opacityTexHasSwappedViews_tmp)!=0))
{
int l9_1975=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1975=0;
}
else
{
l9_1975=in.varStereoViewID;
}
int l9_1976=l9_1975;
l9_1974=1-l9_1976;
}
else
{
int l9_1977=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1977=0;
}
else
{
l9_1977=in.varStereoViewID;
}
int l9_1978=l9_1977;
l9_1974=l9_1978;
}
int l9_1979=l9_1974;
int l9_1980=opacityTexLayout_tmp;
int l9_1981=l9_1979;
float2 l9_1982=l9_1760;
bool l9_1983=(int(SC_USE_UV_TRANSFORM_opacityTex_tmp)!=0);
float3x3 l9_1984=(*sc_set0.UserUniforms).opacityTexTransform;
int2 l9_1985=int2(SC_SOFTWARE_WRAP_MODE_U_opacityTex_tmp,SC_SOFTWARE_WRAP_MODE_V_opacityTex_tmp);
bool l9_1986=(int(SC_USE_UV_MIN_MAX_opacityTex_tmp)!=0);
float4 l9_1987=(*sc_set0.UserUniforms).opacityTexUvMinMax;
bool l9_1988=(int(SC_USE_CLAMP_TO_BORDER_opacityTex_tmp)!=0);
float4 l9_1989=(*sc_set0.UserUniforms).opacityTexBorderColor;
float l9_1990=0.0;
bool l9_1991=l9_1988&&(!l9_1986);
float l9_1992=1.0;
float l9_1993=l9_1982.x;
int l9_1994=l9_1985.x;
if (l9_1994==1)
{
l9_1993=fract(l9_1993);
}
else
{
if (l9_1994==2)
{
float l9_1995=fract(l9_1993);
float l9_1996=l9_1993-l9_1995;
float l9_1997=step(0.25,fract(l9_1996*0.5));
l9_1993=mix(l9_1995,1.0-l9_1995,fast::clamp(l9_1997,0.0,1.0));
}
}
l9_1982.x=l9_1993;
float l9_1998=l9_1982.y;
int l9_1999=l9_1985.y;
if (l9_1999==1)
{
l9_1998=fract(l9_1998);
}
else
{
if (l9_1999==2)
{
float l9_2000=fract(l9_1998);
float l9_2001=l9_1998-l9_2000;
float l9_2002=step(0.25,fract(l9_2001*0.5));
l9_1998=mix(l9_2000,1.0-l9_2000,fast::clamp(l9_2002,0.0,1.0));
}
}
l9_1982.y=l9_1998;
if (l9_1986)
{
bool l9_2003=l9_1988;
bool l9_2004;
if (l9_2003)
{
l9_2004=l9_1985.x==3;
}
else
{
l9_2004=l9_2003;
}
float l9_2005=l9_1982.x;
float l9_2006=l9_1987.x;
float l9_2007=l9_1987.z;
bool l9_2008=l9_2004;
float l9_2009=l9_1992;
float l9_2010=fast::clamp(l9_2005,l9_2006,l9_2007);
float l9_2011=step(abs(l9_2005-l9_2010),9.9999997e-06);
l9_2009*=(l9_2011+((1.0-float(l9_2008))*(1.0-l9_2011)));
l9_2005=l9_2010;
l9_1982.x=l9_2005;
l9_1992=l9_2009;
bool l9_2012=l9_1988;
bool l9_2013;
if (l9_2012)
{
l9_2013=l9_1985.y==3;
}
else
{
l9_2013=l9_2012;
}
float l9_2014=l9_1982.y;
float l9_2015=l9_1987.y;
float l9_2016=l9_1987.w;
bool l9_2017=l9_2013;
float l9_2018=l9_1992;
float l9_2019=fast::clamp(l9_2014,l9_2015,l9_2016);
float l9_2020=step(abs(l9_2014-l9_2019),9.9999997e-06);
l9_2018*=(l9_2020+((1.0-float(l9_2017))*(1.0-l9_2020)));
l9_2014=l9_2019;
l9_1982.y=l9_2014;
l9_1992=l9_2018;
}
float2 l9_2021=l9_1982;
bool l9_2022=l9_1983;
float3x3 l9_2023=l9_1984;
if (l9_2022)
{
l9_2021=float2((l9_2023*float3(l9_2021,1.0)).xy);
}
float2 l9_2024=l9_2021;
l9_1982=l9_2024;
float l9_2025=l9_1982.x;
int l9_2026=l9_1985.x;
bool l9_2027=l9_1991;
float l9_2028=l9_1992;
if ((l9_2026==0)||(l9_2026==3))
{
float l9_2029=l9_2025;
float l9_2030=0.0;
float l9_2031=1.0;
bool l9_2032=l9_2027;
float l9_2033=l9_2028;
float l9_2034=fast::clamp(l9_2029,l9_2030,l9_2031);
float l9_2035=step(abs(l9_2029-l9_2034),9.9999997e-06);
l9_2033*=(l9_2035+((1.0-float(l9_2032))*(1.0-l9_2035)));
l9_2029=l9_2034;
l9_2025=l9_2029;
l9_2028=l9_2033;
}
l9_1982.x=l9_2025;
l9_1992=l9_2028;
float l9_2036=l9_1982.y;
int l9_2037=l9_1985.y;
bool l9_2038=l9_1991;
float l9_2039=l9_1992;
if ((l9_2037==0)||(l9_2037==3))
{
float l9_2040=l9_2036;
float l9_2041=0.0;
float l9_2042=1.0;
bool l9_2043=l9_2038;
float l9_2044=l9_2039;
float l9_2045=fast::clamp(l9_2040,l9_2041,l9_2042);
float l9_2046=step(abs(l9_2040-l9_2045),9.9999997e-06);
l9_2044*=(l9_2046+((1.0-float(l9_2043))*(1.0-l9_2046)));
l9_2040=l9_2045;
l9_2036=l9_2040;
l9_2039=l9_2044;
}
l9_1982.y=l9_2036;
l9_1992=l9_2039;
float2 l9_2047=l9_1982;
int l9_2048=l9_1980;
int l9_2049=l9_1981;
float l9_2050=l9_1990;
float2 l9_2051=l9_2047;
int l9_2052=l9_2048;
int l9_2053=l9_2049;
float3 l9_2054=float3(0.0);
if (l9_2052==0)
{
l9_2054=float3(l9_2051,0.0);
}
else
{
if (l9_2052==1)
{
l9_2054=float3(l9_2051.x,(l9_2051.y*0.5)+(0.5-(float(l9_2053)*0.5)),0.0);
}
else
{
l9_2054=float3(l9_2051,float(l9_2053));
}
}
float3 l9_2055=l9_2054;
float3 l9_2056=l9_2055;
float4 l9_2057=sc_set0.opacityTex.sample(sc_set0.opacityTexSmpSC,l9_2056.xy,bias(l9_2050));
float4 l9_2058=l9_2057;
if (l9_1988)
{
l9_2058=mix(l9_1989,l9_2058,float4(l9_1992));
}
float4 l9_2059=l9_2058;
l9_1973=l9_2059;
float l9_2060=0.0;
l9_2060=l9_1973.x;
param_14=l9_2060;
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
float4 l9_2061=float4(0.0);
l9_2061=param_21.VertexColor;
float l9_2062=0.0;
l9_2062=l9_2061.w;
param_18=l9_2062;
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
float3 l9_2063=float3(0.0);
l9_2063=param_25.VertexTangent_WorldSpace;
float3 l9_2064=float3(0.0);
l9_2064=param_25.VertexBinormal_WorldSpace;
float3 l9_2065=float3(0.0);
l9_2065=param_25.VertexNormal_WorldSpace;
float3x3 l9_2066=float3x3(float3(0.0),float3(0.0),float3(0.0));
l9_2066=float3x3(float3(l9_2063),float3(l9_2064),float3(l9_2065));
float2 l9_2067=float2(0.0);
float2 l9_2068=float2(0.0);
float2 l9_2069=float2(0.0);
float2 l9_2070=float2(0.0);
float2 l9_2071=float2(0.0);
float2 l9_2072=float2(0.0);
ssGlobals l9_2073=param_25;
float2 l9_2074;
if (NODE_181_DROPLIST_ITEM_tmp==0)
{
float2 l9_2075=float2(0.0);
l9_2075=l9_2073.Surface_UVCoord0;
l9_2068=l9_2075;
l9_2074=l9_2068;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==1)
{
float2 l9_2076=float2(0.0);
l9_2076=l9_2073.Surface_UVCoord1;
l9_2069=l9_2076;
l9_2074=l9_2069;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==2)
{
float2 l9_2077=float2(0.0);
float2 l9_2078=float2(0.0);
float2 l9_2079=float2(0.0);
ssGlobals l9_2080=l9_2073;
float2 l9_2081;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2082=float2(0.0);
float2 l9_2083=float2(0.0);
float2 l9_2084=float2(0.0);
ssGlobals l9_2085=l9_2080;
float2 l9_2086;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2087=float2(0.0);
float2 l9_2088=float2(0.0);
float2 l9_2089=float2(0.0);
float2 l9_2090=float2(0.0);
float2 l9_2091=float2(0.0);
ssGlobals l9_2092=l9_2085;
float2 l9_2093;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2094=float2(0.0);
l9_2094=l9_2092.Surface_UVCoord0;
l9_2088=l9_2094;
l9_2093=l9_2088;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2095=float2(0.0);
l9_2095=l9_2092.Surface_UVCoord1;
l9_2089=l9_2095;
l9_2093=l9_2089;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2096=float2(0.0);
l9_2096=l9_2092.gScreenCoord;
l9_2090=l9_2096;
l9_2093=l9_2090;
}
else
{
float2 l9_2097=float2(0.0);
l9_2097=l9_2092.Surface_UVCoord0;
l9_2091=l9_2097;
l9_2093=l9_2091;
}
}
}
l9_2087=l9_2093;
float2 l9_2098=float2(0.0);
float2 l9_2099=(*sc_set0.UserUniforms).uv2Scale;
l9_2098=l9_2099;
float2 l9_2100=float2(0.0);
l9_2100=l9_2098;
float2 l9_2101=float2(0.0);
float2 l9_2102=(*sc_set0.UserUniforms).uv2Offset;
l9_2101=l9_2102;
float2 l9_2103=float2(0.0);
l9_2103=l9_2101;
float2 l9_2104=float2(0.0);
l9_2104=(l9_2087*l9_2100)+l9_2103;
float2 l9_2105=float2(0.0);
l9_2105=l9_2104+(l9_2103*(l9_2085.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2083=l9_2105;
l9_2086=l9_2083;
}
else
{
float2 l9_2106=float2(0.0);
float2 l9_2107=float2(0.0);
float2 l9_2108=float2(0.0);
float2 l9_2109=float2(0.0);
float2 l9_2110=float2(0.0);
ssGlobals l9_2111=l9_2085;
float2 l9_2112;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2113=float2(0.0);
l9_2113=l9_2111.Surface_UVCoord0;
l9_2107=l9_2113;
l9_2112=l9_2107;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2114=float2(0.0);
l9_2114=l9_2111.Surface_UVCoord1;
l9_2108=l9_2114;
l9_2112=l9_2108;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2115=float2(0.0);
l9_2115=l9_2111.gScreenCoord;
l9_2109=l9_2115;
l9_2112=l9_2109;
}
else
{
float2 l9_2116=float2(0.0);
l9_2116=l9_2111.Surface_UVCoord0;
l9_2110=l9_2116;
l9_2112=l9_2110;
}
}
}
l9_2106=l9_2112;
float2 l9_2117=float2(0.0);
float2 l9_2118=(*sc_set0.UserUniforms).uv2Scale;
l9_2117=l9_2118;
float2 l9_2119=float2(0.0);
l9_2119=l9_2117;
float2 l9_2120=float2(0.0);
float2 l9_2121=(*sc_set0.UserUniforms).uv2Offset;
l9_2120=l9_2121;
float2 l9_2122=float2(0.0);
l9_2122=l9_2120;
float2 l9_2123=float2(0.0);
l9_2123=(l9_2106*l9_2119)+l9_2122;
l9_2084=l9_2123;
l9_2086=l9_2084;
}
l9_2082=l9_2086;
l9_2078=l9_2082;
l9_2081=l9_2078;
}
else
{
float2 l9_2124=float2(0.0);
l9_2124=l9_2080.Surface_UVCoord0;
l9_2079=l9_2124;
l9_2081=l9_2079;
}
l9_2077=l9_2081;
float2 l9_2125=float2(0.0);
l9_2125=l9_2077;
float2 l9_2126=float2(0.0);
l9_2126=l9_2125;
l9_2070=l9_2126;
l9_2074=l9_2070;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==3)
{
float2 l9_2127=float2(0.0);
float2 l9_2128=float2(0.0);
float2 l9_2129=float2(0.0);
ssGlobals l9_2130=l9_2073;
float2 l9_2131;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_2132=float2(0.0);
float2 l9_2133=float2(0.0);
float2 l9_2134=float2(0.0);
ssGlobals l9_2135=l9_2130;
float2 l9_2136;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_2137=float2(0.0);
float2 l9_2138=float2(0.0);
float2 l9_2139=float2(0.0);
float2 l9_2140=float2(0.0);
float2 l9_2141=float2(0.0);
float2 l9_2142=float2(0.0);
ssGlobals l9_2143=l9_2135;
float2 l9_2144;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_2145=float2(0.0);
l9_2145=l9_2143.Surface_UVCoord0;
l9_2138=l9_2145;
l9_2144=l9_2138;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_2146=float2(0.0);
l9_2146=l9_2143.Surface_UVCoord1;
l9_2139=l9_2146;
l9_2144=l9_2139;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_2147=float2(0.0);
l9_2147=l9_2143.gScreenCoord;
l9_2140=l9_2147;
l9_2144=l9_2140;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_2148=float2(0.0);
float2 l9_2149=float2(0.0);
float2 l9_2150=float2(0.0);
ssGlobals l9_2151=l9_2143;
float2 l9_2152;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2153=float2(0.0);
float2 l9_2154=float2(0.0);
float2 l9_2155=float2(0.0);
ssGlobals l9_2156=l9_2151;
float2 l9_2157;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2158=float2(0.0);
float2 l9_2159=float2(0.0);
float2 l9_2160=float2(0.0);
float2 l9_2161=float2(0.0);
float2 l9_2162=float2(0.0);
ssGlobals l9_2163=l9_2156;
float2 l9_2164;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2165=float2(0.0);
l9_2165=l9_2163.Surface_UVCoord0;
l9_2159=l9_2165;
l9_2164=l9_2159;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2166=float2(0.0);
l9_2166=l9_2163.Surface_UVCoord1;
l9_2160=l9_2166;
l9_2164=l9_2160;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2167=float2(0.0);
l9_2167=l9_2163.gScreenCoord;
l9_2161=l9_2167;
l9_2164=l9_2161;
}
else
{
float2 l9_2168=float2(0.0);
l9_2168=l9_2163.Surface_UVCoord0;
l9_2162=l9_2168;
l9_2164=l9_2162;
}
}
}
l9_2158=l9_2164;
float2 l9_2169=float2(0.0);
float2 l9_2170=(*sc_set0.UserUniforms).uv2Scale;
l9_2169=l9_2170;
float2 l9_2171=float2(0.0);
l9_2171=l9_2169;
float2 l9_2172=float2(0.0);
float2 l9_2173=(*sc_set0.UserUniforms).uv2Offset;
l9_2172=l9_2173;
float2 l9_2174=float2(0.0);
l9_2174=l9_2172;
float2 l9_2175=float2(0.0);
l9_2175=(l9_2158*l9_2171)+l9_2174;
float2 l9_2176=float2(0.0);
l9_2176=l9_2175+(l9_2174*(l9_2156.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2154=l9_2176;
l9_2157=l9_2154;
}
else
{
float2 l9_2177=float2(0.0);
float2 l9_2178=float2(0.0);
float2 l9_2179=float2(0.0);
float2 l9_2180=float2(0.0);
float2 l9_2181=float2(0.0);
ssGlobals l9_2182=l9_2156;
float2 l9_2183;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2184=float2(0.0);
l9_2184=l9_2182.Surface_UVCoord0;
l9_2178=l9_2184;
l9_2183=l9_2178;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2185=float2(0.0);
l9_2185=l9_2182.Surface_UVCoord1;
l9_2179=l9_2185;
l9_2183=l9_2179;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2186=float2(0.0);
l9_2186=l9_2182.gScreenCoord;
l9_2180=l9_2186;
l9_2183=l9_2180;
}
else
{
float2 l9_2187=float2(0.0);
l9_2187=l9_2182.Surface_UVCoord0;
l9_2181=l9_2187;
l9_2183=l9_2181;
}
}
}
l9_2177=l9_2183;
float2 l9_2188=float2(0.0);
float2 l9_2189=(*sc_set0.UserUniforms).uv2Scale;
l9_2188=l9_2189;
float2 l9_2190=float2(0.0);
l9_2190=l9_2188;
float2 l9_2191=float2(0.0);
float2 l9_2192=(*sc_set0.UserUniforms).uv2Offset;
l9_2191=l9_2192;
float2 l9_2193=float2(0.0);
l9_2193=l9_2191;
float2 l9_2194=float2(0.0);
l9_2194=(l9_2177*l9_2190)+l9_2193;
l9_2155=l9_2194;
l9_2157=l9_2155;
}
l9_2153=l9_2157;
l9_2149=l9_2153;
l9_2152=l9_2149;
}
else
{
float2 l9_2195=float2(0.0);
l9_2195=l9_2151.Surface_UVCoord0;
l9_2150=l9_2195;
l9_2152=l9_2150;
}
l9_2148=l9_2152;
float2 l9_2196=float2(0.0);
l9_2196=l9_2148;
float2 l9_2197=float2(0.0);
l9_2197=l9_2196;
l9_2141=l9_2197;
l9_2144=l9_2141;
}
else
{
float2 l9_2198=float2(0.0);
l9_2198=l9_2143.Surface_UVCoord0;
l9_2142=l9_2198;
l9_2144=l9_2142;
}
}
}
}
l9_2137=l9_2144;
float2 l9_2199=float2(0.0);
float2 l9_2200=(*sc_set0.UserUniforms).uv3Scale;
l9_2199=l9_2200;
float2 l9_2201=float2(0.0);
l9_2201=l9_2199;
float2 l9_2202=float2(0.0);
float2 l9_2203=(*sc_set0.UserUniforms).uv3Offset;
l9_2202=l9_2203;
float2 l9_2204=float2(0.0);
l9_2204=l9_2202;
float2 l9_2205=float2(0.0);
l9_2205=(l9_2137*l9_2201)+l9_2204;
float2 l9_2206=float2(0.0);
l9_2206=l9_2205+(l9_2204*(l9_2135.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_2133=l9_2206;
l9_2136=l9_2133;
}
else
{
float2 l9_2207=float2(0.0);
float2 l9_2208=float2(0.0);
float2 l9_2209=float2(0.0);
float2 l9_2210=float2(0.0);
float2 l9_2211=float2(0.0);
float2 l9_2212=float2(0.0);
ssGlobals l9_2213=l9_2135;
float2 l9_2214;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_2215=float2(0.0);
l9_2215=l9_2213.Surface_UVCoord0;
l9_2208=l9_2215;
l9_2214=l9_2208;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_2216=float2(0.0);
l9_2216=l9_2213.Surface_UVCoord1;
l9_2209=l9_2216;
l9_2214=l9_2209;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_2217=float2(0.0);
l9_2217=l9_2213.gScreenCoord;
l9_2210=l9_2217;
l9_2214=l9_2210;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_2218=float2(0.0);
float2 l9_2219=float2(0.0);
float2 l9_2220=float2(0.0);
ssGlobals l9_2221=l9_2213;
float2 l9_2222;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2223=float2(0.0);
float2 l9_2224=float2(0.0);
float2 l9_2225=float2(0.0);
ssGlobals l9_2226=l9_2221;
float2 l9_2227;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2228=float2(0.0);
float2 l9_2229=float2(0.0);
float2 l9_2230=float2(0.0);
float2 l9_2231=float2(0.0);
float2 l9_2232=float2(0.0);
ssGlobals l9_2233=l9_2226;
float2 l9_2234;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2235=float2(0.0);
l9_2235=l9_2233.Surface_UVCoord0;
l9_2229=l9_2235;
l9_2234=l9_2229;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2236=float2(0.0);
l9_2236=l9_2233.Surface_UVCoord1;
l9_2230=l9_2236;
l9_2234=l9_2230;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2237=float2(0.0);
l9_2237=l9_2233.gScreenCoord;
l9_2231=l9_2237;
l9_2234=l9_2231;
}
else
{
float2 l9_2238=float2(0.0);
l9_2238=l9_2233.Surface_UVCoord0;
l9_2232=l9_2238;
l9_2234=l9_2232;
}
}
}
l9_2228=l9_2234;
float2 l9_2239=float2(0.0);
float2 l9_2240=(*sc_set0.UserUniforms).uv2Scale;
l9_2239=l9_2240;
float2 l9_2241=float2(0.0);
l9_2241=l9_2239;
float2 l9_2242=float2(0.0);
float2 l9_2243=(*sc_set0.UserUniforms).uv2Offset;
l9_2242=l9_2243;
float2 l9_2244=float2(0.0);
l9_2244=l9_2242;
float2 l9_2245=float2(0.0);
l9_2245=(l9_2228*l9_2241)+l9_2244;
float2 l9_2246=float2(0.0);
l9_2246=l9_2245+(l9_2244*(l9_2226.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2224=l9_2246;
l9_2227=l9_2224;
}
else
{
float2 l9_2247=float2(0.0);
float2 l9_2248=float2(0.0);
float2 l9_2249=float2(0.0);
float2 l9_2250=float2(0.0);
float2 l9_2251=float2(0.0);
ssGlobals l9_2252=l9_2226;
float2 l9_2253;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2254=float2(0.0);
l9_2254=l9_2252.Surface_UVCoord0;
l9_2248=l9_2254;
l9_2253=l9_2248;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2255=float2(0.0);
l9_2255=l9_2252.Surface_UVCoord1;
l9_2249=l9_2255;
l9_2253=l9_2249;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2256=float2(0.0);
l9_2256=l9_2252.gScreenCoord;
l9_2250=l9_2256;
l9_2253=l9_2250;
}
else
{
float2 l9_2257=float2(0.0);
l9_2257=l9_2252.Surface_UVCoord0;
l9_2251=l9_2257;
l9_2253=l9_2251;
}
}
}
l9_2247=l9_2253;
float2 l9_2258=float2(0.0);
float2 l9_2259=(*sc_set0.UserUniforms).uv2Scale;
l9_2258=l9_2259;
float2 l9_2260=float2(0.0);
l9_2260=l9_2258;
float2 l9_2261=float2(0.0);
float2 l9_2262=(*sc_set0.UserUniforms).uv2Offset;
l9_2261=l9_2262;
float2 l9_2263=float2(0.0);
l9_2263=l9_2261;
float2 l9_2264=float2(0.0);
l9_2264=(l9_2247*l9_2260)+l9_2263;
l9_2225=l9_2264;
l9_2227=l9_2225;
}
l9_2223=l9_2227;
l9_2219=l9_2223;
l9_2222=l9_2219;
}
else
{
float2 l9_2265=float2(0.0);
l9_2265=l9_2221.Surface_UVCoord0;
l9_2220=l9_2265;
l9_2222=l9_2220;
}
l9_2218=l9_2222;
float2 l9_2266=float2(0.0);
l9_2266=l9_2218;
float2 l9_2267=float2(0.0);
l9_2267=l9_2266;
l9_2211=l9_2267;
l9_2214=l9_2211;
}
else
{
float2 l9_2268=float2(0.0);
l9_2268=l9_2213.Surface_UVCoord0;
l9_2212=l9_2268;
l9_2214=l9_2212;
}
}
}
}
l9_2207=l9_2214;
float2 l9_2269=float2(0.0);
float2 l9_2270=(*sc_set0.UserUniforms).uv3Scale;
l9_2269=l9_2270;
float2 l9_2271=float2(0.0);
l9_2271=l9_2269;
float2 l9_2272=float2(0.0);
float2 l9_2273=(*sc_set0.UserUniforms).uv3Offset;
l9_2272=l9_2273;
float2 l9_2274=float2(0.0);
l9_2274=l9_2272;
float2 l9_2275=float2(0.0);
l9_2275=(l9_2207*l9_2271)+l9_2274;
l9_2134=l9_2275;
l9_2136=l9_2134;
}
l9_2132=l9_2136;
l9_2128=l9_2132;
l9_2131=l9_2128;
}
else
{
float2 l9_2276=float2(0.0);
l9_2276=l9_2130.Surface_UVCoord0;
l9_2129=l9_2276;
l9_2131=l9_2129;
}
l9_2127=l9_2131;
float2 l9_2277=float2(0.0);
l9_2277=l9_2127;
float2 l9_2278=float2(0.0);
l9_2278=l9_2277;
l9_2071=l9_2278;
l9_2074=l9_2071;
}
else
{
float2 l9_2279=float2(0.0);
l9_2279=l9_2073.Surface_UVCoord0;
l9_2072=l9_2279;
l9_2074=l9_2072;
}
}
}
}
l9_2067=l9_2074;
float4 l9_2280=float4(0.0);
float2 l9_2281=l9_2067;
int l9_2282;
if ((int(normalTexHasSwappedViews_tmp)!=0))
{
int l9_2283=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2283=0;
}
else
{
l9_2283=in.varStereoViewID;
}
int l9_2284=l9_2283;
l9_2282=1-l9_2284;
}
else
{
int l9_2285=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2285=0;
}
else
{
l9_2285=in.varStereoViewID;
}
int l9_2286=l9_2285;
l9_2282=l9_2286;
}
int l9_2287=l9_2282;
int l9_2288=normalTexLayout_tmp;
int l9_2289=l9_2287;
float2 l9_2290=l9_2281;
bool l9_2291=(int(SC_USE_UV_TRANSFORM_normalTex_tmp)!=0);
float3x3 l9_2292=(*sc_set0.UserUniforms).normalTexTransform;
int2 l9_2293=int2(SC_SOFTWARE_WRAP_MODE_U_normalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_normalTex_tmp);
bool l9_2294=(int(SC_USE_UV_MIN_MAX_normalTex_tmp)!=0);
float4 l9_2295=(*sc_set0.UserUniforms).normalTexUvMinMax;
bool l9_2296=(int(SC_USE_CLAMP_TO_BORDER_normalTex_tmp)!=0);
float4 l9_2297=(*sc_set0.UserUniforms).normalTexBorderColor;
float l9_2298=0.0;
bool l9_2299=l9_2296&&(!l9_2294);
float l9_2300=1.0;
float l9_2301=l9_2290.x;
int l9_2302=l9_2293.x;
if (l9_2302==1)
{
l9_2301=fract(l9_2301);
}
else
{
if (l9_2302==2)
{
float l9_2303=fract(l9_2301);
float l9_2304=l9_2301-l9_2303;
float l9_2305=step(0.25,fract(l9_2304*0.5));
l9_2301=mix(l9_2303,1.0-l9_2303,fast::clamp(l9_2305,0.0,1.0));
}
}
l9_2290.x=l9_2301;
float l9_2306=l9_2290.y;
int l9_2307=l9_2293.y;
if (l9_2307==1)
{
l9_2306=fract(l9_2306);
}
else
{
if (l9_2307==2)
{
float l9_2308=fract(l9_2306);
float l9_2309=l9_2306-l9_2308;
float l9_2310=step(0.25,fract(l9_2309*0.5));
l9_2306=mix(l9_2308,1.0-l9_2308,fast::clamp(l9_2310,0.0,1.0));
}
}
l9_2290.y=l9_2306;
if (l9_2294)
{
bool l9_2311=l9_2296;
bool l9_2312;
if (l9_2311)
{
l9_2312=l9_2293.x==3;
}
else
{
l9_2312=l9_2311;
}
float l9_2313=l9_2290.x;
float l9_2314=l9_2295.x;
float l9_2315=l9_2295.z;
bool l9_2316=l9_2312;
float l9_2317=l9_2300;
float l9_2318=fast::clamp(l9_2313,l9_2314,l9_2315);
float l9_2319=step(abs(l9_2313-l9_2318),9.9999997e-06);
l9_2317*=(l9_2319+((1.0-float(l9_2316))*(1.0-l9_2319)));
l9_2313=l9_2318;
l9_2290.x=l9_2313;
l9_2300=l9_2317;
bool l9_2320=l9_2296;
bool l9_2321;
if (l9_2320)
{
l9_2321=l9_2293.y==3;
}
else
{
l9_2321=l9_2320;
}
float l9_2322=l9_2290.y;
float l9_2323=l9_2295.y;
float l9_2324=l9_2295.w;
bool l9_2325=l9_2321;
float l9_2326=l9_2300;
float l9_2327=fast::clamp(l9_2322,l9_2323,l9_2324);
float l9_2328=step(abs(l9_2322-l9_2327),9.9999997e-06);
l9_2326*=(l9_2328+((1.0-float(l9_2325))*(1.0-l9_2328)));
l9_2322=l9_2327;
l9_2290.y=l9_2322;
l9_2300=l9_2326;
}
float2 l9_2329=l9_2290;
bool l9_2330=l9_2291;
float3x3 l9_2331=l9_2292;
if (l9_2330)
{
l9_2329=float2((l9_2331*float3(l9_2329,1.0)).xy);
}
float2 l9_2332=l9_2329;
l9_2290=l9_2332;
float l9_2333=l9_2290.x;
int l9_2334=l9_2293.x;
bool l9_2335=l9_2299;
float l9_2336=l9_2300;
if ((l9_2334==0)||(l9_2334==3))
{
float l9_2337=l9_2333;
float l9_2338=0.0;
float l9_2339=1.0;
bool l9_2340=l9_2335;
float l9_2341=l9_2336;
float l9_2342=fast::clamp(l9_2337,l9_2338,l9_2339);
float l9_2343=step(abs(l9_2337-l9_2342),9.9999997e-06);
l9_2341*=(l9_2343+((1.0-float(l9_2340))*(1.0-l9_2343)));
l9_2337=l9_2342;
l9_2333=l9_2337;
l9_2336=l9_2341;
}
l9_2290.x=l9_2333;
l9_2300=l9_2336;
float l9_2344=l9_2290.y;
int l9_2345=l9_2293.y;
bool l9_2346=l9_2299;
float l9_2347=l9_2300;
if ((l9_2345==0)||(l9_2345==3))
{
float l9_2348=l9_2344;
float l9_2349=0.0;
float l9_2350=1.0;
bool l9_2351=l9_2346;
float l9_2352=l9_2347;
float l9_2353=fast::clamp(l9_2348,l9_2349,l9_2350);
float l9_2354=step(abs(l9_2348-l9_2353),9.9999997e-06);
l9_2352*=(l9_2354+((1.0-float(l9_2351))*(1.0-l9_2354)));
l9_2348=l9_2353;
l9_2344=l9_2348;
l9_2347=l9_2352;
}
l9_2290.y=l9_2344;
l9_2300=l9_2347;
float2 l9_2355=l9_2290;
int l9_2356=l9_2288;
int l9_2357=l9_2289;
float l9_2358=l9_2298;
float2 l9_2359=l9_2355;
int l9_2360=l9_2356;
int l9_2361=l9_2357;
float3 l9_2362=float3(0.0);
if (l9_2360==0)
{
l9_2362=float3(l9_2359,0.0);
}
else
{
if (l9_2360==1)
{
l9_2362=float3(l9_2359.x,(l9_2359.y*0.5)+(0.5-(float(l9_2361)*0.5)),0.0);
}
else
{
l9_2362=float3(l9_2359,float(l9_2361));
}
}
float3 l9_2363=l9_2362;
float3 l9_2364=l9_2363;
float4 l9_2365=sc_set0.normalTex.sample(sc_set0.normalTexSmpSC,l9_2364.xy,bias(l9_2358));
float4 l9_2366=l9_2365;
if (l9_2296)
{
l9_2366=mix(l9_2297,l9_2366,float4(l9_2300));
}
float4 l9_2367=l9_2366;
float4 l9_2368=l9_2367;
float3 l9_2369=(l9_2368.xyz*1.9921875)-float3(1.0);
l9_2368=float4(l9_2369.x,l9_2369.y,l9_2369.z,l9_2368.w);
l9_2280=l9_2368;
float3 l9_2370=float3(0.0);
float3 l9_2371=float3(0.0);
float3 l9_2372=(*sc_set0.UserUniforms).Port_Default_N113;
ssGlobals l9_2373=param_25;
float3 l9_2374;
if ((int(ENABLE_DETAIL_NORMAL_tmp)!=0))
{
float2 l9_2375=float2(0.0);
float2 l9_2376=float2(0.0);
float2 l9_2377=float2(0.0);
float2 l9_2378=float2(0.0);
float2 l9_2379=float2(0.0);
float2 l9_2380=float2(0.0);
ssGlobals l9_2381=l9_2373;
float2 l9_2382;
if (NODE_184_DROPLIST_ITEM_tmp==0)
{
float2 l9_2383=float2(0.0);
l9_2383=l9_2381.Surface_UVCoord0;
l9_2376=l9_2383;
l9_2382=l9_2376;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==1)
{
float2 l9_2384=float2(0.0);
l9_2384=l9_2381.Surface_UVCoord1;
l9_2377=l9_2384;
l9_2382=l9_2377;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==2)
{
float2 l9_2385=float2(0.0);
float2 l9_2386=float2(0.0);
float2 l9_2387=float2(0.0);
ssGlobals l9_2388=l9_2381;
float2 l9_2389;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2390=float2(0.0);
float2 l9_2391=float2(0.0);
float2 l9_2392=float2(0.0);
ssGlobals l9_2393=l9_2388;
float2 l9_2394;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2395=float2(0.0);
float2 l9_2396=float2(0.0);
float2 l9_2397=float2(0.0);
float2 l9_2398=float2(0.0);
float2 l9_2399=float2(0.0);
ssGlobals l9_2400=l9_2393;
float2 l9_2401;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2402=float2(0.0);
l9_2402=l9_2400.Surface_UVCoord0;
l9_2396=l9_2402;
l9_2401=l9_2396;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2403=float2(0.0);
l9_2403=l9_2400.Surface_UVCoord1;
l9_2397=l9_2403;
l9_2401=l9_2397;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2404=float2(0.0);
l9_2404=l9_2400.gScreenCoord;
l9_2398=l9_2404;
l9_2401=l9_2398;
}
else
{
float2 l9_2405=float2(0.0);
l9_2405=l9_2400.Surface_UVCoord0;
l9_2399=l9_2405;
l9_2401=l9_2399;
}
}
}
l9_2395=l9_2401;
float2 l9_2406=float2(0.0);
float2 l9_2407=(*sc_set0.UserUniforms).uv2Scale;
l9_2406=l9_2407;
float2 l9_2408=float2(0.0);
l9_2408=l9_2406;
float2 l9_2409=float2(0.0);
float2 l9_2410=(*sc_set0.UserUniforms).uv2Offset;
l9_2409=l9_2410;
float2 l9_2411=float2(0.0);
l9_2411=l9_2409;
float2 l9_2412=float2(0.0);
l9_2412=(l9_2395*l9_2408)+l9_2411;
float2 l9_2413=float2(0.0);
l9_2413=l9_2412+(l9_2411*(l9_2393.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2391=l9_2413;
l9_2394=l9_2391;
}
else
{
float2 l9_2414=float2(0.0);
float2 l9_2415=float2(0.0);
float2 l9_2416=float2(0.0);
float2 l9_2417=float2(0.0);
float2 l9_2418=float2(0.0);
ssGlobals l9_2419=l9_2393;
float2 l9_2420;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2421=float2(0.0);
l9_2421=l9_2419.Surface_UVCoord0;
l9_2415=l9_2421;
l9_2420=l9_2415;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2422=float2(0.0);
l9_2422=l9_2419.Surface_UVCoord1;
l9_2416=l9_2422;
l9_2420=l9_2416;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2423=float2(0.0);
l9_2423=l9_2419.gScreenCoord;
l9_2417=l9_2423;
l9_2420=l9_2417;
}
else
{
float2 l9_2424=float2(0.0);
l9_2424=l9_2419.Surface_UVCoord0;
l9_2418=l9_2424;
l9_2420=l9_2418;
}
}
}
l9_2414=l9_2420;
float2 l9_2425=float2(0.0);
float2 l9_2426=(*sc_set0.UserUniforms).uv2Scale;
l9_2425=l9_2426;
float2 l9_2427=float2(0.0);
l9_2427=l9_2425;
float2 l9_2428=float2(0.0);
float2 l9_2429=(*sc_set0.UserUniforms).uv2Offset;
l9_2428=l9_2429;
float2 l9_2430=float2(0.0);
l9_2430=l9_2428;
float2 l9_2431=float2(0.0);
l9_2431=(l9_2414*l9_2427)+l9_2430;
l9_2392=l9_2431;
l9_2394=l9_2392;
}
l9_2390=l9_2394;
l9_2386=l9_2390;
l9_2389=l9_2386;
}
else
{
float2 l9_2432=float2(0.0);
l9_2432=l9_2388.Surface_UVCoord0;
l9_2387=l9_2432;
l9_2389=l9_2387;
}
l9_2385=l9_2389;
float2 l9_2433=float2(0.0);
l9_2433=l9_2385;
float2 l9_2434=float2(0.0);
l9_2434=l9_2433;
l9_2378=l9_2434;
l9_2382=l9_2378;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==3)
{
float2 l9_2435=float2(0.0);
float2 l9_2436=float2(0.0);
float2 l9_2437=float2(0.0);
ssGlobals l9_2438=l9_2381;
float2 l9_2439;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_2440=float2(0.0);
float2 l9_2441=float2(0.0);
float2 l9_2442=float2(0.0);
ssGlobals l9_2443=l9_2438;
float2 l9_2444;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_2445=float2(0.0);
float2 l9_2446=float2(0.0);
float2 l9_2447=float2(0.0);
float2 l9_2448=float2(0.0);
float2 l9_2449=float2(0.0);
float2 l9_2450=float2(0.0);
ssGlobals l9_2451=l9_2443;
float2 l9_2452;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_2453=float2(0.0);
l9_2453=l9_2451.Surface_UVCoord0;
l9_2446=l9_2453;
l9_2452=l9_2446;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_2454=float2(0.0);
l9_2454=l9_2451.Surface_UVCoord1;
l9_2447=l9_2454;
l9_2452=l9_2447;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_2455=float2(0.0);
l9_2455=l9_2451.gScreenCoord;
l9_2448=l9_2455;
l9_2452=l9_2448;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_2456=float2(0.0);
float2 l9_2457=float2(0.0);
float2 l9_2458=float2(0.0);
ssGlobals l9_2459=l9_2451;
float2 l9_2460;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2461=float2(0.0);
float2 l9_2462=float2(0.0);
float2 l9_2463=float2(0.0);
ssGlobals l9_2464=l9_2459;
float2 l9_2465;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2466=float2(0.0);
float2 l9_2467=float2(0.0);
float2 l9_2468=float2(0.0);
float2 l9_2469=float2(0.0);
float2 l9_2470=float2(0.0);
ssGlobals l9_2471=l9_2464;
float2 l9_2472;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2473=float2(0.0);
l9_2473=l9_2471.Surface_UVCoord0;
l9_2467=l9_2473;
l9_2472=l9_2467;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2474=float2(0.0);
l9_2474=l9_2471.Surface_UVCoord1;
l9_2468=l9_2474;
l9_2472=l9_2468;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2475=float2(0.0);
l9_2475=l9_2471.gScreenCoord;
l9_2469=l9_2475;
l9_2472=l9_2469;
}
else
{
float2 l9_2476=float2(0.0);
l9_2476=l9_2471.Surface_UVCoord0;
l9_2470=l9_2476;
l9_2472=l9_2470;
}
}
}
l9_2466=l9_2472;
float2 l9_2477=float2(0.0);
float2 l9_2478=(*sc_set0.UserUniforms).uv2Scale;
l9_2477=l9_2478;
float2 l9_2479=float2(0.0);
l9_2479=l9_2477;
float2 l9_2480=float2(0.0);
float2 l9_2481=(*sc_set0.UserUniforms).uv2Offset;
l9_2480=l9_2481;
float2 l9_2482=float2(0.0);
l9_2482=l9_2480;
float2 l9_2483=float2(0.0);
l9_2483=(l9_2466*l9_2479)+l9_2482;
float2 l9_2484=float2(0.0);
l9_2484=l9_2483+(l9_2482*(l9_2464.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2462=l9_2484;
l9_2465=l9_2462;
}
else
{
float2 l9_2485=float2(0.0);
float2 l9_2486=float2(0.0);
float2 l9_2487=float2(0.0);
float2 l9_2488=float2(0.0);
float2 l9_2489=float2(0.0);
ssGlobals l9_2490=l9_2464;
float2 l9_2491;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2492=float2(0.0);
l9_2492=l9_2490.Surface_UVCoord0;
l9_2486=l9_2492;
l9_2491=l9_2486;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2493=float2(0.0);
l9_2493=l9_2490.Surface_UVCoord1;
l9_2487=l9_2493;
l9_2491=l9_2487;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2494=float2(0.0);
l9_2494=l9_2490.gScreenCoord;
l9_2488=l9_2494;
l9_2491=l9_2488;
}
else
{
float2 l9_2495=float2(0.0);
l9_2495=l9_2490.Surface_UVCoord0;
l9_2489=l9_2495;
l9_2491=l9_2489;
}
}
}
l9_2485=l9_2491;
float2 l9_2496=float2(0.0);
float2 l9_2497=(*sc_set0.UserUniforms).uv2Scale;
l9_2496=l9_2497;
float2 l9_2498=float2(0.0);
l9_2498=l9_2496;
float2 l9_2499=float2(0.0);
float2 l9_2500=(*sc_set0.UserUniforms).uv2Offset;
l9_2499=l9_2500;
float2 l9_2501=float2(0.0);
l9_2501=l9_2499;
float2 l9_2502=float2(0.0);
l9_2502=(l9_2485*l9_2498)+l9_2501;
l9_2463=l9_2502;
l9_2465=l9_2463;
}
l9_2461=l9_2465;
l9_2457=l9_2461;
l9_2460=l9_2457;
}
else
{
float2 l9_2503=float2(0.0);
l9_2503=l9_2459.Surface_UVCoord0;
l9_2458=l9_2503;
l9_2460=l9_2458;
}
l9_2456=l9_2460;
float2 l9_2504=float2(0.0);
l9_2504=l9_2456;
float2 l9_2505=float2(0.0);
l9_2505=l9_2504;
l9_2449=l9_2505;
l9_2452=l9_2449;
}
else
{
float2 l9_2506=float2(0.0);
l9_2506=l9_2451.Surface_UVCoord0;
l9_2450=l9_2506;
l9_2452=l9_2450;
}
}
}
}
l9_2445=l9_2452;
float2 l9_2507=float2(0.0);
float2 l9_2508=(*sc_set0.UserUniforms).uv3Scale;
l9_2507=l9_2508;
float2 l9_2509=float2(0.0);
l9_2509=l9_2507;
float2 l9_2510=float2(0.0);
float2 l9_2511=(*sc_set0.UserUniforms).uv3Offset;
l9_2510=l9_2511;
float2 l9_2512=float2(0.0);
l9_2512=l9_2510;
float2 l9_2513=float2(0.0);
l9_2513=(l9_2445*l9_2509)+l9_2512;
float2 l9_2514=float2(0.0);
l9_2514=l9_2513+(l9_2512*(l9_2443.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_2441=l9_2514;
l9_2444=l9_2441;
}
else
{
float2 l9_2515=float2(0.0);
float2 l9_2516=float2(0.0);
float2 l9_2517=float2(0.0);
float2 l9_2518=float2(0.0);
float2 l9_2519=float2(0.0);
float2 l9_2520=float2(0.0);
ssGlobals l9_2521=l9_2443;
float2 l9_2522;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_2523=float2(0.0);
l9_2523=l9_2521.Surface_UVCoord0;
l9_2516=l9_2523;
l9_2522=l9_2516;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_2524=float2(0.0);
l9_2524=l9_2521.Surface_UVCoord1;
l9_2517=l9_2524;
l9_2522=l9_2517;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_2525=float2(0.0);
l9_2525=l9_2521.gScreenCoord;
l9_2518=l9_2525;
l9_2522=l9_2518;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_2526=float2(0.0);
float2 l9_2527=float2(0.0);
float2 l9_2528=float2(0.0);
ssGlobals l9_2529=l9_2521;
float2 l9_2530;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_2531=float2(0.0);
float2 l9_2532=float2(0.0);
float2 l9_2533=float2(0.0);
ssGlobals l9_2534=l9_2529;
float2 l9_2535;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_2536=float2(0.0);
float2 l9_2537=float2(0.0);
float2 l9_2538=float2(0.0);
float2 l9_2539=float2(0.0);
float2 l9_2540=float2(0.0);
ssGlobals l9_2541=l9_2534;
float2 l9_2542;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2543=float2(0.0);
l9_2543=l9_2541.Surface_UVCoord0;
l9_2537=l9_2543;
l9_2542=l9_2537;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2544=float2(0.0);
l9_2544=l9_2541.Surface_UVCoord1;
l9_2538=l9_2544;
l9_2542=l9_2538;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2545=float2(0.0);
l9_2545=l9_2541.gScreenCoord;
l9_2539=l9_2545;
l9_2542=l9_2539;
}
else
{
float2 l9_2546=float2(0.0);
l9_2546=l9_2541.Surface_UVCoord0;
l9_2540=l9_2546;
l9_2542=l9_2540;
}
}
}
l9_2536=l9_2542;
float2 l9_2547=float2(0.0);
float2 l9_2548=(*sc_set0.UserUniforms).uv2Scale;
l9_2547=l9_2548;
float2 l9_2549=float2(0.0);
l9_2549=l9_2547;
float2 l9_2550=float2(0.0);
float2 l9_2551=(*sc_set0.UserUniforms).uv2Offset;
l9_2550=l9_2551;
float2 l9_2552=float2(0.0);
l9_2552=l9_2550;
float2 l9_2553=float2(0.0);
l9_2553=(l9_2536*l9_2549)+l9_2552;
float2 l9_2554=float2(0.0);
l9_2554=l9_2553+(l9_2552*(l9_2534.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_2532=l9_2554;
l9_2535=l9_2532;
}
else
{
float2 l9_2555=float2(0.0);
float2 l9_2556=float2(0.0);
float2 l9_2557=float2(0.0);
float2 l9_2558=float2(0.0);
float2 l9_2559=float2(0.0);
ssGlobals l9_2560=l9_2534;
float2 l9_2561;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_2562=float2(0.0);
l9_2562=l9_2560.Surface_UVCoord0;
l9_2556=l9_2562;
l9_2561=l9_2556;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_2563=float2(0.0);
l9_2563=l9_2560.Surface_UVCoord1;
l9_2557=l9_2563;
l9_2561=l9_2557;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_2564=float2(0.0);
l9_2564=l9_2560.gScreenCoord;
l9_2558=l9_2564;
l9_2561=l9_2558;
}
else
{
float2 l9_2565=float2(0.0);
l9_2565=l9_2560.Surface_UVCoord0;
l9_2559=l9_2565;
l9_2561=l9_2559;
}
}
}
l9_2555=l9_2561;
float2 l9_2566=float2(0.0);
float2 l9_2567=(*sc_set0.UserUniforms).uv2Scale;
l9_2566=l9_2567;
float2 l9_2568=float2(0.0);
l9_2568=l9_2566;
float2 l9_2569=float2(0.0);
float2 l9_2570=(*sc_set0.UserUniforms).uv2Offset;
l9_2569=l9_2570;
float2 l9_2571=float2(0.0);
l9_2571=l9_2569;
float2 l9_2572=float2(0.0);
l9_2572=(l9_2555*l9_2568)+l9_2571;
l9_2533=l9_2572;
l9_2535=l9_2533;
}
l9_2531=l9_2535;
l9_2527=l9_2531;
l9_2530=l9_2527;
}
else
{
float2 l9_2573=float2(0.0);
l9_2573=l9_2529.Surface_UVCoord0;
l9_2528=l9_2573;
l9_2530=l9_2528;
}
l9_2526=l9_2530;
float2 l9_2574=float2(0.0);
l9_2574=l9_2526;
float2 l9_2575=float2(0.0);
l9_2575=l9_2574;
l9_2519=l9_2575;
l9_2522=l9_2519;
}
else
{
float2 l9_2576=float2(0.0);
l9_2576=l9_2521.Surface_UVCoord0;
l9_2520=l9_2576;
l9_2522=l9_2520;
}
}
}
}
l9_2515=l9_2522;
float2 l9_2577=float2(0.0);
float2 l9_2578=(*sc_set0.UserUniforms).uv3Scale;
l9_2577=l9_2578;
float2 l9_2579=float2(0.0);
l9_2579=l9_2577;
float2 l9_2580=float2(0.0);
float2 l9_2581=(*sc_set0.UserUniforms).uv3Offset;
l9_2580=l9_2581;
float2 l9_2582=float2(0.0);
l9_2582=l9_2580;
float2 l9_2583=float2(0.0);
l9_2583=(l9_2515*l9_2579)+l9_2582;
l9_2442=l9_2583;
l9_2444=l9_2442;
}
l9_2440=l9_2444;
l9_2436=l9_2440;
l9_2439=l9_2436;
}
else
{
float2 l9_2584=float2(0.0);
l9_2584=l9_2438.Surface_UVCoord0;
l9_2437=l9_2584;
l9_2439=l9_2437;
}
l9_2435=l9_2439;
float2 l9_2585=float2(0.0);
l9_2585=l9_2435;
float2 l9_2586=float2(0.0);
l9_2586=l9_2585;
l9_2379=l9_2586;
l9_2382=l9_2379;
}
else
{
float2 l9_2587=float2(0.0);
l9_2587=l9_2381.Surface_UVCoord0;
l9_2380=l9_2587;
l9_2382=l9_2380;
}
}
}
}
l9_2375=l9_2382;
float4 l9_2588=float4(0.0);
float2 l9_2589=l9_2375;
int l9_2590;
if ((int(detailNormalTexHasSwappedViews_tmp)!=0))
{
int l9_2591=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2591=0;
}
else
{
l9_2591=in.varStereoViewID;
}
int l9_2592=l9_2591;
l9_2590=1-l9_2592;
}
else
{
int l9_2593=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2593=0;
}
else
{
l9_2593=in.varStereoViewID;
}
int l9_2594=l9_2593;
l9_2590=l9_2594;
}
int l9_2595=l9_2590;
int l9_2596=detailNormalTexLayout_tmp;
int l9_2597=l9_2595;
float2 l9_2598=l9_2589;
bool l9_2599=(int(SC_USE_UV_TRANSFORM_detailNormalTex_tmp)!=0);
float3x3 l9_2600=(*sc_set0.UserUniforms).detailNormalTexTransform;
int2 l9_2601=int2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex_tmp);
bool l9_2602=(int(SC_USE_UV_MIN_MAX_detailNormalTex_tmp)!=0);
float4 l9_2603=(*sc_set0.UserUniforms).detailNormalTexUvMinMax;
bool l9_2604=(int(SC_USE_CLAMP_TO_BORDER_detailNormalTex_tmp)!=0);
float4 l9_2605=(*sc_set0.UserUniforms).detailNormalTexBorderColor;
float l9_2606=0.0;
bool l9_2607=l9_2604&&(!l9_2602);
float l9_2608=1.0;
float l9_2609=l9_2598.x;
int l9_2610=l9_2601.x;
if (l9_2610==1)
{
l9_2609=fract(l9_2609);
}
else
{
if (l9_2610==2)
{
float l9_2611=fract(l9_2609);
float l9_2612=l9_2609-l9_2611;
float l9_2613=step(0.25,fract(l9_2612*0.5));
l9_2609=mix(l9_2611,1.0-l9_2611,fast::clamp(l9_2613,0.0,1.0));
}
}
l9_2598.x=l9_2609;
float l9_2614=l9_2598.y;
int l9_2615=l9_2601.y;
if (l9_2615==1)
{
l9_2614=fract(l9_2614);
}
else
{
if (l9_2615==2)
{
float l9_2616=fract(l9_2614);
float l9_2617=l9_2614-l9_2616;
float l9_2618=step(0.25,fract(l9_2617*0.5));
l9_2614=mix(l9_2616,1.0-l9_2616,fast::clamp(l9_2618,0.0,1.0));
}
}
l9_2598.y=l9_2614;
if (l9_2602)
{
bool l9_2619=l9_2604;
bool l9_2620;
if (l9_2619)
{
l9_2620=l9_2601.x==3;
}
else
{
l9_2620=l9_2619;
}
float l9_2621=l9_2598.x;
float l9_2622=l9_2603.x;
float l9_2623=l9_2603.z;
bool l9_2624=l9_2620;
float l9_2625=l9_2608;
float l9_2626=fast::clamp(l9_2621,l9_2622,l9_2623);
float l9_2627=step(abs(l9_2621-l9_2626),9.9999997e-06);
l9_2625*=(l9_2627+((1.0-float(l9_2624))*(1.0-l9_2627)));
l9_2621=l9_2626;
l9_2598.x=l9_2621;
l9_2608=l9_2625;
bool l9_2628=l9_2604;
bool l9_2629;
if (l9_2628)
{
l9_2629=l9_2601.y==3;
}
else
{
l9_2629=l9_2628;
}
float l9_2630=l9_2598.y;
float l9_2631=l9_2603.y;
float l9_2632=l9_2603.w;
bool l9_2633=l9_2629;
float l9_2634=l9_2608;
float l9_2635=fast::clamp(l9_2630,l9_2631,l9_2632);
float l9_2636=step(abs(l9_2630-l9_2635),9.9999997e-06);
l9_2634*=(l9_2636+((1.0-float(l9_2633))*(1.0-l9_2636)));
l9_2630=l9_2635;
l9_2598.y=l9_2630;
l9_2608=l9_2634;
}
float2 l9_2637=l9_2598;
bool l9_2638=l9_2599;
float3x3 l9_2639=l9_2600;
if (l9_2638)
{
l9_2637=float2((l9_2639*float3(l9_2637,1.0)).xy);
}
float2 l9_2640=l9_2637;
l9_2598=l9_2640;
float l9_2641=l9_2598.x;
int l9_2642=l9_2601.x;
bool l9_2643=l9_2607;
float l9_2644=l9_2608;
if ((l9_2642==0)||(l9_2642==3))
{
float l9_2645=l9_2641;
float l9_2646=0.0;
float l9_2647=1.0;
bool l9_2648=l9_2643;
float l9_2649=l9_2644;
float l9_2650=fast::clamp(l9_2645,l9_2646,l9_2647);
float l9_2651=step(abs(l9_2645-l9_2650),9.9999997e-06);
l9_2649*=(l9_2651+((1.0-float(l9_2648))*(1.0-l9_2651)));
l9_2645=l9_2650;
l9_2641=l9_2645;
l9_2644=l9_2649;
}
l9_2598.x=l9_2641;
l9_2608=l9_2644;
float l9_2652=l9_2598.y;
int l9_2653=l9_2601.y;
bool l9_2654=l9_2607;
float l9_2655=l9_2608;
if ((l9_2653==0)||(l9_2653==3))
{
float l9_2656=l9_2652;
float l9_2657=0.0;
float l9_2658=1.0;
bool l9_2659=l9_2654;
float l9_2660=l9_2655;
float l9_2661=fast::clamp(l9_2656,l9_2657,l9_2658);
float l9_2662=step(abs(l9_2656-l9_2661),9.9999997e-06);
l9_2660*=(l9_2662+((1.0-float(l9_2659))*(1.0-l9_2662)));
l9_2656=l9_2661;
l9_2652=l9_2656;
l9_2655=l9_2660;
}
l9_2598.y=l9_2652;
l9_2608=l9_2655;
float2 l9_2663=l9_2598;
int l9_2664=l9_2596;
int l9_2665=l9_2597;
float l9_2666=l9_2606;
float2 l9_2667=l9_2663;
int l9_2668=l9_2664;
int l9_2669=l9_2665;
float3 l9_2670=float3(0.0);
if (l9_2668==0)
{
l9_2670=float3(l9_2667,0.0);
}
else
{
if (l9_2668==1)
{
l9_2670=float3(l9_2667.x,(l9_2667.y*0.5)+(0.5-(float(l9_2669)*0.5)),0.0);
}
else
{
l9_2670=float3(l9_2667,float(l9_2669));
}
}
float3 l9_2671=l9_2670;
float3 l9_2672=l9_2671;
float4 l9_2673=sc_set0.detailNormalTex.sample(sc_set0.detailNormalTexSmpSC,l9_2672.xy,bias(l9_2666));
float4 l9_2674=l9_2673;
if (l9_2604)
{
l9_2674=mix(l9_2605,l9_2674,float4(l9_2608));
}
float4 l9_2675=l9_2674;
float4 l9_2676=l9_2675;
float3 l9_2677=(l9_2676.xyz*1.9921875)-float3(1.0);
l9_2676=float4(l9_2677.x,l9_2677.y,l9_2677.z,l9_2676.w);
l9_2588=l9_2676;
l9_2371=l9_2588.xyz;
l9_2374=l9_2371;
}
else
{
l9_2374=l9_2372;
}
l9_2370=l9_2374;
float3 l9_2678=float3(0.0);
float3 l9_2679=l9_2280.xyz;
float l9_2680=(*sc_set0.UserUniforms).Port_Strength1_N200;
float3 l9_2681=l9_2370;
float l9_2682=(*sc_set0.UserUniforms).Port_Strength2_N200;
float3 l9_2683=l9_2679;
float l9_2684=l9_2680;
float3 l9_2685=l9_2681;
float l9_2686=l9_2682;
float3 l9_2687=mix(float3(0.0,0.0,1.0),l9_2683,float3(l9_2684))+float3(0.0,0.0,1.0);
float3 l9_2688=mix(float3(0.0,0.0,1.0),l9_2685,float3(l9_2686))*float3(-1.0,-1.0,1.0);
float3 l9_2689=normalize((l9_2687*dot(l9_2687,l9_2688))-(l9_2688*l9_2687.z));
l9_2681=l9_2689;
float3 l9_2690=l9_2681;
l9_2678=l9_2690;
float3 l9_2691=float3(0.0);
l9_2691=l9_2066*l9_2678;
float3 l9_2692=float3(0.0);
float3 l9_2693=l9_2691;
float l9_2694=dot(l9_2693,l9_2693);
float l9_2695;
if (l9_2694>0.0)
{
l9_2695=1.0/sqrt(l9_2694);
}
else
{
l9_2695=0.0;
}
float l9_2696=l9_2695;
float3 l9_2697=l9_2693*l9_2696;
l9_2692=l9_2697;
param_22=l9_2692;
param_24=param_22;
}
else
{
float3 l9_2698=float3(0.0);
l9_2698=param_25.VertexNormal_WorldSpace;
float3 l9_2699=float3(0.0);
float3 l9_2700=l9_2698;
float l9_2701=dot(l9_2700,l9_2700);
float l9_2702;
if (l9_2701>0.0)
{
l9_2702=1.0/sqrt(l9_2701);
}
else
{
l9_2702=0.0;
}
float l9_2703=l9_2702;
float3 l9_2704=l9_2700*l9_2703;
l9_2699=l9_2704;
param_23=l9_2699;
param_24=param_23;
}
Result_N337=param_24;
float3 Export_N334=float3(0.0);
Export_N334=Result_N337;
float4 Output_N36=float4(0.0);
float3 param_26=Export_N364.xyz;
float param_27=Export_N158;
float3 param_28=Export_N334;
float3 param_29=(*sc_set0.UserUniforms).Port_Emissive_N036;
float3 param_30=(*sc_set0.UserUniforms).Port_AO_N036;
ssGlobals param_32=Globals;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_32.BumpedNormal=param_28;
}
param_27=fast::clamp(param_27,0.0,1.0);
float l9_2705=param_27;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_2705<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_2706=gl_FragCoord;
float2 l9_2707=floor(mod(l9_2706.xy,float2(4.0)));
float l9_2708=(mod(dot(l9_2707,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_2705<l9_2708)
{
discard_fragment();
}
}
param_26=fast::max(param_26,float3(0.0));
float4 param_31;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_31=float4(param_26,param_27);
}
else
{
float l9_2709=0.0;
float l9_2710=1.0;
float3 l9_2711=float3(1.0);
float3 l9_2712=param_26;
float l9_2713=param_27;
float3 l9_2714=param_32.BumpedNormal;
float3 l9_2715=param_32.PositionWS;
float3 l9_2716=param_32.ViewDirWS;
float3 l9_2717=param_29;
float l9_2718=l9_2709;
float l9_2719=l9_2710;
float3 l9_2720=param_30;
float3 l9_2721=l9_2711;
param_31=ngsCalculateLighting(l9_2712,l9_2713,l9_2714,l9_2715,l9_2716,l9_2717,l9_2718,l9_2719,l9_2720,l9_2721,in.varStereoViewID,sc_set0.sc_EnvmapDiffuse,sc_set0.sc_EnvmapDiffuseSmpSC,sc_set0.sc_EnvmapSpecular,sc_set0.sc_EnvmapSpecularSmpSC,sc_set0.sc_ScreenTexture,sc_set0.sc_ScreenTextureSmpSC,sc_set0.sc_RayTracingGlobalIllumination,sc_set0.sc_RayTracingGlobalIlluminationSmpSC,sc_set0.sc_RayTracingShadows,sc_set0.sc_RayTracingShadowsSmpSC,gl_FragCoord,(*sc_set0.UserUniforms),in.varShadowTex,sc_set0.sc_ShadowTexture,sc_set0.sc_ShadowTextureSmpSC,out.sc_FragData0,sc_set0.sc_SSAOTexture,sc_set0.sc_SSAOTextureSmpSC);
}
param_31=fast::max(param_31,float4(0.0));
Output_N36=param_31;
float Output_N106=0.0;
float param_33=1.0;
float param_34=1.0;
float param_35=0.0;
ssGlobals param_37=Globals;
float2 l9_2722=float2(0.0);
l9_2722=param_37.Surface_UVCoord0;
float l9_2723=0.0;
float2 l9_2724=l9_2722;
float l9_2725=l9_2724.x;
l9_2723=l9_2725;
float l9_2726=0.0;
float l9_2727=(*sc_set0.UserUniforms).Level;
l9_2726=l9_2727;
float l9_2728=0.0;
l9_2728=float(l9_2723<l9_2726);
param_33=l9_2728;
float param_36;
if ((param_33*1.0)!=0.0)
{
float l9_2729=0.0;
float l9_2730=(*sc_set0.UserUniforms).innerColorMultiplier;
l9_2729=l9_2730;
param_34=l9_2729;
param_36=param_34;
}
else
{
float l9_2731=0.0;
float l9_2732=(*sc_set0.UserUniforms).outerColorMultiplier;
l9_2731=l9_2732;
param_35=l9_2731;
param_36=param_35;
}
Output_N106=param_36;
float Output_N97=0.0;
Output_N97=Output_N106+1.0;
float4 Output_N102=float4(0.0);
Output_N102=Output_N36*float4(Output_N97);
float Value4_N103=0.0;
float4 param_38=Output_N36;
float param_39=param_38.w;
Value4_N103=param_39;
float4 Value_N104=float4(0.0);
Value_N104=float4(Output_N102.xyz.x,Output_N102.xyz.y,Output_N102.xyz.z,Value_N104.w);
Value_N104.w=Value4_N103;
FinalColor=Value_N104;
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param_40=FinalColor;
if ((int(sc_RayTracingCasterForceOpaque_tmp)!=0))
{
param_40.w=1.0;
}
float4 l9_2733=fast::max(param_40,float4(0.0));
float4 param_41=l9_2733;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_41.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_41;
return out;
}
float4 param_42=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_2734=param_42;
float4 l9_2735=l9_2734;
float l9_2736=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_2736=l9_2735.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_2736=fast::clamp(l9_2735.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_2736=fast::clamp(dot(l9_2735.xyz,float3(l9_2735.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_2736=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_2736=(1.0-dot(l9_2735.xyz,float3(0.33333001)))*l9_2735.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_2736=(1.0-fast::clamp(dot(l9_2735.xyz,float3(1.0)),0.0,1.0))*l9_2735.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_2736=fast::clamp(dot(l9_2735.xyz,float3(1.0)),0.0,1.0)*l9_2735.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_2736=fast::clamp(dot(l9_2735.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_2736=fast::clamp(dot(l9_2735.xyz,float3(1.0)),0.0,1.0)*l9_2735.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_2736=dot(l9_2735.xyz,float3(0.33333001))*l9_2735.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_2736=1.0-fast::clamp(dot(l9_2735.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_2736=fast::clamp(dot(l9_2735.xyz,float3(1.0)),0.0,1.0);
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
float l9_2737=l9_2736;
float l9_2738=l9_2737;
float l9_2739=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_2738;
float3 l9_2740=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_2734.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_2741=float4(l9_2740.x,l9_2740.y,l9_2740.z,l9_2739);
param_42=l9_2741;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_42=float4(param_42.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_2742=param_42;
float4 l9_2743=float4(0.0);
float4 l9_2744=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_2745=out.sc_FragData0;
l9_2744=l9_2745;
}
else
{
float4 l9_2746=gl_FragCoord;
float2 l9_2747=l9_2746.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_2748=l9_2747;
float2 l9_2749=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_2750=1;
int l9_2751=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2751=0;
}
else
{
l9_2751=in.varStereoViewID;
}
int l9_2752=l9_2751;
int l9_2753=l9_2752;
float3 l9_2754=float3(l9_2748,0.0);
int l9_2755=l9_2750;
int l9_2756=l9_2753;
if (l9_2755==1)
{
l9_2754.y=((2.0*l9_2754.y)+float(l9_2756))-1.0;
}
float2 l9_2757=l9_2754.xy;
l9_2749=l9_2757;
}
else
{
l9_2749=l9_2748;
}
float2 l9_2758=l9_2749;
float2 l9_2759=l9_2758;
float2 l9_2760=l9_2759;
float2 l9_2761=l9_2760;
float l9_2762=0.0;
int l9_2763;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_2764=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2764=0;
}
else
{
l9_2764=in.varStereoViewID;
}
int l9_2765=l9_2764;
l9_2763=1-l9_2765;
}
else
{
int l9_2766=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_2766=0;
}
else
{
l9_2766=in.varStereoViewID;
}
int l9_2767=l9_2766;
l9_2763=l9_2767;
}
int l9_2768=l9_2763;
float2 l9_2769=l9_2761;
int l9_2770=sc_ScreenTextureLayout_tmp;
int l9_2771=l9_2768;
float l9_2772=l9_2762;
float2 l9_2773=l9_2769;
int l9_2774=l9_2770;
int l9_2775=l9_2771;
float3 l9_2776=float3(0.0);
if (l9_2774==0)
{
l9_2776=float3(l9_2773,0.0);
}
else
{
if (l9_2774==1)
{
l9_2776=float3(l9_2773.x,(l9_2773.y*0.5)+(0.5-(float(l9_2775)*0.5)),0.0);
}
else
{
l9_2776=float3(l9_2773,float(l9_2775));
}
}
float3 l9_2777=l9_2776;
float3 l9_2778=l9_2777;
float4 l9_2779=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_2778.xy,bias(l9_2772));
float4 l9_2780=l9_2779;
float4 l9_2781=l9_2780;
l9_2744=l9_2781;
}
float4 l9_2782=l9_2744;
float3 l9_2783=l9_2782.xyz;
float3 l9_2784=l9_2783;
float3 l9_2785=l9_2742.xyz;
float3 l9_2786=definedBlend(l9_2784,l9_2785,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_2743=float4(l9_2786.x,l9_2786.y,l9_2786.z,l9_2743.w);
float3 l9_2787=mix(l9_2783,l9_2743.xyz,float3(l9_2742.w));
l9_2743=float4(l9_2787.x,l9_2787.y,l9_2787.z,l9_2743.w);
l9_2743.w=1.0;
float4 l9_2788=l9_2743;
param_42=l9_2788;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_2789=float4(in.varScreenPos.xyz,1.0);
param_42=l9_2789;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_2790=gl_FragCoord;
float l9_2791=fast::clamp(abs(l9_2790.z),0.0,1.0);
float4 l9_2792=float4(l9_2791,1.0-l9_2791,1.0,1.0);
param_42=l9_2792;
}
else
{
float4 l9_2793=param_42;
float4 l9_2794=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_2794=float4(mix(float3(1.0),l9_2793.xyz,float3(l9_2793.w)),l9_2793.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_2795=l9_2793.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_2795=fast::clamp(l9_2795,0.0,1.0);
}
l9_2794=float4(l9_2793.xyz*l9_2795,l9_2795);
}
else
{
l9_2794=l9_2793;
}
}
float4 l9_2796=l9_2794;
param_42=l9_2796;
}
}
}
}
}
float4 l9_2797=param_42;
FinalColor=l9_2797;
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
float4 l9_2798=float4(0.0);
l9_2798=float4(0.0);
float4 l9_2799=l9_2798;
float4 Cost=l9_2799;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_43=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_43,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_44=FinalColor;
float4 l9_2800=param_44;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_2800.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_2800;
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
float Level;
float4 innerColor1;
float4 innerColor2;
float4 outerColor1;
float4 outerColor2;
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
float innerColorMultiplier;
float outerColorMultiplier;
float4 Port_Import_N042;
float Port_Input1_N044;
float Port_Import_N088;
float3 Port_Import_N089;
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
float4 Output_N70=float4(0.0);
float param=1.0;
float4 param_1=float4(1.0);
float4 param_2=float4(0.0);
ssGlobals param_4=Globals;
float2 l9_14=float2(0.0);
l9_14=param_4.Surface_UVCoord0;
float l9_15=0.0;
float2 l9_16=l9_14;
float l9_17=l9_16.x;
l9_15=l9_17;
float l9_18=0.0;
float l9_19=(*sc_set0.UserUniforms).Level;
l9_18=l9_19;
float l9_20=0.0;
l9_20=float(l9_15<l9_18);
param=l9_20;
float4 param_3;
if ((param*1.0)!=0.0)
{
float4 l9_21=float4(0.0);
float4 l9_22=(*sc_set0.UserUniforms).innerColor1;
l9_21=l9_22;
float4 l9_23=float4(0.0);
float4 l9_24=(*sc_set0.UserUniforms).innerColor2;
l9_23=l9_24;
float2 l9_25=float2(0.0);
l9_25=param_4.Surface_UVCoord0;
float l9_26=0.0;
float2 l9_27=l9_25;
float l9_28=l9_27.y;
l9_26=l9_28;
float4 l9_29=float4(0.0);
l9_29=mix(l9_21,l9_23,float4(l9_26));
param_1=l9_29;
param_3=param_1;
}
else
{
float4 l9_30=float4(0.0);
float4 l9_31=(*sc_set0.UserUniforms).outerColor1;
l9_30=l9_31;
float4 l9_32=float4(0.0);
float4 l9_33=(*sc_set0.UserUniforms).outerColor2;
l9_32=l9_33;
float2 l9_34=float2(0.0);
l9_34=param_4.Surface_UVCoord0;
float l9_35=0.0;
float2 l9_36=l9_34;
float l9_37=l9_36.y;
l9_35=l9_37;
float4 l9_38=float4(0.0);
l9_38=mix(l9_30,l9_32,float4(l9_35));
param_2=l9_38;
param_3=param_2;
}
Output_N70=param_3;
float4 Value_N384=float4(0.0);
Value_N384=Output_N70;
float4 Result_N369=float4(0.0);
float4 param_5=float4(0.0);
float4 param_6=(*sc_set0.UserUniforms).Port_Default_N369;
ssGlobals param_8=Globals;
float4 param_7;
if ((int(ENABLE_BASE_TEX_tmp)!=0))
{
float2 l9_39=float2(0.0);
float2 l9_40=float2(0.0);
float2 l9_41=float2(0.0);
float2 l9_42=float2(0.0);
float2 l9_43=float2(0.0);
float2 l9_44=float2(0.0);
ssGlobals l9_45=param_8;
float2 l9_46;
if (NODE_27_DROPLIST_ITEM_tmp==0)
{
float2 l9_47=float2(0.0);
l9_47=l9_45.Surface_UVCoord0;
l9_40=l9_47;
l9_46=l9_40;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==1)
{
float2 l9_48=float2(0.0);
l9_48=l9_45.Surface_UVCoord1;
l9_41=l9_48;
l9_46=l9_41;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==2)
{
float2 l9_49=float2(0.0);
float2 l9_50=float2(0.0);
float2 l9_51=float2(0.0);
ssGlobals l9_52=l9_45;
float2 l9_53;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_54=float2(0.0);
float2 l9_55=float2(0.0);
float2 l9_56=float2(0.0);
ssGlobals l9_57=l9_52;
float2 l9_58;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_59=float2(0.0);
float2 l9_60=float2(0.0);
float2 l9_61=float2(0.0);
float2 l9_62=float2(0.0);
float2 l9_63=float2(0.0);
ssGlobals l9_64=l9_57;
float2 l9_65;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_66=float2(0.0);
l9_66=l9_64.Surface_UVCoord0;
l9_60=l9_66;
l9_65=l9_60;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_67=float2(0.0);
l9_67=l9_64.Surface_UVCoord1;
l9_61=l9_67;
l9_65=l9_61;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_68=float2(0.0);
l9_68=l9_64.gScreenCoord;
l9_62=l9_68;
l9_65=l9_62;
}
else
{
float2 l9_69=float2(0.0);
l9_69=l9_64.Surface_UVCoord0;
l9_63=l9_69;
l9_65=l9_63;
}
}
}
l9_59=l9_65;
float2 l9_70=float2(0.0);
float2 l9_71=(*sc_set0.UserUniforms).uv2Scale;
l9_70=l9_71;
float2 l9_72=float2(0.0);
l9_72=l9_70;
float2 l9_73=float2(0.0);
float2 l9_74=(*sc_set0.UserUniforms).uv2Offset;
l9_73=l9_74;
float2 l9_75=float2(0.0);
l9_75=l9_73;
float2 l9_76=float2(0.0);
l9_76=(l9_59*l9_72)+l9_75;
float2 l9_77=float2(0.0);
l9_77=l9_76+(l9_75*(l9_57.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_55=l9_77;
l9_58=l9_55;
}
else
{
float2 l9_78=float2(0.0);
float2 l9_79=float2(0.0);
float2 l9_80=float2(0.0);
float2 l9_81=float2(0.0);
float2 l9_82=float2(0.0);
ssGlobals l9_83=l9_57;
float2 l9_84;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_85=float2(0.0);
l9_85=l9_83.Surface_UVCoord0;
l9_79=l9_85;
l9_84=l9_79;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_86=float2(0.0);
l9_86=l9_83.Surface_UVCoord1;
l9_80=l9_86;
l9_84=l9_80;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_87=float2(0.0);
l9_87=l9_83.gScreenCoord;
l9_81=l9_87;
l9_84=l9_81;
}
else
{
float2 l9_88=float2(0.0);
l9_88=l9_83.Surface_UVCoord0;
l9_82=l9_88;
l9_84=l9_82;
}
}
}
l9_78=l9_84;
float2 l9_89=float2(0.0);
float2 l9_90=(*sc_set0.UserUniforms).uv2Scale;
l9_89=l9_90;
float2 l9_91=float2(0.0);
l9_91=l9_89;
float2 l9_92=float2(0.0);
float2 l9_93=(*sc_set0.UserUniforms).uv2Offset;
l9_92=l9_93;
float2 l9_94=float2(0.0);
l9_94=l9_92;
float2 l9_95=float2(0.0);
l9_95=(l9_78*l9_91)+l9_94;
l9_56=l9_95;
l9_58=l9_56;
}
l9_54=l9_58;
l9_50=l9_54;
l9_53=l9_50;
}
else
{
float2 l9_96=float2(0.0);
l9_96=l9_52.Surface_UVCoord0;
l9_51=l9_96;
l9_53=l9_51;
}
l9_49=l9_53;
float2 l9_97=float2(0.0);
l9_97=l9_49;
float2 l9_98=float2(0.0);
l9_98=l9_97;
l9_42=l9_98;
l9_46=l9_42;
}
else
{
if (NODE_27_DROPLIST_ITEM_tmp==3)
{
float2 l9_99=float2(0.0);
float2 l9_100=float2(0.0);
float2 l9_101=float2(0.0);
ssGlobals l9_102=l9_45;
float2 l9_103;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_104=float2(0.0);
float2 l9_105=float2(0.0);
float2 l9_106=float2(0.0);
ssGlobals l9_107=l9_102;
float2 l9_108;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_109=float2(0.0);
float2 l9_110=float2(0.0);
float2 l9_111=float2(0.0);
float2 l9_112=float2(0.0);
float2 l9_113=float2(0.0);
float2 l9_114=float2(0.0);
ssGlobals l9_115=l9_107;
float2 l9_116;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_117=float2(0.0);
l9_117=l9_115.Surface_UVCoord0;
l9_110=l9_117;
l9_116=l9_110;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_118=float2(0.0);
l9_118=l9_115.Surface_UVCoord1;
l9_111=l9_118;
l9_116=l9_111;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_119=float2(0.0);
l9_119=l9_115.gScreenCoord;
l9_112=l9_119;
l9_116=l9_112;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_120=float2(0.0);
float2 l9_121=float2(0.0);
float2 l9_122=float2(0.0);
ssGlobals l9_123=l9_115;
float2 l9_124;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_125=float2(0.0);
float2 l9_126=float2(0.0);
float2 l9_127=float2(0.0);
ssGlobals l9_128=l9_123;
float2 l9_129;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_130=float2(0.0);
float2 l9_131=float2(0.0);
float2 l9_132=float2(0.0);
float2 l9_133=float2(0.0);
float2 l9_134=float2(0.0);
ssGlobals l9_135=l9_128;
float2 l9_136;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_137=float2(0.0);
l9_137=l9_135.Surface_UVCoord0;
l9_131=l9_137;
l9_136=l9_131;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_138=float2(0.0);
l9_138=l9_135.Surface_UVCoord1;
l9_132=l9_138;
l9_136=l9_132;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_139=float2(0.0);
l9_139=l9_135.gScreenCoord;
l9_133=l9_139;
l9_136=l9_133;
}
else
{
float2 l9_140=float2(0.0);
l9_140=l9_135.Surface_UVCoord0;
l9_134=l9_140;
l9_136=l9_134;
}
}
}
l9_130=l9_136;
float2 l9_141=float2(0.0);
float2 l9_142=(*sc_set0.UserUniforms).uv2Scale;
l9_141=l9_142;
float2 l9_143=float2(0.0);
l9_143=l9_141;
float2 l9_144=float2(0.0);
float2 l9_145=(*sc_set0.UserUniforms).uv2Offset;
l9_144=l9_145;
float2 l9_146=float2(0.0);
l9_146=l9_144;
float2 l9_147=float2(0.0);
l9_147=(l9_130*l9_143)+l9_146;
float2 l9_148=float2(0.0);
l9_148=l9_147+(l9_146*(l9_128.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_126=l9_148;
l9_129=l9_126;
}
else
{
float2 l9_149=float2(0.0);
float2 l9_150=float2(0.0);
float2 l9_151=float2(0.0);
float2 l9_152=float2(0.0);
float2 l9_153=float2(0.0);
ssGlobals l9_154=l9_128;
float2 l9_155;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_156=float2(0.0);
l9_156=l9_154.Surface_UVCoord0;
l9_150=l9_156;
l9_155=l9_150;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_157=float2(0.0);
l9_157=l9_154.Surface_UVCoord1;
l9_151=l9_157;
l9_155=l9_151;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_158=float2(0.0);
l9_158=l9_154.gScreenCoord;
l9_152=l9_158;
l9_155=l9_152;
}
else
{
float2 l9_159=float2(0.0);
l9_159=l9_154.Surface_UVCoord0;
l9_153=l9_159;
l9_155=l9_153;
}
}
}
l9_149=l9_155;
float2 l9_160=float2(0.0);
float2 l9_161=(*sc_set0.UserUniforms).uv2Scale;
l9_160=l9_161;
float2 l9_162=float2(0.0);
l9_162=l9_160;
float2 l9_163=float2(0.0);
float2 l9_164=(*sc_set0.UserUniforms).uv2Offset;
l9_163=l9_164;
float2 l9_165=float2(0.0);
l9_165=l9_163;
float2 l9_166=float2(0.0);
l9_166=(l9_149*l9_162)+l9_165;
l9_127=l9_166;
l9_129=l9_127;
}
l9_125=l9_129;
l9_121=l9_125;
l9_124=l9_121;
}
else
{
float2 l9_167=float2(0.0);
l9_167=l9_123.Surface_UVCoord0;
l9_122=l9_167;
l9_124=l9_122;
}
l9_120=l9_124;
float2 l9_168=float2(0.0);
l9_168=l9_120;
float2 l9_169=float2(0.0);
l9_169=l9_168;
l9_113=l9_169;
l9_116=l9_113;
}
else
{
float2 l9_170=float2(0.0);
l9_170=l9_115.Surface_UVCoord0;
l9_114=l9_170;
l9_116=l9_114;
}
}
}
}
l9_109=l9_116;
float2 l9_171=float2(0.0);
float2 l9_172=(*sc_set0.UserUniforms).uv3Scale;
l9_171=l9_172;
float2 l9_173=float2(0.0);
l9_173=l9_171;
float2 l9_174=float2(0.0);
float2 l9_175=(*sc_set0.UserUniforms).uv3Offset;
l9_174=l9_175;
float2 l9_176=float2(0.0);
l9_176=l9_174;
float2 l9_177=float2(0.0);
l9_177=(l9_109*l9_173)+l9_176;
float2 l9_178=float2(0.0);
l9_178=l9_177+(l9_176*(l9_107.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_105=l9_178;
l9_108=l9_105;
}
else
{
float2 l9_179=float2(0.0);
float2 l9_180=float2(0.0);
float2 l9_181=float2(0.0);
float2 l9_182=float2(0.0);
float2 l9_183=float2(0.0);
float2 l9_184=float2(0.0);
ssGlobals l9_185=l9_107;
float2 l9_186;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_187=float2(0.0);
l9_187=l9_185.Surface_UVCoord0;
l9_180=l9_187;
l9_186=l9_180;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_188=float2(0.0);
l9_188=l9_185.Surface_UVCoord1;
l9_181=l9_188;
l9_186=l9_181;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_189=float2(0.0);
l9_189=l9_185.gScreenCoord;
l9_182=l9_189;
l9_186=l9_182;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_190=float2(0.0);
float2 l9_191=float2(0.0);
float2 l9_192=float2(0.0);
ssGlobals l9_193=l9_185;
float2 l9_194;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_195=float2(0.0);
float2 l9_196=float2(0.0);
float2 l9_197=float2(0.0);
ssGlobals l9_198=l9_193;
float2 l9_199;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_200=float2(0.0);
float2 l9_201=float2(0.0);
float2 l9_202=float2(0.0);
float2 l9_203=float2(0.0);
float2 l9_204=float2(0.0);
ssGlobals l9_205=l9_198;
float2 l9_206;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_207=float2(0.0);
l9_207=l9_205.Surface_UVCoord0;
l9_201=l9_207;
l9_206=l9_201;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_208=float2(0.0);
l9_208=l9_205.Surface_UVCoord1;
l9_202=l9_208;
l9_206=l9_202;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_209=float2(0.0);
l9_209=l9_205.gScreenCoord;
l9_203=l9_209;
l9_206=l9_203;
}
else
{
float2 l9_210=float2(0.0);
l9_210=l9_205.Surface_UVCoord0;
l9_204=l9_210;
l9_206=l9_204;
}
}
}
l9_200=l9_206;
float2 l9_211=float2(0.0);
float2 l9_212=(*sc_set0.UserUniforms).uv2Scale;
l9_211=l9_212;
float2 l9_213=float2(0.0);
l9_213=l9_211;
float2 l9_214=float2(0.0);
float2 l9_215=(*sc_set0.UserUniforms).uv2Offset;
l9_214=l9_215;
float2 l9_216=float2(0.0);
l9_216=l9_214;
float2 l9_217=float2(0.0);
l9_217=(l9_200*l9_213)+l9_216;
float2 l9_218=float2(0.0);
l9_218=l9_217+(l9_216*(l9_198.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_196=l9_218;
l9_199=l9_196;
}
else
{
float2 l9_219=float2(0.0);
float2 l9_220=float2(0.0);
float2 l9_221=float2(0.0);
float2 l9_222=float2(0.0);
float2 l9_223=float2(0.0);
ssGlobals l9_224=l9_198;
float2 l9_225;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_226=float2(0.0);
l9_226=l9_224.Surface_UVCoord0;
l9_220=l9_226;
l9_225=l9_220;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_227=float2(0.0);
l9_227=l9_224.Surface_UVCoord1;
l9_221=l9_227;
l9_225=l9_221;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_228=float2(0.0);
l9_228=l9_224.gScreenCoord;
l9_222=l9_228;
l9_225=l9_222;
}
else
{
float2 l9_229=float2(0.0);
l9_229=l9_224.Surface_UVCoord0;
l9_223=l9_229;
l9_225=l9_223;
}
}
}
l9_219=l9_225;
float2 l9_230=float2(0.0);
float2 l9_231=(*sc_set0.UserUniforms).uv2Scale;
l9_230=l9_231;
float2 l9_232=float2(0.0);
l9_232=l9_230;
float2 l9_233=float2(0.0);
float2 l9_234=(*sc_set0.UserUniforms).uv2Offset;
l9_233=l9_234;
float2 l9_235=float2(0.0);
l9_235=l9_233;
float2 l9_236=float2(0.0);
l9_236=(l9_219*l9_232)+l9_235;
l9_197=l9_236;
l9_199=l9_197;
}
l9_195=l9_199;
l9_191=l9_195;
l9_194=l9_191;
}
else
{
float2 l9_237=float2(0.0);
l9_237=l9_193.Surface_UVCoord0;
l9_192=l9_237;
l9_194=l9_192;
}
l9_190=l9_194;
float2 l9_238=float2(0.0);
l9_238=l9_190;
float2 l9_239=float2(0.0);
l9_239=l9_238;
l9_183=l9_239;
l9_186=l9_183;
}
else
{
float2 l9_240=float2(0.0);
l9_240=l9_185.Surface_UVCoord0;
l9_184=l9_240;
l9_186=l9_184;
}
}
}
}
l9_179=l9_186;
float2 l9_241=float2(0.0);
float2 l9_242=(*sc_set0.UserUniforms).uv3Scale;
l9_241=l9_242;
float2 l9_243=float2(0.0);
l9_243=l9_241;
float2 l9_244=float2(0.0);
float2 l9_245=(*sc_set0.UserUniforms).uv3Offset;
l9_244=l9_245;
float2 l9_246=float2(0.0);
l9_246=l9_244;
float2 l9_247=float2(0.0);
l9_247=(l9_179*l9_243)+l9_246;
l9_106=l9_247;
l9_108=l9_106;
}
l9_104=l9_108;
l9_100=l9_104;
l9_103=l9_100;
}
else
{
float2 l9_248=float2(0.0);
l9_248=l9_102.Surface_UVCoord0;
l9_101=l9_248;
l9_103=l9_101;
}
l9_99=l9_103;
float2 l9_249=float2(0.0);
l9_249=l9_99;
float2 l9_250=float2(0.0);
l9_250=l9_249;
l9_43=l9_250;
l9_46=l9_43;
}
else
{
float2 l9_251=float2(0.0);
l9_251=l9_45.Surface_UVCoord0;
l9_44=l9_251;
l9_46=l9_44;
}
}
}
}
l9_39=l9_46;
float4 l9_252=float4(0.0);
int l9_253;
if ((int(baseTexHasSwappedViews_tmp)!=0))
{
int l9_254=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_254=0;
}
else
{
l9_254=in.varStereoViewID;
}
int l9_255=l9_254;
l9_253=1-l9_255;
}
else
{
int l9_256=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_256=0;
}
else
{
l9_256=in.varStereoViewID;
}
int l9_257=l9_256;
l9_253=l9_257;
}
int l9_258=l9_253;
int l9_259=baseTexLayout_tmp;
int l9_260=l9_258;
float2 l9_261=l9_39;
bool l9_262=(int(SC_USE_UV_TRANSFORM_baseTex_tmp)!=0);
float3x3 l9_263=(*sc_set0.UserUniforms).baseTexTransform;
int2 l9_264=int2(SC_SOFTWARE_WRAP_MODE_U_baseTex_tmp,SC_SOFTWARE_WRAP_MODE_V_baseTex_tmp);
bool l9_265=(int(SC_USE_UV_MIN_MAX_baseTex_tmp)!=0);
float4 l9_266=(*sc_set0.UserUniforms).baseTexUvMinMax;
bool l9_267=(int(SC_USE_CLAMP_TO_BORDER_baseTex_tmp)!=0);
float4 l9_268=(*sc_set0.UserUniforms).baseTexBorderColor;
float l9_269=0.0;
bool l9_270=l9_267&&(!l9_265);
float l9_271=1.0;
float l9_272=l9_261.x;
int l9_273=l9_264.x;
if (l9_273==1)
{
l9_272=fract(l9_272);
}
else
{
if (l9_273==2)
{
float l9_274=fract(l9_272);
float l9_275=l9_272-l9_274;
float l9_276=step(0.25,fract(l9_275*0.5));
l9_272=mix(l9_274,1.0-l9_274,fast::clamp(l9_276,0.0,1.0));
}
}
l9_261.x=l9_272;
float l9_277=l9_261.y;
int l9_278=l9_264.y;
if (l9_278==1)
{
l9_277=fract(l9_277);
}
else
{
if (l9_278==2)
{
float l9_279=fract(l9_277);
float l9_280=l9_277-l9_279;
float l9_281=step(0.25,fract(l9_280*0.5));
l9_277=mix(l9_279,1.0-l9_279,fast::clamp(l9_281,0.0,1.0));
}
}
l9_261.y=l9_277;
if (l9_265)
{
bool l9_282=l9_267;
bool l9_283;
if (l9_282)
{
l9_283=l9_264.x==3;
}
else
{
l9_283=l9_282;
}
float l9_284=l9_261.x;
float l9_285=l9_266.x;
float l9_286=l9_266.z;
bool l9_287=l9_283;
float l9_288=l9_271;
float l9_289=fast::clamp(l9_284,l9_285,l9_286);
float l9_290=step(abs(l9_284-l9_289),9.9999997e-06);
l9_288*=(l9_290+((1.0-float(l9_287))*(1.0-l9_290)));
l9_284=l9_289;
l9_261.x=l9_284;
l9_271=l9_288;
bool l9_291=l9_267;
bool l9_292;
if (l9_291)
{
l9_292=l9_264.y==3;
}
else
{
l9_292=l9_291;
}
float l9_293=l9_261.y;
float l9_294=l9_266.y;
float l9_295=l9_266.w;
bool l9_296=l9_292;
float l9_297=l9_271;
float l9_298=fast::clamp(l9_293,l9_294,l9_295);
float l9_299=step(abs(l9_293-l9_298),9.9999997e-06);
l9_297*=(l9_299+((1.0-float(l9_296))*(1.0-l9_299)));
l9_293=l9_298;
l9_261.y=l9_293;
l9_271=l9_297;
}
float2 l9_300=l9_261;
bool l9_301=l9_262;
float3x3 l9_302=l9_263;
if (l9_301)
{
l9_300=float2((l9_302*float3(l9_300,1.0)).xy);
}
float2 l9_303=l9_300;
l9_261=l9_303;
float l9_304=l9_261.x;
int l9_305=l9_264.x;
bool l9_306=l9_270;
float l9_307=l9_271;
if ((l9_305==0)||(l9_305==3))
{
float l9_308=l9_304;
float l9_309=0.0;
float l9_310=1.0;
bool l9_311=l9_306;
float l9_312=l9_307;
float l9_313=fast::clamp(l9_308,l9_309,l9_310);
float l9_314=step(abs(l9_308-l9_313),9.9999997e-06);
l9_312*=(l9_314+((1.0-float(l9_311))*(1.0-l9_314)));
l9_308=l9_313;
l9_304=l9_308;
l9_307=l9_312;
}
l9_261.x=l9_304;
l9_271=l9_307;
float l9_315=l9_261.y;
int l9_316=l9_264.y;
bool l9_317=l9_270;
float l9_318=l9_271;
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
l9_261.y=l9_315;
l9_271=l9_318;
float2 l9_326=l9_261;
int l9_327=l9_259;
int l9_328=l9_260;
float l9_329=l9_269;
float2 l9_330=l9_326;
int l9_331=l9_327;
int l9_332=l9_328;
float3 l9_333=float3(0.0);
if (l9_331==0)
{
l9_333=float3(l9_330,0.0);
}
else
{
if (l9_331==1)
{
l9_333=float3(l9_330.x,(l9_330.y*0.5)+(0.5-(float(l9_332)*0.5)),0.0);
}
else
{
l9_333=float3(l9_330,float(l9_332));
}
}
float3 l9_334=l9_333;
float3 l9_335=l9_334;
float4 l9_336=sc_set0.baseTex.sample(sc_set0.baseTexSmpSC,l9_335.xy,bias(l9_329));
float4 l9_337=l9_336;
if (l9_267)
{
l9_337=mix(l9_268,l9_337,float4(l9_271));
}
float4 l9_338=l9_337;
l9_252=l9_338;
param_5=l9_252;
param_7=param_5;
}
else
{
param_7=param_6;
}
Result_N369=param_7;
float4 Output_N148=float4(0.0);
Output_N148=Value_N384*Result_N369;
float4 Export_N385=float4(0.0);
Export_N385=Output_N148;
float4 Value_N166=float4(0.0);
Value_N166=Export_N385;
float Output_N168=0.0;
Output_N168=Value_N166.w;
float Result_N204=0.0;
float param_9=0.0;
float param_10=(*sc_set0.UserUniforms).Port_Default_N204;
ssGlobals param_12=Globals;
float param_11;
if ((int(ENABLE_OPACITY_TEX_tmp)!=0))
{
float2 l9_339=float2(0.0);
float2 l9_340=float2(0.0);
float2 l9_341=float2(0.0);
float2 l9_342=float2(0.0);
float2 l9_343=float2(0.0);
float2 l9_344=float2(0.0);
ssGlobals l9_345=param_12;
float2 l9_346;
if (NODE_69_DROPLIST_ITEM_tmp==0)
{
float2 l9_347=float2(0.0);
l9_347=l9_345.Surface_UVCoord0;
l9_340=l9_347;
l9_346=l9_340;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==1)
{
float2 l9_348=float2(0.0);
l9_348=l9_345.Surface_UVCoord1;
l9_341=l9_348;
l9_346=l9_341;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==2)
{
float2 l9_349=float2(0.0);
float2 l9_350=float2(0.0);
float2 l9_351=float2(0.0);
ssGlobals l9_352=l9_345;
float2 l9_353;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_354=float2(0.0);
float2 l9_355=float2(0.0);
float2 l9_356=float2(0.0);
ssGlobals l9_357=l9_352;
float2 l9_358;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_359=float2(0.0);
float2 l9_360=float2(0.0);
float2 l9_361=float2(0.0);
float2 l9_362=float2(0.0);
float2 l9_363=float2(0.0);
ssGlobals l9_364=l9_357;
float2 l9_365;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_366=float2(0.0);
l9_366=l9_364.Surface_UVCoord0;
l9_360=l9_366;
l9_365=l9_360;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_367=float2(0.0);
l9_367=l9_364.Surface_UVCoord1;
l9_361=l9_367;
l9_365=l9_361;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_368=float2(0.0);
l9_368=l9_364.gScreenCoord;
l9_362=l9_368;
l9_365=l9_362;
}
else
{
float2 l9_369=float2(0.0);
l9_369=l9_364.Surface_UVCoord0;
l9_363=l9_369;
l9_365=l9_363;
}
}
}
l9_359=l9_365;
float2 l9_370=float2(0.0);
float2 l9_371=(*sc_set0.UserUniforms).uv2Scale;
l9_370=l9_371;
float2 l9_372=float2(0.0);
l9_372=l9_370;
float2 l9_373=float2(0.0);
float2 l9_374=(*sc_set0.UserUniforms).uv2Offset;
l9_373=l9_374;
float2 l9_375=float2(0.0);
l9_375=l9_373;
float2 l9_376=float2(0.0);
l9_376=(l9_359*l9_372)+l9_375;
float2 l9_377=float2(0.0);
l9_377=l9_376+(l9_375*(l9_357.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_355=l9_377;
l9_358=l9_355;
}
else
{
float2 l9_378=float2(0.0);
float2 l9_379=float2(0.0);
float2 l9_380=float2(0.0);
float2 l9_381=float2(0.0);
float2 l9_382=float2(0.0);
ssGlobals l9_383=l9_357;
float2 l9_384;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_385=float2(0.0);
l9_385=l9_383.Surface_UVCoord0;
l9_379=l9_385;
l9_384=l9_379;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_386=float2(0.0);
l9_386=l9_383.Surface_UVCoord1;
l9_380=l9_386;
l9_384=l9_380;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_387=float2(0.0);
l9_387=l9_383.gScreenCoord;
l9_381=l9_387;
l9_384=l9_381;
}
else
{
float2 l9_388=float2(0.0);
l9_388=l9_383.Surface_UVCoord0;
l9_382=l9_388;
l9_384=l9_382;
}
}
}
l9_378=l9_384;
float2 l9_389=float2(0.0);
float2 l9_390=(*sc_set0.UserUniforms).uv2Scale;
l9_389=l9_390;
float2 l9_391=float2(0.0);
l9_391=l9_389;
float2 l9_392=float2(0.0);
float2 l9_393=(*sc_set0.UserUniforms).uv2Offset;
l9_392=l9_393;
float2 l9_394=float2(0.0);
l9_394=l9_392;
float2 l9_395=float2(0.0);
l9_395=(l9_378*l9_391)+l9_394;
l9_356=l9_395;
l9_358=l9_356;
}
l9_354=l9_358;
l9_350=l9_354;
l9_353=l9_350;
}
else
{
float2 l9_396=float2(0.0);
l9_396=l9_352.Surface_UVCoord0;
l9_351=l9_396;
l9_353=l9_351;
}
l9_349=l9_353;
float2 l9_397=float2(0.0);
l9_397=l9_349;
float2 l9_398=float2(0.0);
l9_398=l9_397;
l9_342=l9_398;
l9_346=l9_342;
}
else
{
if (NODE_69_DROPLIST_ITEM_tmp==3)
{
float2 l9_399=float2(0.0);
float2 l9_400=float2(0.0);
float2 l9_401=float2(0.0);
ssGlobals l9_402=l9_345;
float2 l9_403;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_404=float2(0.0);
float2 l9_405=float2(0.0);
float2 l9_406=float2(0.0);
ssGlobals l9_407=l9_402;
float2 l9_408;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_409=float2(0.0);
float2 l9_410=float2(0.0);
float2 l9_411=float2(0.0);
float2 l9_412=float2(0.0);
float2 l9_413=float2(0.0);
float2 l9_414=float2(0.0);
ssGlobals l9_415=l9_407;
float2 l9_416;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_417=float2(0.0);
l9_417=l9_415.Surface_UVCoord0;
l9_410=l9_417;
l9_416=l9_410;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_418=float2(0.0);
l9_418=l9_415.Surface_UVCoord1;
l9_411=l9_418;
l9_416=l9_411;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_419=float2(0.0);
l9_419=l9_415.gScreenCoord;
l9_412=l9_419;
l9_416=l9_412;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_420=float2(0.0);
float2 l9_421=float2(0.0);
float2 l9_422=float2(0.0);
ssGlobals l9_423=l9_415;
float2 l9_424;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_425=float2(0.0);
float2 l9_426=float2(0.0);
float2 l9_427=float2(0.0);
ssGlobals l9_428=l9_423;
float2 l9_429;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_430=float2(0.0);
float2 l9_431=float2(0.0);
float2 l9_432=float2(0.0);
float2 l9_433=float2(0.0);
float2 l9_434=float2(0.0);
ssGlobals l9_435=l9_428;
float2 l9_436;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_437=float2(0.0);
l9_437=l9_435.Surface_UVCoord0;
l9_431=l9_437;
l9_436=l9_431;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_438=float2(0.0);
l9_438=l9_435.Surface_UVCoord1;
l9_432=l9_438;
l9_436=l9_432;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_439=float2(0.0);
l9_439=l9_435.gScreenCoord;
l9_433=l9_439;
l9_436=l9_433;
}
else
{
float2 l9_440=float2(0.0);
l9_440=l9_435.Surface_UVCoord0;
l9_434=l9_440;
l9_436=l9_434;
}
}
}
l9_430=l9_436;
float2 l9_441=float2(0.0);
float2 l9_442=(*sc_set0.UserUniforms).uv2Scale;
l9_441=l9_442;
float2 l9_443=float2(0.0);
l9_443=l9_441;
float2 l9_444=float2(0.0);
float2 l9_445=(*sc_set0.UserUniforms).uv2Offset;
l9_444=l9_445;
float2 l9_446=float2(0.0);
l9_446=l9_444;
float2 l9_447=float2(0.0);
l9_447=(l9_430*l9_443)+l9_446;
float2 l9_448=float2(0.0);
l9_448=l9_447+(l9_446*(l9_428.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_426=l9_448;
l9_429=l9_426;
}
else
{
float2 l9_449=float2(0.0);
float2 l9_450=float2(0.0);
float2 l9_451=float2(0.0);
float2 l9_452=float2(0.0);
float2 l9_453=float2(0.0);
ssGlobals l9_454=l9_428;
float2 l9_455;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_456=float2(0.0);
l9_456=l9_454.Surface_UVCoord0;
l9_450=l9_456;
l9_455=l9_450;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_457=float2(0.0);
l9_457=l9_454.Surface_UVCoord1;
l9_451=l9_457;
l9_455=l9_451;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_458=float2(0.0);
l9_458=l9_454.gScreenCoord;
l9_452=l9_458;
l9_455=l9_452;
}
else
{
float2 l9_459=float2(0.0);
l9_459=l9_454.Surface_UVCoord0;
l9_453=l9_459;
l9_455=l9_453;
}
}
}
l9_449=l9_455;
float2 l9_460=float2(0.0);
float2 l9_461=(*sc_set0.UserUniforms).uv2Scale;
l9_460=l9_461;
float2 l9_462=float2(0.0);
l9_462=l9_460;
float2 l9_463=float2(0.0);
float2 l9_464=(*sc_set0.UserUniforms).uv2Offset;
l9_463=l9_464;
float2 l9_465=float2(0.0);
l9_465=l9_463;
float2 l9_466=float2(0.0);
l9_466=(l9_449*l9_462)+l9_465;
l9_427=l9_466;
l9_429=l9_427;
}
l9_425=l9_429;
l9_421=l9_425;
l9_424=l9_421;
}
else
{
float2 l9_467=float2(0.0);
l9_467=l9_423.Surface_UVCoord0;
l9_422=l9_467;
l9_424=l9_422;
}
l9_420=l9_424;
float2 l9_468=float2(0.0);
l9_468=l9_420;
float2 l9_469=float2(0.0);
l9_469=l9_468;
l9_413=l9_469;
l9_416=l9_413;
}
else
{
float2 l9_470=float2(0.0);
l9_470=l9_415.Surface_UVCoord0;
l9_414=l9_470;
l9_416=l9_414;
}
}
}
}
l9_409=l9_416;
float2 l9_471=float2(0.0);
float2 l9_472=(*sc_set0.UserUniforms).uv3Scale;
l9_471=l9_472;
float2 l9_473=float2(0.0);
l9_473=l9_471;
float2 l9_474=float2(0.0);
float2 l9_475=(*sc_set0.UserUniforms).uv3Offset;
l9_474=l9_475;
float2 l9_476=float2(0.0);
l9_476=l9_474;
float2 l9_477=float2(0.0);
l9_477=(l9_409*l9_473)+l9_476;
float2 l9_478=float2(0.0);
l9_478=l9_477+(l9_476*(l9_407.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_405=l9_478;
l9_408=l9_405;
}
else
{
float2 l9_479=float2(0.0);
float2 l9_480=float2(0.0);
float2 l9_481=float2(0.0);
float2 l9_482=float2(0.0);
float2 l9_483=float2(0.0);
float2 l9_484=float2(0.0);
ssGlobals l9_485=l9_407;
float2 l9_486;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_487=float2(0.0);
l9_487=l9_485.Surface_UVCoord0;
l9_480=l9_487;
l9_486=l9_480;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_488=float2(0.0);
l9_488=l9_485.Surface_UVCoord1;
l9_481=l9_488;
l9_486=l9_481;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_489=float2(0.0);
l9_489=l9_485.gScreenCoord;
l9_482=l9_489;
l9_486=l9_482;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_490=float2(0.0);
float2 l9_491=float2(0.0);
float2 l9_492=float2(0.0);
ssGlobals l9_493=l9_485;
float2 l9_494;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_495=float2(0.0);
float2 l9_496=float2(0.0);
float2 l9_497=float2(0.0);
ssGlobals l9_498=l9_493;
float2 l9_499;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_500=float2(0.0);
float2 l9_501=float2(0.0);
float2 l9_502=float2(0.0);
float2 l9_503=float2(0.0);
float2 l9_504=float2(0.0);
ssGlobals l9_505=l9_498;
float2 l9_506;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_507=float2(0.0);
l9_507=l9_505.Surface_UVCoord0;
l9_501=l9_507;
l9_506=l9_501;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_508=float2(0.0);
l9_508=l9_505.Surface_UVCoord1;
l9_502=l9_508;
l9_506=l9_502;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_509=float2(0.0);
l9_509=l9_505.gScreenCoord;
l9_503=l9_509;
l9_506=l9_503;
}
else
{
float2 l9_510=float2(0.0);
l9_510=l9_505.Surface_UVCoord0;
l9_504=l9_510;
l9_506=l9_504;
}
}
}
l9_500=l9_506;
float2 l9_511=float2(0.0);
float2 l9_512=(*sc_set0.UserUniforms).uv2Scale;
l9_511=l9_512;
float2 l9_513=float2(0.0);
l9_513=l9_511;
float2 l9_514=float2(0.0);
float2 l9_515=(*sc_set0.UserUniforms).uv2Offset;
l9_514=l9_515;
float2 l9_516=float2(0.0);
l9_516=l9_514;
float2 l9_517=float2(0.0);
l9_517=(l9_500*l9_513)+l9_516;
float2 l9_518=float2(0.0);
l9_518=l9_517+(l9_516*(l9_498.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_496=l9_518;
l9_499=l9_496;
}
else
{
float2 l9_519=float2(0.0);
float2 l9_520=float2(0.0);
float2 l9_521=float2(0.0);
float2 l9_522=float2(0.0);
float2 l9_523=float2(0.0);
ssGlobals l9_524=l9_498;
float2 l9_525;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_526=float2(0.0);
l9_526=l9_524.Surface_UVCoord0;
l9_520=l9_526;
l9_525=l9_520;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_527=float2(0.0);
l9_527=l9_524.Surface_UVCoord1;
l9_521=l9_527;
l9_525=l9_521;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_528=float2(0.0);
l9_528=l9_524.gScreenCoord;
l9_522=l9_528;
l9_525=l9_522;
}
else
{
float2 l9_529=float2(0.0);
l9_529=l9_524.Surface_UVCoord0;
l9_523=l9_529;
l9_525=l9_523;
}
}
}
l9_519=l9_525;
float2 l9_530=float2(0.0);
float2 l9_531=(*sc_set0.UserUniforms).uv2Scale;
l9_530=l9_531;
float2 l9_532=float2(0.0);
l9_532=l9_530;
float2 l9_533=float2(0.0);
float2 l9_534=(*sc_set0.UserUniforms).uv2Offset;
l9_533=l9_534;
float2 l9_535=float2(0.0);
l9_535=l9_533;
float2 l9_536=float2(0.0);
l9_536=(l9_519*l9_532)+l9_535;
l9_497=l9_536;
l9_499=l9_497;
}
l9_495=l9_499;
l9_491=l9_495;
l9_494=l9_491;
}
else
{
float2 l9_537=float2(0.0);
l9_537=l9_493.Surface_UVCoord0;
l9_492=l9_537;
l9_494=l9_492;
}
l9_490=l9_494;
float2 l9_538=float2(0.0);
l9_538=l9_490;
float2 l9_539=float2(0.0);
l9_539=l9_538;
l9_483=l9_539;
l9_486=l9_483;
}
else
{
float2 l9_540=float2(0.0);
l9_540=l9_485.Surface_UVCoord0;
l9_484=l9_540;
l9_486=l9_484;
}
}
}
}
l9_479=l9_486;
float2 l9_541=float2(0.0);
float2 l9_542=(*sc_set0.UserUniforms).uv3Scale;
l9_541=l9_542;
float2 l9_543=float2(0.0);
l9_543=l9_541;
float2 l9_544=float2(0.0);
float2 l9_545=(*sc_set0.UserUniforms).uv3Offset;
l9_544=l9_545;
float2 l9_546=float2(0.0);
l9_546=l9_544;
float2 l9_547=float2(0.0);
l9_547=(l9_479*l9_543)+l9_546;
l9_406=l9_547;
l9_408=l9_406;
}
l9_404=l9_408;
l9_400=l9_404;
l9_403=l9_400;
}
else
{
float2 l9_548=float2(0.0);
l9_548=l9_402.Surface_UVCoord0;
l9_401=l9_548;
l9_403=l9_401;
}
l9_399=l9_403;
float2 l9_549=float2(0.0);
l9_549=l9_399;
float2 l9_550=float2(0.0);
l9_550=l9_549;
l9_343=l9_550;
l9_346=l9_343;
}
else
{
float2 l9_551=float2(0.0);
l9_551=l9_345.Surface_UVCoord0;
l9_344=l9_551;
l9_346=l9_344;
}
}
}
}
l9_339=l9_346;
float4 l9_552=float4(0.0);
int l9_553;
if ((int(opacityTexHasSwappedViews_tmp)!=0))
{
int l9_554=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_554=0;
}
else
{
l9_554=in.varStereoViewID;
}
int l9_555=l9_554;
l9_553=1-l9_555;
}
else
{
int l9_556=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_556=0;
}
else
{
l9_556=in.varStereoViewID;
}
int l9_557=l9_556;
l9_553=l9_557;
}
int l9_558=l9_553;
int l9_559=opacityTexLayout_tmp;
int l9_560=l9_558;
float2 l9_561=l9_339;
bool l9_562=(int(SC_USE_UV_TRANSFORM_opacityTex_tmp)!=0);
float3x3 l9_563=(*sc_set0.UserUniforms).opacityTexTransform;
int2 l9_564=int2(SC_SOFTWARE_WRAP_MODE_U_opacityTex_tmp,SC_SOFTWARE_WRAP_MODE_V_opacityTex_tmp);
bool l9_565=(int(SC_USE_UV_MIN_MAX_opacityTex_tmp)!=0);
float4 l9_566=(*sc_set0.UserUniforms).opacityTexUvMinMax;
bool l9_567=(int(SC_USE_CLAMP_TO_BORDER_opacityTex_tmp)!=0);
float4 l9_568=(*sc_set0.UserUniforms).opacityTexBorderColor;
float l9_569=0.0;
bool l9_570=l9_567&&(!l9_565);
float l9_571=1.0;
float l9_572=l9_561.x;
int l9_573=l9_564.x;
if (l9_573==1)
{
l9_572=fract(l9_572);
}
else
{
if (l9_573==2)
{
float l9_574=fract(l9_572);
float l9_575=l9_572-l9_574;
float l9_576=step(0.25,fract(l9_575*0.5));
l9_572=mix(l9_574,1.0-l9_574,fast::clamp(l9_576,0.0,1.0));
}
}
l9_561.x=l9_572;
float l9_577=l9_561.y;
int l9_578=l9_564.y;
if (l9_578==1)
{
l9_577=fract(l9_577);
}
else
{
if (l9_578==2)
{
float l9_579=fract(l9_577);
float l9_580=l9_577-l9_579;
float l9_581=step(0.25,fract(l9_580*0.5));
l9_577=mix(l9_579,1.0-l9_579,fast::clamp(l9_581,0.0,1.0));
}
}
l9_561.y=l9_577;
if (l9_565)
{
bool l9_582=l9_567;
bool l9_583;
if (l9_582)
{
l9_583=l9_564.x==3;
}
else
{
l9_583=l9_582;
}
float l9_584=l9_561.x;
float l9_585=l9_566.x;
float l9_586=l9_566.z;
bool l9_587=l9_583;
float l9_588=l9_571;
float l9_589=fast::clamp(l9_584,l9_585,l9_586);
float l9_590=step(abs(l9_584-l9_589),9.9999997e-06);
l9_588*=(l9_590+((1.0-float(l9_587))*(1.0-l9_590)));
l9_584=l9_589;
l9_561.x=l9_584;
l9_571=l9_588;
bool l9_591=l9_567;
bool l9_592;
if (l9_591)
{
l9_592=l9_564.y==3;
}
else
{
l9_592=l9_591;
}
float l9_593=l9_561.y;
float l9_594=l9_566.y;
float l9_595=l9_566.w;
bool l9_596=l9_592;
float l9_597=l9_571;
float l9_598=fast::clamp(l9_593,l9_594,l9_595);
float l9_599=step(abs(l9_593-l9_598),9.9999997e-06);
l9_597*=(l9_599+((1.0-float(l9_596))*(1.0-l9_599)));
l9_593=l9_598;
l9_561.y=l9_593;
l9_571=l9_597;
}
float2 l9_600=l9_561;
bool l9_601=l9_562;
float3x3 l9_602=l9_563;
if (l9_601)
{
l9_600=float2((l9_602*float3(l9_600,1.0)).xy);
}
float2 l9_603=l9_600;
l9_561=l9_603;
float l9_604=l9_561.x;
int l9_605=l9_564.x;
bool l9_606=l9_570;
float l9_607=l9_571;
if ((l9_605==0)||(l9_605==3))
{
float l9_608=l9_604;
float l9_609=0.0;
float l9_610=1.0;
bool l9_611=l9_606;
float l9_612=l9_607;
float l9_613=fast::clamp(l9_608,l9_609,l9_610);
float l9_614=step(abs(l9_608-l9_613),9.9999997e-06);
l9_612*=(l9_614+((1.0-float(l9_611))*(1.0-l9_614)));
l9_608=l9_613;
l9_604=l9_608;
l9_607=l9_612;
}
l9_561.x=l9_604;
l9_571=l9_607;
float l9_615=l9_561.y;
int l9_616=l9_564.y;
bool l9_617=l9_570;
float l9_618=l9_571;
if ((l9_616==0)||(l9_616==3))
{
float l9_619=l9_615;
float l9_620=0.0;
float l9_621=1.0;
bool l9_622=l9_617;
float l9_623=l9_618;
float l9_624=fast::clamp(l9_619,l9_620,l9_621);
float l9_625=step(abs(l9_619-l9_624),9.9999997e-06);
l9_623*=(l9_625+((1.0-float(l9_622))*(1.0-l9_625)));
l9_619=l9_624;
l9_615=l9_619;
l9_618=l9_623;
}
l9_561.y=l9_615;
l9_571=l9_618;
float2 l9_626=l9_561;
int l9_627=l9_559;
int l9_628=l9_560;
float l9_629=l9_569;
float2 l9_630=l9_626;
int l9_631=l9_627;
int l9_632=l9_628;
float3 l9_633=float3(0.0);
if (l9_631==0)
{
l9_633=float3(l9_630,0.0);
}
else
{
if (l9_631==1)
{
l9_633=float3(l9_630.x,(l9_630.y*0.5)+(0.5-(float(l9_632)*0.5)),0.0);
}
else
{
l9_633=float3(l9_630,float(l9_632));
}
}
float3 l9_634=l9_633;
float3 l9_635=l9_634;
float4 l9_636=sc_set0.opacityTex.sample(sc_set0.opacityTexSmpSC,l9_635.xy,bias(l9_629));
float4 l9_637=l9_636;
if (l9_567)
{
l9_637=mix(l9_568,l9_637,float4(l9_571));
}
float4 l9_638=l9_637;
l9_552=l9_638;
float l9_639=0.0;
l9_639=l9_552.x;
param_9=l9_639;
param_11=param_9;
}
else
{
param_11=param_10;
}
Result_N204=param_11;
float Output_N72=0.0;
float param_13=1.0;
float param_14=(*sc_set0.UserUniforms).Port_Input2_N072;
ssGlobals param_16=Globals;
float param_15;
if (NODE_38_DROPLIST_ITEM_tmp==1)
{
float4 l9_640=float4(0.0);
l9_640=param_16.VertexColor;
float l9_641=0.0;
l9_641=l9_640.w;
param_13=l9_641;
param_15=param_13;
}
else
{
param_15=param_14;
}
Output_N72=param_15;
float Output_N205=0.0;
Output_N205=(Output_N168*Result_N204)*Output_N72;
float Export_N158=0.0;
Export_N158=Output_N205;
float3 Result_N337=float3(0.0);
float3 param_17=float3(0.0);
float3 param_18=float3(0.0);
ssGlobals param_20=Globals;
float3 param_19;
if ((int(ENABLE_NORMALMAP_tmp)!=0))
{
float3 l9_642=float3(0.0);
l9_642=param_20.VertexTangent_WorldSpace;
float3 l9_643=float3(0.0);
l9_643=param_20.VertexBinormal_WorldSpace;
float3 l9_644=float3(0.0);
l9_644=param_20.VertexNormal_WorldSpace;
float3x3 l9_645=float3x3(float3(0.0),float3(0.0),float3(0.0));
l9_645=float3x3(float3(l9_642),float3(l9_643),float3(l9_644));
float2 l9_646=float2(0.0);
float2 l9_647=float2(0.0);
float2 l9_648=float2(0.0);
float2 l9_649=float2(0.0);
float2 l9_650=float2(0.0);
float2 l9_651=float2(0.0);
ssGlobals l9_652=param_20;
float2 l9_653;
if (NODE_181_DROPLIST_ITEM_tmp==0)
{
float2 l9_654=float2(0.0);
l9_654=l9_652.Surface_UVCoord0;
l9_647=l9_654;
l9_653=l9_647;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==1)
{
float2 l9_655=float2(0.0);
l9_655=l9_652.Surface_UVCoord1;
l9_648=l9_655;
l9_653=l9_648;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==2)
{
float2 l9_656=float2(0.0);
float2 l9_657=float2(0.0);
float2 l9_658=float2(0.0);
ssGlobals l9_659=l9_652;
float2 l9_660;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_661=float2(0.0);
float2 l9_662=float2(0.0);
float2 l9_663=float2(0.0);
ssGlobals l9_664=l9_659;
float2 l9_665;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_666=float2(0.0);
float2 l9_667=float2(0.0);
float2 l9_668=float2(0.0);
float2 l9_669=float2(0.0);
float2 l9_670=float2(0.0);
ssGlobals l9_671=l9_664;
float2 l9_672;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_673=float2(0.0);
l9_673=l9_671.Surface_UVCoord0;
l9_667=l9_673;
l9_672=l9_667;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_674=float2(0.0);
l9_674=l9_671.Surface_UVCoord1;
l9_668=l9_674;
l9_672=l9_668;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_675=float2(0.0);
l9_675=l9_671.gScreenCoord;
l9_669=l9_675;
l9_672=l9_669;
}
else
{
float2 l9_676=float2(0.0);
l9_676=l9_671.Surface_UVCoord0;
l9_670=l9_676;
l9_672=l9_670;
}
}
}
l9_666=l9_672;
float2 l9_677=float2(0.0);
float2 l9_678=(*sc_set0.UserUniforms).uv2Scale;
l9_677=l9_678;
float2 l9_679=float2(0.0);
l9_679=l9_677;
float2 l9_680=float2(0.0);
float2 l9_681=(*sc_set0.UserUniforms).uv2Offset;
l9_680=l9_681;
float2 l9_682=float2(0.0);
l9_682=l9_680;
float2 l9_683=float2(0.0);
l9_683=(l9_666*l9_679)+l9_682;
float2 l9_684=float2(0.0);
l9_684=l9_683+(l9_682*(l9_664.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_662=l9_684;
l9_665=l9_662;
}
else
{
float2 l9_685=float2(0.0);
float2 l9_686=float2(0.0);
float2 l9_687=float2(0.0);
float2 l9_688=float2(0.0);
float2 l9_689=float2(0.0);
ssGlobals l9_690=l9_664;
float2 l9_691;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_692=float2(0.0);
l9_692=l9_690.Surface_UVCoord0;
l9_686=l9_692;
l9_691=l9_686;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_693=float2(0.0);
l9_693=l9_690.Surface_UVCoord1;
l9_687=l9_693;
l9_691=l9_687;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_694=float2(0.0);
l9_694=l9_690.gScreenCoord;
l9_688=l9_694;
l9_691=l9_688;
}
else
{
float2 l9_695=float2(0.0);
l9_695=l9_690.Surface_UVCoord0;
l9_689=l9_695;
l9_691=l9_689;
}
}
}
l9_685=l9_691;
float2 l9_696=float2(0.0);
float2 l9_697=(*sc_set0.UserUniforms).uv2Scale;
l9_696=l9_697;
float2 l9_698=float2(0.0);
l9_698=l9_696;
float2 l9_699=float2(0.0);
float2 l9_700=(*sc_set0.UserUniforms).uv2Offset;
l9_699=l9_700;
float2 l9_701=float2(0.0);
l9_701=l9_699;
float2 l9_702=float2(0.0);
l9_702=(l9_685*l9_698)+l9_701;
l9_663=l9_702;
l9_665=l9_663;
}
l9_661=l9_665;
l9_657=l9_661;
l9_660=l9_657;
}
else
{
float2 l9_703=float2(0.0);
l9_703=l9_659.Surface_UVCoord0;
l9_658=l9_703;
l9_660=l9_658;
}
l9_656=l9_660;
float2 l9_704=float2(0.0);
l9_704=l9_656;
float2 l9_705=float2(0.0);
l9_705=l9_704;
l9_649=l9_705;
l9_653=l9_649;
}
else
{
if (NODE_181_DROPLIST_ITEM_tmp==3)
{
float2 l9_706=float2(0.0);
float2 l9_707=float2(0.0);
float2 l9_708=float2(0.0);
ssGlobals l9_709=l9_652;
float2 l9_710;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_711=float2(0.0);
float2 l9_712=float2(0.0);
float2 l9_713=float2(0.0);
ssGlobals l9_714=l9_709;
float2 l9_715;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_716=float2(0.0);
float2 l9_717=float2(0.0);
float2 l9_718=float2(0.0);
float2 l9_719=float2(0.0);
float2 l9_720=float2(0.0);
float2 l9_721=float2(0.0);
ssGlobals l9_722=l9_714;
float2 l9_723;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_724=float2(0.0);
l9_724=l9_722.Surface_UVCoord0;
l9_717=l9_724;
l9_723=l9_717;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_725=float2(0.0);
l9_725=l9_722.Surface_UVCoord1;
l9_718=l9_725;
l9_723=l9_718;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_726=float2(0.0);
l9_726=l9_722.gScreenCoord;
l9_719=l9_726;
l9_723=l9_719;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_727=float2(0.0);
float2 l9_728=float2(0.0);
float2 l9_729=float2(0.0);
ssGlobals l9_730=l9_722;
float2 l9_731;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_732=float2(0.0);
float2 l9_733=float2(0.0);
float2 l9_734=float2(0.0);
ssGlobals l9_735=l9_730;
float2 l9_736;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_737=float2(0.0);
float2 l9_738=float2(0.0);
float2 l9_739=float2(0.0);
float2 l9_740=float2(0.0);
float2 l9_741=float2(0.0);
ssGlobals l9_742=l9_735;
float2 l9_743;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_744=float2(0.0);
l9_744=l9_742.Surface_UVCoord0;
l9_738=l9_744;
l9_743=l9_738;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_745=float2(0.0);
l9_745=l9_742.Surface_UVCoord1;
l9_739=l9_745;
l9_743=l9_739;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_746=float2(0.0);
l9_746=l9_742.gScreenCoord;
l9_740=l9_746;
l9_743=l9_740;
}
else
{
float2 l9_747=float2(0.0);
l9_747=l9_742.Surface_UVCoord0;
l9_741=l9_747;
l9_743=l9_741;
}
}
}
l9_737=l9_743;
float2 l9_748=float2(0.0);
float2 l9_749=(*sc_set0.UserUniforms).uv2Scale;
l9_748=l9_749;
float2 l9_750=float2(0.0);
l9_750=l9_748;
float2 l9_751=float2(0.0);
float2 l9_752=(*sc_set0.UserUniforms).uv2Offset;
l9_751=l9_752;
float2 l9_753=float2(0.0);
l9_753=l9_751;
float2 l9_754=float2(0.0);
l9_754=(l9_737*l9_750)+l9_753;
float2 l9_755=float2(0.0);
l9_755=l9_754+(l9_753*(l9_735.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_733=l9_755;
l9_736=l9_733;
}
else
{
float2 l9_756=float2(0.0);
float2 l9_757=float2(0.0);
float2 l9_758=float2(0.0);
float2 l9_759=float2(0.0);
float2 l9_760=float2(0.0);
ssGlobals l9_761=l9_735;
float2 l9_762;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_763=float2(0.0);
l9_763=l9_761.Surface_UVCoord0;
l9_757=l9_763;
l9_762=l9_757;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_764=float2(0.0);
l9_764=l9_761.Surface_UVCoord1;
l9_758=l9_764;
l9_762=l9_758;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_765=float2(0.0);
l9_765=l9_761.gScreenCoord;
l9_759=l9_765;
l9_762=l9_759;
}
else
{
float2 l9_766=float2(0.0);
l9_766=l9_761.Surface_UVCoord0;
l9_760=l9_766;
l9_762=l9_760;
}
}
}
l9_756=l9_762;
float2 l9_767=float2(0.0);
float2 l9_768=(*sc_set0.UserUniforms).uv2Scale;
l9_767=l9_768;
float2 l9_769=float2(0.0);
l9_769=l9_767;
float2 l9_770=float2(0.0);
float2 l9_771=(*sc_set0.UserUniforms).uv2Offset;
l9_770=l9_771;
float2 l9_772=float2(0.0);
l9_772=l9_770;
float2 l9_773=float2(0.0);
l9_773=(l9_756*l9_769)+l9_772;
l9_734=l9_773;
l9_736=l9_734;
}
l9_732=l9_736;
l9_728=l9_732;
l9_731=l9_728;
}
else
{
float2 l9_774=float2(0.0);
l9_774=l9_730.Surface_UVCoord0;
l9_729=l9_774;
l9_731=l9_729;
}
l9_727=l9_731;
float2 l9_775=float2(0.0);
l9_775=l9_727;
float2 l9_776=float2(0.0);
l9_776=l9_775;
l9_720=l9_776;
l9_723=l9_720;
}
else
{
float2 l9_777=float2(0.0);
l9_777=l9_722.Surface_UVCoord0;
l9_721=l9_777;
l9_723=l9_721;
}
}
}
}
l9_716=l9_723;
float2 l9_778=float2(0.0);
float2 l9_779=(*sc_set0.UserUniforms).uv3Scale;
l9_778=l9_779;
float2 l9_780=float2(0.0);
l9_780=l9_778;
float2 l9_781=float2(0.0);
float2 l9_782=(*sc_set0.UserUniforms).uv3Offset;
l9_781=l9_782;
float2 l9_783=float2(0.0);
l9_783=l9_781;
float2 l9_784=float2(0.0);
l9_784=(l9_716*l9_780)+l9_783;
float2 l9_785=float2(0.0);
l9_785=l9_784+(l9_783*(l9_714.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_712=l9_785;
l9_715=l9_712;
}
else
{
float2 l9_786=float2(0.0);
float2 l9_787=float2(0.0);
float2 l9_788=float2(0.0);
float2 l9_789=float2(0.0);
float2 l9_790=float2(0.0);
float2 l9_791=float2(0.0);
ssGlobals l9_792=l9_714;
float2 l9_793;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_794=float2(0.0);
l9_794=l9_792.Surface_UVCoord0;
l9_787=l9_794;
l9_793=l9_787;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_795=float2(0.0);
l9_795=l9_792.Surface_UVCoord1;
l9_788=l9_795;
l9_793=l9_788;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_796=float2(0.0);
l9_796=l9_792.gScreenCoord;
l9_789=l9_796;
l9_793=l9_789;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_797=float2(0.0);
float2 l9_798=float2(0.0);
float2 l9_799=float2(0.0);
ssGlobals l9_800=l9_792;
float2 l9_801;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_802=float2(0.0);
float2 l9_803=float2(0.0);
float2 l9_804=float2(0.0);
ssGlobals l9_805=l9_800;
float2 l9_806;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_807=float2(0.0);
float2 l9_808=float2(0.0);
float2 l9_809=float2(0.0);
float2 l9_810=float2(0.0);
float2 l9_811=float2(0.0);
ssGlobals l9_812=l9_805;
float2 l9_813;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_814=float2(0.0);
l9_814=l9_812.Surface_UVCoord0;
l9_808=l9_814;
l9_813=l9_808;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_815=float2(0.0);
l9_815=l9_812.Surface_UVCoord1;
l9_809=l9_815;
l9_813=l9_809;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_816=float2(0.0);
l9_816=l9_812.gScreenCoord;
l9_810=l9_816;
l9_813=l9_810;
}
else
{
float2 l9_817=float2(0.0);
l9_817=l9_812.Surface_UVCoord0;
l9_811=l9_817;
l9_813=l9_811;
}
}
}
l9_807=l9_813;
float2 l9_818=float2(0.0);
float2 l9_819=(*sc_set0.UserUniforms).uv2Scale;
l9_818=l9_819;
float2 l9_820=float2(0.0);
l9_820=l9_818;
float2 l9_821=float2(0.0);
float2 l9_822=(*sc_set0.UserUniforms).uv2Offset;
l9_821=l9_822;
float2 l9_823=float2(0.0);
l9_823=l9_821;
float2 l9_824=float2(0.0);
l9_824=(l9_807*l9_820)+l9_823;
float2 l9_825=float2(0.0);
l9_825=l9_824+(l9_823*(l9_805.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_803=l9_825;
l9_806=l9_803;
}
else
{
float2 l9_826=float2(0.0);
float2 l9_827=float2(0.0);
float2 l9_828=float2(0.0);
float2 l9_829=float2(0.0);
float2 l9_830=float2(0.0);
ssGlobals l9_831=l9_805;
float2 l9_832;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_833=float2(0.0);
l9_833=l9_831.Surface_UVCoord0;
l9_827=l9_833;
l9_832=l9_827;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_834=float2(0.0);
l9_834=l9_831.Surface_UVCoord1;
l9_828=l9_834;
l9_832=l9_828;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_835=float2(0.0);
l9_835=l9_831.gScreenCoord;
l9_829=l9_835;
l9_832=l9_829;
}
else
{
float2 l9_836=float2(0.0);
l9_836=l9_831.Surface_UVCoord0;
l9_830=l9_836;
l9_832=l9_830;
}
}
}
l9_826=l9_832;
float2 l9_837=float2(0.0);
float2 l9_838=(*sc_set0.UserUniforms).uv2Scale;
l9_837=l9_838;
float2 l9_839=float2(0.0);
l9_839=l9_837;
float2 l9_840=float2(0.0);
float2 l9_841=(*sc_set0.UserUniforms).uv2Offset;
l9_840=l9_841;
float2 l9_842=float2(0.0);
l9_842=l9_840;
float2 l9_843=float2(0.0);
l9_843=(l9_826*l9_839)+l9_842;
l9_804=l9_843;
l9_806=l9_804;
}
l9_802=l9_806;
l9_798=l9_802;
l9_801=l9_798;
}
else
{
float2 l9_844=float2(0.0);
l9_844=l9_800.Surface_UVCoord0;
l9_799=l9_844;
l9_801=l9_799;
}
l9_797=l9_801;
float2 l9_845=float2(0.0);
l9_845=l9_797;
float2 l9_846=float2(0.0);
l9_846=l9_845;
l9_790=l9_846;
l9_793=l9_790;
}
else
{
float2 l9_847=float2(0.0);
l9_847=l9_792.Surface_UVCoord0;
l9_791=l9_847;
l9_793=l9_791;
}
}
}
}
l9_786=l9_793;
float2 l9_848=float2(0.0);
float2 l9_849=(*sc_set0.UserUniforms).uv3Scale;
l9_848=l9_849;
float2 l9_850=float2(0.0);
l9_850=l9_848;
float2 l9_851=float2(0.0);
float2 l9_852=(*sc_set0.UserUniforms).uv3Offset;
l9_851=l9_852;
float2 l9_853=float2(0.0);
l9_853=l9_851;
float2 l9_854=float2(0.0);
l9_854=(l9_786*l9_850)+l9_853;
l9_713=l9_854;
l9_715=l9_713;
}
l9_711=l9_715;
l9_707=l9_711;
l9_710=l9_707;
}
else
{
float2 l9_855=float2(0.0);
l9_855=l9_709.Surface_UVCoord0;
l9_708=l9_855;
l9_710=l9_708;
}
l9_706=l9_710;
float2 l9_856=float2(0.0);
l9_856=l9_706;
float2 l9_857=float2(0.0);
l9_857=l9_856;
l9_650=l9_857;
l9_653=l9_650;
}
else
{
float2 l9_858=float2(0.0);
l9_858=l9_652.Surface_UVCoord0;
l9_651=l9_858;
l9_653=l9_651;
}
}
}
}
l9_646=l9_653;
float4 l9_859=float4(0.0);
float2 l9_860=l9_646;
int l9_861;
if ((int(normalTexHasSwappedViews_tmp)!=0))
{
int l9_862=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_862=0;
}
else
{
l9_862=in.varStereoViewID;
}
int l9_863=l9_862;
l9_861=1-l9_863;
}
else
{
int l9_864=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_864=0;
}
else
{
l9_864=in.varStereoViewID;
}
int l9_865=l9_864;
l9_861=l9_865;
}
int l9_866=l9_861;
int l9_867=normalTexLayout_tmp;
int l9_868=l9_866;
float2 l9_869=l9_860;
bool l9_870=(int(SC_USE_UV_TRANSFORM_normalTex_tmp)!=0);
float3x3 l9_871=(*sc_set0.UserUniforms).normalTexTransform;
int2 l9_872=int2(SC_SOFTWARE_WRAP_MODE_U_normalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_normalTex_tmp);
bool l9_873=(int(SC_USE_UV_MIN_MAX_normalTex_tmp)!=0);
float4 l9_874=(*sc_set0.UserUniforms).normalTexUvMinMax;
bool l9_875=(int(SC_USE_CLAMP_TO_BORDER_normalTex_tmp)!=0);
float4 l9_876=(*sc_set0.UserUniforms).normalTexBorderColor;
float l9_877=0.0;
bool l9_878=l9_875&&(!l9_873);
float l9_879=1.0;
float l9_880=l9_869.x;
int l9_881=l9_872.x;
if (l9_881==1)
{
l9_880=fract(l9_880);
}
else
{
if (l9_881==2)
{
float l9_882=fract(l9_880);
float l9_883=l9_880-l9_882;
float l9_884=step(0.25,fract(l9_883*0.5));
l9_880=mix(l9_882,1.0-l9_882,fast::clamp(l9_884,0.0,1.0));
}
}
l9_869.x=l9_880;
float l9_885=l9_869.y;
int l9_886=l9_872.y;
if (l9_886==1)
{
l9_885=fract(l9_885);
}
else
{
if (l9_886==2)
{
float l9_887=fract(l9_885);
float l9_888=l9_885-l9_887;
float l9_889=step(0.25,fract(l9_888*0.5));
l9_885=mix(l9_887,1.0-l9_887,fast::clamp(l9_889,0.0,1.0));
}
}
l9_869.y=l9_885;
if (l9_873)
{
bool l9_890=l9_875;
bool l9_891;
if (l9_890)
{
l9_891=l9_872.x==3;
}
else
{
l9_891=l9_890;
}
float l9_892=l9_869.x;
float l9_893=l9_874.x;
float l9_894=l9_874.z;
bool l9_895=l9_891;
float l9_896=l9_879;
float l9_897=fast::clamp(l9_892,l9_893,l9_894);
float l9_898=step(abs(l9_892-l9_897),9.9999997e-06);
l9_896*=(l9_898+((1.0-float(l9_895))*(1.0-l9_898)));
l9_892=l9_897;
l9_869.x=l9_892;
l9_879=l9_896;
bool l9_899=l9_875;
bool l9_900;
if (l9_899)
{
l9_900=l9_872.y==3;
}
else
{
l9_900=l9_899;
}
float l9_901=l9_869.y;
float l9_902=l9_874.y;
float l9_903=l9_874.w;
bool l9_904=l9_900;
float l9_905=l9_879;
float l9_906=fast::clamp(l9_901,l9_902,l9_903);
float l9_907=step(abs(l9_901-l9_906),9.9999997e-06);
l9_905*=(l9_907+((1.0-float(l9_904))*(1.0-l9_907)));
l9_901=l9_906;
l9_869.y=l9_901;
l9_879=l9_905;
}
float2 l9_908=l9_869;
bool l9_909=l9_870;
float3x3 l9_910=l9_871;
if (l9_909)
{
l9_908=float2((l9_910*float3(l9_908,1.0)).xy);
}
float2 l9_911=l9_908;
l9_869=l9_911;
float l9_912=l9_869.x;
int l9_913=l9_872.x;
bool l9_914=l9_878;
float l9_915=l9_879;
if ((l9_913==0)||(l9_913==3))
{
float l9_916=l9_912;
float l9_917=0.0;
float l9_918=1.0;
bool l9_919=l9_914;
float l9_920=l9_915;
float l9_921=fast::clamp(l9_916,l9_917,l9_918);
float l9_922=step(abs(l9_916-l9_921),9.9999997e-06);
l9_920*=(l9_922+((1.0-float(l9_919))*(1.0-l9_922)));
l9_916=l9_921;
l9_912=l9_916;
l9_915=l9_920;
}
l9_869.x=l9_912;
l9_879=l9_915;
float l9_923=l9_869.y;
int l9_924=l9_872.y;
bool l9_925=l9_878;
float l9_926=l9_879;
if ((l9_924==0)||(l9_924==3))
{
float l9_927=l9_923;
float l9_928=0.0;
float l9_929=1.0;
bool l9_930=l9_925;
float l9_931=l9_926;
float l9_932=fast::clamp(l9_927,l9_928,l9_929);
float l9_933=step(abs(l9_927-l9_932),9.9999997e-06);
l9_931*=(l9_933+((1.0-float(l9_930))*(1.0-l9_933)));
l9_927=l9_932;
l9_923=l9_927;
l9_926=l9_931;
}
l9_869.y=l9_923;
l9_879=l9_926;
float2 l9_934=l9_869;
int l9_935=l9_867;
int l9_936=l9_868;
float l9_937=l9_877;
float2 l9_938=l9_934;
int l9_939=l9_935;
int l9_940=l9_936;
float3 l9_941=float3(0.0);
if (l9_939==0)
{
l9_941=float3(l9_938,0.0);
}
else
{
if (l9_939==1)
{
l9_941=float3(l9_938.x,(l9_938.y*0.5)+(0.5-(float(l9_940)*0.5)),0.0);
}
else
{
l9_941=float3(l9_938,float(l9_940));
}
}
float3 l9_942=l9_941;
float3 l9_943=l9_942;
float4 l9_944=sc_set0.normalTex.sample(sc_set0.normalTexSmpSC,l9_943.xy,bias(l9_937));
float4 l9_945=l9_944;
if (l9_875)
{
l9_945=mix(l9_876,l9_945,float4(l9_879));
}
float4 l9_946=l9_945;
float4 l9_947=l9_946;
float3 l9_948=(l9_947.xyz*1.9921875)-float3(1.0);
l9_947=float4(l9_948.x,l9_948.y,l9_948.z,l9_947.w);
l9_859=l9_947;
float3 l9_949=float3(0.0);
float3 l9_950=float3(0.0);
float3 l9_951=(*sc_set0.UserUniforms).Port_Default_N113;
ssGlobals l9_952=param_20;
float3 l9_953;
if ((int(ENABLE_DETAIL_NORMAL_tmp)!=0))
{
float2 l9_954=float2(0.0);
float2 l9_955=float2(0.0);
float2 l9_956=float2(0.0);
float2 l9_957=float2(0.0);
float2 l9_958=float2(0.0);
float2 l9_959=float2(0.0);
ssGlobals l9_960=l9_952;
float2 l9_961;
if (NODE_184_DROPLIST_ITEM_tmp==0)
{
float2 l9_962=float2(0.0);
l9_962=l9_960.Surface_UVCoord0;
l9_955=l9_962;
l9_961=l9_955;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==1)
{
float2 l9_963=float2(0.0);
l9_963=l9_960.Surface_UVCoord1;
l9_956=l9_963;
l9_961=l9_956;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==2)
{
float2 l9_964=float2(0.0);
float2 l9_965=float2(0.0);
float2 l9_966=float2(0.0);
ssGlobals l9_967=l9_960;
float2 l9_968;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_969=float2(0.0);
float2 l9_970=float2(0.0);
float2 l9_971=float2(0.0);
ssGlobals l9_972=l9_967;
float2 l9_973;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_974=float2(0.0);
float2 l9_975=float2(0.0);
float2 l9_976=float2(0.0);
float2 l9_977=float2(0.0);
float2 l9_978=float2(0.0);
ssGlobals l9_979=l9_972;
float2 l9_980;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_981=float2(0.0);
l9_981=l9_979.Surface_UVCoord0;
l9_975=l9_981;
l9_980=l9_975;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_982=float2(0.0);
l9_982=l9_979.Surface_UVCoord1;
l9_976=l9_982;
l9_980=l9_976;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_983=float2(0.0);
l9_983=l9_979.gScreenCoord;
l9_977=l9_983;
l9_980=l9_977;
}
else
{
float2 l9_984=float2(0.0);
l9_984=l9_979.Surface_UVCoord0;
l9_978=l9_984;
l9_980=l9_978;
}
}
}
l9_974=l9_980;
float2 l9_985=float2(0.0);
float2 l9_986=(*sc_set0.UserUniforms).uv2Scale;
l9_985=l9_986;
float2 l9_987=float2(0.0);
l9_987=l9_985;
float2 l9_988=float2(0.0);
float2 l9_989=(*sc_set0.UserUniforms).uv2Offset;
l9_988=l9_989;
float2 l9_990=float2(0.0);
l9_990=l9_988;
float2 l9_991=float2(0.0);
l9_991=(l9_974*l9_987)+l9_990;
float2 l9_992=float2(0.0);
l9_992=l9_991+(l9_990*(l9_972.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_970=l9_992;
l9_973=l9_970;
}
else
{
float2 l9_993=float2(0.0);
float2 l9_994=float2(0.0);
float2 l9_995=float2(0.0);
float2 l9_996=float2(0.0);
float2 l9_997=float2(0.0);
ssGlobals l9_998=l9_972;
float2 l9_999;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1000=float2(0.0);
l9_1000=l9_998.Surface_UVCoord0;
l9_994=l9_1000;
l9_999=l9_994;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1001=float2(0.0);
l9_1001=l9_998.Surface_UVCoord1;
l9_995=l9_1001;
l9_999=l9_995;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1002=float2(0.0);
l9_1002=l9_998.gScreenCoord;
l9_996=l9_1002;
l9_999=l9_996;
}
else
{
float2 l9_1003=float2(0.0);
l9_1003=l9_998.Surface_UVCoord0;
l9_997=l9_1003;
l9_999=l9_997;
}
}
}
l9_993=l9_999;
float2 l9_1004=float2(0.0);
float2 l9_1005=(*sc_set0.UserUniforms).uv2Scale;
l9_1004=l9_1005;
float2 l9_1006=float2(0.0);
l9_1006=l9_1004;
float2 l9_1007=float2(0.0);
float2 l9_1008=(*sc_set0.UserUniforms).uv2Offset;
l9_1007=l9_1008;
float2 l9_1009=float2(0.0);
l9_1009=l9_1007;
float2 l9_1010=float2(0.0);
l9_1010=(l9_993*l9_1006)+l9_1009;
l9_971=l9_1010;
l9_973=l9_971;
}
l9_969=l9_973;
l9_965=l9_969;
l9_968=l9_965;
}
else
{
float2 l9_1011=float2(0.0);
l9_1011=l9_967.Surface_UVCoord0;
l9_966=l9_1011;
l9_968=l9_966;
}
l9_964=l9_968;
float2 l9_1012=float2(0.0);
l9_1012=l9_964;
float2 l9_1013=float2(0.0);
l9_1013=l9_1012;
l9_957=l9_1013;
l9_961=l9_957;
}
else
{
if (NODE_184_DROPLIST_ITEM_tmp==3)
{
float2 l9_1014=float2(0.0);
float2 l9_1015=float2(0.0);
float2 l9_1016=float2(0.0);
ssGlobals l9_1017=l9_960;
float2 l9_1018;
if ((int(ENABLE_UV3_tmp)!=0))
{
float2 l9_1019=float2(0.0);
float2 l9_1020=float2(0.0);
float2 l9_1021=float2(0.0);
ssGlobals l9_1022=l9_1017;
float2 l9_1023;
if ((int(ENABLE_UV3_ANIMATION_tmp)!=0))
{
float2 l9_1024=float2(0.0);
float2 l9_1025=float2(0.0);
float2 l9_1026=float2(0.0);
float2 l9_1027=float2(0.0);
float2 l9_1028=float2(0.0);
float2 l9_1029=float2(0.0);
ssGlobals l9_1030=l9_1022;
float2 l9_1031;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1032=float2(0.0);
l9_1032=l9_1030.Surface_UVCoord0;
l9_1025=l9_1032;
l9_1031=l9_1025;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1033=float2(0.0);
l9_1033=l9_1030.Surface_UVCoord1;
l9_1026=l9_1033;
l9_1031=l9_1026;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1034=float2(0.0);
l9_1034=l9_1030.gScreenCoord;
l9_1027=l9_1034;
l9_1031=l9_1027;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1035=float2(0.0);
float2 l9_1036=float2(0.0);
float2 l9_1037=float2(0.0);
ssGlobals l9_1038=l9_1030;
float2 l9_1039;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1040=float2(0.0);
float2 l9_1041=float2(0.0);
float2 l9_1042=float2(0.0);
ssGlobals l9_1043=l9_1038;
float2 l9_1044;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1045=float2(0.0);
float2 l9_1046=float2(0.0);
float2 l9_1047=float2(0.0);
float2 l9_1048=float2(0.0);
float2 l9_1049=float2(0.0);
ssGlobals l9_1050=l9_1043;
float2 l9_1051;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1052=float2(0.0);
l9_1052=l9_1050.Surface_UVCoord0;
l9_1046=l9_1052;
l9_1051=l9_1046;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1053=float2(0.0);
l9_1053=l9_1050.Surface_UVCoord1;
l9_1047=l9_1053;
l9_1051=l9_1047;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1054=float2(0.0);
l9_1054=l9_1050.gScreenCoord;
l9_1048=l9_1054;
l9_1051=l9_1048;
}
else
{
float2 l9_1055=float2(0.0);
l9_1055=l9_1050.Surface_UVCoord0;
l9_1049=l9_1055;
l9_1051=l9_1049;
}
}
}
l9_1045=l9_1051;
float2 l9_1056=float2(0.0);
float2 l9_1057=(*sc_set0.UserUniforms).uv2Scale;
l9_1056=l9_1057;
float2 l9_1058=float2(0.0);
l9_1058=l9_1056;
float2 l9_1059=float2(0.0);
float2 l9_1060=(*sc_set0.UserUniforms).uv2Offset;
l9_1059=l9_1060;
float2 l9_1061=float2(0.0);
l9_1061=l9_1059;
float2 l9_1062=float2(0.0);
l9_1062=(l9_1045*l9_1058)+l9_1061;
float2 l9_1063=float2(0.0);
l9_1063=l9_1062+(l9_1061*(l9_1043.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1041=l9_1063;
l9_1044=l9_1041;
}
else
{
float2 l9_1064=float2(0.0);
float2 l9_1065=float2(0.0);
float2 l9_1066=float2(0.0);
float2 l9_1067=float2(0.0);
float2 l9_1068=float2(0.0);
ssGlobals l9_1069=l9_1043;
float2 l9_1070;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1071=float2(0.0);
l9_1071=l9_1069.Surface_UVCoord0;
l9_1065=l9_1071;
l9_1070=l9_1065;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1072=float2(0.0);
l9_1072=l9_1069.Surface_UVCoord1;
l9_1066=l9_1072;
l9_1070=l9_1066;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1073=float2(0.0);
l9_1073=l9_1069.gScreenCoord;
l9_1067=l9_1073;
l9_1070=l9_1067;
}
else
{
float2 l9_1074=float2(0.0);
l9_1074=l9_1069.Surface_UVCoord0;
l9_1068=l9_1074;
l9_1070=l9_1068;
}
}
}
l9_1064=l9_1070;
float2 l9_1075=float2(0.0);
float2 l9_1076=(*sc_set0.UserUniforms).uv2Scale;
l9_1075=l9_1076;
float2 l9_1077=float2(0.0);
l9_1077=l9_1075;
float2 l9_1078=float2(0.0);
float2 l9_1079=(*sc_set0.UserUniforms).uv2Offset;
l9_1078=l9_1079;
float2 l9_1080=float2(0.0);
l9_1080=l9_1078;
float2 l9_1081=float2(0.0);
l9_1081=(l9_1064*l9_1077)+l9_1080;
l9_1042=l9_1081;
l9_1044=l9_1042;
}
l9_1040=l9_1044;
l9_1036=l9_1040;
l9_1039=l9_1036;
}
else
{
float2 l9_1082=float2(0.0);
l9_1082=l9_1038.Surface_UVCoord0;
l9_1037=l9_1082;
l9_1039=l9_1037;
}
l9_1035=l9_1039;
float2 l9_1083=float2(0.0);
l9_1083=l9_1035;
float2 l9_1084=float2(0.0);
l9_1084=l9_1083;
l9_1028=l9_1084;
l9_1031=l9_1028;
}
else
{
float2 l9_1085=float2(0.0);
l9_1085=l9_1030.Surface_UVCoord0;
l9_1029=l9_1085;
l9_1031=l9_1029;
}
}
}
}
l9_1024=l9_1031;
float2 l9_1086=float2(0.0);
float2 l9_1087=(*sc_set0.UserUniforms).uv3Scale;
l9_1086=l9_1087;
float2 l9_1088=float2(0.0);
l9_1088=l9_1086;
float2 l9_1089=float2(0.0);
float2 l9_1090=(*sc_set0.UserUniforms).uv3Offset;
l9_1089=l9_1090;
float2 l9_1091=float2(0.0);
l9_1091=l9_1089;
float2 l9_1092=float2(0.0);
l9_1092=(l9_1024*l9_1088)+l9_1091;
float2 l9_1093=float2(0.0);
l9_1093=l9_1092+(l9_1091*(l9_1022.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N063));
l9_1020=l9_1093;
l9_1023=l9_1020;
}
else
{
float2 l9_1094=float2(0.0);
float2 l9_1095=float2(0.0);
float2 l9_1096=float2(0.0);
float2 l9_1097=float2(0.0);
float2 l9_1098=float2(0.0);
float2 l9_1099=float2(0.0);
ssGlobals l9_1100=l9_1022;
float2 l9_1101;
if (NODE_49_DROPLIST_ITEM_tmp==0)
{
float2 l9_1102=float2(0.0);
l9_1102=l9_1100.Surface_UVCoord0;
l9_1095=l9_1102;
l9_1101=l9_1095;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==1)
{
float2 l9_1103=float2(0.0);
l9_1103=l9_1100.Surface_UVCoord1;
l9_1096=l9_1103;
l9_1101=l9_1096;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==2)
{
float2 l9_1104=float2(0.0);
l9_1104=l9_1100.gScreenCoord;
l9_1097=l9_1104;
l9_1101=l9_1097;
}
else
{
if (NODE_49_DROPLIST_ITEM_tmp==3)
{
float2 l9_1105=float2(0.0);
float2 l9_1106=float2(0.0);
float2 l9_1107=float2(0.0);
ssGlobals l9_1108=l9_1100;
float2 l9_1109;
if ((int(ENABLE_UV2_tmp)!=0))
{
float2 l9_1110=float2(0.0);
float2 l9_1111=float2(0.0);
float2 l9_1112=float2(0.0);
ssGlobals l9_1113=l9_1108;
float2 l9_1114;
if ((int(ENABLE_UV2_ANIMATION_tmp)!=0))
{
float2 l9_1115=float2(0.0);
float2 l9_1116=float2(0.0);
float2 l9_1117=float2(0.0);
float2 l9_1118=float2(0.0);
float2 l9_1119=float2(0.0);
ssGlobals l9_1120=l9_1113;
float2 l9_1121;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1122=float2(0.0);
l9_1122=l9_1120.Surface_UVCoord0;
l9_1116=l9_1122;
l9_1121=l9_1116;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1123=float2(0.0);
l9_1123=l9_1120.Surface_UVCoord1;
l9_1117=l9_1123;
l9_1121=l9_1117;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1124=float2(0.0);
l9_1124=l9_1120.gScreenCoord;
l9_1118=l9_1124;
l9_1121=l9_1118;
}
else
{
float2 l9_1125=float2(0.0);
l9_1125=l9_1120.Surface_UVCoord0;
l9_1119=l9_1125;
l9_1121=l9_1119;
}
}
}
l9_1115=l9_1121;
float2 l9_1126=float2(0.0);
float2 l9_1127=(*sc_set0.UserUniforms).uv2Scale;
l9_1126=l9_1127;
float2 l9_1128=float2(0.0);
l9_1128=l9_1126;
float2 l9_1129=float2(0.0);
float2 l9_1130=(*sc_set0.UserUniforms).uv2Offset;
l9_1129=l9_1130;
float2 l9_1131=float2(0.0);
l9_1131=l9_1129;
float2 l9_1132=float2(0.0);
l9_1132=(l9_1115*l9_1128)+l9_1131;
float2 l9_1133=float2(0.0);
l9_1133=l9_1132+(l9_1131*(l9_1113.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N022));
l9_1111=l9_1133;
l9_1114=l9_1111;
}
else
{
float2 l9_1134=float2(0.0);
float2 l9_1135=float2(0.0);
float2 l9_1136=float2(0.0);
float2 l9_1137=float2(0.0);
float2 l9_1138=float2(0.0);
ssGlobals l9_1139=l9_1113;
float2 l9_1140;
if (NODE_13_DROPLIST_ITEM_tmp==0)
{
float2 l9_1141=float2(0.0);
l9_1141=l9_1139.Surface_UVCoord0;
l9_1135=l9_1141;
l9_1140=l9_1135;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==1)
{
float2 l9_1142=float2(0.0);
l9_1142=l9_1139.Surface_UVCoord1;
l9_1136=l9_1142;
l9_1140=l9_1136;
}
else
{
if (NODE_13_DROPLIST_ITEM_tmp==2)
{
float2 l9_1143=float2(0.0);
l9_1143=l9_1139.gScreenCoord;
l9_1137=l9_1143;
l9_1140=l9_1137;
}
else
{
float2 l9_1144=float2(0.0);
l9_1144=l9_1139.Surface_UVCoord0;
l9_1138=l9_1144;
l9_1140=l9_1138;
}
}
}
l9_1134=l9_1140;
float2 l9_1145=float2(0.0);
float2 l9_1146=(*sc_set0.UserUniforms).uv2Scale;
l9_1145=l9_1146;
float2 l9_1147=float2(0.0);
l9_1147=l9_1145;
float2 l9_1148=float2(0.0);
float2 l9_1149=(*sc_set0.UserUniforms).uv2Offset;
l9_1148=l9_1149;
float2 l9_1150=float2(0.0);
l9_1150=l9_1148;
float2 l9_1151=float2(0.0);
l9_1151=(l9_1134*l9_1147)+l9_1150;
l9_1112=l9_1151;
l9_1114=l9_1112;
}
l9_1110=l9_1114;
l9_1106=l9_1110;
l9_1109=l9_1106;
}
else
{
float2 l9_1152=float2(0.0);
l9_1152=l9_1108.Surface_UVCoord0;
l9_1107=l9_1152;
l9_1109=l9_1107;
}
l9_1105=l9_1109;
float2 l9_1153=float2(0.0);
l9_1153=l9_1105;
float2 l9_1154=float2(0.0);
l9_1154=l9_1153;
l9_1098=l9_1154;
l9_1101=l9_1098;
}
else
{
float2 l9_1155=float2(0.0);
l9_1155=l9_1100.Surface_UVCoord0;
l9_1099=l9_1155;
l9_1101=l9_1099;
}
}
}
}
l9_1094=l9_1101;
float2 l9_1156=float2(0.0);
float2 l9_1157=(*sc_set0.UserUniforms).uv3Scale;
l9_1156=l9_1157;
float2 l9_1158=float2(0.0);
l9_1158=l9_1156;
float2 l9_1159=float2(0.0);
float2 l9_1160=(*sc_set0.UserUniforms).uv3Offset;
l9_1159=l9_1160;
float2 l9_1161=float2(0.0);
l9_1161=l9_1159;
float2 l9_1162=float2(0.0);
l9_1162=(l9_1094*l9_1158)+l9_1161;
l9_1021=l9_1162;
l9_1023=l9_1021;
}
l9_1019=l9_1023;
l9_1015=l9_1019;
l9_1018=l9_1015;
}
else
{
float2 l9_1163=float2(0.0);
l9_1163=l9_1017.Surface_UVCoord0;
l9_1016=l9_1163;
l9_1018=l9_1016;
}
l9_1014=l9_1018;
float2 l9_1164=float2(0.0);
l9_1164=l9_1014;
float2 l9_1165=float2(0.0);
l9_1165=l9_1164;
l9_958=l9_1165;
l9_961=l9_958;
}
else
{
float2 l9_1166=float2(0.0);
l9_1166=l9_960.Surface_UVCoord0;
l9_959=l9_1166;
l9_961=l9_959;
}
}
}
}
l9_954=l9_961;
float4 l9_1167=float4(0.0);
float2 l9_1168=l9_954;
int l9_1169;
if ((int(detailNormalTexHasSwappedViews_tmp)!=0))
{
int l9_1170=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1170=0;
}
else
{
l9_1170=in.varStereoViewID;
}
int l9_1171=l9_1170;
l9_1169=1-l9_1171;
}
else
{
int l9_1172=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1172=0;
}
else
{
l9_1172=in.varStereoViewID;
}
int l9_1173=l9_1172;
l9_1169=l9_1173;
}
int l9_1174=l9_1169;
int l9_1175=detailNormalTexLayout_tmp;
int l9_1176=l9_1174;
float2 l9_1177=l9_1168;
bool l9_1178=(int(SC_USE_UV_TRANSFORM_detailNormalTex_tmp)!=0);
float3x3 l9_1179=(*sc_set0.UserUniforms).detailNormalTexTransform;
int2 l9_1180=int2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex_tmp,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex_tmp);
bool l9_1181=(int(SC_USE_UV_MIN_MAX_detailNormalTex_tmp)!=0);
float4 l9_1182=(*sc_set0.UserUniforms).detailNormalTexUvMinMax;
bool l9_1183=(int(SC_USE_CLAMP_TO_BORDER_detailNormalTex_tmp)!=0);
float4 l9_1184=(*sc_set0.UserUniforms).detailNormalTexBorderColor;
float l9_1185=0.0;
bool l9_1186=l9_1183&&(!l9_1181);
float l9_1187=1.0;
float l9_1188=l9_1177.x;
int l9_1189=l9_1180.x;
if (l9_1189==1)
{
l9_1188=fract(l9_1188);
}
else
{
if (l9_1189==2)
{
float l9_1190=fract(l9_1188);
float l9_1191=l9_1188-l9_1190;
float l9_1192=step(0.25,fract(l9_1191*0.5));
l9_1188=mix(l9_1190,1.0-l9_1190,fast::clamp(l9_1192,0.0,1.0));
}
}
l9_1177.x=l9_1188;
float l9_1193=l9_1177.y;
int l9_1194=l9_1180.y;
if (l9_1194==1)
{
l9_1193=fract(l9_1193);
}
else
{
if (l9_1194==2)
{
float l9_1195=fract(l9_1193);
float l9_1196=l9_1193-l9_1195;
float l9_1197=step(0.25,fract(l9_1196*0.5));
l9_1193=mix(l9_1195,1.0-l9_1195,fast::clamp(l9_1197,0.0,1.0));
}
}
l9_1177.y=l9_1193;
if (l9_1181)
{
bool l9_1198=l9_1183;
bool l9_1199;
if (l9_1198)
{
l9_1199=l9_1180.x==3;
}
else
{
l9_1199=l9_1198;
}
float l9_1200=l9_1177.x;
float l9_1201=l9_1182.x;
float l9_1202=l9_1182.z;
bool l9_1203=l9_1199;
float l9_1204=l9_1187;
float l9_1205=fast::clamp(l9_1200,l9_1201,l9_1202);
float l9_1206=step(abs(l9_1200-l9_1205),9.9999997e-06);
l9_1204*=(l9_1206+((1.0-float(l9_1203))*(1.0-l9_1206)));
l9_1200=l9_1205;
l9_1177.x=l9_1200;
l9_1187=l9_1204;
bool l9_1207=l9_1183;
bool l9_1208;
if (l9_1207)
{
l9_1208=l9_1180.y==3;
}
else
{
l9_1208=l9_1207;
}
float l9_1209=l9_1177.y;
float l9_1210=l9_1182.y;
float l9_1211=l9_1182.w;
bool l9_1212=l9_1208;
float l9_1213=l9_1187;
float l9_1214=fast::clamp(l9_1209,l9_1210,l9_1211);
float l9_1215=step(abs(l9_1209-l9_1214),9.9999997e-06);
l9_1213*=(l9_1215+((1.0-float(l9_1212))*(1.0-l9_1215)));
l9_1209=l9_1214;
l9_1177.y=l9_1209;
l9_1187=l9_1213;
}
float2 l9_1216=l9_1177;
bool l9_1217=l9_1178;
float3x3 l9_1218=l9_1179;
if (l9_1217)
{
l9_1216=float2((l9_1218*float3(l9_1216,1.0)).xy);
}
float2 l9_1219=l9_1216;
l9_1177=l9_1219;
float l9_1220=l9_1177.x;
int l9_1221=l9_1180.x;
bool l9_1222=l9_1186;
float l9_1223=l9_1187;
if ((l9_1221==0)||(l9_1221==3))
{
float l9_1224=l9_1220;
float l9_1225=0.0;
float l9_1226=1.0;
bool l9_1227=l9_1222;
float l9_1228=l9_1223;
float l9_1229=fast::clamp(l9_1224,l9_1225,l9_1226);
float l9_1230=step(abs(l9_1224-l9_1229),9.9999997e-06);
l9_1228*=(l9_1230+((1.0-float(l9_1227))*(1.0-l9_1230)));
l9_1224=l9_1229;
l9_1220=l9_1224;
l9_1223=l9_1228;
}
l9_1177.x=l9_1220;
l9_1187=l9_1223;
float l9_1231=l9_1177.y;
int l9_1232=l9_1180.y;
bool l9_1233=l9_1186;
float l9_1234=l9_1187;
if ((l9_1232==0)||(l9_1232==3))
{
float l9_1235=l9_1231;
float l9_1236=0.0;
float l9_1237=1.0;
bool l9_1238=l9_1233;
float l9_1239=l9_1234;
float l9_1240=fast::clamp(l9_1235,l9_1236,l9_1237);
float l9_1241=step(abs(l9_1235-l9_1240),9.9999997e-06);
l9_1239*=(l9_1241+((1.0-float(l9_1238))*(1.0-l9_1241)));
l9_1235=l9_1240;
l9_1231=l9_1235;
l9_1234=l9_1239;
}
l9_1177.y=l9_1231;
l9_1187=l9_1234;
float2 l9_1242=l9_1177;
int l9_1243=l9_1175;
int l9_1244=l9_1176;
float l9_1245=l9_1185;
float2 l9_1246=l9_1242;
int l9_1247=l9_1243;
int l9_1248=l9_1244;
float3 l9_1249=float3(0.0);
if (l9_1247==0)
{
l9_1249=float3(l9_1246,0.0);
}
else
{
if (l9_1247==1)
{
l9_1249=float3(l9_1246.x,(l9_1246.y*0.5)+(0.5-(float(l9_1248)*0.5)),0.0);
}
else
{
l9_1249=float3(l9_1246,float(l9_1248));
}
}
float3 l9_1250=l9_1249;
float3 l9_1251=l9_1250;
float4 l9_1252=sc_set0.detailNormalTex.sample(sc_set0.detailNormalTexSmpSC,l9_1251.xy,bias(l9_1245));
float4 l9_1253=l9_1252;
if (l9_1183)
{
l9_1253=mix(l9_1184,l9_1253,float4(l9_1187));
}
float4 l9_1254=l9_1253;
float4 l9_1255=l9_1254;
float3 l9_1256=(l9_1255.xyz*1.9921875)-float3(1.0);
l9_1255=float4(l9_1256.x,l9_1256.y,l9_1256.z,l9_1255.w);
l9_1167=l9_1255;
l9_950=l9_1167.xyz;
l9_953=l9_950;
}
else
{
l9_953=l9_951;
}
l9_949=l9_953;
float3 l9_1257=float3(0.0);
float3 l9_1258=l9_859.xyz;
float l9_1259=(*sc_set0.UserUniforms).Port_Strength1_N200;
float3 l9_1260=l9_949;
float l9_1261=(*sc_set0.UserUniforms).Port_Strength2_N200;
float3 l9_1262=l9_1258;
float l9_1263=l9_1259;
float3 l9_1264=l9_1260;
float l9_1265=l9_1261;
float3 l9_1266=mix(float3(0.0,0.0,1.0),l9_1262,float3(l9_1263))+float3(0.0,0.0,1.0);
float3 l9_1267=mix(float3(0.0,0.0,1.0),l9_1264,float3(l9_1265))*float3(-1.0,-1.0,1.0);
float3 l9_1268=normalize((l9_1266*dot(l9_1266,l9_1267))-(l9_1267*l9_1266.z));
l9_1260=l9_1268;
float3 l9_1269=l9_1260;
l9_1257=l9_1269;
float3 l9_1270=float3(0.0);
l9_1270=l9_645*l9_1257;
float3 l9_1271=float3(0.0);
float3 l9_1272=l9_1270;
float l9_1273=dot(l9_1272,l9_1272);
float l9_1274;
if (l9_1273>0.0)
{
l9_1274=1.0/sqrt(l9_1273);
}
else
{
l9_1274=0.0;
}
float l9_1275=l9_1274;
float3 l9_1276=l9_1272*l9_1275;
l9_1271=l9_1276;
param_17=l9_1271;
param_19=param_17;
}
else
{
float3 l9_1277=float3(0.0);
l9_1277=param_20.VertexNormal_WorldSpace;
float3 l9_1278=float3(0.0);
float3 l9_1279=l9_1277;
float l9_1280=dot(l9_1279,l9_1279);
float l9_1281;
if (l9_1280>0.0)
{
l9_1281=1.0/sqrt(l9_1280);
}
else
{
l9_1281=0.0;
}
float l9_1282=l9_1281;
float3 l9_1283=l9_1279*l9_1282;
l9_1278=l9_1283;
param_18=l9_1278;
param_19=param_18;
}
Result_N337=param_19;
float3 Export_N334=float3(0.0);
Export_N334=Result_N337;
float param_21=Export_N158;
float3 param_22=Export_N334;
ssGlobals param_23=Globals;
if (!(int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
param_23.BumpedNormal=param_22;
}
param_21=fast::clamp(param_21,0.0,1.0);
float l9_1284=param_21;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (l9_1284<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_1285=gl_FragCoord;
float2 l9_1286=floor(mod(l9_1285.xy,float2(4.0)));
float l9_1287=(mod(dot(l9_1286,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (l9_1284<l9_1287)
{
discard_fragment();
}
}
float3 l9_1288=param_23.PositionWS;
float3 l9_1289=param_23.BumpedNormal;
float l9_1290=1.0;
float3 l9_1291=l9_1288;
float3 l9_1292=l9_1289;
float l9_1293=l9_1290;
uint l9_1294=0u;
uint3 l9_1295=uint3(round((l9_1291-(*sc_set0.UserUniforms).sc_RayTracingOriginOffset)*(*sc_set0.UserUniforms).sc_RayTracingOriginScale));
out.sc_RayTracingPositionAndMask=uint4(l9_1295.x,l9_1295.y,l9_1295.z,out.sc_RayTracingPositionAndMask.w);
out.sc_RayTracingPositionAndMask.w=(*sc_set0.UserUniforms).sc_RayTracingReceiverMask;
float3 l9_1296=l9_1292;
float l9_1297=dot(abs(l9_1296),float3(1.0));
l9_1296/=float3(l9_1297);
float2 l9_1298=float2(fast::clamp(-l9_1296.z,0.0,1.0));
float2 l9_1299=l9_1296.xy+mix(-l9_1298,l9_1298,step(float2(0.0),l9_1296.xy));
uint l9_1300=as_type<uint>(half2(l9_1299));
uint2 l9_1301=uint2(l9_1300&65535u,l9_1300>>16u);
out.sc_RayTracingNormalAndMore=uint4(l9_1301.x,l9_1301.y,out.sc_RayTracingNormalAndMore.z,out.sc_RayTracingNormalAndMore.w);
out.sc_RayTracingNormalAndMore.z=l9_1294;
uint l9_1302=uint(fast::clamp(l9_1293,0.0,1.0)*1000.0);
l9_1302 |= (((*sc_set0.UserUniforms).sc_RayTracingReceiverId%32u)<<10u);
out.sc_RayTracingNormalAndMore.w=l9_1302;
return out;
}
} // RECEIVER MODE SHADER
