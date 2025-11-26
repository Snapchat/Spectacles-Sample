#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
#define SC_ENABLE_INSTANCED_RENDERING
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
// SCC_BACKEND_SHADER_FLAG_DISABLE_FRUSTUM_CULLING
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
//sampler sampler intensityTextureSmpSC 0:16
//sampler sampler sc_ScreenTextureSmpSC 0:21
//texture texture2D intensityTexture 0:1:0:16
//texture texture2D sc_ScreenTexture 0:13:0:21
//ubo float sc_BonesUBO 0:0:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:24:4352 {
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
//float4 voxelization_params_0 3824
//float4 voxelization_params_frustum_lrbt 3840
//float4 voxelization_params_frustum_nf 3856
//float3 voxelization_params_camera_pos 3872
//float4x4 sc_ModelMatrixVoxelization 3888
//float correctedIntensity 3952
//float3x3 intensityTextureTransform 4016
//float4 intensityTextureUvMinMax 4064
//float4 intensityTextureBorderColor 4080
//int PreviewEnabled 4244
//float alphaTestThreshold 4252
//float lineWeight 4256
//float4 lineColor 4272
//float Port_Input1_N016 4288
//float Port_Input1_N013 4292
//float Port_Input1_N017 4296
//float4 Port_Value1_N015 4304
//float Port_Input1_N024 4320
//float4 Port_Value1_N022 4336
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
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 30 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 31 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 32 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 33 0
//spec_const bool UseViewSpaceDepthVariant 34 1
//spec_const bool intensityTextureHasSwappedViews 35 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 36 0
//spec_const bool sc_BlendMode_Add 37 0
//spec_const bool sc_BlendMode_AlphaTest 38 0
//spec_const bool sc_BlendMode_AlphaToCoverage 39 0
//spec_const bool sc_BlendMode_ColoredGlass 40 0
//spec_const bool sc_BlendMode_Custom 41 0
//spec_const bool sc_BlendMode_Max 42 0
//spec_const bool sc_BlendMode_Min 43 0
//spec_const bool sc_BlendMode_MultiplyOriginal 44 0
//spec_const bool sc_BlendMode_Multiply 45 0
//spec_const bool sc_BlendMode_Normal 46 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 47 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 48 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 49 0
//spec_const bool sc_BlendMode_Screen 50 0
//spec_const bool sc_DepthOnly 51 0
//spec_const bool sc_FramebufferFetch 52 0
//spec_const bool sc_MotionVectorsPass 53 0
//spec_const bool sc_OITCompositingPass 54 0
//spec_const bool sc_OITDepthBoundsPass 55 0
//spec_const bool sc_OITDepthGatherPass 56 0
//spec_const bool sc_OutputBounds 57 0
//spec_const bool sc_ProjectiveShadowsCaster 58 0
//spec_const bool sc_ProjectiveShadowsReceiver 59 0
//spec_const bool sc_RenderAlphaToColor 60 0
//spec_const bool sc_ScreenTextureHasSwappedViews 61 0
//spec_const bool sc_TAAEnabled 62 0
//spec_const bool sc_VertexBlendingUseNormals 63 0
//spec_const bool sc_VertexBlending 64 0
//spec_const bool sc_Voxelization 65 0
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 66 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 67 -1
//spec_const int intensityTextureLayout 68 0
//spec_const int sc_DepthBufferMode 69 0
//spec_const int sc_RenderingSpace 70 -1
//spec_const int sc_ScreenTextureLayout 71 0
//spec_const int sc_ShaderCacheConstant 72 0
//spec_const int sc_SkinBonesCount 73 0
//spec_const int sc_StereoRenderingMode 74 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 75 0
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
constant bool ENABLE_STIPPLE_PATTERN_TEST [[function_constant(30)]];
constant bool ENABLE_STIPPLE_PATTERN_TEST_tmp = is_function_constant_defined(ENABLE_STIPPLE_PATTERN_TEST) ? ENABLE_STIPPLE_PATTERN_TEST : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(31)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(32)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(33)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool UseViewSpaceDepthVariant [[function_constant(34)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool intensityTextureHasSwappedViews [[function_constant(35)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(36)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(37)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(38)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(39)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(40)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(41)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(42)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(43)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(44)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(45)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(46)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(47)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(48)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(49)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(50)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(51)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_FramebufferFetch [[function_constant(52)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_MotionVectorsPass [[function_constant(53)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(54)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(55)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(56)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(57)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(58)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(59)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RenderAlphaToColor [[function_constant(60)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(61)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(62)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(63)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(64)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(65)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(66)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(67)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int intensityTextureLayout [[function_constant(68)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int sc_DepthBufferMode [[function_constant(69)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_RenderingSpace [[function_constant(70)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(71)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(72)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(73)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(74)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(75)]];
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
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float3 SurfacePosition_ObjectSpace;
float3 VertexNormal_WorldSpace;
float3 VertexNormal_ObjectSpace;
float gInstanceID;
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
float lineWeight;
float4 lineColor;
float Port_Input1_N016;
float Port_Input1_N013;
float Port_Input1_N017;
float4 Port_Value1_N015;
float Port_Input1_N024;
float4 Port_Value1_N022;
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
struct sc_Set0
{
constant sc_Bones_obj* sc_BonesUBO [[id(0)]];
texture2d<float> intensityTexture [[id(1)]];
texture2d<float> sc_ScreenTexture [[id(13)]];
sampler intensityTextureSmpSC [[id(16)]];
sampler sc_ScreenTextureSmpSC [[id(21)]];
constant userUniformsObj* UserUniforms [[id(24)]];
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
float Interpolator_gInstanceID [[user(locn13)]];
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
int ssInstanceID=0;
out.PreviewVertexColor=float4(0.5);
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=float4(0.5);
PreviewInfo.Saved=false;
out.PreviewVertexSaved=0.0;
sc_Vertex_t l9_0;
l9_0.position=in.position;
l9_0.normal=in.normal;
l9_0.tangent=in.tangent.xyz;
l9_0.texture0=in.texture0;
l9_0.texture1=in.texture1;
sc_Vertex_t l9_1=l9_0;
sc_Vertex_t param=l9_1;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_2=param;
param=l9_2;
}
int l9_3=gl_InstanceIndex;
ssInstanceID=l9_3;
sc_Vertex_t l9_4=param;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_5=l9_4;
float3 l9_6=in.blendShape0Pos;
float3 l9_7=in.blendShape0Normal;
float l9_8=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_9=l9_5;
float3 l9_10=l9_6;
float l9_11=l9_8;
float3 l9_12=l9_9.position.xyz+(l9_10*l9_11);
l9_9.position=float4(l9_12.x,l9_12.y,l9_12.z,l9_9.position.w);
l9_5=l9_9;
l9_5.normal+=(l9_7*l9_8);
l9_4=l9_5;
sc_Vertex_t l9_13=l9_4;
float3 l9_14=in.blendShape1Pos;
float3 l9_15=in.blendShape1Normal;
float l9_16=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_17=l9_13;
float3 l9_18=l9_14;
float l9_19=l9_16;
float3 l9_20=l9_17.position.xyz+(l9_18*l9_19);
l9_17.position=float4(l9_20.x,l9_20.y,l9_20.z,l9_17.position.w);
l9_13=l9_17;
l9_13.normal+=(l9_15*l9_16);
l9_4=l9_13;
sc_Vertex_t l9_21=l9_4;
float3 l9_22=in.blendShape2Pos;
float3 l9_23=in.blendShape2Normal;
float l9_24=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_25=l9_21;
float3 l9_26=l9_22;
float l9_27=l9_24;
float3 l9_28=l9_25.position.xyz+(l9_26*l9_27);
l9_25.position=float4(l9_28.x,l9_28.y,l9_28.z,l9_25.position.w);
l9_21=l9_25;
l9_21.normal+=(l9_23*l9_24);
l9_4=l9_21;
}
else
{
sc_Vertex_t l9_29=l9_4;
float3 l9_30=in.blendShape0Pos;
float l9_31=(*sc_set0.UserUniforms).weights0.x;
float3 l9_32=l9_29.position.xyz+(l9_30*l9_31);
l9_29.position=float4(l9_32.x,l9_32.y,l9_32.z,l9_29.position.w);
l9_4=l9_29;
sc_Vertex_t l9_33=l9_4;
float3 l9_34=in.blendShape1Pos;
float l9_35=(*sc_set0.UserUniforms).weights0.y;
float3 l9_36=l9_33.position.xyz+(l9_34*l9_35);
l9_33.position=float4(l9_36.x,l9_36.y,l9_36.z,l9_33.position.w);
l9_4=l9_33;
sc_Vertex_t l9_37=l9_4;
float3 l9_38=in.blendShape2Pos;
float l9_39=(*sc_set0.UserUniforms).weights0.z;
float3 l9_40=l9_37.position.xyz+(l9_38*l9_39);
l9_37.position=float4(l9_40.x,l9_40.y,l9_40.z,l9_37.position.w);
l9_4=l9_37;
sc_Vertex_t l9_41=l9_4;
float3 l9_42=in.blendShape3Pos;
float l9_43=(*sc_set0.UserUniforms).weights0.w;
float3 l9_44=l9_41.position.xyz+(l9_42*l9_43);
l9_41.position=float4(l9_44.x,l9_44.y,l9_44.z,l9_41.position.w);
l9_4=l9_41;
sc_Vertex_t l9_45=l9_4;
float3 l9_46=in.blendShape4Pos;
float l9_47=(*sc_set0.UserUniforms).weights1.x;
float3 l9_48=l9_45.position.xyz+(l9_46*l9_47);
l9_45.position=float4(l9_48.x,l9_48.y,l9_48.z,l9_45.position.w);
l9_4=l9_45;
sc_Vertex_t l9_49=l9_4;
float3 l9_50=in.blendShape5Pos;
float l9_51=(*sc_set0.UserUniforms).weights1.y;
float3 l9_52=l9_49.position.xyz+(l9_50*l9_51);
l9_49.position=float4(l9_52.x,l9_52.y,l9_52.z,l9_49.position.w);
l9_4=l9_49;
}
}
param=l9_4;
sc_Vertex_t l9_53=param;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_54=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_54=float4(1.0,fract(in.boneData.yzw));
l9_54.x-=dot(l9_54.yzw,float3(1.0));
}
float4 l9_55=l9_54;
float4 l9_56=l9_55;
int l9_57=int(in.boneData.x);
int l9_58=int(in.boneData.y);
int l9_59=int(in.boneData.z);
int l9_60=int(in.boneData.w);
int l9_61=l9_57;
float4 l9_62=l9_53.position;
float3 l9_63=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_64=l9_61;
float4 l9_65=(*sc_set0.sc_BonesUBO).sc_Bones[l9_64].boneMatrix[0];
float4 l9_66=(*sc_set0.sc_BonesUBO).sc_Bones[l9_64].boneMatrix[1];
float4 l9_67=(*sc_set0.sc_BonesUBO).sc_Bones[l9_64].boneMatrix[2];
float4 l9_68[3];
l9_68[0]=l9_65;
l9_68[1]=l9_66;
l9_68[2]=l9_67;
l9_63=float3(dot(l9_62,l9_68[0]),dot(l9_62,l9_68[1]),dot(l9_62,l9_68[2]));
}
else
{
l9_63=l9_62.xyz;
}
float3 l9_69=l9_63;
float3 l9_70=l9_69;
float l9_71=l9_56.x;
int l9_72=l9_58;
float4 l9_73=l9_53.position;
float3 l9_74=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_75=l9_72;
float4 l9_76=(*sc_set0.sc_BonesUBO).sc_Bones[l9_75].boneMatrix[0];
float4 l9_77=(*sc_set0.sc_BonesUBO).sc_Bones[l9_75].boneMatrix[1];
float4 l9_78=(*sc_set0.sc_BonesUBO).sc_Bones[l9_75].boneMatrix[2];
float4 l9_79[3];
l9_79[0]=l9_76;
l9_79[1]=l9_77;
l9_79[2]=l9_78;
l9_74=float3(dot(l9_73,l9_79[0]),dot(l9_73,l9_79[1]),dot(l9_73,l9_79[2]));
}
else
{
l9_74=l9_73.xyz;
}
float3 l9_80=l9_74;
float3 l9_81=l9_80;
float l9_82=l9_56.y;
int l9_83=l9_59;
float4 l9_84=l9_53.position;
float3 l9_85=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_86=l9_83;
float4 l9_87=(*sc_set0.sc_BonesUBO).sc_Bones[l9_86].boneMatrix[0];
float4 l9_88=(*sc_set0.sc_BonesUBO).sc_Bones[l9_86].boneMatrix[1];
float4 l9_89=(*sc_set0.sc_BonesUBO).sc_Bones[l9_86].boneMatrix[2];
float4 l9_90[3];
l9_90[0]=l9_87;
l9_90[1]=l9_88;
l9_90[2]=l9_89;
l9_85=float3(dot(l9_84,l9_90[0]),dot(l9_84,l9_90[1]),dot(l9_84,l9_90[2]));
}
else
{
l9_85=l9_84.xyz;
}
float3 l9_91=l9_85;
float3 l9_92=l9_91;
float l9_93=l9_56.z;
int l9_94=l9_60;
float4 l9_95=l9_53.position;
float3 l9_96=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_97=l9_94;
float4 l9_98=(*sc_set0.sc_BonesUBO).sc_Bones[l9_97].boneMatrix[0];
float4 l9_99=(*sc_set0.sc_BonesUBO).sc_Bones[l9_97].boneMatrix[1];
float4 l9_100=(*sc_set0.sc_BonesUBO).sc_Bones[l9_97].boneMatrix[2];
float4 l9_101[3];
l9_101[0]=l9_98;
l9_101[1]=l9_99;
l9_101[2]=l9_100;
l9_96=float3(dot(l9_95,l9_101[0]),dot(l9_95,l9_101[1]),dot(l9_95,l9_101[2]));
}
else
{
l9_96=l9_95.xyz;
}
float3 l9_102=l9_96;
float3 l9_103=(((l9_70*l9_71)+(l9_81*l9_82))+(l9_92*l9_93))+(l9_102*l9_56.w);
l9_53.position=float4(l9_103.x,l9_103.y,l9_103.z,l9_53.position.w);
int l9_104=l9_57;
float3x3 l9_105=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_104].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_104].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_104].normalMatrix[2].xyz));
float3x3 l9_106=l9_105;
float3x3 l9_107=l9_106;
int l9_108=l9_58;
float3x3 l9_109=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_108].normalMatrix[2].xyz));
float3x3 l9_110=l9_109;
float3x3 l9_111=l9_110;
int l9_112=l9_59;
float3x3 l9_113=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_112].normalMatrix[2].xyz));
float3x3 l9_114=l9_113;
float3x3 l9_115=l9_114;
int l9_116=l9_60;
float3x3 l9_117=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_116].normalMatrix[2].xyz));
float3x3 l9_118=l9_117;
float3x3 l9_119=l9_118;
l9_53.normal=((((l9_107*l9_53.normal)*l9_56.x)+((l9_111*l9_53.normal)*l9_56.y))+((l9_115*l9_53.normal)*l9_56.z))+((l9_119*l9_53.normal)*l9_56.w);
l9_53.tangent=((((l9_107*l9_53.tangent)*l9_56.x)+((l9_111*l9_53.tangent)*l9_56.y))+((l9_115*l9_53.tangent)*l9_56.z))+((l9_119*l9_53.tangent)*l9_56.w);
}
param=l9_53;
if (sc_RenderingSpace_tmp==3)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==4)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
out.varPosAndMotion=float4(param.position.xyz.x,param.position.xyz.y,param.position.xyz.z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
float3 l9_120=((*sc_set0.UserUniforms).sc_ModelMatrix*param.position).xyz;
out.varPosAndMotion=float4(l9_120.x,l9_120.y,l9_120.z,out.varPosAndMotion.w);
float3 l9_121=(*sc_set0.UserUniforms).sc_NormalMatrix*param.normal;
out.varNormalAndMotion=float4(l9_121.x,l9_121.y,l9_121.z,out.varNormalAndMotion.w);
float3 l9_122=(*sc_set0.UserUniforms).sc_NormalMatrix*param.tangent;
out.varTangent=float4(l9_122.x,l9_122.y,l9_122.z,out.varTangent.w);
}
}
}
}
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
param.texture0.x=1.0-param.texture0.x;
}
out.varColor=in.color;
sc_Vertex_t v=param;
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
Globals.SurfacePosition_ObjectSpace=((*sc_set0.UserUniforms).sc_ModelMatrixInverse*float4(out.varPosAndMotion.xyz,1.0)).xyz;
Globals.VertexNormal_WorldSpace=out.varNormalAndMotion.xyz;
Globals.VertexNormal_ObjectSpace=normalize(((*sc_set0.UserUniforms).sc_ModelMatrixInverse*float4(Globals.VertexNormal_WorldSpace,0.0)).xyz);
Globals.gInstanceID=float(ssInstanceID);
float3 WorldPosition=out.varPosAndMotion.xyz;
float3 WorldNormal=out.varNormalAndMotion.xyz;
float3 WorldTangent=out.varTangent.xyz;
float3 Position_N8=float3(0.0);
Position_N8=Globals.SurfacePosition_ObjectSpace;
float3 Result_N19=float3(0.0);
float param_1=0.0;
float3 param_2=float3(0.0);
float3 param_3=float3(0.0);
ssGlobals param_5=Globals;
float l9_123=0.0;
float l9_124=(*sc_set0.UserUniforms).lineWeight;
l9_123=l9_124;
float l9_125=0.0;
l9_125=float(l9_123<(*sc_set0.UserUniforms).Port_Input1_N016);
param_1=l9_125;
float3 param_4;
if ((param_1*1.0)!=0.0)
{
float3 l9_126=float3(0.0);
l9_126=param_5.VertexNormal_ObjectSpace;
float3 l9_127=float3(0.0);
l9_127=-l9_126;
param_2=l9_127;
param_4=param_2;
}
else
{
float3 l9_128=float3(0.0);
l9_128=param_5.VertexNormal_ObjectSpace;
param_3=l9_128;
param_4=param_3;
}
Result_N19=param_4;
float3 Output_N10=float3(0.0);
float3 param_6=Result_N19;
float l9_129=dot(param_6,param_6);
float l9_130;
if (l9_129>0.0)
{
l9_130=1.0/sqrt(l9_129);
}
else
{
l9_130=0.0;
}
float l9_131=l9_130;
float3 param_7=param_6*l9_131;
Output_N10=param_7;
float Result_N14=0.0;
float param_8=0.0;
float param_9=0.0;
float param_10=0.0;
float l9_132=0.0;
l9_132=float(ssInstanceID);
float l9_133=0.0;
l9_133=float(l9_132>(*sc_set0.UserUniforms).Port_Input1_N013);
param_8=l9_133;
float param_11;
if ((param_8*1.0)!=0.0)
{
float l9_134=0.0;
float l9_135=(*sc_set0.UserUniforms).lineWeight;
l9_134=l9_135;
float l9_136=0.0;
l9_136=abs(l9_134);
float l9_137=0.0;
l9_137=l9_136*(*sc_set0.UserUniforms).Port_Input1_N017;
param_9=l9_137;
param_11=param_9;
}
else
{
float l9_138=0.0;
float l9_139=(*sc_set0.UserUniforms).lineWeight;
l9_138=l9_139;
float l9_140=0.0;
l9_140=abs(l9_138);
param_10=l9_140;
param_11=param_10;
}
Result_N14=param_11;
float3 Output_N11=float3(0.0);
Output_N11=Output_N10*float3(Result_N14);
float3 Output_N9=float3(0.0);
Output_N9=Position_N8+Output_N11;
float3 VectorOut_N2=float3(0.0);
VectorOut_N2=((*sc_set0.UserUniforms).sc_ModelMatrix*float4(Output_N9,1.0)).xyz;
WorldPosition=VectorOut_N2;
float3 Result_N19_1=float3(0.0);
float param_12=0.0;
float3 param_13=float3(0.0);
float3 param_14=float3(0.0);
ssGlobals param_16=Globals;
float l9_141=0.0;
float l9_142=(*sc_set0.UserUniforms).lineWeight;
l9_141=l9_142;
float l9_143=0.0;
l9_143=float(l9_141<(*sc_set0.UserUniforms).Port_Input1_N016);
param_12=l9_143;
float3 param_15;
if ((param_12*1.0)!=0.0)
{
float3 l9_144=float3(0.0);
l9_144=param_16.VertexNormal_ObjectSpace;
float3 l9_145=float3(0.0);
l9_145=-l9_144;
param_13=l9_145;
param_15=param_13;
}
else
{
float3 l9_146=float3(0.0);
l9_146=param_16.VertexNormal_ObjectSpace;
param_14=l9_146;
param_15=param_14;
}
Result_N19_1=param_15;
WorldNormal=Result_N19_1;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPosAndMotion.xyz;
WorldNormal=out.varNormalAndMotion.xyz;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_17=v;
float3 param_18=WorldPosition;
float3 param_19=WorldNormal;
float3 param_20=WorldTangent;
float4 param_21=v.position;
out.varPosAndMotion=float4(param_18.x,param_18.y,param_18.z,out.varPosAndMotion.w);
float3 l9_147=normalize(param_19);
out.varNormalAndMotion=float4(l9_147.x,l9_147.y,l9_147.z,out.varNormalAndMotion.w);
float3 l9_148=normalize(param_20);
out.varTangent=float4(l9_148.x,l9_148.y,l9_148.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_149=param_17.position;
float4 l9_150=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
int l9_151=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_151=0;
}
else
{
l9_151=gl_InstanceIndex%2;
}
int l9_152=l9_151;
l9_150=(*sc_set0.UserUniforms).sc_ProjectionMatrixInverseArray[l9_152]*l9_149;
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_153=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_153=0;
}
else
{
l9_153=gl_InstanceIndex%2;
}
int l9_154=l9_153;
l9_150=(*sc_set0.UserUniforms).sc_ViewMatrixArray[l9_154]*l9_149;
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_155=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_155=0;
}
else
{
l9_155=gl_InstanceIndex%2;
}
int l9_156=l9_155;
l9_150=(*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_156]*l9_149;
}
else
{
l9_150=l9_149;
}
}
}
float4 l9_157=l9_150;
out.varViewSpaceDepth=-l9_157.z;
}
float4 l9_158=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
l9_158=param_21;
}
else
{
if (sc_RenderingSpace_tmp==4)
{
int l9_159=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_159=0;
}
else
{
l9_159=gl_InstanceIndex%2;
}
int l9_160=l9_159;
l9_158=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_160]*param_17.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_161=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_161=0;
}
else
{
l9_161=gl_InstanceIndex%2;
}
int l9_162=l9_161;
l9_158=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_162]*float4(out.varPosAndMotion.xyz,1.0);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_163=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_163=0;
}
else
{
l9_163=gl_InstanceIndex%2;
}
int l9_164=l9_163;
l9_158=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_164]*float4(out.varPosAndMotion.xyz,1.0);
}
}
}
}
out.varTex01=float4(param_17.texture0,param_17.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_165=param_17.position;
float4 l9_166=l9_165;
if (sc_RenderingSpace_tmp==1)
{
l9_166=(*sc_set0.UserUniforms).sc_ModelMatrix*l9_165;
}
float4 l9_167=(*sc_set0.UserUniforms).sc_ProjectorMatrix*l9_166;
float2 l9_168=((l9_167.xy/float2(l9_167.w))*0.5)+float2(0.5);
out.varShadowTex=l9_168;
}
float4 l9_169=l9_158;
if (sc_DepthBufferMode_tmp==1)
{
int l9_170=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_170=0;
}
else
{
l9_170=gl_InstanceIndex%2;
}
int l9_171=l9_170;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_171][2].w!=0.0)
{
float l9_172=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
l9_169.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+l9_169.w))*l9_172)-1.0)*l9_169.w;
}
}
float4 l9_173=l9_169;
l9_158=l9_173;
float4 l9_174=l9_158;
if ((int(sc_TAAEnabled_tmp)!=0))
{
float2 l9_175=l9_174.xy+((*sc_set0.UserUniforms).sc_TAAJitterOffset*l9_174.w);
l9_174=float4(l9_175.x,l9_175.y,l9_174.z,l9_174.w);
}
float4 l9_176=l9_174;
l9_158=l9_176;
float4 l9_177=l9_158;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_177.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_178=l9_177;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_179=dot(l9_178,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_180=l9_179;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_180;
}
}
float4 l9_181=float4(l9_177.x,-l9_177.y,(l9_177.z*0.5)+(l9_177.w*0.5),l9_177.w);
out.gl_Position=l9_181;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_183=param_17;
sc_Vertex_t l9_184=l9_183;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_185=l9_184;
float3 l9_186=in.blendShape0Pos;
float3 l9_187=in.blendShape0Normal;
float l9_188=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_189=l9_185;
float3 l9_190=l9_186;
float l9_191=l9_188;
float3 l9_192=l9_189.position.xyz+(l9_190*l9_191);
l9_189.position=float4(l9_192.x,l9_192.y,l9_192.z,l9_189.position.w);
l9_185=l9_189;
l9_185.normal+=(l9_187*l9_188);
l9_184=l9_185;
sc_Vertex_t l9_193=l9_184;
float3 l9_194=in.blendShape1Pos;
float3 l9_195=in.blendShape1Normal;
float l9_196=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_197=l9_193;
float3 l9_198=l9_194;
float l9_199=l9_196;
float3 l9_200=l9_197.position.xyz+(l9_198*l9_199);
l9_197.position=float4(l9_200.x,l9_200.y,l9_200.z,l9_197.position.w);
l9_193=l9_197;
l9_193.normal+=(l9_195*l9_196);
l9_184=l9_193;
sc_Vertex_t l9_201=l9_184;
float3 l9_202=in.blendShape2Pos;
float3 l9_203=in.blendShape2Normal;
float l9_204=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_205=l9_201;
float3 l9_206=l9_202;
float l9_207=l9_204;
float3 l9_208=l9_205.position.xyz+(l9_206*l9_207);
l9_205.position=float4(l9_208.x,l9_208.y,l9_208.z,l9_205.position.w);
l9_201=l9_205;
l9_201.normal+=(l9_203*l9_204);
l9_184=l9_201;
}
else
{
sc_Vertex_t l9_209=l9_184;
float3 l9_210=in.blendShape0Pos;
float l9_211=(*sc_set0.UserUniforms).weights0.x;
float3 l9_212=l9_209.position.xyz+(l9_210*l9_211);
l9_209.position=float4(l9_212.x,l9_212.y,l9_212.z,l9_209.position.w);
l9_184=l9_209;
sc_Vertex_t l9_213=l9_184;
float3 l9_214=in.blendShape1Pos;
float l9_215=(*sc_set0.UserUniforms).weights0.y;
float3 l9_216=l9_213.position.xyz+(l9_214*l9_215);
l9_213.position=float4(l9_216.x,l9_216.y,l9_216.z,l9_213.position.w);
l9_184=l9_213;
sc_Vertex_t l9_217=l9_184;
float3 l9_218=in.blendShape2Pos;
float l9_219=(*sc_set0.UserUniforms).weights0.z;
float3 l9_220=l9_217.position.xyz+(l9_218*l9_219);
l9_217.position=float4(l9_220.x,l9_220.y,l9_220.z,l9_217.position.w);
l9_184=l9_217;
sc_Vertex_t l9_221=l9_184;
float3 l9_222=in.blendShape3Pos;
float l9_223=(*sc_set0.UserUniforms).weights0.w;
float3 l9_224=l9_221.position.xyz+(l9_222*l9_223);
l9_221.position=float4(l9_224.x,l9_224.y,l9_224.z,l9_221.position.w);
l9_184=l9_221;
sc_Vertex_t l9_225=l9_184;
float3 l9_226=in.blendShape4Pos;
float l9_227=(*sc_set0.UserUniforms).weights1.x;
float3 l9_228=l9_225.position.xyz+(l9_226*l9_227);
l9_225.position=float4(l9_228.x,l9_228.y,l9_228.z,l9_225.position.w);
l9_184=l9_225;
sc_Vertex_t l9_229=l9_184;
float3 l9_230=in.blendShape5Pos;
float l9_231=(*sc_set0.UserUniforms).weights1.y;
float3 l9_232=l9_229.position.xyz+(l9_230*l9_231);
l9_229.position=float4(l9_232.x,l9_232.y,l9_232.z,l9_229.position.w);
l9_184=l9_229;
}
}
l9_183=l9_184;
sc_Vertex_t l9_233=l9_183;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_234=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_234=float4(1.0,fract(in.boneData.yzw));
l9_234.x-=dot(l9_234.yzw,float3(1.0));
}
float4 l9_235=l9_234;
float4 l9_236=l9_235;
int l9_237=int(in.boneData.x);
int l9_238=int(in.boneData.y);
int l9_239=int(in.boneData.z);
int l9_240=int(in.boneData.w);
int l9_241=l9_237;
float4 l9_242=l9_233.position;
float3 l9_243=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_244=l9_241;
float4 l9_245=(*sc_set0.sc_BonesUBO).sc_Bones[l9_244].boneMatrix[0];
float4 l9_246=(*sc_set0.sc_BonesUBO).sc_Bones[l9_244].boneMatrix[1];
float4 l9_247=(*sc_set0.sc_BonesUBO).sc_Bones[l9_244].boneMatrix[2];
float4 l9_248[3];
l9_248[0]=l9_245;
l9_248[1]=l9_246;
l9_248[2]=l9_247;
l9_243=float3(dot(l9_242,l9_248[0]),dot(l9_242,l9_248[1]),dot(l9_242,l9_248[2]));
}
else
{
l9_243=l9_242.xyz;
}
float3 l9_249=l9_243;
float3 l9_250=l9_249;
float l9_251=l9_236.x;
int l9_252=l9_238;
float4 l9_253=l9_233.position;
float3 l9_254=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_255=l9_252;
float4 l9_256=(*sc_set0.sc_BonesUBO).sc_Bones[l9_255].boneMatrix[0];
float4 l9_257=(*sc_set0.sc_BonesUBO).sc_Bones[l9_255].boneMatrix[1];
float4 l9_258=(*sc_set0.sc_BonesUBO).sc_Bones[l9_255].boneMatrix[2];
float4 l9_259[3];
l9_259[0]=l9_256;
l9_259[1]=l9_257;
l9_259[2]=l9_258;
l9_254=float3(dot(l9_253,l9_259[0]),dot(l9_253,l9_259[1]),dot(l9_253,l9_259[2]));
}
else
{
l9_254=l9_253.xyz;
}
float3 l9_260=l9_254;
float3 l9_261=l9_260;
float l9_262=l9_236.y;
int l9_263=l9_239;
float4 l9_264=l9_233.position;
float3 l9_265=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_266=l9_263;
float4 l9_267=(*sc_set0.sc_BonesUBO).sc_Bones[l9_266].boneMatrix[0];
float4 l9_268=(*sc_set0.sc_BonesUBO).sc_Bones[l9_266].boneMatrix[1];
float4 l9_269=(*sc_set0.sc_BonesUBO).sc_Bones[l9_266].boneMatrix[2];
float4 l9_270[3];
l9_270[0]=l9_267;
l9_270[1]=l9_268;
l9_270[2]=l9_269;
l9_265=float3(dot(l9_264,l9_270[0]),dot(l9_264,l9_270[1]),dot(l9_264,l9_270[2]));
}
else
{
l9_265=l9_264.xyz;
}
float3 l9_271=l9_265;
float3 l9_272=l9_271;
float l9_273=l9_236.z;
int l9_274=l9_240;
float4 l9_275=l9_233.position;
float3 l9_276=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_277=l9_274;
float4 l9_278=(*sc_set0.sc_BonesUBO).sc_Bones[l9_277].boneMatrix[0];
float4 l9_279=(*sc_set0.sc_BonesUBO).sc_Bones[l9_277].boneMatrix[1];
float4 l9_280=(*sc_set0.sc_BonesUBO).sc_Bones[l9_277].boneMatrix[2];
float4 l9_281[3];
l9_281[0]=l9_278;
l9_281[1]=l9_279;
l9_281[2]=l9_280;
l9_276=float3(dot(l9_275,l9_281[0]),dot(l9_275,l9_281[1]),dot(l9_275,l9_281[2]));
}
else
{
l9_276=l9_275.xyz;
}
float3 l9_282=l9_276;
float3 l9_283=(((l9_250*l9_251)+(l9_261*l9_262))+(l9_272*l9_273))+(l9_282*l9_236.w);
l9_233.position=float4(l9_283.x,l9_283.y,l9_283.z,l9_233.position.w);
int l9_284=l9_237;
float3x3 l9_285=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_284].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_284].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_284].normalMatrix[2].xyz));
float3x3 l9_286=l9_285;
float3x3 l9_287=l9_286;
int l9_288=l9_238;
float3x3 l9_289=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_288].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_288].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_288].normalMatrix[2].xyz));
float3x3 l9_290=l9_289;
float3x3 l9_291=l9_290;
int l9_292=l9_239;
float3x3 l9_293=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_292].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_292].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_292].normalMatrix[2].xyz));
float3x3 l9_294=l9_293;
float3x3 l9_295=l9_294;
int l9_296=l9_240;
float3x3 l9_297=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_296].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_296].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_296].normalMatrix[2].xyz));
float3x3 l9_298=l9_297;
float3x3 l9_299=l9_298;
l9_233.normal=((((l9_287*l9_233.normal)*l9_236.x)+((l9_291*l9_233.normal)*l9_236.y))+((l9_295*l9_233.normal)*l9_236.z))+((l9_299*l9_233.normal)*l9_236.w);
l9_233.tangent=((((l9_287*l9_233.tangent)*l9_236.x)+((l9_291*l9_233.tangent)*l9_236.y))+((l9_295*l9_233.tangent)*l9_236.z))+((l9_299*l9_233.tangent)*l9_236.w);
}
l9_183=l9_233;
float l9_300=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_301=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_302=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_303=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_304=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_305=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_306=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_307=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_308=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_309=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_310=l9_300/l9_301;
int l9_311=gl_InstanceIndex;
int l9_312=l9_311;
l9_183.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_183.position;
float3 l9_313=l9_183.position.xyz;
float3 l9_314=float3(float(l9_312%int(l9_302))*l9_300,float(l9_312/int(l9_302))*l9_300,(float(l9_312)*l9_310)+l9_307);
float3 l9_315=l9_313+l9_314;
float4 l9_316=float4(l9_315-l9_309,1.0);
float l9_317=l9_303;
float l9_318=l9_304;
float l9_319=l9_305;
float l9_320=l9_306;
float l9_321=l9_307;
float l9_322=l9_308;
float4x4 l9_323=float4x4(float4(2.0/(l9_318-l9_317),0.0,0.0,(-(l9_318+l9_317))/(l9_318-l9_317)),float4(0.0,2.0/(l9_320-l9_319),0.0,(-(l9_320+l9_319))/(l9_320-l9_319)),float4(0.0,0.0,(-2.0)/(l9_322-l9_321),(-(l9_322+l9_321))/(l9_322-l9_321)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_324=l9_323;
float4 l9_325=l9_324*l9_316;
l9_325.w=1.0;
out.varScreenPos=l9_325;
float4 l9_326=l9_325*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_326.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_327=l9_326;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_328=dot(l9_327,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_329=l9_328;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_329;
}
}
float4 l9_330=float4(l9_326.x,-l9_326.y,(l9_326.z*0.5)+(l9_326.w*0.5),l9_326.w);
out.gl_Position=l9_330;
param_17=l9_183;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_331=param_17;
sc_Vertex_t l9_332=l9_331;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_333=l9_332;
float3 l9_334=in.blendShape0Pos;
float3 l9_335=in.blendShape0Normal;
float l9_336=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_337=l9_333;
float3 l9_338=l9_334;
float l9_339=l9_336;
float3 l9_340=l9_337.position.xyz+(l9_338*l9_339);
l9_337.position=float4(l9_340.x,l9_340.y,l9_340.z,l9_337.position.w);
l9_333=l9_337;
l9_333.normal+=(l9_335*l9_336);
l9_332=l9_333;
sc_Vertex_t l9_341=l9_332;
float3 l9_342=in.blendShape1Pos;
float3 l9_343=in.blendShape1Normal;
float l9_344=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_345=l9_341;
float3 l9_346=l9_342;
float l9_347=l9_344;
float3 l9_348=l9_345.position.xyz+(l9_346*l9_347);
l9_345.position=float4(l9_348.x,l9_348.y,l9_348.z,l9_345.position.w);
l9_341=l9_345;
l9_341.normal+=(l9_343*l9_344);
l9_332=l9_341;
sc_Vertex_t l9_349=l9_332;
float3 l9_350=in.blendShape2Pos;
float3 l9_351=in.blendShape2Normal;
float l9_352=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_353=l9_349;
float3 l9_354=l9_350;
float l9_355=l9_352;
float3 l9_356=l9_353.position.xyz+(l9_354*l9_355);
l9_353.position=float4(l9_356.x,l9_356.y,l9_356.z,l9_353.position.w);
l9_349=l9_353;
l9_349.normal+=(l9_351*l9_352);
l9_332=l9_349;
}
else
{
sc_Vertex_t l9_357=l9_332;
float3 l9_358=in.blendShape0Pos;
float l9_359=(*sc_set0.UserUniforms).weights0.x;
float3 l9_360=l9_357.position.xyz+(l9_358*l9_359);
l9_357.position=float4(l9_360.x,l9_360.y,l9_360.z,l9_357.position.w);
l9_332=l9_357;
sc_Vertex_t l9_361=l9_332;
float3 l9_362=in.blendShape1Pos;
float l9_363=(*sc_set0.UserUniforms).weights0.y;
float3 l9_364=l9_361.position.xyz+(l9_362*l9_363);
l9_361.position=float4(l9_364.x,l9_364.y,l9_364.z,l9_361.position.w);
l9_332=l9_361;
sc_Vertex_t l9_365=l9_332;
float3 l9_366=in.blendShape2Pos;
float l9_367=(*sc_set0.UserUniforms).weights0.z;
float3 l9_368=l9_365.position.xyz+(l9_366*l9_367);
l9_365.position=float4(l9_368.x,l9_368.y,l9_368.z,l9_365.position.w);
l9_332=l9_365;
sc_Vertex_t l9_369=l9_332;
float3 l9_370=in.blendShape3Pos;
float l9_371=(*sc_set0.UserUniforms).weights0.w;
float3 l9_372=l9_369.position.xyz+(l9_370*l9_371);
l9_369.position=float4(l9_372.x,l9_372.y,l9_372.z,l9_369.position.w);
l9_332=l9_369;
sc_Vertex_t l9_373=l9_332;
float3 l9_374=in.blendShape4Pos;
float l9_375=(*sc_set0.UserUniforms).weights1.x;
float3 l9_376=l9_373.position.xyz+(l9_374*l9_375);
l9_373.position=float4(l9_376.x,l9_376.y,l9_376.z,l9_373.position.w);
l9_332=l9_373;
sc_Vertex_t l9_377=l9_332;
float3 l9_378=in.blendShape5Pos;
float l9_379=(*sc_set0.UserUniforms).weights1.y;
float3 l9_380=l9_377.position.xyz+(l9_378*l9_379);
l9_377.position=float4(l9_380.x,l9_380.y,l9_380.z,l9_377.position.w);
l9_332=l9_377;
}
}
l9_331=l9_332;
sc_Vertex_t l9_381=l9_331;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_382=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_382=float4(1.0,fract(in.boneData.yzw));
l9_382.x-=dot(l9_382.yzw,float3(1.0));
}
float4 l9_383=l9_382;
float4 l9_384=l9_383;
int l9_385=int(in.boneData.x);
int l9_386=int(in.boneData.y);
int l9_387=int(in.boneData.z);
int l9_388=int(in.boneData.w);
int l9_389=l9_385;
float4 l9_390=l9_381.position;
float3 l9_391=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_392=l9_389;
float4 l9_393=(*sc_set0.sc_BonesUBO).sc_Bones[l9_392].boneMatrix[0];
float4 l9_394=(*sc_set0.sc_BonesUBO).sc_Bones[l9_392].boneMatrix[1];
float4 l9_395=(*sc_set0.sc_BonesUBO).sc_Bones[l9_392].boneMatrix[2];
float4 l9_396[3];
l9_396[0]=l9_393;
l9_396[1]=l9_394;
l9_396[2]=l9_395;
l9_391=float3(dot(l9_390,l9_396[0]),dot(l9_390,l9_396[1]),dot(l9_390,l9_396[2]));
}
else
{
l9_391=l9_390.xyz;
}
float3 l9_397=l9_391;
float3 l9_398=l9_397;
float l9_399=l9_384.x;
int l9_400=l9_386;
float4 l9_401=l9_381.position;
float3 l9_402=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_403=l9_400;
float4 l9_404=(*sc_set0.sc_BonesUBO).sc_Bones[l9_403].boneMatrix[0];
float4 l9_405=(*sc_set0.sc_BonesUBO).sc_Bones[l9_403].boneMatrix[1];
float4 l9_406=(*sc_set0.sc_BonesUBO).sc_Bones[l9_403].boneMatrix[2];
float4 l9_407[3];
l9_407[0]=l9_404;
l9_407[1]=l9_405;
l9_407[2]=l9_406;
l9_402=float3(dot(l9_401,l9_407[0]),dot(l9_401,l9_407[1]),dot(l9_401,l9_407[2]));
}
else
{
l9_402=l9_401.xyz;
}
float3 l9_408=l9_402;
float3 l9_409=l9_408;
float l9_410=l9_384.y;
int l9_411=l9_387;
float4 l9_412=l9_381.position;
float3 l9_413=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_414=l9_411;
float4 l9_415=(*sc_set0.sc_BonesUBO).sc_Bones[l9_414].boneMatrix[0];
float4 l9_416=(*sc_set0.sc_BonesUBO).sc_Bones[l9_414].boneMatrix[1];
float4 l9_417=(*sc_set0.sc_BonesUBO).sc_Bones[l9_414].boneMatrix[2];
float4 l9_418[3];
l9_418[0]=l9_415;
l9_418[1]=l9_416;
l9_418[2]=l9_417;
l9_413=float3(dot(l9_412,l9_418[0]),dot(l9_412,l9_418[1]),dot(l9_412,l9_418[2]));
}
else
{
l9_413=l9_412.xyz;
}
float3 l9_419=l9_413;
float3 l9_420=l9_419;
float l9_421=l9_384.z;
int l9_422=l9_388;
float4 l9_423=l9_381.position;
float3 l9_424=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_425=l9_422;
float4 l9_426=(*sc_set0.sc_BonesUBO).sc_Bones[l9_425].boneMatrix[0];
float4 l9_427=(*sc_set0.sc_BonesUBO).sc_Bones[l9_425].boneMatrix[1];
float4 l9_428=(*sc_set0.sc_BonesUBO).sc_Bones[l9_425].boneMatrix[2];
float4 l9_429[3];
l9_429[0]=l9_426;
l9_429[1]=l9_427;
l9_429[2]=l9_428;
l9_424=float3(dot(l9_423,l9_429[0]),dot(l9_423,l9_429[1]),dot(l9_423,l9_429[2]));
}
else
{
l9_424=l9_423.xyz;
}
float3 l9_430=l9_424;
float3 l9_431=(((l9_398*l9_399)+(l9_409*l9_410))+(l9_420*l9_421))+(l9_430*l9_384.w);
l9_381.position=float4(l9_431.x,l9_431.y,l9_431.z,l9_381.position.w);
int l9_432=l9_385;
float3x3 l9_433=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_432].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_432].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_432].normalMatrix[2].xyz));
float3x3 l9_434=l9_433;
float3x3 l9_435=l9_434;
int l9_436=l9_386;
float3x3 l9_437=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_436].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_436].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_436].normalMatrix[2].xyz));
float3x3 l9_438=l9_437;
float3x3 l9_439=l9_438;
int l9_440=l9_387;
float3x3 l9_441=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_440].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_440].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_440].normalMatrix[2].xyz));
float3x3 l9_442=l9_441;
float3x3 l9_443=l9_442;
int l9_444=l9_388;
float3x3 l9_445=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_444].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_444].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_444].normalMatrix[2].xyz));
float3x3 l9_446=l9_445;
float3x3 l9_447=l9_446;
l9_381.normal=((((l9_435*l9_381.normal)*l9_384.x)+((l9_439*l9_381.normal)*l9_384.y))+((l9_443*l9_381.normal)*l9_384.z))+((l9_447*l9_381.normal)*l9_384.w);
l9_381.tangent=((((l9_435*l9_381.tangent)*l9_384.x)+((l9_439*l9_381.tangent)*l9_384.y))+((l9_443*l9_381.tangent)*l9_384.z))+((l9_447*l9_381.tangent)*l9_384.w);
}
l9_331=l9_381;
float3 l9_448=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_449=((l9_331.position.xy/float2(l9_331.position.w))*0.5)+float2(0.5);
out.varTex01=float4(l9_449.x,l9_449.y,out.varTex01.z,out.varTex01.w);
l9_331.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_331.position;
float3 l9_450=l9_331.position.xyz-l9_448;
l9_331.position=float4(l9_450.x,l9_450.y,l9_450.z,l9_331.position.w);
out.varPosAndMotion=float4(l9_331.position.xyz.x,l9_331.position.xyz.y,l9_331.position.xyz.z,out.varPosAndMotion.w);
float3 l9_451=normalize(l9_331.normal);
out.varNormalAndMotion=float4(l9_451.x,l9_451.y,l9_451.z,out.varNormalAndMotion.w);
float l9_452=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_453=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_454=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_455=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_456=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_457=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_458=l9_452;
float l9_459=l9_453;
float l9_460=l9_454;
float l9_461=l9_455;
float l9_462=l9_456;
float l9_463=l9_457;
float4x4 l9_464=float4x4(float4(2.0/(l9_459-l9_458),0.0,0.0,(-(l9_459+l9_458))/(l9_459-l9_458)),float4(0.0,2.0/(l9_461-l9_460),0.0,(-(l9_461+l9_460))/(l9_461-l9_460)),float4(0.0,0.0,(-2.0)/(l9_463-l9_462),(-(l9_463+l9_462))/(l9_463-l9_462)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_465=l9_464;
float4 l9_466=float4(0.0);
float3 l9_467=(l9_465*l9_331.position).xyz;
l9_466=float4(l9_467.x,l9_467.y,l9_467.z,l9_466.w);
l9_466.w=1.0;
out.varScreenPos=l9_466;
float4 l9_468=l9_466*1.0;
float4 l9_469=l9_468;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_469.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_470=l9_469;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_471=dot(l9_470,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_472=l9_471;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_472;
}
}
float4 l9_473=float4(l9_469.x,-l9_469.y,(l9_469.z*0.5)+(l9_469.w*0.5),l9_469.w);
out.gl_Position=l9_473;
param_17=l9_331;
}
}
v=param_17;
out.Interpolator_gInstanceID=Globals.gInstanceID;
float3 param_22=out.varPosAndMotion.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float4 l9_474=((*sc_set0.UserUniforms).sc_PrevFrameModelMatrix*(*sc_set0.UserUniforms).sc_ModelMatrixInverse)*float4(param_22,1.0);
float3 l9_475=param_22;
float3 l9_476=l9_474.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
int l9_477=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_477=0;
}
else
{
l9_477=gl_InstanceIndex%2;
}
int l9_478=l9_477;
float4 l9_479=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_478]*float4(l9_475,1.0);
float2 l9_480=l9_479.xy/float2(l9_479.w);
l9_479=float4(l9_480.x,l9_480.y,l9_479.z,l9_479.w);
int l9_481=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_481=0;
}
else
{
l9_481=gl_InstanceIndex%2;
}
int l9_482=l9_481;
float4 l9_483=(*sc_set0.UserUniforms).sc_PrevFrameViewProjectionMatrixArray[l9_482]*float4(l9_476,1.0);
float2 l9_484=l9_483.xy/float2(l9_483.w);
l9_483=float4(l9_484.x,l9_484.y,l9_483.z,l9_483.w);
float2 l9_485=(l9_479.xy-l9_483.xy)*0.5;
out.varPosAndMotion.w=l9_485.x;
out.varNormalAndMotion.w=l9_485.y;
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
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float gInstanceID;
float gFrontFacing;
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
float lineWeight;
float4 lineColor;
float Port_Input1_N016;
float Port_Input1_N013;
float Port_Input1_N017;
float4 Port_Value1_N015;
float Port_Input1_N024;
float4 Port_Value1_N022;
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
constant sc_Bones_obj* sc_BonesUBO [[id(0)]];
texture2d<float> intensityTexture [[id(1)]];
texture2d<float> sc_ScreenTexture [[id(13)]];
sampler intensityTextureSmpSC [[id(16)]];
sampler sc_ScreenTextureSmpSC [[id(21)]];
constant userUniformsObj* UserUniforms [[id(24)]];
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
float Interpolator_gInstanceID [[user(locn13)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
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
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]],bool gl_FrontFacing [[front_facing]])
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
Globals.gInstanceID=in.Interpolator_gInstanceID;
bool l9_0=gl_FrontFacing;
Globals.gFrontFacing=float(l9_0);
float4 Result_N15=float4(0.0);
float param=0.0;
float4 param_1=(*sc_set0.UserUniforms).Port_Value1_N015;
float4 param_2=float4(1.0,0.0,0.0,1.0);
ssGlobals param_4=Globals;
float l9_1=0.0;
l9_1=round(param_4.gInstanceID);
float l9_2=0.0;
l9_2=float(l9_1>(*sc_set0.UserUniforms).Port_Input1_N013);
param=l9_2;
float4 param_3;
if ((param*1.0)!=0.0)
{
param_3=param_1;
}
else
{
float4 l9_3=float4(0.0);
float l9_4=0.0;
float4 l9_5=(*sc_set0.UserUniforms).Port_Value1_N022;
float4 l9_6=float4(0.0);
ssGlobals l9_7=param_4;
float4 l9_8=float4(0.0);
float l9_9=0.0;
float4 l9_10=float4(0.0);
float4 l9_11=float4(0.0);
ssGlobals l9_12=l9_7;
float l9_13=0.0;
float l9_14=(*sc_set0.UserUniforms).lineWeight;
l9_13=l9_14;
float l9_15=0.0;
l9_15=float(l9_13<(*sc_set0.UserUniforms).Port_Input1_N016);
l9_9=l9_15;
float4 l9_16;
if ((l9_9*1.0)!=0.0)
{
float l9_17=0.0;
l9_17=l9_12.gFrontFacing;
float l9_18=0.0;
l9_18=float(l9_17==(*sc_set0.UserUniforms).Port_Input1_N024);
l9_10=float4(l9_18);
l9_16=l9_10;
}
else
{
float l9_19=0.0;
l9_19=l9_12.gFrontFacing;
l9_11=float4(l9_19);
l9_16=l9_11;
}
l9_8=l9_16;
l9_4=l9_8.x;
float4 l9_20;
if ((l9_4*1.0)!=0.0)
{
l9_20=l9_5;
}
else
{
float4 l9_21=float4(0.0);
float4 l9_22=(*sc_set0.UserUniforms).lineColor;
l9_21=l9_22;
l9_6=l9_21;
l9_20=l9_6;
}
l9_3=l9_20;
param_2=l9_3;
param_3=param_2;
}
Result_N15=param_3;
FinalColor=Result_N15;
float param_5=FinalColor.w;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (param_5<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_23=gl_FragCoord;
float2 l9_24=floor(mod(l9_23.xy,float2(4.0)));
float l9_25=(mod(dot(l9_24,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (param_5<l9_25)
{
discard_fragment();
}
}
float4 param_6=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_26=param_6;
float4 l9_27=l9_26;
float l9_28=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_28=l9_27.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_28=fast::clamp(l9_27.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_28=fast::clamp(dot(l9_27.xyz,float3(l9_27.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_28=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_28=(1.0-dot(l9_27.xyz,float3(0.33333001)))*l9_27.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_28=(1.0-fast::clamp(dot(l9_27.xyz,float3(1.0)),0.0,1.0))*l9_27.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_28=fast::clamp(dot(l9_27.xyz,float3(1.0)),0.0,1.0)*l9_27.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_28=fast::clamp(dot(l9_27.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_28=fast::clamp(dot(l9_27.xyz,float3(1.0)),0.0,1.0)*l9_27.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_28=dot(l9_27.xyz,float3(0.33333001))*l9_27.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_28=1.0-fast::clamp(dot(l9_27.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_28=fast::clamp(dot(l9_27.xyz,float3(1.0)),0.0,1.0);
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
float l9_29=l9_28;
float l9_30=l9_29;
float l9_31=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_30;
float3 l9_32=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_26.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_33=float4(l9_32.x,l9_32.y,l9_32.z,l9_31);
param_6=l9_33;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_6=float4(param_6.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_34=param_6;
float4 l9_35=float4(0.0);
float4 l9_36=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_37=out.sc_FragData0;
l9_36=l9_37;
}
else
{
float4 l9_38=gl_FragCoord;
float2 l9_39=l9_38.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_40=l9_39;
float2 l9_41=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_42=1;
int l9_43=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_43=0;
}
else
{
l9_43=in.varStereoViewID;
}
int l9_44=l9_43;
int l9_45=l9_44;
float3 l9_46=float3(l9_40,0.0);
int l9_47=l9_42;
int l9_48=l9_45;
if (l9_47==1)
{
l9_46.y=((2.0*l9_46.y)+float(l9_48))-1.0;
}
float2 l9_49=l9_46.xy;
l9_41=l9_49;
}
else
{
l9_41=l9_40;
}
float2 l9_50=l9_41;
float2 l9_51=l9_50;
float2 l9_52=l9_51;
float2 l9_53=l9_52;
float l9_54=0.0;
int l9_55;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_56=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_56=0;
}
else
{
l9_56=in.varStereoViewID;
}
int l9_57=l9_56;
l9_55=1-l9_57;
}
else
{
int l9_58=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_58=0;
}
else
{
l9_58=in.varStereoViewID;
}
int l9_59=l9_58;
l9_55=l9_59;
}
int l9_60=l9_55;
float2 l9_61=l9_53;
int l9_62=sc_ScreenTextureLayout_tmp;
int l9_63=l9_60;
float l9_64=l9_54;
float2 l9_65=l9_61;
int l9_66=l9_62;
int l9_67=l9_63;
float3 l9_68=float3(0.0);
if (l9_66==0)
{
l9_68=float3(l9_65,0.0);
}
else
{
if (l9_66==1)
{
l9_68=float3(l9_65.x,(l9_65.y*0.5)+(0.5-(float(l9_67)*0.5)),0.0);
}
else
{
l9_68=float3(l9_65,float(l9_67));
}
}
float3 l9_69=l9_68;
float3 l9_70=l9_69;
float4 l9_71=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_70.xy,bias(l9_64));
float4 l9_72=l9_71;
float4 l9_73=l9_72;
l9_36=l9_73;
}
float4 l9_74=l9_36;
float3 l9_75=l9_74.xyz;
float3 l9_76=l9_75;
float3 l9_77=l9_34.xyz;
float3 l9_78=definedBlend(l9_76,l9_77,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_35=float4(l9_78.x,l9_78.y,l9_78.z,l9_35.w);
float3 l9_79=mix(l9_75,l9_35.xyz,float3(l9_34.w));
l9_35=float4(l9_79.x,l9_79.y,l9_79.z,l9_35.w);
l9_35.w=1.0;
float4 l9_80=l9_35;
param_6=l9_80;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_81=float4(in.varScreenPos.xyz,1.0);
param_6=l9_81;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_82=gl_FragCoord;
float l9_83=fast::clamp(abs(l9_82.z),0.0,1.0);
float4 l9_84=float4(l9_83,1.0-l9_83,1.0,1.0);
param_6=l9_84;
}
else
{
float4 l9_85=param_6;
float4 l9_86=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_86=float4(mix(float3(1.0),l9_85.xyz,float3(l9_85.w)),l9_85.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_87=l9_85.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_87=fast::clamp(l9_87,0.0,1.0);
}
l9_86=float4(l9_85.xyz*l9_87,l9_87);
}
else
{
l9_86=l9_85;
}
}
float4 l9_88=l9_86;
param_6=l9_88;
}
}
}
}
}
float4 l9_89=param_6;
FinalColor=l9_89;
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
float4 l9_90=float4(0.0);
l9_90=float4(0.0);
float4 l9_91=l9_90;
float4 Cost=l9_91;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_7=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_7,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_8=FinalColor;
float4 l9_92=param_8;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_92.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_92;
return out;
}
} // FRAGMENT SHADER
