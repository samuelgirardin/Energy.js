class Heighmap {

    private scene: BABYLON.Scene;
    private energy: Energy; 

    private useTrimeh: boolean; 
    private heighmap: BABYLON.Mesh
    private subdivide: number = 256; 



    constructor(scene: BABYLON.Scene, energy: Energy, useTrimesh: boolean) {

        /**
        *  If usetrimesh = true with use a trimesh and opcode collision
        *  if no than we use normal ODE heighmap in this case be sure add
        *  the heighmap after all object. TODO fix. 
        */ 
        this.scene = scene;
        this.energy = energy;
        this.useTrimeh = useTrimesh;

        var groundTexture: BABYLON.Texture = new BABYLON.Texture("assets/checker.png", this.scene);
        groundTexture.uScale = groundTexture.vScale = 256;

        var groundMaterial = new BABYLON.StandardMaterial("m", this.scene);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.diffuseTexture = groundTexture;

        this.heighmap = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "assets/height1.jpg", 800, 800, this.subdivide, 0, 30, this.scene, false, () => this.mapIsLoaded());

        this.heighmap.material = groundMaterial;
        this.heighmap.receiveShadows = true;

    }

    private mapIsLoaded(): void {

        this.heighmap.isPickable = false;
        this.heighmap.position = new BABYLON.Vector3(0, -2.5, 0);
     //  this.heighmap.rotation.x = 0.35

        if (this.useTrimeh) {
            // density is set 0, object is static
            this.energy.addDynamicTriMesh(this.heighmap, 0);
        } else {
            this.energy.addDynamicHeightmap(this.heighmap, 800, 800, this.subdivide, this.subdivide, 1, 0, 1, 0); 
        }  

    }





}