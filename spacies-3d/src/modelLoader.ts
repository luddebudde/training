import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js'

export const modelLoader = () => {
  const modelLoader = new GLTFLoader()
  return {
    load: (file: string): Promise<GLTF> =>
      new Promise((resolve, reject) =>
        modelLoader.load(
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
