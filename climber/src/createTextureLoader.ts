import { Texture, TextureLoader } from 'three'

export const createTextureLoader = () => {
  const loader = new TextureLoader()
  return {
    load: (file: string): Promise<Texture> =>
      new Promise((resolve, reject) =>
        loader.load(
          file,
          function (gltf) {
            resolve(gltf)
            // scene.add( gltf.scene );
          },
          undefined,
          function (error) {
            reject(error)
          },
        ),
      ),
  }
}
