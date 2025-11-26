#pragma clang diagnostic ignored "-Wmissing-prototypes"
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
//attribute vec2 texture3 19
//attribute vec3 positionNext 15
//attribute vec3 positionPrevious 16
//attribute vec4 strandProperties 17
//output vec4 sc_FragData0 0
//sampler sampler Tweak_N14SmpSC 0:17
//sampler sampler intensityTextureSmpSC 0:18
//sampler sampler sc_ScreenTextureSmpSC 0:23
//texture texture2D Tweak_N14 0:1:0:17
//texture texture2D intensityTexture 0:2:0:18
//texture texture2D sc_ScreenTexture 0:14:0:23
//ubo float sc_BonesUBO 0:0:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:26:4816 {
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
//int PreviewNodeID 4248
//float alphaTestThreshold 4252
//float noise_freq 4256
//float fire_scale 4260
//float range 4264
//float3x3 Tweak_N14Transform 4320
//float4 Tweak_N14UvMinMax 4368
//float4 Tweak_N14BorderColor 4384
//float Port_Input1_N009 4400
//float Port_Input1_N007 4404
//float Port_Value2_N059 4408
//float Port_Value3_N059 4412
//float Port_Input1_N019 4416
//float Port_Multiplier_N024 4420
//float Port_Input1_N034 4424
//float Port_Value1_N031 4428
//float Port_Input1_N032 4432
//float Port_RangeMinA_N035 4436
//float Port_RangeMaxA_N035 4440
//float Port_Input1_N060 4444
//float Port_Input1_N029 4448
//float Port_Input1_N056 4452
//float Port_RangeMinA_N038 4456
//float Port_RangeMaxA_N038 4460
//float Port_Input1_N054 4464
//float Port_RangeMinA_N040 4468
//float Port_RangeMaxA_N040 4472
//float Port_Input1_N050 4476
//float4 Port_Default_N017 4480
//float Port_Input0_N006 4496
//float Port_Input1_N006 4500
//float4 Port_Value0_N010 4512
//float Port_Position1_N010 4528
//float4 Port_Value1_N010 4544
//float4 Port_Value2_N010 4560
//float4 Port_Value0_N043 4576
//float Port_Position1_N043 4592
//float4 Port_Value1_N043 4608
//float4 Port_Value2_N043 4624
//float4 Port_Value0_N044 4640
//float Port_Position1_N044 4656
//float4 Port_Value1_N044 4672
//float4 Port_Value2_N044 4688
//float4 Port_Default_N042 4704
//float Port_Rotation_N012 4720
//float2 Port_Center_N012 4728
//float4 Port_Value0_N049 4736
//float Port_Position1_N049 4752
//float4 Port_Value1_N049 4768
//float4 Port_Value2_N049 4784
//float2 Port_Direction_N013 4800
//float Port_Speed_N013 4808
//float Port_Value2_N001 4812
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
//spec_const bool SC_USE_CLAMP_TO_BORDER_Tweak_N14 31 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 32 0
//spec_const bool SC_USE_UV_MIN_MAX_Tweak_N14 33 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 34 0
//spec_const bool SC_USE_UV_TRANSFORM_Tweak_N14 35 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 36 0
//spec_const bool Tweak_N14HasSwappedViews 37 0
//spec_const bool UseViewSpaceDepthVariant 38 1
//spec_const bool intensityTextureHasSwappedViews 39 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 40 0
//spec_const bool sc_BlendMode_Add 41 0
//spec_const bool sc_BlendMode_AlphaTest 42 0
//spec_const bool sc_BlendMode_AlphaToCoverage 43 0
//spec_const bool sc_BlendMode_ColoredGlass 44 0
//spec_const bool sc_BlendMode_Custom 45 0
//spec_const bool sc_BlendMode_Max 46 0
//spec_const bool sc_BlendMode_Min 47 0
//spec_const bool sc_BlendMode_MultiplyOriginal 48 0
//spec_const bool sc_BlendMode_Multiply 49 0
//spec_const bool sc_BlendMode_Normal 50 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 51 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 52 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 53 0
//spec_const bool sc_BlendMode_Screen 54 0
//spec_const bool sc_DepthOnly 55 0
//spec_const bool sc_FramebufferFetch 56 0
//spec_const bool sc_MotionVectorsPass 57 0
//spec_const bool sc_OITCompositingPass 58 0
//spec_const bool sc_OITDepthBoundsPass 59 0
//spec_const bool sc_OITDepthGatherPass 60 0
//spec_const bool sc_OutputBounds 61 0
//spec_const bool sc_ProjectiveShadowsCaster 62 0
//spec_const bool sc_ProjectiveShadowsReceiver 63 0
//spec_const bool sc_RenderAlphaToColor 64 0
//spec_const bool sc_ScreenTextureHasSwappedViews 65 0
//spec_const bool sc_TAAEnabled 66 0
//spec_const bool sc_VertexBlendingUseNormals 67 0
//spec_const bool sc_VertexBlending 68 0
//spec_const bool sc_Voxelization 69 0
//spec_const int SC_DEVICE_CLASS 70 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_Tweak_N14 71 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 72 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_Tweak_N14 73 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 74 -1
//spec_const int Tweak_N14Layout 75 0
//spec_const int intensityTextureLayout 76 0
//spec_const int sc_DepthBufferMode 77 0
//spec_const int sc_RenderingSpace 78 -1
//spec_const int sc_ScreenTextureLayout 79 0
//spec_const int sc_ShaderCacheConstant 80 0
//spec_const int sc_SkinBonesCount 81 0
//spec_const int sc_StereoRenderingMode 82 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 83 0
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
constant bool SC_USE_CLAMP_TO_BORDER_Tweak_N14 [[function_constant(31)]];
constant bool SC_USE_CLAMP_TO_BORDER_Tweak_N14_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_Tweak_N14) ? SC_USE_CLAMP_TO_BORDER_Tweak_N14 : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(32)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_Tweak_N14 [[function_constant(33)]];
constant bool SC_USE_UV_MIN_MAX_Tweak_N14_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_Tweak_N14) ? SC_USE_UV_MIN_MAX_Tweak_N14 : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(34)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_Tweak_N14 [[function_constant(35)]];
constant bool SC_USE_UV_TRANSFORM_Tweak_N14_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_Tweak_N14) ? SC_USE_UV_TRANSFORM_Tweak_N14 : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(36)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool Tweak_N14HasSwappedViews [[function_constant(37)]];
constant bool Tweak_N14HasSwappedViews_tmp = is_function_constant_defined(Tweak_N14HasSwappedViews) ? Tweak_N14HasSwappedViews : false;
constant bool UseViewSpaceDepthVariant [[function_constant(38)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool intensityTextureHasSwappedViews [[function_constant(39)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(40)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(41)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(42)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(43)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(44)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(45)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(46)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(47)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(48)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(49)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(50)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(51)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(52)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(53)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(54)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(55)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_FramebufferFetch [[function_constant(56)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_MotionVectorsPass [[function_constant(57)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(58)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(59)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(60)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(61)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(62)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(63)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RenderAlphaToColor [[function_constant(64)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(65)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(66)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(67)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(68)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(69)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_DEVICE_CLASS [[function_constant(70)]];
constant int SC_DEVICE_CLASS_tmp = is_function_constant_defined(SC_DEVICE_CLASS) ? SC_DEVICE_CLASS : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_Tweak_N14 [[function_constant(71)]];
constant int SC_SOFTWARE_WRAP_MODE_U_Tweak_N14_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_Tweak_N14) ? SC_SOFTWARE_WRAP_MODE_U_Tweak_N14 : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(72)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_Tweak_N14 [[function_constant(73)]];
constant int SC_SOFTWARE_WRAP_MODE_V_Tweak_N14_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_Tweak_N14) ? SC_SOFTWARE_WRAP_MODE_V_Tweak_N14 : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(74)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int Tweak_N14Layout [[function_constant(75)]];
constant int Tweak_N14Layout_tmp = is_function_constant_defined(Tweak_N14Layout) ? Tweak_N14Layout : 0;
constant int intensityTextureLayout [[function_constant(76)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int sc_DepthBufferMode [[function_constant(77)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_RenderingSpace [[function_constant(78)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(79)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(80)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(81)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(82)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(83)]];
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
float4 VertexColor;
float2 UVCoord3;
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
float noise_freq;
float fire_scale;
float range;
float4 Tweak_N14Size;
float4 Tweak_N14Dims;
float4 Tweak_N14View;
float3x3 Tweak_N14Transform;
float4 Tweak_N14UvMinMax;
float4 Tweak_N14BorderColor;
float Port_Input1_N009;
float Port_Input1_N007;
float Port_Value2_N059;
float Port_Value3_N059;
float Port_Input1_N019;
float Port_Multiplier_N024;
float Port_Input1_N034;
float Port_Value1_N031;
float Port_Input1_N032;
float Port_RangeMinA_N035;
float Port_RangeMaxA_N035;
float Port_Input1_N060;
float Port_Input1_N029;
float Port_Input1_N056;
float Port_RangeMinA_N038;
float Port_RangeMaxA_N038;
float Port_Input1_N054;
float Port_RangeMinA_N040;
float Port_RangeMaxA_N040;
float Port_Input1_N050;
float4 Port_Default_N017;
float Port_Input0_N006;
float Port_Input1_N006;
float4 Port_Value0_N010;
float Port_Position1_N010;
float4 Port_Value1_N010;
float4 Port_Value2_N010;
float4 Port_Value0_N043;
float Port_Position1_N043;
float4 Port_Value1_N043;
float4 Port_Value2_N043;
float4 Port_Value0_N044;
float Port_Position1_N044;
float4 Port_Value1_N044;
float4 Port_Value2_N044;
float4 Port_Default_N042;
float Port_Rotation_N012;
float2 Port_Center_N012;
float4 Port_Value0_N049;
float Port_Position1_N049;
float4 Port_Value1_N049;
float4 Port_Value2_N049;
float2 Port_Direction_N013;
float Port_Speed_N013;
float Port_Value2_N001;
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
texture2d<float> Tweak_N14 [[id(1)]];
texture2d<float> intensityTexture [[id(2)]];
texture2d<float> sc_ScreenTexture [[id(14)]];
sampler Tweak_N14SmpSC [[id(17)]];
sampler intensityTextureSmpSC [[id(18)]];
sampler sc_ScreenTextureSmpSC [[id(23)]];
constant userUniformsObj* UserUniforms [[id(26)]];
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
float2 Interpolator_UVCoord3 [[user(locn13)]];
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
float2 texture3 [[attribute(19)]];
};
float snoise(thread const float2& v)
{
if (SC_DEVICE_CLASS_tmp>=2)
{
float2 i=floor(v+float2(dot(v,float2(0.36602542))));
float2 x0=(v-i)+float2(dot(i,float2(0.21132487)));
float2 i1=float2(0.0);
bool2 l9_0=bool2(x0.x>x0.y);
i1=float2(l9_0.x ? float2(1.0,0.0).x : float2(0.0,1.0).x,l9_0.y ? float2(1.0,0.0).y : float2(0.0,1.0).y);
float2 x1=(x0+float2(0.21132487))-i1;
float2 x2=x0+float2(-0.57735026);
float2 param=i;
float2 l9_1=param-(floor(param*0.0034602077)*289.0);
i=l9_1;
float3 param_1=float3(i.y)+float3(0.0,i1.y,1.0);
float3 l9_2=((param_1*34.0)+float3(1.0))*param_1;
float3 l9_3=l9_2-(floor(l9_2*0.0034602077)*289.0);
float3 l9_4=l9_3;
float3 param_2=(l9_4+float3(i.x))+float3(0.0,i1.x,1.0);
float3 l9_5=((param_2*34.0)+float3(1.0))*param_2;
float3 l9_6=l9_5-(floor(l9_5*0.0034602077)*289.0);
float3 l9_7=l9_6;
float3 p=l9_7;
float3 m=fast::max(float3(0.5)-float3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),float3(0.0));
m*=m;
m*=m;
float3 x=(fract(p*float3(0.024390243))*2.0)-float3(1.0);
float3 h=abs(x)-float3(0.5);
float3 ox=floor(x+float3(0.5));
float3 a0=x-ox;
m*=(float3(1.7928429)-(((a0*a0)+(h*h))*0.85373473));
float3 g=float3(0.0);
g.x=(a0.x*x0.x)+(h.x*x0.y);
float2 l9_8=(a0.yz*float2(x1.x,x2.x))+(h.yz*float2(x1.y,x2.y));
g=float3(g.x,l9_8.x,l9_8.y);
return 130.0*dot(m,g);
}
else
{
return 0.0;
}
}
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
Globals.VertexColor=out.varColor;
Globals.UVCoord3=in.texture3;
float3 WorldPosition=out.varPosAndMotion.xyz;
float3 WorldNormal=out.varNormalAndMotion.xyz;
float3 WorldTangent=out.varTangent.xyz;
float3 Position_N3=float3(0.0);
Position_N3=Globals.SurfacePosition_ObjectSpace;
float InstanceID_N8=0.0;
InstanceID_N8=float(ssInstanceID);
float Output_N9=0.0;
Output_N9=InstanceID_N8*(*sc_set0.UserUniforms).Port_Input1_N009;
float Output_N7=0.0;
Output_N7=Output_N9+(*sc_set0.UserUniforms).Port_Input1_N007;
float3 Value_N59=float3(0.0);
Value_N59.x=Output_N7;
Value_N59.y=(*sc_set0.UserUniforms).Port_Value2_N059;
Value_N59.z=(*sc_set0.UserUniforms).Port_Value3_N059;
float3 Output_N58=float3(0.0);
Output_N58=Position_N3*Value_N59;
float4 Result_N17=float4(0.0);
float param_1=0.0;
float4 param_2=float4(0.0);
float4 param_3=float4(0.0);
float4 param_4=float4(0.0);
float4 param_5=(*sc_set0.UserUniforms).Port_Default_N017;
ssGlobals param_7=Globals;
float4 l9_123=float4(0.0);
l9_123=param_7.VertexColor;
float l9_124=0.0;
l9_124=l9_123.x;
float l9_125=0.0;
l9_125=l9_124*(*sc_set0.UserUniforms).Port_Input1_N019;
float l9_126=0.0;
l9_126=floor(l9_125+0.5);
param_1=l9_126;
param_1=floor(param_1);
float4 param_6;
if (param_1==0.0)
{
float l9_127=0.0;
l9_127=param_7.gTimeElapsed*(*sc_set0.UserUniforms).Port_Multiplier_N024;
float4 l9_128=float4(0.0);
l9_128=param_7.VertexColor;
float l9_129=0.0;
l9_129=l9_128.x;
float l9_130=0.0;
l9_130=l9_129*(*sc_set0.UserUniforms).Port_Input1_N019;
float l9_131=0.0;
l9_131=floor(l9_130+0.5);
float l9_132=0.0;
l9_132=l9_131+(*sc_set0.UserUniforms).Port_Input1_N034;
float l9_133=0.0;
l9_133=l9_127+l9_132;
float l9_134=0.0;
float l9_135=(*sc_set0.UserUniforms).noise_freq;
l9_134=l9_135;
float l9_136=0.0;
l9_136=l9_134*(*sc_set0.UserUniforms).Port_Input1_N032;
float2 l9_137=float2(0.0);
l9_137.x=(*sc_set0.UserUniforms).Port_Value1_N031;
l9_137.y=l9_136;
float l9_138=0.0;
float2 l9_139=float2(l9_133);
float2 l9_140=l9_137;
l9_139.x=floor(l9_139.x*10000.0)*9.9999997e-05;
l9_139.y=floor(l9_139.y*10000.0)*9.9999997e-05;
l9_139*=(l9_140*0.5);
float2 l9_141=l9_139;
float l9_142=(snoise(l9_141)*0.5)+0.5;
l9_142=floor(l9_142*10000.0)*9.9999997e-05;
l9_138=l9_142;
float l9_143=0.0;
float l9_144=(*sc_set0.UserUniforms).fire_scale;
l9_143=l9_144;
float l9_145=0.0;
l9_145=l9_143*(*sc_set0.UserUniforms).Port_Input1_N060;
float l9_146=0.0;
l9_146=l9_131+l9_145;
float l9_147=0.0;
l9_147=l9_146*(*sc_set0.UserUniforms).Port_Input1_N029;
float l9_148=0.0;
float l9_149=(*sc_set0.UserUniforms).range;
l9_148=l9_149;
float l9_150=0.0;
l9_150=l9_147+l9_148;
float l9_151=0.0;
l9_151=(((l9_138-(*sc_set0.UserUniforms).Port_RangeMinA_N035)/(((*sc_set0.UserUniforms).Port_RangeMaxA_N035-(*sc_set0.UserUniforms).Port_RangeMinA_N035)+1e-06))*(l9_150-l9_147))+l9_147;
float l9_152=0.0;
l9_152=l9_151*(*sc_set0.UserUniforms).Port_Input1_N056;
float l9_153=0.0;
l9_153=1.0-l9_152;
float3 l9_154=float3(0.0);
l9_154.x=l9_153;
l9_154.y=l9_151;
l9_154.z=l9_153;
param_2=float4(l9_154,0.0);
param_6=param_2;
}
else
{
if (param_1==1.0)
{
float l9_155=0.0;
l9_155=param_7.gTimeElapsed*(*sc_set0.UserUniforms).Port_Multiplier_N024;
float4 l9_156=float4(0.0);
l9_156=param_7.VertexColor;
float l9_157=0.0;
l9_157=l9_156.x;
float l9_158=0.0;
l9_158=l9_157*(*sc_set0.UserUniforms).Port_Input1_N019;
float l9_159=0.0;
l9_159=floor(l9_158+0.5);
float l9_160=0.0;
l9_160=l9_159+(*sc_set0.UserUniforms).Port_Input1_N034;
float l9_161=0.0;
l9_161=l9_155+l9_160;
float l9_162=0.0;
float l9_163=(*sc_set0.UserUniforms).noise_freq;
l9_162=l9_163;
float l9_164=0.0;
l9_164=l9_162*(*sc_set0.UserUniforms).Port_Input1_N032;
float2 l9_165=float2(0.0);
l9_165.x=(*sc_set0.UserUniforms).Port_Value1_N031;
l9_165.y=l9_164;
float l9_166=0.0;
float2 l9_167=float2(l9_161);
float2 l9_168=l9_165;
l9_167.x=floor(l9_167.x*10000.0)*9.9999997e-05;
l9_167.y=floor(l9_167.y*10000.0)*9.9999997e-05;
l9_167*=(l9_168*0.5);
float2 l9_169=l9_167;
float l9_170=(snoise(l9_169)*0.5)+0.5;
l9_170=floor(l9_170*10000.0)*9.9999997e-05;
l9_166=l9_170;
float l9_171=0.0;
float l9_172=(*sc_set0.UserUniforms).fire_scale;
l9_171=l9_172;
float l9_173=0.0;
l9_173=l9_171*(*sc_set0.UserUniforms).Port_Input1_N060;
float l9_174=0.0;
l9_174=l9_159+l9_173;
float l9_175=0.0;
l9_175=l9_174*(*sc_set0.UserUniforms).Port_Input1_N029;
float l9_176=0.0;
float l9_177=(*sc_set0.UserUniforms).range;
l9_176=l9_177;
float l9_178=0.0;
l9_178=l9_175+l9_176;
float l9_179=0.0;
l9_179=(((l9_166-(*sc_set0.UserUniforms).Port_RangeMinA_N038)/(((*sc_set0.UserUniforms).Port_RangeMaxA_N038-(*sc_set0.UserUniforms).Port_RangeMinA_N038)+1e-06))*(l9_178-l9_175))+l9_175;
float l9_180=0.0;
l9_180=l9_179*(*sc_set0.UserUniforms).Port_Input1_N054;
float l9_181=0.0;
l9_181=1.0-l9_180;
float3 l9_182=float3(0.0);
l9_182.x=l9_181;
l9_182.y=l9_179;
l9_182.z=l9_181;
param_3=float4(l9_182,0.0);
param_6=param_3;
}
else
{
if (param_1==2.0)
{
float l9_183=0.0;
l9_183=param_7.gTimeElapsed*(*sc_set0.UserUniforms).Port_Multiplier_N024;
float4 l9_184=float4(0.0);
l9_184=param_7.VertexColor;
float l9_185=0.0;
l9_185=l9_184.x;
float l9_186=0.0;
l9_186=l9_185*(*sc_set0.UserUniforms).Port_Input1_N019;
float l9_187=0.0;
l9_187=floor(l9_186+0.5);
float l9_188=0.0;
l9_188=l9_187+(*sc_set0.UserUniforms).Port_Input1_N034;
float l9_189=0.0;
l9_189=l9_183+l9_188;
float l9_190=0.0;
float l9_191=(*sc_set0.UserUniforms).noise_freq;
l9_190=l9_191;
float l9_192=0.0;
l9_192=l9_190*(*sc_set0.UserUniforms).Port_Input1_N032;
float2 l9_193=float2(0.0);
l9_193.x=(*sc_set0.UserUniforms).Port_Value1_N031;
l9_193.y=l9_192;
float l9_194=0.0;
float2 l9_195=float2(l9_189);
float2 l9_196=l9_193;
l9_195.x=floor(l9_195.x*10000.0)*9.9999997e-05;
l9_195.y=floor(l9_195.y*10000.0)*9.9999997e-05;
l9_195*=(l9_196*0.5);
float2 l9_197=l9_195;
float l9_198=(snoise(l9_197)*0.5)+0.5;
l9_198=floor(l9_198*10000.0)*9.9999997e-05;
l9_194=l9_198;
float l9_199=0.0;
float l9_200=(*sc_set0.UserUniforms).fire_scale;
l9_199=l9_200;
float l9_201=0.0;
l9_201=l9_199*(*sc_set0.UserUniforms).Port_Input1_N060;
float l9_202=0.0;
l9_202=l9_187+l9_201;
float l9_203=0.0;
l9_203=l9_202*(*sc_set0.UserUniforms).Port_Input1_N029;
float l9_204=0.0;
float l9_205=(*sc_set0.UserUniforms).range;
l9_204=l9_205;
float l9_206=0.0;
l9_206=l9_203+l9_204;
float l9_207=0.0;
l9_207=(((l9_194-(*sc_set0.UserUniforms).Port_RangeMinA_N040)/(((*sc_set0.UserUniforms).Port_RangeMaxA_N040-(*sc_set0.UserUniforms).Port_RangeMinA_N040)+1e-06))*(l9_206-l9_203))+l9_203;
float l9_208=0.0;
l9_208=l9_207*(*sc_set0.UserUniforms).Port_Input1_N050;
float l9_209=0.0;
l9_209=1.0-l9_208;
float3 l9_210=float3(0.0);
l9_210.x=l9_209;
l9_210.y=l9_207;
l9_210.z=l9_209;
param_4=float4(l9_210,0.0);
param_6=param_4;
}
else
{
param_6=param_5;
}
}
}
Result_N17=param_6;
float3 Output_N16=float3(0.0);
Output_N16=Output_N58*Result_N17.xyz;
float Output_N41=0.0;
float param_8=(*sc_set0.UserUniforms).fire_scale;
Output_N41=param_8;
float Output_N6=0.0;
Output_N6=smoothstep((*sc_set0.UserUniforms).Port_Input0_N006,(*sc_set0.UserUniforms).Port_Input1_N006,Output_N41);
float3 Output_N61=float3(0.0);
Output_N61=Output_N16*float3(Output_N6);
float3 VectorOut_N5=float3(0.0);
VectorOut_N5=((*sc_set0.UserUniforms).sc_ModelMatrix*float4(Output_N61,1.0)).xyz;
WorldPosition=VectorOut_N5;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPosAndMotion.xyz;
WorldNormal=out.varNormalAndMotion.xyz;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_9=v;
float3 param_10=WorldPosition;
float3 param_11=WorldNormal;
float3 param_12=WorldTangent;
float4 param_13=v.position;
out.varPosAndMotion=float4(param_10.x,param_10.y,param_10.z,out.varPosAndMotion.w);
float3 l9_211=normalize(param_11);
out.varNormalAndMotion=float4(l9_211.x,l9_211.y,l9_211.z,out.varNormalAndMotion.w);
float3 l9_212=normalize(param_12);
out.varTangent=float4(l9_212.x,l9_212.y,l9_212.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_213=param_9.position;
float4 l9_214=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
int l9_215=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_215=0;
}
else
{
l9_215=gl_InstanceIndex%2;
}
int l9_216=l9_215;
l9_214=(*sc_set0.UserUniforms).sc_ProjectionMatrixInverseArray[l9_216]*l9_213;
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_217=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_217=0;
}
else
{
l9_217=gl_InstanceIndex%2;
}
int l9_218=l9_217;
l9_214=(*sc_set0.UserUniforms).sc_ViewMatrixArray[l9_218]*l9_213;
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_219=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_219=0;
}
else
{
l9_219=gl_InstanceIndex%2;
}
int l9_220=l9_219;
l9_214=(*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_220]*l9_213;
}
else
{
l9_214=l9_213;
}
}
}
float4 l9_221=l9_214;
out.varViewSpaceDepth=-l9_221.z;
}
float4 l9_222=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
l9_222=param_13;
}
else
{
if (sc_RenderingSpace_tmp==4)
{
int l9_223=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_223=0;
}
else
{
l9_223=gl_InstanceIndex%2;
}
int l9_224=l9_223;
l9_222=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_224]*param_9.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_225=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_225=0;
}
else
{
l9_225=gl_InstanceIndex%2;
}
int l9_226=l9_225;
l9_222=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_226]*float4(out.varPosAndMotion.xyz,1.0);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_227=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_227=0;
}
else
{
l9_227=gl_InstanceIndex%2;
}
int l9_228=l9_227;
l9_222=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_228]*float4(out.varPosAndMotion.xyz,1.0);
}
}
}
}
out.varTex01=float4(param_9.texture0,param_9.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_229=param_9.position;
float4 l9_230=l9_229;
if (sc_RenderingSpace_tmp==1)
{
l9_230=(*sc_set0.UserUniforms).sc_ModelMatrix*l9_229;
}
float4 l9_231=(*sc_set0.UserUniforms).sc_ProjectorMatrix*l9_230;
float2 l9_232=((l9_231.xy/float2(l9_231.w))*0.5)+float2(0.5);
out.varShadowTex=l9_232;
}
float4 l9_233=l9_222;
if (sc_DepthBufferMode_tmp==1)
{
int l9_234=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_234=0;
}
else
{
l9_234=gl_InstanceIndex%2;
}
int l9_235=l9_234;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_235][2].w!=0.0)
{
float l9_236=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
l9_233.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+l9_233.w))*l9_236)-1.0)*l9_233.w;
}
}
float4 l9_237=l9_233;
l9_222=l9_237;
float4 l9_238=l9_222;
if ((int(sc_TAAEnabled_tmp)!=0))
{
float2 l9_239=l9_238.xy+((*sc_set0.UserUniforms).sc_TAAJitterOffset*l9_238.w);
l9_238=float4(l9_239.x,l9_239.y,l9_238.z,l9_238.w);
}
float4 l9_240=l9_238;
l9_222=l9_240;
float4 l9_241=l9_222;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_241.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_242=l9_241;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_243=dot(l9_242,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_244=l9_243;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_244;
}
}
float4 l9_245=float4(l9_241.x,-l9_241.y,(l9_241.z*0.5)+(l9_241.w*0.5),l9_241.w);
out.gl_Position=l9_245;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_247=param_9;
sc_Vertex_t l9_248=l9_247;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_249=l9_248;
float3 l9_250=in.blendShape0Pos;
float3 l9_251=in.blendShape0Normal;
float l9_252=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_253=l9_249;
float3 l9_254=l9_250;
float l9_255=l9_252;
float3 l9_256=l9_253.position.xyz+(l9_254*l9_255);
l9_253.position=float4(l9_256.x,l9_256.y,l9_256.z,l9_253.position.w);
l9_249=l9_253;
l9_249.normal+=(l9_251*l9_252);
l9_248=l9_249;
sc_Vertex_t l9_257=l9_248;
float3 l9_258=in.blendShape1Pos;
float3 l9_259=in.blendShape1Normal;
float l9_260=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_261=l9_257;
float3 l9_262=l9_258;
float l9_263=l9_260;
float3 l9_264=l9_261.position.xyz+(l9_262*l9_263);
l9_261.position=float4(l9_264.x,l9_264.y,l9_264.z,l9_261.position.w);
l9_257=l9_261;
l9_257.normal+=(l9_259*l9_260);
l9_248=l9_257;
sc_Vertex_t l9_265=l9_248;
float3 l9_266=in.blendShape2Pos;
float3 l9_267=in.blendShape2Normal;
float l9_268=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_269=l9_265;
float3 l9_270=l9_266;
float l9_271=l9_268;
float3 l9_272=l9_269.position.xyz+(l9_270*l9_271);
l9_269.position=float4(l9_272.x,l9_272.y,l9_272.z,l9_269.position.w);
l9_265=l9_269;
l9_265.normal+=(l9_267*l9_268);
l9_248=l9_265;
}
else
{
sc_Vertex_t l9_273=l9_248;
float3 l9_274=in.blendShape0Pos;
float l9_275=(*sc_set0.UserUniforms).weights0.x;
float3 l9_276=l9_273.position.xyz+(l9_274*l9_275);
l9_273.position=float4(l9_276.x,l9_276.y,l9_276.z,l9_273.position.w);
l9_248=l9_273;
sc_Vertex_t l9_277=l9_248;
float3 l9_278=in.blendShape1Pos;
float l9_279=(*sc_set0.UserUniforms).weights0.y;
float3 l9_280=l9_277.position.xyz+(l9_278*l9_279);
l9_277.position=float4(l9_280.x,l9_280.y,l9_280.z,l9_277.position.w);
l9_248=l9_277;
sc_Vertex_t l9_281=l9_248;
float3 l9_282=in.blendShape2Pos;
float l9_283=(*sc_set0.UserUniforms).weights0.z;
float3 l9_284=l9_281.position.xyz+(l9_282*l9_283);
l9_281.position=float4(l9_284.x,l9_284.y,l9_284.z,l9_281.position.w);
l9_248=l9_281;
sc_Vertex_t l9_285=l9_248;
float3 l9_286=in.blendShape3Pos;
float l9_287=(*sc_set0.UserUniforms).weights0.w;
float3 l9_288=l9_285.position.xyz+(l9_286*l9_287);
l9_285.position=float4(l9_288.x,l9_288.y,l9_288.z,l9_285.position.w);
l9_248=l9_285;
sc_Vertex_t l9_289=l9_248;
float3 l9_290=in.blendShape4Pos;
float l9_291=(*sc_set0.UserUniforms).weights1.x;
float3 l9_292=l9_289.position.xyz+(l9_290*l9_291);
l9_289.position=float4(l9_292.x,l9_292.y,l9_292.z,l9_289.position.w);
l9_248=l9_289;
sc_Vertex_t l9_293=l9_248;
float3 l9_294=in.blendShape5Pos;
float l9_295=(*sc_set0.UserUniforms).weights1.y;
float3 l9_296=l9_293.position.xyz+(l9_294*l9_295);
l9_293.position=float4(l9_296.x,l9_296.y,l9_296.z,l9_293.position.w);
l9_248=l9_293;
}
}
l9_247=l9_248;
sc_Vertex_t l9_297=l9_247;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_298=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_298=float4(1.0,fract(in.boneData.yzw));
l9_298.x-=dot(l9_298.yzw,float3(1.0));
}
float4 l9_299=l9_298;
float4 l9_300=l9_299;
int l9_301=int(in.boneData.x);
int l9_302=int(in.boneData.y);
int l9_303=int(in.boneData.z);
int l9_304=int(in.boneData.w);
int l9_305=l9_301;
float4 l9_306=l9_297.position;
float3 l9_307=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_308=l9_305;
float4 l9_309=(*sc_set0.sc_BonesUBO).sc_Bones[l9_308].boneMatrix[0];
float4 l9_310=(*sc_set0.sc_BonesUBO).sc_Bones[l9_308].boneMatrix[1];
float4 l9_311=(*sc_set0.sc_BonesUBO).sc_Bones[l9_308].boneMatrix[2];
float4 l9_312[3];
l9_312[0]=l9_309;
l9_312[1]=l9_310;
l9_312[2]=l9_311;
l9_307=float3(dot(l9_306,l9_312[0]),dot(l9_306,l9_312[1]),dot(l9_306,l9_312[2]));
}
else
{
l9_307=l9_306.xyz;
}
float3 l9_313=l9_307;
float3 l9_314=l9_313;
float l9_315=l9_300.x;
int l9_316=l9_302;
float4 l9_317=l9_297.position;
float3 l9_318=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_319=l9_316;
float4 l9_320=(*sc_set0.sc_BonesUBO).sc_Bones[l9_319].boneMatrix[0];
float4 l9_321=(*sc_set0.sc_BonesUBO).sc_Bones[l9_319].boneMatrix[1];
float4 l9_322=(*sc_set0.sc_BonesUBO).sc_Bones[l9_319].boneMatrix[2];
float4 l9_323[3];
l9_323[0]=l9_320;
l9_323[1]=l9_321;
l9_323[2]=l9_322;
l9_318=float3(dot(l9_317,l9_323[0]),dot(l9_317,l9_323[1]),dot(l9_317,l9_323[2]));
}
else
{
l9_318=l9_317.xyz;
}
float3 l9_324=l9_318;
float3 l9_325=l9_324;
float l9_326=l9_300.y;
int l9_327=l9_303;
float4 l9_328=l9_297.position;
float3 l9_329=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_330=l9_327;
float4 l9_331=(*sc_set0.sc_BonesUBO).sc_Bones[l9_330].boneMatrix[0];
float4 l9_332=(*sc_set0.sc_BonesUBO).sc_Bones[l9_330].boneMatrix[1];
float4 l9_333=(*sc_set0.sc_BonesUBO).sc_Bones[l9_330].boneMatrix[2];
float4 l9_334[3];
l9_334[0]=l9_331;
l9_334[1]=l9_332;
l9_334[2]=l9_333;
l9_329=float3(dot(l9_328,l9_334[0]),dot(l9_328,l9_334[1]),dot(l9_328,l9_334[2]));
}
else
{
l9_329=l9_328.xyz;
}
float3 l9_335=l9_329;
float3 l9_336=l9_335;
float l9_337=l9_300.z;
int l9_338=l9_304;
float4 l9_339=l9_297.position;
float3 l9_340=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_341=l9_338;
float4 l9_342=(*sc_set0.sc_BonesUBO).sc_Bones[l9_341].boneMatrix[0];
float4 l9_343=(*sc_set0.sc_BonesUBO).sc_Bones[l9_341].boneMatrix[1];
float4 l9_344=(*sc_set0.sc_BonesUBO).sc_Bones[l9_341].boneMatrix[2];
float4 l9_345[3];
l9_345[0]=l9_342;
l9_345[1]=l9_343;
l9_345[2]=l9_344;
l9_340=float3(dot(l9_339,l9_345[0]),dot(l9_339,l9_345[1]),dot(l9_339,l9_345[2]));
}
else
{
l9_340=l9_339.xyz;
}
float3 l9_346=l9_340;
float3 l9_347=(((l9_314*l9_315)+(l9_325*l9_326))+(l9_336*l9_337))+(l9_346*l9_300.w);
l9_297.position=float4(l9_347.x,l9_347.y,l9_347.z,l9_297.position.w);
int l9_348=l9_301;
float3x3 l9_349=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_348].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_348].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_348].normalMatrix[2].xyz));
float3x3 l9_350=l9_349;
float3x3 l9_351=l9_350;
int l9_352=l9_302;
float3x3 l9_353=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_352].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_352].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_352].normalMatrix[2].xyz));
float3x3 l9_354=l9_353;
float3x3 l9_355=l9_354;
int l9_356=l9_303;
float3x3 l9_357=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_356].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_356].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_356].normalMatrix[2].xyz));
float3x3 l9_358=l9_357;
float3x3 l9_359=l9_358;
int l9_360=l9_304;
float3x3 l9_361=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_360].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_360].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_360].normalMatrix[2].xyz));
float3x3 l9_362=l9_361;
float3x3 l9_363=l9_362;
l9_297.normal=((((l9_351*l9_297.normal)*l9_300.x)+((l9_355*l9_297.normal)*l9_300.y))+((l9_359*l9_297.normal)*l9_300.z))+((l9_363*l9_297.normal)*l9_300.w);
l9_297.tangent=((((l9_351*l9_297.tangent)*l9_300.x)+((l9_355*l9_297.tangent)*l9_300.y))+((l9_359*l9_297.tangent)*l9_300.z))+((l9_363*l9_297.tangent)*l9_300.w);
}
l9_247=l9_297;
float l9_364=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_365=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_366=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_367=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_368=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_369=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_370=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_371=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_372=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_373=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_374=l9_364/l9_365;
int l9_375=gl_InstanceIndex;
int l9_376=l9_375;
l9_247.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_247.position;
float3 l9_377=l9_247.position.xyz;
float3 l9_378=float3(float(l9_376%int(l9_366))*l9_364,float(l9_376/int(l9_366))*l9_364,(float(l9_376)*l9_374)+l9_371);
float3 l9_379=l9_377+l9_378;
float4 l9_380=float4(l9_379-l9_373,1.0);
float l9_381=l9_367;
float l9_382=l9_368;
float l9_383=l9_369;
float l9_384=l9_370;
float l9_385=l9_371;
float l9_386=l9_372;
float4x4 l9_387=float4x4(float4(2.0/(l9_382-l9_381),0.0,0.0,(-(l9_382+l9_381))/(l9_382-l9_381)),float4(0.0,2.0/(l9_384-l9_383),0.0,(-(l9_384+l9_383))/(l9_384-l9_383)),float4(0.0,0.0,(-2.0)/(l9_386-l9_385),(-(l9_386+l9_385))/(l9_386-l9_385)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_388=l9_387;
float4 l9_389=l9_388*l9_380;
l9_389.w=1.0;
out.varScreenPos=l9_389;
float4 l9_390=l9_389*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_390.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_391=l9_390;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_392=dot(l9_391,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_393=l9_392;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_393;
}
}
float4 l9_394=float4(l9_390.x,-l9_390.y,(l9_390.z*0.5)+(l9_390.w*0.5),l9_390.w);
out.gl_Position=l9_394;
param_9=l9_247;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_395=param_9;
sc_Vertex_t l9_396=l9_395;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_397=l9_396;
float3 l9_398=in.blendShape0Pos;
float3 l9_399=in.blendShape0Normal;
float l9_400=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_401=l9_397;
float3 l9_402=l9_398;
float l9_403=l9_400;
float3 l9_404=l9_401.position.xyz+(l9_402*l9_403);
l9_401.position=float4(l9_404.x,l9_404.y,l9_404.z,l9_401.position.w);
l9_397=l9_401;
l9_397.normal+=(l9_399*l9_400);
l9_396=l9_397;
sc_Vertex_t l9_405=l9_396;
float3 l9_406=in.blendShape1Pos;
float3 l9_407=in.blendShape1Normal;
float l9_408=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_409=l9_405;
float3 l9_410=l9_406;
float l9_411=l9_408;
float3 l9_412=l9_409.position.xyz+(l9_410*l9_411);
l9_409.position=float4(l9_412.x,l9_412.y,l9_412.z,l9_409.position.w);
l9_405=l9_409;
l9_405.normal+=(l9_407*l9_408);
l9_396=l9_405;
sc_Vertex_t l9_413=l9_396;
float3 l9_414=in.blendShape2Pos;
float3 l9_415=in.blendShape2Normal;
float l9_416=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_417=l9_413;
float3 l9_418=l9_414;
float l9_419=l9_416;
float3 l9_420=l9_417.position.xyz+(l9_418*l9_419);
l9_417.position=float4(l9_420.x,l9_420.y,l9_420.z,l9_417.position.w);
l9_413=l9_417;
l9_413.normal+=(l9_415*l9_416);
l9_396=l9_413;
}
else
{
sc_Vertex_t l9_421=l9_396;
float3 l9_422=in.blendShape0Pos;
float l9_423=(*sc_set0.UserUniforms).weights0.x;
float3 l9_424=l9_421.position.xyz+(l9_422*l9_423);
l9_421.position=float4(l9_424.x,l9_424.y,l9_424.z,l9_421.position.w);
l9_396=l9_421;
sc_Vertex_t l9_425=l9_396;
float3 l9_426=in.blendShape1Pos;
float l9_427=(*sc_set0.UserUniforms).weights0.y;
float3 l9_428=l9_425.position.xyz+(l9_426*l9_427);
l9_425.position=float4(l9_428.x,l9_428.y,l9_428.z,l9_425.position.w);
l9_396=l9_425;
sc_Vertex_t l9_429=l9_396;
float3 l9_430=in.blendShape2Pos;
float l9_431=(*sc_set0.UserUniforms).weights0.z;
float3 l9_432=l9_429.position.xyz+(l9_430*l9_431);
l9_429.position=float4(l9_432.x,l9_432.y,l9_432.z,l9_429.position.w);
l9_396=l9_429;
sc_Vertex_t l9_433=l9_396;
float3 l9_434=in.blendShape3Pos;
float l9_435=(*sc_set0.UserUniforms).weights0.w;
float3 l9_436=l9_433.position.xyz+(l9_434*l9_435);
l9_433.position=float4(l9_436.x,l9_436.y,l9_436.z,l9_433.position.w);
l9_396=l9_433;
sc_Vertex_t l9_437=l9_396;
float3 l9_438=in.blendShape4Pos;
float l9_439=(*sc_set0.UserUniforms).weights1.x;
float3 l9_440=l9_437.position.xyz+(l9_438*l9_439);
l9_437.position=float4(l9_440.x,l9_440.y,l9_440.z,l9_437.position.w);
l9_396=l9_437;
sc_Vertex_t l9_441=l9_396;
float3 l9_442=in.blendShape5Pos;
float l9_443=(*sc_set0.UserUniforms).weights1.y;
float3 l9_444=l9_441.position.xyz+(l9_442*l9_443);
l9_441.position=float4(l9_444.x,l9_444.y,l9_444.z,l9_441.position.w);
l9_396=l9_441;
}
}
l9_395=l9_396;
sc_Vertex_t l9_445=l9_395;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_446=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_446=float4(1.0,fract(in.boneData.yzw));
l9_446.x-=dot(l9_446.yzw,float3(1.0));
}
float4 l9_447=l9_446;
float4 l9_448=l9_447;
int l9_449=int(in.boneData.x);
int l9_450=int(in.boneData.y);
int l9_451=int(in.boneData.z);
int l9_452=int(in.boneData.w);
int l9_453=l9_449;
float4 l9_454=l9_445.position;
float3 l9_455=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_456=l9_453;
float4 l9_457=(*sc_set0.sc_BonesUBO).sc_Bones[l9_456].boneMatrix[0];
float4 l9_458=(*sc_set0.sc_BonesUBO).sc_Bones[l9_456].boneMatrix[1];
float4 l9_459=(*sc_set0.sc_BonesUBO).sc_Bones[l9_456].boneMatrix[2];
float4 l9_460[3];
l9_460[0]=l9_457;
l9_460[1]=l9_458;
l9_460[2]=l9_459;
l9_455=float3(dot(l9_454,l9_460[0]),dot(l9_454,l9_460[1]),dot(l9_454,l9_460[2]));
}
else
{
l9_455=l9_454.xyz;
}
float3 l9_461=l9_455;
float3 l9_462=l9_461;
float l9_463=l9_448.x;
int l9_464=l9_450;
float4 l9_465=l9_445.position;
float3 l9_466=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_467=l9_464;
float4 l9_468=(*sc_set0.sc_BonesUBO).sc_Bones[l9_467].boneMatrix[0];
float4 l9_469=(*sc_set0.sc_BonesUBO).sc_Bones[l9_467].boneMatrix[1];
float4 l9_470=(*sc_set0.sc_BonesUBO).sc_Bones[l9_467].boneMatrix[2];
float4 l9_471[3];
l9_471[0]=l9_468;
l9_471[1]=l9_469;
l9_471[2]=l9_470;
l9_466=float3(dot(l9_465,l9_471[0]),dot(l9_465,l9_471[1]),dot(l9_465,l9_471[2]));
}
else
{
l9_466=l9_465.xyz;
}
float3 l9_472=l9_466;
float3 l9_473=l9_472;
float l9_474=l9_448.y;
int l9_475=l9_451;
float4 l9_476=l9_445.position;
float3 l9_477=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_478=l9_475;
float4 l9_479=(*sc_set0.sc_BonesUBO).sc_Bones[l9_478].boneMatrix[0];
float4 l9_480=(*sc_set0.sc_BonesUBO).sc_Bones[l9_478].boneMatrix[1];
float4 l9_481=(*sc_set0.sc_BonesUBO).sc_Bones[l9_478].boneMatrix[2];
float4 l9_482[3];
l9_482[0]=l9_479;
l9_482[1]=l9_480;
l9_482[2]=l9_481;
l9_477=float3(dot(l9_476,l9_482[0]),dot(l9_476,l9_482[1]),dot(l9_476,l9_482[2]));
}
else
{
l9_477=l9_476.xyz;
}
float3 l9_483=l9_477;
float3 l9_484=l9_483;
float l9_485=l9_448.z;
int l9_486=l9_452;
float4 l9_487=l9_445.position;
float3 l9_488=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_489=l9_486;
float4 l9_490=(*sc_set0.sc_BonesUBO).sc_Bones[l9_489].boneMatrix[0];
float4 l9_491=(*sc_set0.sc_BonesUBO).sc_Bones[l9_489].boneMatrix[1];
float4 l9_492=(*sc_set0.sc_BonesUBO).sc_Bones[l9_489].boneMatrix[2];
float4 l9_493[3];
l9_493[0]=l9_490;
l9_493[1]=l9_491;
l9_493[2]=l9_492;
l9_488=float3(dot(l9_487,l9_493[0]),dot(l9_487,l9_493[1]),dot(l9_487,l9_493[2]));
}
else
{
l9_488=l9_487.xyz;
}
float3 l9_494=l9_488;
float3 l9_495=(((l9_462*l9_463)+(l9_473*l9_474))+(l9_484*l9_485))+(l9_494*l9_448.w);
l9_445.position=float4(l9_495.x,l9_495.y,l9_495.z,l9_445.position.w);
int l9_496=l9_449;
float3x3 l9_497=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_496].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_496].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_496].normalMatrix[2].xyz));
float3x3 l9_498=l9_497;
float3x3 l9_499=l9_498;
int l9_500=l9_450;
float3x3 l9_501=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_500].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_500].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_500].normalMatrix[2].xyz));
float3x3 l9_502=l9_501;
float3x3 l9_503=l9_502;
int l9_504=l9_451;
float3x3 l9_505=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_504].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_504].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_504].normalMatrix[2].xyz));
float3x3 l9_506=l9_505;
float3x3 l9_507=l9_506;
int l9_508=l9_452;
float3x3 l9_509=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_508].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_508].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_508].normalMatrix[2].xyz));
float3x3 l9_510=l9_509;
float3x3 l9_511=l9_510;
l9_445.normal=((((l9_499*l9_445.normal)*l9_448.x)+((l9_503*l9_445.normal)*l9_448.y))+((l9_507*l9_445.normal)*l9_448.z))+((l9_511*l9_445.normal)*l9_448.w);
l9_445.tangent=((((l9_499*l9_445.tangent)*l9_448.x)+((l9_503*l9_445.tangent)*l9_448.y))+((l9_507*l9_445.tangent)*l9_448.z))+((l9_511*l9_445.tangent)*l9_448.w);
}
l9_395=l9_445;
float3 l9_512=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_513=((l9_395.position.xy/float2(l9_395.position.w))*0.5)+float2(0.5);
out.varTex01=float4(l9_513.x,l9_513.y,out.varTex01.z,out.varTex01.w);
l9_395.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_395.position;
float3 l9_514=l9_395.position.xyz-l9_512;
l9_395.position=float4(l9_514.x,l9_514.y,l9_514.z,l9_395.position.w);
out.varPosAndMotion=float4(l9_395.position.xyz.x,l9_395.position.xyz.y,l9_395.position.xyz.z,out.varPosAndMotion.w);
float3 l9_515=normalize(l9_395.normal);
out.varNormalAndMotion=float4(l9_515.x,l9_515.y,l9_515.z,out.varNormalAndMotion.w);
float l9_516=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_517=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_518=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_519=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_520=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_521=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_522=l9_516;
float l9_523=l9_517;
float l9_524=l9_518;
float l9_525=l9_519;
float l9_526=l9_520;
float l9_527=l9_521;
float4x4 l9_528=float4x4(float4(2.0/(l9_523-l9_522),0.0,0.0,(-(l9_523+l9_522))/(l9_523-l9_522)),float4(0.0,2.0/(l9_525-l9_524),0.0,(-(l9_525+l9_524))/(l9_525-l9_524)),float4(0.0,0.0,(-2.0)/(l9_527-l9_526),(-(l9_527+l9_526))/(l9_527-l9_526)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_529=l9_528;
float4 l9_530=float4(0.0);
float3 l9_531=(l9_529*l9_395.position).xyz;
l9_530=float4(l9_531.x,l9_531.y,l9_531.z,l9_530.w);
l9_530.w=1.0;
out.varScreenPos=l9_530;
float4 l9_532=l9_530*1.0;
float4 l9_533=l9_532;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_533.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_534=l9_533;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_535=dot(l9_534,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_536=l9_535;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_536;
}
}
float4 l9_537=float4(l9_533.x,-l9_533.y,(l9_533.z*0.5)+(l9_533.w*0.5),l9_533.w);
out.gl_Position=l9_537;
param_9=l9_395;
}
}
v=param_9;
out.Interpolator_UVCoord3=Globals.UVCoord3;
float3 param_14=out.varPosAndMotion.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float4 l9_538=((*sc_set0.UserUniforms).sc_PrevFrameModelMatrix*(*sc_set0.UserUniforms).sc_ModelMatrixInverse)*float4(param_14,1.0);
float3 l9_539=param_14;
float3 l9_540=l9_538.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
int l9_541=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_541=0;
}
else
{
l9_541=gl_InstanceIndex%2;
}
int l9_542=l9_541;
float4 l9_543=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_542]*float4(l9_539,1.0);
float2 l9_544=l9_543.xy/float2(l9_543.w);
l9_543=float4(l9_544.x,l9_544.y,l9_543.z,l9_543.w);
int l9_545=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_545=0;
}
else
{
l9_545=gl_InstanceIndex%2;
}
int l9_546=l9_545;
float4 l9_547=(*sc_set0.UserUniforms).sc_PrevFrameViewProjectionMatrixArray[l9_546]*float4(l9_540,1.0);
float2 l9_548=l9_547.xy/float2(l9_547.w);
l9_547=float4(l9_548.x,l9_548.y,l9_547.z,l9_547.w);
float2 l9_549=(l9_543.xy-l9_547.xy)*0.5;
out.varPosAndMotion.w=l9_549.x;
out.varNormalAndMotion.w=l9_549.y;
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
float4 VertexColor;
float2 UVCoord3;
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
float noise_freq;
float fire_scale;
float range;
float4 Tweak_N14Size;
float4 Tweak_N14Dims;
float4 Tweak_N14View;
float3x3 Tweak_N14Transform;
float4 Tweak_N14UvMinMax;
float4 Tweak_N14BorderColor;
float Port_Input1_N009;
float Port_Input1_N007;
float Port_Value2_N059;
float Port_Value3_N059;
float Port_Input1_N019;
float Port_Multiplier_N024;
float Port_Input1_N034;
float Port_Value1_N031;
float Port_Input1_N032;
float Port_RangeMinA_N035;
float Port_RangeMaxA_N035;
float Port_Input1_N060;
float Port_Input1_N029;
float Port_Input1_N056;
float Port_RangeMinA_N038;
float Port_RangeMaxA_N038;
float Port_Input1_N054;
float Port_RangeMinA_N040;
float Port_RangeMaxA_N040;
float Port_Input1_N050;
float4 Port_Default_N017;
float Port_Input0_N006;
float Port_Input1_N006;
float4 Port_Value0_N010;
float Port_Position1_N010;
float4 Port_Value1_N010;
float4 Port_Value2_N010;
float4 Port_Value0_N043;
float Port_Position1_N043;
float4 Port_Value1_N043;
float4 Port_Value2_N043;
float4 Port_Value0_N044;
float Port_Position1_N044;
float4 Port_Value1_N044;
float4 Port_Value2_N044;
float4 Port_Default_N042;
float Port_Rotation_N012;
float2 Port_Center_N012;
float4 Port_Value0_N049;
float Port_Position1_N049;
float4 Port_Value1_N049;
float4 Port_Value2_N049;
float2 Port_Direction_N013;
float Port_Speed_N013;
float Port_Value2_N001;
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
texture2d<float> Tweak_N14 [[id(1)]];
texture2d<float> intensityTexture [[id(2)]];
texture2d<float> sc_ScreenTexture [[id(14)]];
sampler Tweak_N14SmpSC [[id(17)]];
sampler intensityTextureSmpSC [[id(18)]];
sampler sc_ScreenTextureSmpSC [[id(23)]];
constant userUniformsObj* UserUniforms [[id(26)]];
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
float2 Interpolator_UVCoord3 [[user(locn13)]];
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
Globals.VertexColor=in.varColor;
Globals.UVCoord3=in.Interpolator_UVCoord3;
float4 Result_N42=float4(0.0);
float param=0.0;
float4 param_1=float4(1.0,0.0,0.0,0.0);
float4 param_2=float4(0.0,1.0,0.0,0.0);
float4 param_3=float4(0.0,0.0,1.0,0.0);
float4 param_4=(*sc_set0.UserUniforms).Port_Default_N042;
ssGlobals param_6=Globals;
float4 l9_0=float4(0.0);
l9_0=param_6.VertexColor;
float l9_1=0.0;
l9_1=l9_0.x;
float l9_2=0.0;
l9_2=l9_1*(*sc_set0.UserUniforms).Port_Input1_N019;
float l9_3=0.0;
l9_3=floor(l9_2+0.5);
param=l9_3;
param=floor(param);
float4 param_5;
if (param==0.0)
{
float2 l9_4=float2(0.0);
l9_4=param_6.UVCoord3;
float l9_5=0.0;
l9_5=l9_4.y;
float4 l9_6=float4(0.0);
float l9_7=l9_5;
float4 l9_8=(*sc_set0.UserUniforms).Port_Value0_N010;
float l9_9=(*sc_set0.UserUniforms).Port_Position1_N010;
float4 l9_10=(*sc_set0.UserUniforms).Port_Value1_N010;
float4 l9_11=(*sc_set0.UserUniforms).Port_Value2_N010;
l9_7=fast::clamp(l9_7,0.0,1.0);
float4 l9_12;
if (l9_7<l9_9)
{
l9_12=mix(l9_8,l9_10,float4(fast::clamp(l9_7/l9_9,0.0,1.0)));
}
else
{
l9_12=mix(l9_10,l9_11,float4(fast::clamp((l9_7-l9_9)/(1.0-l9_9),0.0,1.0)));
}
bool l9_13=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_14;
if (l9_13)
{
l9_14=!PreviewInfo.Saved;
}
else
{
l9_14=l9_13;
}
bool l9_15;
if (l9_14)
{
l9_15=10==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_15=l9_14;
}
if (l9_15)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_12;
PreviewInfo.Color.w=1.0;
}
l9_6=l9_12;
param_1=l9_6;
param_5=param_1;
}
else
{
if (param==1.0)
{
float2 l9_16=float2(0.0);
l9_16=param_6.UVCoord3;
float l9_17=0.0;
l9_17=l9_16.y;
float4 l9_18=float4(0.0);
float l9_19=l9_17;
float4 l9_20=(*sc_set0.UserUniforms).Port_Value0_N043;
float l9_21=(*sc_set0.UserUniforms).Port_Position1_N043;
float4 l9_22=(*sc_set0.UserUniforms).Port_Value1_N043;
float4 l9_23=(*sc_set0.UserUniforms).Port_Value2_N043;
l9_19=fast::clamp(l9_19,0.0,1.0);
float4 l9_24;
if (l9_19<l9_21)
{
l9_24=mix(l9_20,l9_22,float4(fast::clamp(l9_19/l9_21,0.0,1.0)));
}
else
{
l9_24=mix(l9_22,l9_23,float4(fast::clamp((l9_19-l9_21)/(1.0-l9_21),0.0,1.0)));
}
bool l9_25=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_26;
if (l9_25)
{
l9_26=!PreviewInfo.Saved;
}
else
{
l9_26=l9_25;
}
bool l9_27;
if (l9_26)
{
l9_27=43==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_27=l9_26;
}
if (l9_27)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_24;
PreviewInfo.Color.w=1.0;
}
l9_18=l9_24;
param_2=l9_18;
param_5=param_2;
}
else
{
if (param==2.0)
{
float2 l9_28=float2(0.0);
l9_28=param_6.UVCoord3;
float l9_29=0.0;
l9_29=l9_28.y;
float4 l9_30=float4(0.0);
float l9_31=l9_29;
float4 l9_32=(*sc_set0.UserUniforms).Port_Value0_N044;
float l9_33=(*sc_set0.UserUniforms).Port_Position1_N044;
float4 l9_34=(*sc_set0.UserUniforms).Port_Value1_N044;
float4 l9_35=(*sc_set0.UserUniforms).Port_Value2_N044;
l9_31=fast::clamp(l9_31,0.0,1.0);
float4 l9_36;
if (l9_31<l9_33)
{
l9_36=mix(l9_32,l9_34,float4(fast::clamp(l9_31/l9_33,0.0,1.0)));
}
else
{
l9_36=mix(l9_34,l9_35,float4(fast::clamp((l9_31-l9_33)/(1.0-l9_33),0.0,1.0)));
}
bool l9_37=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_38;
if (l9_37)
{
l9_38=!PreviewInfo.Saved;
}
else
{
l9_38=l9_37;
}
bool l9_39;
if (l9_38)
{
l9_39=44==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_39=l9_38;
}
if (l9_39)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_36;
PreviewInfo.Color.w=1.0;
}
l9_30=l9_36;
param_3=l9_30;
param_5=param_3;
}
else
{
param_5=param_4;
}
}
}
Result_N42=param_5;
float2 UVCoord_N46=float2(0.0);
UVCoord_N46=Globals.UVCoord3;
float2 CoordsOut_N12=float2(0.0);
float2 param_7=UVCoord_N46;
float param_8=(*sc_set0.UserUniforms).Port_Rotation_N012;
float2 param_9=(*sc_set0.UserUniforms).Port_Center_N012;
float l9_40=sin(radians(param_8));
float l9_41=cos(radians(param_8));
float2 param_10=param_7-param_9;
param_10=float2(dot(float2(l9_41,l9_40),param_10),dot(float2(-l9_40,l9_41),param_10))+param_9;
CoordsOut_N12=param_10;
float4 Value_N49=float4(0.0);
float param_11=CoordsOut_N12.x;
float4 param_12=(*sc_set0.UserUniforms).Port_Value0_N049;
float param_13=(*sc_set0.UserUniforms).Port_Position1_N049;
float4 param_14=(*sc_set0.UserUniforms).Port_Value1_N049;
float4 param_15=(*sc_set0.UserUniforms).Port_Value2_N049;
param_11=fast::clamp(param_11,0.0,1.0);
float4 param_16;
if (param_11<param_13)
{
param_16=mix(param_12,param_14,float4(fast::clamp(param_11/param_13,0.0,1.0)));
}
else
{
param_16=mix(param_14,param_15,float4(fast::clamp((param_11-param_13)/(1.0-param_13),0.0,1.0)));
}
bool l9_42=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_43;
if (l9_42)
{
l9_43=!PreviewInfo.Saved;
}
else
{
l9_43=l9_42;
}
bool l9_44;
if (l9_43)
{
l9_44=49==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_44=l9_43;
}
if (l9_44)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=param_16;
PreviewInfo.Color.w=1.0;
}
Value_N49=param_16;
float2 CoordsOut_N13=float2(0.0);
CoordsOut_N13=UVCoord_N46+((*sc_set0.UserUniforms).Port_Direction_N013*(Globals.gTimeElapsed*(*sc_set0.UserUniforms).Port_Speed_N013));
float4 Color_N45=float4(0.0);
int l9_45;
if ((int(Tweak_N14HasSwappedViews_tmp)!=0))
{
int l9_46=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_46=0;
}
else
{
l9_46=in.varStereoViewID;
}
int l9_47=l9_46;
l9_45=1-l9_47;
}
else
{
int l9_48=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_48=0;
}
else
{
l9_48=in.varStereoViewID;
}
int l9_49=l9_48;
l9_45=l9_49;
}
int l9_50=l9_45;
int param_17=Tweak_N14Layout_tmp;
int param_18=l9_50;
float2 param_19=CoordsOut_N13;
bool param_20=(int(SC_USE_UV_TRANSFORM_Tweak_N14_tmp)!=0);
float3x3 param_21=(*sc_set0.UserUniforms).Tweak_N14Transform;
int2 param_22=int2(SC_SOFTWARE_WRAP_MODE_U_Tweak_N14_tmp,SC_SOFTWARE_WRAP_MODE_V_Tweak_N14_tmp);
bool param_23=(int(SC_USE_UV_MIN_MAX_Tweak_N14_tmp)!=0);
float4 param_24=(*sc_set0.UserUniforms).Tweak_N14UvMinMax;
bool param_25=(int(SC_USE_CLAMP_TO_BORDER_Tweak_N14_tmp)!=0);
float4 param_26=(*sc_set0.UserUniforms).Tweak_N14BorderColor;
float param_27=0.0;
bool l9_51=param_25&&(!param_23);
float l9_52=1.0;
float l9_53=param_19.x;
int l9_54=param_22.x;
if (l9_54==1)
{
l9_53=fract(l9_53);
}
else
{
if (l9_54==2)
{
float l9_55=fract(l9_53);
float l9_56=l9_53-l9_55;
float l9_57=step(0.25,fract(l9_56*0.5));
l9_53=mix(l9_55,1.0-l9_55,fast::clamp(l9_57,0.0,1.0));
}
}
param_19.x=l9_53;
float l9_58=param_19.y;
int l9_59=param_22.y;
if (l9_59==1)
{
l9_58=fract(l9_58);
}
else
{
if (l9_59==2)
{
float l9_60=fract(l9_58);
float l9_61=l9_58-l9_60;
float l9_62=step(0.25,fract(l9_61*0.5));
l9_58=mix(l9_60,1.0-l9_60,fast::clamp(l9_62,0.0,1.0));
}
}
param_19.y=l9_58;
if (param_23)
{
bool l9_63=param_25;
bool l9_64;
if (l9_63)
{
l9_64=param_22.x==3;
}
else
{
l9_64=l9_63;
}
float l9_65=param_19.x;
float l9_66=param_24.x;
float l9_67=param_24.z;
bool l9_68=l9_64;
float l9_69=l9_52;
float l9_70=fast::clamp(l9_65,l9_66,l9_67);
float l9_71=step(abs(l9_65-l9_70),9.9999997e-06);
l9_69*=(l9_71+((1.0-float(l9_68))*(1.0-l9_71)));
l9_65=l9_70;
param_19.x=l9_65;
l9_52=l9_69;
bool l9_72=param_25;
bool l9_73;
if (l9_72)
{
l9_73=param_22.y==3;
}
else
{
l9_73=l9_72;
}
float l9_74=param_19.y;
float l9_75=param_24.y;
float l9_76=param_24.w;
bool l9_77=l9_73;
float l9_78=l9_52;
float l9_79=fast::clamp(l9_74,l9_75,l9_76);
float l9_80=step(abs(l9_74-l9_79),9.9999997e-06);
l9_78*=(l9_80+((1.0-float(l9_77))*(1.0-l9_80)));
l9_74=l9_79;
param_19.y=l9_74;
l9_52=l9_78;
}
float2 l9_81=param_19;
bool l9_82=param_20;
float3x3 l9_83=param_21;
if (l9_82)
{
l9_81=float2((l9_83*float3(l9_81,1.0)).xy);
}
float2 l9_84=l9_81;
param_19=l9_84;
float l9_85=param_19.x;
int l9_86=param_22.x;
bool l9_87=l9_51;
float l9_88=l9_52;
if ((l9_86==0)||(l9_86==3))
{
float l9_89=l9_85;
float l9_90=0.0;
float l9_91=1.0;
bool l9_92=l9_87;
float l9_93=l9_88;
float l9_94=fast::clamp(l9_89,l9_90,l9_91);
float l9_95=step(abs(l9_89-l9_94),9.9999997e-06);
l9_93*=(l9_95+((1.0-float(l9_92))*(1.0-l9_95)));
l9_89=l9_94;
l9_85=l9_89;
l9_88=l9_93;
}
param_19.x=l9_85;
l9_52=l9_88;
float l9_96=param_19.y;
int l9_97=param_22.y;
bool l9_98=l9_51;
float l9_99=l9_52;
if ((l9_97==0)||(l9_97==3))
{
float l9_100=l9_96;
float l9_101=0.0;
float l9_102=1.0;
bool l9_103=l9_98;
float l9_104=l9_99;
float l9_105=fast::clamp(l9_100,l9_101,l9_102);
float l9_106=step(abs(l9_100-l9_105),9.9999997e-06);
l9_104*=(l9_106+((1.0-float(l9_103))*(1.0-l9_106)));
l9_100=l9_105;
l9_96=l9_100;
l9_99=l9_104;
}
param_19.y=l9_96;
l9_52=l9_99;
float2 l9_107=param_19;
int l9_108=param_17;
int l9_109=param_18;
float l9_110=param_27;
float2 l9_111=l9_107;
int l9_112=l9_108;
int l9_113=l9_109;
float3 l9_114=float3(0.0);
if (l9_112==0)
{
l9_114=float3(l9_111,0.0);
}
else
{
if (l9_112==1)
{
l9_114=float3(l9_111.x,(l9_111.y*0.5)+(0.5-(float(l9_113)*0.5)),0.0);
}
else
{
l9_114=float3(l9_111,float(l9_113));
}
}
float3 l9_115=l9_114;
float3 l9_116=l9_115;
float4 l9_117=sc_set0.Tweak_N14.sample(sc_set0.Tweak_N14SmpSC,l9_116.xy,bias(l9_110));
float4 l9_118=l9_117;
if (param_25)
{
l9_118=mix(param_26,l9_118,float4(l9_52));
}
float4 l9_119=l9_118;
Color_N45=l9_119;
float Output_N52=0.0;
Output_N52=Color_N45.x;
float Output_N47=0.0;
Output_N47=1.0-Output_N52;
float4 Value_N53=float4(0.0);
Value_N53=float4(Value_N49.xyz.x,Value_N49.xyz.y,Value_N49.xyz.z,Value_N53.w);
Value_N53.w=Output_N47;
float4 Output_N51=float4(0.0);
float4 param_28=Result_N42;
float4 param_29=Value_N53;
float4 param_30;
param_30=float4(param_29.xyz.x,param_29.xyz.y,param_29.xyz.z,param_30.w);
float3 l9_120=mix(param_28.xyz,param_30.xyz,float3(param_29.w));
param_30=float4(l9_120.x,l9_120.y,l9_120.z,param_30.w);
param_30.w=param_28.w;
Output_N51=param_30;
float4 Value_N1=float4(0.0);
Value_N1=float4(Output_N51.xyz.x,Output_N51.xyz.y,Output_N51.xyz.z,Value_N1.w);
Value_N1.w=(*sc_set0.UserUniforms).Port_Value2_N001;
FinalColor=Value_N1;
float param_31=FinalColor.w;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (param_31<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_121=gl_FragCoord;
float2 l9_122=floor(mod(l9_121.xy,float2(4.0)));
float l9_123=(mod(dot(l9_122,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (param_31<l9_123)
{
discard_fragment();
}
}
float4 param_32=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_124=param_32;
float4 l9_125=l9_124;
float l9_126=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_126=l9_125.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_126=fast::clamp(l9_125.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_126=fast::clamp(dot(l9_125.xyz,float3(l9_125.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_126=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_126=(1.0-dot(l9_125.xyz,float3(0.33333001)))*l9_125.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_126=(1.0-fast::clamp(dot(l9_125.xyz,float3(1.0)),0.0,1.0))*l9_125.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_126=fast::clamp(dot(l9_125.xyz,float3(1.0)),0.0,1.0)*l9_125.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_126=fast::clamp(dot(l9_125.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_126=fast::clamp(dot(l9_125.xyz,float3(1.0)),0.0,1.0)*l9_125.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_126=dot(l9_125.xyz,float3(0.33333001))*l9_125.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_126=1.0-fast::clamp(dot(l9_125.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_126=fast::clamp(dot(l9_125.xyz,float3(1.0)),0.0,1.0);
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
float l9_127=l9_126;
float l9_128=l9_127;
float l9_129=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_128;
float3 l9_130=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_124.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_131=float4(l9_130.x,l9_130.y,l9_130.z,l9_129);
param_32=l9_131;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_32=float4(param_32.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_132=param_32;
float4 l9_133=float4(0.0);
float4 l9_134=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_135=out.sc_FragData0;
l9_134=l9_135;
}
else
{
float4 l9_136=gl_FragCoord;
float2 l9_137=l9_136.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_138=l9_137;
float2 l9_139=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_140=1;
int l9_141=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_141=0;
}
else
{
l9_141=in.varStereoViewID;
}
int l9_142=l9_141;
int l9_143=l9_142;
float3 l9_144=float3(l9_138,0.0);
int l9_145=l9_140;
int l9_146=l9_143;
if (l9_145==1)
{
l9_144.y=((2.0*l9_144.y)+float(l9_146))-1.0;
}
float2 l9_147=l9_144.xy;
l9_139=l9_147;
}
else
{
l9_139=l9_138;
}
float2 l9_148=l9_139;
float2 l9_149=l9_148;
float2 l9_150=l9_149;
float2 l9_151=l9_150;
float l9_152=0.0;
int l9_153;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_154=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_154=0;
}
else
{
l9_154=in.varStereoViewID;
}
int l9_155=l9_154;
l9_153=1-l9_155;
}
else
{
int l9_156=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_156=0;
}
else
{
l9_156=in.varStereoViewID;
}
int l9_157=l9_156;
l9_153=l9_157;
}
int l9_158=l9_153;
float2 l9_159=l9_151;
int l9_160=sc_ScreenTextureLayout_tmp;
int l9_161=l9_158;
float l9_162=l9_152;
float2 l9_163=l9_159;
int l9_164=l9_160;
int l9_165=l9_161;
float3 l9_166=float3(0.0);
if (l9_164==0)
{
l9_166=float3(l9_163,0.0);
}
else
{
if (l9_164==1)
{
l9_166=float3(l9_163.x,(l9_163.y*0.5)+(0.5-(float(l9_165)*0.5)),0.0);
}
else
{
l9_166=float3(l9_163,float(l9_165));
}
}
float3 l9_167=l9_166;
float3 l9_168=l9_167;
float4 l9_169=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_168.xy,bias(l9_162));
float4 l9_170=l9_169;
float4 l9_171=l9_170;
l9_134=l9_171;
}
float4 l9_172=l9_134;
float3 l9_173=l9_172.xyz;
float3 l9_174=l9_173;
float3 l9_175=l9_132.xyz;
float3 l9_176=definedBlend(l9_174,l9_175,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_133=float4(l9_176.x,l9_176.y,l9_176.z,l9_133.w);
float3 l9_177=mix(l9_173,l9_133.xyz,float3(l9_132.w));
l9_133=float4(l9_177.x,l9_177.y,l9_177.z,l9_133.w);
l9_133.w=1.0;
float4 l9_178=l9_133;
param_32=l9_178;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_179=float4(in.varScreenPos.xyz,1.0);
param_32=l9_179;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_180=gl_FragCoord;
float l9_181=fast::clamp(abs(l9_180.z),0.0,1.0);
float4 l9_182=float4(l9_181,1.0-l9_181,1.0,1.0);
param_32=l9_182;
}
else
{
float4 l9_183=param_32;
float4 l9_184=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_184=float4(mix(float3(1.0),l9_183.xyz,float3(l9_183.w)),l9_183.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_185=l9_183.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_185=fast::clamp(l9_185,0.0,1.0);
}
l9_184=float4(l9_183.xyz*l9_185,l9_185);
}
else
{
l9_184=l9_183;
}
}
float4 l9_186=l9_184;
param_32=l9_186;
}
}
}
}
}
float4 l9_187=param_32;
FinalColor=l9_187;
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
float4 l9_188=float4(0.0);
l9_188=float4(0.0);
float4 l9_189=l9_188;
float4 Cost=l9_189;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_33=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_33,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_34=FinalColor;
float4 l9_190=param_34;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_190.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_190;
return out;
}
} // FRAGMENT SHADER
