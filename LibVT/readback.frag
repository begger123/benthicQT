//
//  LibVT Virtual Texturing Shaders
//  Based on Sean Barrett's public domain "Sparse Virtual Textures" demo shaders
//
/*	Copyright (c) 2010 A. Julian Mayer
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitationthe rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 
#ifdef GL_ES
	#ifdef GL_OES_standard_derivatives
	   #extension GL_OES_standard_derivatives: require
	#endif
	varying vec2 texcoord;
#else
	#define texcoord gl_TexCoord[0]
#endif
#ifdef GL_ES
uniform highp sampler2D mipcalcTexture;
#else
uniform sampler2D mipcalcTexture;
#endif
uniform float mip_bias;


#if !USE_MIPCALC_TEXTURE && !defined(GL_ES)
#if ANISOTROPY
float mipmapLevel(vec2 uv, float textureSize)
{
	vec2 dx = dFdx(uv * textureSize);
	vec2 dy = dFdy(uv * textureSize);
	float Pmax = max(dot(dx, dx), dot(dy, dy));
	float Pmin = min(dot(dx, dx), dot(dy, dy));

	return 0.5 * log2(Pmax / min(ceil(Pmax/Pmin), max_anisotropy * max_anisotropy)) + mip_bias - prepass_resolution_reduction_shift;
}
#else
float mipmapLevel(vec2 uv, float textureSize)
{
	vec2 dx = dFdx(uv * textureSize);
	vec2 dy = dFdy(uv * textureSize);
	float d = max(dot(dx, dx), dot(dy, dy));

	return 0.5 * log2(d) + mip_bias - prepass_resolution_reduction_shift;
}
#endif
#endif
#ifdef GL_ES
highp vec4 calculatePageRequest(vec2 uv)
#else
vec4 calculatePageRequest(vec2 uv)
#endif
{
#ifdef GL_ES
	highp vec4 result;
#else
    vec4 result;
#endif
#if USE_MIPCALC_TEXTURE
	result = texture2D(mipcalcTexture, texcoord.xy, page_dimension_log2 - prepass_resolution_reduction_shift + mip_bias);

	#if ANISOTROPY
		#error ANISOTROPY not supported in USE_MIPCALC_TEXTURE mode
	#endif
#else

	float mip = max(mipmapLevel(texcoord.xy, virt_tex_dimension), 0.0);
	vec2 page = floor(texcoord.xy * virt_tex_dimension_pages) / 255.0;

#if LONG_MIP_CHAIN
	result.rg = fract(page);
	vec2 pagefloor = floor(page);
	result.b = (pagefloor.y * 64.0 + pagefloor.x * 16.0 + mip) / 255.0; // 2 bit y  2 bit x  4 bit mip
#else
	result.rg = page;
	result.b = mip / 255.0;
#endif

	result.a = 1.0;		// BGRA		mip, x, y, 255
#endif
    return result;
}

void main()
{
	gl_FragColor = calculatePageRequest(texcoord.xy);
}
