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
//SG_REFLECTION_BEGIN(200)
//attribute vec4 position 0
//attribute vec3 normal 1
//attribute vec4 tangent 2
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec4 color 5
//output vec4 sc_FragData0 0
//sampler sampler intensityTextureSmpSC 0:21
//sampler sampler renderTarget0SmpSC 0:22
//sampler sampler renderTarget1SmpSC 0:23
//sampler sampler renderTarget2SmpSC 0:24
//sampler sampler renderTarget3SmpSC 0:25
//sampler sampler sc_ScreenTextureSmpSC 0:30
//texture texture2D intensityTexture 0:0:0:21
//texture texture2D renderTarget0 0:1:0:22
//texture texture2D renderTarget1 0:2:0:23
//texture texture2D renderTarget2 0:3:0:24
//texture texture2D renderTarget3 0:4:0:25
//texture texture2D sc_ScreenTexture 0:16:0:30
//ubo int UserUniforms 0:35:7696 {
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4x4 sc_ViewProjectionMatrixArray 1680:[2]:64
//float4x4 sc_ProjectionMatrixArray 2384:[2]:64
//float4 sc_CurrentRenderTargetDims 3456
//sc_Camera_t sc_Camera 3472
//float3 sc_Camera.position 0
//float sc_Camera.aspect 16
//float2 sc_Camera.clipPlanes 24
//float4 sc_StereoClipPlanes 3664:[2]:16
//float correctedIntensity 3952
//float3x3 intensityTextureTransform 4016
//float4 intensityTextureUvMinMax 4064
//float4 intensityTextureBorderColor 4080
//int overrideTimeEnabled 4108
//float overrideTimeElapsed 4112:[32]:4
//float overrideTimeDelta 4240
//int vfxNumCopies 4244
//bool vfxBatchEnable 4248:[32]:4
//int vfxOffsetInstancesRead 7348
//float2 vfxTargetSizeRead 7360
//int vfxTargetWidth 7376
//float3 Port_Normal_N002 7440
//float Port_Exponent_N002 7456
//float Port_Intensity_N002 7460
//float Port_Input1_N063 7464
//float Port_Input1_N017 7468
//float Port_RangeMinA_N018 7472
//float Port_RangeMaxA_N018 7476
//float Port_RangeMinB_N018 7480
//float Port_RangeMaxB_N018 7484
//float Port_Input1_N065 7488
//float Port_Input2_N065 7492
//float4 Port_Input1_N066 7504
//float4 Port_Value0_N068 7520
//float Port_Position1_N068 7536
//float4 Port_Value1_N068 7552
//float Port_Position2_N068 7568
//float4 Port_Value2_N068 7584
//float4 Port_Value3_N068 7600
//float Port_Input1_N067 7616
//float4 Port_Value0_N178 7632
//float Port_Position1_N178 7648
//float4 Port_Value1_N178 7664
//float4 Port_Value2_N178 7680
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
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 30 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 31 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 32 0
//spec_const bool intensityTextureHasSwappedViews 33 0
//spec_const bool renderTarget0HasSwappedViews 34 0
//spec_const bool renderTarget1HasSwappedViews 35 0
//spec_const bool renderTarget2HasSwappedViews 36 0
//spec_const bool renderTarget3HasSwappedViews 37 0
//spec_const bool sc_BlendMode_Custom 38 0
//spec_const bool sc_BlendMode_MultiplyOriginal 39 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 40 0
//spec_const bool sc_BlendMode_Screen 41 0
//spec_const bool sc_FramebufferFetch 42 0
//spec_const bool sc_MotionVectorsPass 43 0
//spec_const bool sc_OutputBounds 44 0
//spec_const bool sc_RenderAlphaToColor 45 0
//spec_const bool sc_ScreenTextureHasSwappedViews 46 0
//spec_const bool sc_Voxelization 47 0
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 48 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 49 -1
//spec_const int intensityTextureLayout 50 0
//spec_const int renderTarget0Layout 51 0
//spec_const int renderTarget1Layout 52 0
//spec_const int renderTarget2Layout 53 0
//spec_const int renderTarget3Layout 54 0
//spec_const int sc_DepthBufferMode 55 0
//spec_const int sc_ScreenTextureLayout 56 0
//spec_const int sc_ShaderCacheConstant 57 0
//spec_const int sc_StereoRenderingMode 58 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 59 0
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
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(30)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(31)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(32)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool intensityTextureHasSwappedViews [[function_constant(33)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool renderTarget0HasSwappedViews [[function_constant(34)]];
constant bool renderTarget0HasSwappedViews_tmp = is_function_constant_defined(renderTarget0HasSwappedViews) ? renderTarget0HasSwappedViews : false;
constant bool renderTarget1HasSwappedViews [[function_constant(35)]];
constant bool renderTarget1HasSwappedViews_tmp = is_function_constant_defined(renderTarget1HasSwappedViews) ? renderTarget1HasSwappedViews : false;
constant bool renderTarget2HasSwappedViews [[function_constant(36)]];
constant bool renderTarget2HasSwappedViews_tmp = is_function_constant_defined(renderTarget2HasSwappedViews) ? renderTarget2HasSwappedViews : false;
constant bool renderTarget3HasSwappedViews [[function_constant(37)]];
constant bool renderTarget3HasSwappedViews_tmp = is_function_constant_defined(renderTarget3HasSwappedViews) ? renderTarget3HasSwappedViews : false;
constant bool sc_BlendMode_Custom [[function_constant(38)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(39)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(40)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_Screen [[function_constant(41)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_FramebufferFetch [[function_constant(42)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_MotionVectorsPass [[function_constant(43)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OutputBounds [[function_constant(44)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_RenderAlphaToColor [[function_constant(45)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(46)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_Voxelization [[function_constant(47)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(48)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(49)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int intensityTextureLayout [[function_constant(50)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int renderTarget0Layout [[function_constant(51)]];
constant int renderTarget0Layout_tmp = is_function_constant_defined(renderTarget0Layout) ? renderTarget0Layout : 0;
constant int renderTarget1Layout [[function_constant(52)]];
constant int renderTarget1Layout_tmp = is_function_constant_defined(renderTarget1Layout) ? renderTarget1Layout : 0;
constant int renderTarget2Layout [[function_constant(53)]];
constant int renderTarget2Layout_tmp = is_function_constant_defined(renderTarget2Layout) ? renderTarget2Layout : 0;
constant int renderTarget3Layout [[function_constant(54)]];
constant int renderTarget3Layout_tmp = is_function_constant_defined(renderTarget3Layout) ? renderTarget3Layout : 0;
constant int sc_DepthBufferMode [[function_constant(55)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_ScreenTextureLayout [[function_constant(56)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(57)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_StereoRenderingMode [[function_constant(58)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(59)]];
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
struct ssParticle
{
float3 Position;
float3 Velocity;
float4 Color;
float Size;
float Age;
float Life;
float Mass;
float3x3 Matrix;
bool Dead;
float4 Quaternion;
float SpawnIndex;
float SpawnIndexRemainder;
float NextBurstTime;
float collisionCount_N119;
float SpawnOffset;
float Seed;
float2 Seed2000;
float TimeShift;
int Index1D;
int Index1DPerCopy;
float Index1DPerCopyF;
int StateID;
float Coord1D;
float Ratio1D;
float Ratio1DPerCopy;
int2 Index2D;
float2 Coord2D;
float2 Ratio2D;
float3 Force;
bool Spawned;
float CopyId;
float SpawnAmount;
float BurstAmount;
float BurstPeriod;
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
int vfxNumCopies;
int vfxBatchEnable[32];
int vfxEmitParticle[32];
float4x4 vfxModelMatrix[32];
float4 renderTarget0Size;
float4 renderTarget0Dims;
float4 renderTarget0View;
float4 renderTarget1Size;
float4 renderTarget1Dims;
float4 renderTarget1View;
float4 renderTarget2Size;
float4 renderTarget2Dims;
float4 renderTarget2View;
float4 renderTarget3Size;
float4 renderTarget3Dims;
float4 renderTarget3View;
float4 sortRenderTarget0Size;
float4 sortRenderTarget0Dims;
float4 sortRenderTarget0View;
float4 sortRenderTarget1Size;
float4 sortRenderTarget1Dims;
float4 sortRenderTarget1View;
float3 vfxLocalAabbMin;
float3 vfxLocalAabbMax;
float vfxCameraAspect;
float vfxCameraNear;
float vfxCameraFar;
float4x4 vfxProjectionMatrix;
float4x4 vfxProjectionMatrixInverse;
float4x4 vfxViewMatrix;
float4x4 vfxViewMatrixInverse;
float4x4 vfxViewProjectionMatrix;
float4x4 vfxViewProjectionMatrixInverse;
float3 vfxCameraPosition;
float3 vfxCameraUp;
float3 vfxCameraForward;
float3 vfxCameraRight;
int vfxFrame;
int vfxOffsetInstancesRead;
int vfxOffsetInstancesWrite;
float2 vfxTargetSizeRead;
float2 vfxTargetSizeWrite;
int vfxTargetWidth;
float2 ssSORT_RENDER_TARGET_SIZE;
float4 Port_Value1_N132;
float4 Port_Value2_N132;
float Port_AlphaTestThreshold_N039;
float3 Port_Normal_N002;
float Port_Exponent_N002;
float Port_Intensity_N002;
float Port_Input1_N063;
float Port_Input1_N017;
float Port_RangeMinA_N018;
float Port_RangeMaxA_N018;
float Port_RangeMinB_N018;
float Port_RangeMaxB_N018;
float Port_Input1_N065;
float Port_Input2_N065;
float4 Port_Input1_N066;
float4 Port_Value0_N068;
float Port_Position1_N068;
float4 Port_Value1_N068;
float Port_Position2_N068;
float4 Port_Value2_N068;
float4 Port_Value3_N068;
float Port_Input1_N067;
float4 Port_Value0_N178;
float Port_Position1_N178;
float4 Port_Value1_N178;
float4 Port_Value2_N178;
};
struct sc_Set0
{
texture2d<float> intensityTexture [[id(0)]];
texture2d<float> renderTarget0 [[id(1)]];
texture2d<float> renderTarget1 [[id(2)]];
texture2d<float> renderTarget2 [[id(3)]];
texture2d<float> renderTarget3 [[id(4)]];
texture2d<float> sc_ScreenTexture [[id(16)]];
sampler intensityTextureSmpSC [[id(21)]];
sampler renderTarget0SmpSC [[id(22)]];
sampler renderTarget1SmpSC [[id(23)]];
sampler renderTarget2SmpSC [[id(24)]];
sampler renderTarget3SmpSC [[id(25)]];
sampler sc_ScreenTextureSmpSC [[id(30)]];
constant userUniformsObj* UserUniforms [[id(35)]];
};
struct main_vert_out
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float2 varShadowTex [[user(locn6)]];
int varStereoViewID [[user(locn7)]];
float varClipDistance [[user(locn8)]];
float4 varColor [[user(locn9)]];
int Interp_Particle_Index [[user(locn10)]];
float3 Interp_Particle_Force [[user(locn11)]];
float2 Interp_Particle_Coord [[user(locn12)]];
float Interp_Particle_SpawnIndex [[user(locn13)]];
float Interp_Particle_NextBurstTime [[user(locn14)]];
float3 Interp_Particle_Position [[user(locn15)]];
float3 Interp_Particle_Velocity [[user(locn16)]];
float Interp_Particle_Life [[user(locn17)]];
float Interp_Particle_Age [[user(locn18)]];
float Interp_Particle_Size [[user(locn19)]];
float4 Interp_Particle_Color [[user(locn20)]];
float4 Interp_Particle_Quaternion [[user(locn21)]];
float Interp_Particle_collisionCount_N119 [[user(locn22)]];
float Interp_Particle_Mass [[user(locn23)]];
float gParticlesDebug [[user(locn24)]];
float2 ParticleUV [[user(locn25)]];
float4 gl_Position [[position]];
};
struct main_vert_in
{
float4 position [[attribute(0)]];
float3 normal [[attribute(1)]];
float4 tangent [[attribute(2)]];
float2 texture0 [[attribute(3)]];
float2 texture1 [[attribute(4)]];
float4 color [[attribute(5)]];
};
bool ssDecodeParticle(thread const int& InstanceID,thread int& ssInstanceID,thread uint& gl_InstanceIndex,constant userUniformsObj& UserUniforms,thread texture2d<float> renderTarget0,thread sampler renderTarget0SmpSC,thread texture2d<float> renderTarget1,thread sampler renderTarget1SmpSC,thread texture2d<float> renderTarget2,thread sampler renderTarget2SmpSC,thread texture2d<float> renderTarget3,thread sampler renderTarget3SmpSC,thread ssParticle& gParticle)
{
ssParticle param=gParticle;
int param_1=InstanceID;
param.Position=float3(0.0);
param.Velocity=float3(0.0);
param.Color=float4(0.0);
param.Size=0.0;
param.Age=0.0;
param.Life=0.0;
param.Mass=1.0;
param.Matrix=float3x3(float3(1.0,0.0,0.0),float3(0.0,1.0,0.0),float3(0.0,0.0,1.0));
param.Quaternion=float4(0.0,0.0,0.0,1.0);
param.CopyId=float(param_1/40);
param.SpawnIndex=-1.0;
param.SpawnIndexRemainder=-1.0;
param.SpawnAmount=0.0;
param.BurstAmount=0.0;
param.BurstPeriod=0.0;
param.NextBurstTime=0.0;
gParticle=param;
int param_2=InstanceID;
ssParticle param_3=gParticle;
int l9_0=param_2/40;
param_3.Spawned=false;
param_3.Dead=false;
param_3.Force=float3(0.0);
param_3.Index1D=param_2;
param_3.Index1DPerCopy=param_2%40;
param_3.Index1DPerCopyF=float(param_3.Index1DPerCopy);
param_3.StateID=(40*((param_2/40)+1))-1;
int l9_1=param_3.Index1D;
int2 l9_2=int2(l9_1%40,l9_1/40);
param_3.Index2D=l9_2;
int l9_3=param_3.Index1D;
float l9_4=(float(l9_3)+0.5)/40.0;
param_3.Coord1D=l9_4;
int2 l9_5=param_3.Index2D;
float2 l9_6=(float2(l9_5)+float2(0.5))/float2(40.0,1.0);
param_3.Coord2D=l9_6;
int l9_7=param_3.Index1D;
float l9_8=float(l9_7)/39.0;
param_3.Ratio1D=l9_8;
int l9_9=param_3.Index1DPerCopy;
float l9_10=float(l9_9)/39.0;
param_3.Ratio1DPerCopy=l9_10;
int2 l9_11=param_3.Index2D;
float2 l9_12=float2(l9_11)/float2(39.0,1.0);
param_3.Ratio2D=l9_12;
param_3.Seed=0.0;
int l9_13=param_3.Index1D;
int l9_14=l9_13;
int l9_15=((l9_14*((l9_14*1471343)+101146501))+1559861749)&2147483647;
int l9_16=l9_15;
float l9_17=float(l9_16)*4.6566129e-10;
float l9_18=l9_17;
param_3.TimeShift=l9_18;
param_3.SpawnOffset=param_3.Ratio1D*0.2;
ssParticle l9_19=param_3;
int l9_20=l9_0;
float l9_21;
if (UserUniforms.overrideTimeEnabled==1)
{
l9_21=UserUniforms.overrideTimeElapsed[l9_20];
}
else
{
l9_21=UserUniforms.sc_Time.x;
}
float l9_22=l9_21;
l9_19.Seed=(l9_19.Ratio1D*0.97637898)+0.151235;
l9_19.Seed+=(floor(((((l9_22-l9_19.SpawnOffset)-0.0)+0.0)+0.40000001)/0.2)*4.32723);
l9_19.Seed=fract(abs(l9_19.Seed));
int2 l9_23=int2(l9_19.Index1D%400,l9_19.Index1D/400);
l9_19.Seed2000=(float2(l9_23)+float2(1.0))/float2(399.0);
param_3=l9_19;
gParticle=param_3;
int offsetPixelId=(UserUniforms.vfxOffsetInstancesRead+InstanceID)*4;
int param_4=offsetPixelId;
int param_5=UserUniforms.vfxTargetWidth;
int l9_24=param_4-((param_4/param_5)*param_5);
int2 Index2D=int2(l9_24,offsetPixelId/UserUniforms.vfxTargetWidth);
float2 Coord=(float2(Index2D)+float2(0.5))/float2(2048.0,UserUniforms.vfxTargetSizeRead.y);
float2 Offset=float2(0.00048828125,0.0);
float2 uv=float2(0.0);
float Scalar0=0.0;
float Scalar1=0.0;
float Scalar2=0.0;
float Scalar3=0.0;
float Scalar4=0.0;
float Scalar5=0.0;
float Scalar6=0.0;
float Scalar7=0.0;
float Scalar8=0.0;
float Scalar9=0.0;
float Scalar10=0.0;
float Scalar11=0.0;
float Scalar12=0.0;
float Scalar13=0.0;
float Scalar14=0.0;
float Scalar15=0.0;
uv=Coord+(Offset*0.0);
float2 param_6=uv;
float2 l9_25=param_6;
int l9_26;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_27=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_27=0;
}
else
{
l9_27=gl_InstanceIndex%2;
}
int l9_28=l9_27;
l9_26=1-l9_28;
}
else
{
int l9_29=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_29=0;
}
else
{
l9_29=gl_InstanceIndex%2;
}
int l9_30=l9_29;
l9_26=l9_30;
}
int l9_31=l9_26;
float2 l9_32=l9_25;
int l9_33=renderTarget0Layout_tmp;
int l9_34=l9_31;
float2 l9_35=l9_32;
int l9_36=l9_33;
int l9_37=l9_34;
float3 l9_38=float3(0.0);
if (l9_36==0)
{
l9_38=float3(l9_35,0.0);
}
else
{
if (l9_36==1)
{
l9_38=float3(l9_35.x,(l9_35.y*0.5)+(0.5-(float(l9_37)*0.5)),0.0);
}
else
{
l9_38=float3(l9_35,float(l9_37));
}
}
float3 l9_39=l9_38;
float3 l9_40=l9_39;
float4 l9_41=renderTarget0.sample(renderTarget0SmpSC,l9_40.xy,level(0.0));
float4 l9_42=l9_41;
float4 l9_43=l9_42;
float4 renderTarget0Sample=l9_43;
float4 l9_44=renderTarget0Sample;
bool l9_45=dot(abs(l9_44),float4(1.0))<9.9999997e-06;
bool l9_46;
if (!l9_45)
{
l9_46=!(UserUniforms.vfxBatchEnable[ssInstanceID/40]!=0);
}
else
{
l9_46=l9_45;
}
if (l9_46)
{
return false;
}
Scalar0=renderTarget0Sample.x;
Scalar1=renderTarget0Sample.y;
Scalar2=renderTarget0Sample.z;
Scalar3=renderTarget0Sample.w;
float2 param_7=uv;
float2 l9_47=param_7;
int l9_48;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_49=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_49=0;
}
else
{
l9_49=gl_InstanceIndex%2;
}
int l9_50=l9_49;
l9_48=1-l9_50;
}
else
{
int l9_51=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_51=0;
}
else
{
l9_51=gl_InstanceIndex%2;
}
int l9_52=l9_51;
l9_48=l9_52;
}
int l9_53=l9_48;
float2 l9_54=l9_47;
int l9_55=renderTarget1Layout_tmp;
int l9_56=l9_53;
float2 l9_57=l9_54;
int l9_58=l9_55;
int l9_59=l9_56;
float3 l9_60=float3(0.0);
if (l9_58==0)
{
l9_60=float3(l9_57,0.0);
}
else
{
if (l9_58==1)
{
l9_60=float3(l9_57.x,(l9_57.y*0.5)+(0.5-(float(l9_59)*0.5)),0.0);
}
else
{
l9_60=float3(l9_57,float(l9_59));
}
}
float3 l9_61=l9_60;
float3 l9_62=l9_61;
float4 l9_63=renderTarget1.sample(renderTarget1SmpSC,l9_62.xy,level(0.0));
float4 l9_64=l9_63;
float4 l9_65=l9_64;
float4 renderTarget1Sample=l9_65;
Scalar4=renderTarget1Sample.x;
Scalar5=renderTarget1Sample.y;
Scalar6=renderTarget1Sample.z;
Scalar7=renderTarget1Sample.w;
float2 param_8=uv;
float2 l9_66=param_8;
int l9_67;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_68=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_68=0;
}
else
{
l9_68=gl_InstanceIndex%2;
}
int l9_69=l9_68;
l9_67=1-l9_69;
}
else
{
int l9_70=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_70=0;
}
else
{
l9_70=gl_InstanceIndex%2;
}
int l9_71=l9_70;
l9_67=l9_71;
}
int l9_72=l9_67;
float2 l9_73=l9_66;
int l9_74=renderTarget2Layout_tmp;
int l9_75=l9_72;
float2 l9_76=l9_73;
int l9_77=l9_74;
int l9_78=l9_75;
float3 l9_79=float3(0.0);
if (l9_77==0)
{
l9_79=float3(l9_76,0.0);
}
else
{
if (l9_77==1)
{
l9_79=float3(l9_76.x,(l9_76.y*0.5)+(0.5-(float(l9_78)*0.5)),0.0);
}
else
{
l9_79=float3(l9_76,float(l9_78));
}
}
float3 l9_80=l9_79;
float3 l9_81=l9_80;
float4 l9_82=renderTarget2.sample(renderTarget2SmpSC,l9_81.xy,level(0.0));
float4 l9_83=l9_82;
float4 l9_84=l9_83;
float4 renderTarget2Sample=l9_84;
Scalar8=renderTarget2Sample.x;
Scalar9=renderTarget2Sample.y;
Scalar10=renderTarget2Sample.z;
Scalar11=renderTarget2Sample.w;
float2 param_9=uv;
float2 l9_85=param_9;
int l9_86;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_87=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_87=0;
}
else
{
l9_87=gl_InstanceIndex%2;
}
int l9_88=l9_87;
l9_86=1-l9_88;
}
else
{
int l9_89=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_89=0;
}
else
{
l9_89=gl_InstanceIndex%2;
}
int l9_90=l9_89;
l9_86=l9_90;
}
int l9_91=l9_86;
float2 l9_92=l9_85;
int l9_93=renderTarget3Layout_tmp;
int l9_94=l9_91;
float2 l9_95=l9_92;
int l9_96=l9_93;
int l9_97=l9_94;
float3 l9_98=float3(0.0);
if (l9_96==0)
{
l9_98=float3(l9_95,0.0);
}
else
{
if (l9_96==1)
{
l9_98=float3(l9_95.x,(l9_95.y*0.5)+(0.5-(float(l9_97)*0.5)),0.0);
}
else
{
l9_98=float3(l9_95,float(l9_97));
}
}
float3 l9_99=l9_98;
float3 l9_100=l9_99;
float4 l9_101=renderTarget3.sample(renderTarget3SmpSC,l9_100.xy,level(0.0));
float4 l9_102=l9_101;
float4 l9_103=l9_102;
float4 renderTarget3Sample=l9_103;
Scalar12=renderTarget3Sample.x;
Scalar13=renderTarget3Sample.y;
Scalar14=renderTarget3Sample.z;
Scalar15=renderTarget3Sample.w;
float4 param_10=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_11=-1000.0;
float param_12=1000.0;
float4 l9_104=param_10;
float l9_105=param_11;
float l9_106=param_12;
float l9_107=0.99998999;
float4 l9_108=l9_104;
#if (1)
{
l9_108=floor((l9_108*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_109=dot(l9_108,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_110=l9_109;
float l9_111=0.0;
float l9_112=l9_107;
float l9_113=l9_105;
float l9_114=l9_106;
float l9_115=l9_113+(((l9_110-l9_111)*(l9_114-l9_113))/(l9_112-l9_111));
float l9_116=l9_115;
float l9_117=l9_116;
gParticle.Position.x=l9_117;
float4 param_13=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_14=-1000.0;
float param_15=1000.0;
float4 l9_118=param_13;
float l9_119=param_14;
float l9_120=param_15;
float l9_121=0.99998999;
float4 l9_122=l9_118;
#if (1)
{
l9_122=floor((l9_122*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_123=dot(l9_122,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_124=l9_123;
float l9_125=0.0;
float l9_126=l9_121;
float l9_127=l9_119;
float l9_128=l9_120;
float l9_129=l9_127+(((l9_124-l9_125)*(l9_128-l9_127))/(l9_126-l9_125));
float l9_130=l9_129;
float l9_131=l9_130;
gParticle.Position.y=l9_131;
float4 param_16=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_17=-1000.0;
float param_18=1000.0;
float4 l9_132=param_16;
float l9_133=param_17;
float l9_134=param_18;
float l9_135=0.99998999;
float4 l9_136=l9_132;
#if (1)
{
l9_136=floor((l9_136*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_137=dot(l9_136,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_138=l9_137;
float l9_139=0.0;
float l9_140=l9_135;
float l9_141=l9_133;
float l9_142=l9_134;
float l9_143=l9_141+(((l9_138-l9_139)*(l9_142-l9_141))/(l9_140-l9_139));
float l9_144=l9_143;
float l9_145=l9_144;
gParticle.Position.z=l9_145;
float4 param_19=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_20=-1000.0;
float param_21=1000.0;
float4 l9_146=param_19;
float l9_147=param_20;
float l9_148=param_21;
float l9_149=0.99998999;
float4 l9_150=l9_146;
#if (1)
{
l9_150=floor((l9_150*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_151=dot(l9_150,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_152=l9_151;
float l9_153=0.0;
float l9_154=l9_149;
float l9_155=l9_147;
float l9_156=l9_148;
float l9_157=l9_155+(((l9_152-l9_153)*(l9_156-l9_155))/(l9_154-l9_153));
float l9_158=l9_157;
float l9_159=l9_158;
gParticle.Velocity.x=l9_159;
uv=Coord+(Offset*1.0);
float2 param_22=uv;
float2 l9_160=param_22;
int l9_161;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_162=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_162=0;
}
else
{
l9_162=gl_InstanceIndex%2;
}
int l9_163=l9_162;
l9_161=1-l9_163;
}
else
{
int l9_164=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_164=0;
}
else
{
l9_164=gl_InstanceIndex%2;
}
int l9_165=l9_164;
l9_161=l9_165;
}
int l9_166=l9_161;
float2 l9_167=l9_160;
int l9_168=renderTarget0Layout_tmp;
int l9_169=l9_166;
float2 l9_170=l9_167;
int l9_171=l9_168;
int l9_172=l9_169;
float3 l9_173=float3(0.0);
if (l9_171==0)
{
l9_173=float3(l9_170,0.0);
}
else
{
if (l9_171==1)
{
l9_173=float3(l9_170.x,(l9_170.y*0.5)+(0.5-(float(l9_172)*0.5)),0.0);
}
else
{
l9_173=float3(l9_170,float(l9_172));
}
}
float3 l9_174=l9_173;
float3 l9_175=l9_174;
float4 l9_176=renderTarget0.sample(renderTarget0SmpSC,l9_175.xy,level(0.0));
float4 l9_177=l9_176;
float4 l9_178=l9_177;
float4 renderTarget0Sample_1=l9_178;
Scalar0=renderTarget0Sample_1.x;
Scalar1=renderTarget0Sample_1.y;
Scalar2=renderTarget0Sample_1.z;
Scalar3=renderTarget0Sample_1.w;
float2 param_23=uv;
float2 l9_179=param_23;
int l9_180;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_181=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_181=0;
}
else
{
l9_181=gl_InstanceIndex%2;
}
int l9_182=l9_181;
l9_180=1-l9_182;
}
else
{
int l9_183=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_183=0;
}
else
{
l9_183=gl_InstanceIndex%2;
}
int l9_184=l9_183;
l9_180=l9_184;
}
int l9_185=l9_180;
float2 l9_186=l9_179;
int l9_187=renderTarget1Layout_tmp;
int l9_188=l9_185;
float2 l9_189=l9_186;
int l9_190=l9_187;
int l9_191=l9_188;
float3 l9_192=float3(0.0);
if (l9_190==0)
{
l9_192=float3(l9_189,0.0);
}
else
{
if (l9_190==1)
{
l9_192=float3(l9_189.x,(l9_189.y*0.5)+(0.5-(float(l9_191)*0.5)),0.0);
}
else
{
l9_192=float3(l9_189,float(l9_191));
}
}
float3 l9_193=l9_192;
float3 l9_194=l9_193;
float4 l9_195=renderTarget1.sample(renderTarget1SmpSC,l9_194.xy,level(0.0));
float4 l9_196=l9_195;
float4 l9_197=l9_196;
float4 renderTarget1Sample_1=l9_197;
Scalar4=renderTarget1Sample_1.x;
Scalar5=renderTarget1Sample_1.y;
Scalar6=renderTarget1Sample_1.z;
Scalar7=renderTarget1Sample_1.w;
float2 param_24=uv;
float2 l9_198=param_24;
int l9_199;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_200=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_200=0;
}
else
{
l9_200=gl_InstanceIndex%2;
}
int l9_201=l9_200;
l9_199=1-l9_201;
}
else
{
int l9_202=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_202=0;
}
else
{
l9_202=gl_InstanceIndex%2;
}
int l9_203=l9_202;
l9_199=l9_203;
}
int l9_204=l9_199;
float2 l9_205=l9_198;
int l9_206=renderTarget2Layout_tmp;
int l9_207=l9_204;
float2 l9_208=l9_205;
int l9_209=l9_206;
int l9_210=l9_207;
float3 l9_211=float3(0.0);
if (l9_209==0)
{
l9_211=float3(l9_208,0.0);
}
else
{
if (l9_209==1)
{
l9_211=float3(l9_208.x,(l9_208.y*0.5)+(0.5-(float(l9_210)*0.5)),0.0);
}
else
{
l9_211=float3(l9_208,float(l9_210));
}
}
float3 l9_212=l9_211;
float3 l9_213=l9_212;
float4 l9_214=renderTarget2.sample(renderTarget2SmpSC,l9_213.xy,level(0.0));
float4 l9_215=l9_214;
float4 l9_216=l9_215;
float4 renderTarget2Sample_1=l9_216;
Scalar8=renderTarget2Sample_1.x;
Scalar9=renderTarget2Sample_1.y;
Scalar10=renderTarget2Sample_1.z;
Scalar11=renderTarget2Sample_1.w;
float2 param_25=uv;
float2 l9_217=param_25;
int l9_218;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
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
l9_218=1-l9_220;
}
else
{
int l9_221=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_221=0;
}
else
{
l9_221=gl_InstanceIndex%2;
}
int l9_222=l9_221;
l9_218=l9_222;
}
int l9_223=l9_218;
float2 l9_224=l9_217;
int l9_225=renderTarget3Layout_tmp;
int l9_226=l9_223;
float2 l9_227=l9_224;
int l9_228=l9_225;
int l9_229=l9_226;
float3 l9_230=float3(0.0);
if (l9_228==0)
{
l9_230=float3(l9_227,0.0);
}
else
{
if (l9_228==1)
{
l9_230=float3(l9_227.x,(l9_227.y*0.5)+(0.5-(float(l9_229)*0.5)),0.0);
}
else
{
l9_230=float3(l9_227,float(l9_229));
}
}
float3 l9_231=l9_230;
float3 l9_232=l9_231;
float4 l9_233=renderTarget3.sample(renderTarget3SmpSC,l9_232.xy,level(0.0));
float4 l9_234=l9_233;
float4 l9_235=l9_234;
float4 renderTarget3Sample_1=l9_235;
Scalar12=renderTarget3Sample_1.x;
Scalar13=renderTarget3Sample_1.y;
Scalar14=renderTarget3Sample_1.z;
Scalar15=renderTarget3Sample_1.w;
float4 param_26=float4(Scalar0,Scalar1,Scalar2,Scalar3);
float param_27=-1000.0;
float param_28=1000.0;
float4 l9_236=param_26;
float l9_237=param_27;
float l9_238=param_28;
float l9_239=0.99998999;
float4 l9_240=l9_236;
#if (1)
{
l9_240=floor((l9_240*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_241=dot(l9_240,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_242=l9_241;
float l9_243=0.0;
float l9_244=l9_239;
float l9_245=l9_237;
float l9_246=l9_238;
float l9_247=l9_245+(((l9_242-l9_243)*(l9_246-l9_245))/(l9_244-l9_243));
float l9_248=l9_247;
float l9_249=l9_248;
gParticle.Velocity.y=l9_249;
float4 param_29=float4(Scalar4,Scalar5,Scalar6,Scalar7);
float param_30=-1000.0;
float param_31=1000.0;
float4 l9_250=param_29;
float l9_251=param_30;
float l9_252=param_31;
float l9_253=0.99998999;
float4 l9_254=l9_250;
#if (1)
{
l9_254=floor((l9_254*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_255=dot(l9_254,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_256=l9_255;
float l9_257=0.0;
float l9_258=l9_253;
float l9_259=l9_251;
float l9_260=l9_252;
float l9_261=l9_259+(((l9_256-l9_257)*(l9_260-l9_259))/(l9_258-l9_257));
float l9_262=l9_261;
float l9_263=l9_262;
gParticle.Velocity.z=l9_263;
float4 param_32=float4(Scalar8,Scalar9,Scalar10,Scalar11);
float param_33=0.0;
float param_34=0.2;
float4 l9_264=param_32;
float l9_265=param_33;
float l9_266=param_34;
float l9_267=0.99998999;
float4 l9_268=l9_264;
#if (1)
{
l9_268=floor((l9_268*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_269=dot(l9_268,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_270=l9_269;
float l9_271=0.0;
float l9_272=l9_267;
float l9_273=l9_265;
float l9_274=l9_266;
float l9_275=l9_273+(((l9_270-l9_271)*(l9_274-l9_273))/(l9_272-l9_271));
float l9_276=l9_275;
float l9_277=l9_276;
gParticle.Life=l9_277;
float4 param_35=float4(Scalar12,Scalar13,Scalar14,Scalar15);
float param_36=0.0;
float param_37=0.2;
float4 l9_278=param_35;
float l9_279=param_36;
float l9_280=param_37;
float l9_281=0.99998999;
float4 l9_282=l9_278;
#if (1)
{
l9_282=floor((l9_282*255.0)+float4(0.5))/float4(255.0);
}
#endif
float l9_283=dot(l9_282,float4(1.0,0.0039215689,1.53787e-05,6.0308629e-08));
float l9_284=l9_283;
float l9_285=0.0;
float l9_286=l9_281;
float l9_287=l9_279;
float l9_288=l9_280;
float l9_289=l9_287+(((l9_284-l9_285)*(l9_288-l9_287))/(l9_286-l9_285));
float l9_290=l9_289;
float l9_291=l9_290;
gParticle.Age=l9_291;
uv=Coord+(Offset*2.0);
float2 param_38=uv;
float2 l9_292=param_38;
int l9_293;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_294=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_294=0;
}
else
{
l9_294=gl_InstanceIndex%2;
}
int l9_295=l9_294;
l9_293=1-l9_295;
}
else
{
int l9_296=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_296=0;
}
else
{
l9_296=gl_InstanceIndex%2;
}
int l9_297=l9_296;
l9_293=l9_297;
}
int l9_298=l9_293;
float2 l9_299=l9_292;
int l9_300=renderTarget0Layout_tmp;
int l9_301=l9_298;
float2 l9_302=l9_299;
int l9_303=l9_300;
int l9_304=l9_301;
float3 l9_305=float3(0.0);
if (l9_303==0)
{
l9_305=float3(l9_302,0.0);
}
else
{
if (l9_303==1)
{
l9_305=float3(l9_302.x,(l9_302.y*0.5)+(0.5-(float(l9_304)*0.5)),0.0);
}
else
{
l9_305=float3(l9_302,float(l9_304));
}
}
float3 l9_306=l9_305;
float3 l9_307=l9_306;
float4 l9_308=renderTarget0.sample(renderTarget0SmpSC,l9_307.xy,level(0.0));
float4 l9_309=l9_308;
float4 l9_310=l9_309;
float4 renderTarget0Sample_2=l9_310;
Scalar0=renderTarget0Sample_2.x;
Scalar1=renderTarget0Sample_2.y;
Scalar2=renderTarget0Sample_2.z;
Scalar3=renderTarget0Sample_2.w;
float2 param_39=uv;
float2 l9_311=param_39;
int l9_312;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_313=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_313=0;
}
else
{
l9_313=gl_InstanceIndex%2;
}
int l9_314=l9_313;
l9_312=1-l9_314;
}
else
{
int l9_315=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_315=0;
}
else
{
l9_315=gl_InstanceIndex%2;
}
int l9_316=l9_315;
l9_312=l9_316;
}
int l9_317=l9_312;
float2 l9_318=l9_311;
int l9_319=renderTarget1Layout_tmp;
int l9_320=l9_317;
float2 l9_321=l9_318;
int l9_322=l9_319;
int l9_323=l9_320;
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
float4 l9_327=renderTarget1.sample(renderTarget1SmpSC,l9_326.xy,level(0.0));
float4 l9_328=l9_327;
float4 l9_329=l9_328;
float4 renderTarget1Sample_2=l9_329;
Scalar4=renderTarget1Sample_2.x;
Scalar5=renderTarget1Sample_2.y;
Scalar6=renderTarget1Sample_2.z;
Scalar7=renderTarget1Sample_2.w;
float2 param_40=uv;
float2 l9_330=param_40;
int l9_331;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_332=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_332=0;
}
else
{
l9_332=gl_InstanceIndex%2;
}
int l9_333=l9_332;
l9_331=1-l9_333;
}
else
{
int l9_334=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_334=0;
}
else
{
l9_334=gl_InstanceIndex%2;
}
int l9_335=l9_334;
l9_331=l9_335;
}
int l9_336=l9_331;
float2 l9_337=l9_330;
int l9_338=renderTarget2Layout_tmp;
int l9_339=l9_336;
float2 l9_340=l9_337;
int l9_341=l9_338;
int l9_342=l9_339;
float3 l9_343=float3(0.0);
if (l9_341==0)
{
l9_343=float3(l9_340,0.0);
}
else
{
if (l9_341==1)
{
l9_343=float3(l9_340.x,(l9_340.y*0.5)+(0.5-(float(l9_342)*0.5)),0.0);
}
else
{
l9_343=float3(l9_340,float(l9_342));
}
}
float3 l9_344=l9_343;
float3 l9_345=l9_344;
float4 l9_346=renderTarget2.sample(renderTarget2SmpSC,l9_345.xy,level(0.0));
float4 l9_347=l9_346;
float4 l9_348=l9_347;
float4 renderTarget2Sample_2=l9_348;
Scalar8=renderTarget2Sample_2.x;
Scalar9=renderTarget2Sample_2.y;
Scalar10=renderTarget2Sample_2.z;
Scalar11=renderTarget2Sample_2.w;
float2 param_41=uv;
float2 l9_349=param_41;
int l9_350;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_351=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_351=0;
}
else
{
l9_351=gl_InstanceIndex%2;
}
int l9_352=l9_351;
l9_350=1-l9_352;
}
else
{
int l9_353=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_353=0;
}
else
{
l9_353=gl_InstanceIndex%2;
}
int l9_354=l9_353;
l9_350=l9_354;
}
int l9_355=l9_350;
float2 l9_356=l9_349;
int l9_357=renderTarget3Layout_tmp;
int l9_358=l9_355;
float2 l9_359=l9_356;
int l9_360=l9_357;
int l9_361=l9_358;
float3 l9_362=float3(0.0);
if (l9_360==0)
{
l9_362=float3(l9_359,0.0);
}
else
{
if (l9_360==1)
{
l9_362=float3(l9_359.x,(l9_359.y*0.5)+(0.5-(float(l9_361)*0.5)),0.0);
}
else
{
l9_362=float3(l9_359,float(l9_361));
}
}
float3 l9_363=l9_362;
float3 l9_364=l9_363;
float4 l9_365=renderTarget3.sample(renderTarget3SmpSC,l9_364.xy,level(0.0));
float4 l9_366=l9_365;
float4 l9_367=l9_366;
float4 renderTarget3Sample_2=l9_367;
Scalar12=renderTarget3Sample_2.x;
Scalar13=renderTarget3Sample_2.y;
Scalar14=renderTarget3Sample_2.z;
Scalar15=renderTarget3Sample_2.w;
float2 param_42=float2(Scalar0,Scalar1);
float param_43=0.0;
float param_44=100.0;
float2 l9_368=param_42;
float l9_369=param_43;
float l9_370=param_44;
float l9_371=0.99998999;
float2 l9_372=l9_368;
#if (1)
{
l9_372=floor((l9_372*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_373=dot(l9_372,float2(1.0,0.0039215689));
float l9_374=l9_373;
float l9_375=0.0;
float l9_376=l9_371;
float l9_377=l9_369;
float l9_378=l9_370;
float l9_379=l9_377+(((l9_374-l9_375)*(l9_378-l9_377))/(l9_376-l9_375));
float l9_380=l9_379;
float l9_381=l9_380;
gParticle.Size=l9_381;
float2 param_45=float2(Scalar2,Scalar3);
float param_46=-1.0;
float param_47=1.0;
float2 l9_382=param_45;
float l9_383=param_46;
float l9_384=param_47;
float l9_385=0.99998999;
float2 l9_386=l9_382;
#if (1)
{
l9_386=floor((l9_386*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_387=dot(l9_386,float2(1.0,0.0039215689));
float l9_388=l9_387;
float l9_389=0.0;
float l9_390=l9_385;
float l9_391=l9_383;
float l9_392=l9_384;
float l9_393=l9_391+(((l9_388-l9_389)*(l9_392-l9_391))/(l9_390-l9_389));
float l9_394=l9_393;
float l9_395=l9_394;
gParticle.Quaternion.x=l9_395;
float2 param_48=float2(Scalar4,Scalar5);
float param_49=-1.0;
float param_50=1.0;
float2 l9_396=param_48;
float l9_397=param_49;
float l9_398=param_50;
float l9_399=0.99998999;
float2 l9_400=l9_396;
#if (1)
{
l9_400=floor((l9_400*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_401=dot(l9_400,float2(1.0,0.0039215689));
float l9_402=l9_401;
float l9_403=0.0;
float l9_404=l9_399;
float l9_405=l9_397;
float l9_406=l9_398;
float l9_407=l9_405+(((l9_402-l9_403)*(l9_406-l9_405))/(l9_404-l9_403));
float l9_408=l9_407;
float l9_409=l9_408;
gParticle.Quaternion.y=l9_409;
float2 param_51=float2(Scalar6,Scalar7);
float param_52=-1.0;
float param_53=1.0;
float2 l9_410=param_51;
float l9_411=param_52;
float l9_412=param_53;
float l9_413=0.99998999;
float2 l9_414=l9_410;
#if (1)
{
l9_414=floor((l9_414*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_415=dot(l9_414,float2(1.0,0.0039215689));
float l9_416=l9_415;
float l9_417=0.0;
float l9_418=l9_413;
float l9_419=l9_411;
float l9_420=l9_412;
float l9_421=l9_419+(((l9_416-l9_417)*(l9_420-l9_419))/(l9_418-l9_417));
float l9_422=l9_421;
float l9_423=l9_422;
gParticle.Quaternion.z=l9_423;
float2 param_54=float2(Scalar8,Scalar9);
float param_55=-1.0;
float param_56=1.0;
float2 l9_424=param_54;
float l9_425=param_55;
float l9_426=param_56;
float l9_427=0.99998999;
float2 l9_428=l9_424;
#if (1)
{
l9_428=floor((l9_428*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_429=dot(l9_428,float2(1.0,0.0039215689));
float l9_430=l9_429;
float l9_431=0.0;
float l9_432=l9_427;
float l9_433=l9_425;
float l9_434=l9_426;
float l9_435=l9_433+(((l9_430-l9_431)*(l9_434-l9_433))/(l9_432-l9_431));
float l9_436=l9_435;
float l9_437=l9_436;
gParticle.Quaternion.w=l9_437;
float2 param_57=float2(Scalar10,Scalar11);
float param_58=0.0;
float param_59=100.0;
float2 l9_438=param_57;
float l9_439=param_58;
float l9_440=param_59;
float l9_441=0.99998999;
float2 l9_442=l9_438;
#if (1)
{
l9_442=floor((l9_442*255.0)+float2(0.5))/float2(255.0);
}
#endif
float l9_443=dot(l9_442,float2(1.0,0.0039215689));
float l9_444=l9_443;
float l9_445=0.0;
float l9_446=l9_441;
float l9_447=l9_439;
float l9_448=l9_440;
float l9_449=l9_447+(((l9_444-l9_445)*(l9_448-l9_447))/(l9_446-l9_445));
float l9_450=l9_449;
float l9_451=l9_450;
gParticle.Mass=l9_451;
float param_60=Scalar12;
float param_61=0.0;
float param_62=1.00001;
float l9_452=param_60;
float l9_453=param_61;
float l9_454=param_62;
float l9_455=1.0;
float l9_456=l9_452;
#if (1)
{
l9_456=floor((l9_456*255.0)+0.5)/255.0;
}
#endif
float l9_457=l9_456;
float l9_458=l9_457;
float l9_459=0.0;
float l9_460=l9_455;
float l9_461=l9_453;
float l9_462=l9_454;
float l9_463=l9_461+(((l9_458-l9_459)*(l9_462-l9_461))/(l9_460-l9_459));
float l9_464=l9_463;
float l9_465=l9_464;
gParticle.Color.x=l9_465;
float param_63=Scalar13;
float param_64=0.0;
float param_65=1.00001;
float l9_466=param_63;
float l9_467=param_64;
float l9_468=param_65;
float l9_469=1.0;
float l9_470=l9_466;
#if (1)
{
l9_470=floor((l9_470*255.0)+0.5)/255.0;
}
#endif
float l9_471=l9_470;
float l9_472=l9_471;
float l9_473=0.0;
float l9_474=l9_469;
float l9_475=l9_467;
float l9_476=l9_468;
float l9_477=l9_475+(((l9_472-l9_473)*(l9_476-l9_475))/(l9_474-l9_473));
float l9_478=l9_477;
float l9_479=l9_478;
gParticle.Color.y=l9_479;
float param_66=Scalar14;
float param_67=0.0;
float param_68=1.00001;
float l9_480=param_66;
float l9_481=param_67;
float l9_482=param_68;
float l9_483=1.0;
float l9_484=l9_480;
#if (1)
{
l9_484=floor((l9_484*255.0)+0.5)/255.0;
}
#endif
float l9_485=l9_484;
float l9_486=l9_485;
float l9_487=0.0;
float l9_488=l9_483;
float l9_489=l9_481;
float l9_490=l9_482;
float l9_491=l9_489+(((l9_486-l9_487)*(l9_490-l9_489))/(l9_488-l9_487));
float l9_492=l9_491;
float l9_493=l9_492;
gParticle.Color.z=l9_493;
float param_69=Scalar15;
float param_70=0.0;
float param_71=1.00001;
float l9_494=param_69;
float l9_495=param_70;
float l9_496=param_71;
float l9_497=1.0;
float l9_498=l9_494;
#if (1)
{
l9_498=floor((l9_498*255.0)+0.5)/255.0;
}
#endif
float l9_499=l9_498;
float l9_500=l9_499;
float l9_501=0.0;
float l9_502=l9_497;
float l9_503=l9_495;
float l9_504=l9_496;
float l9_505=l9_503+(((l9_500-l9_501)*(l9_504-l9_503))/(l9_502-l9_501));
float l9_506=l9_505;
float l9_507=l9_506;
gParticle.Color.w=l9_507;
uv=Coord+(Offset*3.0);
float2 param_72=uv;
float2 l9_508=param_72;
int l9_509;
if ((int(renderTarget0HasSwappedViews_tmp)!=0))
{
int l9_510=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_510=0;
}
else
{
l9_510=gl_InstanceIndex%2;
}
int l9_511=l9_510;
l9_509=1-l9_511;
}
else
{
int l9_512=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_512=0;
}
else
{
l9_512=gl_InstanceIndex%2;
}
int l9_513=l9_512;
l9_509=l9_513;
}
int l9_514=l9_509;
float2 l9_515=l9_508;
int l9_516=renderTarget0Layout_tmp;
int l9_517=l9_514;
float2 l9_518=l9_515;
int l9_519=l9_516;
int l9_520=l9_517;
float3 l9_521=float3(0.0);
if (l9_519==0)
{
l9_521=float3(l9_518,0.0);
}
else
{
if (l9_519==1)
{
l9_521=float3(l9_518.x,(l9_518.y*0.5)+(0.5-(float(l9_520)*0.5)),0.0);
}
else
{
l9_521=float3(l9_518,float(l9_520));
}
}
float3 l9_522=l9_521;
float3 l9_523=l9_522;
float4 l9_524=renderTarget0.sample(renderTarget0SmpSC,l9_523.xy,level(0.0));
float4 l9_525=l9_524;
float4 l9_526=l9_525;
float4 renderTarget0Sample_3=l9_526;
Scalar0=renderTarget0Sample_3.x;
Scalar1=renderTarget0Sample_3.y;
Scalar2=renderTarget0Sample_3.z;
Scalar3=renderTarget0Sample_3.w;
float2 param_73=uv;
float2 l9_527=param_73;
int l9_528;
if ((int(renderTarget1HasSwappedViews_tmp)!=0))
{
int l9_529=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_529=0;
}
else
{
l9_529=gl_InstanceIndex%2;
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
l9_531=gl_InstanceIndex%2;
}
int l9_532=l9_531;
l9_528=l9_532;
}
int l9_533=l9_528;
float2 l9_534=l9_527;
int l9_535=renderTarget1Layout_tmp;
int l9_536=l9_533;
float2 l9_537=l9_534;
int l9_538=l9_535;
int l9_539=l9_536;
float3 l9_540=float3(0.0);
if (l9_538==0)
{
l9_540=float3(l9_537,0.0);
}
else
{
if (l9_538==1)
{
l9_540=float3(l9_537.x,(l9_537.y*0.5)+(0.5-(float(l9_539)*0.5)),0.0);
}
else
{
l9_540=float3(l9_537,float(l9_539));
}
}
float3 l9_541=l9_540;
float3 l9_542=l9_541;
float4 l9_543=renderTarget1.sample(renderTarget1SmpSC,l9_542.xy,level(0.0));
float4 l9_544=l9_543;
float4 l9_545=l9_544;
float4 renderTarget1Sample_3=l9_545;
Scalar4=renderTarget1Sample_3.x;
Scalar5=renderTarget1Sample_3.y;
Scalar6=renderTarget1Sample_3.z;
Scalar7=renderTarget1Sample_3.w;
float2 param_74=uv;
float2 l9_546=param_74;
int l9_547;
if ((int(renderTarget2HasSwappedViews_tmp)!=0))
{
int l9_548=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_548=0;
}
else
{
l9_548=gl_InstanceIndex%2;
}
int l9_549=l9_548;
l9_547=1-l9_549;
}
else
{
int l9_550=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_550=0;
}
else
{
l9_550=gl_InstanceIndex%2;
}
int l9_551=l9_550;
l9_547=l9_551;
}
int l9_552=l9_547;
float2 l9_553=l9_546;
int l9_554=renderTarget2Layout_tmp;
int l9_555=l9_552;
float2 l9_556=l9_553;
int l9_557=l9_554;
int l9_558=l9_555;
float3 l9_559=float3(0.0);
if (l9_557==0)
{
l9_559=float3(l9_556,0.0);
}
else
{
if (l9_557==1)
{
l9_559=float3(l9_556.x,(l9_556.y*0.5)+(0.5-(float(l9_558)*0.5)),0.0);
}
else
{
l9_559=float3(l9_556,float(l9_558));
}
}
float3 l9_560=l9_559;
float3 l9_561=l9_560;
float4 l9_562=renderTarget2.sample(renderTarget2SmpSC,l9_561.xy,level(0.0));
float4 l9_563=l9_562;
float4 l9_564=l9_563;
float4 renderTarget2Sample_3=l9_564;
Scalar8=renderTarget2Sample_3.x;
Scalar9=renderTarget2Sample_3.y;
Scalar10=renderTarget2Sample_3.z;
Scalar11=renderTarget2Sample_3.w;
float2 param_75=uv;
float2 l9_565=param_75;
int l9_566;
if ((int(renderTarget3HasSwappedViews_tmp)!=0))
{
int l9_567=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_567=0;
}
else
{
l9_567=gl_InstanceIndex%2;
}
int l9_568=l9_567;
l9_566=1-l9_568;
}
else
{
int l9_569=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_569=0;
}
else
{
l9_569=gl_InstanceIndex%2;
}
int l9_570=l9_569;
l9_566=l9_570;
}
int l9_571=l9_566;
float2 l9_572=l9_565;
int l9_573=renderTarget3Layout_tmp;
int l9_574=l9_571;
float2 l9_575=l9_572;
int l9_576=l9_573;
int l9_577=l9_574;
float3 l9_578=float3(0.0);
if (l9_576==0)
{
l9_578=float3(l9_575,0.0);
}
else
{
if (l9_576==1)
{
l9_578=float3(l9_575.x,(l9_575.y*0.5)+(0.5-(float(l9_577)*0.5)),0.0);
}
else
{
l9_578=float3(l9_575,float(l9_577));
}
}
float3 l9_579=l9_578;
float3 l9_580=l9_579;
float4 l9_581=renderTarget3.sample(renderTarget3SmpSC,l9_580.xy,level(0.0));
float4 l9_582=l9_581;
float4 l9_583=l9_582;
float4 renderTarget3Sample_3=l9_583;
Scalar12=renderTarget3Sample_3.x;
Scalar13=renderTarget3Sample_3.y;
Scalar14=renderTarget3Sample_3.z;
Scalar15=renderTarget3Sample_3.w;
float param_76=Scalar0;
float param_77=0.0;
float param_78=255.0;
float l9_584=param_76;
float l9_585=param_77;
float l9_586=param_78;
float l9_587=1.0;
float l9_588=l9_584;
#if (1)
{
l9_588=floor((l9_588*255.0)+0.5)/255.0;
}
#endif
float l9_589=l9_588;
float l9_590=l9_589;
float l9_591=0.0;
float l9_592=l9_587;
float l9_593=l9_585;
float l9_594=l9_586;
float l9_595=l9_593+(((l9_590-l9_591)*(l9_594-l9_593))/(l9_592-l9_591));
float l9_596=l9_595;
float l9_597=l9_596;
gParticle.collisionCount_N119=l9_597;
float4 param_79=gParticle.Quaternion;
param_79=normalize(param_79.yzwx);
float l9_598=param_79.x*param_79.x;
float l9_599=param_79.y*param_79.y;
float l9_600=param_79.z*param_79.z;
float l9_601=param_79.x*param_79.z;
float l9_602=param_79.x*param_79.y;
float l9_603=param_79.y*param_79.z;
float l9_604=param_79.w*param_79.x;
float l9_605=param_79.w*param_79.y;
float l9_606=param_79.w*param_79.z;
float3x3 l9_607=float3x3(float3(1.0-(2.0*(l9_599+l9_600)),2.0*(l9_602+l9_606),2.0*(l9_601-l9_605)),float3(2.0*(l9_602-l9_606),1.0-(2.0*(l9_598+l9_600)),2.0*(l9_603+l9_604)),float3(2.0*(l9_601+l9_605),2.0*(l9_603-l9_604),1.0-(2.0*(l9_598+l9_599))));
gParticle.Matrix=l9_607;
gParticle.Velocity=floor((gParticle.Velocity*2000.0)+float3(0.5))*0.00050000002;
gParticle.Position=floor((gParticle.Position*2000.0)+float3(0.5))*0.00050000002;
gParticle.Color=floor((gParticle.Color*2000.0)+float4(0.5))*0.00050000002;
gParticle.Size=floor((gParticle.Size*2000.0)+0.5)*0.00050000002;
gParticle.Mass=floor((gParticle.Mass*2000.0)+0.5)*0.00050000002;
gParticle.Life=floor((gParticle.Life*2000.0)+0.5)*0.00050000002;
return true;
}
vertex main_vert_out main_vert(main_vert_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],uint gl_InstanceIndex [[instance_id]])
{
main_vert_out out={};
int ssInstanceID=0;
sc_Vertex_t l9_0;
l9_0.position=in.position;
l9_0.normal=in.normal;
l9_0.tangent=in.tangent.xyz;
l9_0.texture0=in.texture0;
l9_0.texture1=in.texture1;
sc_Vertex_t l9_1=l9_0;
sc_Vertex_t v=l9_1;
out.varColor=in.color;
int l9_2=gl_InstanceIndex;
ssInstanceID=l9_2;
int l9_3=ssInstanceID;
bool l9_4=l9_3>=(40*((*sc_set0.UserUniforms).vfxNumCopies+1));
ssParticle gParticle;
bool l9_5;
if (!l9_4)
{
l9_5=((*sc_set0.UserUniforms).vfxBatchEnable[ssInstanceID/40]!=0)==false;
}
else
{
l9_5=l9_4;
}
if (l9_5)
{
float4 param=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_6=param;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_7=dot(l9_6,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_8=l9_7;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_8;
}
}
float4 l9_9=float4(param.x,-param.y,(param.z*0.5)+(param.w*0.5),param.w);
out.gl_Position=l9_9;
return out;
}
int param_1=ssInstanceID;
bool l9_11=ssDecodeParticle(param_1,ssInstanceID,gl_InstanceIndex,(*sc_set0.UserUniforms),sc_set0.renderTarget0,sc_set0.renderTarget0SmpSC,sc_set0.renderTarget1,sc_set0.renderTarget1SmpSC,sc_set0.renderTarget2,sc_set0.renderTarget2SmpSC,sc_set0.renderTarget3,sc_set0.renderTarget3SmpSC,gParticle);
if (!l9_11)
{
float4 param_2=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_2.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_12=param_2;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_13=dot(l9_12,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_14=l9_13;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_14;
}
}
float4 l9_15=float4(param_2.x,-param_2.y,(param_2.z*0.5)+(param_2.w*0.5),param_2.w);
out.gl_Position=l9_15;
return out;
}
float l9_16=gParticle.Size;
bool l9_17=l9_16<9.9999997e-06;
bool l9_18;
if (!l9_17)
{
l9_18=gParticle.Age>=gParticle.Life;
}
else
{
l9_18=l9_17;
}
if (l9_18)
{
float4 param_3=float4(4334.0,4334.0,4334.0,0.0);
if (sc_ShaderCacheConstant_tmp!=0)
{
param_3.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_19=param_3;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_20=dot(l9_19,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_21=l9_20;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_21;
}
}
float4 l9_22=float4(param_3.x,-param_3.y,(param_3.z*0.5)+(param_3.w*0.5),param_3.w);
out.gl_Position=l9_22;
return out;
}
float4 param_4=gParticle.Quaternion;
param_4=normalize(param_4.yzwx);
float l9_23=param_4.x*param_4.x;
float l9_24=param_4.y*param_4.y;
float l9_25=param_4.z*param_4.z;
float l9_26=param_4.x*param_4.z;
float l9_27=param_4.x*param_4.y;
float l9_28=param_4.y*param_4.z;
float l9_29=param_4.w*param_4.x;
float l9_30=param_4.w*param_4.y;
float l9_31=param_4.w*param_4.z;
float3x3 l9_32=float3x3(float3(1.0-(2.0*(l9_24+l9_25)),2.0*(l9_27+l9_31),2.0*(l9_26-l9_30)),float3(2.0*(l9_27-l9_31),1.0-(2.0*(l9_23+l9_25)),2.0*(l9_28+l9_29)),float3(2.0*(l9_26+l9_30),2.0*(l9_28-l9_29),1.0-(2.0*(l9_23+l9_24))));
gParticle.Matrix=l9_32;
float3 l9_33=gParticle.Position+((gParticle.Matrix*v.position.xyz)*gParticle.Size);
out.varPosAndMotion=float4(l9_33.x,l9_33.y,l9_33.z,out.varPosAndMotion.w);
float3 l9_34=gParticle.Matrix*v.normal;
out.varNormalAndMotion=float4(l9_34.x,l9_34.y,l9_34.z,out.varNormalAndMotion.w);
float3 l9_35=gParticle.Matrix*v.tangent;
out.varTangent=float4(l9_35.x,l9_35.y,l9_35.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
out.varTex01=float4(v.texture0,v.texture1);
int l9_36=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_36=0;
}
else
{
l9_36=gl_InstanceIndex%2;
}
int l9_37=l9_36;
float4 clipPosition=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_37]*float4(out.varPosAndMotion.xyz,1.0);
float4 param_5=clipPosition;
if (sc_DepthBufferMode_tmp==1)
{
int l9_38=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_38=0;
}
else
{
l9_38=gl_InstanceIndex%2;
}
int l9_39=l9_38;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_39][2].w!=0.0)
{
float l9_40=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
param_5.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+param_5.w))*l9_40)-1.0)*param_5.w;
}
}
float4 l9_41=param_5;
clipPosition=l9_41;
float4 param_6=clipPosition;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_6.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_42=param_6;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_43=dot(l9_42,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_44=l9_43;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_44;
}
}
float4 l9_45=float4(param_6.x,-param_6.y,(param_6.z*0.5)+(param_6.w*0.5),param_6.w);
out.gl_Position=l9_45;
out.Interp_Particle_Index=ssInstanceID;
out.Interp_Particle_Force=gParticle.Force;
out.Interp_Particle_Position=gParticle.Position;
out.Interp_Particle_Velocity=gParticle.Velocity;
out.Interp_Particle_Life=gParticle.Life;
out.Interp_Particle_Age=gParticle.Age;
out.Interp_Particle_Size=gParticle.Size;
out.Interp_Particle_Color=gParticle.Color;
out.Interp_Particle_Quaternion=gParticle.Quaternion;
out.Interp_Particle_collisionCount_N119=gParticle.collisionCount_N119;
out.Interp_Particle_Mass=gParticle.Mass;
return out;
}
} // VERTEX SHADER


namespace SNAP_FS {
struct ssParticle
{
float3 Position;
float3 Velocity;
float4 Color;
float Size;
float Age;
float Life;
float Mass;
float3x3 Matrix;
bool Dead;
float4 Quaternion;
float SpawnIndex;
float SpawnIndexRemainder;
float NextBurstTime;
float collisionCount_N119;
float SpawnOffset;
float Seed;
float2 Seed2000;
float TimeShift;
int Index1D;
int Index1DPerCopy;
float Index1DPerCopyF;
int StateID;
float Coord1D;
float Ratio1D;
float Ratio1DPerCopy;
int2 Index2D;
float2 Coord2D;
float2 Ratio2D;
float3 Force;
bool Spawned;
float CopyId;
float SpawnAmount;
float BurstAmount;
float BurstPeriod;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float3 VertexTangent_WorldSpace;
float3 VertexNormal_WorldSpace;
float3 VertexBinormal_WorldSpace;
float3 ViewDirWS;
float3 SurfacePosition_WorldSpace;
float gComponentTime;
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
int vfxNumCopies;
int vfxBatchEnable[32];
int vfxEmitParticle[32];
float4x4 vfxModelMatrix[32];
float4 renderTarget0Size;
float4 renderTarget0Dims;
float4 renderTarget0View;
float4 renderTarget1Size;
float4 renderTarget1Dims;
float4 renderTarget1View;
float4 renderTarget2Size;
float4 renderTarget2Dims;
float4 renderTarget2View;
float4 renderTarget3Size;
float4 renderTarget3Dims;
float4 renderTarget3View;
float4 sortRenderTarget0Size;
float4 sortRenderTarget0Dims;
float4 sortRenderTarget0View;
float4 sortRenderTarget1Size;
float4 sortRenderTarget1Dims;
float4 sortRenderTarget1View;
float3 vfxLocalAabbMin;
float3 vfxLocalAabbMax;
float vfxCameraAspect;
float vfxCameraNear;
float vfxCameraFar;
float4x4 vfxProjectionMatrix;
float4x4 vfxProjectionMatrixInverse;
float4x4 vfxViewMatrix;
float4x4 vfxViewMatrixInverse;
float4x4 vfxViewProjectionMatrix;
float4x4 vfxViewProjectionMatrixInverse;
float3 vfxCameraPosition;
float3 vfxCameraUp;
float3 vfxCameraForward;
float3 vfxCameraRight;
int vfxFrame;
int vfxOffsetInstancesRead;
int vfxOffsetInstancesWrite;
float2 vfxTargetSizeRead;
float2 vfxTargetSizeWrite;
int vfxTargetWidth;
float2 ssSORT_RENDER_TARGET_SIZE;
float4 Port_Value1_N132;
float4 Port_Value2_N132;
float Port_AlphaTestThreshold_N039;
float3 Port_Normal_N002;
float Port_Exponent_N002;
float Port_Intensity_N002;
float Port_Input1_N063;
float Port_Input1_N017;
float Port_RangeMinA_N018;
float Port_RangeMaxA_N018;
float Port_RangeMinB_N018;
float Port_RangeMaxB_N018;
float Port_Input1_N065;
float Port_Input2_N065;
float4 Port_Input1_N066;
float4 Port_Value0_N068;
float Port_Position1_N068;
float4 Port_Value1_N068;
float Port_Position2_N068;
float4 Port_Value2_N068;
float4 Port_Value3_N068;
float Port_Input1_N067;
float4 Port_Value0_N178;
float Port_Position1_N178;
float4 Port_Value1_N178;
float4 Port_Value2_N178;
};
struct sc_Set0
{
texture2d<float> intensityTexture [[id(0)]];
texture2d<float> renderTarget0 [[id(1)]];
texture2d<float> renderTarget1 [[id(2)]];
texture2d<float> renderTarget2 [[id(3)]];
texture2d<float> renderTarget3 [[id(4)]];
texture2d<float> sc_ScreenTexture [[id(16)]];
sampler intensityTextureSmpSC [[id(21)]];
sampler renderTarget0SmpSC [[id(22)]];
sampler renderTarget1SmpSC [[id(23)]];
sampler renderTarget2SmpSC [[id(24)]];
sampler renderTarget3SmpSC [[id(25)]];
sampler sc_ScreenTextureSmpSC [[id(30)]];
constant userUniformsObj* UserUniforms [[id(35)]];
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
float2 varShadowTex [[user(locn6)]];
int varStereoViewID [[user(locn7)]];
float varClipDistance [[user(locn8)]];
float4 varColor [[user(locn9)]];
int Interp_Particle_Index [[user(locn10)]];
float3 Interp_Particle_Force [[user(locn11)]];
float2 Interp_Particle_Coord [[user(locn12)]];
float Interp_Particle_SpawnIndex [[user(locn13)]];
float Interp_Particle_NextBurstTime [[user(locn14)]];
float3 Interp_Particle_Position [[user(locn15)]];
float3 Interp_Particle_Velocity [[user(locn16)]];
float Interp_Particle_Life [[user(locn17)]];
float Interp_Particle_Age [[user(locn18)]];
float Interp_Particle_Size [[user(locn19)]];
float4 Interp_Particle_Color [[user(locn20)]];
float4 Interp_Particle_Quaternion [[user(locn21)]];
float Interp_Particle_collisionCount_N119 [[user(locn22)]];
float Interp_Particle_Mass [[user(locn23)]];
float gParticlesDebug [[user(locn24)]];
float2 ParticleUV [[user(locn25)]];
};
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
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_frag_out out={};
float4 Output_Color0=float4(0.0);
float3 ngsTempNormal=float3(0.0);
float4 ngsTempTangent=float4(0.0);
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
discard_fragment();
}
if ((sc_StereoRenderingMode_tmp==1)&&(sc_StereoRendering_IsClipDistanceEnabled_tmp==0))
{
if (in.varClipDistance<0.0)
{
discard_fragment();
}
}
ngsTempNormal=in.varNormalAndMotion.xyz;
ngsTempTangent=float4(in.varTangent.xyz.x,in.varTangent.xyz.y,in.varTangent.xyz.z,ngsTempTangent.w);
ssParticle gParticle;
gParticle.Position=in.Interp_Particle_Position;
gParticle.Velocity=in.Interp_Particle_Velocity;
gParticle.Life=in.Interp_Particle_Life;
gParticle.Age=in.Interp_Particle_Age;
gParticle.Size=in.Interp_Particle_Size;
gParticle.Color=in.Interp_Particle_Color;
gParticle.Quaternion=in.Interp_Particle_Quaternion;
gParticle.collisionCount_N119=in.Interp_Particle_collisionCount_N119;
gParticle.Mass=in.Interp_Particle_Mass;
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gComponentTime=(*sc_set0.UserUniforms).overrideTimeElapsed[in.Interp_Particle_Index/40];
Globals.gTimeDelta=fast::min((*sc_set0.UserUniforms).overrideTimeDelta,0.5);
Globals.gTimeElapsedShifted=(Globals.gTimeElapsed-(gParticle.TimeShift*Globals.gTimeDelta))-0.0;
Globals.VertexTangent_WorldSpace=normalize(ngsTempTangent.xyz);
Globals.VertexNormal_WorldSpace=normalize(ngsTempNormal);
Globals.VertexBinormal_WorldSpace=cross(Globals.VertexNormal_WorldSpace,Globals.VertexTangent_WorldSpace);
Globals.SurfacePosition_WorldSpace=in.varPosAndMotion.xyz;
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-Globals.SurfacePosition_WorldSpace);
int param=in.Interp_Particle_Index;
ssParticle param_1=gParticle;
int l9_0=param/40;
param_1.Spawned=false;
param_1.Dead=false;
param_1.Force=float3(0.0);
param_1.Index1D=param;
param_1.Index1DPerCopy=param%40;
param_1.Index1DPerCopyF=float(param_1.Index1DPerCopy);
param_1.StateID=(40*((param/40)+1))-1;
int l9_1=param_1.Index1D;
int2 l9_2=int2(l9_1%40,l9_1/40);
param_1.Index2D=l9_2;
int l9_3=param_1.Index1D;
float l9_4=(float(l9_3)+0.5)/40.0;
param_1.Coord1D=l9_4;
int2 l9_5=param_1.Index2D;
float2 l9_6=(float2(l9_5)+float2(0.5))/float2(40.0,1.0);
param_1.Coord2D=l9_6;
int l9_7=param_1.Index1D;
float l9_8=float(l9_7)/39.0;
param_1.Ratio1D=l9_8;
int l9_9=param_1.Index1DPerCopy;
float l9_10=float(l9_9)/39.0;
param_1.Ratio1DPerCopy=l9_10;
int2 l9_11=param_1.Index2D;
float2 l9_12=float2(l9_11)/float2(39.0,1.0);
param_1.Ratio2D=l9_12;
param_1.Seed=0.0;
int l9_13=param_1.Index1D;
int l9_14=l9_13;
int l9_15=((l9_14*((l9_14*1471343)+101146501))+1559861749)&2147483647;
int l9_16=l9_15;
float l9_17=float(l9_16)*4.6566129e-10;
float l9_18=l9_17;
param_1.TimeShift=l9_18;
param_1.SpawnOffset=param_1.Ratio1D*0.2;
ssParticle l9_19=param_1;
int l9_20=l9_0;
float l9_21;
if ((*sc_set0.UserUniforms).overrideTimeEnabled==1)
{
l9_21=(*sc_set0.UserUniforms).overrideTimeElapsed[l9_20];
}
else
{
l9_21=(*sc_set0.UserUniforms).sc_Time.x;
}
float l9_22=l9_21;
l9_19.Seed=(l9_19.Ratio1D*0.97637898)+0.151235;
l9_19.Seed+=(floor(((((l9_22-l9_19.SpawnOffset)-0.0)+0.0)+0.40000001)/0.2)*4.32723);
l9_19.Seed=fract(abs(l9_19.Seed));
int2 l9_23=int2(l9_19.Index1D%400,l9_19.Index1D/400);
l9_19.Seed2000=(float2(l9_23)+float2(1.0))/float2(399.0);
param_1=l9_19;
gParticle=param_1;
Globals.gTimeElapsedShifted=(Globals.gTimeElapsed-(gParticle.TimeShift*Globals.gTimeDelta))-0.0;
Output_Color0=gParticle.Color;
float Rim_N2=0.0;
float3 param_2=(*sc_set0.UserUniforms).Port_Normal_N002;
float param_3=(*sc_set0.UserUniforms).Port_Exponent_N002;
float param_4=(*sc_set0.UserUniforms).Port_Intensity_N002;
ssGlobals param_6=Globals;
param_2=float3x3(float3(param_6.VertexTangent_WorldSpace),float3(param_6.VertexBinormal_WorldSpace),float3(param_6.VertexNormal_WorldSpace))*param_2;
float l9_24=abs(dot(-param_6.ViewDirWS,param_2));
float param_5=pow(1.0-l9_24,param_3);
param_5=fast::max(param_5,0.0);
param_5*=param_4;
Rim_N2=param_5;
float3 Position_N3=float3(0.0);
Position_N3=Globals.SurfacePosition_WorldSpace;
float3 Camera_Position_N4=float3(0.0);
Camera_Position_N4=(*sc_set0.UserUniforms).sc_Camera.position;
float Output_N5=0.0;
Output_N5=distance(Position_N3,Camera_Position_N4);
float Output_N17=0.0;
Output_N17=Output_N5*(*sc_set0.UserUniforms).Port_Input1_N017;
float ValueOut_N18=0.0;
float param_7=Output_N17;
float param_9=(*sc_set0.UserUniforms).Port_RangeMinA_N018;
float param_10=(*sc_set0.UserUniforms).Port_RangeMaxA_N018;
float param_11=(*sc_set0.UserUniforms).Port_RangeMinB_N018;
float param_12=(*sc_set0.UserUniforms).Port_RangeMaxB_N018;
float param_8=(((param_7-param_9)/((param_10-param_9)+1e-06))*(param_12-param_11))+param_11;
float l9_25;
if (param_12>param_11)
{
l9_25=fast::clamp(param_8,param_11,param_12);
}
else
{
l9_25=fast::clamp(param_8,param_12,param_11);
}
param_8=l9_25;
ValueOut_N18=param_8;
float Output_N63=0.0;
Output_N63=(Rim_N2*(*sc_set0.UserUniforms).Port_Input1_N063)+ValueOut_N18;
float Output_N64=0.0;
Output_N64=1.0-Output_N63;
float Output_N65=0.0;
Output_N65=fast::clamp(Output_N64+0.001,(*sc_set0.UserUniforms).Port_Input1_N065+0.001,(*sc_set0.UserUniforms).Port_Input2_N065+0.001)-0.001;
float Value_N201=0.0;
Value_N201=fast::clamp(gParticle.Age/gParticle.Life,0.0,1.0);
float4 Output_N66=float4(0.0);
Output_N66=mix(float4(Output_N65),(*sc_set0.UserUniforms).Port_Input1_N066,float4(Value_N201));
float4 Value_N68=float4(0.0);
float param_13=Value_N201;
float4 param_14=(*sc_set0.UserUniforms).Port_Value0_N068;
float param_15=(*sc_set0.UserUniforms).Port_Position1_N068;
float4 param_16=(*sc_set0.UserUniforms).Port_Value1_N068;
float param_17=(*sc_set0.UserUniforms).Port_Position2_N068;
float4 param_18=(*sc_set0.UserUniforms).Port_Value2_N068;
float4 param_19=(*sc_set0.UserUniforms).Port_Value3_N068;
param_13=fast::clamp(param_13,0.0,1.0);
float4 param_20;
if (param_13<param_15)
{
param_20=mix(param_14,param_16,float4(fast::clamp(param_13/param_15,0.0,1.0)));
}
else
{
if (param_13<param_17)
{
param_20=mix(param_16,param_18,float4(fast::clamp((param_13-param_15)/(param_17-param_15),0.0,1.0)));
}
else
{
param_20=mix(param_18,param_19,float4(fast::clamp((param_13-param_17)/(1.0-param_17),0.0,1.0)));
}
}
Value_N68=param_20;
float4 Output_N79=float4(0.0);
Output_N79=Output_N66*Value_N68;
float Output_N67=0.0;
float l9_26;
if (Value_N201<=0.0)
{
l9_26=0.0;
}
else
{
l9_26=pow(Value_N201,(*sc_set0.UserUniforms).Port_Input1_N067);
}
Output_N67=l9_26;
float4 Value_N178=float4(0.0);
float param_21=Output_N67;
float4 param_22=(*sc_set0.UserUniforms).Port_Value0_N178;
float param_23=(*sc_set0.UserUniforms).Port_Position1_N178;
float4 param_24=(*sc_set0.UserUniforms).Port_Value1_N178;
float4 param_25=(*sc_set0.UserUniforms).Port_Value2_N178;
param_21=fast::clamp(param_21,0.0,1.0);
float4 param_26;
if (param_21<param_23)
{
param_26=mix(param_22,param_24,float4(fast::clamp(param_21/param_23,0.0,1.0)));
}
else
{
param_26=mix(param_24,param_25,float4(fast::clamp((param_21-param_23)/(1.0-param_23),0.0,1.0)));
}
Value_N178=param_26;
float4 Value_N98=float4(0.0);
Value_N98=float4(Output_N79.xyz.x,Output_N79.xyz.y,Output_N79.xyz.z,Value_N98.w);
Value_N98.w=Value_N178.x;
float4 param_27=Value_N98;
Output_Color0=param_27;
float4 param_28=Output_Color0;
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_28=float4(param_28.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_27=param_28;
float4 l9_28=float4(0.0);
float4 l9_29=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_30=out.sc_FragData0;
l9_29=l9_30;
}
else
{
float4 l9_31=gl_FragCoord;
float2 l9_32=l9_31.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_33=l9_32;
float2 l9_34=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_35=1;
int l9_36=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_36=0;
}
else
{
l9_36=in.varStereoViewID;
}
int l9_37=l9_36;
int l9_38=l9_37;
float3 l9_39=float3(l9_33,0.0);
int l9_40=l9_35;
int l9_41=l9_38;
if (l9_40==1)
{
l9_39.y=((2.0*l9_39.y)+float(l9_41))-1.0;
}
float2 l9_42=l9_39.xy;
l9_34=l9_42;
}
else
{
l9_34=l9_33;
}
float2 l9_43=l9_34;
float2 l9_44=l9_43;
float2 l9_45=l9_44;
float2 l9_46=l9_45;
float l9_47=0.0;
int l9_48;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_49=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_49=0;
}
else
{
l9_49=in.varStereoViewID;
}
int l9_50=l9_49;
l9_48=1-l9_50;
}
else
{
int l9_51=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_51=0;
}
else
{
l9_51=in.varStereoViewID;
}
int l9_52=l9_51;
l9_48=l9_52;
}
int l9_53=l9_48;
float2 l9_54=l9_46;
int l9_55=sc_ScreenTextureLayout_tmp;
int l9_56=l9_53;
float l9_57=l9_47;
float2 l9_58=l9_54;
int l9_59=l9_55;
int l9_60=l9_56;
float3 l9_61=float3(0.0);
if (l9_59==0)
{
l9_61=float3(l9_58,0.0);
}
else
{
if (l9_59==1)
{
l9_61=float3(l9_58.x,(l9_58.y*0.5)+(0.5-(float(l9_60)*0.5)),0.0);
}
else
{
l9_61=float3(l9_58,float(l9_60));
}
}
float3 l9_62=l9_61;
float3 l9_63=l9_62;
float4 l9_64=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_63.xy,bias(l9_57));
float4 l9_65=l9_64;
float4 l9_66=l9_65;
l9_29=l9_66;
}
float4 l9_67=l9_29;
float3 l9_68=l9_67.xyz;
float3 l9_69=l9_68;
float3 l9_70=l9_27.xyz;
float3 l9_71=definedBlend(l9_69,l9_70,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_28=float4(l9_71.x,l9_71.y,l9_71.z,l9_28.w);
float3 l9_72=mix(l9_68,l9_28.xyz,float3(l9_27.w));
l9_28=float4(l9_72.x,l9_72.y,l9_72.z,l9_28.w);
l9_28.w=1.0;
float4 l9_73=l9_28;
param_28=l9_73;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_74=float4(in.varScreenPos.xyz,1.0);
param_28=l9_74;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_75=gl_FragCoord;
float l9_76=fast::clamp(abs(l9_75.z),0.0,1.0);
float4 l9_77=float4(l9_76,1.0-l9_76,1.0,1.0);
param_28=l9_77;
}
else
{
float4 l9_78=param_28;
float4 l9_79=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_79=float4(mix(float3(1.0),l9_78.xyz,float3(l9_78.w)),l9_78.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_80=l9_78.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_80=fast::clamp(l9_80,0.0,1.0);
}
l9_79=float4(l9_78.xyz*l9_80,l9_80);
}
else
{
l9_79=l9_78;
}
}
float4 l9_81=l9_79;
param_28=l9_81;
}
}
}
}
float4 l9_82=param_28;
Output_Color0=l9_82;
float4 l9_83=float4(0.0);
l9_83=float4(0.0);
float4 l9_84=l9_83;
float4 Cost=l9_84;
if (Cost.w>0.0)
{
Output_Color0=Cost;
}
float4 param_29=Output_Color0;
if (sc_ShaderCacheConstant_tmp!=0)
{
param_29.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=param_29;
return out;
}
} // FRAGMENT SHADER
