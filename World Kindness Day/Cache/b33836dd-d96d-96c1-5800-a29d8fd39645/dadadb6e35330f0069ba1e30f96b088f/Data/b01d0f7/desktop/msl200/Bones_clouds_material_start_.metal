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
//ubo int UserUniforms 0:24:4688 {
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
//float height_gradient 4256
//float distance_gradient 4260
//float alpha 4264
//float Port_Input1_N021 4268
//float4 Port_Value1_N025 4272
//float4 Port_Default_N025 4288
//float Port_Input1_N040 4304
//float Port_Input1_N043 4308
//float3 Port_Normal_N014 4320
//float Port_Exponent_N014 4336
//float Port_Intensity_N014 4340
//float Port_Input1_N017 4344
//float Port_Input1_N097 4348
//float Port_RangeMinA_N103 4352
//float Port_RangeMaxA_N103 4356
//float Port_RangeMinB_N103 4360
//float Port_RangeMaxB_N103 4364
//float Port_Input1_N069 4368
//float Port_Input2_N069 4372
//float Port_Value1_N076 4376
//float Port_Value3_N076 4380
//float4 Port_Value0_N077 4384
//float Port_Position1_N077 4400
//float4 Port_Value1_N077 4416
//float Port_Position2_N077 4432
//float4 Port_Value2_N077 4448
//float Port_Position3_N077 4464
//float4 Port_Value3_N077 4480
//float4 Port_Value4_N077 4496
//float Port_Amount_N080 4512
//float4 Port_Input1_N002 4528
//float Port_Input2_N002 4544
//float Port_Input1_N070 4548
//float Port_Input1_N071 4552
//float4 Port_Value0_N068 4560
//float Port_Position1_N068 4576
//float4 Port_Value1_N068 4592
//float4 Port_Value2_N068 4608
//float Port_Input1_N072 4624
//float3 Port_Default_N066 4640
//float3 Port_Value1_N038 4656
//float3 Port_Default_N038 4672
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
float height_gradient;
float distance_gradient;
float alpha;
float Port_Input1_N021;
float4 Port_Value1_N025;
float4 Port_Default_N025;
float Port_Input1_N040;
float Port_Input1_N043;
float3 Port_Normal_N014;
float Port_Exponent_N014;
float Port_Intensity_N014;
float Port_Input1_N017;
float Port_Input1_N097;
float Port_RangeMinA_N103;
float Port_RangeMaxA_N103;
float Port_RangeMinB_N103;
float Port_RangeMaxB_N103;
float Port_Input1_N069;
float Port_Input2_N069;
float Port_Value1_N076;
float Port_Value3_N076;
float4 Port_Value0_N077;
float Port_Position1_N077;
float4 Port_Value1_N077;
float Port_Position2_N077;
float4 Port_Value2_N077;
float Port_Position3_N077;
float4 Port_Value3_N077;
float4 Port_Value4_N077;
float Port_Amount_N080;
float4 Port_Input1_N002;
float Port_Input2_N002;
float Port_Input1_N070;
float Port_Input1_N071;
float4 Port_Value0_N068;
float Port_Position1_N068;
float4 Port_Value1_N068;
float4 Port_Value2_N068;
float Port_Input1_N072;
float3 Port_Default_N066;
float3 Port_Value1_N038;
float3 Port_Default_N038;
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
sc_Vertex_t l9_3=param;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_4=l9_3;
float3 l9_5=in.blendShape0Pos;
float3 l9_6=in.blendShape0Normal;
float l9_7=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_8=l9_4;
float3 l9_9=l9_5;
float l9_10=l9_7;
float3 l9_11=l9_8.position.xyz+(l9_9*l9_10);
l9_8.position=float4(l9_11.x,l9_11.y,l9_11.z,l9_8.position.w);
l9_4=l9_8;
l9_4.normal+=(l9_6*l9_7);
l9_3=l9_4;
sc_Vertex_t l9_12=l9_3;
float3 l9_13=in.blendShape1Pos;
float3 l9_14=in.blendShape1Normal;
float l9_15=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_16=l9_12;
float3 l9_17=l9_13;
float l9_18=l9_15;
float3 l9_19=l9_16.position.xyz+(l9_17*l9_18);
l9_16.position=float4(l9_19.x,l9_19.y,l9_19.z,l9_16.position.w);
l9_12=l9_16;
l9_12.normal+=(l9_14*l9_15);
l9_3=l9_12;
sc_Vertex_t l9_20=l9_3;
float3 l9_21=in.blendShape2Pos;
float3 l9_22=in.blendShape2Normal;
float l9_23=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_24=l9_20;
float3 l9_25=l9_21;
float l9_26=l9_23;
float3 l9_27=l9_24.position.xyz+(l9_25*l9_26);
l9_24.position=float4(l9_27.x,l9_27.y,l9_27.z,l9_24.position.w);
l9_20=l9_24;
l9_20.normal+=(l9_22*l9_23);
l9_3=l9_20;
}
else
{
sc_Vertex_t l9_28=l9_3;
float3 l9_29=in.blendShape0Pos;
float l9_30=(*sc_set0.UserUniforms).weights0.x;
float3 l9_31=l9_28.position.xyz+(l9_29*l9_30);
l9_28.position=float4(l9_31.x,l9_31.y,l9_31.z,l9_28.position.w);
l9_3=l9_28;
sc_Vertex_t l9_32=l9_3;
float3 l9_33=in.blendShape1Pos;
float l9_34=(*sc_set0.UserUniforms).weights0.y;
float3 l9_35=l9_32.position.xyz+(l9_33*l9_34);
l9_32.position=float4(l9_35.x,l9_35.y,l9_35.z,l9_32.position.w);
l9_3=l9_32;
sc_Vertex_t l9_36=l9_3;
float3 l9_37=in.blendShape2Pos;
float l9_38=(*sc_set0.UserUniforms).weights0.z;
float3 l9_39=l9_36.position.xyz+(l9_37*l9_38);
l9_36.position=float4(l9_39.x,l9_39.y,l9_39.z,l9_36.position.w);
l9_3=l9_36;
sc_Vertex_t l9_40=l9_3;
float3 l9_41=in.blendShape3Pos;
float l9_42=(*sc_set0.UserUniforms).weights0.w;
float3 l9_43=l9_40.position.xyz+(l9_41*l9_42);
l9_40.position=float4(l9_43.x,l9_43.y,l9_43.z,l9_40.position.w);
l9_3=l9_40;
sc_Vertex_t l9_44=l9_3;
float3 l9_45=in.blendShape4Pos;
float l9_46=(*sc_set0.UserUniforms).weights1.x;
float3 l9_47=l9_44.position.xyz+(l9_45*l9_46);
l9_44.position=float4(l9_47.x,l9_47.y,l9_47.z,l9_44.position.w);
l9_3=l9_44;
sc_Vertex_t l9_48=l9_3;
float3 l9_49=in.blendShape5Pos;
float l9_50=(*sc_set0.UserUniforms).weights1.y;
float3 l9_51=l9_48.position.xyz+(l9_49*l9_50);
l9_48.position=float4(l9_51.x,l9_51.y,l9_51.z,l9_48.position.w);
l9_3=l9_48;
}
}
param=l9_3;
sc_Vertex_t l9_52=param;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_53=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_53=float4(1.0,fract(in.boneData.yzw));
l9_53.x-=dot(l9_53.yzw,float3(1.0));
}
float4 l9_54=l9_53;
float4 l9_55=l9_54;
int l9_56=int(in.boneData.x);
int l9_57=int(in.boneData.y);
int l9_58=int(in.boneData.z);
int l9_59=int(in.boneData.w);
int l9_60=l9_56;
float4 l9_61=l9_52.position;
float3 l9_62=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_63=l9_60;
float4 l9_64=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[0];
float4 l9_65=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[1];
float4 l9_66=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[2];
float4 l9_67[3];
l9_67[0]=l9_64;
l9_67[1]=l9_65;
l9_67[2]=l9_66;
l9_62=float3(dot(l9_61,l9_67[0]),dot(l9_61,l9_67[1]),dot(l9_61,l9_67[2]));
}
else
{
l9_62=l9_61.xyz;
}
float3 l9_68=l9_62;
float3 l9_69=l9_68;
float l9_70=l9_55.x;
int l9_71=l9_57;
float4 l9_72=l9_52.position;
float3 l9_73=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_74=l9_71;
float4 l9_75=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[0];
float4 l9_76=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[1];
float4 l9_77=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[2];
float4 l9_78[3];
l9_78[0]=l9_75;
l9_78[1]=l9_76;
l9_78[2]=l9_77;
l9_73=float3(dot(l9_72,l9_78[0]),dot(l9_72,l9_78[1]),dot(l9_72,l9_78[2]));
}
else
{
l9_73=l9_72.xyz;
}
float3 l9_79=l9_73;
float3 l9_80=l9_79;
float l9_81=l9_55.y;
int l9_82=l9_58;
float4 l9_83=l9_52.position;
float3 l9_84=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_85=l9_82;
float4 l9_86=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[0];
float4 l9_87=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[1];
float4 l9_88=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[2];
float4 l9_89[3];
l9_89[0]=l9_86;
l9_89[1]=l9_87;
l9_89[2]=l9_88;
l9_84=float3(dot(l9_83,l9_89[0]),dot(l9_83,l9_89[1]),dot(l9_83,l9_89[2]));
}
else
{
l9_84=l9_83.xyz;
}
float3 l9_90=l9_84;
float3 l9_91=l9_90;
float l9_92=l9_55.z;
int l9_93=l9_59;
float4 l9_94=l9_52.position;
float3 l9_95=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_96=l9_93;
float4 l9_97=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[0];
float4 l9_98=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[1];
float4 l9_99=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[2];
float4 l9_100[3];
l9_100[0]=l9_97;
l9_100[1]=l9_98;
l9_100[2]=l9_99;
l9_95=float3(dot(l9_94,l9_100[0]),dot(l9_94,l9_100[1]),dot(l9_94,l9_100[2]));
}
else
{
l9_95=l9_94.xyz;
}
float3 l9_101=l9_95;
float3 l9_102=(((l9_69*l9_70)+(l9_80*l9_81))+(l9_91*l9_92))+(l9_101*l9_55.w);
l9_52.position=float4(l9_102.x,l9_102.y,l9_102.z,l9_52.position.w);
int l9_103=l9_56;
float3x3 l9_104=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[2].xyz));
float3x3 l9_105=l9_104;
float3x3 l9_106=l9_105;
int l9_107=l9_57;
float3x3 l9_108=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[2].xyz));
float3x3 l9_109=l9_108;
float3x3 l9_110=l9_109;
int l9_111=l9_58;
float3x3 l9_112=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[2].xyz));
float3x3 l9_113=l9_112;
float3x3 l9_114=l9_113;
int l9_115=l9_59;
float3x3 l9_116=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[2].xyz));
float3x3 l9_117=l9_116;
float3x3 l9_118=l9_117;
l9_52.normal=((((l9_106*l9_52.normal)*l9_55.x)+((l9_110*l9_52.normal)*l9_55.y))+((l9_114*l9_52.normal)*l9_55.z))+((l9_118*l9_52.normal)*l9_55.w);
l9_52.tangent=((((l9_106*l9_52.tangent)*l9_55.x)+((l9_110*l9_52.tangent)*l9_55.y))+((l9_114*l9_52.tangent)*l9_55.z))+((l9_118*l9_52.tangent)*l9_55.w);
}
param=l9_52;
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
float3 l9_119=((*sc_set0.UserUniforms).sc_ModelMatrix*param.position).xyz;
out.varPosAndMotion=float4(l9_119.x,l9_119.y,l9_119.z,out.varPosAndMotion.w);
float3 l9_120=(*sc_set0.UserUniforms).sc_NormalMatrix*param.normal;
out.varNormalAndMotion=float4(l9_120.x,l9_120.y,l9_120.z,out.varNormalAndMotion.w);
float3 l9_121=(*sc_set0.UserUniforms).sc_NormalMatrix*param.tangent;
out.varTangent=float4(l9_121.x,l9_121.y,l9_121.z,out.varTangent.w);
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
float3 WorldPosition=out.varPosAndMotion.xyz;
float3 WorldNormal=out.varNormalAndMotion.xyz;
float3 WorldTangent=out.varTangent.xyz;
float3 Position_N23=float3(0.0);
Position_N23=Globals.SurfacePosition_ObjectSpace;
float Output_N27=0.0;
Output_N27=Position_N23.x;
float4 Result_N25=float4(0.0);
float param_1=0.0;
float4 param_2=float4(0.0);
float4 param_3=(*sc_set0.UserUniforms).Port_Value1_N025;
float4 param_4=(*sc_set0.UserUniforms).Port_Default_N025;
ssGlobals param_6=Globals;
float3 l9_122=float3(0.0);
l9_122=param_6.SurfacePosition_ObjectSpace;
float l9_123=0.0;
l9_123=l9_122.y;
float l9_124=0.0;
l9_124=float(l9_123<(*sc_set0.UserUniforms).Port_Input1_N021);
param_1=l9_124;
param_1=floor(param_1);
float4 param_5;
if (param_1==0.0)
{
float3 l9_125=float3(0.0);
l9_125=param_6.SurfacePosition_ObjectSpace;
float l9_126=0.0;
l9_126=l9_125.y;
param_2=float4(l9_126);
param_5=param_2;
}
else
{
if (param_1==1.0)
{
param_5=param_3;
}
else
{
param_5=param_4;
}
}
Result_N25=param_5;
float Output_N32=0.0;
Output_N32=Position_N23.z;
float3 Value_N26=float3(0.0);
Value_N26.x=Output_N27;
Value_N26.y=Result_N25.x;
Value_N26.z=Output_N32;
float3 VectorOut_N34=float3(0.0);
VectorOut_N34=((*sc_set0.UserUniforms).sc_ModelMatrix*float4(Value_N26,1.0)).xyz;
WorldPosition=VectorOut_N34;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPosAndMotion.xyz;
WorldNormal=out.varNormalAndMotion.xyz;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_7=v;
float3 param_8=WorldPosition;
float3 param_9=WorldNormal;
float3 param_10=WorldTangent;
float4 param_11=v.position;
out.varPosAndMotion=float4(param_8.x,param_8.y,param_8.z,out.varPosAndMotion.w);
float3 l9_127=normalize(param_9);
out.varNormalAndMotion=float4(l9_127.x,l9_127.y,l9_127.z,out.varNormalAndMotion.w);
float3 l9_128=normalize(param_10);
out.varTangent=float4(l9_128.x,l9_128.y,l9_128.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_129=param_7.position;
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
l9_138=param_11;
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
l9_138=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_140]*param_7.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
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
out.varTex01=float4(param_7.texture0,param_7.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_145=param_7.position;
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
sc_Vertex_t l9_163=param_7;
sc_Vertex_t l9_164=l9_163;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_165=l9_164;
float3 l9_166=in.blendShape0Pos;
float3 l9_167=in.blendShape0Normal;
float l9_168=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_169=l9_165;
float3 l9_170=l9_166;
float l9_171=l9_168;
float3 l9_172=l9_169.position.xyz+(l9_170*l9_171);
l9_169.position=float4(l9_172.x,l9_172.y,l9_172.z,l9_169.position.w);
l9_165=l9_169;
l9_165.normal+=(l9_167*l9_168);
l9_164=l9_165;
sc_Vertex_t l9_173=l9_164;
float3 l9_174=in.blendShape1Pos;
float3 l9_175=in.blendShape1Normal;
float l9_176=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_177=l9_173;
float3 l9_178=l9_174;
float l9_179=l9_176;
float3 l9_180=l9_177.position.xyz+(l9_178*l9_179);
l9_177.position=float4(l9_180.x,l9_180.y,l9_180.z,l9_177.position.w);
l9_173=l9_177;
l9_173.normal+=(l9_175*l9_176);
l9_164=l9_173;
sc_Vertex_t l9_181=l9_164;
float3 l9_182=in.blendShape2Pos;
float3 l9_183=in.blendShape2Normal;
float l9_184=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_185=l9_181;
float3 l9_186=l9_182;
float l9_187=l9_184;
float3 l9_188=l9_185.position.xyz+(l9_186*l9_187);
l9_185.position=float4(l9_188.x,l9_188.y,l9_188.z,l9_185.position.w);
l9_181=l9_185;
l9_181.normal+=(l9_183*l9_184);
l9_164=l9_181;
}
else
{
sc_Vertex_t l9_189=l9_164;
float3 l9_190=in.blendShape0Pos;
float l9_191=(*sc_set0.UserUniforms).weights0.x;
float3 l9_192=l9_189.position.xyz+(l9_190*l9_191);
l9_189.position=float4(l9_192.x,l9_192.y,l9_192.z,l9_189.position.w);
l9_164=l9_189;
sc_Vertex_t l9_193=l9_164;
float3 l9_194=in.blendShape1Pos;
float l9_195=(*sc_set0.UserUniforms).weights0.y;
float3 l9_196=l9_193.position.xyz+(l9_194*l9_195);
l9_193.position=float4(l9_196.x,l9_196.y,l9_196.z,l9_193.position.w);
l9_164=l9_193;
sc_Vertex_t l9_197=l9_164;
float3 l9_198=in.blendShape2Pos;
float l9_199=(*sc_set0.UserUniforms).weights0.z;
float3 l9_200=l9_197.position.xyz+(l9_198*l9_199);
l9_197.position=float4(l9_200.x,l9_200.y,l9_200.z,l9_197.position.w);
l9_164=l9_197;
sc_Vertex_t l9_201=l9_164;
float3 l9_202=in.blendShape3Pos;
float l9_203=(*sc_set0.UserUniforms).weights0.w;
float3 l9_204=l9_201.position.xyz+(l9_202*l9_203);
l9_201.position=float4(l9_204.x,l9_204.y,l9_204.z,l9_201.position.w);
l9_164=l9_201;
sc_Vertex_t l9_205=l9_164;
float3 l9_206=in.blendShape4Pos;
float l9_207=(*sc_set0.UserUniforms).weights1.x;
float3 l9_208=l9_205.position.xyz+(l9_206*l9_207);
l9_205.position=float4(l9_208.x,l9_208.y,l9_208.z,l9_205.position.w);
l9_164=l9_205;
sc_Vertex_t l9_209=l9_164;
float3 l9_210=in.blendShape5Pos;
float l9_211=(*sc_set0.UserUniforms).weights1.y;
float3 l9_212=l9_209.position.xyz+(l9_210*l9_211);
l9_209.position=float4(l9_212.x,l9_212.y,l9_212.z,l9_209.position.w);
l9_164=l9_209;
}
}
l9_163=l9_164;
sc_Vertex_t l9_213=l9_163;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_214=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_214=float4(1.0,fract(in.boneData.yzw));
l9_214.x-=dot(l9_214.yzw,float3(1.0));
}
float4 l9_215=l9_214;
float4 l9_216=l9_215;
int l9_217=int(in.boneData.x);
int l9_218=int(in.boneData.y);
int l9_219=int(in.boneData.z);
int l9_220=int(in.boneData.w);
int l9_221=l9_217;
float4 l9_222=l9_213.position;
float3 l9_223=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_224=l9_221;
float4 l9_225=(*sc_set0.sc_BonesUBO).sc_Bones[l9_224].boneMatrix[0];
float4 l9_226=(*sc_set0.sc_BonesUBO).sc_Bones[l9_224].boneMatrix[1];
float4 l9_227=(*sc_set0.sc_BonesUBO).sc_Bones[l9_224].boneMatrix[2];
float4 l9_228[3];
l9_228[0]=l9_225;
l9_228[1]=l9_226;
l9_228[2]=l9_227;
l9_223=float3(dot(l9_222,l9_228[0]),dot(l9_222,l9_228[1]),dot(l9_222,l9_228[2]));
}
else
{
l9_223=l9_222.xyz;
}
float3 l9_229=l9_223;
float3 l9_230=l9_229;
float l9_231=l9_216.x;
int l9_232=l9_218;
float4 l9_233=l9_213.position;
float3 l9_234=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_235=l9_232;
float4 l9_236=(*sc_set0.sc_BonesUBO).sc_Bones[l9_235].boneMatrix[0];
float4 l9_237=(*sc_set0.sc_BonesUBO).sc_Bones[l9_235].boneMatrix[1];
float4 l9_238=(*sc_set0.sc_BonesUBO).sc_Bones[l9_235].boneMatrix[2];
float4 l9_239[3];
l9_239[0]=l9_236;
l9_239[1]=l9_237;
l9_239[2]=l9_238;
l9_234=float3(dot(l9_233,l9_239[0]),dot(l9_233,l9_239[1]),dot(l9_233,l9_239[2]));
}
else
{
l9_234=l9_233.xyz;
}
float3 l9_240=l9_234;
float3 l9_241=l9_240;
float l9_242=l9_216.y;
int l9_243=l9_219;
float4 l9_244=l9_213.position;
float3 l9_245=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_246=l9_243;
float4 l9_247=(*sc_set0.sc_BonesUBO).sc_Bones[l9_246].boneMatrix[0];
float4 l9_248=(*sc_set0.sc_BonesUBO).sc_Bones[l9_246].boneMatrix[1];
float4 l9_249=(*sc_set0.sc_BonesUBO).sc_Bones[l9_246].boneMatrix[2];
float4 l9_250[3];
l9_250[0]=l9_247;
l9_250[1]=l9_248;
l9_250[2]=l9_249;
l9_245=float3(dot(l9_244,l9_250[0]),dot(l9_244,l9_250[1]),dot(l9_244,l9_250[2]));
}
else
{
l9_245=l9_244.xyz;
}
float3 l9_251=l9_245;
float3 l9_252=l9_251;
float l9_253=l9_216.z;
int l9_254=l9_220;
float4 l9_255=l9_213.position;
float3 l9_256=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_257=l9_254;
float4 l9_258=(*sc_set0.sc_BonesUBO).sc_Bones[l9_257].boneMatrix[0];
float4 l9_259=(*sc_set0.sc_BonesUBO).sc_Bones[l9_257].boneMatrix[1];
float4 l9_260=(*sc_set0.sc_BonesUBO).sc_Bones[l9_257].boneMatrix[2];
float4 l9_261[3];
l9_261[0]=l9_258;
l9_261[1]=l9_259;
l9_261[2]=l9_260;
l9_256=float3(dot(l9_255,l9_261[0]),dot(l9_255,l9_261[1]),dot(l9_255,l9_261[2]));
}
else
{
l9_256=l9_255.xyz;
}
float3 l9_262=l9_256;
float3 l9_263=(((l9_230*l9_231)+(l9_241*l9_242))+(l9_252*l9_253))+(l9_262*l9_216.w);
l9_213.position=float4(l9_263.x,l9_263.y,l9_263.z,l9_213.position.w);
int l9_264=l9_217;
float3x3 l9_265=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_264].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_264].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_264].normalMatrix[2].xyz));
float3x3 l9_266=l9_265;
float3x3 l9_267=l9_266;
int l9_268=l9_218;
float3x3 l9_269=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_268].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_268].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_268].normalMatrix[2].xyz));
float3x3 l9_270=l9_269;
float3x3 l9_271=l9_270;
int l9_272=l9_219;
float3x3 l9_273=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_272].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_272].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_272].normalMatrix[2].xyz));
float3x3 l9_274=l9_273;
float3x3 l9_275=l9_274;
int l9_276=l9_220;
float3x3 l9_277=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_276].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_276].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_276].normalMatrix[2].xyz));
float3x3 l9_278=l9_277;
float3x3 l9_279=l9_278;
l9_213.normal=((((l9_267*l9_213.normal)*l9_216.x)+((l9_271*l9_213.normal)*l9_216.y))+((l9_275*l9_213.normal)*l9_216.z))+((l9_279*l9_213.normal)*l9_216.w);
l9_213.tangent=((((l9_267*l9_213.tangent)*l9_216.x)+((l9_271*l9_213.tangent)*l9_216.y))+((l9_275*l9_213.tangent)*l9_216.z))+((l9_279*l9_213.tangent)*l9_216.w);
}
l9_163=l9_213;
float l9_280=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_281=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_282=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_283=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_284=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_285=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_286=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_287=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_288=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_289=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_290=l9_280/l9_281;
int l9_291=gl_InstanceIndex;
int l9_292=l9_291;
l9_163.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_163.position;
float3 l9_293=l9_163.position.xyz;
float3 l9_294=float3(float(l9_292%int(l9_282))*l9_280,float(l9_292/int(l9_282))*l9_280,(float(l9_292)*l9_290)+l9_287);
float3 l9_295=l9_293+l9_294;
float4 l9_296=float4(l9_295-l9_289,1.0);
float l9_297=l9_283;
float l9_298=l9_284;
float l9_299=l9_285;
float l9_300=l9_286;
float l9_301=l9_287;
float l9_302=l9_288;
float4x4 l9_303=float4x4(float4(2.0/(l9_298-l9_297),0.0,0.0,(-(l9_298+l9_297))/(l9_298-l9_297)),float4(0.0,2.0/(l9_300-l9_299),0.0,(-(l9_300+l9_299))/(l9_300-l9_299)),float4(0.0,0.0,(-2.0)/(l9_302-l9_301),(-(l9_302+l9_301))/(l9_302-l9_301)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_304=l9_303;
float4 l9_305=l9_304*l9_296;
l9_305.w=1.0;
out.varScreenPos=l9_305;
float4 l9_306=l9_305*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_306.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_307=l9_306;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_308=dot(l9_307,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_309=l9_308;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_309;
}
}
float4 l9_310=float4(l9_306.x,-l9_306.y,(l9_306.z*0.5)+(l9_306.w*0.5),l9_306.w);
out.gl_Position=l9_310;
param_7=l9_163;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_311=param_7;
sc_Vertex_t l9_312=l9_311;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_313=l9_312;
float3 l9_314=in.blendShape0Pos;
float3 l9_315=in.blendShape0Normal;
float l9_316=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_317=l9_313;
float3 l9_318=l9_314;
float l9_319=l9_316;
float3 l9_320=l9_317.position.xyz+(l9_318*l9_319);
l9_317.position=float4(l9_320.x,l9_320.y,l9_320.z,l9_317.position.w);
l9_313=l9_317;
l9_313.normal+=(l9_315*l9_316);
l9_312=l9_313;
sc_Vertex_t l9_321=l9_312;
float3 l9_322=in.blendShape1Pos;
float3 l9_323=in.blendShape1Normal;
float l9_324=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_325=l9_321;
float3 l9_326=l9_322;
float l9_327=l9_324;
float3 l9_328=l9_325.position.xyz+(l9_326*l9_327);
l9_325.position=float4(l9_328.x,l9_328.y,l9_328.z,l9_325.position.w);
l9_321=l9_325;
l9_321.normal+=(l9_323*l9_324);
l9_312=l9_321;
sc_Vertex_t l9_329=l9_312;
float3 l9_330=in.blendShape2Pos;
float3 l9_331=in.blendShape2Normal;
float l9_332=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_333=l9_329;
float3 l9_334=l9_330;
float l9_335=l9_332;
float3 l9_336=l9_333.position.xyz+(l9_334*l9_335);
l9_333.position=float4(l9_336.x,l9_336.y,l9_336.z,l9_333.position.w);
l9_329=l9_333;
l9_329.normal+=(l9_331*l9_332);
l9_312=l9_329;
}
else
{
sc_Vertex_t l9_337=l9_312;
float3 l9_338=in.blendShape0Pos;
float l9_339=(*sc_set0.UserUniforms).weights0.x;
float3 l9_340=l9_337.position.xyz+(l9_338*l9_339);
l9_337.position=float4(l9_340.x,l9_340.y,l9_340.z,l9_337.position.w);
l9_312=l9_337;
sc_Vertex_t l9_341=l9_312;
float3 l9_342=in.blendShape1Pos;
float l9_343=(*sc_set0.UserUniforms).weights0.y;
float3 l9_344=l9_341.position.xyz+(l9_342*l9_343);
l9_341.position=float4(l9_344.x,l9_344.y,l9_344.z,l9_341.position.w);
l9_312=l9_341;
sc_Vertex_t l9_345=l9_312;
float3 l9_346=in.blendShape2Pos;
float l9_347=(*sc_set0.UserUniforms).weights0.z;
float3 l9_348=l9_345.position.xyz+(l9_346*l9_347);
l9_345.position=float4(l9_348.x,l9_348.y,l9_348.z,l9_345.position.w);
l9_312=l9_345;
sc_Vertex_t l9_349=l9_312;
float3 l9_350=in.blendShape3Pos;
float l9_351=(*sc_set0.UserUniforms).weights0.w;
float3 l9_352=l9_349.position.xyz+(l9_350*l9_351);
l9_349.position=float4(l9_352.x,l9_352.y,l9_352.z,l9_349.position.w);
l9_312=l9_349;
sc_Vertex_t l9_353=l9_312;
float3 l9_354=in.blendShape4Pos;
float l9_355=(*sc_set0.UserUniforms).weights1.x;
float3 l9_356=l9_353.position.xyz+(l9_354*l9_355);
l9_353.position=float4(l9_356.x,l9_356.y,l9_356.z,l9_353.position.w);
l9_312=l9_353;
sc_Vertex_t l9_357=l9_312;
float3 l9_358=in.blendShape5Pos;
float l9_359=(*sc_set0.UserUniforms).weights1.y;
float3 l9_360=l9_357.position.xyz+(l9_358*l9_359);
l9_357.position=float4(l9_360.x,l9_360.y,l9_360.z,l9_357.position.w);
l9_312=l9_357;
}
}
l9_311=l9_312;
sc_Vertex_t l9_361=l9_311;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_362=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_362=float4(1.0,fract(in.boneData.yzw));
l9_362.x-=dot(l9_362.yzw,float3(1.0));
}
float4 l9_363=l9_362;
float4 l9_364=l9_363;
int l9_365=int(in.boneData.x);
int l9_366=int(in.boneData.y);
int l9_367=int(in.boneData.z);
int l9_368=int(in.boneData.w);
int l9_369=l9_365;
float4 l9_370=l9_361.position;
float3 l9_371=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_372=l9_369;
float4 l9_373=(*sc_set0.sc_BonesUBO).sc_Bones[l9_372].boneMatrix[0];
float4 l9_374=(*sc_set0.sc_BonesUBO).sc_Bones[l9_372].boneMatrix[1];
float4 l9_375=(*sc_set0.sc_BonesUBO).sc_Bones[l9_372].boneMatrix[2];
float4 l9_376[3];
l9_376[0]=l9_373;
l9_376[1]=l9_374;
l9_376[2]=l9_375;
l9_371=float3(dot(l9_370,l9_376[0]),dot(l9_370,l9_376[1]),dot(l9_370,l9_376[2]));
}
else
{
l9_371=l9_370.xyz;
}
float3 l9_377=l9_371;
float3 l9_378=l9_377;
float l9_379=l9_364.x;
int l9_380=l9_366;
float4 l9_381=l9_361.position;
float3 l9_382=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_383=l9_380;
float4 l9_384=(*sc_set0.sc_BonesUBO).sc_Bones[l9_383].boneMatrix[0];
float4 l9_385=(*sc_set0.sc_BonesUBO).sc_Bones[l9_383].boneMatrix[1];
float4 l9_386=(*sc_set0.sc_BonesUBO).sc_Bones[l9_383].boneMatrix[2];
float4 l9_387[3];
l9_387[0]=l9_384;
l9_387[1]=l9_385;
l9_387[2]=l9_386;
l9_382=float3(dot(l9_381,l9_387[0]),dot(l9_381,l9_387[1]),dot(l9_381,l9_387[2]));
}
else
{
l9_382=l9_381.xyz;
}
float3 l9_388=l9_382;
float3 l9_389=l9_388;
float l9_390=l9_364.y;
int l9_391=l9_367;
float4 l9_392=l9_361.position;
float3 l9_393=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_394=l9_391;
float4 l9_395=(*sc_set0.sc_BonesUBO).sc_Bones[l9_394].boneMatrix[0];
float4 l9_396=(*sc_set0.sc_BonesUBO).sc_Bones[l9_394].boneMatrix[1];
float4 l9_397=(*sc_set0.sc_BonesUBO).sc_Bones[l9_394].boneMatrix[2];
float4 l9_398[3];
l9_398[0]=l9_395;
l9_398[1]=l9_396;
l9_398[2]=l9_397;
l9_393=float3(dot(l9_392,l9_398[0]),dot(l9_392,l9_398[1]),dot(l9_392,l9_398[2]));
}
else
{
l9_393=l9_392.xyz;
}
float3 l9_399=l9_393;
float3 l9_400=l9_399;
float l9_401=l9_364.z;
int l9_402=l9_368;
float4 l9_403=l9_361.position;
float3 l9_404=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_405=l9_402;
float4 l9_406=(*sc_set0.sc_BonesUBO).sc_Bones[l9_405].boneMatrix[0];
float4 l9_407=(*sc_set0.sc_BonesUBO).sc_Bones[l9_405].boneMatrix[1];
float4 l9_408=(*sc_set0.sc_BonesUBO).sc_Bones[l9_405].boneMatrix[2];
float4 l9_409[3];
l9_409[0]=l9_406;
l9_409[1]=l9_407;
l9_409[2]=l9_408;
l9_404=float3(dot(l9_403,l9_409[0]),dot(l9_403,l9_409[1]),dot(l9_403,l9_409[2]));
}
else
{
l9_404=l9_403.xyz;
}
float3 l9_410=l9_404;
float3 l9_411=(((l9_378*l9_379)+(l9_389*l9_390))+(l9_400*l9_401))+(l9_410*l9_364.w);
l9_361.position=float4(l9_411.x,l9_411.y,l9_411.z,l9_361.position.w);
int l9_412=l9_365;
float3x3 l9_413=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_412].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_412].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_412].normalMatrix[2].xyz));
float3x3 l9_414=l9_413;
float3x3 l9_415=l9_414;
int l9_416=l9_366;
float3x3 l9_417=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_416].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_416].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_416].normalMatrix[2].xyz));
float3x3 l9_418=l9_417;
float3x3 l9_419=l9_418;
int l9_420=l9_367;
float3x3 l9_421=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_420].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_420].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_420].normalMatrix[2].xyz));
float3x3 l9_422=l9_421;
float3x3 l9_423=l9_422;
int l9_424=l9_368;
float3x3 l9_425=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_424].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_424].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_424].normalMatrix[2].xyz));
float3x3 l9_426=l9_425;
float3x3 l9_427=l9_426;
l9_361.normal=((((l9_415*l9_361.normal)*l9_364.x)+((l9_419*l9_361.normal)*l9_364.y))+((l9_423*l9_361.normal)*l9_364.z))+((l9_427*l9_361.normal)*l9_364.w);
l9_361.tangent=((((l9_415*l9_361.tangent)*l9_364.x)+((l9_419*l9_361.tangent)*l9_364.y))+((l9_423*l9_361.tangent)*l9_364.z))+((l9_427*l9_361.tangent)*l9_364.w);
}
l9_311=l9_361;
float3 l9_428=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_429=((l9_311.position.xy/float2(l9_311.position.w))*0.5)+float2(0.5);
out.varTex01=float4(l9_429.x,l9_429.y,out.varTex01.z,out.varTex01.w);
l9_311.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_311.position;
float3 l9_430=l9_311.position.xyz-l9_428;
l9_311.position=float4(l9_430.x,l9_430.y,l9_430.z,l9_311.position.w);
out.varPosAndMotion=float4(l9_311.position.xyz.x,l9_311.position.xyz.y,l9_311.position.xyz.z,out.varPosAndMotion.w);
float3 l9_431=normalize(l9_311.normal);
out.varNormalAndMotion=float4(l9_431.x,l9_431.y,l9_431.z,out.varNormalAndMotion.w);
float l9_432=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_433=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_434=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_435=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_436=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_437=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_438=l9_432;
float l9_439=l9_433;
float l9_440=l9_434;
float l9_441=l9_435;
float l9_442=l9_436;
float l9_443=l9_437;
float4x4 l9_444=float4x4(float4(2.0/(l9_439-l9_438),0.0,0.0,(-(l9_439+l9_438))/(l9_439-l9_438)),float4(0.0,2.0/(l9_441-l9_440),0.0,(-(l9_441+l9_440))/(l9_441-l9_440)),float4(0.0,0.0,(-2.0)/(l9_443-l9_442),(-(l9_443+l9_442))/(l9_443-l9_442)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_445=l9_444;
float4 l9_446=float4(0.0);
float3 l9_447=(l9_445*l9_311.position).xyz;
l9_446=float4(l9_447.x,l9_447.y,l9_447.z,l9_446.w);
l9_446.w=1.0;
out.varScreenPos=l9_446;
float4 l9_448=l9_446*1.0;
float4 l9_449=l9_448;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_449.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_450=l9_449;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_451=dot(l9_450,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_452=l9_451;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_452;
}
}
float4 l9_453=float4(l9_449.x,-l9_449.y,(l9_449.z*0.5)+(l9_449.w*0.5),l9_449.w);
out.gl_Position=l9_453;
param_7=l9_311;
}
}
v=param_7;
float3 param_12=out.varPosAndMotion.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float4 l9_454=((*sc_set0.UserUniforms).sc_PrevFrameModelMatrix*(*sc_set0.UserUniforms).sc_ModelMatrixInverse)*float4(param_12,1.0);
float3 l9_455=param_12;
float3 l9_456=l9_454.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
int l9_457=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_457=0;
}
else
{
l9_457=gl_InstanceIndex%2;
}
int l9_458=l9_457;
float4 l9_459=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_458]*float4(l9_455,1.0);
float2 l9_460=l9_459.xy/float2(l9_459.w);
l9_459=float4(l9_460.x,l9_460.y,l9_459.z,l9_459.w);
int l9_461=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_461=0;
}
else
{
l9_461=gl_InstanceIndex%2;
}
int l9_462=l9_461;
float4 l9_463=(*sc_set0.UserUniforms).sc_PrevFrameViewProjectionMatrixArray[l9_462]*float4(l9_456,1.0);
float2 l9_464=l9_463.xy/float2(l9_463.w);
l9_463=float4(l9_464.x,l9_464.y,l9_463.z,l9_463.w);
float2 l9_465=(l9_459.xy-l9_463.xy)*0.5;
out.varPosAndMotion.w=l9_465.x;
out.varNormalAndMotion.w=l9_465.y;
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
float3 SurfacePosition_ObjectSpace;
float3 VertexTangent_WorldSpace;
float3 VertexNormal_WorldSpace;
float3 VertexBinormal_WorldSpace;
float3 ViewDirWS;
float3 SurfacePosition_WorldSpace;
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
float height_gradient;
float distance_gradient;
float alpha;
float Port_Input1_N021;
float4 Port_Value1_N025;
float4 Port_Default_N025;
float Port_Input1_N040;
float Port_Input1_N043;
float3 Port_Normal_N014;
float Port_Exponent_N014;
float Port_Intensity_N014;
float Port_Input1_N017;
float Port_Input1_N097;
float Port_RangeMinA_N103;
float Port_RangeMaxA_N103;
float Port_RangeMinB_N103;
float Port_RangeMaxB_N103;
float Port_Input1_N069;
float Port_Input2_N069;
float Port_Value1_N076;
float Port_Value3_N076;
float4 Port_Value0_N077;
float Port_Position1_N077;
float4 Port_Value1_N077;
float Port_Position2_N077;
float4 Port_Value2_N077;
float Port_Position3_N077;
float4 Port_Value3_N077;
float4 Port_Value4_N077;
float Port_Amount_N080;
float4 Port_Input1_N002;
float Port_Input2_N002;
float Port_Input1_N070;
float Port_Input1_N071;
float4 Port_Value0_N068;
float Port_Position1_N068;
float4 Port_Value1_N068;
float4 Port_Value2_N068;
float Port_Input1_N072;
float3 Port_Default_N066;
float3 Port_Value1_N038;
float3 Port_Default_N038;
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
Globals.SurfacePosition_ObjectSpace=((*sc_set0.UserUniforms).sc_ModelMatrixInverse*float4(in.varPosAndMotion.xyz,1.0)).xyz;
Globals.VertexTangent_WorldSpace=normalize(in.varTangent.xyz);
Globals.VertexNormal_WorldSpace=normalize(in.varNormalAndMotion.xyz);
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace)*in.varTangent.w;
Globals.SurfacePosition_WorldSpace=in.varPosAndMotion.xyz;
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-Globals.SurfacePosition_WorldSpace);
float3 Result_N38=float3(0.0);
float param=0.0;
float3 param_1=float3(0.0);
float3 param_2=(*sc_set0.UserUniforms).Port_Value1_N038;
float3 param_3=(*sc_set0.UserUniforms).Port_Default_N038;
ssGlobals param_5=Globals;
float3 l9_0=float3(0.0);
l9_0=param_5.SurfacePosition_ObjectSpace;
float l9_1=0.0;
l9_1=l9_0.y;
float l9_2=0.0;
l9_2=float(l9_1<(*sc_set0.UserUniforms).Port_Input1_N040);
param=l9_2;
param=floor(param);
float3 param_4;
if (param==0.0)
{
float3 l9_3=float3(0.0);
float l9_4=0.0;
float3 l9_5=float3(0.0);
float3 l9_6=float3(0.0);
float3 l9_7=(*sc_set0.UserUniforms).Port_Default_N066;
ssGlobals l9_8=param_5;
float3 l9_9=float3(0.0);
l9_9=l9_8.SurfacePosition_ObjectSpace;
float l9_10=0.0;
l9_10=l9_9.y;
float l9_11=0.0;
l9_11=float(l9_10<(*sc_set0.UserUniforms).Port_Input1_N043);
l9_4=l9_11;
l9_4=floor(l9_4);
float3 l9_12;
if (l9_4==0.0)
{
float l9_13=0.0;
float3 l9_14=(*sc_set0.UserUniforms).Port_Normal_N014;
float l9_15=(*sc_set0.UserUniforms).Port_Exponent_N014;
float l9_16=(*sc_set0.UserUniforms).Port_Intensity_N014;
ssGlobals l9_17=l9_8;
l9_14=float3x3(float3(l9_17.VertexTangent_WorldSpace),float3(l9_17.VertexBinormal_WorldSpace),float3(l9_17.VertexNormal_WorldSpace))*l9_14;
float l9_18=abs(dot(-l9_17.ViewDirWS,l9_14));
float l9_19=pow(1.0-l9_18,l9_15);
l9_19=fast::max(l9_19,0.0);
l9_19*=l9_16;
l9_13=l9_19;
float3 l9_20=float3(0.0);
l9_20=l9_8.SurfacePosition_WorldSpace;
float3 l9_21=float3(0.0);
l9_21=(*sc_set0.UserUniforms).sc_Camera.position;
float l9_22=0.0;
l9_22=distance(l9_20,l9_21);
float l9_23=0.0;
l9_23=l9_22*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_24=0.0;
float l9_25=l9_23;
float l9_26=(*sc_set0.UserUniforms).Port_RangeMinA_N103;
float l9_27=(*sc_set0.UserUniforms).Port_RangeMaxA_N103;
float l9_28=(*sc_set0.UserUniforms).Port_RangeMinB_N103;
float l9_29=(*sc_set0.UserUniforms).Port_RangeMaxB_N103;
float l9_30=(((l9_25-l9_26)/((l9_27-l9_26)+1e-06))*(l9_29-l9_28))+l9_28;
float l9_31;
if (l9_29>l9_28)
{
l9_31=fast::clamp(l9_30,l9_28,l9_29);
}
else
{
l9_31=fast::clamp(l9_30,l9_29,l9_28);
}
l9_30=l9_31;
l9_24=l9_30;
float l9_32=0.0;
l9_32=(l9_13*(*sc_set0.UserUniforms).Port_Input1_N017)+l9_24;
float l9_33=0.0;
l9_33=1.0-l9_32;
float l9_34=0.0;
l9_34=fast::clamp(l9_33+0.001,(*sc_set0.UserUniforms).Port_Input1_N069+0.001,(*sc_set0.UserUniforms).Port_Input2_N069+0.001)-0.001;
float3 l9_35=float3(0.0);
l9_35=l9_8.SurfacePosition_ObjectSpace;
float l9_36=0.0;
float l9_37=(*sc_set0.UserUniforms).height_gradient;
l9_36=l9_37;
float3 l9_38=float3(0.0);
l9_38.x=(*sc_set0.UserUniforms).Port_Value1_N076;
l9_38.y=l9_36;
l9_38.z=(*sc_set0.UserUniforms).Port_Value3_N076;
float l9_39=0.0;
l9_39=distance(l9_35,l9_38);
float l9_40=0.0;
float l9_41=(*sc_set0.UserUniforms).distance_gradient;
l9_40=l9_41;
float l9_42=0.0;
l9_42=1.0-l9_40;
float l9_43=0.0;
l9_43=l9_39*l9_42;
float4 l9_44=float4(0.0);
float l9_45=l9_43;
float4 l9_46=(*sc_set0.UserUniforms).Port_Value0_N077;
float l9_47=(*sc_set0.UserUniforms).Port_Position1_N077;
float4 l9_48=(*sc_set0.UserUniforms).Port_Value1_N077;
float l9_49=(*sc_set0.UserUniforms).Port_Position2_N077;
float4 l9_50=(*sc_set0.UserUniforms).Port_Value2_N077;
float l9_51=(*sc_set0.UserUniforms).Port_Position3_N077;
float4 l9_52=(*sc_set0.UserUniforms).Port_Value3_N077;
float4 l9_53=(*sc_set0.UserUniforms).Port_Value4_N077;
l9_45=fast::clamp(l9_45,0.0,1.0);
float4 l9_54;
if (l9_45<l9_47)
{
l9_54=mix(l9_46,l9_48,float4(fast::clamp(l9_45/l9_47,0.0,1.0)));
}
else
{
if (l9_45<l9_49)
{
l9_54=mix(l9_48,l9_50,float4(fast::clamp((l9_45-l9_47)/(l9_49-l9_47),0.0,1.0)));
}
else
{
if (l9_45<l9_51)
{
l9_54=mix(l9_50,l9_52,float4(fast::clamp((l9_45-l9_49)/(l9_51-l9_49),0.0,1.0)));
}
else
{
l9_54=mix(l9_52,l9_53,float4(fast::clamp((l9_45-l9_51)/(1.0-l9_51),0.0,1.0)));
}
}
}
bool l9_55=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_56;
if (l9_55)
{
l9_56=!PreviewInfo.Saved;
}
else
{
l9_56=l9_55;
}
bool l9_57;
if (l9_56)
{
l9_57=77==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_57=l9_56;
}
if (l9_57)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_54;
PreviewInfo.Color.w=1.0;
}
l9_44=l9_54;
float4 l9_58=float4(0.0);
float4 l9_59=l9_44;
float l9_60=(*sc_set0.UserUniforms).Port_Amount_N080;
float l9_61=dot(l9_59.xyz,float3(0.29899999,0.58700001,0.114));
float4 l9_62=float4(mix(float3(l9_61),l9_59.xyz,float3(l9_60)),l9_59.w);
l9_58=l9_62;
float4 l9_63=float4(0.0);
l9_63=mix(l9_58,(*sc_set0.UserUniforms).Port_Input1_N002,float4((*sc_set0.UserUniforms).Port_Input2_N002));
float4 l9_64=float4(0.0);
l9_64=float4(l9_34)*l9_63;
l9_5=l9_64.xyz;
l9_12=l9_5;
}
else
{
if (l9_4==1.0)
{
float l9_65=0.0;
float3 l9_66=(*sc_set0.UserUniforms).Port_Normal_N014;
float l9_67=(*sc_set0.UserUniforms).Port_Exponent_N014;
float l9_68=(*sc_set0.UserUniforms).Port_Intensity_N014;
ssGlobals l9_69=l9_8;
l9_66=float3x3(float3(l9_69.VertexTangent_WorldSpace),float3(l9_69.VertexBinormal_WorldSpace),float3(l9_69.VertexNormal_WorldSpace))*l9_66;
float l9_70=abs(dot(-l9_69.ViewDirWS,l9_66));
float l9_71=pow(1.0-l9_70,l9_67);
l9_71=fast::max(l9_71,0.0);
l9_71*=l9_68;
l9_65=l9_71;
float3 l9_72=float3(0.0);
l9_72=l9_8.SurfacePosition_WorldSpace;
float3 l9_73=float3(0.0);
l9_73=(*sc_set0.UserUniforms).sc_Camera.position;
float l9_74=0.0;
l9_74=distance(l9_72,l9_73);
float l9_75=0.0;
l9_75=l9_74*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_76=0.0;
float l9_77=l9_75;
float l9_78=(*sc_set0.UserUniforms).Port_RangeMinA_N103;
float l9_79=(*sc_set0.UserUniforms).Port_RangeMaxA_N103;
float l9_80=(*sc_set0.UserUniforms).Port_RangeMinB_N103;
float l9_81=(*sc_set0.UserUniforms).Port_RangeMaxB_N103;
float l9_82=(((l9_77-l9_78)/((l9_79-l9_78)+1e-06))*(l9_81-l9_80))+l9_80;
float l9_83;
if (l9_81>l9_80)
{
l9_83=fast::clamp(l9_82,l9_80,l9_81);
}
else
{
l9_83=fast::clamp(l9_82,l9_81,l9_80);
}
l9_82=l9_83;
l9_76=l9_82;
float l9_84=0.0;
l9_84=(l9_65*(*sc_set0.UserUniforms).Port_Input1_N017)+l9_76;
float l9_85=0.0;
l9_85=1.0-l9_84;
float l9_86=0.0;
l9_86=fast::clamp(l9_85+0.001,(*sc_set0.UserUniforms).Port_Input1_N069+0.001,(*sc_set0.UserUniforms).Port_Input2_N069+0.001)-0.001;
float3 l9_87=float3(0.0);
l9_87=l9_8.SurfacePosition_ObjectSpace;
float l9_88=0.0;
float l9_89=(*sc_set0.UserUniforms).height_gradient;
l9_88=l9_89;
float3 l9_90=float3(0.0);
l9_90.x=(*sc_set0.UserUniforms).Port_Value1_N076;
l9_90.y=l9_88;
l9_90.z=(*sc_set0.UserUniforms).Port_Value3_N076;
float l9_91=0.0;
l9_91=distance(l9_87,l9_90);
float l9_92=0.0;
float l9_93=(*sc_set0.UserUniforms).distance_gradient;
l9_92=l9_93;
float l9_94=0.0;
l9_94=1.0-l9_92;
float l9_95=0.0;
l9_95=l9_91*l9_94;
float4 l9_96=float4(0.0);
float l9_97=l9_95;
float4 l9_98=(*sc_set0.UserUniforms).Port_Value0_N077;
float l9_99=(*sc_set0.UserUniforms).Port_Position1_N077;
float4 l9_100=(*sc_set0.UserUniforms).Port_Value1_N077;
float l9_101=(*sc_set0.UserUniforms).Port_Position2_N077;
float4 l9_102=(*sc_set0.UserUniforms).Port_Value2_N077;
float l9_103=(*sc_set0.UserUniforms).Port_Position3_N077;
float4 l9_104=(*sc_set0.UserUniforms).Port_Value3_N077;
float4 l9_105=(*sc_set0.UserUniforms).Port_Value4_N077;
l9_97=fast::clamp(l9_97,0.0,1.0);
float4 l9_106;
if (l9_97<l9_99)
{
l9_106=mix(l9_98,l9_100,float4(fast::clamp(l9_97/l9_99,0.0,1.0)));
}
else
{
if (l9_97<l9_101)
{
l9_106=mix(l9_100,l9_102,float4(fast::clamp((l9_97-l9_99)/(l9_101-l9_99),0.0,1.0)));
}
else
{
if (l9_97<l9_103)
{
l9_106=mix(l9_102,l9_104,float4(fast::clamp((l9_97-l9_101)/(l9_103-l9_101),0.0,1.0)));
}
else
{
l9_106=mix(l9_104,l9_105,float4(fast::clamp((l9_97-l9_103)/(1.0-l9_103),0.0,1.0)));
}
}
}
bool l9_107=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_108;
if (l9_107)
{
l9_108=!PreviewInfo.Saved;
}
else
{
l9_108=l9_107;
}
bool l9_109;
if (l9_108)
{
l9_109=77==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_109=l9_108;
}
if (l9_109)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_106;
PreviewInfo.Color.w=1.0;
}
l9_96=l9_106;
float4 l9_110=float4(0.0);
float4 l9_111=l9_96;
float l9_112=(*sc_set0.UserUniforms).Port_Amount_N080;
float l9_113=dot(l9_111.xyz,float3(0.29899999,0.58700001,0.114));
float4 l9_114=float4(mix(float3(l9_113),l9_111.xyz,float3(l9_112)),l9_111.w);
l9_110=l9_114;
float4 l9_115=float4(0.0);
l9_115=mix(l9_110,(*sc_set0.UserUniforms).Port_Input1_N002,float4((*sc_set0.UserUniforms).Port_Input2_N002));
float4 l9_116=float4(0.0);
l9_116=float4(l9_86)*l9_115;
float3 l9_117=float3(0.0);
l9_117=l9_8.SurfacePosition_ObjectSpace;
float l9_118=0.0;
l9_118=l9_117.y;
float l9_119=0.0;
l9_119=floor(l9_118*(*sc_set0.UserUniforms).Port_Input1_N070)/(*sc_set0.UserUniforms).Port_Input1_N070;
float l9_120=0.0;
float l9_121;
if (l9_119<=0.0)
{
l9_121=0.0;
}
else
{
l9_121=pow(l9_119,(*sc_set0.UserUniforms).Port_Input1_N071);
}
l9_120=l9_121;
float4 l9_122=float4(0.0);
float l9_123=l9_120;
float4 l9_124=(*sc_set0.UserUniforms).Port_Value0_N068;
float l9_125=(*sc_set0.UserUniforms).Port_Position1_N068;
float4 l9_126=(*sc_set0.UserUniforms).Port_Value1_N068;
float4 l9_127=(*sc_set0.UserUniforms).Port_Value2_N068;
l9_123=fast::clamp(l9_123,0.0,1.0);
float4 l9_128;
if (l9_123<l9_125)
{
l9_128=mix(l9_124,l9_126,float4(fast::clamp(l9_123/l9_125,0.0,1.0)));
}
else
{
l9_128=mix(l9_126,l9_127,float4(fast::clamp((l9_123-l9_125)/(1.0-l9_125),0.0,1.0)));
}
bool l9_129=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_130;
if (l9_129)
{
l9_130=!PreviewInfo.Saved;
}
else
{
l9_130=l9_129;
}
bool l9_131;
if (l9_130)
{
l9_131=68==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_131=l9_130;
}
if (l9_131)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_128;
PreviewInfo.Color.w=1.0;
}
l9_122=l9_128;
float4 l9_132=float4(0.0);
l9_132=l9_122*float4((*sc_set0.UserUniforms).Port_Input1_N072);
float4 l9_133=float4(0.0);
l9_133=l9_116*l9_132;
l9_6=l9_133.xyz;
l9_12=l9_6;
}
else
{
l9_12=l9_7;
}
}
l9_3=l9_12;
param_1=l9_3;
param_4=param_1;
}
else
{
if (param==1.0)
{
param_4=param_2;
}
else
{
param_4=param_3;
}
}
Result_N38=param_4;
float Output_N73=0.0;
float param_6=(*sc_set0.UserUniforms).alpha;
Output_N73=param_6;
float4 Value_N86=float4(0.0);
Value_N86=float4(Result_N38.x,Result_N38.y,Result_N38.z,Value_N86.w);
Value_N86.w=Output_N73;
FinalColor=Value_N86;
float param_7=FinalColor.w;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (param_7<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_134=gl_FragCoord;
float2 l9_135=floor(mod(l9_134.xy,float2(4.0)));
float l9_136=(mod(dot(l9_135,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (param_7<l9_136)
{
discard_fragment();
}
}
float4 param_8=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_137=param_8;
float4 l9_138=l9_137;
float l9_139=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_139=l9_138.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_139=fast::clamp(l9_138.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_139=fast::clamp(dot(l9_138.xyz,float3(l9_138.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_139=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_139=(1.0-dot(l9_138.xyz,float3(0.33333001)))*l9_138.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_139=(1.0-fast::clamp(dot(l9_138.xyz,float3(1.0)),0.0,1.0))*l9_138.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_139=fast::clamp(dot(l9_138.xyz,float3(1.0)),0.0,1.0)*l9_138.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_139=fast::clamp(dot(l9_138.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_139=fast::clamp(dot(l9_138.xyz,float3(1.0)),0.0,1.0)*l9_138.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_139=dot(l9_138.xyz,float3(0.33333001))*l9_138.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_139=1.0-fast::clamp(dot(l9_138.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_139=fast::clamp(dot(l9_138.xyz,float3(1.0)),0.0,1.0);
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
float l9_140=l9_139;
float l9_141=l9_140;
float l9_142=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_141;
float3 l9_143=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_137.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_144=float4(l9_143.x,l9_143.y,l9_143.z,l9_142);
param_8=l9_144;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_8=float4(param_8.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_145=param_8;
float4 l9_146=float4(0.0);
float4 l9_147=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_148=out.sc_FragData0;
l9_147=l9_148;
}
else
{
float4 l9_149=gl_FragCoord;
float2 l9_150=l9_149.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_151=l9_150;
float2 l9_152=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_153=1;
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
int l9_156=l9_155;
float3 l9_157=float3(l9_151,0.0);
int l9_158=l9_153;
int l9_159=l9_156;
if (l9_158==1)
{
l9_157.y=((2.0*l9_157.y)+float(l9_159))-1.0;
}
float2 l9_160=l9_157.xy;
l9_152=l9_160;
}
else
{
l9_152=l9_151;
}
float2 l9_161=l9_152;
float2 l9_162=l9_161;
float2 l9_163=l9_162;
float2 l9_164=l9_163;
float l9_165=0.0;
int l9_166;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_167=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_167=0;
}
else
{
l9_167=in.varStereoViewID;
}
int l9_168=l9_167;
l9_166=1-l9_168;
}
else
{
int l9_169=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_169=0;
}
else
{
l9_169=in.varStereoViewID;
}
int l9_170=l9_169;
l9_166=l9_170;
}
int l9_171=l9_166;
float2 l9_172=l9_164;
int l9_173=sc_ScreenTextureLayout_tmp;
int l9_174=l9_171;
float l9_175=l9_165;
float2 l9_176=l9_172;
int l9_177=l9_173;
int l9_178=l9_174;
float3 l9_179=float3(0.0);
if (l9_177==0)
{
l9_179=float3(l9_176,0.0);
}
else
{
if (l9_177==1)
{
l9_179=float3(l9_176.x,(l9_176.y*0.5)+(0.5-(float(l9_178)*0.5)),0.0);
}
else
{
l9_179=float3(l9_176,float(l9_178));
}
}
float3 l9_180=l9_179;
float3 l9_181=l9_180;
float4 l9_182=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_181.xy,bias(l9_175));
float4 l9_183=l9_182;
float4 l9_184=l9_183;
l9_147=l9_184;
}
float4 l9_185=l9_147;
float3 l9_186=l9_185.xyz;
float3 l9_187=l9_186;
float3 l9_188=l9_145.xyz;
float3 l9_189=definedBlend(l9_187,l9_188,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_146=float4(l9_189.x,l9_189.y,l9_189.z,l9_146.w);
float3 l9_190=mix(l9_186,l9_146.xyz,float3(l9_145.w));
l9_146=float4(l9_190.x,l9_190.y,l9_190.z,l9_146.w);
l9_146.w=1.0;
float4 l9_191=l9_146;
param_8=l9_191;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_192=float4(in.varScreenPos.xyz,1.0);
param_8=l9_192;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_193=gl_FragCoord;
float l9_194=fast::clamp(abs(l9_193.z),0.0,1.0);
float4 l9_195=float4(l9_194,1.0-l9_194,1.0,1.0);
param_8=l9_195;
}
else
{
float4 l9_196=param_8;
float4 l9_197=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_197=float4(mix(float3(1.0),l9_196.xyz,float3(l9_196.w)),l9_196.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_198=l9_196.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_198=fast::clamp(l9_198,0.0,1.0);
}
l9_197=float4(l9_196.xyz*l9_198,l9_198);
}
else
{
l9_197=l9_196;
}
}
float4 l9_199=l9_197;
param_8=l9_199;
}
}
}
}
}
float4 l9_200=param_8;
FinalColor=l9_200;
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
float4 l9_201=float4(0.0);
l9_201=float4(0.0);
float4 l9_202=l9_201;
float4 Cost=l9_202;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_9=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_9,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_10=FinalColor;
float4 l9_203=param_10;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_203.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_203;
return out;
}
} // FRAGMENT SHADER
