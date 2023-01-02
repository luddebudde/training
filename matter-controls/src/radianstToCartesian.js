
export const radiansToCartesian = (angle, r) => {
    return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle),
    }
}
