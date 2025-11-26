#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
#ifdef useTexture
#undef useTexture
#endif
#ifdef isTriggering
#undef isTriggering
#endif
#ifdef multipleInteractorsActive
#undef multipleInteractorsActive
#endif
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
//sampler sampler cursorTextureSmpSC 0:22
//sampler sampler intensityTextureSmpSC 0:23
//sampler sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC 0:27
//sampler sampler sc_RayTracingRayDirectionSmpSC 0:28
//sampler sampler sc_ScreenTextureSmpSC 0:30
//texture texture2D cursorTexture 0:4:0:22
//texture texture2D intensityTexture 0:5:0:23
//texture utexture2D sc_RayTracingHitCasterIdAndBarycentric 0:16:0:27
//texture texture2D sc_RayTracingRayDirection 0:17:0:28
//texture texture2D sc_ScreenTexture 0:19:0:30
//ubo float sc_BonesUBO 0:3:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:33:4928 {
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
//uint4 sc_RayTracingCasterConfiguration 3824
//uint4 sc_RayTracingCasterOffsetPNTC 3840
//uint4 sc_RayTracingCasterOffsetTexture 3856
//uint4 sc_RayTracingCasterFormatPNTC 3872
//uint4 sc_RayTracingCasterFormatTexture 3888
//float4 voxelization_params_0 3952
//float4 voxelization_params_frustum_lrbt 3968
//float4 voxelization_params_frustum_nf 3984
//float3 voxelization_params_camera_pos 4000
//float4x4 sc_ModelMatrixVoxelization 4016
//float correctedIntensity 4080
//float3x3 intensityTextureTransform 4144
//float4 intensityTextureUvMinMax 4192
//float4 intensityTextureBorderColor 4208
//int PreviewEnabled 4372
//float alphaTestThreshold 4380
//bool useTexture 4384
//float3x3 cursorTextureTransform 4448
//float4 cursorTextureUvMinMax 4496
//float4 cursorTextureBorderColor 4512
//float circleSquishScale 4528
//bool isTriggering 4532
//float outlineOffset 4536
//int handType 4540
//bool multipleInteractorsActive 4544
//float maxAlpha 4548
//float outlineAlpha 4552
//float shadowGradientOffset 4556
//float shadowOpacity 4560
//float masterAlpha 4564
//float Port_RangeMinA_N013 4568
//float Port_RangeMaxA_N013 4572
//float Port_RangeMinB_N013 4576
//float Port_RangeMaxB_N013 4580
//float Port_Value_N164 4584
//float Port_RangeMinA_N161 4588
//float Port_RangeMaxA_N161 4592
//float Port_RangeMinB_N161 4596
//float Port_RangeMaxB_N161 4600
//float2 Port_Center_N019 4608
//float2 Port_Input1_N020 4616
//float Port_Input1_N027 4624
//float Port_Input1_N026 4628
//float Port_Input1_N028 4632
//float Port_Input1_N029 4636
//float2 Port_Default_N010 4640
//float Port_RangeMinA_N001 4648
//float Port_RangeMaxA_N001 4652
//float Port_RangeMinB_N001 4656
//float Port_RangeMaxB_N001 4660
//float2 Port_Scale_N002 4664
//float2 Port_Center_N002 4672
//float Port_Value1_N046 4680
//float Port_Value2_N046 4684
//float Port_Value_N042 4688
//float3 Port_Value1_N048 4704
//float3 Port_Default_N048 4720
//float Port_Input0_N083 4736
//float Port_Input1_N083 4740
//float Port_Value_N036 4744
//float Port_Value_N037 4748
//float Port_Input1_N071 4752
//float Port_Input1_N097 4756
//int Port_Value_N091 4760
//int Port_Value_N041 4764
//float Port_Input1_N084 4768
//float Port_Input1_N035 4772
//float Port_Value1_N131 4776
//float Port_Input1_N054 4780
//float Port_Value_N068 4784
//float Port_Value2_N131 4788
//float Port_Input1_N094 4792
//float Port_Input1_N112 4796
//float Port_Value3_N131 4800
//float Port_Default_N131 4804
//float3 Port_Value1_N014 4816
//float Port_Value1_N156 4832
//float Port_Value2_N156 4836
//float Port_Value3_N156 4840
//float Port_Value4_N156 4844
//float Port_Default_N156 4848
//float Port_Value1_N149 4852
//float Port_Value2_N149 4856
//float Port_Value3_N149 4860
//float Port_RangeMaxB_N151 4864
//float Port_RangeMaxB_N152 4868
//float Port_Default_N153 4872
//float Port_RangeMaxB_N154 4876
//float Port_Input1_N143 4880
//float Port_RangeMaxB_N146 4884
//float Port_Default_N155 4888
//float4 Port_Default_N088 4896
//float depthRef 4912
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
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 30 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_cursorTexture 31 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 32 0
//spec_const bool SC_USE_UV_MIN_MAX_cursorTexture 33 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 34 0
//spec_const bool SC_USE_UV_TRANSFORM_cursorTexture 35 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 36 0
//spec_const bool UseViewSpaceDepthVariant 37 1
//spec_const bool cursorTextureHasSwappedViews 38 0
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
//spec_const bool sc_RayTracingCasterForceOpaque 64 0
//spec_const bool sc_RenderAlphaToColor 65 0
//spec_const bool sc_ScreenTextureHasSwappedViews 66 0
//spec_const bool sc_TAAEnabled 67 0
//spec_const bool sc_VertexBlendingUseNormals 68 0
//spec_const bool sc_VertexBlending 69 0
//spec_const bool sc_Voxelization 70 0
//spec_const int SC_SOFTWARE_WRAP_MODE_U_cursorTexture 71 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 72 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_cursorTexture 73 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 74 -1
//spec_const int cursorTextureLayout 75 0
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
constant bool SC_USE_CLAMP_TO_BORDER_cursorTexture [[function_constant(31)]];
constant bool SC_USE_CLAMP_TO_BORDER_cursorTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_cursorTexture) ? SC_USE_CLAMP_TO_BORDER_cursorTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(32)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_cursorTexture [[function_constant(33)]];
constant bool SC_USE_UV_MIN_MAX_cursorTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_cursorTexture) ? SC_USE_UV_MIN_MAX_cursorTexture : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(34)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_cursorTexture [[function_constant(35)]];
constant bool SC_USE_UV_TRANSFORM_cursorTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_cursorTexture) ? SC_USE_UV_TRANSFORM_cursorTexture : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(36)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool UseViewSpaceDepthVariant [[function_constant(37)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool cursorTextureHasSwappedViews [[function_constant(38)]];
constant bool cursorTextureHasSwappedViews_tmp = is_function_constant_defined(cursorTextureHasSwappedViews) ? cursorTextureHasSwappedViews : false;
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
constant bool sc_RayTracingCasterForceOpaque [[function_constant(64)]];
constant bool sc_RayTracingCasterForceOpaque_tmp = is_function_constant_defined(sc_RayTracingCasterForceOpaque) ? sc_RayTracingCasterForceOpaque : false;
constant bool sc_RenderAlphaToColor [[function_constant(65)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(66)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(67)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(68)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(69)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(70)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_SOFTWARE_WRAP_MODE_U_cursorTexture [[function_constant(71)]];
constant int SC_SOFTWARE_WRAP_MODE_U_cursorTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_cursorTexture) ? SC_SOFTWARE_WRAP_MODE_U_cursorTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(72)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_cursorTexture [[function_constant(73)]];
constant int SC_SOFTWARE_WRAP_MODE_V_cursorTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_cursorTexture) ? SC_SOFTWARE_WRAP_MODE_V_cursorTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(74)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int cursorTextureLayout [[function_constant(75)]];
constant int cursorTextureLayout_tmp = is_function_constant_defined(cursorTextureLayout) ? cursorTextureLayout : 0;
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
int useTexture;
float4 cursorTextureSize;
float4 cursorTextureDims;
float4 cursorTextureView;
float3x3 cursorTextureTransform;
float4 cursorTextureUvMinMax;
float4 cursorTextureBorderColor;
float circleSquishScale;
int isTriggering;
float outlineOffset;
int handType;
int multipleInteractorsActive;
float maxAlpha;
float outlineAlpha;
float shadowGradientOffset;
float shadowOpacity;
float masterAlpha;
float Port_RangeMinA_N013;
float Port_RangeMaxA_N013;
float Port_RangeMinB_N013;
float Port_RangeMaxB_N013;
float Port_Value_N164;
float Port_RangeMinA_N161;
float Port_RangeMaxA_N161;
float Port_RangeMinB_N161;
float Port_RangeMaxB_N161;
float2 Port_Center_N019;
float2 Port_Input1_N020;
float Port_Input1_N027;
float Port_Input1_N026;
float Port_Input1_N028;
float Port_Input1_N029;
float2 Port_Default_N010;
float Port_RangeMinA_N001;
float Port_RangeMaxA_N001;
float Port_RangeMinB_N001;
float Port_RangeMaxB_N001;
float2 Port_Scale_N002;
float2 Port_Center_N002;
float Port_Value1_N046;
float Port_Value2_N046;
float Port_Value_N042;
float3 Port_Value1_N048;
float3 Port_Default_N048;
float Port_Input0_N083;
float Port_Input1_N083;
float Port_Value_N036;
float Port_Value_N037;
float Port_Input1_N071;
float Port_Input1_N097;
int Port_Value_N091;
int Port_Value_N041;
float Port_Input1_N084;
float Port_Input1_N035;
float Port_Value1_N131;
float Port_Input1_N054;
float Port_Value_N068;
float Port_Value2_N131;
float Port_Input1_N094;
float Port_Input1_N112;
float Port_Value3_N131;
float Port_Default_N131;
float3 Port_Value1_N014;
float Port_Value1_N156;
float Port_Value2_N156;
float Port_Value3_N156;
float Port_Value4_N156;
float Port_Default_N156;
float Port_Value1_N149;
float Port_Value2_N149;
float Port_Value3_N149;
float Port_RangeMaxB_N151;
float Port_RangeMaxB_N152;
float Port_Default_N153;
float Port_RangeMaxB_N154;
float Port_Input1_N143;
float Port_RangeMaxB_N146;
float Port_Default_N155;
float4 Port_Default_N088;
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
texture2d<float> cursorTexture [[id(4)]];
texture2d<float> intensityTexture [[id(5)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(16)]];
texture2d<float> sc_RayTracingRayDirection [[id(17)]];
texture2d<float> sc_ScreenTexture [[id(19)]];
sampler cursorTextureSmpSC [[id(22)]];
sampler intensityTextureSmpSC [[id(23)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(27)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(28)]];
sampler sc_ScreenTextureSmpSC [[id(30)]];
constant userUniformsObj* UserUniforms [[id(33)]];
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
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float2 Surface_UVCoord0;
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
int useTexture;
float4 cursorTextureSize;
float4 cursorTextureDims;
float4 cursorTextureView;
float3x3 cursorTextureTransform;
float4 cursorTextureUvMinMax;
float4 cursorTextureBorderColor;
float circleSquishScale;
int isTriggering;
float outlineOffset;
int handType;
int multipleInteractorsActive;
float maxAlpha;
float outlineAlpha;
float shadowGradientOffset;
float shadowOpacity;
float masterAlpha;
float Port_RangeMinA_N013;
float Port_RangeMaxA_N013;
float Port_RangeMinB_N013;
float Port_RangeMaxB_N013;
float Port_Value_N164;
float Port_RangeMinA_N161;
float Port_RangeMaxA_N161;
float Port_RangeMinB_N161;
float Port_RangeMaxB_N161;
float2 Port_Center_N019;
float2 Port_Input1_N020;
float Port_Input1_N027;
float Port_Input1_N026;
float Port_Input1_N028;
float Port_Input1_N029;
float2 Port_Default_N010;
float Port_RangeMinA_N001;
float Port_RangeMaxA_N001;
float Port_RangeMinB_N001;
float Port_RangeMaxB_N001;
float2 Port_Scale_N002;
float2 Port_Center_N002;
float Port_Value1_N046;
float Port_Value2_N046;
float Port_Value_N042;
float3 Port_Value1_N048;
float3 Port_Default_N048;
float Port_Input0_N083;
float Port_Input1_N083;
float Port_Value_N036;
float Port_Value_N037;
float Port_Input1_N071;
float Port_Input1_N097;
int Port_Value_N091;
int Port_Value_N041;
float Port_Input1_N084;
float Port_Input1_N035;
float Port_Value1_N131;
float Port_Input1_N054;
float Port_Value_N068;
float Port_Value2_N131;
float Port_Input1_N094;
float Port_Input1_N112;
float Port_Value3_N131;
float Port_Default_N131;
float3 Port_Value1_N014;
float Port_Value1_N156;
float Port_Value2_N156;
float Port_Value3_N156;
float Port_Value4_N156;
float Port_Default_N156;
float Port_Value1_N149;
float Port_Value2_N149;
float Port_Value3_N149;
float Port_RangeMaxB_N151;
float Port_RangeMaxB_N152;
float Port_Default_N153;
float Port_RangeMaxB_N154;
float Port_Input1_N143;
float Port_RangeMaxB_N146;
float Port_Default_N155;
float4 Port_Default_N088;
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
texture2d<float> cursorTexture [[id(4)]];
texture2d<float> intensityTexture [[id(5)]];
texture2d<uint> sc_RayTracingHitCasterIdAndBarycentric [[id(16)]];
texture2d<float> sc_RayTracingRayDirection [[id(17)]];
texture2d<float> sc_ScreenTexture [[id(19)]];
sampler cursorTextureSmpSC [[id(22)]];
sampler intensityTextureSmpSC [[id(23)]];
sampler sc_RayTracingHitCasterIdAndBarycentricSmpSC [[id(27)]];
sampler sc_RayTracingRayDirectionSmpSC [[id(28)]];
sampler sc_ScreenTextureSmpSC [[id(30)]];
constant userUniformsObj* UserUniforms [[id(33)]];
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
Globals.Surface_UVCoord0=rhp.uv0;
}
else
{
Globals.Surface_UVCoord0=in.varTex01.xy;
}
float4 Result_N33=float4(0.0);
float param_1=0.0;
float4 param_2=float4(0.0);
float4 param_3=float4(0.0);
ssGlobals param_5=Globals;
float l9_1=0.0;
float l9_2=float((*sc_set0.UserUniforms).useTexture!=0);
l9_1=l9_2;
param_1=l9_1;
float4 param_4;
if ((param_1*1.0)!=0.0)
{
float2 l9_3=float2(0.0);
float l9_4=0.0;
float2 l9_5=float2(0.0);
float2 l9_6=(*sc_set0.UserUniforms).Port_Default_N010;
ssGlobals l9_7=param_5;
float2 l9_8=float2(0.0);
l9_8=l9_7.Surface_UVCoord0;
float2 l9_9=float2(0.0);
l9_9=(((l9_8-float2((*sc_set0.UserUniforms).Port_RangeMinA_N013))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N013-(*sc_set0.UserUniforms).Port_RangeMinA_N013)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N013-(*sc_set0.UserUniforms).Port_RangeMinB_N013))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N013);
float l9_10=0.0;
float l9_11=(*sc_set0.UserUniforms).Port_Value_N164;
float l9_12=l9_11+0.001;
l9_12-=0.001;
l9_10=l9_12;
float l9_13=0.0;
float l9_14=(*sc_set0.UserUniforms).circleSquishScale;
l9_13=l9_14;
float l9_15=0.0;
float l9_16=l9_13;
float l9_17=(*sc_set0.UserUniforms).Port_RangeMinA_N161;
float l9_18=(*sc_set0.UserUniforms).Port_RangeMaxA_N161;
float l9_19=(*sc_set0.UserUniforms).Port_RangeMinB_N161;
float l9_20=(*sc_set0.UserUniforms).Port_RangeMaxB_N161;
float l9_21=(((l9_16-l9_17)/((l9_18-l9_17)+1e-06))*(l9_20-l9_19))+l9_19;
float l9_22;
if (l9_20>l9_19)
{
l9_22=fast::clamp(l9_21,l9_19,l9_20);
}
else
{
l9_22=fast::clamp(l9_21,l9_20,l9_19);
}
l9_21=l9_22;
l9_15=l9_21;
float l9_23=0.0;
l9_23=l9_10/(l9_15+1.234e-06);
float2 l9_24=float2(0.0);
l9_24.x=l9_23;
l9_24.y=l9_23;
float2 l9_25=float2(0.0);
l9_25=((l9_9-(*sc_set0.UserUniforms).Port_Center_N019)*l9_24)+(*sc_set0.UserUniforms).Port_Center_N019;
float2 l9_26=float2(0.0);
l9_26=l9_25+(*sc_set0.UserUniforms).Port_Input1_N020;
float l9_27=0.0;
float l9_28=0.0;
float2 l9_29=l9_26;
float l9_30=l9_29.x;
float l9_31=l9_29.y;
l9_27=l9_30;
l9_28=l9_31;
float l9_32=0.0;
l9_32=float(l9_27>=(*sc_set0.UserUniforms).Port_Input1_N027);
float l9_33=0.0;
l9_33=float(l9_27<=(*sc_set0.UserUniforms).Port_Input1_N026);
float l9_34=0.0;
float l9_35=l9_32;
bool l9_36=(l9_35*1.0)!=0.0;
bool l9_37;
if (l9_36)
{
l9_37=(l9_33*1.0)!=0.0;
}
else
{
l9_37=l9_36;
}
l9_34=float(l9_37);
float l9_38=0.0;
l9_38=float(l9_28>=(*sc_set0.UserUniforms).Port_Input1_N028);
float l9_39=0.0;
l9_39=float(l9_28<=(*sc_set0.UserUniforms).Port_Input1_N029);
float l9_40=0.0;
float l9_41=l9_38;
bool l9_42=(l9_41*1.0)!=0.0;
bool l9_43;
if (l9_42)
{
l9_43=(l9_39*1.0)!=0.0;
}
else
{
l9_43=l9_42;
}
l9_40=float(l9_43);
float l9_44=0.0;
float l9_45=l9_34;
bool l9_46=(l9_45*1.0)!=0.0;
bool l9_47;
if (l9_46)
{
l9_47=(l9_40*1.0)!=0.0;
}
else
{
l9_47=l9_46;
}
l9_44=float(l9_47);
l9_4=l9_44;
float2 l9_48;
if ((l9_4*1.0)!=0.0)
{
float2 l9_49=float2(0.0);
l9_49=l9_7.Surface_UVCoord0;
float2 l9_50=float2(0.0);
l9_50=(((l9_49-float2((*sc_set0.UserUniforms).Port_RangeMinA_N013))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N013-(*sc_set0.UserUniforms).Port_RangeMinA_N013)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N013-(*sc_set0.UserUniforms).Port_RangeMinB_N013))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N013);
float l9_51=0.0;
float l9_52=(*sc_set0.UserUniforms).Port_Value_N164;
float l9_53=l9_52+0.001;
l9_53-=0.001;
l9_51=l9_53;
float l9_54=0.0;
float l9_55=(*sc_set0.UserUniforms).circleSquishScale;
l9_54=l9_55;
float l9_56=0.0;
float l9_57=l9_54;
float l9_58=(*sc_set0.UserUniforms).Port_RangeMinA_N161;
float l9_59=(*sc_set0.UserUniforms).Port_RangeMaxA_N161;
float l9_60=(*sc_set0.UserUniforms).Port_RangeMinB_N161;
float l9_61=(*sc_set0.UserUniforms).Port_RangeMaxB_N161;
float l9_62=(((l9_57-l9_58)/((l9_59-l9_58)+1e-06))*(l9_61-l9_60))+l9_60;
float l9_63;
if (l9_61>l9_60)
{
l9_63=fast::clamp(l9_62,l9_60,l9_61);
}
else
{
l9_63=fast::clamp(l9_62,l9_61,l9_60);
}
l9_62=l9_63;
l9_56=l9_62;
float l9_64=0.0;
l9_64=l9_51/(l9_56+1.234e-06);
float2 l9_65=float2(0.0);
l9_65.x=l9_64;
l9_65.y=l9_64;
float2 l9_66=float2(0.0);
l9_66=((l9_50-(*sc_set0.UserUniforms).Port_Center_N019)*l9_65)+(*sc_set0.UserUniforms).Port_Center_N019;
float2 l9_67=float2(0.0);
l9_67=l9_66+(*sc_set0.UserUniforms).Port_Input1_N020;
l9_5=l9_67;
l9_48=l9_5;
}
else
{
l9_48=l9_6;
}
l9_3=l9_48;
float4 l9_68=float4(0.0);
int l9_69;
if ((int(cursorTextureHasSwappedViews_tmp)!=0))
{
int l9_70=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_70=0;
}
else
{
l9_70=in.varStereoViewID;
}
int l9_71=l9_70;
l9_69=1-l9_71;
}
else
{
int l9_72=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_72=0;
}
else
{
l9_72=in.varStereoViewID;
}
int l9_73=l9_72;
l9_69=l9_73;
}
int l9_74=l9_69;
int l9_75=cursorTextureLayout_tmp;
int l9_76=l9_74;
float2 l9_77=l9_3;
bool l9_78=(int(SC_USE_UV_TRANSFORM_cursorTexture_tmp)!=0);
float3x3 l9_79=(*sc_set0.UserUniforms).cursorTextureTransform;
int2 l9_80=int2(SC_SOFTWARE_WRAP_MODE_U_cursorTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_cursorTexture_tmp);
bool l9_81=(int(SC_USE_UV_MIN_MAX_cursorTexture_tmp)!=0);
float4 l9_82=(*sc_set0.UserUniforms).cursorTextureUvMinMax;
bool l9_83=(int(SC_USE_CLAMP_TO_BORDER_cursorTexture_tmp)!=0);
float4 l9_84=(*sc_set0.UserUniforms).cursorTextureBorderColor;
float l9_85=0.0;
bool l9_86=l9_83&&(!l9_81);
float l9_87=1.0;
float l9_88=l9_77.x;
int l9_89=l9_80.x;
if (l9_89==1)
{
l9_88=fract(l9_88);
}
else
{
if (l9_89==2)
{
float l9_90=fract(l9_88);
float l9_91=l9_88-l9_90;
float l9_92=step(0.25,fract(l9_91*0.5));
l9_88=mix(l9_90,1.0-l9_90,fast::clamp(l9_92,0.0,1.0));
}
}
l9_77.x=l9_88;
float l9_93=l9_77.y;
int l9_94=l9_80.y;
if (l9_94==1)
{
l9_93=fract(l9_93);
}
else
{
if (l9_94==2)
{
float l9_95=fract(l9_93);
float l9_96=l9_93-l9_95;
float l9_97=step(0.25,fract(l9_96*0.5));
l9_93=mix(l9_95,1.0-l9_95,fast::clamp(l9_97,0.0,1.0));
}
}
l9_77.y=l9_93;
if (l9_81)
{
bool l9_98=l9_83;
bool l9_99;
if (l9_98)
{
l9_99=l9_80.x==3;
}
else
{
l9_99=l9_98;
}
float l9_100=l9_77.x;
float l9_101=l9_82.x;
float l9_102=l9_82.z;
bool l9_103=l9_99;
float l9_104=l9_87;
float l9_105=fast::clamp(l9_100,l9_101,l9_102);
float l9_106=step(abs(l9_100-l9_105),9.9999997e-06);
l9_104*=(l9_106+((1.0-float(l9_103))*(1.0-l9_106)));
l9_100=l9_105;
l9_77.x=l9_100;
l9_87=l9_104;
bool l9_107=l9_83;
bool l9_108;
if (l9_107)
{
l9_108=l9_80.y==3;
}
else
{
l9_108=l9_107;
}
float l9_109=l9_77.y;
float l9_110=l9_82.y;
float l9_111=l9_82.w;
bool l9_112=l9_108;
float l9_113=l9_87;
float l9_114=fast::clamp(l9_109,l9_110,l9_111);
float l9_115=step(abs(l9_109-l9_114),9.9999997e-06);
l9_113*=(l9_115+((1.0-float(l9_112))*(1.0-l9_115)));
l9_109=l9_114;
l9_77.y=l9_109;
l9_87=l9_113;
}
float2 l9_116=l9_77;
bool l9_117=l9_78;
float3x3 l9_118=l9_79;
if (l9_117)
{
l9_116=float2((l9_118*float3(l9_116,1.0)).xy);
}
float2 l9_119=l9_116;
l9_77=l9_119;
float l9_120=l9_77.x;
int l9_121=l9_80.x;
bool l9_122=l9_86;
float l9_123=l9_87;
if ((l9_121==0)||(l9_121==3))
{
float l9_124=l9_120;
float l9_125=0.0;
float l9_126=1.0;
bool l9_127=l9_122;
float l9_128=l9_123;
float l9_129=fast::clamp(l9_124,l9_125,l9_126);
float l9_130=step(abs(l9_124-l9_129),9.9999997e-06);
l9_128*=(l9_130+((1.0-float(l9_127))*(1.0-l9_130)));
l9_124=l9_129;
l9_120=l9_124;
l9_123=l9_128;
}
l9_77.x=l9_120;
l9_87=l9_123;
float l9_131=l9_77.y;
int l9_132=l9_80.y;
bool l9_133=l9_86;
float l9_134=l9_87;
if ((l9_132==0)||(l9_132==3))
{
float l9_135=l9_131;
float l9_136=0.0;
float l9_137=1.0;
bool l9_138=l9_133;
float l9_139=l9_134;
float l9_140=fast::clamp(l9_135,l9_136,l9_137);
float l9_141=step(abs(l9_135-l9_140),9.9999997e-06);
l9_139*=(l9_141+((1.0-float(l9_138))*(1.0-l9_141)));
l9_135=l9_140;
l9_131=l9_135;
l9_134=l9_139;
}
l9_77.y=l9_131;
l9_87=l9_134;
float2 l9_142=l9_77;
int l9_143=l9_75;
int l9_144=l9_76;
float l9_145=l9_85;
float2 l9_146=l9_142;
int l9_147=l9_143;
int l9_148=l9_144;
float3 l9_149=float3(0.0);
if (l9_147==0)
{
l9_149=float3(l9_146,0.0);
}
else
{
if (l9_147==1)
{
l9_149=float3(l9_146.x,(l9_146.y*0.5)+(0.5-(float(l9_148)*0.5)),0.0);
}
else
{
l9_149=float3(l9_146,float(l9_148));
}
}
float3 l9_150=l9_149;
float3 l9_151=l9_150;
float4 l9_152=sc_set0.cursorTexture.sample(sc_set0.cursorTextureSmpSC,l9_151.xy,bias(l9_145));
float4 l9_153=l9_152;
if (l9_83)
{
l9_153=mix(l9_84,l9_153,float4(l9_87));
}
float4 l9_154=l9_153;
l9_68=l9_154;
param_2=l9_68;
param_4=param_2;
}
else
{
float4 l9_155=float4(0.0);
float l9_156=0.0;
float4 l9_157=float4(0.0);
float l9_158=0.0;
float4 l9_159=float4(0.0);
float l9_160=0.0;
float4 l9_161=float4(0.0,0.0,0.0,1.0);
float4 l9_162=(*sc_set0.UserUniforms).Port_Default_N088;
ssGlobals l9_163=param_5;
float2 l9_164=float2(0.0);
l9_164=l9_163.Surface_UVCoord0;
float2 l9_165=float2(0.0);
l9_165=(((l9_164-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_166=float2(0.0);
l9_166=((l9_165-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_167=float2(0.0);
l9_167.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_167.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_168=0.0;
l9_168=distance(l9_166,l9_167);
float l9_169=0.0;
float l9_170=(*sc_set0.UserUniforms).circleSquishScale;
l9_169=l9_170;
float l9_171=0.0;
float l9_172=(*sc_set0.UserUniforms).Port_Value_N042;
float l9_173=l9_172+0.001;
l9_173-=0.001;
l9_171=l9_173;
float l9_174=0.0;
l9_174=l9_169*l9_171;
float l9_175=0.0;
l9_175=float(l9_168<l9_174);
l9_156=l9_175;
float l9_176=0.0;
float l9_177=0.0;
float l9_178=(*sc_set0.UserUniforms).Port_Value1_N131;
float l9_179=0.0;
float l9_180=(*sc_set0.UserUniforms).Port_Value2_N131;
float l9_181=0.0;
float l9_182=(*sc_set0.UserUniforms).Port_Value3_N131;
float l9_183=(*sc_set0.UserUniforms).Port_Default_N131;
ssGlobals l9_184=l9_163;
float2 l9_185=float2(0.0);
l9_185=l9_184.Surface_UVCoord0;
float2 l9_186=float2(0.0);
l9_186=(((l9_185-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_187=float2(0.0);
l9_187=((l9_186-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_188=float2(0.0);
l9_188.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_188.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_189=0.0;
l9_189=distance(l9_187,l9_188);
float l9_190=0.0;
float l9_191=(*sc_set0.UserUniforms).outlineOffset;
l9_190=l9_191;
float l9_192=0.0;
float l9_193=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_194=l9_193+0.001;
l9_194-=0.001;
l9_192=l9_194;
float l9_195=0.0;
l9_195=l9_190+l9_192;
float l9_196=0.0;
l9_196=float(l9_189<l9_195);
float l9_197=0.0;
float l9_198=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_199=l9_198+0.001;
l9_199-=0.001;
l9_197=l9_199;
float l9_200=0.0;
l9_200=l9_190+l9_197;
float l9_201=0.0;
l9_201=float(l9_189>l9_200);
float l9_202=0.0;
float l9_203=l9_196;
bool l9_204=(l9_203*1.0)!=0.0;
bool l9_205;
if (l9_204)
{
l9_205=(l9_201*1.0)!=0.0;
}
else
{
l9_205=l9_204;
}
l9_202=float(l9_205);
float l9_206=0.0;
float l9_207=0.0;
float2 l9_208=l9_187;
float l9_209=l9_208.x;
float l9_210=l9_208.y;
l9_206=l9_209;
l9_207=l9_210;
float l9_211=0.0;
l9_211=atan2(l9_207,l9_206);
float l9_212=0.0;
l9_212=3.1415927;
float l9_213=0.0;
l9_213=l9_212*(*sc_set0.UserUniforms).Port_Input1_N071;
float l9_214=0.0;
l9_214=l9_211+l9_213;
float l9_215=0.0;
l9_215=mod(l9_214,l9_213);
float l9_216=0.0;
l9_216=3.1415927;
float l9_217=0.0;
l9_217=l9_216*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_218=0.0;
l9_218=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_219=0.0;
float l9_220=float((*sc_set0.UserUniforms).handType);
l9_219=l9_220;
float l9_221=0.0;
l9_221=l9_218*l9_219;
float l9_222=0.0;
l9_222=radians(l9_221);
float l9_223=0.0;
l9_223=l9_217+l9_222;
float l9_224=0.0;
l9_224=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_225=0.0;
l9_225=radians(l9_224);
float l9_226=0.0;
l9_226=l9_225/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_227=0.0;
l9_227=l9_223+l9_226;
float l9_228=0.0;
l9_228=float(l9_215<l9_227);
float l9_229=0.0;
l9_229=l9_223-l9_226;
float l9_230=0.0;
l9_230=float(l9_215>l9_229);
float l9_231=0.0;
float l9_232=l9_228;
bool l9_233=(l9_232*1.0)!=0.0;
bool l9_234;
if (l9_233)
{
l9_234=(l9_230*1.0)!=0.0;
}
else
{
l9_234=l9_233;
}
l9_231=float(l9_234);
float l9_235=0.0;
l9_235=(l9_219==(*sc_set0.UserUniforms).Port_Input1_N035) ? 0.0 : 1.0;
float l9_236=0.0;
float l9_237=float((*sc_set0.UserUniforms).multipleInteractorsActive!=0);
l9_236=l9_237;
float l9_238=0.0;
float l9_239=l9_235;
bool l9_240=(l9_239*1.0)!=0.0;
bool l9_241;
if (l9_240)
{
l9_241=(l9_236*1.0)!=0.0;
}
else
{
l9_241=l9_240;
}
l9_238=float(l9_241);
float l9_242=0.0;
float l9_243=l9_231;
bool l9_244=(l9_243*1.0)!=0.0;
bool l9_245;
if (l9_244)
{
l9_245=(l9_238*1.0)!=0.0;
}
else
{
l9_245=l9_244;
}
l9_242=float(l9_245);
float l9_246=0.0;
l9_246=((l9_242*1.0)!=0.0) ? 0.0 : 1.0;
float l9_247=0.0;
float l9_248=l9_202;
bool l9_249=(l9_248*1.0)!=0.0;
bool l9_250;
if (l9_249)
{
l9_250=(l9_246*1.0)!=0.0;
}
else
{
l9_250=l9_249;
}
l9_247=float(l9_250);
l9_177=l9_247;
float2 l9_251=float2(0.0);
l9_251=l9_184.Surface_UVCoord0;
float2 l9_252=float2(0.0);
l9_252=(((l9_251-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_253=float2(0.0);
l9_253=((l9_252-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_254=0.0;
float l9_255=(*sc_set0.UserUniforms).outlineOffset;
l9_254=l9_255;
float l9_256=0.0;
float l9_257=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_258=l9_257+0.001;
l9_258-=0.001;
l9_256=l9_258;
float l9_259=0.0;
l9_259=l9_254+l9_256;
float l9_260=0.0;
float l9_261=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_262=l9_261+0.001;
l9_262-=0.001;
l9_260=l9_262;
float l9_263=0.0;
l9_263=l9_254+l9_260;
float l9_264=0.0;
l9_264=l9_259+l9_263;
float l9_265=0.0;
l9_265=l9_264/((*sc_set0.UserUniforms).Port_Input1_N054+1.234e-06);
float2 l9_266=float2(0.0);
l9_266.x=l9_265;
l9_266.y=l9_265;
float l9_267=0.0;
l9_267=3.1415927;
float l9_268=0.0;
l9_268=l9_267*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_269=0.0;
l9_269=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_270=0.0;
float l9_271=float((*sc_set0.UserUniforms).handType);
l9_270=l9_271;
float l9_272=0.0;
l9_272=l9_269*l9_270;
float l9_273=0.0;
l9_273=radians(l9_272);
float l9_274=0.0;
l9_274=l9_268+l9_273;
float l9_275=0.0;
l9_275=cos(l9_274);
float l9_276=0.0;
l9_276=sin(l9_274);
float2 l9_277=float2(0.0);
l9_277.x=l9_275;
l9_277.y=l9_276;
float2 l9_278=float2(0.0);
l9_278=l9_266*l9_277;
float l9_279=0.0;
l9_279=distance(l9_253,l9_278);
float l9_280=0.0;
l9_280=l9_259-l9_263;
float l9_281=0.0;
float l9_282=(*sc_set0.UserUniforms).Port_Value_N068;
float l9_283=l9_282+0.001;
l9_283-=0.001;
l9_281=l9_283;
float l9_284=0.0;
l9_284=l9_280*l9_281;
float l9_285=0.0;
l9_285=float(l9_279<l9_284);
float l9_286=0.0;
l9_286=(l9_270==(*sc_set0.UserUniforms).Port_Input1_N035) ? 0.0 : 1.0;
float l9_287=0.0;
float l9_288=float((*sc_set0.UserUniforms).multipleInteractorsActive!=0);
l9_287=l9_288;
float l9_289=0.0;
float l9_290=l9_286;
bool l9_291=(l9_290*1.0)!=0.0;
bool l9_292;
if (l9_291)
{
l9_292=(l9_287*1.0)!=0.0;
}
else
{
l9_292=l9_291;
}
l9_289=float(l9_292);
float l9_293=0.0;
float l9_294=l9_285;
bool l9_295=(l9_294*1.0)!=0.0;
bool l9_296;
if (l9_295)
{
l9_296=(l9_289*1.0)!=0.0;
}
else
{
l9_296=l9_295;
}
l9_293=float(l9_296);
l9_179=l9_293;
float2 l9_297=float2(0.0);
l9_297=l9_184.Surface_UVCoord0;
float2 l9_298=float2(0.0);
l9_298=(((l9_297-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_299=float2(0.0);
l9_299=((l9_298-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_300=0.0;
float l9_301=(*sc_set0.UserUniforms).outlineOffset;
l9_300=l9_301;
float l9_302=0.0;
float l9_303=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_304=l9_303+0.001;
l9_304-=0.001;
l9_302=l9_304;
float l9_305=0.0;
l9_305=l9_300+l9_302;
float l9_306=0.0;
float l9_307=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_308=l9_307+0.001;
l9_308-=0.001;
l9_306=l9_308;
float l9_309=0.0;
l9_309=l9_300+l9_306;
float l9_310=0.0;
l9_310=l9_305+l9_309;
float l9_311=0.0;
l9_311=l9_310/((*sc_set0.UserUniforms).Port_Input1_N094+1.234e-06);
float2 l9_312=float2(0.0);
l9_312.x=l9_311;
l9_312.y=l9_311;
float l9_313=0.0;
l9_313=3.1415927;
float l9_314=0.0;
l9_314=l9_313*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_315=0.0;
l9_315=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_316=0.0;
float l9_317=float((*sc_set0.UserUniforms).handType);
l9_316=l9_317;
float l9_318=0.0;
l9_318=l9_315*l9_316;
float l9_319=0.0;
l9_319=radians(l9_318);
float l9_320=0.0;
l9_320=l9_314+l9_319;
float l9_321=0.0;
l9_321=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_322=0.0;
l9_322=radians(l9_321);
float l9_323=0.0;
l9_323=l9_322/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_324=0.0;
l9_324=l9_320+l9_323;
float l9_325=0.0;
l9_325=cos(l9_324);
float l9_326=0.0;
l9_326=sin(l9_324);
float2 l9_327=float2(0.0);
l9_327.x=l9_325;
l9_327.y=l9_326;
float2 l9_328=float2(0.0);
l9_328=l9_312*l9_327;
float l9_329=0.0;
l9_329=distance(l9_299,l9_328);
float l9_330=0.0;
l9_330=l9_305-l9_309;
float l9_331=0.0;
l9_331=l9_330/((*sc_set0.UserUniforms).Port_Input1_N112+1.234e-06);
float l9_332=0.0;
l9_332=float(l9_329<l9_331);
float l9_333=0.0;
l9_333=l9_320-l9_323;
float l9_334=0.0;
l9_334=cos(l9_333);
float l9_335=0.0;
l9_335=sin(l9_333);
float2 l9_336=float2(0.0);
l9_336.x=l9_334;
l9_336.y=l9_335;
float2 l9_337=float2(0.0);
l9_337=l9_312*l9_336;
float l9_338=0.0;
l9_338=distance(l9_299,l9_337);
float l9_339=0.0;
l9_339=float(l9_338<l9_331);
float l9_340=0.0;
float l9_341=l9_332;
bool l9_342=(l9_341*1.0)!=0.0;
bool l9_343;
if (!l9_342)
{
l9_343=(l9_339*1.0)!=0.0;
}
else
{
l9_343=l9_342;
}
l9_340=float(l9_343);
l9_181=l9_340;
float l9_344;
if ((l9_177*1.0)!=0.0)
{
l9_344=l9_178;
}
else
{
if ((l9_179*1.0)!=0.0)
{
l9_344=l9_180;
}
else
{
if ((l9_181*1.0)!=0.0)
{
l9_344=l9_182;
}
else
{
l9_344=l9_183;
}
}
}
l9_176=l9_344;
l9_158=l9_176;
float l9_345=0.0;
float l9_346=0.0;
float l9_347=(*sc_set0.UserUniforms).Port_Value1_N156;
float l9_348=0.0;
float l9_349=(*sc_set0.UserUniforms).Port_Value2_N156;
float l9_350=0.0;
float l9_351=(*sc_set0.UserUniforms).Port_Value3_N156;
float l9_352=0.0;
float l9_353=(*sc_set0.UserUniforms).Port_Value4_N156;
float l9_354=(*sc_set0.UserUniforms).Port_Default_N156;
ssGlobals l9_355=l9_163;
float2 l9_356=float2(0.0);
l9_356=l9_355.Surface_UVCoord0;
float2 l9_357=float2(0.0);
l9_357=(((l9_356-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_358=float2(0.0);
l9_358=((l9_357-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_359=0.0;
float l9_360=(*sc_set0.UserUniforms).outlineOffset;
l9_359=l9_360;
float l9_361=0.0;
float l9_362=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_363=l9_362+0.001;
l9_363-=0.001;
l9_361=l9_363;
float l9_364=0.0;
l9_364=l9_359+l9_361;
float l9_365=0.0;
float l9_366=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_367=l9_366+0.001;
l9_367-=0.001;
l9_365=l9_367;
float l9_368=0.0;
l9_368=l9_359+l9_365;
float l9_369=0.0;
l9_369=l9_364+l9_368;
float l9_370=0.0;
l9_370=l9_369/((*sc_set0.UserUniforms).Port_Input1_N054+1.234e-06);
float2 l9_371=float2(0.0);
l9_371.x=l9_370;
l9_371.y=l9_370;
float l9_372=0.0;
l9_372=3.1415927;
float l9_373=0.0;
l9_373=l9_372*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_374=0.0;
l9_374=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_375=0.0;
float l9_376=float((*sc_set0.UserUniforms).handType);
l9_375=l9_376;
float l9_377=0.0;
l9_377=l9_374*l9_375;
float l9_378=0.0;
l9_378=radians(l9_377);
float l9_379=0.0;
l9_379=l9_373+l9_378;
float l9_380=0.0;
l9_380=cos(l9_379);
float l9_381=0.0;
l9_381=sin(l9_379);
float2 l9_382=float2(0.0);
l9_382.x=l9_380;
l9_382.y=l9_381;
float2 l9_383=float2(0.0);
l9_383=l9_371*l9_382;
float l9_384=0.0;
l9_384=distance(l9_358,l9_383);
float l9_385=0.0;
l9_385=l9_364-l9_368;
float l9_386=0.0;
float l9_387=(*sc_set0.UserUniforms).Port_Value_N068;
float l9_388=l9_387+0.001;
l9_388-=0.001;
l9_386=l9_388;
float l9_389=0.0;
l9_389=l9_385*l9_386;
float l9_390=0.0;
float l9_391=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_390=l9_391;
float l9_392=0.0;
l9_392=l9_389+l9_390;
float l9_393=0.0;
l9_393=float(l9_384<l9_392);
float l9_394=0.0;
l9_394=(l9_375==(*sc_set0.UserUniforms).Port_Input1_N035) ? 0.0 : 1.0;
float l9_395=0.0;
float l9_396=float((*sc_set0.UserUniforms).multipleInteractorsActive!=0);
l9_395=l9_396;
float l9_397=0.0;
float l9_398=l9_394;
bool l9_399=(l9_398*1.0)!=0.0;
bool l9_400;
if (l9_399)
{
l9_400=(l9_395*1.0)!=0.0;
}
else
{
l9_400=l9_399;
}
l9_397=float(l9_400);
float l9_401=0.0;
float l9_402=l9_393;
bool l9_403=(l9_402*1.0)!=0.0;
bool l9_404;
if (l9_403)
{
l9_404=(l9_397*1.0)!=0.0;
}
else
{
l9_404=l9_403;
}
l9_401=float(l9_404);
l9_346=l9_401;
float2 l9_405=float2(0.0);
l9_405=l9_355.Surface_UVCoord0;
float2 l9_406=float2(0.0);
l9_406=(((l9_405-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_407=float2(0.0);
l9_407=((l9_406-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_408=float2(0.0);
l9_408.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_408.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_409=0.0;
l9_409=distance(l9_407,l9_408);
float l9_410=0.0;
float l9_411=(*sc_set0.UserUniforms).circleSquishScale;
l9_410=l9_411;
float l9_412=0.0;
float l9_413=(*sc_set0.UserUniforms).Port_Value_N042;
float l9_414=l9_413+0.001;
l9_414-=0.001;
l9_412=l9_414;
float l9_415=0.0;
l9_415=l9_410*l9_412;
float l9_416=0.0;
float l9_417=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_416=l9_417;
float l9_418=0.0;
l9_418=l9_415+l9_416;
float l9_419=0.0;
l9_419=float(l9_409<l9_418);
l9_348=l9_419;
float2 l9_420=float2(0.0);
l9_420=l9_355.Surface_UVCoord0;
float2 l9_421=float2(0.0);
l9_421=(((l9_420-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_422=float2(0.0);
l9_422=((l9_421-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_423=float2(0.0);
l9_423.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_423.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_424=0.0;
l9_424=distance(l9_422,l9_423);
float l9_425=0.0;
float l9_426=(*sc_set0.UserUniforms).outlineOffset;
l9_425=l9_426;
float l9_427=0.0;
float l9_428=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_429=l9_428+0.001;
l9_429-=0.001;
l9_427=l9_429;
float l9_430=0.0;
l9_430=l9_425+l9_427;
float l9_431=0.0;
float l9_432=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_431=l9_432;
float l9_433=0.0;
l9_433=l9_430+l9_431;
float l9_434=0.0;
l9_434=float(l9_424<l9_433);
float l9_435=0.0;
float l9_436=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_437=l9_436+0.001;
l9_437-=0.001;
l9_435=l9_437;
float l9_438=0.0;
l9_438=l9_425+l9_435;
float l9_439=0.0;
l9_439=l9_438-l9_431;
float l9_440=0.0;
l9_440=float(l9_424>l9_439);
float l9_441=0.0;
float l9_442=l9_434;
bool l9_443=(l9_442*1.0)!=0.0;
bool l9_444;
if (l9_443)
{
l9_444=(l9_440*1.0)!=0.0;
}
else
{
l9_444=l9_443;
}
l9_441=float(l9_444);
float l9_445=0.0;
float l9_446=0.0;
float2 l9_447=l9_422;
float l9_448=l9_447.x;
float l9_449=l9_447.y;
l9_445=l9_448;
l9_446=l9_449;
float l9_450=0.0;
l9_450=atan2(l9_446,l9_445);
float l9_451=0.0;
l9_451=3.1415927;
float l9_452=0.0;
l9_452=l9_451*(*sc_set0.UserUniforms).Port_Input1_N071;
float l9_453=0.0;
l9_453=l9_450+l9_452;
float l9_454=0.0;
l9_454=mod(l9_453,l9_452);
float l9_455=0.0;
l9_455=3.1415927;
float l9_456=0.0;
l9_456=l9_455*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_457=0.0;
l9_457=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_458=0.0;
float l9_459=float((*sc_set0.UserUniforms).handType);
l9_458=l9_459;
float l9_460=0.0;
l9_460=l9_457*l9_458;
float l9_461=0.0;
l9_461=radians(l9_460);
float l9_462=0.0;
l9_462=l9_456+l9_461;
float l9_463=0.0;
l9_463=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_464=0.0;
l9_464=radians(l9_463);
float l9_465=0.0;
l9_465=l9_464/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_466=0.0;
l9_466=l9_462+l9_465;
float l9_467=0.0;
l9_467=float(l9_454<l9_466);
float l9_468=0.0;
l9_468=l9_462-l9_465;
float l9_469=0.0;
l9_469=float(l9_454>l9_468);
float l9_470=0.0;
float l9_471=l9_467;
bool l9_472=(l9_471*1.0)!=0.0;
bool l9_473;
if (l9_472)
{
l9_473=(l9_469*1.0)!=0.0;
}
else
{
l9_473=l9_472;
}
l9_470=float(l9_473);
float l9_474=0.0;
l9_474=(l9_458==(*sc_set0.UserUniforms).Port_Input1_N035) ? 0.0 : 1.0;
float l9_475=0.0;
float l9_476=float((*sc_set0.UserUniforms).multipleInteractorsActive!=0);
l9_475=l9_476;
float l9_477=0.0;
float l9_478=l9_474;
bool l9_479=(l9_478*1.0)!=0.0;
bool l9_480;
if (l9_479)
{
l9_480=(l9_475*1.0)!=0.0;
}
else
{
l9_480=l9_479;
}
l9_477=float(l9_480);
float l9_481=0.0;
float l9_482=l9_470;
bool l9_483=(l9_482*1.0)!=0.0;
bool l9_484;
if (l9_483)
{
l9_484=(l9_477*1.0)!=0.0;
}
else
{
l9_484=l9_483;
}
l9_481=float(l9_484);
float l9_485=0.0;
l9_485=((l9_481*1.0)!=0.0) ? 0.0 : 1.0;
float l9_486=0.0;
float l9_487=l9_441;
bool l9_488=(l9_487*1.0)!=0.0;
bool l9_489;
if (l9_488)
{
l9_489=(l9_485*1.0)!=0.0;
}
else
{
l9_489=l9_488;
}
l9_486=float(l9_489);
l9_350=l9_486;
float2 l9_490=float2(0.0);
l9_490=l9_355.Surface_UVCoord0;
float2 l9_491=float2(0.0);
l9_491=(((l9_490-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_492=float2(0.0);
l9_492=((l9_491-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_493=0.0;
float l9_494=(*sc_set0.UserUniforms).outlineOffset;
l9_493=l9_494;
float l9_495=0.0;
float l9_496=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_497=l9_496+0.001;
l9_497-=0.001;
l9_495=l9_497;
float l9_498=0.0;
l9_498=l9_493+l9_495;
float l9_499=0.0;
float l9_500=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_501=l9_500+0.001;
l9_501-=0.001;
l9_499=l9_501;
float l9_502=0.0;
l9_502=l9_493+l9_499;
float l9_503=0.0;
l9_503=l9_498+l9_502;
float l9_504=0.0;
l9_504=l9_503/((*sc_set0.UserUniforms).Port_Input1_N094+1.234e-06);
float2 l9_505=float2(0.0);
l9_505.x=l9_504;
l9_505.y=l9_504;
float l9_506=0.0;
l9_506=3.1415927;
float l9_507=0.0;
l9_507=l9_506*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_508=0.0;
l9_508=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_509=0.0;
float l9_510=float((*sc_set0.UserUniforms).handType);
l9_509=l9_510;
float l9_511=0.0;
l9_511=l9_508*l9_509;
float l9_512=0.0;
l9_512=radians(l9_511);
float l9_513=0.0;
l9_513=l9_507+l9_512;
float l9_514=0.0;
l9_514=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_515=0.0;
l9_515=radians(l9_514);
float l9_516=0.0;
l9_516=l9_515/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_517=0.0;
l9_517=l9_513+l9_516;
float l9_518=0.0;
l9_518=cos(l9_517);
float l9_519=0.0;
l9_519=sin(l9_517);
float2 l9_520=float2(0.0);
l9_520.x=l9_518;
l9_520.y=l9_519;
float2 l9_521=float2(0.0);
l9_521=l9_505*l9_520;
float l9_522=0.0;
l9_522=distance(l9_492,l9_521);
float l9_523=0.0;
l9_523=l9_498-l9_502;
float l9_524=0.0;
l9_524=l9_523/((*sc_set0.UserUniforms).Port_Input1_N112+1.234e-06);
float l9_525=0.0;
float l9_526=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_525=l9_526;
float l9_527=0.0;
l9_527=l9_524+l9_525;
float l9_528=0.0;
l9_528=float(l9_522<l9_527);
float l9_529=0.0;
l9_529=l9_513-l9_516;
float l9_530=0.0;
l9_530=cos(l9_529);
float l9_531=0.0;
l9_531=sin(l9_529);
float2 l9_532=float2(0.0);
l9_532.x=l9_530;
l9_532.y=l9_531;
float2 l9_533=float2(0.0);
l9_533=l9_505*l9_532;
float l9_534=0.0;
l9_534=distance(l9_492,l9_533);
float l9_535=0.0;
l9_535=float(l9_534<l9_527);
float l9_536=0.0;
float l9_537=l9_528;
bool l9_538=(l9_537*1.0)!=0.0;
bool l9_539;
if (!l9_538)
{
l9_539=(l9_535*1.0)!=0.0;
}
else
{
l9_539=l9_538;
}
l9_536=float(l9_539);
float l9_540=0.0;
float l9_541=0.0;
float2 l9_542=l9_492;
float l9_543=l9_542.x;
float l9_544=l9_542.y;
l9_540=l9_543;
l9_541=l9_544;
float l9_545=0.0;
l9_545=atan2(l9_541,l9_540);
float l9_546=0.0;
l9_546=3.1415927;
float l9_547=0.0;
l9_547=l9_546*(*sc_set0.UserUniforms).Port_Input1_N071;
float l9_548=0.0;
l9_548=l9_545+l9_547;
float l9_549=0.0;
l9_549=mod(l9_548,l9_547);
float l9_550=0.0;
l9_550=float(l9_549<l9_517);
float l9_551=0.0;
l9_551=float(l9_549>l9_529);
float l9_552=0.0;
float l9_553=l9_550;
bool l9_554=(l9_553*1.0)!=0.0;
bool l9_555;
if (l9_554)
{
l9_555=(l9_551*1.0)!=0.0;
}
else
{
l9_555=l9_554;
}
l9_552=float(l9_555);
float l9_556=0.0;
l9_556=(l9_509==(*sc_set0.UserUniforms).Port_Input1_N035) ? 0.0 : 1.0;
float l9_557=0.0;
float l9_558=float((*sc_set0.UserUniforms).multipleInteractorsActive!=0);
l9_557=l9_558;
float l9_559=0.0;
float l9_560=l9_556;
bool l9_561=(l9_560*1.0)!=0.0;
bool l9_562;
if (l9_561)
{
l9_562=(l9_557*1.0)!=0.0;
}
else
{
l9_562=l9_561;
}
l9_559=float(l9_562);
float l9_563=0.0;
float l9_564=l9_552;
bool l9_565=(l9_564*1.0)!=0.0;
bool l9_566;
if (l9_565)
{
l9_566=(l9_559*1.0)!=0.0;
}
else
{
l9_566=l9_565;
}
l9_563=float(l9_566);
float l9_567=0.0;
float l9_568=l9_536;
bool l9_569=(l9_568*1.0)!=0.0;
bool l9_570;
if (l9_569)
{
l9_570=(l9_563*1.0)!=0.0;
}
else
{
l9_570=l9_569;
}
l9_567=float(l9_570);
l9_352=l9_567;
float l9_571;
if ((l9_346*1.0)!=0.0)
{
l9_571=l9_347;
}
else
{
if ((l9_348*1.0)!=0.0)
{
l9_571=l9_349;
}
else
{
if ((l9_350*1.0)!=0.0)
{
l9_571=l9_351;
}
else
{
if ((l9_352*1.0)!=0.0)
{
l9_571=l9_353;
}
else
{
l9_571=l9_354;
}
}
}
}
l9_345=l9_571;
l9_160=l9_345;
float4 l9_572;
if ((l9_156*1.0)!=0.0)
{
float3 l9_573=float3(0.0);
float l9_574=0.0;
float3 l9_575=(*sc_set0.UserUniforms).Port_Value1_N048;
float3 l9_576=(*sc_set0.UserUniforms).Port_Default_N048;
float l9_577=0.0;
float l9_578=float((*sc_set0.UserUniforms).isTriggering!=0);
l9_577=l9_578;
l9_574=l9_577;
float3 l9_579;
if ((l9_574*1.0)!=0.0)
{
l9_579=l9_575;
}
else
{
l9_579=l9_576;
}
l9_573=l9_579;
float2 l9_580=float2(0.0);
l9_580=l9_163.Surface_UVCoord0;
float2 l9_581=float2(0.0);
l9_581=(((l9_580-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_582=float2(0.0);
l9_582=((l9_581-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_583=float2(0.0);
l9_583.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_583.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_584=0.0;
l9_584=distance(l9_582,l9_583);
float l9_585=0.0;
l9_585=mix((*sc_set0.UserUniforms).Port_Input0_N083,(*sc_set0.UserUniforms).Port_Input1_N083,l9_584);
float4 l9_586=float4(0.0);
l9_586=float4(l9_573.x,l9_573.y,l9_573.z,l9_586.w);
l9_586.w=l9_585;
l9_157=l9_586;
l9_572=l9_157;
}
else
{
if ((l9_158*1.0)!=0.0)
{
float l9_587=0.0;
float l9_588=(*sc_set0.UserUniforms).maxAlpha;
l9_587=l9_588;
float l9_589=0.0;
float l9_590=(*sc_set0.UserUniforms).outlineAlpha;
l9_589=l9_590;
float l9_591=0.0;
l9_591=fast::min(l9_587,l9_589);
float4 l9_592=float4(0.0);
l9_592=float4((*sc_set0.UserUniforms).Port_Value1_N014.x,(*sc_set0.UserUniforms).Port_Value1_N014.y,(*sc_set0.UserUniforms).Port_Value1_N014.z,l9_592.w);
l9_592.w=l9_591;
l9_159=l9_592;
l9_572=l9_159;
}
else
{
if ((l9_160*1.0)!=0.0)
{
float l9_593=0.0;
float l9_594=0.0;
float l9_595=0.0;
float l9_596=0.0;
float l9_597=0.0;
float l9_598=0.0;
float l9_599=0.0;
float l9_600=0.0;
float l9_601=0.0;
float l9_602=(*sc_set0.UserUniforms).Port_Default_N155;
ssGlobals l9_603=l9_163;
float2 l9_604=float2(0.0);
l9_604=l9_603.Surface_UVCoord0;
float2 l9_605=float2(0.0);
l9_605=(((l9_604-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_606=float2(0.0);
l9_606=((l9_605-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_607=0.0;
float l9_608=(*sc_set0.UserUniforms).outlineOffset;
l9_607=l9_608;
float l9_609=0.0;
float l9_610=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_611=l9_610+0.001;
l9_611-=0.001;
l9_609=l9_611;
float l9_612=0.0;
l9_612=l9_607+l9_609;
float l9_613=0.0;
float l9_614=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_615=l9_614+0.001;
l9_615-=0.001;
l9_613=l9_615;
float l9_616=0.0;
l9_616=l9_607+l9_613;
float l9_617=0.0;
l9_617=l9_612+l9_616;
float l9_618=0.0;
l9_618=l9_617/((*sc_set0.UserUniforms).Port_Input1_N054+1.234e-06);
float2 l9_619=float2(0.0);
l9_619.x=l9_618;
l9_619.y=l9_618;
float l9_620=0.0;
l9_620=3.1415927;
float l9_621=0.0;
l9_621=l9_620*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_622=0.0;
l9_622=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_623=0.0;
float l9_624=float((*sc_set0.UserUniforms).handType);
l9_623=l9_624;
float l9_625=0.0;
l9_625=l9_622*l9_623;
float l9_626=0.0;
l9_626=radians(l9_625);
float l9_627=0.0;
l9_627=l9_621+l9_626;
float l9_628=0.0;
l9_628=cos(l9_627);
float l9_629=0.0;
l9_629=sin(l9_627);
float2 l9_630=float2(0.0);
l9_630.x=l9_628;
l9_630.y=l9_629;
float2 l9_631=float2(0.0);
l9_631=l9_619*l9_630;
float l9_632=0.0;
l9_632=distance(l9_606,l9_631);
float l9_633=0.0;
l9_633=l9_612-l9_616;
float l9_634=0.0;
float l9_635=(*sc_set0.UserUniforms).Port_Value_N068;
float l9_636=l9_635+0.001;
l9_636-=0.001;
l9_634=l9_636;
float l9_637=0.0;
l9_637=l9_633*l9_634;
float l9_638=0.0;
float l9_639=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_638=l9_639;
float l9_640=0.0;
l9_640=l9_637+l9_638;
float l9_641=0.0;
l9_641=float(l9_632<l9_640);
float l9_642=0.0;
l9_642=(l9_623==(*sc_set0.UserUniforms).Port_Input1_N035) ? 0.0 : 1.0;
float l9_643=0.0;
float l9_644=float((*sc_set0.UserUniforms).multipleInteractorsActive!=0);
l9_643=l9_644;
float l9_645=0.0;
float l9_646=l9_642;
bool l9_647=(l9_646*1.0)!=0.0;
bool l9_648;
if (l9_647)
{
l9_648=(l9_643*1.0)!=0.0;
}
else
{
l9_648=l9_647;
}
l9_645=float(l9_648);
float l9_649=0.0;
float l9_650=l9_641;
bool l9_651=(l9_650*1.0)!=0.0;
bool l9_652;
if (l9_651)
{
l9_652=(l9_645*1.0)!=0.0;
}
else
{
l9_652=l9_651;
}
l9_649=float(l9_652);
l9_594=l9_649;
float2 l9_653=float2(0.0);
l9_653=l9_603.Surface_UVCoord0;
float2 l9_654=float2(0.0);
l9_654=(((l9_653-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_655=float2(0.0);
l9_655=((l9_654-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_656=float2(0.0);
l9_656.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_656.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_657=0.0;
l9_657=distance(l9_655,l9_656);
float l9_658=0.0;
float l9_659=(*sc_set0.UserUniforms).circleSquishScale;
l9_658=l9_659;
float l9_660=0.0;
float l9_661=(*sc_set0.UserUniforms).Port_Value_N042;
float l9_662=l9_661+0.001;
l9_662-=0.001;
l9_660=l9_662;
float l9_663=0.0;
l9_663=l9_658*l9_660;
float l9_664=0.0;
float l9_665=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_664=l9_665;
float l9_666=0.0;
l9_666=l9_663+l9_664;
float l9_667=0.0;
l9_667=float(l9_657<l9_666);
l9_596=l9_667;
float2 l9_668=float2(0.0);
l9_668=l9_603.Surface_UVCoord0;
float2 l9_669=float2(0.0);
l9_669=(((l9_668-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_670=float2(0.0);
l9_670=((l9_669-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_671=0.0;
float l9_672=(*sc_set0.UserUniforms).outlineOffset;
l9_671=l9_672;
float l9_673=0.0;
float l9_674=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_675=l9_674+0.001;
l9_675-=0.001;
l9_673=l9_675;
float l9_676=0.0;
l9_676=l9_671+l9_673;
float l9_677=0.0;
float l9_678=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_679=l9_678+0.001;
l9_679-=0.001;
l9_677=l9_679;
float l9_680=0.0;
l9_680=l9_671+l9_677;
float l9_681=0.0;
l9_681=l9_676+l9_680;
float l9_682=0.0;
l9_682=l9_681/((*sc_set0.UserUniforms).Port_Input1_N094+1.234e-06);
float2 l9_683=float2(0.0);
l9_683.x=l9_682;
l9_683.y=l9_682;
float l9_684=0.0;
l9_684=3.1415927;
float l9_685=0.0;
l9_685=l9_684*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_686=0.0;
l9_686=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_687=0.0;
float l9_688=float((*sc_set0.UserUniforms).handType);
l9_687=l9_688;
float l9_689=0.0;
l9_689=l9_686*l9_687;
float l9_690=0.0;
l9_690=radians(l9_689);
float l9_691=0.0;
l9_691=l9_685+l9_690;
float l9_692=0.0;
l9_692=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_693=0.0;
l9_693=radians(l9_692);
float l9_694=0.0;
l9_694=l9_693/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_695=0.0;
l9_695=l9_691+l9_694;
float l9_696=0.0;
l9_696=cos(l9_695);
float l9_697=0.0;
l9_697=sin(l9_695);
float2 l9_698=float2(0.0);
l9_698.x=l9_696;
l9_698.y=l9_697;
float2 l9_699=float2(0.0);
l9_699=l9_683*l9_698;
float l9_700=0.0;
l9_700=distance(l9_670,l9_699);
float l9_701=0.0;
l9_701=l9_676-l9_680;
float l9_702=0.0;
l9_702=l9_701/((*sc_set0.UserUniforms).Port_Input1_N112+1.234e-06);
float l9_703=0.0;
float l9_704=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_703=l9_704;
float l9_705=0.0;
l9_705=l9_702+l9_703;
float l9_706=0.0;
l9_706=float(l9_700<l9_705);
float l9_707=0.0;
l9_707=l9_691-l9_694;
float l9_708=0.0;
l9_708=cos(l9_707);
float l9_709=0.0;
l9_709=sin(l9_707);
float2 l9_710=float2(0.0);
l9_710.x=l9_708;
l9_710.y=l9_709;
float2 l9_711=float2(0.0);
l9_711=l9_683*l9_710;
float l9_712=0.0;
l9_712=distance(l9_670,l9_711);
float l9_713=0.0;
l9_713=float(l9_712<l9_705);
float l9_714=0.0;
float l9_715=l9_706;
bool l9_716=(l9_715*1.0)!=0.0;
bool l9_717;
if (!l9_716)
{
l9_717=(l9_713*1.0)!=0.0;
}
else
{
l9_717=l9_716;
}
l9_714=float(l9_717);
float l9_718=0.0;
float l9_719=0.0;
float2 l9_720=l9_670;
float l9_721=l9_720.x;
float l9_722=l9_720.y;
l9_718=l9_721;
l9_719=l9_722;
float l9_723=0.0;
l9_723=atan2(l9_719,l9_718);
float l9_724=0.0;
l9_724=3.1415927;
float l9_725=0.0;
l9_725=l9_724*(*sc_set0.UserUniforms).Port_Input1_N071;
float l9_726=0.0;
l9_726=l9_723+l9_725;
float l9_727=0.0;
l9_727=mod(l9_726,l9_725);
float l9_728=0.0;
l9_728=float(l9_727<l9_695);
float l9_729=0.0;
l9_729=float(l9_727>l9_707);
float l9_730=0.0;
float l9_731=l9_728;
bool l9_732=(l9_731*1.0)!=0.0;
bool l9_733;
if (l9_732)
{
l9_733=(l9_729*1.0)!=0.0;
}
else
{
l9_733=l9_732;
}
l9_730=float(l9_733);
float l9_734=0.0;
l9_734=(l9_687==(*sc_set0.UserUniforms).Port_Input1_N035) ? 0.0 : 1.0;
float l9_735=0.0;
float l9_736=float((*sc_set0.UserUniforms).multipleInteractorsActive!=0);
l9_735=l9_736;
float l9_737=0.0;
float l9_738=l9_734;
bool l9_739=(l9_738*1.0)!=0.0;
bool l9_740;
if (l9_739)
{
l9_740=(l9_735*1.0)!=0.0;
}
else
{
l9_740=l9_739;
}
l9_737=float(l9_740);
float l9_741=0.0;
float l9_742=l9_730;
bool l9_743=(l9_742*1.0)!=0.0;
bool l9_744;
if (l9_743)
{
l9_744=(l9_737*1.0)!=0.0;
}
else
{
l9_744=l9_743;
}
l9_741=float(l9_744);
float l9_745=0.0;
float l9_746=l9_714;
bool l9_747=(l9_746*1.0)!=0.0;
bool l9_748;
if (l9_747)
{
l9_748=(l9_741*1.0)!=0.0;
}
else
{
l9_748=l9_747;
}
l9_745=float(l9_748);
l9_598=l9_745;
float2 l9_749=float2(0.0);
l9_749=l9_603.Surface_UVCoord0;
float2 l9_750=float2(0.0);
l9_750=(((l9_749-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_751=float2(0.0);
l9_751=((l9_750-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_752=float2(0.0);
l9_752.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_752.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_753=0.0;
l9_753=distance(l9_751,l9_752);
float l9_754=0.0;
float l9_755=(*sc_set0.UserUniforms).outlineOffset;
l9_754=l9_755;
float l9_756=0.0;
float l9_757=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_758=l9_757+0.001;
l9_758-=0.001;
l9_756=l9_758;
float l9_759=0.0;
l9_759=l9_754+l9_756;
float l9_760=0.0;
float l9_761=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_760=l9_761;
float l9_762=0.0;
l9_762=l9_759+l9_760;
float l9_763=0.0;
l9_763=float(l9_753<l9_762);
float l9_764=0.0;
float l9_765=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_766=l9_765+0.001;
l9_766-=0.001;
l9_764=l9_766;
float l9_767=0.0;
l9_767=l9_754+l9_764;
float l9_768=0.0;
l9_768=l9_767-l9_760;
float l9_769=0.0;
l9_769=float(l9_753>l9_768);
float l9_770=0.0;
float l9_771=l9_763;
bool l9_772=(l9_771*1.0)!=0.0;
bool l9_773;
if (l9_772)
{
l9_773=(l9_769*1.0)!=0.0;
}
else
{
l9_773=l9_772;
}
l9_770=float(l9_773);
float l9_774=0.0;
float l9_775=0.0;
float2 l9_776=l9_751;
float l9_777=l9_776.x;
float l9_778=l9_776.y;
l9_774=l9_777;
l9_775=l9_778;
float l9_779=0.0;
l9_779=atan2(l9_775,l9_774);
float l9_780=0.0;
l9_780=3.1415927;
float l9_781=0.0;
l9_781=l9_780*(*sc_set0.UserUniforms).Port_Input1_N071;
float l9_782=0.0;
l9_782=l9_779+l9_781;
float l9_783=0.0;
l9_783=mod(l9_782,l9_781);
float l9_784=0.0;
l9_784=3.1415927;
float l9_785=0.0;
l9_785=l9_784*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_786=0.0;
l9_786=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_787=0.0;
float l9_788=float((*sc_set0.UserUniforms).handType);
l9_787=l9_788;
float l9_789=0.0;
l9_789=l9_786*l9_787;
float l9_790=0.0;
l9_790=radians(l9_789);
float l9_791=0.0;
l9_791=l9_785+l9_790;
float l9_792=0.0;
l9_792=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_793=0.0;
l9_793=radians(l9_792);
float l9_794=0.0;
l9_794=l9_793/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_795=0.0;
l9_795=l9_791+l9_794;
float l9_796=0.0;
l9_796=float(l9_783<l9_795);
float l9_797=0.0;
l9_797=l9_791-l9_794;
float l9_798=0.0;
l9_798=float(l9_783>l9_797);
float l9_799=0.0;
float l9_800=l9_796;
bool l9_801=(l9_800*1.0)!=0.0;
bool l9_802;
if (l9_801)
{
l9_802=(l9_798*1.0)!=0.0;
}
else
{
l9_802=l9_801;
}
l9_799=float(l9_802);
float l9_803=0.0;
l9_803=(l9_787==(*sc_set0.UserUniforms).Port_Input1_N035) ? 0.0 : 1.0;
float l9_804=0.0;
float l9_805=float((*sc_set0.UserUniforms).multipleInteractorsActive!=0);
l9_804=l9_805;
float l9_806=0.0;
float l9_807=l9_803;
bool l9_808=(l9_807*1.0)!=0.0;
bool l9_809;
if (l9_808)
{
l9_809=(l9_804*1.0)!=0.0;
}
else
{
l9_809=l9_808;
}
l9_806=float(l9_809);
float l9_810=0.0;
float l9_811=l9_799;
bool l9_812=(l9_811*1.0)!=0.0;
bool l9_813;
if (l9_812)
{
l9_813=(l9_806*1.0)!=0.0;
}
else
{
l9_813=l9_812;
}
l9_810=float(l9_813);
float l9_814=0.0;
l9_814=((l9_810*1.0)!=0.0) ? 0.0 : 1.0;
float l9_815=0.0;
float l9_816=l9_770;
bool l9_817=(l9_816*1.0)!=0.0;
bool l9_818;
if (l9_817)
{
l9_818=(l9_814*1.0)!=0.0;
}
else
{
l9_818=l9_817;
}
l9_815=float(l9_818);
l9_600=l9_815;
float l9_819;
if ((l9_594*1.0)!=0.0)
{
float2 l9_820=float2(0.0);
l9_820=l9_603.Surface_UVCoord0;
float2 l9_821=float2(0.0);
l9_821=(((l9_820-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_822=float2(0.0);
l9_822=((l9_821-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_823=0.0;
float l9_824=(*sc_set0.UserUniforms).outlineOffset;
l9_823=l9_824;
float l9_825=0.0;
float l9_826=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_827=l9_826+0.001;
l9_827-=0.001;
l9_825=l9_827;
float l9_828=0.0;
l9_828=l9_823+l9_825;
float l9_829=0.0;
float l9_830=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_831=l9_830+0.001;
l9_831-=0.001;
l9_829=l9_831;
float l9_832=0.0;
l9_832=l9_823+l9_829;
float l9_833=0.0;
l9_833=l9_828+l9_832;
float l9_834=0.0;
l9_834=l9_833/((*sc_set0.UserUniforms).Port_Input1_N054+1.234e-06);
float2 l9_835=float2(0.0);
l9_835.x=l9_834;
l9_835.y=l9_834;
float l9_836=0.0;
l9_836=3.1415927;
float l9_837=0.0;
l9_837=l9_836*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_838=0.0;
l9_838=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_839=0.0;
float l9_840=float((*sc_set0.UserUniforms).handType);
l9_839=l9_840;
float l9_841=0.0;
l9_841=l9_838*l9_839;
float l9_842=0.0;
l9_842=radians(l9_841);
float l9_843=0.0;
l9_843=l9_837+l9_842;
float l9_844=0.0;
l9_844=cos(l9_843);
float l9_845=0.0;
l9_845=sin(l9_843);
float2 l9_846=float2(0.0);
l9_846.x=l9_844;
l9_846.y=l9_845;
float2 l9_847=float2(0.0);
l9_847=l9_835*l9_846;
float l9_848=0.0;
l9_848=distance(l9_822,l9_847);
float l9_849=0.0;
l9_849=l9_828-l9_832;
float l9_850=0.0;
float l9_851=(*sc_set0.UserUniforms).Port_Value_N068;
float l9_852=l9_851+0.001;
l9_852-=0.001;
l9_850=l9_852;
float l9_853=0.0;
l9_853=l9_849*l9_850;
float l9_854=0.0;
float l9_855=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_854=l9_855;
float l9_856=0.0;
l9_856=l9_853+l9_854;
float l9_857=0.0;
float l9_858=(*sc_set0.UserUniforms).shadowOpacity;
l9_857=l9_858;
float l9_859=0.0;
float l9_860=l9_848;
float l9_861=l9_853;
float l9_862=l9_856;
float l9_863=l9_857;
float l9_864=(*sc_set0.UserUniforms).Port_RangeMaxB_N151;
float l9_865=(((l9_860-l9_861)/((l9_862-l9_861)+1e-06))*(l9_864-l9_863))+l9_863;
float l9_866;
if (l9_864>l9_863)
{
l9_866=fast::clamp(l9_865,l9_863,l9_864);
}
else
{
l9_866=fast::clamp(l9_865,l9_864,l9_863);
}
l9_865=l9_866;
l9_859=l9_865;
l9_595=l9_859;
l9_819=l9_595;
}
else
{
if ((l9_596*1.0)!=0.0)
{
float2 l9_867=float2(0.0);
l9_867=l9_603.Surface_UVCoord0;
float2 l9_868=float2(0.0);
l9_868=(((l9_867-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_869=float2(0.0);
l9_869=((l9_868-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_870=float2(0.0);
l9_870.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_870.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_871=0.0;
l9_871=distance(l9_869,l9_870);
float l9_872=0.0;
float l9_873=(*sc_set0.UserUniforms).circleSquishScale;
l9_872=l9_873;
float l9_874=0.0;
float l9_875=(*sc_set0.UserUniforms).Port_Value_N042;
float l9_876=l9_875+0.001;
l9_876-=0.001;
l9_874=l9_876;
float l9_877=0.0;
l9_877=l9_872*l9_874;
float l9_878=0.0;
float l9_879=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_878=l9_879;
float l9_880=0.0;
l9_880=l9_877+l9_878;
float l9_881=0.0;
float l9_882=(*sc_set0.UserUniforms).shadowOpacity;
l9_881=l9_882;
float l9_883=0.0;
float l9_884=l9_871;
float l9_885=l9_877;
float l9_886=l9_880;
float l9_887=l9_881;
float l9_888=(*sc_set0.UserUniforms).Port_RangeMaxB_N152;
float l9_889=(((l9_884-l9_885)/((l9_886-l9_885)+1e-06))*(l9_888-l9_887))+l9_887;
float l9_890;
if (l9_888>l9_887)
{
l9_890=fast::clamp(l9_889,l9_887,l9_888);
}
else
{
l9_890=fast::clamp(l9_889,l9_888,l9_887);
}
l9_889=l9_890;
l9_883=l9_889;
l9_597=l9_883;
l9_819=l9_597;
}
else
{
if ((l9_598*1.0)!=0.0)
{
float l9_891=0.0;
float l9_892=0.0;
float l9_893=0.0;
float l9_894=0.0;
float l9_895=0.0;
float l9_896=(*sc_set0.UserUniforms).Port_Default_N153;
ssGlobals l9_897=l9_603;
float2 l9_898=float2(0.0);
l9_898=l9_897.Surface_UVCoord0;
float2 l9_899=float2(0.0);
l9_899=(((l9_898-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_900=float2(0.0);
l9_900=((l9_899-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_901=0.0;
float l9_902=(*sc_set0.UserUniforms).outlineOffset;
l9_901=l9_902;
float l9_903=0.0;
float l9_904=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_905=l9_904+0.001;
l9_905-=0.001;
l9_903=l9_905;
float l9_906=0.0;
l9_906=l9_901+l9_903;
float l9_907=0.0;
float l9_908=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_909=l9_908+0.001;
l9_909-=0.001;
l9_907=l9_909;
float l9_910=0.0;
l9_910=l9_901+l9_907;
float l9_911=0.0;
l9_911=l9_906+l9_910;
float l9_912=0.0;
l9_912=l9_911/((*sc_set0.UserUniforms).Port_Input1_N094+1.234e-06);
float2 l9_913=float2(0.0);
l9_913.x=l9_912;
l9_913.y=l9_912;
float l9_914=0.0;
l9_914=3.1415927;
float l9_915=0.0;
l9_915=l9_914*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_916=0.0;
l9_916=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_917=0.0;
float l9_918=float((*sc_set0.UserUniforms).handType);
l9_917=l9_918;
float l9_919=0.0;
l9_919=l9_916*l9_917;
float l9_920=0.0;
l9_920=radians(l9_919);
float l9_921=0.0;
l9_921=l9_915+l9_920;
float l9_922=0.0;
l9_922=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_923=0.0;
l9_923=radians(l9_922);
float l9_924=0.0;
l9_924=l9_923/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_925=0.0;
l9_925=l9_921+l9_924;
float l9_926=0.0;
l9_926=cos(l9_925);
float l9_927=0.0;
l9_927=sin(l9_925);
float2 l9_928=float2(0.0);
l9_928.x=l9_926;
l9_928.y=l9_927;
float2 l9_929=float2(0.0);
l9_929=l9_913*l9_928;
float l9_930=0.0;
l9_930=distance(l9_900,l9_929);
float l9_931=0.0;
l9_931=l9_906-l9_910;
float l9_932=0.0;
l9_932=l9_931/((*sc_set0.UserUniforms).Port_Input1_N112+1.234e-06);
float l9_933=0.0;
float l9_934=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_933=l9_934;
float l9_935=0.0;
l9_935=l9_932+l9_933;
float l9_936=0.0;
l9_936=float(l9_930<l9_935);
l9_892=l9_936;
float2 l9_937=float2(0.0);
l9_937=l9_897.Surface_UVCoord0;
float2 l9_938=float2(0.0);
l9_938=(((l9_937-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_939=float2(0.0);
l9_939=((l9_938-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_940=0.0;
float l9_941=(*sc_set0.UserUniforms).outlineOffset;
l9_940=l9_941;
float l9_942=0.0;
float l9_943=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_944=l9_943+0.001;
l9_944-=0.001;
l9_942=l9_944;
float l9_945=0.0;
l9_945=l9_940+l9_942;
float l9_946=0.0;
float l9_947=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_948=l9_947+0.001;
l9_948-=0.001;
l9_946=l9_948;
float l9_949=0.0;
l9_949=l9_940+l9_946;
float l9_950=0.0;
l9_950=l9_945+l9_949;
float l9_951=0.0;
l9_951=l9_950/((*sc_set0.UserUniforms).Port_Input1_N094+1.234e-06);
float2 l9_952=float2(0.0);
l9_952.x=l9_951;
l9_952.y=l9_951;
float l9_953=0.0;
l9_953=3.1415927;
float l9_954=0.0;
l9_954=l9_953*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_955=0.0;
l9_955=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_956=0.0;
float l9_957=float((*sc_set0.UserUniforms).handType);
l9_956=l9_957;
float l9_958=0.0;
l9_958=l9_955*l9_956;
float l9_959=0.0;
l9_959=radians(l9_958);
float l9_960=0.0;
l9_960=l9_954+l9_959;
float l9_961=0.0;
l9_961=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_962=0.0;
l9_962=radians(l9_961);
float l9_963=0.0;
l9_963=l9_962/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_964=0.0;
l9_964=l9_960-l9_963;
float l9_965=0.0;
l9_965=cos(l9_964);
float l9_966=0.0;
l9_966=sin(l9_964);
float2 l9_967=float2(0.0);
l9_967.x=l9_965;
l9_967.y=l9_966;
float2 l9_968=float2(0.0);
l9_968=l9_952*l9_967;
float l9_969=0.0;
l9_969=distance(l9_939,l9_968);
float l9_970=0.0;
l9_970=l9_945-l9_949;
float l9_971=0.0;
l9_971=l9_970/((*sc_set0.UserUniforms).Port_Input1_N112+1.234e-06);
float l9_972=0.0;
float l9_973=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_972=l9_973;
float l9_974=0.0;
l9_974=l9_971+l9_972;
float l9_975=0.0;
l9_975=float(l9_969<l9_974);
l9_894=l9_975;
float l9_976;
if ((l9_892*1.0)!=0.0)
{
float2 l9_977=float2(0.0);
l9_977=l9_897.Surface_UVCoord0;
float2 l9_978=float2(0.0);
l9_978=(((l9_977-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_979=float2(0.0);
l9_979=((l9_978-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_980=0.0;
float l9_981=(*sc_set0.UserUniforms).outlineOffset;
l9_980=l9_981;
float l9_982=0.0;
float l9_983=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_984=l9_983+0.001;
l9_984-=0.001;
l9_982=l9_984;
float l9_985=0.0;
l9_985=l9_980+l9_982;
float l9_986=0.0;
float l9_987=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_988=l9_987+0.001;
l9_988-=0.001;
l9_986=l9_988;
float l9_989=0.0;
l9_989=l9_980+l9_986;
float l9_990=0.0;
l9_990=l9_985+l9_989;
float l9_991=0.0;
l9_991=l9_990/((*sc_set0.UserUniforms).Port_Input1_N094+1.234e-06);
float2 l9_992=float2(0.0);
l9_992.x=l9_991;
l9_992.y=l9_991;
float l9_993=0.0;
l9_993=3.1415927;
float l9_994=0.0;
l9_994=l9_993*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_995=0.0;
l9_995=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_996=0.0;
float l9_997=float((*sc_set0.UserUniforms).handType);
l9_996=l9_997;
float l9_998=0.0;
l9_998=l9_995*l9_996;
float l9_999=0.0;
l9_999=radians(l9_998);
float l9_1000=0.0;
l9_1000=l9_994+l9_999;
float l9_1001=0.0;
l9_1001=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_1002=0.0;
l9_1002=radians(l9_1001);
float l9_1003=0.0;
l9_1003=l9_1002/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_1004=0.0;
l9_1004=l9_1000+l9_1003;
float l9_1005=0.0;
l9_1005=cos(l9_1004);
float l9_1006=0.0;
l9_1006=sin(l9_1004);
float2 l9_1007=float2(0.0);
l9_1007.x=l9_1005;
l9_1007.y=l9_1006;
float2 l9_1008=float2(0.0);
l9_1008=l9_992*l9_1007;
float l9_1009=0.0;
l9_1009=distance(l9_979,l9_1008);
l9_893=l9_1009;
l9_976=l9_893;
}
else
{
if ((l9_894*1.0)!=0.0)
{
float2 l9_1010=float2(0.0);
l9_1010=l9_897.Surface_UVCoord0;
float2 l9_1011=float2(0.0);
l9_1011=(((l9_1010-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_1012=float2(0.0);
l9_1012=((l9_1011-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float l9_1013=0.0;
float l9_1014=(*sc_set0.UserUniforms).outlineOffset;
l9_1013=l9_1014;
float l9_1015=0.0;
float l9_1016=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_1017=l9_1016+0.001;
l9_1017-=0.001;
l9_1015=l9_1017;
float l9_1018=0.0;
l9_1018=l9_1013+l9_1015;
float l9_1019=0.0;
float l9_1020=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_1021=l9_1020+0.001;
l9_1021-=0.001;
l9_1019=l9_1021;
float l9_1022=0.0;
l9_1022=l9_1013+l9_1019;
float l9_1023=0.0;
l9_1023=l9_1018+l9_1022;
float l9_1024=0.0;
l9_1024=l9_1023/((*sc_set0.UserUniforms).Port_Input1_N094+1.234e-06);
float2 l9_1025=float2(0.0);
l9_1025.x=l9_1024;
l9_1025.y=l9_1024;
float l9_1026=0.0;
l9_1026=3.1415927;
float l9_1027=0.0;
l9_1027=l9_1026*(*sc_set0.UserUniforms).Port_Input1_N097;
float l9_1028=0.0;
l9_1028=float((*sc_set0.UserUniforms).Port_Value_N091);
float l9_1029=0.0;
float l9_1030=float((*sc_set0.UserUniforms).handType);
l9_1029=l9_1030;
float l9_1031=0.0;
l9_1031=l9_1028*l9_1029;
float l9_1032=0.0;
l9_1032=radians(l9_1031);
float l9_1033=0.0;
l9_1033=l9_1027+l9_1032;
float l9_1034=0.0;
l9_1034=float((*sc_set0.UserUniforms).Port_Value_N041);
float l9_1035=0.0;
l9_1035=radians(l9_1034);
float l9_1036=0.0;
l9_1036=l9_1035/((*sc_set0.UserUniforms).Port_Input1_N084+1.234e-06);
float l9_1037=0.0;
l9_1037=l9_1033-l9_1036;
float l9_1038=0.0;
l9_1038=cos(l9_1037);
float l9_1039=0.0;
l9_1039=sin(l9_1037);
float2 l9_1040=float2(0.0);
l9_1040.x=l9_1038;
l9_1040.y=l9_1039;
float2 l9_1041=float2(0.0);
l9_1041=l9_1025*l9_1040;
float l9_1042=0.0;
l9_1042=distance(l9_1012,l9_1041);
l9_895=l9_1042;
l9_976=l9_895;
}
else
{
l9_976=l9_896;
}
}
l9_891=l9_976;
float l9_1043=0.0;
float l9_1044=(*sc_set0.UserUniforms).outlineOffset;
l9_1043=l9_1044;
float l9_1045=0.0;
float l9_1046=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_1047=l9_1046+0.001;
l9_1047-=0.001;
l9_1045=l9_1047;
float l9_1048=0.0;
l9_1048=l9_1043+l9_1045;
float l9_1049=0.0;
float l9_1050=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_1051=l9_1050+0.001;
l9_1051-=0.001;
l9_1049=l9_1051;
float l9_1052=0.0;
l9_1052=l9_1043+l9_1049;
float l9_1053=0.0;
l9_1053=l9_1048-l9_1052;
float l9_1054=0.0;
l9_1054=l9_1053/((*sc_set0.UserUniforms).Port_Input1_N112+1.234e-06);
float l9_1055=0.0;
float l9_1056=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_1055=l9_1056;
float l9_1057=0.0;
l9_1057=l9_1054+l9_1055;
float l9_1058=0.0;
float l9_1059=(*sc_set0.UserUniforms).shadowOpacity;
l9_1058=l9_1059;
float l9_1060=0.0;
float l9_1061=l9_891;
float l9_1062=l9_1054;
float l9_1063=l9_1057;
float l9_1064=l9_1058;
float l9_1065=(*sc_set0.UserUniforms).Port_RangeMaxB_N154;
float l9_1066=(((l9_1061-l9_1062)/((l9_1063-l9_1062)+1e-06))*(l9_1065-l9_1064))+l9_1064;
float l9_1067;
if (l9_1065>l9_1064)
{
l9_1067=fast::clamp(l9_1066,l9_1064,l9_1065);
}
else
{
l9_1067=fast::clamp(l9_1066,l9_1065,l9_1064);
}
l9_1066=l9_1067;
l9_1060=l9_1066;
l9_599=l9_1060;
l9_819=l9_599;
}
else
{
if ((l9_600*1.0)!=0.0)
{
float2 l9_1068=float2(0.0);
l9_1068=l9_603.Surface_UVCoord0;
float2 l9_1069=float2(0.0);
l9_1069=(((l9_1068-float2((*sc_set0.UserUniforms).Port_RangeMinA_N001))/float2(((*sc_set0.UserUniforms).Port_RangeMaxA_N001-(*sc_set0.UserUniforms).Port_RangeMinA_N001)+1e-06))*((*sc_set0.UserUniforms).Port_RangeMaxB_N001-(*sc_set0.UserUniforms).Port_RangeMinB_N001))+float2((*sc_set0.UserUniforms).Port_RangeMinB_N001);
float2 l9_1070=float2(0.0);
l9_1070=((l9_1069-(*sc_set0.UserUniforms).Port_Center_N002)*(*sc_set0.UserUniforms).Port_Scale_N002)+(*sc_set0.UserUniforms).Port_Center_N002;
float2 l9_1071=float2(0.0);
l9_1071.x=(*sc_set0.UserUniforms).Port_Value1_N046;
l9_1071.y=(*sc_set0.UserUniforms).Port_Value2_N046;
float l9_1072=0.0;
l9_1072=distance(l9_1070,l9_1071);
float l9_1073=0.0;
float l9_1074=(*sc_set0.UserUniforms).outlineOffset;
l9_1073=l9_1074;
float l9_1075=0.0;
float l9_1076=(*sc_set0.UserUniforms).Port_Value_N036;
float l9_1077=l9_1076+0.001;
l9_1077-=0.001;
l9_1075=l9_1077;
float l9_1078=0.0;
l9_1078=l9_1073+l9_1075;
float l9_1079=0.0;
float l9_1080=(*sc_set0.UserUniforms).Port_Value_N037;
float l9_1081=l9_1080+0.001;
l9_1081-=0.001;
l9_1079=l9_1081;
float l9_1082=0.0;
l9_1082=l9_1073+l9_1079;
float l9_1083=0.0;
l9_1083=l9_1078+l9_1082;
float l9_1084=0.0;
l9_1084=l9_1083/((*sc_set0.UserUniforms).Port_Input1_N143+1.234e-06);
float l9_1085=0.0;
l9_1085=l9_1072-l9_1084;
float l9_1086=0.0;
l9_1086=abs(l9_1085);
float l9_1087=0.0;
l9_1087=l9_1078-l9_1084;
float l9_1088=0.0;
float l9_1089=(*sc_set0.UserUniforms).shadowGradientOffset;
l9_1088=l9_1089;
float l9_1090=0.0;
l9_1090=l9_1087+l9_1088;
float l9_1091=0.0;
float l9_1092=(*sc_set0.UserUniforms).shadowOpacity;
l9_1091=l9_1092;
float l9_1093=0.0;
float l9_1094=l9_1086;
float l9_1095=l9_1087;
float l9_1096=l9_1090;
float l9_1097=l9_1091;
float l9_1098=(*sc_set0.UserUniforms).Port_RangeMaxB_N146;
float l9_1099=(((l9_1094-l9_1095)/((l9_1096-l9_1095)+1e-06))*(l9_1098-l9_1097))+l9_1097;
float l9_1100;
if (l9_1098>l9_1097)
{
l9_1100=fast::clamp(l9_1099,l9_1097,l9_1098);
}
else
{
l9_1100=fast::clamp(l9_1099,l9_1098,l9_1097);
}
l9_1099=l9_1100;
l9_1093=l9_1099;
l9_601=l9_1093;
l9_819=l9_601;
}
else
{
l9_819=l9_602;
}
}
}
}
l9_593=l9_819;
float4 l9_1101=float4(0.0);
l9_1101.x=(*sc_set0.UserUniforms).Port_Value1_N149;
l9_1101.y=(*sc_set0.UserUniforms).Port_Value2_N149;
l9_1101.z=(*sc_set0.UserUniforms).Port_Value3_N149;
l9_1101.w=l9_593;
l9_161=l9_1101;
l9_572=l9_161;
}
else
{
l9_572=l9_162;
}
}
}
l9_155=l9_572;
param_3=l9_155;
param_4=param_3;
}
Result_N33=param_4;
float Value1_N165=0.0;
float Value2_N165=0.0;
float Value3_N165=0.0;
float Value4_N165=0.0;
float4 param_6=Result_N33;
float param_7=param_6.x;
float param_8=param_6.y;
float param_9=param_6.z;
float param_10=param_6.w;
Value1_N165=param_7;
Value2_N165=param_8;
Value3_N165=param_9;
Value4_N165=param_10;
float Output_N163=0.0;
float param_11=(*sc_set0.UserUniforms).masterAlpha;
Output_N163=param_11;
float Output_N166=0.0;
Output_N166=Value4_N165*Output_N163;
float4 Value_N169=float4(0.0);
Value_N169.x=Value1_N165;
Value_N169.y=Value2_N165;
Value_N169.z=Value3_N165;
Value_N169.w=Output_N166;
FinalColor=Value_N169;
float param_12=FinalColor.w;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (param_12<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_1102=gl_FragCoord;
float2 l9_1103=floor(mod(l9_1102.xy,float2(4.0)));
float l9_1104=(mod(dot(l9_1103,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (param_12<l9_1104)
{
discard_fragment();
}
}
if ((*sc_set0.UserUniforms).sc_RayTracingCasterConfiguration.x!=0u)
{
float4 param_13=FinalColor;
if ((int(sc_RayTracingCasterForceOpaque_tmp)!=0))
{
param_13.w=1.0;
}
float4 l9_1105=fast::max(param_13,float4(0.0));
float4 param_14=l9_1105;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_14.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_14;
return out;
}
float4 param_15=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_1106=param_15;
float4 l9_1107=l9_1106;
float l9_1108=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_1108=l9_1107.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_1108=fast::clamp(l9_1107.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_1108=fast::clamp(dot(l9_1107.xyz,float3(l9_1107.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_1108=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_1108=(1.0-dot(l9_1107.xyz,float3(0.33333001)))*l9_1107.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_1108=(1.0-fast::clamp(dot(l9_1107.xyz,float3(1.0)),0.0,1.0))*l9_1107.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_1108=fast::clamp(dot(l9_1107.xyz,float3(1.0)),0.0,1.0)*l9_1107.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_1108=fast::clamp(dot(l9_1107.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_1108=fast::clamp(dot(l9_1107.xyz,float3(1.0)),0.0,1.0)*l9_1107.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_1108=dot(l9_1107.xyz,float3(0.33333001))*l9_1107.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_1108=1.0-fast::clamp(dot(l9_1107.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_1108=fast::clamp(dot(l9_1107.xyz,float3(1.0)),0.0,1.0);
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
float l9_1109=l9_1108;
float l9_1110=l9_1109;
float l9_1111=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_1110;
float3 l9_1112=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_1106.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_1113=float4(l9_1112.x,l9_1112.y,l9_1112.z,l9_1111);
param_15=l9_1113;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_15=float4(param_15.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_1114=param_15;
float4 l9_1115=float4(0.0);
float4 l9_1116=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_1117=out.sc_FragData0;
l9_1116=l9_1117;
}
else
{
float4 l9_1118=gl_FragCoord;
float2 l9_1119=l9_1118.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_1120=l9_1119;
float2 l9_1121=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_1122=1;
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
int l9_1125=l9_1124;
float3 l9_1126=float3(l9_1120,0.0);
int l9_1127=l9_1122;
int l9_1128=l9_1125;
if (l9_1127==1)
{
l9_1126.y=((2.0*l9_1126.y)+float(l9_1128))-1.0;
}
float2 l9_1129=l9_1126.xy;
l9_1121=l9_1129;
}
else
{
l9_1121=l9_1120;
}
float2 l9_1130=l9_1121;
float2 l9_1131=l9_1130;
float2 l9_1132=l9_1131;
float2 l9_1133=l9_1132;
float l9_1134=0.0;
int l9_1135;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_1136=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1136=0;
}
else
{
l9_1136=in.varStereoViewID;
}
int l9_1137=l9_1136;
l9_1135=1-l9_1137;
}
else
{
int l9_1138=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1138=0;
}
else
{
l9_1138=in.varStereoViewID;
}
int l9_1139=l9_1138;
l9_1135=l9_1139;
}
int l9_1140=l9_1135;
float2 l9_1141=l9_1133;
int l9_1142=sc_ScreenTextureLayout_tmp;
int l9_1143=l9_1140;
float l9_1144=l9_1134;
float2 l9_1145=l9_1141;
int l9_1146=l9_1142;
int l9_1147=l9_1143;
float3 l9_1148=float3(0.0);
if (l9_1146==0)
{
l9_1148=float3(l9_1145,0.0);
}
else
{
if (l9_1146==1)
{
l9_1148=float3(l9_1145.x,(l9_1145.y*0.5)+(0.5-(float(l9_1147)*0.5)),0.0);
}
else
{
l9_1148=float3(l9_1145,float(l9_1147));
}
}
float3 l9_1149=l9_1148;
float3 l9_1150=l9_1149;
float4 l9_1151=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_1150.xy,bias(l9_1144));
float4 l9_1152=l9_1151;
float4 l9_1153=l9_1152;
l9_1116=l9_1153;
}
float4 l9_1154=l9_1116;
float3 l9_1155=l9_1154.xyz;
float3 l9_1156=l9_1155;
float3 l9_1157=l9_1114.xyz;
float3 l9_1158=definedBlend(l9_1156,l9_1157,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_1115=float4(l9_1158.x,l9_1158.y,l9_1158.z,l9_1115.w);
float3 l9_1159=mix(l9_1155,l9_1115.xyz,float3(l9_1114.w));
l9_1115=float4(l9_1159.x,l9_1159.y,l9_1159.z,l9_1115.w);
l9_1115.w=1.0;
float4 l9_1160=l9_1115;
param_15=l9_1160;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_1161=float4(in.varScreenPos.xyz,1.0);
param_15=l9_1161;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_1162=gl_FragCoord;
float l9_1163=fast::clamp(abs(l9_1162.z),0.0,1.0);
float4 l9_1164=float4(l9_1163,1.0-l9_1163,1.0,1.0);
param_15=l9_1164;
}
else
{
float4 l9_1165=param_15;
float4 l9_1166=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_1166=float4(mix(float3(1.0),l9_1165.xyz,float3(l9_1165.w)),l9_1165.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_1167=l9_1165.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_1167=fast::clamp(l9_1167,0.0,1.0);
}
l9_1166=float4(l9_1165.xyz*l9_1167,l9_1167);
}
else
{
l9_1166=l9_1165;
}
}
float4 l9_1168=l9_1166;
param_15=l9_1168;
}
}
}
}
}
float4 l9_1169=param_15;
FinalColor=l9_1169;
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
float4 l9_1170=float4(0.0);
l9_1170=float4(0.0);
float4 l9_1171=l9_1170;
float4 Cost=l9_1171;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_16=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_16,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_17=FinalColor;
float4 l9_1172=param_17;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_1172.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_1172;
return out;
}
} // FRAGMENT SHADER
