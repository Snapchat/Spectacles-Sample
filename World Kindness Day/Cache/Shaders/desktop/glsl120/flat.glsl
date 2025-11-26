//#include <required.glsl> // [HACK 4/6/2023] See SCC shader_merger.cpp
//SG_REFLECTION_BEGIN(100)
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
//sampler sampler baseTexSmpSC 2:17
//sampler sampler intensityTextureSmpSC 2:18
//sampler sampler opacityTexSmpSC 2:19
//sampler sampler sc_ScreenTextureSmpSC 2:24
//texture texture2D baseTex 2:0:2:17
//texture texture2D intensityTexture 2:1:2:18
//texture texture2D opacityTex 2:2:2:19
//texture texture2D sc_ScreenTexture 2:14:2:24
//SG_REFLECTION_END
#if defined VERTEX_SHADER
#define STD_DISABLE_VERTEX_NORMAL 1
#define STD_DISABLE_VERTEX_TANGENT 1
#define sc_StereoRendering_Disabled 0
#define sc_StereoRendering_InstancedClipped 1
#define sc_StereoRendering_Multiview 2
#ifdef GL_ES
    #define SC_GLES_VERSION_20 2000
    #define SC_GLES_VERSION_30 3000
    #define SC_GLES_VERSION_31 3100
    #define SC_GLES_VERSION_32 3200
#endif
#ifdef VERTEX_SHADER
    #define scOutPos(clipPosition) gl_Position=clipPosition
    #define MAIN main
#endif
#ifdef SC_ENABLE_INSTANCED_RENDERING
    #ifndef sc_EnableInstancing
        #define sc_EnableInstancing 1
    #endif
#endif
#define mod(x,y) (x-y*floor((x+1e-6)/y))
#if defined(GL_ES)&&(__VERSION__<300)&&!defined(GL_OES_standard_derivatives)
#define dFdx(A) (A)
#define dFdy(A) (A)
#define fwidth(A) (A)
#endif
#if __VERSION__<300
#define isinf(x) (x!=0.0&&x*2.0==x ? true : false)
#define isnan(x) (x>0.0||x<0.0||x==0.0 ? false : true)
#endif
#ifdef sc_EnableFeatureLevelES3
    #ifdef sc_EnableStereoClipDistance
        #if defined(GL_APPLE_clip_distance)
            #extension GL_APPLE_clip_distance : require
        #elif defined(GL_EXT_clip_cull_distance)
            #extension GL_EXT_clip_cull_distance : require
        #else
            #error Clip distance is requested but not supported by this device.
        #endif
    #endif
#else
    #ifdef sc_EnableStereoClipDistance
        #error Clip distance is requested but not supported by this device.
    #endif
#endif
#ifdef sc_EnableFeatureLevelES3
    #ifdef VERTEX_SHADER
        #define attribute in
        #define varying out
    #endif
    #ifdef FRAGMENT_SHADER
        #define varying in
    #endif
    #define gl_FragColor sc_FragData0
    #define texture2D texture
    #define texture2DLod textureLod
    #define texture2DLodEXT textureLod
    #define textureCubeLodEXT textureLod
    #define sc_CanUseTextureLod 1
#else
    #ifdef FRAGMENT_SHADER
        #if defined(GL_EXT_shader_texture_lod)
            #extension GL_EXT_shader_texture_lod : require
            #define sc_CanUseTextureLod 1
            #define texture2DLod texture2DLodEXT
        #endif
    #endif
#endif
#if defined(sc_EnableMultiviewStereoRendering)
    #define sc_StereoRenderingMode sc_StereoRendering_Multiview
    #define sc_NumStereoViews 2
    #extension GL_OVR_multiview2 : require
    #ifdef VERTEX_SHADER
        #ifdef sc_EnableInstancingFallback
            #define sc_GlobalInstanceID (sc_FallbackInstanceID*2+gl_InstanceID)
        #else
            #define sc_GlobalInstanceID gl_InstanceID
        #endif
        #define sc_LocalInstanceID sc_GlobalInstanceID
        #define sc_StereoViewID int(gl_ViewID_OVR)
    #endif
#elif defined(sc_EnableInstancedClippedStereoRendering)
    #ifndef sc_EnableInstancing
        #error Instanced-clipped stereo rendering requires enabled instancing.
    #endif
    #ifndef sc_EnableStereoClipDistance
        #define sc_StereoRendering_IsClipDistanceEnabled 0
    #else
        #define sc_StereoRendering_IsClipDistanceEnabled 1
    #endif
    #define sc_StereoRenderingMode sc_StereoRendering_InstancedClipped
    #define sc_NumStereoClipPlanes 1
    #define sc_NumStereoViews 2
    #ifdef VERTEX_SHADER
        #ifdef sc_EnableInstancingFallback
            #define sc_GlobalInstanceID (sc_FallbackInstanceID*2+gl_InstanceID)
        #else
            #define sc_GlobalInstanceID gl_InstanceID
        #endif
        #ifdef sc_EnableFeatureLevelES3
            #define sc_LocalInstanceID (sc_GlobalInstanceID/2)
            #define sc_StereoViewID (sc_GlobalInstanceID%2)
        #else
            #define sc_LocalInstanceID int(sc_GlobalInstanceID/2.0)
            #define sc_StereoViewID int(mod(sc_GlobalInstanceID,2.0))
        #endif
    #endif
#else
    #define sc_StereoRenderingMode sc_StereoRendering_Disabled
#endif
#ifdef VERTEX_SHADER
    #ifdef sc_EnableInstancing
        #ifdef GL_ES
            #if defined(sc_EnableFeatureLevelES2)&&!defined(GL_EXT_draw_instanced)
                #define gl_InstanceID (0)
            #endif
        #else
            #if defined(sc_EnableFeatureLevelES2)&&!defined(GL_EXT_draw_instanced)&&!defined(GL_ARB_draw_instanced)&&!defined(GL_EXT_gpu_shader4)
                #define gl_InstanceID (0)
            #endif
        #endif
        #ifdef GL_ARB_draw_instanced
            #extension GL_ARB_draw_instanced : require
            #define gl_InstanceID gl_InstanceIDARB
        #endif
        #ifdef GL_EXT_draw_instanced
            #extension GL_EXT_draw_instanced : require
            #define gl_InstanceID gl_InstanceIDEXT
        #endif
        #ifndef sc_InstanceID
            #define sc_InstanceID gl_InstanceID
        #endif
        #ifndef sc_GlobalInstanceID
            #ifdef sc_EnableInstancingFallback
                #define sc_GlobalInstanceID (sc_FallbackInstanceID)
                #define sc_LocalInstanceID (sc_FallbackInstanceID)
            #else
                #define sc_GlobalInstanceID gl_InstanceID
                #define sc_LocalInstanceID gl_InstanceID
            #endif
        #endif
    #endif
#endif
#ifdef VERTEX_SHADER
    #if (__VERSION__<300)&&!defined(GL_EXT_gpu_shader4)
        #define gl_VertexID (0)
    #endif
#endif
#ifndef GL_ES
        #extension GL_EXT_gpu_shader4 : enable
    #extension GL_ARB_shader_texture_lod : enable
    #ifndef texture2DLodEXT
        #define texture2DLodEXT texture2DLod
    #endif
    #ifndef sc_CanUseTextureLod
    #define sc_CanUseTextureLod 1
    #endif
    #define precision
    #define lowp
    #define mediump
    #define highp
    #define sc_FragmentPrecision
#endif
#ifdef sc_EnableFeatureLevelES3
    #define sc_CanUseSampler2DArray 1
#endif
#if defined(sc_EnableFeatureLevelES2)&&defined(GL_ES)
    #ifdef FRAGMENT_SHADER
        #ifdef GL_OES_standard_derivatives
            #extension GL_OES_standard_derivatives : require
            #define sc_CanUseStandardDerivatives 1
        #endif
    #endif
    #ifdef GL_EXT_texture_array
        #extension GL_EXT_texture_array : require
        #define sc_CanUseSampler2DArray 1
    #else
        #define sc_CanUseSampler2DArray 0
    #endif
#endif
#ifdef GL_ES
    #ifdef sc_FramebufferFetch
        #if defined(GL_EXT_shader_framebuffer_fetch)
            #extension GL_EXT_shader_framebuffer_fetch : require
        #elif defined(GL_ARM_shader_framebuffer_fetch)
            #extension GL_ARM_shader_framebuffer_fetch : require
        #else
            #error Framebuffer fetch is requested but not supported by this device.
        #endif
    #endif
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        #define sc_FragmentPrecision highp
    #else
        #define sc_FragmentPrecision mediump
    #endif
    #ifdef FRAGMENT_SHADER
        precision highp int;
        precision highp float;
    #endif
#endif
#ifdef VERTEX_SHADER
    #ifdef sc_EnableMultiviewStereoRendering
        layout(num_views=sc_NumStereoViews) in;
    #endif
#endif
#if __VERSION__>100
    #define SC_INT_FALLBACK_FLOAT int
    #define SC_INTERPOLATION_FLAT flat
    #define SC_INTERPOLATION_CENTROID centroid
#else
    #define SC_INT_FALLBACK_FLOAT float
    #define SC_INTERPOLATION_FLAT
    #define SC_INTERPOLATION_CENTROID
#endif
#ifndef sc_NumStereoViews
    #define sc_NumStereoViews 1
#endif
#ifndef sc_CanUseSampler2DArray
    #define sc_CanUseSampler2DArray 0
#endif
    #if __VERSION__==100||defined(SCC_VALIDATION)
        #define sampler2DArray vec2
        #define sampler3D vec3
        #define samplerCube vec4
        vec4 texture3D(vec3 s,vec3 uv)                       { return vec4(0.0); }
        vec4 texture3D(vec3 s,vec3 uv,float bias)           { return vec4(0.0); }
        vec4 texture3DLod(vec3 s,vec3 uv,float bias)        { return vec4(0.0); }
        vec4 texture3DLodEXT(vec3 s,vec3 uv,float lod)      { return vec4(0.0); }
        vec4 texture2DArray(vec2 s,vec3 uv)                  { return vec4(0.0); }
        vec4 texture2DArray(vec2 s,vec3 uv,float bias)      { return vec4(0.0); }
        vec4 texture2DArrayLod(vec2 s,vec3 uv,float lod)    { return vec4(0.0); }
        vec4 texture2DArrayLodEXT(vec2 s,vec3 uv,float lod) { return vec4(0.0); }
        vec4 textureCube(vec4 s,vec3 uv)                     { return vec4(0.0); }
        vec4 textureCube(vec4 s,vec3 uv,float lod)          { return vec4(0.0); }
        vec4 textureCubeLod(vec4 s,vec3 uv,float lod)       { return vec4(0.0); }
        vec4 textureCubeLodEXT(vec4 s,vec3 uv,float lod)    { return vec4(0.0); }
        #if defined(VERTEX_SHADER)||!sc_CanUseTextureLod
            #define texture2DLod(s,uv,lod)      vec4(0.0)
            #define texture2DLodEXT(s,uv,lod)   vec4(0.0)
        #endif
    #elif __VERSION__>=300
        #define texture3D texture
        #define textureCube texture
        #define texture2DArray texture
        #define texture2DLod textureLod
        #define texture3DLod textureLod
        #define texture2DLodEXT textureLod
        #define texture3DLodEXT textureLod
        #define textureCubeLod textureLod
        #define textureCubeLodEXT textureLod
        #define texture2DArrayLod textureLod
        #define texture2DArrayLodEXT textureLod
    #endif
    #ifndef sc_TextureRenderingLayout_Regular
        #define sc_TextureRenderingLayout_Regular 0
        #define sc_TextureRenderingLayout_StereoInstancedClipped 1
        #define sc_TextureRenderingLayout_StereoMultiview 2
    #endif
    #define depthToGlobal   depthScreenToViewSpace
    #define depthToLocal    depthViewToScreenSpace
    #ifndef quantizeUV
        #define quantizeUV sc_QuantizeUV
        #define sc_platformUVFlip sc_PlatformFlipV
        #define sc_PlatformFlipUV sc_PlatformFlipV
    #endif
    #ifndef sc_texture2DLod
        #define sc_texture2DLod sc_InternalTextureLevel
        #define sc_textureLod sc_InternalTextureLevel
        #define sc_textureBias sc_InternalTextureBiasOrLevel
        #define sc_texture sc_InternalTexture
    #endif
