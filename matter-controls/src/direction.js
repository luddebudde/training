export const direction = (body) => ({
    x: Math.cos(body.angle),
    y: Math.sin(body.angle),
})