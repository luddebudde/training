precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uThreshold;

const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);

    if (dot(color.rgb, color.rgb) < uThreshold * uThreshold) {
        discard;
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