struct sc_Vertex_t
{
vec4 position;
vec3 normal;
vec3 tangent;
vec2 texture0;
vec2 texture1;
};
#ifndef sc_StereoRenderingMode
#define sc_StereoRenderingMode 0
#endif
#ifndef sc_StereoViewID
#define sc_StereoViewID 0
#endif
#ifndef sc_RenderingSpace
#define sc_RenderingSpace -1
#endif
#ifndef sc_StereoRendering_IsClipDistanceEnabled
#define sc_StereoRendering_IsClipDistanceEnabled 0
#endif
#ifndef sc_NumStereoViews
#define sc_NumStereoViews 1
#endif
#ifndef sc_SkinBonesCount
#define sc_SkinBonesCount 0
#endif
#ifndef STD_DISABLE_VERTEX_NORMAL
#define STD_DISABLE_VERTEX_NORMAL 0
#elif STD_DISABLE_VERTEX_NORMAL==1
#undef STD_DISABLE_VERTEX_NORMAL
#define STD_DISABLE_VERTEX_NORMAL 1
#endif
#ifndef STD_DISABLE_VERTEX_TANGENT
#define STD_DISABLE_VERTEX_TANGENT 0
#elif STD_DISABLE_VERTEX_TANGENT==1
#undef STD_DISABLE_VERTEX_TANGENT
#define STD_DISABLE_VERTEX_TANGENT 1
#endif
#ifndef sc_VertexBlending
#define sc_VertexBlending 0
#elif sc_VertexBlending==1
#undef sc_VertexBlending
#define sc_VertexBlending 1
#endif
#ifndef sc_VertexBlendingUseNormals
#define sc_VertexBlendingUseNormals 0
#elif sc_VertexBlendingUseNormals==1
#undef sc_VertexBlendingUseNormals
#define sc_VertexBlendingUseNormals 1
#endif
struct sc_Camera_t
{
vec3 position;
float aspect;
vec2 clipPlanes;
};
#ifndef sc_IsEditor
#define sc_IsEditor 0
#elif sc_IsEditor==1
#undef sc_IsEditor
#define sc_IsEditor 1
#endif
#ifndef SC_DISABLE_FRUSTUM_CULLING
#define SC_DISABLE_FRUSTUM_CULLING 0
#elif SC_DISABLE_FRUSTUM_CULLING==1
#undef SC_DISABLE_FRUSTUM_CULLING
#define SC_DISABLE_FRUSTUM_CULLING 1
#endif
#ifndef STD_DISABLE_VERTEX_TEXTURE0
#define STD_DISABLE_VERTEX_TEXTURE0 0
#elif STD_DISABLE_VERTEX_TEXTURE0==1
#undef STD_DISABLE_VERTEX_TEXTURE0
#define STD_DISABLE_VERTEX_TEXTURE0 1
#endif
#ifndef STD_DISABLE_VERTEX_TEXTURE1
#define STD_DISABLE_VERTEX_TEXTURE1 0
#elif STD_DISABLE_VERTEX_TEXTURE1==1
#undef STD_DISABLE_VERTEX_TEXTURE1
#define STD_DISABLE_VERTEX_TEXTURE1 1
#endif
#ifndef sc_DepthBufferMode
#define sc_DepthBufferMode 0
#endif
#ifndef sc_ProjectiveShadowsReceiver
#define sc_ProjectiveShadowsReceiver 0
#elif sc_ProjectiveShadowsReceiver==1
#undef sc_ProjectiveShadowsReceiver
#define sc_ProjectiveShadowsReceiver 1
#endif
#ifndef sc_OITDepthGatherPass
#define sc_OITDepthGatherPass 0
#elif sc_OITDepthGatherPass==1
#undef sc_OITDepthGatherPass
#define sc_OITDepthGatherPass 1
#endif
#ifndef sc_OITCompositingPass
#define sc_OITCompositingPass 0
#elif sc_OITCompositingPass==1
#undef sc_OITCompositingPass
#define sc_OITCompositingPass 1
#endif
#ifndef sc_OITDepthBoundsPass
#define sc_OITDepthBoundsPass 0
#elif sc_OITDepthBoundsPass==1
#undef sc_OITDepthBoundsPass
#define sc_OITDepthBoundsPass 1
#endif
#ifndef sc_TAAEnabled
#define sc_TAAEnabled 0
#elif sc_TAAEnabled==1
#undef sc_TAAEnabled
#define sc_TAAEnabled 1
#endif
#ifndef sc_PointLightsCount
#define sc_PointLightsCount 0
#endif
#ifndef sc_DirectionalLightsCount
#define sc_DirectionalLightsCount 0
#endif
#ifndef sc_AmbientLightsCount
#define sc_AmbientLightsCount 0
#endif
struct sc_PointLight_t
{
bool falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
vec3 direction;
vec3 position;
vec4 color;
};
struct sc_DirectionalLight_t
{
vec3 direction;
vec4 color;
};
struct sc_AmbientLight_t
{
vec3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
vec3 color;
float sharpness;
vec3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
vec3 ambientLight;
};
uniform vec4 sc_EnvmapDiffuseDims;
uniform vec4 sc_EnvmapSpecularDims;
uniform vec4 sc_ScreenTextureDims;
uniform mat4 sc_ModelMatrix;
uniform mat4 sc_ProjectorMatrix;
uniform vec4 sc_StereoClipPlanes[sc_NumStereoViews];
uniform vec4 sc_BoneMatrices[((sc_SkinBonesCount*3)+1)];
uniform mat3 sc_SkinBonesNormalMatrices[(sc_SkinBonesCount+1)];
uniform vec4 weights0;
uniform vec4 weights1;
uniform mat4 sc_ViewProjectionMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ModelViewProjectionMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ModelViewMatrixArray[sc_NumStereoViews];
uniform sc_Camera_t sc_Camera;
uniform mat4 sc_ProjectionMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ViewMatrixArray[sc_NumStereoViews];
uniform float sc_DisableFrustumCullingMarker;
uniform mat3 sc_NormalMatrix;
uniform vec2 sc_TAAJitterOffset;
uniform vec4 intensityTextureDims;
uniform vec4 baseTexDims;
uniform vec4 opacityTexDims;
uniform sc_PointLight_t sc_PointLights[(sc_PointLightsCount+1)];
uniform sc_DirectionalLight_t sc_DirectionalLights[(sc_DirectionalLightsCount+1)];
uniform sc_AmbientLight_t sc_AmbientLights[(sc_AmbientLightsCount+1)];
uniform sc_LightEstimationData_t sc_LightEstimationData;
uniform vec4 sc_EnvmapDiffuseSize;
uniform vec4 sc_EnvmapDiffuseView;
uniform vec4 sc_EnvmapSpecularSize;
uniform vec4 sc_EnvmapSpecularView;
uniform vec3 sc_EnvmapRotation;
uniform float sc_EnvmapExposure;
uniform vec3 sc_Sh[9];
uniform float sc_ShIntensity;
uniform vec4 sc_Time;
uniform vec4 sc_UniformConstants;
uniform vec4 sc_GeometryInfo;
uniform mat4 sc_ModelViewProjectionMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ViewProjectionMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ModelViewMatrixInverseArray[sc_NumStereoViews];
uniform mat3 sc_ViewNormalMatrixArray[sc_NumStereoViews];
uniform mat3 sc_ViewNormalMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ProjectionMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ViewMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ModelMatrixInverse;
uniform mat3 sc_NormalMatrixInverse;
uniform vec3 sc_LocalAabbMin;
uniform vec3 sc_LocalAabbMax;
uniform vec3 sc_WorldAabbMin;
uniform vec3 sc_WorldAabbMax;
uniform vec4 sc_WindowToViewportTransform;
uniform float sc_ShadowDensity;
uniform vec4 sc_ShadowColor;
uniform float _sc_GetFramebufferColorInvalidUsageMarker;
uniform float shaderComplexityValue;
uniform vec4 weights2;
uniform int sc_FallbackInstanceID;
uniform float _sc_framebufferFetchMarker;
uniform float strandWidth;
uniform float strandTaper;
uniform vec4 sc_StrandDataMapTextureSize;
uniform float clumpInstanceCount;
uniform float clumpRadius;
uniform float clumpTipScale;
uniform float hairstyleInstanceCount;
uniform float hairstyleNoise;
uniform vec4 sc_ScreenTextureSize;
uniform vec4 sc_ScreenTextureView;
uniform float correctedIntensity;
uniform vec4 intensityTextureSize;
uniform vec4 intensityTextureView;
uniform mat3 intensityTextureTransform;
uniform vec4 intensityTextureUvMinMax;
uniform vec4 intensityTextureBorderColor;
uniform float reflBlurWidth;
uniform float reflBlurMinRough;
uniform float reflBlurMaxRough;
uniform vec4 baseColor;
uniform vec4 baseTexSize;
uniform vec4 baseTexView;
uniform mat3 baseTexTransform;
uniform vec4 baseTexUvMinMax;
uniform vec4 baseTexBorderColor;
uniform vec4 opacityTexSize;
uniform vec4 opacityTexView;
uniform mat3 opacityTexTransform;
uniform vec4 opacityTexUvMinMax;
uniform vec4 opacityTexBorderColor;
varying float varClipDistance;
varying float varStereoViewID;
attribute vec4 boneData;
attribute vec3 blendShape0Pos;
attribute vec3 blendShape0Normal;
attribute vec3 blendShape1Pos;
attribute vec3 blendShape1Normal;
attribute vec3 blendShape2Pos;
attribute vec3 blendShape2Normal;
attribute vec3 blendShape3Pos;
attribute vec3 blendShape4Pos;
attribute vec3 blendShape5Pos;
attribute vec4 position;
attribute vec3 normal;
attribute vec4 tangent;
attribute vec2 texture0;
attribute vec2 texture1;
varying vec3 varPos;
varying vec3 varNormal;
varying vec4 varTangent;
varying vec4 varPackedTex;
varying vec4 varScreenPos;
varying vec2 varScreenTexturePos;
varying vec2 varShadowTex;
varying float varViewSpaceDepth;
varying vec4 varColor;
attribute vec4 color;
attribute vec3 positionNext;
attribute vec3 positionPrevious;
attribute vec4 strandProperties;
void sc_BlendVertex(inout sc_Vertex_t v)
{
#if (sc_VertexBlending)
{
#if (sc_VertexBlendingUseNormals)
{
vec3 l9_0=v.position.xyz+(blendShape0Pos*weights0.x);
v=sc_Vertex_t(vec4(l9_0.x,l9_0.y,l9_0.z,v.position.w),v.normal+(blendShape0Normal*weights0.x),v.tangent,v.texture0,v.texture1);
vec3 l9_1=v.position.xyz+(blendShape1Pos*weights0.y);
v=sc_Vertex_t(vec4(l9_1.x,l9_1.y,l9_1.z,v.position.w),v.normal+(blendShape1Normal*weights0.y),v.tangent,v.texture0,v.texture1);
vec3 l9_2=v.position.xyz+(blendShape2Pos*weights0.z);
v=sc_Vertex_t(vec4(l9_2.x,l9_2.y,l9_2.z,v.position.w),v.normal+(blendShape2Normal*weights0.z),v.tangent,v.texture0,v.texture1);
}
#else
{
vec3 l9_3=v.position.xyz+(blendShape0Pos*weights0.x);
v=sc_Vertex_t(vec4(l9_3.x,l9_3.y,l9_3.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_4=v.position.xyz+(blendShape1Pos*weights0.y);
v=sc_Vertex_t(vec4(l9_4.x,l9_4.y,l9_4.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_5=v.position.xyz+(blendShape2Pos*weights0.z);
v=sc_Vertex_t(vec4(l9_5.x,l9_5.y,l9_5.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_6=v.position.xyz+(blendShape3Pos*weights0.w);
v=sc_Vertex_t(vec4(l9_6.x,l9_6.y,l9_6.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_7=v.position.xyz+(blendShape4Pos*weights1.x);
v=sc_Vertex_t(vec4(l9_7.x,l9_7.y,l9_7.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_8=v.position.xyz+(blendShape5Pos*weights1.y);
v=sc_Vertex_t(vec4(l9_8.x,l9_8.y,l9_8.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
}
#endif
}
#endif
}
void sc_SkinVertex(inout sc_Vertex_t v)
{
#if (sc_SkinBonesCount>0)
{
vec4 l9_0;
#if (sc_SkinBonesCount>0)
{
vec4 l9_1=vec4(1.0,fract(boneData.yzw));
vec4 l9_2=l9_1;
l9_2.x=1.0-dot(l9_1.yzw,vec3(1.0));
l9_0=l9_2;
}
#else
{
l9_0=vec4(0.0);
}
#endif
int l9_3;
#if (sc_SkinBonesCount>0)
{
l9_3=int(boneData.x);
}
#else
{
l9_3=0;
}
#endif
int l9_4;
#if (sc_SkinBonesCount>0)
{
l9_4=int(boneData.y);
}
#else
{
l9_4=0;
}
#endif
int l9_5;
#if (sc_SkinBonesCount>0)
{
l9_5=int(boneData.z);
}
#else
{
l9_5=0;
}
#endif
int l9_6;
#if (sc_SkinBonesCount>0)
{
l9_6=int(boneData.w);
}
#else
{
l9_6=0;
}
#endif
vec4 l9_7=v.position;
vec3 l9_8;
#if (sc_SkinBonesCount>0)
{
int l9_9=3*l9_3;
l9_8=vec3(dot(l9_7,sc_BoneMatrices[l9_9]),dot(l9_7,sc_BoneMatrices[l9_9+1]),dot(l9_7,sc_BoneMatrices[l9_9+2]));
}
#else
{
l9_8=l9_7.xyz;
}
#endif
vec3 l9_10=l9_8*l9_0.x;
vec4 l9_11=v.position;
vec3 l9_12;
#if (sc_SkinBonesCount>0)
{
int l9_13=3*l9_4;
l9_12=vec3(dot(l9_11,sc_BoneMatrices[l9_13]),dot(l9_11,sc_BoneMatrices[l9_13+1]),dot(l9_11,sc_BoneMatrices[l9_13+2]));
}
#else
{
l9_12=l9_11.xyz;
}
#endif
vec3 l9_14=l9_12*l9_0.y;
vec4 l9_15=v.position;
vec3 l9_16;
#if (sc_SkinBonesCount>0)
{
int l9_17=3*l9_5;
l9_16=vec3(dot(l9_15,sc_BoneMatrices[l9_17]),dot(l9_15,sc_BoneMatrices[l9_17+1]),dot(l9_15,sc_BoneMatrices[l9_17+2]));
}
#else
{
l9_16=l9_15.xyz;
}
#endif
vec3 l9_18=l9_16*l9_0.z;
vec4 l9_19=v.position;
vec3 l9_20;
#if (sc_SkinBonesCount>0)
{
int l9_21=3*l9_6;
l9_20=vec3(dot(l9_19,sc_BoneMatrices[l9_21]),dot(l9_19,sc_BoneMatrices[l9_21+1]),dot(l9_19,sc_BoneMatrices[l9_21+2]));
}
#else
{
l9_20=l9_19.xyz;
}
#endif
vec3 l9_22=((l9_10+l9_14)+l9_18)+(l9_20*l9_0.w);
v.position=vec4(l9_22.x,l9_22.y,l9_22.z,v.position.w);
mat3 l9_23;
#if ((!STD_DISABLE_VERTEX_NORMAL)||(!STD_DISABLE_VERTEX_TANGENT))
{
l9_23=sc_SkinBonesNormalMatrices[l9_3];
}
#else
{
l9_23=mat3(0.0);
}
#endif
mat3 l9_24;
#if ((!STD_DISABLE_VERTEX_NORMAL)||(!STD_DISABLE_VERTEX_TANGENT))
{
l9_24=sc_SkinBonesNormalMatrices[l9_4];
}
#else
{
l9_24=mat3(0.0);
}
#endif
mat3 l9_25;
#if ((!STD_DISABLE_VERTEX_NORMAL)||(!STD_DISABLE_VERTEX_TANGENT))
{
l9_25=sc_SkinBonesNormalMatrices[l9_5];
}
#else
{
l9_25=mat3(0.0);
}
#endif
mat3 l9_26;
#if ((!STD_DISABLE_VERTEX_NORMAL)||(!STD_DISABLE_VERTEX_TANGENT))
{
l9_26=sc_SkinBonesNormalMatrices[l9_6];
}
#else
{
l9_26=mat3(0.0);
}
#endif
#if (!STD_DISABLE_VERTEX_NORMAL)
{
v.normal=((((l9_23*v.normal)*l9_0.x)+((l9_24*v.normal)*l9_0.y))+((l9_25*v.normal)*l9_0.z))+((l9_26*v.normal)*l9_0.w);
}
#endif
#if (!STD_DISABLE_VERTEX_TANGENT)
{
v.tangent=((((l9_23*v.tangent)*l9_0.x)+((l9_24*v.tangent)*l9_0.y))+((l9_25*v.tangent)*l9_0.z))+((l9_26*v.tangent)*l9_0.w);
}
#endif
}
#endif
}
void sc_SetClipDistancePlatform(float dstClipDistance)
{
    #if sc_StereoRenderingMode==sc_StereoRendering_InstancedClipped&&sc_StereoRendering_IsClipDistanceEnabled
        gl_ClipDistance[0]=dstClipDistance;
    #endif
}
void sc_ProcessVertex(sc_Vertex_t v)
{
sc_BlendVertex(v);
sc_SkinVertex(v);
vec4 l9_0=v.position;
vec4 l9_1;
#if (sc_RenderingSpace==3)
{
vec4 l9_2;
#if (sc_StereoRenderingMode==1)
{
int l9_3;
#if (sc_StereoRenderingMode==0)
{
l9_3=0;
}
#else
{
l9_3=sc_StereoViewID;
}
#endif
vec4 l9_4=l9_0;
l9_4.y=(l9_0.y*0.5)+(0.5-float(l9_3));
l9_2=l9_4;
}
#else
{
l9_2=l9_0;
}
#endif
l9_1=l9_2;
}
#else
{
vec4 l9_5;
#if (sc_RenderingSpace==2)
{
int l9_6;
#if (sc_StereoRenderingMode==0)
{
l9_6=0;
}
#else
{
l9_6=sc_StereoViewID;
}
#endif
l9_5=sc_ViewProjectionMatrixArray[l9_6]*l9_0;
}
#else
{
vec4 l9_7;
#if (sc_RenderingSpace==1)
{
int l9_8;
#if (sc_StereoRenderingMode==0)
{
l9_8=0;
}
#else
{
l9_8=sc_StereoViewID;
}
#endif
l9_7=sc_ModelViewProjectionMatrixArray[l9_8]*l9_0;
}
#else
{
vec4 l9_9;
#if (sc_RenderingSpace==4)
{
int l9_10;
#if (sc_StereoRenderingMode==0)
{
l9_10=0;
}
#else
{
l9_10=sc_StereoViewID;
}
#endif
vec4 l9_11=(sc_ModelViewMatrixArray[l9_10]*l9_0)*vec4(1.0/sc_Camera.aspect,1.0,1.0,1.0);
vec4 l9_12;
#if (sc_StereoRenderingMode==1)
{
int l9_13;
#if (sc_StereoRenderingMode==0)
{
l9_13=0;
}
#else
{
l9_13=sc_StereoViewID;
}
#endif
vec4 l9_14=l9_11;
l9_14.y=(l9_11.y*0.5)+(0.5-float(l9_13));
l9_12=l9_14;
}
#else
{
l9_12=l9_11;
}
#endif
l9_9=l9_12;
}
#else
{
l9_9=l9_0;
}
#endif
l9_7=l9_9;
}
#endif
l9_5=l9_7;
}
#endif
l9_1=l9_5;
}
#endif
#if ((sc_RenderingSpace==3)||(sc_RenderingSpace==4))
{
varPos=l9_1.xyz;
#if (!STD_DISABLE_VERTEX_NORMAL)
{
varNormal=normalize(v.normal);
}
#endif
#if (!STD_DISABLE_VERTEX_TANGENT)
{
vec3 l9_15=normalize(v.tangent);
varTangent=vec4(l9_15.x,l9_15.y,l9_15.z,varTangent.w);
}
#endif
}
#else
{
#if (sc_RenderingSpace==2)
{
varPos=v.position.xyz;
#if (!STD_DISABLE_VERTEX_NORMAL)
{
varNormal=normalize(v.normal);
}
#endif
#if (!STD_DISABLE_VERTEX_TANGENT)
{
vec3 l9_16=normalize(v.tangent);
varTangent=vec4(l9_16.x,l9_16.y,l9_16.z,varTangent.w);
}
#endif
}
#else
{
#if (sc_RenderingSpace==1)
{
varPos=(sc_ModelMatrix*v.position).xyz;
#if (!STD_DISABLE_VERTEX_NORMAL)
{
varNormal=normalize(sc_NormalMatrix*v.normal);
}
#endif
#if (!STD_DISABLE_VERTEX_TANGENT)
{
vec3 l9_17=normalize(sc_NormalMatrix*v.tangent);
varTangent=vec4(l9_17.x,l9_17.y,l9_17.z,varTangent.w);
}
#endif
}
#endif
}
#endif
}
#endif
#if (!STD_DISABLE_VERTEX_TANGENT)
{
varTangent.w=tangent.w;
}
#endif
#if (!STD_DISABLE_VERTEX_TEXTURE0)
{
varPackedTex=vec4(v.texture0.x,v.texture0.y,varPackedTex.z,varPackedTex.w);
}
#endif
#if (!STD_DISABLE_VERTEX_TEXTURE1)
{
varPackedTex=vec4(varPackedTex.x,varPackedTex.y,v.texture1.x,v.texture1.y);
}
#endif
varScreenPos=l9_1;
vec2 l9_18=((l9_1.xy/vec2(l9_1.w))*0.5)+vec2(0.5);
vec2 l9_19;
#if (sc_StereoRenderingMode==1)
{
int l9_20;
#if (sc_StereoRenderingMode==0)
{
l9_20=0;
}
#else
{
l9_20=sc_StereoViewID;
}
#endif
vec3 l9_21=vec3(l9_18,0.0);
l9_21.y=((2.0*l9_18.y)+float(l9_20))-1.0;
l9_19=l9_21.xy;
}
#else
{
l9_19=l9_18;
}
#endif
varScreenTexturePos=l9_19;
#if (sc_ProjectiveShadowsReceiver)
{
vec4 l9_22=v.position;
vec4 l9_23;
#if (sc_RenderingSpace==1)
{
l9_23=sc_ModelMatrix*l9_22;
}
#else
{
l9_23=l9_22;
}
#endif
vec4 l9_24=sc_ProjectorMatrix*l9_23;
varShadowTex=((l9_24.xy/vec2(l9_24.w))*0.5)+vec2(0.5);
}
#endif
#if ((sc_OITDepthGatherPass||sc_OITCompositingPass)||sc_OITDepthBoundsPass)
{
vec4 l9_25=v.position;
vec4 l9_26;
#if (sc_RenderingSpace==3)
{
int l9_27;
#if (sc_StereoRenderingMode==0)
{
l9_27=0;
}
#else
{
l9_27=sc_StereoViewID;
}
#endif
l9_26=sc_ProjectionMatrixInverseArray[l9_27]*l9_25;
}
#else
{
vec4 l9_28;
#if (sc_RenderingSpace==2)
{
int l9_29;
#if (sc_StereoRenderingMode==0)
{
l9_29=0;
}
#else
{
l9_29=sc_StereoViewID;
}
#endif
l9_28=sc_ViewMatrixArray[l9_29]*l9_25;
}
#else
{
vec4 l9_30;
#if (sc_RenderingSpace==1)
{
int l9_31;
#if (sc_StereoRenderingMode==0)
{
l9_31=0;
}
#else
{
l9_31=sc_StereoViewID;
}
#endif
l9_30=sc_ModelViewMatrixArray[l9_31]*l9_25;
}
#else
{
l9_30=l9_25;
}
#endif
l9_28=l9_30;
}
#endif
l9_26=l9_28;
}
#endif
varViewSpaceDepth=-l9_26.z;
}
#endif
vec4 l9_32;
#if (sc_DepthBufferMode==1)
{
vec4 l9_33=l9_1;
l9_33.z=((log2(max(sc_Camera.clipPlanes.x,1.0+l9_1.w))*(2.0/log2(sc_Camera.clipPlanes.y+1.0)))-1.0)*l9_1.w;
l9_32=l9_33;
}
#else
{
l9_32=l9_1;
}
#endif
vec4 l9_34;
#if (sc_TAAEnabled)
{
vec2 l9_35=l9_32.xy+(sc_TAAJitterOffset*l9_32.w);
l9_34=vec4(l9_35.x,l9_35.y,l9_32.z,l9_32.w);
}
#else
{
l9_34=l9_32;
}
#endif
vec4 l9_36=l9_34*1.0;
#if (sc_StereoRenderingMode>0)
{
varStereoViewID=float(sc_StereoViewID);
}
#endif
#if (sc_StereoRenderingMode==1)
{
float l9_37=dot(l9_36,sc_StereoClipPlanes[sc_StereoViewID]);
#if (sc_StereoRendering_IsClipDistanceEnabled==1)
{
sc_SetClipDistancePlatform(l9_37);
}
#else
{
varClipDistance=l9_37;
}
#endif
}
#endif
gl_Position=l9_36;
}
void main()
{
vec4 l9_0;
#if (sc_IsEditor&&SC_DISABLE_FRUSTUM_CULLING)
{
vec4 l9_1=position;
l9_1.x=position.x+sc_DisableFrustumCullingMarker;
l9_0=l9_1;
}
#else
{
l9_0=position;
}
#endif
vec3 l9_2;
#if (!STD_DISABLE_VERTEX_NORMAL)
{
l9_2=normal;
}
#else
{
l9_2=vec3(0.0);
}
#endif
vec3 l9_3;
#if (!STD_DISABLE_VERTEX_TANGENT)
{
l9_3=tangent.xyz;
}
#else
{
l9_3=vec3(0.0);
}
#endif
vec2 l9_4;
#if (!STD_DISABLE_VERTEX_TEXTURE0)
{
l9_4=texture0;
}
#else
{
l9_4=vec2(0.0);
}
#endif
vec2 l9_5;
#if (!STD_DISABLE_VERTEX_TEXTURE1)
{
l9_5=texture1;
}
#else
{
l9_5=vec2(0.0);
}
#endif
varColor=color;
sc_ProcessVertex(sc_Vertex_t(l9_0,l9_2,l9_3,l9_4,l9_5));
}
#elif defined FRAGMENT_SHADER // #if defined VERTEX_SHADER
#define STD_DISABLE_VERTEX_NORMAL 1
#define STD_DISABLE_VERTEX_TANGENT 1
#define sc_StereoRendering_Disabled 0
#define sc_StereoRendering_InstancedClipped 1
#define sc_StereoRendering_Multiview 2
#ifdef GL_ES
    #define SC_GLES_VERSION_20 2000
    #define SC_GLES_VERSION_30 3000
    #define SC_GLES_VERSION_31 3100
    #define SC_GLES_VERSION_32 3200
#endif
#ifdef VERTEX_SHADER
    #define scOutPos(clipPosition) gl_Position=clipPosition
    #define MAIN main
#endif
#ifdef SC_ENABLE_INSTANCED_RENDERING
    #ifndef sc_EnableInstancing
        #define sc_EnableInstancing 1
    #endif
#endif
#define mod(x,y) (x-y*floor((x+1e-6)/y))
#if defined(GL_ES)&&(__VERSION__<300)&&!defined(GL_OES_standard_derivatives)
#define dFdx(A) (A)
#define dFdy(A) (A)
#define fwidth(A) (A)
#endif
#if __VERSION__<300
#define isinf(x) (x!=0.0&&x*2.0==x ? true : false)
#define isnan(x) (x>0.0||x<0.0||x==0.0 ? false : true)
#endif
#ifdef sc_EnableFeatureLevelES3
    #ifdef sc_EnableStereoClipDistance
        #if defined(GL_APPLE_clip_distance)
            #extension GL_APPLE_clip_distance : require
        #elif defined(GL_EXT_clip_cull_distance)
            #extension GL_EXT_clip_cull_distance : require
        #else
            #error Clip distance is requested but not supported by this device.
        #endif
    #endif
#else
    #ifdef sc_EnableStereoClipDistance
        #error Clip distance is requested but not supported by this device.
    #endif
#endif
#ifdef sc_EnableFeatureLevelES3
    #ifdef VERTEX_SHADER
        #define attribute in
        #define varying out
    #endif
    #ifdef FRAGMENT_SHADER
        #define varying in
    #endif
    #define gl_FragColor sc_FragData0
    #define texture2D texture
    #define texture2DLod textureLod
    #define texture2DLodEXT textureLod
    #define textureCubeLodEXT textureLod
    #define sc_CanUseTextureLod 1
#else
    #ifdef FRAGMENT_SHADER
        #if defined(GL_EXT_shader_texture_lod)
            #extension GL_EXT_shader_texture_lod : require
            #define sc_CanUseTextureLod 1
            #define texture2DLod texture2DLodEXT
        #endif
    #endif
#endif
#if defined(sc_EnableMultiviewStereoRendering)
    #define sc_StereoRenderingMode sc_StereoRendering_Multiview
    #define sc_NumStereoViews 2
    #extension GL_OVR_multiview2 : require
    #ifdef VERTEX_SHADER
        #ifdef sc_EnableInstancingFallback
            #define sc_GlobalInstanceID (sc_FallbackInstanceID*2+gl_InstanceID)
        #else
            #define sc_GlobalInstanceID gl_InstanceID
        #endif
        #define sc_LocalInstanceID sc_GlobalInstanceID
        #define sc_StereoViewID int(gl_ViewID_OVR)
    #endif
#elif defined(sc_EnableInstancedClippedStereoRendering)
    #ifndef sc_EnableInstancing
        #error Instanced-clipped stereo rendering requires enabled instancing.
    #endif
    #ifndef sc_EnableStereoClipDistance
        #define sc_StereoRendering_IsClipDistanceEnabled 0
    #else
        #define sc_StereoRendering_IsClipDistanceEnabled 1
    #endif
    #define sc_StereoRenderingMode sc_StereoRendering_InstancedClipped
    #define sc_NumStereoClipPlanes 1
    #define sc_NumStereoViews 2
    #ifdef VERTEX_SHADER
        #ifdef sc_EnableInstancingFallback
            #define sc_GlobalInstanceID (sc_FallbackInstanceID*2+gl_InstanceID)
        #else
            #define sc_GlobalInstanceID gl_InstanceID
        #endif
        #ifdef sc_EnableFeatureLevelES3
            #define sc_LocalInstanceID (sc_GlobalInstanceID/2)
            #define sc_StereoViewID (sc_GlobalInstanceID%2)
        #else
            #define sc_LocalInstanceID int(sc_GlobalInstanceID/2.0)
            #define sc_StereoViewID int(mod(sc_GlobalInstanceID,2.0))
        #endif
    #endif
#else
    #define sc_StereoRenderingMode sc_StereoRendering_Disabled
#endif
#ifdef VERTEX_SHADER
    #ifdef sc_EnableInstancing
        #ifdef GL_ES
            #if defined(sc_EnableFeatureLevelES2)&&!defined(GL_EXT_draw_instanced)
                #define gl_InstanceID (0)
            #endif
        #else
            #if defined(sc_EnableFeatureLevelES2)&&!defined(GL_EXT_draw_instanced)&&!defined(GL_ARB_draw_instanced)&&!defined(GL_EXT_gpu_shader4)
                #define gl_InstanceID (0)
            #endif
        #endif
        #ifdef GL_ARB_draw_instanced
            #extension GL_ARB_draw_instanced : require
            #define gl_InstanceID gl_InstanceIDARB
        #endif
        #ifdef GL_EXT_draw_instanced
            #extension GL_EXT_draw_instanced : require
            #define gl_InstanceID gl_InstanceIDEXT
        #endif
        #ifndef sc_InstanceID
            #define sc_InstanceID gl_InstanceID
        #endif
        #ifndef sc_GlobalInstanceID
            #ifdef sc_EnableInstancingFallback
                #define sc_GlobalInstanceID (sc_FallbackInstanceID)
                #define sc_LocalInstanceID (sc_FallbackInstanceID)
            #else
                #define sc_GlobalInstanceID gl_InstanceID
                #define sc_LocalInstanceID gl_InstanceID
            #endif
        #endif
    #endif
#endif
#ifdef VERTEX_SHADER
    #if (__VERSION__<300)&&!defined(GL_EXT_gpu_shader4)
        #define gl_VertexID (0)
    #endif
#endif
#ifndef GL_ES
        #extension GL_EXT_gpu_shader4 : enable
    #extension GL_ARB_shader_texture_lod : enable
    #ifndef texture2DLodEXT
        #define texture2DLodEXT texture2DLod
    #endif
    #ifndef sc_CanUseTextureLod
    #define sc_CanUseTextureLod 1
    #endif
    #define precision
    #define lowp
    #define mediump
    #define highp
    #define sc_FragmentPrecision
#endif
#ifdef sc_EnableFeatureLevelES3
    #define sc_CanUseSampler2DArray 1
#endif
#if defined(sc_EnableFeatureLevelES2)&&defined(GL_ES)
    #ifdef FRAGMENT_SHADER
        #ifdef GL_OES_standard_derivatives
            #extension GL_OES_standard_derivatives : require
            #define sc_CanUseStandardDerivatives 1
        #endif
    #endif
    #ifdef GL_EXT_texture_array
        #extension GL_EXT_texture_array : require
        #define sc_CanUseSampler2DArray 1
    #else
        #define sc_CanUseSampler2DArray 0
    #endif
#endif
#ifdef GL_ES
    #ifdef sc_FramebufferFetch
        #if defined(GL_EXT_shader_framebuffer_fetch)
            #extension GL_EXT_shader_framebuffer_fetch : require
        #elif defined(GL_ARM_shader_framebuffer_fetch)
            #extension GL_ARM_shader_framebuffer_fetch : require
        #else
            #error Framebuffer fetch is requested but not supported by this device.
        #endif
    #endif
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        #define sc_FragmentPrecision highp
    #else
        #define sc_FragmentPrecision mediump
    #endif
    #ifdef FRAGMENT_SHADER
        precision highp int;
        precision highp float;
    #endif
#endif
#ifdef VERTEX_SHADER
    #ifdef sc_EnableMultiviewStereoRendering
        layout(num_views=sc_NumStereoViews) in;
    #endif
#endif
#if __VERSION__>100
    #define SC_INT_FALLBACK_FLOAT int
    #define SC_INTERPOLATION_FLAT flat
    #define SC_INTERPOLATION_CENTROID centroid
#else
    #define SC_INT_FALLBACK_FLOAT float
    #define SC_INTERPOLATION_FLAT
    #define SC_INTERPOLATION_CENTROID
#endif
#ifndef sc_NumStereoViews
    #define sc_NumStereoViews 1
#endif
#ifndef sc_CanUseSampler2DArray
    #define sc_CanUseSampler2DArray 0
#endif
    #if __VERSION__==100||defined(SCC_VALIDATION)
        #define sampler2DArray vec2
        #define sampler3D vec3
        #define samplerCube vec4
        vec4 texture3D(vec3 s,vec3 uv)                       { return vec4(0.0); }
        vec4 texture3D(vec3 s,vec3 uv,float bias)           { return vec4(0.0); }
        vec4 texture3DLod(vec3 s,vec3 uv,float bias)        { return vec4(0.0); }
        vec4 texture3DLodEXT(vec3 s,vec3 uv,float lod)      { return vec4(0.0); }
        vec4 texture2DArray(vec2 s,vec3 uv)                  { return vec4(0.0); }
        vec4 texture2DArray(vec2 s,vec3 uv,float bias)      { return vec4(0.0); }
        vec4 texture2DArrayLod(vec2 s,vec3 uv,float lod)    { return vec4(0.0); }
        vec4 texture2DArrayLodEXT(vec2 s,vec3 uv,float lod) { return vec4(0.0); }
        vec4 textureCube(vec4 s,vec3 uv)                     { return vec4(0.0); }
        vec4 textureCube(vec4 s,vec3 uv,float lod)          { return vec4(0.0); }
        vec4 textureCubeLod(vec4 s,vec3 uv,float lod)       { return vec4(0.0); }
        vec4 textureCubeLodEXT(vec4 s,vec3 uv,float lod)    { return vec4(0.0); }
        #if defined(VERTEX_SHADER)||!sc_CanUseTextureLod
            #define texture2DLod(s,uv,lod)      vec4(0.0)
            #define texture2DLodEXT(s,uv,lod)   vec4(0.0)
        #endif
    #elif __VERSION__>=300
        #define texture3D texture
        #define textureCube texture
        #define texture2DArray texture
        #define texture2DLod textureLod
        #define texture3DLod textureLod
        #define texture2DLodEXT textureLod
        #define texture3DLodEXT textureLod
        #define textureCubeLod textureLod
        #define textureCubeLodEXT textureLod
        #define texture2DArrayLod textureLod
        #define texture2DArrayLodEXT textureLod
    #endif
    #ifndef sc_TextureRenderingLayout_Regular
        #define sc_TextureRenderingLayout_Regular 0
        #define sc_TextureRenderingLayout_StereoInstancedClipped 1
        #define sc_TextureRenderingLayout_StereoMultiview 2
    #endif
    #define depthToGlobal   depthScreenToViewSpace
    #define depthToLocal    depthViewToScreenSpace
    #ifndef quantizeUV
        #define quantizeUV sc_QuantizeUV
        #define sc_platformUVFlip sc_PlatformFlipV
        #define sc_PlatformFlipUV sc_PlatformFlipV
    #endif
    #ifndef sc_texture2DLod
        #define sc_texture2DLod sc_InternalTextureLevel
        #define sc_textureLod sc_InternalTextureLevel
        #define sc_textureBias sc_InternalTextureBiasOrLevel
        #define sc_texture sc_InternalTexture
    #endif
    #if sc_ExporterVersion<224
        #if sc_StereoRenderingMode==sc_StereoRendering_InstancedClipped&&!sc_StereoRendering_IsClipDistanceEnabled
            #define sc_StereoFragmentMain main
            #define sc_MainInjector MAIN(); void sc_MainInjected
        #else
            #define MAIN sc_MainInjector
        #endif
    #endif
    #ifndef sc_FramebufferFetch
    #define sc_FramebufferFetch 0
    #elif sc_FramebufferFetch==1
    #undef sc_FramebufferFetch
    #define sc_FramebufferFetch 1
    #endif
    #if !defined(GL_ES)&&__VERSION__<420
        #ifdef FRAGMENT_SHADER
            #define sc_FragData0 gl_FragData[0]
            #define sc_FragData1 gl_FragData[1]
            #define sc_FragData2 gl_FragData[2]
            #define sc_FragData3 gl_FragData[3]
        #endif
        mat4 getFragData() { return mat4(vec4(0.0),vec4(0.0),vec4(0.0),vec4(0.0)); }
        #define gl_LastFragData (getFragData())
        #if sc_FramebufferFetch
            #error Framebuffer fetch is requested but not supported by this device.
        #endif
    #elif defined(sc_EnableFeatureLevelES3)
        #if sc_FragDataCount>=1
            #define sc_DeclareFragData0(StorageQualifier) layout(location=0) StorageQualifier sc_FragmentPrecision vec4 sc_FragData0
        #endif
        #if sc_FragDataCount>=2
            #define sc_DeclareFragData1(StorageQualifier) layout(location=1) StorageQualifier sc_FragmentPrecision vec4 sc_FragData1
        #endif
        #if sc_FragDataCount>=3
            #define sc_DeclareFragData2(StorageQualifier) layout(location=2) StorageQualifier sc_FragmentPrecision vec4 sc_FragData2
        #endif
        #if sc_FragDataCount>=4
            #define sc_DeclareFragData3(StorageQualifier) layout(location=3) StorageQualifier sc_FragmentPrecision vec4 sc_FragData3
        #endif
        #ifndef sc_DeclareFragData0
            #define sc_DeclareFragData0(_) const vec4 sc_FragData0=vec4(0.0)
        #endif
        #ifndef sc_DeclareFragData1
            #define sc_DeclareFragData1(_) const vec4 sc_FragData1=vec4(0.0)
        #endif
        #ifndef sc_DeclareFragData2
            #define sc_DeclareFragData2(_) const vec4 sc_FragData2=vec4(0.0)
        #endif
        #ifndef sc_DeclareFragData3
            #define sc_DeclareFragData3(_) const vec4 sc_FragData3=vec4(0.0)
        #endif
        #if sc_FramebufferFetch
            #ifdef GL_EXT_shader_framebuffer_fetch
                sc_DeclareFragData0(inout);
                sc_DeclareFragData1(inout);
                sc_DeclareFragData2(inout);
                sc_DeclareFragData3(inout);
                mediump mat4 getFragData() { return mat4(sc_FragData0,sc_FragData1,sc_FragData2,sc_FragData3); }
                #define gl_LastFragData (getFragData())
            #elif defined(GL_ARM_shader_framebuffer_fetch)
                sc_DeclareFragData0(out);
                sc_DeclareFragData1(out);
                sc_DeclareFragData2(out);
                sc_DeclareFragData3(out);
                mediump mat4 getFragData() { return mat4(gl_LastFragColorARM,vec4(0.0),vec4(0.0),vec4(0.0)); }
                #define gl_LastFragData (getFragData())
            #endif
        #else
            #ifdef sc_EnableFeatureLevelES3
                sc_DeclareFragData0(out);
                sc_DeclareFragData1(out);
                sc_DeclareFragData2(out);
                sc_DeclareFragData3(out);
                mediump mat4 getFragData() { return mat4(vec4(0.0),vec4(0.0),vec4(0.0),vec4(0.0)); }
                #define gl_LastFragData (getFragData())
            #endif
        #endif
    #elif defined(sc_EnableFeatureLevelES2)
        #define sc_FragData0 gl_FragColor
        mediump mat4 getFragData() { return mat4(vec4(0.0),vec4(0.0),vec4(0.0),vec4(0.0)); }
    #else
        #define sc_FragData0 gl_FragColor
        mediump mat4 getFragData() { return mat4(vec4(0.0),vec4(0.0),vec4(0.0),vec4(0.0)); }
    #endif
#ifndef sc_StereoRenderingMode
#define sc_StereoRenderingMode 0
#endif
#ifndef sc_ScreenTextureHasSwappedViews
#define sc_ScreenTextureHasSwappedViews 0
#elif sc_ScreenTextureHasSwappedViews==1
#undef sc_ScreenTextureHasSwappedViews
#define sc_ScreenTextureHasSwappedViews 1
#endif
#ifndef sc_ScreenTextureLayout
#define sc_ScreenTextureLayout 0
#endif
#ifndef sc_NumStereoViews
#define sc_NumStereoViews 1
#endif
#ifndef sc_BlendMode_PremultipliedAlphaHardware
#define sc_BlendMode_PremultipliedAlphaHardware 0
#elif sc_BlendMode_PremultipliedAlphaHardware==1
#undef sc_BlendMode_PremultipliedAlphaHardware
#define sc_BlendMode_PremultipliedAlphaHardware 1
#endif
#ifndef sc_BlendMode_PremultipliedAlpha
#define sc_BlendMode_PremultipliedAlpha 0
#elif sc_BlendMode_PremultipliedAlpha==1
#undef sc_BlendMode_PremultipliedAlpha
#define sc_BlendMode_PremultipliedAlpha 1
#endif
#ifndef sc_BlendMode_MultiplyOriginal
#define sc_BlendMode_MultiplyOriginal 0
#elif sc_BlendMode_MultiplyOriginal==1
#undef sc_BlendMode_MultiplyOriginal
#define sc_BlendMode_MultiplyOriginal 1
#endif
#ifndef sc_BlendMode_ColoredGlass
#define sc_BlendMode_ColoredGlass 0
#elif sc_BlendMode_ColoredGlass==1
#undef sc_BlendMode_ColoredGlass
#define sc_BlendMode_ColoredGlass 1
#endif
#ifndef sc_BlendMode_Screen
#define sc_BlendMode_Screen 0
#elif sc_BlendMode_Screen==1
#undef sc_BlendMode_Screen
#define sc_BlendMode_Screen 1
#endif
#ifndef sc_StereoRendering_IsClipDistanceEnabled
#define sc_StereoRendering_IsClipDistanceEnabled 0
#endif
#ifndef sc_UseFramebufferFetchMarker
#define sc_UseFramebufferFetchMarker 0
#elif sc_UseFramebufferFetchMarker==1
#undef sc_UseFramebufferFetchMarker
#define sc_UseFramebufferFetchMarker 1
#endif
#ifndef sc_FramebufferFetch
#define sc_FramebufferFetch 0
#elif sc_FramebufferFetch==1
#undef sc_FramebufferFetch
#define sc_FramebufferFetch 1
#endif
#ifndef sc_IsEditor
#define sc_IsEditor 0
#elif sc_IsEditor==1
#undef sc_IsEditor
#define sc_IsEditor 1
#endif
#ifndef sc_GetFramebufferColorInvalidUsageMarker
#define sc_GetFramebufferColorInvalidUsageMarker 0
#elif sc_GetFramebufferColorInvalidUsageMarker==1
#undef sc_GetFramebufferColorInvalidUsageMarker
#define sc_GetFramebufferColorInvalidUsageMarker 1
#endif
#ifndef sc_BlendMode_Software
#define sc_BlendMode_Software 0
#elif sc_BlendMode_Software==1
#undef sc_BlendMode_Software
#define sc_BlendMode_Software 1
#endif
#ifndef intensityTextureHasSwappedViews
#define intensityTextureHasSwappedViews 0
#elif intensityTextureHasSwappedViews==1
#undef intensityTextureHasSwappedViews
#define intensityTextureHasSwappedViews 1
#endif
#ifndef intensityTextureLayout
#define intensityTextureLayout 0
#endif
#ifndef BLEND_MODE_REALISTIC
#define BLEND_MODE_REALISTIC 0
#elif BLEND_MODE_REALISTIC==1
#undef BLEND_MODE_REALISTIC
#define BLEND_MODE_REALISTIC 1
#endif
#ifndef BLEND_MODE_FORGRAY
#define BLEND_MODE_FORGRAY 0
#elif BLEND_MODE_FORGRAY==1
#undef BLEND_MODE_FORGRAY
#define BLEND_MODE_FORGRAY 1
#endif
#ifndef BLEND_MODE_NOTBRIGHT
#define BLEND_MODE_NOTBRIGHT 0
#elif BLEND_MODE_NOTBRIGHT==1
#undef BLEND_MODE_NOTBRIGHT
#define BLEND_MODE_NOTBRIGHT 1
#endif
#ifndef BLEND_MODE_DIVISION
#define BLEND_MODE_DIVISION 0
#elif BLEND_MODE_DIVISION==1
#undef BLEND_MODE_DIVISION
#define BLEND_MODE_DIVISION 1
#endif
#ifndef BLEND_MODE_BRIGHT
#define BLEND_MODE_BRIGHT 0
#elif BLEND_MODE_BRIGHT==1
#undef BLEND_MODE_BRIGHT
#define BLEND_MODE_BRIGHT 1
#endif
#ifndef BLEND_MODE_INTENSE
#define BLEND_MODE_INTENSE 0
#elif BLEND_MODE_INTENSE==1
#undef BLEND_MODE_INTENSE
#define BLEND_MODE_INTENSE 1
#endif
#ifndef SC_USE_UV_TRANSFORM_intensityTexture
#define SC_USE_UV_TRANSFORM_intensityTexture 0
#elif SC_USE_UV_TRANSFORM_intensityTexture==1
#undef SC_USE_UV_TRANSFORM_intensityTexture
#define SC_USE_UV_TRANSFORM_intensityTexture 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_intensityTexture
#define SC_SOFTWARE_WRAP_MODE_U_intensityTexture -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_intensityTexture
#define SC_SOFTWARE_WRAP_MODE_V_intensityTexture -1
#endif
#ifndef SC_USE_UV_MIN_MAX_intensityTexture
#define SC_USE_UV_MIN_MAX_intensityTexture 0
#elif SC_USE_UV_MIN_MAX_intensityTexture==1
#undef SC_USE_UV_MIN_MAX_intensityTexture
#define SC_USE_UV_MIN_MAX_intensityTexture 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_intensityTexture
#define SC_USE_CLAMP_TO_BORDER_intensityTexture 0
#elif SC_USE_CLAMP_TO_BORDER_intensityTexture==1
#undef SC_USE_CLAMP_TO_BORDER_intensityTexture
#define SC_USE_CLAMP_TO_BORDER_intensityTexture 1
#endif
#ifndef BLEND_MODE_LIGHTEN
#define BLEND_MODE_LIGHTEN 0
#elif BLEND_MODE_LIGHTEN==1
#undef BLEND_MODE_LIGHTEN
#define BLEND_MODE_LIGHTEN 1
#endif
#ifndef BLEND_MODE_DARKEN
#define BLEND_MODE_DARKEN 0
#elif BLEND_MODE_DARKEN==1
#undef BLEND_MODE_DARKEN
#define BLEND_MODE_DARKEN 1
#endif
#ifndef BLEND_MODE_DIVIDE
#define BLEND_MODE_DIVIDE 0
#elif BLEND_MODE_DIVIDE==1
#undef BLEND_MODE_DIVIDE
#define BLEND_MODE_DIVIDE 1
#endif
#ifndef BLEND_MODE_AVERAGE
#define BLEND_MODE_AVERAGE 0
#elif BLEND_MODE_AVERAGE==1
#undef BLEND_MODE_AVERAGE
#define BLEND_MODE_AVERAGE 1
#endif
#ifndef BLEND_MODE_SUBTRACT
#define BLEND_MODE_SUBTRACT 0
#elif BLEND_MODE_SUBTRACT==1
#undef BLEND_MODE_SUBTRACT
#define BLEND_MODE_SUBTRACT 1
#endif
#ifndef BLEND_MODE_DIFFERENCE
#define BLEND_MODE_DIFFERENCE 0
#elif BLEND_MODE_DIFFERENCE==1
#undef BLEND_MODE_DIFFERENCE
#define BLEND_MODE_DIFFERENCE 1
#endif
#ifndef BLEND_MODE_NEGATION
#define BLEND_MODE_NEGATION 0
#elif BLEND_MODE_NEGATION==1
#undef BLEND_MODE_NEGATION
#define BLEND_MODE_NEGATION 1
#endif
#ifndef BLEND_MODE_EXCLUSION
#define BLEND_MODE_EXCLUSION 0
#elif BLEND_MODE_EXCLUSION==1
#undef BLEND_MODE_EXCLUSION
#define BLEND_MODE_EXCLUSION 1
#endif
#ifndef BLEND_MODE_OVERLAY
#define BLEND_MODE_OVERLAY 0
#elif BLEND_MODE_OVERLAY==1
#undef BLEND_MODE_OVERLAY
#define BLEND_MODE_OVERLAY 1
#endif
#ifndef BLEND_MODE_SOFT_LIGHT
#define BLEND_MODE_SOFT_LIGHT 0
#elif BLEND_MODE_SOFT_LIGHT==1
#undef BLEND_MODE_SOFT_LIGHT
#define BLEND_MODE_SOFT_LIGHT 1
#endif
#ifndef BLEND_MODE_HARD_LIGHT
#define BLEND_MODE_HARD_LIGHT 0
#elif BLEND_MODE_HARD_LIGHT==1
#undef BLEND_MODE_HARD_LIGHT
#define BLEND_MODE_HARD_LIGHT 1
#endif
#ifndef BLEND_MODE_COLOR_DODGE
#define BLEND_MODE_COLOR_DODGE 0
#elif BLEND_MODE_COLOR_DODGE==1
#undef BLEND_MODE_COLOR_DODGE
#define BLEND_MODE_COLOR_DODGE 1
#endif
#ifndef BLEND_MODE_COLOR_BURN
#define BLEND_MODE_COLOR_BURN 0
#elif BLEND_MODE_COLOR_BURN==1
#undef BLEND_MODE_COLOR_BURN
#define BLEND_MODE_COLOR_BURN 1
#endif
#ifndef BLEND_MODE_LINEAR_LIGHT
#define BLEND_MODE_LINEAR_LIGHT 0
#elif BLEND_MODE_LINEAR_LIGHT==1
#undef BLEND_MODE_LINEAR_LIGHT
#define BLEND_MODE_LINEAR_LIGHT 1
#endif
#ifndef BLEND_MODE_VIVID_LIGHT
#define BLEND_MODE_VIVID_LIGHT 0
#elif BLEND_MODE_VIVID_LIGHT==1
#undef BLEND_MODE_VIVID_LIGHT
#define BLEND_MODE_VIVID_LIGHT 1
#endif
#ifndef BLEND_MODE_PIN_LIGHT
#define BLEND_MODE_PIN_LIGHT 0
#elif BLEND_MODE_PIN_LIGHT==1
#undef BLEND_MODE_PIN_LIGHT
#define BLEND_MODE_PIN_LIGHT 1
#endif
#ifndef BLEND_MODE_HARD_MIX
#define BLEND_MODE_HARD_MIX 0
#elif BLEND_MODE_HARD_MIX==1
#undef BLEND_MODE_HARD_MIX
#define BLEND_MODE_HARD_MIX 1
#endif
#ifndef BLEND_MODE_HARD_REFLECT
#define BLEND_MODE_HARD_REFLECT 0
#elif BLEND_MODE_HARD_REFLECT==1
#undef BLEND_MODE_HARD_REFLECT
#define BLEND_MODE_HARD_REFLECT 1
#endif
#ifndef BLEND_MODE_HARD_GLOW
#define BLEND_MODE_HARD_GLOW 0
#elif BLEND_MODE_HARD_GLOW==1
#undef BLEND_MODE_HARD_GLOW
#define BLEND_MODE_HARD_GLOW 1
#endif
#ifndef BLEND_MODE_HARD_PHOENIX
#define BLEND_MODE_HARD_PHOENIX 0
#elif BLEND_MODE_HARD_PHOENIX==1
#undef BLEND_MODE_HARD_PHOENIX
#define BLEND_MODE_HARD_PHOENIX 1
#endif
#ifndef BLEND_MODE_HUE
#define BLEND_MODE_HUE 0
#elif BLEND_MODE_HUE==1
#undef BLEND_MODE_HUE
#define BLEND_MODE_HUE 1
#endif
#ifndef BLEND_MODE_SATURATION
#define BLEND_MODE_SATURATION 0
#elif BLEND_MODE_SATURATION==1
#undef BLEND_MODE_SATURATION
#define BLEND_MODE_SATURATION 1
#endif
#ifndef BLEND_MODE_COLOR
#define BLEND_MODE_COLOR 0
#elif BLEND_MODE_COLOR==1
#undef BLEND_MODE_COLOR
#define BLEND_MODE_COLOR 1
#endif
#ifndef BLEND_MODE_LUMINOSITY
#define BLEND_MODE_LUMINOSITY 0
#elif BLEND_MODE_LUMINOSITY==1
#undef BLEND_MODE_LUMINOSITY
#define BLEND_MODE_LUMINOSITY 1
#endif
#ifndef sc_SkinBonesCount
#define sc_SkinBonesCount 0
#endif
#ifndef baseTexHasSwappedViews
#define baseTexHasSwappedViews 0
#elif baseTexHasSwappedViews==1
#undef baseTexHasSwappedViews
#define baseTexHasSwappedViews 1
#endif
#ifndef baseTexLayout
#define baseTexLayout 0
#endif
#ifndef opacityTexHasSwappedViews
#define opacityTexHasSwappedViews 0
#elif opacityTexHasSwappedViews==1
#undef opacityTexHasSwappedViews
#define opacityTexHasSwappedViews 1
#endif
#ifndef opacityTexLayout
#define opacityTexLayout 0
#endif
#ifndef ENABLE_VERTEX_COLOR_BASE
#define ENABLE_VERTEX_COLOR_BASE 0
#elif ENABLE_VERTEX_COLOR_BASE==1
#undef ENABLE_VERTEX_COLOR_BASE
#define ENABLE_VERTEX_COLOR_BASE 1
#endif
#ifndef NOTEXTURE
#define NOTEXTURE 0
#elif NOTEXTURE==1
#undef NOTEXTURE
#define NOTEXTURE 1
#endif
#ifndef SC_USE_UV_TRANSFORM_baseTex
#define SC_USE_UV_TRANSFORM_baseTex 0
#elif SC_USE_UV_TRANSFORM_baseTex==1
#undef SC_USE_UV_TRANSFORM_baseTex
#define SC_USE_UV_TRANSFORM_baseTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_baseTex
#define SC_SOFTWARE_WRAP_MODE_U_baseTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_baseTex
#define SC_SOFTWARE_WRAP_MODE_V_baseTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_baseTex
#define SC_USE_UV_MIN_MAX_baseTex 0
#elif SC_USE_UV_MIN_MAX_baseTex==1
#undef SC_USE_UV_MIN_MAX_baseTex
#define SC_USE_UV_MIN_MAX_baseTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_baseTex
#define SC_USE_CLAMP_TO_BORDER_baseTex 0
#elif SC_USE_CLAMP_TO_BORDER_baseTex==1
#undef SC_USE_CLAMP_TO_BORDER_baseTex
#define SC_USE_CLAMP_TO_BORDER_baseTex 1
#endif
#ifndef NOMASK
#define NOMASK 0
#elif NOMASK==1
#undef NOMASK
#define NOMASK 1
#endif
#ifndef SC_USE_UV_TRANSFORM_opacityTex
#define SC_USE_UV_TRANSFORM_opacityTex 0
#elif SC_USE_UV_TRANSFORM_opacityTex==1
#undef SC_USE_UV_TRANSFORM_opacityTex
#define SC_USE_UV_TRANSFORM_opacityTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_opacityTex
#define SC_SOFTWARE_WRAP_MODE_U_opacityTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_opacityTex
#define SC_SOFTWARE_WRAP_MODE_V_opacityTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_opacityTex
#define SC_USE_UV_MIN_MAX_opacityTex 0
#elif SC_USE_UV_MIN_MAX_opacityTex==1
#undef SC_USE_UV_MIN_MAX_opacityTex
#define SC_USE_UV_MIN_MAX_opacityTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_opacityTex
#define SC_USE_CLAMP_TO_BORDER_opacityTex 0
#elif SC_USE_CLAMP_TO_BORDER_opacityTex==1
#undef SC_USE_CLAMP_TO_BORDER_opacityTex
#define SC_USE_CLAMP_TO_BORDER_opacityTex 1
#endif
#ifndef sc_BlendMode_Custom
#define sc_BlendMode_Custom 0
#elif sc_BlendMode_Custom==1
#undef sc_BlendMode_Custom
#define sc_BlendMode_Custom 1
#endif
#ifndef sc_PointLightsCount
#define sc_PointLightsCount 0
#endif
#ifndef sc_DirectionalLightsCount
#define sc_DirectionalLightsCount 0
#endif
#ifndef sc_AmbientLightsCount
#define sc_AmbientLightsCount 0
#endif
struct sc_PointLight_t
{
bool falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
vec3 direction;
vec3 position;
vec4 color;
};
struct sc_DirectionalLight_t
{
vec3 direction;
vec4 color;
};
struct sc_AmbientLight_t
{
vec3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
vec3 color;
float sharpness;
vec3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
vec3 ambientLight;
};
struct sc_Camera_t
{
vec3 position;
float aspect;
vec2 clipPlanes;
};
uniform vec4 sc_EnvmapDiffuseDims;
uniform vec4 sc_EnvmapSpecularDims;
uniform vec4 sc_ScreenTextureDims;
uniform vec4 sc_WindowToViewportTransform;
uniform mat4 sc_ProjectionMatrixArray[sc_NumStereoViews];
uniform float sc_ShadowDensity;
uniform vec4 sc_ShadowColor;
uniform float shaderComplexityValue;
uniform float _sc_framebufferFetchMarker;
uniform float _sc_GetFramebufferColorInvalidUsageMarker;
uniform vec4 intensityTextureDims;
uniform float correctedIntensity;
uniform mat3 intensityTextureTransform;
uniform vec4 intensityTextureUvMinMax;
uniform vec4 intensityTextureBorderColor;
uniform vec4 baseTexDims;
uniform vec4 opacityTexDims;
uniform vec4 baseColor;
uniform mat3 baseTexTransform;
uniform vec4 baseTexUvMinMax;
uniform vec4 baseTexBorderColor;
uniform mat3 opacityTexTransform;
uniform vec4 opacityTexUvMinMax;
uniform vec4 opacityTexBorderColor;
uniform sc_PointLight_t sc_PointLights[(sc_PointLightsCount+1)];
uniform sc_DirectionalLight_t sc_DirectionalLights[(sc_DirectionalLightsCount+1)];
uniform sc_AmbientLight_t sc_AmbientLights[(sc_AmbientLightsCount+1)];
uniform sc_LightEstimationData_t sc_LightEstimationData;
uniform vec4 sc_EnvmapDiffuseSize;
uniform vec4 sc_EnvmapDiffuseView;
uniform vec4 sc_EnvmapSpecularSize;
uniform vec4 sc_EnvmapSpecularView;
uniform vec3 sc_EnvmapRotation;
uniform float sc_EnvmapExposure;
uniform vec3 sc_Sh[9];
uniform float sc_ShIntensity;
uniform vec4 sc_Time;
uniform vec4 sc_UniformConstants;
uniform vec4 sc_GeometryInfo;
uniform mat4 sc_ModelViewProjectionMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ModelViewProjectionMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ViewProjectionMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ViewProjectionMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ModelViewMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ModelViewMatrixInverseArray[sc_NumStereoViews];
uniform mat3 sc_ViewNormalMatrixArray[sc_NumStereoViews];
uniform mat3 sc_ViewNormalMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ProjectionMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ViewMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ViewMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ModelMatrix;
uniform mat4 sc_ModelMatrixInverse;
uniform mat3 sc_NormalMatrix;
uniform mat3 sc_NormalMatrixInverse;
uniform vec3 sc_LocalAabbMin;
uniform vec3 sc_LocalAabbMax;
uniform vec3 sc_WorldAabbMin;
uniform vec3 sc_WorldAabbMax;
uniform sc_Camera_t sc_Camera;
uniform mat4 sc_ProjectorMatrix;
uniform float sc_DisableFrustumCullingMarker;
uniform vec4 sc_BoneMatrices[((sc_SkinBonesCount*3)+1)];
uniform mat3 sc_SkinBonesNormalMatrices[(sc_SkinBonesCount+1)];
uniform vec4 weights0;
uniform vec4 weights1;
uniform vec4 weights2;
uniform vec4 sc_StereoClipPlanes[sc_NumStereoViews];
uniform int sc_FallbackInstanceID;
uniform vec2 sc_TAAJitterOffset;
uniform float strandWidth;
uniform float strandTaper;
uniform vec4 sc_StrandDataMapTextureSize;
uniform float clumpInstanceCount;
uniform float clumpRadius;
uniform float clumpTipScale;
uniform float hairstyleInstanceCount;
uniform float hairstyleNoise;
uniform vec4 sc_ScreenTextureSize;
uniform vec4 sc_ScreenTextureView;
uniform vec4 intensityTextureSize;
uniform vec4 intensityTextureView;
uniform float reflBlurWidth;
uniform float reflBlurMinRough;
uniform float reflBlurMaxRough;
uniform vec4 baseTexSize;
uniform vec4 baseTexView;
uniform vec4 opacityTexSize;
uniform vec4 opacityTexView;
uniform sampler2D baseTex;
uniform sampler2D opacityTex;
uniform sampler2D sc_ScreenTexture;
uniform sampler2D intensityTexture;
varying float varStereoViewID;
varying vec2 varShadowTex;
varying float varClipDistance;
varying float varViewSpaceDepth;
varying vec4 varColor;
varying vec4 varPackedTex;
varying vec3 varPos;
varying vec3 varNormal;
varying vec4 varTangent;
varying vec4 varScreenPos;
varying vec2 varScreenTexturePos;
vec4 sc_SampleTextureBiasOrLevel(vec2 samplerDims,int renderingLayout,int viewIndex,vec2 uv,bool useUvTransform,mat3 uvTransform,ivec2 softwareWrapModes,bool useUvMinMax,vec4 uvMinMax,bool useClampToBorder,vec4 borderColor,float biasOrLevel,sampler2D texture_sampler_)
{
bool l9_0=useClampToBorder;
bool l9_1=useUvMinMax;
bool l9_2=l9_0&&(!l9_1);
float l9_3=uv.x;
int l9_4=softwareWrapModes.x;
float l9_5;
if (l9_4==1)
{
l9_5=fract(l9_3);
}
else
{
float l9_6;
if (l9_4==2)
{
float l9_7=fract(l9_3);
l9_6=mix(l9_7,1.0-l9_7,clamp(step(0.25,fract((l9_3-l9_7)*0.5)),0.0,1.0));
}
else
{
l9_6=l9_3;
}
l9_5=l9_6;
}
uv.x=l9_5;
float l9_8=uv.y;
int l9_9=softwareWrapModes.y;
float l9_10;
if (l9_9==1)
{
l9_10=fract(l9_8);
}
else
{
float l9_11;
if (l9_9==2)
{
float l9_12=fract(l9_8);
l9_11=mix(l9_12,1.0-l9_12,clamp(step(0.25,fract((l9_8-l9_12)*0.5)),0.0,1.0));
}
else
{
l9_11=l9_8;
}
l9_10=l9_11;
}
uv.y=l9_10;
float l9_13;
if (useUvMinMax)
{
bool l9_14=useClampToBorder;
bool l9_15;
if (l9_14)
{
l9_15=softwareWrapModes.x==3;
}
else
{
l9_15=l9_14;
}
float l9_16=uv.x;
float l9_17=uvMinMax.x;
float l9_18=uvMinMax.z;
float l9_19=clamp(l9_16,l9_17,l9_18);
float l9_20=step(abs(l9_16-l9_19),9.9999997e-06);
float l9_21=float(l9_15);
uv.x=l9_19;
bool l9_22=useClampToBorder;
bool l9_23;
if (l9_22)
{
l9_23=softwareWrapModes.y==3;
}
else
{
l9_23=l9_22;
}
float l9_24=uv.y;
float l9_25=clamp(l9_24,uvMinMax.y,uvMinMax.w);
float l9_26=step(abs(l9_24-l9_25),9.9999997e-06);
uv.y=l9_25;
l9_13=(1.0*(l9_20+((1.0-l9_21)*(1.0-l9_20))))*(l9_26+((1.0-float(l9_23))*(1.0-l9_26)));
}
else
{
l9_13=1.0;
}
vec2 l9_27=uv;
mat3 l9_28=uvTransform;
vec2 l9_29;
if (useUvTransform)
{
l9_29=vec2((l9_28*vec3(l9_27,1.0)).xy);
}
else
{
l9_29=l9_27;
}
uv=l9_29;
float l9_30=uv.x;
float l9_31;
float l9_32;
if ((softwareWrapModes.x==0)||(softwareWrapModes.x==3))
{
float l9_33=clamp(l9_30,0.0,1.0);
float l9_34=step(abs(l9_30-l9_33),9.9999997e-06);
l9_32=l9_13*(l9_34+((1.0-float(l9_2))*(1.0-l9_34)));
l9_31=l9_33;
}
else
{
l9_32=l9_13;
l9_31=l9_30;
}
uv.x=l9_31;
float l9_35=uv.y;
float l9_36;
float l9_37;
if ((softwareWrapModes.y==0)||(softwareWrapModes.y==3))
{
float l9_38=clamp(l9_35,0.0,1.0);
float l9_39=step(abs(l9_35-l9_38),9.9999997e-06);
l9_37=l9_32*(l9_39+((1.0-float(l9_2))*(1.0-l9_39)));
l9_36=l9_38;
}
else
{
l9_37=l9_32;
l9_36=l9_35;
}
uv.y=l9_36;
vec2 l9_40=uv;
int l9_41=renderingLayout;
int l9_42=viewIndex;
float l9_43=biasOrLevel;
vec3 l9_44;
if (l9_41==0)
{
l9_44=vec3(l9_40,0.0);
}
else
{
vec3 l9_45;
if (l9_41==1)
{
l9_45=vec3(l9_40.x,(l9_40.y*0.5)+(0.5-(float(l9_42)*0.5)),0.0);
}
else
{
l9_45=vec3(l9_40,0.0);
}
l9_44=l9_45;
}
vec4 l9_46=texture2D(texture_sampler_,l9_44.xy,l9_43);
vec4 l9_47;
if (useClampToBorder)
{
l9_47=mix(borderColor,l9_46,vec4(l9_37));
}
else
{
l9_47=l9_46;
}
return l9_47;
}
vec4 sc_readFragData0_Platform()
{
    return getFragData()[0];
}
float transformSingleColor(float original,float intMap,float target)
{
#if ((BLEND_MODE_REALISTIC||BLEND_MODE_FORGRAY)||BLEND_MODE_NOTBRIGHT)
{
return original/pow(1.0-target,intMap);
}
#else
{
#if (BLEND_MODE_DIVISION)
{
return original/(1.0-target);
}
#else
{
#if (BLEND_MODE_BRIGHT)
{
return original/pow(1.0-target,2.0-(2.0*original));
}
#endif
}
#endif
}
#endif
return 0.0;
}
vec3 transformColor(float yValue,vec3 original,vec3 target,float weight,float intMap)
{
#if (BLEND_MODE_INTENSE)
{
vec3 l9_0=original;
vec4 l9_1;
if (l9_0.y<l9_0.z)
{
l9_1=vec4(l9_0.zy,-1.0,0.66666669);
}
else
{
l9_1=vec4(l9_0.yz,0.0,-0.33333334);
}
vec4 l9_2;
if (l9_0.x<l9_1.x)
{
l9_2=vec4(l9_1.xy,0.0,l9_0.x);
}
else
{
l9_2=vec4(l9_0.x,l9_1.y,0.0,l9_1.x);
}
float l9_3=l9_2.x-((l9_2.x-min(l9_2.w,l9_2.y))*0.5);
float l9_4=6.0*target.x;
return mix(original,((clamp(vec3(abs(l9_4-3.0)-1.0,2.0-abs(l9_4-2.0),2.0-abs(l9_4-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-abs((2.0*l9_3)-1.0))*target.y))+vec3(l9_3),vec3(weight));
}
#else
{
return mix(original,clamp(vec3(transformSingleColor(yValue,intMap,target.x),transformSingleColor(yValue,intMap,target.y),transformSingleColor(yValue,intMap,target.z)),vec3(0.0),vec3(1.0)),vec3(weight));
}
#endif
}
vec3 definedBlend(vec3 a,vec3 b)
{
#if (BLEND_MODE_LIGHTEN)
{
return max(a,b);
}
#else
{
#if (BLEND_MODE_DARKEN)
{
return min(a,b);
}
#else
{
#if (BLEND_MODE_DIVIDE)
{
return b/a;
}
#else
{
#if (BLEND_MODE_AVERAGE)
{
return (a+b)*0.5;
}
#else
{
#if (BLEND_MODE_SUBTRACT)
{
return max((a+b)-vec3(1.0),vec3(0.0));
}
#else
{
#if (BLEND_MODE_DIFFERENCE)
{
return abs(a-b);
}
#else
{
#if (BLEND_MODE_NEGATION)
{
return vec3(1.0)-abs((vec3(1.0)-a)-b);
}
#else
{
#if (BLEND_MODE_EXCLUSION)
{
return (a+b)-((a*2.0)*b);
}
#else
{
#if (BLEND_MODE_OVERLAY)
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
float l9_1;
if (a.y<0.5)
{
l9_1=(2.0*a.y)*b.y;
}
else
{
l9_1=1.0-((2.0*(1.0-a.y))*(1.0-b.y));
}
float l9_2;
if (a.z<0.5)
{
l9_2=(2.0*a.z)*b.z;
}
else
{
l9_2=1.0-((2.0*(1.0-a.z))*(1.0-b.z));
}
return vec3(l9_0,l9_1,l9_2);
}
#else
{
#if (BLEND_MODE_SOFT_LIGHT)
{
return (((vec3(1.0)-(b*2.0))*a)*a)+((a*2.0)*b);
}
#else
{
#if (BLEND_MODE_HARD_LIGHT)
{
float l9_3;
if (b.x<0.5)
{
l9_3=(2.0*b.x)*a.x;
}
else
{
l9_3=1.0-((2.0*(1.0-b.x))*(1.0-a.x));
}
float l9_4;
if (b.y<0.5)
{
l9_4=(2.0*b.y)*a.y;
}
else
{
l9_4=1.0-((2.0*(1.0-b.y))*(1.0-a.y));
}
float l9_5;
if (b.z<0.5)
{
l9_5=(2.0*b.z)*a.z;
}
else
{
l9_5=1.0-((2.0*(1.0-b.z))*(1.0-a.z));
}
return vec3(l9_3,l9_4,l9_5);
}
#else
{
#if (BLEND_MODE_COLOR_DODGE)
{
float l9_6;
if (b.x==1.0)
{
l9_6=b.x;
}
else
{
l9_6=min(a.x/(1.0-b.x),1.0);
}
float l9_7;
if (b.y==1.0)
{
l9_7=b.y;
}
else
{
l9_7=min(a.y/(1.0-b.y),1.0);
}
float l9_8;
if (b.z==1.0)
{
l9_8=b.z;
}
else
{
l9_8=min(a.z/(1.0-b.z),1.0);
}
return vec3(l9_6,l9_7,l9_8);
}
#else
{
#if (BLEND_MODE_COLOR_BURN)
{
float l9_9;
if (b.x==0.0)
{
l9_9=b.x;
}
else
{
l9_9=max(1.0-((1.0-a.x)/b.x),0.0);
}
float l9_10;
if (b.y==0.0)
{
l9_10=b.y;
}
else
{
l9_10=max(1.0-((1.0-a.y)/b.y),0.0);
}
float l9_11;
if (b.z==0.0)
{
l9_11=b.z;
}
else
{
l9_11=max(1.0-((1.0-a.z)/b.z),0.0);
}
return vec3(l9_9,l9_10,l9_11);
}
#else
{
#if (BLEND_MODE_LINEAR_LIGHT)
{
float l9_12;
if (b.x<0.5)
{
l9_12=max((a.x+(2.0*b.x))-1.0,0.0);
}
else
{
l9_12=min(a.x+(2.0*(b.x-0.5)),1.0);
}
float l9_13;
if (b.y<0.5)
{
l9_13=max((a.y+(2.0*b.y))-1.0,0.0);
}
else
{
l9_13=min(a.y+(2.0*(b.y-0.5)),1.0);
}
float l9_14;
if (b.z<0.5)
{
l9_14=max((a.z+(2.0*b.z))-1.0,0.0);
}
else
{
l9_14=min(a.z+(2.0*(b.z-0.5)),1.0);
}
return vec3(l9_12,l9_13,l9_14);
}
#else
{
#if (BLEND_MODE_VIVID_LIGHT)
{
float l9_15;
if (b.x<0.5)
{
float l9_16;
if ((2.0*b.x)==0.0)
{
l9_16=2.0*b.x;
}
else
{
l9_16=max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_15=l9_16;
}
else
{
float l9_17;
if ((2.0*(b.x-0.5))==1.0)
{
l9_17=2.0*(b.x-0.5);
}
else
{
l9_17=min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_15=l9_17;
}
float l9_18;
if (b.y<0.5)
{
float l9_19;
if ((2.0*b.y)==0.0)
{
l9_19=2.0*b.y;
}
else
{
l9_19=max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_18=l9_19;
}
else
{
float l9_20;
if ((2.0*(b.y-0.5))==1.0)
{
l9_20=2.0*(b.y-0.5);
}
else
{
l9_20=min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_18=l9_20;
}
float l9_21;
if (b.z<0.5)
{
float l9_22;
if ((2.0*b.z)==0.0)
{
l9_22=2.0*b.z;
}
else
{
l9_22=max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_21=l9_22;
}
else
{
float l9_23;
if ((2.0*(b.z-0.5))==1.0)
{
l9_23=2.0*(b.z-0.5);
}
else
{
l9_23=min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_21=l9_23;
}
return vec3(l9_15,l9_18,l9_21);
}
#else
{
#if (BLEND_MODE_PIN_LIGHT)
{
float l9_24;
if (b.x<0.5)
{
l9_24=min(a.x,2.0*b.x);
}
else
{
l9_24=max(a.x,2.0*(b.x-0.5));
}
float l9_25;
if (b.y<0.5)
{
l9_25=min(a.y,2.0*b.y);
}
else
{
l9_25=max(a.y,2.0*(b.y-0.5));
}
float l9_26;
if (b.z<0.5)
{
l9_26=min(a.z,2.0*b.z);
}
else
{
l9_26=max(a.z,2.0*(b.z-0.5));
}
return vec3(l9_24,l9_25,l9_26);
}
#else
{
#if (BLEND_MODE_HARD_MIX)
{
float l9_27;
if (b.x<0.5)
{
float l9_28;
if ((2.0*b.x)==0.0)
{
l9_28=2.0*b.x;
}
else
{
l9_28=max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_27=l9_28;
}
else
{
float l9_29;
if ((2.0*(b.x-0.5))==1.0)
{
l9_29=2.0*(b.x-0.5);
}
else
{
l9_29=min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_27=l9_29;
}
bool l9_30=l9_27<0.5;
float l9_31;
if (b.y<0.5)
{
float l9_32;
if ((2.0*b.y)==0.0)
{
l9_32=2.0*b.y;
}
else
{
l9_32=max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_31=l9_32;
}
else
{
float l9_33;
if ((2.0*(b.y-0.5))==1.0)
{
l9_33=2.0*(b.y-0.5);
}
else
{
l9_33=min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_31=l9_33;
}
bool l9_34=l9_31<0.5;
float l9_35;
if (b.z<0.5)
{
float l9_36;
if ((2.0*b.z)==0.0)
{
l9_36=2.0*b.z;
}
else
{
l9_36=max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_35=l9_36;
}
else
{
float l9_37;
if ((2.0*(b.z-0.5))==1.0)
{
l9_37=2.0*(b.z-0.5);
}
else
{
l9_37=min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_35=l9_37;
}
return vec3(l9_30 ? 0.0 : 1.0,l9_34 ? 0.0 : 1.0,(l9_35<0.5) ? 0.0 : 1.0);
}
#else
{
#if (BLEND_MODE_HARD_REFLECT)
{
float l9_38;
if (b.x==1.0)
{
l9_38=b.x;
}
else
{
l9_38=min((a.x*a.x)/(1.0-b.x),1.0);
}
float l9_39;
if (b.y==1.0)
{
l9_39=b.y;
}
else
{
l9_39=min((a.y*a.y)/(1.0-b.y),1.0);
}
float l9_40;
if (b.z==1.0)
{
l9_40=b.z;
}
else
{
l9_40=min((a.z*a.z)/(1.0-b.z),1.0);
}
return vec3(l9_38,l9_39,l9_40);
}
#else
{
#if (BLEND_MODE_HARD_GLOW)
{
float l9_41;
if (a.x==1.0)
{
l9_41=a.x;
}
else
{
l9_41=min((b.x*b.x)/(1.0-a.x),1.0);
}
float l9_42;
if (a.y==1.0)
{
l9_42=a.y;
}
else
{
l9_42=min((b.y*b.y)/(1.0-a.y),1.0);
}
float l9_43;
if (a.z==1.0)
{
l9_43=a.z;
}
else
{
l9_43=min((b.z*b.z)/(1.0-a.z),1.0);
}
return vec3(l9_41,l9_42,l9_43);
}
#else
{
#if (BLEND_MODE_HARD_PHOENIX)
{
return (min(a,b)-max(a,b))+vec3(1.0);
}
#else
{
#if (BLEND_MODE_HUE)
{
vec3 l9_44=a;
vec3 l9_45=b;
vec4 l9_46;
if (l9_44.y<l9_44.z)
{
l9_46=vec4(l9_44.zy,-1.0,0.66666669);
}
else
{
l9_46=vec4(l9_44.yz,0.0,-0.33333334);
}
vec4 l9_47;
if (l9_44.x<l9_46.x)
{
l9_47=vec4(l9_46.xy,0.0,l9_44.x);
}
else
{
l9_47=vec4(l9_44.x,l9_46.y,0.0,l9_46.x);
}
float l9_48=l9_47.x-min(l9_47.w,l9_47.y);
float l9_49=l9_47.x-(l9_48*0.5);
float l9_50=1.0-abs((2.0*l9_49)-1.0);
vec4 l9_51;
if (l9_45.y<l9_45.z)
{
l9_51=vec4(l9_45.zy,-1.0,0.66666669);
}
else
{
l9_51=vec4(l9_45.yz,0.0,-0.33333334);
}
vec4 l9_52;
if (l9_45.x<l9_51.x)
{
l9_52=vec4(l9_51.xyw,l9_45.x);
}
else
{
l9_52=vec4(l9_45.x,l9_51.yzx);
}
float l9_53=6.0*abs(((l9_52.w-l9_52.y)/((6.0*(l9_52.x-min(l9_52.w,l9_52.y)))+1e-07))+l9_52.z);
return ((clamp(vec3(abs(l9_53-3.0)-1.0,2.0-abs(l9_53-2.0),2.0-abs(l9_53-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*(l9_50*(l9_48/(l9_50+1e-07))))+vec3(l9_49);
}
#else
{
#if (BLEND_MODE_SATURATION)
{
vec3 l9_54=a;
vec3 l9_55=b;
vec4 l9_56;
if (l9_54.y<l9_54.z)
{
l9_56=vec4(l9_54.zy,-1.0,0.66666669);
}
else
{
l9_56=vec4(l9_54.yz,0.0,-0.33333334);
}
vec4 l9_57;
if (l9_54.x<l9_56.x)
{
l9_57=vec4(l9_56.xyw,l9_54.x);
}
else
{
l9_57=vec4(l9_54.x,l9_56.yzx);
}
float l9_58=l9_57.x-min(l9_57.w,l9_57.y);
float l9_59=l9_57.x-(l9_58*0.5);
vec4 l9_60;
if (l9_55.y<l9_55.z)
{
l9_60=vec4(l9_55.zy,-1.0,0.66666669);
}
else
{
l9_60=vec4(l9_55.yz,0.0,-0.33333334);
}
vec4 l9_61;
if (l9_55.x<l9_60.x)
{
l9_61=vec4(l9_60.xy,0.0,l9_55.x);
}
else
{
l9_61=vec4(l9_55.x,l9_60.y,0.0,l9_60.x);
}
float l9_62=l9_61.x-min(l9_61.w,l9_61.y);
float l9_63=6.0*abs(((l9_57.w-l9_57.y)/((6.0*l9_58)+1e-07))+l9_57.z);
return ((clamp(vec3(abs(l9_63-3.0)-1.0,2.0-abs(l9_63-2.0),2.0-abs(l9_63-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-abs((2.0*l9_59)-1.0))*(l9_62/((1.0-abs((2.0*(l9_61.x-(l9_62*0.5)))-1.0))+1e-07))))+vec3(l9_59);
}
#else
{
#if (BLEND_MODE_COLOR)
{
vec3 l9_64=a;
vec3 l9_65=b;
vec4 l9_66;
if (l9_65.y<l9_65.z)
{
l9_66=vec4(l9_65.zy,-1.0,0.66666669);
}
else
{
l9_66=vec4(l9_65.yz,0.0,-0.33333334);
}
vec4 l9_67;
if (l9_65.x<l9_66.x)
{
l9_67=vec4(l9_66.xyw,l9_65.x);
}
else
{
l9_67=vec4(l9_65.x,l9_66.yzx);
}
float l9_68=l9_67.x-min(l9_67.w,l9_67.y);
vec4 l9_69;
if (l9_64.y<l9_64.z)
{
l9_69=vec4(l9_64.zy,-1.0,0.66666669);
}
else
{
l9_69=vec4(l9_64.yz,0.0,-0.33333334);
}
vec4 l9_70;
if (l9_64.x<l9_69.x)
{
l9_70=vec4(l9_69.xy,0.0,l9_64.x);
}
else
{
l9_70=vec4(l9_64.x,l9_69.y,0.0,l9_69.x);
}
float l9_71=l9_70.x-((l9_70.x-min(l9_70.w,l9_70.y))*0.5);
float l9_72=6.0*abs(((l9_67.w-l9_67.y)/((6.0*l9_68)+1e-07))+l9_67.z);
return ((clamp(vec3(abs(l9_72-3.0)-1.0,2.0-abs(l9_72-2.0),2.0-abs(l9_72-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-abs((2.0*l9_71)-1.0))*(l9_68/((1.0-abs((2.0*(l9_67.x-(l9_68*0.5)))-1.0))+1e-07))))+vec3(l9_71);
}
#else
{
#if (BLEND_MODE_LUMINOSITY)
{
vec3 l9_73=a;
vec3 l9_74=b;
vec4 l9_75;
if (l9_73.y<l9_73.z)
{
l9_75=vec4(l9_73.zy,-1.0,0.66666669);
}
else
{
l9_75=vec4(l9_73.yz,0.0,-0.33333334);
}
vec4 l9_76;
if (l9_73.x<l9_75.x)
{
l9_76=vec4(l9_75.xyw,l9_73.x);
}
else
{
l9_76=vec4(l9_73.x,l9_75.yzx);
}
float l9_77=l9_76.x-min(l9_76.w,l9_76.y);
vec4 l9_78;
if (l9_74.y<l9_74.z)
{
l9_78=vec4(l9_74.zy,-1.0,0.66666669);
}
else
{
l9_78=vec4(l9_74.yz,0.0,-0.33333334);
}
vec4 l9_79;
if (l9_74.x<l9_78.x)
{
l9_79=vec4(l9_78.xy,0.0,l9_74.x);
}
else
{
l9_79=vec4(l9_74.x,l9_78.y,0.0,l9_78.x);
}
float l9_80=l9_79.x-((l9_79.x-min(l9_79.w,l9_79.y))*0.5);
float l9_81=6.0*abs(((l9_76.w-l9_76.y)/((6.0*l9_77)+1e-07))+l9_76.z);
return ((clamp(vec3(abs(l9_81-3.0)-1.0,2.0-abs(l9_81-2.0),2.0-abs(l9_81-4.0)),vec3(0.0),vec3(1.0))-vec3(0.5))*((1.0-abs((2.0*l9_80)-1.0))*(l9_77/((1.0-abs((2.0*(l9_76.x-(l9_77*0.5)))-1.0))+1e-07))))+vec3(l9_80);
}
#else
{
vec3 l9_82=a;
vec3 l9_83=b;
float l9_84=((0.29899999*l9_82.x)+(0.58700001*l9_82.y))+(0.114*l9_82.z);
int l9_85;
#if (intensityTextureHasSwappedViews)
{
int l9_86;
#if (sc_StereoRenderingMode==0)
{
l9_86=0;
}
#else
{
l9_86=int(varStereoViewID);
}
#endif
l9_85=1-l9_86;
}
#else
{
int l9_87;
#if (sc_StereoRenderingMode==0)
{
l9_87=0;
}
#else
{
l9_87=int(varStereoViewID);
}
#endif
l9_85=l9_87;
}
#endif
vec4 l9_88=sc_SampleTextureBiasOrLevel(intensityTextureDims.xy,intensityTextureLayout,l9_85,vec2(pow(l9_84,1.0/correctedIntensity),0.5),(int(SC_USE_UV_TRANSFORM_intensityTexture)!=0),intensityTextureTransform,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture),(int(SC_USE_UV_MIN_MAX_intensityTexture)!=0),intensityTextureUvMinMax,(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0),intensityTextureBorderColor,0.0,intensityTexture);
float l9_89=((((l9_88.x*256.0)+l9_88.y)+(l9_88.z/256.0))/257.00391)*16.0;
float l9_90;
#if (BLEND_MODE_FORGRAY)
{
l9_90=max(l9_89,1.0);
}
#else
{
l9_90=l9_89;
}
#endif
float l9_91;
#if (BLEND_MODE_NOTBRIGHT)
{
l9_91=min(l9_90,1.0);
}
#else
{
l9_91=l9_90;
}
#endif
return transformColor(l9_84,l9_82,l9_83,1.0,l9_91);
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
void sc_writeFragData0(vec4 col)
{
    sc_FragData0=col;
}
void main()
{
#if ((sc_StereoRenderingMode==1)&&(sc_StereoRendering_IsClipDistanceEnabled==0))
{
if (varClipDistance<0.0)
{
discard;
}
}
#endif
vec4 l9_0;
#if (ENABLE_VERTEX_COLOR_BASE)
{
l9_0=baseColor*varColor;
}
#else
{
l9_0=baseColor;
}
#endif
vec4 l9_1;
#if (!NOTEXTURE)
{
int l9_2;
#if (baseTexHasSwappedViews)
{
int l9_3;
#if (sc_StereoRenderingMode==0)
{
l9_3=0;
}
#else
{
l9_3=int(varStereoViewID);
}
#endif
l9_2=1-l9_3;
}
#else
{
int l9_4;
#if (sc_StereoRenderingMode==0)
{
l9_4=0;
}
#else
{
l9_4=int(varStereoViewID);
}
#endif
l9_2=l9_4;
}
#endif
l9_1=l9_0*sc_SampleTextureBiasOrLevel(baseTexDims.xy,baseTexLayout,l9_2,varPackedTex.xy,(int(SC_USE_UV_TRANSFORM_baseTex)!=0),baseTexTransform,ivec2(SC_SOFTWARE_WRAP_MODE_U_baseTex,SC_SOFTWARE_WRAP_MODE_V_baseTex),(int(SC_USE_UV_MIN_MAX_baseTex)!=0),baseTexUvMinMax,(int(SC_USE_CLAMP_TO_BORDER_baseTex)!=0),baseTexBorderColor,0.0,baseTex);
}
#else
{
l9_1=l9_0;
}
#endif
vec4 l9_5;
#if (!NOMASK)
{
int l9_6;
#if (opacityTexHasSwappedViews)
{
int l9_7;
#if (sc_StereoRenderingMode==0)
{
l9_7=0;
}
#else
{
l9_7=int(varStereoViewID);
}
#endif
l9_6=1-l9_7;
}
#else
{
int l9_8;
#if (sc_StereoRenderingMode==0)
{
l9_8=0;
}
#else
{
l9_8=int(varStereoViewID);
}
#endif
l9_6=l9_8;
}
#endif
vec4 l9_9=l9_1;
l9_9.w=l9_1.w*sc_SampleTextureBiasOrLevel(opacityTexDims.xy,opacityTexLayout,l9_6,varPackedTex.zw,(int(SC_USE_UV_TRANSFORM_opacityTex)!=0),opacityTexTransform,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTex,SC_SOFTWARE_WRAP_MODE_V_opacityTex),(int(SC_USE_UV_MIN_MAX_opacityTex)!=0),opacityTexUvMinMax,(int(SC_USE_CLAMP_TO_BORDER_opacityTex)!=0),opacityTexBorderColor,0.0,opacityTex).x;
l9_5=l9_9;
}
#else
{
l9_5=l9_1;
}
#endif
vec4 l9_10;
#if (sc_BlendMode_Custom)
{
vec4 l9_11;
#if (sc_FramebufferFetch)
{
vec4 l9_12=sc_readFragData0_Platform();
vec4 l9_13;
#if (sc_UseFramebufferFetchMarker)
{
vec4 l9_14=l9_12;
l9_14.x=l9_12.x+_sc_framebufferFetchMarker;
l9_13=l9_14;
}
#else
{
l9_13=l9_12;
}
#endif
l9_11=l9_13;
}
#else
{
vec2 l9_15=(gl_FragCoord.xy*sc_WindowToViewportTransform.xy)+sc_WindowToViewportTransform.zw;
vec2 l9_16;
#if (sc_StereoRenderingMode==1)
{
int l9_17;
#if (sc_StereoRenderingMode==0)
{
l9_17=0;
}
#else
{
l9_17=int(varStereoViewID);
}
#endif
vec3 l9_18=vec3(l9_15,0.0);
l9_18.y=((2.0*l9_15.y)+float(l9_17))-1.0;
l9_16=l9_18.xy;
}
#else
{
l9_16=l9_15;
}
#endif
int l9_19;
#if (sc_ScreenTextureHasSwappedViews)
{
int l9_20;
#if (sc_StereoRenderingMode==0)
{
l9_20=0;
}
#else
{
l9_20=int(varStereoViewID);
}
#endif
l9_19=1-l9_20;
}
#else
{
int l9_21;
#if (sc_StereoRenderingMode==0)
{
l9_21=0;
}
#else
{
l9_21=int(varStereoViewID);
}
#endif
l9_19=l9_21;
}
#endif
vec3 l9_22;
#if (sc_ScreenTextureLayout==0)
{
l9_22=vec3(l9_16,0.0);
}
#else
{
vec3 l9_23;
#if (sc_ScreenTextureLayout==1)
{
l9_23=vec3(l9_16.x,(l9_16.y*0.5)+(0.5-(float(l9_19)*0.5)),0.0);
}
#else
{
l9_23=vec3(l9_16,0.0);
}
#endif
l9_22=l9_23;
}
#endif
l9_11=texture2D(sc_ScreenTexture,l9_22.xy,0.0);
}
#endif
vec4 l9_24;
#if (((sc_IsEditor&&sc_GetFramebufferColorInvalidUsageMarker)&&(!sc_BlendMode_Software))&&(!sc_BlendMode_ColoredGlass))
{
vec4 l9_25=l9_11;
l9_25.x=l9_11.x+_sc_GetFramebufferColorInvalidUsageMarker;
l9_24=l9_25;
}
#else
{
l9_24=l9_11;
}
#endif
vec3 l9_26=mix(l9_24.xyz,definedBlend(l9_24.xyz,l9_5.xyz).xyz,vec3(l9_5.w));
vec4 l9_27=vec4(l9_26.x,l9_26.y,l9_26.z,vec4(0.0).w);
l9_27.w=1.0;
l9_10=l9_27;
}
#else
{
vec4 l9_28;
#if (sc_BlendMode_MultiplyOriginal)
{
vec3 l9_29=mix(vec3(1.0),l9_5.xyz,vec3(l9_5.w));
l9_28=vec4(l9_29.x,l9_29.y,l9_29.z,l9_5.w);
}
#else
{
vec4 l9_30;
#if (sc_BlendMode_Screen)
{
vec3 l9_31=l9_5.xyz*l9_5.w;
l9_30=vec4(l9_31.x,l9_31.y,l9_31.z,l9_5.w);
}
#else
{
vec4 l9_32;
#if (sc_BlendMode_PremultipliedAlpha)
{
vec3 l9_33=l9_5.xyz*l9_5.w;
l9_32=vec4(l9_33.x,l9_33.y,l9_33.z,l9_5.w);
}
#else
{
vec4 l9_34;
#if (sc_BlendMode_PremultipliedAlphaHardware)
{
vec3 l9_35=l9_5.xyz*baseColor.w;
l9_34=vec4(l9_35.x,l9_35.y,l9_35.z,l9_5.w);
}
#else
{
l9_34=l9_5;
}
#endif
l9_32=l9_34;
}
#endif
l9_30=l9_32;
}
#endif
l9_28=l9_30;
}
#endif
l9_10=l9_28;
}
#endif
sc_writeFragData0(l9_10);
}
#endif // #elif defined FRAGMENT_SHADER // #if defined VERTEX_SHADER
