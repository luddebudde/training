precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uThreshold;
uniform float uSmoothness;

const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float intensity = dot(color.rgb, color.rgb); // squared length

    float lower = (uThreshold - uSmoothness) * (uThreshold - uSmoothness);
    float upper = uThreshold * uThreshold;

    float alpha = smoothstep(lower, upper, intensity);

    if (alpha <= 0.0) {
        discard;
    }

    gl_FragColor = vec4(white.rgb, alpha);
}